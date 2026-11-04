/**
 * Self-hosted Web Push for FurTools — no third-party service.
 *
 * Implements the standard protocol with WebCrypto only, so it runs in the
 * Cloudflare Worker:
 *  - VAPID (RFC 8292): ES256 JWT signed with a P-256 keypair. The keypair is
 *    generated once by the worker itself and stored in D1 (table push_config),
 *    so no dashboard secrets are needed.
 *  - Payload encryption (RFC 8291, "aes128gcm" content encoding): ECDH with
 *    the subscription's p256dh key + the auth secret -> HKDF -> AES-128-GCM.
 *
 * Subscriptions live in D1 (table push_subscriptions). Dead endpoints
 * (HTTP 404/410 from the push service) are removed automatically on send.
 */

export interface VapidKeys {
  /** base64url, 65-byte uncompressed public key (0x04 || x || y) */
  publicKey: string;
  /** ECDSA P-256 private key as JWK (kept only in D1, never sent to clients) */
  privateJwk: JsonWebKey;
}

export interface StoredSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface PushPayload {
  title: string;
  body?: string;
  url?: string;
  icon?: string;
  tag?: string;
}

const te = new TextEncoder();

export function b64urlEncode(data: Uint8Array | ArrayBuffer): string {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64urlDecode(input: string): Uint8Array {
  const s = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = s + "=".repeat((4 - (s.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

async function hmacSha256(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const k = await crypto.subtle.importKey("raw", key as BufferSource, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, data as BufferSource));
}

/** HKDF-Expand (RFC 5869) with SHA-256; extract is a plain HMAC. */
async function hkdfExpand(prk: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const out: Uint8Array[] = [];
  let prev: Uint8Array = new Uint8Array(0);
  let produced = 0;
  let counter = 1;
  while (produced < length) {
    prev = await hmacSha256(prk, concatBytes(prev, info, new Uint8Array([counter])));
    out.push(prev);
    produced += prev.length;
    counter += 1;
  }
  return concatBytes(...out).slice(0, length);
}

/** Import a raw 65-byte uncompressed P-256 point as an ECDH/ECDSA public key. */
async function importRawPublicKey(raw: Uint8Array, algorithm: "ECDH" | "ECDSA"): Promise<CryptoKey> {
  if (raw.length !== 65 || raw[0] !== 0x04) throw new Error("Invalid P-256 public key");
  const jwk: JsonWebKey = {
    kty: "EC",
    crv: "P-256",
    x: b64urlEncode(raw.slice(1, 33)),
    y: b64urlEncode(raw.slice(33, 65)),
  };
  const alg =
    algorithm === "ECDH"
      ? { name: "ECDH", namedCurve: "P-256" }
      : { name: "ECDSA", namedCurve: "P-256" };
  return crypto.subtle.importKey("jwk", jwk, alg, false, []);
}

/* ------------------------------- VAPID ---------------------------------- */

export async function generateVapidKeys(): Promise<VapidKeys> {
  const pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  const privateJwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
  const publicJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  const raw = concatBytes(
    new Uint8Array([0x04]),
    b64urlDecode(publicJwk.x as string),
    b64urlDecode(publicJwk.y as string),
  );
  return { publicKey: b64urlEncode(raw), privateJwk };
}

async function vapidAuthorization(endpoint: string, vapid: VapidKeys, subject: string): Promise<string> {
  const aud = new URL(endpoint).origin;
  const header = b64urlEncode(te.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const claims = b64urlEncode(
    te.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, sub: subject })),
  );
  const signingInput = `${header}.${claims}`;
  const key = await crypto.subtle.importKey(
    "jwk",
    vapid.privateJwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, te.encode(signingInput));
  return `vapid t=${signingInput}.${b64urlEncode(signature)}, k=${vapid.publicKey}`;
}

/* ------------------------- Payload encryption ---------------------------- */

/** RFC 8291 aes128gcm encryption of a payload for one subscription. */
export async function encryptPayload(sub: StoredSubscription, payload: string): Promise<Uint8Array> {
  const receiverPublic = b64urlDecode(sub.p256dh);
  const authSecret = b64urlDecode(sub.auth);
  if (authSecret.length < 16) throw new Error("Invalid auth secret");

  const receiverKey = await importRawPublicKey(receiverPublic, "ECDH");
  const ephemeral = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const ephemeralPublicRaw = new Uint8Array(await crypto.subtle.exportKey("raw", ephemeral.publicKey));
  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits({ name: "ECDH", public: receiverKey }, ephemeral.privateKey, 256),
  );

  const salt = crypto.getRandomValues(new Uint8Array(16));

  // IKM = HKDF(auth_secret as salt, shared secret) expanded with the key info
  const prkKey = await hmacSha256(authSecret, sharedSecret);
  const keyInfo = concatBytes(te.encode("WebPush: info\0"), receiverPublic, ephemeralPublicRaw);
  const ikm = await hkdfExpand(prkKey, keyInfo, 32);

  // CEK / nonce from salt-extracted PRK
  const prk = await hmacSha256(salt, ikm);
  const cek = await hkdfExpand(prk, te.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdfExpand(prk, te.encode("Content-Encoding: nonce\0"), 12);

  // Single record: payload + 0x02 delimiter (final record, no extra padding)
  const plaintext = concatBytes(te.encode(payload), new Uint8Array([0x02]));
  const aesKey = await crypto.subtle.importKey("raw", cek as BufferSource, { name: "AES-GCM" }, false, ["encrypt"]);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce as BufferSource, tagLength: 128 }, aesKey, plaintext as BufferSource),
  );

  const header = new Uint8Array(16 + 4 + 1 + 65);
  header.set(salt, 0);
  const view = new DataView(header.buffer);
  view.setUint32(16, 4096); // record size
  header[20] = 65; // key id length
  header.set(ephemeralPublicRaw, 21);

  return concatBytes(header, ciphertext);
}

/* ------------------------------- Sending --------------------------------- */

export async function sendPush(
  vapid: VapidKeys,
  sub: StoredSubscription,
  payload: PushPayload,
  subject = "mailto:support@furtools.com",
): Promise<{ ok: boolean; status: number; gone: boolean }> {
  const body = await encryptPayload(sub, JSON.stringify(payload));
  const authorization = await vapidAuthorization(sub.endpoint, vapid, subject);
  const res = await fetch(sub.endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/octet-stream",
      "content-encoding": "aes128gcm",
      authorization,
      ttl: "86400",
      urgency: "normal",
    },
    body: body as BodyInit,
  });
  return { ok: res.ok, status: res.status, gone: res.status === 404 || res.status === 410 };
}

/* ------------------------------ D1 storage ------------------------------- */

export async function ensurePushTables(db: any): Promise<void> {
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS push_config (key TEXT PRIMARY KEY, value TEXT NOT NULL)",
    )
    .run();
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS push_subscriptions (endpoint TEXT PRIMARY KEY, p256dh TEXT NOT NULL, auth TEXT NOT NULL, user_agent TEXT, created_at TEXT DEFAULT (datetime('now')), last_seen_at TEXT DEFAULT (datetime('now')))",
    )
    .run();
}

export async function getOrCreateVapid(db: any): Promise<VapidKeys> {
  const row = (await db
    .prepare("SELECT value FROM push_config WHERE key = 'vapid'")
    .first()) as any;
  if (row?.value) {
    try {
      const parsed = JSON.parse(row.value) as VapidKeys;
      if (parsed.publicKey && parsed.privateJwk) return parsed;
    } catch {
      /* fall through and regenerate */
    }
  }
  const keys = await generateVapidKeys();
  await db
    .prepare("INSERT OR IGNORE INTO push_config (key, value) VALUES ('vapid', ?)")
    .bind(JSON.stringify(keys))
    .run();
  const stored = (await db
    .prepare("SELECT value FROM push_config WHERE key = 'vapid'")
    .first()) as any;
  if (stored?.value) return JSON.parse(stored.value) as VapidKeys;
  return keys;
}

export async function saveSubscription(db: any, sub: StoredSubscription, userAgent: string): Promise<void> {
  await db
    .prepare(
      "INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_agent) VALUES (?, ?, ?, ?) ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth, user_agent = excluded.user_agent, last_seen_at = datetime('now')",
    )
    .bind(sub.endpoint, sub.p256dh, sub.auth, userAgent.slice(0, 300))
    .run();
}

export async function removeSubscription(db: any, endpoint: string): Promise<void> {
  await db.prepare("DELETE FROM push_subscriptions WHERE endpoint = ?").bind(endpoint).run();
}

export async function countSubscriptions(db: any): Promise<number> {
  try {
    const r = (await db.prepare("SELECT COUNT(*) AS n FROM push_subscriptions").first()) as any;
    return Number(r?.n ?? 0);
  } catch {
    return 0;
  }
}

export async function listSubscriptions(db: any): Promise<StoredSubscription[]> {
  const { results } = await db
    .prepare("SELECT endpoint, p256dh, auth FROM push_subscriptions")
    .all();
  return (results || []) as StoredSubscription[];
}

/** Send one payload to every stored subscription; prunes dead endpoints. */
export async function sendPushToAll(
  db: any,
  payload: PushPayload,
): Promise<{ total: number; sent: number; removed: number; failed: number }> {
  const vapid = await getOrCreateVapid(db);
  const subs = await listSubscriptions(db);
  let sent = 0;
  let removed = 0;
  let failed = 0;
  const BATCH = 25;
  for (let i = 0; i < subs.length; i += BATCH) {
    const batch = subs.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (sub) => {
        try {
          const r = await sendPush(vapid, sub, payload);
          if (r.ok) sent += 1;
          else if (r.gone) {
            removed += 1;
            await removeSubscription(db, sub.endpoint).catch(() => {});
          } else failed += 1;
        } catch {
          failed += 1;
        }
      }),
    );
  }
  return { total: subs.length, sent, removed, failed };
}
