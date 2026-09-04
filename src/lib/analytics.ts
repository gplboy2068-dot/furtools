/**
 * Comprehensive Analytics Engine for FurTools
 * Automatically captures pageviews, visitor sessions, referrers, devices,
 * and feeds both Supabase analytics_events table and Admin Dashboard.
 */

import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsEvent {
  id?: number | string;
  event_type: string;
  path: string;
  referrer: string | null;
  session_id: string;
  user_agent: string;
  created_at: string;
  metadata?: {
    device?: "mobile" | "tablet" | "desktop";
    browser?: string;
    os?: string;
    screen_width?: number;
    title?: string;
    [key: string]: any;
  };
}

const SESSION_KEY = "furtools_analytics_sid";
const LOCAL_EVENTS_KEY = "furtools_analytics_history";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr-session";
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `sid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "session_fallback";
  }
}

export function detectDevice(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

export function detectBrowser(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Other";
}

export function getLocalAnalyticsEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalAnalyticsEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalAnalyticsEvents();
    // Keep latest 1000 events locally for fast offline/admin review
    const updated = [event, ...current].slice(0, 1000);
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(updated));
  } catch {
    /* ignore storage quota limits */
  }
}

/**
 * Tracks a pageview or custom action across the website.
 */
export async function trackPageView(path: string, customTitle?: string) {
  if (typeof window === "undefined") return;

  // Ignore admin and internal preview routes from inflating public analytics
  if (path.startsWith("/admin") || path.startsWith("/auth")) {
    return;
  }

  const sessionId = getOrCreateSessionId();
  const referrer = document.referrer ? document.referrer : null;
  const userAgent = navigator.userAgent || "";
  const device = detectDevice();
  const browser = detectBrowser();

  const event: AnalyticsEvent = {
    event_type: "pageview",
    path: path || window.location.pathname || "/",
    referrer,
    session_id: sessionId,
    user_agent: userAgent,
    created_at: new Date().toISOString(),
    metadata: {
      device,
      browser,
      screen_width: window.innerWidth,
      title: customTitle || document.title || "FurTools",
    },
  };

  // 1. Save locally for guaranteed instant rendering in admin
  saveLocalAnalyticsEvent(event);

  // 2. Persist to Supabase asynchronously (non-blocking)
  try {
    await (supabase.from("analytics_events") as any).insert({
      event_type: event.event_type,
      path: event.path,
      referrer: event.referrer,
      session_id: event.session_id,
      user_agent: event.user_agent,
      metadata: event.metadata,
    });
  } catch (err) {
    // Graceful silent fallback
    console.debug("Analytics dispatch note:", err);
  }
}

/**
 * Loads aggregated analytics for Admin Dashboard.
 */
export async function fetchAnalyticsData(days: number = 30): Promise<{
  events: AnalyticsEvent[];
  totalViews: number;
  uniqueVisitors: number;
  uniquePaths: number;
  byDay: { date: string; views: number; visitors: number }[];
  topPages: { path: string; views: number; percentage: number }[];
  topReferrers: { source: string; count: number; percentage: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  browserBreakdown: { browser: string; count: number; percentage: number }[];
}> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  let remoteEvents: AnalyticsEvent[] = [];
  try {
    const { data } = await supabase
      .from("analytics_events")
      .select("path,referrer,session_id,user_agent,created_at,metadata")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);

    if (data && data.length > 0) {
      remoteEvents = data as AnalyticsEvent[];
    }
  } catch (e) {
    console.warn("Could not fetch remote analytics, falling back to local store:", e);
  }

  // Merge remote events with local storage events, deduplicating by session_id + path + minute timestamp
  const localEvents = getLocalAnalyticsEvents().filter((e) => e.created_at >= since);
  const eventMap = new Map<string, AnalyticsEvent>();

  [...remoteEvents, ...localEvents].forEach((e) => {
    const key = `${e.session_id || "s"}_${e.path}_${(e.created_at || "").slice(0, 16)}`;
    if (!eventMap.has(key)) {
      eventMap.set(key, e);
    }
  });

  const combinedEvents = Array.from(eventMap.values());

  // Aggregate by day
  const dayBuckets: Record<string, { views: number; visitors: Set<string> }> = {};
  const pathBuckets: Record<string, number> = {};
  const refBuckets: Record<string, number> = {};
  const deviceBuckets: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
  const browserBuckets: Record<string, number> = {};
  const totalVisitorsSet = new Set<string>();

  // Prepopulate days in range so chart doesn't have empty gaps
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    dayBuckets[d] = { views: 0, visitors: new Set() };
  }

  combinedEvents.forEach((e) => {
    const dateStr = (e.created_at || new Date().toISOString()).slice(0, 10);
    const sid = e.session_id || "anon";
    totalVisitorsSet.add(sid);

    if (!dayBuckets[dateStr]) {
      dayBuckets[dateStr] = { views: 0, visitors: new Set() };
    }
    dayBuckets[dateStr].views += 1;
    dayBuckets[dateStr].visitors.add(sid);

    // Top Pages
    const p = e.path || "/";
    pathBuckets[p] = (pathBuckets[p] ?? 0) + 1;

    // Referrers
    let ref = "(direct)";
    if (e.referrer) {
      try {
        const u = new URL(e.referrer);
        ref = u.hostname.replace(/^www\./, "");
      } catch {
        ref = e.referrer.slice(0, 30);
      }
    }
    refBuckets[ref] = (refBuckets[ref] ?? 0) + 1;

    // Devices & Browsers
    const dev = (e.metadata?.device as "mobile" | "tablet" | "desktop") || "desktop";
    deviceBuckets[dev] = (deviceBuckets[dev] ?? 0) + 1;

    const brow = e.metadata?.browser || "Chrome";
    browserBuckets[brow] = (browserBuckets[brow] ?? 0) + 1;
  });

  const byDay = Object.entries(dayBuckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, d]) => ({
      date: new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      views: d.views,
      visitors: d.visitors.size,
    }));

  const totalViews = combinedEvents.length;

  const topPages = Object.entries(pathBuckets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, views]) => ({
      path,
      views,
      percentage: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0,
    }));

  const topReferrers = Object.entries(refBuckets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([source, count]) => ({
      source,
      count,
      percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
    }));

  const deviceBreakdown = Object.entries(deviceBuckets).map(([device, count]) => ({
    device: device.charAt(0).toUpperCase() + device.slice(1),
    count,
    percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
  }));

  const browserBreakdown = Object.entries(browserBuckets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
    }));

  return {
    events: combinedEvents,
    totalViews,
    uniqueVisitors: totalVisitorsSet.size,
    uniquePaths: Object.keys(pathBuckets).length,
    byDay,
    topPages,
    topReferrers,
    deviceBreakdown,
    browserBreakdown,
  };
}
