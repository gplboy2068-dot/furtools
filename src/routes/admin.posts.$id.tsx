import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormattedMarkdown } from "@/components/ui/formatted-markdown";
import { STATIC_BLOG_POSTS, type BlogPostData } from "@/data/blog-posts";
import { toast } from "sonner";
import {
  Image as ImageIcon,
  Upload,
  Eye,
  Edit3,
  Sparkles,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Table as TableIcon,
  Check,
  X,
  ExternalLink,
  Save,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

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

const PRESET_IMAGES = [
  {
    label: "Pet Budget & Finance",
    url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80",
    category: "Finance",
  },
  {
    label: "Emergency & First Aid",
    url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80",
    category: "Health & Safety",
  },
  {
    label: "Veterinary Checkup & Care",
    url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80",
    category: "Veterinary",
  },
  {
    label: "Dog Body Language",
    url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80",
    category: "Behavior",
  },
  {
    label: "Healthy Dog Breed",
    url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
    category: "Breeds",
  },
  {
    label: "Puppy Socialization",
    url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80",
    category: "Training",
  },
  {
    label: "Cat Health & Care",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
    category: "Cats",
  },
  {
    label: "Pet Nutrition & Food",
    url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=80",
    category: "Nutrition",
  },
];

const SUGGESTED_CATEGORIES = [
  "Finance & Planning",
  "Health & Safety",
  "Behavior & Training",
  "Breeds & Genetics",
  "Breeds & Longevity",
  "Nutrition & Diet",
  "Puppy Care & Training",
  "Senior Pets",
  "Small Pets & Exotics",
];

function EditPostPage() {
  const { id } = useParams({ from: "/admin/posts/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // Post states
  const [dbRecordId, setDbRecordId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(true);
  const [isStaticSource, setIsStaticSource] = useState(false);

  // Media Library Dialog
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [mediaList, setMediaList] = useState<{ id: string; filename: string; url: string }[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isNew) return;

    (async () => {
      setLoading(true);

      // 1. Try to find by UUID id
      let found: any = null;
      try {
        const { data } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (data) found = data;
      } catch {
        // ignore
      }

      // 2. If not found by ID, try finding by slug
      if (!found) {
        try {
          const { data } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("slug", id)
            .maybeSingle();
          if (data) found = data;
        } catch {
          // ignore
        }
      }

      if (found) {
        setDbRecordId(found.id);
        setTitle(found.title);
        setSlug(found.slug);
        setExcerpt(found.excerpt ?? "");
        setContent(found.content ?? "");
        setCategory(found.category ?? "");
        setCoverImage(found.cover_image ?? "");
        setTags((found.tags ?? []).join(", "));
        setPublished(found.published);
        setIsStaticSource(false);
      } else if (STATIC_BLOG_POSTS[id]) {
        // Fallback to static post definition
        const sp = STATIC_BLOG_POSTS[id];
        setTitle(sp.title);
        setSlug(sp.slug);
        setExcerpt(sp.excerpt);
        setContent(sp.content);
        setCategory(sp.category);
        setCoverImage(sp.cover_image ?? "");
        setTags(sp.tags.join(", "));
        setPublished(true);
        setIsStaticSource(true);
        setDbRecordId(null);
      } else {
        toast.error("Post not found");
      }

      setLoading(false);
    })();
  }, [id, isNew]);

  // Load media items when dialog opens
  async function loadMediaLibrary() {
    try {
      const { data } = await supabase
        .from("media")
        .select("id,filename,url")
        .order("created_at", { ascending: false })
        .limit(30);
      setMediaList(data ?? []);
    } catch (err) {
      console.warn("Failed to load media list:", err);
    }
  }

  // Handle image upload
  async function handleImageFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    setUploadingImage(true);
    try {
      // Try to upload to Supabase Storage if bucket exists, or convert to data URL
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `blog-${Date.now()}.${fileExt}`;
      const filePath = `blog-covers/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { upsert: true });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("media")
          .getPublicUrl(filePath);
        setCoverImage(publicUrlData.publicUrl);
        toast.success("Feature image uploaded to storage!");
      } else {
        // Fallback to base64 reader if storage bucket isn't configured
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            setCoverImage(result);
            toast.success("Feature image attached!");
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      toast.error("Could not upload image. Please paste an image URL directly.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // Quick formatting buttons for markdown
  function insertMarkdown(prefix: string, suffix: string = "", placeholder: string = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;
    const before = content.substring(0, start);
    const after = content.substring(end);

    const replacement = `${prefix}${selectedText}${suffix}`;
    setContent(`${before}${replacement}${after}`);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length,
      );
    }, 10);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const authorId = userData?.user?.id ?? null;

      const finalSlug = slug || slugify(title);
      const payload = {
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        content,
        category: category || null,
        cover_image: coverImage || null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        published,
        published_at: published ? new Date().toISOString() : null,
        ...(authorId ? { author_id: authorId } : {}),
      };

      if (dbRecordId) {
        // Update existing DB row
        const { error } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", dbRecordId);
        if (error) throw error;
        toast.success("Post updated successfully in database!");
      } else {
        // Check if a row with this slug already exists in DB
        const { data: existingSlugRow } = await supabase
          .from("blog_posts")
          .select("id")
          .eq("slug", finalSlug)
          .maybeSingle();

        if (existingSlugRow?.id) {
          const { error } = await supabase
            .from("blog_posts")
            .update(payload)
            .eq("id", existingSlugRow.id);
          if (error) throw error;
          setDbRecordId(existingSlugRow.id);
          setIsStaticSource(false);
          toast.success("Post saved to database!");
        } else {
          // Insert new post into DB
          const { data, error } = await supabase
            .from("blog_posts")
            .insert(payload)
            .select("id")
            .single();
          if (error) throw error;
          setDbRecordId(data.id);
          setIsStaticSource(false);
          toast.success("Post successfully created and saved in database!");
          navigate({ to: "/admin/posts/$id", params: { id: data.id } });
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted-foreground">
        <RefreshCw className="mx-auto size-8 animate-spin text-primary mb-3" />
        Loading article details…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Breadcrumbs
          items={[
            { label: "Admin", to: "/admin" },
            { label: "Blog", to: "/admin/blog" },
            { label: isNew ? "New Post" : title || "Edit Post" },
          ]}
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/admin/blog" })}
            className="rounded-full gap-1.5"
          >
            <ArrowLeft className="size-4" /> Back to Blog
          </Button>
          {!isNew && slug && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              asChild
              className="rounded-full gap-1.5"
            >
              <Link to="/blog/$slug" params={{ slug }} target="_blank">
                <ExternalLink className="size-4" /> View Live
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            {isNew ? "Create New Article" : "Edit Article"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isStaticSource ? (
              <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                <Sparkles className="size-3.5" /> Built-in static post — saving will register it in the database for dynamic updates.
              </span>
            ) : (
              "Edit content, feature image, metadata, and live preview before publishing."
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-full border border-border">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published" className="text-xs font-semibold cursor-pointer">
              {published ? "Published" : "Draft"}
            </Label>
          </div>
          <Button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-full gap-2 px-6 shadow-sm"
          >
            <Save className="size-4" />
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      <form onSubmit={save} className="mt-8 space-y-8">
        {/* SECTION 1: Featured Image (Cover Image) */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <ImageIcon className="size-4 text-primary" /> Feature Image (Cover Image)
            </Label>
            {coverImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 text-xs h-7 gap-1"
                onClick={() => setCoverImage("")}
              >
                <X className="size-3.5" /> Remove Image
              </Button>
            )}
          </div>

          {/* Visual Preview */}
          {coverImage ? (
            <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden rounded-xl border border-border bg-muted/30 shadow-inner group">
              <img
                src={coverImage}
                alt="Feature preview"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs text-white/90 font-mono truncate">{coverImage}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-center">
              <ImageIcon className="size-10 text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium text-foreground">No feature image selected</p>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                A high-resolution feature image will appear at the top of the article and in blog card listings.
              </p>
            </div>
          )}

          {/* Image Controls: URL, Upload, and Presets */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Paste image URL (https://...)..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="flex-1 bg-background"
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageFileUpload}
              />
              <Button
                type="button"
                variant="outline"
                className="gap-1.5 shrink-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                <Upload className="size-4" />
                {uploadingImage ? "Attaching..." : "Upload File"}
              </Button>

              {/* Media Library Dialog */}
              <Dialog open={mediaDialogOpen} onOpenChange={(open) => {
                setMediaDialogOpen(open);
                if (open) loadMediaLibrary();
              }}>
                <DialogTrigger asChild>
                  <Button type="button" variant="secondary" className="gap-1.5 shrink-0">
                    <ImageIcon className="size-4" /> Media Library
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Select from Media Library</DialogTitle>
                  </DialogHeader>
                  {mediaList.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      No media files found in database. Use presets or upload above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-4">
                      {mediaList.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setCoverImage(m.url);
                            setMediaDialogOpen(false);
                            toast.success("Feature image selected from Media Library");
                          }}
                          className="group relative aspect-video overflow-hidden rounded-lg border border-border hover:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary"
                        >
                          <img src={m.url} alt={m.filename} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-xs text-white">
                            {m.filename}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            {/* Quick Pick Presets */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                <Sparkles className="size-3 text-primary" /> Curated High-Res Pet Presets (1-Click Apply):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setCoverImage(preset.url);
                      toast.success(`Applied preset: ${preset.label}`);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      coverImage === preset.url
                        ? "bg-primary text-primary-foreground border-primary font-medium shadow-xs"
                        : "bg-muted/50 hover:bg-muted border-border text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Title, Slug & Category */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <Label htmlFor="title" className="text-xs font-semibold">
              Article Title *
            </Label>
            <Input
              id="title"
              required
              value={title}
              placeholder="e.g. The True Lifetime Cost of Owning a Pet"
              onChange={(e) => {
                setTitle(e.target.value);
                if (isNew && !slug) setSlug(slugify(e.target.value));
              }}
              className="mt-1.5 text-base font-semibold"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="slug" className="text-xs font-semibold">
                URL Slug (/blog/...) *
              </Label>
              <Input
                id="slug"
                required
                value={slug}
                placeholder="lifetime-pet-budget"
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="mt-1.5 font-mono text-xs"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-xs font-semibold">
                Category
              </Label>
              <Input
                id="category"
                value={category}
                placeholder="Finance & Planning"
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Quick Category Suggestions */}
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">
              Suggested Categories:
            </div>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                    category === cat
                      ? "bg-primary/10 text-primary border-primary/30 font-medium"
                      : "bg-muted/40 hover:bg-muted border-border text-muted-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="excerpt" className="text-xs font-semibold">
                Excerpt (Meta description & summary)
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {excerpt.length} characters
              </span>
            </div>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="A concise, engaging 1-2 sentence overview of the article..."
              className="mt-1.5 leading-relaxed text-sm"
            />
          </div>

          <div>
            <Label htmlFor="tags" className="text-xs font-semibold">
              Tags (comma separated)
            </Label>
            <Input
              id="tags"
              value={tags}
              placeholder="pet budget, pet cost, veterinary economics, dog care"
              onChange={(e) => setTags(e.target.value)}
              className="mt-1.5 text-xs"
            />
            {tags && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">
                      #{t}
                    </Badge>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: Content Editor & Live Preview */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Label className="text-sm font-semibold">Article Content (Markdown)</Label>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "write" | "preview")}
              className="w-auto"
            >
              <TabsList className="h-8">
                <TabsTrigger value="write" className="gap-1.5 text-xs">
                  <Edit3 className="size-3.5" /> Write
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-1.5 text-xs">
                  <Eye className="size-3.5" /> Live Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {activeTab === "write" ? (
            <div className="space-y-2">
              {/* Markdown Toolbar */}
              <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-muted/40 p-1.5">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  title="Heading 2 (##)"
                  onClick={() => insertMarkdown("## ", "\n", "Heading 2")}
                >
                  <Heading2 className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  title="Heading 3 (###)"
                  onClick={() => insertMarkdown("### ", "\n", "Heading 3")}
                >
                  <Heading3 className="size-4" />
                </Button>
                <div className="h-4 w-px bg-border mx-1" />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  title="Bold (**text**)"
                  onClick={() => insertMarkdown("**", "**", "bold text")}
                >
                  <Bold className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  title="Italic (*text*)"
                  onClick={() => insertMarkdown("*", "*", "italic text")}
                >
                  <Italic className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  title="Quote (> quote)"
                  onClick={() => insertMarkdown("> ", "\n", "Quoted text")}
                >
                  <Quote className="size-4" />
                </Button>
                <div className="h-4 w-px bg-border mx-1" />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  title="Bullet List (- item)"
                  onClick={() => insertMarkdown("- ", "\n", "List item")}
                >
                  <List className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  title="Numbered List (1. item)"
                  onClick={() => insertMarkdown("1. ", "\n", "List item")}
                >
                  <ListOrdered className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  title="Link ([text](url))"
                  onClick={() => insertMarkdown("[", "](https://example.com)", "Link text")}
                >
                  <Link2 className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  title="Table"
                  onClick={() =>
                    insertMarkdown(
                      "\n| Column 1 | Column 2 |\n| :--- | :--- |\n| Data 1 | Data 2 |\n\n",
                    )
                  }
                >
                  <TableIcon className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  title="Alert Note"
                  onClick={() => insertMarkdown("> [!NOTE]\n> ", "\n", "Important insight here")}
                >
                  <Sparkles className="size-4 text-primary" />
                </Button>
              </div>

              <Textarea
                ref={textareaRef}
                id="content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                placeholder="Write your article in Markdown..."
                className="font-mono text-sm leading-relaxed"
              />
            </div>
          ) : (
            <div className="min-h-[400px] rounded-xl border border-border bg-background p-6 sm:p-8">
              {coverImage && (
                <div className="mb-6 overflow-hidden rounded-xl border border-border shadow-xs">
                  <img
                    src={coverImage}
                    alt={title}
                    className="aspect-video w-full object-cover"
                  />
                </div>
              )}
              {category && (
                <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                  {category}
                </div>
              )}
              <h1 className="font-display text-3xl font-bold tracking-tight mb-4">
                {title || "Untitled Article"}
              </h1>
              {excerpt && (
                <p className="text-lg text-muted-foreground mb-6 font-normal">
                  {excerpt}
                </p>
              )}
              <hr className="my-6 border-border" />
              <FormattedMarkdown content={content || "*No content written yet.*"} />
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/admin/blog" })}
            className="rounded-full"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="rounded-full gap-2 px-8 shadow-sm"
            >
              <Save className="size-4" />
              {saving ? "Saving…" : "Save Post to Database"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

