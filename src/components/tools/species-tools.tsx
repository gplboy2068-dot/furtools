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
interface BirdCageData {
  name: string;
  singleMin: string;
  singleDimensions: { w: number; d: number; h: number };
  barSpacing: string;
  barOrientation: string;
  minPerchCount: number;
  outOfCageMinHours: number;
  note: string;
}

const BIRD_CAGES: Record<string, BirdCageData> = {
  finch: { name: "Zebra / Society Finch (Pair)", singleMin: "30\" W × 18\" D × 18\" H", singleDimensions: { w: 30, d: 18, h: 18 }, barSpacing: "1/4\" to 3/8\" (Max 0.9 cm)", barOrientation: "Horizontal bars for flight hopping", minPerchCount: 3, outOfCageMinHours: 0, note: "Finches fly strictly horizontally back-and-forth; horizontal width is critical. Never use round cages." },
  canary: { name: "Canary (Single)", singleMin: "24\" W × 16\" D × 18\" H", singleDimensions: { w: 24, d: 16, h: 18 }, barSpacing: "3/8\" to 1/2\" (Max 1.2 cm)", barOrientation: "Horizontal bars", minPerchCount: 3, outOfCageMinHours: 1, note: "Requires unbroken horizontal flight path for vocal cardiovascular health. Place perches at opposite ends." },
  budgie: { name: "Budgerigar / Parakeet", singleMin: "18\" W × 18\" D × 24\" H", singleDimensions: { w: 18, d: 18, h: 24 }, barSpacing: "1/2\" (Max 1.27 cm)", barOrientation: "Horizontal bars for climbing", minPerchCount: 3, outOfCageMinHours: 2, note: "Bar spacing over 1/2\" allows budgies to get their head stuck. Needs multiple natural wood branch perches." },
  lovebird: { name: "Lovebird (Single / Pair)", singleMin: "24\" W × 24\" D × 24\" H", singleDimensions: { w: 24, d: 24, h: 24 }, barSpacing: "1/2\" (Max 1.27 cm)", barOrientation: "Horizontal bars", minPerchCount: 3, outOfCageMinHours: 3, note: "Very energetic and acrobatic chewers. Requires non-toxic powder-coated metal and destructible toys." },
  cockatiel: { name: "Cockatiel", singleMin: "24\" W × 24\" D × 30\" H", singleDimensions: { w: 24, d: 24, h: 30 }, barSpacing: "1/2\" to 5/8\" (1.27–1.6 cm)", barOrientation: "Horizontal bars on at least 2 sides", minPerchCount: 4, outOfCageMinHours: 3, note: "Long tail feathers require ample vertical and turning clearance. Width is paramount to prevent wing-banging." },
  conure: { name: "Green Cheek / Sun Conure", singleMin: "30\" W × 24\" D × 36\" H", singleDimensions: { w: 30, d: 24, h: 36 }, barSpacing: "1/2\" to 3/4\" (1.27–1.9 cm)", barOrientation: "Horizontal bars with escape-proof latches", minPerchCount: 4, outOfCageMinHours: 4, note: "High intelligence and climbing drive. Sun and Jenday conures need heavy-duty latches as they easily unlock standard doors." },
  "african-grey": { name: "African Grey / Amazon Parrot", singleMin: "36\" W × 28\" D × 48\" H", singleDimensions: { w: 36, d: 28, h: 48 }, barSpacing: "3/4\" to 1\" (1.9–2.54 cm)", barOrientation: "Wrought iron or stainless steel", minPerchCount: 5, outOfCageMinHours: 4, note: "Exceptional cognitive demands; cage must accommodate large foraging stations and varied perch diameters (1\"–1.5\")." },
  cockatoo: { name: "Cockatoo (Umbrella / Moluccan)", singleMin: "40\" W × 32\" D × 54\" H", singleDimensions: { w: 40, d: 32, h: 54 }, barSpacing: "1\" to 1.25\" (2.54–3.18 cm)", barOrientation: "Heavy-gauge wrought iron / stainless", minPerchCount: 5, outOfCageMinHours: 5, note: "Extreme beak strength requires minimum 4mm wire thickness with keylock doors. Susceptible to feather plucking in small spaces." },
  macaw: { name: "Large Macaw (Blue & Gold / Scarlet)", singleMin: "48\" W × 36\" D × 66\" H", singleDimensions: { w: 48, d: 36, h: 66 }, barSpacing: "1\" to 1.5\" (2.54–3.8 cm)", barOrientation: "Heavy-duty 5mm stainless steel", minPerchCount: 5, outOfCageMinHours: 5, note: "Wingspan exceeds 3.5 feet. The cage is only a night sleeping retreat; requires daily free-flight aviary or bird-proofed room." },
};

export function BirdCageSize() {
  const [sp, setSp] = useState("cockatiel");
  const [count, setCount] = useState(1);
  const d = BIRD_CAGES[sp] || BIRD_CAGES.cockatiel;
  const multiplier = count === 1 ? 1 : count === 2 ? 1.6 : 1 + (count - 1) * 0.55;
  const scaledW = Math.round(d.singleDimensions.w * Math.sqrt(multiplier));
  const scaledD = Math.round(d.singleDimensions.d * Math.sqrt(multiplier));
  const scaledH = Math.round(d.singleDimensions.h * (count > 1 ? 1.15 : 1));
  const totalVolumeCuFt = ((scaledW * scaledD * scaledH) / 1728).toFixed(1);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Bird Species</Label>
            <Select value={sp} onValueChange={setSp}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(BIRD_CAGES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Number of Birds in Enclosure</Label>
            <Input type="number" min={1} max={12} value={count} onChange={(e) => setCount(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${scaledW}" W × ${scaledD}" D × ${scaledH}" H`} label={`Minimum enclosure dimensions (${count} ${count > 1 ? "birds" : "bird"})`} unit={`≈ ${totalVolumeCuFt} cu ft`} />
          <Rows items={[
            { label: "Max Safe Bar Spacing", value: d.barSpacing },
            { label: "Bar Orientation", value: d.barOrientation },
            { label: "Recommended Perches", value: `${Math.round(d.minPerchCount * (count > 1 ? 1.4 : 1))} varied natural branches` },
            { label: "Daily Out-of-Cage Flight", value: `${d.outOfCageMinHours}+ hours daily` },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Ethological Note:</strong> {d.note}</p>
            <p className="text-destructive font-medium">⚠️ Warning: Never use round cages (lacks corner orientation landmarks causing psychological stress) or zinc/lead galvanized coatings.</p>
          </div>
        </div>
      }
    />
  );
}

interface BirdDietProfile {
  name: string;
  avgWeightGrams: number;
  pelletRatio: number;
  freshRatio: number;
  fruitRatio: number;
  seedNutRatio: number;
  specialDietNote?: string;
}

const BIRD_DIETS: Record<string, BirdDietProfile> = {
  finch: { name: "Finch / Canary (15–20g)", avgWeightGrams: 18, pelletRatio: 0.40, freshRatio: 0.35, fruitRatio: 0.05, seedNutRatio: 0.20, specialDietNote: "Grass seeds, sprouted seed mix, egg food during molting, and finely chopped dark greens." },
  budgie: { name: "Budgerigar (30–40g)", avgWeightGrams: 35, pelletRatio: 0.60, freshRatio: 0.25, fruitRatio: 0.05, seedNutRatio: 0.10, specialDietNote: "Prone to fatty liver and iodine deficiency; convert to high-potency micro-pellets with fresh leafy greens." },
  lovebird: { name: "Lovebird (45–60g)", avgWeightGrams: 50, pelletRatio: 0.65, freshRatio: 0.25, fruitRatio: 0.05, seedNutRatio: 0.05, specialDietNote: "Active foragers; feed chopped broccoli florets, carrots, sprouted lentils, and low-fat pellets." },
  cockatiel: { name: "Cockatiel (80–110g)", avgWeightGrams: 95, pelletRatio: 0.60, freshRatio: 0.25, fruitRatio: 0.05, seedNutRatio: 0.10, specialDietNote: "Seed addiction causes renal and hepatic disease; transition slowly to 60% pellets and fresh orange/green vegetables." },
  conure: { name: "Conure (Green Cheek / Sun) (70–130g)", avgWeightGrams: 100, pelletRatio: 0.65, freshRatio: 0.25, fruitRatio: 0.05, seedNutRatio: 0.05, specialDietNote: "Loves textured whole foods; steam squash, sweet potato cubes, bell peppers, and chili peppers." },
  "african-grey": { name: "African Grey (350–500g)", avgWeightGrams: 420, pelletRatio: 0.70, freshRatio: 0.20, fruitRatio: 0.05, seedNutRatio: 0.05, specialDietNote: "Extreme vulnerability to hypocalcemia; requires bioavailable calcium (kale, collards) and raw red palm fruit oil." },
  amazon: { name: "Amazon Parrot (300–500g)", avgWeightGrams: 400, pelletRatio: 0.70, freshRatio: 0.22, fruitRatio: 0.05, seedNutRatio: 0.03, specialDietNote: "Extremely prone to obesity and atherosclerosis; strictly cap seeds and fatty nuts under 3%." },
  eclectus: { name: "Eclectus Parrot (380–500g)", avgWeightGrams: 430, pelletRatio: 0.15, freshRatio: 0.60, fruitRatio: 0.20, seedNutRatio: 0.05, specialDietNote: "UNIQUE DIGESTION: Long digestive tract. Synthetic fortified pellets cause toe-tapping/wing-flipping! Diet must be 75%+ fresh raw produce & sprouts." },
  cockatoo: { name: "Cockatoo (400–800g)", avgWeightGrams: 550, pelletRatio: 0.70, freshRatio: 0.22, fruitRatio: 0.05, seedNutRatio: 0.03, specialDietNote: "High risk of lipomas (fat tumors); emphasize cruciferous vegetables and foraging toys." },
  macaw: { name: "Large Macaw (900–1400g)", avgWeightGrams: 1100, pelletRatio: 0.60, freshRatio: 0.20, fruitRatio: 0.05, seedNutRatio: 0.15, specialDietNote: "Naturally high-fat requirement; needs 2–3 raw, human-grade in-shell walnuts, Brazil nuts, or macadamia nuts daily." },
};

export function BirdFood() {
  const [sp, setSp] = useState("cockatiel");
  const [activity, setActivity] = useState<"standard" | "breeding" | "flighted">("standard");
  const d = BIRD_DIETS[sp] || BIRD_DIETS.cockatiel;
  const intakeFactor = activity === "breeding" ? 0.14 : activity === "flighted" ? 0.12 : 0.10;
  const totalGrams = Math.round(d.avgWeightGrams * intakeFactor);
  const pelletGrams = Math.max(1, Math.round(totalGrams * d.pelletRatio));
  const freshGrams = Math.max(1, Math.round(totalGrams * d.freshRatio));
  const fruitGrams = Math.max(0.5, Math.round(totalGrams * d.fruitRatio));
  const seedNutGrams = Math.max(0.5, Math.round(totalGrams * d.seedNutRatio));

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Bird Species</Label>
            <Select value={sp} onValueChange={setSp}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(BIRD_DIETS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Life Stage & Energy Expenditure</Label>
            <Select value={activity} onValueChange={(v) => setActivity(v as typeof activity)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Companion Bird (Standard In-Cage & Modest Roam)</SelectItem>
                <SelectItem value="flighted">Active Flighted / Aviary Bird (+20% Calories)</SelectItem>
                <SelectItem value="breeding">Molting / Breeding Bird (+40% Protein & Energy)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${totalGrams} g`} label="Total Daily Dietary Target" unit={`≈ ${(totalGrams / 28.35).toFixed(1)} oz / day`} />
          <Rows items={[
            { label: "High-Quality Pellets", value: `${pelletGrams} g (${Math.round(d.pelletRatio * 100)}%)` },
            { label: "Fresh Dark Leafy Greens & Veggies", value: `${freshGrams} g (${Math.round(d.freshRatio * 100)}%)` },
            { label: "Low-Sugar Fruits / Berries", value: `${fruitGrams} g (${Math.round(d.fruitRatio * 100)}%)` },
            { label: "Healthy Seeds / In-Shell Nuts", value: `${seedNutGrams} g (${Math.round(d.seedNutRatio * 100)}%)` },
          ]} />
          {d.specialDietNote && (
            <div className="rounded-lg bg-primary/10 p-3 text-xs text-primary font-medium">
              💡 {d.specialDietNote}
            </div>
          )}
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            <strong>❌ Strictly Lethal Toxic Foods:</strong> Avocado (*persin* poison), Chocolate (*theobromine*), Caffeine, Alcohol, Apple seeds/Fruit pits (cyanide), Onions/Garlic, and Salty junk food.
          </div>
        </div>
      }
    />
  );
}

interface BirdLifespanProfile {
  name: string;
  wildLifespan: string;
  captiveMedian: number;
  captiveMax: number;
  ownerEstatePlanning: boolean;
  healthScreenings: string;
}

const BIRD_LIFE_PROFILES: Record<string, BirdLifespanProfile> = {
  finch: { name: "Zebra / Society Finch", wildLifespan: "2–4 years", captiveMedian: 7, captiveMax: 12, ownerEstatePlanning: false, healthScreenings: "Annual wellness check, air sac mite screening, egg-binding emergency plan." },
  canary: { name: "Canary", wildLifespan: "5–8 years", captiveMedian: 10, captiveMax: 15, ownerEstatePlanning: false, healthScreenings: "Tracheal mite surveillance, avian pox check, nail trimming, vocal health tracking." },
  budgie: { name: "Budgerigar (English vs American)", wildLifespan: "3–6 years", captiveMedian: 8, captiveMax: 15, ownerEstatePlanning: false, healthScreenings: "Tumor palpation (renal/gonadal), thyroid check (iodine status), avian gastric yeast (AGY)." },
  lovebird: { name: "Lovebird", wildLifespan: "8–10 years", captiveMedian: 15, captiveMax: 20, ownerEstatePlanning: false, healthScreenings: "Circovirus (PBFD) DNA test, liver function profile, beak occlusion check." },
  cockatiel: { name: "Cockatiel", wildLifespan: "8–12 years", captiveMedian: 18, captiveMax: 28, ownerEstatePlanning: false, healthScreenings: "Hepatic lipidosis lipid panel, heavy metal blood screening (zinc/lead), chronic egg-laying prevention." },
  conure: { name: "Green Cheek / Sun Conure", wildLifespan: "10–15 years", captiveMedian: 22, captiveMax: 32, ownerEstatePlanning: true, healthScreenings: "Annual avian biochemistry, polyomavirus check, Bornavirus (PDD) surveillance." },
  "african-grey": { name: "African Grey Parrot (Congo / Timneh)", wildLifespan: "20–30 years", captiveMedian: 45, captiveMax: 65, ownerEstatePlanning: true, healthScreenings: "Ionized serum calcium monitoring, aspergillosis fungal titer, cardiac echocardiogram at age 25+." },
  amazon: { name: "Amazon Parrot (Yellow-Naped, Blue-Fronted)", wildLifespan: "25–35 years", captiveMedian: 50, captiveMax: 70, ownerEstatePlanning: true, healthScreenings: "Atherosclerosis cardiovascular exam, hepatic ultrasound, diet-induced obesity screening." },
  cockatoo: { name: "Cockatoo (Umbrella, Moluccan, Sulphur)", wildLifespan: "25–40 years", captiveMedian: 55, captiveMax: 75, ownerEstatePlanning: true, healthScreenings: "Zinc toxicity screening, behavioral psychogenic feather destructive screening, respiratory exam." },
  macaw: { name: "Large Macaw (Hyacinth, Scarlet, Green-Wing)", wildLifespan: "30–50 years", captiveMedian: 60, captiveMax: 85, ownerEstatePlanning: true, healthScreenings: "Annual blood chemistry, proventricular dilatation disease (PDD), osteoarthritis evaluation." },
};

export function BirdLifespan() {
  const [sp, setSp] = useState("cockatiel");
  const [careTier, setCareTier] = useState<"standard" | "optimal">("optimal");
  const d = BIRD_LIFE_PROFILES[sp] || BIRD_LIFE_PROFILES.cockatiel;
  const projectedYears = careTier === "optimal" 
    ? `${d.captiveMedian}–${d.captiveMax}`
    : `${Math.round(d.captiveMedian * 0.65)}–${d.captiveMedian}`;

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Bird Species</Label>
            <Select value={sp} onValueChange={setSp}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(BIRD_LIFE_PROFILES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Husbandry Quality & Preventive Care Tier</Label>
            <Select value={careTier} onValueChange={(v) => setCareTier(v as typeof careTier)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="optimal">Optimal Tier (70% Pellets, Daily Flight, Full UVB, Annual Avian Vet)</SelectItem>
                <SelectItem value="standard">Suboptimal Standard (High Seed Diet, Moderate Roam, Basic Care)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={projectedYears} label="Projected Captive Lifespan" unit="years" />
          <Rows items={[
            { label: "Wild Natural Lifespan", value: d.wildLifespan },
            { label: "Record Verified Captive Age", value: `${d.captiveMax}+ years` },
            { label: "Key Veterinary Focus", value: d.healthScreenings },
          ]} />
          {d.ownerEstatePlanning && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
              <strong>📜 Lifetime Guardianship Notice:</strong> This parrot species routinely lives 40–70+ years and frequently outlives its first human caregiver. Avian welfare organizations strongly recommend creating an official Pet Trust or legal estate succession plan.
            </div>
          )}
        </div>
      }
    />
  );
}

export function BirdWingClipGuide() {
  const [style, setStyle] = useState<"none" | "conservative" | "aggressive">("none");
  const advice: Record<string, { title: string; lines: string[]; status: "safe" | "warning" | "danger" }> = {
    none: {
      title: "Full Flighted (Veterinary Recommended)",
      status: "safe",
      lines: [
        "Cardiovascular Health: Flying uses 10–20× more energy than walking, preventing fatal avian atherosclerosis and fatty liver.",
        "Psychological Confidence: Flighted birds exhibit significantly lower rates of chronic scream-calling, phobias, and feather self-mutilation.",
        "Home Safety Mandate: All ceiling fans MUST be turned OFF, windows covered with decals or blinds, open cookware covered, and doors closed.",
      ],
    },
    conservative: {
      title: "Conservative Micro-Clip (Glide Preserved)",
      status: "warning",
      lines: [
        "Trim only the outer 4 to 6 primary flight feathers on BOTH wings symmetrically.",
        "Allows the bird to glide safely to the floor at a 45° angle; prevents upward lift while eliminating crash landing fractures.",
        "NEVER trim secondary flight feathers (inner wing) or covert protective feathers.",
      ],
    },
    aggressive: {
      title: "Severe / Single-Wing Clip (Strictly Prohibited)",
      status: "danger",
      lines: [
        "Severe Danger: Cutting too short causes the bird to drop like a rock, shattering the keel bone (sternum) and splitting the skin.",
        "Single-Wing Asymmetry: Clipping one wing causes catastrophic corkscrew spins into walls and floors.",
        "Blood Feather Lethality: Trimming dark, active growing blood feathers causes profuse hemorrhaging.",
      ],
    },
  };

  const cur = advice[style];

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Flight Management Strategy</Label>
            <Select value={style} onValueChange={(v) => setStyle(v as typeof style)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Full Flight (Flighted with Bird-Proofing)</SelectItem>
                <SelectItem value="conservative">Conservative Symmetrical Micro-Clip</SelectItem>
                <SelectItem value="aggressive">Severe Heavy / Asymmetrical Clip (Hazard Alert)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={cur.title} label="Flight Management Assessment" />
          <Bullets lines={cur.lines} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>First-Time Protocol:</strong> Never attempt wing clipping without prior in-person instruction from an avian veterinarian. Always have styptic powder or cornstarch ready in case a growing blood feather is accidentally nicked.</p>
          </div>
        </div>
      }
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

/* ─────────── SMALL PETS (ADVANCED CALCULATORS) ─────────── */
export function RabbitHay() {
  const [weight, setWeight] = useState(5);
  const [unit, setUnit] = useState<"lb" | "kg">("lb");
  const [hayType, setHayType] = useState<"timothy2" | "timothy1" | "orchard" | "meadow" | "alfalfa">("timothy2");

  const weightKg = unit === "lb" ? weight * 0.453592 : weight;
  const weightLb = unit === "kg" ? weight * 2.20462 : weight;
  // Rabbits consume their own body volume in loose hay daily (approx 30–35g per lb of body weight)
  const dailyGrams = Math.round(weightLb * 32);
  const weeklyKg = ((dailyGrams * 7) / 1000).toFixed(2);
  const monthlyLbs = ((dailyGrams * 30) / 453.592).toFixed(1);
  const estimatedCost = (Number(monthlyLbs) * 2.2).toFixed(2); // ~$2.20/lb typical store/bulk mix

  const hayNotes = {
    timothy2: "2nd Cut Timothy: Gold standard balance of rough fiber (32%), moderate protein, and soft green leaves.",
    timothy1: "1st Cut Timothy: Coarser, ultra-high fiber; optimal for wearing down rapid-growing dental molars.",
    orchard: "Orchard Grass: Softer and sweeter; ideal for allergy-sensitive owners and picky rabbits.",
    meadow: "Meadow Grass: Diverse floral blend; stimulates natural foraging behavior.",
    alfalfa: "Alfalfa Hay: High calcium/protein legume hay; for young bunnies (<6 months) or nursing does ONLY.",
  }[hayType];

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Unit</Label>
              <Select value={unit} onValueChange={(v: "lb" | "kg") => setUnit(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lb">Pounds (lb)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rabbit weight ({unit})</Label>
              <Input
                type="number"
                step="0.1"
                min="0.5"
                value={weight}
                onChange={(e) => setWeight(+e.target.value || 0)}
                className="mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label>Hay variety</Label>
            <Select value={hayType} onValueChange={(v: typeof hayType) => setHayType(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="timothy2">2nd Cut Timothy (Recommended Standard)</SelectItem>
                <SelectItem value="timothy1">1st Cut Timothy (Maximum Dental Wear)</SelectItem>
                <SelectItem value="orchard">Orchard Grass (Soft / Allergy-Friendly)</SelectItem>
                <SelectItem value="meadow">Meadow Hay (Herbal Forage Blend)</SelectItem>
                <SelectItem value="alfalfa">Alfalfa Legume (Bunnies &lt; 6 Months ONLY)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${dailyGrams} g/day`} label="Daily hay requirement" unit="≈ body volume in loose hay" />
          <Rows
            items={[
              { label: "Weekly consumption", value: `≈ ${weeklyKg} kg (${((dailyGrams * 7) / 453.592).toFixed(1)} lbs)` },
              { label: "Monthly supply needed", value: `≈ ${monthlyLbs} lbs / 30 days` },
              { label: "Est. monthly cost", value: `~$${estimatedCost}` },
              { label: "Diet percentage", value: "80%–85% of total intake" },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            {hayNotes}
          </p>
        </div>
      }
    />
  );
}

export function RabbitCageSize() {
  const [count, setCount] = useState(1);
  const [breedSize, setBreedSize] = useState<"dwarf" | "standard" | "large" | "giant">("standard");
  const [housing, setHousing] = useState<"pen" | "free-roam" | "hutch-run">("pen");

  const minBaseSqFt = { dwarf: 12, standard: 16, large: 20, giant: 30 }[breedSize];
  const penArea = minBaseSqFt + (count - 1) * (minBaseSqFt * 0.75);
  const runArea = penArea * 3;
  const heightInches = breedSize === "giant" ? 42 : 36;
  const litterBoxes = count + 1;

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Number of rabbits</Label>
              <Input
                type="number"
                min={1}
                max={6}
                value={count}
                onChange={(e) => setCount(+e.target.value || 1)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Breed size category</Label>
              <Select value={breedSize} onValueChange={(v: typeof breedSize) => setBreedSize(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dwarf">Dwarf (&lt; 4 lbs / 1.8 kg)</SelectItem>
                  <SelectItem value="standard">Standard (4–8 lbs / 1.8–3.6 kg)</SelectItem>
                  <SelectItem value="large">Large (8–12 lbs / 3.6–5.4 kg)</SelectItem>
                  <SelectItem value="giant">Giant (12–18+ lbs / Flemish)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Housing setup style</Label>
            <Select value={housing} onValueChange={(v: typeof housing) => setHousing(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pen">Indoor Exercise Pen (x-pen / C&C)</SelectItem>
                <SelectItem value="free-roam">Free-Roam with Bunny Basecamp</SelectItem>
                <SelectItem value="hutch-run">Outdoor Predator-Proof Hutch + Run</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${Math.round(penArea)} sq ft`} label="Minimum base enclosure" unit={`≈ ${(penArea * 0.0929).toFixed(1)} m²`} />
          <Rows
            items={[
              { label: "Minimum vertical clearance", value: `${heightInches} inches (prevents escapes)` },
              { label: "Attached exercise run", value: `${Math.round(runArea)} sq ft (${(runArea * 0.0929).toFixed(1)} m²)` },
              { label: "Litter boxes needed", value: `${litterBoxes} boxes (N+1 rule)` },
              { label: "Daily out-of-pen exercise", value: "4+ hours minimum" },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            Commercial wire cages sold in pet stores are too small for humane rabbit housing. Rabbits must be able to complete at least 3 consecutive hops and stretch fully upright on their hind legs without touching the ceiling.
          </p>
        </div>
      }
    />
  );
}

export function RabbitFood() {
  const [weight, setWeight] = useState(5);
  const [unit, setUnit] = useState<"lb" | "kg">("lb");
  const [stage, setStage] = useState<"young" | "adult" | "senior">("adult");
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain">("maintain");

  const weightLb = unit === "kg" ? weight * 2.20462 : weight;
  // Plain grass-based pellets: 1/8 to 1/4 cup per 5 lbs body weight for adults
  const basePelletsTbsp =
    stage === "young"
      ? Math.round(weightLb * 3.5) // young rabbits get more
      : stage === "senior"
      ? Math.round(weightLb * 1.8)
      : Math.round(weightLb * 1.5);

  const goalMultiplier = goal === "lose" ? 0.75 : goal === "gain" ? 1.25 : 1.0;
  const finalTbsp = Math.max(1, Math.round(basePelletsTbsp * goalMultiplier));
  const pelletCups = (finalTbsp / 16).toFixed(2);
  const pelletGrams = Math.round(finalTbsp * 10);
  const dailyGreensCups = Math.max(1, Math.round(weightLb * 0.5)); // 1 cup per 2 lbs body weight

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Unit</Label>
              <Select value={unit} onValueChange={(v: "lb" | "kg") => setUnit(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lb">Pounds (lb)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rabbit weight ({unit})</Label>
              <Input
                type="number"
                step="0.1"
                min="0.5"
                value={weight}
                onChange={(e) => setWeight(+e.target.value || 0)}
                className="mt-1.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Life stage</Label>
              <Select value={stage} onValueChange={(v: typeof stage) => setStage(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="young">Baby / Junior (&lt; 6 months)</SelectItem>
                  <SelectItem value="adult">Adult (6 months – 5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Weight goal</Label>
              <Select value={goal} onValueChange={(v: typeof goal) => setGoal(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintain">Maintain ideal weight</SelectItem>
                  <SelectItem value="lose">Weight reduction (slimming)</SelectItem>
                  <SelectItem value="gain">Weight gain / recovery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${pelletGrams} g/day`} label="Daily measured pellets" unit={`≈ ${pelletCups} cup (${finalTbsp} tbsp)`} />
          <Rows
            items={[
              { label: "Fresh dark leafy greens", value: `${dailyGreensCups} cups packed (Romaine, Cilantro, Parsley)` },
              { label: "Grass hay (Timothy/Orchard)", value: "Unlimited (80%–85% of total diet)" },
              { label: "Pellet fiber requirement", value: "Minimum >22% crude fiber" },
              { label: "Treat allowance (fruit/carrot)", value: "Max 1 tsp / 2 lbs body weight (occasional)" },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            Never feed seed/muesli mixes with corn or colorful bits. High starch causes deadly cecal dysbiosis and GI stasis.
          </p>
        </div>
      }
    />
  );
}

export function RabbitAge() {
  const [years, setYears] = useState(3);
  const [months, setMonths] = useState(0);
  const [breedSize, setBreedSize] = useState<"dwarf" | "standard" | "giant">("standard");

  const totalYears = years + months / 12;
  // Modern veterinary epigenetic age conversion for lagomorphs:
  // Year 1 ≈ 21 human yrs, Year 2 ≈ 27, then +6/yr for standard, +5/yr for dwarf, +8/yr for giants
  const ratePerYear = breedSize === "dwarf" ? 5 : breedSize === "giant" ? 8 : 6;
  const humanAge =
    totalYears <= 0.5
      ? Math.round(totalYears * 24)
      : totalYears <= 1
      ? Math.round(12 + totalYears * 9)
      : totalYears <= 2
      ? Math.round(21 + (totalYears - 1) * 6)
      : Math.round(27 + (totalYears - 2) * ratePerYear);

  const stage =
    totalYears < 0.5
      ? "Baby / Kit (Rapid Growth)"
      : totalYears < 1
      ? "Junior / Adolescent"
      : totalYears < 5
      ? "Prime Adult"
      : totalYears < 8
      ? "Senior Rabbit"
      : "Geriatric Rabbit";

  const screeningAdvice =
    totalYears >= 5
      ? "Twice-yearly geriatric wellness check, dental spur endoscopy, arthritis mobility scoring, and baseline bloodwork (BUN/Creatinine for renal health)."
      : "Annual veterinarian wellness check, molar occlusion check, spay/neuter verification, and weight tracking.";

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Age (years)</Label>
              <Input
                type="number"
                min={0}
                max={20}
                value={years}
                onChange={(e) => setYears(+e.target.value || 0)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Months</Label>
              <Input
                type="number"
                min={0}
                max={11}
                value={months}
                onChange={(e) => setMonths(+e.target.value || 0)}
                className="mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label>Breed size</Label>
            <Select value={breedSize} onValueChange={(v: typeof breedSize) => setBreedSize(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dwarf">Dwarf / Small (Lifespan: 10–14 yrs)</SelectItem>
                <SelectItem value="standard">Medium / Standard (Lifespan: 8–12 yrs)</SelectItem>
                <SelectItem value="giant">Giant Breed (Lifespan: 5–8 yrs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`≈ ${humanAge} human years`} label="Biological age equivalent" unit={stage} />
          <Rows
            items={[
              { label: "Life stage classification", value: stage },
              { label: "Expected lifespan range", value: breedSize === "dwarf" ? "10–14 years" : breedSize === "giant" ? "5–8 years" : "8–12 years" },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            <strong>Veterinary Care Benchmark:</strong> {screeningAdvice}
          </p>
        </div>
      }
    />
  );
}

export function HamsterCageSize() {
  const [species, setSpecies] = useState<"syrian_female" | "syrian_male" | "dwarf" | "robo" | "chinese">("syrian_female");

  const specs = {
    syrian_female: {
      minSqIn: 800,
      recSqIn: 1000,
      minBedding: 10,
      recBedding: 12,
      note: "Female Syrian hamsters are exceptionally active during estrus (every 4 days) and require at least 1,000 sq in of unbroken floor space to prevent bar-chewing and escape stress.",
    },
    syrian_male: {
      minSqIn: 600,
      recSqIn: 800,
      minBedding: 8,
      recBedding: 10,
      note: "Male Syrian hamsters thrive with at least 800 sq in of continuous floor space and deep burrowing zones.",
    },
    dwarf: {
      minSqIn: 500,
      recSqIn: 700,
      minBedding: 6,
      recBedding: 8,
      note: "Campbell and Winter White dwarf hamsters require wide floor plans with multi-chamber hides and a large sand bath.",
    },
    robo: {
      minSqIn: 500,
      recSqIn: 750,
      minBedding: 6,
      recBedding: 8,
      note: "Roborovski hamsters are hyper-energetic runners requiring large sand-bath areas (taking up to 1/3 of the enclosure).",
    },
    chinese: {
      minSqIn: 500,
      recSqIn: 700,
      minBedding: 6,
      recBedding: 8,
      note: "Chinese hamsters possess prehensile tails and enjoy deep bedding paired with low climbing branches.",
    },
  }[species];

  const minSqCm = Math.round(specs.minSqIn * 6.4516);
  const recSqCm = Math.round(specs.recSqIn * 6.4516);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Hamster species & gender</Label>
            <Select value={species} onValueChange={(v: typeof species) => setSpecies(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="syrian_female">Female Syrian Hamster (Highest Space Need)</SelectItem>
                <SelectItem value="syrian_male">Male Syrian Hamster</SelectItem>
                <SelectItem value="dwarf">Dwarf Hamster (Campbell / Winter White)</SelectItem>
                <SelectItem value="robo">Roborovski Dwarf Hamster</SelectItem>
                <SelectItem value="chinese">Chinese Hamster</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${specs.recSqIn} sq in`} label="Recommended unbroken floor space" unit={`≈ ${recSqCm} cm² (${specs.minSqIn} sq in absolute min)`} />
          <Rows
            items={[
              { label: "Minimum unbroken area", value: `${specs.minSqIn} sq in (${minSqCm} cm²)` },
              { label: "Recommended bedding depth", value: `${specs.recBedding} inches (${Math.round(specs.recBedding * 2.54)} cm) for burrows` },
              { label: "Minimum bedding depth", value: `${specs.minBedding} inches (${Math.round(specs.minBedding * 2.54)} cm)` },
              { label: "Enclosure type", value: "Glass Tank (40–75 gal breeder) / DIY Wood Terrarium" },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            {specs.note} Connecting multiple tiny cages with plastic modular tubes does NOT count toward unbroken floor space.
          </p>
        </div>
      }
    />
  );
}

export function HamsterFood() {
  const [species, setSpecies] = useState<"syrian" | "dwarf" | "robo">("syrian");
  const [weightGrams, setWeightGrams] = useState(140);
  const [feedMethod, setFeedMethod] = useState<"scatter" | "bowl">("scatter");

  const gramsDaily = species === "syrian" ? Math.max(10, Math.round(weightGrams * 0.08)) : Math.max(5, Math.round(weightGrams * 0.12));
  const proteinTarget = species === "dwarf" ? "19%–22% (high protein, low sugar)" : "17%–19% crude protein";
  const mealwormsWeekly = species === "syrian" ? "3–5 dried mealworms" : "2–3 dried mealworms / crickets";

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Species</Label>
              <Select value={species} onValueChange={(v: typeof species) => setSpecies(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="syrian">Syrian Hamster</SelectItem>
                  <SelectItem value="dwarf">Dwarf (Campbell/Winter White)</SelectItem>
                  <SelectItem value="robo">Roborovski Hamster</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Body weight (grams)</Label>
              <Input
                type="number"
                min={20}
                max={250}
                value={weightGrams}
                onChange={(e) => setWeightGrams(+e.target.value || 0)}
                className="mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label>Feeding method</Label>
            <Select value={feedMethod} onValueChange={(v: typeof feedMethod) => setFeedMethod(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="scatter">Scatter Feeding in Bedding (Best Enrichment)</SelectItem>
                <SelectItem value="bowl">Food Bowl Feeding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${gramsDaily} g/day`} label="Daily seed & pellet mix" unit={`≈ 1–2 tablespoons`} />
          <Rows
            items={[
              { label: "Target crude protein", value: proteinTarget },
              { label: "Target crude fat", value: "5%–7% (avoid excessive sunflower/peanuts)" },
              { label: "Animal protein supplement", value: mealwormsWeekly },
              { label: "Fresh safe vegetables", value: "1 tsp 2–3× weekly (Broccoli, Cucumber, Zucchini)" },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            {feedMethod === "scatter"
              ? "Scatter feeding across deep bedding encourages natural foraging and prevents boredom bar-biting."
              : "Food bowls allow hamsters to empty food into cheek pouches and hoard it in one burrow, reducing mental stimulation."}
          </p>
        </div>
      }
    />
  );
}

export function GuineaPigVitaminC() {
  const [weight, setWeight] = useState(1000);
  const [status, setStatus] = useState<"adult" | "growing" | "pregnant" | "scurvy">("adult");

  const baseMg = {
    adult: 25,
    growing: 35,
    pregnant: 45,
    scurvy: 80,
  }[status];

  const weightFactor = weight / 1000;
  const targetMg = Math.round(baseMg * Math.max(0.7, Math.min(1.4, weightFactor)));

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Weight (grams)</Label>
              <Input
                type="number"
                min={300}
                max={1800}
                value={weight}
                onChange={(e) => setWeight(+e.target.value || 0)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Health status</Label>
              <Select value={status} onValueChange={(v: typeof status) => setStatus(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Healthy Adult (Maintenance)</SelectItem>
                  <SelectItem value="growing">Growing Pup (&lt; 6 months)</SelectItem>
                  <SelectItem value="pregnant">Pregnant / Lactating Sow</SelectItem>
                  <SelectItem value="scurvy">Illness / Scurvy Recovery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${targetMg} mg/day`} label="Required active Vitamin C" unit="essential daily intake" />
          <Rows
            items={[
              { label: "Yellow / Red Bell Pepper", value: `≈ ${Math.max(1, Math.round(targetMg / 30))} medium slice(s) (190 mg / 100g)` },
              { label: "Fresh Cilantro (Coriander)", value: "1 small handful (27 mg / 100g)" },
              { label: "Stabilized Pellets", value: "1/8 cup daily (Oxbow Essentials)" },
              { label: "Direct Oral Supplement", value: status === "scurvy" ? "Oxbow Vitamin C tablet directly" : "Optional fallback" },
            ]}
          />
          <p className="text-xs text-amber-800 dark:text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
            <strong>Never put liquid Vitamin C in drinking water bottles:</strong> Vitamin C degrades rapidly in light and air within 8 hours, and alters water taste, leading to fatal guinea pig dehydration.
          </p>
        </div>
      }
    />
  );
}

export function HamsterLifespan() {
  const [species, setSpecies] = useState<"syrian" | "dwarf_campbell" | "dwarf_winter" | "robo" | "chinese">("syrian");
  const [origin, setOrigin] = useState<"ethical_breeder" | "pet_store">("ethical_breeder");
  const [careTier, setCareTier] = useState<"optimal" | "standard">("optimal");

  const baseRanges: Record<string, [number, number]> = {
    syrian: [2.0, 3.0],
    dwarf_campbell: [1.5, 2.5],
    dwarf_winter: [1.5, 2.5],
    robo: [3.0, 4.0],
    chinese: [2.0, 3.0],
  };

  const [minBase, maxBase] = baseRanges[species];
  const originBonus = origin === "ethical_breeder" ? 0.4 : 0;
  const careBonus = careTier === "optimal" ? 0.3 : 0;

  const minYears = (minBase + originBonus * 0.5 + careBonus * 0.5).toFixed(1);
  const maxYears = (maxBase + originBonus + careBonus).toFixed(1);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Hamster species</Label>
            <Select value={species} onValueChange={(v: typeof species) => setSpecies(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="syrian">Syrian Hamster (Avg: 2–3 yrs)</SelectItem>
                <SelectItem value="dwarf_campbell">Campbell's Dwarf Hamster (Avg: 1.5–2.5 yrs)</SelectItem>
                <SelectItem value="dwarf_winter">Winter White Dwarf (Avg: 1.5–2.5 yrs)</SelectItem>
                <SelectItem value="robo">Roborovski Hamster (Longest: 3–4 yrs)</SelectItem>
                <SelectItem value="chinese">Chinese Hamster (Avg: 2–3 yrs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Genetics / Origin</Label>
              <Select value={origin} onValueChange={(v: typeof origin) => setOrigin(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethical_breeder">Ethical Lineage Pedigree</SelectItem>
                  <SelectItem value="pet_store">Commercial Retail / Pet Store</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Care environment</Label>
              <Select value={careTier} onValueChange={(v: typeof careTier) => setCareTier(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="optimal">High Enrichment (700+ sq in, 10" deep)</SelectItem>
                  <SelectItem value="standard">Standard Enclosure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${minYears}–${maxYears} years`} label="Estimated lifespan projection" unit={`≈ ${Math.round(Number(minYears) * 12)}–${Math.round(Number(maxYears) * 12)} months`} />
          <Rows
            items={[
              { label: "Prime adulthood", value: "Months 4 – 14" },
              { label: "Senior transition", value: "18+ months (reduced running, deeper sleep)" },
              { label: "Senior care adjustment", value: "Lower water bottles, soft ramps, shallow bedding" },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            Roborovski hamsters naturally live the longest among domestic species. Providing deep burrowing bedding, an appropriately sized solid wheel, and stress-free unbroken space directly extends lifespan.
          </p>
        </div>
      }
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
  const [unit, setUnit] = useState<"lb" | "kg">("lb");
  const [weight, setWeight] = useState(1100);
  const [work, setWork] = useState<"maintenance" | "light" | "moderate" | "heavy" | "lactating">("light");
  const [forageType, setForageType] = useState<"timothy" | "alfalfa" | "pasture">("timothy");

  // NRC Equine Dry Matter Intake (DMI) guidelines
  const weightInLb = unit === "kg" ? weight * 2.20462 : weight;
  const dmiPercent = work === "maintenance" ? 0.018 : work === "light" ? 0.020 : work === "moderate" ? 0.0225 : work === "heavy" ? 0.025 : 0.0275;
  const totalDmiLb = weightInLb * dmiPercent;

  // Minimum forage requirement: 1.5% of body weight minimum
  const minForageLb = Math.max(weightInLb * 0.015, totalDmiLb * (work === "heavy" ? 0.65 : work === "moderate" ? 0.75 : 0.90));
  const concentrateLb = Math.max(0, totalDmiLb - minForageLb);

  const displayForage = unit === "kg" ? (minForageLb / 2.20462).toFixed(1) : minForageLb.toFixed(1);
  const displayConcentrate = unit === "kg" ? (concentrateLb / 2.20462).toFixed(1) : concentrateLb.toFixed(1);
  const flakesApprox = (minForageLb / 5).toFixed(1); // Standard 5 lb hay flake

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="inline-flex rounded-md border p-0.5 text-xs">
              <button type="button" onClick={() => setUnit("lb")} className={`px-2.5 py-1 rounded ${unit === "lb" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>Pounds (lb)</button>
              <button type="button" onClick={() => setUnit("kg")} className={`px-2.5 py-1 rounded ${unit === "kg" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>Kilograms (kg)</button>
            </div>
          </div>
          <div>
            <Label>Horse Body Weight ({unit})</Label>
            <Input type="number" min={200} max={2500} value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" />
          </div>
          <div>
            <Label>Physiological Workload & Status</Label>
            <Select value={work} onValueChange={(v) => setWork(v as typeof work)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Maintenance / Pasture (Idle, Senior)</SelectItem>
                <SelectItem value="light">Light Work (Pleasure riding 1–3 hrs/wk)</SelectItem>
                <SelectItem value="moderate">Moderate Work (Schooling, jumping 3–5 hrs/wk)</SelectItem>
                <SelectItem value="heavy">Heavy Work (Eventing, polo, racing, ranching)</SelectItem>
                <SelectItem value="lactating">Lactating Broodmare (Peak Milk Demand)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Primary Forage Base</Label>
            <Select value={forageType} onValueChange={(v) => setForageType(v as typeof forageType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="timothy">Grass Hay (Timothy, Orchard, Coastal Bermuda)</SelectItem>
                <SelectItem value="alfalfa">Legume Hay (Alfalfa / Lucerne Mix)</SelectItem>
                <SelectItem value="pasture">Managed Lush Pasture Grazing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${displayForage} ${unit}`} label="Daily Forage / Hay Minimum" unit={`≈ ${flakesApprox} standard flakes/day`} />
          <Rows items={[
            { label: "Recommended Concentrate / Grain", value: `${displayConcentrate} ${unit} / day (Split into 2–3 small meals)` },
            { label: "Total Dry Matter Intake Target", value: `${unit === "kg" ? (totalDmiLb / 2.20462).toFixed(1) : totalDmiLb.toFixed(1)} ${unit}/day (${(dmiPercent * 100).toFixed(1)}% BW)` },
            { label: "Equine Digestive Safety Limit", value: "Never feed > 0.5% BW in grain in a single meal" },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Clinical Feeding Rule:</strong> Horses are trickle hindgut fermenters requiring constant fiber flow. Never let a horse go without forage for more than 4 to 6 hours to prevent gastric squamous ulcers (EGUS) and hindgut acidosis.</p>
          </div>
        </div>
      }
    />
  );
}

export function HorseWater() {
  const [unit, setUnit] = useState<"gal" | "liter">("gal");
  const [weightLb, setWeightLb] = useState(1100);
  const [temp, setTemp] = useState<"cool" | "moderate" | "hot">("moderate");
  const [work, setWork] = useState<"idle" | "light" | "heavy">("light");
  const [feedType, setFeedType] = useState<"dry" | "pasture">("dry");

  // Base requirement: approx 5 to 6 liters per 100kg BW (approx 0.05–0.06 gal per lb)
  const baseGal = weightLb * 0.009;
  const tempMultiplier = temp === "hot" ? 1.6 : temp === "cool" ? 0.85 : 1.0;
  const workMultiplier = work === "heavy" ? 1.7 : work === "light" ? 1.2 : 1.0;
  const feedFactor = feedType === "pasture" ? 0.75 : 1.0; // pasture is 80% water

  const totalGal = Math.round(baseGal * tempMultiplier * workMultiplier * feedFactor);
  const totalLiters = Math.round(totalGal * 3.78541);
  const displayVal = unit === "gal" ? `${totalGal} gal` : `${totalLiters} L`;

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="inline-flex rounded-md border p-0.5 text-xs">
              <button type="button" onClick={() => setUnit("gal")} className={`px-2.5 py-1 rounded ${unit === "gal" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>Gallons</button>
              <button type="button" onClick={() => setUnit("liter")} className={`px-2.5 py-1 rounded ${unit === "liter" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>Liters</button>
            </div>
          </div>
          <div>
            <Label>Horse Body Weight (lb)</Label>
            <Input type="number" min={300} max={2500} value={weightLb} onChange={(e) => setWeightLb(+e.target.value || 0)} className="mt-1.5" />
          </div>
          <div>
            <Label>Ambient Temperature & Humidity</Label>
            <Select value={temp} onValueChange={(v) => setTemp(v as typeof temp)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cool">Cool / Winter (&lt; 45°F / 7°C - Water heater needed)</SelectItem>
                <SelectItem value="moderate">Moderate / Spring (45°–75°F / 7°–24°C)</SelectItem>
                <SelectItem value="hot">Hot / Summer (&gt; 85°F / 29°C - High Sweat Loss)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Daily Exercise & Sweat Rate</Label>
            <Select value={work} onValueChange={(v) => setWork(v as typeof work)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="idle">Resting / Pasture (Zero visible sweat)</SelectItem>
                <SelectItem value="light">Light Work (Light neck lather / 1 hr exercise)</SelectItem>
                <SelectItem value="heavy">Heavy Work / Competition (Heavy sweat dripping)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Diet Moisture Base</Label>
            <Select value={feedType} onValueChange={(v) => setFeedType(v as typeof feedType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dry">Dry Forage / Hay (10–12% moisture)</SelectItem>
                <SelectItem value="pasture">Fresh Green Pasture (70–80% moisture)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={displayVal} label="Minimum Daily Water Requirement" unit={unit === "gal" ? `≈ ${totalLiters} L / day` : `≈ ${totalGal} gal / day`} />
          <Rows items={[
            { label: "Bucket Equivalents", value: `≈ ${Math.ceil(totalGal / 5)} standard 5-gallon water buckets` },
            { label: "Winter Temperature Warning", value: "Water must be 45°–65°F (frozen water triggers impaction colic)" },
            { label: "Electrolyte Mandate", value: work === "heavy" || temp === "hot" ? "Add 2 oz balanced sodium/potassium electrolytes" : "Provide free-choice plain white salt block" },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Colic Prevention Rule:</strong> Equine impaction colic spikes during sudden cold snaps when horses refuse ice-cold water. Heated bucket elements or submerged tank heaters are essential in winter.</p>
          </div>
        </div>
      }
    />
  );
}

export function HorseAge() {
  const [years, setYears] = useState(8);
  const [breedType, setBreedType] = useState<"pony" | "light" | "warmblood" | "draft">("light");

  // Non-linear physiological aging curve
  const calculateHumanEquiv = (y: number, b: string) => {
    if (y <= 0) return 0;
    if (y === 1) return 6.5;
    if (y === 2) return 13;
    if (y === 3) return 18;
    if (y === 4) return 21;
    const baseAfter4 = 21;
    const annualFactor = b === "pony" ? 2.2 : b === "draft" ? 3.0 : 2.5;
    return Math.round(baseAfter4 + (y - 4) * annualFactor);
  };

  const humanAge = calculateHumanEquiv(years, breedType);
  const lifeStage = years < 1 ? "Foal (0–12 months)" : years < 3 ? "Youngstock / Yearling" : years < 6 ? "Young Adult / Early Career" : years < 15 ? "Prime Adult Performance" : years < 20 ? "Veteran / Senior" : "Geriatric (Specialist Care Needed)";

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Equine Type & Breed Class</Label>
            <Select value={breedType} onValueChange={(v) => setBreedType(v as typeof breedType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pony">Pony / Miniature (Longevity: 30–40 years)</SelectItem>
                <SelectItem value="light">Light Horse (Quarter Horse, Thoroughbred, Arabian: 25–30 yrs)</SelectItem>
                <SelectItem value="warmblood">Warmblood / Sport Horse (22–26 years)</SelectItem>
                <SelectItem value="draft">Draft Horse (Clydesdale, Percheron: 18–22 years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Horse Chronological Age (Years)</Label>
            <Input type="number" min={0} max={50} value={years} onChange={(e) => setYears(+e.target.value || 0)} className="mt-1.5" />
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`≈ ${humanAge} years`} label="Human Physiological Equivalent Age" unit={lifeStage} />
          <Rows items={[
            { label: "Equine Life Stage Classification", value: lifeStage },
            { label: "Veterinary Dental Routine", value: years >= 15 ? "Bi-annual dental float (hooks, wave mouth, wave wear)" : "Annual oral speculum exam & float" },
            { label: "Endocrine & Metabolic Screening", value: years >= 15 ? "Annual ACTH test for PPID (Cushing's Disease) & Insulin" : "Baseline wellness & fecal egg count (FEC)" },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Senior Care Protocol:</strong> Older horses frequently lose molars (smooth mouth) and suffer reduced fiber digestion. Transition seniors with dental wear to soaked high-fiber beet pulp and complete senior chopped mashes.</p>
          </div>
        </div>
      }
    />
  );
}

export function HorseBCS() {
  const [neck, setNeck] = useState<1 | 3 | 5 | 7 | 9>(5);
  const [withers, setWithers] = useState<1 | 3 | 5 | 7 | 9>(5);
  const [spine, setSpine] = useState<1 | 3 | 5 | 7 | 9>(5);
  const [ribs, setRibs] = useState<1 | 3 | 5 | 7 | 9>(5);
  const [shoulder, setShoulder] = useState<1 | 3 | 5 | 7 | 9>(5);
  const [tailhead, setTailhead] = useState<1 | 3 | 5 | 7 | 9>(5);

  const avgScore = Math.round((neck + withers + spine + ribs + shoulder + tailhead) / 6);
  const classifications: Record<number, { title: string; desc: string; tone: "safe" | "warning" | "danger" }> = {
    1: { title: "BCS 1: Poor / Emaciated", desc: "Extreme bone structure visible; zero fat tissue. Critical veterinary emergency.", tone: "danger" },
    2: { title: "BCS 2: Very Thin", desc: "Vertebrae, ribs, and hip pins prominent; minimal muscle coverage.", tone: "danger" },
    3: { title: "BCS 3: Thin", desc: "Ribs visible; slight fat cover over spine; needs increased digestible calories.", tone: "warning" },
    4: { title: "BCS 4: Moderately Thin", desc: "Ribs faintly discernible; suitable for racehorses in hard training.", tone: "warning" },
    5: { title: "BCS 5: Moderate (Ideal)", desc: "Ribs cannot be seen but easily felt with gentle pressure; level back with no crease.", tone: "safe" },
    6: { title: "BCS 6: Moderately Fleshy", desc: "Fat beginning to deposit over ribs and along withers; acceptable for broodmares.", tone: "safe" },
    7: { title: "BCS 7: Fleshy", desc: "Individual ribs can be felt only with pressure; fat deposits in neck crest and tailhead.", tone: "warning" },
    8: { title: "BCS 8: Fat", desc: "Thick neck crest; positive crease down back; high risk of metabolic laminitis.", tone: "danger" },
    9: { title: "BCS 9: Extremely Obese", desc: "Bulging fat over tailhead, shoulder, and crest; immediate veterinary weight loss required.", tone: "danger" },
  };

  const cur = classifications[avgScore] || classifications[5];

  return (
    <CalculatorLayout
      form={
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Rate each anatomical palpation zone according to the Henneke 1–9 System:</p>
          <div>
            <Label className="text-xs">1. Crest of the Neck</Label>
            <Select value={String(neck)} onValueChange={(v) => setNeck(+v as typeof neck)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Ewe neck / bone visible (BCS 1-2)</SelectItem>
                <SelectItem value="3">Slight fat over crest (BCS 3-4)</SelectItem>
                <SelectItem value="5">Smooth blend into shoulder, no hard crest (BCS 5)</SelectItem>
                <SelectItem value="7">Noticeable firm crest (BCS 6-7)</SelectItem>
                <SelectItem value="9">Heavy bulging 'cresty' neck rolling to side (BCS 8-9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">2. Withers & Shoulder</Label>
            <Select value={String(withers)} onValueChange={(v) => setWithers(+v as typeof withers)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Sharp, hollowed behind shoulder (BCS 1-2)</SelectItem>
                <SelectItem value="5">Rounded withers, smooth shoulder blend (BCS 5)</SelectItem>
                <SelectItem value="9">Bulging fat pads behind shoulder & withers (BCS 8-9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">3. Rib Palpation</Label>
            <Select value={String(ribs)} onValueChange={(v) => setRibs(+v as typeof ribs)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Prominently visible individually (BCS 1-2)</SelectItem>
                <SelectItem value="3">Visible at a distance (BCS 3-4)</SelectItem>
                <SelectItem value="5">Not seen visually, easily felt with light hand sweep (BCS 5)</SelectItem>
                <SelectItem value="7">Felt only with firm pressure (BCS 6-7)</SelectItem>
                <SelectItem value="9">Cannot be palpated under thick fat layer (BCS 8-9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">4. Spine / Loin & Tailhead</Label>
            <Select value={String(spine)} onValueChange={(v) => setSpine(+v as typeof spine)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Sharp ridge spine & prominent tailhead bone (BCS 1-2)</SelectItem>
                <SelectItem value="5">Flat level back with spongy tailhead fat (BCS 5)</SelectItem>
                <SelectItem value="9">Deep gutter crease down spine & bulging tailhead mounds (BCS 8-9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${avgScore} / 9`} label="Henneke Body Condition Score" unit={cur.title} />
          <div className={`rounded-lg p-3 text-xs ${cur.tone === "safe" ? "bg-primary/10 text-primary" : cur.tone === "warning" ? "bg-amber-500/10 text-amber-900 dark:text-amber-200" : "bg-destructive/10 text-destructive"}`}>
            <strong>Assessment:</strong> {cur.desc}
          </div>
          {avgScore >= 7 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
              ⚠️ <strong>Laminitis & EMS Warning:</strong> Horses with BCS ≥ 7 are at severe risk of Equine Metabolic Syndrome (EMS), insulin dysregulation, and pasture laminitis (founder). Restrict non-structural carbohydrates (NSC &lt; 10%) and use a grazing muzzle.
            </div>
          )}
        </div>
      }
    />
  );
}

/* ─────────── FARM ─────────── */
export function ChickenCoopSize() {
  const [count, setCount] = useState(8);
  const [breedType, setBreedType] = useState<"bantam" | "standard" | "heavy">("standard");
  const [confinement, setConfinement] = useState<"free_range" | "run_only">("run_only");

  const specs = {
    bantam: { coopSqFt: 2.5, runSqFt: 6, roostInches: 8, nestRatio: 5 },
    standard: { coopSqFt: 4.0, runSqFt: 10, roostInches: 10, nestRatio: 4 },
    heavy: { coopSqFt: 5.0, runSqFt: 15, roostInches: 12, nestRatio: 4 },
  }[breedType];

  const minCoopSqFt = Math.round(count * specs.coopSqFt);
  const minRunSqFt = confinement === "free_range" ? Math.round(count * (specs.runSqFt * 0.5)) : Math.round(count * specs.runSqFt);
  const roostLengthFeet = (Math.round(count * specs.roostInches) / 12).toFixed(1);
  const nestBoxes = Math.max(1, Math.ceil(count / specs.nestRatio));
  const ventilationSqFt = (minCoopSqFt / 10).toFixed(1); // 1 sq ft per 10 sq ft coop floor

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Number of Laying Hens</Label>
            <Input type="number" min={1} max={500} value={count} onChange={(e) => setCount(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
          <div>
            <Label>Breed Size Class</Label>
            <Select value={breedType} onValueChange={(v) => setBreedType(v as typeof breedType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bantam">Bantam Breeds (Silkie, Pekin, Sebright: ~2–3 lbs)</SelectItem>
                <SelectItem value="standard">Standard Layers (Leghorn, Easter Egger, ISA Brown: ~4–6 lbs)</SelectItem>
                <SelectItem value="heavy">Heavy Dual-Purpose (Orpington, Brahma, Jersey Giant: ~7–10 lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Daily Confinement Management</Label>
            <Select value={confinement} onValueChange={(v) => setConfinement(v as typeof confinement)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="run_only">Enclosed Run Only (100% Time in Run)</SelectItem>
                <SelectItem value="free_range">Supervised Daily Free-Range Pasture</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${minCoopSqFt} sq ft`} label="Minimum Coop Floor Space" unit={`Run: ${minRunSqFt} sq ft`} />
          <Rows items={[
            { label: "Enclosed Predator Run", value: `${minRunSqFt} sq ft (1/2\" hardware cloth)` },
            { label: "Total Roosting Bar Length", value: `${roostLengthFeet} linear feet (2x4 flat side up)` },
            { label: "Nesting Boxes Needed", value: `${nestBoxes} private boxes (12×12 in)` },
            { label: "Minimum High Ventilation Area", value: `≈ ${ventilationSqFt} sq ft (upper soffit vents)` },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Predator Security Rule:</strong> Standard hexagonal 'chicken wire' only keeps chickens in—it does NOT keep raccoons, weasels, or foxes out. Wrap all runs and windows in 1/2-inch 19-gauge hot-dipped galvanized hardware cloth with a 12-inch buried underground anti-digging apron.</p>
          </div>
        </div>
      }
    />
  );
}

export function ChickenEggProduction() {
  const [count, setCount] = useState(8);
  const [breed, setBreed] = useState<"hybrid" | "heritage" | "dual" | "bantam">("hybrid");
  const [ageYears, setAgeYears] = useState<"1" | "2" | "3" | "4">("1");
  const [lighting, setLighting] = useState<"natural" | "supplemental">("natural");

  // Base annual rate per hen
  const baseEggsPerYear = { hybrid: 300, heritage: 250, dual: 210, bantam: 130 }[breed];
  const ageMultiplier = { "1": 1.0, "2": 0.82, "3": 0.65, "4": 0.45 }[ageYears];
  const lightingMultiplier = lighting === "supplemental" ? 0.95 : 0.78; // winter natural drops by 40-50% in winter months

  const totalAnnualEggs = Math.round(count * baseEggsPerYear * ageMultiplier * (lighting === "supplemental" ? 1.0 : 0.85));
  const weeklyAvg = Math.round(totalAnnualEggs / 52);
  const dozensMonthly = (totalAnnualEggs / 12 / 12).toFixed(1);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Flock Hen Count</Label>
            <Input type="number" min={1} max={500} value={count} onChange={(e) => setCount(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
          <div>
            <Label>Hen Breed Genetics</Label>
            <Select value={breed} onValueChange={(v) => setBreed(v as typeof breed)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hybrid">Production Hybrid (ISA Brown, Golden Comet: ~300 eggs/yr)</SelectItem>
                <SelectItem value="heritage">High-Yield Heritage (White Leghorn, Australorp: ~250 eggs/yr)</SelectItem>
                <SelectItem value="dual">Dual-Purpose Heritage (Rhode Island Red, Plymouth Rock, Orpington: ~210/yr)</SelectItem>
                <SelectItem value="bantam">Bantam / Ornamental (Silkies, Polish: ~130 eggs/yr)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Hen Age Group</Label>
            <Select value={ageYears} onValueChange={(v) => setAgeYears(v as typeof ageYears)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Year 1 (Point of Lay to 18 months - Peak 100%)</SelectItem>
                <SelectItem value="2">Year 2 (Post-First Molt - ≈ 82% of Peak, Larger Eggs)</SelectItem>
                <SelectItem value="3">Year 3 (Mature Adult - ≈ 65% of Peak)</SelectItem>
                <SelectItem value="4">Year 4+ (Senior Hen - ≈ 45% of Peak)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Winter Lighting Management</Label>
            <Select value={lighting} onValueChange={(v) => setLighting(v as typeof lighting)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="natural">Natural Seasonal Photoperiod (Winter Rest / Laying Drop)</SelectItem>
                <SelectItem value="supplemental">Supplemental Lighting (14–16 hrs light year-round)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`≈ ${weeklyAvg} eggs/wk`} label="Estimated Weekly Egg Harvest" unit={`≈ ${dozensMonthly} dozen / month`} />
          <Rows items={[
            { label: "Annual Projected Harvest", value: `${totalAnnualEggs.toLocaleString()} total eggs (≈ ${Math.round(totalAnnualEggs / 12)} dozen)` },
            { label: "Daily Peak Rate", value: `≈ ${Math.round(weeklyAvg / 7)} to ${Math.ceil(weeklyAvg / 7)} eggs per day` },
            { label: "Calcium & Protein Support", value: "Offer free-choice crushed oyster shell & 16% layer feed" },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Avian Photoperiod Science:</strong> Hens require 14 to 16 hours of daily light triggering the pineal gland to release ovulatory hormones. In winter, egg laying naturally halts unless a timer-controlled warm LED light is set in the morning hours (never late evening).</p>
          </div>
        </div>
      }
    />
  );
}

export function GoatFeed() {
  const [weightLb, setWeightLb] = useState(140);
  const [goatClass, setGoatClass] = useState<"wether" | "lactating" | "growing" | "pregnant">("lactating");
  const [forageType, setForageType] = useState<"grass" | "alfalfa" | "browse">("alfalfa");

  // DMI: 3% for dry/wether, 4.5% for milking dairy doe, 3.5% for growing/pregnant
  const dmiPercent = goatClass === "lactating" ? 0.045 : goatClass === "pregnant" ? 0.035 : goatClass === "growing" ? 0.035 : 0.028;
  const totalDmiLb = weightLb * dmiPercent;

  // Grain calculation: dairy doe needs 0.5 lb grain per 3 lb milk produced (~1.5–2.5 lb grain)
  const grainLb = goatClass === "lactating" ? Math.min(3.0, weightLb * 0.015) : goatClass === "growing" ? 0.75 : goatClass === "pregnant" ? 1.0 : 0;
  const hayLb = Math.max(1.0, totalDmiLb - grainLb);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Goat Body Weight (lb)</Label>
            <Input type="number" min={20} max={350} value={weightLb} onChange={(e) => setWeightLb(Math.max(10, +e.target.value || 10))} className="mt-1.5" />
          </div>
          <div>
            <Label>Production & Physiological Class</Label>
            <Select value={goatClass} onValueChange={(v) => setGoatClass(v as typeof goatClass)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="wether">Dry Doe / Castrated Wether / Pet (Maintenance)</SelectItem>
                <SelectItem value="lactating">High-Yield Dairy Doe in Milk (Peak Demand)</SelectItem>
                <SelectItem value="pregnant">Late Gestation Doe (Last 4–6 Weeks)</SelectItem>
                <SelectItem value="growing">Growing Meat / Dairy Kid (Weanling)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Primary Forage Source</Label>
            <Select value={forageType} onValueChange={(v) => setForageType(v as typeof forageType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="grass">Grass Hay (Timothy, Orchard, Coastal Bermuda)</SelectItem>
                <SelectItem value="alfalfa">Alfalfa / Lucerne (High Calcium & Protein)</SelectItem>
                <SelectItem value="browse">Woody Shrub Browse & Pasture</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${hayLb.toFixed(1)} lb hay/day`} label="Daily Forage / Hay Minimum" unit={`Grain: ${grainLb.toFixed(1)} lb/day`} />
          <Rows items={[
            { label: "Dry Matter Intake (DMI)", value: `${totalDmiLb.toFixed(1)} lbs total dry matter / day (${(dmiPercent * 100).toFixed(1)}% BW)` },
            { label: "Daily Grain / Concentrate", value: grainLb > 0 ? `${grainLb.toFixed(1)} lbs / day (Split into 2 feedings)` : "0 lbs (Forage-only diet prevents obesity)" },
            { label: "Urinary Calculi Protection", value: goatClass === "wether" ? "MANDATORY: 2:1 Calcium-to-Phosphorus ratio + Ammonium Chloride" : "Provide free-choice loose goat minerals (with copper)" },
          ]} />
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            ⚠️ <strong>Wether Urinary Calculi Hazard:</strong> Never feed high-grain sweet feeds or pure alfalfa to castrated male goats (wethers). Excess phosphorus forms struvite stones that block the narrow urethral process, causing bladder rupture and agonizing death without emergency surgery.
          </div>
        </div>
      }
    />
  );
}

export function DuckPondSize() {
  const [count, setCount] = useState(6);
  const [breedSize, setBreedSize] = useState<"bantam" | "medium" | "heavy">("medium");
  const [pondType, setPondType] = useState<"kiddie_pool" | "filtered_pond">("filtered_pond");

  const galPerDuck = breedSize === "bantam" ? 12 : breedSize === "heavy" ? 25 : 18;
  const minWaterGal = count * galPerDuck;
  const pondSurfaceSqFt = Math.round(minWaterGal / 7.48 / 1.5); // 1.5 ft avg depth
  const flowRateGph = minWaterGal * 3; // 3x turnover for dirty ducks

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>Number of Waterfowl (Ducks / Geese)</Label>
            <Input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
          <div>
            <Label>Duck Breed Size</Label>
            <Select value={breedSize} onValueChange={(v) => setBreedSize(v as typeof breedSize)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bantam">Bantam Ducks (Call Duck, Mallard: ~1.5–2.5 lbs)</SelectItem>
                <SelectItem value="medium">Medium Production (Pekin, Khaki Campbell, Cayuga: ~5–7 lbs)</SelectItem>
                <SelectItem value="heavy">Heavy Breeds & Geese (Muscovy, Rouen, Toulouse: ~8–15 lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Pond Infrastructure Setup</Label>
            <Select value={pondType} onValueChange={(v) => setPondType(v as typeof pondType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="filtered_pond">Permanent In-Ground Filtered Pond</SelectItem>
                <SelectItem value="kiddie_pool">Heavy-Duty Plastic Drainable Stock Tank / Tub</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${minWaterGal} Gallons`} label="Minimum Pond Water Capacity" unit={`Surface: ≈ ${pondSurfaceSqFt} sq ft`} />
          <Rows items={[
            { label: "Minimum Pond Depth", value: "18 to 24 inches (allows full submergence and preening)" },
            { label: "Night Coop Floor Space", value: `${count * 4} sq ft dry bedding` },
            { label: "Enclosed Daytime Run Space", value: `${count * 15} sq ft secure run` },
            { label: "Required Filtration Turnover", value: `${flowRateGph} GPH (Bog wetland + mechanical pre-filter)` },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p><strong>Duck Hydrodynamics Note:</strong> Ducks excrete in water and carry pounds of soil in their bills. Traditional pool filters clog within 24 hours. Install a 2-inch bottom drain with a knife valve to dump duck wastewater directly to fertilize garden crops, or use gravel bog wetlands.</p>
          </div>
        </div>
      }
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
