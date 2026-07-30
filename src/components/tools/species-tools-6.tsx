import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";

/* ═══════════════════════════════════════════════════════════
   ADOPTION vs BUYING COST COMPARATOR
═══════════════════════════════════════════════════════════ */
export function AdoptionVsBuyingComparator() {
  const [species, setSpecies] = useState<"dog" | "cat">("dog");
  const [breederPrice, setBreederPrice] = useState(2000);
  const [adoptionFee, setAdoptionFee] = useState(species === "dog" ? 300 : 150);

  const data = useMemo(() => {
    const adoption = {
      fee: adoptionFee,
      spayNeuter: 0, // usually included
      vaccines: 0, // usually included
      microchip: 0, // usually included
      initialVet: 80,
    };
    const buying = {
      fee: breederPrice,
      spayNeuter: species === "dog" ? 300 : 200,
      vaccines: 150,
      microchip: 50,
      initialVet: 120,
    };
    const adoptionTotal = Object.values(adoption).reduce((a, b) => a + b, 0);
    const buyingTotal = Object.values(buying).reduce((a, b) => a + b, 0);
    return { adoption, buying, adoptionTotal, buyingTotal, savings: buyingTotal - adoptionTotal };
  }, [species, breederPrice, adoptionFee]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Species</Label>
        <Select value={species} onValueChange={(v) => setSpecies(v as "dog" | "cat")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="dog">Dog</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Breeder / Pet-store price ($)</Label>
        <Input type="number" value={breederPrice} onChange={(e) => setBreederPrice(+e.target.value || 0)} />
      </div>
      <div>
        <Label>Local adoption fee ($)</Label>
        <Input type="number" value={adoptionFee} onChange={(e) => setAdoptionFee(+e.target.value || 0)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-4">
      <div className="rounded-lg bg-background/60 p-4">
        <div className="text-sm text-muted-foreground">Adoption total (first-year setup)</div>
        <div className="text-2xl font-semibold text-primary">${data.adoptionTotal.toLocaleString()}</div>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          <li>Adoption fee: ${data.adoption.fee}</li>
          <li>Spay/neuter: usually included</li>
          <li>Vaccines & microchip: usually included</li>
          <li>First vet visit: ${data.adoption.initialVet}</li>
        </ul>
      </div>
      <div className="rounded-lg bg-background/60 p-4">
        <div className="text-sm text-muted-foreground">Buying total (first-year setup)</div>
        <div className="text-2xl font-semibold text-primary">${data.buyingTotal.toLocaleString()}</div>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          <li>Purchase price: ${data.buying.fee}</li>
          <li>Spay/neuter: ${data.buying.spayNeuter}</li>
          <li>Vaccine series: ${data.buying.vaccines}</li>
          <li>Microchip: ${data.buying.microchip}</li>
          <li>First vet visit: ${data.buying.initialVet}</li>
        </ul>
      </div>
      <div className="rounded-lg bg-primary/10 p-4 text-center">
        <div className="text-sm text-muted-foreground">Adoption saves you</div>
        <div className="text-3xl font-bold text-primary">${Math.max(0, data.savings).toLocaleString()}</div>
        <p className="mt-2 text-xs text-muted-foreground">
          Plus you give a home to a pet in need. Ongoing costs (food, insurance, vet) are the same either way.
        </p>
      </div>
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   LITTER SIZE PREDICTOR
═══════════════════════════════════════════════════════════ */
const LITTER_DATA: Record<string, { avg: number; min: number; max: number; note: string }> = {
  "toy-dog": { avg: 3, min: 1, max: 5, note: "Toy breeds (Chihuahua, Yorkie, Pomeranian)" },
  "small-dog": { avg: 4, min: 2, max: 6, note: "Small breeds (Beagle, Cocker Spaniel)" },
  "medium-dog": { avg: 6, min: 3, max: 8, note: "Medium breeds (Border Collie, Bulldog)" },
  "large-dog": { avg: 8, min: 4, max: 12, note: "Large breeds (Labrador, German Shepherd)" },
  "giant-dog": { avg: 10, min: 5, max: 15, note: "Giant breeds (Great Dane, Mastiff)" },
  "cat": { avg: 4, min: 1, max: 8, note: "Most domestic cat breeds" },
  "rabbit": { avg: 6, min: 3, max: 12, note: "Rabbit kindles vary widely by breed" },
};

export function LitterSizePredictor() {
  const [type, setType] = useState<keyof typeof LITTER_DATA>("medium-dog");
  const [age, setAge] = useState(3);
  const [litterNumber, setLitterNumber] = useState(1);

  const prediction = useMemo(() => {
    const base = LITTER_DATA[type];
    // First litters tend to be smaller; peak at 3rd-4th; declines after 5+
    const litterFactor = litterNumber === 1 ? 0.75 : litterNumber <= 4 ? 1 : 0.85;
    // Prime age 2-5 years
    const ageFactor = age < 2 ? 0.8 : age <= 5 ? 1 : age <= 7 ? 0.85 : 0.65;
    const estimated = Math.round(base.avg * litterFactor * ageFactor);
    return { ...base, estimated: Math.max(base.min, Math.min(base.max, estimated)) };
  }, [type, age, litterNumber]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Species / size category</Label>
        <Select value={type} onValueChange={(v) => setType(v as keyof typeof LITTER_DATA)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="toy-dog">Toy Dog (&lt; 10 lb)</SelectItem>
            <SelectItem value="small-dog">Small Dog (10-25 lb)</SelectItem>
            <SelectItem value="medium-dog">Medium Dog (25-60 lb)</SelectItem>
            <SelectItem value="large-dog">Large Dog (60-100 lb)</SelectItem>
            <SelectItem value="giant-dog">Giant Dog (100+ lb)</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
            <SelectItem value="rabbit">Rabbit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Mother's age (years)</Label>
        <Input type="number" min={1} max={12} value={age} onChange={(e) => setAge(+e.target.value || 1)} />
      </div>
      <div>
        <Label>Which litter is this? (1st, 2nd…)</Label>
        <Input type="number" min={1} max={10} value={litterNumber} onChange={(e) => setLitterNumber(+e.target.value || 1)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-4">
      <div className="rounded-lg bg-primary/10 p-4 text-center">
        <div className="text-sm text-muted-foreground">Estimated litter size</div>
        <div className="text-4xl font-bold text-primary">{prediction.estimated}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Typical range: {prediction.min}-{prediction.max}
        </div>
      </div>
      <div className="rounded-lg bg-background/60 p-4 text-sm">
        <div className="font-medium">{prediction.note}</div>
        <p className="mt-2 text-muted-foreground">
          First litters usually run below breed average. Prime reproductive age is 2-5 years, after
          which litter sizes gradually decline. Ultrasound at day 25-30 and X-ray at day 55 give the
          only accurate count — this estimator is educational only.
        </p>
      </div>
      <div className="rounded-lg border border-amber-500/30 bg-amber-50/60 p-3 text-xs dark:bg-amber-950/20">
        Responsible breeding requires health testing, veterinary supervision, and a plan for every
        puppy or kitten. Consult a reproductive veterinarian before breeding.
      </div>
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}
