/**
 * Contact Inquiries service for FurTools.
 *
 * Submissions go to the D1-backed API (POST /api/contact in src/server.ts);
 * the admin inbox reads and manages them through the admin-gated
 * /api/admin/inquiries endpoints. Messages live on the server — nothing is
 * kept in the visitor's browser. (The previous version saved inquiries only
 * to the submitter's localStorage, so they never reached the admin, and the
 * admin page showed seeded sample data instead.)
 */
import { getAuthToken } from "@/lib/admin-data";

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  status: "unread" | "read" | "responded" | "resolved" | "archived";
  created_at: string;
  updated_at?: string;
  page_url?: string;
  user_agent?: string;
  admin_notes?: string;
}

export const INQUIRIES_UPDATED_EVENT = "furtools_inquiries_updated";

export async function submitContactInquiry(data: {
  name: string;
  email: string;
  category: string;
  message: string;
}): Promise<{ success: boolean; id: string; error?: string }> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        category: data.category,
        message: data.message,
        page_url: typeof window !== "undefined" ? window.location.href : "",
      }),
    });
    const body = (await res.json().catch(() => ({}))) as any;
    if (res.ok && body.success) return { success: true, id: String(body.id || "") };
    return { success: false, id: "", error: body.error || "Could not send message" };
  } catch {
    return { success: false, id: "", error: "Network error" };
  }
}

async function adminInquiriesFetch(path: string, init: RequestInit = {}): Promise<any> {
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

export async function fetchAllInquiries(): Promise<ContactInquiry[]> {
  try {
    const data = await adminInquiriesFetch("/api/admin/inquiries");
    return (data.inquiries ?? []) as ContactInquiry[];
  } catch (err) {
    console.error("Failed to load inquiries:", err);
    return [];
  }
}

export async function updateInquiryStatus(
  id: string,
  status: ContactInquiry["status"],
  adminNotes?: string
): Promise<boolean> {
  try {
    await adminInquiriesFetch("/api/admin/inquiries", {
      method: "PATCH",
      body: JSON.stringify({
        id,
        status,
        ...(adminNotes !== undefined ? { admin_notes: adminNotes } : {}),
      }),
    });
    window.dispatchEvent(new Event(INQUIRIES_UPDATED_EVENT));
    return true;
  } catch (err) {
    console.error("Failed to update inquiry:", err);
    return false;
  }
}

export async function deleteInquiry(id: string): Promise<boolean> {
  try {
    await adminInquiriesFetch(`/api/admin/inquiries?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    window.dispatchEvent(new Event(INQUIRIES_UPDATED_EVENT));
    return true;
  } catch (err) {
    console.error("Failed to delete inquiry:", err);
    return false;
  }
}
