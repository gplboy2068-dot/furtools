import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";

function BigResult({ value, label, unit }: { value: string | number; label: string; unit?: string }) {
  return (
    <div className="text-center">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-5xl font-semibold text-primary">{value}</div>
      {unit && <div className="mt-1 text-sm text-muted-foreground">{unit}</div>}
    </div>
  );
}

/* Cat food (like dog food but feline factors) */
import { catMER, type CatActivity, type CatStage } from "@/lib/pet-formulas";
export function CatFoodCalculator() {
  const { t } = useTranslation("tools");
  const [weight, setWeight] = useState(10);
  const [activity, setActivity] = useState<CatActivity>("indoor");
  const [stage, setStage] = useState<CatStage>("adult");
  const [kcalPerCup, setKcalPerCup] = useState(300);
  const mer = Math.round(catMER(weight, activity, stage));
  const cups = kcalPerCup > 0 ? (mer / kcalPerCup).toFixed(2) : "0";
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("cat-food-calculator.ui.weightLabel")}</Label><Input type="number" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t("cat-food-calculator.ui.activityLabel")}</Label>
          <Select value={activity} onValueChange={(v: CatActivity) => setActivity(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="indoor">{t("cat-food-calculator.ui.activityIndoor")}</SelectItem>
              <SelectItem value="active">{t("cat-food-calculator.ui.activityActive")}</SelectItem>
              <SelectItem value="outdoor">{t("cat-food-calculator.ui.activityOutdoor")}</SelectItem>
            </SelectContent></Select></div>
        <div><Label>{t("cat-food-calculator.ui.lifeStageLabel")}</Label>
          <Select value={stage} onValueChange={(v: CatStage) => setStage(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="kitten">{t("cat-food-calculator.ui.stageKitten")}</SelectItem>
              <SelectItem value="adult">{t("cat-food-calculator.ui.stageAdult")}</SelectItem>
              <SelectItem value="senior">{t("cat-food-calculator.ui.stageSenior")}</SelectItem>
            </SelectContent></Select></div>
        <div><Label>{t("cat-food-calculator.ui.kcalPerCupLabel")}</Label>
          <Input type="number" value={kcalPerCup} onChange={(e) => setKcalPerCup(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-3">
        <BigResult value={cups} label={t("cat-food-calculator.ui.cupsPerDayLabel")} unit={t("cat-food-calculator.ui.kcalPerDay", { mer })} />
      </div>}
    />
  );
}

/* Kitten growth */
export function KittenGrowthCalculator() {
  const { t } = useTranslation("tools");
  const [weight, setWeight] = useState(4);
  const [months, setMonths] = useState(4);
  const [breed, setBreed] = useState<"domestic" | "large">("domestic");
  const factor = breed === "large" ? 1.3 : 1;
  // Share of adult weight already reached at each month of age, from standard
  // feline growth benchmarks (AAFP / UC Davis Koret): ~10% at 4 weeks, ~20% at
  // 8 weeks, ~30% at 12 weeks, ~42% at 4 months, ~64% at 6 months, full adult
  // weight at ~12 months. (The old linear formula overstated adult weight by
  // roughly a third — a 4 lb 4-month-old charted to a 13 lb adult, not ~10.)
  const ADULT_FRACTION: Record<number, number> = { 1: 0.10, 2: 0.20, 3: 0.31, 4: 0.42, 5: 0.53, 6: 0.64, 7: 0.72, 8: 0.79, 9: 0.85, 10: 0.90, 11: 0.95, 12: 1 };
  const m = Math.min(12, Math.max(1, Math.round(months) || 1));
  const adult = weight > 0 ? Math.round((weight / ADULT_FRACTION[m]) * factor) : 0;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("kitten-growth-calculator.ui.weightLabel")}</Label><Input type="number" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t("kitten-growth-calculator.ui.ageMonthsLabel")}</Label><Input type="number" value={months} onChange={(e) => setMonths(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t("kitten-growth-calculator.ui.breedGroupLabel")}</Label>
          <Select value={breed} onValueChange={(v: "domestic" | "large") => setBreed(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="domestic">{t("kitten-growth-calculator.ui.breedDomestic")}</SelectItem>
              <SelectItem value="large">{t("kitten-growth-calculator.ui.breedLarge")}</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<BigResult value={t("kitten-growth-calculator.ui.adultWeightValue", { adult })} label={t("kitten-growth-calculator.ui.adultWeightLabel")} />}
    />
  );
}

/* Litter */
export function CatLitterCalculator() {
  const { t } = useTranslation("tools");
  const [cats, setCats] = useState(1);
  const [type, setType] = useState<"clay" | "silica" | "plant">("clay");
  const perCatLb = { clay: 15, silica: 8, plant: 12 }[type];
  const perCatCost = { clay: 18, silica: 25, plant: 22 }[type];
  const safeCats = Math.max(1, cats);
  const lb = safeCats * perCatLb;
  const cost = safeCats * perCatCost;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("cat-litter-calculator.ui.catsLabel")}</Label><Input type="number" min={1} value={cats} onChange={(e) => setCats(+e.target.value || 1)} className="mt-1.5" /></div>
        <div><Label>{t("cat-litter-calculator.ui.litterTypeLabel")}</Label>
          <Select value={type} onValueChange={(v: "clay" | "silica" | "plant") => setType(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="clay">{t("cat-litter-calculator.ui.typeClay")}</SelectItem>
              <SelectItem value="silica">{t("cat-litter-calculator.ui.typeSilica")}</SelectItem>
              <SelectItem value="plant">{t("cat-litter-calculator.ui.typePlant")}</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<div className="space-y-3">
        <BigResult value={t("cat-litter-calculator.ui.litterValue", { lb })} label={t("cat-litter-calculator.ui.litterPerMonthLabel")} unit={t("cat-litter-calculator.ui.monthlyUnit", { cost, boxes: safeCats + 1 })} />
      </div>}
    />
  );
}

/* Play time */
export function CatPlayTimeCalculator() {
  const { t } = useTranslation("tools");
  const [age, setAge] = useState<"kitten" | "adult" | "senior">("adult");
  const mins = { kitten: 60, adult: 30, senior: 15 }[age];
  const sessions = { kitten: 6, adult: 2, senior: 2 }[age];
  return (
    <CalculatorLayout
      form={<div><Label>{t("cat-play-time-calculator.ui.lifeStageLabel")}</Label>
        <Select value={age} onValueChange={(v: "kitten" | "adult" | "senior") => setAge(v)}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="kitten">{t("cat-play-time-calculator.ui.stageKitten")}</SelectItem>
            <SelectItem value="adult">{t("cat-play-time-calculator.ui.stageAdult")}</SelectItem>
            <SelectItem value="senior">{t("cat-play-time-calculator.ui.stageSenior")}</SelectItem>
          </SelectContent></Select></div>}
      result={<div className="space-y-3">
        <BigResult value={mins} label={t("cat-play-time-calculator.ui.playMinutesLabel")} unit={t("cat-play-time-calculator.ui.splitSessions", { sessions, plural: sessions > 1 ? "s" : "" })} />
      </div>}
    />
  );
}
