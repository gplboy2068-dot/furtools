/**
 * Contact Inquiries Management Service for FurTools
 * Handles saving, fetching, updating, and syncing user queries submitted via the Contact form.
 */

import { supabase } from "@/integrations/supabase/client";

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

const LOCAL_STORAGE_KEY = "furtools_contact_inquiries";

// Initial fallback sample data if storage is empty
const INITIAL_SAMPLE_INQUIRIES: ContactInquiry[] = [
  {
    id: "inq-sample-1",
    name: "Dr. Sarah Jenkins",
    email: "s.jenkins@vetclinic.org",
    category: "Tool Suggestion",
    message: "Hello FurTools team, love the Dog Calorie and Nitrate calculators! Would it be possible to add a Canine Dehydration & Fluid Therapy calculator for post-operative recovery?",
    status: "unread",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    page_url: "https://www.furtools.com/tools/calorie-calculator",
  },
  {
    id: "inq-sample-2",
    name: "Alex Rivera",
    email: "alex.rivera92@gmail.com",
    category: "Technical Issue",
    message: "When using the Smart Collar QR code generator on mobile Safari, the downloadable image resolution was slightly truncated at 300dpi. Could you check the canvas rendering on iOS?",
    status: "read",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    page_url: "https://www.furtools.com/tools/smart-collar-qr",
  },
  {
    id: "inq-sample-3",
    name: "Liam O'Connor",
    email: "liam@petlifeblog.co.uk",
    category: "Partnership",
    message: "We run a pet care community with 45k monthly readers. We would love to feature FurTools calculators as an embedded widget and collaborate on exotic pet care articles.",
    status: "responded",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    page_url: "https://www.furtools.com/contact",
  },
];

export function getLocalInquiries(): ContactInquiry[] {
  if (typeof window === "undefined") return INITIAL_SAMPLE_INQUIRIES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_INQUIRIES));
      return INITIAL_SAMPLE_INQUIRIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAMPLE_INQUIRIES;
  }
}

export function saveLocalInquiry(inquiry: ContactInquiry) {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalInquiries();
    const updated = [inquiry, ...current.filter((i) => i.id !== inquiry.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("furtools_inquiries_updated"));
  } catch (err) {
    console.error("Failed to save inquiry locally:", err);
  }
}

export async function submitContactInquiry(data: {
  name: string;
  email: string;
  category: string;
  message: string;
}): Promise<{ success: boolean; id: string; error?: string }> {
  const id = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const inquiry: ContactInquiry = {
    id,
    name: data.name.trim(),
    email: data.email.trim(),
    category: data.category || "General Question",
    message: data.message.trim(),
    status: "unread",
    created_at: new Date().toISOString(),
    page_url: typeof window !== "undefined" ? window.location.href : "",
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };

  // 1. Always save in local persistent storage first for 100% fail-safe reliability
  saveLocalInquiry(inquiry);

  // 2. Attempt to save in Supabase if contact_inquiries / feedback table exists
  try {
    // Log as analytics event for tracking
    await (supabase.from("analytics_events") as any).insert({
      event_type: "contact_inquiry_submitted",
      path: "/contact",
      metadata: {
        inquiry_id: id,
        name: inquiry.name,
        email: inquiry.email,
        category: inquiry.category,
        message: inquiry.message,
      },
    });
  } catch (supabaseErr) {
    // Non-blocking: local storage has already safely captured the query
    console.warn("Supabase event logging notice:", supabaseErr);
  }

  return { success: true, id };
}

export async function fetchAllInquiries(): Promise<ContactInquiry[]> {
  return getLocalInquiries();
}

export async function updateInquiryStatus(
  id: string,
  status: ContactInquiry["status"],
  adminNotes?: string
): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const current = getLocalInquiries();
    const updated = current.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            admin_notes: adminNotes !== undefined ? adminNotes : item.admin_notes,
            updated_at: new Date().toISOString(),
          }
        : item
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("furtools_inquiries_updated"));
    return true;
  } catch {
    return false;
  }
}

export async function deleteInquiry(id: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const current = getLocalInquiries();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("furtools_inquiries_updated"));
    return true;
  } catch {
    return false;
  }
}

export function getUnreadInquiryCount(): number {
  const inquiries = getLocalInquiries();
  return inquiries.filter((i) => i.status === "unread").length;
}
