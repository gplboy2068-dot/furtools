import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { CrudManager, type ColumnDef } from "@/components/admin/crud-manager";
import type { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { SPECIES } from "@/data/species";

type Breed = Database["public"]["Tables"]["breeds"]["Row"];

export const Route = createFileRoute("/admin/breeds")({
  component: BreedsAdmin,
});

const columns: ColumnDef<Breed>[] = [
  {
    key: "name",
    header: "Breed",
    render: (r) => (
      <div>
        <div className="font-medium">{r.name}</div>
        <div className="text-xs text-muted-foreground">/breeds/{r.slug}</div>
      </div>
    ),
  },
  { key: "species", header: "Species", render: (r) => <Badge variant="secondary">{r.species}</Badge> },
  { key: "size_category", header: "Size" },
  {
    key: "published",
    header: "Status",
    render: (r) => (
      <Badge variant={r.published ? "default" : "secondary"}>{r.published ? "Live" : "Draft"}</Badge>
    ),
  },
];

function BreedsAdmin() {
  return (
    <div>
      <AdminPageHeader
        title="Breed Database"
        description="Add and edit dog, cat, and other pet breeds. Everything you enter appears on the public breed pages."
      />
      <CrudManager<Breed>
        table="breeds"
        entityLabel="Breed"
        orderBy={{ column: "name", ascending: true }}
        columns={columns}
        fields={[
          { name: "slug", label: "Slug", required: true, placeholder: "golden-retriever" },
          { name: "name", label: "Name", required: true },
          {
            name: "species",
            label: "Species",
            type: "select",
            required: true,
            options: SPECIES.map((s) => ({ value: s.slug, label: s.singular })),
          },
          {
            name: "size_category",
            label: "Size",
            type: "select",
            options: [
              { value: "toy", label: "Toy" },
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "giant", label: "Giant" },
            ],
          },
          { name: "breed_group", label: "Breed group" },
          { name: "origin_country", label: "Origin country" },
          { name: "lifespan_min", label: "Lifespan min (years)", type: "number" },
          { name: "lifespan_max", label: "Lifespan max (years)", type: "number" },
          { name: "weight_min", label: "Weight min", type: "number" },
          { name: "weight_max", label: "Weight max", type: "number" },
          { name: "weight_unit", label: "Weight unit", placeholder: "kg or lb" },
          { name: "height_min", label: "Height min", type: "number" },
          { name: "height_max", label: "Height max", type: "number" },
          { name: "height_unit", label: "Height unit", placeholder: "cm or in" },
          { name: "hero_image", label: "Hero image URL", type: "url", colSpan: 2 },
          { name: "overview", label: "Overview", type: "textarea", colSpan: 2 },
          { name: "history", label: "History", type: "textarea", colSpan: 2 },
          { name: "temperament_description", label: "Temperament", type: "textarea", colSpan: 2 },
          { name: "exercise_description", label: "Exercise", type: "textarea", colSpan: 2 },
          { name: "exercise_level", label: "Exercise level", placeholder: "low / medium / high" },
          { name: "exercise_minutes_per_day", label: "Exercise minutes/day", type: "number" },
          { name: "grooming", label: "Grooming", type: "textarea", colSpan: 2 },
          { name: "grooming_frequency", label: "Grooming frequency" },
          { name: "nutrition", label: "Nutrition", type: "textarea", colSpan: 2 },
          { name: "coat_type", label: "Coat type" },
          { name: "energy_level", label: "Energy level" },
          { name: "shedding_level", label: "Shedding level" },
          { name: "trainability", label: "Trainability" },
          { name: "common_diseases", label: "Common diseases (JSON)", type: "json", colSpan: 2, helpText: '["Hip dysplasia", "Elbow dysplasia"]' },
          { name: "faqs", label: "FAQs (JSON array of {q,a})", type: "json", colSpan: 2 },
          { name: "good_with", label: "Good with (JSON)", type: "json", colSpan: 2, helpText: '{"kids": true, "pets": true}' },
          { name: "published", label: "Published", type: "boolean" },
        ]}
        defaults={{ published: true, species: "dog", weight_unit: "kg", height_unit: "cm" }}
        transformIn={(f) => {
          const out = { ...f };
          for (const k of ["common_diseases", "faqs", "good_with"]) {
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
