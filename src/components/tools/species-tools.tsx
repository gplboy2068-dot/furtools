import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout, GeneratorLayout } from "@/components/layouts/tool-layouts";
import { Sparkles } from "lucide-react";

/* Small helpers */
function Big({ value, label, unit }: { value: string | number; label: string; unit?: string }) {
  return (
    <div className="text-center">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-4xl font-semibold text-primary">{value}</div>
      {unit && <div className="mt-1 text-sm text-muted-foreground">{unit}</div>}
    </div>
  );
}
function Rows({ items }: { items: { label: string; value: string }[] }) {
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
function Bullets({ lines }: { lines: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {lines.map((l) => (
        <li key={l} className="flex gap-2"><span className="text-primary">•</span><span>{l}</span></li>
      ))}
    </ul>
  );
}

/* ─────────── BIRDS ─────────── */
const BIRD_CAGES: Record<string, { min: string; note: string }> = {
  budgie: { min: "18\" × 18\" × 24\"", note: "Bar spacing max 1/2\"; horizontal bars for climbing." },
  cockatiel: { min: "24\" × 24\" × 30\"", note: "Bar spacing 1/2–5/8\"; needs daily out-of-cage time." },
  conure: { min: "30\" × 24\" × 36\"", note: "Bar spacing 5/8–3/4\"; heavy-duty locks — these are escape artists." },
  "african-grey": { min: "36\" × 24\" × 48\"", note: "Bar spacing 3/4–1\"; needs foraging enrichment daily." },
  macaw: { min: "48\" × 36\" × 60\"", note: "Bar spacing 1–1.5\"; ideally a walk-in aviary." },
  finch: { min: "30\" × 18\" × 18\" (pair)", note: "Wider than tall — finches fly horizontally." },
};
export function BirdCageSize() {
  const [sp, setSp] = useState("cockatiel");
  const d = BIRD_CAGES[sp];
  return (
    <CalculatorLayout
      form={<div><Label>Species</Label>
        <Select value={sp} onValueChange={setSp}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(BIRD_CAGES).map((k) => <SelectItem key={k} value={k}>{k.replace("-", " ")}</SelectItem>)}</SelectContent>
        </Select></div>}
      result={<div className="space-y-4">
        <Big value={d.min} label="Minimum cage dimensions" unit="width × depth × height" />
        <p className="text-sm text-muted-foreground text-center">{d.note}</p>
      </div>}
    />
  );
}

const BIRD_FOOD: Record<string, number> = { budgie: 35, cockatiel: 90, conure: 200, "african-grey": 400, macaw: 900, finch: 15 };
export function BirdFood() {
  const [sp, setSp] = useState("cockatiel");
  const w = BIRD_FOOD[sp];
  const total = Math.round(w * 0.1);
  return (
    <CalculatorLayout
      form={<div><Label>Species</Label>
        <Select value={sp} onValueChange={setSp}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(BIRD_FOOD).map((k) => <SelectItem key={k} value={k}>{k.replace("-", " ")}</SelectItem>)}</SelectContent>
        </Select></div>}
      result={<div className="space-y-4">
        <Big value={`${total} g`} label="Total food per day" />
        <Rows items={[
          { label: "Pellets (70%)", value: `${Math.round(total * 0.7)} g` },
          { label: "Fresh (25%)", value: `${Math.round(total * 0.25)} g` },
          { label: "Treats (5%)", value: `${Math.round(total * 0.05)} g` },
        ]} />
      </div>}
    />
  );
}

const BIRD_LIFE: Record<string, [number, number]> = {
  budgie: [5, 10], cockatiel: [15, 25], conure: [20, 30], "african-grey": [40, 60], macaw: [50, 80], finch: [4, 10], canary: [10, 15], lovebird: [15, 25],
};
export function BirdLifespan() {
  const [sp, setSp] = useState("cockatiel");
  const [a, b] = BIRD_LIFE[sp];
  return (
    <CalculatorLayout
      form={<div><Label>Species</Label>
        <Select value={sp} onValueChange={setSp}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(BIRD_LIFE).map((k) => <SelectItem key={k} value={k}>{k.replace("-", " ")}</SelectItem>)}</SelectContent>
        </Select></div>}
      result={<Big value={`${a}–${b}`} label="Expected lifespan" unit="years" />}
    />
  );
}

export function BirdWingClipGuide() {
  const [style, setStyle] = useState<"none" | "conservative" | "aggressive">("conservative");
  const advice: Record<string, string[]> = {
    none: [
      "Best for bonded, free-flight households with escape-proofing.",
      "Requires all ceiling fans off, mirrors covered, no open flames.",
      "Ideal for cockatiels, budgies, and small parrots with strong recall.",
    ],
    conservative: [
      "Trim 3–5 primary flight feathers on each wing evenly.",
      "Bird can still glide down safely — reduces crash injuries.",
      "Recheck every 6–12 months as feathers regrow.",
    ],
    aggressive: [
      "Not recommended — high risk of injury on descent.",
      "Can cause behavioral issues from loss of confidence.",
      "Consult an avian vet or certified groomer before considering.",
    ],
  };
  return (
    <CalculatorLayout
      form={<div><Label>Style</Label>
        <Select value={style} onValueChange={(v: "none" | "conservative" | "aggressive") => setStyle(v)}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No clip (full flight)</SelectItem>
            <SelectItem value="conservative">Conservative clip</SelectItem>
            <SelectItem value="aggressive">Heavy clip</SelectItem>
          </SelectContent>
        </Select></div>}
      result={<Bullets lines={advice[style]} />}
    />
  );
}

/* ─────────── FISH ─────────── */
export function AquariumVolume() {
  const [L, setL] = useState(36); const [W, setW] = useState(18); const [H, setH] = useState(20);
  const gal = (L * W * H) / 231;
  const actual = gal * 0.9;
  return (
    <CalculatorLayout
      form={<>
        <div className="grid grid-cols-3 gap-3">
          <div><Label>Length (in)</Label><Input type="number" value={L} onChange={(e) => setL(+e.target.value || 0)} className="mt-1.5" /></div>
          <div><Label>Width (in)</Label><Input type="number" value={W} onChange={(e) => setW(+e.target.value || 0)} className="mt-1.5" /></div>
          <div><Label>Height (in)</Label><Input type="number" value={H} onChange={(e) => setH(+e.target.value || 0)} className="mt-1.5" /></div>
        </div>
      </>}
      result={<div className="space-y-4">
        <Big value={`${actual.toFixed(1)} gal`} label="Actual water volume" unit={`${(actual * 3.785).toFixed(0)} liters`} />
        <Rows items={[
          { label: "Dry volume", value: `${gal.toFixed(1)} gal` },
          { label: "After ~10% displacement", value: `${actual.toFixed(1)} gal` },
        ]} />
      </div>}
    />
  );
}

export function FishStocking() {
  const [gal, setGal] = useState(20);
  const [inches, setInches] = useState(6);
  const [turnover, setTurnover] = useState(5);
  const bio = Math.min(100, Math.round((inches / gal) * 100 * (5 / Math.max(turnover, 1))));
  const label = bio < 60 ? "Comfortable" : bio < 80 ? "Full but ok" : bio < 100 ? "Crowded" : "Overstocked";
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Water volume (gal)</Label><Input type="number" value={gal} onChange={(e) => setGal(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Combined adult fish length (in)</Label><Input type="number" value={inches} onChange={(e) => setInches(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Filter turnover (× tank volume /hr)</Label><Input type="number" value={turnover} onChange={(e) => setTurnover(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-4">
        <Big value={`${bio}%`} label="Bioload" unit={label} />
        <p className="text-sm text-muted-foreground text-center">Under 80% is a safe long-term target.</p>
      </div>}
    />
  );
}

export function TankCyclingTracker() {
  const [nh3, setNh3] = useState(0);
  const [no2, setNo2] = useState(0);
  const [no3, setNo3] = useState(20);
  const status =
    nh3 === 0 && no2 === 0 && no3 > 5 ? "Cycled — ready for fish" :
    nh3 > 0 && no2 === 0 ? "Ammonia stage — early" :
    no2 > 0 ? "Nitrite spike — keep going" :
    "Still cycling — test daily";
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Ammonia (ppm)</Label><Input type="number" step={0.25} value={nh3} onChange={(e) => setNh3(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Nitrite (ppm)</Label><Input type="number" step={0.25} value={no2} onChange={(e) => setNo2(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Nitrate (ppm)</Label><Input type="number" value={no3} onChange={(e) => setNo3(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<Big value={status} label="Cycle status" />}
    />
  );
}

export function WaterChangeScheduler() {
  const [gal, setGal] = useState(40);
  const [load, setLoad] = useState<"light" | "medium" | "heavy">("medium");
  const [planted, setPlanted] = useState<"none" | "some" | "dense">("some");
  const base = load === "light" ? 0.2 : load === "medium" ? 0.3 : 0.4;
  const adj = planted === "dense" ? -0.1 : planted === "none" ? 0.05 : 0;
  const pct = Math.round((base + adj) * 100);
  const vol = Math.round(gal * (pct / 100));
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Tank size (gal)</Label><Input type="number" value={gal} onChange={(e) => setGal(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Stocking</Label>
          <Select value={load} onValueChange={(v: "light" | "medium" | "heavy") => setLoad(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="heavy">Heavy</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Plants</Label>
          <Select value={planted} onValueChange={(v: "none" | "some" | "dense") => setPlanted(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem><SelectItem value="some">Some</SelectItem><SelectItem value="dense">Dense</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<Big value={`${pct}% weekly`} label="Recommended change" unit={`≈ ${vol} gal each week`} />}
    />
  );
}

export function FishFood() {
  const [count, setCount] = useState(6);
  const [size, setSize] = useState<"nano" | "small" | "medium" | "large">("small");
  const gPer = { nano: 0.05, small: 0.15, medium: 0.5, large: 2 }[size];
  const total = (count * gPer).toFixed(2);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Number of fish</Label><Input type="number" min={1} value={count} onChange={(e) => setCount(+e.target.value || 1)} className="mt-1.5" /></div>
        <div><Label>Adult size</Label>
          <Select value={size} onValueChange={(v: "nano" | "small" | "medium" | "large") => setSize(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="nano">Nano (~1 in)</SelectItem>
              <SelectItem value="small">Small (2–3 in)</SelectItem>
              <SelectItem value="medium">Medium (4–6 in)</SelectItem>
              <SelectItem value="large">Large (7+ in)</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<Big value={`${total} g`} label="Total food per day" unit="split into 1–2 feedings" />}
    />
  );
}

export function HeaterWattage() {
  const [gal, setGal] = useState(20);
  const [rise, setRise] = useState(10);
  const min = gal * 3 * (rise / 10);
  const comfy = gal * 5 * (rise / 10);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Tank size (gal)</Label><Input type="number" value={gal} onChange={(e) => setGal(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Desired temp rise (°F above room)</Label><Input type="number" value={rise} onChange={(e) => setRise(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-4">
        <Big value={`${Math.round(min)}–${Math.round(comfy)} W`} label="Recommended heater" />
        <p className="text-sm text-muted-foreground text-center">For safety, split into two smaller heaters if over 200 W.</p>
      </div>}
    />
  );
}

export function AquariumLighting() {
  const [tier, setTier] = useState<"low" | "medium" | "high">("low");
  const target = { low: "20–30 PAR", medium: "30–60 PAR", high: "60–120 PAR (CO2 required)" }[tier];
  const tips = {
    low: ["Java fern, Anubias, cryptocorynes thrive.", "Standard LED strip is enough.", "6–8 hours photoperiod."],
    medium: ["Rooted stems and easy carpets possible.", "Consider dimmable LED with 30+ PAR.", "Monitor for algae; nutrient dosing helps."],
    high: ["Carpets like HC, Utricularia, red plants.", "Pressurized CO2 is effectively required.", "6-hour photoperiod, aggressive maintenance."],
  }[tier];
  return (
    <CalculatorLayout
      form={<div><Label>Plant demand</Label>
        <Select value={tier} onValueChange={(v: "low" | "medium" | "high") => setTier(v)}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low-light (easy plants)</SelectItem>
            <SelectItem value="medium">Medium-light</SelectItem>
            <SelectItem value="high">High-light (carpets, red)</SelectItem>
          </SelectContent>
        </Select></div>}
      result={<div className="space-y-4">
        <Big value={target} label="Target PAR at substrate" />
        <Bullets lines={tips} />
      </div>}
    />
  );
}

export function FishTankCost() {
  const [gal, setGal] = useState(20);
  const [tier, setTier] = useState<"basic" | "planted" | "reef">("basic");
  const perGal = { basic: 11, planted: 22, reef: 55 }[tier];
  const total = gal * perGal + 60; // base kit
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Tank size (gal)</Label><Input type="number" value={gal} onChange={(e) => setGal(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Tier</Label>
          <Select value={tier} onValueChange={(v: "basic" | "planted" | "reef") => setTier(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic freshwater</SelectItem>
              <SelectItem value="planted">Planted community</SelectItem>
              <SelectItem value="reef">Reef / saltwater</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<Big value={`~$${total.toFixed(0)}`} label="Estimated startup cost" unit="tank, filter, heater, light, substrate, decor" />}
    />
  );
}

/* ─────────── SMALL PETS ─────────── */
export function RabbitHay() {
  const [lb, setLb] = useState(5);
  const grams = Math.round(lb * 30); // ~30 g/lb body weight
  return (
    <CalculatorLayout
      form={<div><Label>Rabbit weight (lb)</Label>
        <Input type="number" value={lb} onChange={(e) => setLb(+e.target.value || 0)} className="mt-1.5" /></div>}
      result={<div className="space-y-4">
        <Big value={`${grams} g`} label="Hay per day" unit={`≈ ${(grams * 7 / 1000).toFixed(1)} kg per week`} />
        <p className="text-sm text-muted-foreground text-center">Always available, refreshed daily. Adults: grass hays only.</p>
      </div>}
    />
  );
}

export function RabbitCageSize() {
  const [n, setN] = useState(1);
  const pen = 12 * n;
  const run = 32 * n;
  return (
    <CalculatorLayout
      form={<div><Label>Number of rabbits</Label>
        <Input type="number" min={1} value={n} onChange={(e) => setN(+e.target.value || 1)} className="mt-1.5" /></div>}
      result={<div className="space-y-4">
        <Big value={`${pen} sq ft`} label="Minimum pen area" />
        <Rows items={[
          { label: "Recommended run", value: `${run} sq ft` },
          { label: "Daily free-roam", value: "3+ hours" },
        ]} />
      </div>}
    />
  );
}

export function RabbitFood() {
  const [lb, setLb] = useState(5);
  const cups = ((lb / 5) * 0.25).toFixed(2);
  return (
    <CalculatorLayout
      form={<div><Label>Rabbit weight (lb)</Label>
        <Input type="number" value={lb} onChange={(e) => setLb(+e.target.value || 0)} className="mt-1.5" /></div>}
      result={<Big value={`${cups} cup`} label="Pellets per day" unit="alongside unlimited hay" />}
    />
  );
}

export function RabbitAge() {
  const [yr, setYr] = useState(3);
  const human = yr === 0 ? 0 : yr === 1 ? 21 : yr === 2 ? 27 : 27 + (yr - 2) * 6;
  return (
    <CalculatorLayout
      form={<div><Label>Rabbit age (years)</Label>
        <Input type="number" min={0} value={yr} onChange={(e) => setYr(+e.target.value || 0)} className="mt-1.5" /></div>}
      result={<Big value={`≈ ${human}`} label="Human-year equivalent" unit="years" />}
    />
  );
}

export function HamsterCageSize() {
  const [sp, setSp] = useState<"syrian" | "dwarf" | "robo">("syrian");
  const min = 450;
  const rec = sp === "robo" ? 700 : sp === "dwarf" ? 500 : 600;
  return (
    <CalculatorLayout
      form={<div><Label>Species</Label>
        <Select value={sp} onValueChange={(v: "syrian" | "dwarf" | "robo") => setSp(v)}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="syrian">Syrian</SelectItem>
            <SelectItem value="dwarf">Dwarf</SelectItem>
            <SelectItem value="robo">Roborovski</SelectItem>
          </SelectContent></Select></div>}
      result={<div className="space-y-3">
        <Big value={`${min} sq in`} label="Absolute minimum" unit="unbroken floor area" />
        <p className="text-center text-sm text-muted-foreground">Recommended for wellbeing: <span className="font-medium text-foreground">{rec}+ sq in</span></p>
      </div>}
    />
  );
}

export function HamsterFood() {
  const [g, setG] = useState(150);
  const daily = Math.round(g * 0.1);
  return (
    <CalculatorLayout
      form={<div><Label>Weight (g)</Label>
        <Input type="number" value={g} onChange={(e) => setG(+e.target.value || 0)} className="mt-1.5" /></div>}
      result={<Big value={`${daily} g`} label="Daily food mix" unit="scatter-fed for enrichment" />}
    />
  );
}

export function GuineaPigVitaminC() {
  const [state, setState] = useState<"adult" | "pregnant" | "sick">("adult");
  const map = { adult: "10–30 mg", pregnant: "30–50 mg", sick: "50 mg+" };
  return (
    <CalculatorLayout
      form={<div><Label>Life stage</Label>
        <Select value={state} onValueChange={(v: "adult" | "pregnant" | "sick") => setState(v)}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="adult">Healthy adult</SelectItem>
            <SelectItem value="pregnant">Pregnant sow</SelectItem>
            <SelectItem value="sick">Recovering / stressed</SelectItem>
          </SelectContent></Select></div>}
      result={<div className="space-y-3">
        <Big value={map[state]} label="Vitamin C per day" />
        <p className="text-center text-sm text-muted-foreground">Best sources: bell pepper (40 mg/slice), parsley, kale.</p>
      </div>}
    />
  );
}

const HAMSTER_LIFE: Record<string, [number, number]> = {
  syrian: [2, 3], dwarf: [1.5, 3], roborovski: [3, 4],
};
export function HamsterLifespan() {
  const [sp, setSp] = useState("syrian");
  const [a, b] = HAMSTER_LIFE[sp];
  return (
    <CalculatorLayout
      form={<div><Label>Species</Label>
        <Select value={sp} onValueChange={setSp}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(HAMSTER_LIFE).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
        </Select></div>}
      result={<Big value={`${a}–${b}`} label="Expected lifespan" unit="years" />}
    />
  );
}

/* ─────────── REPTILES ─────────── */
const REPTILE_ENC: Record<string, string> = {
  "bearded-dragon": "48 × 24 × 24 in (120 gal)",
  "leopard-gecko": "36 × 18 × 18 in (40 gal)",
  "ball-python": "48 × 24 × 24 in adult",
  "corn-snake": "48 × 24 × 24 in adult",
  "crested-gecko": "18 × 18 × 24 in",
  "blue-tongue-skink": "48 × 24 × 24 in",
};
export function ReptileEnclosure() {
  const [sp, setSp] = useState("bearded-dragon");
  return (
    <CalculatorLayout
      form={<div><Label>Species</Label>
        <Select value={sp} onValueChange={setSp}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(REPTILE_ENC).map((k) => <SelectItem key={k} value={k}>{k.replace(/-/g, " ")}</SelectItem>)}</SelectContent>
        </Select></div>}
      result={<Big value={REPTILE_ENC[sp]} label="Minimum adult enclosure" />}
    />
  );
}

export function ReptileUVB() {
  const [bulb, setBulb] = useState<"t5-5" | "t5-10" | "t8-5" | "t8-10">("t5-10");
  const [mesh, setMesh] = useState<"none" | "fine">("fine");
  const base = { "t5-5": 12, "t5-10": 15, "t8-5": 8, "t8-10": 10 }[bulb];
  const dist = mesh === "fine" ? base : base + 4;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Bulb type</Label>
          <Select value={bulb} onValueChange={(v: "t5-5" | "t5-10" | "t8-5" | "t8-10") => setBulb(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="t5-5">T5 HO 5.0</SelectItem>
              <SelectItem value="t5-10">T5 HO 10.0</SelectItem>
              <SelectItem value="t8-5">T8 5.0</SelectItem>
              <SelectItem value="t8-10">T8 10.0</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Mesh screen?</Label>
          <Select value={mesh} onValueChange={(v: "none" | "fine") => setMesh(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fine">Fine mesh</SelectItem>
              <SelectItem value="none">No mesh</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<Big value={`${dist} in`} label="Basking distance from bulb" unit="measure from bulb surface to reptile's back" />}
    />
  );
}

export function ReptileFeeder() {
  const [type, setType] = useState<"insect" | "rodent">("insect");
  const [size, setSize] = useState(1); // inches head width or body width
  const prey = type === "insect"
    ? size <= 0.25 ? "Pinhead / small cricket" : size <= 0.5 ? "1/4\" cricket or dubia" : size <= 1 ? "Adult cricket, medium dubia" : "Large dubia, hornworm"
    : size <= 0.75 ? "Pinky mouse" : size <= 1.25 ? "Fuzzy / small mouse" : size <= 2 ? "Adult mouse or weanling rat" : "Small–medium rat";
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Prey type</Label>
          <Select value={type} onValueChange={(v: "insect" | "rodent") => setType(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="insect">Insects</SelectItem>
              <SelectItem value="rodent">Rodents</SelectItem>
            </SelectContent></Select></div>
        <div><Label>{type === "insect" ? "Space between eyes (in)" : "Snake body width (in)"}</Label>
          <Input type="number" step={0.25} value={size} onChange={(e) => setSize(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<Big value={prey} label="Recommended prey size" />}
    />
  );
}

export function SnakeFeedingSchedule() {
  const [sp, setSp] = useState<"ball" | "corn" | "king" | "boa">("ball");
  const [stage, setStage] = useState<"hatchling" | "juvenile" | "adult">("juvenile");
  const map: Record<string, Record<string, string>> = {
    ball:  { hatchling: "Weekly small mouse", juvenile: "Every 7–10 days, medium mouse", adult: "Every 10–14 days, small rat" },
    corn:  { hatchling: "Every 5–7 days, pinky", juvenile: "Every 7 days, fuzzy", adult: "Every 10–14 days, adult mouse" },
    king:  { hatchling: "Every 5–7 days, pinky", juvenile: "Every 7 days, fuzzy", adult: "Every 10–14 days, adult mouse" },
    boa:   { hatchling: "Weekly fuzzy", juvenile: "Every 10 days, weanling rat", adult: "Every 2–3 weeks, medium rat" },
  };
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Species</Label>
          <Select value={sp} onValueChange={(v: "ball" | "corn" | "king" | "boa") => setSp(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ball">Ball python</SelectItem>
              <SelectItem value="corn">Corn snake</SelectItem>
              <SelectItem value="king">King snake</SelectItem>
              <SelectItem value="boa">Boa</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Age</Label>
          <Select value={stage} onValueChange={(v: "hatchling" | "juvenile" | "adult") => setStage(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hatchling">Hatchling</SelectItem>
              <SelectItem value="juvenile">Juvenile</SelectItem>
              <SelectItem value="adult">Adult</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<Big value={map[sp][stage]} label="Feeding schedule" />}
    />
  );
}

export function TurtleTank() {
  const [shell, setShell] = useState(5);
  const [count, setCount] = useState(1);
  const gal = shell * 10 + (count - 1) * shell * 5;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Shell length (in)</Label><Input type="number" value={shell} onChange={(e) => setShell(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Number of turtles</Label><Input type="number" min={1} value={count} onChange={(e) => setCount(+e.target.value || 1)} className="mt-1.5" /></div>
      </>}
      result={<Big value={`${gal} gal`} label="Minimum tank size" unit="plus full-basking dock" />}
    />
  );
}

/* ─────────── HORSES ─────────── */
export function HorseFeed() {
  const [lb, setLb] = useState(1000);
  const [work, setWork] = useState<"idle" | "light" | "medium" | "hard">("idle");
  const hay = Math.round(lb * 0.02);
  const grain = { idle: 0, light: 2, medium: 4, hard: 6 }[work];
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Horse weight (lb)</Label><Input type="number" value={lb} onChange={(e) => setLb(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Work level</Label>
          <Select value={work} onValueChange={(v: "idle" | "light" | "medium" | "hard") => setWork(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="idle">Idle / pasture</SelectItem>
              <SelectItem value="light">Light (1 hr/day)</SelectItem>
              <SelectItem value="medium">Medium (2–3 hr)</SelectItem>
              <SelectItem value="hard">Hard (racing, endurance)</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<div className="space-y-3">
        <Big value={`${hay} lb hay/day`} label="Forage requirement" />
        <p className="text-center text-sm text-muted-foreground">Concentrate: <span className="font-medium text-foreground">{grain} lb/day</span></p>
      </div>}
    />
  );
}

export function HorseWater() {
  const [lb, setLb] = useState(1000);
  const [climate, setClimate] = useState<"cool" | "hot">("cool");
  const [work, setWork] = useState<"light" | "hard">("light");
  const base = (lb / 100) * 0.75;
  const mult = (climate === "hot" ? 1.5 : 1) * (work === "hard" ? 1.5 : 1);
  const gal = Math.round(base * mult);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Horse weight (lb)</Label><Input type="number" value={lb} onChange={(e) => setLb(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Climate</Label>
          <Select value={climate} onValueChange={(v: "cool" | "hot") => setClimate(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="cool">Cool</SelectItem><SelectItem value="hot">Hot</SelectItem></SelectContent></Select></div>
        <div><Label>Work</Label>
          <Select value={work} onValueChange={(v: "light" | "hard") => setWork(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="light">Light</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent></Select></div>
      </>}
      result={<Big value={`${gal} gal`} label="Water per day" />}
    />
  );
}

export function HorseAge() {
  const [yr, setYr] = useState(5);
  const human = yr <= 0 ? 0 : yr === 1 ? 6.5 : yr === 2 ? 13 : yr === 3 ? 18 : 18 + (yr - 3) * 2.5;
  return (
    <CalculatorLayout
      form={<div><Label>Horse age (years)</Label>
        <Input type="number" min={0} value={yr} onChange={(e) => setYr(+e.target.value || 0)} className="mt-1.5" /></div>}
      result={<Big value={`≈ ${human}`} label="Human-year equivalent" unit="years" />}
    />
  );
}

export function HorseBCS() {
  const [ribs, setRibs] = useState<"visible" | "buried" | "hidden">("buried");
  const [top, setTop] = useState<"sharp" | "level" | "crease">("level");
  const score = (ribs === "visible" ? 3 : ribs === "buried" ? 5 : 7) + (top === "sharp" ? -1 : top === "level" ? 0 : 2);
  const label = score <= 3 ? "Thin" : score <= 5 ? "Ideal" : score <= 7 ? "Fleshy" : "Obese";
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Ribs</Label>
          <Select value={ribs} onValueChange={(v: "visible" | "buried" | "hidden") => setRibs(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="buried">Slightly buried, easily felt</SelectItem>
              <SelectItem value="hidden">Not felt without pressure</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Topline</Label>
          <Select value={top} onValueChange={(v: "sharp" | "level" | "crease") => setTop(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sharp">Sharp withers, prominent spine</SelectItem>
              <SelectItem value="level">Level, muscled</SelectItem>
              <SelectItem value="crease">Crease down back</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<Big value={`${Math.max(1, Math.min(9, score))}/9`} label="Henneke BCS" unit={label} />}
    />
  );
}

/* ─────────── FARM ─────────── */
export function ChickenCoopSize() {
  const [count, setCount] = useState(6);
  const [size, setSize] = useState<"bantam" | "standard" | "heavy">("standard");
  const per = { bantam: [2, 5], standard: [4, 10], heavy: [6, 15] }[size];
  const coop = count * per[0];
  const run = count * per[1];
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Number of hens</Label><Input type="number" min={1} value={count} onChange={(e) => setCount(+e.target.value || 1)} className="mt-1.5" /></div>
        <div><Label>Breed type</Label>
          <Select value={size} onValueChange={(v: "bantam" | "standard" | "heavy") => setSize(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bantam">Bantam</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="heavy">Heavy (Orpington, Brahma)</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<div className="space-y-3">
        <Big value={`${coop} sq ft coop`} label="Coop minimum" />
        <p className="text-center text-sm text-muted-foreground">Run: <span className="font-medium text-foreground">{run} sq ft</span></p>
      </div>}
    />
  );
}

export function ChickenEggProduction() {
  const [count, setCount] = useState(6);
  const [breed, setBreed] = useState<"leghorn" | "sexlink" | "heritage" | "bantam">("sexlink");
  const [season, setSeason] = useState<"summer" | "winter">("summer");
  const perHen = { leghorn: 6, sexlink: 5.5, heritage: 3.5, bantam: 2.5 }[breed];
  const adj = season === "winter" ? 0.5 : 1;
  const weekly = Math.round(count * perHen * adj);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Number of hens</Label><Input type="number" min={1} value={count} onChange={(e) => setCount(+e.target.value || 1)} className="mt-1.5" /></div>
        <div><Label>Breed</Label>
          <Select value={breed} onValueChange={(v: "leghorn" | "sexlink" | "heritage" | "bantam") => setBreed(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="leghorn">Leghorn</SelectItem>
              <SelectItem value="sexlink">Sex-Link / ISA Brown</SelectItem>
              <SelectItem value="heritage">Heritage (Orpington, Wyandotte)</SelectItem>
              <SelectItem value="bantam">Bantam</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Season</Label>
          <Select value={season} onValueChange={(v: "summer" | "winter") => setSeason(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="summer">Summer / long day</SelectItem>
              <SelectItem value="winter">Winter / short day</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<Big value={`~${weekly} eggs/week`} label="Expected production" />}
    />
  );
}

export function GoatFeed() {
  const [lb, setLb] = useState(150);
  const [prod, setProd] = useState<"dry" | "milking" | "meat">("dry");
  const hay = Math.round(lb * 0.03);
  const grain = prod === "milking" ? 3 : prod === "meat" ? 1 : 0.5;
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Goat weight (lb)</Label><Input type="number" value={lb} onChange={(e) => setLb(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Production</Label>
          <Select value={prod} onValueChange={(v: "dry" | "milking" | "meat") => setProd(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dry">Dry / maintenance</SelectItem>
              <SelectItem value="milking">Milking doe</SelectItem>
              <SelectItem value="meat">Growing meat</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<div className="space-y-3">
        <Big value={`${hay} lb hay/day`} label="Forage" />
        <p className="text-center text-sm text-muted-foreground">Grain: <span className="font-medium text-foreground">{grain} lb/day</span></p>
      </div>}
    />
  );
}

export function DuckPondSize() {
  const [count, setCount] = useState(4);
  const water = count * 20;
  const coop = count * 4;
  const run = count * 15;
  return (
    <CalculatorLayout
      form={<div><Label>Number of ducks</Label>
        <Input type="number" min={1} value={count} onChange={(e) => setCount(+e.target.value || 1)} className="mt-1.5" /></div>}
      result={<div className="space-y-3">
        <Big value={`${water} gal water`} label="Open water" />
        <Rows items={[
          { label: "Coop", value: `${coop} sq ft` },
          { label: "Run", value: `${run} sq ft` },
        ]} />
      </div>}
    />
  );
}

/* ─────────── EXTRA D/C/G ─────────── */
export function DogChocolateToxicity() {
  const [lb, setLb] = useState(20);
  const [type, setType] = useState<"white" | "milk" | "dark" | "baking">("milk");
  const [oz, setOz] = useState(1);
  const mgPerOz = { white: 1, milk: 60, dark: 150, baking: 400 }[type];
  const kg = lb / 2.2046;
  const dose = (oz * mgPerOz) / kg;
  const risk = dose < 20 ? "Low — monitor" : dose < 40 ? "Moderate — call vet" : dose < 60 ? "Serious — vet now" : "Critical — emergency vet";
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Dog weight (lb)</Label><Input type="number" value={lb} onChange={(e) => setLb(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>Chocolate type</Label>
          <Select value={type} onValueChange={(v: "white" | "milk" | "dark" | "baking") => setType(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="milk">Milk</SelectItem>
              <SelectItem value="dark">Dark / semi-sweet</SelectItem>
              <SelectItem value="baking">Baking chocolate</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Amount eaten (oz)</Label><Input type="number" step={0.25} value={oz} onChange={(e) => setOz(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-3">
        <Big value={risk} label="Risk level" />
        <p className="text-center text-sm text-muted-foreground">Theobromine dose: <span className="font-medium text-foreground">{dose.toFixed(1)} mg/kg</span></p>
        <p className="text-center text-xs text-muted-foreground">ASPCA Poison Control: (888) 426-4435</p>
      </div>}
    />
  );
}

export function DogBenadrylDose() {
  const [lb, setLb] = useState(30);
  const mg = lb; // 1 mg/lb
  return (
    <CalculatorLayout
      form={<div><Label>Dog weight (lb)</Label>
        <Input type="number" value={lb} onChange={(e) => setLb(+e.target.value || 0)} className="mt-1.5" /></div>}
      result={<div className="space-y-3">
        <Big value={`${mg} mg`} label="Per dose" unit="up to 3× daily — confirm with your vet" />
        <p className="text-center text-sm text-muted-foreground">Standard 25 mg tablets: <span className="font-medium text-foreground">{Math.max(0.5, Math.round((mg / 25) * 2) / 2)} tab</span></p>
      </div>}
    />
  );
}

export function CatLitterBoxCount() {
  const [n, setN] = useState(1);
  return (
    <CalculatorLayout
      form={<div><Label>Number of cats</Label>
        <Input type="number" min={1} value={n} onChange={(e) => setN(+e.target.value || 1)} className="mt-1.5" /></div>}
      result={<div className="space-y-3">
        <Big value={n + 1} label="Litter boxes needed" unit="N + 1 rule" />
        <p className="text-center text-sm text-muted-foreground">Spread across floors, away from food and loud appliances.</p>
      </div>}
    />
  );
}

export function PetCarbonPawprint() {
  const [pet, setPet] = useState<"small-dog" | "med-dog" | "large-dog" | "cat">("med-dog");
  const [diet, setDiet] = useState<"meat" | "mixed" | "insect">("meat");
  const base = { "small-dog": 350, "med-dog": 770, "large-dog": 1400, cat: 310 }[pet];
  const mult = { meat: 1, mixed: 0.7, insect: 0.4 }[diet];
  const co2 = Math.round(base * mult);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>Pet</Label>
          <Select value={pet} onValueChange={(v: "small-dog" | "med-dog" | "large-dog" | "cat") => setPet(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="small-dog">Small dog</SelectItem>
              <SelectItem value="med-dog">Medium dog</SelectItem>
              <SelectItem value="large-dog">Large dog</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
            </SelectContent></Select></div>
        <div><Label>Diet</Label>
          <Select value={diet} onValueChange={(v: "meat" | "mixed" | "insect") => setDiet(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="meat">Meat-based</SelectItem>
              <SelectItem value="mixed">Mixed / lower meat</SelectItem>
              <SelectItem value="insect">Insect / novel protein</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<Big value={`${co2} kg`} label="CO2e per year" unit="mostly from diet" />}
    />
  );
}

export function PetMemorialGenerator() {
  const [name, setName] = useState("Lucy");
  const [years, setYears] = useState(12);
  const [traits, setTraits] = useState("gentle, playful, loyal");
  const [tone, setTone] = useState<"gentle" | "celebratory" | "spiritual">("gentle");
  const text = useMemo(() => {
    const t = traits.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4).join(", ");
    if (tone === "celebratory") {
      return `For ${years} joyful years, ${name} filled our home with laughter and love. Endlessly ${t}, ${name} taught us to celebrate the small moments — the wagging welcomes, the sleepy afternoons, the shared quiet. We are so grateful for every one of those years, and ${name} will always be part of our story.`;
    }
    if (tone === "spiritual") {
      return `${name} was with us for ${years} beautiful years — ${t} in every heartbeat. Though ${name} has crossed over the rainbow bridge, the love we shared is not lost. It lives on, gentle and warm, in every quiet moment we spent together. Rest well, sweet ${name}. We will meet again.`;
    }
    return `Our beloved ${name} spent ${years} treasured years by our side. ${name} was ${t}, and every moment was a gift. We will miss the little rituals, the familiar footsteps, and the warm presence that made our home a happier place. Goodbye for now, dear ${name} — thank you for choosing us.`;
  }, [name, years, traits, tone]);
  return (
    <GeneratorLayout
      controls={<div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Pet's name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
        <div><Label>Years together</Label><Input type="number" value={years} onChange={(e) => setYears(+e.target.value || 0)} className="mt-1.5" /></div>
        <div className="sm:col-span-2"><Label>Traits (comma-separated)</Label>
          <Input value={traits} onChange={(e) => setTraits(e.target.value)} className="mt-1.5" placeholder="gentle, playful, loyal" /></div>
        <div className="sm:col-span-2"><Label>Tone</Label>
          <Select value={tone} onValueChange={(v: "gentle" | "celebratory" | "spiritual") => setTone(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="gentle">Gentle</SelectItem>
              <SelectItem value="celebratory">Celebratory</SelectItem>
              <SelectItem value="spiritual">Spiritual</SelectItem>
            </SelectContent></Select></div>
        <div className="sm:col-span-2 flex justify-end">
          <Button onClick={() => navigator.clipboard?.writeText(text)} className="gap-2"><Sparkles className="size-4" /> Copy</Button>
        </div>
      </div>}
      results={<Textarea readOnly value={text} className="min-h-[200px] font-serif text-base leading-relaxed" />}
    />
  );
}
