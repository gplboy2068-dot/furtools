import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";
import { useTranslation } from "react-i18next";

/* ═══════════════════════════════════════════════════════════
   ADOPTION vs BUYING COST COMPARATOR
═══════════════════════════════════════════════════════════ */
export function AdoptionVsBuyingComparator() {
  const { t } = useTranslation("tools");
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
        <Label>{t("adoption-vs-buying-cost-comparator.ui.speciesLabel")}</Label>
        <Select value={species} onValueChange={(v) => setSpecies(v as "dog" | "cat")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="dog">{t("adoption-vs-buying-cost-comparator.ui.speciesDog")}</SelectItem>
            <SelectItem value="cat">{t("adoption-vs-buying-cost-comparator.ui.speciesCat")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("adoption-vs-buying-cost-comparator.ui.breederPriceLabel")}</Label>
        <Input type="number" value={breederPrice} onChange={(e) => setBreederPrice(+e.target.value || 0)} />
      </div>
      <div>
        <Label>{t("adoption-vs-buying-cost-comparator.ui.adoptionFeeLabel")}</Label>
        <Input type="number" value={adoptionFee} onChange={(e) => setAdoptionFee(+e.target.value || 0)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-4">
      <div className="rounded-lg bg-background/60 p-4">
        <div className="text-sm text-muted-foreground">{t("adoption-vs-buying-cost-comparator.ui.adoptionTotalTitle")}</div>
        <div className="text-2xl font-semibold text-primary">${data.adoptionTotal.toLocaleString()}</div>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          <li>{t("adoption-vs-buying-cost-comparator.ui.adoptionFeeRow", { fee: data.adoption.fee })}</li>
          <li>{t("adoption-vs-buying-cost-comparator.ui.spayNeuterIncluded")}</li>
          <li>{t("adoption-vs-buying-cost-comparator.ui.vaccinesIncluded")}</li>
          <li>{t("adoption-vs-buying-cost-comparator.ui.firstVetVisitRow", { fee: data.adoption.initialVet })}</li>
        </ul>
      </div>
      <div className="rounded-lg bg-background/60 p-4">
        <div className="text-sm text-muted-foreground">{t("adoption-vs-buying-cost-comparator.ui.buyingTotalTitle")}</div>
        <div className="text-2xl font-semibold text-primary">${data.buyingTotal.toLocaleString()}</div>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          <li>{t("adoption-vs-buying-cost-comparator.ui.purchasePriceRow", { price: data.buying.fee })}</li>
          <li>{t("adoption-vs-buying-cost-comparator.ui.spayNeuterRow", { fee: data.buying.spayNeuter })}</li>
          <li>{t("adoption-vs-buying-cost-comparator.ui.vaccineSeriesRow", { fee: data.buying.vaccines })}</li>
          <li>{t("adoption-vs-buying-cost-comparator.ui.microchipRow", { fee: data.buying.microchip })}</li>
          <li>First vet visit: ${data.buying.initialVet}</li>
        </ul>
      </div>
      <div className="rounded-lg bg-primary/10 p-4 text-center">
        <div className="text-sm text-muted-foreground">{t("adoption-vs-buying-cost-comparator.ui.adoptionSavesYou")}</div>
        <div className="text-3xl font-bold text-primary">${Math.max(0, data.savings).toLocaleString()}</div>
        <p className="mt-2 text-xs text-muted-foreground">
          {t("adoption-vs-buying-cost-comparator.ui.savingsNote")}
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
  const { t } = useTranslation("tools");
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
        <Label>{t("litter-size-predictor.ui.categoryLabel")}</Label>
        <Select value={type} onValueChange={(v) => setType(v as keyof typeof LITTER_DATA)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="toy-dog">{t("litter-size-predictor.ui.category.toyDog")}</SelectItem>
            <SelectItem value="small-dog">{t("litter-size-predictor.ui.category.smallDog")}</SelectItem>
            <SelectItem value="medium-dog">{t("litter-size-predictor.ui.category.mediumDog")}</SelectItem>
            <SelectItem value="large-dog">{t("litter-size-predictor.ui.category.largeDog")}</SelectItem>
            <SelectItem value="giant-dog">{t("litter-size-predictor.ui.category.giantDog")}</SelectItem>
            <SelectItem value="cat">{t("litter-size-predictor.ui.category.cat")}</SelectItem>
            <SelectItem value="rabbit">{t("litter-size-predictor.ui.category.rabbit")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("litter-size-predictor.ui.mothersAgeLabel")}</Label>
        <Input type="number" min={1} max={12} value={age} onChange={(e) => setAge(+e.target.value || 1)} />
      </div>
      <div>
        <Label>{t("litter-size-predictor.ui.litterNumberLabel")}</Label>
        <Input type="number" min={1} max={10} value={litterNumber} onChange={(e) => setLitterNumber(+e.target.value || 1)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-4">
      <div className="rounded-lg bg-primary/10 p-4 text-center">
        <div className="text-sm text-muted-foreground">{t("litter-size-predictor.ui.estimatedTitle")}</div>
        <div className="text-4xl font-bold text-primary">{prediction.estimated}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {t("litter-size-predictor.ui.typicalRange", { min: prediction.min, max: prediction.max })}
        </div>
      </div>
      <div className="rounded-lg bg-background/60 p-4 text-sm">
        <div className="font-medium">{t(`litter-size-predictor.ui.litterNote.${type}`)}</div>
        <p className="mt-2 text-muted-foreground">
          {t("litter-size-predictor.ui.breedNote")}
        </p>
      </div>
      <div className="rounded-lg border border-amber-500/30 bg-amber-50/60 p-3 text-xs dark:bg-amber-950/20">
        {t("litter-size-predictor.ui.breedingWarning")}
      </div>
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}
