-- Self-hosted Web Push (see src/lib/web-push.ts).
-- The worker also creates these tables with CREATE TABLE IF NOT EXISTS on
-- first use, so this migration is documentation/parity with 0009.
-- push_config holds the VAPID keypair under key 'vapid' (JSON) — server-side
-- only, never exposed by any public endpoint.
CREATE TABLE IF NOT EXISTS push_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint TEXT PRIMARY KEY,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_seen_at TEXT DEFAULT (datetime('now'))
);
