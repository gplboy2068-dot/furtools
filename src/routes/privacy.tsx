import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { ShieldCheck, Lock, Eye, Cookie, Cpu, Globe, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — FurTools" },
      {
        name: "description",
        content:
          "Comprehensive Privacy Policy for FurTools. Detailed explanations of data collection, cookies, Google AdSense, AI sub-processors, security, GDPR, and California privacy rights.",
      },
      { property: "og:title", content: "Privacy Policy — FurTools" },
      {
        property: "og:description",
        content:
          "Comprehensive Privacy Policy for FurTools. Detailed explanations of data collection, cookies, Google AdSense, AI sub-processors, security, GDPR, and California privacy rights.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Privacy Policy — FurTools" },
      {
        name: "twitter:description",
        content: "Learn how FurTools protects your privacy, handles cookies, AdSense, AI features, and personal data.",
      },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
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
            { name: "Privacy", url: "/privacy" },
          ]),
        ),
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const settings = useSiteSettings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Privacy" }]} />

      {/* Title & Metadata Header */}
      <div className="mt-6 border-b border-border/60 pb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Privacy Policy
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
          <ShieldCheck className="size-5 text-primary" />
          Policy Structure & Outline
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This document outlines how {settings.companyName} collects, processes, and protects your information across our website and applications.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
          <a href="#sec-1" className="hover:text-primary hover:underline">1. Introduction</a>
          <a href="#sec-2" className="hover:text-primary hover:underline">2. Information We Collect</a>
          <a href="#sec-3" className="hover:text-primary hover:underline">3. Information You Provide</a>
          <a href="#sec-4" className="hover:text-primary hover:underline">4. Account Information</a>
          <a href="#sec-5" className="hover:text-primary hover:underline">5. Pet Profile Information</a>
          <a href="#sec-6" className="hover:text-primary hover:underline">6. Tool Usage Information</a>
          <a href="#sec-7" className="hover:text-primary hover:underline">7. Device & Technical Info</a>
          <a href="#sec-8" className="hover:text-primary hover:underline">8. Cookies & Technologies</a>
          <a href="#sec-9" className="hover:text-primary hover:underline">9. Analytics</a>
          <a href="#sec-10" className="hover:text-primary hover:underline">10. Advertising</a>
          <a href="#sec-11" className="hover:text-primary hover:underline">11. Google AdSense</a>
          <a href="#sec-12" className="hover:text-primary hover:underline">12. Third-Party Ad Vendors</a>
          <a href="#sec-13" className="hover:text-primary hover:underline">13. Personalized Advertising</a>
          <a href="#sec-14" className="hover:text-primary hover:underline">14. Managing Ad Preferences</a>
          <a href="#sec-15" className="hover:text-primary hover:underline">15. AI Services</a>
          <a href="#sec-16" className="hover:text-primary hover:underline">16. How We Use Information</a>
          <a href="#sec-17" className="hover:text-primary hover:underline">17. How We Store Information</a>
          <a href="#sec-18" className="hover:text-primary hover:underline">18. Data Security</a>
          <a href="#sec-19" className="hover:text-primary hover:underline">19. Data Retention</a>
          <a href="#sec-20" className="hover:text-primary hover:underline">20. Information Sharing</a>
          <a href="#sec-21" className="hover:text-primary hover:underline">21. Service Providers</a>
          <a href="#sec-22" className="hover:text-primary hover:underline">22. User Rights</a>
          <a href="#sec-23" className="hover:text-primary hover:underline">23. Account Deletion</a>
          <a href="#sec-24" className="hover:text-primary hover:underline">24. Data Deletion Requests</a>
          <a href="#sec-25" className="hover:text-primary hover:underline">25. Children's Privacy</a>
          <a href="#sec-26" className="hover:text-primary hover:underline">26. International Users</a>
          <a href="#sec-27" className="hover:text-primary hover:underline">27. GDPR Rights</a>
          <a href="#sec-28" className="hover:text-primary hover:underline">28. California Privacy Rights</a>
          <a href="#sec-29" className="hover:text-primary hover:underline">29. Policy Changes</a>
          <a href="#sec-30" className="hover:text-primary hover:underline">30. Contact Information</a>
        </div>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        {/* Section 1 */}
        <section id="sec-1" className="scroll-mt-20">
          <h2>1. Introduction</h2>
          <p>
            Welcome to {settings.companyName} ("we," "our," or "us"). Operating from {settings.businessAddress}, {settings.companyName} is committed to maintaining robust privacy protections for our users. This Privacy Policy governs your access to and use of our website, web applications, calculators, generators, tools, and related digital services (collectively, the "Services").
          </p>
          <p>
            By accessing or using {settings.companyName}, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy and our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
          </p>
        </section>

        {/* Section 2 */}
        <section id="sec-2" className="mt-10 scroll-mt-20">
          <h2>2. Information We Collect</h2>
          <p>
            {settings.companyName} collects information to provide better, more tailored pet care tools to all of our users. We strive to collect only the minimum necessary data required to deliver high-quality, responsive web services. The categories of information we collect depend on how you interact with our platform.
          </p>
        </section>

        {/* Section 3 */}
        <section id="sec-3" className="mt-10 scroll-mt-20">
          <h2>3. Information You Provide Directly</h2>
          <p>
            When you interact with {settings.companyName}, you may voluntarily provide certain personal information. This includes details submitted when filling out our contact form, signing up for an optional user account, creating pet profiles, submitting feedback, or typing prompts into interactive tools.
          </p>
        </section>

        {/* Section 4 */}
        <section id="sec-4" className="mt-10 scroll-mt-20">
          <h2>4. Account Information</h2>
          <p>
            If you create a user account on {settings.companyName} (such as for saving pet health records or managing blog posts), we collect authentication information via our backend database service provider, Supabase (and Lovable Cloud). This information may include your email address, display name, profile avatar URL, and encrypted password hash.
          </p>
        </section>

        {/* Section 5 */}
        <section id="sec-5" className="mt-10 scroll-mt-20">
          <h2>5. Pet Profile Information</h2>
          <p>
            Users who utilize our pet health dashboard may choose to create pet profiles. The information stored in pet profiles includes pet name, species (e.g., dog, cat, rabbit, bird, horse), breed, birthdate, weight history, vaccination logs, medication schedules, vet visit records, and dietary preferences. Pet profile data is stored securely in our database and linked strictly to your authenticated account ID.
          </p>
        </section>

        {/* Section 6 */}
        <section id="sec-6" className="mt-10 scroll-mt-20">
          <h2>6. Tool Usage Information</h2>
          <p>
            Our core standalone pet tools—such as basic calorie calculators, food portion generators, and name generators—are engineered to execute client-side within your browser. The specific numbers, weights, or names you enter into standalone calculator fields are processed locally in your browser session and are not transmitted to or stored on our servers unless you explicitly save them to an authenticated pet profile.
          </p>
        </section>

        {/* Section 7 */}
        <section id="sec-7" className="mt-10 scroll-mt-20">
          <h2>7. Device and Technical Information</h2>
          <p>
            Like most modern websites, when you visit {settings.companyName}, our servers and infrastructure automatically log technical details sent by your browser. This standard server log data includes your Internet Protocol (IP) address, browser type and version, operating system, referring URL, pages viewed, time spent on pages, date and time stamp, and language preferences.
          </p>
        </section>

        {/* Section 8 */}
        <section id="sec-8" className="mt-10 scroll-mt-20">
          <h2>8. Cookies and Similar Technologies</h2>
          <p>
            {settings.companyName} uses cookies, local storage objects (localStorage), and web beacons to enhance site functionality and deliver customized user experiences.
          </p>
          <ul>
            <li>
              <strong>Essential & Preference Cookies:</strong> We store local browser keys to remember your chosen visual theme (dark or light mode) and selected interface language preference.
            </li>
            <li>
              <strong>Session Cookies:</strong> Temporary cookies used to keep you authenticated during active dashboard sessions.
            </li>
          </ul>
        </section>

        {/* Section 9 */}
        <section id="sec-9" className="mt-10 scroll-mt-20">
          <h2>9. Analytics</h2>
          <p>
            Where enabled, {settings.companyName} utilizes Google Analytics (a web analytics service provided by Google LLC) to analyze overall site traffic patterns, popular calculators, and general user navigation trends. Google Analytics uses cookies to aggregate non-identifiable usage statistics. IP anonymization features are enabled to protect user identity. You can opt out of Google Analytics tracking across all websites by installing the official Google Analytics Opt-out Browser Add-on.
          </p>
        </section>

        {/* Section 10 */}
        <section id="sec-10" className="mt-10 scroll-mt-20">
          <h2>10. Advertising</h2>
          <p>
            To keep our pet calculators, breed guides, and care tools 100% free for pet owners worldwide, {settings.companyName} displays online banner advertisements. We partner with reputable third-party advertising networks and programmatic supply partners to display relevant ads.
          </p>
        </section>

        {/* Section 11 */}
        <section id="sec-11" className="mt-10 scroll-mt-20">
          <h2>11. Google AdSense</h2>
          <p>
            {settings.companyName} utilizes Google AdSense to serve ads when you visit our site. Google uses cookies (including the DoubleClick cookie) to serve ads based on a user's prior visits to {settings.companyName} or other websites on the Internet.
          </p>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to {settings.companyName} and/or other sites on the Internet.
          </p>
        </section>

        {/* Section 12 */}
        <section id="sec-12" className="mt-10 scroll-mt-20">
          <h2>12. Third-Party Advertising Vendors</h2>
          <p>
            Third-party vendors and ad networks, including Google, serve ads on {settings.companyName}. These vendors may place and read cookies on your browser, or use web beacons to collect non-personally identifiable information in the course of ads being served on our platform. Third-party ad serving technology automatically receives your IP address when an ad is delivered to your browser.
          </p>
        </section>

        {/* Section 13 */}
        <section id="sec-13" className="mt-10 scroll-mt-20">
          <h2>13. Personalized Advertising</h2>
          <p>
            Depending on your jurisdiction and cookie consent choices, advertisements served on {settings.companyName} may be personalized (tailored to your inferred interests based on past browsing history) or non-personalized (contextual ads based on the specific page content viewed, such as dog food safety articles).
          </p>
        </section>

        {/* Section 14 */}
        <section id="sec-14" className="mt-10 scroll-mt-20">
          <h2>14. How Users Can Manage Advertising Preferences</h2>
          <p>
            Users can easily control, customize, or disable personalized advertising cookies:
          </p>
          <ul>
            <li>
              <strong>Google Ad Settings:</strong> You can opt out of personalized advertising from Google by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ad Settings</a>.
            </li>
            <li>
              <strong>Network Advertising Initiative:</strong> You may opt out of third-party vendor use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aboutads.info</a>.
            </li>
            <li>
              <strong>Browser Controls:</strong> You can configure your web browser settings to block or notify you when cookies are placed.
            </li>
          </ul>
        </section>

        {/* Section 15 */}
        <section id="sec-15" className="mt-10 scroll-mt-20">
          <h2>15. AI Services and Sub-Processors</h2>
          <p>
            {settings.companyName} offers interactive AI-powered pet assistants (such as general pet care chat tools). When you use AI features, the text prompts and pet information you type into the AI chat interface are sent to our underlying AI sub-processor gateways (such as Lovable AI Gateway, Google Gemini API, OpenAI API, Anthropic Claude, or DeepSeek API) solely to process your input and generate intelligent, contextual responses.
          </p>
          <p>
            We instruct AI sub-processors to process queries statelessly and do not permit third-party AI models to use your private inputs to train public foundation models. We advise users never to submit sensitive financial or personally identifiable human information into AI prompts.
          </p>
        </section>

        {/* Section 16 */}
        <section id="sec-16" className="mt-10 scroll-mt-20">
          <h2>16. How We Use Information</h2>
          <p>
            We use the information we collect for legitimate business purposes, including:
          </p>
          <ul>
            <li>Operating, maintaining, and enhancing our pet calculators, tools, and content.</li>
            <li>Processing user contact form submissions and responding to support tickets.</li>
            <li>Enabling authenticated account access, pet profile storage, and user preferences.</li>
            <li>Monitoring and preventing server abuse, fraudulent scraping, and security breaches.</li>
            <li>Serving online advertisements that keep our core services free for users worldwide.</li>
            <li>Analyzing aggregate web traffic statistics to design better user interfaces.</li>
          </ul>
        </section>

        {/* Section 17 */}
        <section id="sec-17" className="mt-10 scroll-mt-20">
          <h2>17. How We Store Information</h2>
          <p>
            Account details and pet profile data are stored in managed, encrypted cloud database instances managed by Supabase, located in secure data center facilities with industry-standard physical and network protections. Client-side preferences (such as dark mode toggles) remain stored locally within your individual web browser.
          </p>
        </section>

        {/* Section 18 */}
        <section id="sec-18" className="mt-10 scroll-mt-20">
          <h2>18. Data Security</h2>
          <p>
            We implement administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, loss, alteration, or misuse. All HTTP connections on {settings.companyName} are encrypted in transit using Transport Layer Security (TLS 1.2/1.3 / HTTPS). However, no internet transmission or electronic database storage system can guarantee 100% security.
          </p>
        </section>

        {/* Section 19 */}
        <section id="sec-19" className="mt-10 scroll-mt-20">
          <h2>19. Data Retention</h2>
          <p>
            We retain personal information only for as long as necessary to fulfill the purposes for which it was collected, including satisfying legal, accounting, or security requirements. Server log data is routinely purged. If you delete your account or pet profile, the associated records are promptly purged from our active production database.
          </p>
        </section>

        {/* Section 20 */}
        <section id="sec-20" className="mt-10 scroll-mt-20">
          <h2>20. When Information May Be Shared</h2>
          <p>
            <strong>{settings.companyName} DOES NOT SELL YOUR PERSONAL DATA.</strong> We do not rent, trade, or sell personal identifiers or pet data to data brokers. We share information only under the following limited circumstances:
          </p>
          <ul>
            <li>
              <strong>With Trusted Service Providers:</strong> Vendor infrastructure providers who assist in operating our platform (e.g., Supabase for database hosting, Vercel/Cloudflare for hosting/CDN, Google AdSense for ad rendering).
            </li>
            <li>
              <strong>Legal Requirements:</strong> If required to do so by law, subpoena, court order, or governmental regulation.
            </li>
            <li>
              <strong>Protection of Rights:</strong> When necessary to enforce our Terms of Service, defend against legal claims, or protect the safety and rights of {settings.companyName}, our users, or the public.
            </li>
          </ul>
        </section>

        {/* Section 21 */}
        <section id="sec-21" className="mt-10 scroll-mt-20">
          <h2>21. Service Providers</h2>
          <p>
            We engage vetted third-party service providers to perform specific operational functions:
          </p>
          <ul>
            <li><strong>Database & Authentication:</strong> Supabase / Lovable Cloud</li>
            <li><strong>Advertising Infrastructure:</strong> Google AdSense & certified Google ad partner vendors</li>
            <li><strong>Analytics:</strong> Google Analytics (IP-anonymized)</li>
            <li><strong>AI Gateway:</strong> Lovable AI Gateway, Google Gemini API, OpenAI API, Anthropic, DeepSeek</li>
          </ul>
        </section>

        {/* Section 22 */}
        <section id="sec-22" className="mt-10 scroll-mt-20">
          <h2>22. User Rights</h2>
          <p>
            Depending on your geographic location, you have rights regarding your personal information, including the right to inspect, correct, update, or request deletion of data held by {settings.companyName}.
          </p>
        </section>

        {/* Section 23 */}
        <section id="sec-23" className="mt-10 scroll-mt-20">
          <h2>23. Account Deletion</h2>
          <p>
            Registered users can initiate account deletion directly within their account settings dashboard or by submitting a request through our <Link to="/contact" className="text-primary hover:underline">Contact Page</Link>. Deleting an account permanently removes all linked pet profiles, health logs, and saved custom parameters.
          </p>
        </section>

        {/* Section 24 */}
        <section id="sec-24" className="mt-10 scroll-mt-20">
          <h2>24. Data Deletion Requests</h2>
          <p>
            To submit a formal request to delete any personal information associated with your email address, send an email to <a href={`mailto:${settings.privacyEmail}`} className="text-primary hover:underline">{settings.privacyEmail}</a> with the subject line <em>Data Deletion Request</em>. We will verify and process your request within 30 days.
          </p>
        </section>

        {/* Section 25 */}
        <section id="sec-25" className="mt-10 scroll-mt-20">
          <h2>25. Children's Privacy</h2>
          <p>
            {settings.companyName} is intended for general audiences and pet owners aged 13 and older (or 16 in certain jurisdictions). We do not knowingly collect or solicit personal information from children under the age of 13. If we learn that we have inadvertently collected personal data from a child under 13, we will promptly delete that information from our records.
          </p>
        </section>

        {/* Section 26 */}
        <section id="sec-26" className="mt-10 scroll-mt-20">
          <h2>26. International Users</h2>
          <p>
            {settings.companyName} is hosted and operated across global cloud infrastructure. If you access our Services from outside the United States, please be aware that your information may be transferred to, stored, and processed in servers located in the United States and other server locations where our cloud service providers operate.
          </p>
        </section>

        {/* Section 27 */}
        <section id="sec-27" className="mt-10 scroll-mt-20">
          <h2>27. GDPR Rights (Where Applicable)</h2>
          <p>
            For users residing in the European Economic Area (EEA), United Kingdom, or Switzerland, the General Data Protection Regulation (GDPR) grants specific legal rights:
          </p>
          <ul>
            <li><strong>Right of Access:</strong> Request a copy of personal data we hold about you.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal data.</li>
            <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your personal data.</li>
            <li><strong>Right to Restrict Processing:</strong> Request restrictions on processing activities.</li>
            <li><strong>Right to Data Portability:</strong> Receive a machine-readable copy of your personal data.</li>
            <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing.</li>
          </ul>
          <p>
            Our legal basis for processing data includes performance of a contract (providing requested tools), compliance with legal obligations, and our legitimate interest in delivering a secure platform.
          </p>
        </section>

        {/* Section 28 */}
        <section id="sec-28" className="mt-10 scroll-mt-20">
          <h2>28. California Privacy Rights (Where Applicable)</h2>
          <p>
            Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have specific privacy rights:
          </p>
          <ul>
            <li><strong>Right to Know:</strong> Request disclosure of the categories and specific pieces of personal information collected.</li>
            <li><strong>Right to Delete:</strong> Request deletion of personal information collected from you.</li>
            <li><strong>Right to Opt-Out of Sale/Sharing:</strong> We state explicitly that <strong>{settings.companyName} DOES NOT SELL YOUR PERSONAL INFORMATION</strong>.</li>
            <li><strong>Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA/CPRA rights.</li>
          </ul>
        </section>

        {/* Section 29 */}
        <section id="sec-29" className="mt-10 scroll-mt-20">
          <h2>29. Changes to This Privacy Policy</h2>
          <p>
            We reserve the right to modify or update this Privacy Policy at any time to reflect operational, legal, or regulatory changes. When updates are published, we will revise the "Last Updated" date at the top of this page. We encourage users to review this page periodically to remain informed about how we safeguard personal data.
          </p>
        </section>

        {/* Section 30 */}
        <section id="sec-30" className="mt-10 border-t border-border/60 pt-8 scroll-mt-20">
          <h2>30. Contact Information</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please contact our Data Privacy Officer:
          </p>
          <div className="not-prose my-4 rounded-xl border border-border/80 bg-card p-6">
            <p className="font-semibold text-foreground">{settings.companyName} Legal & Privacy Department</p>
            <p className="text-sm text-muted-foreground mt-1">{settings.businessAddress}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Privacy Email: <a href={`mailto:${settings.privacyEmail}`} className="text-primary hover:underline font-medium">{settings.privacyEmail}</a>
            </p>
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
