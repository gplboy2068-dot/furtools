import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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

type T = (key: string, options?: Record<string, unknown>) => string;

const NS = "dog-bath-frequency-calculator";

interface CoatProfile {
  id: string;
  name: string;
  baselineDays: number;
  description: string;
  examples: string;
  dryingProtocol: string;
}

function getCoatProfiles(t: T): CoatProfile[] {
  return [
    {
      id: "short-smooth",
      name: t(`${NS}.ui.coatShortSmoothName`),
      baselineDays: 42, // Every 6 weeks
      description: t(`${NS}.ui.coatShortSmoothDesc`),
      examples: t(`${NS}.ui.coatShortSmoothExamples`),
      dryingProtocol: t(`${NS}.ui.coatShortSmoothDrying`),
    },
    {
      id: "double-coat",
      name: t(`${NS}.ui.coatDoubleName`),
      baselineDays: 60, // Every 8 to 10 weeks
      description: t(`${NS}.ui.coatDoubleDesc`),
      examples: t(`${NS}.ui.coatDoubleExamples`),
      dryingProtocol: t(`${NS}.ui.coatDoubleDrying`),
    },
    {
      id: "curly-wire",
      name: t(`${NS}.ui.coatCurlyName`),
      baselineDays: 28, // Every 4 weeks
      description: t(`${NS}.ui.coatCurlyDesc`),
      examples: t(`${NS}.ui.coatCurlyExamples`),
      dryingProtocol: t(`${NS}.ui.coatCurlyDrying`),
    },
    {
      id: "long-silky",
      name: t(`${NS}.ui.coatLongSilkyName`),
      baselineDays: 28, // Every 4 weeks
      description: t(`${NS}.ui.coatLongSilkyDesc`),
      examples: t(`${NS}.ui.coatLongSilkyExamples`),
      dryingProtocol: t(`${NS}.ui.coatLongSilkyDrying`),
    },
    {
      id: "hairless",
      name: t(`${NS}.ui.coatHairlessName`),
      baselineDays: 10, // Every 1 to 2 weeks
      description: t(`${NS}.ui.coatHairlessDesc`),
      examples: t(`${NS}.ui.coatHairlessExamples`),
      dryingProtocol: t(`${NS}.ui.coatHairlessDrying`),
    },
  ];
}

interface LifestyleProfile {
  id: string;
  name: string;
  dayModifier: number;
  description: string;
}

function getLifestyles(t: T): LifestyleProfile[] {
  return [
    {
      id: "indoor",
      name: t(`${NS}.ui.lifestyleIndoorName`),
      dayModifier: 1.25, // 25% longer between baths
      description: t(`${NS}.ui.lifestyleIndoorDesc`),
    },
    {
      id: "moderate",
      name: t(`${NS}.ui.lifestyleModerateName`),
      dayModifier: 1.0,
      description: t(`${NS}.ui.lifestyleModerateDesc`),
    },
    {
      id: "outdoor-active",
      name: t(`${NS}.ui.lifestyleOutdoorName`),
      dayModifier: 0.65, // Needs more frequent baths/rinses
      description: t(`${NS}.ui.lifestyleOutdoorDesc`),
    },
    {
      id: "farm-working",
      name: t(`${NS}.ui.lifestyleFarmName`),
      dayModifier: 0.5,
      description: t(`${NS}.ui.lifestyleFarmDesc`),
    },
  ];
}

interface SkinProfile {
  id: string;
  name: string;
  dayModifier: number;
  dayOverride?: number;
  shampooType: string;
  caution: string;
}

function getSkinConditions(t: T): SkinProfile[] {
  return [
    {
      id: "healthy",
      name: t(`${NS}.ui.skinHealthyName`),
      dayModifier: 1.0,
      shampooType: t(`${NS}.ui.skinHealthyShampoo`),
      caution: t(`${NS}.ui.skinHealthyCaution`),
    },
    {
      id: "dry-flaky",
      name: t(`${NS}.ui.skinDryFlakyName`),
      dayModifier: 1.15,
      shampooType: t(`${NS}.ui.skinDryFlakyShampoo`),
      caution: t(`${NS}.ui.skinDryFlakyCaution`),
    },
    {
      id: "atopic-allergies",
      name: t(`${NS}.ui.skinAtopicName`),
      dayModifier: 0.35, // Frequently bathed (weekly)
      dayOverride: 7, // Every 7 days
      shampooType: t(`${NS}.ui.skinAtopicShampoo`),
      caution: t(`${NS}.ui.skinAtopicCaution`),
    },
    {
      id: "yeast-bacterial",
      name: t(`${NS}.ui.skinYeastName`),
      dayModifier: 0.25,
      dayOverride: 4, // Every 3-5 days during flare-up
      shampooType: t(`${NS}.ui.skinYeastShampoo`),
      caution: t(`${NS}.ui.skinYeastCaution`),
    },
  ];
}

export function DogBathFrequencyCalculator() {
  const { t } = useTranslation("tools");
  const [selectedCoat, setSelectedCoat] = useState<string>("double-coat");
  const [selectedLifestyle, setSelectedLifestyle] = useState<string>("moderate");
  const [selectedSkin, setSelectedSkin] = useState<string>("healthy");
  const [swimmingFrequency, setSwimmingFrequency] = useState<"never" | "occasional" | "frequent">("occasional");

  const COAT_PROFILES = useMemo(() => getCoatProfiles(t), [t]);
  const LIFESTYLES = useMemo(() => getLifestyles(t), [t]);
  const SKIN_CONDITIONS = useMemo(() => getSkinConditions(t), [t]);

  const coat = useMemo(
    () => COAT_PROFILES.find((c) => c.id === selectedCoat) ?? COAT_PROFILES[1],
    [selectedCoat, COAT_PROFILES],
  );

  const lifestyle = useMemo(
    () => LIFESTYLES.find((l) => l.id === selectedLifestyle) ?? LIFESTYLES[1],
    [selectedLifestyle, LIFESTYLES],
  );

  const skin = useMemo(
    () => SKIN_CONDITIONS.find((s) => s.id === selectedSkin) ?? SKIN_CONDITIONS[0],
    [selectedSkin, SKIN_CONDITIONS],
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
    if (days <= 5) frequencyLabel = t(`${NS}.ui.freqTwiceWeekly`);
    else if (days <= 8) frequencyLabel = t(`${NS}.ui.freqWeekly`);
    else if (days <= 16) frequencyLabel = t(`${NS}.ui.freq2Weeks`);
    else if (days <= 24) frequencyLabel = t(`${NS}.ui.freq3Weeks`);
    else if (days <= 32) frequencyLabel = t(`${NS}.ui.freqMonthly`);
    else if (days <= 45) frequencyLabel = t(`${NS}.ui.freq6Weeks`);
    else if (days <= 65) frequencyLabel = t(`${NS}.ui.freq8To9Weeks`);
    else frequencyLabel = t(`${NS}.ui.freqQuarterly`);

    // Between-bath maintenance schedule
    const brushDays = coat.id === "double-coat" || coat.id === "long-silky" ? 2 : coat.id === "curly-wire" ? 3 : 7;

    return {
      recommendedDays: days,
      recommendedWeeks: weeks,
      frequencyLabel,
      bathsPerYear,
      brushDays,
    };
  }, [coat, lifestyle, skin, t]);

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
              {t(`${NS}.ui.bannerTitle`)}
            </h2>
            <p className="mt-1 leading-relaxed">
              {t(`${NS}.ui.bannerP1`)} {t(`${NS}.ui.bannerOnly`)}
              <strong>{t(`${NS}.ui.bannerStrong`)}</strong>.{" "}
              {t(`${NS}.ui.bannerP2`)}
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
              <CardTitle className="text-xl">{t(`${NS}.ui.section1Title`)}</CardTitle>
              <CardDescription>{t(`${NS}.ui.section1Desc`)}</CardDescription>
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
                        {t(`${NS}.ui.baseWeeks`, { wks: Math.round(cp.baselineDays / 7) })}
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
              <CardTitle className="text-xl">{t(`${NS}.ui.section2Title`)}</CardTitle>
              <CardDescription>{t(`${NS}.ui.section2Desc`)}</CardDescription>
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
                <Label className="text-xs font-medium">{t(`${NS}.ui.swimLabel`)}</Label>
                <div className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-lg border bg-muted p-1 text-xs">
                  {[
                    { id: "never", label: t(`${NS}.ui.swimNever`) },
                    { id: "occasional", label: t(`${NS}.ui.swimOccasional`) },
                    { id: "frequent", label: t(`${NS}.ui.swimFrequent`) },
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
              <CardTitle className="text-xl">{t(`${NS}.ui.section3Title`)}</CardTitle>
              <CardDescription>{t(`${NS}.ui.section3Desc`)}</CardDescription>
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
                          {t(`${NS}.ui.therapeuticBadge`)}
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
                {t(`${NS}.ui.outputBadge`)}
              </Badge>
              <CardTitle className="text-2xl font-display mt-2">{t(`${NS}.ui.outputTitle`)}</CardTitle>
              <CardDescription>
                {t(`${NS}.ui.outputDesc`, { coat: coat.name, lifestyle: lifestyle.name })}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Primary Metric: Recommended Frequency */}
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-center shadow-inner">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(`${NS}.ui.intervalLabel`)}
                </div>
                <div className="mt-2 text-3xl font-black tracking-tight text-primary font-mono sm:text-4xl">
                  {results.frequencyLabel}
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-muted-foreground">
                  {t(`${NS}.ui.everyDays`, { days: results.recommendedDays, perYear: results.bathsPerYear })}
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs text-foreground shadow-sm">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  {t(`${NS}.ui.brushEvery`, { days: results.brushDays })}
                </div>
              </div>

              {/* Bathing Protocol Details */}
              <div className="space-y-3 rounded-xl border bg-muted/20 p-4 text-xs">
                <div className="font-semibold text-foreground flex items-center justify-between">
                  <span>{t(`${NS}.ui.rulesTitle`)}</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {t(`${NS}.ui.phBadge`)}
                  </Badge>
                </div>

                <div className="py-1 border-b border-border/50 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1">
                    <Droplets className="size-3 text-primary" /> {t(`${NS}.ui.shampooLabel`)}
                  </span>
                  <p className="text-foreground leading-relaxed">{skin.shampooType}</p>
                </div>

                <div className="py-1 border-b border-border/50 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1">
                    <Wind className="size-3 text-primary" /> {t(`${NS}.ui.dryingLabel`)}
                  </span>
                  <p className="text-foreground leading-relaxed">{coat.dryingProtocol}</p>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">{t(`${NS}.ui.waterTempLabel`)}</span>
                  <span className="font-mono font-bold text-foreground">{t(`${NS}.ui.waterTempValue`)}</span>
                </div>
              </div>

              {/* Swimming Advice */}
              {swimmingFrequency !== "never" && (
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-xs text-blue-950 dark:text-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="size-4 shrink-0 text-blue-500 mt-0.5" />
                    <div>
                      <strong>{t(`${NS}.ui.swimAdviceTitle`)}</strong> {t(`${NS}.ui.swimAdviceBody1`)}{" "}
                      <strong>{t(`${NS}.ui.swimAdviceBody2`)}</strong> {t(`${NS}.ui.swimAdviceBody3`)}
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
                      <strong>{t(`${NS}.ui.doubleCoatTitle`)}</strong> {t(`${NS}.ui.doubleCoatBody`)}
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
                  {t(`${NS}.ui.resetButton`)}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
