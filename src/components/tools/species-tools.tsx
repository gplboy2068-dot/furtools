import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout, GeneratorLayout } from "@/components/layouts/tool-layouts";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Thermometer,
  Droplets,
  Sun,
  ShieldAlert,
  Layers,
  Box,
  Maximize2,
  Activity,
  Info,
  Calendar,
  Waves,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

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

/* 1. REPTILE ENCLOSURE SIZE CALCULATOR */
interface ReptileSpeciesProfile {
  name: string;
  scientific: string;
  type: "terrestrial" | "arboreal" | "semi-arboreal" | "fossorial" | "tortoise-table";
  adultLength: string;
  adultMinLIn: number;
  adultMinWIn: number;
  adultMinHIn: number;
  adultMinGal: number;
  bestMaterial: string;
  uvbZone: string;
  baskingTemp: string;
  humidity: string;
  notes: string;
}

const REPTILE_PROFILES: Record<string, ReptileSpeciesProfile> = {
  "bearded-dragon": {
    name: "Central Bearded Dragon",
    scientific: "Pogona vitticeps",
    type: "terrestrial",
    adultLength: "18–24 in (45–60 cm)",
    adultMinLIn: 48, adultMinWIn: 24, adultMinHIn: 24, adultMinGal: 120,
    bestMaterial: "Solid PVC or Wood (holds ambient heat, front opening glass)",
    uvbZone: "Ferguson Zone 3 (UVI 3.0–5.0, 10.0/12% T5-HO)",
    baskingTemp: "100–110°F (38–43°C)",
    humidity: "30–40% (Desert)",
    notes: "Adults require at least a 4x2x2 ft (120 gallon) enclosure. A 40-gallon breeder is only acceptable for juveniles under 10 inches.",
  },
  "leopard-gecko": {
    name: "Leopard Gecko",
    scientific: "Eublepharis macularius",
    type: "terrestrial",
    adultLength: "8–11 in (20–28 cm)",
    adultMinLIn: 36, adultMinWIn: 18, adultMinHIn: 18, adultMinGal: 40,
    bestMaterial: "Glass Terrarium or PVC with front sliding doors",
    uvbZone: "Ferguson Zone 1 (UVI 0.5–1.5, 2.4%/5.0% T5 ShadeDweller)",
    baskingTemp: "90–94°F (32–34°C)",
    humidity: "30–40% (with moist hide 70-80%)",
    notes: "Modern welfare minimum is 36x18x18 in (40 gal breeder) for adults. Needs minimum 3 hides: warm, cool, and humid.",
  },
  "crested-gecko": {
    name: "Crested Gecko",
    scientific: "Correlophus ciliatus",
    type: "arboreal",
    adultLength: "8–10 in (20–25 cm)",
    adultMinLIn: 18, adultMinWIn: 18, adultMinHIn: 36, adultMinGal: 50,
    bestMaterial: "Vertical Glass or PVC Terrarium with mesh ventilation",
    uvbZone: "Ferguson Zone 1 (UVI 0.5–1.0, 2.4% / ShadeDweller)",
    baskingTemp: "75–80°F (24–27°C) - Temp >85°F is lethal!",
    humidity: "60–80% (evening spike to 85%, dry daytime to 55%)",
    notes: "Arboreal climbers. Minimum 18x18x36 in (or 24x18x24 in) for adults. Heavy vertical foliage and cork branches are essential.",
  },
  "ball-python": {
    name: "Ball Python / Royal Python",
    scientific: "Python regius",
    type: "semi-arboreal",
    adultLength: "3.5–5.0 ft (100–150 cm)",
    adultMinLIn: 48, adultMinWIn: 24, adultMinHIn: 24, adultMinGal: 120,
    bestMaterial: "Solid PVC with solid top (preserves high humidity)",
    uvbZone: "Ferguson Zone 1-2 (UVI 0.7–1.5, 5% / 6% T5-HO)",
    baskingTemp: "88–92°F (31–33°C)",
    humidity: "60–80% (never below 55%)",
    notes: "4x2x2 ft (120 gal) is the gold-standard minimum for full adult stretching. Requires two identical snug hides.",
  },
  "corn-snake": {
    name: "Corn Snake",
    scientific: "Pantherophis guttatus",
    type: "semi-arboreal",
    adultLength: "4.0–5.5 ft (120–165 cm)",
    adultMinLIn: 48, adultMinWIn: 24, adultMinHIn: 24, adultMinGal: 120,
    bestMaterial: "PVC or Glass Terrarium with escape-proof locking lid",
    uvbZone: "Ferguson Zone 1-2 (UVI 1.0–2.0, 5% / 6% T5-HO)",
    baskingTemp: "85–88°F (29–31°C)",
    humidity: "45–65% (moderate)",
    notes: "Active diurnal explorers and excellent climbers. Provide climbing branches and deep substrate for tunneling.",
  },
  "blue-tongue-skink": {
    name: "Blue-Tongued Skink (Northern / Indonesian)",
    scientific: "Tiliqua scincoides",
    type: "fossorial",
    adultLength: "18–24 in (45–60 cm)",
    adultMinLIn: 48, adultMinWIn: 24, adultMinHIn: 24, adultMinGal: 120,
    bestMaterial: "PVC (Indonesian needs high humidity PVC; Northern tolerates wood/glass)",
    uvbZone: "Ferguson Zone 2-3 (UVI 2.0–4.0, 10.0 T5-HO)",
    baskingTemp: "100–108°F (38–42°C)",
    humidity: "Northern: 40–50%, Indonesian: 70–90%",
    notes: "Heavy-bodied ground skink. Needs deep burrowing substrate (4-6 inches) and wide turning floor space.",
  },
  "veiled-chameleon": {
    name: "Veiled / Panther Chameleon",
    scientific: "Chamaeleo calyptratus / Furcifer pardalis",
    type: "arboreal",
    adultLength: "14–24 in (35–60 cm)",
    adultMinLIn: 24, adultMinWIn: 24, adultMinHIn: 48, adultMinGal: 120,
    bestMaterial: "Full Screen Aluminum Cage or Hybrid Screen/PVC",
    uvbZone: "Ferguson Zone 3 (UVI 3.0–4.0, 6% / 10.0 T5-HO Linear)",
    baskingTemp: "85–88°F (29–31°C)",
    humidity: "40–70% (fogging/misting with strict high airflow)",
    notes: "Strict arboreal species requiring maximum ventilation. Stagnant air in glass causes fatal respiratory infections.",
  },
  "uromastyx": {
    name: "Uromastyx / Spiny-tailed Lizard",
    scientific: "Uromastyx spp.",
    type: "terrestrial",
    adultLength: "10–18 in (25–45 cm)",
    adultMinLIn: 48, adultMinWIn: 24, adultMinHIn: 24, adultMinGal: 120,
    bestMaterial: "PVC or Wooden Melamine Vivarium",
    uvbZone: "Ferguson Zone 3-4 (UVI 4.0–6.0, 12% / 14% T5-HO)",
    baskingTemp: "115–125°F (46–52°C) - Intense Basking Heat!",
    humidity: "15–30% (Strict Arid - no water bowl, gets moisture from greens)",
    notes: "Requires extreme basking temperatures and powerful UVB. Must have zero dampness to prevent fatal fungal blisters.",
  },
  "russian-tortoise": {
    name: "Russian / Greek / Hermann's Tortoise",
    scientific: "Testudo horsfieldii / hermanni",
    type: "tortoise-table",
    adultLength: "6–10 in (15–25 cm)",
    adultMinLIn: 48, adultMinWIn: 36, adultMinHIn: 16, adultMinGal: 120,
    bestMaterial: "Open-Top Wooden Tortoise Table (glass walls stress tortoises)",
    uvbZone: "Ferguson Zone 3 (UVI 3.0–5.0, 10.0 / 12% T5-HO)",
    baskingTemp: "95–100°F (35–38°C)",
    humidity: "40–60% with damp micro-climate burrow",
    notes: "Tortoises do not understand glass and will pace constantly. Open-top wooden tables provide optimal floor space and airflow.",
  },
  "green-anole": {
    name: "Green Anole / Long-Tailed Lizard",
    scientific: "Anolis carolinensis",
    type: "arboreal",
    adultLength: "5–8 in (13–20 cm)",
    adultMinLIn: 18, adultMinWIn: 18, adultMinHIn: 24, adultMinGal: 30,
    bestMaterial: "Vertical Glass Bioactive Terrarium",
    uvbZone: "Ferguson Zone 2 (UVI 1.5–2.5, 5% / 6% T5-HO)",
    baskingTemp: "88–92°F (31–33°C)",
    humidity: "60–75% (misting twice daily)",
    notes: "Active diurnal climbers. Thrives in planted bioactive setups with vertical bamboo perches and live ficus/pothos.",
  },
};

export function ReptileEnclosure() {
  const [spKey, setSpKey] = useState<string>("bearded-dragon");
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [lifeStage, setLifeStage] = useState<"baby" | "juvenile" | "adult">("adult");
  const [copied, setCopied] = useState(false);

  const profile = REPTILE_PROFILES[spKey] || REPTILE_PROFILES["bearded-dragon"];

  const dim = useMemo(() => {
    let scale = 1.0;
    if (lifeStage === "baby") scale = 0.5;
    else if (lifeStage === "juvenile") scale = 0.75;

    const minLIn = Math.max(18, Math.round(profile.adultMinLIn * scale));
    const minWIn = Math.max(12, Math.round(profile.adultMinWIn * scale));
    const minHIn = Math.max(12, Math.round(profile.adultMinHIn * scale));

    const floorAreaSqFt = Number(((minLIn * minWIn) / 144).toFixed(1));
    const volumeGal = Math.round((minLIn * minWIn * minHIn) / 231);
    const floorAreaSqM = Number((floorAreaSqFt * 0.092903).toFixed(2));
    const volumeLiters = Math.round(volumeGal * 3.78541);

    const minLCm = Math.round(minLIn * 2.54);
    const minWCm = Math.round(minWIn * 2.54);
    const minHCm = Math.round(minHIn * 2.54);

    return {
      minLIn, minWIn, minHIn,
      minLCm, minWCm, minHCm,
      floorAreaSqFt, floorAreaSqM,
      volumeGal, volumeLiters,
    };
  }, [profile, lifeStage]);

  const copySpecs = () => {
    const text = `🦎 Reptile Enclosure Specs (${profile.name})
- Life Stage: ${lifeStage.toUpperCase()} (Adult length: ${profile.adultLength})
- Recommended Size: ${dim.minLIn}"L × ${dim.minWIn}"W × ${dim.minHIn}"H (${dim.minLCm} × ${dim.minWCm} × ${dim.minHCm} cm)
- Floor Footprint: ${dim.floorAreaSqFt} sq ft (${dim.floorAreaSqM} m²) | Volume: ~${dim.volumeGal} Gallons (${dim.volumeLiters} L)
- Habitat Type: ${profile.type.toUpperCase()} | Material: ${profile.bestMaterial}
- Basking Target: ${profile.baskingTemp} | Humidity: ${profile.humidity}
- UVB Target: ${profile.uvbZone}
Calculated via FurTools (https://www.furtools.com/tools/reptile-enclosure-size-calculator)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Enclosure specs copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div>
            <h3 className="font-semibold text-foreground">Reptile Species &amp; Enclosure Sizing</h3>
            <p className="text-xs text-muted-foreground">Select species and life stage to get certified minimum vivarium dimensions.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("imperial")}
              className="h-8 text-xs font-medium"
            >
              Inches / Gallons
            </Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("metric")}
              className="h-8 text-xs font-medium"
            >
              Centimeters / Liters
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Select Species</Label>
            <Select value={spKey} onValueChange={setSpKey}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.entries(REPTILE_PROFILES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Life Stage</Label>
            <Select value={lifeStage} onValueChange={(v: "baby" | "juvenile" | "adult") => setLifeStage(v)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adult">Adult (Full Grown Minimum)</SelectItem>
                <SelectItem value="juvenile">Juvenile / Sub-Adult</SelectItem>
                <SelectItem value="baby">Baby / Hatchling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Box */}
      <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">Minimum Recommended Dimensions</span>
            <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              {unit === "imperial" ? (
                <>{dim.minLIn}&quot; L × {dim.minWIn}&quot; W × {dim.minHIn}&quot; H</>
              ) : (
                <>{dim.minLCm} × {dim.minWCm} × {dim.minHCm} cm</>
              )}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {profile.name} ({profile.scientific}) • Adult Size: {profile.adultLength}
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={copySpecs} className="gap-1.5 text-xs font-medium shrink-0">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Specs"}
          </Button>
        </div>

        {/* 4 Stat Badges */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Floor Footprint</div>
            <div className="mt-1 text-lg font-bold text-foreground">
              {unit === "imperial" ? `${dim.floorAreaSqFt} sq ft` : `${dim.floorAreaSqM} m²`}
            </div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Enclosure Volume</div>
            <div className="mt-1 text-lg font-bold text-foreground">
              {unit === "imperial" ? `~${dim.volumeGal} Gallons` : `~${dim.volumeLiters} Liters`}
            </div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Basking Surface</div>
            <div className="mt-1 text-sm font-bold text-rose-600 dark:text-rose-400">{profile.baskingTemp}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">UVB Target</div>
            <div className="mt-1 text-xs font-bold text-amber-600 dark:text-amber-400">{profile.uvbZone.split("(")[0]}</div>
          </div>
        </div>

        {/* Husbandry summary table */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border p-3 bg-muted/20">
            <span className="font-semibold text-foreground">Recommended Material: </span>
            <span className="text-muted-foreground">{profile.bestMaterial}</span>
          </div>
          <div className="rounded-xl border p-3 bg-muted/20">
            <span className="font-semibold text-foreground">Target Humidity: </span>
            <span className="text-muted-foreground">{profile.humidity}</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p>{profile.notes}</p>
        </div>
      </div>
    </div>
  );
}

/* 2. REPTILE UVB DISTANCE GUIDE */
export function ReptileUVB() {
  const [species, setSpecies] = useState<string>("bearded-dragon");
  const [bulbType, setBulbType] = useState<string>("t5-10");
  const [reflector, setReflector] = useState<string>("curved");
  const [screenMesh, setScreenMesh] = useState<string>("standard");

  const speciesData: Record<string, { name: string; zone: string; targetUvi: string; notes: string }> = {
    "bearded-dragon": { name: "Bearded Dragon", zone: "Ferguson Zone 3", targetUvi: "3.0 – 4.5 UVI", notes: "Midday sun basker. High UVB demand to synthesize D3 for strong bone mineralization." },
    "leopard-gecko": { name: "Leopard Gecko", zone: "Ferguson Zone 1", targetUvi: "0.5 – 1.2 UVI", notes: "Crepuscular. Low-level Ferguson Zone 1 UVB promotes activity, immune function, and pigment health." },
    "crested-gecko": { name: "Crested Gecko", zone: "Ferguson Zone 1", targetUvi: "0.5 – 1.0 UVI", notes: "Shade dweller. Keep UVB gentle and always provide dense plant cover so gecko can self-regulate." },
    "ball-python": { name: "Ball Python", zone: "Ferguson Zone 1-2", targetUvi: "0.7 – 1.5 UVI", notes: "Cryptic basker. Provide diffuse low-level UVB across part of the warm side." },
    "corn-snake": { name: "Corn Snake", zone: "Ferguson Zone 1-2", targetUvi: "1.0 – 2.0 UVI", notes: "Active explorer. Utilizes UVB well when basking under branches." },
    "veiled-chameleon": { name: "Veiled / Panther Chameleon", zone: "Ferguson Zone 3", targetUvi: "2.8 – 3.8 UVI", notes: "Arboreal sun worshipper. Mount bulb above screen cage over top horizontal basking vine." },
    "russian-tortoise": { name: "Russian / Hermann's Tortoise", zone: "Ferguson Zone 3", targetUvi: "3.0 – 4.5 UVI", notes: "High UVB requirement to prevent shell softening and pyramidal growth." },
    "blue-tongue-skink": { name: "Blue-Tongued Skink", zone: "Ferguson Zone 2-3", targetUvi: "2.5 – 3.5 UVI", notes: "Medium to high basking index across broad slate basking surface." },
  };

  const currentSp = speciesData[species] || speciesData["bearded-dragon"];

  const calculations = useMemo(() => {
    // Base distance in inches for T5/T8/Coil bulbs to hit optimal zone
    const baseTable: Record<string, { baseDist: number; name: string; lifespanMonths: number }> = {
      "t5-6": { baseDist: 10, name: "Arcadia 6% / Zoomed 5.0 T5-HO", lifespanMonths: 12 },
      "t5-10": { baseDist: 14, name: "Zoomed 10.0 / Arcadia 12% T5-HO", lifespanMonths: 12 },
      "t5-14": { baseDist: 18, name: "Arcadia 14% Dragon T5-HO", lifespanMonths: 12 },
      "t5-shadedweller": { baseDist: 10, name: "Arcadia ShadeDweller 2.4% / 7% Mini", lifespanMonths: 12 },
      "t8-5": { baseDist: 7, name: "T8 5.0 Linear Tube (Older Tech)", lifespanMonths: 6 },
      "t8-10": { baseDist: 9, name: "T8 10.0 Linear Tube", lifespanMonths: 6 },
      "compact-10": { baseDist: 6, name: "Compact / Coil 10.0 / 26W (Spot only)", lifespanMonths: 4 },
      "mvb-100": { baseDist: 12, name: "Mercury Vapor Bulb (Heat+UVB 100W)", lifespanMonths: 12 },
    };

    const bulb = baseTable[bulbType] || baseTable["t5-10"];
    let distanceInches = bulb.baseDist;

    // Reflector modifier
    if (reflector === "none") distanceInches = Math.max(5, distanceInches - 3);
    else if (reflector === "curved") distanceInches += 1;

    // Screen Mesh penalty
    // Screen blocks 30% to 50% of UVB -> bulb must be placed closer OR distance adjusted
    let meshLossPct = 0;
    if (screenMesh === "standard") {
      meshLossPct = 30;
      distanceInches = Math.max(6, distanceInches - 2.5);
    } else if (screenMesh === "fine") {
      meshLossPct = 45;
      distanceInches = Math.max(5, distanceInches - 4.0);
    } else if (screenMesh === "glass") {
      meshLossPct = 100;
      distanceInches = 0;
    }

    const minIn = Math.max(4, Math.round(distanceInches - 1.5));
    const maxIn = Math.round(distanceInches + 2.0);
    const minCm = Math.round(minIn * 2.54);
    const maxCm = Math.round(maxIn * 2.54);

    return {
      bulbName: bulb.name,
      lifespan: bulb.lifespanMonths,
      minIn,
      maxIn,
      minCm,
      maxCm,
      meshLossPct,
    };
  }, [bulbType, reflector, screenMesh]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <h3 className="font-semibold text-foreground">Reptile UVB Distance &amp; Ferguson Zone Setup</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Calculate exact safe bulb-to-basking distance to prevent Metabolic Bone Disease (MBD) or UVB eye burns.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Reptile Species</Label>
            <Select value={species} onValueChange={setSpecies}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(speciesData).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">UVB Lamp Model</Label>
            <Select value={bulbType} onValueChange={setBulbType}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="t5-10">T5-HO 10.0 / 12% (Desert / Dragon)</SelectItem>
                <SelectItem value="t5-6">T5-HO 5.0 / 6% (Forest / Semi-Arid)</SelectItem>
                <SelectItem value="t5-shadedweller">T5 ShadeDweller 2.4% / 7% (Gecko/Snake)</SelectItem>
                <SelectItem value="t5-14">T5-HO 14% Extra High Output</SelectItem>
                <SelectItem value="t8-10">T8 10.0 Tube (Standard)</SelectItem>
                <SelectItem value="t8-5">T8 5.0 Tube (Standard)</SelectItem>
                <SelectItem value="compact-10">Compact / Coil Bulb (Screw-in)</SelectItem>
                <SelectItem value="mvb-100">Mercury Vapor Bulb 100W (Heat+UVB)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Mesh Screen Barrier</Label>
            <Select value={screenMesh} onValueChange={setScreenMesh}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Screen (Mounted Inside Enclosure)</SelectItem>
                <SelectItem value="standard">Standard Wire Mesh (~30% UVB reduction)</SelectItem>
                <SelectItem value="fine">Fine Woven Screen (~45% UVB reduction)</SelectItem>
                <SelectItem value="glass">Glass / Acrylic (Blocks 100% UVB!)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Fixture Reflector</Label>
            <Select value={reflector} onValueChange={setReflector}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="curved">Highly Polished Curved Reflector (Arcadia/Zoomed)</SelectItem>
                <SelectItem value="flat">Standard Flat Reflector</SelectItem>
                <SelectItem value="none">No Reflector (Bare Fixture)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {screenMesh === "glass" ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-destructive flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-base">CRITICAL DANGER: Glass Blocks 100% of UVB</h4>
            <p className="text-xs mt-1 leading-relaxed">
              Standard glass, acrylic, and plastic completely filter out UVB radiation. Even if the lamp is 1 inch away, your reptile receives 0.0 UVI and will develop severe Metabolic Bone Disease (MBD). Mount fixture inside or through mesh!
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                Recommended Safe Basking Distance
              </span>
              <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
                {calculations.minIn}&quot; – {calculations.maxIn}&quot; ({calculations.minCm} – {calculations.maxCm} cm)
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Measure directly from the bottom of the UVB bulb to the top of your reptile&apos;s back while basking.
              </p>
            </div>

            <Badge variant="outline" className="text-xs font-medium px-3 py-1.5">
              {currentSp.zone} • Target: {currentSp.targetUvi}
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border bg-card/80 p-3 text-center">
              <div className="text-[11px] font-medium text-muted-foreground uppercase">Screen Loss</div>
              <div className="mt-1 text-lg font-bold text-foreground">-{calculations.meshLossPct}% UVB</div>
              <div className="text-[10px] text-muted-foreground">Mesh filter penalty</div>
            </div>

            <div className="rounded-xl border bg-card/80 p-3 text-center">
              <div className="text-[11px] font-medium text-muted-foreground uppercase">Bulb Lifespan</div>
              <div className="mt-1 text-lg font-bold text-foreground">{calculations.lifespan} Months</div>
              <div className="text-[10px] text-muted-foreground">Replace before UVI drops</div>
            </div>

            <div className="rounded-xl border bg-card/80 p-3 text-center">
              <div className="text-[11px] font-medium text-muted-foreground uppercase">Target UVI</div>
              <div className="mt-1 text-base font-bold text-amber-600 dark:text-amber-400">{currentSp.targetUvi}</div>
              <div className="text-[10px] text-muted-foreground">Ferguson index</div>
            </div>

            <div className="rounded-xl border bg-card/80 p-3 text-center">
              <div className="text-[11px] font-medium text-muted-foreground uppercase">MBD Prevention</div>
              <div className="mt-1 text-base font-bold text-emerald-600 dark:text-emerald-400">100% Safe</div>
              <div className="text-[10px] text-muted-foreground">D3 synthesis active</div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-muted-foreground">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5 text-amber-500" /> Species Care Note:
            </div>
            <p className="mt-1 leading-relaxed">{currentSp.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* 3. REPTILE FEEDER SIZE & NUTRITION CALCULATOR */
export function ReptileFeeder() {
  const [petType, setPetType] = useState<"lizard" | "snake">("lizard");
  const [measurementInches, setMeasurementInches] = useState<number>(0.75);
  const [feederChoice, setFeederChoice] = useState<string>("dubia");

  const feederNutrition: Record<string, { name: string; protein: string; fat: string; caRatio: string; bestFor: string; notes: string }> = {
    dubia: { name: "Dubia Roaches", protein: "21.4%", fat: "6.1%", caRatio: "1:3 (Good)", bestFor: "Bearded dragons, Geckos, Skinks, Chameleons", notes: "Top staple insect! High meat-to-shell ratio, easy to digest, cannot climb smooth plastic." },
    crickets: { name: "Banded / Brown Crickets", protein: "18.5%", fat: "5.5%", caRatio: "1:9 (Needs dusting)", bestFor: "All insectivores", notes: "Classic staple. Active movement stimulates strong hunting response. Must be gut-loaded 24h prior." },
    bsfl: { name: "Black Soldier Fly Larvae (NutriGrubs / Calciworms)", protein: "17.3%", fat: "9.4%", caRatio: "1.5:1 (Naturally High Calcium!)", bestFor: "Growing juveniles, breeding females", notes: "Highest natural calcium of any feeder insect! No calcium dusting required." },
    mealworms: { name: "Mealworms", protein: "18.7%", fat: "13.4%", caRatio: "1:18 (Poor)", bestFor: "Occasional treat / Adult geckos", notes: "High chitin exoskeleton. Feed in moderation to prevent impaction in young reptiles." },
    superworms: { name: "Superworms (Zophobas morio)", protein: "19.7%", fat: "17.7%", caRatio: "1:18 (Poor)", bestFor: "Adult bearded dragons, monitors", notes: "High fat treat. Only for large adults. Never feed to small juveniles." },
    hornworms: { name: "Hornworms (Goliath Worms)", protein: "9.0%", fat: "3.0%", caRatio: "1:3 (Good)", bestFor: "Hydration boost, picky eaters", notes: "85% moisture! Excellent for dehydrated reptiles or stimulating appetite. Soft bodied." },
    silkworms: { name: "Silkworms", protein: "14.6%", fat: "3.2%", caRatio: "1:2.4 (Excellent)", bestFor: "Premium staple for all lizards", notes: "Contains serrapeptase enzyme for arterial health. Soft, gentle, highly nutritious." },
    mice: { name: "Frozen-Thawed Mice (Pinky → Adult)", protein: "55.8%", fat: "23.6%", caRatio: "1.2:1 (Whole Animal)", bestFor: "Colubrids, Small Pythons, Young Boas", notes: "Complete whole-prey nutrition. Bones provide natural calcium and organ meat provides vitamins." },
    rats: { name: "Frozen-Thawed Rats (Pup → Jumbo)", protein: "61.8%", fat: "28.0%", caRatio: "1.4:1 (Whole Animal)", bestFor: "Ball Pythons, Boas, Large Pythons, Monitors", notes: "Higher caloric density and protein than mice. Best staple for medium-to-giant constrictors." },
  };

  const calculation = useMemo(() => {
    let preyName = "";
    let maxSafeSize = "";

    if (petType === "lizard") {
      const eyeSpace = measurementInches;
      maxSafeSize = `${eyeSpace}" (${(eyeSpace * 25.4).toFixed(0)} mm)`;
      if (eyeSpace <= 0.25) preyName = "Pinhead to 1/8\" Crickets, Extra-Small BSFL";
      else if (eyeSpace <= 0.45) preyName = "1/4\" Crickets, Small Dubias (1/4\"), Small BSFL";
      else if (eyeSpace <= 0.75) preyName = "1/2\" to 3/4\" Crickets, Medium Dubias (1/2\"), Medium BSFL, Small Hornworms";
      else if (eyeSpace <= 1.1) preyName = "Adult Crickets, Large Dubias (3/4\"–1\"), Superworms (adults only), Large Hornworms";
      else preyName = "Adult Dubia Roaches, Hornworms, Occasional Pinky Mouse (for adult monitors/teguses)";
    } else {
      const girth = measurementInches;
      maxSafeSize = `Prey girth equal to or 1.25× snake body width (${girth}" / ${(girth * 25.4).toFixed(0)} mm)`;
      if (girth <= 0.5) preyName = "Pinky Mouse (1–3 grams)";
      else if (girth <= 0.8) preyName = "Fuzzy Mouse (4–7 grams)";
      else if (girth <= 1.1) preyName = "Hopper Mouse (8–12 grams) or Rat Pinky";
      else if (girth <= 1.5) preyName = "Adult Mouse (18–25 grams) or Rat Pup (20–30g)";
      else if (girth <= 2.2) preyName = "Weanling Rat (30–45g) or Small Rat (45–85g)";
      else if (girth <= 3.2) preyName = "Medium Rat (90–150g) to Large Rat (150–275g)";
      else preyName = "Jumbo Rat (275g+) to Small Rabbit / Guinea Pig (for giant boas/pythons)";
    }

    return { preyName, maxSafeSize };
  }, [petType, measurementInches]);

  const selectedNutr = feederNutrition[feederChoice] || feederNutrition["dubia"];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <h3 className="font-semibold text-foreground">Reptile Feeder Sizing &amp; Nutritional Guide</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Determine the safe prey size to avoid lethal impaction or regurgitation, plus nutritional profiles.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Reptile Type</Label>
            <Select value={petType} onValueChange={(v: "lizard" | "snake") => setPetType(v)}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="lizard">Lizard / Gecko / Chameleon (Insectivore/Omnivore)</SelectItem>
                <SelectItem value="snake">Snake / Carnivore (Rodent feeder)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              {petType === "lizard" ? "Space Between Eyes (inches)" : "Widest Body Girth (inches)"}
            </Label>
            <Input
              type="number"
              min={0.1}
              max={6.0}
              step={0.05}
              value={measurementInches}
              onChange={(e) => setMeasurementInches(Math.max(0.1, Number(e.target.value) || 0.1))}
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Inspect Feeder Profile</Label>
            <Select value={feederChoice} onValueChange={setFeederChoice}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dubia">Dubia Roaches (Top Staple)</SelectItem>
                <SelectItem value="crickets">Crickets (Classic Staple)</SelectItem>
                <SelectItem value="bsfl">Black Soldier Fly Larvae (High Calcium)</SelectItem>
                <SelectItem value="hornworms">Hornworms (Hydration Booster)</SelectItem>
                <SelectItem value="silkworms">Silkworms (Gentle Superfood)</SelectItem>
                <SelectItem value="mealworms">Mealworms (Chitin Treat)</SelectItem>
                <SelectItem value="superworms">Superworms (High Fat Treat)</SelectItem>
                <SelectItem value="mice">Frozen-Thawed Mice</SelectItem>
                <SelectItem value="rats">Frozen-Thawed Rats</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sizing Results Box */}
      <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-sm">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">Recommended Feeder Size</span>
        <div className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
          {calculation.preyName}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Maximum Safe Limit: <strong className="text-foreground">{calculation.maxSafeSize}</strong>
        </p>

        {/* Selected Feeder Nutrition Breakdown */}
        <div className="mt-6 rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="font-semibold text-sm text-foreground">{selectedNutr.name}</div>
            <Badge variant="outline" className="text-[11px] font-medium">{selectedNutr.caRatio} Ca:P</Badge>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 text-center text-xs">
            <div className="rounded-lg border p-2 bg-muted/20">
              <span className="text-muted-foreground text-[10px] uppercase">Crude Protein</span>
              <div className="font-bold text-foreground mt-0.5">{selectedNutr.protein}</div>
            </div>
            <div className="rounded-lg border p-2 bg-muted/20">
              <span className="text-muted-foreground text-[10px] uppercase">Crude Fat</span>
              <div className="font-bold text-foreground mt-0.5">{selectedNutr.fat}</div>
            </div>
            <div className="rounded-lg border p-2 bg-muted/20">
              <span className="text-muted-foreground text-[10px] uppercase">Best Suited For</span>
              <div className="font-medium text-foreground mt-0.5 truncate">{selectedNutr.bestFor}</div>
            </div>
            <div className="rounded-lg border p-2 bg-muted/20">
              <span className="text-muted-foreground text-[10px] uppercase">Dusting Rule</span>
              <div className="font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">Calcium 4x/wk</div>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{selectedNutr.notes}</p>
        </div>
      </div>
    </div>
  );
}

/* 4. SNAKE FEEDING SCHEDULE & REFUSAL TRACKER */
export function SnakeFeedingSchedule() {
  const [snakeType, setSnakeType] = useState<string>("ball");
  const [snakeWeightGrams, setSnakeWeightGrams] = useState<number>(350);
  const [feedingStatus, setFeedingStatus] = useState<string>("regular");

  const scheduleProfiles: Record<string, { name: string; preyType: string; adultInterval: string; juvenileInterval: string; tips: string }> = {
    ball: { name: "Ball Python (Royal Python)", preyType: "Frozen-Thawed Rats", adultInterval: "Every 10–14 days (small rat 50-80g)", juvenileInterval: "Every 7 days (rat pup 20-30g or hopper mouse)", tips: "Ball pythons are scent & heat oriented. Warm prey to 100°F (38°C) using warm water in a ziplock bag and offer via 12-inch tongs at dusk." },
    corn: { name: "Corn Snake", preyType: "Frozen-Thawed Mice", adultInterval: "Every 10–14 days (large adult mouse 20-30g)", juvenileInterval: "Every 5–7 days (pinky to fuzzy mouse)", tips: "Voracious feeders. Feed in enclosure — moving to a separate tub causes unnecessary stress and regurgitation." },
    king: { name: "California / Mexican Kingsnake", preyType: "Frozen-Thawed Mice", adultInterval: "Every 10–12 days (adult mouse)", juvenileInterval: "Every 5–7 days (pinky to fuzzy)", tips: "Intense feeding response! Always use tongs to avoid accidental feeding bites." },
    boa: { name: "Boa Constrictor (BCI)", preyType: "Frozen-Thawed Rats", adultInterval: "Every 2–4 weeks (medium to large rat)", juvenileInterval: "Every 10–14 days (weanling rat)", tips: "Boas have very slow metabolisms. Overfeeding causes hepatic lipidosis (fatty liver). Keep meals lean." },
    hognose: { name: "Western Hognose Snake", preyType: "Frozen-Thawed Mice / Unscented", adultInterval: "Every 7–10 days (fuzzy to hopper mouse)", juvenileInterval: "Every 4–6 days (pinky mouse)", tips: "If refusing unscented mice, scent with toad or salmon juice, or try a drop-feeding overnight in a dark container." },
    garter: { name: "Garter Snake", preyType: "Nightcrawlers, Silversides, Pinkies", adultInterval: "Every 5–7 days (pinky mouse / fish fillet)", juvenileInterval: "Every 3–5 days (chopped worm / silversides)", tips: "Avoid feeder fish containing thiaminase (like goldfish/rosy red minnows) which causes lethal vitamin B1 deficiency." },
  };

  const selectedSnake = scheduleProfiles[snakeType] || scheduleProfiles["ball"];

  const plan = useMemo(() => {
    const wt = snakeWeightGrams;
    let stage = "Juvenile";
    let targetPreyWeight = "35–50 grams (10–15% of body weight)";
    let interval = "Every 7 days";
    let preyName = "Rat Pup or Hopper Mouse";

    if (wt < 100) {
      stage = "Hatchling / Baby";
      targetPreyWeight = `${Math.round(wt * 0.12)}–${Math.round(wt * 0.15)} grams (12–15% of weight)`;
      interval = "Every 5–7 days";
      preyName = "Pinky or Fuzzy Mouse / Rat Pinky";
    } else if (wt < 500) {
      stage = "Juvenile / Sub-Adult";
      targetPreyWeight = `${Math.round(wt * 0.10)}–${Math.round(wt * 0.13)} grams (10–13% of weight)`;
      interval = "Every 7–10 days";
      preyName = "Weanling Rat (30–45g) or Adult Mouse";
    } else {
      stage = "Adult";
      targetPreyWeight = `${Math.round(wt * 0.05)}–${Math.round(wt * 0.08)} grams (5–8% of weight)`;
      interval = "Every 12–18 days";
      preyName = wt > 1500 ? "Large Rat (150–220g)" : "Small to Medium Rat (50–90g)";
    }

    return { stage, targetPreyWeight, interval, preyName };
  }, [snakeWeightGrams]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <h3 className="font-semibold text-foreground">Snake Feeding Schedule &amp; Prey Portion Planner</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Calculates optimal meal weight and feeding frequency based on species metabolic rate and body weight.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Snake Species</Label>
            <Select value={snakeType} onValueChange={setSnakeType}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(scheduleProfiles).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Snake Weight (grams)</Label>
            <Input
              type="number"
              min={10}
              max={15000}
              value={snakeWeightGrams}
              onChange={(e) => setSnakeWeightGrams(Math.max(10, Number(e.target.value) || 10))}
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Feeding Condition</Label>
            <Select value={feedingStatus} onValueChange={setFeedingStatus}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Active / Regular Feeder</SelectItem>
                <SelectItem value="shedding">In Shed (Blue Eyes - Often refuses)</SelectItem>
                <SelectItem value="winter">Winter Season / Fasting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">Recommended Meal Schedule</span>
            <div className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
              {plan.interval} — {plan.preyName}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Target Meal Size: <strong className="text-foreground">{plan.targetPreyWeight}</strong> • Life Stage: <Badge variant="outline" className="ml-1 text-[11px]">{plan.stage}</Badge>
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Target Interval</div>
            <div className="mt-1 text-base font-bold text-foreground">{plan.interval}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Recommended Prey</div>
            <div className="mt-1 text-xs font-bold text-primary truncate">{selectedSnake.preyType}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Digestion Period</div>
            <div className="mt-1 text-base font-bold text-foreground">48 Hours</div>
            <div className="text-[10px] text-muted-foreground">Do not handle</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Prey Temp Target</div>
            <div className="mt-1 text-base font-bold text-rose-600 dark:text-rose-400">100°F (38°C)</div>
          </div>
        </div>

        {feedingStatus === "shedding" && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p><strong>In Shed:</strong> Most snakes refuse food during the opaque &apos;blue&apos; eye phase due to impaired vision. Wait until your snake finishes shedding completely before offering prey.</p>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground">
          <strong>Expert Feeding Tip:</strong> {selectedSnake.tips}
        </div>
      </div>
    </div>
  );
}

/* 5. TURTLE TANK & FILTRATION CALCULATOR */
export function TurtleTank() {
  const [species, setSpecies] = useState<string>("slider");
  const [shellInches, setShellInches] = useState<number>(6);
  const [turtleCount, setTurtleCount] = useState<number>(1);
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  const turtleData: Record<string, { name: string; adultSize: string; swimmingStyle: string; notes: string }> = {
    slider: { name: "Red-Eared / Yellow-Bellied Slider", adultSize: "8–12 in (20–30 cm)", swimmingStyle: "Active deep swimmer", notes: "Sliders are strong swimmers and heavy waste producers. 10 gallons per inch of shell is the absolute minimum." },
    painted: { name: "Painted Turtle (Eastern/Western)", adultSize: "6–9 in (15–23 cm)", swimmingStyle: "Active swimmer", notes: "Hardy basker. Needs a completely dry basking dock with 90-95°F surface temp and strong UVB." },
    musk: { name: "Common Musk / Mud Turtle", adultSize: "3.5–5 in (9–13 cm)", swimmingStyle: "Bottom walker / Shallow swimmer", notes: "Smaller species! Provide underwater resting ledges so they can reach the surface without tiring." },
    map: { name: "Northern / False Map Turtle", adultSize: "6–10 in (15–25 cm)", swimmingStyle: "Active river swimmer", notes: "Pristine water quality and high filtration flow are essential to prevent shell fungus." },
    softshell: { name: "Spiny / Florida Softshell Turtle", adultSize: "10–18 in (25–45 cm)", swimmingStyle: "Deep water burrower", notes: "Soft leathery shell. Must have fine sand substrate (not gravel) to bury without abrasive cuts." },
    box: { name: "Eastern / Three-Toed Box Turtle", adultSize: "5–7 in (13–18 cm)", swimmingStyle: "Terrestrial / Shallow wader", notes: "Box turtles are terrestrial! They need a 4x2 ft indoor tortoise table with shallow soaking dish, NOT an aquarium." },
  };

  const currentT = turtleData[species] || turtleData["slider"];

  const calc = useMemo(() => {
    const isTerrestrial = species === "box";
    const baseGal = isTerrestrial ? 50 : shellInches * 10;
    const additionalGal = (turtleCount - 1) * (shellInches * 5);
    const minWaterGallons = baseGal + additionalGal;
    const minWaterLiters = Math.round(minWaterGallons * 3.78541);

    // Canister filter must be 3x to 4x tank volume for turtles (GPH flow)
    const minFilterGph = minWaterGallons * 3.5;

    // Minimum Tank Footprint
    let tankLIn = Math.max(36, Math.round(shellInches * 6));
    let tankWIn = Math.max(18, Math.round(shellInches * 3));
    let tankHIn = Math.max(18, Math.round(shellInches * 3));

    if (minWaterGallons >= 100) {
      tankLIn = Math.max(tankLIn, 60);
      tankWIn = Math.max(tankWIn, 24);
      tankHIn = Math.max(tankHIn, 24);
    }

    const minDockAreaSqFt = Number(((shellInches * shellInches * 2.5 * turtleCount) / 144).toFixed(1));
    const heaterWattage = Math.round(minWaterGallons * 3);

    return {
      minWaterGallons,
      minWaterLiters,
      minFilterGph: Math.round(minFilterGph),
      tankLIn,
      tankWIn,
      tankHIn,
      minDockAreaSqFt,
      heaterWattage,
    };
  }, [species, shellInches, turtleCount]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div>
            <h3 className="font-semibold text-foreground">Aquatic Turtle Tank &amp; Filtration Sizer</h3>
            <p className="text-xs text-muted-foreground">Calculates gallons, tank dimensions, canister filter GPH flow, and basking dock area.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("imperial")}
              className="h-8 text-xs font-medium"
            >
              Gallons / Inches
            </Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("metric")}
              className="h-8 text-xs font-medium"
            >
              Liters / cm
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Turtle Species</Label>
            <Select value={species} onValueChange={setSpecies}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(turtleData).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Straight Carapace Length ({unit === "imperial" ? "inches" : "cm"})
            </Label>
            <Input
              type="number"
              min={2}
              max={20}
              step={0.5}
              value={unit === "imperial" ? shellInches : Math.round(shellInches * 2.54)}
              onChange={(e) => {
                const v = Number(e.target.value) || 2;
                setShellInches(unit === "imperial" ? v : Number((v / 2.54).toFixed(1)));
              }}
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Number of Turtles</Label>
            <Input
              type="number"
              min={1}
              max={6}
              value={turtleCount}
              onChange={(e) => setTurtleCount(Math.max(1, Number(e.target.value) || 1))}
              className="h-10"
            />
          </div>
        </div>
      </div>

      {/* Result Box */}
      <div className="rounded-2xl border bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent p-6 shadow-sm">
        <span className="text-xs font-semibold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase">
          Minimum Water &amp; Enclosure Requirement
        </span>
        <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
          {unit === "imperial" ? (
            <>{calc.minWaterGallons} Gallons Minimum</>
          ) : (
            <>{calc.minWaterLiters} Liters Minimum</>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Recommended Tank Footprint: <strong>{calc.tankLIn}&quot; L × {calc.tankWIn}&quot; W × {calc.tankHIn}&quot; H</strong> ({Math.round(calc.tankLIn * 2.54)} × {Math.round(calc.tankWIn * 2.54)} × {Math.round(calc.tankHIn * 2.54)} cm)
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Waves className="h-3.5 w-3.5 text-cyan-500" /> Filter Flow
            </div>
            <div className="mt-1 text-lg font-bold text-foreground">{calc.minFilterGph} GPH</div>
            <div className="text-[10px] text-muted-foreground">Canister filter (3.5× volume)</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Sun className="h-3.5 w-3.5 text-amber-500" /> Basking Dock
            </div>
            <div className="mt-1 text-lg font-bold text-foreground">{calc.minDockAreaSqFt} sq ft</div>
            <div className="text-[10px] text-muted-foreground">100% dry platform</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" /> Water Heater
            </div>
            <div className="mt-1 text-lg font-bold text-foreground">{calc.heaterWattage} Watts</div>
            <div className="text-[10px] text-muted-foreground">Target: 75–80°F (24–27°C)</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Thermometer className="h-3.5 w-3.5 text-rose-500" /> Dock Temp
            </div>
            <div className="mt-1 text-lg font-bold text-rose-600 dark:text-rose-400">90–95°F</div>
            <div className="text-[10px] text-muted-foreground">Surface basking heat</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3.5 text-xs text-muted-foreground">
          <strong>Species Husbandry Note ({currentT.name}):</strong> {currentT.notes}
        </div>
      </div>
    </div>
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
