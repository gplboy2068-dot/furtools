import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bath,
  Droplets,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  RotateCcw,
  ShieldAlert,
  Dog,
  Wind,
} from "lucide-react";

interface CoatProfile {
  id: string;
  name: string;
  baselineDays: number;
  description: string;
  examples: string;
  dryingProtocol: string;
}

const COAT_PROFILES: CoatProfile[] = [
  {
    id: "short-smooth",
    name: "Short & Smooth Coat",
    baselineDays: 42, // Every 6 weeks
    description: "Low-maintenance single layer. Natural sebum protects skin; frequent washing causes flaking.",
    examples: "Boxer, Beagle, Dalmatian, Doberman, French Bulldog, Weimaraner",
    dryingProtocol: "Towel dry followed by ambient air drying or low-speed room temperature blow.",
  },
  {
    id: "double-coat",
    name: "Heavy Double Coat",
    baselineDays: 60, // Every 8 to 10 weeks
    description: "Dense insulating undercoat + water-repellent guard hairs. Frequent shampooing strips thermal insulation.",
    examples: "Golden Retriever, German Shepherd, Husky, Pomeranian, Bernese Mountain Dog",
    dryingProtocol: "High-velocity cool dryer essential to separate undercoat down to the skin and prevent acute moist dermatitis (hot spots).",
  },
  {
    id: "curly-wire",
    name: "Curly / Non-Shedding / Furnished",
    baselineDays: 28, // Every 4 weeks
    description: "Continuous hair growth that traps debris, dander, and environmental allergens readily.",
    examples: "Poodle, Goldendoodle, Labradoodle, Bichon Frise, Schnauzer, Airedale",
    dryingProtocol: "High-velocity blow dry with slicker brush fluffing to detangle damp curls before mats tighten.",
  },
  {
    id: "long-silky",
    name: "Long & Silky Coat",
    baselineDays: 28, // Every 4 weeks
    description: "Fine hair prone to tangling, static, and picking up burrs and road grit.",
    examples: "Yorkshire Terrier, Shih Tzu, Maltese, Afghan Hound, Cocker Spaniel",
    dryingProtocol: "Gentle towel press (no circular rubbing to avoid tangles); blow dry on low heat with pin brush.",
  },
  {
    id: "hairless",
    name: "Hairless / Minimal Coat",
    baselineDays: 10, // Every 1 to 2 weeks
    description: "No fur barrier to absorb natural skin sebum and environmental soot; prone to clogged blackhead pores.",
    examples: "Chinese Crested, Xoloitzcuintli, American Hairless Terrier",
    dryingProtocol: "Soft pat dry followed immediately by dog-safe non-comedogenic ceramide skin moisturizer.",
  },
];

interface LifestyleProfile {
  id: string;
  name: string;
  dayModifier: number;
  description: string;
}

const LIFESTYLES: LifestyleProfile[] = [
  {
    id: "indoor",
    name: "Strictly Indoor / Apartment",
    dayModifier: 1.25, // 25% longer between baths
    description: "Paved leash walks only. Minimal mud, grass pollen, or wet soil exposure.",
  },
  {
    id: "moderate",
    name: "Suburban Yard / Park Walks",
    dayModifier: 1.0,
    description: "Daily backyard play, casual dog park visits, standard weather exposure.",
  },
  {
    id: "outdoor-active",
    name: "Trail Hiker / Swimmer / Beach",
    dayModifier: 0.65, // Needs more frequent baths/rinses
    description: "Swimming in lakes/oceans, digging in topsoil, hiking dense forested terrain.",
  },
  {
    id: "farm-working",
    name: "Working Ranch / High Mud",
    dayModifier: 0.5,
    description: "Constant livestock manure, heavy mud, burrs, and intense daily farm labor.",
  },
];

interface SkinProfile {
  id: string;
  name: string;
  dayModifier: number;
  shampooType: string;
  caution: string;
}

const SKIN_CONDITIONS: SkinProfile[] = [
  {
    id: "healthy",
    name: "Normal / Healthy Skin",
    dayModifier: 1.0,
    shampooType: "Soap-free hypoallergenic oatmeal or gentle aloe conditioning canine shampoo (pH 6.5–7.5).",
    caution: "Avoid human shampoos: human skin is acidic (pH 5.5) whereas canine skin is neutral (pH 7.0–7.4). Human soap degrades the stratum corneum barrier.",
  },
  {
    id: "dry-flaky",
    name: "Dry / Sensitive / Flaky Skin",
    dayModifier: 1.15,
    shampooType: "Lipid-restoring colloidal oatmeal with phytosphingosine and essential fatty acids.",
    caution: "Space baths further apart. Rinse thoroughly with cool-to-lukewarm water; hot water strips epidermal lipids.",
  },
  {
    id: "atopic-allergies",
    name: "Environmental Allergies (Atopy)",
    dayModifier: 0.35, // Frequently bathed (weekly)
    dayOverride: 7, // Every 7 days
    shampooType: "Medicated ceramide shampoo or chlorhexidine rinse to physically wash away trapped environmental allergens.",
    caution: "Bathing acts as mechanical decontamination: washing pollen off paws and belly weekly reduces systemic pruritus (itching).",
  },
  {
    id: "yeast-bacterial",
    name: "Active Yeast / Pyoderma Infection",
    dayModifier: 0.25,
    dayOverride: 4, // Every 3-5 days during flare-up
    shampooType: "Veterinary prescription 2%–4% Chlorhexidine + Ketoconazole / Miconazole medicated shampoo.",
    caution: "Must leave shampoo lather on skin for a full 10-minute contact time before rinsing to allow antimicrobial penetration.",
  },
];

export function DogBathFrequencyCalculator() {
  const [selectedCoat, setSelectedCoat] = useState<string>("double-coat");
  const [selectedLifestyle, setSelectedLifestyle] = useState<string>("moderate");
  const [selectedSkin, setSelectedSkin] = useState<string>("healthy");
  const [swimmingFrequency, setSwimmingFrequency] = useState<"never" | "occasional" | "frequent">("occasional");

  const coat = useMemo(
    () => COAT_PROFILES.find((c) => c.id === selectedCoat) ?? COAT_PROFILES[1],
    [selectedCoat],
  );

  const lifestyle = useMemo(
    () => LIFESTYLES.find((l) => l.id === selectedLifestyle) ?? LIFESTYLES[1],
    [selectedLifestyle],
  );

  const skin = useMemo(
    () => SKIN_CONDITIONS.find((s) => s.id === selectedSkin) ?? SKIN_CONDITIONS[0],
    [selectedSkin],
  );

  const results = useMemo(() => {
    let days: number;

    // If active medical skin condition specifies an exact override protocol
    if ("dayOverride" in skin && typeof skin.dayOverride === "number") {
      days = skin.dayOverride;
    } else {
      days = Math.round(coat.baselineDays * lifestyle.dayModifier * skin.dayModifier);
      // Bound healthy intervals between 7 and 90 days
      days = Math.max(7, Math.min(90, days));
    }

    const weeks = +(days / 7).toFixed(1);
    const bathsPerYear = Math.round(365 / days);

    let frequencyLabel = "";
    if (days <= 5) frequencyLabel = "Twice Weekly (Medicated Treatment)";
    else if (days <= 8) frequencyLabel = "Weekly (Decontamination Schedule)";
    else if (days <= 16) frequencyLabel = "Every 2 Weeks";
    else if (days <= 24) frequencyLabel = "Every 3 Weeks";
    else if (days <= 32) frequencyLabel = "Every 4 Weeks (Monthly)";
    else if (days <= 45) frequencyLabel = "Every 6 Weeks";
    else if (days <= 65) frequencyLabel = "Every 8 to 9 Weeks";
    else frequencyLabel = "Every 10 to 12 Weeks (Quarterly)";

    // Between-bath maintenance schedule
    const brushDays = coat.id === "double-coat" || coat.id === "long-silky" ? 2 : coat.id === "curly-wire" ? 3 : 7;

    return {
      recommendedDays: days,
      recommendedWeeks: weeks,
      frequencyLabel,
      bathsPerYear,
      brushDays,
    };
  }, [coat, lifestyle, skin]);

  const handleReset = () => {
    setSelectedCoat("double-coat");
    setSelectedLifestyle("moderate");
    setSelectedSkin("healthy");
    setSwimmingFrequency("occasional");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Top Specialty Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-muted-foreground sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
            <Bath className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">
              Veterinary Dermatology & Canine Bathing Interval Algorithm
            </h2>
            <p className="mt-1 leading-relaxed">
              Unlike human epidermis (which has 10–15 cell layers and an acidic pH of 5.5), canine skin is extraordinarily delicate:
              only <strong>3 to 5 cell layers thick with a neutral pH of 7.0 to 7.4</strong>.
              Over-bathing with harsh detergents strips the protective lipid barrier and kills beneficial commensal skin flora, causing rebound seborrhea and chronic pruritus.
              This calculator balances coat architecture, environmental exposure, and dermatological skin conditions to prescribe the optimal bathing frequency.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Input Configuration Column */}
        <div className="space-y-6 lg:col-span-7">
          {/* 1. Coat Type Profile */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">1. Coat Structure & Fiber Density</CardTitle>
              <CardDescription>Different follicle patterns dictate natural oil distribution and debris retention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {COAT_PROFILES.map((cp) => {
                const isSelected = selectedCoat === cp.id;
                return (
                  <button
                    key={cp.id}
                    type="button"
                    onClick={() => setSelectedCoat(cp.id)}
                    className={`w-full rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border/60 bg-card hover:border-primary/40 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-foreground">{cp.name}</span>
                      <Badge variant={isSelected ? "default" : "outline"} className="text-[10px] font-mono">
                        Base: ~{Math.round(cp.baselineDays / 7)} wks
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{cp.description}</p>
                    <div className="mt-2 text-[11px] text-primary/90 flex items-center gap-1.5">
                      <Dog className="size-3.5 shrink-0" />
                      <span className="line-clamp-1">{cp.examples}</span>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* 2. Lifestyle & Outdoor Exposure */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">2. Lifestyle & Environmental Exposure</CardTitle>
              <CardDescription>Accounts for dirt, organic manure, and surface mud accumulation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {LIFESTYLES.map((ls) => {
                  const isSelected = selectedLifestyle === ls.id;
                  return (
                    <button
                      key={ls.id}
                      type="button"
                      onClick={() => setSelectedLifestyle(ls.id)}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border/60 bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="font-semibold text-xs text-foreground">{ls.name}</div>
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{ls.description}</p>
                    </button>
                  );
                })}
              </div>

              {/* Swimming adjustment */}
              <div className="pt-2">
                <Label className="text-xs font-medium">Freshwater / Saltwater Swimming Frequency:</Label>
                <div className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-lg border bg-muted p-1 text-xs">
                  {[
                    { id: "never", label: "Rarely / Never" },
                    { id: "occasional", label: "Occasional (1-2x/mo)" },
                    { id: "frequent", label: "Frequent (Weekly)" },
                  ].map((sw) => (
                    <button
                      key={sw.id}
                      type="button"
                      onClick={() => setSwimmingFrequency(sw.id as typeof swimmingFrequency)}
                      className={`rounded-md py-1.5 text-center font-medium transition-all ${
                        swimmingFrequency === sw.id
                          ? "bg-background font-semibold text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {sw.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Dermatological & Skin Barrier Health */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">3. Skin Barrier Health & Allergies</CardTitle>
              <CardDescription>Clinical skin conditions alter bathing frequency from hygiene to therapy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {SKIN_CONDITIONS.map((sc) => {
                const isSelected = selectedSkin === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSelectedSkin(sc.id)}
                    className={`w-full rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border/60 bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground">{sc.name}</span>
                      {sc.id !== "healthy" && (
                        <Badge variant="secondary" className="text-[10px] text-amber-600 dark:text-amber-400">
                          Therapeutic Protocol
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{sc.caution}</p>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Results & Care Schedule Column */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="sticky top-24 border-primary/30 bg-card shadow-md">
            <CardHeader className="border-b border-border/50 bg-primary/5 pb-4">
              <Badge variant="outline" className="w-fit border-primary/40 bg-background font-mono text-primary text-xs">
                Canine Dermatological Prescription
              </Badge>
              <CardTitle className="text-2xl font-display mt-2">Bathing Frequency Plan</CardTitle>
              <CardDescription>
                Calculated for {coat.name} ({lifestyle.name})
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Primary Metric: Recommended Frequency */}
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-center shadow-inner">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recommended Bathing Interval
                </div>
                <div className="mt-2 text-3xl font-black tracking-tight text-primary font-mono sm:text-4xl">
                  {results.frequencyLabel}
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-muted-foreground">
                  ≈ Every {results.recommendedDays} Days ({results.bathsPerYear} baths / year)
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs text-foreground shadow-sm">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  Brush coat every {results.brushDays} days between baths
                </div>
              </div>

              {/* Bathing Protocol Details */}
              <div className="space-y-3 rounded-xl border bg-muted/20 p-4 text-xs">
                <div className="font-semibold text-foreground flex items-center justify-between">
                  <span>Veterinary Bathing Rules</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    pH 7.0 Standard
                  </Badge>
                </div>

                <div className="py-1 border-b border-border/50 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1">
                    <Droplets className="size-3 text-primary" /> Recommended Shampoo Formulation:
                  </span>
                  <p className="text-foreground leading-relaxed">{skin.shampooType}</p>
                </div>

                <div className="py-1 border-b border-border/50 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1">
                    <Wind className="size-3 text-primary" /> Drying & Grooming Protocol:
                  </span>
                  <p className="text-foreground leading-relaxed">{coat.dryingProtocol}</p>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Water Temperature:</span>
                  <span className="font-mono font-bold text-foreground">Lukewarm (98°F / 37°C)</span>
                </div>
              </div>

              {/* Swimming Advice */}
              {swimmingFrequency !== "never" && (
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-xs text-blue-950 dark:text-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="size-4 shrink-0 text-blue-500 mt-0.5" />
                    <div>
                      <strong>Post-Swim Fresh Water Rinse:</strong> After lake, river, or saltwater swims, 
                      <strong> rinse thoroughly with plain tap water</strong> without shampoo. This removes corrosive salt crystals and chlorine without depleting natural skin oils.
                    </div>
                  </div>
                </div>
              )}

              {/* Double Coat Warning */}
              {selectedCoat === "double-coat" && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-950 dark:text-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="size-4 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <strong>Never Shave a Double Coat:</strong> Shaving Golden Retrievers, Huskies, or Shepherds destroys the thermal air insulation layer, permanently damages coat regrowth (post-clipping alopecia), and increases heatstroke risk.
                    </div>
                  </div>
                </div>
              )}

              {/* Reset action */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="w-full text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="mr-1.5 size-3.5" />
                  Reset to Standard Grooming Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
