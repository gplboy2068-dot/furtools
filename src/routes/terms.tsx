import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { FileText, ShieldAlert, Scale, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — FurTools" },
      {
        name: "description",
        content:
          "Terms of Service governing the use of FurTools. Legal conditions, calculator output disclaimers, AI tool limitations, acceptable use, intellectual property, and liability terms.",
      },
      { property: "og:title", content: "Terms of Service — FurTools" },
      {
        property: "og:description",
        content:
          "Terms of Service governing the use of FurTools. Legal conditions, calculator output disclaimers, AI tool limitations, acceptable use, intellectual property, and liability terms.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Terms of Service — FurTools" },
      {
        name: "twitter:description",
        content: "Legal conditions, acceptable use, and tool disclaimers for FurTools users.",
      },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
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
            { name: "Terms", url: "/terms" },
          ]),
        ),
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const settings = useSiteSettings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Terms" }]} />

      {/* Title & Metadata Header */}
      <div className="mt-6 border-b border-border/60 pb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Terms of Service
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <p><strong>Effective Date:</strong> {settings.effectiveDate}</p>
          <p><strong>Last Updated:</strong> {settings.lastUpdated}</p>
          <p><strong>Entity:</strong> {settings.companyName}</p>
        </div>
      </div>

      {/* Table of Contents Box */}
      <div className="my-8 rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Scale className="size-5 text-primary" />
          Terms Overview & Table of Contents
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Please review these Terms of Service carefully before using the {settings.companyName} website or interactive tools.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
          <a href="#term-1" className="hover:text-primary hover:underline">1. Acceptance of Terms</a>
          <a href="#term-2" className="hover:text-primary hover:underline">2. About FurTools</a>
          <a href="#term-3" className="hover:text-primary hover:underline">3. Eligibility</a>
          <a href="#term-4" className="hover:text-primary hover:underline">4. User Accounts</a>
          <a href="#term-5" className="hover:text-primary hover:underline">5. Pet Profiles</a>
          <a href="#term-6" className="hover:text-primary hover:underline">6. Acceptable Use</a>
          <a href="#term-7" className="hover:text-primary hover:underline">7. Prohibited Activities</a>
          <a href="#term-8" className="hover:text-primary hover:underline">8. Use of Tools</a>
          <a href="#term-9" className="hover:text-primary hover:underline">9. Calculator Results</a>
          <a href="#term-10" className="hover:text-primary hover:underline">10. Pet & Educational Content</a>
          <a href="#term-11" className="hover:text-primary hover:underline">11. AI Features</a>
          <a href="#term-12" className="hover:text-primary hover:underline">12. AI Limitations</a>
          <a href="#term-13" className="hover:text-primary hover:underline">13. Veterinary Disclaimer</a>
          <a href="#term-14" className="hover:text-primary hover:underline">14. User-Submitted Information</a>
          <a href="#term-15" className="hover:text-primary hover:underline">15. Intellectual Property</a>
          <a href="#term-16" className="hover:text-primary hover:underline">16. Copyright</a>
          <a href="#term-17" className="hover:text-primary hover:underline">17. Trademarks</a>
          <a href="#term-18" className="hover:text-primary hover:underline">18. Third-Party Links</a>
          <a href="#term-19" className="hover:text-primary hover:underline">19. Affiliate Links</a>
          <a href="#term-20" className="hover:text-primary hover:underline">20. Advertising</a>
          <a href="#term-21" className="hover:text-primary hover:underline">21. Service Availability</a>
          <a href="#term-22" className="hover:text-primary hover:underline">22. Changes to FurTools</a>
          <a href="#term-23" className="hover:text-primary hover:underline">23. Account Suspension</a>
          <a href="#term-24" className="hover:text-primary hover:underline">24. Termination</a>
          <a href="#term-25" className="hover:text-primary hover:underline">25. Limitation of Liability</a>
          <a href="#term-26" className="hover:text-primary hover:underline">26. Disclaimer of Warranties</a>
          <a href="#term-27" className="hover:text-primary hover:underline">27. Indemnification</a>
          <a href="#term-28" className="hover:text-primary hover:underline">28. Governing Law</a>
          <a href="#term-29" className="hover:text-primary hover:underline">29. Contact Information</a>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        {/* Section 1 */}
        <section id="term-1" className="scroll-mt-20">
          <h2>1. Acceptance of Terms</h2>
          <p>
            These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you," "user"), and {settings.companyName} ("we," "us," or "our"), concerning your access to and use of the {settings.companyName} website, applications, interactive calculators, breed guides, and AI assistant tools (collectively, the "Services").
          </p>
          <p>
            By accessing or using any portion of our Services, you agree that you have read, understood, and agree to be bound by all of these Terms. If you do not agree with all of these Terms, you are expressly prohibited from using the site and must discontinue use immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section id="term-2" className="mt-10 scroll-mt-20">
          <h2>2. About {settings.companyName}</h2>
          <p>
            {settings.companyName} is a free digital platform providing interactive tools, calculators, breed indexes, care resources, and artificial intelligence utilities for companion animal guardians. Our platform is designed to make pet care data, nutritional planning, and general information accessible and convenient.
          </p>
        </section>

        {/* Section 3 */}
        <section id="term-3" className="mt-10 scroll-mt-20">
          <h2>3. Eligibility</h2>
          <p>
            You must be at least 13 years of age (or the minimum legal age of digital consent in your jurisdiction) to access or use {settings.companyName}. By using our Services, you represent and warrant that you possess the legal capacity to enter into these Terms.
          </p>
        </section>

        {/* Section 4 */}
        <section id="term-4" className="mt-10 scroll-mt-20">
          <h2>4. User Accounts</h2>
          <p>
            While many tools on {settings.companyName} are accessible without registering, certain features (such as saving pet health histories or managing blog posts) may require registering a user account. You agree to provide accurate, current, and complete registration details and maintain the security of your login credentials. You are responsible for all activities occurring under your account.
          </p>
        </section>

        {/* Section 5 */}
        <section id="term-5" className="mt-10 scroll-mt-20">
          <h2>5. Pet Profiles</h2>
          <p>
            Users may create pet profiles within their dashboard to log weight, vaccinations, and medication events. You are solely responsible for ensuring the accuracy of pet profile entries. {settings.companyName} does not verify pet medical history entries and assumes no liability for inaccurate user entries.
          </p>
        </section>

        {/* Section 6 */}
        <section id="term-6" className="mt-10 scroll-mt-20">
          <h2>6. Acceptable Use</h2>
          <p>
            You are granted a limited, non-exclusive, non-transferable, revocable license to access and use {settings.companyName} strictly in accordance with these Terms for personal, non-commercial pet care evaluation and educational purposes.
          </p>
        </section>

        {/* Section 7 */}
        <section id="term-7" className="mt-10 scroll-mt-20">
          <h2>7. Prohibited Activities</h2>
          <p>
            You may not access or use {settings.companyName} for any purpose other than that for which we make the Services available. Prohibited activities include, but are not limited to:
          </p>
          <ul>
            <li>Systematically retrieving data, calculator outputs, or breed entries to create a collection, database, or directory without written permission.</li>
            <li>Using automated scripts, bots, spiders, or scrapers to access or mirror site content.</li>
            <li>Attempting to bypass rate limits, server security controls, or authentication mechanisms.</li>
            <li>Reverse engineering, decompiling, or disassembling site source code.</li>
            <li>Using the Services to transmit spam, malware, or unlawful content.</li>
            <li>Reselling or commercializing calculator outputs or original text as your own proprietary product.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section id="term-8" className="mt-10 scroll-mt-20">
          <h2>8. Use of Tools</h2>
          <p>
            All interactive software tools provided on {settings.companyName}—including calorie calculators, feeding portioners, age converters, water intake calculators, and cost planners—are provided strictly for general estimation and informational purposes.
          </p>
        </section>

        {/* Section 9 */}
        <section id="term-9" className="mt-10 scroll-mt-20">
          <h2>9. Calculator Results and Estimates</h2>
          <p>
            <strong>CALCULATOR OUTPUTS PROVIDE GENERAL ESTIMATES ONLY.</strong> Mathematical formulas embedded within our tools calculate baseline values based on generalized mathematical algorithms (e.g., standard Resting Energy Requirement equations). Actual physiological needs of individual pets vary based on age, breed genetics, neuter status, metabolic variations, body condition score, environmental temperatures, activity levels, and underlying health conditions.
          </p>
          <p>
            You acknowledge and agree that calculator results should never replace professional veterinary evaluation or clinical nutritional formulation. You bear sole responsibility for how you interpret and apply tool results.
          </p>
        </section>

        {/* Section 10 */}
        <section id="term-10" className="mt-10 scroll-mt-20">
          <h2>10. Pet Information and Educational Content</h2>
          <p>
            All text, articles, breed guides, food safety charts, and care guides on {settings.companyName} are designed strictly for educational and informational purposes. While we strive to maintain high editorial standards, care guidelines evolve, and content should not be interpreted as absolute veterinary protocol.
          </p>
        </section>

        {/* Section 11 */}
        <section id="term-11" className="mt-10 scroll-mt-20">
          <h2>11. AI Features</h2>
          <p>
            {settings.companyName} incorporates artificial intelligence chat features and generative tools to answer general pet care questions and offer creative name ideas. AI features generate responses using automated pattern recognition based on large datasets.
          </p>
        </section>

        {/* Section 12 */}
        <section id="term-12" className="mt-10 scroll-mt-20">
          <h2>12. AI Limitations & Error Disclaimers</h2>
          <p>
            <strong>AI OUTPUTS MAY CONTAIN ERRORS OR INACCURACIES.</strong> Machine learning models are subject to algorithmic limitations and may produce inaccurate, incomplete, or out-of-date information (commonly known as AI hallucinations). AI tools on {settings.companyName}:
          </p>
          <ul>
            <li>Do NOT provide licensed veterinary medical diagnosis or emergency triage.</li>
            <li>Should NEVER be relied upon to determine if a ingested substance is toxic in an active crisis.</li>
            <li>Must NEVER supersede the direct medical judgment of a licensed veterinarian.</li>
          </ul>
        </section>

        {/* Section 13 */}
        <section id="term-13" className="mt-10 scroll-mt-20">
          <h2>13. Veterinary Disclaimer</h2>
          <p>
            {settings.companyName} IS NOT A VETERINARY CLINIC OR MEDICAL PROVIDER. OUR EMPLOYEES AND PLATFORM TOOLS DO NOT PROVIDE VETERINARY MEDICAL ADVICE, DIAGNOSIS, PRESCRIBING, OR CLINICAL TREATMENT. USE OF OUR SERVICES DOES NOT CREATE A VETERINARIAN-PATIENT OR CONFIDENTIAL CLINICAL RELATIONSHIP.
          </p>
          <p>
            Always consult a licensed veterinarian regarding medical conditions, diet changes, or health concerns. Never disregard professional veterinary advice or delay seeking veterinary medical treatment because of something you read or calculated on {settings.companyName}.
          </p>
        </section>

        {/* Section 14 */}
        <section id="term-14" className="mt-10 scroll-mt-20">
          <h2>14. User-Submitted Information</h2>
          <p>
            If you submit feedback, messages through our contact form, or user-generated comments, you grant {settings.companyName} a non-exclusive, worldwide, royalty-free, perpetual license to use, reproduce, and adapt your feedback to improve our Services.
          </p>
        </section>

        {/* Section 15 */}
        <section id="term-15" className="mt-10 scroll-mt-20">
          <h2>15. Intellectual Property</h2>
          <p>
            Unless otherwise indicated, the website, source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on {settings.companyName} (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by {settings.companyName} and are protected by copyright, trademark, and intellectual property laws.
          </p>
        </section>

        {/* Section 16 */}
        <section id="term-16" className="mt-10 scroll-mt-20">
          <h2>16. Copyright Notice</h2>
          <p>
            © {new Date().getFullYear()} {settings.companyName}. All rights reserved. No part of the Content may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever without our express prior written permission.
          </p>
        </section>

        {/* Section 17 */}
        <section id="term-17" className="mt-10 scroll-mt-20">
          <h2>17. Trademarks</h2>
          <p>
            The name "{settings.companyName}", the paw print logo, and related design marks are trade dress and service marks of {settings.companyName}. All other product names, logos, and brands referenced on our site are the property of their respective owners.
          </p>
        </section>

        {/* Section 18 */}
        <section id="term-18" className="mt-10 scroll-mt-20">
          <h2>18. Third-Party Links</h2>
          <p>
            Our Services may contain links to third-party websites, applications, or resources. {settings.companyName} is not responsible or liable for the availability, content, privacy policies, or practices of third-party external sites.
          </p>
        </section>

        {/* Section 19 */}
        <section id="term-19" className="mt-10 scroll-mt-20">
          <h2>19. Affiliate Links</h2>
          <p>
            {settings.companyName} may participate in affiliate marketing programs (such as Amazon Associates or Chewy affiliate programs). Some links on our site may contain affiliate tracking codes. If you click on an affiliate link and make a purchase, we may receive a small referral commission at no additional cost to you.
          </p>
        </section>

        {/* Section 20 */}
        <section id="term-20" className="mt-10 scroll-mt-20">
          <h2>20. Advertising</h2>
          <p>
            Advertisements displayed on {settings.companyName} are served by third-party ad networks (such as Google AdSense). We do not endorse third-party products advertised on our platform, and users are responsible for evaluating third-party offers independently.
          </p>
        </section>

        {/* Section 21 */}
        <section id="term-21" className="mt-10 scroll-mt-20">
          <h2>21. Service Availability</h2>
          <p>
            We strive to maintain continuous uptime for {settings.companyName}. However, we do not guarantee uninterrupted, error-free service access. System maintenance, server upgrades, or external network failures may temporarily disrupt site availability.
          </p>
        </section>

        {/* Section 22 */}
        <section id="term-22" className="mt-10 scroll-mt-20">
          <h2>22. Changes to {settings.companyName}</h2>
          <p>
            We reserve the right to change, modify, update, suspend, or discontinue any feature or calculator on {settings.companyName} at any time without prior notice.
          </p>
        </section>

        {/* Section 23 */}
        <section id="term-23" className="mt-10 scroll-mt-20">
          <h2>23. Account Suspension</h2>
          <p>
            We reserve the right to suspend or disable accounts that violate these Terms, engage in abusive API calls, attempt site scraping, or disrupt service security.
          </p>
        </section>

        {/* Section 24 */}
        <section id="term-24" className="mt-10 scroll-mt-20">
          <h2>24. Termination</h2>
          <p>
            You may terminate your account at any time by deleting your profile in account settings or contacting support. Upon termination, your right to access saved profile records ceases immediately.
          </p>
        </section>

        {/* Section 25 */}
        <section id="term-25" className="mt-10 scroll-mt-20">
          <h2>25. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL {settings.companyName}, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER (INCLUDING LOST PROFITS, PET MEDICAL EXPENSES, LOSS OF DATA, OR PROPERTY DAMAGE) RESULTING FROM YOUR USE OF OR INABILITY TO USE OUR SERVICES, CALCULATORS, CONTENT, OR AI FEATURES.
          </p>
        </section>

        {/* Section 26 */}
        <section id="term-26" className="mt-10 scroll-mt-20">
          <h2>26. Disclaimer of Warranties</h2>
          <p>
            OUR SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
        </section>

        {/* Section 27 */}
        <section id="term-27" className="mt-10 scroll-mt-20">
          <h2>27. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless {settings.companyName} and its affiliates from and against any claims, liabilities, damages, losses, or expenses (including reasonable legal fees) arising out of your violation of these Terms or misuse of tool outputs.
          </p>
        </section>

        {/* Section 28 */}
        <section id="term-28" className="mt-10 scroll-mt-20">
          <h2>28. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law principles. Any legal action arising from these Terms shall be resolved in appropriate jurisdiction courts.
          </p>
        </section>

        {/* Section 29 */}
        <section id="term-29" className="mt-10 border-t border-border/60 pt-8 scroll-mt-20">
          <h2>29. Contact Information</h2>
          <p>
            If you have questions or legal notices concerning these Terms of Service, please contact us:
          </p>
          <div className="not-prose my-4 rounded-xl border border-border/80 bg-card p-6">
            <p className="font-semibold text-foreground">{settings.companyName} Legal Department</p>
            <p className="text-sm text-muted-foreground mt-1">{settings.businessAddress}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Support Email: <a href={`mailto:${settings.supportEmail}`} className="text-primary hover:underline font-medium">{settings.supportEmail}</a>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Contact Form: <Link to="/contact" className="text-primary hover:underline font-medium">furtools.com/contact</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
