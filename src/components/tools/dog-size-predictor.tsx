import { useState, useMemo } from "react";
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

const SIZE_CATEGORIES: SizeCategory[] = [
  {
    id: "toy",
    name: "Toy / Extra-Small",
    weightRange: "< 12 lbs (< 5.5 kg)",
    adultWeightLbs: [4, 11],
    adultHeightInches: [6, 10],
    maturityWeeks: 40, // 9-10 months
    halfWeightWeeks: 12, // 50% at 3 months
    examples: "Chihuahua, Yorkshire Terrier, Pomeranian, Toy Poodle, Maltese",
  },
  {
    id: "small",
    name: "Small Breed",
    weightRange: "12 – 25 lbs (5.5 – 11 kg)",
    adultWeightLbs: [12, 25],
    adultHeightInches: [10, 15],
    maturityWeeks: 48, // 11-12 months
    halfWeightWeeks: 15,
    examples: "French Bulldog, Pug, Dachshund, Boston Terrier, Cavalier King Charles",
  },
  {
    id: "medium",
    name: "Medium Breed",
    weightRange: "26 – 50 lbs (12 – 23 kg)",
    adultWeightLbs: [26, 50],
    adultHeightInches: [16, 21],
    maturityWeeks: 56, // 12-14 months
    halfWeightWeeks: 18,
    examples: "Beagle, Border Collie, Australian Shepherd, English Bulldog, Corgi",
  },
  {
    id: "large",
    name: "Large Breed",
    weightRange: "51 – 85 lbs (23 – 39 kg)",
    adultWeightLbs: [51, 85],
    adultHeightInches: [22, 26],
    maturityWeeks: 70, // 15-18 months
    halfWeightWeeks: 22,
    examples: "Labrador Retriever, Golden Retriever, German Shepherd, Boxer, Standard Poodle",
  },
  {
    id: "giant",
    name: "Giant Breed",
    weightRange: "86 – 150+ lbs (39 – 70+ kg)",
    adultWeightLbs: [86, 150],
    adultHeightInches: [27, 34],
    maturityWeeks: 96, // 20-24 months
    halfWeightWeeks: 26,
    examples: "Great Dane, Saint Bernard, English Mastiff, Bernese Mountain Dog, Cane Corso",
  },
];

const POPULAR_BREEDS = [
  { name: "Labrador Retriever", category: "large", adultRangeLbs: [55, 80] },
  { name: "German Shepherd", category: "large", adultRangeLbs: [50, 88] },
  { name: "Golden Retriever", category: "large", adultRangeLbs: [55, 75] },
  { name: "French Bulldog", category: "small", adultRangeLbs: [18, 28] },
  { name: "Beagle", category: "medium", adultRangeLbs: [20, 30] },
  { name: "Poodle (Standard)", category: "large", adultRangeLbs: [45, 70] },
  { name: "Chihuahua", category: "toy", adultRangeLbs: [3.5, 6.5] },
  { name: "Great Dane", category: "giant", adultRangeLbs: [110, 175] },
  { name: "Mixed / Unknown Breed", category: "auto", adultRangeLbs: [0, 0] },
];

export function DogSizePredictor() {
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [currentWeightInput, setCurrentWeightInput] = useState<number>(18);
  const [ageWeeks, setAgeWeeks] = useState<number>(16);
  const [selectedCategory, setSelectedCategory] = useState<string>("large");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [pawBoneStructure, setPawBoneStructure] = useState<"normal" | "large" | "dainty">("normal");

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
  }, [selectedCategory, weightLbs, ageWeeks]);

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
    let growthStage = "Early Accelerated Phase";
    let growthDescription = "Rapid linear skeletal lengthening and cartilage development.";
    let plateClosure = `${Math.round(maturityWks / 4.33)} – ${Math.round((maturityWks + 8) / 4.33)} Months`;

    if (currentPercent < 40) {
      growthStage = "Peak Skeletal Acceleration";
      growthDescription = "Primary long-bone elongation (femur, humerus). Highest daily caloric requirement per pound.";
    } else if (currentPercent < 75) {
      growthStage = "Secondary Muscular Fill";
      growthDescription = "Bone growth slows; thorax deepens and lean muscle mass accumulates.";
    } else if (currentPercent < 92) {
      growthStage = "Late Maturation & Growth Plate Fusion";
      growthDescription = "Distal growth plates (radius, ulna) are closing. Frame reaches adult height; chest broadens.";
    } else {
      growthStage = "Full Adult Frame Achieved";
      growthDescription = "Epiphyseal growth plates fully ossified. Transition to adult maintenance food formula.";
    }

    // Recommended Adult Crate Size (Length in inches)
    // Crate length should be adult nose-to-tail length + 4 inches
    const crateLengthInches = Math.round(estHeightInches * 1.45 + 4);
    const crateSizeName =
      crateLengthInches <= 24
        ? "24\" Small"
        : crateLengthInches <= 30
        ? "30\" Medium"
        : crateLengthInches <= 36
        ? "36\" Intermediate"
        : crateLengthInches <= 42
        ? "42\" Large"
        : crateLengthInches <= 48
        ? "48\" Extra-Large"
        : "54\" Giant";

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
  }, [effectiveCategory, weightLbs, ageWeeks, boneModifier, sexModifier]);

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
              Veterinary Canine Pediatric Allometry & Adult Size Prediction
            </h2>
            <p className="mt-1 leading-relaxed">
              Unlike human growth, a puppy’s adult weight cannot be calculated with linear formulas.
              Canines follow a distinct <strong>sigmoidal (S-shaped) Gompertz growth curve</strong> where toy breeds complete skeletal growth by 9–10 months,
              while large and giant breeds continue epiphysis bone development and chest broadening for up to <strong>18 to 24 months</strong>.
              This calculator models age, somatotype breed category, sexual dimorphism, and skeletal structure to forecast adult mass, wither height, and developmental plate closure.
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
                  <CardTitle className="text-xl">1. Current Age & Body Weight</CardTitle>
                  <CardDescription>Enter your puppy’s exact current weight and age</CardDescription>
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
                    Pounds (lbs)
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
                    Kilograms (kg)
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Current Weight Input */}
              <div>
                <div className="flex items-center justify-between text-sm font-medium">
                  <Label htmlFor="current-weight">Current Puppy Weight</Label>
                  <span className="font-mono text-base font-bold text-primary">
                    {currentWeightInput} {unit}
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
                  <span className="text-[11px] text-muted-foreground self-center mr-1">Quick Presets:</span>
                  {[5, 12, 20, 35, 50].map((lb) => (
                    <Button
                      key={lb}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickWeightPreset(lb)}
                      className="h-6 text-xs px-2"
                    >
                      {unit === "kg" ? `${(lb / 2.20462).toFixed(1)} kg` : `${lb} lbs`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Age in Weeks Slider & Input */}
              <div className="rounded-xl bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-medium">
                  <Label htmlFor="puppy-age" className="flex items-center gap-1.5 text-sm font-medium">
                    <Calendar className="size-4 text-primary" />
                    Puppy Age: <span className="font-bold text-foreground">{ageWeeks} Weeks</span>
                  </Label>
                  <span className="font-mono text-xs text-muted-foreground">
                    ≈ {(ageWeeks / 4.33).toFixed(1)} Months
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
                  <span>6 Wks (1.5 Mo)</span>
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
                        {w}w
                      </button>
                    ))}
                  </div>
                  <span>60 Wks (14 Mo)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Breed Size Category & Popular Breed Quick Fill */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">2. Adult Breed Size Classification</CardTitle>
              <CardDescription>
                Growth trajectories diverge significantly between toy and giant canine somatotypes
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
                    <span className="font-semibold text-sm text-foreground">Mixed / Unknown Breed</span>
                    <Badge variant="secondary" className="text-[10px]">
                      Auto-Detect Curve
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Infers adult curve from current age-to-weight ratio
                  </p>
                </button>
              </div>

              {/* Popular Breeds Quick Selector */}
              <div>
                <Label className="text-xs text-muted-foreground">Popular Breed Templates:</Label>
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
              <CardTitle className="text-xl">3. Biological Modifiers</CardTitle>
              <CardDescription>Accounts for sexual dimorphism and skeletal bone density</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Sex Selection */}
                <div>
                  <Label className="text-xs font-medium">Biological Sex</Label>
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
                      Male (Heavier)
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
                      Female
                    </button>
                  </div>
                </div>

                {/* Paw Density */}
                <div>
                  <Label className="text-xs font-medium">Paw & Joint Bone Thickness</Label>
                  <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg border bg-muted p-1 text-[11px]">
                    {[
                      { id: "dainty", label: "Dainty" },
                      { id: "normal", label: "Normal" },
                      { id: "large", label: "Big Paws" },
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
                Pediatric Growth Projection
              </Badge>
              <CardTitle className="text-2xl font-display mt-2">Predicted Adult Size</CardTitle>
              <CardDescription>
                Calculated at {ageWeeks} Weeks ({effectiveCategory.name})
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Primary Metric: Adult Weight */}
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-center shadow-inner">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Estimated Adult Weight
                </div>
                <div className="mt-2 text-4xl font-black tracking-tight text-primary font-mono sm:text-5xl">
                  {unit === "kg" ? (
                    <>
                      {results.estimatedAdultKg} <span className="text-2xl font-semibold">kg</span>
                    </>
                  ) : (
                    <>
                      {results.estimatedAdultLbs} <span className="text-2xl font-semibold">lbs</span>
                    </>
                  )}
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-muted-foreground">
                  {unit === "kg"
                    ? `(${results.minAdultKg} – ${results.maxAdultKg} kg)`
                    : `(${results.minAdultLbs} – ${results.maxAdultLbs} lbs)`}
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs text-foreground shadow-sm">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  Currently at {results.currentPercent}% of adult mass
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>Growth Progress</span>
                  <span className="font-bold text-foreground">{results.currentPercent}% Mature</span>
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
                  <span>Adult Physical Dimensions</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {effectiveCategory.name}
                  </Badge>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Ruler className="size-3 text-primary" /> Shoulder (Wither) Height:
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    ~{results.estHeightInches} in ({results.estHeightCm} cm)
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="size-3 text-primary" /> Growth Velocity Phase:
                  </span>
                  <span className="font-semibold text-primary">{results.growthStage}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3 text-primary" /> Growth Plate Closure:
                  </span>
                  <span className="font-mono font-bold text-foreground">{results.plateClosure}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Recommended Adult Crate:</span>
                  <span className="font-semibold text-foreground">{results.crateSizeName}</span>
                </div>
              </div>

              {/* Large / Giant Breed Calcium Notice */}
              {results.isLargeOrGiant && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-950 dark:text-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="size-4 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <strong>Large Breed Feeding Warning:</strong> Dogs with predicted adult weight &gt; 50 lbs must be fed a 
                      <strong> certified Large Breed Puppy formula</strong> with controlled calcium (0.8%–1.2%) and moderate energy density.
                      Excessive calories and over-supplementation accelerate growth too quickly, causing crippling hip and elbow dysplasia.
                    </div>
                  </div>
                </div>
              )}

              {/* Projected Growth Milestones Table */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Scale className="size-3.5 text-primary" />
                  Growth Trajectory Milestones:
                </div>
                <div className="rounded-xl border overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-muted/80 text-[11px] font-semibold text-muted-foreground uppercase border-b">
                      <tr>
                        <th className="px-3 py-1.5">Age</th>
                        <th className="px-3 py-1.5">Weight</th>
                        <th className="px-3 py-1.5 text-right">% Adult</th>
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
                            {m.weeks} wks <span className="text-[10px] text-muted-foreground">({m.months} mo)</span>
                          </td>
                          <td className="px-3 py-1.5 font-mono">
                            {unit === "kg" ? `${m.kg} kg` : `${m.lbs} lbs`}
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
                  Reset to Standard Puppy Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
