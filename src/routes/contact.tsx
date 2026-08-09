import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Mail, MessageSquare, ShieldCheck, Bug, Sparkles, HelpCircle, FileText, Briefcase, Lock, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact FurTools — Support, Tool Feedback & General Inquiries" },
      {
        name: "description",
        content:
          "Reach out to the FurTools team. Submit feedback, report incorrect information, suggest new pet tools, or request partnership and privacy assistance.",
      },
      { property: "og:title", content: "Contact FurTools — Support, Tool Feedback & General Inquiries" },
      {
        property: "og:description",
        content:
          "Reach out to the FurTools team. Submit feedback, report incorrect information, suggest new pet tools, or request partnership and privacy assistance.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contact FurTools" },
      {
        name: "twitter:description",
        content:
          "Send us tool feedback, bug reports, feature suggestions, or business inquiries.",
      },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
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
            { name: "Contact", url: "/contact" },
          ]),
        ),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const settings = useSiteSettings();
  const [sending, setSending] = useState(false);
  const [category, setCategory] = useState("General Question");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Contact" }]} />

      {/* Header */}
      <div className="mt-6 border-b border-border/60 pb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Contact {settings.companyName}
        </h1>
        <p className="mt-4 text-xl leading-relaxed text-muted-foreground">
          We welcome communication from our global community of pet parents, veterinary professionals, developers, and media partners. Whether you have a question about a calculator, want to suggest a new tool, or need technical assistance, we are here to help.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        {/* Interactive Form Section (5 Columns on Desktop) */}
        <div className="lg:col-span-6 border border-border/80 bg-card p-6 sm:p-8 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Mail className="size-5 text-primary" />
            Send Us a Message
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill out the form below and our dedicated support team will review your inquiry promptly.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSending(true);
              setTimeout(() => {
                setSending(false);
                toast.success("Thanks — we'll get back to you soon.");
                (e.target as HTMLFormElement).reset();
                setCategory("General Question");
              }, 400);
            }}
          >
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" required placeholder="Jane Doe" className="mt-1.5" />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" required placeholder="jane@example.com" className="mt-1.5" />
            </div>

            <div>
              <Label htmlFor="category">Inquiry Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="General Question">General Question</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Content Correction">Content Correction</option>
                <option value="Tool Suggestion">Tool Suggestion</option>
                <option value="Partnership">Partnership</option>
                <option value="Advertising">Advertising</option>
                <option value="Privacy">Privacy</option>
                <option value="Copyright">Copyright</option>
              </select>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                required
                rows={5}
                placeholder="Please describe your question, feedback, or report in detail..."
                className="mt-1.5"
              />
            </div>

            <Button type="submit" disabled={sending} className="w-full rounded-full font-medium">
              {sending ? "Sending Message..." : "Send Message"}
            </Button>
          </form>

          <div className="mt-6 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <p>
              Direct Email Support:{" "}
              <a href={`mailto:${settings.supportEmail}`} className="text-primary hover:underline font-medium">
                {settings.supportEmail}
              </a>
            </p>
            <p className="mt-1">
              Response Time: Typically within 24 to 48 business hours.
            </p>
          </div>
        </div>

        {/* Informational Guidance (6 Columns on Desktop) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-6">
            <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Bug className="size-5 text-primary" />
              What to Include When Reporting a Problem
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              To help our engineering team troubleshoot technical bugs or calculator errors quickly, please try to include the following details in your message:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
              <li><strong>The exact page URL:</strong> e.g., <code>/tools/dog-calorie-calculator</code></li>
              <li><strong>Your Device & Browser:</strong> e.g., iPhone 15 on Safari, or Windows 11 on Chrome</li>
              <li><strong>Inputs entered:</strong> The exact numbers, species, or options selected before the issue occurred</li>
              <li><strong>Description of the bug:</strong> What happened vs. what you expected to happen</li>
              <li><strong>Error Messages:</strong> Any exact text displayed on screen</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="size-5 text-primary" />
              Common Contact Topics & Guidelines
            </h3>

            <div className="mt-4 space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="size-4 text-primary" /> General Questions
                </h4>
                <p className="mt-0.5">
                  Have questions about how {settings.companyName} works or how our formulas function? Check our <Link to="/about" className="text-primary hover:underline">About Page</Link> for detailed background.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="size-4 text-primary" /> Tool Feedback & Suggestions
                </h4>
                <p className="mt-0.5">
                  We love community-driven ideas! If you want to see a specific calculator, species guide, or generator, submit a Tool Suggestion.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                  <FileText className="size-4 text-primary" /> Report Incorrect Information & Content Corrections
                </h4>
                <p className="mt-0.5">
                  We strive for complete accuracy. If you spot a factual typo, outdated food safety rating, or calculation discrepancy, select <em>Content Correction</em> so our editors can review it.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                  <Briefcase className="size-4 text-primary" /> Partnership, Advertising & Affiliate Inquiries
                </h4>
                <p className="mt-0.5">
                  For brand collaborations, media requests, sponsorship opportunities, or affiliate network inquiries, choose <em>Partnership</em> or <em>Advertising</em>.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="size-4 text-primary" /> Privacy & Data Requests
                </h4>
                <p className="mt-0.5">
                  For account deletion requests, data access inquiries, or cookie questions, choose <em>Privacy</em> or email <a href={`mailto:${settings.privacyEmail}`} className="text-primary hover:underline">{settings.privacyEmail}</a>. Learn more in our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="size-4 text-primary" /> Copyright & DMCA Requests
                </h4>
                <p className="mt-0.5">
                  If you believe intellectual property owned by you has been posted on {settings.companyName} without authorization, please select <em>Copyright</em> and submit your notice under our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Veterinary Disclaimer Box */}
      <div className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-foreground">
        <h3 className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-2 text-base">
          <ShieldCheck className="size-5 text-amber-600 dark:text-amber-400" />
          Important Emergency Medical Notice
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          {settings.companyName} does not provide veterinary medical services, emergency triage, or direct health diagnosis. If your pet is experiencing severe distress, breathing difficulty, acute trauma, suspected toxic ingestion, or any urgent medical emergency, <strong>do not wait for an email response</strong>. Please contact a licensed local emergency veterinary hospital or pet poison control hotline immediately. Read our full <Link to="/disclaimer" className="text-primary font-medium hover:underline">Disclaimer</Link> for details.
        </p>
      </div>
    </div>
  );
}
