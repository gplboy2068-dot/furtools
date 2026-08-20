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
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o.replace(/-/g, " ")}</SelectItem>)}</SelectContent>
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
  const [kg, setKg] = useState(20);
  const [fitness, setFitness] = useState("average");
  const base: Record<string, number> = { beginner: 5, average: 10, athletic: 20 };
  const minutes = Math.round(base[fitness] * Math.min(1.4, Math.max(0.6, kg / 20)));
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Weight (kg)" value={kg} onChange={setKg} step={0.5} />
        <SelectField label="Swim fitness" value={fitness} onChange={setFitness} options={Object.keys(base)} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${minutes} min`} label="Safe first swim session" />
        <Note>Build up gradually. Rinse coat after chlorine or salt water.</Note>
      </div>}
    />
  );
}

export function DogCarTravelPlanner() {
  const [hours, setHours] = useState(6);
  const breaks = Math.max(1, Math.floor(hours / 2));
  const water = Math.round(hours * 100);
  return (
    <CalculatorLayout
      form={<NumberField label="Trip length (hours)" value={hours} onChange={setHours} min={1} />}
      result={<div className="space-y-4">
        <Big value={breaks} label="Potty / stretch breaks" />
        <Note>Bring ≈ {water} ml of water, a familiar blanket, and never leave your dog alone in the car.</Note>
      </div>}
    />
  );
}

export function DogParkVisitTracker() {
  const [minutes, setMinutes] = useState(45);
  const [visits, setVisits] = useState(3);
  const weekly = minutes * visits;
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Minutes per visit" value={minutes} onChange={setMinutes} min={10} />
        <NumberField label="Visits per week" value={visits} onChange={setVisits} min={1} />
      </div>}
      result={<Big value={`${weekly} min / wk`} label="Total off-leash time" />}
    />
  );
}

export function DogCrateTrainingSchedule() {
  const [weeks, setWeeks] = useState(8);
  const maxHours = Math.min(6, Math.max(1, Math.floor(weeks / 4) + 1));
  return (
    <CalculatorLayout
      form={<NumberField label="Puppy age (weeks)" value={weeks} onChange={setWeeks} min={8} />}
      result={<div className="space-y-4">
        <Big value={`${maxHours} hr`} label="Max time in crate" />
        <Note>Rule of thumb: age-in-months + 1 = max hours. Never exceed 6 hours for adults.</Note>
      </div>}
    />
  );
}

/* ─────────── CATS ─────────── */
export function CatWindowPerchGuide() {
  const [cats, setCats] = useState(1);
  const perches = cats + 1;
  return (
    <CalculatorLayout
      form={<NumberField label="Number of cats" value={cats} onChange={setCats} min={1} />}
      result={<div className="space-y-4">
        <Big value={perches} label="Recommended perches" />
        <Note>One perch per cat plus a spare avoids resource guarding. Choose sunny east or south windows.</Note>
      </div>}
    />
  );
}

export function CatWeightLossPlanner() {
  const [current, setCurrent] = useState(6);
  const [target, setTarget] = useState(5);
  const weeks = Math.max(1, Math.round((current - target) / 0.05));
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Current weight (kg)" value={current} onChange={setCurrent} step={0.1} />
        <NumberField label="Target weight (kg)" value={target} onChange={setTarget} step={0.1} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${weeks} weeks`} label="Safe timeline" />
        <Note>Cats should lose no more than 0.5–1% body weight per week — rapid loss risks fatty liver.</Note>
      </div>}
    />
  );
}

export function CatAgeAdjustedFeeding() {
  const [age, setAge] = useState(3);
  const [kg, setKg] = useState(4);
  const factor = age < 1 ? 2.5 : age > 10 ? 0.9 : 1.0;
  const kcal = Math.round(70 * Math.pow(kg, 0.75) * factor);
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Age (years)" value={age} onChange={setAge} step={0.5} />
        <NumberField label="Weight (kg)" value={kg} onChange={setKg} step={0.1} />
      </div>}
      result={<Big value={`${kcal} kcal`} label="Daily calorie target" />}
    />
  );
}

/* ─────────── BIRDS ─────────── */
export function BirdMoltingTracker() {
  const [start, setStart] = useState("2026-07-01");
  const startDate = new Date(start);
  const end = new Date(startDate);
  end.setDate(end.getDate() + 56);
  return (
    <CalculatorLayout
      form={<div>
        <Label>Molt start date</Label>
        <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1.5" />
      </div>}
      result={<div className="space-y-4">
        <Big value={end.toLocaleDateString()} label="Estimated end (≈ 8 weeks)" />
        <Note>Boost protein and full-spectrum lighting. Avoid handling new pin feathers.</Note>
      </div>}
    />
  );
}

export function BirdSleepSchedule() {
  const [species, setSpecies] = useState("parrot");
  const hours: Record<string, number> = { parrot: 12, cockatiel: 11, budgie: 10, finch: 10, cockatoo: 12 };
  return (
    <CalculatorLayout
      form={<SelectField label="Species" value={species} onChange={setSpecies} options={Object.keys(hours)} />}
      result={<div className="space-y-4">
        <Big value={`${hours[species]} hr`} label="Uninterrupted sleep needed" />
        <Note>Cover the cage and keep a quiet, dark room. Sleep deprivation causes feather plucking.</Note>
      </div>}
    />
  );
}

/* ─────────── FISH ─────────── */
export function AquariumNitrateCalculator() {
  const [gallons, setGallons] = useState(30);
  const [ppm, setPpm] = useState(40);
  const targetPpm = 20;
  const changePct = Math.min(50, Math.round(((ppm - targetPpm) / ppm) * 100));
  const gallonsOut = Math.round((gallons * changePct) / 100);
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Tank volume (gal)" value={gallons} onChange={setGallons} min={1} />
        <NumberField label="Current nitrate (ppm)" value={ppm} onChange={setPpm} min={0} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${changePct}%`} label="Water change needed" />
        <Note>Change ≈ {gallonsOut} gal using dechlorinated, temperature-matched water.</Note>
      </div>}
    />
  );
}

export function FishMedicationDose() {
  const [gallons, setGallons] = useState(20);
  const [mgPerGal, setMgPerGal] = useState(10);
  const totalMg = gallons * mgPerGal;
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Tank volume (gal)" value={gallons} onChange={setGallons} min={1} />
        <NumberField label="Medication dose (mg / gal)" value={mgPerGal} onChange={setMgPerGal} step={0.5} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${totalMg} mg`} label="Total dose per treatment" />
        <Note>Always remove activated carbon and follow the medication's exact protocol.</Note>
      </div>}
    />
  );
}

/* ─────────── SMALL PETS ─────────── */
export function RabbitPelletCalculator() {
  const [kg, setKg] = useState(2);
  const grams = Math.round(kg * 25);
  return (
    <CalculatorLayout
      form={<NumberField label="Rabbit weight (kg)" value={kg} onChange={setKg} step={0.1} />}
      result={<div className="space-y-4">
        <Big value={`${grams} g`} label="Daily pellets" />
        <Note>Pellets are a supplement — unlimited hay stays the foundation.</Note>
      </div>}
    />
  );
}

export function RabbitWeightTracker() {
  const [last, setLast] = useState(2.0);
  const [current, setCurrent] = useState(1.95);
  const diff = current - last;
  const pct = ((diff / last) * 100).toFixed(1);
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Last weight (kg)" value={last} onChange={setLast} step={0.01} />
        <NumberField label="Current weight (kg)" value={current} onChange={setCurrent} step={0.01} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${pct}%`} label="Weight change" />
        <Note>Rabbits losing more than 5% in a week need urgent vet care — GI stasis is an emergency.</Note>
      </div>}
    />
  );
}

export function GuineaPigFoodCalculator() {
  const [count, setCount] = useState(2);
  const pelletsG = count * 40;
  const veggiesG = count * 100;
  const hayG = count * 60;
  return (
    <CalculatorLayout
      form={<NumberField label="Number of guinea pigs" value={count} onChange={setCount} min={1} />}
      result={<div className="space-y-3 text-center">
        <Big value={`${hayG} g`} label="Timothy hay (unlimited target)" />
        <Note>Pellets: {pelletsG} g · Fresh veggies: {veggiesG} g · Vitamin C essential daily.</Note>
      </div>}
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
        <h3 className="font-semibold text-foreground">Reptile Ecdysis &amp; Shedding Cycle Tracker</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Track shedding frequency, predict next ecdysis dates, and troubleshoot stuck sheds.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Reptile Species</Label>
            <Select value={spKey} onValueChange={setSpKey}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(SHEDDING_SPECIES_DATA).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Life Stage</Label>
            <Select value={lifeStage} onValueChange={(v: "baby" | "juvenile" | "adult") => setLifeStage(v)}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="baby">Hatchling / Baby (Rapid Growth)</SelectItem>
                <SelectItem value="juvenile">Juvenile / Sub-Adult</SelectItem>
                <SelectItem value="adult">Adult (Maintenance Cycle)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Days Since Last Shed</Label>
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
              Projected Shed Cycle
            </span>
            <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              ~{cycleDays} Days ({daysRemaining === 0 ? "Due Any Day!" : `Due in ~${daysRemaining} Days`})
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Species: <strong className="text-foreground">{sp.name}</strong> • Pattern: <Badge variant="outline" className="ml-1 text-[11px] capitalize">{sp.shedType.replace(/-/g, " ")}</Badge>
            </p>
          </div>

          <Badge variant="outline" className="text-xs px-3 py-1.5 font-medium">
            {progressPct}% Cycle Complete
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>Last Shed ({daysSinceLast}d ago)</span>
            <span>Next Estimated Shed (~{cycleDays}d)</span>
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
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Average Interval</div>
            <div className="mt-1 text-base font-bold text-foreground">{cycleDays} Days</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Target Humidity</div>
            <div className="mt-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">{sp.humidHideTarget}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Current Status</div>
            <div className="mt-1 text-sm font-bold text-foreground">{daysRemaining === 0 ? "Imminent" : "Building Layer"}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Feeding Policy</div>
            <div className="mt-1 text-xs font-bold text-amber-600 dark:text-amber-400">Pause if Blue</div>
          </div>
        </div>

        {/* Ecdysis Phase Guide */}
        <div className="mt-5 rounded-xl border bg-card/90 p-4 space-y-2 text-xs">
          <span className="font-semibold text-foreground">5 Key Biological Phases of Ecdysis:</span>
          <div className="grid gap-2 sm:grid-cols-3 pt-1">
            <div className="rounded-lg border p-2.5 bg-muted/20">
              <strong>1. Dull Skin: </strong>
              <span className="text-muted-foreground">Colors fade, belly turns light pink.</span>
            </div>
            <div className="rounded-lg border p-2.5 bg-muted/20">
              <strong>2. Opaque / Blue Eyes: </strong>
              <span className="text-muted-foreground">Lymph fluid separates old skin. Snake is blind &amp; defensive.</span>
            </div>
            <div className="rounded-lg border p-2.5 bg-muted/20">
              <strong>3. Cleared &amp; Slough: </strong>
              <span className="text-muted-foreground">Eyes turn clear 24–48h before active shed.</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-muted-foreground">
          <strong>Husbandry Tip: </strong>{sp.tips}
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

    let marketName = `${Math.round(minLengthIn / 12)}x${Math.round(minWidthIn / 12)}x${Math.round(minHeightIn / 12)} ft (${volumeGallons} Gal) Vivarium`;
    if (volumeGallons <= 25) marketName = "20 Gallon Long (30\"×12\"×12\")";
    else if (volumeGallons <= 45) marketName = "40 Gallon Breeder (36\"×18\"×18\")";
    else if (volumeGallons <= 75) marketName = "75 Gallon (48\"×18\"×21\")";
    else if (volumeGallons <= 130) marketName = "4×2×2 ft (120 Gallon) Standard PVC Vivarium";
    else if (volumeGallons <= 190) marketName = "5×2×2 ft (150 Gallon) or 4×2×3 ft Enclosure";
    else if (volumeGallons <= 260) marketName = "6×2×2 ft (180 Gallon) or 6×2×3 ft Enclosure";
    else marketName = "8×3×3 ft / 8×4×4 ft Custom Giant Vivarium";

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
  }, [currentLengthFt, activeHabit, activeBodyType, species]);

  const checkResults = useMemo(() => {
    const checkVolGal = Math.round((checkLengthInches * checkWidthInches * checkHeightInches) / 231);
    const checkFloorSqFt = Number(((checkLengthInches * checkWidthInches) / 144).toFixed(1));

    const lengthRatio = checkLengthInches / dimensions.lengthIn;
    const floorRatio = checkFloorSqFt / dimensions.floorAreaSqFt;
    const heightRatio = checkHeightInches / dimensions.heightIn;

    let score = "optimal";
    let message = "This tank is generous and exceeds minimum welfare standards! Your snake will have ample space to stretch, thermoregulate, and thrive.";
    let badgeColor = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300";

    if (lengthRatio < 0.75 || floorRatio < 0.75) {
      score = "too-small";
      message = "Too small for this snake. Snakes in undersized tanks suffer from obesity, spinal kinks, respiratory issues, and chronic stress.";
      badgeColor = "bg-destructive/15 text-destructive border-destructive/30";
    } else if (lengthRatio < 0.95 || floorRatio < 0.95 || heightRatio < 0.85) {
      score = "bare-minimum";
      message = "Borderline / Bare minimum. It will work temporarily, but upgrading to the recommended size is advised for natural behavior.";
      badgeColor = "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300";
    }

    return {
      checkVolGal,
      checkFloorSqFt,
      score,
      message,
      badgeColor,
    };
  }, [checkLengthInches, checkWidthInches, checkHeightInches, dimensions]);

  const copySummary = () => {
    const text = `🐍 Snake Enclosure Specs (${species.name})
- Snake Length: ${currentLengthFt} ft (${Math.round(currentLengthFt * 30.48)} cm) - ${lifeStage.toUpperCase()}
- Recommended Dimensions: ${dimensions.lengthIn}"L × ${dimensions.widthIn}"W × ${dimensions.heightIn}"H (${dimensions.lengthCm} × ${dimensions.widthCm} × ${dimensions.heightCm} cm)
- Floor Area: ${dimensions.floorAreaSqFt} sq ft (${dimensions.floorAreaSqM} m²)
- Enclosure Volume: ~${dimensions.volumeGallons} Gallons (${dimensions.volumeLiters} Liters)
- Recommended Setup: ${dimensions.marketName}
- Target Basking Temp: ${species.tempBaskingF.min}-${species.tempBaskingF.max}°F (${Math.round(((species.tempBaskingF.min - 32) * 5) / 9)}-${Math.round(((species.tempBaskingF.max - 32) * 5) / 9)}°C)
- Target Cool Temp: ${species.tempCoolAmbientF.min}-${species.tempCoolAmbientF.max}°F
- Target Humidity: ${species.humidity.min}% - ${species.humidity.max}%
- Recommended Substrate: ${species.substrate.recommended} (${dimensions.substrateLiters} Liters needed for ${dimensions.subDepth}" depth)
Calculated with FurTools Platform (https://www.furtools.com/tools/snake-tank-size-calculator)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Enclosure specs copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const toCelsius = (f: number) => Math.round(((f - 32) * 5) / 9);

  return (
    <div className="space-y-8">
      {/* Header Controls Card */}
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs backdrop-blur-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Snake Profile &amp; Parameters</h2>
            <p className="text-xs text-muted-foreground">Select species or customize your snake&apos;s biological profile.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={unitSystem === "imperial" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnitSystem("imperial")}
              className="h-8 text-xs font-medium"
            >
              US Imperial (ft / in / gal)
            </Button>
            <Button
              variant={unitSystem === "metric" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnitSystem("metric")}
              className="h-8 text-xs font-medium"
            >
              Metric (cm / m / L)
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Species Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Snake Species Preset</Label>
            <Select value={speciesKey} onValueChange={handleSpeciesChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select species" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.entries(SNAKE_SPECIES).map(([k, s]) => (
                  <SelectItem key={k} value={k}>
                    <span className="font-medium">{s.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Life Stage */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Life Stage</Label>
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
                <SelectItem value="adult">Adult (Full Grown)</SelectItem>
                <SelectItem value="juvenile">Juvenile / Sub-Adult (1-2 yrs)</SelectItem>
                <SelectItem value="baby">Hatchling / Baby (&lt;1 yr)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Snake Length Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">
                Snake Length ({unitSystem === "imperial" ? "feet" : "cm"})
              </Label>
              <span className="text-xs font-semibold text-primary">
                {unitSystem === "imperial"
                  ? `${currentLengthFt} ft`
                  : `${Math.round(currentLengthFt * 30.48)} cm`}
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
            <Label className="text-xs font-medium text-muted-foreground">Natural Habit &amp; Behavior</Label>
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
                <SelectItem value="semi-arboreal">Semi-Arboreal (Ground + Climbing)</SelectItem>
                <SelectItem value="terrestrial">Terrestrial (Ground Dwelling)</SelectItem>
                <SelectItem value="arboreal">Strictly Arboreal (Tree Climber)</SelectItem>
                <SelectItem value="fossorial">Fossorial (Burrowing Specialist)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Species badge bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{species.name}</span>
          <span className="italic">({species.scientific})</span>
          <span>•</span>
          <Badge variant="outline" className="capitalize">
            {activeHabit}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {activeBodyType} Body
          </Badge>
          <span>•</span>
          <span>Typical Adult Size: {species.adultLengthFt.min}–{species.adultLengthFt.max} ft</span>
        </div>
      </div>

      {/* Main Results Tabs */}
      <Tabs defaultValue="enclosure" className="w-full">
        <TabsList className="grid h-12 w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="enclosure" className="text-xs sm:text-sm font-medium">
            <Box className="mr-1.5 h-4 w-4" /> Recommended Tank
          </TabsTrigger>
          <TabsTrigger value="diagram" className="text-xs sm:text-sm font-medium">
            <Maximize2 className="mr-1.5 h-4 w-4" /> Layout &amp; Gradient
          </TabsTrigger>
          <TabsTrigger value="environment" className="text-xs sm:text-sm font-medium">
            <Thermometer className="mr-1.5 h-4 w-4" /> Husbandry Specs
          </TabsTrigger>
          <TabsTrigger value="checker" className="text-xs sm:text-sm font-medium">
            <CheckCircle2 className="mr-1.5 h-4 w-4" /> Tank Size Checker
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
                    Minimum Recommended Enclosure
                  </span>
                  <div className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {unitSystem === "imperial" ? (
                      <>
                        {dimensions.lengthIn}&quot; L × {dimensions.widthIn}&quot; W × {dimensions.heightIn}&quot; H
                      </>
                    ) : (
                      <>
                        {dimensions.lengthCm} × {dimensions.widthCm} × {dimensions.heightCm} cm
                      </>
                    )}
                  </div>
                  <div className="mt-1 text-sm font-medium text-muted-foreground">
                    Equivalent to {dimensions.lengthFt} × {dimensions.widthFt} × {dimensions.heightFt} ft ({dimensions.marketName})
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copySummary}
                  className="gap-1.5 text-xs font-medium shrink-0"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy Specs"}
                </Button>
              </div>

              {/* Metric badges grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border bg-card/80 p-3 text-center">
                  <div className="text-[11px] font-medium text-muted-foreground uppercase">Floor Footprint</div>
                  <div className="mt-1 text-lg font-bold text-foreground">
                    {unitSystem === "imperial" ? `${dimensions.floorAreaSqFt} sq ft` : `${dimensions.floorAreaSqM} m²`}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Min floor space</div>
                </div>

                <div className="rounded-xl border bg-card/80 p-3 text-center">
                  <div className="text-[11px] font-medium text-muted-foreground uppercase">Tank Volume</div>
                  <div className="mt-1 text-lg font-bold text-foreground">
                    {unitSystem === "imperial" ? `${dimensions.volumeGallons} Gallons` : `${dimensions.volumeLiters} Liters`}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Internal air capacity</div>
                </div>

                <div className="rounded-xl border bg-card/80 p-3 text-center">
                  <div className="text-[11px] font-medium text-muted-foreground uppercase">Snake Ratio</div>
                  <div className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">100% Stretch</div>
                  <div className="text-[10px] text-muted-foreground">L ≥ 1.0x snake length</div>
                </div>

                <div className="rounded-xl border bg-card/80 p-3 text-center">
                  <div className="text-[11px] font-medium text-muted-foreground uppercase">Substrate Needed</div>
                  <div className="mt-1 text-lg font-bold text-foreground">
                    {unitSystem === "imperial" ? `~${dimensions.substrateQuarts} qts` : `~${dimensions.substrateLiters} L`}
                  </div>
                  <div className="text-[10px] text-muted-foreground">For {dimensions.subDepth}&quot; base layer</div>
                </div>
              </div>

              {/* Welfare explanation */}
              <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Modern Welfare Rule Applied (1.0 × Total Length)
                </div>
                <p className="mt-1 leading-relaxed">
                  Contemporary herpetological standards require the enclosure length to be at least equal to the snake&apos;s full body length. This allows the snake to stretch completely along one wall without curling, promoting joint health, digestive motility, and muscular tone.
                </p>
              </div>
            </div>

            {/* Quick Material & Checklist Card */}
            <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Enclosure Construction</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Recommended material for {species.name}</p>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="rounded-xl border p-3 bg-muted/20">
                    <div className="font-medium text-foreground">Best Enclosure Material:</div>
                    <div className="mt-1 text-muted-foreground leading-relaxed">{species.enclosureMaterial}</div>
                  </div>

                  <div className="rounded-xl border p-3 bg-muted/20">
                    <div className="font-medium text-foreground">Door &amp; Ventilation Style:</div>
                    <div className="mt-1 text-muted-foreground leading-relaxed">
                      Front-sliding or swinging glass doors with sturdy safety key lock. Top-opening tanks can trigger predatory stress in snakes.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t text-[11px] text-muted-foreground flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Snakes can squeeze through any gap wider than their skull!</span>
              </div>
            </div>
          </div>

          {/* Life-Stage Growth Transition Timeline */}
          <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-foreground">Growth Stages &amp; Upgrades for {species.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">How your snake grows and when to upgrade vivarium size.</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className={`rounded-xl border p-4 transition-all ${lifeStage === "baby" ? "ring-2 ring-primary bg-primary/5" : "bg-card"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Hatchling / Baby</span>
                  <Badge variant="outline">0 – 12 Months</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Typical Length: ~{(species.adultLengthFt.typical * 0.35).toFixed(1)} ft ({Math.round(species.adultLengthFt.typical * 0.35 * 30.48)} cm)
                </div>
                <div className="mt-3 text-xs font-medium text-foreground">
                  Minimum Tank: 20 Gallon Long (30&quot;×12&quot;×12&quot;)
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Babies need abundant clutter and snug hides to feel secure and feed reliably.
                </p>
              </div>

              <div className={`rounded-xl border p-4 transition-all ${lifeStage === "juvenile" ? "ring-2 ring-primary bg-primary/5" : "bg-card"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Juvenile / Sub-Adult</span>
                  <Badge variant="outline">1 – 2 Years</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Typical Length: ~{(species.adultLengthFt.typical * 0.65).toFixed(1)} ft ({Math.round(species.adultLengthFt.typical * 0.65 * 30.48)} cm)
                </div>
                <div className="mt-3 text-xs font-medium text-foreground">
                  Minimum Tank: 40–75 Gallon (36&quot;×18&quot;×18&quot;)
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Rapid growth phase. Transition to larger adult food items and sturdy branches.
                </p>
              </div>

              <div className={`rounded-xl border p-4 transition-all ${lifeStage === "adult" ? "ring-2 ring-primary bg-primary/5" : "bg-card"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Adult (Final Size)</span>
                  <Badge variant="outline">3+ Years</Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Typical Length: ~{species.adultLengthFt.typical} ft ({Math.round(species.adultLengthFt.typical * 30.48)} cm)
                </div>
                <div className="mt-3 text-xs font-medium text-foreground">
                  Permanent Vivarium: {dimensions.marketName}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Permanent forever home allowing full thermal and photoperiod regulation.
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
                <h3 className="text-base font-semibold text-foreground">Enclosure Layout &amp; Thermal Gradient Map</h3>
                <p className="text-xs text-muted-foreground">Visual setup guide showing heat gradient, hide locations, and enrichment zones.</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-rose-500 inline-block"></span> Warm / Basking</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-amber-500 inline-block"></span> Ambient Mid</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-cyan-500 inline-block"></span> Cool Zone</span>
              </div>
            </div>

            {/* Rendered Vivarium Enclosure Box */}
            <div className="mt-6 overflow-hidden rounded-2xl border-4 border-muted/80 bg-neutral-950 p-4 text-white shadow-inner">
              <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>FRONT VIEW VIVARIUM ({dimensions.lengthIn}&quot; L × {dimensions.heightIn}&quot; H)</span>
                <span>DEPTH: {dimensions.widthIn}&quot; ({dimensions.widthCm} cm)</span>
              </div>

              <div className="relative min-h-[260px] rounded-xl border border-neutral-800 bg-gradient-to-r from-rose-950/60 via-amber-950/30 to-cyan-950/60 p-4 flex flex-col justify-between">
                {/* Top Lighting & Overhead Heating row */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 rounded-lg bg-rose-900/60 px-3 py-1.5 text-xs font-medium text-rose-200 border border-rose-700/50">
                    <Sun className="h-4 w-4 text-amber-400 animate-pulse" />
                    <span>Halogen / DHP ({unitSystem === "imperial" ? `${species.tempBaskingF.min}-${species.tempBaskingF.max}°F` : `${toCelsius(species.tempBaskingF.min)}-${toCelsius(species.tempBaskingF.max)}°C`})</span>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-neutral-900/80 px-3 py-1.5 text-xs text-neutral-300 border border-neutral-700">
                    <span>{species.uvbZone} (Overhead Linear Tube)</span>
                  </div>

                  <div className="rounded-lg bg-cyan-900/60 px-3 py-1.5 text-xs font-medium text-cyan-200 border border-cyan-700/50">
                    <span>Cool Ambient ({unitSystem === "imperial" ? `${species.tempCoolAmbientF.min}-${species.tempCoolAmbientF.max}°F` : `${toCelsius(species.tempCoolAmbientF.min)}-${toCelsius(species.tempCoolAmbientF.max)}°C`})</span>
                  </div>
                </div>

                {/* Mid Zone (Climbing, Branches & Foliage) */}
                <div className="my-6 grid grid-cols-3 items-center gap-4 text-center">
                  <div className="rounded-xl border border-dashed border-rose-500/30 bg-rose-950/20 p-3">
                    <div className="text-xs font-semibold text-rose-300">Basking Surface / Slate</div>
                    <p className="mt-1 text-[10px] text-neutral-400">Natural flat stone under basking lamp</p>
                  </div>

                  <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/40 p-3">
                    <div className="text-xs font-semibold text-amber-300">Climbing Perches / Foliage</div>
                    <p className="mt-1 text-[10px] text-neutral-400">Enrichment, sturdy branches &amp; leaves</p>
                  </div>

                  <div className="rounded-xl border border-dashed border-cyan-500/30 bg-cyan-950/20 p-3">
                    <div className="text-xs font-semibold text-cyan-300">Large Water Dish</div>
                    <p className="mt-1 text-[10px] text-neutral-400">Fresh water for soaking &amp; drinking</p>
                  </div>
                </div>

                {/* Bottom Substrate & Dual Hide Row */}
                <div className="rounded-xl border border-amber-900/40 bg-amber-950/40 p-3">
                  <div className="flex items-center justify-between text-xs text-amber-200 mb-2">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" /> Substrate Layer ({dimensions.subDepth}&quot; / {Math.round(dimensions.subDepth * 2.54)} cm deep)
                    </span>
                    <span className="text-[11px] text-neutral-400">Humidity: {species.humidity.min}%–{species.humidity.max}%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg bg-neutral-900/90 border border-neutral-700 p-2 text-center">
                      <div className="font-medium text-rose-300">Warm Hide (Enclosed)</div>
                      <div className="text-[10px] text-neutral-400">Snug fit, 1 entrance only</div>
                    </div>

                    <div className="rounded-lg bg-neutral-900/90 border border-neutral-700 p-2 text-center">
                      <div className="font-medium text-cyan-300">Cool / Moist Hide</div>
                      <div className="text-[10px] text-neutral-400">Sphagnum moss inside for shedding</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Essential rules below diagram */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs text-muted-foreground">
              <div className="rounded-xl border p-3 bg-muted/20">
                <span className="font-semibold text-foreground">1. Dual Tight Hides:</span> Snake needs at least 2 identical snug hides (1 warm, 1 cool) so it doesn&apos;t choose between security and temperature.
              </div>
              <div className="rounded-xl border p-3 bg-muted/20">
                <span className="font-semibold text-foreground">2. Thermostat is Non-Negotiable:</span> Every heat source MUST be plugged into a digital dimming or pulse proportional thermostat.
              </div>
              <div className="rounded-xl border p-3 bg-muted/20">
                <span className="font-semibold text-foreground">3. Clean Water Bowl:</span> Place on cool side to prevent rapid bacteria proliferation and uncontrolled humidity spikes.
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
                <span>Thermal Temperature Gradient</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between rounded-xl border p-3 bg-muted/20">
                  <div>
                    <div className="font-medium text-foreground">Basking Surface Temperature</div>
                    <div className="text-muted-foreground">Direct surface beneath heat lamp</div>
                  </div>
                  <div className="text-right font-bold text-rose-600 dark:text-rose-400 text-sm">
                    {unitSystem === "imperial" ? (
                      <>{species.tempBaskingF.min} – {species.tempBaskingF.max} °F</>
                    ) : (
                      <>{toCelsius(species.tempBaskingF.min)} – {toCelsius(species.tempBaskingF.max)} °C</>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border p-3 bg-muted/20">
                  <div>
                    <div className="font-medium text-foreground">Warm Side Ambient (Air)</div>
                    <div className="text-muted-foreground">Warm end general ambient air</div>
                  </div>
                  <div className="text-right font-bold text-amber-600 dark:text-amber-400 text-sm">
                    {unitSystem === "imperial" ? (
                      <>{species.tempWarmAmbientF.min} – {species.tempWarmAmbientF.max} °F</>
                    ) : (
                      <>{toCelsius(species.tempWarmAmbientF.min)} – {toCelsius(species.tempWarmAmbientF.max)} °C</>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border p-3 bg-muted/20">
                  <div>
                    <div className="font-medium text-foreground">Cool Side Ambient (Air)</div>
                    <div className="text-muted-foreground">Cool end for thermal retreat</div>
                  </div>
                  <div className="text-right font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                    {unitSystem === "imperial" ? (
                      <>{species.tempCoolAmbientF.min} – {species.tempCoolAmbientF.max} °F</>
                    ) : (
                      <>{toCelsius(species.tempCoolAmbientF.min)} – {toCelsius(species.tempCoolAmbientF.max)} °C</>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Humidity & Substrate Specs */}
            <div className="rounded-2xl border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-3">
                <Droplets className="h-4 w-4" />
                <span>Humidity &amp; Substrate Requirements</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="rounded-xl border p-3 bg-muted/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">Target Relative Humidity</span>
                    <span className="font-bold text-primary text-sm">{species.humidity.min}% – {species.humidity.max}%</span>
                  </div>
                  <p className="text-muted-foreground">{species.humidity.note}</p>
                </div>

                <div className="rounded-xl border p-3 bg-muted/20">
                  <div className="font-medium text-foreground mb-1">Recommended Substrate Type</div>
                  <p className="text-muted-foreground">{species.substrate.recommended}</p>
                  <div className="mt-2 text-destructive font-medium text-[11px]">
                    Avoid: {species.substrate.avoid}
                  </div>
                </div>

                <div className="rounded-xl border p-3 bg-muted/20 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">Calculated Substrate Volume</div>
                    <div className="text-muted-foreground">For {dimensions.subDepth}&quot; ({Math.round(dimensions.subDepth * 2.54)} cm) base depth</div>
                  </div>
                  <div className="text-right font-bold text-foreground text-sm">
                    {dimensions.substrateLiters} Liters ({dimensions.substrateQuarts} Quarts)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ─────────── TAB 4: TANK SIZE CHECKER ─────────── */}
        <TabsContent value="checker" className="mt-6 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-xs">
            <h3 className="text-base font-semibold text-foreground">Custom Enclosure Compliance Evaluator</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter your current or prospective tank dimensions to verify if it satisfies your snake&apos;s welfare needs.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Length ({unitSystem === "imperial" ? "inches" : "cm"})</Label>
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
                <Label className="text-xs font-medium text-muted-foreground">Width / Depth ({unitSystem === "imperial" ? "inches" : "cm"})</Label>
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
                <Label className="text-xs font-medium text-muted-foreground">Height ({unitSystem === "imperial" ? "inches" : "cm"})</Label>
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
                  {checkResults.score === "optimal" && "Optimal Enclosure Size 🎉"}
                  {checkResults.score === "bare-minimum" && "Bare Minimum (Upgrade Recommended) ⚠️"}
                  {checkResults.score === "too-small" && "Undersized / Inadequate Enclosure ❌"}
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed opacity-90">{checkResults.message}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-medium pt-3 border-t border-current/20">
                <div>
                  <span className="opacity-75">Your Volume:</span>
                  <div className="text-sm font-bold">{checkResults.checkVolGal} Gallons</div>
                </div>
                <div>
                  <span className="opacity-75">Your Floor Area:</span>
                  <div className="text-sm font-bold">{checkResults.checkFloorSqFt} sq ft</div>
                </div>
                <div>
                  <span className="opacity-75">Target Floor Area:</span>
                  <div className="text-sm font-bold">{dimensions.floorAreaSqFt} sq ft</div>
                </div>
                <div>
                  <span className="opacity-75">Target Min Length:</span>
                  <div className="text-sm font-bold">{dimensions.lengthIn}&quot; ({dimensions.lengthCm} cm)</div>
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
  const [perDay, setPerDay] = useState(2.5);
  const monthly = (perDay * 30).toFixed(0);
  const yearly = (perDay * 365).toFixed(0);
  return (
    <CalculatorLayout
      form={<NumberField label="Supplement cost per day ($)" value={perDay} onChange={setPerDay} step={0.1} />}
      result={<div className="space-y-3 text-center">
        <Big value={`$${monthly}`} label="Monthly cost" />
        <Note>Yearly: ${yearly}. Bulk buckets often cut per-serving cost by 30–40%.</Note>
      </div>}
    />
  );
}

/* ─────────── FARM ─────────── */
export function ChickenNestingBoxCount() {
  const [hens, setHens] = useState(6);
  const boxes = Math.max(1, Math.ceil(hens / 4));
  return (
    <CalculatorLayout
      form={<NumberField label="Number of hens" value={hens} onChange={setHens} min={1} />}
      result={<div className="space-y-4">
        <Big value={boxes} label="Nesting boxes needed" />
        <Note>1 box per 3–4 hens. Boxes should be dark, 12×12 in, and slightly elevated.</Note>
      </div>}
    />
  );
}

/* ─────────── GENERAL ─────────── */
export function PetVetVisitCostEstimator() {
  const [type, setType] = useState("wellness");
  const cost: Record<string, number> = { wellness: 75, vaccinations: 120, sick: 200, dental: 500, emergency: 1500 };
  return (
    <CalculatorLayout
      form={<SelectField label="Visit type" value={type} onChange={setType} options={Object.keys(cost)} />}
      result={<div className="space-y-4">
        <Big value={`$${cost[type]}`} label="Estimated typical cost (US)" />
        <Note>Regional pricing varies widely. Pet insurance often reimburses 70–90%.</Note>
      </div>}
    />
  );
}

export function PetGroomingCostEstimator() {
  const [type, setType] = useState("full-groom");
  const [monthly, setMonthly] = useState(1);
  const cost: Record<string, number> = { bath: 35, "full-groom": 75, "de-shed": 90, "nail-trim": 15 };
  const yearly = cost[type] * monthly * 12;
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <SelectField label="Grooming service" value={type} onChange={setType} options={Object.keys(cost)} />
        <NumberField label="Visits per month" value={monthly} onChange={setMonthly} min={1} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`$${yearly}`} label="Annual grooming cost" />
        <Note>DIY basics (nail trims, brushing) can cut this by half.</Note>
      </div>}
    />
  );
}
