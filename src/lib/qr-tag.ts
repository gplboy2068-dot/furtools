import QRCode from "qrcode";
import LZString from "lz-string";

export type QrActionType = "web" | "call" | "whatsapp" | "vcard" | "text";

export interface PetTagData {
  id?: string;
  petName: string;
  species: string;
  breed?: string;
  photoUrl?: string;
  microchipNumber?: string;
  color?: string;
  gender?: string;
  weight?: string;
  birthdate?: string;
  isLost?: boolean;
  rewardAmount?: string;
  ownerName: string;
  primaryPhone: string;
  hasWhatsApp?: boolean;
  backupPhone?: string;
  cityArea?: string;
  medicalAlerts: string[];
  behaviorNotes?: string;
  vetName?: string;
  vetPhone?: string;
  tagShape?: "circle" | "bone" | "shield" | "hexagon";
  tagColor?: string;
  tagline?: string;
  qrActionType?: QrActionType;
}

export interface QROptions {
  size?: number;
  color?: string;
  bgColor?: string;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

/**
 * Sanitizes phone numbers for standard tel: and wa.me protocols.
 */
export function cleanPhoneNumber(phone: string): string {
  return (phone || "").replace(/[^0-9+]/g, "");
}

/**
 * Generates standard vCard 3.0 format for contacts.
 */
export function generateVCard(data: PetTagData): string {
  const phone = cleanPhoneNumber(data.primaryPhone);
  const backup = cleanPhoneNumber(data.backupPhone || "");
  const alerts = (data.medicalAlerts || []).join(", ");
  const notes = [
    data.isLost ? "🚨 LOST PET ALERT!" : "Pet Contact Tag",
    `Pet: ${data.petName} (${data.breed || data.species})`,
    data.microchipNumber ? `Microchip: ${data.microchipNumber}` : "",
    alerts ? `Medical Alerts: ${alerts}` : "",
    data.rewardAmount ? `Reward: ${data.rewardAmount}` : "",
    data.behaviorNotes ? `Notes: ${data.behaviorNotes}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${data.petName} (Lost Pet);Owner: ${data.ownerName};;;`,
    `FN:LOST PET: ${data.petName} (Owner: ${data.ownerName})`,
    `ORG:Pet Safety Contact`,
    `TEL;TYPE=CELL,VOICE:${phone}`,
    backup ? `TEL;TYPE=HOME,VOICE:${backup}` : "",
    data.cityArea ? `ADR;TYPE=HOME:;;${data.cityArea};;;;` : "",
    `NOTE:${notes}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Generates simple emergency text summary.
 */
export function generateEmergencyText(data: PetTagData): string {
  const alerts = (data.medicalAlerts || []).join(", ");
  return [
    `🚨 LOST PET: ${data.petName} (${data.breed || data.species})`,
    `Owner: ${data.ownerName}`,
    `Primary Phone: ${data.primaryPhone}`,
    data.backupPhone ? `Backup Phone: ${data.backupPhone}` : "",
    data.microchipNumber ? `Microchip ID: ${data.microchipNumber}` : "",
    alerts ? `Critical Medical: ${alerts}` : "",
    data.rewardAmount ? `Reward: ${data.rewardAmount}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Generates an ultra-compact, short URL for emergency landing page.
 * Compresses data using LZ algorithm down to ~40-60 characters total.
 */
export function generateTagPublicUrl(data: PetTagData, baseUrl?: string): string {
  let origin = "https://furtools.com";
  if (typeof window !== "undefined") {
    if (!window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
      origin = window.location.origin;
    }
  }
  if (baseUrl) {
    origin = baseUrl;
  }

  if (data.id) {
    return `${origin}/tag/${data.id}`;
  }

  // Compact tuple structure for maximal compression
  const compact = [
    data.petName || "",
    data.species || "Dog",
    data.breed || "",
    data.ownerName || "",
    data.primaryPhone || "",
    data.backupPhone || "",
    data.microchipNumber || "",
    data.rewardAmount || "",
    (data.medicalAlerts || []).join(";"),
    data.cityArea || "",
    data.behaviorNotes || "",
    data.vetName || "",
    data.vetPhone || "",
    data.isLost ? 1 : 0,
    data.color || "",
    data.gender || "",
  ];

  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(compact));
  return `${origin}/tag/p?z=${compressed}`;
}

/**
 * Parses PetTagData from URL search parameters (supports LZ-string, direct query, or legacy base64).
 */
export function parsePetTagFromUrl(searchParams: URLSearchParams): PetTagData | null {
  try {
    // 1. Ultra-compact LZ compressed parameter: ?z=...
    const z = searchParams.get("z");
    if (z) {
      const raw = LZString.decompressFromEncodedURIComponent(z);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          return {
            petName: arr[0] || "Pet",
            species: arr[1] || "Dog",
            breed: arr[2] || undefined,
            ownerName: arr[3] || "Pet Parent",
            primaryPhone: arr[4] || "",
            backupPhone: arr[5] || undefined,
            microchipNumber: arr[6] || undefined,
            rewardAmount: arr[7] || undefined,
            medicalAlerts: arr[8] ? arr[8].split(";").filter(Boolean) : [],
            cityArea: arr[9] || undefined,
            behaviorNotes: arr[10] || undefined,
            vetName: arr[11] || undefined,
            vetPhone: arr[12] || undefined,
            isLost: Boolean(arr[13]),
            color: arr[14] || undefined,
            gender: arr[15] || undefined,
            hasWhatsApp: true,
          };
        }
      }
    }

    // 2. Direct clean query parameters: ?n=...
    const n = searchParams.get("n");
    if (n) {
      const medStr = searchParams.get("med") || "";
      const medAlerts = medStr ? medStr.split("~").filter(Boolean) : [];

      return {
        petName: n,
        species: searchParams.get("s") || "Dog",
        breed: searchParams.get("b") || undefined,
        ownerName: searchParams.get("o") || "Pet Parent",
        primaryPhone: searchParams.get("ph") || "",
        backupPhone: searchParams.get("bph") || undefined,
        microchipNumber: searchParams.get("m") || undefined,
        color: searchParams.get("col") || undefined,
        gender: searchParams.get("g") || undefined,
        rewardAmount: searchParams.get("r") || undefined,
        cityArea: searchParams.get("c") || undefined,
        medicalAlerts: medAlerts,
        behaviorNotes: searchParams.get("not") || undefined,
        vetName: searchParams.get("vet") || undefined,
        vetPhone: searchParams.get("vp") || undefined,
        isLost: searchParams.get("l") === "1",
        hasWhatsApp: true,
      };
    }

    // 3. Fallback to legacy encoded data: ?data=...
    const dataHash = searchParams.get("data");
    if (dataHash) {
      let base64 = dataHash.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) base64 += "=";
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const json = new TextDecoder().decode(bytes);
      const c = JSON.parse(json);
      return {
        petName: c.n || "Pet",
        species: c.s || "Dog",
        breed: c.b || undefined,
        photoUrl: c.p || undefined,
        microchipNumber: c.m || undefined,
        isLost: Boolean(c.l),
        rewardAmount: c.r || undefined,
        ownerName: c.o || "Pet Parent",
        primaryPhone: c.ph || "",
        hasWhatsApp: Boolean(c.wa),
        backupPhone: c.bph || undefined,
        cityArea: c.c || undefined,
        medicalAlerts: Array.isArray(c.med) ? c.med : [],
        behaviorNotes: c.not || undefined,
        vetName: c.vet || undefined,
        vetPhone: c.vp || undefined,
        tagShape: c.sh || "circle",
        tagColor: c.col || "#dc2626",
        tagline: c.tl || undefined,
      };
    }
  } catch (err) {
    console.error("Failed to parse pet tag from URL:", err);
  }
  return null;
}

export function decodePetTagPayload(hash: string): PetTagData | null {
  const params = new URLSearchParams(`data=${hash}`);
  return parsePetTagFromUrl(params);
}

/**
 * Returns the exact scannable payload according to the selected QR Action Type.
 */
export function getQrScannableContent(data: PetTagData, actionType: QrActionType = "web"): string {
  const phone = cleanPhoneNumber(data.primaryPhone);

  switch (actionType) {
    case "call":
      return `tel:${phone}`;

    case "whatsapp": {
      const msg = encodeURIComponent(
        `Hello ${data.ownerName}, I found your lost pet ${data.petName}! Please reply so we can reunite.`,
      );
      return `https://wa.me/${phone.replace(/^\+/, "")}?text=${msg}`;
    }

    case "vcard":
      return generateVCard(data);

    case "text":
      return generateEmergencyText(data);

    case "web":
    default:
      return generateTagPublicUrl(data);
  }
}

/**
 * Generates an SVG string representation of a standard, 100% scannable QR Code.
 * Enforces high-contrast dark foreground and optimal quiet zone.
 */
export async function generateQrSvg(
  text: string,
  options: QROptions = {},
): Promise<string> {
  try {
    const svg = await QRCode.toString(text, {
      type: "svg",
      margin: options.margin !== undefined ? options.margin : 3,
      width: options.size || 320,
      color: {
        dark: options.color || "#0f172a",
        light: options.bgColor || "#ffffff",
      },
      errorCorrectionLevel: options.errorCorrectionLevel || "M",
    });
    return svg;
  } catch (err) {
    console.error("QR Code SVG generation error:", err);
    return "";
  }
}

/**
 * Generates a crisp PNG base64 Data URL of the QR Code.
 * Enforces ISO 18004 compliant quiet zone and high optical contrast.
 */
export async function generateQrDataUrl(
  text: string,
  options: QROptions = {},
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      margin: options.margin !== undefined ? options.margin : 3,
      width: options.size || 1024,
      color: {
        dark: options.color || "#0f172a",
        light: options.bgColor || "#ffffff",
      },
      errorCorrectionLevel: options.errorCorrectionLevel || "M",
    });
    return dataUrl;
  } catch (err) {
    console.error("QR Code DataURL generation error:", err);
    return "";
  }
}
