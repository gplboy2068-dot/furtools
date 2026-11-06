import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Send, RefreshCw, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getPushStats, sendPushNotification } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/push")({
  head: () => ({
    meta: [
      { title: "Push Notifications — FurTools Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPushPage,
});

function AdminPushPage() {
  const [count, setCount] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const loadCount = () => {
    getPushStats()
      .then((s) => setCount(s.subscribers))
      .catch(() => setCount(null));
  };

  useEffect(() => {
    loadCount();
  }, []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || sending) return;
    setSending(true);
    setResult(null);
    try {
      const r = await sendPushNotification({
        title: title.trim(),
        body: body.trim(),
        url: link.trim() || "/",
      });
      setResult(
        `Sent to ${r.sent} of ${r.total} subscriber(s)` +
          (r.removed ? ` · ${r.removed} dead subscription(s) removed` : "") +
          (r.failed ? ` · ${r.failed} failed` : ""),
      );
      setTitle("");
      setBody("");
      setLink("");
      loadCount();
    } catch (err: any) {
      setResult(err?.message || "Sending failed");
    } finally {
      setSending(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Bell className="size-7 text-primary" />
            Push Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Send a browser push notification to everyone who subscribed on furtools.com
            (self-hosted Web Push — subscriptions are stored in D1).
          </p>
        </div>
        <button
          type="button"
          onClick={loadCount}
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted sm:self-center"
        >
          <RefreshCw className="size-3.5" /> Refresh count
        </button>
      </div>

      {/* Subscriber count */}
      <Card className="p-5">
        <p className="text-xs font-medium text-muted-foreground">Current subscribers</p>
        <p className="mt-1 font-display text-3xl font-bold">
          {count === null ? "—" : count}
        </p>
        {count === null ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Subscriber count unavailable right now — try Refresh.
          </p>
        ) : count === 0 ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Nobody has subscribed yet, so a send right now reaches 0 devices. Subscribe on
            your own device first (steps below) to test the full flow.
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Keep sends to a few a week so subscribers do not turn notifications off.
          </p>
        )}
      </Card>

      {/* Send form */}
      <Card className="p-5">
        <h2 className="mb-3 font-display text-lg font-semibold">Send a notification</h2>
        <form onSubmit={send} className="grid gap-3">
          <input
            className={inputCls}
            placeholder="Title — e.g. New guide: How to stop puppy biting"
            value={title}
            maxLength={120}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className={inputCls}
            placeholder="Message (optional) — one short line"
            value={body}
            maxLength={300}
            onChange={(e) => setBody(e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="Link (optional) — /blog/your-post or full furtools.com URL"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={sending || !title.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              <Send className="size-4" /> {sending ? "Sending…" : "Send notification"}
            </button>
            {count === 0 ? (
              <span className="text-xs text-muted-foreground">
                0 subscribers — this send will reach nobody yet.
              </span>
            ) : null}
          </div>
          {result ? <p className="text-sm text-muted-foreground">{result}</p> : null}
        </form>
      </Card>

      {/* How to test */}
      <Card className="p-5">
        <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
          <Smartphone className="size-5 text-primary" /> Test it on your own device
        </h2>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Open furtools.com on your phone or computer (not inside the admin panel).</li>
          <li>
            Visit any second page and wait about 20 seconds — the “Get pet tips &amp; new
            tools first” prompt appears at the top of the page, just below the header.
          </li>
          <li>Tap “Notify me” and allow notifications in the browser prompt.</li>
          <li>
            Come back to this page — the subscriber count becomes 1 — and send yourself a
            test notification.
          </li>
        </ol>
        <p className="mt-3 text-xs text-muted-foreground">
          Sends from this page are manual only, by design: publishing a blog post or tool
          never auto-sends a notification.
        </p>
      </Card>
    </div>
  );
}
