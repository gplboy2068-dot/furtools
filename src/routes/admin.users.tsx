import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertTriangle, Copy, Check, RefreshCw, Code2 } from "lucide-react";
import { getCustomSession, googleIdToUuid, syncGoogleUserToDatabase } from "@/lib/custom-google-auth";

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

const TRIGGER_SQL = `-- Run this in your Supabase SQL Editor to sync ALL past & future registered users:

-- 1. Create profiles table if missing
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safely add email column if profiles table already existed without it
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon, authenticated, service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles full access" ON public.profiles;
CREATE POLICY "Profiles full access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- 2. Create RPC function to fetch all registered auth users directly
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ,
  roles TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, auth
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email::text,
    COALESCE(p.display_name, u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1))::text AS display_name,
    COALESCE(p.avatar_url, u.raw_user_meta_data->>'avatar_url')::text AS avatar_url,
    u.created_at,
    ARRAY(
      SELECT ur.role::text 
      FROM public.user_roles ur 
      WHERE ur.user_id = u.id
    ) AS roles
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  ORDER BY u.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_users() TO anon, authenticated, service_role;

-- 3. Auto-trigger for all new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), NEW.email)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Backfill all existing registered auth.users into profiles
INSERT INTO public.profiles (id, display_name, email)
SELECT id, COALESCE(raw_user_meta_data->>'display_name', split_part(email, '@', 1)), email
FROM auth.users
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;`;

function UsersAdmin() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSql, setShowSql] = useState(false);

  async function load() {
    setLoading(true);

    // 1. Try RPC function get_admin_users first
    const { data: rpcUsers, error: rpcError } = await (supabase as unknown as { rpc: (name: string) => Promise<{ data: unknown; error: unknown }> }).rpc("get_admin_users");

    if (!rpcError && Array.isArray(rpcUsers) && rpcUsers.length > 0) {
      setRows(
        rpcUsers.map((u: Record<string, unknown>) => ({
          id: String(u.id),
          email: typeof u.email === "string" ? u.email : null,
          display_name: typeof u.display_name === "string" ? u.display_name : null,
          avatar_url: typeof u.avatar_url === "string" ? u.avatar_url : null,
          created_at: String(u.created_at || new Date().toISOString()),
          roles: Array.isArray(u.roles) ? u.roles.map(String) : [],
        }))
      );
      setLoading(false);
      return;
    }

    // 2. Fallback to profiles + user_roles tables
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id,display_name,avatar_url,created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id,role"),
    ]);

    const rolesByUser: Record<string, string[]> = {};
    (roles ?? []).forEach((r) => {
      rolesByUser[r.user_id] = rolesByUser[r.user_id] ?? [];
      rolesByUser[r.user_id].push(r.role);
    });

    const userMap = new Map<string, UserRow>();

    ((profiles ?? []) as Array<Record<string, unknown>>).forEach((p) => {
      const id = String(p.id);
      userMap.set(id, {
        id,
        email: typeof p.email === "string" ? p.email : null,
        display_name: typeof p.display_name === "string" ? p.display_name : null,
        avatar_url: typeof p.avatar_url === "string" ? p.avatar_url : null,
        created_at: String(p.created_at || new Date().toISOString()),
        roles: rolesByUser[id] ?? [],
      });
    });

    // Merge any user_roles missing from profiles
    (roles ?? []).forEach((r) => {
      if (!userMap.has(r.user_id)) {
        userMap.set(r.user_id, {
          id: r.user_id,
          email: null,
          display_name: `User ${r.user_id.slice(0, 6)}`,
          avatar_url: null,
          created_at: new Date().toISOString(),
          roles: rolesByUser[r.user_id] ?? [],
        });
      }
    });

    // Merge active custom Google session user if present
    const customSession = getCustomSession();
    if (customSession) {
      syncGoogleUserToDatabase(customSession.user);
      const customUuid = googleIdToUuid(customSession.user.googleId || customSession.user.email);
      if (!userMap.has(customUuid)) {
        userMap.set(customUuid, {
          id: customUuid,
          email: customSession.user.email,
          display_name: customSession.user.name,
          avatar_url: customSession.user.picture,
          created_at: new Date().toISOString(),
          roles: rolesByUser[customUuid] ?? ["user"],
        });
      }
    }

    setRows(Array.from(userMap.values()));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function handleCopySql() {
    navigator.clipboard.writeText(TRIGGER_SQL);
    setCopiedSql(true);
    toast.success("SQL script copied to clipboard!");
    setTimeout(() => setCopiedSql(false), 2500);
  }

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

  const isSqlVisible = showSql || (!loading && rows.length === 0);

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Registered users and their roles. Toggle admin access here."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSql(!showSql)}
              className="gap-1.5"
            >
              <Code2 className="h-3.5 w-3.5" />
              {showSql ? "Hide SQL Guide" : "Database Sync SQL"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={load}
              disabled={loading}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh List
            </Button>
          </div>
        }
      />

      {isSqlVisible && (
        <Card className="mb-6 border-amber-500/40 bg-amber-500/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <CardTitle className="text-base font-semibold">Automatic Registered User Sync</CardTitle>
              </div>
              <Button size="sm" variant="secondary" onClick={handleCopySql} className="gap-1 text-xs">
                {copiedSql ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedSql ? "Copied" : "Copy SQL Script"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Supabase stores user accounts in the protected <code className="font-mono text-xs text-foreground">auth.users</code> table. Run this migration script in your Supabase SQL Editor to enable direct user querying and automatic profile sync for all registered users:
            </p>
            <div className="relative rounded-md bg-muted p-3 font-mono text-xs overflow-x-auto">
              <pre className="text-foreground">{TRIGGER_SQL}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">Loading users…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            No registered users visible yet. Please run the SQL script above in your Supabase SQL Editor to make all registered auth users visible here.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
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
                          <img src={r.avatar_url} alt="" className="size-8 rounded-full object-cover" />
                        ) : (
                          <div className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {(r.display_name || r.email || "?").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{r.display_name ?? "User"}</div>
                          <div className="text-xs text-muted-foreground font-mono">{r.id.slice(0, 8)}…</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.email ?? "—"}</td>
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
