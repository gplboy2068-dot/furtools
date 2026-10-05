import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout, GeneratorLayout } from "@/components/layouts/tool-layouts";
import { Sparkles, Trash2 } from "lucide-react";
import { AiNameGenerator } from "@/components/tools/ai-name-generator";
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
export function CalorieCalculator({ species, slug }: { species: Species; slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.calorieCalculator";
  const [weight, setWeight] = useState(species === "dog" ? 30 : 10);
  const [activity, setActivity] = useState<string>(species === "dog" ? "moderate" : "indoor");
  const [stage, setStage] = useState<string>("adult");
  const kcal = useMemo(() => {
    if (species === "dog")
      return Math.round(dogMER(weight, activity as DogActivity, stage as DogStage));
    return Math.round(catMER(weight, activity as CatActivity, stage as CatStage));
  }, [species, weight, activity, stage]);
  const activityOpts = species === "dog"
    ? ["low", "moderate", "active", "working"]
    : ["indoor", "active", "outdoor"];
  const stageOpts = species === "dog"
    ? ["puppy", "adult", "senior"]
    : ["kitten", "adult", "senior"];

  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t(`${p}.ui.weightLabel`)}</Label>
          <Input type="number" min={1} value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t(`${p}.ui.activityLabel`)}</Label>
          <Select value={activity} onValueChange={setActivity}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{activityOpts.map((v) => <SelectItem key={v} value={v}>{t(`${p}.ui.activityOptions.${v}`)}</SelectItem>)}</SelectContent>
          </Select></div>
        <div><Label>{t(`${p}.ui.stageLabel`)}</Label>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{stageOpts.map((v) => <SelectItem key={v} value={v}>{t(`${p}.ui.stageOptions.${v}`)}</SelectItem>)}</SelectContent>
          </Select></div>
      </>}
      result={<div className="space-y-4">
        <BigResult value={kcal} label={t(`${p}.ui.resultLabel`)} unit={t(`${p}.ui.resultUnit`)} />
        <div className="border-t border-border/50 pt-4">
          <ResultList items={[
            { label: t(`${p}.ui.rerLabel`), value: `${Math.round(rer(weight))} kcal` },
            { label: t(`${p}.ui.weightKgLabel`), value: (weight / 2.2046).toFixed(1) },
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
export function IdealWeightCalculator({ species, slug }: { species: Species; slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.idealWeight";
  const ranges = species === "dog" ? DOG_WEIGHT_RANGES : CAT_WEIGHT_RANGES;
  const [size, setSize] = useState<string>(species === "dog" ? "medium" : "medium");
  const [low, high] = ranges[size];
  return (
    <CalculatorLayout
      form={<div><Label>{t(`${p}.ui.sizeLabel`)}</Label>
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(ranges).map((k) => (
            <SelectItem key={k} value={k}>{t(`${p}.ui.sizes.${k}`)}</SelectItem>
          ))}</SelectContent>
        </Select></div>}
      result={<BigResult value={`${low}–${high}`} label={t(`${p}.ui.resultLabel`)} unit={t(`${p}.ui.resultUnit`)} />}
    />
  );
}

/* ─────────── BCS ─────────── */
export function BCSCalculator({ species, slug }: { species: Species; slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.bcs";
  const [ribs, setRibs] = useState<"easy" | "some" | "hard">("easy");
  const [waist, setWaist] = useState<"visible" | "faint" | "none">("visible");
  const score = useMemo(() => {
    const rMap = { easy: 4, some: 6, hard: 8 } as const;
    const wMap = { visible: 4, faint: 6, none: 8 } as const;
    return Math.round((rMap[ribs] + wMap[waist]) / 2);
  }, [ribs, waist]);
  const verdictKey = score <= 3 ? "underweight" : score <= 5 ? "ideal" : score <= 6 ? "overweight" : "obese";
  const label = t(`${p}.ui.verdict.${verdictKey}`);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t(`${p}.ui.ribsLabel`)}</Label>
          <Select value={ribs} onValueChange={(v: "easy" | "some" | "hard") => setRibs(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">{t(`${p}.ui.ribsOptions.easy`)}</SelectItem>
              <SelectItem value="some">{t(`${p}.ui.ribsOptions.some`)}</SelectItem>
              <SelectItem value="hard">{t(`${p}.ui.ribsOptions.hard`)}</SelectItem>
            </SelectContent></Select></div>
        <div><Label>{t(`${p}.ui.waistLabel`)}</Label>
          <Select value={waist} onValueChange={(v: "visible" | "faint" | "none") => setWaist(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="visible">{t(`${p}.ui.waistOptions.visible`)}</SelectItem>
              <SelectItem value="faint">{t(`${p}.ui.waistOptions.faint`)}</SelectItem>
              <SelectItem value="none">{t(`${p}.ui.waistOptions.none`)}</SelectItem>
            </SelectContent></Select></div>
        <p className="text-xs text-muted-foreground">{t(`${p}.ui.hint`, { species: t(`${p}.ui.speciesPlural`) })}</p>
      </>}
      result={<>
        <BigResult value={`${score}/9`} label={t(`${p}.ui.resultLabel`)} unit={label} />
      </>}
    />
  );
}

/* ─────────── Treat calories ─────────── */
export function TreatCalorieCalculator({ species, slug }: { species: Species; slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.treatCalorie";
  const [daily, setDaily] = useState(species === "dog" ? 900 : 220);
  const [treatKcal, setTreatKcal] = useState(species === "dog" ? 25 : 3);
  const max = Math.floor((daily * 0.1) / Math.max(treatKcal, 0.01));
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t(`${p}.ui.dailyLabel`)}</Label>
          <Input type="number" min={0} value={daily} onChange={(e) => setDaily(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t(`${p}.ui.perTreatLabel`)}</Label>
          <Input type="number" min={0} value={treatKcal} onChange={(e) => setTreatKcal(+e.target.value || 0)} className="mt-1.5" />
          <p className="mt-1 text-xs text-muted-foreground">{t(`${p}.ui.labelHint`)}</p></div>
      </>}
      result={<>
        <BigResult value={max} label={t(`${p}.ui.resultLabel`)} unit={t(`${p}.ui.resultUnit`)} />
        <p className="mt-4 text-xs text-muted-foreground text-center">{t(`${p}.ui.treatBudget`, { kcal: Math.round(daily * 0.1) })}</p>
      </>}
    />
  );
}

/* ─────────── Pregnancy ─────────── */
export function PregnancyCalculator({ species, gestation, slug }: { species: Species; gestation: number; slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.pregnancy";
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const start = new Date(date);
  const due = addDays(start, gestation);
  const milestones = [
    { day: 21, key: "ultrasound" },
    { day: 30, key: "nipples" },
    { day: 45, key: "palpable" },
    { day: gestation - 7, key: "whelpingBox" },
    { day: gestation, key: "dueDate" },
  ];
  return (
    <CalculatorLayout
      form={<div><Label>{species === "dog" ? t(`${p}.ui.breedingDateLabel`) : t(`${p}.ui.matingDateLabel`)}</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" />
        <p className="mt-2 text-xs text-muted-foreground">{t(`${p}.ui.gestationNote`, { gestation })}</p></div>}
      result={<div className="space-y-4">
        <BigResult value={formatDate(due)} label={t(`${p}.ui.resultLabel`)} />
        <ul className="space-y-2 border-t border-border/50 pt-4 text-sm">
          {milestones.map((m) => (
            <li key={m.day} className="flex justify-between gap-3">
              <span className="text-muted-foreground">{t(`${p}.ui.dayLabel`, { day: m.day })}</span>
              <span className="font-medium text-right">{t(`${p}.ui.milestones.${m.key}`)}</span>
              <span className="text-muted-foreground">{formatDate(addDays(start, m.day))}</span>
            </li>
          ))}
        </ul>
      </div>}
    />
  );
}

/* ─────────── Vaccination Schedule ─────────── */
export function VaccinationSchedule({ species, slug }: { species: Species; slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.vaccination";
  const [weeks, setWeeks] = useState(8);
  const list = t(`${p}.ui.vaccines.${species}`, { returnObjects: true }) as { week: number; name: string }[];
  const upcoming = list.filter((v) => v.week >= weeks);
  return (
    <CalculatorLayout
      form={<div><Label>{t(`${p}.ui.ageLabel`)}</Label>
        <Input type="number" min={0} value={weeks} onChange={(e) => setWeeks(+e.target.value || 0)} className="mt-1.5" />
        <p className="mt-2 text-xs text-muted-foreground">{t(`${p}.ui.ageHint`)}</p></div>}
      result={<div className="space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t(`${p}.ui.heading`)}</div>
        <ul className="space-y-2">
          {upcoming.length === 0 && <li className="text-sm text-muted-foreground">{t(`${p}.ui.emptyState`)}</li>}
          {upcoming.map((v) => (
            <li key={v.week} className="flex items-baseline justify-between gap-2 border-b border-border/40 pb-2 last:border-0">
              <span className="text-sm font-medium">{v.name}</span>
              <span className="text-xs text-muted-foreground">{t(`${p}.ui.weekLabel`, { week: v.week })}</span>
            </li>
          ))}
        </ul>
      </div>}
    />
  );
}

/* ─────────── Cost ─────────── */
export function CostCalculator({ species = "dog", slug }: { species?: Species | "generic"; slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.cost";
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
          <div><Label>{t(`${p}.ui.foodLabel`)}</Label><Input type="number" value={food} onChange={(e) => setFood(+e.target.value || 0)} className="mt-1.5" /></div>
          <div><Label>{t(`${p}.ui.insuranceLabel`)}</Label><Input type="number" value={insurance} onChange={(e) => setInsurance(+e.target.value || 0)} className="mt-1.5" /></div>
          <div><Label>{t(`${p}.ui.otherLabel`)}</Label><Input type="number" value={other} onChange={(e) => setOther(+e.target.value || 0)} className="mt-1.5" /></div>
          <div><Label>{t(`${p}.ui.vetLabel`)}</Label><Input type="number" value={vet} onChange={(e) => setVet(+e.target.value || 0)} className="mt-1.5" /></div>
          <div><Label>{t(`${p}.ui.yearsLabel`)}</Label><Input type="number" value={years} onChange={(e) => setYears(+e.target.value || 0)} className="mt-1.5" /></div>
        </div>
      </>}
      result={<div className="space-y-4">
        <BigResult value={`$${annual.toLocaleString()}`} label={t(`${p}.ui.resultLabel`)} />
        <div className="border-t border-border/50 pt-4">
          <ResultList items={[
            { label: t(`${p}.ui.monthlyLabel`), value: `$${monthly}` },
            { label: t(`${p}.ui.lifetimeLabel`), value: `$${lifetime.toLocaleString()}` },
          ]} />
        </div>
      </div>}
    />
  );
}

/* ─────────── Life Expectancy ─────────── */
export function LifeExpectancyCalculator({ species, slug }: { species: Species; slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.lifeExpectancy";
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
        <div><Label>{t(`${p}.ui.breedSizeLabel`)}</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(dogRanges).map((k) => <SelectItem key={k} value={k}>{t(`${p}.ui.sizes.${k}`)}</SelectItem>)}
            </SelectContent>
          </Select></div>
      ) : (
        <div><Label>{t(`${p}.ui.lifestyleLabel`)}</Label>
          <Select value={indoor} onValueChange={(v: "indoor" | "outdoor") => setIndoor(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="indoor">{t(`${p}.ui.lifestyleOptions.indoor`)}</SelectItem>
              <SelectItem value="outdoor">{t(`${p}.ui.lifestyleOptions.outdoor`)}</SelectItem>
            </SelectContent>
          </Select></div>
      )}
      result={<BigResult value={`${range[0]}–${range[1]}`} label={t(`${p}.ui.resultLabel`)} unit={t(`${p}.ui.resultUnit`)} />}
    />
  );
}

/* ─────────── Water ─────────── */
export function WaterCalculator({ species, slug }: { species: Species; slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.waterCalculator";
  const [weight, setWeight] = useState(species === "dog" ? 40 : 10);
  const [climate, setClimate] = useState<"cool" | "temperate" | "hot">("temperate");
  const factor = species === "dog" ? 1 : 0.8;
  const climateAdj = climate === "cool" ? 0.9 : climate === "hot" ? 1.3 : 1;
  const oz = Math.round(weight * factor * climateAdj);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t(`${p}.ui.weightLabel`)}</Label>
          <Input type="number" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t(`${p}.ui.climateLabel`)}</Label>
          <Select value={climate} onValueChange={(v: "cool" | "temperate" | "hot") => setClimate(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cool">{t(`${p}.ui.climateOptions.cool`)}</SelectItem>
              <SelectItem value="temperate">{t(`${p}.ui.climateOptions.temperate`)}</SelectItem>
              <SelectItem value="hot">{t(`${p}.ui.climateOptions.hot`)}</SelectItem>
            </SelectContent>
          </Select></div>
      </>}
      result={<div className="space-y-3 text-center">
        <BigResult value={oz} label={t(`${p}.ui.resultLabel`)} unit={t(`${p}.ui.resultUnit`, { ml: Math.round(oz * 29.5) })} />
      </div>}
    />
  );
}

/* ─────────── Grooming ─────────── */
export function GroomingSchedule({ species, slug }: { species: Species; slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.grooming";
  const coatLabels = t(`${p}.ui.coatLabels.${species}`, { returnObjects: true }) as Record<string, string>;
  const types = Object.keys(coatLabels);
  const [coat, setCoat] = useState(types[0]);
  const lines = t(`${p}.ui.schedule.${species}.${coat}`, { returnObjects: true }) as string[];
  return (
    <CalculatorLayout
      form={<div><Label>{t(`${p}.ui.coatLabel`)}</Label>
        <Select value={coat} onValueChange={setCoat}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>{types.map((ct) => <SelectItem key={ct} value={ct}>{coatLabels[ct]}</SelectItem>)}</SelectContent>
        </Select></div>}
      result={<div className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{t(`${p}.ui.heading`)}</div>
        <ul className="space-y-2 text-sm">
          {lines.map((line) => (
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
  slug,
}: { storageKey: string; slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.checklist";
  const groups = t(`${p}.ui.groups`, { returnObjects: true }) as { title: string; items: string[] }[];
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
          <span className="font-medium">{t(`${p}.ui.progress`)}</span>
          <span className="text-muted-foreground">{completed} / {total}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(completed / total) * 100 || 0}%` }} />
        </div>
      </div>
      {groups.map((g, gi) => (
        <div key={g.title}>
          <h3 className="font-display text-lg font-semibold">{g.title}</h3>
          <ul className="mt-3 space-y-2">
            {g.items.map((item, ii) => {
              const id = `${gi}:${ii}`;
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
const NAME_BANKS: Record<string, string[]> = {
  cute: ["Biscuit", "Peanut", "Waffle", "Mochi", "Poppy", "Beans", "Honey", "Ollie", "Milo", "Pip", "Noodle", "Muffin", "Toast", "Boba"],
  classic: ["Max", "Charlie", "Bella", "Lucy", "Rocky", "Daisy", "Cooper", "Ruby", "Sadie", "Duke", "Simba", "Luna"],
  nature: ["Willow", "River", "Sage", "Aspen", "Fern", "Juniper", "Cedar", "Meadow", "Birch", "Cloud", "Sunny", "Stone"],
  cozy: ["Marshmallow", "Cookie", "Pumpkin", "Cinnamon", "Butter", "Ginger", "Latte", "Custard", "Caramel", "Nutmeg"],
  mythology: ["Zeus", "Odin", "Freya", "Athena", "Loki", "Thor", "Selene", "Hera", "Orion", "Nyx"],
  minimalist: ["Ivy", "Ash", "Kai", "Zen", "Fox", "Rio", "Nix", "Ada", "Uma"],
};

export function UniversalNameGenerator({ species = "pet", slug }: { species?: string; slug?: string } = {}) {
  return <AiNameGenerator species={species} vibes={Object.keys(NAME_BANKS)} seedNames={NAME_BANKS} slug={slug} />;
}

/* ─────────── Expense Tracker ─────────── */
interface Expense { id: string; date: string; category: string; amount: number; note: string }
const EXPENSE_CATEGORIES = ["food", "vet", "grooming", "toys", "insurance", "other"];
const EXPENSE_CATEGORY_VALUES: Record<string, string> = {
  food: "Food", vet: "Vet", grooming: "Grooming", toys: "Toys", insurance: "Insurance", other: "Other",
};
export function ExpenseTracker({ slug }: { slug?: string } = {}) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.expenseTracker";
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
            {EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={EXPENSE_CATEGORY_VALUES[c]}>{t(`${p}.ui.categories.${c}`)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="number" placeholder={t(`${p}.ui.amountPlaceholder`)} value={amount || ""} onChange={(e) => setAmount(+e.target.value || 0)} />
        <Input placeholder={t(`${p}.ui.notePlaceholder`)} value={note} onChange={(e) => setNote(e.target.value)} />
        <Button onClick={() => {
          if (!amount) return;
          setEntries((es) => [{ id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), category, amount, note }, ...es]);
          setAmount(0); setNote("");
        }}>{t(`${p}.ui.addButton`)}</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-cream p-4"><div className="text-xs uppercase text-muted-foreground">{t(`${p}.ui.thisMonthLabel`)}</div>
          <div className="mt-1 font-display text-3xl font-semibold text-primary">${monthly.toFixed(2)}</div></div>
        <div className="rounded-xl bg-cream p-4"><div className="text-xs uppercase text-muted-foreground">{t(`${p}.ui.allTimeLabel`)}</div>
          <div className="mt-1 font-display text-3xl font-semibold">${total.toFixed(2)}</div></div>
      </div>
      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e.id} className="flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2 text-sm">
            <span className="w-24 text-muted-foreground">{e.date}</span>
            <span className="w-24 font-medium">{t(`${p}.ui.categories.${e.category.toLowerCase()}`, { defaultValue: e.category })}</span>
            <span className="flex-1 text-muted-foreground">{e.note}</span>
            <span className="font-medium">${e.amount.toFixed(2)}</span>
            <button onClick={() => setEntries((es) => es.filter((x) => x.id !== e.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
          </li>
        ))}
        {entries.length === 0 && <li className="text-center text-sm text-muted-foreground py-6">{t(`${p}.ui.emptyState`)}</li>}
      </ul>
    </div>
  );
}

/* ─────────── Feeding Planner ─────────── */
export function FeedingPlanner({ slug }: { slug?: string } = {}) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.feedingPlanner";
  const [kcal, setKcal] = useState(800);
  const [meals, setMeals] = useState(2);
  const perMeal = Math.round(kcal / Math.max(meals, 1));
  const times = ["8:00 AM", "1:00 PM", "6:00 PM", "10:00 PM"].slice(0, meals);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t(`${p}.ui.dailyLabel`)}</Label>
          <Input type="number" value={kcal} onChange={(e) => setKcal(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t(`${p}.ui.mealsLabel`)}</Label>
          <Select value={String(meals)} onValueChange={(v) => setMeals(+v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{[1, 2, 3, 4].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
          </Select></div>
      </>}
      result={<div className="space-y-3">
        <div className="text-xs uppercase text-muted-foreground">{t(`${p}.ui.scheduleHeading`)}</div>
        <ul className="space-y-2">
          {times.map((time, i) => (
            <li key={time} className="flex items-baseline justify-between border-b border-border/40 pb-2 last:border-0">
              <span className="font-medium">{t(`${p}.ui.mealItem`, { n: i + 1, time })}</span>
              <span className="text-primary font-display text-lg">{perMeal} kcal</span>
            </li>
          ))}
        </ul>
      </div>}
    />
  );
}

/* ─────────── Medication ─────────── */
export function MedicationCalculator({ slug }: { slug?: string } = {}) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.medication";
  const [weight, setWeight] = useState(10); // kg
  const [dose, setDose] = useState(5);      // mg/kg
  const [conc, setConc] = useState(0);      // mg/ml (optional)
  const totalMg = weight * dose;
  const ml = conc > 0 ? totalMg / conc : null;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t(`${p}.ui.weightLabel`)}</Label>
          <Input type="number" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t(`${p}.ui.doseLabel`)}</Label>
          <Input type="number" value={dose} onChange={(e) => setDose(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t(`${p}.ui.concLabel`)}</Label>
          <Input type="number" value={conc} onChange={(e) => setConc(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-3">
        <BigResult value={`${totalMg.toFixed(1)} mg`} label={t(`${p}.ui.resultLabel`)} />
        {ml !== null && <div className="text-center text-sm text-muted-foreground">≈ <span className="font-medium text-foreground">{t(`${p}.ui.volumeValue`, { ml: ml.toFixed(2) })}</span> {t(`${p}.ui.atConcentration`, { conc })}</div>}
      </div>}
    />
  );
}

/* ─────────── Insurance ─────────── */
export function InsuranceCalculator({ slug }: { slug?: string } = {}) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.insurance";
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
        <div><Label>{t(`${p}.ui.premiumLabel`)}</Label><Input type="number" value={premium} onChange={(e) => setPremium(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t(`${p}.ui.deductibleLabel`)}</Label><Input type="number" value={deductible} onChange={(e) => setDeductible(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t(`${p}.ui.reimbursementLabel`)}</Label><Input type="number" value={reimb} onChange={(e) => setReimb(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t(`${p}.ui.expectedLabel`)}</Label><Input type="number" value={expected} onChange={(e) => setExpected(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-4">
        <BigResult value={worthIt ? t(`${p}.ui.verdict.worthIt`) : t(`${p}.ui.verdict.breakEven`)} label={t(`${p}.ui.verdictLabel`)} />
        <ResultList items={[
          { label: t(`${p}.ui.annualPremiumLabel`), value: `$${annualPremium}` },
          { label: t(`${p}.ui.coveredLabel`), value: `$${covered.toFixed(0)}` },
          { label: t(`${p}.ui.netCostLabel`), value: `$${netCost.toFixed(0)}` },
        ]} />
      </div>}
    />
  );
}

/* ─────────── Birthday Age ─────────── */
export function BirthdayAgeCalculator({ slug }: { slug?: string } = {}) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.birthdayAge";
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
      form={<div><Label>{t(`${p}.ui.birthdayLabel`)}</Label>
        <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1.5" /></div>}
      result={<div className="space-y-4">
        <BigResult value={t(`${p}.ui.ageValue`, { y, m, d })} label={t(`${p}.ui.ageLabel`)} />
        <div className="text-center text-sm text-muted-foreground">{t(`${p}.ui.nextBirthdayPrefix`)} <span className="font-medium text-foreground">{t(`${p}.ui.daysValue`, { days: daysUntil })}</span></div>
      </div>}
    />
  );
}

/* ─────────── Sitter rate ─────────── */
export function SitterRateCalculator({ slug }: { slug?: string } = {}) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.sitterRate";
  const [visit, setVisit] = useState<"30" | "60" | "overnight">("30");
  const [pets, setPets] = useState(1);
  const baseRates = { "30": [20, 30], "60": [30, 45], overnight: [75, 110] };
  const [low, high] = baseRates[visit];
  const extra = (pets - 1) * 5;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t(`${p}.ui.visitLabel`)}</Label>
          <Select value={visit} onValueChange={(v: "30" | "60" | "overnight") => setVisit(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30">{t(`${p}.ui.visitOptions.30`)}</SelectItem>
              <SelectItem value="60">{t(`${p}.ui.visitOptions.60`)}</SelectItem>
              <SelectItem value="overnight">{t(`${p}.ui.visitOptions.overnight`)}</SelectItem>
            </SelectContent></Select></div>
        <div><Label>{t(`${p}.ui.petsLabel`)}</Label>
          <Input type="number" min={1} value={pets} onChange={(e) => setPets(+e.target.value || 1)} className="mt-1.5" /></div>
      </>}
      result={<BigResult value={`$${low + extra}–$${high + extra}`} label={t(`${p}.ui.resultLabel`)} unit={t(`${p}.ui.resultUnit`)} />}
    />
  );
}

/* ─────────── Boarding cost ─────────── */
export function BoardingCostEstimator({ slug }: { slug?: string } = {}) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.boardingCost";
  const [nights, setNights] = useState(5);
  const [tier, setTier] = useState<"basic" | "standard" | "premium">("standard");
  const [pets, setPets] = useState(1);
  const perNight = { basic: 35, standard: 55, premium: 85 }[tier];
  const total = nights * perNight * pets;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t(`${p}.ui.nightsLabel`)}</Label><Input type="number" min={1} value={nights} onChange={(e) => setNights(+e.target.value || 1)} className="mt-1.5" /></div>
        <div><Label>{t(`${p}.ui.tierLabel`)}</Label>
          <Select value={tier} onValueChange={(v: "basic" | "standard" | "premium") => setTier(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">{t(`${p}.ui.tierOptions.basic`)}</SelectItem>
              <SelectItem value="standard">{t(`${p}.ui.tierOptions.standard`)}</SelectItem>
              <SelectItem value="premium">{t(`${p}.ui.tierOptions.premium`)}</SelectItem>
            </SelectContent></Select></div>
        <div><Label>{t(`${p}.ui.petsLabel`)}</Label><Input type="number" min={1} value={pets} onChange={(e) => setPets(+e.target.value || 1)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-3">
        <BigResult value={`$${total}`} label={t(`${p}.ui.resultLabel`)} />
        <div className="text-center text-sm text-muted-foreground">{t(`${p}.ui.breakdown`, { nights, perNight, pets, petWord: pets > 1 ? t(`${p}.ui.petPlural`) : t(`${p}.ui.petSingular`) })}</div>
      </div>}
    />
  );
}

/* ─────────── Multi-pet cost ─────────── */
export function MultiPetCostCalculator({ slug }: { slug?: string } = {}) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.multiPetCost";
  const [dogs, setDogs] = useState(1);
  const [cats, setCats] = useState(0);
  const [small, setSmall] = useState(0);
  const perYear = dogs * 1800 + cats * 1100 + small * 400;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t(`${p}.ui.dogsLabel`)}</Label><Input type="number" min={0} value={dogs} onChange={(e) => setDogs(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t(`${p}.ui.catsLabel`)}</Label><Input type="number" min={0} value={cats} onChange={(e) => setCats(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t(`${p}.ui.smallLabel`)}</Label><Input type="number" min={0} value={small} onChange={(e) => setSmall(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-3">
        <BigResult value={`$${perYear.toLocaleString()}`} label={t(`${p}.ui.resultLabel`)} />
        <div className="text-center text-sm text-muted-foreground">{t(`${p}.ui.note`)}</div>
      </div>}
    />
  );
}

/* ─────────── Vaccine Reminder ─────────── */
export function VaccineReminder({ slug }: { slug?: string } = {}) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.vaccineReminder";
  const [vaccine, setVaccine] = useState<"rabies" | "core" | "bordetella">("core");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const monthsMap = { rabies: 36, core: 12, bordetella: 6 };
  const next = addDays(new Date(date), monthsMap[vaccine] * 30);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t(`${p}.ui.vaccineLabel`)}</Label>
          <Select value={vaccine} onValueChange={(v: "rabies" | "core" | "bordetella") => setVaccine(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rabies">{t(`${p}.ui.vaccineOptions.rabies`)}</SelectItem>
              <SelectItem value="core">{t(`${p}.ui.vaccineOptions.core`)}</SelectItem>
              <SelectItem value="bordetella">{t(`${p}.ui.vaccineOptions.bordetella`)}</SelectItem>
            </SelectContent></Select></div>
        <div><Label>{t(`${p}.ui.lastGivenLabel`)}</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" /></div>
      </>}
      result={<BigResult value={formatDate(next)} label={t(`${p}.ui.resultLabel`)} />}
    />
  );
}

/* ─────────── Simple guide component (for "guide" layouts w/o checklist) ─────────── */
export function SimpleGuide({ children }: { children: React.ReactNode }) {
  return <div className="prose prose-neutral max-w-none dark:prose-invert">{children}</div>;
}
