import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  Ruler,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  RotateCcw,
  TrendingUp,
  ShieldAlert,
  Dog,
  ShieldCheck,
} from "lucide-react";

type T = (key: string, options?: Record<string, unknown>) => string;

const NS = "dog-size-predictor";

interface SizeCategory {
  id: string;
  name: string;
  weightRange: string;
  adultWeightLbs: [number, number];
  adultHeightInches: [number, number];
  maturityWeeks: number;
  halfWeightWeeks: number;
  examples: string;
}

function getSizeCategories(t: T): SizeCategory[] {
  return [
    {
      id: "toy",
      name: t(`${NS}.ui.catToyName`),
      weightRange: t(`${NS}.ui.catToyRange`),
      adultWeightLbs: [4, 11],
      adultHeightInches: [6, 10],
      maturityWeeks: 40, // 9-10 months
      halfWeightWeeks: 12, // 50% at 3 months
      examples: t(`${NS}.ui.catToyExamples`),
    },
    {
      id: "small",
      name: t(`${NS}.ui.catSmallName`),
      weightRange: t(`${NS}.ui.catSmallRange`),
      adultWeightLbs: [12, 25],
      adultHeightInches: [10, 15],
      maturityWeeks: 48, // 11-12 months
      halfWeightWeeks: 15,
      examples: t(`${NS}.ui.catSmallExamples`),
    },
    {
      id: "medium",
      name: t(`${NS}.ui.catMediumName`),
      weightRange: t(`${NS}.ui.catMediumRange`),
      adultWeightLbs: [26, 50],
      adultHeightInches: [16, 21],
      maturityWeeks: 56, // 12-14 months
      halfWeightWeeks: 18,
      examples: t(`${NS}.ui.catMediumExamples`),
    },
    {
      id: "large",
      name: t(`${NS}.ui.catLargeName`),
      weightRange: t(`${NS}.ui.catLargeRange`),
      adultWeightLbs: [51, 85],
      adultHeightInches: [22, 26],
      maturityWeeks: 70, // 15-18 months
      halfWeightWeeks: 22,
      examples: t(`${NS}.ui.catLargeExamples`),
    },
    {
      id: "giant",
      name: t(`${NS}.ui.catGiantName`),
      weightRange: t(`${NS}.ui.catGiantRange`),
      adultWeightLbs: [86, 150],
      adultHeightInches: [27, 34],
      maturityWeeks: 96, // 20-24 months
      halfWeightWeeks: 26,
      examples: t(`${NS}.ui.catGiantExamples`),
    },
  ];
}

interface PopularBreed {
  name: string;
  category: string;
  adultRangeLbs: [number, number];
}

function getPopularBreeds(t: T): PopularBreed[] {
  return [
    { name: t(`${NS}.ui.breedLabrador`), category: "large", adultRangeLbs: [55, 80] },
    { name: t(`${NS}.ui.breedGermanShepherd`), category: "large", adultRangeLbs: [50, 88] },
    { name: t(`${NS}.ui.breedGoldenRetriever`), category: "large", adultRangeLbs: [55, 75] },
    { name: t(`${NS}.ui.breedFrenchBulldog`), category: "small", adultRangeLbs: [18, 28] },
    { name: t(`${NS}.ui.breedBeagle`), category: "medium", adultRangeLbs: [20, 30] },
    { name: t(`${NS}.ui.breedPoodleStandard`), category: "large", adultRangeLbs: [45, 70] },
    { name: t(`${NS}.ui.breedChihuahua`), category: "toy", adultRangeLbs: [3.5, 6.5] },
    { name: t(`${NS}.ui.breedGreatDane`), category: "giant", adultRangeLbs: [110, 175] },
    { name: t(`${NS}.ui.breedMixed`), category: "auto", adultRangeLbs: [0, 0] },
  ];
}

export function DogSizePredictor() {
  const { t } = useTranslation("tools");
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [currentWeightInput, setCurrentWeightInput] = useState<number>(18);
  const [ageWeeks, setAgeWeeks] = useState<number>(16);
  const [selectedCategory, setSelectedCategory] = useState<string>("large");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [pawBoneStructure, setPawBoneStructure] = useState<"normal" | "large" | "dainty">("normal");

  const SIZE_CATEGORIES = useMemo(() => getSizeCategories(t), [t]);
  const POPULAR_BREEDS = useMemo(() => getPopularBreeds(t), [t]);

  // Normalized weight in lbs for standard veterinary allometric calculations
  const weightLbs = useMemo(() => {
    const raw = Number.isFinite(currentWeightInput) && currentWeightInput > 0 ? currentWeightInput : 15;
    return unit === "kg" ? raw * 2.20462 : raw;
  }, [currentWeightInput, unit]);

  // If user selects "auto" (Mixed Breed), infer category based on current age & weight
  const effectiveCategory = useMemo(() => {
    if (selectedCategory !== "auto") {
      return SIZE_CATEGORIES.find((c) => c.id === selectedCategory) ?? SIZE_CATEGORIES[3];
    }
    // Infer category: estimate weight at 16 weeks
    const extrapolatedAt16Wk = (weightLbs / Math.max(6, ageWeeks)) * 16;
    if (extrapolatedAt16Wk < 8) return SIZE_CATEGORIES[0]; // Toy
    if (extrapolatedAt16Wk < 16) return SIZE_CATEGORIES[1]; // Small
    if (extrapolatedAt16Wk < 32) return SIZE_CATEGORIES[2]; // Medium
    if (extrapolatedAt16Wk < 55) return SIZE_CATEGORIES[3]; // Large
    return SIZE_CATEGORIES[4]; // Giant
  }, [selectedCategory, weightLbs, ageWeeks, SIZE_CATEGORIES]);

  // Paw bone density multiplier
  const boneModifier = useMemo(() => {
    switch (pawBoneStructure) {
      case "large":
        return 1.08; // Paws noticeably larger than wrists
      case "dainty":
        return 0.94; // Fine-boned, slender limbs
      case "normal":
      default:
        return 1.0;
    }
  }, [pawBoneStructure]);

  // Sex sexual dimorphism modifier (males 5-10% heavier in medium/large breeds)
  const sexModifier = useMemo(() => {
    if (effectiveCategory.id === "toy") return sex === "male" ? 1.02 : 0.98;
    return sex === "male" ? 1.06 : 0.94;
  }, [sex, effectiveCategory]);

  // Veterinary Pediatric Allometric Growth Computation (Waltham / Gompertz Model)
  const results = useMemo(() => {
    const maturityWks = effectiveCategory.maturityWeeks;
    const halfWks = effectiveCategory.halfWeightWeeks;

    // Logistic growth curve fraction reached at ageWeeks:
    // f(t) = 1 / (1 + exp(-k * (t - t_half)))
    // Parameter k derived such that f(maturityWks) ~= 0.97
    const k = (2 * Math.log(9)) / (maturityWks - halfWks);
    const growthProgressFraction = 1 / (1 + Math.exp(-k * (ageWeeks - halfWks)));
    const safeFraction = Math.min(0.98, Math.max(0.12, growthProgressFraction));

    // Base predicted adult weight in lbs
    const baseAdultLbs = (weightLbs / safeFraction) * boneModifier * (sexModifier / 1.0);

    // Apply healthy confidence boundaries
    const minAdultLbs = Math.max(
      effectiveCategory.adultWeightLbs[0] * 0.75,
      baseAdultLbs * 0.92,
    );
    const maxAdultLbs = Math.min(
      effectiveCategory.adultWeightLbs[1] * 1.35,
      baseAdultLbs * 1.08,
    );
    const estimatedAdultLbs = (minAdultLbs + maxAdultLbs) / 2;

    // Metric conversions
    const minAdultKg = minAdultLbs / 2.20462;
    const maxAdultKg = maxAdultLbs / 2.20462;
    const estimatedAdultKg = estimatedAdultLbs / 2.20462;

    // Percentage of adult weight reached currently
    const currentPercent = Math.min(100, Math.round((weightLbs / estimatedAdultLbs) * 100));

    // Projected Shoulder (Wither) Height in inches using allometric canine scaling:
    // Wither Height (in) ~= 4.8 * (Weight in lbs)^0.42
    const estHeightInches = Math.round(4.8 * Math.pow(estimatedAdultLbs, 0.42));
    const minHeightInches = Math.max(6, estHeightInches - 2);
    const maxHeightInches = estHeightInches + 2;
    const estHeightCm = Math.round(estHeightInches * 2.54);

    // Growth velocity stage analysis
    let growthStage = t(`${NS}.ui.stageEarly`);
    let growthDescription = t(`${NS}.ui.stageEarlyDesc`);
    let plateClosure = t(`${NS}.ui.plateClosure`, {
      min: Math.round(maturityWks / 4.33),
      max: Math.round((maturityWks + 8) / 4.33),
    });

    if (currentPercent < 40) {
      growthStage = t(`${NS}.ui.stagePeak`);
      growthDescription = t(`${NS}.ui.stagePeakDesc`);
    } else if (currentPercent < 75) {
      growthStage = t(`${NS}.ui.stageSecondary`);
      growthDescription = t(`${NS}.ui.stageSecondaryDesc`);
    } else if (currentPercent < 92) {
      growthStage = t(`${NS}.ui.stageLate`);
      growthDescription = t(`${NS}.ui.stageLateDesc`);
    } else {
      growthStage = t(`${NS}.ui.stageFull`);
      growthDescription = t(`${NS}.ui.stageFullDesc`);
    }

    // Recommended Adult Crate Size (Length in inches)
    // Crate length should be adult nose-to-tail length + 4 inches
    const crateLengthInches = Math.round(estHeightInches * 1.45 + 4);
    const crateSizeName =
      crateLengthInches <= 24
        ? t(`${NS}.ui.crateSizeSmall`)
        : crateLengthInches <= 30
        ? t(`${NS}.ui.crateSizeMedium`)
        : crateLengthInches <= 36
        ? t(`${NS}.ui.crateSizeIntermediate`)
        : crateLengthInches <= 42
        ? t(`${NS}.ui.crateSizeLarge`)
        : crateLengthInches <= 48
        ? t(`${NS}.ui.crateSizeExtraLarge`)
        : t(`${NS}.ui.crateSizeGiant`);

    // Growth milestones table (Projected weight at key ages)
    const milestoneAges = [8, 12, 16, 24, 36, 52];
    if (effectiveCategory.id === "large" || effectiveCategory.id === "giant") {
      milestoneAges.push(72);
    }

    const milestones = milestoneAges.map((wk) => {
      const frac = 1 / (1 + Math.exp(-k * (wk - halfWks)));
      const projectedLbs = Math.round(estimatedAdultLbs * Math.min(1.0, frac));
      const projectedKg = +(projectedLbs / 2.20462).toFixed(1);
      const mo = (wk / 4.33).toFixed(0);
      return {
        weeks: wk,
        months: mo,
        lbs: projectedLbs,
        kg: projectedKg,
        pct: Math.min(100, Math.round(frac * 100)),
        isPast: ageWeeks >= wk,
      };
    });

    return {
      minAdultLbs: Math.round(minAdultLbs),
      maxAdultLbs: Math.round(maxAdultLbs),
      estimatedAdultLbs: Math.round(estimatedAdultLbs),
      minAdultKg: +minAdultKg.toFixed(1),
      maxAdultKg: +maxAdultKg.toFixed(1),
      estimatedAdultKg: +estimatedAdultKg.toFixed(1),
      currentPercent,
      minHeightInches,
      maxHeightInches,
      estHeightInches,
      estHeightCm,
      growthStage,
      growthDescription,
      plateClosure,
      crateSizeName,
      crateLengthInches,
      milestones,
      isLargeOrGiant: estimatedAdultLbs >= 50,
    };
  }, [effectiveCategory, weightLbs, ageWeeks, boneModifier, sexModifier, t]);

  const handleQuickWeightPreset = (presetLbs: number) => {
    if (unit === "kg") {
      setCurrentWeightInput(+(presetLbs / 2.20462).toFixed(1));
    } else {
      setCurrentWeightInput(presetLbs);
    }
  };

  const handleBreedClick = (breed: (typeof POPULAR_BREEDS)[0]) => {
    setSelectedCategory(breed.category);
    if (breed.category !== "auto" && breed.adultRangeLbs[0] > 0) {
      // Estimate weight for this breed at current age
      const avgAdult = (breed.adultRangeLbs[0] + breed.adultRangeLbs[1]) / 2;
      const cat = SIZE_CATEGORIES.find((c) => c.id === breed.category) ?? SIZE_CATEGORIES[3];
      const k = (2 * Math.log(9)) / (cat.maturityWeeks - cat.halfWeightWeeks);
      const frac = 1 / (1 + Math.exp(-k * (ageWeeks - cat.halfWeightWeeks)));
      const approxCurrentLbs = Math.round(avgAdult * frac);
      handleQuickWeightPreset(approxCurrentLbs);
    }
  };

  const handleReset = () => {
    setUnit("lbs");
    setCurrentWeightInput(18);
    setAgeWeeks(16);
    setSelectedCategory("large");
    setSex("male");
    setPawBoneStructure("normal");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Educational Header Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-muted-foreground sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
            <Dog className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">
              {t(`${NS}.ui.bannerTitle`)}
            </h2>
            <p className="mt-1 leading-relaxed">
              {t(`${NS}.ui.bannerP1`)} {t(`${NS}.ui.bannerP2`)}{" "}
              <strong>{t(`${NS}.ui.bannerStrong1`)}</strong> {t(`${NS}.ui.bannerP3`)}{" "}
              <strong>{t(`${NS}.ui.bannerStrong2`)}</strong>. {t(`${NS}.ui.bannerP4`)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Input Controls Column */}
        <div className="space-y-6 lg:col-span-7">
          {/* 1. Puppy Weight & Age */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{t(`${NS}.ui.section1Title`)}</CardTitle>
                  <CardDescription>{t(`${NS}.ui.section1Desc`)}</CardDescription>
                </div>
                <div className="inline-flex rounded-lg border bg-muted p-1 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      if (unit !== "lbs") {
                        setUnit("lbs");
                        setCurrentWeightInput(Math.round(currentWeightInput * 2.20462));
                      }
                    }}
                    className={`rounded-md px-3 py-1 transition-all ${
                      unit === "lbs"
                        ? "bg-background font-semibold text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(`${NS}.ui.unitPounds`)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (unit !== "kg") {
                        setUnit("kg");
                        setCurrentWeightInput(+(currentWeightInput / 2.20462).toFixed(1));
                      }
                    }}
                    className={`rounded-md px-3 py-1 transition-all ${
                      unit === "kg"
                        ? "bg-background font-semibold text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(`${NS}.ui.unitKilograms`)}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Current Weight Input */}
              <div>
                <div className="flex items-center justify-between text-sm font-medium">
                  <Label htmlFor="current-weight">{t(`${NS}.ui.weightLabel`)}</Label>
                  <span className="font-mono text-base font-bold text-primary">
                    {currentWeightInput} {unit === "kg" ? t(`${NS}.ui.unitShortKg`) : t(`${NS}.ui.unitShortLbs`)}
                  </span>
                </div>
                <Input
                  id="current-weight"
                  type="number"
                  step={unit === "kg" ? 0.1 : 0.5}
                  min={0.5}
                  max={150}
                  value={currentWeightInput || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCurrentWeightInput(isNaN(val) ? 0 : val);
                  }}
                  className="mt-2 text-base font-semibold"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[11px] text-muted-foreground self-center mr-1">{t(`${NS}.ui.quickPresets`)}</span>
                  {[5, 12, 20, 35, 50].map((lb) => (
                    <Button
                      key={lb}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickWeightPreset(lb)}
                      className="h-6 text-xs px-2"
                    >
                      {unit === "kg"
                        ? t(`${NS}.ui.presetKg`, { val: (lb / 2.20462).toFixed(1) })
                        : t(`${NS}.ui.presetLbs`, { val: lb })}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Age in Weeks Slider & Input */}
              <div className="rounded-xl bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-medium">
                  <Label htmlFor="puppy-age" className="flex items-center gap-1.5 text-sm font-medium">
                    <Calendar className="size-4 text-primary" />
                    {t(`${NS}.ui.ageLabel`)} <span className="font-bold text-foreground">{t(`${NS}.ui.ageWeeks`, { weeks: ageWeeks })}</span>
                  </Label>
                  <span className="font-mono text-xs text-muted-foreground">
                    {t(`${NS}.ui.monthsApprox`, { months: (ageWeeks / 4.33).toFixed(1) })}
                  </span>
                </div>
                <input
                  id="puppy-age"
                  type="range"
                  min={6}
                  max={60}
                  step={1}
                  value={ageWeeks}
                  onChange={(e) => setAgeWeeks(parseInt(e.target.value) || 16)}
                  className="w-full h-2 rounded-lg bg-muted-foreground/25 accent-primary cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{t(`${NS}.ui.ageMin`)}</span>
                  <div className="flex gap-1">
                    {[8, 12, 16, 24, 36, 48].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setAgeWeeks(w)}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono border transition-colors ${
                          ageWeeks === w
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-border/60 hover:bg-muted"
                        }`}
                      >
                        {t(`${NS}.ui.weekQuick`, { w })}
                      </button>
                    ))}
                  </div>
                  <span>{t(`${NS}.ui.ageMax`)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Breed Size Category & Popular Breed Quick Fill */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">{t(`${NS}.ui.section2Title`)}</CardTitle>
              <CardDescription>
                {t(`${NS}.ui.section2Desc`)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SIZE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border/60 bg-card hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-foreground">{cat.name}</span>
                        <Badge variant={isSelected ? "default" : "outline"} className="text-[10px] font-mono">
                          {cat.weightRange}
                        </Badge>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{cat.examples}</p>
                    </button>
                  );
                })}

                {/* Auto / Mixed Breed Option */}
                <button
                  type="button"
                  onClick={() => setSelectedCategory("auto")}
                  className={`rounded-xl border p-3.5 text-left transition-all ${
                    selectedCategory === "auto"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border/60 bg-card hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">{t(`${NS}.ui.autoName`)}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {t(`${NS}.ui.autoBadge`)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {t(`${NS}.ui.autoDesc`)}
                  </p>
                </button>
              </div>

              {/* Popular Breeds Quick Selector */}
              <div>
                <Label className="text-xs text-muted-foreground">{t(`${NS}.ui.popularBreedsLabel`)}</Label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {POPULAR_BREEDS.map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => handleBreedClick(b)}
                      className="rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-xs text-foreground/80 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Physical Attributes (Sex & Paw Density) */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">{t(`${NS}.ui.section3Title`)}</CardTitle>
              <CardDescription>{t(`${NS}.ui.section3Desc`)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Sex Selection */}
                <div>
                  <Label className="text-xs font-medium">{t(`${NS}.ui.sexLabel`)}</Label>
                  <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg border bg-muted p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setSex("male")}
                      className={`rounded-md py-1.5 font-medium transition-all ${
                        sex === "male"
                          ? "bg-background font-semibold text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t(`${NS}.ui.sexMale`)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSex("female")}
                      className={`rounded-md py-1.5 font-medium transition-all ${
                        sex === "female"
                          ? "bg-background font-semibold text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t(`${NS}.ui.sexFemale`)}
                    </button>
                  </div>
                </div>

                {/* Paw Density */}
                <div>
                  <Label className="text-xs font-medium">{t(`${NS}.ui.pawLabel`)}</Label>
                  <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg border bg-muted p-1 text-[11px]">
                    {[
                      { id: "dainty", label: t(`${NS}.ui.pawDainty`) },
                      { id: "normal", label: t(`${NS}.ui.pawNormal`) },
                      { id: "large", label: t(`${NS}.ui.pawLarge`) },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPawBoneStructure(p.id as typeof pawBoneStructure)}
                        className={`rounded-md py-1.5 text-center font-medium transition-all ${
                          pawBoneStructure === p.id
                            ? "bg-background font-semibold text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Results & Milestones Column */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="sticky top-24 border-primary/30 bg-card shadow-md">
            <CardHeader className="border-b border-border/50 bg-primary/5 pb-4">
              <Badge variant="outline" className="w-fit border-primary/40 bg-background font-mono text-primary text-xs">
                {t(`${NS}.ui.outputBadge`)}
              </Badge>
              <CardTitle className="text-2xl font-display mt-2">{t(`${NS}.ui.outputTitle`)}</CardTitle>
              <CardDescription>
                {t(`${NS}.ui.outputDesc`, { weeks: ageWeeks, category: effectiveCategory.name })}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Primary Metric: Adult Weight */}
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-center shadow-inner">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(`${NS}.ui.adultWeightLabel`)}
                </div>
                <div className="mt-2 text-4xl font-black tracking-tight text-primary font-mono sm:text-5xl">
                  {unit === "kg" ? (
                    <>
                      {results.estimatedAdultKg} <span className="text-2xl font-semibold">{t(`${NS}.ui.unitShortKg`)}</span>
                    </>
                  ) : (
                    <>
                      {results.estimatedAdultLbs} <span className="text-2xl font-semibold">{t(`${NS}.ui.unitShortLbs`)}</span>
                    </>
                  )}
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-muted-foreground">
                  {unit === "kg"
                    ? t(`${NS}.ui.adultWeightRange`, { min: results.minAdultKg, max: results.maxAdultKg, unit: t(`${NS}.ui.unitShortKg`) })
                    : t(`${NS}.ui.adultWeightRange`, { min: results.minAdultLbs, max: results.maxAdultLbs, unit: t(`${NS}.ui.unitShortLbs`) })}
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs text-foreground shadow-sm">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  {t(`${NS}.ui.currentlyAt`, { pct: results.currentPercent })}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>{t(`${NS}.ui.growthProgress`)}</span>
                  <span className="font-bold text-foreground">{t(`${NS}.ui.pctMature`, { pct: results.currentPercent })}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, results.currentPercent))}%` }}
                  />
                </div>
              </div>

              {/* Physical Dimensions & Sizing Breakdown */}
              <div className="space-y-3 rounded-xl border bg-muted/20 p-4 text-xs">
                <div className="font-semibold text-foreground flex items-center justify-between">
                  <span>{t(`${NS}.ui.dimensionsTitle`)}</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {effectiveCategory.name}
                  </Badge>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Ruler className="size-3 text-primary" /> {t(`${NS}.ui.heightLabel`)}
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {t(`${NS}.ui.heightValue`, { inch: results.estHeightInches, cm: results.estHeightCm })}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="size-3 text-primary" /> {t(`${NS}.ui.growthPhaseLabel`)}
                  </span>
                  <span className="font-semibold text-primary">{results.growthStage}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3 text-primary" /> {t(`${NS}.ui.plateClosureLabel`)}
                  </span>
                  <span className="font-mono font-bold text-foreground">{results.plateClosure}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">{t(`${NS}.ui.crateLabel`)}</span>
                  <span className="font-semibold text-foreground">{results.crateSizeName}</span>
                </div>
              </div>

              {/* Large / Giant Breed Calcium Notice */}
              {results.isLargeOrGiant && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-950 dark:text-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="size-4 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <strong>{t(`${NS}.ui.warningTitle`)}</strong> {t(`${NS}.ui.warningBody1`)}{" "}
                      <strong>{t(`${NS}.ui.warningBody2`)}</strong> {t(`${NS}.ui.warningBody3`)}
                    </div>
                  </div>
                </div>
              )}

              {/* Projected Growth Milestones Table */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Scale className="size-3.5 text-primary" />
                  {t(`${NS}.ui.milestonesTitle`)}
                </div>
                <div className="rounded-xl border overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-muted/80 text-[11px] font-semibold text-muted-foreground uppercase border-b">
                      <tr>
                        <th className="px-3 py-1.5">{t(`${NS}.ui.tableAge`)}</th>
                        <th className="px-3 py-1.5">{t(`${NS}.ui.tableWeight`)}</th>
                        <th className="px-3 py-1.5 text-right">{t(`${NS}.ui.tablePctAdult`)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {results.milestones.map((m) => (
                        <tr
                          key={m.weeks}
                          className={`transition-colors ${
                            m.isPast ? "bg-primary/5 font-medium" : "hover:bg-muted/30"
                          }`}
                        >
                          <td className="px-3 py-1.5">
                            {t(`${NS}.ui.milestoneAge`, { weeks: m.weeks })}{" "}
                            <span className="text-[10px] text-muted-foreground">{t(`${NS}.ui.milestoneMonths`, { months: m.months })}</span>
                          </td>
                          <td className="px-3 py-1.5 font-mono">
                            {unit === "kg"
                              ? t(`${NS}.ui.milestoneKg`, { kg: m.kg })
                              : t(`${NS}.ui.milestoneLbs`, { lbs: m.lbs })}
                          </td>
                          <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                            {m.pct}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

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
