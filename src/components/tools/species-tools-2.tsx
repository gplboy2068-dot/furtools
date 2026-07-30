import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";

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
const HUMIDITY: Record<string, string> = {
  "leopard-gecko": "30–40%",
  "bearded-dragon": "30–40%",
  "ball-python": "50–60% (65–75% shed)",
  "crested-gecko": "60–80%",
  "corn-snake": "40–50%",
  "red-eared-slider": "50–70%",
};
export function ReptileHumidityGuide() {
  const [sp, setSp] = useState("bearded-dragon");
  return (
    <CalculatorLayout
      form={<SelectField label="Species" value={sp} onChange={setSp} options={Object.keys(HUMIDITY)} />}
      result={<div className="space-y-4">
        <Big value={HUMIDITY[sp]} label="Target humidity" />
        <Note>Use a digital hygrometer on the cool side. Mist, larger water bowls, or moss boxes raise humidity.</Note>
      </div>}
    />
  );
}

const BASKING: Record<string, string> = {
  "leopard-gecko": "90–95°F",
  "bearded-dragon": "100–110°F",
  "ball-python": "88–92°F",
  "crested-gecko": "78–82°F (no basking bulb)",
  "corn-snake": "85–88°F",
  "blue-tongue-skink": "95–100°F",
};
export function ReptileBaskingGuide() {
  const [sp, setSp] = useState("bearded-dragon");
  return (
    <CalculatorLayout
      form={<SelectField label="Species" value={sp} onChange={setSp} options={Object.keys(BASKING)} />}
      result={<div className="space-y-4">
        <Big value={BASKING[sp]} label="Basking surface temp" />
        <Note>Measure surface temp with an IR gun, not air temperature. Always provide a cool-side gradient.</Note>
      </div>}
    />
  );
}

export function BeardedDragonFood() {
  const [age, setAge] = useState("juvenile");
  const plan: Record<string, string> = {
    hatchling: "70% insects / 30% greens · 3–5× daily",
    juvenile: "60% insects / 40% greens · 2× daily",
    "sub-adult": "40% insects / 60% greens · 1× daily",
    adult: "20% insects / 80% greens · 1× daily or every other day",
  };
  return (
    <CalculatorLayout
      form={<SelectField label="Life stage" value={age} onChange={setAge} options={Object.keys(plan)} />}
      result={<div className="space-y-4">
        <Big value={plan[age]} label="Diet plan" />
        <Note>Dust insects with calcium 5×/week, calcium+D3 2×/week, multivitamin 1×/week.</Note>
      </div>}
    />
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
