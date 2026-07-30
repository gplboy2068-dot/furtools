import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Faq } from "@/components/faq";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FurTools — Free tools for pet parents" },
      {
        name: "description",
        content:
          "FurTools is a growing library of free calculators, generators, and guides built for pet parents. Learn about our mission and how the tools work.",
      },
      { property: "og:title", content: "About FurTools" },
      { property: "og:description", content: "A free, growing library of tools for pet parents." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "About" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold">About FurTools</h1>
      <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
        <p className="lead text-lg text-muted-foreground">
          FurTools is a small, growing library of free tools for the people who love their
          animals like family.
        </p>
        <p>
          We build calculators, generators, and honest guides for dogs, cats, and small
          companions. Every tool is free, requires no signup, and runs entirely in your
          browser — nothing you enter leaves your device.
        </p>
        <h2>What we believe</h2>
        <ul>
          <li>Pet ownership shouldn't require a pricey subscription just to answer basic questions.</li>
          <li>Simple, well-designed tools beat noisy content walls.</li>
          <li>Every tool should be honest about its limits and point back to your vet when it matters.</li>
        </ul>
        <h2>What's next</h2>
        <p>
          We're scaling toward 300+ tools across dogs, cats, and other companions — with
          new tools shipping every week. If there's something you'd love to see,{" "}
          <a href="/contact">let us know</a>.
        </p>
      </div>

      <div className="mt-16">
        <Faq
          items={[
            { q: "Do you sell my data?", a: "No. FurTools has no login, no analytics beyond privacy-first aggregates, and no third-party trackers on tool pages." },
            { q: "Are the tools free forever?", a: "Yes. Our core tools will always be free." },
            { q: "Can I suggest a tool?", a: "Absolutely — use the contact page." },
          ]}
        />
      </div>
    </div>
  );
}
