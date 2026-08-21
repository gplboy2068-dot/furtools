import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ExternalLink, RefreshCw, Sparkles, Image as ImageIcon, Database, Layers, CheckCircle2 } from "lucide-react";
import { STATIC_BLOG_POSTS, type BlogPostData } from "@/data/blog-posts";

interface PostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
  published: boolean;
  isStatic: boolean;
  updated_at: string;
}

export const Route = createFileRoute("/admin/blog")({
  component: BlogAdmin,
});

function BlogAdmin() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<PostItem[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  async function load() {
    setLoading(true);
    let dbPosts: {
      id: string;
      slug: string;
      title: string;
      excerpt: string | null;
      cover_image: string | null;
      category: string | null;
      published: boolean;
      updated_at: string;
    }[] = [];

    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,slug,title,excerpt,cover_image,category,published,updated_at")
        .order("updated_at", { ascending: false });

      if (error) {
        console.warn("Error fetching DB blog posts:", error.message);
      } else if (data) {
        dbPosts = data;
      }
    } catch (err) {
      console.warn("Failed to load blog posts from Supabase:", err);
    }

    const items: PostItem[] = dbPosts.map((p) => ({
      ...p,
      isStatic: false,
    }));

    // Merge static posts if not present in DB
    Object.values(STATIC_BLOG_POSTS).forEach((sp: BlogPostData) => {
      const existsInDb = items.some((p) => p.slug === sp.slug);
      if (!existsInDb) {
        items.push({
          id: sp.slug,
          slug: sp.slug,
          title: sp.title,
          excerpt: sp.excerpt,
          cover_image: sp.cover_image,
          category: sp.category,
          published: true,
          isStatic: true,
          updated_at: sp.published_at,
        });
      }
    });

    setRows(items);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function syncAllStaticToDb() {
    setSyncing(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const authorId = userData?.user?.id ?? null;

      let insertedCount = 0;
      let updatedCount = 0;

      for (const sp of Object.values(STATIC_BLOG_POSTS)) {
        const { data: existing } = await supabase
          .from("blog_posts")
          .select("id")
          .eq("slug", sp.slug)
          .maybeSingle();

        const payload = {
          title: sp.title,
          slug: sp.slug,
          excerpt: sp.excerpt,
          content: sp.content,
          category: sp.category,
          cover_image: sp.cover_image,
          tags: sp.tags,
          published: true,
          published_at: sp.published_at,
          ...(authorId ? { author_id: authorId } : {}),
        };

        if (existing?.id) {
          const { error: updErr } = await supabase
            .from("blog_posts")
            .update(payload)
            .eq("id", existing.id);
          if (!updErr) updatedCount++;
        } else {
          const { error: insErr } = await supabase.from("blog_posts").insert(payload);
          if (!insErr) insertedCount++;
        }
      }

      toast.success(
        `Database synced! ${insertedCount} built-in post(s) created, ${updatedCount} updated in database.`,
      );
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function syncSinglePost(sp: BlogPostData) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const authorId = userData?.user?.id ?? null;

      const payload = {
        title: sp.title,
        slug: sp.slug,
        excerpt: sp.excerpt,
        content: sp.content,
        category: sp.category,
        cover_image: sp.cover_image,
        tags: sp.tags,
        published: true,
        published_at: sp.published_at,
        ...(authorId ? { author_id: authorId } : {}),
      };

      const { data, error } = await supabase
        .from("blog_posts")
        .insert(payload)
        .select("id")
        .single();

      if (error) throw error;
      toast.success(`Post "${sp.title}" is now saved in the database!`);
      navigate({ to: "/admin/posts/$id", params: { id: data.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save to DB failed");
    }
  }

  async function remove(id: string, isStatic: boolean) {
    if (isStatic) {
      toast.info("Built-in post cannot be permanently deleted from code, but you can sync and unpublish it in DB.");
      return;
    }
    if (!confirm("Delete this post from the database?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post deleted from database");
    await load();
  }

  const filtered = rows.filter(
    (r) =>
      r.title.toLowerCase().includes(q.toLowerCase()) ||
      r.slug.toLowerCase().includes(q.toLowerCase()) ||
      (r.category && r.category.toLowerCase().includes(q.toLowerCase())),
  );

  const staticCount = rows.filter((r) => r.isStatic).length;
  const dbCount = rows.filter((r) => !r.isStatic).length;
  const publishedCount = rows.filter((r) => r.published).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog Posts"
        description="Draft, edit, upload feature images, and publish in-depth articles."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {staticCount > 0 && (
              <Button
                variant="outline"
                className="rounded-full gap-2 border-primary/40 hover:bg-primary/5 text-primary"
                onClick={syncAllStaticToDb}
                disabled={syncing}
              >
                <RefreshCw className={`size-4 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : `Sync ${staticCount} Built-in Posts to DB`}
              </Button>
            )}
            <Button
              className="rounded-full gap-1.5"
              onClick={() => navigate({ to: "/admin/posts/$id", params: { id: "new" } })}
            >
              <Plus className="size-4" /> New post
            </Button>
          </div>
        }
      />

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Layers className="size-4 text-primary" /> Total Posts
          </div>
          <div className="mt-2 text-2xl font-bold">{rows.length}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <CheckCircle2 className="size-4 text-emerald-500" /> Published
          </div>
          <div className="mt-2 text-2xl font-bold">{publishedCount}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Database className="size-4 text-blue-500" /> In Database
          </div>
          <div className="mt-2 text-2xl font-bold">{dbCount}</div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-4 text-amber-500" /> Built-in Static
          </div>
          <div className="mt-2 text-2xl font-bold">{staticCount}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Input
          placeholder="Search by title, slug, or category…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-md bg-background"
        />
        <div className="text-xs text-muted-foreground">
          Showing {filtered.length} of {rows.length} articles
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">
            <RefreshCw className="mx-auto size-6 animate-spin text-primary mb-2" />
            Loading blog posts…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No matching posts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 w-16">Image</th>
                  <th className="px-4 py-3">Title & Category</th>
                  <th className="px-4 py-3">Source & Status</th>
                  <th className="px-4 py-3">Last Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/25 transition-colors">
                    <td className="px-4 py-3 align-middle">
                      {r.cover_image ? (
                        <img
                          src={r.cover_image}
                          alt=""
                          className="size-14 rounded-lg object-cover border border-border/80 shadow-xs"
                        />
                      ) : (
                        <div className="flex size-14 items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground">
                          <ImageIcon className="size-5 opacity-50" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="font-semibold text-foreground leading-snug line-clamp-1">
                        {r.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          /blog/{r.slug}
                        </span>
                        {r.category && (
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal">
                            {r.category}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge
                          variant={r.published ? "default" : "secondary"}
                          className="text-[11px]"
                        >
                          {r.published ? "Published" : "Draft"}
                        </Badge>
                        {r.isStatic ? (
                          <Badge
                            variant="secondary"
                            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]"
                          >
                            Built-in (Static)
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px]"
                          >
                            Database Post
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground align-middle">
                      {new Date(r.updated_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right align-middle">
                      <div className="flex justify-end items-center gap-1">
                        <Button
                          asChild
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          title="View on Live Site"
                        >
                          <Link to="/blog/$slug" params={{ slug: r.slug }} target="_blank">
                            <ExternalLink className="size-4 text-muted-foreground hover:text-foreground" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="icon"
                          variant="ghost"
                          className="size-8 text-primary hover:text-primary hover:bg-primary/10"
                          title="Edit Post & Feature Image"
                        >
                          <Link to="/admin/posts/$id" params={{ id: r.id }}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        {r.isStatic ? (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                            title="Save to Database"
                            onClick={() => {
                              const staticData = STATIC_BLOG_POSTS[r.slug];
                              if (staticData) syncSinglePost(staticData);
                            }}
                          >
                            <Database className="size-4" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-destructive hover:bg-destructive/10"
                            title="Delete from Database"
                            onClick={() => remove(r.id, r.isStatic)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
