import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";
import {
  Thermometer,
  Droplets,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
  Utensils,
  ShieldCheck,
  Check,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

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
export function DogPoopBagCalculator() {
  const [dogs, setDogs] = useState(1);
  const [perDay, setPerDay] = useState(2);
  const monthly = dogs * perDay * 30;
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Number of dogs" value={dogs} onChange={setDogs} min={1} />
        <NumberField label="Average poops per dog / day" value={perDay} onChange={setPerDay} min={1} />
      </div>}
      result={<div className="space-y-4">
        <Big value={monthly} label="Bags needed / month" />
        <Note>Buy a 3-month supply to save on shipping — most bags stay fresh 2+ years unopened.</Note>
      </div>}
    />
  );
}

const DOG_CRATE: Record<string, string> = {
  toy: "22\" × 13\" × 16\"",
  small: "24\" × 18\" × 21\"",
  medium: "30\" × 21\" × 24\"",
  large: "36\" × 24\" × 27\"",
  "extra-large": "42\" × 28\" × 31\"",
  giant: "48\" × 30\" × 33\"",
};
export function DogCrateSize() {
  const [size, setSize] = useState("medium");
  return (
    <CalculatorLayout
      form={<SelectField label="Adult size" value={size} onChange={setSize} options={Object.keys(DOG_CRATE)} />}
      result={<div className="space-y-4">
        <Big value={DOG_CRATE[size]} label="Recommended crate (L × W × H)" />
        <Note>Rule of thumb: dog should stand, turn, and lie down fully. For puppies, buy adult-size and use a divider.</Note>
      </div>}
    />
  );
}

export function DogCollarSize() {
  const [neck, setNeck] = useState(14);
  const min = Math.max(neck + 1, neck * 1.05).toFixed(1);
  const max = (neck + 3).toFixed(1);
  return (
    <CalculatorLayout
      form={<NumberField label="Neck circumference (inches)" value={neck} onChange={setNeck} step={0.5} />}
      result={<div className="space-y-4">
        <Big value={`${min}"–${max}"`} label="Adjustable collar range" />
        <Note>Two-finger rule: you should slide two fingers snugly between collar and neck.</Note>
      </div>}
    />
  );
}

const EAR_CLEAN: Record<string, string> = {
  "erect / short-hair": "every 4–6 weeks",
  "floppy / long-hair": "every 1–2 weeks",
  "swimmer / water dog": "after every swim + weekly",
  "prone to infections": "weekly, vet-directed solution",
};
export function DogEarCleaningSchedule() {
  const [type, setType] = useState("erect / short-hair");
  return (
    <CalculatorLayout
      form={<SelectField label="Ear type" value={type} onChange={setType} options={Object.keys(EAR_CLEAN)} />}
      result={<div className="space-y-4">
        <Big value={EAR_CLEAN[type]} label="Recommended cleaning frequency" />
        <Note>Never insert cotton swabs. Use a vet-approved cleaner, massage the base, and let the dog shake.</Note>
      </div>}
    />
  );
}

const DENTAL: Record<string, string> = {
  puppy: "Daily brushing habit + soft chews",
  adult: "Brush 3–4×/week + dental chews daily",
  senior: "Daily brushing + yearly vet dental",
  "small-breed": "Daily brushing — small breeds get tartar fastest",
};
export function DogDentalSchedule() {
  const [stage, setStage] = useState("adult");
  return (
    <CalculatorLayout
      form={<SelectField label="Life stage" value={stage} onChange={setStage} options={Object.keys(DENTAL)} />}
      result={<div className="space-y-4">
        <Big value={DENTAL[stage]} label="Home dental routine" />
        <Note>Use only enzymatic dog toothpaste — human toothpaste with xylitol is toxic.</Note>
      </div>}
    />
  );
}

/* ─────────── CATS ─────────── */
export function CatHairballRisk() {
  const [coat, setCoat] = useState("medium");
  const [grooming, setGrooming] = useState(2);
  const base: Record<string, number> = { short: 1, medium: 3, long: 5 };
  const score = Math.max(0, base[coat] - grooming * 0.4);
  const risk = score >= 3 ? "High" : score >= 1.5 ? "Moderate" : "Low";
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <SelectField label="Coat length" value={coat} onChange={setCoat} options={["short", "medium", "long"]} />
        <NumberField label="Brushing sessions / week" value={grooming} onChange={setGrooming} />
      </div>}
      result={<div className="space-y-4">
        <Big value={risk} label="Hairball risk" />
        <Note>Brush more, add fiber (pumpkin or hairball formula), and keep fresh water available.</Note>
      </div>}
    />
  );
}

export function CatScratchingPostSelector() {
  const [size, setSize] = useState("adult");
  const heights: Record<string, string> = { kitten: "20–24\"", adult: "32–40\"", "large-breed": "40–48\"" };
  return (
    <CalculatorLayout
      form={<SelectField label="Cat size" value={size} onChange={setSize} options={Object.keys(heights)} />}
      result={<div className="space-y-4">
        <Big value={heights[size]} label="Minimum post height" />
        <Note>Cat should stretch fully vertically. Sisal rope beats carpet. Provide at least one per cat + one extra.</Note>
      </div>}
    />
  );
}

export function CatCarrierSize() {
  const [len, setLen] = useState(18);
  const [w, setW] = useState(8);
  const carrierL = (len + 4).toFixed(0);
  const carrierW = (w + 4).toFixed(0);
  const carrierH = (Math.max(w + 6, 12)).toFixed(0);
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Cat length nose→base of tail (in)" value={len} onChange={setLen} />
        <NumberField label="Cat shoulder width (in)" value={w} onChange={setW} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${carrierL}" × ${carrierW}" × ${carrierH}"`} label="Recommended carrier (L × W × H)" />
        <Note>Cat should turn around and stand. Top-loading carriers reduce vet-visit stress.</Note>
      </div>}
    />
  );
}

export function CatCatioSize() {
  const [cats, setCats] = useState(1);
  const sqft = cats * 15;
  return (
    <CalculatorLayout
      form={<NumberField label="Number of cats" value={cats} onChange={setCats} min={1} />}
      result={<div className="space-y-4">
        <Big value={`${sqft} sq ft`} label="Minimum catio floor area" />
        <Note>Add vertical shelves — cats use 3D space. Include shade, water, and one hidey spot per cat.</Note>
      </div>}
    />
  );
}

/* ─────────── BIRDS ─────────── */
export function BirdBathFrequency() {
  const [sp, setSp] = useState("cockatiel");
  const freq: Record<string, string> = { budgie: "2–3× / week", cockatiel: "daily light mist", conure: "daily", "african-grey": "3–4× / week", macaw: "daily", finch: "daily bath dish" };
  return (
    <CalculatorLayout
      form={<SelectField label="Species" value={sp} onChange={setSp} options={Object.keys(freq)} />}
      result={<div className="space-y-4">
        <Big value={freq[sp]} label="Recommended bathing" />
        <Note>Use plain lukewarm water — never soap. Mornings only so feathers dry before night.</Note>
      </div>}
    />
  );
}

export function BirdFlightSpace() {
  const [sp, setSp] = useState("cockatiel");
  const space: Record<string, string> = { budgie: "6 × 4 × 6 ft", cockatiel: "8 × 4 × 6 ft", conure: "10 × 5 × 7 ft", "african-grey": "12 × 6 × 8 ft", macaw: "20 × 8 × 10 ft" };
  return (
    <CalculatorLayout
      form={<SelectField label="Species" value={sp} onChange={setSp} options={Object.keys(space)} />}
      result={<div className="space-y-4">
        <Big value={space[sp]} label="Minimum flight room / aviary" />
        <Note>Even caged birds need daily supervised flight time. Cover windows and ceiling fans first.</Note>
      </div>}
    />
  );
}

export function BirdToyRotation() {
  const [toys, setToys] = useState(6);
  const perRotation = Math.max(3, Math.floor(toys / 2));
  return (
    <CalculatorLayout
      form={<NumberField label="Total toys you own" value={toys} onChange={setToys} min={3} />}
      result={<div className="space-y-4">
        <Big value={perRotation} label="Toys to display at once" />
        <Note>Rotate every 5–7 days — birds get bored fast. Always include one foraging, one destructible, one chew toy.</Note>
      </div>}
    />
  );
}

/* ─────────── FISH ─────────── */
export function FishQuarantineTimer() {
  const [risk, setRisk] = useState("standard");
  const days: Record<string, string> = { standard: "14–21 days", "wild-caught": "30 days", "known-outbreak": "45+ days with treatments" };
  return (
    <CalculatorLayout
      form={<SelectField label="Source risk" value={risk} onChange={setRisk} options={Object.keys(days)} />}
      result={<div className="space-y-4">
        <Big value={days[risk]} label="Recommended quarantine" />
        <Note>Bare-bottom tank, separate net & siphon, matching water params. Observe daily for spots, clamped fins, or flashing.</Note>
      </div>}
    />
  );
}

export function AquariumPlantCount() {
  const [gallons, setGallons] = useState(20);
  const stems = Math.round(gallons * 1.2);
  const carpet = Math.round(gallons * 0.5);
  return (
    <CalculatorLayout
      form={<NumberField label="Tank volume (gallons)" value={gallons} onChange={setGallons} min={1} />}
      result={<div className="space-y-4">
        <Rows items={[
          { label: "Stem plants", value: `~${stems} stems` },
          { label: "Carpet plants (pots)", value: `~${carpet} pots` },
          { label: "Background bunches", value: `${Math.max(1, Math.round(gallons / 10))}` },
          { label: "Focal plant (rosette)", value: "1–2 pieces" },
        ]} />
        <Note>A heavily planted tank reduces algae and stabilizes cycling.</Note>
      </div>}
    />
  );
}

export function AquariumSubstrate() {
  const [len, setLen] = useState(24);
  const [w, setW] = useState(12);
  const [depth, setDepth] = useState(2);
  const lbs = ((len * w * depth) / 10).toFixed(1); // rough approx
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Tank length (in)" value={len} onChange={setLen} />
        <NumberField label="Tank width (in)" value={w} onChange={setW} />
        <NumberField label="Substrate depth (in)" value={depth} onChange={setDepth} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${lbs} lbs`} label="Substrate needed" />
        <Note>Aim for 1–2 in for fish-only, 2–3 in for planted tanks. Rinse gravel until water runs clear.</Note>
      </div>}
    />
  );
}

export function AquariumCO2() {
  const [gallons, setGallons] = useState(20);
  const bps = (gallons / 20).toFixed(1);
  return (
    <CalculatorLayout
      form={<NumberField label="Tank volume (gallons)" value={gallons} onChange={setGallons} min={5} />}
      result={<div className="space-y-4">
        <Big value={`${bps} bps`} label="Starting CO2 rate (bubbles/sec)" />
        <Note>Adjust to target 30 ppm using a drop checker. CO2 must run only during the photoperiod.</Note>
      </div>}
    />
  );
}

/* ─────────── SMALL PETS ─────────── */
export function HamsterWheelSize() {
  const [sp, setSp] = useState("syrian");
  const sizes: Record<string, string> = { syrian: "11–12\" solid", dwarf: "8–9\" solid", "roborovski": "8\" solid", chinese: "8–9\" solid" };
  return (
    <CalculatorLayout
      form={<SelectField label="Hamster type" value={sp} onChange={setSp} options={Object.keys(sizes)} />}
      result={<div className="space-y-4">
        <Big value={sizes[sp]} label="Minimum wheel size" />
        <Note>Solid running surface only — wire wheels cause bumblefoot. Back should stay flat while running.</Note>
      </div>}
    />
  );
}

export function FerretCageSize() {
  const [ferrets, setFerrets] = useState(1);
  const cuft = ferrets * 24; // approx
  return (
    <CalculatorLayout
      form={<NumberField label="Number of ferrets" value={ferrets} onChange={setFerrets} min={1} />}
      result={<div className="space-y-4">
        <Big value={`${cuft} cu ft`} label="Minimum cage volume" />
        <Note>Multi-level cages preferred. Ferrets need 4+ hours daily out-of-cage supervised play.</Note>
      </div>}
    />
  );
}

export function GuineaPigCageSize() {
  const [pigs, setPigs] = useState(2);
  const sqft = pigs === 1 ? 7.5 : pigs === 2 ? 10.5 : pigs === 3 ? 13 : 16;
  return (
    <CalculatorLayout
      form={<NumberField label="Number of guinea pigs" value={pigs} onChange={setPigs} min={1} />}
      result={<div className="space-y-4">
        <Big value={`${sqft} sq ft`} label="Minimum floor space" />
        <Note>Guinea pigs are social — always keep 2+. C&C cages beat pet-store cages every time.</Note>
      </div>}
    />
  );
}

export function RabbitLitterTrainingGuide() {
  const [age, setAge] = useState("adult");
  const advice: Record<string, string> = {
    kit: "Start after 8 weeks — bladder control is limited before then",
    adolescent: "Spay/neuter first — hormones cause marking",
    adult: "Fully trainable within 1–2 weeks with consistent setup",
    senior: "Add extra low-entry boxes near sleeping areas",
  };
  return (
    <CalculatorLayout
      form={<SelectField label="Life stage" value={age} onChange={setAge} options={Object.keys(advice)} />}
      result={<div className="space-y-4">
        <Big value={advice[age]} label="Training outlook" />
        <Note>Use paper-based litter with hay on top. Never clay or pine — both are harmful to rabbits.</Note>
      </div>}
    />
  );
}

/* ─────────── REPTILES ─────────── */

/* 1. REPTILE HUMIDITY GUIDE */
interface HumiditySpecies {
  name: string;
  dayTarget: string;
  nightSpike: string;
  shedTarget: string;
  biome: string;
  mistingTips: string;
  risksLow: string;
  risksHigh: string;
}

const REPTILE_HUMIDITY_DATA: Record<string, HumiditySpecies> = {
  "bearded-dragon": {
    name: "Bearded Dragon (Pogona vitticeps)",
    dayTarget: "30% – 40%",
    nightSpike: "45% – 50%",
    shedTarget: "40% (Provide moist hide with sphagnum moss)",
    biome: "Arid / Desert Scrubland",
    mistingTips: "Do NOT mist the enclosure. Provide a shallow water bowl on the cool side and a temporary humid hide when shedding.",
    risksLow: "Dehydration, stuck shedding on tail tip and toes.",
    risksHigh: "Upper Respiratory Infection (URI), fungal skin blisters.",
  },
  "leopard-gecko": {
    name: "Leopard Gecko (Eublepharis macularius)",
    dayTarget: "30% – 40%",
    nightSpike: "45% – 55%",
    shedTarget: "70% – 80% inside enclosed moist hide",
    biome: "Arid Rocky Grassland",
    mistingTips: "Keep main tank dry. Lightly mist the damp moss hide daily so it stays humid 24/7.",
    risksLow: "Dysecdysis (stuck shed cutting off blood flow to toes/tail), retained eye caps.",
    risksHigh: "Bacterial infections, skin sores, respiratory distress.",
  },
  "ball-python": {
    name: "Ball Python (Python regius)",
    dayTarget: "60% – 70%",
    nightSpike: "75% – 80%",
    shedTarget: "75% – 85% until shed completes in one piece",
    biome: "Sub-Saharan Grassland & Forest",
    mistingTips: "Use a thick 3-4\" layer of coco husk or cypress mulch. Pour warm water into corners to dampen bottom layer while surface stays dry.",
    risksLow: "Dehydration, patchy shed, retained eyecaps, respiratory illness from dry airways.",
    risksHigh: "Scale rot from sitting on wet/soggy substrate surfaces.",
  },
  "crested-gecko": {
    name: "Crested Gecko (Correlophus ciliatus)",
    dayTarget: "50% – 60%",
    nightSpike: "80% – 90% (Evening heavy mist)",
    shedTarget: "85% during evening mist cycle",
    biome: "Tropical Rainforest (New Caledonia)",
    mistingTips: "Mist heavily in the evening so water droplets form on leaves for drinking. Allow tank to dry out to 50-55% during the day to prevent mold.",
    risksLow: "Dehydration, stuck tail shed, floppy tail syndrome from weakness.",
    risksHigh: "Mold, bacterial bloom, respiratory congestion if constantly saturated.",
  },
  "corn-snake": {
    name: "Corn Snake (Pantherophis guttatus)",
    dayTarget: "45% – 60%",
    nightSpike: "65% – 70%",
    shedTarget: "65% – 75%",
    biome: "Temperate Forest & Fields",
    mistingTips: "Aspen or coco coir substrate. Mist lightly during shed cycles or provide a damp sphagnum moss hide box.",
    risksLow: "Flaky sheds in pieces, eye cap retention.",
    risksHigh: "Blister disease / scale rot if substrate is damp under heat source.",
  },
  "veiled-chameleon": {
    name: "Veiled / Panther Chameleon",
    dayTarget: "40% – 50% (Daytime with high airflow)",
    nightSpike: "80% – 100% (Nighttime cool fogging)",
    shedTarget: "80% morning misting",
    biome: "Coastal Scrub / Mountain Forest",
    mistingTips: "Run automatic pressure mister 2-3 times daily for 2 minutes, plus cool ultrasonic fogger at night with full screen ventilation.",
    risksLow: "Severe dehydration, sunken eyes, kidney failure, stuck shedding.",
    risksHigh: "Fatal respiratory infection if daytime air is stagnant without full airflow.",
  },
  "blue-tongue-skink": {
    name: "Blue-Tongued Skink (Northern vs Indonesian)",
    dayTarget: "Northern: 40–50% | Indonesian: 70–90%",
    nightSpike: "Northern: 60% | Indonesian: 90–95%",
    shedTarget: "Boost by 10–15% during shed phase",
    biome: "Northern (Woodland) / Indonesian (Rainforest)",
    mistingTips: "Indonesians require deep cypress/coco substrate with daily misting. Northerns need moderate moisture with a dry top layer.",
    risksLow: "Indonesian skinks will lose toes from stuck shed if humidity is under 70%.",
    risksHigh: "Scale rot if substrate is muddy.",
  },
  "russian-tortoise": {
    name: "Russian / Greek / Hermann's Tortoise",
    dayTarget: "40% – 60%",
    nightSpike: "65% – 75% inside burrow",
    shedTarget: "Weekly 20-minute shallow warm water soak (85-90°F)",
    biome: "Arid Steppe & Mediterranean Scrub",
    mistingTips: "Provide deep topsoil/coco substrate so tortoise can burrow into humid microclimate layers.",
    risksLow: "Pyramiding of shell scutes, eye irritation from dusty substrate.",
    risksHigh: "Shell rot, respiratory illness if kept cold and damp.",
  },
  "brazilian-rainbow-boa": {
    name: "Brazilian Rainbow Boa (Epicrates cenchria)",
    dayTarget: "75% – 85% (Adults) | 90%+ (Babies)",
    nightSpike: "90% – 95%",
    shedTarget: "90% – 95%",
    biome: "Amazon Basin Rainforest",
    mistingTips: "Non-negotiable high humidity! Solid PVC vivarium with deep damp sphagnum and live moss is required.",
    risksLow: "Babies will dehydrate and die within days if humidity drops below 75%.",
    risksHigh: "Scale rot if cage lack sufficient clean air exchange.",
  },
  "uromastyx": {
    name: "Uromastyx (Spiny-Tailed Lizard)",
    dayTarget: "15% – 25% (Ultra Arid)",
    nightSpike: "30% – 35%",
    shedTarget: "25% (Do NOT mist or use humid hides)",
    biome: "Saharan Desert",
    mistingTips: "Zero misting. Do not keep a water bowl in the enclosure. Uromastyx get 100% of hydration from fresh leafy greens and seeds.",
    risksLow: "Extremely well adapted to ultra-dry conditions.",
    risksHigh: "Humidity above 40% causes lethal tail rot and skin fungal infections.",
  },
};

export function ReptileHumidityGuide() {
  const [spKey, setSpKey] = useState("bearded-dragon");
  const [currentReading, setCurrentReading] = useState<number>(35);

  const sp = REPTILE_HUMIDITY_DATA[spKey] || REPTILE_HUMIDITY_DATA["bearded-dragon"];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <h3 className="font-semibold text-foreground">Reptile Species Humidity &amp; Microclimate Guide</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Understand species diurnal humidity cycles, misting protocols, and health risks.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Select Species</Label>
            <Select value={spKey} onValueChange={setSpKey}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.entries(REPTILE_HUMIDITY_DATA).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Your Current Hygrometer Reading (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={currentReading}
              onChange={(e) => setCurrentReading(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
              className="h-10"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              Target Daytime Baseline
            </span>
            <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              {sp.dayTarget}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Natural Biome: <strong className="text-foreground">{sp.biome}</strong>
            </p>
          </div>

          <Badge variant="outline" className="text-xs px-3 py-1.5 font-medium">
            Night Spike: {sp.nightSpike}
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Sun className="h-3.5 w-3.5 text-amber-500" /> Daytime
            </div>
            <div className="mt-1 text-base font-bold text-foreground">{sp.dayTarget}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Droplets className="h-3.5 w-3.5 text-blue-500" /> Nighttime
            </div>
            <div className="mt-1 text-base font-bold text-blue-600 dark:text-blue-400">{sp.nightSpike}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Layers className="h-3.5 w-3.5 text-emerald-500" /> Shedding
            </div>
            <div className="mt-1 text-xs font-bold text-foreground truncate">{sp.shedTarget}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">Hygrometer Check</div>
            <div className="mt-1 text-base font-bold text-foreground">{currentReading}%</div>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-xs">
          <div className="rounded-xl border p-3.5 bg-card/80">
            <strong className="text-foreground">Misting &amp; Maintenance Protocol: </strong>
            <span className="text-muted-foreground">{sp.mistingTips}</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <span className="font-semibold text-amber-800 dark:text-amber-300">Risks if Humidity Too Low:</span>
              <p className="text-muted-foreground mt-0.5">{sp.risksLow}</p>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
              <span className="font-semibold text-rose-800 dark:text-rose-300">Risks if Humidity Too High:</span>
              <p className="text-muted-foreground mt-0.5">{sp.risksHigh}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2. REPTILE BASKING & THERMAL GRADIENT GUIDE */
interface BaskingSpecies {
  name: string;
  baskSurfaceF: string;
  warmAmbientF: string;
  coolAmbientF: string;
  nightDropF: string;
  baskSurfaceC: string;
  warmAmbientC: string;
  coolAmbientC: string;
  nightDropC: string;
  primaryHeat: string;
  thermostatType: string;
  notes: string;
}

const REPTILE_BASKING_DATA: Record<string, BaskingSpecies> = {
  "bearded-dragon": {
    name: "Bearded Dragon",
    baskSurfaceF: "100°F – 110°F", warmAmbientF: "88°F – 92°F", coolAmbientF: "75°F – 80°F", nightDropF: "68°F – 74°F",
    baskSurfaceC: "38°C – 43°C", warmAmbientC: "31°C – 33°C", coolAmbientC: "24°C – 27°C", nightDropC: "20°C – 23°C",
    primaryHeat: "Halogen Flood Bulb (50–100W) over flat slate/stone",
    thermostatType: "Dimming Thermostat (never on/off for light-emitting bulbs)",
    notes: "Measure surface temperature directly with an infrared temp gun. Air temperature thermometer will read 10-15°F lower.",
  },
  "leopard-gecko": {
    name: "Leopard Gecko",
    baskSurfaceF: "90°F – 94°F", warmAmbientF: "85°F – 88°F", coolAmbientF: "72°F – 76°F", nightDropF: "68°F – 72°F",
    baskSurfaceC: "32°C – 34°C", warmAmbientC: "29°C – 31°C", coolAmbientC: "22°C – 24°C", nightDropC: "20°C – 22°C",
    primaryHeat: "Deep Heat Projector (DHP 50W) or Halogen Flood",
    thermostatType: "Dimming or Pulse Proportional Thermostat",
    notes: "Overhead infrared heating onto slate warms belly tissues effectively for digestion. Avoid unregulated heat mats.",
  },
  "ball-python": {
    name: "Ball Python",
    baskSurfaceF: "88°F – 92°F", warmAmbientF: "85°F – 88°F", coolAmbientF: "76°F – 80°F", nightDropF: "72°F – 76°F",
    baskSurfaceC: "31°C – 33°C", warmAmbientC: "29°C – 31°C", coolAmbientC: "24°C – 27°C", nightDropC: "22°C – 24°C",
    primaryHeat: "Deep Heat Projector (DHP) or Radiant Heat Panel (RHP)",
    thermostatType: "Pulse Proportional Thermostat with probe 3\" below heat source",
    notes: "Never exceed 95°F (35°C) — excess heat causes neurological distress in pythons. Maintain distinct cool zone.",
  },
  "crested-gecko": {
    name: "Crested Gecko",
    baskSurfaceF: "78°F – 82°F (Warm Perch)", warmAmbientF: "74°F – 78°F", coolAmbientF: "68°F – 72°F", nightDropF: "65°F – 70°F",
    baskSurfaceC: "26°C – 28°C", warmAmbientC: "23°C – 26°C", coolAmbientC: "20°C – 22°C", nightDropC: "18°C – 21°C",
    primaryHeat: "Low-wattage DHP (25W) or Nano Ceramic Heat Emitter",
    thermostatType: "Dimming Thermostat (Strictly capped at 82°F)",
    notes: "Temperatures above 85°F (29°C) cause heat stroke and death in crested geckos within hours! Keep cool.",
  },
  "corn-snake": {
    name: "Corn Snake",
    baskSurfaceF: "85°F – 88°F", warmAmbientF: "82°F – 85°F", coolAmbientF: "72°F – 76°F", nightDropF: "68°F – 72°F",
    baskSurfaceC: "29°C – 31°C", warmAmbientC: "28°C – 29°C", coolAmbientC: "22°C – 24°C", nightDropC: "20°C – 22°C",
    primaryHeat: "Halogen Flood or Deep Heat Projector (DHP)",
    thermostatType: "Dimming Thermostat",
    notes: "Corn snakes regulate easily across a gentle gradient. Ensure cool side hide stays comfortably in the 70s.",
  },
  "blue-tongue-skink": {
    name: "Blue-Tongued Skink",
    baskSurfaceF: "100°F – 108°F", warmAmbientF: "85°F – 90°F", coolAmbientF: "75°F – 80°F", nightDropF: "70°F – 75°F",
    baskSurfaceC: "38°C – 42°C", warmAmbientC: "29°C – 32°C", coolAmbientC: "24°C – 27°C", nightDropC: "21°C – 24°C",
    primaryHeat: "High-wattage Halogen Flood (75–100W)",
    thermostatType: "Dimming Thermostat",
    notes: "Requires a broad basking surface (flagstone or paver) large enough to heat the skink's entire body simultaneously.",
  },
  "uromastyx": {
    name: "Uromastyx",
    baskSurfaceF: "115°F – 125°F (Intense Heat)", warmAmbientF: "95°F – 100°F", coolAmbientF: "80°F – 85°F", nightDropF: "68°F – 74°F",
    baskSurfaceC: "46°C – 52°C", warmAmbientC: "35°C – 38°C", coolAmbientC: "27°C – 29°C", nightDropC: "20°C – 23°C",
    primaryHeat: "Dual Halogen Flood Bulbs (100W + 50W cluster)",
    thermostatType: "High-Temp Dimming Thermostat",
    notes: "Highest heat requirement in the hobby! Needs extreme basking surface to properly digest tough seed and fibrous greens diets.",
  },
};

export function ReptileBaskingGuide() {
  const [spKey, setSpKey] = useState("bearded-dragon");
  const [unit, setUnit] = useState<"F" | "C">("F");

  const sp = REPTILE_BASKING_DATA[spKey] || REPTILE_BASKING_DATA["bearded-dragon"];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div>
            <h3 className="font-semibold text-foreground">Reptile Basking &amp; Thermal Gradient Guide</h3>
            <p className="text-xs text-muted-foreground">Four-zone thermal gradient matrix and heating hardware pairings.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={unit === "F" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("F")}
              className="h-8 text-xs font-medium"
            >
              Fahrenheit (°F)
            </Button>
            <Button
              variant={unit === "C" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("C")}
              className="h-8 text-xs font-medium"
            >
              Celsius (°C)
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Label className="text-xs font-medium text-muted-foreground">Select Species</Label>
          <Select value={spKey} onValueChange={setSpKey}>
            <SelectTrigger className="mt-1.5 h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(REPTILE_BASKING_DATA).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-rose-600 dark:text-rose-400 uppercase">
              Basking Surface Temperature (IR Gun)
            </span>
            <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              {unit === "F" ? sp.baskSurfaceF : sp.baskSurfaceC}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Target Species: <strong className="text-foreground">{sp.name}</strong>
            </p>
          </div>

          <Badge variant="outline" className="text-xs px-3 py-1.5 font-medium">
            Overhead Heat: {sp.primaryHeat.split("(")[0]}
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-rose-600 dark:text-rose-400 uppercase flex items-center justify-center gap-1">
              <Thermometer className="h-3.5 w-3.5" /> Basking Spot
            </div>
            <div className="mt-1 text-base font-bold text-foreground">{unit === "F" ? sp.baskSurfaceF : sp.baskSurfaceC}</div>
            <div className="text-[10px] text-muted-foreground">Surface temp</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase">Warm Side</div>
            <div className="mt-1 text-base font-bold text-foreground">{unit === "F" ? sp.warmAmbientF : sp.warmAmbientC}</div>
            <div className="text-[10px] text-muted-foreground">Ambient air</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400 uppercase">Cool Retreat</div>
            <div className="mt-1 text-base font-bold text-foreground">{unit === "F" ? sp.coolAmbientF : sp.coolAmbientC}</div>
            <div className="text-[10px] text-muted-foreground">Ambient air</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 uppercase">Night Drop</div>
            <div className="mt-1 text-base font-bold text-foreground">{unit === "F" ? sp.nightDropF : sp.nightDropC}</div>
            <div className="text-[10px] text-muted-foreground">Circadian rest</div>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-xs">
          <div className="rounded-xl border p-3 bg-card/80">
            <strong className="text-foreground">Thermostat Controller: </strong>
            <span className="text-muted-foreground">{sp.thermostatType}</span>
          </div>

          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-muted-foreground">
            <strong className="text-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-rose-500" /> Husbandry Advisory:
            </strong>
            <p className="mt-1 leading-relaxed">{sp.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3. BEARDED DRAGON FOOD & NUTRITION CALCULATOR */
export function BeardedDragonFood() {
  const [lifeStage, setLifeStage] = useState<string>("juvenile");

  const dietStages: Record<string, { name: string; ageRange: string; bugPct: number; saladPct: number; frequency: string; insectCount: string; notes: string }> = {
    hatchling: {
      name: "Hatchling / Baby",
      ageRange: "0–3 Months",
      bugPct: 80,
      saladPct: 20,
      frequency: "Feed small insects 3× daily (as many as eaten in 10 mins) + fresh micro salad daily.",
      insectCount: "30–60 micro dubias / small crickets daily",
      notes: "Babies grow rapidly and require high protein. Always dust with plain calcium at every insect feeding.",
    },
    juvenile: {
      name: "Juvenile",
      ageRange: "4–11 Months",
      bugPct: 60,
      saladPct: 40,
      frequency: "Feed medium insects 1–2× daily + daily fresh salad bowl.",
      insectCount: "20–30 medium dubias / crickets daily",
      notes: "Gradually introduce a wider variety of dark leafy greens. Keep insect size smaller than space between eyes.",
    },
    subadult: {
      name: "Sub-Adult",
      ageRange: "12–17 Months",
      bugPct: 40,
      saladPct: 60,
      frequency: "Feed insects once every other day + large fresh salad bowl daily.",
      insectCount: "10–15 large dubias / adult crickets on feeding days",
      notes: "Metabolism begins shifting toward plant-based fiber. Do not overfeed bugs to prevent juvenile obesity.",
    },
    adult: {
      name: "Full Adult",
      ageRange: "18+ Months",
      bugPct: 20,
      saladPct: 80,
      frequency: "Large dark leafy salad daily + insects 2× per week only.",
      insectCount: "4–6 large dubias or superworms twice a week",
      notes: "Adults are primarily herbivores! High insect diets cause fatty liver disease, gout, and obesity in adult beardies.",
    },
  };

  const currentStage = dietStages[lifeStage] || dietStages["juvenile"];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <h3 className="font-semibold text-foreground">Bearded Dragon Diet, Portion &amp; Nutrition Planner</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Calculate exact insect-to-greens ratio, staple food lists, and weekly calcium dusting schedule.</p>

        <div className="mt-4">
          <Label className="text-xs font-medium text-muted-foreground">Select Life Stage &amp; Age</Label>
          <Select value={lifeStage} onValueChange={setLifeStage}>
            <SelectTrigger className="mt-1.5 h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hatchling">Baby / Hatchling (0–3 Months)</SelectItem>
              <SelectItem value="juvenile">Juvenile (4–11 Months)</SelectItem>
              <SelectItem value="subadult">Sub-Adult (12–17 Months)</SelectItem>
              <SelectItem value="adult">Adult (18+ Months)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
              Dietary Ratio Breakdown
            </span>
            <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              {currentStage.bugPct}% Insects / {currentStage.saladPct}% Greens
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Life Stage: <strong className="text-foreground">{currentStage.name} ({currentStage.ageRange})</strong>
            </p>
          </div>

          <Badge variant="outline" className="text-xs px-3 py-1.5 font-medium">
            {currentStage.insectCount}
          </Badge>
        </div>

        {/* Visual Ratio Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-amber-600 dark:text-amber-400">Live Feeders ({currentStage.bugPct}%)</span>
            <span className="text-emerald-600 dark:text-emerald-400">Salad &amp; Greens ({currentStage.saladPct}%)</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
            <div style={{ width: `${currentStage.bugPct}%` }} className="bg-amber-500 h-full" />
            <div style={{ width: `${currentStage.saladPct}%` }} className="bg-emerald-500 h-full" />
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-card/90 p-4 space-y-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-foreground border-b pb-2">
            <Utensils className="h-4 w-4 text-emerald-500" /> Feeding Routine:
          </div>
          <p className="text-muted-foreground leading-relaxed">{currentStage.frequency}</p>
        </div>

        {/* Staple Foods & Warning Grid */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Daily Staple Greens:
            </span>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              Collard greens, Mustard greens, Dandelion greens, Turnip greens, Endive, Escarole, Butternut squash.
            </p>
          </div>

          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3">
            <span className="font-semibold text-destructive flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> Toxic / Avoid Foods:
            </span>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              Avocado, Rhubarb, Fireflies/Lightning bugs (lethal poison), Spinach/Beet greens (blocks calcium), Iceberg lettuce (zero nutrition, causes diarrhea).
            </p>
          </div>
        </div>

        {/* Dusting schedule */}
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Weekly Supplement Dusting Schedule: </span>
          <span>Plain Calcium without D3 (4–5 days/week) • Calcium with D3 (1–2 days/week) • Reptile Multivitamin (1 day/week).</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────── HORSES ─────────── */
export function HorseBlanketSize() {
  const [chest, setChest] = useState(70);
  const [tail, setTail] = useState(72);
  const size = Math.round((chest + tail) / 2);
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Center of chest → point of shoulder (in)" value={chest} onChange={setChest} />
        <NumberField label="Point of shoulder → base of tail (in)" value={tail} onChange={setTail} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${size}"`} label="Blanket size" />
        <Note>Round up to nearest even size. Blanket should cover withers to base of tail without pulling.</Note>
      </div>}
    />
  );
}

export function HorseStallSize() {
  const [size, setSize] = useState("standard");
  const dims: Record<string, string> = { pony: "10 × 10 ft", standard: "12 × 12 ft", "warmblood": "12 × 14 ft", draft: "14 × 16 ft", foaling: "16 × 16 ft" };
  return (
    <CalculatorLayout
      form={<SelectField label="Horse type" value={size} onChange={setSize} options={Object.keys(dims)} />}
      result={<div className="space-y-4">
        <Big value={dims[size]} label="Minimum stall size" />
        <Note>Horses in stalls need at least 2 hours of turnout daily to prevent stress and stocking up.</Note>
      </div>}
    />
  );
}

export function HorseHoofTrimming() {
  const [use, setUse] = useState("light");
  const wks: Record<string, string> = { pasture: "every 8 weeks", light: "every 6–7 weeks", performance: "every 4–5 weeks", "shod-competition": "every 5–6 weeks with reset" };
  return (
    <CalculatorLayout
      form={<SelectField label="Workload" value={use} onChange={setUse} options={Object.keys(wks)} />}
      result={<div className="space-y-4">
        <Big value={wks[use]} label="Farrier interval" />
        <Note>Growth accelerates in summer. Cracks, flares, or heel imbalance = book sooner.</Note>
      </div>}
    />
  );
}

/* ─────────── FARM ─────────── */
export function ChickenFeed() {
  const [birds, setBirds] = useState(6);
  const [stage, setStage] = useState("layer");
  const grams: Record<string, number> = { chick: 25, pullet: 75, layer: 120, meat: 150 };
  const dailyKg = ((birds * grams[stage]) / 1000).toFixed(2);
  const monthlyKg = (Number(dailyKg) * 30).toFixed(1);
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Number of birds" value={birds} onChange={setBirds} min={1} />
        <SelectField label="Life stage" value={stage} onChange={setStage} options={Object.keys(grams)} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${dailyKg} kg / day`} label="Feed consumption" />
        <Note>Monthly buy: ~{monthlyKg} kg. Layers also need free-choice grit and oyster shell.</Note>
      </div>}
    />
  );
}

export function GoatWater() {
  const [goats, setGoats] = useState(2);
  const [temp, setTemp] = useState("mild");
  const perGoat: Record<string, number> = { cool: 2, mild: 3, hot: 5 };
  const gal = goats * perGoat[temp];
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Number of goats" value={goats} onChange={setGoats} min={1} />
        <SelectField label="Climate" value={temp} onChange={setTemp} options={Object.keys(perGoat)} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${gal} gal / day`} label="Fresh water needed" />
        <Note>Lactating does drink 50% more. Refill 2×/day in summer — goats refuse dirty water.</Note>
      </div>}
    />
  );
}

export function SheepFeed() {
  const [sheep, setSheep] = useState(5);
  const [stage, setStage] = useState("maintenance");
  const lbs: Record<string, number> = { maintenance: 3, growing: 4, lactating: 6 };
  const daily = sheep * lbs[stage];
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Number of sheep" value={sheep} onChange={setSheep} min={1} />
        <SelectField label="Stage" value={stage} onChange={setStage} options={Object.keys(lbs)} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${daily} lbs / day`} label="Total hay/pasture DM" />
        <Note>Pasture reduces hay by 60–80% in growing season. Provide loose sheep mineral (no copper).</Note>
      </div>}
    />
  );
}

export function DuckFeed() {
  const [ducks, setDucks] = useState(4);
  const [stage, setStage] = useState("layer");
  const grams: Record<string, number> = { duckling: 60, grower: 130, layer: 170, meat: 200 };
  const dailyKg = ((ducks * grams[stage]) / 1000).toFixed(2);
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label="Number of ducks" value={ducks} onChange={setDucks} min={1} />
        <SelectField label="Stage" value={stage} onChange={setStage} options={Object.keys(grams)} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${dailyKg} kg / day`} label="Feed consumption" />
        <Note>Ducks need niacin (3× chicken level). Never medicated chick starter for ducklings.</Note>
      </div>}
    />
  );
}

/* ─────────── GENERAL ─────────── */
export function PetHydrationCalculator() {
  const [species, setSpecies] = useState("dog");
  const [kg, setKg] = useState(15);
  const mlPerKg: Record<string, number> = { dog: 60, cat: 55, rabbit: 100, "guinea-pig": 100, bird: 50, ferret: 75 };
  const ml = Math.round(kg * mlPerKg[species]);
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <SelectField label="Species" value={species} onChange={setSpecies} options={Object.keys(mlPerKg)} />
        <NumberField label="Weight (kg)" value={kg} onChange={setKg} step={0.5} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${ml} ml`} label="Daily water target" />
        <Note>Wet food and fresh produce contribute. Sudden drops or spikes are a vet-visit signal.</Note>
      </div>}
    />
  );
}

export function TrainingTreatPlanner() {
  const [dailyKcal, setDailyKcal] = useState(400);
  const treatCap = Math.round(dailyKcal * 0.1);
  const perTreat = 3;
  const maxTreats = Math.floor(treatCap / perTreat);
  return (
    <CalculatorLayout
      form={<NumberField label="Pet's daily calorie needs (kcal)" value={dailyKcal} onChange={setDailyKcal} min={50} />}
      result={<div className="space-y-4">
        <Big value={`${treatCap} kcal / day`} label="Max training-treat allowance" />
        <Note>≈ {maxTreats} standard 3-kcal treats. Reduce meal size by the same calories to prevent weight gain.</Note>
      </div>}
    />
  );
}
