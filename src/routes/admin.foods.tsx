import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { CrudManager, type ColumnDef } from "@/components/admin/crud-manager";
import type { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";

type Food = Database["public"]["Tables"]["foods"]["Row"];

export const Route = createFileRoute("/admin/foods")({
  component: FoodsAdmin,
});

function getSafety(row: Food, species: "dog" | "cat"): string | null {
  const s = row.species_safety as Record<string, { safety?: string }> | null;
  return s?.[species]?.safety ?? null;
}

const safetyVariant = (s: string | null) =>
  s === "safe" ? "default" : s === "unsafe" ? "destructive" : "secondary";

const columns: ColumnDef<Food>[] = [
  {
    key: "name",
    header: "Food",
    render: (r) => (
      <div>
        <div className="font-medium">{r.name}</div>
        <div className="text-xs text-muted-foreground">/foods/{r.slug}</div>
      </div>
    ),
  },
  { key: "category", header: "Category" },
  { key: "dogs", header: "Dogs", render: (r) => { const s = getSafety(r, "dog"); return <Badge variant={safetyVariant(s)}>{s ?? "—"}</Badge>; } },
  { key: "cats", header: "Cats", render: (r) => { const s = getSafety(r, "cat"); return <Badge variant={safetyVariant(s)}>{s ?? "—"}</Badge>; } },
  {
    key: "published",
    header: "Status",
    render: (r) => (
      <Badge variant={r.published ? "default" : "secondary"}>{r.published ? "Live" : "Draft"}</Badge>
    ),
  },
];

function FoodsAdmin() {
  return (
    <div>
      <AdminPageHeader
        title="Food Database"
        description='Manage the "Can My Pet Eat This?" food database.'
      />
      <CrudManager<Food>
        table="foods"
        entityLabel="Food"
        orderBy={{ column: "name", ascending: true }}
        columns={columns}
        fields={[
          { name: "slug", label: "Slug", required: true },
          { name: "name", label: "Name", required: true },
          { name: "category", label: "Category", placeholder: "fruit, vegetable, meat…" },
          {
            name: "species_safety",
            label: "Species safety (JSON)",
            type: "json",
            colSpan: 2,
            helpText: '{"dog": {"safety": "safe", "notes": "…"}, "cat": {"safety": "moderation"}}',
          },
          { name: "short_answer", label: "Short answer", type: "textarea", colSpan: 2 },
          { name: "benefits", label: "Benefits", type: "textarea", colSpan: 2 },
          { name: "risks", label: "Risks", type: "textarea", colSpan: 2 },
          { name: "symptoms", label: "Symptoms if problematic", type: "textarea", colSpan: 2 },
          { name: "vet_advice", label: "Vet advice", type: "textarea", colSpan: 2 },
          { name: "alternatives", label: "Alternatives (JSON array)", type: "json", colSpan: 2, helpText: '["apple", "carrot"]' },
          { name: "related_food_slugs", label: "Related food slugs (JSON array)", type: "json", colSpan: 2 },
          { name: "keywords", label: "Keywords (JSON array)", type: "json", colSpan: 2 },
          { name: "faqs", label: "FAQs (JSON array of {q,a})", type: "json", colSpan: 2 },
          { name: "image_url", label: "Image URL", type: "url" },
          { name: "published", label: "Published", type: "boolean" },
        ]}
        defaults={{ published: true }}
        transformIn={(f) => {
          const out = { ...f };
          for (const k of ["species_safety", "alternatives", "related_food_slugs", "keywords", "faqs"]) {
            if (typeof out[k] === "string") {
              try { out[k] = JSON.parse(out[k] as string); } catch { /* leave */ }
            }
          }
          return out;
        }}
      />
    </div>
  );
}
