import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminShell, AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getAuthor,
  saveCustomAuthor,
  DEFAULT_AUTHOR,
  type Author,
} from "@/data/authors";
import { STATIC_BLOG_POSTS } from "@/data/blog-posts";
import {
  Pencil,
  ExternalLink,
  ShieldCheck,
  Globe,
  CheckCircle2,
  FileText,
  UserCheck,
} from "lucide-react";

export const Route = createFileRoute("/admin/authors")({
  component: AdminAuthorsPage,
});

function AdminAuthorsPage() {
  const [author, setAuthor] = useState<Author>(DEFAULT_AUTHOR);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Author>(DEFAULT_AUTHOR);
  const [bioText, setBioText] = useState("");
  const [tagsText, setTagsText] = useState("");

  useEffect(() => {
    const current = getAuthor("firoz-khan");
    setAuthor(current);
    setFormData(current);
    setBioText(current.bio.join("\n\n"));
    setTagsText(current.areasOfInterest.join(", "));
  }, []);

  function handleOpenEdit() {
    setFormData(author);
    setBioText(author.bio.join("\n\n"));
    setTagsText(author.areasOfInterest.join(", "));
    setIsEditing(true);
  }

  function handleSave() {
    const updatedBio = bioText
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const updatedTags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updated: Author = {
      ...formData,
      bio: updatedBio.length > 0 ? updatedBio : formData.bio,
      areasOfInterest: updatedTags.length > 0 ? updatedTags : formData.areasOfInterest,
    };

    saveCustomAuthor(updated);
    setAuthor(updated);
    setIsEditing(false);
    toast.success("Author profile updated successfully!");
  }

  const postCount = Object.keys(STATIC_BLOG_POSTS).length;

  return (
    <AdminShell>
      <AdminPageHeader
        title="Author & Profile Management"
        description="Configure real author profiles, E-E-A-T transparency credentials, and attribution links."
        actions={
          <div className="flex gap-2">
            <Link
              to="/author/$slug"
              params={{ slug: author.slug }}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <span>View Public Profile</span>
              <ExternalLink className="size-3.5" />
            </Link>
            <Button onClick={handleOpenEdit} size="sm" className="gap-1.5">
              <Pencil className="size-3.5" />
              <span>Edit Profile</span>
            </Button>
          </div>
        }
      />

      {/* E-E-A-T Policy Notice */}
      <div className="mb-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
          <ShieldCheck className="size-4" />
          <span>Strict E-E-A-T Factual Transparency Standard</span>
        </div>
        Author information must reflect authentic, verifiable credentials. Do not invent veterinary degrees, clinical certifications, or medical licenses. Firoz Khan is the Founder / Content Creator and lead digital tools architect of FurTools.
      </div>

      {/* Author Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Avatar */}
          <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted shadow-sm md:size-32">
            <img
              src={author.avatar}
              alt={author.name}
              className="size-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {author.name}
                  </h2>
                  <Badge variant={author.active ? "default" : "secondary"}>
                    {author.active ? "Active Author" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className="text-primary border-primary/30">
                    Primary Profile
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm font-medium text-primary">
                  {author.role}
                </p>
              </div>

              <Button onClick={handleOpenEdit} variant="outline" size="sm" className="gap-1.5">
                <Pencil className="size-3.5" />
                <span>Edit Info</span>
              </Button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {author.shortBio}
            </p>

            {/* Meta details grid */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 border-t border-border/60 pt-4 text-xs">
              <div>
                <span className="text-muted-foreground block">Articles Attributed:</span>
                <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                  <FileText className="size-3.5 text-primary" />
                  {postCount} articles
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Public URL:</span>
                <span className="font-mono text-foreground mt-0.5 block truncate">
                  /author/{author.slug}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">LinkedIn Profile:</span>
                <a
                  href={author.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary hover:underline mt-0.5 block truncate"
                >
                  linkedin.com/in/firoz-khan...
                </a>
              </div>
              <div>
                <span className="text-muted-foreground block">Instagram Profile:</span>
                <a
                  href={author.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary hover:underline mt-0.5 block truncate"
                >
                  instagram.com/rtibyfiroz
                </a>
              </div>
            </div>

            {/* Areas of Interest */}
            <div className="mt-5 border-t border-border/60 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                Areas of Focus
              </span>
              <div className="flex flex-wrap gap-1.5">
                {author.areasOfInterest.map((area) => (
                  <span
                    key={area}
                    className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs text-foreground"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Author Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Author Profile</DialogTitle>
            <DialogDescription>
              Update author credentials, professional bio, and social profile links.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="author-name">Full Name</Label>
                <Input
                  id="author-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="author-role">Role / Title</Label>
                <Input
                  id="author-role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="author-avatar">Profile Photo URL</Label>
              <Input
                id="author-avatar"
                value={formData.avatar}
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.value })
                }
              />
              <p className="text-[11px] text-muted-foreground">
                Current image: /authors/firoz-khan.webp
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="author-short-bio">Short Bio (Author Box)</Label>
              <Textarea
                id="author-short-bio"
                rows={2}
                value={formData.shortBio}
                onChange={(e) =>
                  setFormData({ ...formData, shortBio: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="author-full-bio">
                Full Bio (Author Page - separate paragraphs with a blank line)
              </Label>
              <Textarea
                id="author-full-bio"
                rows={5}
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="author-linkedin">LinkedIn Profile URL</Label>
                <Input
                  id="author-linkedin"
                  value={formData.socials.linkedin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, linkedin: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="author-instagram">Instagram Profile URL</Label>
                <Input
                  id="author-instagram"
                  value={formData.socials.instagram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, instagram: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="author-tags">
                Areas of Focus (comma-separated)
              </Label>
              <Input
                id="author-tags"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="author-active" className="cursor-pointer">
                  Active Status
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display profile and attribution on articles
                </p>
              </div>
              <Switch
                id="author-active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
