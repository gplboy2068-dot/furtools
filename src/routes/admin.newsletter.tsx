import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { CrudManager, type ColumnDef } from "@/components/admin/crud-manager";
import type { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";

type Sub = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];

export const Route = createFileRoute("/admin/newsletter")({
  component: NewsletterAdmin,
});

const columns: ColumnDef<Sub>[] = [
  {
    key: "email",
    header: "Email",
    render: (r) => (
      <div>
        <div className="font-medium">{r.email}</div>
        {r.name ? <div className="text-xs text-muted-foreground">{r.name}</div> : null}
      </div>
    ),
  },
  { key: "status", header: "Status", render: (r) => <Badge variant={r.status === "subscribed" ? "default" : "secondary"}>{r.status}</Badge> },
  { key: "source", header: "Source" },
  { key: "subscribed_at", header: "Joined", render: (r) => new Date(r.subscribed_at).toLocaleDateString() },
];

function NewsletterAdmin() {
  return (
    <div>
      <AdminPageHeader
        title="Newsletter"
        description="Every subscriber, importable and exportable."
      />
      <CrudManager<Sub>
        table="newsletter_subscribers"
        entityLabel="Subscriber"
        orderBy={{ column: "subscribed_at", ascending: false }}
        columns={columns}
        fields={[
          { name: "email", label: "Email", required: true, colSpan: 2 },
          { name: "name", label: "Name" },
          { name: "status", label: "Status", type: "select", options: [
            { value: "subscribed", label: "Subscribed" },
            { value: "unsubscribed", label: "Unsubscribed" },
            { value: "bounced", label: "Bounced" },
          ] },
          { name: "source", label: "Source" },
        ]}
        defaults={{ status: "subscribed", source: "admin" }}
      />
    </div>
  );
}
