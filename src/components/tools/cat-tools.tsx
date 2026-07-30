import { useState } from "react";
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
  const [weight, setWeight] = useState(10);
  const [activity, setActivity] = useState<CatActivity>("indoor");
  const [stage, setStage] = useState<CatStage>("adult");
  const [kcalPerCup, setKcalPerCup] = useState(300);
  const mer = Math.round(catMER(weight, activity, stage));
  const cups = kcalPerCup > 0 ? (mer / kcalPerCup).toFixed(2) : "0";
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Weight (lb)</Label><Input type="number" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Activity</Label>
          <Select value={activity} onValueChange={(v: CatActivity) => setActivity(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="indoor">Indoor</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="outdoor">Outdoor</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Life stage</Label>
          <Select value={stage} onValueChange={(v: CatStage) => setStage(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="kitten">Kitten</SelectItem>
              <SelectItem value="adult">Adult</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Kcal per cup (dry food)</Label>
          <Input type="number" value={kcalPerCup} onChange={(e) => setKcalPerCup(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-3">
        <BigResult value={cups} label="Cups per day" unit={`${mer} kcal/day`} />
      </div>}
    />
  );
}

/* Kitten growth */
export function KittenGrowthCalculator() {
  const [weight, setWeight] = useState(4);
  const [months, setMonths] = useState(4);
  const [breed, setBreed] = useState<"domestic" | "large">("domestic");
  const factor = breed === "large" ? 1.3 : 1;
  const adult = months > 0 ? Math.round((weight / months) * 12 * factor * 0.7 + 5) : 0;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Current weight (lb)</Label><Input type="number" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Age (months)</Label><Input type="number" value={months} onChange={(e) => setMonths(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Breed group</Label>
          <Select value={breed} onValueChange={(v: "domestic" | "large") => setBreed(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="domestic">Domestic (average)</SelectItem>
              <SelectItem value="large">Large breed (Maine Coon, Ragdoll)</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<BigResult value={`${adult} lb`} label="Estimated adult weight" />}
    />
  );
}

/* Litter */
export function CatLitterCalculator() {
  const [cats, setCats] = useState(1);
  const [type, setType] = useState<"clay" | "silica" | "plant">("clay");
  const perCatLb = { clay: 15, silica: 8, plant: 12 }[type];
  const perCatCost = { clay: 18, silica: 25, plant: 22 }[type];
  const lb = cats * perCatLb;
  const cost = cats * perCatCost;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Number of cats</Label><Input type="number" min={1} value={cats} onChange={(e) => setCats(+e.target.value || 1)} className="mt-1.5" /></div>
        <div><Label>Litter type</Label>
          <Select value={type} onValueChange={(v: "clay" | "silica" | "plant") => setType(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="clay">Clumping clay</SelectItem>
              <SelectItem value="silica">Silica crystal</SelectItem>
              <SelectItem value="plant">Plant-based (pine, corn)</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<div className="space-y-3">
        <BigResult value={`${lb} lb`} label="Litter per month" unit={`~$${cost}/mo • Use ${cats + 1} boxes (N+1)`} />
      </div>}
    />
  );
}

/* Play time */
export function CatPlayTimeCalculator() {
  const [age, setAge] = useState<"kitten" | "adult" | "senior">("adult");
  const mins = { kitten: 60, adult: 30, senior: 15 }[age];
  const sessions = { kitten: 6, adult: 2, senior: 2 }[age];
  return (
    <CalculatorLayout
      form={<div><Label>Life stage</Label>
        <Select value={age} onValueChange={(v: "kitten" | "adult" | "senior") => setAge(v)}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="kitten">Kitten</SelectItem>
            <SelectItem value="adult">Adult</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
          </SelectContent></Select></div>}
      result={<div className="space-y-3">
        <BigResult value={mins} label="Play minutes / day" unit={`Split into ${sessions} session${sessions > 1 ? "s" : ""}`} />
      </div>}
    />
  );
}
