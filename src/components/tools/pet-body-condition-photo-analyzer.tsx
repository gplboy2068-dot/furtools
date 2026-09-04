import { useState, useMemo, useRef } from "react";
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

const WSAVA_TIERS: Record<number, WSAVATier> = {
  1: {
    score: 1,
    label: "1/9 — Severely Emaciated",
    category: "underweight",
    colorClass: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300",
    ribFeel: "Ribs, lumbar vertebrae, and pelvic bones are razor-sharp and visible from a distance with zero palpable fat.",
    waistAerial: "Extreme, severe hourglass waist indentation with sunken hollow flanks.",
    abdominalTuck: "Dramatic, steep abdominal tuck curving sharply up behind ribs.",
    fatCover: "Zero fat padding; obvious loss of muscle mass and bony prominences everywhere.",
    healthRisk: "Severe medical emergency: muscle wasting, immunocompromise, hypothermia risk, organ failure.",
    excessFatPercent: -30,
  },
  2: {
    score: 2,
    label: "2/9 — Very Thin",
    category: "underweight",
    colorClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
    ribFeel: "Ribs and spine easily visible with minimal palpation needed; zero fat blanket.",
    waistAerial: "Marked, deep hourglass waist visible from above with prominent hip bones.",
    abdominalTuck: "Prominent abdominal tuck with severe upward slope.",
    fatCover: "Tiny trace fat cushion over lumbar vertebrae, minor muscle atrophy.",
    healthRisk: "High risk of lethargy, reproductive arrest, hypoglycemia, impaired recovery from illness.",
    excessFatPercent: -20,
  },
  3: {
    score: 3,
    label: "3/9 — Thin / Underweight",
    category: "underweight",
    colorClass: "text-yellow-600 dark:text-yellow-400",
    badgeBg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-300",
    ribFeel: "Ribs easily felt with no fat cover; tops of vertebrae visible.",
    waistAerial: "Obvious hourglass waist readily observed when viewed from above.",
    abdominalTuck: "Pronounced abdominal tuck evident upon standing side view.",
    fatCover: "Minimal subcutaneous fat, slight fat padding over spine.",
    healthRisk: "Moderate nutritional deficit; vulnerable to cold weather, low stamina, poor coat quality.",
    excessFatPercent: -10,
  },
  4: {
    score: 4,
    label: "4/9 — Lean / Moderately Ideal",
    category: "ideal",
    colorClass: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300",
    ribFeel: "Ribs easily palpable with minimal fat covering; bones distinct but not sharp.",
    waistAerial: "Clear, proportional hourglass waist clearly visible behind ribs.",
    abdominalTuck: "Crisp, athletic abdominal tuck visible from the side.",
    fatCover: "Thin layer of healthy fat; athletic muscling throughout body.",
    healthRisk: "Excellent metabolic health; associated with peak agility and joint preservation.",
    excessFatPercent: -5,
  },
  5: {
    score: 5,
    label: "5/9 — Optimal Ideal Condition",
    category: "ideal",
    colorClass: "text-emerald-700 dark:text-emerald-300 font-bold",
    badgeBg: "bg-emerald-500 text-white border-emerald-600 shadow-sm",
    ribFeel: "Ribs easily palpated with slight hand sweep—feels like knuckles on the back of a flat hand.",
    waistAerial: "Harmonious hourglass waistline visible from above without sunken hollows.",
    abdominalTuck: "Smooth upward abdominal tuck sloping from ribcage toward groin.",
    fatCover: "Balanced, healthy protective fat blanket without excess lumbar or tailhead deposits.",
    healthRisk: "Peak longevity standard: pets maintained at BCS 5 live an average of 1.8 to 2.5 years longer.",
    excessFatPercent: 0,
  },
  6: {
    score: 6,
    label: "6/9 — Moderately Overweight",
    category: "overweight",
    colorClass: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
    ribFeel: "Ribs palpable with slight pressure; covered by a discernible layer of excess fat.",
    waistAerial: "Waistline discernible from above but flattened and not prominent.",
    abdominalTuck: "Abdominal tuck is slight or blunt when viewed from the side profile.",
    fatCover: "Moderate fat layer over lumbar spine and base of tail.",
    healthRisk: "Early joint wear, low stamina, slight systemic low-grade inflammation.",
    excessFatPercent: 10,
  },
  7: {
    score: 7,
    label: "7/9 — Overweight",
    category: "overweight",
    colorClass: "text-orange-600 dark:text-orange-400",
    badgeBg: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300",
    ribFeel: "Ribs difficult to palpate; requires firm thumb and finger pressure.",
    waistAerial: "Waistline barely discernible or absent; back appears broad and flat.",
    abdominalTuck: "Abdominal tuck is absent; belly underline is flat or parallel to floor.",
    fatCover: "Heavy fat deposits over lumbar area and tailbase; neck fat rolls present.",
    healthRisk: "2x risk of osteoarthritis, impaired heat tolerance, shortened lifespan by 1.5+ years.",
    excessFatPercent: 20,
  },
  8: {
    score: 8,
    label: "8/9 — Obese",
    category: "obese",
    colorClass: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300",
    ribFeel: "Ribs palpable only with deep, heavy finger pressure or cannot be felt at all.",
    waistAerial: "Zero waistline; back is distinctly widened and flanks bulge outward like a barrel.",
    abdominalTuck: "Abdominal tuck completely absent; belly hangs low with pendulous fat pads.",
    fatCover: "Massive fat padding over lumbar spine, neck, tailhead, and thorax.",
    healthRisk: "Severe danger: 4x risk of diabetes (cats), CCL ligament rupture, respiratory compromise.",
    excessFatPercent: 30,
  },
  9: {
    score: 9,
    label: "9/9 — Severely Obese",
    category: "obese",
    colorClass: "text-rose-700 dark:text-rose-300 font-extrabold",
    badgeBg: "bg-rose-600 text-white border-rose-700 shadow-md",
    ribFeel: "Ribs completely impossible to feel under thick, dense blanket of adipose tissue.",
    waistAerial: "Back is convex/barrel-shaped; flanks distended outward with prominent fat pads.",
    abdominalTuck: "Pendulous, swinging belly with zero tuck; fat rolls sway during movement.",
    fatCover: "Massive fat masses along spine, neck, limbs, tailhead, and inguinal area.",
    healthRisk: "Critical medical condition: extreme systemic inflammation, cardiac overload, mobility loss.",
    excessFatPercent: 40,
  },
};

const SAMPLE_PRESETS = [
  {
    name: "Healthy Dog (Ideal BCS 5)",
    species: "dog" as Species,
    weight: 55,
    unit: "lbs" as Unit,
    score: 5,
    ribSweep: 3,
    waistTaper: 3,
    tuckDepth: 2,
    coatType: "medium",
    notes: "Labrador mix with clearly felt ribs, clean hourglass waist, and fit abdominal tuck.",
  },
  {
    name: "Overweight Beagle (BCS 7)",
    species: "dog" as Species,
    weight: 38,
    unit: "lbs" as Unit,
    score: 7,
    ribSweep: 4,
    waistTaper: 4,
    tuckDepth: 3,
    coatType: "short",
    notes: "Ribs difficult to palpate, flat straight back with no waist, slight belly bulge.",
  },
  {
    name: "Indoor Cat (Overweight BCS 7)",
    species: "cat" as Species,
    weight: 14,
    unit: "lbs" as Unit,
    score: 7,
    ribSweep: 4,
    waistTaper: 4,
    tuckDepth: 3,
    coatType: "short",
    notes: "Domestic Shorthair with rounded flanks and fat pad, ribs require firm pressure.",
  },
  {
    name: "Underweight Rescue (BCS 3)",
    species: "dog" as Species,
    weight: 22,
    unit: "lbs" as Unit,
    score: 3,
    ribSweep: 2,
    waistTaper: 1,
    tuckDepth: 1,
    coatType: "short",
    notes: "Rescue dog with prominent ribs, visible hip pins, and extreme tucked groin.",
  },
];

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
    let weightLossGoal = "Maintain ideal condition";
    let targetWeeklyLossPercent = 0;

    if (bcsScore > 5) {
      // Weight loss recommendation:
      // Dog weight loss: 1.0 * RER; Cat weight loss: 0.8 * RER (to avoid hepatic lipidosis)
      merMultiplier = species === "cat" ? 0.8 : 1.0;
      targetWeeklyLossPercent = 1.2; // 1.2% per week safe loss
      weightLossGoal = `Target gradual loss of 1.0–1.5% body weight per week`;
    } else if (bcsScore < 4) {
      // Weight gain recommendation
      merMultiplier = species === "cat" ? 1.4 : 1.6;
      weightLossGoal = "Controlled weight gain with calorie-dense balanced diet";
    } else {
      // Ideal weight maintenance
      merMultiplier = species === "cat" ? 1.2 : 1.5;
      weightLossGoal = "Caloric balance for active vitality and lean muscle";
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
      `**Preset Applied:** ${preset.name}\n\n${preset.notes}\n\n- **Species:** ${preset.species.toUpperCase()}\n- **Weight:** ${preset.weight} ${preset.unit}\n- **Calculated BCS:** ${preset.score}/9 (${WSAVA_TIERS[preset.score]?.label})`
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
      const fallbackReport = `### WSAVA Clinical Morphometric Evaluation Report

**Pet Classification:** ${species === "dog" ? "Canine (Canis lupus familiaris)" : "Feline (Felis catus)"}
**Evaluated Score:** **${tier.label}** (${tier.category.toUpperCase()})

#### 🔍 Morphological Biomarkers:
- **Ribcage Palpability:** ${tier.ribFeel}
- **Aerial Hourglass Waist:** ${tier.waistAerial}
- **Lateral Abdominal Underline:** ${tier.abdominalTuck}
- **Subcutaneous Fat Distribution:** ${tier.fatCover}

#### 🏥 Medical & Health Prognosis:
${tier.healthRisk}

#### 🎯 Veterinary Nutrition Target:
- **Current Weight:** ${weightInput} ${unit} (${Math.round(weightKg * 10) / 10} kg)
- **Estimated Ideal Weight:** **${nutritionalMetrics.idealDisplay} ${unit}** (${Math.round(nutritionalMetrics.idealKg * 10) / 10} kg)
- **Daily Resting Energy Requirement (RER):** **${nutritionalMetrics.rer} kcal/day**
- **Recommended Daily Caloric Intake:** **${nutritionalMetrics.targetDailyKcal} kcal/day**
- **Maximum Daily Treat Allowance (10% rule):** **${nutritionalMetrics.treatKcalLimit} kcal/day**
${
  computedScore > 5
    ? `- **Estimated Timeline to Ideal BCS:** **~${nutritionalMetrics.projectedWeeks} weeks** at a safe 1.0–1.5% weekly reduction rate.`
    : ""
}

*This evaluation combines standardized WSAVA morphometrics, user palpation sweep diagnostics, and veterinary energy expenditure equations.*`;

      setAiReport(fallbackReport);
      setAnalysisMethod("clinical");
      setAnalyzing(false);
    }, 450);
  };

  const copyReport = async () => {
    const textToCopy = `FURTOOLS VETERINARY BODY CONDITION SCORE (BCS) REPORT
Species: ${species.toUpperCase()}
Weight: ${weightInput} ${unit}
Assessed WSAVA Score: ${currentTier.label} (${currentTier.category.toUpperCase()})
Ideal Weight: ${nutritionalMetrics.idealDisplay} ${unit}
Daily Target Calories: ${nutritionalMetrics.targetDailyKcal} kcal/day
RER: ${nutritionalMetrics.rer} kcal/day

Palpation Findings:
- Ribs: ${currentTier.ribFeel}
- Waist: ${currentTier.waistAerial}
- Abdomen: ${currentTier.abdominalTuck}
- Medical Notes: ${currentTier.healthRisk}

Generated via FurTools Pet Body Condition Photo Analyzer (https://www.furtools.com/tools/pet-body-condition-photo)`;

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
                <Sparkles className="mr-1 h-3.5 w-3.5" /> AI Vision + WSAVA 9-Point Standard
              </Badge>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                100% Free &amp; Instant
              </Badge>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Veterinary Pet Body Condition &amp; Morphometric Analyzer
            </h2>
            <p className="text-sm text-muted-foreground">
              Analyze top-down and side photos alongside palpation markers to determine your pet&apos;s exact
              WSAVA Body Condition Score, ideal weight target, and daily calorie plan.
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
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
            </Button>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="mt-4 border-t border-border/50 pt-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Clinical Examples (1-Click Test):
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
                <Scale className="h-4 w-4 text-primary" /> 1. Pet Profile &amp; Body Weight
              </CardTitle>
              <CardDescription>
                Accurate weight and species allow precise Resting Energy Requirement (RER) calculations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Species</Label>
                  <Tabs value={species} onValueChange={(val) => setSpecies(val as Species)} className="mt-1.5 w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="dog">🐕 Dog</TabsTrigger>
                      <TabsTrigger value="cat">🐈 Cat</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Current Weight</Label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setUnit("lbs")}
                        className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          unit === "lbs" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        lbs
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnit("kg")}
                        className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          unit === "kg" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        kg
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
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Coat Thickness</Label>
                  <select
                    value={coatType}
                    onChange={(e) => setCoatType(e.target.value as any)}
                    className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="short">Short / Smooth Coat (Visible contours)</option>
                    <option value="medium">Medium Coat (Standard)</option>
                    <option value="long">Long / Feathered Coat</option>
                    <option value="fluffy">Fluffy / Double Coat (e.g., Husky, Samoyed)</option>
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
                        <strong>Primordial Pouch Present</strong>
                        <span className="block text-[11px] text-muted-foreground">
                          Loose belly flap is normal feline anatomy, not visceral fat.
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
                  <Camera className="h-4 w-4 text-primary" /> 2. Dual-Angle Photo Upload
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  Optional but Recommended
                </Badge>
              </div>
              <CardDescription>
                Veterinary visual scoring requires observing both the dorsal hourglass waist and the lateral abdominal tuck.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Angle 1: Aerial Top View */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Angle A: Top-Down Aerial View</span>
                    <span className="text-muted-foreground text-[11px]">Hourglass Waist</span>
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
                          alt="Top View Preview"
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
                        <p className="text-xs font-semibold">Upload Top-Down Photo</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Stand above pet, looking down at spine &amp; waist
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Angle 2: Lateral Side View */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Angle B: Side Profile View</span>
                    <span className="text-muted-foreground text-[11px]">Abdominal Tuck</span>
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
                          alt="Side View Preview"
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
                        <p className="text-xs font-semibold">Upload Side Profile</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Eye-level with pet standing naturally
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
                <Stethoscope className="h-4 w-4 text-primary" /> 3. Hands-On Palpation Diagnostic Markers
              </CardTitle>
              <CardDescription>
                Tactile palpation is the gold standard in veterinary medicine to distinguish lean muscle from subcutaneous fat.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Rib Sweep Test */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> A. Rib Palpation Sweep (&quot;Knuckle Test&quot;)
                  </Label>
                  <span className="text-xs font-semibold text-primary">Level {ribSweep} of 5</span>
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
                  {ribSweep === 1 && "Sharp, prominent ribs with zero fat padding. Feels like sharp knuckles of a clenched fist (BCS 1–2)."}
                  {ribSweep === 2 && "Ribs easily felt with no pressure; clearly visible on short-haired breeds (BCS 3–4)."}
                  {ribSweep === 3 && "IDEAL: Ribs easily felt with light hand sweep—feels like knuckles on the back of a flat hand (BCS 5)."}
                  {ribSweep === 4 && "Ribs felt only with firm finger pressure under a noticeable fat blanket (BCS 6–7)."}
                  {ribSweep === 5 && "Ribs cannot be palpated under thick, dense adipose tissue. Feels like the palm of your hand (BCS 8–9)."}
                </div>
              </div>

              {/* Aerial Waistline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> B. Aerial Hourglass Waist (Bird&apos;s-Eye View)
                  </Label>
                  <span className="text-xs font-semibold text-primary">Level {waistTaper} of 5</span>
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
                  {waistTaper === 1 && "Severe, drastic waist indentation with sunken hollow flanks behind ribcage (BCS 1–2)."}
                  {waistTaper === 2 && "Marked, narrow waistline clearly visible with prominent pelvic pins (BCS 3–4)."}
                  {waistTaper === 3 && "IDEAL: Smooth, well-proportioned hourglass waist tapering cleanly behind ribs (BCS 5)."}
                  {waistTaper === 4 && "Straight rectangular flank line; waistline is flat, absent, or barely discernible (BCS 6–7)."}
                  {waistTaper === 5 && "Distended, barrel-shaped or pear-shaped bulge outward from the ribcage (BCS 8–9)."}
                </div>
              </div>

              {/* Abdominal Underline Tuck */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> C. Abdominal Underline Tuck (Standing Profile)
                  </Label>
                  <span className="text-xs font-semibold text-primary">Level {tuckDepth} of 4</span>
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
                  {tuckDepth === 1 && "Dramatic, steep upward abdominal tuck carving deeply into groin (BCS 1–3)."}
                  {tuckDepth === 2 && "IDEAL: Clean, clear upward abdominal slope from posterior ribcage into groin (BCS 4–5)."}
                  {tuckDepth === 3 && "Flat underline parallel to floor; abdominal tuck is absent or muted (BCS 6–7)."}
                  {tuckDepth === 4 && "Pendulous, rounded belly hanging downward with fat pad swaying during motion (BCS 8–9)."}
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
                      <Activity className="mr-2 h-5 w-5 animate-spin" /> Scanning Biometrics &amp; Morphometrics…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" /> Calculate Body Condition Score
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
                WSAVA 9-Point Body Condition Score
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
                  <span className="font-semibold text-muted-foreground">Adjust / Fine-Tune Score</span>
                  <span className="font-bold">{bcsScore} of 9</span>
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
                  <span>1 Emaciated</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">5 Ideal</span>
                  <span>9 Obese</span>
                </div>
              </div>

              {/* Status Badge & Assessment Summary */}
              <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Clinical Category:</span>
                  <Badge variant="outline" className={`capitalize font-bold ${currentTier.colorClass}`}>
                    {currentTier.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Body Fat Variance:</span>
                  <span className="font-medium">
                    {currentTier.excessFatPercent > 0 ? `+${currentTier.excessFatPercent}% Excess Fat` : currentTier.excessFatPercent < 0 ? `${currentTier.excessFatPercent}% Underweight` : "Optimal Adiposity"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Lifespan Impact:</span>
                  <span className="font-medium text-right">
                    {bcsScore === 4 || bcsScore === 5
                      ? "+1.8 to 2.5 yrs peak longevity"
                      : bcsScore >= 7
                      ? "Shortened by ~1.5 to 2.5 yrs"
                      : "Impaired vital stamina"}
                  </span>
                </div>
              </div>

              {/* Ideal Weight & Nutritional Targets */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wide">
                  <Flame className="h-4 w-4" /> Veterinary Target &amp; Daily Nutrition
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-lg bg-background/80 p-2.5 border border-border/50">
                    <div className="text-[11px] text-muted-foreground">Estimated Ideal Weight</div>
                    <div className="text-lg font-bold text-foreground">
                      {nutritionalMetrics.idealDisplay} {unit}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {bcsScore > 5
                        ? `-${nutritionalMetrics.diffDisplay} ${unit} to lose`
                        : bcsScore < 4
                        ? `+${nutritionalMetrics.diffDisplay} ${unit} to gain`
                        : "Maintain current weight"}
                    </div>
                  </div>

                  <div className="rounded-lg bg-background/80 p-2.5 border border-border/50">
                    <div className="text-[11px] text-muted-foreground">Daily Caloric Target</div>
                    <div className="text-lg font-bold text-foreground">
                      {nutritionalMetrics.targetDailyKcal}{" "}
                      <span className="text-xs font-normal text-muted-foreground">kcal</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Treat budget: &le;{nutritionalMetrics.treatKcalLimit} kcal
                    </div>
                  </div>
                </div>

                {bcsScore > 5 && (
                  <div className="flex items-center gap-2 rounded-lg bg-background/90 p-2.5 text-xs text-muted-foreground border border-border/50">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span>
                      Safe projected timeline to ideal BCS:{" "}
                      <strong className="text-foreground">~{nutritionalMetrics.projectedWeeks} weeks</strong> (1.0–1.5% loss/wk).
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Copy / Share */}
              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={copyReport} className="w-full text-xs font-semibold">
                  {copied ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Copied Clinical Report!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy Clinical Report for Vet
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
                <Info className="h-4 w-4 text-primary" /> The 3-Second &quot;Knuckle Test&quot;
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p>
                Veterinarians teach owners the <strong>Knuckle Test</strong> using their own hand:
              </p>
              <ul className="space-y-1.5 list-disc pl-4">
                <li>
                  <strong>Back of flat hand = Ideal (BCS 5)</strong>: Run your fingers across your flat knuckles. You can
                  feel bones easily without pressure.
                </li>
                <li>
                  <strong>Clenched fist = Underweight (BCS 1–3)</strong>: Run your fingers over the sharp raised knuckles of a
                  tight fist.
                </li>
                <li>
                  <strong>Palm of hand = Overweight (BCS 7–9)</strong>: Feel the fleshy pad below your thumb. If your pet&apos;s ribs
                  feel like this, they have excessive adipose padding.
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
                <Activity className="h-4.5 w-4.5 text-primary" /> Comprehensive Body Condition Evaluation Report
              </CardTitle>
              <Badge variant="outline" className="text-xs border-primary/40 text-primary w-fit">
                {analysisMethod === "ai"
                  ? "Generated via Multi-Angle Vision AI Model"
                  : "Generated via WSAVA Clinical Morphometrics Protocol"}
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
                <span>Validated against WSAVA Nutritional Assessment Guidelines &amp; APOP standards.</span>
              </div>
              <Button variant="ghost" size="sm" onClick={copyReport} className="text-xs">
                {copied ? "Copied!" : "Copy Report"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 9-Point Visual Morphometrics Reference Matrix */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-primary" /> Standardized WSAVA 9-Point Body Condition Scale
          </CardTitle>
          <CardDescription>
            Reference criteria used by veterinary practices worldwide to assess adiposity in companion canines and felines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Underweight Column */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-950 dark:bg-rose-950/20 space-y-2">
              <Badge className="bg-rose-600 text-white font-semibold">BCS 1 to 3 · Underweight</Badge>
              <ul className="text-xs text-muted-foreground space-y-2 pt-2">
                <li>
                  <strong className="text-foreground">Ribs &amp; Bones:</strong> Highly prominent, visible from distance; zero palpable fat layer.
                </li>
                <li>
                  <strong className="text-foreground">Waistline:</strong> Extreme hourglass indentation with hollow sunken flanks.
                </li>
                <li>
                  <strong className="text-foreground">Clinical Risk:</strong> Muscle loss, hypothermia vulnerability, immune suppression.
                </li>
              </ul>
            </div>

            {/* Ideal Column */}
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/30 space-y-2 ring-1 ring-emerald-500/20">
              <Badge className="bg-emerald-600 text-white font-semibold">BCS 4 to 5 · Ideal Optimal Condition</Badge>
              <ul className="text-xs text-muted-foreground space-y-2 pt-2">
                <li>
                  <strong className="text-foreground">Ribs &amp; Bones:</strong> Easily palpable with light hand sweep; feels like flat knuckles.
                </li>
                <li>
                  <strong className="text-foreground">Waistline:</strong> Proportional hourglass waist visible behind ribs; clear abdominal tuck.
                </li>
                <li>
                  <strong className="text-foreground">Clinical Standard:</strong> Proven +1.8 to 2.5 years longer lifespan and lower osteoarthritis rate.
                </li>
              </ul>
            </div>

            {/* Overweight Column */}
            <div className="rounded-xl border border-orange-200 bg-orange-50/40 p-4 dark:border-orange-950 dark:bg-orange-950/20 space-y-2">
              <Badge className="bg-orange-600 text-white font-semibold">BCS 6 to 9 · Overweight / Obese</Badge>
              <ul className="text-xs text-muted-foreground space-y-2 pt-2">
                <li>
                  <strong className="text-foreground">Ribs &amp; Bones:</strong> Palpable only with deep pressure or completely obscured under thick fat.
                </li>
                <li>
                  <strong className="text-foreground">Waistline:</strong> Absent or bulging outward like a barrel; pendulous sagging belly fat.
                </li>
                <li>
                  <strong className="text-foreground">Clinical Risk:</strong> 4x feline diabetes risk, cruciate tears, cardiac strain, chronic inflammation.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
