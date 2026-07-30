import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — FurTools" },
      { name: "description", content: "FurTools tools are informational only and not a substitute for veterinary advice." },
      { property: "og:title", content: "Disclaimer — FurTools" },
      { property: "og:description", content: "Informational only. Always consult your vet." },
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Disclaimer" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold">Disclaimer</h1>
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          FurTools tools and content are provided for informational and educational purposes
          only. They are not a substitute for professional veterinary diagnosis, treatment,
          or advice.
        </p>
        <p>
          Always consult a licensed veterinarian for questions about your pet's health,
          weight, nutrition, medications, or behavior. Never disregard veterinary advice or
          delay seeking it because of something you read on this site.
        </p>
        <p>
          We make no representations about the completeness or accuracy of the information
          on this site. Use of any tool or information is at your own risk.
        </p>
      </div>
    </div>
  );
}
