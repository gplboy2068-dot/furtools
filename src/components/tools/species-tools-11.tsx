import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";

function useLocal<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try { const r = localStorage.getItem(key); return r ? (JSON.parse(r) as T) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ } }, [key, v]);
  return [v, setV];
}

function Pill({ tone, children }: { tone: "safe" | "caution" | "danger"; children: React.ReactNode }) {
  const cls =
    tone === "safe" ? "bg-emerald-100 text-emerald-800"
    : tone === "caution" ? "bg-amber-100 text-amber-800"
    : "bg-red-100 text-red-800";
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{children}</span>;
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg bg-background/60 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Notes({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
      {items.map((n) => <li key={n}>• {n}</li>)}
    </ul>
  );
}

/* ═══════════ 1. TARANTULA ENCLOSURE SIZE ═══════════ */
export function TarantulaEnclosureCalculator() {
  const [type, setType] = useState<"terrestrial" | "arboreal" | "fossorial">("terrestrial");
  const [dls, setDls] = useState(5); // diagonal leg span, inches
  const [stage, setStage] = useState<"sling" | "juvenile" | "adult">("adult");

  const floorSide = Math.round(dls * (type === "arboreal" ? 2 : 3));
  const height =
    type === "arboreal" ? Math.round(dls * 4)
    : type === "fossorial" ? Math.round(dls * 3)
    : Math.min(Math.round(dls * 1.5), Math.round(dls + 4));
  const substrate =
    type === "fossorial" ? Math.round(dls * 2.5)
    : type === "arboreal" ? 2
    : Math.max(2, Math.round(dls * 0.8));
  const ventilation = type === "arboreal" ? "Cross-ventilation: side + upper vents" : "Cross-ventilation: two opposing side vents";

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Species type</Label>
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="terrestrial">Terrestrial (Grammostola, Brachypelma)</SelectItem>
            <SelectItem value="arboreal">Arboreal (Avicularia, Poecilotheria)</SelectItem>
            <SelectItem value="fossorial">Fossorial / burrower (Hysterocrates, Ceratogyrus)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Diagonal leg span (inches)</Label>
        <Input type="number" min={0.2} step={0.25} value={dls} onChange={(e) => setDls(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>Life stage</Label>
        <Select value={stage} onValueChange={(v) => setStage(v as typeof stage)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sling">Spiderling</SelectItem>
            <SelectItem value="juvenile">Juvenile</SelectItem>
            <SelectItem value="adult">Adult</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={dls > 0 ? "safe" : "caution"}>Recommended enclosure</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Floor space" value={`${floorSide} × ${Math.round(floorSide * 0.7)} in`} hint="Length × width minimum" />
        <Stat label="Height" value={`${height} in`} hint={type === "terrestrial" ? "Keep low — falls are fatal" : "Vertical climbing space"} />
        <Stat label="Substrate depth" value={`${substrate} in`} />
        <Stat label="Ventilation" value="Cross-flow" hint={ventilation} />
      </div>
      <Notes items={[
        stage === "sling" ? "Slings do best in small vials or 2-4 oz deli cups — oversized homes make feeding response poor." : "Rehouse only when the spider has hardened after a moult (7-10 days).",
        type === "terrestrial" ? "Height above 1.5× leg span risks a fatal abdominal rupture from falls." : "Provide cork bark slabs and fake foliage as vertical anchors.",
        "Always include a shallow water dish, regardless of species.",
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 2. TARANTULA FEEDING SCHEDULE ═══════════ */
export function TarantulaFeedingSchedule() {
  const [stage, setStage] = useState<"sling" | "juvenile" | "subadult" | "adult">("juvenile");
  const [dls, setDls] = useState(3);
  const [premoult, setPremoult] = useState(false);

  const plan = {
    sling: { every: 3, prey: "Pre-killed cricket leg or flightless fruit fly", count: 1 },
    juvenile: { every: 5, prey: "Small cricket / dubia nymph", count: 2 },
    subadult: { every: 7, prey: "Medium cricket / dubia", count: 2 },
    adult: { every: 10, prey: "Large cricket, dubia or roach", count: 3 },
  }[stage];

  const preySize = Math.max(0.25, Math.round(dls * 0.5 * 4) / 4);
  const perMonth = premoult ? 0 : Math.round(30 / plan.every) * plan.count;

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Life stage</Label>
        <Select value={stage} onValueChange={(v) => setStage(v as typeof stage)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sling">Spiderling (&lt; 1")</SelectItem>
            <SelectItem value="juvenile">Juvenile (1-3")</SelectItem>
            <SelectItem value="subadult">Sub-adult (3-4.5")</SelectItem>
            <SelectItem value="adult">Adult (4.5"+)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Diagonal leg span (inches)</Label>
        <Input type="number" min={0.2} step={0.25} value={dls} onChange={(e) => setDls(Number(e.target.value) || 0)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={premoult} onCheckedChange={(c) => setPremoult(Boolean(c))} />
        Showing pre-moult signs (dark abdomen, refusing food, webbing up)
      </label>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={premoult ? "caution" : "safe"}>{premoult ? "Stop feeding — pre-moult" : "Feeding plan"}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Feed every" value={premoult ? "Pause" : `${plan.every} days`} />
        <Stat label="Prey per feeding" value={premoult ? "0" : `${plan.count}`} hint={plan.prey} />
        <Stat label="Prey size" value={`≤ ${preySize}"`} hint="Half the tarantula's leg span" />
        <Stat label="Feedings / month" value={`${perMonth}`} />
      </div>
      <Notes items={[
        "Remove uneaten prey within 24 hours — crickets can injure a moulting spider.",
        premoult ? "Resume feeding 7-10 days after the moult, once fangs darken." : "A plump, rounded abdomen means you can safely extend the interval.",
        "Fresh water must always be available; tarantulas dehydrate faster than they starve.",
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 3. HEDGEHOG WHEEL SIZE ═══════════ */
export function HedgehogWheelSize() {
  const [weight, setWeight] = useState(450); // grams
  const [length, setLength] = useState(8); // inches nose-to-tail
  const [surface, setSurface] = useState<"solid" | "mesh" | "bucket">("solid");

  const diameter = length >= 9 || weight >= 600 ? 14 : length >= 7 ? 12 : 11;
  const safe = surface === "solid";

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Weight (grams)</Label>
        <Input type="number" min={100} value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>Body length nose-to-tail (inches)</Label>
        <Input type="number" min={3} step={0.5} value={length} onChange={(e) => setLength(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>Wheel running surface</Label>
        <Select value={surface} onValueChange={(v) => setSurface(v as typeof surface)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid plastic / textured solid</SelectItem>
            <SelectItem value="bucket">Bucket wheel (solid)</SelectItem>
            <SelectItem value="mesh">Wire mesh or barred</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={safe ? "safe" : "danger"}>{safe ? "Surface is safe" : "Unsafe surface — replace"}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Minimum diameter" value={`${diameter} in`} hint="Back must stay flat while running" />
        <Stat label="Ideal diameter" value={`${diameter + 1} in`} />
        <Stat label="Nightly distance" value="3-8 km" hint="Typical healthy hedgehog" />
        <Stat label="Surface verdict" value={safe ? "Solid ✓" : "Mesh ✗"} />
      </div>
      <Notes items={[
        "A wheel that curves the spine upward is too small — the back should look level from the side.",
        "Wire or barred wheels trap toes and cause degloving injuries. Only solid surfaces are safe.",
        "Clean the wheel nightly; hedgehogs almost always defecate while running.",
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 4. HEDGEHOG DIET CALCULATOR ═══════════ */
export function HedgehogDietCalculator() {
  const [weight, setWeight] = useState(450);
  const [activity, setActivity] = useState<"low" | "normal" | "high">("normal");
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain">("maintain");
  const [kcalPerCup, setKcal] = useState(350);

  const base = weight * 0.16; // kcal/day approx (70 * (kg^0.75) style simplified for insectivore)
  const actMul = activity === "low" ? 0.9 : activity === "high" ? 1.15 : 1;
  const goalMul = goal === "lose" ? 0.85 : goal === "gain" ? 1.15 : 1;
  const kcal = Math.round(base * actMul * goalMul);
  const grams = Math.round((kcal / kcalPerCup) * 120); // 1 cup ≈ 120 g kibble
  const tbsp = Math.round((grams / 8) * 10) / 10;

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Weight (grams)</Label>
        <Input type="number" min={100} value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>Activity level</Label>
        <Select value={activity} onValueChange={(v) => setActivity(v as typeof activity)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low (no wheel / senior)</SelectItem>
            <SelectItem value="normal">Normal (wheel most nights)</SelectItem>
            <SelectItem value="high">High (wheel + daily playtime)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Goal</Label>
        <Select value={goal} onValueChange={(v) => setGoal(v as typeof goal)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="maintain">Maintain weight</SelectItem>
            <SelectItem value="lose">Slim down</SelectItem>
            <SelectItem value="gain">Gain weight</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Kibble calories per cup</Label>
        <Input type="number" min={100} value={kcalPerCup} onChange={(e) => setKcal(Number(e.target.value) || 1)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={weight < 250 || weight > 700 ? "caution" : "safe"}>
        {weight < 250 ? "Underweight range" : weight > 700 ? "Overweight range" : "Healthy weight range"}
      </Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Daily calories" value={`${kcal} kcal`} />
        <Stat label="Dry food" value={`${grams} g/day`} hint={`≈ ${tbsp} tbsp`} />
        <Stat label="Live insects" value="3-5 items" hint="Mealworms, dubia, crickets" />
        <Stat label="Veg / fruit" value="1 tsp" hint="Optional, 2-3× per week" />
      </div>
      <Notes items={[
        "Choose a kibble with 30-35% protein, under 15% fat and a named animal protein first.",
        "Never feed milk, grapes, raisins, avocado, onion, chocolate or raw egg.",
        "Weigh weekly on a kitchen scale — a 10% change in either direction warrants a vet check.",
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 5. AXOLOTL TANK TEMPERATURE ═══════════ */
export function AxolotlTankTemperature() {
  const [temp, setTemp] = useState(19);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [roomTemp, setRoomTemp] = useState(24);

  const c = unit === "C" ? temp : (temp - 32) * (5 / 9);
  const roomC = unit === "C" ? roomTemp : (roomTemp - 32) * (5 / 9);
  const tone: "safe" | "caution" | "danger" = c >= 16 && c <= 20 ? "safe" : c > 20 && c <= 22 ? "caution" : "danger";
  const verdict =
    c < 12 ? "Too cold — metabolism and digestion stall"
    : c < 16 ? "Cool but survivable — feeding response drops"
    : c <= 20 ? "Ideal range"
    : c <= 22 ? "Warm — stress risk, watch for curled gills"
    : "Dangerous — heat stress, fungal infection and death risk";
  const cooling = roomC - c;

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Unit</Label>
        <Select value={unit} onValueChange={(v) => setUnit(v as typeof unit)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="C">Celsius</SelectItem>
            <SelectItem value="F">Fahrenheit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Current water temperature (°{unit})</Label>
        <Input type="number" step={0.5} value={temp} onChange={(e) => setTemp(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>Room temperature (°{unit})</Label>
        <Input type="number" step={0.5} value={roomTemp} onChange={(e) => setRoomTemp(Number(e.target.value) || 0)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={tone}>{verdict}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Ideal range" value="16-18 °C" hint="60-64 °F" />
        <Stat label="Absolute maximum" value="22 °C" hint="72 °F — emergency territory" />
        <Stat label="Water vs room" value={`${cooling >= 0 ? "-" : "+"}${Math.abs(Math.round(cooling * 10) / 10)} °C`} hint="Cooling you currently achieve" />
        <Stat label="Suggested fix" value={c > 20 ? "Active cooling" : "Maintain"} />
      </div>
      <Notes items={[
        "Never use an aquarium heater. Axolotls are cold-water amphibians.",
        c > 20 ? "Cool with clip-on fans across the surface (2-3 °C drop), frozen water bottles, or an aquarium chiller for a permanent fix." : "Keep the tank out of direct sunlight and away from heating vents.",
        "Curled forward gills, floating and refusing food are classic heat-stress signs.",
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 6. AXOLOTL TANK SIZE ═══════════ */
export function AxolotlTankSize() {
  const [count, setCount] = useState(1);
  const [length, setLength] = useState(9); // inches
  const [filtration, setFiltration] = useState<"sponge" | "canister" | "hob">("sponge");

  const first = length >= 8 ? 20 : 15;
  const gallons = first + Math.max(0, count - 1) * 10;
  const footprint = gallons >= 40 ? '36" × 18"' : gallons >= 29 ? '30" × 12"' : '24" × 12"';
  const flowNote = filtration === "sponge" ? "Ideal — gentle flow" : filtration === "canister" ? "Use a spray bar aimed at the glass" : "Baffle the outflow with filter floss";

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Number of axolotls</Label>
        <Input type="number" min={1} max={6} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
      </div>
      <div>
        <Label>Adult length (inches)</Label>
        <Input type="number" min={2} step={0.5} value={length} onChange={(e) => setLength(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>Filtration type</Label>
        <Select value={filtration} onValueChange={(v) => setFiltration(v as typeof filtration)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sponge">Sponge filter</SelectItem>
            <SelectItem value="canister">Canister</SelectItem>
            <SelectItem value="hob">Hang-on-back</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone="safe">Recommended setup</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Minimum volume" value={`${gallons} gallons`} hint={`≈ ${Math.round(gallons * 3.79)} litres`} />
        <Stat label="Footprint" value={footprint} hint="Floor space matters more than height" />
        <Stat label="Hides needed" value={`${count + 1}`} />
        <Stat label="Flow" value={flowNote} />
      </div>
      <Notes items={[
        "Floor area beats water column — axolotls are benthic and rarely use vertical space.",
        "Use fine sand or bare bottom. Gravel causes fatal impaction.",
        count > 1 ? "House only same-size axolotls; larger ones will bite gills and limbs off smaller tank mates." : "Axolotls are solitary and thrive alone.",
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 7. SUGAR GLIDER DIET CALCULATOR ═══════════ */
export function SugarGliderDietCalculator() {
  const [count, setCount] = useState(2);
  const [weight, setWeight] = useState(120); // grams each
  const [plan, setPlan] = useState<"bml" | "tpg" | "hpw">("hpw");

  const perGlider = Math.round(weight * 0.15); // ~15% bodyweight in wet diet
  const total = perGlider * count;
  const staple = Math.round(total * 0.5);
  const produce = Math.round(total * 0.4);
  const protein = Math.round(total * 0.1);
  const planName = plan === "bml" ? "BML (Bourbon's Modified Leadbeater's)" : plan === "tpg" ? "TPG (The Pet Glider)" : "HPW (High Protein Wombaroo)";

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Number of gliders</Label>
        <Input type="number" min={1} max={8} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
      </div>
      <div>
        <Label>Average weight each (grams)</Label>
        <Input type="number" min={50} value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>Diet plan</Label>
        <Select value={plan} onValueChange={(v) => setPlan(v as typeof plan)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="hpw">HPW — High Protein Wombaroo</SelectItem>
            <SelectItem value="bml">BML — Bourbon's Modified Leadbeater's</SelectItem>
            <SelectItem value="tpg">TPG — The Pet Glider</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={count === 1 ? "caution" : "safe"}>{count === 1 ? "Single glider — companionship needed" : planName}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Nightly food (total)" value={`${total} g`} hint={`${perGlider} g per glider`} />
        <Stat label="Staple mix" value={`${staple} g`} hint={planName} />
        <Stat label="Fruit & veg" value={`${produce} g`} hint="Chopped, rotating variety" />
        <Stat label="Insects / protein" value={`${protein} g`} hint="Gut-loaded crickets, mealworms, egg" />
      </div>
      <Notes items={[
        "Serve at dusk and remove leftovers each morning — wet diets spoil quickly.",
        "Maintain a roughly 2:1 calcium-to-phosphorus ratio; imbalance causes hind-leg paralysis (HLP).",
        "Never feed chocolate, onion, garlic, avocado, raw nuts in bulk or anything sugar-free (xylitol).",
        "Sugar gliders are colony animals — keeping one alone causes serious stress behaviours.",
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 8. SUGAR GLIDER CAGE SIZE ═══════════ */
export function SugarGliderCageSize() {
  const [count, setCount] = useState(2);
  const [barSpacing, setBarSpacing] = useState(0.5);

  const width = 24 + Math.max(0, count - 2) * 6;
  const depth = 24;
  const height = 36 + Math.max(0, count - 2) * 6;
  const cuFt = Math.round(((width * depth * height) / 1728) * 10) / 10;
  const barOk = barSpacing <= 0.5;
  const pouches = Math.max(2, count);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Number of gliders</Label>
        <Input type="number" min={1} max={8} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
      </div>
      <div>
        <Label>Cage bar spacing (inches)</Label>
        <Input type="number" min={0.1} step={0.05} value={barSpacing} onChange={(e) => setBarSpacing(Number(e.target.value) || 0)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={barOk ? "safe" : "danger"}>{barOk ? "Bar spacing is safe" : "Bars too wide — escape/injury risk"}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Minimum cage" value={`${width}" W × ${depth}" D × ${height}" H`} />
        <Stat label="Volume" value={`${cuFt} cu ft`} />
        <Stat label="Sleeping pouches" value={`${pouches}`} />
        <Stat label="Max bar spacing" value={'0.5"'} hint="½ inch or less, horizontal bars preferred" />
      </div>
      <Notes items={[
        "Height matters most — gliders leap and glide vertically.",
        "Use PVC-coated or stainless wire; galvanised zinc can cause metal toxicity.",
        "Fill with branches, fleece ropes, a wodent wheel (11-12\" solid) and rotating foraging toys.",
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 9. CHINCHILLA DUST BATH SCHEDULE ═══════════ */
export function ChinchillaDustBathSchedule() {
  const [humidity, setHumidity] = useState(45);
  const [coat, setCoat] = useState<"normal" | "greasy" | "dry">("normal");
  const [last, setLast] = useLocal<string>("furtools:chin-dust:last", "");

  const baseTimes = humidity > 60 ? 4 : humidity > 45 ? 3 : 2;
  const times = coat === "greasy" ? baseTimes + 1 : coat === "dry" ? Math.max(1, baseTimes - 1) : baseTimes;
  const intervalDays = Math.max(1, Math.round(7 / times));
  const minutes = coat === "greasy" ? 15 : 10;

  const nextDate = useMemo(() => {
    if (!last) return null;
    const d = new Date(last);
    d.setDate(d.getDate() + intervalDays);
    return d.toISOString().slice(0, 10);
  }, [last, intervalDays]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Room humidity (%)</Label>
        <Input type="number" min={0} max={100} value={humidity} onChange={(e) => setHumidity(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>Coat condition</Label>
        <Select value={coat} onValueChange={(v) => setCoat(v as typeof coat)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal — fluffy and clean</SelectItem>
            <SelectItem value="greasy">Greasy / clumping</SelectItem>
            <SelectItem value="dry">Dry, flaky skin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Last dust bath</Label>
        <Input type="date" value={last} onChange={(e) => setLast(e.target.value)} />
      </div>
      {last ? <Button variant="outline" onClick={() => setLast(new Date().toISOString().slice(0, 10))}>Log a bath today</Button> : null}
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={humidity > 60 ? "caution" : "safe"}>{humidity > 60 ? "High humidity — fungal risk" : "Schedule ready"}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Baths per week" value={`${times}`} hint={`Every ~${intervalDays} days`} />
        <Stat label="Session length" value={`${minutes} min`} hint="Then remove the bath house" />
        <Stat label="Dust depth" value={'1-2"'} hint="Chinchilla dust, never sand" />
        <Stat label="Next bath" value={nextDate ?? "Set a date"} />
      </div>
      <Notes items={[
        "Leaving dust in the cage 24/7 causes eye irritation and over-drying.",
        humidity > 60 ? "Run a dehumidifier — chinchillas need under 50% humidity and below 24 °C to avoid heat stroke and fungus." : "Keep the room under 24 °C; chinchillas overheat easily.",
        "Reuse dust 2-3 times, sifting droppings out, then replace it.",
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 10. CHINCHILLA CAGE SIZE ═══════════ */
export function ChinchillaCageSize() {
  const [count, setCount] = useState(2);
  const [barSpacing, setBarSpacing] = useState(0.5);
  const [levels, setLevels] = useState(3);

  const width = 30 + Math.max(0, count - 2) * 6;
  const depth = 24;
  const height = 36 + Math.max(0, count - 2) * 6;
  const floorArea = Math.round(((width * depth) / 144) * 10) / 10;
  const needed = count * 4;
  const barOk = barSpacing <= 0.6;
  const shelvesOk = levels >= 3;

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Number of chinchillas</Label>
        <Input type="number" min={1} max={6} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
      </div>
      <div>
        <Label>Bar spacing (inches)</Label>
        <Input type="number" min={0.1} step={0.05} value={barSpacing} onChange={(e) => setBarSpacing(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>Number of levels / shelves</Label>
        <Input type="number" min={1} max={8} value={levels} onChange={(e) => setLevels(Number(e.target.value) || 1)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={barOk && shelvesOk ? "safe" : "caution"}>
        {!barOk ? "Bar spacing too wide" : !shelvesOk ? "Add more levels for jumping" : "Setup looks good"}
      </Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Minimum cage" value={`${width}" W × ${depth}" D × ${height}" H`} />
        <Stat label="Floor area" value={`${floorArea} sq ft`} hint={`Target ${needed} sq ft of total shelf + floor space`} />
        <Stat label="Levels" value={`${levels}`} hint="3+ for natural jumping" />
        <Stat label="Max bar spacing" value={'0.6"'} />
      </div>
      <Notes items={[
        "Use kiln-dried pine or fleece-covered shelves — wire flooring causes bumblefoot.",
        "Keep the cage away from windows and vents; 15-21 °C is the safe temperature band.",
        "Include a hay rack, chew blocks, a hide per chinchilla and a 15\" solid saucer or wheel.",
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 11. TORTOISE HIBERNATION PLANNER ═══════════ */
const HIBERNATORS: Record<string, { weeks: [number, number]; hibernates: boolean; note: string }> = {
  "hermann": { weeks: [8, 16], hibernates: true, note: "Classic Mediterranean hibernator — 4-8 °C fridge method works well." },
  "russian": { weeks: [8, 14], hibernates: true, note: "Tolerates cooler brumation; ensure a full pre-hibernation health check." },
  "greek-spur-thighed": { weeks: [8, 12], hibernates: true, note: "Shorter periods suit captive Greeks; libyan/tunisian races should not hibernate." },
  "marginated": { weeks: [8, 14], hibernates: true, note: "Very similar to Hermann's requirements." },
  "sulcata": { weeks: [0, 0], hibernates: false, note: "African species — NEVER hibernate. Keep warm year-round." },
  "leopard": { weeks: [0, 0], hibernates: false, note: "Tropical/subtropical — does not hibernate." },
  "red-footed": { weeks: [0, 0], hibernates: false, note: "Tropical rainforest species — no hibernation." },
  "box-turtle": { weeks: [8, 16], hibernates: true, note: "North American box turtles brumate; use a controlled cool box or fridge." },
};

export function TortoiseHibernationPlanner() {
  const [species, setSpecies] = useState("hermann");
  const [weight, setWeight] = useState(800); // grams
  const [lengthCm, setLengthCm] = useState(15);
  const [start, setStart] = useState("");
  const [weeks, setWeeks] = useState(10);

  const info = HIBERNATORS[species];
  const jackson = Math.round((weight / Math.pow(lengthCm, 3)) * 1000 * 100) / 100; // ratio g/cm³ ×1000
  const jacksonOk = jackson >= 0.19 && jackson <= 0.24;

  const dates = useMemo(() => {
    if (!start) return null;
    const fastStart = new Date(start);
    const cooling = new Date(fastStart); cooling.setDate(cooling.getDate() + 14);
    const sleep = new Date(cooling); sleep.setDate(sleep.getDate() + 7);
    const wake = new Date(sleep); wake.setDate(wake.getDate() + weeks * 7);
    const warmUp = new Date(wake); warmUp.setDate(warmUp.getDate() + 2);
    const f = (d: Date) => d.toISOString().slice(0, 10);
    return { fast: f(fastStart), cooling: f(cooling), sleep: f(sleep), wake: f(wake), warmUp: f(warmUp) };
  }, [start, weeks]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Species</Label>
        <Select value={species} onValueChange={(v) => setSpecies(v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(HIBERNATORS).map((k) => <SelectItem key={k} value={k}>{k.replace(/-/g, " ")}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div>
        <Label>Weight (grams)</Label>
        <Input type="number" min={10} value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>Straight carapace length (cm)</Label>
        <Input type="number" min={2} step={0.5} value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value) || 1)} />
      </div>
      <div>
        <Label>Planned start of fasting</Label>
        <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
      </div>
      <div>
        <Label>Hibernation length (weeks)</Label>
        <Input type="number" min={4} max={20} value={weeks} onChange={(e) => setWeeks(Number(e.target.value) || 4)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={!info.hibernates ? "danger" : jacksonOk ? "safe" : "caution"}>
        {!info.hibernates ? "Do NOT hibernate this species" : jacksonOk ? "Body condition suitable" : "Body condition outside safe range"}
      </Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Recommended length" value={info.hibernates ? `${info.weeks[0]}-${info.weeks[1]} weeks` : "None"} />
        <Stat label="Jackson ratio" value={`${jackson}`} hint="Healthy ≈ 0.19-0.24" />
        <Stat label="Target temperature" value="4-8 °C" hint="Never below 2 °C or above 10 °C" />
        <Stat label="Weight-loss limit" value={`${Math.round(weight * 0.01)} g`} hint="Max 1% of body weight per month" />
      </div>
      {dates && info.hibernates ? (
        <div className="mt-4 space-y-2 text-sm">
          <p className="font-semibold">Your timeline</p>
          <p>Start fasting: <strong>{dates.fast}</strong> (gut must be empty — 2-4 weeks depending on size)</p>
          <p>Begin cooling: <strong>{dates.cooling}</strong></p>
          <p>Into hibernation box/fridge: <strong>{dates.sleep}</strong></p>
          <p>Wake up: <strong>{dates.wake}</strong></p>
          <p>Fully warm, first bath &amp; drink: <strong>{dates.warmUp}</strong></p>
        </div>
      ) : null}
      <Notes items={[
        info.note,
        "A pre-hibernation vet check (weight, eyes, mouth, worm count) is essential every year.",
        "Weigh weekly during hibernation. Losing more than 1% of body weight per month means wake the tortoise immediately.",
        "Never hibernate a sick, underweight, or first-year hatchling tortoise without veterinary approval.",
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 12. QUAIL COOP SIZE ═══════════ */
export function QuailCoopSize() {
  const [count, setCount] = useState(10);
  const [breed, setBreed] = useState<"coturnix" | "bobwhite" | "button">("coturnix");
  const [housing, setHousing] = useState<"cage" | "aviary" | "hutch">("cage");

  const perBird = breed === "bobwhite" ? 1.5 : breed === "button" ? 0.5 : 1; // sq ft
  const multiplier = housing === "aviary" ? 2 : housing === "hutch" ? 1.25 : 1;
  const sqft = Math.round(count * perBird * multiplier * 10) / 10;
  const height = breed === "button" ? 10 : 12;
  const feeders = Math.max(1, Math.ceil(count / 10));
  const waterers = Math.max(1, Math.ceil(count / 8));
  const dustBaths = Math.max(1, Math.ceil(count / 8));
  const males = Math.max(1, Math.floor(count / 5));

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Number of quail</Label>
        <Input type="number" min={1} max={200} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
      </div>
      <div>
        <Label>Breed</Label>
        <Select value={breed} onValueChange={(v) => setBreed(v as typeof breed)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="coturnix">Coturnix / Japanese</SelectItem>
            <SelectItem value="bobwhite">Bobwhite</SelectItem>
            <SelectItem value="button">Button (Chinese painted)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Housing style</Label>
        <Select value={housing} onValueChange={(v) => setHousing(v as typeof housing)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cage">Cage / rack system</SelectItem>
            <SelectItem value="hutch">Hutch with run</SelectItem>
            <SelectItem value="aviary">Walk-in aviary</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone="safe">Recommended housing</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Floor space" value={`${sqft} sq ft`} hint={`${perBird} sq ft per bird base`} />
        <Stat label="Ceiling height" value={`${height} in`} hint="Low, padded — quail 'boink' straight up when startled" />
        <Stat label="Feeders / waterers" value={`${feeders} / ${waterers}`} />
        <Stat label="Dust baths" value={`${dustBaths}`} hint="Sand or dry soil trays" />
      </div>
      <Notes items={[
        `Keep no more than 1 male per 4-5 hens (about ${males} male${males > 1 ? "s" : ""} for this flock) to prevent hen injuries.`,
        "Use ½ inch hardware cloth — chicken wire will not stop rats, snakes or weasels.",
        "Provide overhead cover and hides; quail panic in open, brightly lit spaces.",
        housing === "cage" ? "Sloped wire floors ease egg collection but add a solid resting mat to prevent foot sores." : "Deep litter of pine shavings or sand, turned weekly, keeps ammonia down.",
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}
