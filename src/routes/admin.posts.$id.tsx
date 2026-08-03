import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/posts/$id")({
  head: () => ({
    meta: [{ title: "Edit post — FurTools admin" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: EditPostPage,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function EditPostPage() {
  const { id } = useParams({ from: "/admin/posts/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt ?? "");
        setContent(data.content ?? "");
        setCategory(data.category ?? "");
        setCoverImage(data.cover_image ?? "");
        setTags((data.tags ?? []).join(", "));
        setPublished(data.published);
      }
      setLoading(false);
    })();
  }, [id, isNew]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not signed in");
      const payload = {
        title,
        slug: slug || slugify(title),
        excerpt: excerpt || null,
        content,
        category: category || null,
        cover_image: coverImage || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        published,
        published_at: published ? new Date().toISOString() : null,
        author_id: userData.user.id,
      };
      if (isNew) {
        const { data, error } = await supabase.from("blog_posts").insert(payload).select("id").single();
        if (error) throw error;
        toast.success("Post created");
        navigate({ to: "/admin/posts/$id", params: { id: data.id } });
      } else {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
        if (error) throw error;
        toast.success("Saved");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-14">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Admin", to: "/admin" }, { label: isNew ? "New post" : "Edit post" }]} />
      <h1 className="mt-6 font-display text-3xl font-semibold">
        {isNew ? "New post" : "Edit post"}
      </h1>
      <form className="mt-8 space-y-5" onSubmit={save}>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (isNew && !slug) setSlug(slugify(e.target.value));
            }}
            className="mt-1.5"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="cover">Cover image URL</Label>
          <Input id="cover" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="content">Content (HTML)</Label>
          <Textarea
            id="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="mt-1.5 font-mono text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch id="published" checked={published} onCheckedChange={setPublished} />
          <Label htmlFor="published" className="cursor-pointer">
            Published
          </Label>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="rounded-full">
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin" })} className="rounded-full">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
