import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";
import { useTranslation } from "react-i18next";

/* ---------- localStorage helper ---------- */
function useLocalState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : initial; }
    catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }, [key, value]);
  return [value, setValue];
}

function fmt(d: Date) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}

/* ═══════════════════════════════════════════════════════════
   1. HEAT CYCLE TRACKER (Dog / Cat / Rabbit)
═══════════════════════════════════════════════════════════ */
type HeatEvent = { id: string; date: string; stage: string; notes: string };
export function HeatCycleTracker() {
  const { t } = useTranslation("tools");
  const cycleInfo: Record<string, { intervalDays: number; heatDuration: string; note: string }> = {
    dog: { intervalDays: 180, heatDuration: t("heat-cycle-tracker.ui.dogDuration"), note: t("heat-cycle-tracker.ui.dogNote") },
    cat: { intervalDays: 21, heatDuration: t("heat-cycle-tracker.ui.catDuration"), note: t("heat-cycle-tracker.ui.catNote") },
    rabbit: { intervalDays: 16, heatDuration: t("heat-cycle-tracker.ui.rabbitDuration"), note: t("heat-cycle-tracker.ui.rabbitNote") },
  };
  const stageOptions = [
    { value: "Proestrus (bleeding starts)", label: t("heat-cycle-tracker.ui.stageProestrus") },
    { value: "Estrus (receptive to males)", label: t("heat-cycle-tracker.ui.stageEstrus") },
    { value: "Diestrus (cycle ending)", label: t("heat-cycle-tracker.ui.stageDiestrus") },
    { value: "Anestrus (rest phase)", label: t("heat-cycle-tracker.ui.stageAnestrus") },
    { value: "Behavioral change only", label: t("heat-cycle-tracker.ui.stageBehavioral") },
  ];
  const [species, setSpecies] = useState("dog");
  const [events, setEvents] = useLocalState<HeatEvent[]>("furtools:heat-cycle", []);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [stage, setStage] = useState("Proestrus (bleeding starts)");
  const [notes, setNotes] = useState("");
  const info = cycleInfo[species];
  const lastCycle = events[0];
  const nextExpected = lastCycle ? addDays(new Date(lastCycle.date), info.intervalDays) : null;

  const form = (
    <div className="space-y-3">
      <div>
        <Label>{t("heat-cycle-tracker.ui.speciesLabel")}</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="dog">{t("heat-cycle-tracker.ui.speciesDog")}</SelectItem>
            <SelectItem value="cat">{t("heat-cycle-tracker.ui.speciesCat")}</SelectItem>
            <SelectItem value="rabbit">{t("heat-cycle-tracker.ui.speciesRabbit")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>{t("heat-cycle-tracker.ui.dateLabel")}</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div>
        <Label>{t("heat-cycle-tracker.ui.stageLabel")}</Label>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {stageOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div><Label>{t("heat-cycle-tracker.ui.notesLabel")}</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("heat-cycle-tracker.ui.notesPlaceholder")} /></div>
      <Button
        onClick={() => {
          setEvents((prev) => [{ id: crypto.randomUUID(), date, stage, notes }, ...prev]);
          setNotes("");
        }}
      >{t("heat-cycle-tracker.ui.logButton")}</Button>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-background/60 p-3 text-sm">
        <div><strong>{t("heat-cycle-tracker.ui.typicalIntervalLabel")}</strong> {t("heat-cycle-tracker.ui.typicalIntervalValue", { days: info.intervalDays })}</div>
        <div><strong>{t("heat-cycle-tracker.ui.heatDurationLabel")}</strong> {info.heatDuration}</div>
        <p className="mt-1 text-xs text-muted-foreground">{info.note}</p>
      </div>
      {nextExpected && (
        <div className="rounded-lg bg-primary/10 p-3 text-sm">
          <strong>{t("heat-cycle-tracker.ui.nextCycleLabel")}</strong> {fmt(nextExpected)}
        </div>
      )}
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("heat-cycle-tracker.ui.emptyState")}</p>
      ) : (
        <ul className="space-y-2">
          {events.slice(0, 10).map((e) => (
            <li key={e.id} className="rounded-lg bg-background/60 p-3 text-xs">
              <div className="flex justify-between">
                <span className="font-medium">{fmt(new Date(e.date))}</span>
                <button className="text-destructive" onClick={() => setEvents((p) => p.filter((x) => x.id !== e.id))}>{t("heat-cycle-tracker.ui.deleteButton")}</button>
              </div>
              <div>{e.stage}</div>
              {e.notes && <div className="mt-1 text-muted-foreground">{e.notes}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   2. PREGNANCY CALENDAR (species-specific)
═══════════════════════════════════════════════════════════ */
export function PregnancyCalendarSpecies() {
  const { t } = useTranslation("tools");
  const gestation: Record<string, { days: number; label: string }> = {
    dog: { days: 63, label: t("pregnancy-calendar.ui.speciesDog") },
    cat: { days: 65, label: t("pregnancy-calendar.ui.speciesCat") },
    rabbit: { days: 31, label: t("pregnancy-calendar.ui.speciesRabbit") },
    "guinea-pig": { days: 68, label: t("pregnancy-calendar.ui.speciesGuineaPig") },
    hamster: { days: 18, label: t("pregnancy-calendar.ui.speciesHamster") },
    ferret: { days: 42, label: t("pregnancy-calendar.ui.speciesFerret") },
    horse: { days: 340, label: t("pregnancy-calendar.ui.speciesHorse") },
    goat: { days: 150, label: t("pregnancy-calendar.ui.speciesGoat") },
    sheep: { days: 147, label: t("pregnancy-calendar.ui.speciesSheep") },
  };
  const [species, setSpecies] = useState("dog");
  const [mated, setMated] = useState(new Date().toISOString().slice(0, 10));
  const g = gestation[species];
  const start = new Date(mated);
  const due = addDays(start, g.days);
  const week1 = addDays(start, Math.round(g.days * 0.33));
  const week2 = addDays(start, Math.round(g.days * 0.66));
  const nestingPrep = addDays(due, -10);

  const milestones = species === "dog" ? [
    { day: 21, label: t("pregnancy-calendar.ui.dogM21") },
    { day: 28, label: t("pregnancy-calendar.ui.dogM28") },
    { day: 45, label: t("pregnancy-calendar.ui.dogM45") },
    { day: 55, label: t("pregnancy-calendar.ui.dogM55") },
    { day: 60, label: t("pregnancy-calendar.ui.dogM60") },
    { day: 63, label: t("pregnancy-calendar.ui.dogM63") },
  ] : species === "cat" ? [
    { day: 21, label: t("pregnancy-calendar.ui.catM21") },
    { day: 28, label: t("pregnancy-calendar.ui.catM28") },
    { day: 50, label: t("pregnancy-calendar.ui.catM50") },
    { day: 58, label: t("pregnancy-calendar.ui.catM58") },
    { day: 65, label: t("pregnancy-calendar.ui.catM65") },
  ] : [
    { day: Math.round(g.days * 0.33), label: t("pregnancy-calendar.ui.genEarly") },
    { day: Math.round(g.days * 0.66), label: t("pregnancy-calendar.ui.genMid") },
    { day: g.days - 7, label: t("pregnancy-calendar.ui.genNest") },
    { day: g.days, label: t("pregnancy-calendar.ui.genBirth") },
  ];

  const form = (
    <div className="space-y-3">
      <div>
        <Label>{t("pregnancy-calendar.ui.speciesLabel")}</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(gestation).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div><Label>{t("pregnancy-calendar.ui.matingLabel")}</Label><Input type="date" value={mated} onChange={(e) => setMated(e.target.value)} /></div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-primary/10 p-3">
        <div className="text-xs uppercase text-muted-foreground">{t("pregnancy-calendar.ui.dueTitle")}</div>
        <div className="text-2xl font-semibold">{fmt(due)}</div>
        <div className="mt-1 text-xs text-muted-foreground">{t("pregnancy-calendar.ui.trimesterNote", { week1: fmt(week1), nesting: fmt(nestingPrep) })}</div>
      </div>
      <ul className="space-y-2">
        {milestones.map((m) => (
          <li key={m.day} className="rounded-lg bg-background/60 p-3 text-sm">
            <div className="flex justify-between">
              <strong>{t("pregnancy-calendar.ui.dayLabel", { day: m.day })}</strong>
              <span className="text-xs text-muted-foreground">{fmt(addDays(start, m.day))}</span>
            </div>
            <div className="text-xs text-muted-foreground">{m.label}</div>
          </li>
        ))}
      </ul>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   3. WHELPING / KITTENING PREP CHECKLIST
═══════════════════════════════════════════════════════════ */
export function WhelpingKitteningChecklist() {
  const { t } = useTranslation("tools");
  const groups = [
    { title: t("whelping-kittening-checklist.ui.groupBox"), items: [
      t("whelping-kittening-checklist.ui.box1"), t("whelping-kittening-checklist.ui.box2"),
      t("whelping-kittening-checklist.ui.box3"), t("whelping-kittening-checklist.ui.box4"),
      t("whelping-kittening-checklist.ui.box5"),
    ] },
    { title: t("whelping-kittening-checklist.ui.groupKit"), items: [
      t("whelping-kittening-checklist.ui.kit1"), t("whelping-kittening-checklist.ui.kit2"),
      t("whelping-kittening-checklist.ui.kit3"), t("whelping-kittening-checklist.ui.kit4"),
      t("whelping-kittening-checklist.ui.kit5"), t("whelping-kittening-checklist.ui.kit6"),
      t("whelping-kittening-checklist.ui.kit7"), t("whelping-kittening-checklist.ui.kit8"),
      t("whelping-kittening-checklist.ui.kit9"), t("whelping-kittening-checklist.ui.kit10"),
    ] },
    { title: t("whelping-kittening-checklist.ui.groupVet"), items: [
      t("whelping-kittening-checklist.ui.vet1"), t("whelping-kittening-checklist.ui.vet2"),
      t("whelping-kittening-checklist.ui.vet3"), t("whelping-kittening-checklist.ui.vet4"),
      t("whelping-kittening-checklist.ui.vet5"), t("whelping-kittening-checklist.ui.vet6"),
    ] },
    { title: t("whelping-kittening-checklist.ui.groupPostpartum"), items: [
      t("whelping-kittening-checklist.ui.post1"), t("whelping-kittening-checklist.ui.post2"),
      t("whelping-kittening-checklist.ui.post3"), t("whelping-kittening-checklist.ui.post4"),
      t("whelping-kittening-checklist.ui.post5"),
    ] },
  ];
  const [checked, setChecked] = useLocalState<Record<string, boolean>>("furtools:whelping-checklist", {});
  const total = groups.reduce((a, g) => a + g.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-primary/10 p-3 text-sm">
        {t("whelping-kittening-checklist.ui.progressLabel")}: <strong>{done} / {total}</strong> {t("whelping-kittening-checklist.ui.progressPct", { pct: Math.round((done / total) * 100) })}
      </div>
      {groups.map((g) => (
        <div key={g.title} className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">{g.title}</h3>
          <div className="space-y-2">
            {g.items.map((item) => {
              const k = `${g.title}::${item}`;
              return (
                <label key={k} className="flex cursor-pointer items-start gap-2 text-sm">
                  <Checkbox checked={!!checked[k]} onCheckedChange={(v) => setChecked((p) => ({ ...p, [k]: !!v }))} />
                  <span className={checked[k] ? "text-muted-foreground line-through" : ""}>{item}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. STUD FEE CALCULATOR
═══════════════════════════════════════════════════════════ */
export function StudFeeCalculator() {
  const { t } = useTranslation("tools");
  const [avgPuppyPrice, setAvgPuppyPrice] = useState(1500);
  const [avgLitterSize, setAvgLitterSize] = useState(6);
  const [studQuality, setStudQuality] = useState("titled");
  const [feeType, setFeeType] = useState<"cash" | "pick">("cash");

  const qualityMultiplier: Record<string, number> = {
    "pet-quality": 0.4,
    "titled": 1.0,
    "champion": 1.5,
    "top-producer": 2.2,
  };
  const suggestedCash = Math.round(avgPuppyPrice * qualityMultiplier[studQuality]);
  const pickPupValue = avgPuppyPrice;

  const form = (
    <div className="space-y-3">
      <div><Label>{t("stud-fee-calculator.ui.priceLabel")}</Label><Input type="number" value={avgPuppyPrice} onChange={(e) => setAvgPuppyPrice(+e.target.value || 0)} /></div>
      <div><Label>{t("stud-fee-calculator.ui.litterLabel")}</Label><Input type="number" value={avgLitterSize} onChange={(e) => setAvgLitterSize(+e.target.value || 1)} /></div>
      <div>
        <Label>{t("stud-fee-calculator.ui.qualityLabel")}</Label>
        <Select value={studQuality} onValueChange={setStudQuality}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="pet-quality">{t("stud-fee-calculator.ui.qualityPet")}</SelectItem>
            <SelectItem value="titled">{t("stud-fee-calculator.ui.qualityTitled")}</SelectItem>
            <SelectItem value="champion">{t("stud-fee-calculator.ui.qualityChampion")}</SelectItem>
            <SelectItem value="top-producer">{t("stud-fee-calculator.ui.qualityTop")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("stud-fee-calculator.ui.feeLabel")}</Label>
        <Select value={feeType} onValueChange={(v) => setFeeType(v as "cash" | "pick")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">{t("stud-fee-calculator.ui.feeCash")}</SelectItem>
            <SelectItem value="pick">{t("stud-fee-calculator.ui.feePick")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      {feeType === "cash" ? (
        <div className="rounded-lg bg-primary/10 p-3">
          <div className="text-xs uppercase text-muted-foreground">{t("stud-fee-calculator.ui.cashTitle")}</div>
          <div className="text-2xl font-semibold">${suggestedCash.toLocaleString()}</div>
          <p className="mt-1 text-xs text-muted-foreground">{t("stud-fee-calculator.ui.cashNote")}</p>
        </div>
      ) : (
        <div className="rounded-lg bg-primary/10 p-3">
          <div className="text-xs uppercase text-muted-foreground">{t("stud-fee-calculator.ui.pickTitle")}</div>
          <div className="text-2xl font-semibold">${pickPupValue.toLocaleString()}</div>
          <p className="mt-1 text-xs text-muted-foreground">{t("stud-fee-calculator.ui.pickNote")}</p>
        </div>
      )}
      <div className="rounded-lg bg-background/60 p-3 text-sm">
        <div><strong>{t("stud-fee-calculator.ui.revenueLabel")}</strong> {t("stud-fee-calculator.ui.revenueValue", { amount: (avgPuppyPrice * avgLitterSize).toLocaleString() })}</div>
        <div><strong>{t("stud-fee-calculator.ui.feePctLabel")}</strong> {t("stud-fee-calculator.ui.feePctValue", { pct: Math.round((suggestedCash / (avgPuppyPrice * avgLitterSize)) * 100) })}</div>
      </div>
      <div className="rounded-lg border bg-yellow-50 p-3 text-xs text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100">
        {t("stud-fee-calculator.ui.contractNote")}
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   5. GENETIC DIVERSITY / COI CALCULATOR
═══════════════════════════════════════════════════════════ */
export function GeneticDiversityCOI() {
  const { t } = useTranslation("tools");
  const [commonAncestors, setCommonAncestors] = useState(1);
  const [generations, setGenerations] = useState(5);
  // Wright's simplified inbreeding coefficient using shared ancestors N generations back
  // Approximation: COI ≈ Σ (0.5)^(n1+n2+1) for each shared ancestor path
  const coi = useMemo(() => {
    const perAncestor = Math.pow(0.5, generations * 2 + 1);
    return Math.min(1, commonAncestors * perAncestor) * 100;
  }, [commonAncestors, generations]);

  const band =
    coi < 6.25 ? { label: t("genetic-diversity-calculator.ui.bandLow"), color: "bg-green-500/15 text-green-700 dark:text-green-300", note: t("genetic-diversity-calculator.ui.noteLow") } :
    coi < 12.5 ? { label: t("genetic-diversity-calculator.ui.bandModerate"), color: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300", note: t("genetic-diversity-calculator.ui.noteModerate") } :
    coi < 25 ? { label: t("genetic-diversity-calculator.ui.bandHigh"), color: "bg-orange-500/15 text-orange-700 dark:text-orange-300", note: t("genetic-diversity-calculator.ui.noteHigh") } :
    { label: t("genetic-diversity-calculator.ui.bandVeryHigh"), color: "bg-red-500/15 text-red-700 dark:text-red-300", note: t("genetic-diversity-calculator.ui.noteVeryHigh") };

  const form = (
    <div className="space-y-3">
      <div><Label>{t("genetic-diversity-calculator.ui.ancestorsLabel")}</Label><Input type="number" min={0} value={commonAncestors} onChange={(e) => setCommonAncestors(+e.target.value || 0)} /></div>
      <div>
        <Label>{t("genetic-diversity-calculator.ui.generationsLabel")}</Label>
        <Select value={String(generations)} onValueChange={(v) => setGenerations(+v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <SelectItem key={n} value={String(n)}>{t("genetic-diversity-calculator.ui.generationsOption", { n })}</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="mt-1 text-xs text-muted-foreground">{t("genetic-diversity-calculator.ui.pedigreeHint")}</p>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-primary/10 p-3">
        <div className="text-xs uppercase text-muted-foreground">{t("genetic-diversity-calculator.ui.coiTitle")}</div>
        <div className="text-2xl font-semibold">{t("genetic-diversity-calculator.ui.coiValue", { coi: coi.toFixed(2) })}</div>
      </div>
      <div className={`rounded-lg p-3 text-sm ${band.color}`}>
        <strong>{band.label}</strong> — {band.note}
      </div>
      <div className="rounded-lg bg-background/60 p-3 text-xs text-muted-foreground">
        <p className="mb-1"><strong>{t("genetic-diversity-calculator.ui.refLabel")}</strong></p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>{t("genetic-diversity-calculator.ui.refBand1")}</li>
          <li>{t("genetic-diversity-calculator.ui.refBand2")}</li>
          <li>{t("genetic-diversity-calculator.ui.refBand3")}</li>
          <li>{t("genetic-diversity-calculator.ui.refBand4")}</li>
        </ul>
        <p className="mt-2">{t("genetic-diversity-calculator.ui.accurateNote")}</p>
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   6. PUPPY / KITTEN WEIGHT CHART
═══════════════════════════════════════════════════════════ */
type WeightEntry = { id: string; day: number; grams: number };
export function PuppyKittenWeightChart() {
  const { t } = useTranslation("tools");
  const [species, setSpecies] = useState<"puppy" | "kitten">("puppy");
  const [entries, setEntries] = useLocalState<WeightEntry[]>("furtools:pk-weight-chart", []);
  const [day, setDay] = useState(1);
  const [grams, setGrams] = useState(400);

  const expected = species === "puppy"
    ? [{ day: 1, low: 200, high: 600 }, { day: 7, low: 400, high: 1000 }, { day: 14, low: 700, high: 1600 }, { day: 21, low: 1000, high: 2500 }, { day: 28, low: 1400, high: 3500 }]
    : [{ day: 1, low: 90, high: 110 }, { day: 7, low: 150, high: 250 }, { day: 14, low: 220, high: 350 }, { day: 21, low: 300, high: 500 }, { day: 28, low: 400, high: 700 }];

  const sorted = [...entries].sort((a, b) => a.day - b.day);
  const gain = sorted.length >= 2
    ? sorted[sorted.length - 1].grams - sorted[sorted.length - 2].grams
    : 0;

  const form = (
    <div className="space-y-3">
      <div>
        <Label>{t("puppy-kitten-weight-chart.ui.speciesLabel")}</Label>
        <Select value={species} onValueChange={(v) => setSpecies(v as "puppy" | "kitten")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="puppy">{t("puppy-kitten-weight-chart.ui.speciesPuppy")}</SelectItem>
            <SelectItem value="kitten">{t("puppy-kitten-weight-chart.ui.speciesKitten")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>{t("puppy-kitten-weight-chart.ui.dayLabel")}</Label><Input type="number" min={1} value={day} onChange={(e) => setDay(+e.target.value || 1)} /></div>
        <div><Label>{t("puppy-kitten-weight-chart.ui.weightLabel")}</Label><Input type="number" value={grams} onChange={(e) => setGrams(+e.target.value || 0)} /></div>
      </div>
      <Button onClick={() => setEntries((p) => [...p, { id: crypto.randomUUID(), day, grams }])}>{t("puppy-kitten-weight-chart.ui.addButton")}</Button>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-background/60 p-3 text-sm">
        {t("puppy-kitten-weight-chart.ui.expectedTitle", { species })}
        <ul className="mt-1 text-xs text-muted-foreground">
          {expected.map((r) => (
            <li key={r.day}>{t("puppy-kitten-weight-chart.ui.expectedRow", { day: r.day, low: r.low, high: r.high })}</li>
          ))}
        </ul>
      </div>
      {sorted.length > 0 && (
        <div className="rounded-lg bg-primary/10 p-3 text-sm">
          <div>{t("puppy-kitten-weight-chart.ui.lastWeight", { grams: sorted[sorted.length - 1].grams, day: sorted[sorted.length - 1].day })}</div>
          {sorted.length >= 2 && (
            <div className={gain <= 0 ? "text-destructive font-medium" : ""}>
              {t("puppy-kitten-weight-chart.ui.gainLabel")}: {t("puppy-kitten-weight-chart.ui.gainValue", { gain: gain > 0 ? `+${gain}` : gain })}
              {gain <= 0 && t("puppy-kitten-weight-chart.ui.gainWarning")}
            </div>
          )}
        </div>
      )}
      {sorted.length > 0 && (
        <ul className="space-y-1 text-xs">
          {sorted.map((e) => (
            <li key={e.id} className="flex justify-between rounded bg-background/60 px-2 py-1">
              <span>{t("puppy-kitten-weight-chart.ui.entryDay", { day: e.day })}</span><span>{t("puppy-kitten-weight-chart.ui.entryGrams", { grams: e.grams })}</span>
              <button className="text-destructive" onClick={() => setEntries((p) => p.filter((x) => x.id !== e.id))}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   7. WEANING SCHEDULE
═══════════════════════════════════════════════════════════ */
export function WeaningSchedule() {
  const { t } = useTranslation("tools");
  const weaningPlan: Record<string, { start: number; end: number; steps: { week: string; desc: string }[] }> = {
    puppy: {
      start: 3, end: 8,
      steps: [
        { week: t("weaning-schedule.ui.puppyW3"), desc: t("weaning-schedule.ui.puppyD3") },
        { week: t("weaning-schedule.ui.puppyW4"), desc: t("weaning-schedule.ui.puppyD4") },
        { week: t("weaning-schedule.ui.puppyW5"), desc: t("weaning-schedule.ui.puppyD5") },
        { week: t("weaning-schedule.ui.puppyW6"), desc: t("weaning-schedule.ui.puppyD6") },
        { week: t("weaning-schedule.ui.puppyW7"), desc: t("weaning-schedule.ui.puppyD7") },
        { week: t("weaning-schedule.ui.puppyW8"), desc: t("weaning-schedule.ui.puppyD8") },
      ],
    },
    kitten: {
      start: 4, end: 8,
      steps: [
        { week: t("weaning-schedule.ui.kittenW4"), desc: t("weaning-schedule.ui.kittenD4") },
        { week: t("weaning-schedule.ui.kittenW5"), desc: t("weaning-schedule.ui.kittenD5") },
        { week: t("weaning-schedule.ui.kittenW6"), desc: t("weaning-schedule.ui.kittenD6") },
        { week: t("weaning-schedule.ui.kittenW7"), desc: t("weaning-schedule.ui.kittenD7") },
        { week: t("weaning-schedule.ui.kittenW8"), desc: t("weaning-schedule.ui.kittenD8") },
      ],
    },
    rabbit: {
      start: 4, end: 8,
      steps: [
        { week: t("weaning-schedule.ui.rabbitW34"), desc: t("weaning-schedule.ui.rabbitD34") },
        { week: t("weaning-schedule.ui.rabbitW56"), desc: t("weaning-schedule.ui.rabbitD56") },
        { week: t("weaning-schedule.ui.rabbitW78"), desc: t("weaning-schedule.ui.rabbitD78") },
      ],
    },
  };
  const [species, setSpecies] = useState("puppy");
  const [birthDate, setBirthDate] = useState(new Date().toISOString().slice(0, 10));
  const plan = weaningPlan[species];
  const start = new Date(birthDate);

  const form = (
    <div className="space-y-3">
      <div>
        <Label>{t("weaning-schedule.ui.speciesLabel")}</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="puppy">{t("weaning-schedule.ui.speciesPuppy")}</SelectItem>
            <SelectItem value="kitten">{t("weaning-schedule.ui.speciesKitten")}</SelectItem>
            <SelectItem value="rabbit">{t("weaning-schedule.ui.speciesRabbit")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>{t("weaning-schedule.ui.birthLabel")}</Label><Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></div>
    </div>
  );
  const result = (
    <div className="space-y-2">
      <div className="rounded-lg bg-primary/10 p-3 text-sm">
        {t("weaning-schedule.ui.summary", { start: plan.start, end: plan.end })}
      </div>
      {plan.steps.map((s, i) => (
        <div key={s.week} className="rounded-lg bg-background/60 p-3 text-sm">
          <div className="flex justify-between">
            <strong>{s.week}</strong>
            <span className="text-xs text-muted-foreground">{fmt(addDays(start, (plan.start + i) * 7))}</span>
          </div>
          <p className="text-xs text-muted-foreground">{s.desc}</p>
        </div>
      ))}
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   8. NEWBORN CARE TIMELINE
═══════════════════════════════════════════════════════════ */
export function NewbornCareTimeline() {
  const { t } = useTranslation("tools");
  const stages = [
    { range: t("newborn-care-timeline.ui.range02"), title: t("newborn-care-timeline.ui.titleColostrum"), tasks: [
      t("newborn-care-timeline.ui.colostrum1"), t("newborn-care-timeline.ui.colostrum2"),
      t("newborn-care-timeline.ui.colostrum3"), t("newborn-care-timeline.ui.colostrum4"),
    ] },
    { range: t("newborn-care-timeline.ui.range37"), title: t("newborn-care-timeline.ui.titleAdjustment"), tasks: [
      t("newborn-care-timeline.ui.adjustment1"), t("newborn-care-timeline.ui.adjustment2"),
      t("newborn-care-timeline.ui.adjustment3"), t("newborn-care-timeline.ui.adjustment4"),
    ] },
    { range: t("newborn-care-timeline.ui.rangeW2"), title: t("newborn-care-timeline.ui.titleEyes"), tasks: [
      t("newborn-care-timeline.ui.eyes1"), t("newborn-care-timeline.ui.eyes2"),
      t("newborn-care-timeline.ui.eyes3"), t("newborn-care-timeline.ui.eyes4"),
    ] },
    { range: t("newborn-care-timeline.ui.rangeW3"), title: t("newborn-care-timeline.ui.titleMovements"), tasks: [
      t("newborn-care-timeline.ui.movements1"), t("newborn-care-timeline.ui.movements2"),
      t("newborn-care-timeline.ui.movements3"), t("newborn-care-timeline.ui.movements4"),
    ] },
    { range: t("newborn-care-timeline.ui.rangeW45"), title: t("newborn-care-timeline.ui.titleWeaning"), tasks: [
      t("newborn-care-timeline.ui.weaning1"), t("newborn-care-timeline.ui.weaning2"),
      t("newborn-care-timeline.ui.weaning3"), t("newborn-care-timeline.ui.weaning4"),
    ] },
    { range: t("newborn-care-timeline.ui.rangeW68"), title: t("newborn-care-timeline.ui.titleIndependence"), tasks: [
      t("newborn-care-timeline.ui.independence1"), t("newborn-care-timeline.ui.independence2"),
      t("newborn-care-timeline.ui.independence3"), t("newborn-care-timeline.ui.independence4"),
    ] },
    { range: t("newborn-care-timeline.ui.rangeW812"), title: t("newborn-care-timeline.ui.titleRehome"), tasks: [
      t("newborn-care-timeline.ui.rehome1"), t("newborn-care-timeline.ui.rehome2"),
      t("newborn-care-timeline.ui.rehome3"), t("newborn-care-timeline.ui.rehome4"),
    ] },
  ];
  const [birthDate, setBirthDate] = useState(new Date().toISOString().slice(0, 10));
  const start = new Date(birthDate);
  const form = (
    <div><Label>{t("newborn-care-timeline.ui.birthLabel")}</Label><Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></div>
  );
  const result = (
    <div className="space-y-2">
      {stages.map((s) => (
        <div key={s.range} className="rounded-lg bg-background/60 p-3">
          <div className="flex justify-between text-sm font-medium">
            <span>{s.range} — {s.title}</span>
          </div>
          <ul className="mt-1 list-disc pl-5 text-xs text-muted-foreground space-y-0.5">
            {s.tasks.map((task) => <li key={task}>{task}</li>)}
          </ul>
        </div>
      ))}
      <div className="rounded-lg border bg-yellow-50 p-3 text-xs text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100">
        {t("newborn-care-timeline.ui.emergencyNote")}
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}
