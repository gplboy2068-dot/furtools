import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout, GeneratorLayout } from "@/components/layouts/tool-layouts";
import { Sparkles, Trash2 } from "lucide-react";
import {
  rer, dogMER, catMER, addDays, formatDate,
  type DogActivity, type DogStage, type CatActivity, type CatStage,
} from "@/lib/pet-formulas";

type Species = "dog" | "cat";

/* ─────────── Result primitives ─────────── */
function BigResult({ value, label, unit }: { value: string | number; label: string; unit?: string }) {
  return (
    <div className="text-center">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-5xl font-semibold text-primary">{value}</div>
      {unit && <div className="mt-1 text-sm text-muted-foreground">{unit}</div>}
    </div>
  );
}
function ResultList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 text-sm">
      {items.map((i) => (
        <div key={i.label}>
          <dt className="text-muted-foreground">{i.label}</dt>
          <dd className="font-medium">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ─────────── Calorie ─────────── */
export function CalorieCalculator({ species }: { species: Species }) {
  const [weight, setWeight] = useState(species === "dog" ? 30 : 10);
  const [activity, setActivity] = useState<string>(species === "dog" ? "moderate" : "indoor");
  const [stage, setStage] = useState<string>("adult");
  const kcal = useMemo(() => {
    if (species === "dog")
      return Math.round(dogMER(weight, activity as DogActivity, stage as DogStage));
    return Math.round(catMER(weight, activity as CatActivity, stage as CatStage));
  }, [species, weight, activity, stage]);
  const activityOpts = species === "dog"
    ? [["low", "Low"], ["moderate", "Moderate"], ["active", "Active"], ["working", "Working"]]
    : [["indoor", "Indoor"], ["active", "Active"], ["outdoor", "Outdoor"]];
  const stageOpts = species === "dog"
    ? [["puppy", "Puppy"], ["adult", "Adult"], ["senior", "Senior"]]
    : [["kitten", "Kitten"], ["adult", "Adult"], ["senior", "Senior"]];

  return (
    <CalculatorLayout
      form={<>
        <div><Label>Weight (lb)</Label>
          <Input type="number" min={1} value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Activity level</Label>
          <Select value={activity} onValueChange={setActivity}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{activityOpts.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
          </Select></div>
        <div><Label>Life stage</Label>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{stageOpts.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
          </Select></div>
      </>}
      result={<div className="space-y-4">
        <BigResult value={kcal} label="Daily calories" unit="kcal per day" />
        <div className="border-t border-border/50 pt-4">
          <ResultList items={[
            { label: "RER (resting)", value: `${Math.round(rer(weight))} kcal` },
            { label: "Weight (kg)", value: (weight / 2.2046).toFixed(1) },
          ]} />
        </div>
      </div>}
    />
  );
}

/* ─────────── Ideal Weight ─────────── */
const DOG_WEIGHT_RANGES: Record<string, [number, number]> = {
  toy: [4, 12], small: [12, 25], medium: [25, 55], large: [55, 85], giant: [85, 160],
};
const CAT_WEIGHT_RANGES: Record<string, [number, number]> = {
  small: [7, 10], medium: [8, 12], large: [13, 18],
};
export function IdealWeightCalculator({ species }: { species: Species }) {
  const ranges = species === "dog" ? DOG_WEIGHT_RANGES : CAT_WEIGHT_RANGES;
  const [size, setSize] = useState<string>(species === "dog" ? "medium" : "medium");
  const [low, high] = ranges[size];
  return (
    <CalculatorLayout
      form={<div><Label>Frame / breed size</Label>
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(ranges).map((k) => (
            <SelectItem key={k} value={k}>{k[0].toUpperCase() + k.slice(1)}</SelectItem>
          ))}</SelectContent>
        </Select></div>}
      result={<BigResult value={`${low}–${high}`} label="Healthy weight range" unit="lb" />}
    />
  );
}

/* ─────────── BCS ─────────── */
export function BCSCalculator({ species }: { species: Species }) {
  const [ribs, setRibs] = useState<"easy" | "some" | "hard">("easy");
  const [waist, setWaist] = useState<"visible" | "faint" | "none">("visible");
  const score = useMemo(() => {
    const rMap = { easy: 4, some: 6, hard: 8 } as const;
    const wMap = { visible: 4, faint: 6, none: 8 } as const;
    return Math.round((rMap[ribs] + wMap[waist]) / 2);
  }, [ribs, waist]);
  const label = score <= 3 ? "Underweight" : score <= 5 ? "Ideal" : score <= 6 ? "Overweight" : "Obese";
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Ribs</Label>
          <Select value={ribs} onValueChange={(v: "easy" | "some" | "hard") => setRibs(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easily felt with light touch</SelectItem>
              <SelectItem value="some">Some pressure needed</SelectItem>
              <SelectItem value="hard">Hard to feel</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Waist (viewed from above)</Label>
          <Select value={waist} onValueChange={(v: "visible" | "faint" | "none") => setWaist(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="visible">Clearly visible</SelectItem>
              <SelectItem value="faint">Faintly visible</SelectItem>
              <SelectItem value="none">No visible waist</SelectItem>
            </SelectContent></Select></div>
        <p className="text-xs text-muted-foreground">Applies to {species === "dog" ? "dogs" : "cats"} using the 9-point body condition score.</p>
      </>}
      result={<>
        <BigResult value={`${score}/9`} label="Body condition score" unit={label} />
      </>}
    />
  );
}

/* ─────────── Treat calories ─────────── */
export function TreatCalorieCalculator({ species }: { species: Species }) {
  const [daily, setDaily] = useState(species === "dog" ? 900 : 220);
  const [treatKcal, setTreatKcal] = useState(species === "dog" ? 25 : 3);
  const max = Math.floor((daily * 0.1) / Math.max(treatKcal, 0.01));
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Daily calories (kcal)</Label>
          <Input type="number" min={0} value={daily} onChange={(e) => setDaily(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Calories per treat</Label>
          <Input type="number" min={0} value={treatKcal} onChange={(e) => setTreatKcal(+e.target.value || 0)} className="mt-1.5" />
          <p className="mt-1 text-xs text-muted-foreground">Check the treat's nutrition label.</p></div>
      </>}
      result={<>
        <BigResult value={max} label="Max treats per day" unit="10% of daily calories" />
        <p className="mt-4 text-xs text-muted-foreground text-center">≈ {Math.round(daily * 0.1)} kcal treat budget</p>
      </>}
    />
  );
}

/* ─────────── Pregnancy ─────────── */
export function PregnancyCalculator({ species, gestation }: { species: Species; gestation: number }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const start = new Date(date);
  const due = addDays(start, gestation);
  const milestones = [
    { day: 21, label: "Vet ultrasound possible" },
    { day: 30, label: "Nipples enlarge, appetite grows" },
    { day: 45, label: "Puppies/kittens palpable" },
    { day: gestation - 7, label: "Prepare whelping/queening box" },
    { day: gestation, label: "Expected due date" },
  ];
  return (
    <CalculatorLayout
      form={<div><Label>{species === "dog" ? "Breeding" : "Mating"} date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" />
        <p className="mt-2 text-xs text-muted-foreground">Average gestation: {gestation} days (±5).</p></div>}
      result={<div className="space-y-4">
        <BigResult value={formatDate(due)} label="Estimated due date" />
        <ul className="space-y-2 border-t border-border/50 pt-4 text-sm">
          {milestones.map((m) => (
            <li key={m.day} className="flex justify-between gap-3">
              <span className="text-muted-foreground">Day {m.day}</span>
              <span className="font-medium text-right">{m.label}</span>
              <span className="text-muted-foreground">{formatDate(addDays(start, m.day))}</span>
            </li>
          ))}
        </ul>
      </div>}
    />
  );
}

/* ─────────── Vaccination Schedule ─────────── */
const DOG_VACCINES = [
  { week: 6, name: "DAPP #1 (core)" },
  { week: 9, name: "DAPP #2" },
  { week: 12, name: "DAPP #3 + optional Lepto/Lyme" },
  { week: 16, name: "DAPP #4 + Rabies" },
  { week: 52, name: "1-year boosters" },
];
const CAT_VACCINES = [
  { week: 6, name: "FVRCP #1 (core)" },
  { week: 9, name: "FVRCP #2" },
  { week: 12, name: "FVRCP #3 + optional FeLV" },
  { week: 16, name: "FVRCP #4 + Rabies" },
  { week: 52, name: "1-year boosters" },
];
export function VaccinationSchedule({ species }: { species: Species }) {
  const [weeks, setWeeks] = useState(8);
  const list = species === "dog" ? DOG_VACCINES : CAT_VACCINES;
  const upcoming = list.filter((v) => v.week >= weeks);
  return (
    <CalculatorLayout
      form={<div><Label>Current age (weeks)</Label>
        <Input type="number" min={0} value={weeks} onChange={(e) => setWeeks(+e.target.value || 0)} className="mt-1.5" />
        <p className="mt-2 text-xs text-muted-foreground">4 weeks = 1 month • 52 = 1 year</p></div>}
      result={<div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Upcoming vaccinations</div>
        <ul className="space-y-2">
          {upcoming.length === 0 && <li className="text-sm text-muted-foreground">All initial vaccines done — schedule annual boosters with your vet.</li>}
          {upcoming.map((v) => (
            <li key={v.week} className="flex items-baseline justify-between gap-2 border-b border-border/40 pb-2 last:border-0">
              <span className="text-sm font-medium">{v.name}</span>
              <span className="text-xs text-muted-foreground">Week {v.week}</span>
            </li>
          ))}
        </ul>
      </div>}
    />
  );
}

/* ─────────── Cost ─────────── */
export function CostCalculator({ species = "dog" }: { species?: Species | "generic" }) {
  const [food, setFood] = useState(species === "cat" ? 40 : 70);
  const [insurance, setInsurance] = useState(35);
  const [other, setOther] = useState(species === "cat" ? 25 : 40);
  const [vet, setVet] = useState(400);
  const [years, setYears] = useState(species === "cat" ? 15 : 12);
  const monthly = food + insurance + other;
  const annual = monthly * 12 + vet;
  const lifetime = annual * years;
  return (
    <CalculatorLayout
      form={<>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Food /mo ($)</Label><Input type="number" value={food} onChange={(e) => setFood(+e.target.value || 0)} className="mt-1.5" /></div>
          <div><Label>Insurance /mo ($)</Label><Input type="number" value={insurance} onChange={(e) => setInsurance(+e.target.value || 0)} className="mt-1.5" /></div>
          <div><Label>Other /mo ($)</Label><Input type="number" value={other} onChange={(e) => setOther(+e.target.value || 0)} className="mt-1.5" /></div>
          <div><Label>Vet /yr ($)</Label><Input type="number" value={vet} onChange={(e) => setVet(+e.target.value || 0)} className="mt-1.5" /></div>
          <div><Label>Expected years</Label><Input type="number" value={years} onChange={(e) => setYears(+e.target.value || 0)} className="mt-1.5" /></div>
        </div>
      </>}
      result={<div className="space-y-4">
        <BigResult value={`$${annual.toLocaleString()}`} label="Estimated annual cost" />
        <div className="border-t border-border/50 pt-4">
          <ResultList items={[
            { label: "Monthly", value: `$${monthly}` },
            { label: "Lifetime", value: `$${lifetime.toLocaleString()}` },
          ]} />
        </div>
      </div>}
    />
  );
}

/* ─────────── Life Expectancy ─────────── */
export function LifeExpectancyCalculator({ species }: { species: Species }) {
  const dogRanges: Record<string, [number, number]> = {
    small: [13, 16], medium: [11, 14], large: [9, 12], giant: [7, 10],
  };
  const [size, setSize] = useState("medium");
  const [indoor, setIndoor] = useState<"indoor" | "outdoor">("indoor");
  const range = species === "dog"
    ? dogRanges[size]
    : indoor === "indoor" ? [13, 17] as const : [5, 8] as const;
  return (
    <CalculatorLayout
      form={species === "dog" ? (
        <div><Label>Breed size</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(dogRanges).map((k) => <SelectItem key={k} value={k}>{k[0].toUpperCase() + k.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select></div>
      ) : (
        <div><Label>Lifestyle</Label>
          <Select value={indoor} onValueChange={(v: "indoor" | "outdoor") => setIndoor(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="indoor">Indoor only</SelectItem>
              <SelectItem value="outdoor">Outdoor / indoor-outdoor</SelectItem>
            </SelectContent>
          </Select></div>
      )}
      result={<BigResult value={`${range[0]}–${range[1]}`} label="Expected lifespan" unit="years" />}
    />
  );
}

/* ─────────── Water ─────────── */
export function WaterCalculator({ species }: { species: Species }) {
  const [weight, setWeight] = useState(species === "dog" ? 40 : 10);
  const [climate, setClimate] = useState<"cool" | "temperate" | "hot">("temperate");
  const factor = species === "dog" ? 1 : 0.8;
  const climateAdj = climate === "cool" ? 0.9 : climate === "hot" ? 1.3 : 1;
  const oz = Math.round(weight * factor * climateAdj);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Weight (lb)</Label>
          <Input type="number" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Climate</Label>
          <Select value={climate} onValueChange={(v: "cool" | "temperate" | "hot") => setClimate(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cool">Cool</SelectItem>
              <SelectItem value="temperate">Temperate</SelectItem>
              <SelectItem value="hot">Hot / high activity</SelectItem>
            </SelectContent>
          </Select></div>
      </>}
      result={<div className="space-y-3 text-center">
        <BigResult value={oz} label="Water per day" unit={`fluid ounces (~${Math.round(oz * 29.5)} ml)`} />
      </div>}
    />
  );
}

/* ─────────── Grooming ─────────── */
const GROOMING: Record<Species, Record<string, string[]>> = {
  dog: {
    short: ["Brush weekly", "Bathe every 6–8 weeks", "Nails every 3–4 weeks", "Ears monthly", "Teeth: 3–4×/week"],
    medium: ["Brush 2–3×/week", "Bathe every 4–6 weeks", "Nails every 3 weeks", "Ears monthly", "Teeth: daily"],
    long: ["Brush daily", "Bathe every 3–4 weeks", "Pro groom every 6 weeks", "Nails every 3 weeks", "Teeth: daily"],
    doodle: ["Brush every other day", "Pro groom every 5 weeks", "Bathe as needed", "Ears every 2 weeks", "Teeth: daily"],
  },
  cat: {
    short: ["Brush weekly", "Nails every 2–3 weeks", "Teeth: daily ideally", "Baths only when needed"],
    medium: ["Brush 2–3×/week", "Nails every 3 weeks", "Teeth: daily", "Sanitary trim as needed"],
    long: ["Brush daily", "Nails every 2 weeks", "Occasional baths", "Sanitary trim monthly"],
  },
};
export function GroomingSchedule({ species }: { species: Species }) {
  const types = Object.keys(GROOMING[species]);
  const [coat, setCoat] = useState(types[0]);
  return (
    <CalculatorLayout
      form={<div><Label>Coat type</Label>
        <Select value={coat} onValueChange={setCoat}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}-haired</SelectItem>)}</SelectContent>
        </Select></div>}
      result={<div className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Your schedule</div>
        <ul className="space-y-2 text-sm">
          {GROOMING[species][coat].map((line) => (
            <li key={line} className="flex gap-2"><span className="text-primary">•</span><span>{line}</span></li>
          ))}
        </ul>
      </div>}
    />
  );
}

/* ─────────── Interactive Checklist ─────────── */
export function ChecklistTool({
  storageKey,
  groups,
}: { storageKey: string; groups: { title: string; items: string[] }[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setDone(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [storageKey]);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(done)); } catch { /* ignore */ } }, [done, storageKey]);
  const total = groups.reduce((s, g) => s + g.items.length, 0);
  const completed = Object.values(done).filter(Boolean).length;
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-cream p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Progress</span>
          <span className="text-muted-foreground">{completed} / {total}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(completed / total) * 100 || 0}%` }} />
        </div>
      </div>
      {groups.map((g) => (
        <div key={g.title}>
          <h3 className="font-display text-lg font-semibold">{g.title}</h3>
          <ul className="mt-3 space-y-2">
            {g.items.map((item) => {
              const id = `${g.title}:${item}`;
              return (
                <li key={id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50">
                  <Checkbox id={id} checked={!!done[id]} onCheckedChange={(v) => setDone((d) => ({ ...d, [id]: !!v }))} />
                  <label htmlFor={id} className={`text-sm ${done[id] ? "line-through text-muted-foreground" : ""}`}>{item}</label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ─────────── Universal Name Generator (AI-backed, DB-cached) ─────────── */
import { AiNameGenerator } from "@/components/tools/ai-name-generator";

const NAME_BANKS: Record<string, string[]> = {
  cute: ["Biscuit", "Peanut", "Waffle", "Mochi", "Poppy", "Beans", "Honey", "Ollie", "Milo", "Pip", "Noodle", "Muffin", "Toast", "Boba"],
  classic: ["Max", "Charlie", "Bella", "Lucy", "Rocky", "Daisy", "Cooper", "Ruby", "Sadie", "Duke", "Simba", "Luna"],
  nature: ["Willow", "River", "Sage", "Aspen", "Fern", "Juniper", "Cedar", "Meadow", "Birch", "Cloud", "Sunny", "Stone"],
  cozy: ["Marshmallow", "Cookie", "Pumpkin", "Cinnamon", "Butter", "Ginger", "Latte", "Custard", "Caramel", "Nutmeg"],
  mythology: ["Zeus", "Odin", "Freya", "Athena", "Loki", "Thor", "Selene", "Hera", "Orion", "Nyx"],
  minimalist: ["Ivy", "Ash", "Kai", "Zen", "Fox", "Rio", "Nix", "Ada", "Uma"],
};

export function UniversalNameGenerator({ species = "pet" }: { species?: string } = {}) {
  return <AiNameGenerator species={species} vibes={Object.keys(NAME_BANKS)} seedNames={NAME_BANKS} />;
}

/* ─────────── Expense Tracker ─────────── */
interface Expense { id: string; date: string; category: string; amount: number; note: string }
export function ExpenseTracker() {
  const [entries, setEntries] = useState<Expense[]>([]);
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  useEffect(() => {
    try { const raw = localStorage.getItem("furtools:expenses"); if (raw) setEntries(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);
  useEffect(() => { try { localStorage.setItem("furtools:expenses", JSON.stringify(entries)); } catch { /* ignore */ } }, [entries]);
  const total = entries.reduce((s, e) => s + e.amount, 0);
  const monthly = entries
    .filter((e) => e.date.slice(0, 7) === new Date().toISOString().slice(0, 7))
    .reduce((s, e) => s + e.amount, 0);
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_2fr_auto]">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {["Food", "Vet", "Grooming", "Toys", "Insurance", "Other"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Amount" value={amount || ""} onChange={(e) => setAmount(+e.target.value || 0)} />
        <Input placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button onClick={() => {
          if (!amount) return;
          setEntries((es) => [{ id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), category, amount, note }, ...es]);
          setAmount(0); setNote("");
        }}>Add</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-cream p-4"><div className="text-xs uppercase text-muted-foreground">This month</div>
          <div className="mt-1 font-display text-3xl font-semibold text-primary">${monthly.toFixed(2)}</div></div>
        <div className="rounded-xl bg-cream p-4"><div className="text-xs uppercase text-muted-foreground">All time</div>
          <div className="mt-1 font-display text-3xl font-semibold">${total.toFixed(2)}</div></div>
      </div>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.id} className="flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2 text-sm">
            <span className="w-24 text-muted-foreground">{e.date}</span>
            <span className="w-24 font-medium">{e.category}</span>
            <span className="flex-1 text-muted-foreground">{e.note}</span>
            <span className="font-medium">${e.amount.toFixed(2)}</span>
            <button onClick={() => setEntries((es) => es.filter((x) => x.id !== e.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
          </li>
        ))}
        {entries.length === 0 && <li className="text-center text-sm text-muted-foreground py-6">No expenses yet — add one above.</li>}
      </ul>
    </div>
  );
}

/* ─────────── Feeding Planner ─────────── */
export function FeedingPlanner() {
  const [kcal, setKcal] = useState(800);
  const [meals, setMeals] = useState(2);
  const perMeal = Math.round(kcal / Math.max(meals, 1));
  const times = ["8:00 AM", "1:00 PM", "6:00 PM", "10:00 PM"].slice(0, meals);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Daily calories (kcal)</Label>
          <Input type="number" value={kcal} onChange={(e) => setKcal(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Meals per day</Label>
          <Select value={String(meals)} onValueChange={(v) => setMeals(+v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{[1, 2, 3, 4].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
          </Select></div>
      </>}
      result={<div className="space-y-3">
        <div className="text-xs uppercase text-muted-foreground">Meal schedule</div>
        <ul className="space-y-2">
          {times.map((t, i) => (
            <li key={t} className="flex items-baseline justify-between border-b border-border/40 pb-2 last:border-0">
              <span className="font-medium">Meal {i + 1} — {t}</span>
              <span className="text-primary font-display text-lg">{perMeal} kcal</span>
            </li>
          ))}
        </ul>
      </div>}
    />
  );
}

/* ─────────── Medication ─────────── */
export function MedicationCalculator() {
  const [weight, setWeight] = useState(10); // kg
  const [dose, setDose] = useState(5);      // mg/kg
  const [conc, setConc] = useState(0);      // mg/ml (optional)
  const totalMg = weight * dose;
  const ml = conc > 0 ? totalMg / conc : null;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Weight (kg)</Label>
          <Input type="number" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Prescribed dose (mg/kg)</Label>
          <Input type="number" value={dose} onChange={(e) => setDose(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Concentration (mg/ml) — optional</Label>
          <Input type="number" value={conc} onChange={(e) => setConc(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-3">
        <BigResult value={`${totalMg.toFixed(1)} mg`} label="Total dose" />
        {ml !== null && <div className="text-center text-sm text-muted-foreground">≈ <span className="font-medium text-foreground">{ml.toFixed(2)} ml</span> at {conc} mg/ml</div>}
      </div>}
    />
  );
}

/* ─────────── Insurance ─────────── */
export function InsuranceCalculator() {
  const [premium, setPremium] = useState(45);
  const [deductible, setDeductible] = useState(250);
  const [reimb, setReimb] = useState(80);
  const [expected, setExpected] = useState(800);
  const annualPremium = premium * 12;
  const covered = Math.max(0, expected - deductible) * (reimb / 100);
  const netCost = annualPremium - covered;
  const worthIt = covered > annualPremium;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Monthly premium ($)</Label><Input type="number" value={premium} onChange={(e) => setPremium(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Deductible ($)</Label><Input type="number" value={deductible} onChange={(e) => setDeductible(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Reimbursement (%)</Label><Input type="number" value={reimb} onChange={(e) => setReimb(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Expected vet claims ($/yr)</Label><Input type="number" value={expected} onChange={(e) => setExpected(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-4">
        <BigResult value={worthIt ? "Likely worth it" : "Break-even"} label="Verdict" />
        <ResultList items={[
          { label: "Annual premium", value: `$${annualPremium}` },
          { label: "Est. covered", value: `$${covered.toFixed(0)}` },
          { label: "Net cost", value: `$${netCost.toFixed(0)}` },
        ]} />
      </div>}
    />
  );
}

/* ─────────── Birthday Age ─────────── */
export function BirthdayAgeCalculator() {
  const [dob, setDob] = useState(new Date(Date.now() - 3.15e10).toISOString().slice(0, 10));
  const now = new Date();
  const birth = new Date(dob);
  let y = now.getFullYear() - birth.getFullYear();
  let m = now.getMonth() - birth.getMonth();
  let d = now.getDate() - birth.getDate();
  if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < now) nextBday.setFullYear(nextBday.getFullYear() + 1);
  const daysUntil = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000);
  return (
    <CalculatorLayout
      form={<div><Label>Pet's birthday</Label>
        <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1.5" /></div>}
      result={<div className="space-y-4">
        <BigResult value={`${y}y ${m}m ${d}d`} label="Current age" />
        <div className="text-center text-sm text-muted-foreground">Next birthday in <span className="font-medium text-foreground">{daysUntil} days</span></div>
      </div>}
    />
  );
}

/* ─────────── Sitter rate ─────────── */
export function SitterRateCalculator() {
  const [visit, setVisit] = useState<"30" | "60" | "overnight">("30");
  const [pets, setPets] = useState(1);
  const baseRates = { "30": [20, 30], "60": [30, 45], overnight: [75, 110] };
  const [low, high] = baseRates[visit];
  const extra = (pets - 1) * 5;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Visit type</Label>
          <Select value={visit} onValueChange={(v: "30" | "60" | "overnight") => setVisit(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30-minute drop-in</SelectItem>
              <SelectItem value="60">60-minute visit</SelectItem>
              <SelectItem value="overnight">Overnight stay</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Number of pets</Label>
          <Input type="number" min={1} value={pets} onChange={(e) => setPets(+e.target.value || 1)} className="mt-1.5" /></div>
      </>}
      result={<BigResult value={`$${low + extra}–$${high + extra}`} label="Fair rate range" unit="per visit" />}
    />
  );
}

/* ─────────── Boarding cost ─────────── */
export function BoardingCostEstimator() {
  const [nights, setNights] = useState(5);
  const [tier, setTier] = useState<"basic" | "standard" | "premium">("standard");
  const [pets, setPets] = useState(1);
  const perNight = { basic: 35, standard: 55, premium: 85 }[tier];
  const total = nights * perNight * pets;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Number of nights</Label><Input type="number" min={1} value={nights} onChange={(e) => setNights(+e.target.value || 1)} className="mt-1.5" /></div>
        <div><Label>Boarding tier</Label>
          <Select value={tier} onValueChange={(v: "basic" | "standard" | "premium") => setTier(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic kennel (~$35/night)</SelectItem>
              <SelectItem value="standard">Standard (~$55/night)</SelectItem>
              <SelectItem value="premium">Premium suite (~$85/night)</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Number of pets</Label><Input type="number" min={1} value={pets} onChange={(e) => setPets(+e.target.value || 1)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-3">
        <BigResult value={`$${total}`} label="Estimated total" />
        <div className="text-center text-sm text-muted-foreground">{nights} nights × ${perNight} × {pets} pet{pets > 1 ? "s" : ""}</div>
      </div>}
    />
  );
}

/* ─────────── Multi-pet cost ─────────── */
export function MultiPetCostCalculator() {
  const [dogs, setDogs] = useState(1);
  const [cats, setCats] = useState(0);
  const [small, setSmall] = useState(0);
  const perYear = dogs * 1800 + cats * 1100 + small * 400;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Number of dogs</Label><Input type="number" min={0} value={dogs} onChange={(e) => setDogs(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Number of cats</Label><Input type="number" min={0} value={cats} onChange={(e) => setCats(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Small pets (rabbit, bird…)</Label><Input type="number" min={0} value={small} onChange={(e) => setSmall(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-3">
        <BigResult value={`$${perYear.toLocaleString()}`} label="Combined annual cost" />
        <div className="text-center text-sm text-muted-foreground">Rough averages per pet type</div>
      </div>}
    />
  );
}

/* ─────────── Vaccine Reminder ─────────── */
export function VaccineReminder() {
  const [vaccine, setVaccine] = useState<"rabies" | "core" | "bordetella">("core");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const monthsMap = { rabies: 36, core: 12, bordetella: 6 };
  const next = addDays(new Date(date), monthsMap[vaccine] * 30);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Vaccine</Label>
          <Select value={vaccine} onValueChange={(v: "rabies" | "core" | "bordetella") => setVaccine(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rabies">Rabies (3-year)</SelectItem>
              <SelectItem value="core">Core DAPP / FVRCP (annual)</SelectItem>
              <SelectItem value="bordetella">Bordetella (6-month)</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Last given</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" /></div>
      </>}
      result={<BigResult value={formatDate(next)} label="Next booster due" />}
    />
  );
}

/* ─────────── Simple guide component (for "guide" layouts w/o checklist) ─────────── */
export function SimpleGuide({ children }: { children: React.ReactNode }) {
  return <div className="prose prose-neutral max-w-none dark:prose-invert">{children}</div>;
}
