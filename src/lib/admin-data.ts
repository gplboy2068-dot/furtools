import { getCustomSession } from "@/lib/custom-google-auth";

/**
 * Client helpers for the D1-backed admin API (/api/admin/* in src/server.ts).
 * Every call carries the D1 session token; the server verifies the session
 * and the admin role on each request.
 */

export function getAuthToken(): string {
  try {
    const session = getCustomSession();
    if (!session) return "";
    return session.d1Token || (session.provider === "email" ? session.token : "") || "";
  } catch {
    return "";
  }
}

async function adminFetch(path: string, init: RequestInit = {}): Promise<any> {
  const token = getAuthToken();
  const res = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export interface ListOptions {
  order?: string;
  dir?: "asc" | "desc";
  limit?: number;
  offset?: number;
  eq?: Record<string, string | number>;
}

export async function listTable<T = Record<string, any>>(table: string, opts: ListOptions = {}): Promise<{ rows: T[]; total: number }> {
  const qs = new URLSearchParams();
  if (opts.order) qs.set("order", opts.order);
  if (opts.dir) qs.set("dir", opts.dir);
  if (opts.limit) qs.set("limit", String(opts.limit));
  if (opts.offset) qs.set("offset", String(opts.offset));
  if (opts.eq) {
    for (const [col, val] of Object.entries(opts.eq)) qs.append("eq", `${col}:${val}`);
  }
  const data = await adminFetch(`/api/admin/data/${table}?${qs.toString()}`);
  return { rows: (data.rows ?? []) as T[], total: data.total ?? 0 };
}

export async function findRow<T = Record<string, any>>(table: string, col: string, value: string | number): Promise<T | null> {
  const { rows } = await listTable<T>(table, { eq: { [col]: value }, limit: 1 });
  return rows[0] ?? null;
}

export async function insertRow<T = Record<string, any>>(table: string, row: Record<string, unknown>): Promise<T> {
  const data = await adminFetch(`/api/admin/data/${table}`, {
    method: "POST",
    body: JSON.stringify({ row }),
  });
  return data.row as T;
}

export async function upsertRow<T = Record<string, any>>(table: string, row: Record<string, unknown>): Promise<T> {
  const data = await adminFetch(`/api/admin/data/${table}`, {
    method: "POST",
    body: JSON.stringify({ row, upsert: true }),
  });
  return data.row as T;
}

export async function updateRow(table: string, pkValue: string | number, data: Record<string, unknown>, pk = "id"): Promise<void> {
  await adminFetch(`/api/admin/data/${table}`, {
    method: "PATCH",
    body: JSON.stringify({ pk, pkValue, data }),
  });
}

export async function deleteRow(table: string, pkValue: string | number, pk = "id"): Promise<void> {
  await adminFetch(`/api/admin/data/${table}`, {
    method: "DELETE",
    body: JSON.stringify({ pk, pkValue }),
  });
}

export async function getAdminStats(): Promise<{
  stats: Record<string, number>;
  recentPosts: any[];
  recentSubs: any[];
}> {
  return adminFetch("/api/admin/stats");
}

export async function setUserAdmin(userId: string, makeAdmin: boolean): Promise<void> {
  await adminFetch("/api/admin/users/role", {
    method: "POST",
    body: JSON.stringify({ userId, makeAdmin }),
  });
}

export async function getAdminAnalyticsEvents(days: number): Promise<any[]> {
  const data = await adminFetch(`/api/admin/analytics?days=${days}`);
  return data.events ?? [];
}
