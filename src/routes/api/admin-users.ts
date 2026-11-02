import { createFileRoute } from "@tanstack/react-router";
import { getD1 } from "@/lib/cloudflare-context";

// Admin user list — now served from D1 (`users` + `user_roles`), the same
// store the D1 auth endpoints (/api/auth/d1/*) write to.
export const Route = createFileRoute("/api/admin-users")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const db = getD1();
          if (!db) {
            return json({ users: [], error: "Database not available." }, 200);
          }

          let users: any[] = [];
          try {
            const { results } = await db
              .prepare("SELECT id, email, display_name, avatar_url, google_id, created_at FROM users ORDER BY created_at DESC")
              .all();
            users = results || [];
          } catch {
            // users table is created lazily by the first D1 auth call
            return json({ users: [] });
          }

          const rolesByUser = new Map<string, string[]>();
          try {
            const { results } = await db.prepare("SELECT user_id, role FROM user_roles").all();
            for (const r of results || []) {
              const list = rolesByUser.get(r.user_id as string) || [];
              if (!list.includes(r.role as string)) list.push(r.role as string);
              rolesByUser.set(r.user_id as string, list);
            }
          } catch { /* roles table may not exist yet */ }

          return json({
            users: users.map((u) => ({
              id: u.id,
              email: u.email || null,
              display_name: u.display_name || (u.email ? String(u.email).split("@")[0] : "User"),
              avatar_url: u.avatar_url || null,
              created_at: u.created_at || new Date().toISOString(),
              roles: rolesByUser.get(u.id) || [],
              provider: u.google_id ? "google" : "email",
            })),
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return json({ users: [], error: msg }, 500);
        }
      },
    },
  },
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
