import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/admin-users")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
          const isServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

          if (!supabaseUrl || !serviceKey) {
            return json({ users: [], error: "Supabase environment variables not configured." }, 200);
          }

          const supa = createClient(supabaseUrl, serviceKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          });

          const userMap = new Map<string, {
            id: string;
            email: string | null;
            display_name: string | null;
            avatar_url: string | null;
            created_at: string;
            roles: string[];
            provider?: string;
          }>();

          // 1. Fetch from Supabase Auth admin API if service role key is present
          if (isServiceRole) {
            try {
              const { data: authData, error: authErr } = await supa.auth.admin.listUsers();
              if (!authErr && authData?.users) {
                for (const u of authData.users) {
                  const meta = u.user_metadata || {};
                  const identities = u.identities || [];
                  const provider = identities[0]?.provider || u.app_metadata?.provider || (u.email ? "email" : "google");

                  userMap.set(u.id, {
                    id: u.id,
                    email: u.email || null,
                    display_name: meta.display_name || meta.full_name || meta.name || (u.email ? u.email.split("@")[0] : "User"),
                    avatar_url: meta.avatar_url || meta.picture || null,
                    created_at: u.created_at || new Date().toISOString(),
                    roles: [],
                    provider,
                  });
                }
              }
            } catch (err) {
              console.error("Admin listUsers error:", err);
            }
          }

          // 2. Fetch from profiles table
          try {
            const { data: profiles } = await supa.from("profiles").select("id, display_name, avatar_url, created_at, email");
            if (profiles) {
              for (const p of profiles) {
                const existing = userMap.get(p.id);
                userMap.set(p.id, {
                  id: p.id,
                  email: p.email || existing?.email || null,
                  display_name: p.display_name || existing?.display_name || "User",
                  avatar_url: p.avatar_url || existing?.avatar_url || null,
                  created_at: p.created_at || existing?.created_at || new Date().toISOString(),
                  roles: existing?.roles || [],
                  provider: existing?.provider || "custom",
                });
              }
            }
          } catch {
            /* ignore profiles error */
          }

          // 3. Fetch user_roles table
          try {
            const { data: roles } = await supa.from("user_roles").select("user_id, role");
            if (roles) {
              for (const r of roles) {
                const user = userMap.get(r.user_id);
                if (user) {
                  if (!user.roles.includes(r.role)) {
                    user.roles.push(r.role);
                  }
                } else {
                  userMap.set(r.user_id, {
                    id: r.user_id,
                    email: null,
                    display_name: `User ${r.user_id.slice(0, 6)}`,
                    avatar_url: null,
                    created_at: new Date().toISOString(),
                    roles: [r.role],
                  });
                }
              }
            }
          } catch {
            /* ignore roles error */
          }

          return json({ users: Array.from(userMap.values()) });
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
