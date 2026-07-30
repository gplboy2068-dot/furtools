import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — FurTools" },
      { name: "description", content: "How FurTools handles your data. Short version: we don't collect much, and tools run locally in your browser." },
      { property: "og:title", content: "Privacy Policy — FurTools" },
      { property: "og:description", content: "How FurTools handles your data." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Privacy" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 15, 2026</p>
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <h2>Short version</h2>
        <p>
          FurTools tools run in your browser. Inputs you type into calculators and generators
          are not sent to our servers unless a tool explicitly says otherwise.
        </p>
        <h2>What we collect</h2>
        <ul>
          <li><strong>Nothing on tool pages by default</strong> — calculators are client-side.</li>
          <li><strong>Contact form</strong> — the name, email, and message you send.</li>
          <li><strong>Blog accounts</strong> — email and profile info if you sign in as an admin.</li>
          <li><strong>Aggregate analytics</strong> — privacy-preserving page counts. No personal profiles.</li>
        </ul>
        <h2>Cookies</h2>
        <p>
          We use a single local preference (your theme choice) stored in your browser's
          localStorage. It is not sent to us.
        </p>
        <h2>Third parties</h2>
        <p>
          Blog author accounts use Lovable Cloud for authentication. That's it.
        </p>
        <h2>Contact</h2>
        <p>
          Questions? <a href="/contact">Reach out</a>.
        </p>
      </div>
    </div>
  );
}
