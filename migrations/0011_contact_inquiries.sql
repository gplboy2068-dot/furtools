-- Contact form inquiries (D1-backed inbox).
-- The /contact form submits via POST /api/contact and the admin panel reads
-- and manages messages via /api/admin/inquiries (see src/server.ts). The
-- table is also created lazily by the worker (CREATE TABLE IF NOT EXISTS),
-- so this migration documents the schema of record.
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General Question',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  page_url TEXT,
  user_agent TEXT,
  admin_notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
