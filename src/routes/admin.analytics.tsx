import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

interface Event {
  path: string;
  referrer: string | null;
  created_at: string;
}

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsAdmin,
});

function AnalyticsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("analytics_events")
        .select("path,referrer,created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);
      setEvents((data ?? []) as Event[]);
      setLoading(false);
    }
    load();
  }, []);

  // Aggregate by day
  const byDay: Record<string, number> = {};
  events.forEach((e) => {
    const d = e.created_at.slice(0, 10);
    byDay[d] = (byDay[d] ?? 0) + 1;
  });
  const dayData = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, views]) => ({ date: date.slice(5), views }));

  // Top pages
  const byPath: Record<string, number> = {};
  events.forEach((e) => { byPath[e.path] = (byPath[e.path] ?? 0) + 1; });
  const topPages = Object.entries(byPath)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, views]) => ({ path, views }));

  // Top referrers
  const byRef: Record<string, number> = {};
  events.forEach((e) => {
    const r = e.referrer ? new URL(e.referrer, "https://x").hostname : "(direct)";
    byRef[r] = (byRef[r] ?? 0) + 1;
  });
  const topRefs = Object.entries(byRef).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        description="Pageviews collected via the built-in analytics_events table (last 30 days)."
      />
      {loading ? (
        <div className="p-10 text-center text-muted-foreground">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="p-4">
              <div className="text-xs uppercase text-muted-foreground">Total events</div>
              <div className="mt-1 font-display text-2xl font-semibold">{events.length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs uppercase text-muted-foreground">Unique paths</div>
              <div className="mt-1 font-display text-2xl font-semibold">{Object.keys(byPath).length}</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs uppercase text-muted-foreground">Referrers</div>
              <div className="mt-1 font-display text-2xl font-semibold">{Object.keys(byRef).length}</div>
            </Card>
          </div>

          <Card className="mt-6 p-5">
            <h3 className="mb-4 font-display text-lg font-semibold">Pageviews by day</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dayData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="mb-4 font-display text-lg font-semibold">Top pages</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPages} layout="vertical">
                    <XAxis type="number" fontSize={12} />
                    <YAxis dataKey="path" type="category" width={140} fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="views" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="mb-4 font-display text-lg font-semibold">Top referrers</h3>
              <ul className="divide-y divide-border text-sm">
                {topRefs.map(([r, n]) => (
                  <li key={r} className="flex justify-between py-2">
                    <span className="truncate">{r}</span>
                    <span className="text-muted-foreground">{n}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
