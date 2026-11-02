import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { setUserAdmin } from "@/lib/admin-data";

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
        setRows(Array.isArray(json.users) ? json.users : []);
      } else {
        toast.error("Failed to load users");
      }
    } catch {
      toast.error("Failed to load users");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleAdmin(userId: string, isAdmin: boolean) {
    try {
      await setUserAdmin(userId, !isAdmin);
      toast.success(isAdmin ? "Admin removed" : "Admin granted");
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Role update failed");
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
