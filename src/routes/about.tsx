import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Faq } from "@/components/faq";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { ShieldCheck, Heart, Sparkles, Calculator, BookOpen, Cpu, Users, Target, Compass } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FurTools — Mission, Free Pet Tools & Companion Care Resources" },
      {
        name: "description",
        content:
          "Discover FurTools: a free, comprehensive platform providing pet calculators, breed guides, health trackers, food safety insights, cost planners, and AI pet care assistants.",
      },
      { property: "og:title", content: "About FurTools — Mission, Free Pet Tools & Companion Care Resources" },
      {
        property: "og:description",
        content:
          "Discover FurTools: a free, comprehensive platform providing pet calculators, breed guides, health trackers, food safety insights, cost planners, and AI pet care assistants.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About FurTools — Free Tools for Pet Parents" },
      {
        name: "twitter:description",
        content:
          "Comprehensive pet calculators, breed databases, health tracking, and AI guidance for dogs, cats, birds, small animals, and exotic pets.",
      },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
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
            { name: "About", url: "/about" },
          ]),
        ),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const settings = useSiteSettings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "About" }]} />

      {/* Header Banner */}
      <div className="mt-6 border-b border-border/60 pb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          About {settings.companyName}
        </h1>
        <p className="mt-4 text-xl leading-relaxed text-muted-foreground">
          {settings.companyName} is an independent, specialized digital ecosystem dedicated to empowering pet parents, caregivers, and animal enthusiasts across the globe. We build intuitive calculators, evidence-informed guides, interactive tracking dashboards, and artificial intelligence powered tools designed to make everyday pet ownership simpler, safer, and far more rewarding.
        </p>
      </div>

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        {/* Section 1: What FurTools Is */}
        <section id="what-is-furtools" className="scroll-mt-20">
          <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground">
            <Compass className="size-6 text-primary" />
            What is {settings.companyName}?
          </h2>
          <p>
            {settings.companyName} was founded on a simple truth: loving a pet is one of life's greatest joys, but navigating companion care can often feel overwhelming. From calculating precise daily caloric targets for a growing puppy to estimating equine feeding schedules or checking whether human food ingredients are toxic to feline family members, pet owners deal with complex, data-driven decisions every single day.
          </p>
          <p>
            Our platform brings together interactive software engineering, animal wellness data, and accessible content design into a single unified resource. Whether you require a rapid calculation, an in-depth breed comparison, or a structured budget planner for lifetime pet expenditures, {settings.companyName} delivers instant, high-utility answers right in your browser without paywalls, mandatory software installs, or intrusive advertising walls.
          </p>
        </section>

        {/* Section 2: Our Mission */}
        <section id="our-mission" className="mt-12 scroll-mt-20">
          <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground">
            <Target className="size-6 text-primary" />
            Our Mission
          </h2>
          <p>
            At {settings.companyName}, our mission is to make actionable, high-quality pet care tools and educational information universally accessible to companion animal guardians everywhere.
          </p>
          <p>
            We believe that financial constraints or lack of digital tool access should never stand between a pet parent and optimal care decisions. We achieve this mission through three foundational pillars:
          </p>
          <ul>
            <li>
              <strong>Uncompromising Accessibility:</strong> Every standard calculator, generator, and educational resource on {settings.companyName} is 100% free to use.
            </li>
            <li>
              <strong>Privacy-First Architecture:</strong> Your pet's data belongs to you. Our core calculators run entirely client-side inside your browser, ensuring your inputs and personal preferences remain private.
            </li>
            <li>
              <strong>Empowerment Through Education:</strong> We provide reliable baseline information that helps pet owners communicate more effectively with their licensed veterinary professionals.
            </li>
          </ul>
        </section>

        {/* Section 3: Who FurTools Is Designed For */}
        <section id="who-furtools-is-for" className="mt-12 scroll-mt-20">
          <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground">
            <Users className="size-6 text-primary" />
            Who {settings.companyName} is Designed For
          </h2>
          <p>
            {settings.companyName} is engineered to support a diverse spectrum of animal care species and owner needs. We recognize that every companion animal possesses unique physiological traits, dietary requirements, and behavioral profiles. Our specialized tool suites cater to:
          </p>

          <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-display font-semibold text-foreground">🐶 Dog Owners</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                From puppy growth tracking and dry kibble intake formulas to canine age converters, crate size calculators, and breed temperament comparisons.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-display font-semibold text-foreground">🐱 Cat Owners</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Feline hydration monitors, raw/canned food portioners, litter box placement planners, cat age translators, and ingredient toxicity checkers.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-display font-semibold text-foreground">🦜 Bird Owners</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Avian dietary pellet ratios, cage volume estimators, humidity level guides, and species life expectancy lookup tools for parrots, finches, and cockatiels.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-display font-semibold text-foreground">🐰 Rabbit Owners</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Lagomorph hay balance calculators, leafy green portion estimators, space enclosure requirements, and GI stasis awareness checklists.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-display font-semibold text-foreground">🐠 Fish & Aquarium Hobbyists</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Tank volume calculators, bio-load capacity estimators, water change frequency planners, and freshwater to saltwater conversion utilities.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-display font-semibold text-foreground">🐹 Hamster & Small Pet Guardians</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Bedding depth guides, wheel diameter selectors, pocket pet life stage charts, and daily seed mix calculators for hamsters, guinea pigs, and gerbils.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-display font-semibold text-foreground">🐴 Horse & Equine Caretakers</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Equine weight estimation metrics, forage ratio calculators, paddock size planners, and seasonal deworming schedule logs.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-primary/50">
              <h3 className="font-display font-semibold text-foreground">🦎 Other Companion & Exotic Animals</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Habitat lighting schedule trackers, enclosure temperature gradient guides, and specialty care resources for ferrets, turtles, and reptiles.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: What We Offer */}
        <section id="what-we-offer" className="mt-12 scroll-mt-20">
          <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground">
            <Calculator className="size-6 text-primary" />
            What We Offer
          </h2>
          <p>
            The {settings.companyName} directory hosts a expansive range of companion care resources designed to solve specific daily challenges. Explore our key offerings below:
          </p>

          <ul>
            <li>
              <strong><Link to="/categories" className="text-primary hover:underline">Pet Calculators</Link>:</strong> Interactive tools for calculating Resting Energy Requirements (RER), Maintenance Energy Requirements (MER), ideal weight ranges, body condition scores (BCS), and age in human years.
            </li>
            <li>
              <strong>Pet Planners & Schedulers:</strong> Digital templates for organizing routine care, vaccination schedules, grooming appointments, and flea/tick preventative treatments.
            </li>
            <li>
              <strong><Link to="/care" className="text-primary hover:underline">Pet Trackers</Link>:</strong> Built-in logging systems for tracking weight changes over time, medication administration, symptom logs, and vet visit summaries.
            </li>
            <li>
              <strong><Link to="/names" className="text-primary hover:underline">Pet Name Generators</Link>:</strong> Creative name generator algorithms categorized by species, physical appearance, personality traits, and thematic origin stories.
            </li>
            <li>
              <strong><Link to="/breeds" className="text-primary hover:underline">Breed Guides</Link>:</strong> Comprehensive profiles covering coat shedding, energy levels, trainability, common health predispositions, and living space suitability.
            </li>
            <li>
              <strong><Link to="/compare" className="text-primary hover:underline">Breed Comparisons</Link>:</strong> Side-by-side comparative matrices analyzing two or more breeds to help prospective owners choose the perfect companion match.
            </li>
            <li>
              <strong><Link to="/foods" className="text-primary hover:underline">Pet Food Information</Link>:</strong> Ingredient safety databases, macro-nutrient breakdowns, safe fruit/vegetable listings, and toxic food prevention indexes.
            </li>
            <li>
              <strong><Link to="/care" className="text-primary hover:underline">Pet Care Resources</Link>:</strong> Step-by-step care walkthroughs, environmental enrichment ideas, home safety checklists, and seasonal care guides.
            </li>
            <li>
              <strong><Link to="/cost-planner" className="text-primary hover:underline">Pet Cost Tools</Link>:</strong> Comprehensive budgeting calculators estimating first-year acquisition expenses, annual maintenance, food, supplies, and emergency vet funds.
            </li>
            <li>
              <strong><Link to="/care" className="text-primary hover:underline">Pet Health Tracking</Link>:</strong> Specialized tracking modules helping owners monitor chronic conditions, post-surgery recovery, and senior pet mobility changes.
            </li>
            <li>
              <strong><Link to="/ai" className="text-primary hover:underline">AI-Powered Pet Tools</Link>:</strong> Conversational assistants providing instant answers to general behavioral, care, and training questions based on modern care standards.
            </li>
          </ul>
        </section>

        {/* Section 5: How FurTools Helps Pet Owners */}
        <section id="how-furtools-helps" className="mt-12 scroll-mt-20">
          <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground">
            <Heart className="size-6 text-primary" />
            How {settings.companyName} Helps Pet Owners
          </h2>
          <p>
            Every day, thousands of pet parents face practical challenges that require immediate clarity. {settings.companyName} streamlines companion care by replacing guesswork with structured, scientific data.
          </p>
          <p>
            For instance, when transitioning a dog from puppy formulation to adult kibble, our calorie portioning calculators eliminate overfeeding risks. When adopting a rescue cat, our cost planners assist families in budgeting accurately for spay/neuter, vaccinations, and essential gear. By consolidating multi-species knowledge into accessible digital interfaces, {settings.companyName} saves pet owners valuable time while promoting healthier lifestyle choices for their animals.
          </p>
        </section>

        {/* Section 6: Our Approach to Content Quality */}
        <section id="content-quality" className="mt-12 scroll-mt-20">
          <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground">
            <BookOpen className="size-6 text-primary" />
            Our Approach to Content Quality
          </h2>
          <p>
            Information integrity is the cornerstone of everything we publish at {settings.companyName}. We follow strict editorial protocols when developing tool algorithms, calculators, and educational articles:
          </p>
          <ul>
            <li>
              <strong>Peer-Reviewed Foundations:</strong> Our mathematical formulas for energy requirements and feeding guidelines derive from established veterinary standards, including WSAVA (World Small Animal Veterinary Association) and AAHA (American Animal Hospital Association) recommendations.
            </li>
            <li>
              <strong>Regular Audits & Updating:</strong> Companion animal nutrition and safety guidelines evolve. Our team periodically audits ingredient toxicity databases and breed statistics to ensure information stays accurate.
            </li>
            <li>
              <strong>Clear Language & Formatting:</strong> We avoid overly dense jargon, presenting complex veterinary concepts in clear, readable prose with actionable takeaways.
            </li>
          </ul>
        </section>

        {/* Section 7: Our Approach to Pet Health Information */}
        <section id="pet-health-approach" className="mt-12 scroll-mt-20">
          <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground">
            <ShieldCheck className="size-6 text-primary" />
            Our Approach to Pet Health Information
          </h2>
          <p>
            We take a responsible, balanced view regarding online health resources. {settings.companyName} serves strictly as an educational platform and companion planning resource.
          </p>
          <p>
            We never attempt to diagnose medical conditions or prescribe treatments online. We explicitly urge all users to consult licensed veterinary doctors for any health concerns, sudden behavioral changes, or medical emergencies. Our health tools are designed to prepare pet owners with well-organized logs and accurate baseline data to share directly with their veterinarian during clinic visits.
          </p>
        </section>

        {/* Section 8: AI Tools at FurTools */}
        <section id="ai-tools" className="mt-12 scroll-mt-20">
          <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground">
            <Cpu className="size-6 text-primary" />
            AI Tools at {settings.companyName}
          </h2>
          <p>
            {settings.companyName} integrates modern artificial intelligence technologies to assist pet owners in exploring care advice, generating localized pet names, and receiving instant pet care tips.
          </p>
          <p>
            Our <Link to="/ai" className="text-primary hover:underline">AI Pet Assistants</Link> are trained to deliver helpful general guidance. However, we strictly guard AI features with boundaries: AI engines do not perform veterinary diagnoses, cannot evaluate physical symptoms, and must never replace human clinical judgment. We continuously refine AI prompts to enforce safety disclaimers whenever medical or toxic exposure queries arise.
          </p>
        </section>

        {/* Section 9: Accuracy and Limitations */}
        <section id="accuracy-and-limitations" className="mt-12 scroll-mt-20">
          <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground">
            <Sparkles className="size-6 text-primary" />
            Accuracy and Limitations
          </h2>
          <p>
            While every effort is made to maintain mathematical and factual precision, calculators and algorithms yield general approximations. Individual pet variables—such as neuter status, activity level, metabolic variance, underlying health conditions, and environmental factors—can significantly alter actual daily requirements.
          </p>
          <p>
            Results generated by {settings.companyName} should serve as educated reference points rather than strict medical mandates. For complete legal details, please read our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link>.
          </p>
        </section>

        {/* Section 10: Future Vision */}
        <section id="future-vision" className="mt-12 scroll-mt-20">
          <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-foreground">
            <Target className="size-6 text-primary" />
            Future Vision
          </h2>
          <p>
            We are actively expanding {settings.companyName} into a 300+ tool directory spanning canine, feline, avian, small mammal, reptile, and equine species.
          </p>
          <p>
            Our roadmap includes enhanced offline progressive web application (PWA) capabilities, expanded multi-language localizations, comprehensive pet health export files for veterinary visits, and customizable reminders for medication and vaccination care.
          </p>
        </section>

        {/* Section 11: Contact Us */}
        <section id="contact-us" className="mt-12 border-t border-border/60 pt-8 scroll-mt-20">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Contact Us
          </h2>
          <p>
            We value your feedback, tool suggestions, content corrections, and partnership inquiries. If you have questions or want to request a new feature, visit our dedicated <Link to="/contact" className="text-primary font-medium hover:underline">Contact Page</Link> or reach out directly to our support team at <a href={`mailto:${settings.supportEmail}`} className="text-primary hover:underline">{settings.supportEmail}</a>.
          </p>
        </section>
      </div>

      {/* FAQ Component */}
      <div className="mt-16 border-t border-border/60 pt-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
          Frequently Asked Questions About {settings.companyName}
        </h2>
        <Faq
          items={[
            {
              q: `Are ${settings.companyName} calculators free to use?`,
              a: `Yes, 100% of our core calculators, breed databases, and planning tools are completely free to access without any subscription requirements.`,
            },
            {
              q: `Does ${settings.companyName} sell my pet's personal data?`,
              a: `No. We do not sell, rent, or trade user data. Most calculator inputs run locally inside your web browser.`,
            },
            {
              q: `Can ${settings.companyName} replace my veterinarian?`,
              a: `No. Our tools provide general educational estimates and guidelines. They do not replace professional veterinary diagnosis, advice, or treatment.`,
            },
            {
              q: `How can I suggest a new pet tool or report an error?`,
              a: `You can send feature suggestions, bug reports, or content corrections anytime using our Contact page.`,
            },
          ]}
        />
      </div>
    </div>
  );
}
