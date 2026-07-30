import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  updated_at: string;
}

export const Route = createFileRoute("/admin/blog")({
  component: BlogAdmin,
});

function BlogAdmin() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Post[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id,slug,title,published,updated_at")
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    await load();
  }

  const filtered = rows.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Draft, edit, and publish blog posts."
        actions={
          <Button className="rounded-full" onClick={() => navigate({ to: "/admin/posts/$id", params: { id: "new" } })}>
            <Plus className="size-4" /> New post
          </Button>
        }
      />

      <div className="mb-4">
        <Input placeholder="Search posts…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No posts.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-muted-foreground">/blog/{r.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={r.published ? "default" : "secondary"}>
                      {r.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(r.updated_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {r.published ? (
                        <Button asChild size="icon" variant="ghost" aria-label="View">
                          <Link to="/blog/$slug" params={{ slug: r.slug }} target="_blank">
                            <ExternalLink className="size-4" />
                          </Link>
                        </Button>
                      ) : null}
                      <Button asChild size="icon" variant="ghost" aria-label="Edit">
                        <Link to="/admin/posts/$id" params={{ id: r.id }}><Pencil className="size-4" /></Link>
                      </Button>
                      <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(r.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
