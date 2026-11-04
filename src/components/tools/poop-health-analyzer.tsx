import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormattedMarkdown } from "@/components/ui/formatted-markdown";
import {
  Upload,
  Camera,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Stethoscope,
  ClipboardList,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

type Species = "dog" | "cat";
type AgeGroup = "young" | "adult" | "senior";
type DurationKey = "today" | "days2to3" | "gt3days" | "recurring";
type TriageLevel = "now" | "soon" | "monitor";
type ColourId = "brown" | "darkbrown" | "black" | "red" | "yellow" | "grey" | "green" | "orange";
type Mode = "photo" | "manual";
type Band = "firm" | "ideal" | "loose" | "severe";

type T = (key: string, options?: Record<string, unknown>) => string;
const NS = "poop-health-analyzer";
const LOG_KEY = "furtools:poop-log";

/* ── Static option tables (labels resolved through i18n at render) ── */

const SYMPTOMS = [
  { id: "blood", labelKey: "symBlood", en: "visible blood" },
  { id: "blackTarry", labelKey: "symBlackTarry", en: "black/tarry appearance" },
  { id: "mucus", labelKey: "symMucus", en: "mucus" },
  { id: "worms", labelKey: "symWorms", en: "worms or rice-like segments" },
  { id: "vomiting", labelKey: "symVomiting", en: "vomiting" },
  { id: "offFood", labelKey: "symOffFood", en: "off food / reduced appetite" },
  { id: "lethargy", labelKey: "symLethargy", en: "lethargy / low energy" },
  { id: "straining", labelKey: "symStraining", en: "straining to pass stool" },
  { id: "dietChange", labelKey: "symDietChange", en: "recent diet change / new food" },
  { id: "medication", labelKey: "symMedication", en: "recent antibiotics or medication" },
] as const;
type SymptomId = (typeof SYMPTOMS)[number]["id"];

const AGE_GROUPS: { id: AgeGroup; labelKey: string }[] = [
  { id: "young", labelKey: "ageYoung" },
  { id: "adult", labelKey: "ageAdult" },
  { id: "senior", labelKey: "ageSenior" },
];

const DURATIONS: { id: DurationKey; labelKey: string }[] = [
  { id: "today", labelKey: "durationToday" },
  { id: "days2to3", labelKey: "durationDays2to3" },
  { id: "gt3days", labelKey: "durationGt3" },
  { id: "recurring", labelKey: "durationRecurring" },
];

const COLOURS: { id: ColourId; labelKey: string; meaningKey: string; swatch: string }[] = [
  { id: "brown", labelKey: "colourBrown", meaningKey: "colourMeaningBrown", swatch: "#7a4a21" },
  { id: "darkbrown", labelKey: "colourDarkbrown", meaningKey: "colourMeaningDarkbrown", swatch: "#452a12" },
  { id: "black", labelKey: "colourBlack", meaningKey: "colourMeaningBlack", swatch: "#1c1a17" },
  { id: "red", labelKey: "colourRed", meaningKey: "colourMeaningRed", swatch: "#c0392b" },
  { id: "yellow", labelKey: "colourYellow", meaningKey: "colourMeaningYellow", swatch: "#d9a821" },
  { id: "grey", labelKey: "colourGrey", meaningKey: "colourMeaningGrey", swatch: "#9aa0a3" },
  { id: "green", labelKey: "colourGreen", meaningKey: "colourMeaningGreen", swatch: "#4e7d3a" },
  { id: "orange", labelKey: "colourOrange", meaningKey: "colourMeaningOrange", swatch: "#dd7e22" },
];

const EXTRAS: { id: string; labelKey: string; meaningKey?: string }[] = [
  { id: "mucus", labelKey: "extraMucus", meaningKey: "extraMeaningMucus" },
  { id: "blood", labelKey: "extraBlood", meaningKey: "extraMeaningBlood" },
  { id: "worms", labelKey: "extraWorms", meaningKey: "extraMeaningWorms" },
  { id: "undigested", labelKey: "extraUndigested", meaningKey: "extraMeaningUndigested" },
  { id: "foreign", labelKey: "extraForeign", meaningKey: "extraMeaningForeign" },
  { id: "none", labelKey: "extraNone" },
];

const SEGMENT_COLOURS = ["#92600f", "#22c55e", "#16a34a", "#a3a31a", "#eab308", "#f97316", "#dc2626"];

function bandForScore(score: number): Band {
  if (score <= 1) return "firm";
  if (score <= 3) return "ideal";
  if (score <= 5) return "loose";
  return "severe";
}

function getScoreInfo(t: T) {
  return [1, 2, 3, 4, 5, 6, 7].map((score) => ({
    score,
    band: bandForScore(score),
    label: t(`${NS}.ui.score${score}Label`),
    desc: t(`${NS}.ui.score${score}Desc`),
    meaning: t(`${NS}.ui.score${score}Meaning`),
  }));
}

/* ── Red-flag triage rules (client-side, educational) ── */

interface TriageInput {
  ageGroup: AgeGroup;
  duration: DurationKey;
  symptoms: SymptomId[];
  score: number | null;
  colour: ColourId | null;
  extras: string[];
}

interface TriageResult {
  level: TriageLevel;
  reasons: string[]; // i18n key suffixes under `${NS}.ui.`
}

function computeTriage(input: TriageInput): TriageResult {
  const has = (s: SymptomId) => input.symptoms.includes(s);
  const hasBlood = has("blood") || input.extras.includes("blood") || input.colour === "red";
  const blackTarry = has("blackTarry") || input.colour === "black";
  const worms = has("worms") || input.extras.includes("worms");
  const longDuration = input.duration === "gt3days" || input.duration === "recurring";
  const score = input.score;
  const red: string[] = [];
  const amber: string[] = [];

  // Emergency patterns → "Vet now"
  if (input.ageGroup === "young" && (hasBlood || (score !== null && score >= 6)))
    red.push("triageReasonYoungSerious");
  if (blackTarry && (has("lethargy") || has("offFood"))) red.push("triageReasonBlackSystemic");
  if (hasBlood && has("vomiting")) red.push("triageReasonBloodVomiting");
  if (has("vomiting") && has("lethargy")) red.push("triageReasonVomitingLethargy");
  if (has("straining") && longDuration) red.push("triageReasonStrainingPersistent");
  if (score === 7 && (has("vomiting") || has("offFood") || has("lethargy")))
    red.push("triageReasonWaterySystemic");
  if (hasBlood && longDuration) red.push("triageReasonBloodPersistent");

  // Prompt-attention patterns → "Vet soon (24–48h)"
  if (hasBlood) amber.push("triageReasonBlood");
  if (blackTarry) amber.push("triageReasonBlack");
  if (worms) amber.push("triageReasonWorms");
  if (has("vomiting")) amber.push("triageReasonVomiting");
  if (has("lethargy") || has("offFood")) amber.push("triageReasonLowEnergy");
  if (has("straining")) amber.push("triageReasonStraining");
  if (score === 7) amber.push("triageReasonScore7");
  if (score !== null && score >= 6 && input.duration !== "today")
    amber.push("triageReasonLoosePersistent");
  if (score !== null && score <= 2 && longDuration) amber.push("triageReasonFirmPersistent");
  if (score === 1 && input.duration === "recurring") amber.push("triageReasonFirmRecurring");

  if (red.length) return { level: "now", reasons: red };
  if (amber.length) return { level: "soon", reasons: amber };
  return { level: "monitor", reasons: ["triageReasonNone"] };
}

/* ── Image compression (same approach as the body-condition tool) ── */

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

/* ── Stool log ── */

interface LogEntry {
  date: string; // ISO
  score: number;
  colour: ColourId | null;
  mode: Mode;
  triage: TriageLevel;
}

function loadLog(): LogEntry[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is LogEntry =>
        !!e &&
        typeof e === "object" &&
        typeof (e as LogEntry).date === "string" &&
        typeof (e as LogEntry).score === "number"
    );
  } catch {
    return [];
  }
}

function saveLog(entries: LogEntry[]) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LOG_KEY, JSON.stringify(entries.slice(-30)));
  } catch {
    /* ignore */
  }
}

/* ═══════════════ Component ═══════════════ */

export function PoopHealthAnalyzer() {
  const { t } = useTranslation("tools");
  const scoreInfo = useMemo(() => getScoreInfo(t), [t]);

  // Pet context
  const [species, setSpecies] = useState<Species>("dog");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");
  const [duration, setDuration] = useState<DurationKey>("today");
  const [stoolsPerDay, setStoolsPerDay] = useState<string>("2");
  const [symptoms, setSymptoms] = useState<SymptomId[]>([]);

  // Mode + photo state
  const [mode, setMode] = useState<Mode>("photo");
  const [photo, setPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiColour, setAiColour] = useState<ColourId | null>(null);
  const [err, setErr] = useState("");

  // Manual state
  const [manualScore, setManualScore] = useState<number | null>(null);
  const [manualColour, setManualColour] = useState<ColourId | null>(null);
  const [manualExtras, setManualExtras] = useState<string[]>([]);
  const [manualResult, setManualResult] = useState<{
    score: number;
    colour: ColourId | null;
    bullets: string[];
  } | null>(null);

  // Which mode produced the current result
  const [lastResult, setLastResult] = useState<Mode | null>(null);
  const [copied, setCopied] = useState(false);
  const [justLogged, setJustLogged] = useState(false);

  // Stool log
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  useEffect(() => {
    setLogEntries(loadLog());
  }, []);

  const toggleSymptom = (id: SymptomId) =>
    setSymptoms((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const toggleExtra = (id: string) =>
    setManualExtras((prev) => {
      if (id === "none") return prev.includes("none") ? [] : ["none"];
      const without = prev.filter((e) => e !== "none");
      return without.includes(id) ? without.filter((e) => e !== id) : [...without, id];
    });

  // Live triage — reflects context, any chosen/parsed score, colour and extras
  const triageScore = manualScore ?? aiScore;
  const triageColour = manualColour ?? aiColour;
  const triage = useMemo(
    () =>
      computeTriage({
        ageGroup,
        duration,
        symptoms,
        score: triageScore,
        colour: triageColour,
        extras: manualExtras,
      }),
    [ageGroup, duration, symptoms, triageScore, triageColour, manualExtras]
  );

  const resultScore = lastResult === "photo" ? aiScore : lastResult === "manual" ? manualResult?.score ?? null : null;
  const resultColour = lastResult === "photo" ? aiColour : lastResult === "manual" ? manualResult?.colour ?? null : null;
  const hasResult = (lastResult === "photo" && !!aiReport) || (lastResult === "manual" && !!manualResult);

  const bandLabel = (band: Band) =>
    t(`${NS}.ui.${band === "firm" ? "bandFirm" : band === "ideal" ? "bandIdeal" : band === "loose" ? "bandLoose" : "bandSevere"}`);
  const levelLabel = (level: TriageLevel) =>
    t(`${NS}.ui.${level === "now" ? "levelNow" : level === "soon" ? "levelSoon" : "levelMonitor"}`);
  const colourMeta = (id: ColourId | null) => COLOURS.find((c) => c.id === id) ?? null;

  /* ── Photo handling ── */

  const handlePhotoUpload = async (file: File | undefined) => {
    if (!file) return;
    setErr("");
    if (!file.type.startsWith("image/")) {
      setErr(t(`${NS}.ui.errNotImage`));
      return;
    }
    try {
      setPhoto(await compressImage(file));
    } catch {
      const reader = new FileReader();
      reader.onload = () => setPhoto(String(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const runPhotoAnalysis = async () => {
    if (!photo) {
      setErr(t(`${NS}.ui.errNoPhoto`));
      return;
    }
    setAnalyzing(true);
    setErr("");
    setAiReport("");
    setAiScore(null);
    setAiColour(null);

    const ageEn =
      ageGroup === "young" ? (species === "dog" ? "puppy" : "kitten") : ageGroup;
    const durationEn = {
      today: "first noticed today",
      days2to3: "going on for 2–3 days",
      gt3days: "going on for more than 3 days",
      recurring: "keeps recurring",
    }[duration];
    const freqEn = { "1": "1", "2": "2", "3": "3", "4plus": "4 or more" }[stoolsPerDay] ?? stoolsPerDay;
    const symptomEn = symptoms.length
      ? symptoms
          .map((id) => SYMPTOMS.find((s) => s.id === id)?.en)
          .filter(Boolean)
          .join(", ")
      : "none reported";

    const promptText = `Interpret this stool photo using the Purina Fecal Score (1 = very hard, 7 = watery).

Pet context provided by the owner:
- Species: ${species}
- Age group: ${ageEn}
- How long this has been going on: ${durationEn}
- Stools per day: ${freqEn}
- Noticed symptoms / context: ${symptomEn}

Take the context into account when judging urgency (for example: blood, vomiting, lethargy or appetite loss, a puppy or kitten, or symptoms lasting more than 3 days all raise the urgency).

Return Markdown:

**Fecal Score:** (1–7) with a short justification
**Colour:** and what that colour range typically indicates (brown = normal, black = possible upper GI bleed, red streaks = lower GI, yellow/grey = liver/pancreas concern, green = bile/food)
**Consistency & Shape:**
**Visible Concerns:** mucus, blood, undigested food, worms, foreign material
**Likely Meaning (educational):** 2–3 short bullets, phrased as "can be consistent with" — never a definitive diagnosis
**When to Call the Vet:** bullet list
**Home Support (only if no red flags):** bland diet, hydration, vet-approved probiotic, monitoring

End with the required disclaimer. Then, on its own final line, output exactly:
SCORE: <1-7>
And on the line after that, exactly:
COLOUR: <one of: brown, darkbrown, black, red, yellow, grey, green, orange>`;

    try {
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: photo,
          prompt: promptText,
          system:
            "You are a small-animal veterinarian using the Purina Fecal Scoring Chart to interpret stool photos educationally. You never give a definitive diagnosis and never recommend specific medication or dosages.",
        }),
      });
      const data = (await res.json()) as { content?: string; error?: string };
      if (res.ok && data.content && data.content.trim()) {
        const scoreMatch =
          data.content.match(/SCORE:\s*([1-7])/i) || data.content.match(/\b([1-7])\s*\/\s*7\b/);
        if (scoreMatch) setAiScore(parseInt(scoreMatch[1], 10));
        const colourMatch = data.content.match(
          /COLOUR:\s*(brown|darkbrown|black|red|yellow|grey|green|orange)/i
        );
        if (colourMatch) setAiColour(colourMatch[1].toLowerCase() as ColourId);
        const display = data.content.replace(/^\s*(SCORE|COLOUR)\s*:.*$/gim, "").trim();
        setAiReport(display);
        setLastResult("photo");
        setJustLogged(false);
      } else {
        setErr(data.error || t(`${NS}.ui.errGeneric`));
      }
    } catch {
      setErr(t(`${NS}.ui.errNetwork`));
    } finally {
      setAnalyzing(false);
    }
  };

  /* ── Manual assessment ── */

  const runManualAssessment = () => {
    if (manualScore === null) return;
    const info = scoreInfo.find((s) => s.score === manualScore);
    const bullets: string[] = [];
    if (info) bullets.push(info.meaning);
    const cm = colourMeta(manualColour);
    if (cm) bullets.push(t(`${NS}.ui.${cm.meaningKey}`));
    for (const extraId of manualExtras) {
      const meta = EXTRAS.find((e) => e.id === extraId);
      if (meta?.meaningKey) bullets.push(t(`${NS}.ui.${meta.meaningKey}`));
    }
    if (symptoms.includes("dietChange")) bullets.push(t(`${NS}.ui.meaningDietChange`));
    if (symptoms.includes("medication")) bullets.push(t(`${NS}.ui.meaningMedication`));
    if (duration === "gt3days" || duration === "recurring")
      bullets.push(t(`${NS}.ui.meaningPersistent`));
    if (ageGroup === "young") bullets.push(t(`${NS}.ui.meaningYoung`));
    if (ageGroup === "senior") bullets.push(t(`${NS}.ui.meaningSenior`));
    if (stoolsPerDay === "4plus" && manualScore >= 5)
      bullets.push(t(`${NS}.ui.meaningFrequency`));
    setManualResult({ score: manualScore, colour: manualColour, bullets });
    setLastResult("manual");
    setJustLogged(false);
  };

  /* ── Copy vet summary ── */

  const copySummary = async () => {
    if (!hasResult) return;
    const cm = colourMeta(resultColour);
    const symptomLabels = symptoms.length
      ? symptoms
          .map((id) => {
            const meta = SYMPTOMS.find((s) => s.id === id);
            return meta ? t(`${NS}.ui.${meta.labelKey}`) : id;
          })
          .join(", ")
      : t(`${NS}.ui.copyNone`);
    const lines = [
      t(`${NS}.ui.copyTitle`),
      `${t(`${NS}.ui.copySpecies`)}: ${t(`${NS}.ui.${species === "dog" ? "speciesDog" : "speciesCat"}`)}`,
      `${t(`${NS}.ui.copyAge`)}: ${t(`${NS}.ui.${AGE_GROUPS.find((a) => a.id === ageGroup)?.labelKey}`)}`,
      `${t(`${NS}.ui.copyDuration`)}: ${t(`${NS}.ui.${DURATIONS.find((d) => d.id === duration)?.labelKey}`)}`,
      `${t(`${NS}.ui.copyFrequency`)}: ${stoolsPerDay === "4plus" ? t(`${NS}.ui.freq4`) : stoolsPerDay}`,
      `${t(`${NS}.ui.copySymptoms`)}: ${symptomLabels}`,
      `${t(`${NS}.ui.copyScore`)}: ${
        resultScore !== null
          ? `${resultScore}/7 (${bandLabel(bandForScore(resultScore))})`
          : t(`${NS}.ui.copyNone`)
      }`,
      `${t(`${NS}.ui.copyColour`)}: ${
        cm ? `${t(`${NS}.ui.${cm.labelKey}`)} — ${t(`${NS}.ui.${cm.meaningKey}`)}` : t(`${NS}.ui.copyNone`)
      }`,
      `${t(`${NS}.ui.copyMode`)}: ${t(`${NS}.ui.${lastResult === "photo" ? "resultModePhoto" : "resultModeManual"}`)}`,
      `${t(`${NS}.ui.copyTriage`)}: ${levelLabel(triage.level)}`,
      "",
      t(`${NS}.ui.copyFooter`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  };

  /* ── Stool log actions ── */

  const logCurrentResult = () => {
    if (!hasResult || resultScore === null || !lastResult) return;
    const entry: LogEntry = {
      date: new Date().toISOString(),
      score: resultScore,
      colour: resultColour,
      mode: lastResult,
      triage: triage.level,
    };
    const next = [...logEntries, entry];
    setLogEntries(next);
    saveLog(next);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2500);
  };

  const clearLog = () => {
    setLogEntries([]);
    saveLog([]);
  };

  const trend = useMemo(() => {
    if (logEntries.length < 2) return null;
    const dist = (s: number) => Math.abs(s - 2.5);
    const last = logEntries[logEntries.length - 1];
    const prev = logEntries[logEntries.length - 2];
    if (dist(last.score) < dist(prev.score)) return "improving" as const;
    if (dist(last.score) > dist(prev.score)) return "worsening" as const;
    return "steady" as const;
  }, [logEntries]);

  const resetAll = () => {
    setPhoto(null);
    setAiReport("");
    setAiScore(null);
    setAiColour(null);
    setErr("");
    setManualScore(null);
    setManualColour(null);
    setManualExtras([]);
    setManualResult(null);
    setLastResult(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const triageStyles: Record<
    TriageLevel,
    { box: string; icon: React.ReactNode; titleKey: string; descKey: string }
  > = {
    now: {
      box: "border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30",
      icon: <AlertTriangle className="h-6 w-6 text-rose-600" />,
      titleKey: "triageTitleNow",
      descKey: "triageDescNow",
    },
    soon: {
      box: "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
      icon: <Clock className="h-6 w-6 text-amber-600" />,
      titleKey: "triageTitleSoon",
      descKey: "triageDescSoon",
    },
    monitor: {
      box: "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30",
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      titleKey: "triageTitleMonitor",
      descKey: "triageDescMonitor",
    },
  };
  const ts = triageStyles[triage.level];

  return (
    <div className="space-y-8">
      {/* Disclaimer */}
      <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <div>
          <strong>{t(`${NS}.ui.disclaimerStrong`)}</strong> {t(`${NS}.ui.disclaimerBody`)}
        </div>
      </div>

      {/* Header banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-emerald-500/10 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-primary/40 font-semibold text-primary">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                {t(`${NS}.ui.badgeAi`)}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              >
                <ClipboardList className="mr-1 h-3.5 w-3.5" />
                {t(`${NS}.ui.badgeManual`)}
              </Badge>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t(`${NS}.ui.headerTitle`)}
            </h2>
            <p className="text-sm text-muted-foreground">{t(`${NS}.ui.headerDesc`)}</p>
          </div>
          <Button variant="outline" size="sm" onClick={resetAll} className="text-xs">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> {t(`${NS}.ui.resetButton`)}
          </Button>
        </div>
      </div>

      {/* Pet context */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Stethoscope className="h-4 w-4 text-primary" /> {t(`${NS}.ui.contextTitle`)}
          </CardTitle>
          <CardDescription>{t(`${NS}.ui.contextDesc`)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                {t(`${NS}.ui.speciesLabel`)}
              </Label>
              <Tabs
                value={species}
                onValueChange={(val) => setSpecies(val as Species)}
                className="mt-1.5 w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="dog">{t(`${NS}.ui.speciesDog`)}</TabsTrigger>
                  <TabsTrigger value="cat">{t(`${NS}.ui.speciesCat`)}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                {t(`${NS}.ui.frequencyLabel`)}
              </Label>
              <select
                value={stoolsPerDay}
                onChange={(e) => setStoolsPerDay(e.target.value)}
                className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="1">{t(`${NS}.ui.freq1`)}</option>
                <option value="2">{t(`${NS}.ui.freq2`)}</option>
                <option value="3">{t(`${NS}.ui.freq3`)}</option>
                <option value="4plus">{t(`${NS}.ui.freq4`)}</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              {t(`${NS}.ui.ageLabel`)}
            </Label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {AGE_GROUPS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAgeGroup(a.id)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    ageGroup === a.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {t(`${NS}.ui.${a.labelKey}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              {t(`${NS}.ui.durationLabel`)}
            </Label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDuration(d.id)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    duration === d.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {t(`${NS}.ui.${d.labelKey}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              {t(`${NS}.ui.symptomsLabel`)}
            </Label>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{t(`${NS}.ui.symptomsHint`)}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SYMPTOMS.map((s) => {
                const active = symptoms.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSymptom(s.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    {active && <Check className="mr-1 inline h-3 w-3" />}
                    {t(`${NS}.ui.${s.labelKey}`)}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live triage */}
      <div className={`rounded-2xl border p-5 shadow-sm ${ts.box}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">{ts.icon}</div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-foreground">{t(`${NS}.ui.${ts.titleKey}`)}</h3>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                {t(`${NS}.ui.triageLiveNote`)}
              </Badge>
            </div>
            <p className="text-sm text-foreground/80">{t(`${NS}.ui.${ts.descKey}`)}</p>
            <ul className="list-disc space-y-0.5 pl-5 text-sm text-foreground/80">
              {triage.reasons.map((r) => (
                <li key={r}>{t(`${NS}.ui.${r}`)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === "photo" ? "default" : "outline"}
          onClick={() => setMode("photo")}
          className="flex-1 sm:flex-none"
        >
          <Camera className="mr-2 h-4 w-4" /> {t(`${NS}.ui.modePhoto`)}
        </Button>
        <Button
          variant={mode === "manual" ? "default" : "outline"}
          onClick={() => setMode("manual")}
          className="flex-1 sm:flex-none"
        >
          <ClipboardList className="mr-2 h-4 w-4" /> {t(`${NS}.ui.modeManual`)}
        </Button>
      </div>

      {mode === "photo" ? (
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Camera className="h-4 w-4 text-primary" /> {t(`${NS}.ui.photoCardTitle`)}
            </CardTitle>
            <CardDescription>{t(`${NS}.ui.photoCardDesc`)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 font-medium">{t(`${NS}.ui.uploadLabel`)}</p>
              <p className="text-sm text-muted-foreground">{t(`${NS}.ui.hint`)}</p>
            </div>
            <div
              onClick={() => photoInputRef.current?.click()}
              className="relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-4 text-center transition hover:border-primary hover:bg-primary/5"
            >
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
              />
              {photo ? (
                <div className="relative w-full">
                  <img src={photo} alt="" className="mx-auto max-h-64 rounded-lg object-contain" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhoto(null);
                    }}
                    className="absolute right-1 top-1 rounded-full bg-background/90 px-2 py-0.5 text-xs text-foreground shadow hover:bg-destructive hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-semibold">{t(`${NS}.ui.uploadPrompt`)}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{t(`${NS}.ui.photoNote`)}</p>
                </>
              )}
            </div>
            <Button onClick={runPhotoAnalysis} disabled={!photo || analyzing} size="lg" className="w-full font-semibold">
              {analyzing ? (
                <>
                  <Activity className="mr-2 h-5 w-5 animate-spin" /> {t(`${NS}.ui.analyzingButton`)}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" /> {t(`${NS}.ui.cta`)}
                </>
              )}
            </Button>
            {err && <p className="text-sm text-red-600">{err}</p>}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ClipboardList className="h-4 w-4 text-primary" /> {t(`${NS}.ui.manualCardTitle`)}
            </CardTitle>
            <CardDescription>{t(`${NS}.ui.manualCardDesc`)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                {t(`${NS}.ui.scoreChartTitle`)}
              </Label>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{t(`${NS}.ui.chartHint`)}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {scoreInfo.map((s) => {
                  const active = manualScore === s.score;
                  return (
                    <button
                      key={s.score}
                      type="button"
                      onClick={() => setManualScore(s.score)}
                      className={`rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-background hover:border-primary/60"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="inline-block h-3 w-3 rounded-full"
                          style={{ backgroundColor: SEGMENT_COLOURS[s.score - 1] }}
                        />
                        <span className="text-lg font-black">{s.score}</span>
                      </div>
                      <div className="mt-1 text-xs font-semibold leading-tight">{s.label}</div>
                      <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{s.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                {t(`${NS}.ui.colourTitle`)}
              </Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {COLOURS.map((c) => {
                  const active = manualColour === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setManualColour(active ? null : c.id)}
                      className="flex w-16 flex-col items-center gap-1"
                    >
                      <span
                        className={`h-9 w-9 rounded-full border border-black/20 ${
                          active ? "ring-2 ring-primary ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: c.swatch }}
                      />
                      <span className={`text-[11px] leading-tight ${active ? "font-bold" : ""}`}>
                        {t(`${NS}.ui.${c.labelKey}`)}
                      </span>
                    </button>
                  );
                })}
              </div>
              {manualColour && (
                <p className="mt-2 rounded-lg border border-border/60 bg-muted/40 p-2.5 text-xs text-foreground/90">
                  {t(`${NS}.ui.${colourMeta(manualColour)?.meaningKey}`)}
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                {t(`${NS}.ui.extrasTitle`)}
              </Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {EXTRAS.map((e) => {
                  const active = manualExtras.includes(e.id);
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => toggleExtra(e.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      {active && <Check className="mr-1 inline h-3 w-3" />}
                      {t(`${NS}.ui.${e.labelKey}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button onClick={runManualAssessment} disabled={manualScore === null} size="lg" className="w-full font-semibold">
              <CheckCircle2 className="mr-2 h-5 w-5" /> {t(`${NS}.ui.assessButton`)}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Structured result */}
      {hasResult && (
        <Card className="border-primary/30 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Activity className="h-4 w-4 text-primary" /> {t(`${NS}.ui.resultTitle`)}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-primary/40 text-xs text-primary">
                  {t(`${NS}.ui.${lastResult === "photo" ? "resultModePhoto" : "resultModeManual"}`)}
                </Badge>
                <Badge
                  className={`text-xs font-bold text-white ${
                    triage.level === "now"
                      ? "bg-rose-600"
                      : triage.level === "soon"
                        ? "bg-amber-500"
                        : "bg-emerald-600"
                  }`}
                >
                  {levelLabel(triage.level)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {resultScore !== null && (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{resultScore}</span>
                  <span className="text-lg font-bold opacity-70">/ 7</span>
                  <span className="ml-1 text-sm font-semibold">
                    {bandLabel(bandForScore(resultScore))}
                  </span>
                </div>
                <div className="flex gap-1">
                  {SEGMENT_COLOURS.map((c, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full ${resultScore === i + 1 ? "h-3.5 ring-2 ring-foreground/60" : "h-2.5 opacity-70"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex justify-between px-0.5 text-[10px] font-medium text-muted-foreground">
                  <span>1 · {t(`${NS}.ui.score1Label`)}</span>
                  <span>7 · {t(`${NS}.ui.score7Label`)}</span>
                </div>
              </div>
            )}

            {resultColour && (
              <p className="rounded-lg border border-border/60 bg-muted/40 p-3 text-sm">
                <strong>{t(`${NS}.ui.copyColour`)}:</strong>{" "}
                {t(`${NS}.ui.${colourMeta(resultColour)?.labelKey}`)} —{" "}
                {t(`${NS}.ui.${colourMeta(resultColour)?.meaningKey}`)}
              </p>
            )}

            {lastResult === "photo" ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <FormattedMarkdown content={aiReport} />
              </div>
            ) : (
              manualResult && (
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-1.5 text-sm font-bold">{t(`${NS}.ui.meaningTitle`)}</h4>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/90">
                      {manualResult.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                  {triage.level === "now" ? (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-950/30">
                      <h4 className="mb-1.5 text-sm font-bold">{t(`${NS}.ui.urgentTitle`)}</h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm">
                        <li>{t(`${NS}.ui.urgentContact`)}</li>
                        <li>{t(`${NS}.ui.urgentSample`)}</li>
                        <li>{t(`${NS}.ui.urgentHydrate`)}</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
                      <h4 className="mb-1.5 text-sm font-bold">{t(`${NS}.ui.supportTitle`)}</h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm">
                        <li>{t(`${NS}.ui.supportBland`)}</li>
                        <li>{t(`${NS}.ui.supportHydration`)}</li>
                        <li>{t(`${NS}.ui.supportProbiotic`)}</li>
                        <li>{t(`${NS}.ui.supportMonitor`)}</li>
                      </ul>
                    </div>
                  )}
                </div>
              )
            )}

            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              <Button variant="outline" size="sm" onClick={copySummary} className="text-xs font-semibold">
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
              <Button
                variant="outline"
                size="sm"
                onClick={logCurrentResult}
                disabled={resultScore === null || justLogged}
                className="text-xs font-semibold"
              >
                {justLogged ? (
                  <>
                    <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> {t(`${NS}.ui.loggedLabel`)}
                  </>
                ) : (
                  <>
                    <ClipboardList className="mr-1.5 h-3.5 w-3.5" /> {t(`${NS}.ui.logButton`)}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 7-day stool log */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ClipboardList className="h-4 w-4 text-primary" /> {t(`${NS}.ui.logTitle`)}
            </CardTitle>
            {logEntries.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearLog} className="text-xs text-muted-foreground">
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> {t(`${NS}.ui.logClear`)}
              </Button>
            )}
          </div>
          <CardDescription>{t(`${NS}.ui.logDesc`)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {logEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t(`${NS}.ui.logEmpty`)}</p>
          ) : (
            <>
              <ul className="divide-y divide-border/60">
                {logEntries
                  .slice(-7)
                  .reverse()
                  .map((e, i) => (
                    <li key={`${e.date}-${i}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-sm">
                      <span className="font-medium">{new Date(e.date).toLocaleDateString()}</span>
                      <Badge
                        className="text-white"
                        style={{ backgroundColor: SEGMENT_COLOURS[e.score - 1] ?? "#666" }}
                      >
                        {e.score}/7
                      </Badge>
                      {e.colour && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: colourMeta(e.colour)?.swatch }}
                          />
                          {t(`${NS}.ui.${colourMeta(e.colour)?.labelKey}`)}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {t(`${NS}.ui.${e.mode === "photo" ? "resultModePhoto" : "resultModeManual"}`)}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          e.triage === "now"
                            ? "border-rose-400 text-rose-700"
                            : e.triage === "soon"
                              ? "border-amber-400 text-amber-700"
                              : "border-emerald-400 text-emerald-700"
                        }`}
                      >
                        {levelLabel(e.triage)}
                      </Badge>
                    </li>
                  ))}
              </ul>
              {trend && (
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  {trend === "improving" ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  ) : trend === "worsening" ? (
                    <TrendingDown className="h-4 w-4 text-rose-600" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                  {t(`${NS}.ui.${trend === "improving" ? "trendImproving" : trend === "worsening" ? "trendWorsening" : "trendSteady"}`)}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{t(`${NS}.ui.logTrendNote`)}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
