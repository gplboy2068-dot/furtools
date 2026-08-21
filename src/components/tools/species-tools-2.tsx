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
interface BirdBathProfile {
  name: string;
  frequency: string;
  preferredMethod: string;
  featherType: string;
  dryingDuration: string;
  clinicalTip: string;
}

const BIRD_BATH_DATA: Record<string, BirdBathProfile> = {
  finch: { name: "Finch / Canary", frequency: "Daily shallow dish (5–7× weekly)", preferredMethod: "Heavy shallow ceramic dish (0.5\" depth) placed on floor", featherType: "Delicate contour feathers; prone to drying out", dryingDuration: "30–45 minutes", clinicalTip: "Provide bath in morning only; remove water dish after 20 mins to prevent drinking soiled water." },
  budgie: { name: "Budgerigar", frequency: "3–4× per week", preferredMethod: "Wet broad lettuce/kale leaves or fine gentle spray mist", featherType: "Dense dry plumage; powder down", dryingDuration: "45–60 minutes", clinicalTip: "Budgies often prefer rubbing their bodies against wet greens hung in the cage rather than direct baths." },
  cockatiel: { name: "Cockatiel", frequency: "Daily gentle misting or 3× weekly shallow bath", preferredMethod: "Warm mist sprayed upwards (falling like natural rain)", featherType: "High powder down species (produces white keratin dust)", dryingDuration: "1 to 2 hours", clinicalTip: "Regular misting controls airborne dander and keeps uropygial preen gland ducts clear." },
  conure: { name: "Green Cheek / Sun Conure", frequency: "Daily active soaking", preferredMethod: "Running gentle sink faucet or shallow pie dish", featherType: "Oil-preened plumage; loves full soaking", dryingDuration: "1 to 1.5 hours", clinicalTip: "Extremely enthusiastic bathers; will dunk whole head and flap wings vigorously." },
  "african-grey": { name: "African Grey", frequency: "3–5× per week", preferredMethod: "Fine lukewarm mist or dedicated shower perch", featherType: "Extremely dense powder down; susceptible to dry skin", dryingDuration: "2 to 3 hours", clinicalTip: "Warm misting relieves itchy feather sheaths and helps prevent psychogenic feather picking." },
  amazon: { name: "Amazon Parrot", frequency: "Daily or 4–5× weekly", preferredMethod: "Shower perch with gentle warm spray or heavy mist", featherType: "Vibrant plumage requiring high humidity", dryingDuration: "2 hours", clinicalTip: "Amazons display joyful wing flares and vocalizations under warm shower mist." },
  cockatoo: { name: "Cockatoo (Umbrella/Moluccan)", frequency: "Daily misting + 3× weekly shower", preferredMethod: "Shower perch with defused mist stream", featherType: "Massive powder down production; prone to skin flaking", dryingDuration: "2 to 3 hours", clinicalTip: "Bathing is mandatory to prevent powder clogging room air and causing chronic sinus irritation." },
  macaw: { name: "Large Macaw", frequency: "Daily heavy misting / shower", preferredMethod: "Dedicated walk-in shower perch with warm spray", featherType: "Heavy, robust flight contour feathers", dryingDuration: "2 to 3 hours", clinicalTip: "Drenching showers wash away dust, stimulate preening, and exercise wing muscles." },
};

export function BirdBathFrequency() {
  const [sp, setSp] = useState("cockatiel");
  const d = BIRD_BATH_DATA[sp] || BIRD_BATH_DATA.cockatiel;

  return (
    <CalculatorLayout
      form={
        <div>
          <Label>Bird Species</Label>
          <Select value={sp} onValueChange={setSp}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(BIRD_BATH_DATA).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={d.frequency} label="Optimal Bathing Frequency" />
          <Rows items={[
            { label: "Preferred Bath Method", value: d.preferredMethod },
            { label: "Feather & Skin Type", value: d.featherType },
            { label: "Full Drying Duration", value: d.dryingDuration },
          ]} />
          <div className="rounded-lg bg-primary/10 p-3 text-xs text-primary font-medium">
            💡 {d.clinicalTip}
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Crucial Bath Rules:</strong> Use plain lukewarm water only (NEVER soap or shampoo, which dissolves natural waterproofing preen oils). Always bathe before noon so feathers are 100% dry before nighttime sleep to prevent hypothermia.</p>
          </div>
        </div>
      }
    />
  );
}

interface BirdFlightProfile {
  name: string;
  minFlightDimensions: string;
  minWingBeats: number;
  wingspanInches: number;
  dailyHours: number;
  hazards: string[];
}

const BIRD_FLIGHT_DATA: Record<string, BirdFlightProfile> = {
  finch: { name: "Finch / Canary (Colony)", minFlightDimensions: "6 ft L × 3 ft W × 4 ft H", minWingBeats: 4, wingspanInches: 8, dailyHours: 0, hazards: ["Bar spacing > 0.5 inches", "Vertical ceiling fans", "Reflective window glass"] },
  budgie: { name: "Budgerigar", minFlightDimensions: "8 ft L × 6 ft W × 7 ft H", minWingBeats: 5, wingspanInches: 12, dailyHours: 2, hazards: ["Open toilet bowls", "Toxic houseplants (philodendron, lilies)", "Curious cats/dogs"] },
  cockatiel: { name: "Cockatiel", minFlightDimensions: "10 ft L × 8 ft W × 7 ft H", minWingBeats: 6, wingspanInches: 16, dailyHours: 3, hazards: ["Ceiling fans on low/med/high", "Mirrors (collision risk)", "Uncovered windows"] },
  conure: { name: "Conure (Green Cheek / Sun)", minFlightDimensions: "12 ft L × 8 ft W × 8 ft H", minWingBeats: 6, wingspanInches: 18, dailyHours: 4, hazards: ["Non-stick PTFE cookware off-gassing", "Hot stoves / simmering pots", "Open doors"] },
  "african-grey": { name: "African Grey / Amazon", minFlightDimensions: "16 ft L × 10 ft W × 8 ft H", minWingBeats: 7, wingspanInches: 28, dailyHours: 4, hazards: ["Electrical wires / power cords", "Heavy metal decor (lead/zinc)", "Glass doors"] },
  cockatoo: { name: "Cockatoo", minFlightDimensions: "20 ft L × 12 ft W × 9 ft H", minWingBeats: 8, wingspanInches: 36, dailyHours: 5, hazards: ["Wood trim chewing (paint toxicity)", "Open exterior windows", "Ceiling fans"] },
  macaw: { name: "Large Macaw", minFlightDimensions: "24 ft L × 15 ft W × 10 ft H", minWingBeats: 8, wingspanInches: 42, dailyHours: 5, hazards: ["Confined hallways (wing-strike risk)", "Unscreened double doors", "Unpadded glass"] },
};

export function BirdFlightSpace() {
  const [sp, setSp] = useState("cockatiel");
  const d = BIRD_FLIGHT_DATA[sp] || BIRD_FLIGHT_DATA.cockatiel;

  return (
    <CalculatorLayout
      form={
        <div>
          <Label>Bird Species</Label>
          <Select value={sp} onValueChange={setSp}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(BIRD_FLIGHT_DATA).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={d.minFlightDimensions} label="Recommended Flight Zone Dimensions" />
          <Rows items={[
            { label: "Continuous Wing Beats Between Perches", value: `${d.minWingBeats}+ full flaps` },
            { label: "Adult Wingspan", value: `≈ ${d.wingspanInches} inches` },
            { label: "Recommended Supervised Free Flight", value: `${d.dailyHours}+ hours daily` },
          ]} />
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive space-y-1">
            <strong>🚫 Critical Flight Safety Checklist:</strong>
            <ul className="list-disc pl-4 space-y-0.5 mt-1">
              {d.hazards.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>
        </div>
      }
    />
  );
}

export function BirdToyRotation() {
  const [toys, setToys] = useState(12);
  const [speciesSize, setSpeciesSize] = useState<"small" | "medium" | "large">("medium");

  const displayCount = speciesSize === "small" ? Math.min(5, Math.max(3, Math.floor(toys * 0.35))) : speciesSize === "medium" ? Math.min(6, Math.max(4, Math.floor(toys * 0.4))) : Math.min(7, Math.max(4, Math.floor(toys * 0.45)));
  const storageCount = toys - displayCount;
  const foragingShare = Math.max(1, Math.round(displayCount * 0.35));
  const destructibleShare = Math.max(1, Math.round(displayCount * 0.35));
  const chewPreenShare = Math.max(1, displayCount - foragingShare - destructibleShare);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Parrot / Bird Size Category</Label>
            <Select value={speciesSize} onValueChange={(v) => setSpeciesSize(v as typeof speciesSize)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (Budgie, Cockatiel, Lovebird, Finch)</SelectItem>
                <SelectItem value="medium">Medium (Conure, Ringneck, Senegal, Caique)</SelectItem>
                <SelectItem value="large">Large (African Grey, Amazon, Cockatoo, Macaw)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Total Toy Inventory in Possession</Label>
            <Input type="number" min={4} max={50} value={toys} onChange={(e) => setToys(Math.max(4, +e.target.value || 4))} className="mt-1.5" />
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${displayCount} toys in cage`} label="Active In-Cage Display" unit={`${storageCount} in reserve storage`} />
          <Rows items={[
            { label: "1. Foraging / Food Puzzle Toys", value: `${foragingShare} items (treat retrieval)` },
            { label: "2. Destructible Soft Wood / Yucca / Paper", value: `${destructibleShare} items (shredding drive)` },
            { label: "3. Hardwood / Natural Preening Toys", value: `${chewPreenShare} items (beak trim & grooming)` },
            { label: "Rotation Cadence", value: "Rotate every 5 to 7 days" },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Safety Protocol:</strong> Inspect toys daily. Discard frayed cotton rope (causes fatal crop impaction if swallowed), remove rusty metal clasps (ensure stainless steel or nickel-plated zinc-free quick links), and replace split plastic.</p>
          </div>
        </div>
      }
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

/* ─────────── SMALL PETS (ADVANCED CALCULATORS) ─────────── */
export function HamsterWheelSize() {
  const [species, setSpecies] = useState<"syrian" | "dwarf" | "robo" | "chinese">("syrian");
  const [surface, setSurface] = useState<"solid" | "cork" | "wire">("solid");

  const specs = {
    syrian: { min: 11, rec: 12, maxSpineCurv: 11, kmNight: "5–9 km" },
    dwarf: { min: 8.5, rec: 10, maxSpineCurv: 8.5, kmNight: "4–8 km" },
    robo: { min: 8, rec: 9, maxSpineCurv: 8, kmNight: "6–10 km" },
    chinese: { min: 8.5, rec: 10, maxSpineCurv: 8.5, kmNight: "4–7 km" },
  }[species];

  const surfaceSafe = surface !== "wire";

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Hamster species</Label>
            <Select value={species} onValueChange={(v: typeof species) => setSpecies(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="syrian">Syrian Hamster (Golden / Teddy Bear)</SelectItem>
                <SelectItem value="dwarf">Dwarf Hamster (Campbell / Winter White)</SelectItem>
                <SelectItem value="robo">Roborovski Dwarf Hamster (Speed Runner)</SelectItem>
                <SelectItem value="chinese">Chinese Hamster</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Wheel track surface type</Label>
            <Select value={surface} onValueChange={(v: typeof surface) => setSurface(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid Plastic Track (Wodent Wheel / Silent Runner)</SelectItem>
                <SelectItem value="cork">Cork-Lined Wooden Wheel (Ultra-Quiet / Orthopedic)</SelectItem>
                <SelectItem value="wire">Wire Mesh / Runged Wheel (UNSAFE)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big
            value={`${specs.rec}" diameter`}
            label="Recommended wheel size"
            unit={`Minimum: ${specs.min}" (${Math.round(specs.min * 2.54)} cm)`}
          />
          <Rows
            items={[
              { label: "Spine posture check", value: "Back must be 100% horizontal / flat" },
              { label: "Track surface verdict", value: surfaceSafe ? "Safe solid running surface ✓" : "DANGEROUS: Causes bumblefoot & broken toes ✗" },
              { label: "Nightly exercise distance", value: specs.kmNight },
              { label: "Center axle safety", value: "Axle-free design prevents spine & tail entanglement" },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            If your hamster runs with their head or tail bent upwards like a banana, the wheel is too small. Running on an undersized wheel causes irreversible spinal deformation and chronic arthritis.
          </p>
        </div>
      }
    />
  );
}

export function FerretCageSize() {
  const [ferrets, setFerrets] = useState(2);
  const [outHours, setOutHours] = useState(4);

  const baseCuFt = 24;
  const totalCuFt = baseCuFt + (ferrets - 1) * 16;
  const levels = ferrets >= 3 ? "3–4 solid levels" : "2–3 solid levels";
  const litterBoxes = ferrets + 1;

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Number of ferrets</Label>
              <Input
                type="number"
                min={1}
                max={6}
                value={ferrets}
                onChange={(e) => setFerrets(+e.target.value || 1)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Daily free-roam (hours)</Label>
              <Input
                type="number"
                min={1}
                max={12}
                value={outHours}
                onChange={(e) => setOutHours(+e.target.value || 0)}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${totalCuFt} cu ft`} label="Minimum cage volume" unit={`≈ ${(totalCuFt * 0.0283168).toFixed(2)} m³`} />
          <Rows
            items={[
              { label: "Recommended structure", value: `Ferret Nation / Critter Nation (${levels})` },
              { label: "Maximum bar spacing", value: '0.5" (prevents kit & female head entrapment)' },
              { label: "Sleeping hammocks/dens", value: `${ferrets * 2} fleece hammocks & sleep sacks` },
              { label: "Corner litter boxes", value: `${litterBoxes} low-entry boxes` },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            {outHours >= 4
              ? "Great! 4+ hours of active, ferret-proofed room exploration satisfies natural predatory hunting and play drives."
              : "Warning: Less than 4 hours out of cage causes cage rage, destructive bar biting, and muscle atrophy."}
          </p>
        </div>
      }
    />
  );
}

export function GuineaPigCageSize() {
  const [pigs, setPigs] = useState(2);
  const [pairing, setPairing] = useState<"sows" | "boars" | "mixed_neutered">("sows");

  // Boar pairs need extra space to prevent territorial fighting
  const boarMultiplier = pairing === "boars" ? 1.25 : 1.0;
  const baseSqFt = {
    1: 7.5,
    2: 10.5,
    3: 13.0,
    4: 16.0,
    5: 19.0,
    6: 22.0,
  }[Math.min(6, Math.max(1, pigs))] || 10.5;

  const finalSqFt = Math.round(baseSqFt * boarMultiplier);
  const finalSqM = (finalSqFt * 0.092903).toFixed(2);
  const ccGrids =
    finalSqFt >= 20 ? "2 × 6 Grids (or 3 × 4)" : finalSqFt >= 15 ? "2 × 5 Grids" : finalSqFt >= 10 ? "2 × 4 Grids" : "2 × 3 Grids";

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Number of guinea pigs</Label>
              <Input
                type="number"
                min={1}
                max={6}
                value={pigs}
                onChange={(e) => setPigs(+e.target.value || 1)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Herd composition</Label>
              <Select value={pairing} onValueChange={(v: typeof pairing) => setPairing(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sows">Females (Sows) / Trio</SelectItem>
                  <SelectItem value="boars">Males (Boars - Need Extra Space)</SelectItem>
                  <SelectItem value="mixed_neutered">Neutered Boar + Sows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${finalSqFt} sq ft`} label="Continuous single-level floor space" unit={`≈ ${finalSqM} m²`} />
          <Rows
            items={[
              { label: "Recommended C&C cage grid size", value: ccGrids },
              { label: "Hideaways required", value: `${pigs + 1} hides (with 2 doors each)` },
              { label: "Hay stations & water bottles", value: `${Math.max(2, pigs)} separate feeding stations` },
              { label: "Upper lofts note", value: "Upper lofts are bonus space; they do NOT count toward the single-level base" },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            Guinea pigs have fragile spines and poor depth perception. They cannot climb vertical cages like ferrets or rats and require broad, flat, single-level running tracks for daily "popcorning" and exercise.
          </p>
        </div>
      }
    />
  );
}

export function RabbitLitterTrainingGuide() {
  const [lifeStage, setLifeStage] = useState<"neutered_adult" | "intact" | "baby" | "senior">("neutered_adult");
  const [litterType, setLitterType] = useState<"paper_pellets" | "aspen" | "clay" | "pine">("paper_pellets");

  const stageAdvice = {
    neutered_adult: {
      timeline: "3–7 days with proper box placement",
      plan: "High success rate. Place fresh Timothy hay in a hay rack directly hanging over the litter box.",
    },
    intact: {
      timeline: "Difficult until altered (hormonal marking)",
      plan: "Hormonal rabbits spray urine and scatter territorial poops. Spaying/neutering resolves 90% of marking.",
    },
    baby: {
      timeline: "2–4 weeks (gradual development)",
      plan: "Bunnies under 12 weeks have limited sphincter muscle control. Confine to a smaller pen with multiple litter trays.",
    },
    senior: {
      timeline: "Immediate with low-entry boxes",
      plan: "Arthritic rabbits cannot hop over high walls. Cut a 2-inch low entry notch in the front lip of the litter pan.",
    },
  }[lifeStage];

  const litterSafe = litterType === "paper_pellets" || litterType === "aspen";

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Rabbit status & age</Label>
            <Select value={lifeStage} onValueChange={(v: typeof lifeStage) => setLifeStage(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="neutered_adult">Neutered / Spayed Adult (Ideal)</SelectItem>
                <SelectItem value="intact">Intact Adult (Hormonal Spraying)</SelectItem>
                <SelectItem value="baby">Baby / Junior (&lt; 12 Weeks)</SelectItem>
                <SelectItem value="senior">Senior / Arthritic Rabbit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Litter substrate material</Label>
            <Select value={litterType} onValueChange={(v: typeof litterType) => setLitterType(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="paper_pellets">Recycled Paper Pellets (Yesterday's News / CareFresh)</SelectItem>
                <SelectItem value="aspen">Kiln-Dried Aspen Shavings</SelectItem>
                <SelectItem value="clay">Cat Clumping Clay (TOXIC / DEADLY)</SelectItem>
                <SelectItem value="pine">Untreated Pine / Cedar Shavings (TOXIC OILS)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={stageAdvice.timeline} label="Expected training timeline" />
          <Rows
            items={[
              { label: "Litter material safety", value: litterSafe ? "Safe paper/aspen substrate ✓" : "LETHAL: Clay clumps in gut; aromatic pine damages liver ✗" },
              { label: "Hay rack position", value: "Hang hay rack directly OVER the litter box" },
              { label: "Enzymatic cleaner", value: "Use white vinegar or enzymatic spray for accidents" },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            <strong>Biological Secret:</strong> Rabbits instinctively defecate while eating hay. Hanging their unlimited Timothy hay directly over the litter pan solves 95% of all litter box resistance instantly.
          </p>
        </div>
      }
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
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [chestToTail, setChestToTail] = useState(76);
  const [clipped, setClipped] = useState<"unclipped" | "trace" | "full">("unclipped");
  const [weatherTemp, setWeatherTemp] = useState<"mild" | "cold" | "freezing">("cold");

  const inches = unit === "cm" ? Math.round(chestToTail / 2.54) : chestToTail;
  // US sizing: measured center of chest to center of tail (round to nearest 2 inches)
  const usSize = Math.round(inches / 2) * 2;
  // European sizing: measured withers to dock of tail (approx usSize - 22 to 24 inches)
  const euSizeCm = Math.round((usSize - 22) * 2.54);
  const ukFeet = `${Math.floor((usSize - 12) / 12)}'${(usSize - 12) % 12}"`;

  // Gram fill recommendation matrix
  const getFillRecommendation = () => {
    if (weatherTemp === "mild") {
      if (clipped === "full") return "Light Sheet / 100g Fill (prevent chill)";
      return "0g Rain Sheet or No Blanket Needed";
    }
    if (weatherTemp === "cold") {
      if (clipped === "full") return "Medium Weight (200g–250g Fill) with Neck Cover";
      if (clipped === "trace") return "Light/Medium (100g–200g Fill)";
      return "Light Turnout (100g) or Unblanketed if dry shelter available";
    }
    // freezing < 20°F / -7°C
    if (clipped === "full") return "Heavy Weight (350g–450g Fill) + Detachable Hood";
    if (clipped === "trace") return "Medium-Heavy (300g Fill)";
    return "Medium Weight (200g–250g Fill)";
  };

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="inline-flex rounded-md border p-0.5 text-xs">
              <button type="button" onClick={() => { setUnit("in"); setChestToTail(76); }} className={`px-2.5 py-1 rounded ${unit === "in" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>Inches (US)</button>
              <button type="button" onClick={() => { setUnit("cm"); setChestToTail(195); }} className={`px-2.5 py-1 rounded ${unit === "cm" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>Centimeters (EU)</button>
            </div>
          </div>
          <div>
            <Label>Chest-to-Tail Measurement ({unit})</Label>
            <Input type="number" min={40} max={260} value={chestToTail} onChange={(e) => setChestToTail(+e.target.value || 0)} className="mt-1.5" />
            <p className="text-xs text-muted-foreground mt-1">Measure from center of chest, across point of shoulder, to center of tail dock.</p>
          </div>
          <div>
            <Label>Coat Clipping Status</Label>
            <Select value={clipped} onValueChange={(v) => setClipped(v as typeof clipped)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unclipped">Unclipped (Natural Winter Fur & Piloerection)</SelectItem>
                <SelectItem value="trace">Trace / Strip Clipped (Under-neck & belly removed)</SelectItem>
                <SelectItem value="full">Full Body Hunter Clip (Complete Coat Removed)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ambient Winter Temperature</Label>
            <Select value={weatherTemp} onValueChange={(v) => setWeatherTemp(v as typeof weatherTemp)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild Cool (45°–55°F / 7°–13°C)</SelectItem>
                <SelectItem value="cold">Cold & Frosty (25°–44°F / -4°–6°C)</SelectItem>
                <SelectItem value="freezing">Severe Freezing / Snow (&lt; 25°F / -4°C with Wind)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${usSize}" / ${euSizeCm} cm`} label="Recommended Blanket Size" unit={`UK: ${ukFeet}`} />
          <Rows items={[
            { label: "US Standard Size", value: `Size ${usSize} inches (Center of chest → tail)` },
            { label: "European (Back Length)", value: `${euSizeCm} cm (Withers → dock)` },
            { label: "Recommended Thermal Fill", value: getFillRecommendation() },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Proper Fit Check:</strong> Slide a flat hand smoothly between the blanket neckline and your horse's withers. If it pinches or pulls tight across the chest, it will rub shoulders bald and cause wither pressure sores.</p>
          </div>
        </div>
      }
    />
  );
}

export function HorseStallSize() {
  const [horseType, setHorseType] = useState("standard");
  const [stallType, setStallType] = useState<"standard" | "foaling">("standard");

  const specs: Record<string, { name: string; standardDim: string; standardSqFt: number; minHeightFt: number; doorWidthFt: number; turnoutHrs: number; beddingBags: number; notes: string }> = {
    pony: { name: "Pony / Miniature (< 14.2 hh)", standardDim: "10 ft × 10 ft (3.0 × 3.0 m)", standardSqFt: 100, minHeightFt: 9, doorWidthFt: 3.5, turnoutHrs: 4, beddingBags: 3, notes: "Lower feed manger heights (24–30 inches) to prevent cervical strain." },
    standard: { name: "Light Horse / Thoroughbred (15.0–16.2 hh)", standardDim: "12 ft × 12 ft (3.6 × 3.6 m)", standardSqFt: 144, minHeightFt: 10, doorWidthFt: 4.0, turnoutHrs: 4, beddingBags: 4, notes: "The universal veterinary standard; permits comfortable casting-free rolling and sternal recumbency." },
    warmblood: { name: "Warmblood / Large Sport Horse (16.3–17.2 hh)", standardDim: "12 ft × 14 ft (3.6 × 4.2 m)", standardSqFt: 168, minHeightFt: 11, doorWidthFt: 4.0, turnoutHrs: 5, beddingBags: 5, notes: "Extra width prevents withers banging stall walls during deep sleep cycles." },
    draft: { name: "Draft Horse (Shire, Clydesdale, Percheron > 17.2 hh)", standardDim: "14 ft × 16 ft (4.2 × 4.8 m)", standardSqFt: 224, minHeightFt: 12, doorWidthFt: 4.5, turnoutHrs: 5, beddingBags: 6, notes: "Heavy-duty 2-inch tongue-and-groove hardwood kickboards reinforced with steel U-channels." },
  };

  const d = specs[horseType] || specs.standard;
  const isFoaling = stallType === "foaling";
  const displayDim = isFoaling ? "16 ft × 16 ft (4.8 × 4.8 m)" : d.standardDim;
  const displaySqFt = isFoaling ? 256 : d.standardSqFt;

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Horse Breed & Height Class</Label>
            <Select value={horseType} onValueChange={setHorseType}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(specs).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Stall Usage Purpose</Label>
            <Select value={stallType} onValueChange={(v) => setStallType(v as typeof stallType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Daily Boarding Stall</SelectItem>
                <SelectItem value="foaling">Foaling Stall (Broodmare + Newborn Foal Space)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={displayDim} label="Minimum Stall Floor Dimensions" unit={`≈ ${displaySqFt} sq ft`} />
          <Rows items={[
            { label: "Minimum Ceiling Clearance", value: `${d.minHeightFt} ft (Prevents poll strike injury)` },
            { label: "Sliding Door Minimum Width", value: `${d.doorWidthFt} ft (Avoids hip knocks)` },
            { label: "Fresh Shavings / Bedding Depth", value: `4–6 inches (≈ ${d.beddingBags + (isFoaling ? 2 : 0)} fresh pine bags)` },
            { label: "Mandatory Daily Turnout", value: `${d.turnoutHrs}+ hours in pasture` },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Barn Engineering Note:</strong> {d.notes} Ensure stalls have high cross-ventilation (minimum 4 to 8 air changes per hour) to prevent equine asthma (*heaves*) and ammonia respiratory damage.</p>
          </div>
        </div>
      }
    />
  );
}

export function HorseHoofTrimming() {
  const [shoeStatus, setShoeStatus] = useState<"barefoot" | "shod">("shod");
  const [workload, setWorkload] = useState<"pasture" | "light" | "performance">("light");
  const [season, setSeason] = useState<"summer" | "winter">("summer");

  const calculateWeeks = () => {
    if (shoeStatus === "shod") {
      if (season === "summer") return workload === "performance" ? 4 : 5;
      return workload === "performance" ? 5 : 6;
    }
    // Barefoot
    if (season === "summer") return workload === "performance" ? 5 : 6;
    return workload === "pasture" ? 8 : 7;
  };

  const weeks = calculateWeeks();

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Shoeing Configuration</Label>
            <Select value={shoeStatus} onValueChange={(v) => setShoeStatus(v as typeof shoeStatus)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="shod">Steel / Aluminum Shoes (Fronts or Full Set)</SelectItem>
                <SelectItem value="barefoot">Barefoot / Performance Hoof Boots</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Workload & Riding Surface</Label>
            <Select value={workload} onValueChange={(v) => setWorkload(v as typeof workload)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pasture">Pasture Pet / Light Turnout (Soft Grass)</SelectItem>
                <SelectItem value="light">Pleasure Trail / Light Arena (1–3 hrs/wk)</SelectItem>
                <SelectItem value="performance">High-Impact Performance (Jumping, reining, endurance)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Season (Growth Rate Factor)</Label>
            <Select value={season} onValueChange={(v) => setSeason(v as typeof season)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="summer">Spring / Summer (Accelerated Growth 8–10 mm/mo)</SelectItem>
                <SelectItem value="winter">Autumn / Winter (Slower Growth 5–6 mm/mo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`Every ${weeks} Weeks`} label="Farrier Trim & Reset Interval" />
          <Rows items={[
            { label: "Hoof Wall Growth Velocity", value: season === "summer" ? "≈ 8–10 mm / month (rapid growth)" : "≈ 5–6 mm / month (slower growth)" },
            { label: "Biomechanical Risk Threshold", value: "Waiting > 8 weeks shifts load onto deep flexor tendon" },
            { label: "Red-Flag Signs to Book Early", value: "Flared walls, loose clinches, under-run heels, chipping" },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Veterinary Biomechanics Rule:</strong> 'No hoof, no horse.' Long-toe / low-heel syndrome causes chronic strain on the navicular apparatus and collateral sesamoidean ligaments, representing the leading cause of avoidable equine lameness.</p>
          </div>
        </div>
      }
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
