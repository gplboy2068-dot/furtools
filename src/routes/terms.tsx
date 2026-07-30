import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — FurTools" },
      { name: "description", content: "The terms of using FurTools. Free tools, informational only, no warranty." },
      { property: "og:title", content: "Terms of Service — FurTools" },
      { property: "og:description", content: "Terms of using FurTools." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Terms" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 15, 2026</p>
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          Welcome to FurTools. By using this site you agree to these terms.
        </p>
        <h2>Use</h2>
        <p>
          FurTools is free for personal use. Please don't scrape the site at abusive rates or
          resell our content wholesale as your own.
        </p>
        <h2>No warranty</h2>
        <p>
          Our tools are provided "as is" without warranty of any kind. They are informational
          and not a substitute for professional veterinary care.
        </p>
        <h2>Liability</h2>
        <p>
          To the maximum extent permitted by law, FurTools is not liable for any indirect,
          incidental, or consequential damages arising from your use of the site.
        </p>
        <h2>Changes</h2>
        <p>
          We may update these terms occasionally. Continued use of the site after changes
          means you accept the new terms.
        </p>
      </div>
    </div>
  );
}
