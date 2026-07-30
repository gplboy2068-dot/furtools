import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { CrudManager, type ColumnDef } from "@/components/admin/crud-manager";
import type { Database } from "@/integrations/supabase/types";

type Ad = Database["public"]["Tables"]["ads_placements"]["Row"];

export const Route = createFileRoute("/admin/ads")({
  component: AdsAdmin,
});

const columns: ColumnDef<Ad>[] = [
  {
    key: "name",
    header: "Placement",
    render: (r) => (
      <div>
        <div className="font-medium">{r.name}</div>
        <div className="text-xs text-muted-foreground">Slot: {r.slot}</div>
      </div>
    ),
  },
  { key: "provider", header: "Provider" },
  { key: "enabled", header: "Enabled" },
];

const SLOTS = [
  "header", "sidebar", "in-article-top", "in-article-bottom",
  "tool-top", "tool-bottom", "footer", "sticky-mobile",
];

function AdsAdmin() {
  return (
    <div>
      <AdminPageHeader
        title="Ads"
        description="Configure ad placements. Ad code (HTML/JS) is injected server-side at the chosen slot."
      />
      <CrudManager<Ad>
        table="ads_placements"
        entityLabel="Placement"
        orderBy={{ column: "created_at", ascending: false }}
        columns={columns}
        fields={[
          { name: "name", label: "Name", required: true },
          { name: "slot", label: "Slot", type: "select", required: true, options: SLOTS.map((s) => ({ value: s, label: s })) },
          { name: "provider", label: "Provider", type: "select", options: [
            { value: "adsense", label: "Google AdSense" },
            { value: "custom", label: "Custom HTML" },
            { value: "direct", label: "Direct sponsor" },
          ] },
          { name: "code", label: "Ad code (HTML/JS)", type: "textarea", colSpan: 2 },
          { name: "enabled", label: "Enabled", type: "boolean" },
        ]}
        defaults={{ enabled: true, provider: "adsense" }}
      />
    </div>
  );
}
