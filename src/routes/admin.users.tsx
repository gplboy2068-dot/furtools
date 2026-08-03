import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserRow {
  id: string;
  email?: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: string[];
}

export const Route = createFileRoute("/admin/users")({
  component: UsersAdmin,
});

function UsersAdmin() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin-users");
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.users) && json.users.length > 0) {
          setRows(json.users);
          setLoading(false);
          return;
        }
      }
    } catch {
      /* fallback to client-side supabase query */
    }

    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id,display_name,avatar_url,created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    const rolesByUser: Record<string, string[]> = {};
    (roles ?? []).forEach((r) => {
      rolesByUser[r.user_id] = rolesByUser[r.user_id] ?? [];
      rolesByUser[r.user_id].push(r.role);
    });
    setRows(
      (profiles ?? []).map((p) => ({
        id: p.id,
        display_name: p.display_name,
        avatar_url: p.avatar_url,
        created_at: p.created_at,
        roles: rolesByUser[p.id] ?? [],
      })),
    );
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleAdmin(userId: string, isAdmin: boolean) {
    if (isAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success("Admin removed");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success("Admin granted");
    }
    await load();
  }

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Registered users and their roles. Toggle admin access here."
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No users yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Roles</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isAdmin = r.roles.includes("admin");
                return (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {r.avatar_url ? (
                          <img src={r.avatar_url} alt="" className="size-8 rounded-full" />
                        ) : (
                          <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground uppercase">
                            {(r.display_name || r.email || "U")[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{r.display_name ?? "—"}</div>
                          <div className="text-xs text-muted-foreground">{r.email ?? `${r.id.slice(0, 8)}…`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {r.roles.length === 0 ? <Badge variant="secondary">user</Badge> : r.roles.map((role) => (
                          <Badge key={role} variant={role === "admin" ? "default" : "secondary"}>{role}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => toggleAdmin(r.id, isAdmin)}>
                        {isAdmin ? "Revoke admin" : "Grant admin"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
