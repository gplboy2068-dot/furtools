import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { CrudManager, type ColumnDef } from "@/components/admin/crud-manager";
import type { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/data/categories";

type CategoryOverride = Database["public"]["Tables"]["category_overrides"]["Row"];

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesAdmin,
});

const columns: ColumnDef<CategoryOverride>[] = [
  {
    key: "slug",
    header: "Category",
    render: (r) => {
      const c = CATEGORIES.find((x) => x.slug === r.slug);
      return (
        <div>
          <div className="font-medium">{r.title_override ?? c?.name ?? r.slug}</div>
          <div className="text-xs text-muted-foreground">/categories/{r.slug}</div>
        </div>
      );
    },
  },
  {
    key: "featured",
    header: "Flags",
    render: (r) => (
      <div className="flex gap-1">
        {r.featured ? <Badge>Featured</Badge> : null}
        {r.disabled ? <Badge variant="destructive">Hidden</Badge> : null}
      </div>
    ),
  },
  { key: "sort_order", header: "Order" },
];

function CategoriesAdmin() {
  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Manage top-level pet categories. Overrides layer on top of the code registry."
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {CATEGORIES.map((c) => (
          <div key={c.slug} className="rounded-2xl border border-border bg-background p-4">
            <div className="font-display text-lg font-semibold">{c.name}</div>
            <div className="text-xs text-muted-foreground">/categories/{c.slug}</div>
            <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
          </div>
        ))}
      </div>
      <CrudManager<CategoryOverride>
        table="category_overrides"
        entityLabel="Override"
        orderBy={{ column: "sort_order", ascending: true }}
        columns={columns}
        fields={[
          {
            name: "slug",
            label: "Category slug",
            type: "select",
            required: true,
            options: CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
          },
          { name: "title_override", label: "Title override" },
          { name: "description_override", label: "Description override", type: "textarea" },
          { name: "seo_title", label: "SEO title" },
          { name: "seo_description", label: "SEO description", type: "textarea" },
          { name: "featured", label: "Featured", type: "boolean" },
          { name: "disabled", label: "Hidden", type: "boolean" },
          { name: "sort_order", label: "Sort order", type: "number" },
        ]}
        defaults={{ featured: false, disabled: false, sort_order: 0 }}
      />
    </div>
  );
}
