import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { CrudManager, type ColumnDef } from "@/components/admin/crud-manager";
import type { Database } from "@/integrations/supabase/types";

type Link = Database["public"]["Tables"]["internal_links"]["Row"];

export const Route = createFileRoute("/admin/links")({
  component: LinksAdmin,
});

const columns: ColumnDef<Link>[] = [
  {
    key: "keyword",
    header: "Keyword",
    render: (r) => (
      <div>
        <div className="font-medium">{r.keyword}</div>
        <div className="text-xs text-muted-foreground truncate max-w-xs">{r.target_url}</div>
      </div>
    ),
  },
  { key: "title", header: "Title" },
  { key: "priority", header: "Priority" },
  { key: "enabled", header: "Enabled" },
];

function LinksAdmin() {
  return (
    <div>
      <AdminPageHeader
        title="Internal Links"
        description="Keyword → URL mapping used for auto-linking in blog content and to surface related pages."
      />
      <CrudManager<Link>
        table="internal_links"
        entityLabel="Link"
        orderBy={{ column: "priority", ascending: false }}
        columns={columns}
        fields={[
          { name: "keyword", label: "Keyword", required: true, placeholder: "puppy socialization" },
          { name: "target_url", label: "Target URL", type: "url", required: true, placeholder: "/blog/puppy-socialization-guide" },
          { name: "title", label: "Anchor title" },
          { name: "priority", label: "Priority", type: "number" },
          { name: "enabled", label: "Enabled", type: "boolean" },
        ]}
        defaults={{ enabled: true, priority: 0 }}
      />
    </div>
  );
}
