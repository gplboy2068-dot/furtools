import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Copy,
  Check,
  Thermometer,
  Droplets,
  Layers,
  Sun,
  ShieldAlert,
  Maximize2,
  Box,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

function Big({ value, label, unit }: { value: string | number; label: string; unit?: string }) {
  return (
    <div className="text-center">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-4xl font-semibold text-primary">{value}</div>
      {unit && <div className="mt-1 text-sm text-muted-foreground">{unit}</div>}
    </div>
  );
}
function Note({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground text-center">{children}</p>;
}
function SelectField({ label, value, onChange, options, optionLabels }: { label: string; value: string; onChange: (v: string) => void; options: string[]; optionLabels?: string[] }) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((o, i) => <SelectItem key={o} value={o}>{optionLabels?.[i] ?? o.replace(/-/g, " ")}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
function NumberField({ label, value, onChange, min = 0, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number; step?: number }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type="number" min={min} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1.5" />
    </div>
  );
}

/* ─────────── DOGS ─────────── */
export function DogSwimTimeCalculator() {
  const { t } = useTranslation("tools");
  const [kg, setKg] = useState(20);
  const [fitness, setFitness] = useState("average");
  const base: Record<string, number> = { beginner: 5, average: 10, athletic: 20 };
  const minutes = Math.round(base[fitness] * Math.min(1.4, Math.max(0.6, kg / 20)));
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label={t("dog-swim-time-calculator.ui.weightLabel")} value={kg} onChange={setKg} step={0.5} />
        <SelectField label={t("dog-swim-time-calculator.ui.fitnessLabel")} value={fitness} onChange={setFitness} options={Object.keys(base)} optionLabels={[t("dog-swim-time-calculator.ui.fitnessBeginner"), t("dog-swim-time-calculator.ui.fitnessAverage"), t("dog-swim-time-calculator.ui.fitnessAthletic")]} />
      </div>}
      result={<div className="space-y-4">
        <Big value={t("dog-swim-time-calculator.ui.minutesValue", { minutes })} label={t("dog-swim-time-calculator.ui.safeSessionLabel")} />
        <Note>{t("dog-swim-time-calculator.ui.rinseNote")}</Note>
      </div>}
    />
  );
}

export function DogCarTravelPlanner() {
  const { t } = useTranslation("tools");
  const [hours, setHours] = useState(6);
  const breaks = Math.max(1, Math.floor(hours / 2));
  const water = Math.round(hours * 100);
  return (
    <CalculatorLayout
      form={<NumberField label={t("dog-car-travel-planner.ui.tripLengthLabel")} value={hours} onChange={setHours} min={1} />}
      result={<div className="space-y-4">
        <Big value={breaks} label={t("dog-car-travel-planner.ui.breaksLabel")} />
        <Note>{t("dog-car-travel-planner.ui.waterNote", { water })}</Note>
      </div>}
    />
  );
}

export function DogParkVisitTracker() {
  const { t } = useTranslation("tools");
  const [minutes, setMinutes] = useState(45);
  const [visits, setVisits] = useState(3);
  const weekly = minutes * visits;
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label={t("dog-park-visit-tracker.ui.minutesPerVisitLabel")} value={minutes} onChange={setMinutes} min={10} />
        <NumberField label={t("dog-park-visit-tracker.ui.visitsPerWeekLabel")} value={visits} onChange={setVisits} min={1} />
      </div>}
      result={<Big value={t("dog-park-visit-tracker.ui.weeklyValue", { weekly })} label={t("dog-park-visit-tracker.ui.totalLabel")} />}
    />
  );
}

export function DogCrateTrainingSchedule() {
  const { t } = useTranslation("tools");
  const [weeks, setWeeks] = useState(8);
  const maxHours = Math.min(6, Math.max(1, Math.floor(weeks / 4) + 1));
  return (
    <CalculatorLayout
      form={<NumberField label={t("dog-crate-training-schedule.ui.puppyAgeLabel")} value={weeks} onChange={setWeeks} min={8} />}
      result={<div className="space-y-4">
        <Big value={t("dog-crate-training-schedule.ui.maxHoursValue", { hours: maxHours })} label={t("dog-crate-training-schedule.ui.maxTimeLabel")} />
        <Note>{t("dog-crate-training-schedule.ui.ruleNote")}</Note>
      </div>}
    />
  );
}

/* ─────────── CATS ─────────── */
export function CatWindowPerchGuide() {
  const { t } = useTranslation("tools");
  const [cats, setCats] = useState(1);
  const perches = cats + 1;
  return (
    <CalculatorLayout
      form={<NumberField label={t("cat-window-perch-guide.ui.catsLabel")} value={cats} onChange={setCats} min={1} />}
      result={<div className="space-y-4">
        <Big value={perches} label={t("cat-window-perch-guide.ui.perchesLabel")} />
        <Note>{t("cat-window-perch-guide.ui.perchNote")}</Note>
      </div>}
    />
  );
}

export function CatWeightLossPlanner() {
  const { t } = useTranslation("tools");
  const [current, setCurrent] = useState(6);
  const [target, setTarget] = useState(5);
  const weeks = Math.max(1, Math.round((current - target) / 0.05));
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label={t("cat-weight-loss-planner.ui.currentWeightLabel")} value={current} onChange={setCurrent} step={0.1} />
        <NumberField label={t("cat-weight-loss-planner.ui.targetWeightLabel")} value={target} onChange={setTarget} step={0.1} />
      </div>}
      result={<div className="space-y-4">
        <Big value={t("cat-weight-loss-planner.ui.weeksValue", { weeks })} label={t("cat-weight-loss-planner.ui.timelineLabel")} />
        <Note>{t("cat-weight-loss-planner.ui.lossNote")}</Note>
      </div>}
    />
  );
}

export function CatAgeAdjustedFeeding() {
  const { t } = useTranslation("tools");
  const [age, setAge] = useState(3);
  const [kg, setKg] = useState(4);
  const factor = age < 1 ? 2.5 : age > 10 ? 0.9 : 1.0;
  const kcal = Math.round(70 * Math.pow(kg, 0.75) * factor);
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label={t("cat-age-adjusted-feeding.ui.ageLabel")} value={age} onChange={setAge} step={0.5} />
        <NumberField label={t("cat-age-adjusted-feeding.ui.weightLabel")} value={kg} onChange={setKg} step={0.1} />
      </div>}
      result={<Big value={t("cat-age-adjusted-feeding.ui.kcalValue", { kcal })} label={t("cat-age-adjusted-feeding.ui.calorieLabel")} />}
    />
  );
}

/* ─────────── BIRDS ─────────── */
interface BirdMoltData {
  name: string;
  durationWeeks: number;
  frequencyPerYear: string;
  nutritionalNeeds: string;
  pinFeatherCare: string;
}

const BIRD_MOLT_PROFILES: Record<string, BirdMoltData> = {
  budgie: { name: "Budgerigar", durationWeeks: 6, frequencyPerYear: "1–2× annually (usually late Summer/Autumn)", nutritionalNeeds: "Egg food (scrambled hard-boiled egg with crushed shell), sprouted seeds, high-methionine amino acids.", pinFeatherCare: "Provide extra shallow baths to soften keratin sheaths; budgie head pin feathers can be gently rolled if bonded." },
  cockatiel: { name: "Cockatiel", durationWeeks: 8, frequencyPerYear: "1–2× annually (Spring / Autumn)", nutritionalNeeds: "Boiled egg yolk, dark leafy greens (kale, dandelion), calcium cuttlebone, beta-carotene (carrots).", pinFeatherCare: "Cockatiels cannot reach their own crest; bonded mates or gentle owner head preening helps open mature sheaths." },
  conure: { name: "Conure (Green Cheek / Sun)", durationWeeks: 8, frequencyPerYear: "1× full molt + 1× minor molt", nutritionalNeeds: "Sprouted pulses, cooked quinoa, sweet potatoes, raw red palm oil (rich in Vitamin A & E).", pinFeatherCare: "Mist daily with warm water to relieve intense prickling sensations on neck and flanks." },
  "african-grey": { name: "African Grey", durationWeeks: 10, frequencyPerYear: "Gradual continuous molt (peaks in Autumn)", nutritionalNeeds: "Bioavailable calcium (crushed oyster shell, steamed collards), raw organic red palm fruit oil.", pinFeatherCare: "Extremely sensitive pin feathers; avoid touching blood feathers in active shaft growth." },
  amazon: { name: "Amazon Parrot", durationWeeks: 10, frequencyPerYear: "1× major annual molt (Post-breeding)", nutritionalNeeds: "Steam-cooked orange squash, dark leafy greens, high-potency organic pellets.", pinFeatherCare: "Heavy warm showers accelerate sheath breakdown and reduce irritable moodiness." },
  cockatoo: { name: "Cockatoo", durationWeeks: 10, frequencyPerYear: "1× annual extended molt", nutritionalNeeds: "Higher amino acid profile; avoid excess high-fat seeds, emphasize broccoli and leafy sprouts.", pinFeatherCare: "Intense powder down increase; increase air filtration and daily baths." },
  macaw: { name: "Large Macaw", durationWeeks: 12, frequencyPerYear: "Shed in sequence (takes up to 3 months)", nutritionalNeeds: "Raw in-shell walnuts, Brazil nuts, palm fruit oil, complex extruded pellets.", pinFeatherCare: "Massive primary flight feather shafts; do NOT pull tight sheath until dry and flaky." },
};

export function BirdMoltingTracker() {
  const { t } = useTranslation("tools");
  const [sp, setSp] = useState("cockatiel");
  const [start, setStart] = useState("2026-08-01");
  const d = BIRD_MOLT_PROFILES[sp] || BIRD_MOLT_PROFILES.cockatiel;
  const startDate = new Date(start || Date.now());
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + d.durationWeeks * 7);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t("bird-molting-tracker.ui.speciesLabel")}</Label>
            <Select value={sp} onValueChange={setSp}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(BIRD_MOLT_PROFILES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{t(`bird-molting-tracker.ui.molt.${k}.name`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("bird-molting-tracker.ui.moltStartLabel")}</Label>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1.5" />
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={endDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} label={t("bird-molting-tracker.ui.completionLabel", { weeks: d.durationWeeks })} />
          <Rows items={[
            { label: t("bird-molting-tracker.ui.freqLabel"), value: t(`bird-molting-tracker.ui.molt.${sp}.frequency`) },
            { label: t("bird-molting-tracker.ui.pinCareLabel"), value: t(`bird-molting-tracker.ui.molt.${sp}.pinCare`) },
          ]} />
          <div className="rounded-lg bg-primary/10 p-3 text-xs text-primary font-medium">
            🧬 <strong>{t("bird-molting-tracker.ui.nutritionTitle")}</strong> {t(`bird-molting-tracker.ui.molt.${sp}.nutrition`)}
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            <strong>🩸 {t("bird-molting-tracker.ui.bloodWarningTitle")}</strong> {t("bird-molting-tracker.ui.bloodWarningBody")}
          </div>
        </div>
      }
    />
  );
}

interface BirdSleepData {
  name: string;
  sleepHours: number;
  bedtimeSuggestion: string;
  hormonalControlAdvice: string;
}

const BIRD_SLEEP_PROFILES: Record<string, BirdSleepData> = {
  budgie: { name: "Budgerigar (Australian Grassland)", sleepHours: 10, bedtimeSuggestion: "8:00 PM – 6:00 AM (10 uninterrupted hours)", hormonalControlAdvice: "If female budgies start searching for dark nesting corners, extend sleep to 12 hours of total darkness to suppress breeding hormones." },
  canary: { name: "Canary / Finch", sleepHours: 10, bedtimeSuggestion: "8:30 PM – 6:30 AM (10 hours)", hormonalControlAdvice: "Natural daylight changes stimulate spring singing; keep photoperiod consistent to avoid out-of-season molting." },
  cockatiel: { name: "Cockatiel", sleepHours: 12, bedtimeSuggestion: "7:30 PM – 7:30 AM (12 uninterrupted hours)", hormonalControlAdvice: "CRITICAL FOR FEMALE COCKATIELS: Chronic egg laying is triggered by long daylight (>14 hrs). Maintain 12–14 hours of total dark coverage to prevent fatal egg binding." },
  lovebird: { name: "Lovebird", sleepHours: 12, bedtimeSuggestion: "8:00 PM – 8:00 AM (12 hours)", hormonalControlAdvice: "Cover cage with breathable blackout fabric; prevent access to shredded paper or enclosed dark huts." },
  conure: { name: "Conure (Green Cheek / Sun)", sleepHours: 12, bedtimeSuggestion: "8:00 PM – 8:00 AM (12 hours)", hormonalControlAdvice: "Sleep deprivation triggers aggressive screaming and territorial cage aggression. Provide quiet sleep retreat." },
  "african-grey": { name: "African Grey", sleepHours: 12, bedtimeSuggestion: "8:00 PM – 8:00 AM (12 hours in dedicated sleep cage)", hormonalControlAdvice: "African Greys are highly prone to psychogenic night frights and feather plucking if disturbed by evening TV light." },
  amazon: { name: "Amazon Parrot", sleepHours: 12, bedtimeSuggestion: "7:30 PM – 7:30 AM (12 hours)", hormonalControlAdvice: "Spring hormonal 'hot-headed' behavior is reduced by enforcing 12+ hours of strict uninterrupted darkness." },
  cockatoo: { name: "Cockatoo", sleepHours: 12, bedtimeSuggestion: "7:30 PM – 7:30 AM (12 hours)", hormonalControlAdvice: "Inadequate sleep leads directly to severe neurotic screaming and self-mutilation (feather chewing/picking)." },
  macaw: { name: "Large Macaw", sleepHours: 12, bedtimeSuggestion: "8:00 PM – 8:00 AM (12 hours)", hormonalControlAdvice: "Equatorial jungle species naturally evolved with equal 12-hour day / 12-hour night cycles." },
};

export function BirdSleepSchedule({ slug }: { slug?: string }) {
  const p = slug ?? "shared.BirdSleepSchedule";
  const { t } = useTranslation("tools");
  const [sp, setSp] = useState("cockatiel");
  const [wakeTime, setWakeTime] = useState("07:00");
  const d = BIRD_SLEEP_PROFILES[sp] || BIRD_SLEEP_PROFILES.cockatiel;

  const [wakeH, wakeM] = wakeTime.split(":").map(Number);
  const bedtimeTotalMinutes = (wakeH * 60 + wakeM - d.sleepHours * 60 + 1440) % 1440;
  const bedH = Math.floor(bedtimeTotalMinutes / 60);
  const bedM = bedtimeTotalMinutes % 60;
  const bedH12 = bedH % 12 || 12;
  const bedAmPm = bedH < 12 ? "AM" : "PM";
  const bedStr = `${bedH12}:${bedM.toString().padStart(2, "0")} ${bedAmPm}`;

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t(`${p}.ui.speciesLabel`)}</Label>
            <Select value={sp} onValueChange={setSp}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(BIRD_SLEEP_PROFILES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{t(`${p}.ui.sleep.${k}.name`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t(`${p}.ui.wakeupLabel`)}</Label>
            <Input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="mt-1.5" />
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={bedStr} label={t(`${p}.ui.bedtimeLabel`, { hours: d.sleepHours })} unit={t(`${p}.ui.wakeUnit`, { time: wakeTime })} />
          <Rows items={[
            { label: t(`${p}.ui.sleepDurationLabel`), value: t(`${p}.ui.sleepDurationValue`, { hours: d.sleepHours }) },
            { label: t(`${p}.ui.equatorialLabel`), value: t(`${p}.ui.sleep.${sp}.suggestion`) },
          ]} />
          <div className="rounded-lg bg-primary/10 p-3 text-xs text-primary font-medium">
            🌙 <strong>{t(`${p}.ui.hormonalTitle`)}</strong> {t(`${p}.ui.sleep.${sp}.hormonal`)}
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>{t(`${p}.ui.sleepCageTitle`)}</strong> {t(`${p}.ui.sleepCageBody`)}</p>
          </div>
        </div>
      }
    />
  );
}

/* ─────────── FISH ─────────── */
export function AquariumNitrateCalculator() {
  const { t } = useTranslation("tools");
  const [gallons, setGallons] = useState(30);
  const [ppm, setPpm] = useState(40);
  const targetPpm = 20;
  const changePct = Math.min(50, Math.round(((ppm - targetPpm) / ppm) * 100));
  const gallonsOut = Math.round((gallons * changePct) / 100);
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label={t("aquarium-nitrate-calculator.ui.tankVolumeLabel")} value={gallons} onChange={setGallons} min={1} />
        <NumberField label={t("aquarium-nitrate-calculator.ui.nitrateLabel")} value={ppm} onChange={setPpm} min={0} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${changePct}%`} label={t("aquarium-nitrate-calculator.ui.changeLabel")} />
        <Note>{t("aquarium-nitrate-calculator.ui.changeNote", { gal: gallonsOut })}</Note>
      </div>}
    />
  );
}

export function FishMedicationDose() {
  const { t } = useTranslation("tools");
  const [gallons, setGallons] = useState(20);
  const [mgPerGal, setMgPerGal] = useState(10);
  const totalMg = gallons * mgPerGal;
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label={t("fish-medication-dose.ui.tankVolumeLabel")} value={gallons} onChange={setGallons} min={1} />
        <NumberField label={t("fish-medication-dose.ui.doseLabel")} value={mgPerGal} onChange={setMgPerGal} step={0.5} />
      </div>}
      result={<div className="space-y-4">
        <Big value={t("fish-medication-dose.ui.totalDoseValue", { mg: totalMg })} label={t("fish-medication-dose.ui.totalDoseLabel")} />
        <Note>{t("fish-medication-dose.ui.carbonNote")}</Note>
      </div>}
    />
  );
}

/* ─────────── SMALL PETS (ADVANCED CALCULATORS) ─────────── */
export function RabbitPelletCalculator() {
  const { t } = useTranslation("tools");
  const [kg, setKg] = useState(2.2);
  const [stage, setStage] = useState<"young" | "adult" | "senior">("adult");
  const [bcs, setBcs] = useState<"underweight" | "ideal" | "overweight">("ideal");

  const weightLb = kg * 2.20462;
  // House Rabbit Society guideline: 1/8 to 1/4 cup per 5 lbs body weight for adult maintenance
  const baseGrams =
    stage === "young"
      ? Math.round(kg * 40) // growing babies get high protein/calcium
      : stage === "senior"
      ? Math.round(kg * 14)
      : Math.round(kg * 12);

  const bcsMultiplier = bcs === "overweight" ? 0.65 : bcs === "underweight" ? 1.35 : 1.0;
  const finalGrams = Math.max(5, Math.round(baseGrams * bcsMultiplier));
  const tbsp = Math.round((finalGrams / 10) * 10) / 10;
  const cups = (tbsp / 16).toFixed(2);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <NumberField label={t("rabbit-pellet-calculator.ui.rabbitWeightLabel")} value={kg} onChange={setKg} step={0.1} min={0.5} />
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label={t("rabbit-pellet-calculator.ui.lifeStageLabel")}
              value={stage}
              onChange={(v) => setStage(v as typeof stage)}
              options={["young", "adult", "senior"]}
              optionLabels={[t("rabbit-pellet-calculator.ui.lifeStageYoung"), t("rabbit-pellet-calculator.ui.lifeStageAdult"), t("rabbit-pellet-calculator.ui.lifeStageSenior")]}
            />
            <SelectField
              label={t("rabbit-pellet-calculator.ui.bcsLabel")}
              value={bcs}
              onChange={(v) => setBcs(v as typeof bcs)}
              options={["underweight", "ideal", "overweight"]}
              optionLabels={[t("rabbit-pellet-calculator.ui.bcsUnderweight"), t("rabbit-pellet-calculator.ui.bcsIdeal"), t("rabbit-pellet-calculator.ui.bcsOverweight")]}
            />
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("rabbit-pellet-calculator.ui.pelletsValue", { grams: finalGrams })} label={t("rabbit-pellet-calculator.ui.pelletsLabel")} unit={t("rabbit-pellet-calculator.ui.pelletsUnit", { tbsp, cups })} />
          <Rows
            items={[
              { label: t("rabbit-pellet-calculator.ui.hayTargetLabel"), value: t("rabbit-pellet-calculator.ui.hayTargetValue") },
              { label: t("rabbit-pellet-calculator.ui.greensLabel"), value: t("rabbit-pellet-calculator.ui.greensValue", { cups: Math.max(1, Math.round(weightLb * 0.5)) }) },
              { label: t("rabbit-pellet-calculator.ui.pelletStandardLabel"), value: t("rabbit-pellet-calculator.ui.pelletStandardValue") },
              { label: t("rabbit-pellet-calculator.ui.feedingFreqLabel"), value: t("rabbit-pellet-calculator.ui.feedingFreqValue") },
            ]}
          />
          <Note>
            {t("rabbit-pellet-calculator.ui.pelletNote")}
          </Note>
        </div>
      }
    />
  );
}

export function RabbitWeightTracker() {
  const { t } = useTranslation("tools");
  const [last, setLast] = useState(2.2);
  const [current, setCurrent] = useState(2.15);
  const [days, setDays] = useState(7);

  const diff = current - last;
  const pct = Number(((diff / last) * 100).toFixed(1));
  const absPct = Math.abs(pct);

  const status =
    absPct <= 2.0
      ? { tone: "safe" as const, label: t("rabbit-weight-tracker.ui.statusSafe"), alert: false }
      : absPct <= 4.5
      ? { tone: "caution" as const, label: t("rabbit-weight-tracker.ui.statusCaution"), alert: false }
      : { tone: "danger" as const, label: t("rabbit-weight-tracker.ui.statusDanger"), alert: true };

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <NumberField label={t("rabbit-weight-tracker.ui.prevWeightLabel")} value={last} onChange={setLast} step={0.01} min={0.5} />
            <NumberField label={t("rabbit-weight-tracker.ui.currWeightLabel")} value={current} onChange={setCurrent} step={0.01} min={0.5} />
          </div>
          <NumberField label={t("rabbit-weight-tracker.ui.daysLabel")} value={days} onChange={setDays} min={1} max={60} />
        </div>
      }
      result={
        <div className="space-y-4">
          <Big
            value={t("rabbit-weight-tracker.ui.changeValue", { sign: pct >= 0 ? "+" : "", pct })}
            label={t("rabbit-weight-tracker.ui.changeLabel")}
            unit={t("rabbit-weight-tracker.ui.changeUnit", { sign: diff >= 0 ? "+" : "", grams: Math.round(diff * 1000), days })}
          />
          <Rows
            items={[
              { label: t("rabbit-weight-tracker.ui.triageLabel"), value: status.label },
              { label: t("rabbit-weight-tracker.ui.giRiskLabel"), value: status.alert ? t("rabbit-weight-tracker.ui.riskHigh") : t("rabbit-weight-tracker.ui.riskLow") },
              { label: t("rabbit-weight-tracker.ui.actionLabel"), value: status.alert ? t("rabbit-weight-tracker.ui.actionUrgent") : t("rabbit-weight-tracker.ui.actionNormal") },
            ]}
          />
          <Note>
            {t("rabbit-weight-tracker.ui.weightNote")}
          </Note>
        </div>
      }
    />
  );
}

export function GuineaPigFoodCalculator() {
  const { t } = useTranslation("tools");
  const [count, setCount] = useState(2);
  const [stage, setStage] = useState<"adult" | "pup">("adult");

  const hayG = count * 90; // ~90g loose Timothy hay per pig daily
  const pelletsG = count * (stage === "pup" ? 35 : 25); // ~1/8 cup (25g) per adult
  const veggiesG = count * 100; // ~1 cup (100g) mixed safe greens per pig
  const waterMl = count * 150; // ~100-200ml fresh water per pig daily

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <NumberField label={t("guinea-pig-food-calculator.ui.countLabel")} value={count} onChange={setCount} min={1} max={10} />
            <SelectField
              label={t("guinea-pig-food-calculator.ui.lifeStageLabel")}
              value={stage}
              onChange={(v) => setStage(v as typeof stage)}
              options={["adult", "pup"]}
              optionLabels={[t("guinea-pig-food-calculator.ui.stageAdult"), t("guinea-pig-food-calculator.ui.stagePup")]}
            />
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("guinea-pig-food-calculator.ui.hayValue", { grams: hayG })} label={t("guinea-pig-food-calculator.ui.hayLabel")} unit={t("guinea-pig-food-calculator.ui.hayUnit", { kg: Math.round(hayG * 7 / 1000 * 10) / 10, count })} />
          <Rows
            items={[
              { label: t("guinea-pig-food-calculator.ui.pelletsLabel"), value: t("guinea-pig-food-calculator.ui.pelletsRow", { grams: pelletsG, count }) },
              { label: t("guinea-pig-food-calculator.ui.greensLabel"), value: t("guinea-pig-food-calculator.ui.greensRow", { grams: veggiesG, count }) },
              { label: t("guinea-pig-food-calculator.ui.waterLabel"), value: t("guinea-pig-food-calculator.ui.waterRow", { ml: waterMl }) },
              { label: t("guinea-pig-food-calculator.ui.vitaminCLabel"), value: t("guinea-pig-food-calculator.ui.vitaminCValue") },
            ]}
          />
          <Note>
            {t("guinea-pig-food-calculator.ui.vitaminCNote")}
          </Note>
        </div>
      }
    />
  );
}

/* ─────────── REPTILES ─────────── */
interface SheddingSpecies {
  name: string;
  scientific: string;
  babyDays: number;
  juvDays: number;
  adultDays: number;
  shedType: "whole-piece" | "patchy-pieces" | "scutes" | "skin-flakes";
  humidHideTarget: string;
  tips: string;
}

const SHEDDING_SPECIES_DATA: Record<string, SheddingSpecies> = {
  "ball-python": {
    name: "Ball Python (Python regius)",
    scientific: "Python regius",
    babyDays: 28, juvDays: 38, adultDays: 55,
    shedType: "whole-piece",
    humidHideTarget: "75% – 85% with damp sphagnum moss",
    tips: "Snakes must shed in ONE complete piece from nose to tail tip including both transparent eye caps (brilles). Never pull dry shed.",
  },
  "corn-snake": {
    name: "Corn Snake",
    scientific: "Pantherophis guttatus",
    babyDays: 21, juvDays: 35, adultDays: 50,
    shedType: "whole-piece",
    humidHideTarget: "70% – 80%",
    tips: "Provide a rough cork bark or stone surface for the snake to rub its snout against to start the skin roll.",
  },
  "leopard-gecko": {
    name: "Leopard Gecko",
    scientific: "Eublepharis macularius",
    babyDays: 10, juvDays: 18, adultDays: 28,
    shedType: "whole-piece",
    humidHideTarget: "70% – 80% enclosed moist hide 24/7",
    tips: "Geckos eat their shed skin (keratophagy) to reclaim calcium and nutrients and hide their scent from predators. Check toes after every shed.",
  },
  "bearded-dragon": {
    name: "Bearded Dragon",
    scientific: "Pogona vitticeps",
    babyDays: 14, juvDays: 30, adultDays: 75,
    shedType: "patchy-pieces",
    humidHideTarget: "40% ambient + warm shallow bath (85-90°F / 30-32°C)",
    tips: "Lizards shed in large separate patches over days. Never pull shed before it separates freely, as tearing live scales causes infections.",
  },
  "crested-gecko": {
    name: "Crested Gecko",
    scientific: "Correlophus ciliatus",
    babyDays: 10, juvDays: 16, adultDays: 28,
    shedType: "whole-piece",
    humidHideTarget: "85% during evening misting",
    tips: "Usually sheds overnight and consumes the entire skin before morning. Check tail tip and toe pads for stuck rings.",
  },
  "boa-constrictor": {
    name: "Boa Constrictor (BCI)",
    scientific: "Boa imperator",
    babyDays: 30, juvDays: 45, adultDays: 70,
    shedType: "whole-piece",
    humidHideTarget: "75% – 80%",
    tips: "Boas exhibit a prominent dull phase followed by bright pink ventral belly scales during the pre-blue cycle.",
  },
  "blue-tongue-skink": {
    name: "Blue-Tongued Skink",
    scientific: "Tiliqua scincoides",
    babyDays: 20, juvDays: 35, adultDays: 60,
    shedType: "patchy-pieces",
    humidHideTarget: "Northern: 60% | Indonesian: 85%",
    tips: "Indonesian species require high humidity to prevent stuck shedding from strangulating and amputating tiny toe digits.",
  },
  "veiled-chameleon": {
    name: "Veiled / Panther Chameleon",
    scientific: "Chamaeleonidae",
    babyDays: 14, juvDays: 25, adultDays: 60,
    shedType: "skin-flakes",
    humidHideTarget: "80% morning misting with warm shower perch",
    tips: "Explosive shedding! The entire skin 'pops' and flakes off in a white veil within 24–48 hours.",
  },
};

export function ReptileSheddingTracker() {
  const { t } = useTranslation("tools");
  const [spKey, setSpKey] = useState("ball-python");
  const [lifeStage, setLifeStage] = useState<"baby" | "juvenile" | "adult">("juvenile");
  const [daysSinceLast, setDaysSinceLast] = useState<number>(20);
  const [observedPhase, setObservedPhase] = useState<string>("normal");

  const sp = SHEDDING_SPECIES_DATA[spKey] || SHEDDING_SPECIES_DATA["ball-python"];

  const cycleDays = lifeStage === "baby" ? sp.babyDays : lifeStage === "juvenile" ? sp.juvDays : sp.adultDays;
  const daysRemaining = Math.max(0, cycleDays - daysSinceLast);
  const progressPct = Math.min(100, Math.round((daysSinceLast / cycleDays) * 100));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <h3 className="font-semibold text-foreground">{t("reptile-shedding-tracker.ui.title")}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t("reptile-shedding-tracker.ui.subtitle")}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-shedding-tracker.ui.speciesLabel")}</Label>
            <Select value={spKey} onValueChange={setSpKey}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(SHEDDING_SPECIES_DATA).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{t(`reptile-shedding-tracker.ui.shed.${k}.name`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-shedding-tracker.ui.lifeStageLabel")}</Label>
            <Select value={lifeStage} onValueChange={(v: "baby" | "juvenile" | "adult") => setLifeStage(v)}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="baby">{t("reptile-shedding-tracker.ui.optBaby")}</SelectItem>
                <SelectItem value="juvenile">{t("reptile-shedding-tracker.ui.optJuvenile")}</SelectItem>
                <SelectItem value="adult">{t("reptile-shedding-tracker.ui.optAdult")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-shedding-tracker.ui.daysSinceLabel")}</Label>
            <Input
              type="number"
              min={0}
              max={180}
              value={daysSinceLast}
              onChange={(e) => setDaysSinceLast(Math.max(0, Number(e.target.value) || 0))}
              className="h-10"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
              {t("reptile-shedding-tracker.ui.projectedTitle")}
            </span>
            <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              {daysRemaining === 0 ? t("reptile-shedding-tracker.ui.dueAnyDay", { days: cycleDays }) : t("reptile-shedding-tracker.ui.dueInDays", { days: cycleDays, remaining: daysRemaining })}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("reptile-shedding-tracker.ui.speciesPrefix")}<strong className="text-foreground">{t(`reptile-shedding-tracker.ui.shed.${spKey}.name`)}</strong> • {t("reptile-shedding-tracker.ui.patternPrefix")}<Badge variant="outline" className="ml-1 text-[11px] capitalize">{t(`reptile-shedding-tracker.ui.shedType.${sp.shedType}`)}</Badge>
            </p>
          </div>

          <Badge variant="outline" className="text-xs px-3 py-1.5 font-medium">
            {t("reptile-shedding-tracker.ui.cycleComplete", { pct: progressPct })}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>{t("reptile-shedding-tracker.ui.lastShed", { days: daysSinceLast })}</span>
            <span>{t("reptile-shedding-tracker.ui.nextShed", { days: cycleDays })}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              style={{ width: `${progressPct}%` }}
              className={`h-full transition-all duration-300 ${progressPct >= 90 ? "bg-amber-500" : "bg-indigo-500"}`}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-shedding-tracker.ui.avgIntervalLabel")}</div>
            <div className="mt-1 text-base font-bold text-foreground">{t("reptile-shedding-tracker.ui.intervalDays", { days: cycleDays })}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-shedding-tracker.ui.targetHumidityLabel")}</div>
            <div className="mt-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">{t(`reptile-shedding-tracker.ui.shed.${spKey}.humidity`)}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-shedding-tracker.ui.currentStatusLabel")}</div>
            <div className="mt-1 text-sm font-bold text-foreground">{daysRemaining === 0 ? t("reptile-shedding-tracker.ui.statusImminent") : t("reptile-shedding-tracker.ui.statusBuilding")}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-shedding-tracker.ui.feedingPolicyLabel")}</div>
            <div className="mt-1 text-xs font-bold text-amber-600 dark:text-amber-400">{t("reptile-shedding-tracker.ui.pauseIfBlue")}</div>
          </div>
        </div>

        {/* Ecdysis Phase Guide */}
        <div className="mt-5 rounded-xl border bg-card/90 p-4 space-y-2 text-xs">
          <span className="font-semibold text-foreground">{t("reptile-shedding-tracker.ui.phasesTitle")}</span>
          <div className="grid gap-2 sm:grid-cols-3 pt-1">
            <div className="rounded-lg border p-2.5 bg-muted/20">
              <strong>{t("reptile-shedding-tracker.ui.phase1Title")}</strong>
              <span className="text-muted-foreground">{t("reptile-shedding-tracker.ui.phase1Text")}</span>
            </div>
            <div className="rounded-lg border p-2.5 bg-muted/20">
              <strong>{t("reptile-shedding-tracker.ui.phase2Title")}</strong>
              <span className="text-muted-foreground">{t("reptile-shedding-tracker.ui.phase2Text")}</span>
            </div>
            <div className="rounded-lg border p-2.5 bg-muted/20">
              <strong>{t("reptile-shedding-tracker.ui.phase3Title")}</strong>
              <span className="text-muted-foreground">{t("reptile-shedding-tracker.ui.phase3Text")}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-muted-foreground">
          <strong>{t("reptile-shedding-tracker.ui.husbandryTip")}</strong>{t(`reptile-shedding-tracker.ui.shed.${spKey}.tips`)}
        </div>
      </div>
    </div>
  );
}

interface SnakeSpeciesData {
  name: string;
  scientific: string;
  habit: "terrestrial" | "semi-arboreal" | "arboreal" | "fossorial";
  bodyType: "slender" | "moderate" | "heavy" | "giant";
  adultLengthFt: { min: number; max: number; typical: number };
  humidity: { min: number; max: number; note: string };
  tempBaskingF: { min: number; max: number };
  tempWarmAmbientF: { min: number; max: number };
  tempCoolAmbientF: { min: number; max: number };
  substrate: {
    recommended: string;
    depthInches: number;
    avoid: string;
  };
  uvbZone: string;
  enclosureMaterial: string;
  minAdultGallons: number;
  notes: string;
}

const SNAKE_SPECIES: Record<string, SnakeSpeciesData> = {
  "ball-python": {
    name: "Ball Python / Royal Python",
    scientific: "Python regius",
    habit: "semi-arboreal",
    bodyType: "heavy",
    adultLengthFt: { min: 3.5, max: 5.0, typical: 4.0 },
    humidity: { min: 60, max: 80, note: "60-70% normal, 75-85% during shedding" },
    tempBaskingF: { min: 88, max: 92 },
    tempWarmAmbientF: { min: 85, max: 88 },
    tempCoolAmbientF: { min: 76, max: 80 },
    substrate: {
      recommended: "Coco husk chips, Cypress mulch, or Bioactive tropical mix",
      depthInches: 2.5,
      avoid: "Pine/Cedar shavings (toxic), dry Aspen (molds in humidity)",
    },
    uvbZone: "Ferguson Zone 1-2 (2.4% - 6% T5 UVB)",
    enclosureMaterial: "Solid PVC with front opening doors (best humidity/heat retention)",
    minAdultGallons: 120,
    notes: "Adults need at least a 4x2x2 ft (120 gal) enclosure. Climbing branches and 2 tight identical hides are mandatory.",
  },
  "corn-snake": {
    name: "Corn Snake",
    scientific: "Pantherophis guttatus",
    habit: "semi-arboreal",
    bodyType: "slender",
    adultLengthFt: { min: 4.0, max: 5.5, typical: 4.5 },
    humidity: { min: 45, max: 65, note: "Moderate humidity with a moist hide provided" },
    tempBaskingF: { min: 85, max: 88 },
    tempWarmAmbientF: { min: 82, max: 85 },
    tempCoolAmbientF: { min: 72, max: 75 },
    substrate: {
      recommended: "Aspen shavings, Coco coir, or Cypress mulch",
      depthInches: 3.0,
      avoid: "Aromatic softwoods (Pine/Cedar)",
    },
    uvbZone: "Ferguson Zone 1 (2.4% - 5% T5 UVB)",
    enclosureMaterial: "PVC or Glass Terrarium with secure locking screen top",
    minAdultGallons: 120,
    notes: "Highly active explorers and great climbers. Generous height and vertical climbing perches are highly beneficial.",
  },
  "western-hognose": {
    name: "Western Hognose Snake",
    scientific: "Heterodon nasicus",
    habit: "fossorial",
    bodyType: "moderate",
    adultLengthFt: { min: 1.5, max: 3.0, typical: 2.0 },
    humidity: { min: 30, max: 50, note: "Arid/semi-arid; provide humid hide during shedding" },
    tempBaskingF: { min: 88, max: 92 },
    tempWarmAmbientF: { min: 82, max: 85 },
    tempCoolAmbientF: { min: 72, max: 76 },
    substrate: {
      recommended: "Deep shredded Aspen (holds tunnels) or Arid Bioactive mix",
      depthInches: 4.0,
      avoid: "High-moisture soils that stay damp (causes belly rot)",
    },
    uvbZone: "Ferguson Zone 1 (2.4% - 5% T5 UVB)",
    enclosureMaterial: "Glass Terrarium or PVC",
    minAdultGallons: 40,
    notes: "Strict burrowers! Substrate depth is more critical than vertical height. Males stay around 1.5-2 ft, females reach 2.5-3 ft.",
  },
  "california-kingsnake": {
    name: "California / Mexican Kingsnake",
    scientific: "Lampropeltis californiae",
    habit: "terrestrial",
    bodyType: "slender",
    adultLengthFt: { min: 3.5, max: 5.0, typical: 4.0 },
    humidity: { min: 40, max: 60, note: "Moderate; provide humid hide" },
    tempBaskingF: { min: 86, max: 90 },
    tempWarmAmbientF: { min: 82, max: 85 },
    tempCoolAmbientF: { min: 72, max: 76 },
    substrate: {
      recommended: "Aspen shavings, Coco husk, or Cypress mulch",
      depthInches: 3.0,
      avoid: "Pine/Cedar",
    },
    uvbZone: "Ferguson Zone 1 (2.4% - 6% T5 UVB)",
    enclosureMaterial: "PVC or Glass Terrarium with heavy-duty locks",
    minAdultGallons: 75,
    notes: "Active ground hunters and notorious escape artists. Ensure zero gaps around sliding glass doors or wire ports.",
  },
  "boa-constrictor": {
    name: "Boa Constrictor / Imperator (BCI)",
    scientific: "Boa imperator / constrictor",
    habit: "semi-arboreal",
    bodyType: "heavy",
    adultLengthFt: { min: 5.5, max: 8.5, typical: 7.0 },
    humidity: { min: 65, max: 80, note: "High humidity required; 70-80% ideal" },
    tempBaskingF: { min: 88, max: 92 },
    tempWarmAmbientF: { min: 84, max: 86 },
    tempCoolAmbientF: { min: 75, max: 78 },
    substrate: {
      recommended: "Cypress mulch, Coco husk chips, or Orchid bark mix",
      depthInches: 3.0,
      avoid: "Aspen (molds), Pine/Cedar",
    },
    uvbZone: "Ferguson Zone 1-2 (5% - 6% T5 UVB)",
    enclosureMaterial: "Insulated Heavy-duty PVC or Custom Wood Vivarium",
    minAdultGallons: 240,
    notes: "Large, heavy-bodied snake. Adults require a minimum 6x2x2 ft to 8x3x3 ft custom enclosure with heavy duty branches.",
  },
  "green-tree-python": {
    name: "Green Tree Python",
    scientific: "Morelia viridis",
    habit: "arboreal",
    bodyType: "slender",
    adultLengthFt: { min: 4.0, max: 6.0, typical: 5.0 },
    humidity: { min: 65, max: 85, note: "Fluctuating humidity cycle (mist in evening, let dry daytime)" },
    tempBaskingF: { min: 86, max: 88 },
    tempWarmAmbientF: { min: 82, max: 84 },
    tempCoolAmbientF: { min: 74, max: 78 },
    substrate: {
      recommended: "Bioactive tropical blend, Sphagnum moss layer, Coco coir",
      depthInches: 2.0,
      avoid: "Dry substrates",
    },
    uvbZone: "Ferguson Zone 1-2 (2.4% - 6% T5 UVB)",
    enclosureMaterial: "PVC Vertical Arboreal Enclosure with front glass",
    minAdultGallons: 90,
    notes: "Strictly arboreal! Vertical height and multiple horizontal perches of varied diameter at different heat tiers are essential.",
  },
  "kenyan-sand-boa": {
    name: "Kenyan Sand Boa",
    scientific: "Eryx colubrinus",
    habit: "fossorial",
    bodyType: "heavy",
    adultLengthFt: { min: 1.5, max: 2.8, typical: 2.0 },
    humidity: { min: 30, max: 45, note: "Dry arid ambient; always provide a humid hide box" },
    tempBaskingF: { min: 92, max: 95 },
    tempWarmAmbientF: { min: 85, max: 88 },
    tempCoolAmbientF: { min: 74, max: 78 },
    substrate: {
      recommended: "Shredded Aspen, Sani-chips, or Arid play-sand/soil blend (50/50)",
      depthInches: 4.0,
      avoid: "Pure calcium sand (impaction risk), wet substrates",
    },
    uvbZone: "Ferguson Zone 1 (2.4% - 5% T5 UVB)",
    enclosureMaterial: "Glass Terrarium with screen top or PVC",
    minAdultGallons: 30,
    notes: "Ambush burrowers. Water bowl must be shallow and heavy ceramic so it cannot be tipped when digging.",
  },
  "milk-snake": {
    name: "Milk Snake / Pueblan / Honduran",
    scientific: "Lampropeltis triangulum",
    habit: "terrestrial",
    bodyType: "slender",
    adultLengthFt: { min: 3.0, max: 5.0, typical: 4.0 },
    humidity: { min: 40, max: 60, note: "Moderate humidity" },
    tempBaskingF: { min: 86, max: 88 },
    tempWarmAmbientF: { min: 80, max: 84 },
    tempCoolAmbientF: { min: 72, max: 76 },
    substrate: {
      recommended: "Aspen shavings, Cypress mulch, or Coco fiber",
      depthInches: 3.0,
      avoid: "Pine/Cedar",
    },
    uvbZone: "Ferguson Zone 1 (2.4% - 5% T5 UVB)",
    enclosureMaterial: "PVC or Screened Glass Vivarium",
    minAdultGallons: 50,
    notes: "Secretive and shy. Provide multiple snug hides filled with sphagnum moss across both temperature zones.",
  },
  "brazilian-rainbow-boa": {
    name: "Brazilian Rainbow Boa",
    scientific: "Epicrates cenchria",
    habit: "semi-arboreal",
    bodyType: "moderate",
    adultLengthFt: { min: 4.5, max: 6.5, typical: 5.5 },
    humidity: { min: 75, max: 95, note: "Extremely high humidity required (85-95% for juveniles, 75-85% for adults)" },
    tempBaskingF: { min: 84, max: 86 },
    tempWarmAmbientF: { min: 80, max: 82 },
    tempCoolAmbientF: { min: 74, max: 76 },
    substrate: {
      recommended: "Coco husk chunks, Sphagnum moss, Cypress mulch, Bioactive live soil",
      depthInches: 3.5,
      avoid: "Any dry substrate, screen-top glass tanks without sealed tops",
    },
    uvbZone: "Ferguson Zone 1 (2.4% - 5% T5 UVB)",
    enclosureMaterial: "High-grade sealed PVC (glass screen tops lose critical humidity too fast)",
    minAdultGallons: 120,
    notes: "Extremely sensitive to dehydration and heat over 88°F (31°C). Maintain high humidity and moderate temperatures.",
  },
  "carpet-python": {
    name: "Carpet Python (Irian Jaya / Jungle / Coastal)",
    scientific: "Morelia spilota",
    habit: "semi-arboreal",
    bodyType: "slender",
    adultLengthFt: { min: 5.0, max: 7.5, typical: 6.0 },
    humidity: { min: 50, max: 70, note: "Moderate to high humidity" },
    tempBaskingF: { min: 88, max: 92 },
    tempWarmAmbientF: { min: 82, max: 85 },
    tempCoolAmbientF: { min: 74, max: 78 },
    substrate: {
      recommended: "Coco husk chips, Cypress mulch, Butcher paper / Liners for large adults",
      depthInches: 2.5,
      avoid: "Pine/Cedar",
    },
    uvbZone: "Ferguson Zone 2 (5% - 7% T5 UVB)",
    enclosureMaterial: "Tall PVC Vivarium (4x2x3 ft or 5x2x3 ft)",
    minAdultGallons: 180,
    notes: "Active semi-arboreal python that utilizes all vertical tiers. Sturdy wall-mounted shelves and thick branches are required.",
  },
  "garter-snake": {
    name: "Common / Plains Garter Snake",
    scientific: "Thamnophis sirtalis",
    habit: "semi-arboreal",
    bodyType: "slender",
    adultLengthFt: { min: 2.0, max: 3.5, typical: 2.5 },
    humidity: { min: 45, max: 60, note: "Moderate humidity with large clean water dish for swimming" },
    tempBaskingF: { min: 86, max: 90 },
    tempWarmAmbientF: { min: 80, max: 84 },
    tempCoolAmbientF: { min: 70, max: 74 },
    substrate: {
      recommended: "Aspen shavings, Coco coir, Bioactive soil mix",
      depthInches: 2.5,
      avoid: "Pine/Cedar",
    },
    uvbZone: "Ferguson Zone 2 (5% - 6% T5 UVB - highly diurnal species!)",
    enclosureMaterial: "Glass Terrarium or PVC with front opening",
    minAdultGallons: 40,
    notes: "Diurnal (active daytime) snake with excellent vision. Loves UVB lighting and swimming. Cohabitation in groups is possible.",
  },
  "custom": {
    name: "Custom / Other Snake Species",
    scientific: "Reptilia: Serpentes",
    habit: "terrestrial",
    bodyType: "moderate",
    adultLengthFt: { min: 1.0, max: 15.0, typical: 4.0 },
    humidity: { min: 50, max: 70, note: "Adjust based on species native biome" },
    tempBaskingF: { min: 88, max: 92 },
    tempWarmAmbientF: { min: 82, max: 85 },
    tempCoolAmbientF: { min: 72, max: 76 },
    substrate: {
      recommended: "Species specific substrate (Coco husk, Cypress, or Aspen)",
      depthInches: 3.0,
      avoid: "Aromatic softwoods (Pine, Cedar)",
    },
    uvbZone: "Ferguson Zone 1-2",
    enclosureMaterial: "PVC or Terrarium suited to species size and humidity",
    minAdultGallons: 75,
    notes: "General welfare standard: Enclosure Length should equal at least 1.0x snake total length to allow full body stretching.",
  },
};

export function SnakeTankSizeCalculator() {
  const { t } = useTranslation("tools");
  const [speciesKey, setSpeciesKey] = useState<string>("ball-python");
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial");
  const [lifeStage, setLifeStage] = useState<"baby" | "juvenile" | "adult">("adult");
  const [customLengthFt, setCustomLengthFt] = useState<number>(4.0);
  const [customHabit, setCustomHabit] = useState<"terrestrial" | "semi-arboreal" | "arboreal" | "fossorial">("semi-arboreal");
  const [customBodyType, setCustomBodyType] = useState<"slender" | "moderate" | "heavy" | "giant">("heavy");

  const [checkLengthInches, setCheckLengthInches] = useState<number>(48);
  const [checkWidthInches, setCheckWidthInches] = useState<number>(24);
  const [checkHeightInches, setCheckHeightInches] = useState<number>(24);

  const [copied, setCopied] = useState(false);

  const isCustom = speciesKey === "custom";
  const species = SNAKE_SPECIES[speciesKey] || SNAKE_SPECIES["ball-python"];

  const currentLengthFt = useMemo(() => {
    if (isCustom) return customLengthFt;
    const base = species.adultLengthFt.typical;
    if (lifeStage === "baby") return Math.max(0.8, Number((base * 0.35).toFixed(1)));
    if (lifeStage === "juvenile") return Math.max(1.5, Number((base * 0.65).toFixed(1)));
    return customLengthFt > 0 ? customLengthFt : base;
  }, [isCustom, species, lifeStage, customLengthFt]);

  const handleSpeciesChange = (newKey: string) => {
    setSpeciesKey(newKey);
    const sp = SNAKE_SPECIES[newKey];
    if (sp && newKey !== "custom") {
      setCustomLengthFt(sp.adultLengthFt.typical);
      setCustomHabit(sp.habit);
      setCustomBodyType(sp.bodyType);
    }
  };

  const activeHabit = isCustom ? customHabit : species.habit;
  const activeBodyType = isCustom ? customBodyType : species.bodyType;
  const habitLabel: Record<string, string> = {
    terrestrial: t("snake-tank-size-calculator.ui.habitTerrestrial"),
    "semi-arboreal": t("snake-tank-size-calculator.ui.habitSemiArboreal"),
    arboreal: t("snake-tank-size-calculator.ui.habitArboreal"),
    fossorial: t("snake-tank-size-calculator.ui.habitFossorial"),
  };
  const bodyTypeLabel: Record<string, string> = {
    slender: t("snake-tank-size-calculator.ui.bodyTypeSlender"),
    moderate: t("snake-tank-size-calculator.ui.bodyTypeModerate"),
    heavy: t("snake-tank-size-calculator.ui.bodyTypeHeavy"),
    giant: t("snake-tank-size-calculator.ui.bodyTypeGiant"),
  };

  const dimensions = useMemo(() => {
    const lenFt = currentLengthFt;

    let minLengthIn = Math.max(20, Math.round(lenFt * 12 * 1.0));
    let minWidthIn = Math.max(12, Math.round(lenFt * 12 * 0.5));
    let minHeightIn = 12;

    if (activeHabit === "arboreal") {
      minLengthIn = Math.max(24, Math.round(lenFt * 12 * 0.75));
      minWidthIn = Math.max(18, Math.round(lenFt * 12 * 0.5));
      minHeightIn = Math.max(24, Math.round(lenFt * 12 * 0.85));
    } else if (activeHabit === "semi-arboreal") {
      minHeightIn = Math.max(18, Math.round(lenFt * 12 * 0.5));
    } else if (activeHabit === "fossorial") {
      minHeightIn = Math.max(12, Math.round(lenFt * 12 * 0.35));
    } else {
      minHeightIn = Math.max(16, Math.round(lenFt * 12 * 0.4));
    }

    if (activeBodyType === "heavy" || activeBodyType === "giant") {
      minWidthIn = Math.max(minWidthIn, 24);
      minHeightIn = Math.max(minHeightIn, 24);
    }

    const floorAreaSqFt = Number(((minLengthIn * minWidthIn) / 144).toFixed(1));
    const volumeGallons = Math.round((minLengthIn * minWidthIn * minHeightIn) / 231);
    const floorAreaSqM = Number((floorAreaSqFt * 0.092903).toFixed(2));
    const volumeLiters = Math.round(volumeGallons * 3.78541);

    const lengthCm = Math.round(minLengthIn * 2.54);
    const widthCm = Math.round(minWidthIn * 2.54);
    const heightCm = Math.round(minHeightIn * 2.54);

    let marketName = t("snake-tank-size-calculator.ui.market.customSize", { l: Math.round(minLengthIn / 12), w: Math.round(minWidthIn / 12), h: Math.round(minHeightIn / 12), gal: volumeGallons });
    if (volumeGallons <= 25) marketName = t("snake-tank-size-calculator.ui.market.size20Long");
    else if (volumeGallons <= 45) marketName = t("snake-tank-size-calculator.ui.market.size40Breeder");
    else if (volumeGallons <= 75) marketName = t("snake-tank-size-calculator.ui.market.size75Gallon");
    else if (volumeGallons <= 130) marketName = t("snake-tank-size-calculator.ui.market.size4x2x2");
    else if (volumeGallons <= 190) marketName = t("snake-tank-size-calculator.ui.market.size5x2x2");
    else if (volumeGallons <= 260) marketName = t("snake-tank-size-calculator.ui.market.size6x2x2");
    else marketName = t("snake-tank-size-calculator.ui.market.sizeCustomGiant");

    const subDepth = species.substrate.depthInches;
    const substrateLiters = Math.round((minLengthIn * 2.54 * (widthCm) * (subDepth * 2.54)) / 1000);
    const substrateQuarts = Math.round(substrateLiters * 1.05669);

    return {
      lengthIn: minLengthIn,
      widthIn: minWidthIn,
      heightIn: minHeightIn,
      lengthFt: Number((minLengthIn / 12).toFixed(1)),
      widthFt: Number((minWidthIn / 12).toFixed(1)),
      heightFt: Number((minHeightIn / 12).toFixed(1)),
      lengthCm,
      widthCm,
      heightCm,
      floorAreaSqFt,
      floorAreaSqM,
      volumeGallons,
      volumeLiters,
      marketName,
      substrateLiters,
      substrateQuarts,
      subDepth,
    };
  }, [currentLengthFt, activeHabit, activeBodyType, species, t]);

  const checkResults = useMemo(() => {
    const checkVolGal = Math.round((checkLengthInches * checkWidthInches * checkHeightInches) / 231);
    const checkFloorSqFt = Number(((checkLengthInches * checkWidthInches) / 144).toFixed(1));

    const lengthRatio = checkLengthInches / dimensions.lengthIn;
    const floorRatio = checkFloorSqFt / dimensions.floorAreaSqFt;
    const heightRatio = checkHeightInches / dimensions.heightIn;

    let score = "optimal";
    let message = t("snake-tank-size-calculator.ui.checkMessage.optimal");
    let badgeColor = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300";

    if (lengthRatio < 0.75 || floorRatio < 0.75) {
      score = "too-small";
      message = t("snake-tank-size-calculator.ui.checkMessage.too-small");
      badgeColor = "bg-destructive/15 text-destructive border-destructive/30";
    } else if (lengthRatio < 0.95 || floorRatio < 0.95 || heightRatio < 0.85) {
      score = "bare-minimum";
      message = t("snake-tank-size-calculator.ui.checkMessage.bare-minimum");
      badgeColor = "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300";
    }

    return {
      checkVolGal,
      checkFloorSqFt,
      score,
      message,
      badgeColor,
    };
  }, [checkLengthInches, checkWidthInches, checkHeightInches, dimensions, t]);

  const copySummary = () => {
    const text = t("snake-tank-size-calculator.ui.copySummary", {
      speciesName: t(`snake-tank-size-calculator.ui.snake.${speciesKey}.name`),
      lengthFt: currentLengthFt,
      lengthCm: Math.round(currentLengthFt * 30.48),
      stage: lifeStage.toUpperCase(),
      dimL: dimensions.lengthIn, dimW: dimensions.widthIn, dimH: dimensions.heightIn,
      dimCmL: dimensions.lengthCm, dimCmW: dimensions.widthCm, dimCmH: dimensions.heightCm,
      floorSqFt: dimensions.floorAreaSqFt, floorSqM: dimensions.floorAreaSqM,
      volGal: dimensions.volumeGallons, volL: dimensions.volumeLiters,
      market: dimensions.marketName,
      baskMin: species.tempBaskingF.min, baskMax: species.tempBaskingF.max,
      baskCMin: Math.round(((species.tempBaskingF.min - 32) * 5) / 9),
      baskCMax: Math.round(((species.tempBaskingF.max - 32) * 5) / 9),
      coolMin: species.tempCoolAmbientF.min, coolMax: species.tempCoolAmbientF.max,
      humMin: species.humidity.min, humMax: species.humidity.max,
      substrate: t(`snake-tank-size-calculator.ui.snake.${speciesKey}.substrateRecommended`),
      subL: dimensions.substrateLiters, subDepth: dimensions.subDepth,
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(t("snake-tank-size-calculator.ui.copiedToast"));
    setTimeout(() => setCopied(false), 2500);
  };

  const toCelsius = (f: number) => Math.round(((f - 32) * 5) / 9);

  return (
    <div className="space-y-8">
      {/* Header Controls Card */}
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs backdrop-blur-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t("snake-tank-size-calculator.ui.profileTitle")}</h2>
            <p className="text-xs text-muted-foreground">{t("snake-tank-size-calculator.ui.profileSubtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={unitSystem === "imperial" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnitSystem("imperial")}
              className="h-8 text-xs font-medium"
            >
              {t("snake-tank-size-calculator.ui.unitImperial")}
            </Button>
            <Button
              variant={unitSystem === "metric" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnitSystem("metric")}
              className="h-8 text-xs font-medium"
            >
              {t("snake-tank-size-calculator.ui.unitMetric")}
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Species Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("snake-tank-size-calculator.ui.speciesPresetLabel")}</Label>
            <Select value={speciesKey} onValueChange={handleSpeciesChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder={t("snake-tank-size-calculator.ui.selectSpeciesPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.entries(SNAKE_SPECIES).map(([k, s]) => (
                  <SelectItem key={k} value={k}>
                    <span className="font-medium">{t(`snake-tank-size-calculator.ui.snake.${k}.name`)}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Life Stage */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("snake-tank-size-calculator.ui.lifeStageLabel")}</Label>
            <Select
              value={lifeStage}
              onValueChange={(v: "baby" | "juvenile" | "adult") => {
                setLifeStage(v);
                if (speciesKey !== "custom") {
                  const base = species.adultLengthFt.typical;
                  if (v === "baby") setCustomLengthFt(Number((base * 0.35).toFixed(1)));
                  else if (v === "juvenile") setCustomLengthFt(Number((base * 0.65).toFixed(1)));
                  else setCustomLengthFt(base);
                }
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adult">{t("snake-tank-size-calculator.ui.lifeStageAdult")}</SelectItem>
                <SelectItem value="juvenile">{t("snake-tank-size-calculator.ui.lifeStageJuvenile")}</SelectItem>
                <SelectItem value="baby">{t("snake-tank-size-calculator.ui.lifeStageBaby")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Snake Length Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">
                {unitSystem === "imperial" ? t("snake-tank-size-calculator.ui.snakeLengthFeet") : t("snake-tank-size-calculator.ui.snakeLengthCm")}
              </Label>
              <span className="text-xs font-semibold text-primary">
                {unitSystem === "imperial"
                  ? t("snake-tank-size-calculator.ui.lengthValueImperial", { ft: currentLengthFt })
                  : t("snake-tank-size-calculator.ui.lengthValueMetric", { cm: Math.round(currentLengthFt * 30.48) })}
              </span>
            </div>
            {unitSystem === "imperial" ? (
              <Input
                type="number"
                min={0.5}
                max={25}
                step={0.1}
                value={customLengthFt}
                onChange={(e) => setCustomLengthFt(Math.max(0.5, Number(e.target.value) || 0.5))}
                className="h-10"
              />
            ) : (
              <Input
                type="number"
                min={15}
                max={750}
                step={5}
                value={Math.round(customLengthFt * 30.48)}
                onChange={(e) => {
                  const cm = Number(e.target.value) || 15;
                  setCustomLengthFt(Number((cm / 30.48).toFixed(1)));
                }}
                className="h-10"
              />
            )}
          </div>

          {/* Habit Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("snake-tank-size-calculator.ui.habitLabel")}</Label>
            <Select
              value={activeHabit}
              onValueChange={(v: "terrestrial" | "semi-arboreal" | "arboreal" | "fossorial") =>
                setCustomHabit(v)
              }
              disabled={!isCustom}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semi-arboreal">{t("snake-tank-size-calculator.ui.habitOptSemiArboreal")}</SelectItem>
                <SelectItem value="terrestrial">{t("snake-tank-size-calculator.ui.habitOptTerrestrial")}</SelectItem>
                <SelectItem value="arboreal">{t("snake-tank-size-calculator.ui.habitOptArboreal")}</SelectItem>
                <SelectItem value="fossorial">{t("snake-tank-size-calculator.ui.habitOptFossorial")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Species badge bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{t(`snake-tank-size-calculator.ui.snake.${speciesKey}.name`)}</span>
          <span className="italic">({species.scientific})</span>
          <span>•</span>
          <Badge variant="outline" className="capitalize">
            {habitLabel[activeHabit]}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {bodyTypeLabel[activeBodyType]}
          </Badge>
          <span>•</span>
          <span>{t("snake-tank-size-calculator.ui.typicalAdultSize", { min: species.adultLengthFt.min, max: species.adultLengthFt.max })}</span>
        </div>
      </div>

      {/* Main Results Tabs */}
      <Tabs defaultValue="enclosure" className="w-full">
        <TabsList className="grid h-12 w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="enclosure" className="text-xs sm:text-sm font-medium">
            <Box className="mr-1.5 h-4 w-4" /> {t("snake-tank-size-calculator.ui.tabEnclosure")}
          </TabsTrigger>
          <TabsTrigger value="diagram" className="text-xs sm:text-sm font-medium">
            <Maximize2 className="mr-1.5 h-4 w-4" /> {t("snake-tank-size-calculator.ui.tabDiagram")}
          </TabsTrigger>
          <TabsTrigger value="environment" className="text-xs sm:text-sm font-medium">
            <Thermometer className="mr-1.5 h-4 w-4" /> {t("snake-tank-size-calculator.ui.tabEnvironment")}
          </TabsTrigger>
          <TabsTrigger value="checker" className="text-xs sm:text-sm font-medium">
            <CheckCircle2 className="mr-1.5 h-4 w-4" /> {t("snake-tank-size-calculator.ui.tabChecker")}
          </TabsTrigger>
        </TabsList>

        {/* ─────────── TAB 1: RECOMMENDED TANK ─────────── */}
        <TabsContent value="enclosure" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Primary Hero Result Box */}
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-sm md:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                    {t("snake-tank-size-calculator.ui.minEnclosureTitle")}
                  </span>
                  <div className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {unitSystem === "imperial" ? (
                      <>
                        {t("snake-tank-size-calculator.ui.dimsImperial", { l: dimensions.lengthIn, w: dimensions.widthIn, h: dimensions.heightIn })}
                      </>
                    ) : (
                      <>
                        {t("snake-tank-size-calculator.ui.dimsMetric", { l: dimensions.lengthCm, w: dimensions.widthCm, h: dimensions.heightCm })}
                      </>
                    )}
                  </div>
                  <div className="mt-1 text-sm font-medium text-muted-foreground">
                    {t("snake-tank-size-calculator.ui.equivalentTo", { l: dimensions.lengthFt, w: dimensions.widthFt, h: dimensions.heightFt, market: dimensions.marketName })}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copySummary}
                  className="gap-1.5 text-xs font-medium shrink-0"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? t("snake-tank-size-calculator.ui.copied") : t("snake-tank-size-calculator.ui.copySpecs")}
                </Button>
              </div>

              {/* Metric badges grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border bg-card/80 p-3 text-center">
                  <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("snake-tank-size-calculator.ui.floorFootprint")}</div>
                  <div className="mt-1 text-lg font-bold text-foreground">
                    {unitSystem === "imperial" ? t("snake-tank-size-calculator.ui.floorFootprintImperial", { area: dimensions.floorAreaSqFt }) : t("snake-tank-size-calculator.ui.floorFootprintMetric", { area: dimensions.floorAreaSqM })}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{t("snake-tank-size-calculator.ui.minFloorSpace")}</div>
                </div>

                <div className="rounded-xl border bg-card/80 p-3 text-center">
                  <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("snake-tank-size-calculator.ui.tankVolume")}</div>
                  <div className="mt-1 text-lg font-bold text-foreground">
                    {unitSystem === "imperial" ? t("snake-tank-size-calculator.ui.tankVolumeImperial", { vol: dimensions.volumeGallons }) : t("snake-tank-size-calculator.ui.tankVolumeMetric", { vol: dimensions.volumeLiters })}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{t("snake-tank-size-calculator.ui.internalAirCapacity")}</div>
                </div>

                <div className="rounded-xl border bg-card/80 p-3 text-center">
                  <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("snake-tank-size-calculator.ui.snakeRatio")}</div>
                  <div className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">{t("snake-tank-size-calculator.ui.stretch100")}</div>
                  <div className="text-[10px] text-muted-foreground">{t("snake-tank-size-calculator.ui.stretchRule")}</div>
                </div>

                <div className="rounded-xl border bg-card/80 p-3 text-center">
                  <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("snake-tank-size-calculator.ui.substrateNeeded")}</div>
                  <div className="mt-1 text-lg font-bold text-foreground">
                    {unitSystem === "imperial" ? t("snake-tank-size-calculator.ui.substrateImperial", { vol: dimensions.substrateQuarts }) : t("snake-tank-size-calculator.ui.substrateMetric", { vol: dimensions.substrateLiters })}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{t("snake-tank-size-calculator.ui.substrateForDepth", { depth: dimensions.subDepth })}</div>
                </div>
              </div>

              {/* Welfare explanation */}
              <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  {t("snake-tank-size-calculator.ui.welfareRuleTitle")}
                </div>
                <p className="mt-1 leading-relaxed">
                  {t("snake-tank-size-calculator.ui.welfareRuleBody")}
                </p>
              </div>
            </div>

            {/* Quick Material & Checklist Card */}
            <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{t("snake-tank-size-calculator.ui.constructionTitle")}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t("snake-tank-size-calculator.ui.materialFor", { species: t(`snake-tank-size-calculator.ui.snake.${speciesKey}.name`) })}</p>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="rounded-xl border p-3 bg-muted/20">
                    <div className="font-medium text-foreground">{t("snake-tank-size-calculator.ui.bestMaterialLabel")}</div>
                    <div className="mt-1 text-muted-foreground leading-relaxed">{t(`snake-tank-size-calculator.ui.snake.${speciesKey}.enclosureMaterial`)}</div>
                  </div>

                  <div className="rounded-xl border p-3 bg-muted/20">
                    <div className="font-medium text-foreground">{t("snake-tank-size-calculator.ui.doorStyleLabel")}</div>
                    <div className="mt-1 text-muted-foreground leading-relaxed">
                      {t("snake-tank-size-calculator.ui.doorStyleBody")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t text-[11px] text-muted-foreground flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{t("snake-tank-size-calculator.ui.escapeWarning")}</span>
              </div>
            </div>
          </div>

          {/* Life-Stage Growth Transition Timeline */}
          <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground">{t("snake-tank-size-calculator.ui.growthTitle", { species: t(`snake-tank-size-calculator.ui.snake.${speciesKey}.name`) })}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{t("snake-tank-size-calculator.ui.growthSubtitle")}</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className={`rounded-xl border p-4 transition-all ${lifeStage === "baby" ? "ring-2 ring-primary bg-primary/5" : "bg-card"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{t("snake-tank-size-calculator.ui.stageBaby")}</span>
                  <Badge variant="outline">{t("snake-tank-size-calculator.ui.stageBabyAge")}</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {t("snake-tank-size-calculator.ui.typicalLength", { ft: (species.adultLengthFt.typical * 0.35).toFixed(1), cm: Math.round(species.adultLengthFt.typical * 0.35 * 30.48) })}
                </div>
                <div className="mt-3 text-xs font-medium text-foreground">
                  {t("snake-tank-size-calculator.ui.babyTank")}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("snake-tank-size-calculator.ui.babyNote")}
                </p>
              </div>

              <div className={`rounded-xl border p-4 transition-all ${lifeStage === "juvenile" ? "ring-2 ring-primary bg-primary/5" : "bg-card"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{t("snake-tank-size-calculator.ui.stageJuvenile")}</span>
                  <Badge variant="outline">{t("snake-tank-size-calculator.ui.stageJuvenileAge")}</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {t("snake-tank-size-calculator.ui.typicalLength", { ft: (species.adultLengthFt.typical * 0.65).toFixed(1), cm: Math.round(species.adultLengthFt.typical * 0.65 * 30.48) })}
                </div>
                <div className="mt-3 text-xs font-medium text-foreground">
                  {t("snake-tank-size-calculator.ui.juvenileTank")}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("snake-tank-size-calculator.ui.juvenileNote")}
                </p>
              </div>

              <div className={`rounded-xl border p-4 transition-all ${lifeStage === "adult" ? "ring-2 ring-primary bg-primary/5" : "bg-card"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{t("snake-tank-size-calculator.ui.stageAdult")}</span>
                  <Badge variant="outline">{t("snake-tank-size-calculator.ui.stageAdultAge")}</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {t("snake-tank-size-calculator.ui.typicalLength", { ft: species.adultLengthFt.typical, cm: Math.round(species.adultLengthFt.typical * 30.48) })}
                </div>
                <div className="mt-3 text-xs font-medium text-foreground">
                  {t("snake-tank-size-calculator.ui.permanentVivarium", { market: dimensions.marketName })}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t("snake-tank-size-calculator.ui.adultNote")}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ─────────── TAB 2: VISUAL ENCLOSURE DIAGRAM ─────────── */}
        <TabsContent value="diagram" className="mt-6 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">{t("snake-tank-size-calculator.ui.diagramTitle")}</h3>
                <p className="text-xs text-muted-foreground">{t("snake-tank-size-calculator.ui.diagramSubtitle")}</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-rose-500 inline-block"></span> {t("snake-tank-size-calculator.ui.legendWarm")}</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-amber-500 inline-block"></span> {t("snake-tank-size-calculator.ui.legendAmbient")}</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-cyan-500 inline-block"></span> {t("snake-tank-size-calculator.ui.legendCool")}</span>
              </div>
            </div>

            {/* Rendered Vivarium Enclosure Box */}
            <div className="mt-6 overflow-hidden rounded-2xl border-4 border-muted/80 bg-neutral-950 p-4 text-white shadow-inner">
              <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>{t("snake-tank-size-calculator.ui.frontView", { l: dimensions.lengthIn, h: dimensions.heightIn })}</span>
                <span>{t("snake-tank-size-calculator.ui.depthLabel", { w: dimensions.widthIn, wc: dimensions.widthCm })}</span>
              </div>

              <div className="relative min-h-[260px] rounded-xl border border-neutral-800 bg-gradient-to-r from-rose-950/60 via-amber-950/30 to-cyan-950/60 p-4 flex flex-col justify-between">
                {/* Top Lighting & Overhead Heating row */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 rounded-lg bg-rose-900/60 px-3 py-1.5 text-xs font-medium text-rose-200 border border-rose-700/50">
                    <Sun className="h-4 w-4 text-amber-400 animate-pulse" />
                    <span>{unitSystem === "imperial" ? t("snake-tank-size-calculator.ui.halogenImperial", { min: species.tempBaskingF.min, max: species.tempBaskingF.max }) : t("snake-tank-size-calculator.ui.halogenMetric", { min: toCelsius(species.tempBaskingF.min), max: toCelsius(species.tempBaskingF.max) })}</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-neutral-900/80 px-3 py-1.5 text-xs text-neutral-300 border border-neutral-700">
                    <span>{t("snake-tank-size-calculator.ui.uvbTube", { zone: t(`snake-tank-size-calculator.ui.snake.${speciesKey}.uvbZone`) })}</span>
                  </div>

                  <div className="rounded-lg bg-cyan-900/60 px-3 py-1.5 text-xs font-medium text-cyan-200 border border-cyan-700/50">
                    <span>{unitSystem === "imperial" ? t("snake-tank-size-calculator.ui.coolAmbientImperial", { min: species.tempCoolAmbientF.min, max: species.tempCoolAmbientF.max }) : t("snake-tank-size-calculator.ui.coolAmbientMetric", { min: toCelsius(species.tempCoolAmbientF.min), max: toCelsius(species.tempCoolAmbientF.max) })}</span>
                  </div>
                </div>

                {/* Mid Zone (Climbing, Branches & Foliage) */}
                <div className="my-6 grid grid-cols-3 items-center gap-4 text-center">
                  <div className="rounded-xl border border-dashed border-rose-500/30 bg-rose-950/20 p-3">
                    <div className="text-xs font-semibold text-rose-300">{t("snake-tank-size-calculator.ui.baskingSurface")}</div>
                    <p className="mt-1 text-[10px] text-neutral-400">{t("snake-tank-size-calculator.ui.baskingSurfaceNote")}</p>
                  </div>

                  <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/40 p-3">
                    <div className="text-xs font-semibold text-amber-300">{t("snake-tank-size-calculator.ui.climbingPerches")}</div>
                    <p className="mt-1 text-[10px] text-neutral-400">{t("snake-tank-size-calculator.ui.climbingPerchesNote")}</p>
                  </div>

                  <div className="rounded-xl border border-dashed border-cyan-500/30 bg-cyan-950/20 p-3">
                    <div className="text-xs font-semibold text-cyan-300">{t("snake-tank-size-calculator.ui.waterDish")}</div>
                    <p className="mt-1 text-[10px] text-neutral-400">{t("snake-tank-size-calculator.ui.waterDishNote")}</p>
                  </div>
                </div>

                {/* Bottom Substrate & Dual Hide Row */}
                <div className="rounded-xl border border-amber-900/40 bg-amber-950/40 p-3">
                  <div className="flex items-center justify-between text-xs text-amber-200 mb-2">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" /> {t("snake-tank-size-calculator.ui.substrateLayer", { depth: dimensions.subDepth, cm: Math.round(dimensions.subDepth * 2.54) })}
                    </span>
                    <span className="text-[11px] text-neutral-400">{t("snake-tank-size-calculator.ui.humidityRange", { min: species.humidity.min, max: species.humidity.max })}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg bg-neutral-900/90 border border-neutral-700 p-2 text-center">
                      <div className="font-medium text-rose-300">{t("snake-tank-size-calculator.ui.warmHide")}</div>
                      <div className="text-[10px] text-neutral-400">{t("snake-tank-size-calculator.ui.warmHideNote")}</div>
                    </div>

                    <div className="rounded-lg bg-neutral-900/90 border border-neutral-700 p-2 text-center">
                      <div className="font-medium text-cyan-300">{t("snake-tank-size-calculator.ui.coolHide")}</div>
                      <div className="text-[10px] text-neutral-400">{t("snake-tank-size-calculator.ui.coolHideNote")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Essential rules below diagram */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs text-muted-foreground">
              <div className="rounded-xl border p-3 bg-muted/20">
                <span className="font-semibold text-foreground">{t("snake-tank-size-calculator.ui.rule1Title")}</span> {t("snake-tank-size-calculator.ui.rule1Body")}
              </div>
              <div className="rounded-xl border p-3 bg-muted/20">
                <span className="font-semibold text-foreground">{t("snake-tank-size-calculator.ui.rule2Title")}</span> {t("snake-tank-size-calculator.ui.rule2Body")}
              </div>
              <div className="rounded-xl border p-3 bg-muted/20">
                <span className="font-semibold text-foreground">{t("snake-tank-size-calculator.ui.rule3Title")}</span> {t("snake-tank-size-calculator.ui.rule3Body")}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ─────────── TAB 3: HUSBANDRY & ENVIRONMENT ─────────── */}
        <TabsContent value="environment" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Thermal Gradient Specs */}
            <div className="rounded-2xl border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-3">
                <Thermometer className="h-4 w-4" />
                <span>{t("snake-tank-size-calculator.ui.thermalTitle")}</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between rounded-xl border p-3 bg-muted/20">
                  <div>
                    <div className="font-medium text-foreground">{t("snake-tank-size-calculator.ui.baskingTempLabel")}</div>
                    <div className="text-muted-foreground">{t("snake-tank-size-calculator.ui.baskingTempNote")}</div>
                  </div>
                  <div className="text-right font-bold text-rose-600 dark:text-rose-400 text-sm">
                    {unitSystem === "imperial" ? (
                      <>{t("snake-tank-size-calculator.ui.tempImperial", { min: species.tempBaskingF.min, max: species.tempBaskingF.max })}</>
                    ) : (
                      <>{t("snake-tank-size-calculator.ui.tempMetric", { min: toCelsius(species.tempBaskingF.min), max: toCelsius(species.tempBaskingF.max) })}</>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border p-3 bg-muted/20">
                  <div>
                    <div className="font-medium text-foreground">{t("snake-tank-size-calculator.ui.warmAmbientLabel")}</div>
                    <div className="text-muted-foreground">{t("snake-tank-size-calculator.ui.warmAmbientNote")}</div>
                  </div>
                  <div className="text-right font-bold text-amber-600 dark:text-amber-400 text-sm">
                    {unitSystem === "imperial" ? (
                      <>{t("snake-tank-size-calculator.ui.tempImperial", { min: species.tempWarmAmbientF.min, max: species.tempWarmAmbientF.max })}</>
                    ) : (
                      <>{t("snake-tank-size-calculator.ui.tempMetric", { min: toCelsius(species.tempWarmAmbientF.min), max: toCelsius(species.tempWarmAmbientF.max) })}</>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border p-3 bg-muted/20">
                  <div>
                    <div className="font-medium text-foreground">{t("snake-tank-size-calculator.ui.coolAmbientLabel")}</div>
                    <div className="text-muted-foreground">{t("snake-tank-size-calculator.ui.coolAmbientNote")}</div>
                  </div>
                  <div className="text-right font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                    {unitSystem === "imperial" ? (
                      <>{t("snake-tank-size-calculator.ui.tempImperial", { min: species.tempCoolAmbientF.min, max: species.tempCoolAmbientF.max })}</>
                    ) : (
                      <>{t("snake-tank-size-calculator.ui.tempMetric", { min: toCelsius(species.tempCoolAmbientF.min), max: toCelsius(species.tempCoolAmbientF.max) })}</>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Humidity & Substrate Specs */}
            <div className="rounded-2xl border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-3">
                <Droplets className="h-4 w-4" />
                <span>{t("snake-tank-size-calculator.ui.humidityTitle")}</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="rounded-xl border p-3 bg-muted/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{t("snake-tank-size-calculator.ui.targetHumidityLabel")}</span>
                    <span className="font-bold text-primary text-sm">{t("snake-tank-size-calculator.ui.relHumidity", { min: species.humidity.min, max: species.humidity.max })}</span>
                  </div>
                  <p className="text-muted-foreground">{t(`snake-tank-size-calculator.ui.snake.${speciesKey}.humidityNote`)}</p>
                </div>

                <div className="rounded-xl border p-3 bg-muted/20">
                  <div className="font-medium text-foreground mb-1">{t("snake-tank-size-calculator.ui.substrateTypeLabel")}</div>
                  <p className="text-muted-foreground">{t(`snake-tank-size-calculator.ui.snake.${speciesKey}.substrateRecommended`)}</p>
                  <div className="mt-2 text-destructive font-medium text-[11px]">
                    {t("snake-tank-size-calculator.ui.avoidSubstrate", { avoid: t(`snake-tank-size-calculator.ui.snake.${speciesKey}.substrateAvoid`) })}
                  </div>
                </div>

                <div className="rounded-xl border p-3 bg-muted/20 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">{t("snake-tank-size-calculator.ui.substrateVolumeLabel")}</div>
                    <div className="text-muted-foreground">{t("snake-tank-size-calculator.ui.substrateVolumeFor", { depth: dimensions.subDepth, cm: Math.round(dimensions.subDepth * 2.54) })}</div>
                  </div>
                  <div className="text-right font-bold text-foreground text-sm">
                    {t("snake-tank-size-calculator.ui.substrateVolume", { l: dimensions.substrateLiters, q: dimensions.substrateQuarts })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ─────────── TAB 4: TANK SIZE CHECKER ─────────── */}
        <TabsContent value="checker" className="mt-6 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-xs">
            <h3 className="text-base font-semibold text-foreground">{t("snake-tank-size-calculator.ui.checkerTitle")}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("snake-tank-size-calculator.ui.checkerSubtitle")}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">{unitSystem === "imperial" ? t("snake-tank-size-calculator.ui.checkerLengthImperial") : t("snake-tank-size-calculator.ui.checkerLengthMetric")}</Label>
                <Input
                  type="number"
                  min={10}
                  max={200}
                  value={unitSystem === "imperial" ? checkLengthInches : Math.round(checkLengthInches * 2.54)}
                  onChange={(e) => {
                    const v = Number(e.target.value) || 10;
                    setCheckLengthInches(unitSystem === "imperial" ? v : Math.round(v / 2.54));
                  }}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">{unitSystem === "imperial" ? t("snake-tank-size-calculator.ui.checkerWidthImperial") : t("snake-tank-size-calculator.ui.checkerWidthMetric")}</Label>
                <Input
                  type="number"
                  min={10}
                  max={100}
                  value={unitSystem === "imperial" ? checkWidthInches : Math.round(checkWidthInches * 2.54)}
                  onChange={(e) => {
                    const v = Number(e.target.value) || 10;
                    setCheckWidthInches(unitSystem === "imperial" ? v : Math.round(v / 2.54));
                  }}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">{unitSystem === "imperial" ? t("snake-tank-size-calculator.ui.checkerHeightImperial") : t("snake-tank-size-calculator.ui.checkerHeightMetric")}</Label>
                <Input
                  type="number"
                  min={8}
                  max={100}
                  value={unitSystem === "imperial" ? checkHeightInches : Math.round(checkHeightInches * 2.54)}
                  onChange={(e) => {
                    const v = Number(e.target.value) || 8;
                    setCheckHeightInches(unitSystem === "imperial" ? v : Math.round(v / 2.54));
                  }}
                  className="h-10"
                />
              </div>
            </div>

            {/* Evaluation Score Card */}
            <div className={`mt-6 rounded-2xl border p-5 ${checkResults.badgeColor}`}>
              <div className="flex items-center gap-2">
                {checkResults.score === "optimal" && <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                {checkResults.score === "bare-minimum" && <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                {checkResults.score === "too-small" && <XCircle className="h-5 w-5 text-destructive" />}

                <span className="font-bold text-base uppercase tracking-wide">
                  {t(`snake-tank-size-calculator.ui.checkTitle.${checkResults.score}`)}
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed opacity-90">{checkResults.message}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-medium pt-3 border-t border-current/20">
                <div>
                  <span className="opacity-75">{t("snake-tank-size-calculator.ui.yourVolume")}</span>
                  <div className="text-sm font-bold">{t("snake-tank-size-calculator.ui.yourVolumeValue", { gal: checkResults.checkVolGal })}</div>
                </div>
                <div>
                  <span className="opacity-75">{t("snake-tank-size-calculator.ui.yourFloorArea")}</span>
                  <div className="text-sm font-bold">{t("snake-tank-size-calculator.ui.floorAreaValue", { area: checkResults.checkFloorSqFt })}</div>
                </div>
                <div>
                  <span className="opacity-75">{t("snake-tank-size-calculator.ui.targetFloorArea")}</span>
                  <div className="text-sm font-bold">{t("snake-tank-size-calculator.ui.floorAreaValue", { area: dimensions.floorAreaSqFt })}</div>
                </div>
                <div>
                  <span className="opacity-75">{t("snake-tank-size-calculator.ui.targetMinLength")}</span>
                  <div className="text-sm font-bold">{t("snake-tank-size-calculator.ui.targetMinLengthValue", { inches: dimensions.lengthIn, cm: dimensions.lengthCm })}</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─────────── HORSES ─────────── */
export function HorseSupplementCost() {
  const { t } = useTranslation("tools");
  const [suppType, setSuppType] = useState<"joint" | "hoof" | "digestive" | "calming" | "electrolyte" | "custom">("joint");
  const [dailyCost, setDailyCost] = useState(2.50);
  const [horseCount, setHorseCount] = useState(1);
  const [purchaseFormat, setPurchaseFormat] = useState<"small" | "bulk">("small");

  const defaultCosts: Record<string, number> = {
    joint: 3.25, // Glucosamine, chondroitin, MSM, HA
    hoof: 1.85, // Biotin, zinc, methionine
    digestive: 2.75, // Prebiotics, yeast culture, gastric buffer
    calming: 2.10, // Magnesium, L-tryptophan, B-vitamins
    electrolyte: 0.95, // Sodium, potassium, chloride
    custom: 2.50,
  };

  const handleTypeChange = (t: typeof suppType) => {
    setSuppType(t);
    setDailyCost(defaultCosts[t]);
  };

  const adjustedDailyCost = purchaseFormat === "bulk" ? dailyCost * 0.72 : dailyCost; // 28% bulk savings
  const monthlyTotal = Math.round(adjustedDailyCost * 30 * horseCount);
  const yearlyTotal = Math.round(adjustedDailyCost * 365 * horseCount);
  const annualSavings = Math.round((dailyCost * 365 * horseCount) - yearlyTotal);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t("horse-supplement-cost.ui.suppCategoryLabel")}</Label>
            <Select value={suppType} onValueChange={(v) => handleTypeChange(v as typeof suppType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="joint">{t("horse-supplement-cost.ui.suppJoint")}</SelectItem>
                <SelectItem value="hoof">{t("horse-supplement-cost.ui.suppHoof")}</SelectItem>
                <SelectItem value="digestive">{t("horse-supplement-cost.ui.suppDigestive")}</SelectItem>
                <SelectItem value="calming">{t("horse-supplement-cost.ui.suppCalming")}</SelectItem>
                <SelectItem value="electrolyte">{t("horse-supplement-cost.ui.suppElectrolyte")}</SelectItem>
                <SelectItem value="custom">{t("horse-supplement-cost.ui.suppCustom")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("horse-supplement-cost.ui.retailCostLabel")}</Label>
            <Input type="number" min={0.25} max={25} step={0.05} value={dailyCost} onChange={(e) => setDailyCost(+e.target.value || 0)} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("horse-supplement-cost.ui.horseCountLabel")}</Label>
            <Input type="number" min={1} max={20} value={horseCount} onChange={(e) => setHorseCount(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("horse-supplement-cost.ui.packagingLabel")}</Label>
            <Select value={purchaseFormat} onValueChange={(v) => setPurchaseFormat(v as typeof purchaseFormat)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{t("horse-supplement-cost.ui.packSmall")}</SelectItem>
                <SelectItem value="bulk">{t("horse-supplement-cost.ui.packBulk")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`$${monthlyTotal}`} label={horseCount > 1 ? t("horse-supplement-cost.ui.monthlySpendPlural", { count: horseCount }) : t("horse-supplement-cost.ui.monthlySpendSingle")} unit={t("horse-supplement-cost.ui.yearlyUnit", { total: yearlyTotal })} />
          <Rows items={[
            { label: t("horse-supplement-cost.ui.costPerDayLabel"), value: t("horse-supplement-cost.ui.costPerDayValue", { cost: adjustedDailyCost.toFixed(2) }) },
            { label: t("horse-supplement-cost.ui.annualSpendLabel"), value: t("horse-supplement-cost.ui.annualSpendValue", { total: yearlyTotal.toLocaleString() }) },
            { label: t("horse-supplement-cost.ui.bulkSavingsLabel"), value: purchaseFormat === "bulk" ? t("horse-supplement-cost.ui.bulkSavingsValue", { savings: annualSavings.toLocaleString() }) : t("horse-supplement-cost.ui.bulkSavingsTip") },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>{t("horse-supplement-cost.ui.nutritionTitle")}</strong> {t("horse-supplement-cost.ui.nutritionBody")}</p>
          </div>
        </div>
      }
    />
  );
}

/* ─────────── FARM ─────────── */
export function ChickenNestingBoxCount() {
  const { t } = useTranslation("tools");
  const [hens, setHens] = useState(8);
  const [breedType, setBreedType] = useState<"standard" | "heavy" | "bantam">("standard");
  const [boxStyle, setBoxStyle] = useState<"traditional" | "rollaway">("traditional");

  const ratio = boxStyle === "rollaway" ? 5 : 4; // 1 box per 4-5 hens
  const boxCount = Math.max(1, Math.ceil(hens / ratio));
  const dimensions = breedType === "heavy" ? "14\" W × 14\" D × 14\" H" : breedType === "bantam" ? "10\" W × 10\" D × 10\" H" : "12\" W × 12\" D × 12\" H";

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t("chicken-nesting-box-count.ui.henCountLabel")}</Label>
            <Input type="number" min={1} max={500} value={hens} onChange={(e) => setHens(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("chicken-nesting-box-count.ui.breedSizeLabel")}</Label>
            <Select value={breedType} onValueChange={(v) => setBreedType(v as typeof breedType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">{t("chicken-nesting-box-count.ui.breedStandard")}</SelectItem>
                <SelectItem value="heavy">{t("chicken-nesting-box-count.ui.breedHeavy")}</SelectItem>
                <SelectItem value="bantam">{t("chicken-nesting-box-count.ui.breedBantam")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("chicken-nesting-box-count.ui.boxStyleLabel")}</Label>
            <Select value={boxStyle} onValueChange={(v) => setBoxStyle(v as typeof boxStyle)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="traditional">{t("chicken-nesting-box-count.ui.boxTraditional")}</SelectItem>
                <SelectItem value="rollaway">{t("chicken-nesting-box-count.ui.boxRollaway")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("chicken-nesting-box-count.ui.boxCountValue", { count: boxCount })} label={t("chicken-nesting-box-count.ui.capacityLabel")} unit={t("chicken-nesting-box-count.ui.ratioUnit", { ratio })} />
          <Rows items={[
            { label: t("chicken-nesting-box-count.ui.dimsLabel"), value: dimensions },
            { label: t("chicken-nesting-box-count.ui.heightLabel"), value: t("chicken-nesting-box-count.ui.heightValue") },
            { label: t("chicken-nesting-box-count.ui.beddingLabel"), value: boxStyle === "traditional" ? t("chicken-nesting-box-count.ui.beddingTraditional") : t("chicken-nesting-box-count.ui.beddingRollaway") },
            { label: t("chicken-nesting-box-count.ui.decoyLabel"), value: t("chicken-nesting-box-count.ui.decoyValue") },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>{t("chicken-nesting-box-count.ui.eggRuleTitle")}</strong> {t("chicken-nesting-box-count.ui.eggRuleBody")}</p>
          </div>
        </div>
      }
    />
  );
}

/* ─────────── GENERAL ─────────── */
export function PetVetVisitCostEstimator() {
  const { t } = useTranslation("tools");
  const [type, setType] = useState("wellness");
  const cost: Record<string, number> = { wellness: 75, vaccinations: 120, sick: 200, dental: 500, emergency: 1500 };
  return (
    <CalculatorLayout
      form={<SelectField label={t("pet-vet-visit-cost-estimator.ui.visitTypeLabel")} value={type} onChange={setType} options={Object.keys(cost)} optionLabels={[t("pet-vet-visit-cost-estimator.ui.visitWellness"), t("pet-vet-visit-cost-estimator.ui.visitVaccinations"), t("pet-vet-visit-cost-estimator.ui.visitSick"), t("pet-vet-visit-cost-estimator.ui.visitDental"), t("pet-vet-visit-cost-estimator.ui.visitEmergency")]} />}
      result={<div className="space-y-4">
        <Big value={`$${cost[type]}`} label={t("pet-vet-visit-cost-estimator.ui.costLabel")} />
        <Note>{t("pet-vet-visit-cost-estimator.ui.pricingNote")}</Note>
      </div>}
    />
  );
}

export function PetGroomingCostEstimator() {
  const { t } = useTranslation("tools");
  const [type, setType] = useState("full-groom");
  const [monthly, setMonthly] = useState(1);
  const cost: Record<string, number> = { bath: 35, "full-groom": 75, "de-shed": 90, "nail-trim": 15 };
  const yearly = cost[type] * monthly * 12;
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <SelectField label={t("pet-grooming-cost-estimator.ui.serviceLabel")} value={type} onChange={setType} options={Object.keys(cost)} optionLabels={[t("pet-grooming-cost-estimator.ui.serviceBath"), t("pet-grooming-cost-estimator.ui.serviceFullGroom"), t("pet-grooming-cost-estimator.ui.serviceDeShed"), t("pet-grooming-cost-estimator.ui.serviceNailTrim")]} />
        <NumberField label={t("pet-grooming-cost-estimator.ui.visitsLabel")} value={monthly} onChange={setMonthly} min={1} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`$${yearly}`} label={t("pet-grooming-cost-estimator.ui.annualCostLabel")} />
        <Note>{t("pet-grooming-cost-estimator.ui.diyNote")}</Note>
      </div>}
    />
  );
}
