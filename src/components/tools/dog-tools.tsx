import { useState } from "react";
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
  const [size, setSize] = useState("medium");
  const [age, setAge] = useState<"puppy" | "adult" | "senior">("adult");
  const [low, high] = DOG_EXERCISE[size];
  const factor = age === "puppy" ? 0.6 : age === "senior" ? 0.5 : 1;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Breed size</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(DOG_EXERCISE).map((k) => <SelectItem key={k} value={k}>{k[0].toUpperCase() + k.slice(1)}</SelectItem>)}</SelectContent>
          </Select></div>
        <div><Label>Life stage</Label>
          <Select value={age} onValueChange={(v: "puppy" | "adult" | "senior") => setAge(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="puppy">Puppy</SelectItem><SelectItem value="adult">Adult</SelectItem><SelectItem value="senior">Senior</SelectItem></SelectContent>
          </Select></div>
      </>}
      result={<BigResult value={`${Math.round(low * factor)}–${Math.round(high * factor)}`} label="Walking minutes / day" unit="split into 2 walks" />}
    />
  );
}

export function DogExerciseCalculator() {
  const [energy, setEnergy] = useState<"low" | "medium" | "high">("medium");
  const [age, setAge] = useState<"puppy" | "adult" | "senior">("adult");
  const base = { low: 30, medium: 60, high: 100 }[energy];
  const factor = age === "puppy" ? 0.7 : age === "senior" ? 0.5 : 1;
  const mins = Math.round(base * factor);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Energy level</Label>
          <Select value={energy} onValueChange={(v: "low" | "medium" | "high") => setEnergy(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
          </Select></div>
        <div><Label>Life stage</Label>
          <Select value={age} onValueChange={(v: "puppy" | "adult" | "senior") => setAge(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="puppy">Puppy</SelectItem><SelectItem value="adult">Adult</SelectItem><SelectItem value="senior">Senior</SelectItem></SelectContent>
          </Select></div>
      </>}
      result={<BigResult value={mins} label="Total exercise minutes/day" unit="walks, play, and training" />}
    />
  );
}

/* Puppy growth */
export function PuppyGrowthCalculator() {
  const [weight, setWeight] = useState(10);
  const [weeks, setWeeks] = useState(16);
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const factor = size === "small" ? 0.75 : size === "large" ? 1.2 : 1;
  const adult = weeks > 0 ? Math.round((weight / weeks) * 52 * factor) : 0;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Current weight (lb)</Label><Input type="number" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Age (weeks)</Label><Input type="number" value={weeks} onChange={(e) => setWeeks(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Expected adult size</Label>
          <Select value={size} onValueChange={(v: "small" | "medium" | "large") => setSize(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="small">Small</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="large">Large</SelectItem></SelectContent>
          </Select></div>
      </>}
      result={<BigResult value={`${adult} lb`} label="Estimated adult weight" />}
    />
  );
}

/* Heat cycle */
export function DogHeatCycleTracker() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [interval, setInterval] = useState(6); // months
  const next = addDays(new Date(date), interval * 30);
  const fertileStart = addDays(next, 9);
  const fertileEnd = addDays(next, 15);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Last heat start date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" /></div>
        <div><Label>Cycle interval (months)</Label>
          <Select value={String(interval)} onValueChange={(v) => setInterval(+v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{[5, 6, 7, 8].map((n) => <SelectItem key={n} value={String(n)}>{n} months</SelectItem>)}</SelectContent>
          </Select></div>
      </>}
      result={<div className="space-y-3">
        <BigResult value={formatDate(next)} label="Next heat expected" />
        <div className="text-center text-sm text-muted-foreground">Fertile window ~ {formatDate(fertileStart)} to {formatDate(fertileEnd)}</div>
      </div>}
    />
  );
}
