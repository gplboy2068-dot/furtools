import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { CrudManager, type ColumnDef } from "@/components/admin/crud-manager";
import type { Database } from "@/integrations/supabase/types";

type Template = Database["public"]["Tables"]["email_templates"]["Row"];

export const Route = createFileRoute("/admin/email-templates")({
  component: TemplatesAdmin,
});

const columns: ColumnDef<Template>[] = [
  {
    key: "name",
    header: "Template",
    render: (r) => (
      <div>
        <div className="font-medium">{r.name}</div>
        <div className="text-xs text-muted-foreground">{r.slug}</div>
      </div>
    ),
  },
  { key: "subject", header: "Subject" },
  { key: "enabled", header: "Enabled" },
];

function TemplatesAdmin() {
  return (
    <div>
      <AdminPageHeader
        title="Email Templates"
        description="Transactional and newsletter email templates. Reference {{variables}} inside subject and body."
      />
      <CrudManager<Template>
        table="email_templates"
        entityLabel="Template"
        orderBy={{ column: "name", ascending: true }}
        columns={columns}
        fields={[
          { name: "slug", label: "Slug (unique)", required: true, placeholder: "welcome" },
          { name: "name", label: "Name", required: true },
          { name: "subject", label: "Subject", required: true, colSpan: 2 },
          { name: "body_html", label: "Body HTML", type: "textarea", required: true, colSpan: 2 },
          { name: "body_text", label: "Body plain text", type: "textarea", colSpan: 2 },
          { name: "variables", label: "Variables (JSON array of names)", type: "json", colSpan: 2, helpText: '["first_name","tool_name"]' },
          { name: "enabled", label: "Enabled", type: "boolean" },
        ]}
        defaults={{ enabled: true, variables: [] }}
        transformIn={(f) => {
          const out = { ...f };
          if (typeof out.variables === "string") {
            try { out.variables = JSON.parse(out.variables as string); } catch { out.variables = []; }
          }
          return out;
        }}
      />
    </div>
  );
}
