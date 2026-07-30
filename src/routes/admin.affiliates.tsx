import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { CrudManager, type ColumnDef } from "@/components/admin/crud-manager";
import type { Database } from "@/integrations/supabase/types";

type Aff = Database["public"]["Tables"]["affiliate_links"]["Row"];

export const Route = createFileRoute("/admin/affiliates")({
  component: AffAdmin,
});

const columns: ColumnDef<Aff>[] = [
  {
    key: "name",
    header: "Product",
    render: (r) => (
      <div>
        <div className="font-medium">{r.name}</div>
        <div className="text-xs text-muted-foreground">{r.merchant} · {r.product_type ?? "—"}</div>
      </div>
    ),
  },
  { key: "short_slug", header: "Short link", render: (r) => r.short_slug ? <code className="text-xs">/go/{r.short_slug}</code> : "—" },
  { key: "clicks", header: "Clicks" },
  { key: "commission_rate", header: "Rate %" },
  { key: "enabled", header: "Enabled" },
];

function AffAdmin() {
  return (
    <div>
      <AdminPageHeader
        title="Affiliates"
        description="Track affiliate products and click counts. Short slugs power /go/:slug redirects."
      />
      <CrudManager<Aff>
        table="affiliate_links"
        entityLabel="Affiliate"
        orderBy={{ column: "clicks", ascending: false }}
        columns={columns}
        fields={[
          { name: "name", label: "Product name", required: true },
          { name: "merchant", label: "Merchant", required: true, placeholder: "Amazon, Chewy…" },
          { name: "product_type", label: "Product type", type: "select", options: [
            { value: "food", label: "Food" }, { value: "toy", label: "Toy" }, { value: "grooming", label: "Grooming" },
            { value: "insurance", label: "Insurance" }, { value: "supplement", label: "Supplement" }, { value: "other", label: "Other" },
          ] },
          { name: "target_url", label: "Affiliate URL", type: "url", required: true, colSpan: 2 },
          { name: "short_slug", label: "Short slug (used as /go/:slug)" },
          { name: "commission_rate", label: "Commission rate (%)", type: "number" },
          { name: "notes", label: "Notes", type: "textarea", colSpan: 2 },
          { name: "enabled", label: "Enabled", type: "boolean" },
        ]}
        defaults={{ enabled: true, clicks: 0 }}
      />
    </div>
  );
}
