import { useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormattedMarkdown } from "@/components/ui/formatted-markdown";
import {
  Upload,
  Camera,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Scale,
  Flame,
  Clock,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";

type Species = "dog" | "cat";

type T = (key: string, options?: Record<string, unknown>) => string;
const NS = "pet-body-condition-photo";
type Unit = "lbs" | "kg";

interface WSAVATier {
  score: number;
  label: string;
  category: "underweight" | "ideal" | "overweight" | "obese";
  colorClass: string;
  badgeBg: string;
  ribFeel: string;
  waistAerial: string;
  abdominalTuck: string;
  fatCover: string;
  healthRisk: string;
  excessFatPercent: number; // relative to ideal weight (0 at BCS 5)
}

function getWsavaTiers(t: T): Record<number, WSAVATier> { return {
  1: {
    score: 1,
    label: t(`${NS}.ui.tier1Label`),
    category: t(`${NS}.ui.categoryUnderweight`) as "underweight",
    colorClass: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300",
    ribFeel: t(`${NS}.ui.tier1RibFeel`),
    waistAerial: t(`${NS}.ui.tier1Waist`),
    abdominalTuck: t(`${NS}.ui.tier1Tuck`),
    fatCover: t(`${NS}.ui.tier1Fat`),
    healthRisk: t(`${NS}.ui.tier1Risk`),
    excessFatPercent: -30,
  },
  2: {
    score: 2,
    label: t(`${NS}.ui.tier2Label`),
    category: t(`${NS}.ui.categoryUnderweight`) as "underweight",
    colorClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
    ribFeel: t(`${NS}.ui.tier2RibFeel`),
    waistAerial: t(`${NS}.ui.tier2Waist`),
    abdominalTuck: t(`${NS}.ui.tier2Tuck`),
    fatCover: t(`${NS}.ui.tier2Fat`),
    healthRisk: t(`${NS}.ui.tier2Risk`),
    excessFatPercent: -20,
  },
  3: {
    score: 3,
    label: t(`${NS}.ui.tier3Label`),
    category: t(`${NS}.ui.categoryUnderweight`) as "underweight",
    colorClass: "text-yellow-600 dark:text-yellow-400",
    badgeBg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-300",
    ribFeel: t(`${NS}.ui.tier3RibFeel`),
    waistAerial: t(`${NS}.ui.tier3Waist`),
    abdominalTuck: t(`${NS}.ui.tier3Tuck`),
    fatCover: t(`${NS}.ui.tier3Fat`),
    healthRisk: t(`${NS}.ui.tier3Risk`),
    excessFatPercent: -10,
  },
  4: {
    score: 4,
    label: t(`${NS}.ui.tier4Label`),
    category: t(`${NS}.ui.categoryIdeal`) as "ideal",
    colorClass: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300",
    ribFeel: t(`${NS}.ui.tier4RibFeel`),
    waistAerial: t(`${NS}.ui.tier4Waist`),
    abdominalTuck: t(`${NS}.ui.tier4Tuck`),
    fatCover: t(`${NS}.ui.tier4Fat`),
    healthRisk: t(`${NS}.ui.tier4Risk`),
    excessFatPercent: -5,
  },
  5: {
    score: 5,
    label: t(`${NS}.ui.tier5Label`),
    category: t(`${NS}.ui.categoryIdeal`) as "ideal",
    colorClass: "text-emerald-700 dark:text-emerald-300 font-bold",
    badgeBg: "bg-emerald-500 text-white border-emerald-600 shadow-sm",
    ribFeel: t(`${NS}.ui.tier5RibFeel`),
    waistAerial: t(`${NS}.ui.tier5Waist`),
    abdominalTuck: t(`${NS}.ui.tier5Tuck`),
    fatCover: t(`${NS}.ui.tier5Fat`),
    healthRisk: t(`${NS}.ui.tier5Risk`),
    excessFatPercent: 0,
  },
  6: {
    score: 6,
    label: t(`${NS}.ui.tier6Label`),
    category: t(`${NS}.ui.categoryOverweight`) as "overweight",
    colorClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
    ribFeel: t(`${NS}.ui.tier6RibFeel`),
    waistAerial: t(`${NS}.ui.tier6Waist`),
    abdominalTuck: t(`${NS}.ui.tier6Tuck`),
    fatCover: t(`${NS}.ui.tier6Fat`),
    healthRisk: t(`${NS}.ui.tier6Risk`),
    excessFatPercent: 10,
  },
  7: {
    score: 7,
    label: t(`${NS}.ui.tier7Label`),
    category: t(`${NS}.ui.categoryOverweight`) as "overweight",
    colorClass: "text-orange-600 dark:text-orange-400",
    badgeBg: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300",
    ribFeel: t(`${NS}.ui.tier7RibFeel`),
    waistAerial: t(`${NS}.ui.tier7Waist`),
    abdominalTuck: t(`${NS}.ui.tier7Tuck`),
    fatCover: t(`${NS}.ui.tier7Fat`),
    healthRisk: t(`${NS}.ui.tier7Risk`),
    excessFatPercent: 20,
  },
  8: {
    score: 8,
    label: t(`${NS}.ui.tier8Label`),
    category: t(`${NS}.ui.categoryObese`) as "obese",
    colorClass: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300",
    ribFeel: t(`${NS}.ui.tier8RibFeel`),
    waistAerial: t(`${NS}.ui.tier8Waist`),
    abdominalTuck: t(`${NS}.ui.tier8Tuck`),
    fatCover: t(`${NS}.ui.tier8Fat`),
    healthRisk: t(`${NS}.ui.tier8Risk`),
    excessFatPercent: 30,
  },
  9: {
    score: 9,
    label: t(`${NS}.ui.tier9Label`),
    category: t(`${NS}.ui.categoryObese`) as "obese",
    colorClass: "text-rose-700 dark:text-rose-300 font-extrabold",
    badgeBg: "bg-rose-600 text-white border-rose-700 shadow-md",
    ribFeel: t(`${NS}.ui.tier9RibFeel`),
    waistAerial: t(`${NS}.ui.tier9Waist`),
    abdominalTuck: t(`${NS}.ui.tier9Tuck`),
    fatCover: t(`${NS}.ui.tier9Fat`),
    healthRisk: t(`${NS}.ui.tier9Risk`),
    excessFatPercent: 40,
  },
};
}

function getSamplePresets(t: T) { return [
  {
    name: t(`${NS}.ui.presetHealthyName`),
    species: "dog" as Species,
    weight: 55,
    unit: "lbs" as Unit,
    score: 5,
    ribSweep: 3,
    waistTaper: 3,
    tuckDepth: 2,
    coatType: "medium",
    notes: t(`${NS}.ui.presetHealthyNotes`),
  },
  {
    name: t(`${NS}.ui.presetBeagleName`),
    species: "dog" as Species,
    weight: 38,
    unit: "lbs" as Unit,
    score: 7,
    ribSweep: 4,
    waistTaper: 4,
    tuckDepth: 3,
    coatType: "short",
    notes: t(`${NS}.ui.presetBeagleNotes`),
  },
  {
    name: t(`${NS}.ui.presetCatName`),
    species: "cat" as Species,
    weight: 14,
    unit: "lbs" as Unit,
    score: 7,
    ribSweep: 4,
    waistTaper: 4,
    tuckDepth: 3,
    coatType: "short",
    notes: t(`${NS}.ui.presetCatNotes`),
  },
  {
    name: t(`${NS}.ui.presetRescueName`),
    species: "dog" as Species,
    weight: 22,
    unit: "lbs" as Unit,
    score: 3,
    ribSweep: 2,
    waistTaper: 1,
    tuckDepth: 1,
    coatType: "short",
    notes: t(`${NS}.ui.presetRescueNotes`),
  },
];
}

async function compressImage(file: File, maxDim = 1280, quality = 0.85): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Could not load image"));
      i.src = url;
    });
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function PetBodyConditionPhotoAnalyzer() {
  const { t } = useTranslation("tools");
  const WSAVA_TIERS = useMemo(() => getWsavaTiers(t), [t]);
  const SAMPLE_PRESETS = useMemo(() => getSamplePresets(t), [t]);
  // Pet Basic State
  const [species, setSpecies] = useState<Species>("dog");
  const [unit, setUnit] = useState<Unit>("lbs");
  const [weightInput, setWeightInput] = useState<string>("45");
  const [coatType, setCoatType] = useState<"short" | "medium" | "long" | "fluffy">("short");
  const [isCatPrimordialPouch, setIsCatPrimordialPouch] = useState(false);

  // Photos
  const [topPhoto, setTopPhoto] = useState<string | null>(null);
  const [sidePhoto, setSidePhoto] = useState<string | null>(null);
  const topInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  // Interactive 3-Point Palpation Controls (1 to 5 index)
  const [ribSweep, setRibSweep] = useState<number>(3); // 1=prominent, 3=ideal, 5=impossible
  const [waistTaper, setWaistTaper] = useState<number>(3); // 1=extreme hollow, 3=ideal hourglass, 5=barrel bulge
  const [tuckDepth, setTuckDepth] = useState<number>(2); // 1=extreme tuck, 2=ideal tuck, 3=flat, 4=pendulous

  // Manual or AI-calculated BCS (1 to 9)
  const [bcsScore, setBcsScore] = useState<number>(5);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<string>("");
  const [analysisMethod, setAnalysisMethod] = useState<"clinical" | "ai" | null>(null);
  const [copied, setCopied] = useState(false);

  // Parse weight to kg
  const weightKg = useMemo(() => {
    const raw = parseFloat(weightInput);
    if (isNaN(raw) || raw <= 0) return 20;
    return unit === "lbs" ? raw * 0.453592 : raw;
  }, [weightInput, unit]);

  // Current selected BCS Tier details
  const currentTier = useMemo(() => {
    return WSAVA_TIERS[bcsScore] || WSAVA_TIERS[5];
  }, [bcsScore]);

  // Calculate Ideal Weight & Nutritional Metrics based on WSAVA Formula
  const nutritionalMetrics = useMemo(() => {
    // Formula: Each BCS number above 5 represents ~10% to 15% excess fat
    // Ideal Weight (kg) = Current Weight / (1 + (BCS - 5) * 0.1)
    const excessFactor = (bcsScore - 5) * 0.1;
    const idealKg = weightKg / (1 + excessFactor);
    const idealDisplay = unit === "lbs" ? idealKg * 2.20462 : idealKg;
    const currentDisplay = unit === "lbs" ? weightKg * 2.20462 : weightKg;
    const diffDisplay = Math.abs(currentDisplay - idealDisplay);

    // Resting Energy Requirement (RER) in kcal/day = 70 * (Ideal Weight in kg) ^ 0.75
    const rer = Math.round(70 * Math.pow(idealKg, 0.75));

    // Maintenance Energy Requirement (MER)
    let merMultiplier = 1.4;
    let weightLossGoal = t(`${NS}.ui.goalMaintain`);
    let targetWeeklyLossPercent = 0;

    if (bcsScore > 5) {
      // Weight loss recommendation:
      // Dog weight loss: 1.0 * RER; Cat weight loss: 0.8 * RER (to avoid hepatic lipidosis)
      merMultiplier = species === "cat" ? 0.8 : 1.0;
      targetWeeklyLossPercent = 1.2; // 1.2% per week safe loss
      weightLossGoal = t(`${NS}.ui.goalLoss`);
    } else if (bcsScore < 4) {
      // Weight gain recommendation
      merMultiplier = species === "cat" ? 1.4 : 1.6;
      weightLossGoal = t(`${NS}.ui.goalGain`);
    } else {
      // Ideal weight maintenance
      merMultiplier = species === "cat" ? 1.2 : 1.5;
      weightLossGoal = t(`${NS}.ui.goalBalance`);
    }

    const targetDailyKcal = Math.round(rer * merMultiplier);
    const treatKcalLimit = Math.round(targetDailyKcal * 0.1); // Treats max 10%

    // Safe timeline to achieve ideal BCS (weeks)
    let projectedWeeks = 0;
    if (bcsScore > 5) {
      const excessWeightKg = weightKg - idealKg;
      const safeWeeklyLossKg = weightKg * 0.012; // 1.2% per week
      projectedWeeks = Math.max(2, Math.ceil(excessWeightKg / safeWeeklyLossKg));
    } else if (bcsScore < 4) {
      const deficitWeightKg = idealKg - weightKg;
      const safeWeeklyGainKg = weightKg * 0.01;
      projectedWeeks = Math.max(2, Math.ceil(deficitWeightKg / safeWeeklyGainKg));
    }

    return {
      idealKg,
      idealDisplay: Math.round(idealDisplay * 10) / 10,
      currentDisplay: Math.round(currentDisplay * 10) / 10,
      diffDisplay: Math.round(diffDisplay * 10) / 10,
      rer,
      targetDailyKcal,
      treatKcalLimit,
      projectedWeeks,
      weightLossGoal,
    };
  }, [bcsScore, weightKg, unit, species]);

  // Compute Algorithmic Score from Palpation & Biometrics
  const computeClinicalBCS = () => {
    const ribScoreMap: Record<number, number> = { 1: 1.5, 2: 3, 3: 5, 4: 7, 5: 8.5 };
    const waistScoreMap: Record<number, number> = { 1: 1.5, 2: 3, 3: 5, 4: 7, 5: 8.5 };
    const tuckScoreMap: Record<number, number> = { 1: 2, 2: 5, 3: 7, 4: 8.5 };

    const r = ribScoreMap[ribSweep] ?? 5;
    const w = waistScoreMap[waistTaper] ?? 5;
    const t = tuckScoreMap[tuckDepth] ?? 5;

    let weighted = r * 0.45 + w * 0.35 + t * 0.2;

    if (coatType === "fluffy" && weighted > 5) {
      weighted = Math.max(5, weighted - 0.5);
    }

    if (species === "cat" && isCatPrimordialPouch && tuckDepth >= 3) {
      weighted = Math.max(4, weighted - 0.7);
    }

    return Math.min(9, Math.max(1, Math.round(weighted)));
  };

  // Handle image upload & compression
  const handlePhotoUpload = async (file: File | undefined, slot: "top" | "side") => {
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      if (slot === "top") setTopPhoto(compressed);
      else setSidePhoto(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (slot === "top") setTopPhoto(String(reader.result));
        else setSidePhoto(String(reader.result));
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply Sample Preset
  const applyPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    setSpecies(preset.species);
    setWeightInput(preset.weight.toString());
    setUnit(preset.unit);
    setRibSweep(preset.ribSweep);
    setWaistTaper(preset.waistTaper);
    setTuckDepth(preset.tuckDepth);
    setCoatType(preset.coatType as any);
    setBcsScore(preset.score);
    setAnalysisMethod("clinical");
    setAiReport(
      t(`${NS}.ui.presetAppliedTitle`, { name: preset.name }) + "\n\n" +
      preset.notes +
      "\n\n" +
      t(`${NS}.ui.presetSpeciesLine`, { species: preset.species.toUpperCase() }) +
      "\n" +
      t(`${NS}.ui.presetWeightLine`, { weight: preset.weight, unit: preset.unit }) +
      "\n" +
      t(`${NS}.ui.presetBcsLine`, { score: preset.score, label: WSAVA_TIERS[preset.score]?.label })
    );
  };

  // Main Comprehensive Analysis Trigger
  const runAnalysis = async () => {
    setAnalyzing(true);
    setAiReport("");

    const computedScore = computeClinicalBCS();
    setBcsScore(computedScore);

    const activePhoto = topPhoto || sidePhoto;

    if (activePhoto) {
      try {
        const promptText = `Evaluate this ${species}'s Body Condition Score on the WSAVA 9-Point scale.
Pet Context:
- Species: ${species}
- Weight: ${weightInput} ${unit}
- Coat: ${coatType}
- Owner Rib Palpation: Level ${ribSweep}/5
- Owner Waist Aerial Observation: Level ${waistTaper}/5
- Owner Abdominal Tuck Observation: Level ${tuckDepth}/4
${species === "cat" && isCatPrimordialPouch ? "- Note: Cat has a natural primordial pouch (loose skin)." : ""}

Please return concise structured Markdown:
1. **WSAVA Body Condition Score:** [X/9] and Category (Underweight / Ideal / Overweight / Obese)
2. **Key Visual Observations:** (Rib silhouette, dorsal waist taper, lateral abdominal tuck, fat deposits)
3. **Ideal Target Weight:** Estimated target weight and percentage deviation
4. **Actionable Veterinary Nutrition Plan:**
   - Calorie management and food portion adjustments
   - Safe weekly weight change rate
   - Exercise or activity recommendations
5. **Palpation Reality Check:** Quick tip on verifying with the knuckle test at home.`;

        const res = await fetch("/api/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: activePhoto,
            prompt: promptText,
            system:
              "You are a board-certified veterinary nutritionist specializing in feline and canine WSAVA Body Condition Scoring (BCS) and clinical weight management.",
          }),
        });

        if (res.ok) {
          const data = (await res.json()) as { content?: string; error?: string };
          if (data.content && data.content.trim()) {
            setAiReport(data.content);
            setAnalysisMethod("ai");

            const scoreMatch = data.content.match(/\b([1-9])\s*\/\s*9\b/);
            if (scoreMatch && scoreMatch[1]) {
              const aiScore = parseInt(scoreMatch[1], 10);
              if (aiScore >= 1 && aiScore <= 9) {
                setBcsScore(aiScore);
              }
            }
            setAnalyzing(false);
            return;
          }
        }
      } catch {
        // Continue to fallback
      }
    }

    setTimeout(() => {
      const tier = WSAVA_TIERS[computedScore];
      const fallbackReport =
        t(`${NS}.ui.fallbackTitle`) +
        "\n\n" +
        t(`${NS}.ui.fallbackPetLine`, {
          pet: species === "dog" ? t(`${NS}.ui.fallbackPetDog`) : t(`${NS}.ui.fallbackPetCat`),
        }) +
        "\n" +
        t(`${NS}.ui.fallbackScoreLine`, { label: tier.label, category: tier.category.toUpperCase() }) +
        "\n\n" +
        t(`${NS}.ui.fallbackMorphTitle`) +
        "\n" +
        t(`${NS}.ui.fallbackRibLine`, { text: tier.ribFeel }) +
        "\n" +
        t(`${NS}.ui.fallbackWaistLine`, { text: tier.waistAerial }) +
        "\n" +
        t(`${NS}.ui.fallbackTuckLine`, { text: tier.abdominalTuck }) +
        "\n" +
        t(`${NS}.ui.fallbackFatLine`, { text: tier.fatCover }) +
        "\n\n" +
        t(`${NS}.ui.fallbackPrognosisTitle`) +
        "\n" +
        tier.healthRisk +
        "\n\n" +
        t(`${NS}.ui.fallbackNutritionTitle`) +
        "\n" +
        t(`${NS}.ui.fallbackCurrentWeight`, {
          weight: weightInput,
          unit,
          kg: Math.round(weightKg * 10) / 10,
        }) +
        "\n" +
        t(`${NS}.ui.fallbackIdealWeight`, {
          ideal: nutritionalMetrics.idealDisplay,
          unit,
          idealkg: Math.round(nutritionalMetrics.idealKg * 10) / 10,
        }) +
        "\n" +
        t(`${NS}.ui.fallbackRer`, { rer: nutritionalMetrics.rer }) +
        "\n" +
        t(`${NS}.ui.fallbackIntake`, { kcal: nutritionalMetrics.targetDailyKcal }) +
        "\n" +
        t(`${NS}.ui.fallbackTreat`, { treat: nutritionalMetrics.treatKcalLimit }) +
        "\n" +
        (computedScore > 5
          ? t(`${NS}.ui.fallbackTimeline`, { weeks: nutritionalMetrics.projectedWeeks }) + "\n"
          : "") +
        "\n" +
        t(`${NS}.ui.fallbackFooter`);
      setAiReport(fallbackReport);
      setAnalysisMethod("clinical");
      setAnalyzing(false);
    }, 450);
  };

  const copyReport = async () => {
    const textToCopy =
      t(`${NS}.ui.reportClipboardTitle`) +
      "\n" +
      t(`${NS}.ui.reportClipboardSpecies`, { species: species.toUpperCase() }) +
      "\n" +
      t(`${NS}.ui.reportClipboardWeight`, { weight: weightInput, unit }) +
      "\n" +
      t(`${NS}.ui.reportClipboardScore`, {
        label: currentTier.label,
        category: currentTier.category.toUpperCase(),
      }) +
      "\n" +
      t(`${NS}.ui.reportClipboardIdeal`, { ideal: nutritionalMetrics.idealDisplay, unit }) +
      "\n" +
      t(`${NS}.ui.reportClipboardKcal`, { kcal: nutritionalMetrics.targetDailyKcal }) +
      "\n" +
      t(`${NS}.ui.reportClipboardRer`, { rer: nutritionalMetrics.rer }) +
      "\n\n" +
      t(`${NS}.ui.reportClipboardPalpation`) +
      "\n" +
      t(`${NS}.ui.reportClipboardRibs`, { text: currentTier.ribFeel }) +
      "\n" +
      t(`${NS}.ui.reportClipboardWaist`, { text: currentTier.waistAerial }) +
      "\n" +
      t(`${NS}.ui.reportClipboardAbdomen`, { text: currentTier.abdominalTuck }) +
      "\n" +
      t(`${NS}.ui.reportClipboardMedical`, { text: currentTier.healthRisk }) +
      "\n\n" +
      t(`${NS}.ui.reportClipboardFooter`);

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-emerald-500/10 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/40 text-primary font-semibold">
                <Sparkles className="mr-1 h-3.5 w-3.5" />{t(`${NS}.ui.badgeAi`)}
              </Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {t(`${NS}.ui.badgeFree`)}
              </Badge>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t(`${NS}.ui.headerTitle`)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(`${NS}.ui.headerDesc`)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTopPhoto(null);
                setSidePhoto(null);
                setBcsScore(5);
                setAiReport("");
                setAnalysisMethod(null);
              }}
              className="text-xs"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> {t(`${NS}.ui.resetButton`)}
            </Button>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-4 border-t border-border/50 pt-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t(`${NS}.ui.presetsLabel`)}
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="rounded-lg border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground transition hover:border-primary hover:bg-primary/5"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs vs Visual Results */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Photo Uploads & Pet Specs (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Card 1: Pet Profile & Weight */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" /> {t(`${NS}.ui.card1Title`)}
              </CardTitle>
              <CardDescription>
                {t(`${NS}.ui.card1Desc`)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">{t(`${NS}.ui.speciesLabel`)}</Label>
                  <Tabs value={species} onValueChange={(val) => setSpecies(val as Species)} className="mt-1.5 w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="dog">{t(`${NS}.ui.speciesDog`)}</TabsTrigger>
                      <TabsTrigger value="cat">{t(`${NS}.ui.speciesCat`)}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">{t(`${NS}.ui.weightLabel`)}</Label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setUnit("lbs")}
                        className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          unit === "lbs" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {t(`${NS}.ui.unitLbs`)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnit("kg")}
                        className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          unit === "kg" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {t(`${NS}.ui.unitKg`)}
                      </button>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Input
                      type="number"
                      min="0.5"
                      max="200"
                      step="0.5"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="font-semibold text-base"
                    />
                    <span className="text-xs text-muted-foreground font-medium">{unit}</span>
                  </div>
                </div>
              </div>

              {/* Coat & Morphology adjustments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">{t(`${NS}.ui.coatLabel`)}</Label>
                  <select
                    value={coatType}
                    onChange={(e) => setCoatType(e.target.value as any)}
                    className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="short">{t(`${NS}.ui.coatShort`)}</option>
                    <option value="medium">{t(`${NS}.ui.coatMedium`)}</option>
                    <option value="long">{t(`${NS}.ui.coatLong`)}</option>
                    <option value="fluffy">{t(`${NS}.ui.coatFluffy`)}</option>
                  </select>
                </div>

                {species === "cat" && (
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-border/70 p-2 text-xs hover:bg-muted/40 transition">
                      <input
                        type="checkbox"
                        checked={isCatPrimordialPouch}
                        onChange={(e) => setIsCatPrimordialPouch(e.target.checked)}
                        className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                      />
                      <span>
                        <strong>{t(`${NS}.ui.pouchTitle`)}</strong>
                        <span className="block text-[11px] text-muted-foreground">
                          {t(`${NS}.ui.pouchDesc`)}
                        </span>
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Dual Photo Upload (Top-Down & Side-View) */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Camera className="h-4 w-4 text-primary" /> {t(`${NS}.ui.card2Title`)}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {t(`${NS}.ui.card2Badge`)}
                </Badge>
              </div>
              <CardDescription>
                {t(`${NS}.ui.card2Desc`)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Angle 1: Aerial Top View */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>{t(`${NS}.ui.angleATitle`)}</span>
                    <span className="text-muted-foreground text-[11px]">{t(`${NS}.ui.angleATag`)}</span>
                  </div>

                  <div
                    onClick={() => topInputRef.current?.click()}
                    className="relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-3 text-center transition hover:border-primary hover:bg-primary/5 overflow-hidden"
                  >
                    <input
                      ref={topInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e.target.files?.[0], "top")}
                    />

                    {topPhoto ? (
                      <div className="relative h-full w-full">
                        <img
                          src={topPhoto}
                          alt={t(`${NS}.ui.altTopPreview`)}
                          className="h-36 w-full rounded-lg object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTopPhoto(null);
                          }}
                          className="absolute top-1 right-1 rounded-full bg-background/90 p-1 text-xs text-foreground shadow hover:bg-destructive hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mb-1.5 h-6 w-6 text-muted-foreground" />
                        <p className="text-xs font-semibold">{t(`${NS}.ui.angleAUpload`)}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {t(`${NS}.ui.angleAHint`)}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Angle 2: Lateral Side View */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>{t(`${NS}.ui.angleBTitle`)}</span>
                    <span className="text-muted-foreground text-[11px]">{t(`${NS}.ui.angleBTag`)}</span>
                  </div>

                  <div
                    onClick={() => sideInputRef.current?.click()}
                    className="relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-3 text-center transition hover:border-primary hover:bg-primary/5 overflow-hidden"
                  >
                    <input
                      ref={sideInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e.target.files?.[0], "side")}
                    />

                    {sidePhoto ? (
                      <div className="relative h-full w-full">
                        <img
                          src={sidePhoto}
                          alt={t(`${NS}.ui.altSidePreview`)}
                          className="h-36 w-full rounded-lg object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSidePhoto(null);
                          }}
                          className="absolute top-1 right-1 rounded-full bg-background/90 p-1 text-xs text-foreground shadow hover:bg-destructive hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mb-1.5 h-6 w-6 text-muted-foreground" />
                        <p className="text-xs font-semibold">{t(`${NS}.ui.angleBUpload`)}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {t(`${NS}.ui.angleBHint`)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Hands-on Clinical Palpation Diagnostics */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" /> {t(`${NS}.ui.card3Title`)}
              </CardTitle>
              <CardDescription>
                {t(`${NS}.ui.card3Desc`)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Rib Sweep Test */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {t(`${NS}.ui.ribLabel`)}
                  </Label>
                  <span className="text-xs font-semibold text-primary">{t(`${NS}.ui.levelOf5`, { val: ribSweep })}</span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[ribSweep]}
                  onValueChange={(val) => {
                    setRibSweep(val[0]);
                    const newScore = computeClinicalBCS();
                    setBcsScore(newScore);
                  }}
                  className="py-1.5"
                />
                <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-foreground/90 border border-border/60">
                  {ribSweep === 1 && t(`${NS}.ui.ribHelp1`)}
                  {ribSweep === 2 && t(`${NS}.ui.ribHelp2`)}
                  {ribSweep === 3 && t(`${NS}.ui.ribHelp3`)}
                  {ribSweep === 4 && t(`${NS}.ui.ribHelp4`)}
                  {ribSweep === 5 && t(`${NS}.ui.ribHelp5`)}
                </div>
              </div>

              {/* Aerial Waistline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {t(`${NS}.ui.waistLabel`)}
                  </Label>
                  <span className="text-xs font-semibold text-primary">{t(`${NS}.ui.levelOf5`, { val: waistTaper })}</span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[waistTaper]}
                  onValueChange={(val) => {
                    setWaistTaper(val[0]);
                    const newScore = computeClinicalBCS();
                    setBcsScore(newScore);
                  }}
                  className="py-1.5"
                />
                <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-foreground/90 border border-border/60">
                  {waistTaper === 1 && t(`${NS}.ui.waistHelp1`)}
                  {waistTaper === 2 && t(`${NS}.ui.waistHelp2`)}
                  {waistTaper === 3 && t(`${NS}.ui.waistHelp3`)}
                  {waistTaper === 4 && t(`${NS}.ui.waistHelp4`)}
                  {waistTaper === 5 && t(`${NS}.ui.waistHelp5`)}
                </div>
              </div>

              {/* Abdominal Underline Tuck */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> {t(`${NS}.ui.tuckLabel`)}
                  </Label>
                  <span className="text-xs font-semibold text-primary">{t(`${NS}.ui.levelOf4`, { val: tuckDepth })}</span>
                </div>
                <Slider
                  min={1}
                  max={4}
                  step={1}
                  value={[tuckDepth]}
                  onValueChange={(val) => {
                    setTuckDepth(val[0]);
                    const newScore = computeClinicalBCS();
                    setBcsScore(newScore);
                  }}
                  className="py-1.5"
                />
                <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-foreground/90 border border-border/60">
                  {tuckDepth === 1 && t(`${NS}.ui.tuckHelp1`)}
                  {tuckDepth === 2 && t(`${NS}.ui.tuckHelp2`)}
                  {tuckDepth === 3 && t(`${NS}.ui.tuckHelp3`)}
                  {tuckDepth === 4 && t(`${NS}.ui.tuckHelp4`)}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  onClick={runAnalysis}
                  disabled={analyzing}
                  size="lg"
                  className="w-full font-semibold shadow-md text-base h-12"
                >
                  {analyzing ? (
                    <>
                      <Activity className="mr-2 h-5 w-5 animate-spin" /> {t(`${NS}.ui.analyzingButton`)}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" /> {t(`${NS}.ui.analyzeButton`)}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Visual 9-Point Scale & Results (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Main Score Result Card */}
          <Card className="border-border shadow-md overflow-hidden">
            <div className={`p-4 text-center border-b ${currentTier.badgeBg}`}>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-90">
                {t(`${NS}.ui.scoreEyebrow`)}
              </div>
              <div className="mt-1 flex items-baseline justify-center gap-1.5">
                <span className="text-4xl font-black">{currentTier.score}</span>
                <span className="text-xl font-bold opacity-80">/ 9</span>
              </div>
              <div className="mt-1 font-semibold text-sm capitalize">{currentTier.label.split("—")[1]}</div>
            </div>

            <CardContent className="space-y-5 p-5">
              {/* Interactive Visual 9-Point Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-foreground">{t(`${NS}.ui.adjustLabel`)}</span>
                  <span className="font-bold">{t(`${NS}.ui.of9`, { score: bcsScore })}</span>
                </div>

                <div className="relative">
                  <div className="h-2 w-full rounded-full bg-gradient-to-r from-rose-500 via-emerald-500 to-rose-600 opacity-85" />
                  <Slider
                    min={1}
                    max={9}
                    step={1}
                    value={[bcsScore]}
                    onValueChange={(val) => {
                      setBcsScore(val[0]);
                      setAnalysisMethod("clinical");
                    }}
                    className="py-2"
                  />
                </div>

                <div className="flex justify-between text-[10px] text-muted-foreground font-medium px-1">
                  <span>{t(`${NS}.ui.scale1`)}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t(`${NS}.ui.scale5`)}</span>
                  <span>{t(`${NS}.ui.scale9`)}</span>
                </div>
              </div>

              {/* Status Badge & Assessment Summary */}
              <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{t(`${NS}.ui.clinicalCategory`)}</span>
                  <Badge variant="outline" className={`capitalize font-bold ${currentTier.colorClass}`}>
                    {currentTier.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{t(`${NS}.ui.fatVarianceLabel`)}</span>
                  <span className="font-medium">
                    {currentTier.excessFatPercent > 0 ? t(`${NS}.ui.fatExcess`, { pct: currentTier.excessFatPercent }) : currentTier.excessFatPercent < 0 ? t(`${NS}.ui.fatUnder`, { pct: currentTier.excessFatPercent }) : t(`${NS}.ui.fatOptimal`)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{t(`${NS}.ui.lifespanLabel`)}</span>
                  <span className="font-medium text-right">
                    {bcsScore === 4 || bcsScore === 5
                      ? t(`${NS}.ui.lifespanIdeal`)
                      : bcsScore >= 7
                      ? t(`${NS}.ui.lifespanShort`)
                      : t(`${NS}.ui.lifespanImpaired`)}
                  </span>
                </div>
              </div>

              {/* Ideal Weight & Nutritional Targets */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wide">
                  <Flame className="h-4 w-4" /> {t(`${NS}.ui.nutritionTitle`)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-lg bg-background/80 p-2.5 border border-border/50">
                    <div className="text-[11px] text-muted-foreground">{t(`${NS}.ui.idealWeightLabel`)}</div>
                    <div className="text-lg font-bold text-foreground">
                      {nutritionalMetrics.idealDisplay} {unit}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {bcsScore > 5
                        ? t(`${NS}.ui.toLose`, { diff: nutritionalMetrics.diffDisplay, unit })
                        : bcsScore < 4
                        ? t(`${NS}.ui.toGain`, { diff: nutritionalMetrics.diffDisplay, unit })
                        : t(`${NS}.ui.maintainWeight`)}
                    </div>
                  </div>

                  <div className="rounded-lg bg-background/80 p-2.5 border border-border/50">
                    <div className="text-[11px] text-muted-foreground">{t(`${NS}.ui.kcalTargetLabel`)}</div>
                    <div className="text-lg font-bold text-foreground">
                      {nutritionalMetrics.targetDailyKcal}{" "}
                      <span className="text-xs font-normal text-muted-foreground">{t(`${NS}.ui.kcalUnit`)}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {t(`${NS}.ui.treatBudget`, { kcal: nutritionalMetrics.treatKcalLimit })}
                    </div>
                  </div>
                </div>

                {bcsScore > 5 && (
                  <div className="flex items-center gap-2 rounded-lg bg-background/90 p-2.5 text-xs text-muted-foreground border border-border/50">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span>
                      {t(`${NS}.ui.timelineLabel`)}{" "}
                      <strong className="text-foreground">{t(`${NS}.ui.timelineValue`, { weeks: nutritionalMetrics.projectedWeeks })}</strong> {t(`${NS}.ui.timelineSuffix`)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Copy / Share */}
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={copyReport} className="w-full text-xs font-semibold">
                  {copied ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> {t(`${NS}.ui.copyCopied`)}
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-3.5 w-3.5" /> {t(`${NS}.ui.copyButton`)}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Educational Palpation Guide Box */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> {t(`${NS}.ui.knuckleTitle`)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>
                {t(`${NS}.ui.knuckleIntroBefore`)} <strong>{t(`${NS}.ui.knuckleIntroStrong`)}</strong> {t(`${NS}.ui.knuckleIntroAfter`)}
              </p>
              <ul className="space-y-1.5 list-disc pl-4">
                <li>
                  <strong>{t(`${NS}.ui.knuckleLi1Strong`)}</strong>{t(`${NS}.ui.knuckleLi1Rest`)}
                </li>
                <li>
                  <strong>{t(`${NS}.ui.knuckleLi2Strong`)}</strong>{t(`${NS}.ui.knuckleLi2Rest`)}
                </li>
                <li>
                  <strong>{t(`${NS}.ui.knuckleLi3Strong`)}</strong>{t(`${NS}.ui.knuckleLi3Rest`)}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Deep Analysis Report (AI or Morphometric Report) */}
      {aiReport && (
        <Card className="border-primary/30 shadow-md">
          <CardHeader className="pb-3 bg-primary/5 rounded-t-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-primary" /> {t(`${NS}.ui.reportTitle`)}
              </CardTitle>
              <Badge variant="outline" className="text-xs border-primary/40 text-primary w-fit">
                {analysisMethod === "ai"
                  ? t(`${NS}.ui.reportBadgeAi`)
                  : t(`${NS}.ui.reportBadgeClinical`)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <FormattedMarkdown content={aiReport} />
            </div>

            <div className="border-t border-border pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>{t(`${NS}.ui.reportValidated`)}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={copyReport} className="text-xs">
                {copied ? t(`${NS}.ui.reportCopied`) : t(`${NS}.ui.reportCopyButton`)}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 9-Point Visual Morphometrics Reference Matrix */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-primary" /> {t(`${NS}.ui.matrixTitle`)}
          </CardTitle>
          <CardDescription>
            {t(`${NS}.ui.matrixDesc`)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Underweight Column */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-950 dark:bg-rose-950/20 space-y-2">
              <Badge className="bg-rose-600 text-white font-semibold">{t(`${NS}.ui.matrixUnderBadge`)}</Badge>
              <ul className="text-xs text-muted-foreground space-y-2 pt-2">
                <li>
                  <strong className="text-foreground">{t(`${NS}.ui.matrixRibsLabel`)}</strong> {t(`${NS}.ui.matrixUnderRibsText`)}
                </li>
                <li>
                  <strong className="text-foreground">{t(`${NS}.ui.matrixWaistLabel`)}</strong> {t(`${NS}.ui.matrixUnderWaistText`)}
                </li>
                <li>
                  <strong className="text-foreground">{t(`${NS}.ui.matrixRiskLabel`)}</strong> {t(`${NS}.ui.matrixUnderRiskText`)}
                </li>
              </ul>
            </div>

            {/* Ideal Column */}
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/30 space-y-2 ring-1 ring-emerald-500/20">
              <Badge className="bg-emerald-600 text-white font-semibold">{t(`${NS}.ui.matrixIdealBadge`)}</Badge>
              <ul className="text-xs text-muted-foreground space-y-2 pt-2">
                <li>
                  <strong className="text-foreground">{t(`${NS}.ui.matrixRibsLabel`)}</strong> {t(`${NS}.ui.matrixIdealRibsText`)}
                </li>
                <li>
                  <strong className="text-foreground">{t(`${NS}.ui.matrixWaistLabel`)}</strong> {t(`${NS}.ui.matrixIdealWaistText`)}
                </li>
                <li>
                  <strong className="text-foreground">{t(`${NS}.ui.matrixStandardLabel`)}</strong> {t(`${NS}.ui.matrixIdealStandardText`)}
                </li>
              </ul>
            </div>

            {/* Overweight Column */}
            <div className="rounded-xl border border-orange-200 bg-orange-50/40 p-4 dark:border-orange-950 dark:bg-orange-950/20 space-y-2">
              <Badge className="bg-orange-600 text-white font-semibold">{t(`${NS}.ui.matrixOverBadge`)}</Badge>
              <ul className="text-xs text-muted-foreground space-y-2 pt-2">
                <li>
                  <strong className="text-foreground">{t(`${NS}.ui.matrixRibsLabel`)}</strong> {t(`${NS}.ui.matrixOverRibsText`)}
                </li>
                <li>
                  <strong className="text-foreground">{t(`${NS}.ui.matrixWaistLabel`)}</strong> {t(`${NS}.ui.matrixOverWaistText`)}
                </li>
                <li>
                  <strong className="text-foreground">{t(`${NS}.ui.matrixRiskLabel`)}</strong> {t(`${NS}.ui.matrixOverRiskText`)}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
