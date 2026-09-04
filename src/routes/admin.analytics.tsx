import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  BarChart3,
  Users,
  Eye,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  Download,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  Compass,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { fetchAnalyticsData } from "@/lib/analytics";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics & Traffic Insights — FurTools Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AnalyticsAdmin,
});

function AnalyticsAdmin() {
  const [days, setDays] = useState<number>(30);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    events: any[];
    totalViews: number;
    uniqueVisitors: number;
    uniquePaths: number;
    byDay: { date: string; views: number; visitors: number }[];
    topPages: { path: string; views: number; percentage: number }[];
    topReferrers: { source: string; count: number; percentage: number }[];
    deviceBreakdown: { device: string; count: number; percentage: number }[];
    browserBreakdown: { browser: string; count: number; percentage: number }[];
  } | null>(null);

  const loadData = async (selectedDays: number = days) => {
    setLoading(true);
    try {
      const res = await fetchAnalyticsData(selectedDays);
      setData(res);
    } catch (err) {
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(days);
  }, [days]);

  const handleExportCSV = () => {
    if (!data || data.events.length === 0) {
      toast.error("No analytics data to export");
      return;
    }
    const headers = ["Timestamp", "Path", "Session ID", "Referrer", "Device", "Browser", "User Agent"];
    const rows = data.events.map((e) => [
      e.created_at || "",
      `"${(e.path || "").replace(/"/g, '""')}"`,
      e.session_id || "",
      `"${(e.referrer || "").replace(/"/g, '""')}"`,
      e.metadata?.device || "desktop",
      e.metadata?.browser || "Other",
      `"${(e.user_agent || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `furtools-analytics-${days}d-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Analytics CSV exported");
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return <Smartphone className="size-4 text-primary" />;
      case "tablet":
        return <Tablet className="size-4 text-secondary" />;
      default:
        return <Laptop className="size-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <BarChart3 className="size-7 text-primary" />
            Website Analytics & Traffic
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time pageviews, visitor sessions, top tools, and traffic sources across FurTools.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="inline-flex rounded-lg border border-border/80 bg-muted/40 p-1 text-xs">
            {[
              { label: "7 Days", value: 7 },
              { label: "14 Days", value: 14 },
              { label: "30 Days", value: 30 },
              { label: "90 Days", value: 90 },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDays(opt.value)}
                className={`rounded-md px-2.5 py-1 font-medium transition ${
                  days === opt.value
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 rounded-full text-xs">
            <Download className="size-3.5" />
            Export CSV
          </Button>

          <Button variant="outline" size="sm" onClick={() => loadData(days)} className="gap-1.5 rounded-full text-xs">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-primary/20 bg-primary/[0.03]">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold uppercase text-primary">
                Total Pageviews
              </CardDescription>
              <Eye className="size-4 text-primary" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-foreground">
              {loading ? "..." : (data?.totalViews ?? 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            In the last {days} days
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/[0.03]">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400">
                Unique Visitors
              </CardDescription>
              <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-foreground">
              {loading ? "..." : (data?.uniqueVisitors ?? 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Unique browser sessions
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold uppercase text-muted-foreground">
                Active Pages
              </CardDescription>
              <Compass className="size-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-foreground">
              {loading ? "..." : (data?.uniquePaths ?? 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Unique URLs visited
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-semibold uppercase text-muted-foreground">
                Traffic Sources
              </CardDescription>
              <Globe className="size-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-foreground">
              {loading ? "..." : (data?.topReferrers.length ?? 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[11px] text-muted-foreground">
            Referring domains & direct
          </CardContent>
        </Card>
      </div>

      {/* Main Trend Line/Area Chart */}
      <Card className="p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Daily Traffic Trend
            </h3>
            <p className="text-xs text-muted-foreground">
              Pageviews and unique visitors over the last {days} days
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-primary" />
              <span className="text-muted-foreground font-medium">Pageviews</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground font-medium">Visitors</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          {data?.byDay && data.byDay.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.byDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary, #c2694a)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary, #c2694a)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Pageviews"
                  stroke="var(--primary, #c2694a)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#viewsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Unique Visitors"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#visitorsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              No traffic recorded yet in this time window.
            </div>
          )}
        </div>
      </Card>

      {/* Two Column Grid: Top Pages & Top Referrers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <Card className="p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-foreground">
              Top Visited Pages & Calculators
            </h3>
            <span className="text-xs text-muted-foreground font-medium">Views</span>
          </div>

          {!data || data.topPages.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No pageviews recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {data.topPages.map((page, idx) => (
                <div key={page.path} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <a
                      href={page.path}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-foreground hover:text-primary truncate max-w-[280px] sm:max-w-md flex items-center gap-1"
                    >
                      <span className="text-muted-foreground font-mono text-[10px] w-4">{idx + 1}.</span>
                      <span className="truncate">{page.path}</span>
                      <ArrowUpRight className="size-2.5 opacity-50 flex-shrink-0" />
                    </a>
                    <span className="font-semibold text-foreground">{page.views.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${Math.max(page.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top Referrers */}
        <Card className="p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-foreground">
              Top Traffic Sources & Referrers
            </h3>
            <span className="text-xs text-muted-foreground font-medium">Sessions</span>
          </div>

          {!data || data.topReferrers.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No referrer data recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {data.topReferrers.map((ref, idx) => (
                <div key={ref.source} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground truncate flex items-center gap-1.5">
                      <span className="text-muted-foreground font-mono text-[10px] w-4">{idx + 1}.</span>
                      <Globe className="size-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{ref.source}</span>
                    </span>
                    <span className="font-semibold text-foreground">{ref.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.max(ref.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Device & Browser Breakdown */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card className="p-5 shadow-sm">
          <h3 className="font-display text-base font-bold text-foreground mb-3">
            Device Breakdown
          </h3>
          <div className="space-y-3">
            {data?.deviceBreakdown.map((d) => (
              <div key={d.device} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {getDeviceIcon(d.device)}
                  <span className="font-medium text-foreground">{d.device}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{d.count} ({d.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 shadow-sm">
          <h3 className="font-display text-base font-bold text-foreground mb-3">
            Top Browsers
          </h3>
          <div className="space-y-3">
            {data?.browserBreakdown.map((b) => (
              <div key={b.browser} className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{b.browser}</span>
                <span className="text-muted-foreground">{b.count} ({b.percentage}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
