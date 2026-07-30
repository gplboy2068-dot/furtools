import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";

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
export function ReptileSheddingTracker() {
  const [species, setSpecies] = useState("ball-python");
  const days: Record<string, number> = { "ball-python": 45, "leopard-gecko": 14, "bearded-dragon": 60, "corn-snake": 60 };
  return (
    <CalculatorLayout
      form={<SelectField label="Species" value={species} onChange={setSpecies} options={Object.keys(days)} />}
      result={<div className="space-y-4">
        <Big value={`~${days[species]} days`} label="Typical shed cycle" />
        <Note>Raise humidity and add a moist hide 5 days before expected shed.</Note>
      </div>}
    />
  );
}

export function SnakeTankSizeCalculator() {
  const [length, setLength] = useState(4);
  const minFt2 = Math.round(length * 1 * 10) / 10;
  return (
    <CalculatorLayout
      form={<NumberField label="Snake length (ft)" value={length} onChange={setLength} step={0.5} />}
      result={<div className="space-y-4">
        <Big value={`${minFt2} ft²`} label="Minimum enclosure floor space" />
        <Note>Enclosure length + width should equal at least 100% of snake length.</Note>
      </div>}
    />
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
