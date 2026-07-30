import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";

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
const HEAT_CYCLE_INFO: Record<string, { intervalDays: number; heatDuration: string; note: string }> = {
  dog: { intervalDays: 180, heatDuration: "2-4 weeks", note: "Most dogs cycle every 6 months. Small breeds sometimes every 4, giants every 12-18." },
  cat: { intervalDays: 21, heatDuration: "4-10 days", note: "Cats are seasonally polyestrous — they cycle every 2-3 weeks during breeding season (spring–fall)." },
  rabbit: { intervalDays: 16, heatDuration: "receptive most days", note: "Rabbits are induced ovulators — no true heat cycle; they can conceive nearly any day." },
};
export function HeatCycleTracker() {
  const [species, setSpecies] = useState("dog");
  const [events, setEvents] = useLocalState<HeatEvent[]>("furtools:heat-cycle", []);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [stage, setStage] = useState("Proestrus (bleeding starts)");
  const [notes, setNotes] = useState("");
  const info = HEAT_CYCLE_INFO[species];
  const lastCycle = events[0];
  const nextExpected = lastCycle ? addDays(new Date(lastCycle.date), info.intervalDays) : null;

  const form = (
    <div className="space-y-3">
      <div>
        <Label>Species</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="dog">Dog</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
            <SelectItem value="rabbit">Rabbit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>Date observed</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div>
        <Label>Stage / observation</Label>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Proestrus (bleeding starts)">Proestrus (bleeding starts)</SelectItem>
            <SelectItem value="Estrus (receptive to males)">Estrus (receptive to males)</SelectItem>
            <SelectItem value="Diestrus (cycle ending)">Diestrus (cycle ending)</SelectItem>
            <SelectItem value="Anestrus (rest phase)">Anestrus (rest phase)</SelectItem>
            <SelectItem value="Behavioral change only">Behavioral change only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Discharge color, mood, appetite…" /></div>
      <Button
        onClick={() => {
          setEvents((prev) => [{ id: crypto.randomUUID(), date, stage, notes }, ...prev]);
          setNotes("");
        }}
      >Log entry</Button>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-background/60 p-3 text-sm">
        <div><strong>Typical interval:</strong> ~{info.intervalDays} days</div>
        <div><strong>Heat duration:</strong> {info.heatDuration}</div>
        <p className="mt-1 text-xs text-muted-foreground">{info.note}</p>
      </div>
      {nextExpected && (
        <div className="rounded-lg bg-primary/10 p-3 text-sm">
          <strong>Next cycle estimate:</strong> {fmt(nextExpected)}
        </div>
      )}
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No entries yet — log your first observation.</p>
      ) : (
        <ul className="space-y-2">
          {events.slice(0, 10).map((e) => (
            <li key={e.id} className="rounded-lg bg-background/60 p-3 text-xs">
              <div className="flex justify-between">
                <span className="font-medium">{fmt(new Date(e.date))}</span>
                <button className="text-destructive" onClick={() => setEvents((p) => p.filter((x) => x.id !== e.id))}>Delete</button>
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
const GESTATION: Record<string, { days: number; label: string }> = {
  dog: { days: 63, label: "Dog (58-68 days)" },
  cat: { days: 65, label: "Cat (63-67 days)" },
  rabbit: { days: 31, label: "Rabbit (28-33 days)" },
  "guinea-pig": { days: 68, label: "Guinea pig (59-72 days)" },
  hamster: { days: 18, label: "Hamster (16-22 days)" },
  ferret: { days: 42, label: "Ferret (41-42 days)" },
  horse: { days: 340, label: "Horse (320-370 days)" },
  goat: { days: 150, label: "Goat (145-155 days)" },
  sheep: { days: 147, label: "Sheep (144-152 days)" },
};
export function PregnancyCalendarSpecies() {
  const [species, setSpecies] = useState("dog");
  const [mated, setMated] = useState(new Date().toISOString().slice(0, 10));
  const g = GESTATION[species];
  const start = new Date(mated);
  const due = addDays(start, g.days);
  const week1 = addDays(start, Math.round(g.days * 0.33));
  const week2 = addDays(start, Math.round(g.days * 0.66));
  const nestingPrep = addDays(due, -10);

  const milestones = species === "dog" ? [
    { day: 21, label: "Nipples enlarge, appetite may drop briefly" },
    { day: 28, label: "Vet ultrasound confirms pregnancy" },
    { day: 45, label: "X-ray can count puppies (skeletons visible)" },
    { day: 55, label: "Set up whelping box, isolate mom" },
    { day: 60, label: "Rectal temp 2x daily — drop below 99°F = 24h to labor" },
    { day: 63, label: "Expected whelping day" },
  ] : species === "cat" ? [
    { day: 21, label: "Pink swollen nipples ('pinking up')" },
    { day: 28, label: "Vet can palpate kittens" },
    { day: 50, label: "Kittens visibly move in abdomen" },
    { day: 58, label: "Set up kittening box in quiet room" },
    { day: 65, label: "Expected kittening day" },
  ] : [
    { day: Math.round(g.days * 0.33), label: "Early gestation — normal diet, gentle handling" },
    { day: Math.round(g.days * 0.66), label: "Mid gestation — increase nutrition ~25%" },
    { day: g.days - 7, label: "Prepare nest area, quiet environment" },
    { day: g.days, label: "Expected birth day" },
  ];

  const form = (
    <div className="space-y-3">
      <div>
        <Label>Species</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.entries(GESTATION).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div><Label>Mating / breeding date</Label><Input type="date" value={mated} onChange={(e) => setMated(e.target.value)} /></div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-primary/10 p-3">
        <div className="text-xs uppercase text-muted-foreground">Expected due date</div>
        <div className="text-2xl font-semibold">{fmt(due)}</div>
        <div className="mt-1 text-xs text-muted-foreground">First trimester ends {fmt(week1)} · nesting prep by {fmt(nestingPrep)}</div>
      </div>
      <ul className="space-y-2">
        {milestones.map((m) => (
          <li key={m.day} className="rounded-lg bg-background/60 p-3 text-sm">
            <div className="flex justify-between">
              <strong>Day {m.day}</strong>
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
const WHELPING_GROUPS = [
  {
    title: "Whelping box setup (2-3 weeks before due date)",
    items: [
      "Sturdy whelping box 1.5x mom's body length, with pig rails to prevent crushing",
      "Newspaper base + clean towels/vet-bed on top",
      "Heat lamp or heating pad set to 85-90°F for first week (one warm corner only)",
      "Quiet, low-traffic room where mom feels safe",
      "Introduce mom to the box 7-10 days early so she claims it",
    ],
  },
  {
    title: "Whelping kit (assemble by day 55)",
    items: [
      "Clean towels (10-15) for drying newborns",
      "Bulb syringe to clear airways",
      "Unscented dental floss for tying umbilical cords",
      "Blunt scissors sterilized in alcohol",
      "Iodine or chlorhexidine for cord stumps",
      "Digital scale (gram accuracy) for daily weigh-ins",
      "Hemostats (for cord clamping if needed)",
      "Puppy/kitten milk replacer + bottle (emergency only)",
      "Rectal thermometer + lubricant",
      "Notebook + pen — log time of birth, weight, sex, markings",
    ],
  },
  {
    title: "Health & vet prep",
    items: [
      "Pre-whelping vet check at day 55",
      "X-ray at day 45+ to confirm puppy/kitten count",
      "Emergency vet phone number posted on the wall",
      "Know the address of the nearest 24-hour ER vet",
      "Learn signs of dystocia: >2h active straining with no birth, >4h between births, green discharge before first pup",
      "Discuss C-section threshold with your vet in advance",
    ],
  },
  {
    title: "Postpartum (first 48 hours)",
    items: [
      "Confirm each newborn nurses within 2 hours (colostrum window)",
      "Weigh every newborn daily — no weight loss beyond day 2",
      "Check mom's temperature 2x daily for 5 days (>103°F = infection risk)",
      "Watch for retained placenta, mastitis, eclampsia (milk fever)",
      "Keep visitors away for 2 weeks — stress can trigger cannibalism or rejection",
    ],
  },
];
export function WhelpingKitteningChecklist() {
  const [checked, setChecked] = useLocalState<Record<string, boolean>>("furtools:whelping-checklist", {});
  const total = WHELPING_GROUPS.reduce((a, g) => a + g.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-primary/10 p-3 text-sm">
        Progress: <strong>{done} / {total}</strong> ({Math.round((done / total) * 100)}%)
      </div>
      {WHELPING_GROUPS.map((g) => (
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
      <div><Label>Average puppy price ($)</Label><Input type="number" value={avgPuppyPrice} onChange={(e) => setAvgPuppyPrice(+e.target.value || 0)} /></div>
      <div><Label>Average litter size</Label><Input type="number" value={avgLitterSize} onChange={(e) => setAvgLitterSize(+e.target.value || 1)} /></div>
      <div>
        <Label>Stud quality tier</Label>
        <Select value={studQuality} onValueChange={setStudQuality}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="pet-quality">Pet quality (no titles)</SelectItem>
            <SelectItem value="titled">Titled (conformation/working)</SelectItem>
            <SelectItem value="champion">Champion (CH/GCH)</SelectItem>
            <SelectItem value="top-producer">Top producer / imported bloodline</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Fee structure</Label>
        <Select value={feeType} onValueChange={(v) => setFeeType(v as "cash" | "pick")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash fee</SelectItem>
            <SelectItem value="pick">Pick of the litter</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      {feeType === "cash" ? (
        <div className="rounded-lg bg-primary/10 p-3">
          <div className="text-xs uppercase text-muted-foreground">Suggested cash stud fee</div>
          <div className="text-2xl font-semibold">${suggestedCash.toLocaleString()}</div>
          <p className="mt-1 text-xs text-muted-foreground">Industry norm: 1 puppy price for titled studs, up to 2x for champions.</p>
        </div>
      ) : (
        <div className="rounded-lg bg-primary/10 p-3">
          <div className="text-xs uppercase text-muted-foreground">Pick-of-litter value (approx.)</div>
          <div className="text-2xl font-semibold">${pickPupValue.toLocaleString()}</div>
          <p className="mt-1 text-xs text-muted-foreground">Stud owner selects 1st pick after the breeder's own retention.</p>
        </div>
      )}
      <div className="rounded-lg bg-background/60 p-3 text-sm">
        <div><strong>Projected litter revenue:</strong> ${(avgPuppyPrice * avgLitterSize).toLocaleString()}</div>
        <div><strong>Stud fee as % of revenue:</strong> {Math.round((suggestedCash / (avgPuppyPrice * avgLitterSize)) * 100)}%</div>
      </div>
      <div className="rounded-lg border bg-yellow-50 p-3 text-xs text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100">
        Always use a written stud contract. Cover: repeat breeding rights if litter fails, health-test requirements, payment timing, and pick order.
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   5. GENETIC DIVERSITY / COI CALCULATOR
═══════════════════════════════════════════════════════════ */
export function GeneticDiversityCOI() {
  const [commonAncestors, setCommonAncestors] = useState(1);
  const [generations, setGenerations] = useState(5);
  // Wright's simplified inbreeding coefficient using shared ancestors N generations back
  // Approximation: COI ≈ Σ (0.5)^(n1+n2+1) for each shared ancestor path
  const coi = useMemo(() => {
    const perAncestor = Math.pow(0.5, generations * 2 + 1);
    return Math.min(1, commonAncestors * perAncestor) * 100;
  }, [commonAncestors, generations]);

  const band =
    coi < 6.25 ? { label: "Low", color: "bg-green-500/15 text-green-700 dark:text-green-300", note: "Similar to unrelated pairing. Healthy diversity." } :
    coi < 12.5 ? { label: "Moderate", color: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300", note: "Comparable to first-cousin pairing. Acceptable if health tests are clean." } :
    coi < 25 ? { label: "High", color: "bg-orange-500/15 text-orange-700 dark:text-orange-300", note: "Half-sibling equivalent. Reduced litter vigor and immune diversity likely." } :
    { label: "Very High", color: "bg-red-500/15 text-red-700 dark:text-red-300", note: "Full-sibling / parent-offspring pairing. Not recommended — strong risk of recessive disease expression." };

  const form = (
    <div className="space-y-3">
      <div><Label>Number of shared ancestors within pedigree</Label><Input type="number" min={0} value={commonAncestors} onChange={(e) => setCommonAncestors(+e.target.value || 0)} /></div>
      <div>
        <Label>Generations back to shared ancestor</Label>
        <Select value={String(generations)} onValueChange={(v) => setGenerations(+v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <SelectItem key={n} value={String(n)}>{n} generations</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="mt-1 text-xs text-muted-foreground">Full 5-generation pedigrees give the most reliable estimate.</p>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-primary/10 p-3">
        <div className="text-xs uppercase text-muted-foreground">Estimated Coefficient of Inbreeding (COI)</div>
        <div className="text-2xl font-semibold">{coi.toFixed(2)}%</div>
      </div>
      <div className={`rounded-lg p-3 text-sm ${band.color}`}>
        <strong>{band.label}</strong> — {band.note}
      </div>
      <div className="rounded-lg bg-background/60 p-3 text-xs text-muted-foreground">
        <p className="mb-1"><strong>Reference bands:</strong></p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>0-6.25% — unrelated to distant cousins (ideal)</li>
          <li>6.25-12.5% — first-cousin equivalent</li>
          <li>12.5-25% — half-sibling equivalent</li>
          <li>25%+ — full-sibling / parent-offspring (avoid)</li>
        </ul>
        <p className="mt-2">For accurate pedigree-based COI, use software like Breedmate or the breed database's COI calculator with a full 10-generation pedigree.</p>
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
        <Label>Species</Label>
        <Select value={species} onValueChange={(v) => setSpecies(v as "puppy" | "kitten")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="puppy">Puppy</SelectItem>
            <SelectItem value="kitten">Kitten</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Day of life</Label><Input type="number" min={1} value={day} onChange={(e) => setDay(+e.target.value || 1)} /></div>
        <div><Label>Weight (grams)</Label><Input type="number" value={grams} onChange={(e) => setGrams(+e.target.value || 0)} /></div>
      </div>
      <Button onClick={() => setEntries((p) => [...p, { id: crypto.randomUUID(), day, grams }])}>Add weigh-in</Button>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-background/60 p-3 text-sm">
        <strong>Expected {species} range (breed-dependent):</strong>
        <ul className="mt-1 text-xs text-muted-foreground">
          {expected.map((r) => (
            <li key={r.day}>Day {r.day}: {r.low}–{r.high} g</li>
          ))}
        </ul>
      </div>
      {sorted.length > 0 && (
        <div className="rounded-lg bg-primary/10 p-3 text-sm">
          <div><strong>Last weight:</strong> {sorted[sorted.length - 1].grams} g on day {sorted[sorted.length - 1].day}</div>
          {sorted.length >= 2 && (
            <div className={gain <= 0 ? "text-destructive font-medium" : ""}>
              Gain since previous: {gain > 0 ? `+${gain}` : gain} g
              {gain <= 0 && " — 🚨 Weight loss or stagnation in a neonate is an emergency. Call your vet."}
            </div>
          )}
        </div>
      )}
      {sorted.length > 0 && (
        <ul className="space-y-1 text-xs">
          {sorted.map((e) => (
            <li key={e.id} className="flex justify-between rounded bg-background/60 px-2 py-1">
              <span>Day {e.day}</span><span>{e.grams} g</span>
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
const WEANING_PLAN: Record<string, { start: number; end: number; steps: { week: string; desc: string }[] }> = {
  puppy: {
    start: 3, end: 8,
    steps: [
      { week: "Week 3", desc: "Introduce puppy gruel: soaked kibble + puppy milk replacer, 4x daily. Nursing still primary." },
      { week: "Week 4", desc: "Thicker gruel, less milk replacer. Puppies eating solids ~30% of intake." },
      { week: "Week 5", desc: "Soaked kibble only (no milk replacer). Nursing 2-3x daily." },
      { week: "Week 6", desc: "Dry kibble + water on side. Nursing reduced to 1-2x daily." },
      { week: "Week 7", desc: "Fully on solid puppy food. Separate mom for longer periods." },
      { week: "Week 8", desc: "Weaning complete. Ready to leave litter (US minimum; 10 weeks better)." },
    ],
  },
  kitten: {
    start: 4, end: 8,
    steps: [
      { week: "Week 4", desc: "Introduce wet food gruel (kitten formula + KMR). 4x daily, small amounts." },
      { week: "Week 5", desc: "Thicker wet food. Kittens tasting more solids." },
      { week: "Week 6", desc: "Full wet kitten food, dry kibble available. Nursing reduces." },
      { week: "Week 7", desc: "Mostly weaned. Mom regulates nursing." },
      { week: "Week 8", desc: "Weaning complete. Do NOT rehome before 10-12 weeks (social development)." },
    ],
  },
  rabbit: {
    start: 4, end: 8,
    steps: [
      { week: "Week 3-4", desc: "Kits nibble mom's pellets and hay. Do not offer greens yet." },
      { week: "Week 5-6", desc: "Free-fed alfalfa hay and alfalfa-based pellets." },
      { week: "Week 7-8", desc: "Fully weaned. Introduce small amounts of leafy greens one at a time." },
    ],
  },
};
export function WeaningSchedule() {
  const [species, setSpecies] = useState("puppy");
  const [birthDate, setBirthDate] = useState(new Date().toISOString().slice(0, 10));
  const plan = WEANING_PLAN[species];
  const start = new Date(birthDate);

  const form = (
    <div className="space-y-3">
      <div>
        <Label>Species</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="puppy">Puppy</SelectItem>
            <SelectItem value="kitten">Kitten</SelectItem>
            <SelectItem value="rabbit">Rabbit kit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>Litter birth date</Label><Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></div>
    </div>
  );
  const result = (
    <div className="space-y-2">
      <div className="rounded-lg bg-primary/10 p-3 text-sm">
        Weaning starts week {plan.start}, complete by week {plan.end}. Do not rehome before minimum age.
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
const NEWBORN_STAGES = [
  { range: "Day 0-2", title: "Colostrum window", tasks: ["Confirm all newborns nurse within 2 hours", "Weigh at birth, then every 12h for 3 days", "Room temp 85-90°F for puppies, 88°F for kittens", "Watch for fading — cold, limp, or crying constantly = emergency vet"] },
  { range: "Day 3-7", title: "Adjustment week", tasks: ["Weight should increase 5-10% daily", "Cord stumps fall off around day 3", "Reduce ambient temp gradually to 80°F", "Deworm mom (safe wormer only) — nematodes pass through milk"] },
  { range: "Week 2", title: "Eyes and ears open", tasks: ["Eyes open days 10-14 (never force)", "Ears open days 14-17", "Introduce firm bedding for footing", "Ambient temp 75°F now safe"] },
  { range: "Week 3", title: "First movements", tasks: ["Puppies/kittens start walking wobbly", "Introduce a shallow litter tray (kittens) or paper (puppies)", "First deworming for babies", "Begin gentle handling — 30 sec per pup, 3-4x daily"] },
  { range: "Week 4-5", title: "Weaning begins", tasks: ["Introduce gruel (see Weaning Schedule tool)", "Playtime with littermates — critical socialization", "Nails trimmed weekly (mom's teats get scratched)", "First vet check-up"] },
  { range: "Week 6-8", title: "Independence", tasks: ["Full weaning complete", "First vaccines (typically 6-8 weeks)", "Socialization with humans — new sounds, gentle handling", "Deworming boosters"] },
  { range: "Week 8-12", title: "Ready to rehome", tasks: ["Puppies: 8 weeks US minimum, 10-12 ideal", "Kittens: 10-12 weeks minimum", "Second vaccines", "Provide new owners with weight/vaccine/deworming records"] },
];
export function NewbornCareTimeline() {
  const [birthDate, setBirthDate] = useState(new Date().toISOString().slice(0, 10));
  const start = new Date(birthDate);
  const form = (
    <div><Label>Litter birth date</Label><Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></div>
  );
  const result = (
    <div className="space-y-2">
      {NEWBORN_STAGES.map((s) => (
        <div key={s.range} className="rounded-lg bg-background/60 p-3">
          <div className="flex justify-between text-sm font-medium">
            <span>{s.range} — {s.title}</span>
          </div>
          <ul className="mt-1 list-disc pl-5 text-xs text-muted-foreground space-y-0.5">
            {s.tasks.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      ))}
      <div className="rounded-lg border bg-yellow-50 p-3 text-xs text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100">
        <strong>Emergency signs:</strong> constant crying, cold to touch, no weight gain by day 2, refusing to nurse, blue/pale gums. Call an emergency vet immediately — neonates crash within hours.
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}
