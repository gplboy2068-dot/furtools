import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "furtools-cookie-consent";

/**
 * Lightweight cookie consent banner (GDPR/ePrivacy).
 * Shows once until the visitor accepts or declines; choice is stored locally.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const choose = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // storage unavailable — just hide for this session
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-xl rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:left-auto sm:right-6 sm:bottom-6"
    >
      <div className="flex items-start gap-3">
        <Cookie className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="text-sm">
          <p className="font-semibold text-foreground">We use cookies</p>
          <p className="mt-1 text-muted-foreground">
            We use cookies to remember your preferences and to measure site
            traffic with privacy-friendly analytics. See our{" "}
            <Link to="/privacy" className="underline underline-offset-2 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => choose("declined")}
              className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
