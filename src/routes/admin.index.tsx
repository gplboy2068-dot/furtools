import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { TOOLS } from "@/data/tools";
import { CATEGORIES } from "@/data/categories";
import {
  FileText,
  Dog,
  Apple,
  Users,
  Mail,
  DollarSign,
  BarChart3,
  Wrench,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

interface Stats {
  posts: number;
  publishedPosts: number;
  breeds: number;
  foods: number;
  subscribers: number;
  affiliateClicks: number;
  pageviews7d: number;
  users: number;
}

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPosts, setRecentPosts] = useState<{ id: string; title: string; updated_at: string; published: boolean }[]>([]);
  const [recentSubs, setRecentSubs] = useState<{ email: string; subscribed_at: string }[]>([]);

  useEffect(() => {
    async function load() {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const [posts, published, breeds, foods, subs, affs, pv, users, recent, recSub] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("breeds").select("id", { count: "exact", head: true }),
        supabase.from("foods").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("status", "subscribed"),
        supabase.from("affiliate_links").select("clicks"),
        supabase.from("analytics_events").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id,title,updated_at,published").order("updated_at", { ascending: false }).limit(5),
        supabase.from("newsletter_subscribers").select("email,subscribed_at").order("subscribed_at", { ascending: false }).limit(5),
      ]);
      setStats({
        posts: posts.count ?? 0,
        publishedPosts: published.count ?? 0,
        breeds: breeds.count ?? 0,
        foods: foods.count ?? 0,
        subscribers: subs.count ?? 0,
        affiliateClicks: (affs.data ?? []).reduce((s, r) => s + (r.clicks ?? 0), 0),
        pageviews7d: pv.count ?? 0,
        users: users.count ?? 0,
      });
      setRecentPosts(recent.data ?? []);
      setRecentSubs(recSub.data ?? []);
    }
    load();
  }, []);

  const cards = [
    { label: "Tools", value: TOOLS.length, icon: Wrench, hint: `${CATEGORIES.length} categories` },
    { label: "Blog posts", value: stats?.posts ?? "—", icon: FileText, hint: `${stats?.publishedPosts ?? 0} published` },
    { label: "Breeds", value: stats?.breeds ?? "—", icon: Dog },
    { label: "Foods", value: stats?.foods ?? "—", icon: Apple },
    { label: "Subscribers", value: stats?.subscribers ?? "—", icon: Mail },
    { label: "Affiliate clicks", value: stats?.affiliateClicks ?? "—", icon: DollarSign },
    { label: "Pageviews (7d)", value: stats?.pageviews7d ?? "—", icon: BarChart3 },
    { label: "Registered users", value: stats?.users ?? "—", icon: Users },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="An overview of FurTools content, growth, and activity."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</span>
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="mt-2 font-display text-2xl font-semibold">{c.value}</div>
              {c.hint ? <div className="text-xs text-muted-foreground">{c.hint}</div> : null}
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent posts</h2>
            <Link to="/admin/blog" className="text-xs text-primary hover:underline">Manage →</Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentPosts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="truncate">{p.title}</span>
                  <span className="ml-3 text-xs text-muted-foreground">
                    {p.published ? "Published" : "Draft"} · {new Date(p.updated_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent subscribers</h2>
            <Link to="/admin/newsletter" className="text-xs text-primary hover:underline">Manage →</Link>
          </div>
          {recentSubs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subscribers yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentSubs.map((s) => (
                <li key={s.email} className="flex items-center justify-between py-2 text-sm">
                  <span className="truncate">{s.email}</span>
                  <span className="ml-3 text-xs text-muted-foreground">
                    {new Date(s.subscribed_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
