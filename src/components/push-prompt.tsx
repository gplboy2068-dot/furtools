import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

const STATUS_KEY = "furtools-push-status"; // "subscribed"
const DISMISS_KEY = "furtools-push-dismissed-at";
const PV_KEY = "furtools-push-pv";
const DISMISS_DAYS = 30;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

async function syncSubscription(): Promise<boolean> {
  try {
    const reg = await navigator.serviceWorker.register("/push-sw.js");
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      const res = await fetch("/api/push/config");
      if (!res.ok) return false;
      const { publicKey } = (await res.json()) as { publicKey?: string };
      if (!publicKey) return false;
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });
    }
    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(sub.toJSON()),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Soft push-notification prompt. Never asks on first page load: it appears
 * only from the second pageview onwards (and after a short delay), respects
 * a 30-day dismissal, and stays off /admin and /auth pages.
 */
export function PushPrompt() {
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<"ask" | "working" | "done">("ask");

  useEffect(() => {
    let timer: number | undefined;
    try {
      const path = window.location.pathname;
      if (path.startsWith("/admin") || path.startsWith("/auth")) return;
      if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
      if (localStorage.getItem(STATUS_KEY) === "subscribed") {
        // Already subscribed once — silently keep the server copy fresh.
        if (Notification.permission === "granted") void syncSubscription();
        return;
      }
      if (Notification.permission !== "default") return;
      const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
      if (dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
      const pv = Number(localStorage.getItem(PV_KEY) || 0) + 1;
      localStorage.setItem(PV_KEY, String(pv));
      if (pv < 2) return;
      timer = window.setTimeout(() => setVisible(true), 20000);
    } catch {
      /* storage unsupported — stay hidden */
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const subscribe = async () => {
    setState("working");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        dismiss();
        return;
      }
      const ok = await syncSubscription();
      if (ok) {
        try {
          localStorage.setItem(STATUS_KEY, "subscribed");
        } catch {
          /* ignore */
        }
        setState("done");
        window.setTimeout(() => setVisible(false), 4000);
      } else {
        setState("ask");
        setVisible(false);
      }
    } catch {
      setState("ask");
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Push notifications"
      className="fixed bottom-4 left-4 right-4 z-[100] max-w-sm rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:left-6 sm:right-auto sm:bottom-6 relative"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
      <div className="flex items-start gap-3">
        <Bell className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="text-sm">
          {state === "done" ? (
            <>
              <p className="font-semibold text-foreground">You&apos;re subscribed!</p>
              <p className="mt-1 text-muted-foreground">
                We&apos;ll let you know when a new pet tool or guide is published.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-foreground">Get pet tips &amp; new tools first</p>
              <p className="mt-1 text-muted-foreground">
                Turn on notifications and we&apos;ll send new FurTools guides and calculators
                straight to your device. No spam — a few a week at most.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={subscribe}
                  disabled={state === "working"}
                  className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {state === "working" ? "Turning on…" : "Notify me"}
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  Not now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
