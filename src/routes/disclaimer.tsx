import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { AlertTriangle, ShieldCheck, Stethoscope, PhoneCall, Sparkles, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — FurTools Educational & Veterinary Disclaimers" },
      {
        name: "description",
        content:
          "Important legal disclaimers for FurTools. Understand our educational scope, veterinary non-substitution notices, calculator estimation limits, AI assistant disclaimers, and emergency care protocols.",
      },
      { property: "og:title", content: "Disclaimer — FurTools Educational & Veterinary Disclaimers" },
      {
        property: "og:description",
        content:
          "Important legal disclaimers for FurTools. Understand our educational scope, veterinary non-substitution notices, calculator estimation limits, AI assistant disclaimers, and emergency care protocols.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/disclaimer" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Disclaimer — FurTools" },
      {
        name: "twitter:description",
        content: "Detailed educational, veterinary, calculator, and emergency care disclaimers for FurTools.",
      },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationSchema()),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Disclaimer", url: "/disclaimer" },
          ]),
        ),
      },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  const settings = useSiteSettings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Disclaimer" }]} />

      {/* Header */}
      <div className="mt-6 border-b border-border/60 pb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Disclaimer
        </h1>
        <p className="mt-4 text-xl leading-relaxed text-muted-foreground">
          This Disclaimer document contains important legal limitations, safety disclosures, and veterinary non-substitution notices regarding your access to and use of {settings.companyName}.
        </p>
      </div>

      {/* High-Alert Emergency Banner */}
      <div className="my-8 rounded-2xl border-2 border-red-500/30 bg-red-500/10 p-6 text-foreground shadow-sm">
        <div className="flex items-start gap-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-red-500/20 text-red-600 dark:text-red-400">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-red-900 dark:text-red-300">
              URGENT MEDICAL EMERGENCY WARNING
            </h2>
            <p className="mt-2 text-sm text-red-950/80 dark:text-red-200/90 leading-relaxed">
              {settings.companyName} IS NOT AN EMERGENCY VETERINARY SERVICE. OUR CALCULATORS AND AI TOOLS CANNOT DIAGNOSE MEDICAL CRISES OR INGESTION TOXICITY. IF YOUR ANIMAL SHOWS SYMPTOMS OF ACUTE ILLNESS, PAIN, UNCONSCIOUSNESS, SEIZURES, HEAVY BLEEDING, OR POISON EXPOSURE, <strong>DO NOT RELY ON THIS WEBSITE</strong>. IMMEDIATELY CONTACT A LICENSED LOCAL EMERGENCY VETERINARY HOSPITAL OR AN ANIMAL POISON CONTROL HOTLINE.
            </p>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="my-8 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          Disclaimer Index
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
          <a href="#disc-1" className="hover:text-primary hover:underline">1. General Disclaimer</a>
          <a href="#disc-2" className="hover:text-primary hover:underline">2. Pet Care Disclaimer</a>
          <a href="#disc-3" className="hover:text-primary hover:underline">3. Veterinary Disclaimer</a>
          <a href="#disc-4" className="hover:text-primary hover:underline">4. Health Info Disclaimer</a>
          <a href="#disc-5" className="hover:text-primary hover:underline">5. Nutrition Disclaimer</a>
          <a href="#disc-6" className="hover:text-primary hover:underline">6. Food Safety Disclaimer</a>
          <a href="#disc-7" className="hover:text-primary hover:underline">7. Medication Disclaimer</a>
          <a href="#disc-8" className="hover:text-primary hover:underline">8. Calculator Disclaimer</a>
          <a href="#disc-9" className="hover:text-primary hover:underline">9. AI Disclaimer</a>
          <a href="#disc-10" className="hover:text-primary hover:underline">10. Breed Info Disclaimer</a>
          <a href="#disc-11" className="hover:text-primary hover:underline">11. User Data Disclaimer</a>
          <a href="#disc-12" className="hover:text-primary hover:underline">12. Third-Party Disclaimer</a>
          <a href="#disc-13" className="hover:text-primary hover:underline">13. Affiliate Disclaimer</a>
          <a href="#disc-14" className="hover:text-primary hover:underline">14. Advertising Disclaimer</a>
          <a href="#disc-15" className="hover:text-primary hover:underline">15. Accuracy Disclaimer</a>
          <a href="#disc-16" className="hover:text-primary hover:underline">16. Emergency Disclaimer</a>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        {/* Section 1 */}
        <section id="disc-1" className="scroll-mt-20">
          <h2>1. General Disclaimer</h2>
          <p>
            The information, software applications, calculators, generators, articles, and interactive features on {settings.companyName} are provided solely for general educational, planning, and informational purposes. All content is delivered on an "as is" and "as available" basis without any express or implied warranties of accuracy, completeness, timeliness, or fitness for a particular purpose.
          </p>
        </section>

        {/* Section 2 */}
        <section id="disc-2" className="mt-10 scroll-mt-20">
          <h2>2. Pet Care Disclaimer</h2>
          <p>
            Every animal is an individual with unique physiological, genetic, behavioral, and environmental needs. Guidelines or calculators provided on {settings.companyName} represent generalized species standards. What is suitable for one dog, cat, rabbit, bird, or horse may not be appropriate for your specific pet. Owners must exercise individual judgment and work with qualified animal care professionals.
          </p>
        </section>

        {/* Section 3 */}
        <section id="disc-3" className="mt-10 scroll-mt-20">
          <h2>3. Veterinary Disclaimer</h2>
          <p>
            <strong>{settings.companyName} DOES NOT PROVIDE VETERINARY MEDICAL ADVICE.</strong> The operators, authors, software engineers, and automated tools of {settings.companyName} are not licensed veterinary doctors, animal hospitals, or clinical triage professionals.
          </p>
          <p>
            No information on this site—including calculator outputs, symptom guides, or AI assistant responses—should be construed as veterinary diagnosis, treatment, or clinical prescription. Using {settings.companyName} does not establish a doctor-patient relationship. Always consult a qualified, licensed Doctor of Veterinary Medicine (DVM) regarding any medical concerns or symptoms.
          </p>
        </section>

        {/* Section 4 */}
        <section id="disc-4" className="mt-10 scroll-mt-20">
          <h2>4. Health Information Disclaimer</h2>
          <p>
            Health-related resources on {settings.companyName} (such as our <Link to="/care" className="text-primary hover:underline">Pet Health Tracking</Link> dashboards) are intended solely to assist pet owners in organizing wellness records for personal reference. Health data summaries or condition tracking charts are not clinical evaluation reports. Never delay seeking professional veterinary care or disregard professional advice because of information read on {settings.companyName}.
          </p>
        </section>

        {/* Section 5 */}
        <section id="disc-5" className="mt-10 scroll-mt-20">
          <h2>5. Nutrition Disclaimer</h2>
          <p>
            Nutritional formulas provided on {settings.companyName} (such as Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) portioning calculators) calculate baseline estimates based on mathematical averages. Dietary needs vary dramatically based on body condition score (BCS), neuter status, life stage (puppy/kitten vs. senior), metabolic variations, disease states (such as kidney failure or diabetes), and daily activity levels. Always discuss nutritional changes with your vet or a board-certified veterinary nutritionist.
          </p>
        </section>

        {/* Section 6 */}
        <section id="disc-6" className="mt-10 scroll-mt-20">
          <h2>6. Pet Food Safety Disclaimer</h2>
          <p>
            Our food safety databases and toxic ingredient listings provide general educational reference on common human foods safe or hazardous for companion animals. However, food toxicity ratings can vary based on dosage, pet weight, breed sensitivities, and individual allergic reactions. If your pet consumes a potentially toxic substance (such as chocolate, xylitol, grapes, onions, or lilies), contact poison control or an emergency clinic immediately.
          </p>
        </section>

        {/* Section 7 */}
        <section id="disc-7" className="mt-10 scroll-mt-20">
          <h2>7. Medication Disclaimer</h2>
          <p>
            Medication reminder logs and tracking features on {settings.companyName} are personal record-keeping tools. {settings.companyName} does not recommend, prescribe, or calculate pharmaceutical dosages. Never administer prescription medications, over-the-counter drugs, or human supplements to an animal without explicit instructions from a licensed veterinarian.
          </p>
        </section>

        {/* Section 8 */}
        <section id="disc-8" className="mt-10 scroll-mt-20">
          <h2>8. Calculator Disclaimer</h2>
          <p>
            Interactive calculators hosted across {settings.companyName}—including age calculators, calorie portioners, aquarium volume converters, crate size selectors, and lifetime cost planners—generate mathematical estimates. While we strive to maintain formula accuracy, mathematical approximations cannot account for individual biological anomalies. Users rely on calculator outputs at their own risk.
          </p>
        </section>

        {/* Section 9 */}
        <section id="disc-9" className="mt-10 scroll-mt-20">
          <h2>9. AI Disclaimer</h2>
          <p>
            {settings.companyName} offers conversational <Link to="/ai" className="text-primary hover:underline">AI Pet Assistants</Link> powered by large language models.
          </p>
          <ul>
            <li><strong>AI Features Must Never Be Presented as Veterinary Diagnosis:</strong> AI engines synthesize language patterns and are prone to hallucinations, incomplete factual statements, or errors.</li>
            <li><strong>AI CANNOT Replace a Veterinarian:</strong> An artificial intelligence bot cannot examine your animal physically, perform blood work, or diagnose medical conditions.</li>
            <li>Users are strictly advised to cross-check all AI advice with verified veterinary sources.</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section id="disc-10" className="mt-10 scroll-mt-20">
          <h2>10. Breed Information Disclaimer</h2>
          <p>
            Breed profiles, temperament indexes, and comparison guides hosted in our <Link to="/breeds" className="text-primary hover:underline">Breed Database</Link> represent generalized breed standard traits. Individual dogs, cats, or small pets may exhibit temperaments, shedding habits, health conditions, or sizes that deviate significantly from breed averages due to genetics, training, and environment.
          </p>
        </section>

        {/* Section 11 */}
        <section id="disc-11" className="mt-10 scroll-mt-20">
          <h2>11. User-Generated & Submitted Information Disclaimer</h2>
          <p>
            Where users log records or submit feedback, {settings.companyName} is not responsible for validating user-generated inputs. We do not endorse user comments or guarantee the truthfulness of user submissions.
          </p>
        </section>

        {/* Section 12 */}
        <section id="disc-12" className="mt-10 scroll-mt-20">
          <h2>12. Third-Party Website Disclaimer</h2>
          <p>
            {settings.companyName} may provide links to third-party sites, veterinary associations, research journals, or external tools. We do not control, endorse, or guarantee the accuracy of content found on third-party websites.
          </p>
        </section>

        {/* Section 13 */}
        <section id="disc-13" className="mt-10 scroll-mt-20">
          <h2>13. Affiliate Disclaimer</h2>
          <p>
            {settings.companyName} participates in affiliate referral programs (such as Amazon Associates and Chewy). Pages on our site may contain affiliate links. If you purchase a product through an affiliate link, {settings.companyName} may earn a small referral commission at zero extra cost to you. We recommend products based on merit, but users should evaluate items independently.
          </p>
        </section>

        {/* Section 14 */}
        <section id="disc-14" className="mt-10 scroll-mt-20">
          <h2>14. Advertising Disclaimer</h2>
          <p>
            Banner and display advertisements on {settings.companyName} are served by third-party advertising networks like Google AdSense. The presence of an ad on our website does not constitute an endorsement, warranty, or recommendation of the advertised product or service by {settings.companyName}.
          </p>
        </section>

        {/* Section 15 */}
        <section id="disc-15" className="mt-10 scroll-mt-20">
          <h2>15. Accuracy Disclaimer</h2>
          <p>
            While our editorial team endeavors to keep all tools, calculations, and care guides accurate and up to date, information in the animal wellness field evolves rapidly. {settings.companyName} makes no warranties regarding the absolute completeness, reliability, or timeliness of any content on the site.
          </p>
        </section>

        {/* Section 16 */}
        <section id="disc-16" className="mt-10 border-t border-border/60 pt-8 scroll-mt-20">
          <h2>16. Emergency Protocols & Contact Information</h2>
          <p>
            For any urgent situation or questions regarding this Disclaimer, please refer to the following emergency protocols and contact resources:
          </p>
          <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
              <h3 className="font-semibold text-red-900 dark:text-red-300 flex items-center gap-2">
                <PhoneCall className="size-5 text-red-600 dark:text-red-400" />
                Pet Poison Hotlines
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                If you suspect toxic food or chemical exposure, call immediately:
              </p>
              <ul className="mt-2 text-xs font-mono text-foreground space-y-1">
                <li>ASPCA Poison Control: (888) 426-4435</li>
                <li>Pet Poison Helpline: (855) 764-7661</li>
              </ul>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-5">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                Legal & Disclaimer Questions
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                For non-emergency policy or disclaimer questions:
              </p>
              <p className="mt-2 text-xs text-foreground font-medium">
                Email: <a href={`mailto:${settings.supportEmail}`} className="text-primary hover:underline">{settings.supportEmail}</a>
              </p>
              <p className="mt-1 text-xs text-foreground">
                Contact Form: <Link to="/contact" className="text-primary hover:underline">furtools.com/contact</Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
