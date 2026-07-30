import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { CrudManager, type ColumnDef } from "@/components/admin/crud-manager";
import type { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";

type Faq = Database["public"]["Tables"]["faqs"]["Row"];

export const Route = createFileRoute("/admin/faqs")({
  component: FaqsAdmin,
});

const columns: ColumnDef<Faq>[] = [
  {
    key: "question",
    header: "Question",
    render: (r) => (
      <div>
        <div className="font-medium">{r.question}</div>
        <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.answer}</div>
      </div>
    ),
  },
  { key: "scope", header: "Scope", render: (r) => (
    <div>
      <Badge variant="secondary">{r.scope}</Badge>
      {r.scope_ref ? <div className="mt-1 text-xs text-muted-foreground">{r.scope_ref}</div> : null}
    </div>
  ) },
  { key: "category", header: "Category" },
  { key: "sort_order", header: "Order" },
  { key: "published", header: "Live" },
];

function FaqsAdmin() {
  return (
    <div>
      <AdminPageHeader
        title="FAQs"
        description="Global FAQ library. Scope entries to a tool, breed, food, or page to attach them contextually."
      />
      <CrudManager<Faq>
        table="faqs"
        entityLabel="FAQ"
        orderBy={{ column: "sort_order", ascending: true }}
        columns={columns}
        fields={[
          { name: "question", label: "Question", required: true, colSpan: 2 },
          { name: "answer", label: "Answer", type: "textarea", required: true, colSpan: 2 },
          { name: "scope", label: "Scope", type: "select", required: true, options: [
            { value: "global", label: "Global" },
            { value: "tool", label: "Tool" },
            { value: "breed", label: "Breed" },
            { value: "food", label: "Food" },
            { value: "page", label: "Page" },
          ] },
          { name: "scope_ref", label: "Scope reference (slug or path)" },
          { name: "category", label: "Category" },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "published", label: "Published", type: "boolean" },
        ]}
        defaults={{ scope: "global", published: true, sort_order: 0 }}
      />
    </div>
  );
}
