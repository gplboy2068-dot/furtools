import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { CrudManager, type ColumnDef } from "@/components/admin/crud-manager";
import type { Database } from "@/integrations/supabase/types";

type Media = Database["public"]["Tables"]["media"]["Row"];

export const Route = createFileRoute("/admin/media")({
  component: MediaAdmin,
});

const columns: ColumnDef<Media>[] = [
  {
    key: "filename",
    header: "Image",
    render: (r) => (
      <div className="flex items-center gap-3">
        <img src={r.url} alt={r.alt_text ?? r.filename} className="size-12 rounded-md object-cover" />
        <div>
          <div className="font-medium">{r.filename}</div>
          <div className="text-xs text-muted-foreground truncate max-w-xs">{r.url}</div>
        </div>
      </div>
    ),
  },
  { key: "alt_text", header: "Alt text" },
  { key: "mime_type", header: "Type" },
  { key: "created_at", header: "Added", render: (r) => new Date(r.created_at).toLocaleDateString() },
];

function MediaAdmin() {
  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Manage image URLs used across breed pages, blog posts, and tools."
      />
      <CrudManager<Media>
        table="media"
        entityLabel="Image"
        orderBy={{ column: "created_at", ascending: false }}
        columns={columns}
        fields={[
          { name: "filename", label: "Filename", required: true },
          { name: "url", label: "URL", type: "url", required: true, colSpan: 2 },
          { name: "alt_text", label: "Alt text", colSpan: 2 },
          { name: "mime_type", label: "MIME type", placeholder: "image/webp" },
          { name: "width", label: "Width", type: "number" },
          { name: "height", label: "Height", type: "number" },
          { name: "size_bytes", label: "Size (bytes)", type: "number" },
        ]}
      />
    </div>
  );
}
