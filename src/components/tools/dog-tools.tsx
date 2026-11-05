import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";
import { addDays, formatDate } from "@/lib/pet-formulas";

function BigResult({ value, label, unit }: { value: string | number; label: string; unit?: string }) {
  return (
    <div className="text-center">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-5xl font-semibold text-primary">{value}</div>
      {unit && <div className="mt-1 text-sm text-muted-foreground">{unit}</div>}
    </div>
  );
}

/* Dog walking / exercise */
const DOG_EXERCISE: Record<string, [number, number]> = {
  toy: [20, 40], small: [30, 60], medium: [45, 90], large: [60, 120], giant: [45, 90],
};
export function DogWalkingCalculator() {
  const { t } = useTranslation("tools");
  const [size, setSize] = useState("medium");
  const [age, setAge] = useState<"puppy" | "adult" | "senior">("adult");
  const [low, high] = DOG_EXERCISE[size];
  const factor = age === "puppy" ? 0.6 : age === "senior" ? 0.5 : 1;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("dog-walking-calculator.ui.breedSizeLabel")}</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(DOG_EXERCISE).map((k) => <SelectItem key={k} value={k}>{t(`dog-walking-calculator.ui.size${k[0].toUpperCase() + k.slice(1)}`)}</SelectItem>)}</SelectContent>
          </Select></div>
        <div><Label>{t("dog-walking-calculator.ui.lifeStageLabel")}</Label>
          <Select value={age} onValueChange={(v: "puppy" | "adult" | "senior") => setAge(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="puppy">{t("dog-walking-calculator.ui.stagePuppy")}</SelectItem><SelectItem value="adult">{t("dog-walking-calculator.ui.stageAdult")}</SelectItem><SelectItem value="senior">{t("dog-walking-calculator.ui.stageSenior")}</SelectItem></SelectContent>
          </Select></div>
      </>}
      result={<BigResult value={`${Math.round(low * factor)}–${Math.round(high * factor)}`} label={t("dog-walking-calculator.ui.walkingMinutesLabel")} unit={t("dog-walking-calculator.ui.splitInto2Walks")} />}
    />
  );
}

export function DogExerciseCalculator({ slug }: { slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.DogExerciseCalculator";
  const [energy, setEnergy] = useState<"low" | "medium" | "high">("medium");
  const [age, setAge] = useState<"puppy" | "adult" | "senior">("adult");
  const base = { low: 30, medium: 60, high: 100 }[energy];
  const factor = age === "puppy" ? 0.7 : age === "senior" ? 0.5 : 1;
  const mins = Math.round(base * factor);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t(`${p}.ui.energyLabel`)}</Label>
          <Select value={energy} onValueChange={(v: "low" | "medium" | "high") => setEnergy(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="low">{t(`${p}.ui.energyLow`)}</SelectItem><SelectItem value="medium">{t(`${p}.ui.energyMedium`)}</SelectItem><SelectItem value="high">{t(`${p}.ui.energyHigh`)}</SelectItem></SelectContent>
          </Select></div>
        <div><Label>{t(`${p}.ui.lifeStageLabel`)}</Label>
          <Select value={age} onValueChange={(v: "puppy" | "adult" | "senior") => setAge(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="puppy">{t(`${p}.ui.stagePuppy`)}</SelectItem><SelectItem value="adult">{t(`${p}.ui.stageAdult`)}</SelectItem><SelectItem value="senior">{t(`${p}.ui.stageSenior`)}</SelectItem></SelectContent>
          </Select></div>
      </>}
      result={<BigResult value={mins} label={t(`${p}.ui.exerciseMinutesLabel`)} unit={t(`${p}.ui.exerciseUnit`)} />}
    />
  );
}

/* Puppy growth */
export function PuppyGrowthCalculator() {
  const { t } = useTranslation("tools");
  const [weight, setWeight] = useState(10);
  const [weeks, setWeeks] = useState(16);
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  // Growth is NOT linear: puppies gain fast early, then level off. Predict from
  // the fraction of adult weight typically reached at each age for the size
  // class (anchor points, linearly interpolated). Matches the standard rules
  // of thumb — small ≈ weight at 12 weeks × 2, medium ≈ weight at 16 weeks × 2
  // — and the growth curves in this tool's own guide. The old formula
  // (weight / weeks) × 52 assumed a constant weekly gain for a full year and
  // overshot wildly (a 20 lb 12-week large puppy "predicted" 104 lb).
  const CURVES: Record<typeof size, [number, number][]> = {
    small: [[4, 0.14], [8, 0.30], [12, 0.50], [16, 0.62], [26, 0.80], [39, 0.95], [44, 1]],
    medium: [[4, 0.12], [8, 0.22], [12, 0.35], [16, 0.50], [20, 0.58], [26, 0.70], [39, 0.88], [52, 1]],
    large: [[4, 0.10], [8, 0.20], [12, 0.30], [16, 0.42], [20, 0.52], [26, 0.65], [39, 0.82], [52, 0.92], [65, 1]],
  };
  const adultFraction = (pts: [number, number][], w: number) => {
    if (w <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (w <= pts[i][0]) {
        const [w0, f0] = pts[i - 1];
        const [w1, f1] = pts[i];
        return f0 + ((f1 - f0) * (w - w0)) / (w1 - w0);
      }
    }
    return 1;
  };
  const adult = weight > 0 && weeks > 0 ? Math.round(weight / adultFraction(CURVES[size], weeks)) : 0;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("puppy-growth-calculator.ui.weightLabel")}</Label><Input type="number" value={weight} onChange={(e) => setWeight(Math.max(0, +e.target.value || 0))} className="mt-1.5" /></div>
        <div><Label>{t("puppy-growth-calculator.ui.ageWeeksLabel")}</Label><Input type="number" value={weeks} onChange={(e) => setWeeks(Math.max(0, +e.target.value || 0))} className="mt-1.5" /></div>
        <div><Label>{t("puppy-growth-calculator.ui.adultSizeLabel")}</Label>
          <Select value={size} onValueChange={(v: "small" | "medium" | "large") => setSize(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="small">{t("puppy-growth-calculator.ui.sizeSmall")}</SelectItem><SelectItem value="medium">{t("puppy-growth-calculator.ui.sizeMedium")}</SelectItem><SelectItem value="large">{t("puppy-growth-calculator.ui.sizeLarge")}</SelectItem></SelectContent>
          </Select></div>
      </>}
      result={<BigResult value={t("puppy-growth-calculator.ui.adultWeightValue", { adult })} label={t("puppy-growth-calculator.ui.adultWeightLabel")} />}
    />
  );
}

/* Heat cycle */
export function DogHeatCycleTracker() {
  const { t } = useTranslation("tools");
  // Build "today" and parse the picked date as LOCAL dates: new Date("2026-02-01")
  // is UTC midnight, which renders as the previous day west of UTC (off-by-one),
  // and toISOString() can pre-fill a different calendar day than the local one.
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [date, setDate] = useState(today);
  const [interval, setInterval] = useState(6); // months
  const [sy, sm, sd] = (date || "").split("-").map(Number);
  const last = sy && sm && sd ? new Date(sy, sm - 1, sd) : new Date();
  const next = addDays(last, interval * 30);
  const fertileStart = addDays(next, 9);
  const fertileEnd = addDays(next, 15);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("dog-heat-cycle-tracker.ui.lastHeatLabel")}</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" /></div>
        <div><Label>{t("dog-heat-cycle-tracker.ui.cycleIntervalLabel")}</Label>
          <Select value={String(interval)} onValueChange={(v) => setInterval(+v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{[4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => <SelectItem key={n} value={String(n)}>{t("dog-heat-cycle-tracker.ui.intervalMonths", { n })}</SelectItem>)}</SelectContent>
          </Select></div>
      </>}
      result={<div className="space-y-3">
        <BigResult value={formatDate(next)} label={t("dog-heat-cycle-tracker.ui.nextHeatLabel")} />
        <div className="text-center text-sm text-muted-foreground">{t("dog-heat-cycle-tracker.ui.fertileWindow", { start: formatDate(fertileStart), end: formatDate(fertileEnd) })}</div>
      </div>}
    />
  );
}
