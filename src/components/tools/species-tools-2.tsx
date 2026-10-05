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
import { useTranslation } from "react-i18next";

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
function SelectField({ label, value, onChange, options, optionLabel }: { label: string; value: string; onChange: (v: string) => void; options: string[]; optionLabel?: (o: string) => string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{optionLabel ? optionLabel(o) : o.replace(/-/g, " ")}</SelectItem>)}</SelectContent>
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
  const { t } = useTranslation("tools");
  const [dogs, setDogs] = useState(1);
  const [perDay, setPerDay] = useState(2);
  const monthly = dogs * perDay * 30;
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label={t("dog-poop-bag-calculator.ui.numberOfDogs")} value={dogs} onChange={setDogs} min={1} />
        <NumberField label={t("dog-poop-bag-calculator.ui.averagePoopsPerDogDay")} value={perDay} onChange={setPerDay} min={1} />
      </div>}
      result={<div className="space-y-4">
        <Big value={monthly} label={t("dog-poop-bag-calculator.ui.bagsNeededMonth")} />
        <Note>{t("dog-poop-bag-calculator.ui.buyA3MonthSupplyTo")}</Note>
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
  const { t } = useTranslation("tools");
  const [size, setSize] = useState("medium");
  return (
    <CalculatorLayout
      form={<SelectField label={t("dog-crate-size-calculator.ui.adultSize")} value={size} onChange={setSize} options={Object.keys(DOG_CRATE)} optionLabel={(o) => t(`dog-crate-size-calculator.ui.crateSize.${o}`)} />}
      result={<div className="space-y-4">
        <Big value={DOG_CRATE[size]} label={t("dog-crate-size-calculator.ui.recommendedCrateLWH")} />
        <Note>{t("dog-crate-size-calculator.ui.ruleOfThumbDogShouldStand")}</Note>
      </div>}
    />
  );
}

export function DogCollarSize() {
  const { t } = useTranslation("tools");
  const [neck, setNeck] = useState(14);
  const min = Math.max(neck + 1, neck * 1.05).toFixed(1);
  const max = (neck + 3).toFixed(1);
  return (
    <CalculatorLayout
      form={<NumberField label={t("dog-collar-size-calculator.ui.neckCircumferenceInches")} value={neck} onChange={setNeck} step={0.5} />}
      result={<div className="space-y-4">
        <Big value={t("dog-collar-size-calculator.ui.text", { min, max })} label={t("dog-collar-size-calculator.ui.adjustableCollarRange")} />
        <Note>{t("dog-collar-size-calculator.ui.twoFingerRuleYouShouldSlide")}</Note>
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
  const { t } = useTranslation("tools");
  const [type, setType] = useState("erect / short-hair");
  return (
    <CalculatorLayout
      form={<SelectField label={t("dog-ear-cleaning-schedule.ui.earTypeLabel")} value={type} onChange={setType} options={Object.keys(EAR_CLEAN)} optionLabel={(o) => t(`dog-ear-cleaning-schedule.ui.earType.${o}`)} />}
      result={<div className="space-y-4">
        <Big value={t(`dog-ear-cleaning-schedule.ui.frequency.${type}`)} label={t("dog-ear-cleaning-schedule.ui.recommendedCleaningFrequency")} />
        <Note>{t("dog-ear-cleaning-schedule.ui.neverInsertCottonSwabsUseA")}</Note>
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
  const { t } = useTranslation("tools");
  const [stage, setStage] = useState("adult");
  return (
    <CalculatorLayout
      form={<SelectField label={t("dog-dental-care-schedule.ui.lifeStage")} value={stage} onChange={setStage} options={Object.keys(DENTAL)} optionLabel={(o) => t(`dog-dental-care-schedule.ui.stage.${o}`)} />}
      result={<div className="space-y-4">
        <Big value={t(`dog-dental-care-schedule.ui.routine.${stage}`)} label={t("dog-dental-care-schedule.ui.homeDentalRoutine")} />
        <Note>{t("dog-dental-care-schedule.ui.useOnlyEnzymaticDogToothpasteHuman")}</Note>
      </div>}
    />
  );
}

/* ─────────── CATS ─────────── */
export function CatHairballRisk() {
  const { t } = useTranslation("tools");
  const [coat, setCoat] = useState("medium");
  const [grooming, setGrooming] = useState(2);
  const base: Record<string, number> = { short: 1, medium: 3, long: 5 };
  const score = Math.max(0, base[coat] - grooming * 0.4);
  const risk = score >= 3 ? t("cat-hairball-risk-calculator.ui.riskHigh") : score >= 1.5 ? t("cat-hairball-risk-calculator.ui.riskModerate") : t("cat-hairball-risk-calculator.ui.riskLow");
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <SelectField label={t("cat-hairball-risk-calculator.ui.coatLength")} value={coat} onChange={setCoat} options={["short", "medium", "long"]} optionLabel={(o) => t(`cat-hairball-risk-calculator.ui.coat.${o}`)} />
        <NumberField label={t("cat-hairball-risk-calculator.ui.brushingSessionsWeek")} value={grooming} onChange={setGrooming} />
      </div>}
      result={<div className="space-y-4">
        <Big value={risk} label={t("cat-hairball-risk-calculator.ui.hairballRisk")} />
        <Note>{t("cat-hairball-risk-calculator.ui.brushMoreAddFiberPumpkinOr")}</Note>
      </div>}
    />
  );
}

export function CatScratchingPostSelector() {
  const { t } = useTranslation("tools");
  const [size, setSize] = useState("adult");
  const heights: Record<string, string> = { kitten: "20–24\"", adult: "32–40\"", "large-breed": "40–48\"" };
  return (
    <CalculatorLayout
      form={<SelectField label={t("cat-scratching-post-selector.ui.catSize")} value={size} onChange={setSize} options={Object.keys(heights)} optionLabel={(o) => t(`cat-scratching-post-selector.ui.size.${o}`)} />}
      result={<div className="space-y-4">
        <Big value={heights[size]} label={t("cat-scratching-post-selector.ui.minimumPostHeight")} />
        <Note>{t("cat-scratching-post-selector.ui.catShouldStretchFullyVerticallySisal")}</Note>
      </div>}
    />
  );
}

export function CatCarrierSize() {
  const { t } = useTranslation("tools");
  const [len, setLen] = useState(18);
  const [w, setW] = useState(8);
  const carrierL = (len + 4).toFixed(0);
  const carrierW = (w + 4).toFixed(0);
  const carrierH = (Math.max(w + 6, 12)).toFixed(0);
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label={t("cat-carrier-size-calculator.ui.catLengthNoseBaseOfTail")} value={len} onChange={setLen} />
        <NumberField label={t("cat-carrier-size-calculator.ui.catShoulderWidthIn")} value={w} onChange={setW} />
      </div>}
      result={<div className="space-y-4">
        <Big value={t("cat-carrier-size-calculator.ui.text", { carrierL, carrierW, carrierH })} label={t("cat-carrier-size-calculator.ui.recommendedCarrierLWH")} />
        <Note>{t("cat-carrier-size-calculator.ui.catShouldTurnAroundAndStand")}</Note>
      </div>}
    />
  );
}

export function CatCatioSize() {
  const { t } = useTranslation("tools");
  const [cats, setCats] = useState(1);
  const sqft = cats * 15;
  return (
    <CalculatorLayout
      form={<NumberField label={t("cat-catio-size-calculator.ui.numberOfCats")} value={cats} onChange={setCats} min={1} />}
      result={<div className="space-y-4">
        <Big value={t("cat-catio-size-calculator.ui.sqFt", { sqft })} label={t("cat-catio-size-calculator.ui.minimumCatioFloorArea")} />
        <Note>{t("cat-catio-size-calculator.ui.addVerticalShelvesCatsUse3D")}</Note>
      </div>}
    />
  );
}

/* ─────────── BIRDS ─────────── */
interface BirdBathProfile {}

const BIRD_BATH_DATA: Record<string, BirdBathProfile> = {
  finch: {      },
  budgie: {      },
  cockatiel: {      },
  conure: {      },
  "african-grey": {      },
  amazon: {      },
  cockatoo: {      },
  macaw: {      },
};

export function BirdBathFrequency() {
  const { t } = useTranslation("tools");
  const [sp, setSp] = useState("cockatiel");
  const d = BIRD_BATH_DATA[sp] || BIRD_BATH_DATA.cockatiel;

  return (
    <CalculatorLayout
      form={
        <div>
          <Label>{t("bird-bath-frequency-guide.ui.birdSpecies")}</Label>
          <Select value={sp} onValueChange={setSp}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(BIRD_BATH_DATA).map(([k, v]) => (
                <SelectItem key={k} value={k}>{t(`bird-bath-frequency-guide.ui.species.${k}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t(`bird-bath-frequency-guide.ui.frequency.${sp}`)} label={t("bird-bath-frequency-guide.ui.optimalBathingFrequency")} />
          <Rows items={[
            { label: t("bird-bath-frequency-guide.ui.preferredBathMethod"), value: t(`bird-bath-frequency-guide.ui.preferredMethod.${sp}`) },
            { label: t("bird-bath-frequency-guide.ui.featherSkinType"), value: t(`bird-bath-frequency-guide.ui.featherType.${sp}`) },
            { label: t("bird-bath-frequency-guide.ui.fullDryingDuration"), value: t(`bird-bath-frequency-guide.ui.dryingDuration.${sp}`) },
          ]} />
          <div className="rounded-lg bg-primary/10 p-3 text-xs text-primary font-medium">
            💡 {t(`bird-bath-frequency-guide.ui.clinicalTip.${sp}`)}
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("bird-bath-frequency-guide.ui.crucialBathRules")}</p>
          </div>
        </div>
      }
    />
  );
}

interface BirdFlightProfile {  minFlightDimensions: string;
  minWingBeats: number;
  wingspanInches: number;
  dailyHours: number;
  hazards: string[];
}

const BIRD_FLIGHT_DATA: Record<string, BirdFlightProfile> = {
  finch: {  minFlightDimensions: "6 ft L × 3 ft W × 4 ft H", minWingBeats: 4, wingspanInches: 8, dailyHours: 0,  },
  budgie: {  minFlightDimensions: "8 ft L × 6 ft W × 7 ft H", minWingBeats: 5, wingspanInches: 12, dailyHours: 2,  },
  cockatiel: {  minFlightDimensions: "10 ft L × 8 ft W × 7 ft H", minWingBeats: 6, wingspanInches: 16, dailyHours: 3,  },
  conure: {  minFlightDimensions: "12 ft L × 8 ft W × 8 ft H", minWingBeats: 6, wingspanInches: 18, dailyHours: 4,  },
  "african-grey": {  minFlightDimensions: "16 ft L × 10 ft W × 8 ft H", minWingBeats: 7, wingspanInches: 28, dailyHours: 4,  },
  cockatoo: {  minFlightDimensions: "20 ft L × 12 ft W × 9 ft H", minWingBeats: 8, wingspanInches: 36, dailyHours: 5,  },
  macaw: {  minFlightDimensions: "24 ft L × 15 ft W × 10 ft H", minWingBeats: 8, wingspanInches: 42, dailyHours: 5,  },
};

export function BirdFlightSpace() {
  const { t } = useTranslation("tools");
  const [sp, setSp] = useState("cockatiel");
  const d = BIRD_FLIGHT_DATA[sp] || BIRD_FLIGHT_DATA.cockatiel;

  return (
    <CalculatorLayout
      form={
        <div>
          <Label>{t("bird-flight-space-calculator.ui.birdSpecies")}</Label>
          <Select value={sp} onValueChange={setSp}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(BIRD_FLIGHT_DATA).map(([k, v]) => (
                <SelectItem key={k} value={k}>{t(`bird-flight-space-calculator.ui.species.${k}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={d.minFlightDimensions} label={t("bird-flight-space-calculator.ui.recommendedFlightZoneDimensions")} />
          <Rows items={[
            { label: t("bird-flight-space-calculator.ui.continuousWingBeatsBetweenPerches"), value: t("bird-flight-space-calculator.ui.fullFlaps", { minWingBeats: d.minWingBeats }) },
            { label: t("bird-flight-space-calculator.ui.adultWingspan"), value: t("bird-flight-space-calculator.ui.inches", { wingspanInches: d.wingspanInches }) },
            { label: t("bird-flight-space-calculator.ui.recommendedSupervisedFreeFlight"), value: t("bird-flight-space-calculator.ui.hoursDaily", { dailyHours: d.dailyHours }) },
          ]} />
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive space-y-1">
            {t("bird-flight-space-calculator.ui.criticalFlightSafetyChecklist")}
            <ul className="list-disc pl-4 space-y-0.5 mt-1">
              {(t(`bird-flight-space-calculator.ui.hazards.${sp}`, { returnObjects: true }) as unknown as string[]).map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>
        </div>
      }
    />
  );
}

export function BirdToyRotation() {
  const { t } = useTranslation("tools");
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
            <Label>{t("bird-toy-rotation-planner.ui.parrotBirdSizeCategory")}</Label>
            <Select value={speciesSize} onValueChange={(v) => setSpeciesSize(v as typeof speciesSize)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{t("bird-toy-rotation-planner.ui.smallBudgieCockatielLovebirdFinch")}</SelectItem>
                <SelectItem value="medium">{t("bird-toy-rotation-planner.ui.mediumConureRingneckSenegalCaique")}</SelectItem>
                <SelectItem value="large">{t("bird-toy-rotation-planner.ui.largeAfricanGreyAmazonCockatooMacaw")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("bird-toy-rotation-planner.ui.totalToyInventoryInPossession")}</Label>
            <Input type="number" min={4} max={50} value={toys} onChange={(e) => setToys(Math.max(4, +e.target.value || 4))} className="mt-1.5" />
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("bird-toy-rotation-planner.ui.toysInCage", { displayCount })} label={t("bird-toy-rotation-planner.ui.activeInCageDisplay")} unit={t("bird-toy-rotation-planner.ui.inReserveStorage", { storageCount })} />
          <Rows items={[
            { label: t("bird-toy-rotation-planner.ui.n1ForagingFoodPuzzleToys"), value: t("bird-toy-rotation-planner.ui.itemsTreatRetrieval", { foragingShare }) },
            { label: t("bird-toy-rotation-planner.ui.n2DestructibleSoftWoodYuccaPaper"), value: t("bird-toy-rotation-planner.ui.itemsShreddingDrive", { destructibleShare }) },
            { label: t("bird-toy-rotation-planner.ui.n3HardwoodNaturalPreeningToys"), value: t("bird-toy-rotation-planner.ui.itemsBeakTrimGrooming", { chewPreenShare }) },
            { label: t("bird-toy-rotation-planner.ui.rotationCadence"), value: t("bird-toy-rotation-planner.ui.rotateEvery5To7Days") },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("bird-toy-rotation-planner.ui.safetyProtocol")}</p>
          </div>
        </div>
      }
    />
  );
}

/* ─────────── FISH ─────────── */
export function FishQuarantineTimer() {
  const { t } = useTranslation("tools");
  const [risk, setRisk] = useState("standard");
  const days: Record<string, string> = { standard: "14–21 days", "wild-caught": "30 days", "known-outbreak": "45+ days with treatments" };
  return (
    <CalculatorLayout
      form={<SelectField label={t("fish-quarantine-timer.ui.sourceRisk")} value={risk} onChange={setRisk} options={Object.keys(days)} optionLabel={(o) => t(`fish-quarantine-timer.ui.risk.${o}`)} />}
      result={<div className="space-y-4">
        <Big value={t(`fish-quarantine-timer.ui.days.${risk}`)} label={t("fish-quarantine-timer.ui.recommendedQuarantine")} />
        <Note>{t("fish-quarantine-timer.ui.bareBottomTankSeparateNetSiphon")}</Note>
      </div>}
    />
  );
}

export function AquariumPlantCount() {
  const { t } = useTranslation("tools");
  const [gallons, setGallons] = useState(20);
  const stems = Math.round(gallons * 1.2);
  const carpet = Math.round(gallons * 0.5);
  return (
    <CalculatorLayout
      form={<NumberField label={t("aquarium-plant-count-calculator.ui.tankVolumeGallons")} value={gallons} onChange={setGallons} min={1} />}
      result={<div className="space-y-4">
        <Rows items={[
          { label: t("aquarium-plant-count-calculator.ui.stemPlants"), value: t("aquarium-plant-count-calculator.ui.stems", { stems }) },
          { label: t("aquarium-plant-count-calculator.ui.carpetPlantsPots"), value: t("aquarium-plant-count-calculator.ui.pots", { carpet }) },
          { label: t("aquarium-plant-count-calculator.ui.backgroundBunches"), value: `${Math.max(1, Math.round(gallons / 10))}` },
          { label: t("aquarium-plant-count-calculator.ui.focalPlantRosette"), value: t("aquarium-plant-count-calculator.ui.n12Pieces") },
        ]} />
        <Note>{t("aquarium-plant-count-calculator.ui.aHeavilyPlantedTankReducesAlgae")}</Note>
      </div>}
    />
  );
}

export function AquariumSubstrate() {
  const { t } = useTranslation("tools");
  const [len, setLen] = useState(24);
  const [w, setW] = useState(12);
  const [depth, setDepth] = useState(2);
  const lbs = ((len * w * depth) / 10).toFixed(1); // rough approx
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <NumberField label={t("aquarium-substrate-calculator.ui.tankLengthIn")} value={len} onChange={setLen} />
        <NumberField label={t("aquarium-substrate-calculator.ui.tankWidthIn")} value={w} onChange={setW} />
        <NumberField label={t("aquarium-substrate-calculator.ui.substrateDepthIn")} value={depth} onChange={setDepth} />
      </div>}
      result={<div className="space-y-4">
        <Big value={`${lbs} lbs`} label={t("aquarium-substrate-calculator.ui.substrateNeeded")} />
        <Note>{t("aquarium-substrate-calculator.ui.aimFor12InFor")}</Note>
      </div>}
    />
  );
}

export function AquariumCO2() {
  const { t } = useTranslation("tools");
  const [gallons, setGallons] = useState(20);
  const bps = (gallons / 20).toFixed(1);
  return (
    <CalculatorLayout
      form={<NumberField label={t("aquarium-co2-calculator.ui.tankVolumeGallons")} value={gallons} onChange={setGallons} min={5} />}
      result={<div className="space-y-4">
        <Big value={t("aquarium-co2-calculator.ui.bps", { bps })} label={t("aquarium-co2-calculator.ui.startingCO2RateBubblesSec")} />
        <Note>{t("aquarium-co2-calculator.ui.adjustToTarget30PpmUsing")}</Note>
      </div>}
    />
  );
}

/* ─────────── SMALL PETS (ADVANCED CALCULATORS) ─────────── */
export function HamsterWheelSize() {
  const { t } = useTranslation("tools");
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
            <Label>{t("hamster-wheel-size-calculator.ui.hamsterSpecies")}</Label>
            <Select value={species} onValueChange={(v: typeof species) => setSpecies(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="syrian">{t("hamster-wheel-size-calculator.ui.syrianHamsterGoldenTeddyBear")}</SelectItem>
                <SelectItem value="dwarf">{t("hamster-wheel-size-calculator.ui.dwarfHamsterCampbellWinterWhite")}</SelectItem>
                <SelectItem value="robo">{t("hamster-wheel-size-calculator.ui.roborovskiDwarfHamsterSpeedRunner")}</SelectItem>
                <SelectItem value="chinese">{t("hamster-wheel-size-calculator.ui.chineseHamster")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("hamster-wheel-size-calculator.ui.wheelTrackSurfaceType")}</Label>
            <Select value={surface} onValueChange={(v: typeof surface) => setSurface(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">{t("hamster-wheel-size-calculator.ui.solidPlasticTrackWodentWheelSilent")}</SelectItem>
                <SelectItem value="cork">{t("hamster-wheel-size-calculator.ui.corkLinedWoodenWheelUltraQuiet")}</SelectItem>
                <SelectItem value="wire">{t("hamster-wheel-size-calculator.ui.wireMeshRungedWheelUNSAFE")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big
            value={t("hamster-wheel-size-calculator.ui.diameter", { rec: specs.rec })}
            label={t("hamster-wheel-size-calculator.ui.recommendedWheelSize")}
            unit={t("hamster-wheel-size-calculator.ui.minimumCm", { min: specs.min, v0: Math.round(specs.min * 2.54) })}
          />
          <Rows
            items={[
              { label: t("hamster-wheel-size-calculator.ui.spinePostureCheck"), value: t("hamster-wheel-size-calculator.ui.backMustBe100HorizontalFlat") },
              { label: t("hamster-wheel-size-calculator.ui.trackSurfaceVerdict"), value: surfaceSafe ? t("hamster-wheel-size-calculator.ui.trackSurface.safe") : t("hamster-wheel-size-calculator.ui.trackSurface.danger") },
              { label: t("hamster-wheel-size-calculator.ui.nightlyExerciseDistance"), value: specs.kmNight },
              { label: t("hamster-wheel-size-calculator.ui.centerAxleSafety"), value: t("hamster-wheel-size-calculator.ui.axleFreeDesignPreventsSpineTail") },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">{t("hamster-wheel-size-calculator.ui.ifYourHamsterRunsWithTheir")}</p>
        </div>
      }
    />
  );
}

export function FerretCageSize() {
  const { t } = useTranslation("tools");
  const [ferrets, setFerrets] = useState(2);
  const [outHours, setOutHours] = useState(4);

  const baseCuFt = 24;
  const totalCuFt = baseCuFt + (ferrets - 1) * 16;
  const levels = ferrets >= 3 ? t("ferret-cage-size-calculator.ui.levels.many") : t("ferret-cage-size-calculator.ui.levels.few");
  const litterBoxes = ferrets + 1;

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("ferret-cage-size-calculator.ui.numberOfFerrets")}</Label>
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
              <Label>{t("ferret-cage-size-calculator.ui.dailyFreeRoamHours")}</Label>
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
          <Big value={t("ferret-cage-size-calculator.ui.cuFt", { totalCuFt })} label={t("ferret-cage-size-calculator.ui.minimumCageVolume")} unit={`≈ ${(totalCuFt * 0.0283168).toFixed(2)} m³`} />
          <Rows
            items={[
              { label: t("ferret-cage-size-calculator.ui.recommendedStructure"), value: t("ferret-cage-size-calculator.ui.ferretNationCritterNation", { levels }) },
              { label: t("ferret-cage-size-calculator.ui.maximumBarSpacing"), value: '0.5" (prevents kit & female head entrapment)' },
              { label: t("ferret-cage-size-calculator.ui.sleepingHammocksDens"), value: t("ferret-cage-size-calculator.ui.fleeceHammocksSleepSacks", { v0: ferrets * 2 }) },
              { label: t("ferret-cage-size-calculator.ui.cornerLitterBoxes"), value: t("ferret-cage-size-calculator.ui.lowEntryBoxes", { litterBoxes }) },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            {outHours >= 4
              ? t("ferret-cage-size-calculator.ui.roamNote.good")
              : t("ferret-cage-size-calculator.ui.roamNote.bad")}
          </p>
        </div>
      }
    />
  );
}

export function GuineaPigCageSize() {
  const { t } = useTranslation("tools");
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
    finalSqFt >= 20 ? t("guinea-pig-cage-size-calculator.ui.grids.xl") : finalSqFt >= 15 ? t("guinea-pig-cage-size-calculator.ui.grids.lg") : finalSqFt >= 10 ? t("guinea-pig-cage-size-calculator.ui.grids.md") : t("guinea-pig-cage-size-calculator.ui.grids.sm");

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("guinea-pig-cage-size-calculator.ui.numberOfGuineaPigs")}</Label>
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
              <Label>{t("guinea-pig-cage-size-calculator.ui.herdComposition")}</Label>
              <Select value={pairing} onValueChange={(v: typeof pairing) => setPairing(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sows">{t("guinea-pig-cage-size-calculator.ui.femalesSowsTrio")}</SelectItem>
                  <SelectItem value="boars">{t("guinea-pig-cage-size-calculator.ui.malesBoarsNeedExtraSpace")}</SelectItem>
                  <SelectItem value="mixed_neutered">{t("guinea-pig-cage-size-calculator.ui.neuteredBoarSows")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("guinea-pig-cage-size-calculator.ui.sqFt", { finalSqFt })} label={t("guinea-pig-cage-size-calculator.ui.continuousSingleLevelFloorSpace")} unit={t("guinea-pig-cage-size-calculator.ui.m", { finalSqM })} />
          <Rows
            items={[
              { label: t("guinea-pig-cage-size-calculator.ui.recommendedCCCageGridSize"), value: ccGrids },
              { label: t("guinea-pig-cage-size-calculator.ui.hideawaysRequired"), value: t("guinea-pig-cage-size-calculator.ui.hidesWith2DoorsEach", { v0: pigs + 1 }) },
              { label: t("guinea-pig-cage-size-calculator.ui.hayStationsWaterBottles"), value: t("guinea-pig-cage-size-calculator.ui.separateFeedingStations", { v0: Math.max(2, pigs) }) },
              { label: t("guinea-pig-cage-size-calculator.ui.upperLoftsNote"), value: t("guinea-pig-cage-size-calculator.ui.upperLoftsAreBonusSpaceThey") },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">{t("guinea-pig-cage-size-calculator.ui.guineaPigsHaveFragileSpinesAnd")}</p>
        </div>
      }
    />
  );
}

export function RabbitLitterTrainingGuide() {
  const { t } = useTranslation("tools");
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
            <Label>{t("rabbit-litter-training-guide.ui.rabbitStatusAge")}</Label>
            <Select value={lifeStage} onValueChange={(v: typeof lifeStage) => setLifeStage(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="neutered_adult">{t("rabbit-litter-training-guide.ui.neuteredSpayedAdultIdeal")}</SelectItem>
                <SelectItem value="intact">{t("rabbit-litter-training-guide.ui.intactAdultHormonalSpraying")}</SelectItem>
                <SelectItem value="baby">{t("rabbit-litter-training-guide.ui.babyJunior12Weeks")}</SelectItem>
                <SelectItem value="senior">{t("rabbit-litter-training-guide.ui.seniorArthriticRabbit")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("rabbit-litter-training-guide.ui.litterSubstrateMaterial")}</Label>
            <Select value={litterType} onValueChange={(v: typeof litterType) => setLitterType(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="paper_pellets">{t("rabbit-litter-training-guide.ui.recycledPaperPelletsYesterdaySNews")}</SelectItem>
                <SelectItem value="aspen">{t("rabbit-litter-training-guide.ui.kilnDriedAspenShavings")}</SelectItem>
                <SelectItem value="clay">{t("rabbit-litter-training-guide.ui.catClumpingClayTOXICDEADLY")}</SelectItem>
                <SelectItem value="pine">{t("rabbit-litter-training-guide.ui.untreatedPineCedarShavingsTOXICOILS")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={stageAdvice.timeline} label={t("rabbit-litter-training-guide.ui.expectedTrainingTimeline")} />
          <Rows
            items={[
              { label: t("rabbit-litter-training-guide.ui.litterMaterialSafety"), value: litterSafe ? t("rabbit-litter-training-guide.ui.litterVerdict.safe") : t("rabbit-litter-training-guide.ui.litterVerdict.danger") },
              { label: t("rabbit-litter-training-guide.ui.hayRackPosition"), value: t("rabbit-litter-training-guide.ui.hangHayRackDirectlyOVERThe") },
              { label: t("rabbit-litter-training-guide.ui.enzymaticCleaner"), value: t("rabbit-litter-training-guide.ui.useWhiteVinegarOrEnzymaticSpray") },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
{t("rabbit-litter-training-guide.ui.biologicalSecret")}
          </p>
        </div>
      }
    />
  );
}

/* ─────────── REPTILES ─────────── */

/* 1. REPTILE HUMIDITY GUIDE */
interface HumiditySpecies {}

const REPTILE_HUMIDITY_DATA: Record<string, HumiditySpecies> = {
  "bearded-dragon": {
    
    
    
    
    
    
    
    
  },
  "leopard-gecko": {
    
    
    
    
    
    
    
    
  },
  "ball-python": {
    
    
    
    
    
    
    
    
  },
  "crested-gecko": {
    
    
    
    
    
    
    
    
  },
  "corn-snake": {
    
    
    
    
    
    
    
    
  },
  "veiled-chameleon": {
    
    
    
    
    
    
    
    
  },
  "blue-tongue-skink": {
    
    
    
    
    
    
    
    
  },
  "russian-tortoise": {
    
    
    
    
    
    
    
    
  },
  "brazilian-rainbow-boa": {
    
    
    
    
    
    
    
    
  },
  "uromastyx": {
    
    
    
    
    
    
    
    
  },
};

export function ReptileHumidityGuide() {
  const { t } = useTranslation("tools");
  const [spKey, setSpKey] = useState("bearded-dragon");
  const [currentReading, setCurrentReading] = useState<number>(35);

  const sp = REPTILE_HUMIDITY_DATA[spKey] || REPTILE_HUMIDITY_DATA["bearded-dragon"];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <h3 className="font-semibold text-foreground">{t("reptile-humidity-guide.ui.reptileSpeciesHumidityMicroclimateGuide")}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t("reptile-humidity-guide.ui.understandSpeciesDiurnalHumidityCyclesMisting")}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-humidity-guide.ui.selectSpecies")}</Label>
            <Select value={spKey} onValueChange={setSpKey}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.entries(REPTILE_HUMIDITY_DATA).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{t(`reptile-humidity-guide.ui.species.${k}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-humidity-guide.ui.yourCurrentHygrometerReading")}</Label>
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
            <span className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">{t("reptile-humidity-guide.ui.targetDaytimeBaseline")}</span>
            <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              {t(`reptile-humidity-guide.ui.dayTarget.${spKey}`)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              t("reptile-humidity-guide.ui.naturalBiome") <strong className="text-foreground">{t(`reptile-humidity-guide.ui.biome.${spKey}`)}</strong>
            </p>
          </div>

          <Badge variant="outline" className="text-xs px-3 py-1.5 font-medium">
            t("reptile-humidity-guide.ui.nightSpikeLabel") {t(`reptile-humidity-guide.ui.nightSpike.${spKey}`)}
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Sun className="h-3.5 w-3.5 text-amber-500" /> {t("reptile-humidity-guide.ui.daytime")}
            </div>
            <div className="mt-1 text-base font-bold text-foreground">{t(`reptile-humidity-guide.ui.dayTarget.${spKey}`)}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Droplets className="h-3.5 w-3.5 text-blue-500" /> {t("reptile-humidity-guide.ui.nighttime")}
            </div>
            <div className="mt-1 text-base font-bold text-blue-600 dark:text-blue-400">{t(`reptile-humidity-guide.ui.nightSpike.${spKey}`)}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Layers className="h-3.5 w-3.5 text-emerald-500" /> {t("reptile-humidity-guide.ui.shedding")}
            </div>
            <div className="mt-1 text-xs font-bold text-foreground truncate">{t(`reptile-humidity-guide.ui.shedTarget.${spKey}`)}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-humidity-guide.ui.hygrometerCheck")}</div>
            <div className="mt-1 text-base font-bold text-foreground">{t("reptile-humidity-guide.ui.currentReading", { currentReading })}</div>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-xs">
          <div className="rounded-xl border p-3.5 bg-card/80">
            {t("reptile-humidity-guide.ui.mistingMaintenanceProtocolFull", { tips: t(`reptile-humidity-guide.ui.mistingTips.${spKey}`) })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <span className="font-semibold text-amber-800 dark:text-amber-300">{t("reptile-humidity-guide.ui.risksIfHumidityTooLow")}</span>
              <p className="text-muted-foreground mt-0.5">{t(`reptile-humidity-guide.ui.risksLow.${spKey}`)}</p>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
              <span className="font-semibold text-rose-800 dark:text-rose-300">{t("reptile-humidity-guide.ui.risksIfHumidityTooHigh")}</span>
              <p className="text-muted-foreground mt-0.5">{t(`reptile-humidity-guide.ui.risksHigh.${spKey}`)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2. REPTILE BASKING & THERMAL GRADIENT GUIDE */
interface BaskingSpecies {}

const REPTILE_BASKING_DATA: Record<string, BaskingSpecies> = {
  "bearded-dragon": {
    
       
       
    
    
    
  },
  "leopard-gecko": {
    
       
       
    
    
    
  },
  "ball-python": {
    
       
       
    
    
    
  },
  "crested-gecko": {
    
       
       
    
    
    
  },
  "corn-snake": {
    
       
       
    
    
    
  },
  "blue-tongue-skink": {
    
       
       
    
    
    
  },
  "uromastyx": {
    
       
       
    
    
    
  },
};

export function ReptileBaskingGuide() {
  const { t } = useTranslation("tools");
  const [spKey, setSpKey] = useState("bearded-dragon");
  const [unit, setUnit] = useState<"F" | "C">("F");

  const sp = REPTILE_BASKING_DATA[spKey] || REPTILE_BASKING_DATA["bearded-dragon"];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div>
            <h3 className="font-semibold text-foreground">{t("reptile-basking-temp-guide.ui.reptileBaskingThermalGradientGuide")}</h3>
            <p className="text-xs text-muted-foreground">{t("reptile-basking-temp-guide.ui.fourZoneThermalGradientMatrixAnd")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={unit === "F" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("F")}
              className="h-8 text-xs font-medium"
            >{t("reptile-basking-temp-guide.ui.fahrenheitF")}</Button>
            <Button
              variant={unit === "C" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("C")}
              className="h-8 text-xs font-medium"
            >{t("reptile-basking-temp-guide.ui.celsiusC")}</Button>
          </div>
        </div>

        <div className="mt-4">
          <Label className="text-xs font-medium text-muted-foreground">{t("reptile-basking-temp-guide.ui.selectSpecies")}</Label>
          <Select value={spKey} onValueChange={setSpKey}>
            <SelectTrigger className="mt-1.5 h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(REPTILE_BASKING_DATA).map(([k, v]) => (
                <SelectItem key={k} value={k}>{t(`reptile-basking-temp-guide.ui.species.${k}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-rose-600 dark:text-rose-400 uppercase">{t("reptile-basking-temp-guide.ui.baskingSurfaceTemperatureIRGun")}</span>
            <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              {unit === "F" ? t(`reptile-basking-temp-guide.ui.baskSurfaceF.${spKey}`) : t(`reptile-basking-temp-guide.ui.baskSurfaceC.${spKey}`)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              t("reptile-basking-temp-guide.ui.targetSpecies") <strong className="text-foreground">{t(`reptile-basking-temp-guide.ui.species.${spKey}`)}</strong>
            </p>
          </div>

          <Badge variant="outline" className="text-xs px-3 py-1.5 font-medium">
            t("reptile-basking-temp-guide.ui.overheadHeat") {t(`reptile-basking-temp-guide.ui.primaryHeat.${spKey}`).split("(")[0]}
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-rose-600 dark:text-rose-400 uppercase flex items-center justify-center gap-1">
              <Thermometer className="h-3.5 w-3.5" /> {t("reptile-basking-temp-guide.ui.baskingSpot")}
            </div>
            <div className="mt-1 text-base font-bold text-foreground">{unit === "F" ? t(`reptile-basking-temp-guide.ui.baskSurfaceF.${spKey}`) : t(`reptile-basking-temp-guide.ui.baskSurfaceC.${spKey}`)}</div>
            <div className="text-[10px] text-muted-foreground">{t("reptile-basking-temp-guide.ui.surfaceTemp")}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase">{t("reptile-basking-temp-guide.ui.warmSide")}</div>
            <div className="mt-1 text-base font-bold text-foreground">{unit === "F" ? t(`reptile-basking-temp-guide.ui.warmAmbientF.${spKey}`) : t(`reptile-basking-temp-guide.ui.warmAmbientC.${spKey}`)}</div>
            <div className="text-[10px] text-muted-foreground">{t("reptile-basking-temp-guide.ui.ambientAir")}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400 uppercase">{t("reptile-basking-temp-guide.ui.coolRetreat")}</div>
            <div className="mt-1 text-base font-bold text-foreground">{unit === "F" ? t(`reptile-basking-temp-guide.ui.coolAmbientF.${spKey}`) : t(`reptile-basking-temp-guide.ui.coolAmbientC.${spKey}`)}</div>
            <div className="text-[10px] text-muted-foreground">{t("reptile-basking-temp-guide.ui.ambientAir")}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 uppercase">{t("reptile-basking-temp-guide.ui.nightDrop")}</div>
            <div className="mt-1 text-base font-bold text-foreground">{unit === "F" ? t(`reptile-basking-temp-guide.ui.nightDropF.${spKey}`) : t(`reptile-basking-temp-guide.ui.nightDropC.${spKey}`)}</div>
            <div className="text-[10px] text-muted-foreground">{t("reptile-basking-temp-guide.ui.circadianRest")}</div>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-xs">
          <div className="rounded-xl border p-3 bg-card/80">
            {t("reptile-basking-temp-guide.ui.thermostatController")}
            <span className="text-muted-foreground">{t(`reptile-basking-temp-guide.ui.thermostatType.${spKey}`)}</span>
          </div>

          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-muted-foreground">
            <strong className="text-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-rose-500" /> {t("reptile-basking-temp-guide.ui.husbandryAdvisory")}
            </strong>
            <p className="mt-1 leading-relaxed">{t(`reptile-basking-temp-guide.ui.notes.${spKey}`)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3. BEARDED DRAGON FOOD & NUTRITION CALCULATOR */
export function BeardedDragonFood() {
  const { t } = useTranslation("tools");
  const [lifeStage, setLifeStage] = useState<string>("juvenile");

  const dietStages: Record<string, { bugPct: number; saladPct: number; notes: string }> = {
    hatchling: { bugPct: 80,
      saladPct: 20 },
    juvenile: { bugPct: 60,
      saladPct: 40 },
    subadult: { bugPct: 40,
      saladPct: 60 },
    adult: { bugPct: 20,
      saladPct: 80 },
  };

  const currentStage = dietStages[lifeStage] || dietStages["juvenile"];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <h3 className="font-semibold text-foreground">{t("bearded-dragon-food-calculator.ui.beardedDragonDietPortionNutritionPlanner")}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t("bearded-dragon-food-calculator.ui.calculateExactInsectToGreensRatio")}</p>

        <div className="mt-4">
          <Label className="text-xs font-medium text-muted-foreground">{t("bearded-dragon-food-calculator.ui.selectLifeStageAge")}</Label>
          <Select value={lifeStage} onValueChange={setLifeStage}>
            <SelectTrigger className="mt-1.5 h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hatchling">{t("bearded-dragon-food-calculator.ui.babyHatchling03Months")}</SelectItem>
              <SelectItem value="juvenile">{t("bearded-dragon-food-calculator.ui.juvenile411Months")}</SelectItem>
              <SelectItem value="subadult">{t("bearded-dragon-food-calculator.ui.subAdult1217Months")}</SelectItem>
              <SelectItem value="adult">{t("bearded-dragon-food-calculator.ui.adult18Months")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">{t("bearded-dragon-food-calculator.ui.dietaryRatioBreakdown")}</span>
            <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              {t("bearded-dragon-food-calculator.ui.insectsGreensRatio", { bugPct: currentStage.bugPct, saladPct: currentStage.saladPct })}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              t("bearded-dragon-food-calculator.ui.lifeStage") <strong className="text-foreground">{t(`bearded-dragon-food-calculator.ui.stage.${lifeStage}.name`)} ({t(`bearded-dragon-food-calculator.ui.stage.${lifeStage}.ageRange`)})</strong>
            </p>
          </div>

          <Badge variant="outline" className="text-xs px-3 py-1.5 font-medium">
            {t(`bearded-dragon-food-calculator.ui.stage.${lifeStage}.insectCount`)}
          </Badge>
        </div>

        {/* Visual Ratio Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-amber-600 dark:text-amber-400">{t("bearded-dragon-food-calculator.ui.liveFeeders", { pct: currentStage.bugPct })}</span>
            <span className="text-emerald-600 dark:text-emerald-400">{t("bearded-dragon-food-calculator.ui.saladGreens", { pct: currentStage.saladPct })}</span>
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
          <p className="text-muted-foreground leading-relaxed">{t(`bearded-dragon-food-calculator.ui.stage.${lifeStage}.frequency`)}</p>
        </div>

        {/* Staple Foods & Warning Grid */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Daily Staple Greens:
            </span>
            <p className="text-muted-foreground mt-1 leading-relaxed">{t("bearded-dragon-food-calculator.ui.collardGreensMustardGreensDandelionGreens")}</p>
          </div>

          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3">
            <span className="font-semibold text-destructive flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> Toxic / Avoid Foods:
            </span>
            <p className="text-muted-foreground mt-1 leading-relaxed">{t("bearded-dragon-food-calculator.ui.avocadoRhubarbFirefliesLightningBugsLethal")}</p>
          </div>
        </div>

        {/* Dusting schedule */}
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{t("bearded-dragon-food-calculator.ui.weeklySupplementDustingSchedule")}</span>
          <span>{t("bearded-dragon-food-calculator.ui.plainCalciumWithoutD345")}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────── HORSES ─────────── */
export function HorseBlanketSize() {
  const { t } = useTranslation("tools");
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
      if (clipped === "full") return t("horse-blanket-size-calculator.ui.fillMildFull");
      return t("horse-blanket-size-calculator.ui.fillMildOther");
    }
    if (weatherTemp === "cold") {
      if (clipped === "full") return t("horse-blanket-size-calculator.ui.fillColdFull");
      if (clipped === "trace") return t("horse-blanket-size-calculator.ui.fillColdTrace");
      return t("horse-blanket-size-calculator.ui.fillColdOther");
    }
    // freezing < 20°F / -7°C
    if (clipped === "full") return t("horse-blanket-size-calculator.ui.fillFreezingFull");
    if (clipped === "trace") return t("horse-blanket-size-calculator.ui.fillFreezingTrace");
    return t("horse-blanket-size-calculator.ui.fillFreezingOther");
  };

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="inline-flex rounded-md border p-0.5 text-xs">
              <button type="button" onClick={() => { setUnit("in"); setChestToTail(76); }} className={`px-2.5 py-1 rounded ${unit === "in" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>{t("horse-blanket-size-calculator.ui.inchesUS")}</button>
              <button type="button" onClick={() => { setUnit("cm"); setChestToTail(195); }} className={`px-2.5 py-1 rounded ${unit === "cm" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>{t("horse-blanket-size-calculator.ui.centimetersEU")}</button>
            </div>
          </div>
          <div>
            <Label>{t("horse-blanket-size-calculator.ui.chestToTailMeasurementUnit", { unit })}</Label>
            <Input type="number" min={40} max={260} value={chestToTail} onChange={(e) => setChestToTail(+e.target.value || 0)} className="mt-1.5" />
            <p className="text-xs text-muted-foreground mt-1">{t("horse-blanket-size-calculator.ui.measureFromCenterOfChestAcross")}</p>
          </div>
          <div>
            <Label>{t("horse-blanket-size-calculator.ui.coatClippingStatus")}</Label>
            <Select value={clipped} onValueChange={(v) => setClipped(v as typeof clipped)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unclipped">{t("horse-blanket-size-calculator.ui.unclippedNaturalWinterFurPiloerection")}</SelectItem>
                <SelectItem value="trace">{t("horse-blanket-size-calculator.ui.traceStripClippedUnderNeckBelly")}</SelectItem>
                <SelectItem value="full">{t("horse-blanket-size-calculator.ui.fullBodyHunterClipCompleteCoat")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("horse-blanket-size-calculator.ui.ambientWinterTemperature")}</Label>
            <Select value={weatherTemp} onValueChange={(v) => setWeatherTemp(v as typeof weatherTemp)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">{t("horse-blanket-size-calculator.ui.mildCool4555F7")}</SelectItem>
                <SelectItem value="cold">{t("horse-blanket-size-calculator.ui.coldFrosty2544F4")}</SelectItem>
                <SelectItem value="freezing">{t("horse-blanket-size-calculator.ui.severeFreezingSnow25F4")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("horse-blanket-size-calculator.ui.cm", { usSize, euSizeCm })} label={t("horse-blanket-size-calculator.ui.recommendedBlanketSize")} unit={t("horse-blanket-size-calculator.ui.uK", { ukFeet })} />
          <Rows items={[
            { label: t("horse-blanket-size-calculator.ui.uSStandardSize"), value: t("horse-blanket-size-calculator.ui.sizeInchesCenterOfChestTail", { usSize }) },
            { label: t("horse-blanket-size-calculator.ui.europeanBackLength"), value: t("horse-blanket-size-calculator.ui.cmWithersDock", { euSizeCm }) },
            { label: t("horse-blanket-size-calculator.ui.recommendedThermalFill"), value: getFillRecommendation() },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("horse-blanket-size-calculator.ui.properFitCheck")}</p>
          </div>
        </div>
      }
    />
  );
}

export function HorseStallSize() {
  const { t } = useTranslation("tools");
  const [horseType, setHorseType] = useState("standard");
  const [stallType, setStallType] = useState<"standard" | "foaling">("standard");

  const specs: Record<string, { standardDim: string; standardSqFt: number; minHeightFt: number; doorWidthFt: number; turnoutHrs: number; beddingBags: number; notes: string }> = {
    pony: { standardDim: "10 ft × 10 ft (3.0 × 3.0 m)", standardSqFt: 100, minHeightFt: 9, doorWidthFt: 3.5, turnoutHrs: 4, beddingBags: 3 },
    standard: { standardDim: "12 ft × 12 ft (3.6 × 3.6 m)", standardSqFt: 144, minHeightFt: 10, doorWidthFt: 4.0, turnoutHrs: 4, beddingBags: 4 },
    warmblood: { standardDim: "12 ft × 14 ft (3.6 × 4.2 m)", standardSqFt: 168, minHeightFt: 11, doorWidthFt: 4.0, turnoutHrs: 5, beddingBags: 5 },
    draft: { standardDim: "14 ft × 16 ft (4.2 × 4.8 m)", standardSqFt: 224, minHeightFt: 12, doorWidthFt: 4.5, turnoutHrs: 5, beddingBags: 6 },
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
            <Label>{t("horse-stall-size-calculator.ui.horseBreedHeightClass")}</Label>
            <Select value={horseType} onValueChange={setHorseType}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(specs).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{t(`horse-stall-size-calculator.ui.specs.${k}.name`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("horse-stall-size-calculator.ui.stallUsagePurpose")}</Label>
            <Select value={stallType} onValueChange={(v) => setStallType(v as typeof stallType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">{t("horse-stall-size-calculator.ui.standardDailyBoardingStall")}</SelectItem>
                <SelectItem value="foaling">{t("horse-stall-size-calculator.ui.foalingStallBroodmareNewbornFoalSpace")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={displayDim} label={t("horse-stall-size-calculator.ui.minimumStallFloorDimensions")} unit={t("horse-stall-size-calculator.ui.sqFt", { displaySqFt })} />
          <Rows items={[
            { label: t("horse-stall-size-calculator.ui.minimumCeilingClearance"), value: t("horse-stall-size-calculator.ui.ftPreventsPollStrikeInjury", { minHeightFt: d.minHeightFt }) },
            { label: t("horse-stall-size-calculator.ui.slidingDoorMinimumWidth"), value: t("horse-stall-size-calculator.ui.ftAvoidsHipKnocks", { doorWidthFt: d.doorWidthFt }) },
            { label: t("horse-stall-size-calculator.ui.freshShavingsBeddingDepth"), value: `4–6 inches (≈ ${d.beddingBags + (isFoaling ? 2 : 0)} fresh pine bags)` },
            { label: t("horse-stall-size-calculator.ui.mandatoryDailyTurnout"), value: t("horse-stall-size-calculator.ui.hoursInPasture", { turnoutHrs: d.turnoutHrs }) },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("horse-stall-size-calculator.ui.barnEngineeringNoteFull", { notes: t(`horse-stall-size-calculator.ui.specs.${horseType}.notes`) })}</p>
          </div>
        </div>
      }
    />
  );
}

export function HorseHoofTrimming() {
  const { t } = useTranslation("tools");
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
            <Label>{t("horse-hoof-trimming-schedule.ui.shoeingConfiguration")}</Label>
            <Select value={shoeStatus} onValueChange={(v) => setShoeStatus(v as typeof shoeStatus)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="shod">{t("horse-hoof-trimming-schedule.ui.steelAluminumShoesFrontsOrFull")}</SelectItem>
                <SelectItem value="barefoot">{t("horse-hoof-trimming-schedule.ui.barefootPerformanceHoofBoots")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("horse-hoof-trimming-schedule.ui.workloadRidingSurface")}</Label>
            <Select value={workload} onValueChange={(v) => setWorkload(v as typeof workload)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pasture">{t("horse-hoof-trimming-schedule.ui.pasturePetLightTurnoutSoftGrass")}</SelectItem>
                <SelectItem value="light">{t("horse-hoof-trimming-schedule.ui.pleasureTrailLightArena13")}</SelectItem>
                <SelectItem value="performance">{t("horse-hoof-trimming-schedule.ui.highImpactPerformanceJumpingReiningEndurance")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("horse-hoof-trimming-schedule.ui.seasonGrowthRateFactor")}</Label>
            <Select value={season} onValueChange={(v) => setSeason(v as typeof season)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="summer">{t("horse-hoof-trimming-schedule.ui.springSummerAcceleratedGrowth810")}</SelectItem>
                <SelectItem value="winter">{t("horse-hoof-trimming-schedule.ui.autumnWinterSlowerGrowth56")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("horse-hoof-trimming-schedule.ui.everyWeeks", { weeks })} label={t("horse-hoof-trimming-schedule.ui.farrierTrimResetInterval")} />
          <Rows items={[
            { label: t("horse-hoof-trimming-schedule.ui.hoofWallGrowthVelocity"), value: season === "summer" ? t("horse-hoof-trimming-schedule.ui.growthSummer") : t("horse-hoof-trimming-schedule.ui.growthWinter") },
            { label: t("horse-hoof-trimming-schedule.ui.biomechanicalRiskThreshold"), value: t("horse-hoof-trimming-schedule.ui.waiting8WeeksShiftsLoadOnto") },
            { label: t("horse-hoof-trimming-schedule.ui.redFlagSignsToBookEarly"), value: t("horse-hoof-trimming-schedule.ui.flaredWallsLooseClinchesUnderRun") },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("horse-hoof-trimming-schedule.ui.veterinaryBiomechanicsRule")}</p>
          </div>
        </div>
      }
    />
  );
}

/* ─────────── FARM ─────────── */
export function ChickenFeed() {
  const { t } = useTranslation("tools");
  const [birds, setBirds] = useState(8);
  const [stage, setStage] = useState<"chick" | "grower" | "layer" | "broiler">("layer");
  const [unit, setUnit] = useState<"lb" | "kg">("lb");

  const feedSpecs = {
    chick: { gramsPerDay: 30 },
    grower: { gramsPerDay: 75 },
    layer: { gramsPerDay: 120 },
    broiler: { gramsPerDay: 160 },
  }[stage];

  const dailyGrams = birds * feedSpecs.gramsPerDay;
  const dailyLb = (dailyGrams / 453.592).toFixed(2);
  const dailyKg = (dailyGrams / 1000).toFixed(2);
  const monthlyLb = (Number(dailyLb) * 30).toFixed(1);
  const monthlyKg = (Number(dailyKg) * 30).toFixed(1);
  const bagsPerMonth50lb = (Number(monthlyLb) / 50).toFixed(1);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="inline-flex rounded-md border p-0.5 text-xs">
              <button type="button" onClick={() => setUnit("lb")} className={`px-2.5 py-1 rounded ${unit === "lb" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>{t("chicken-feed-calculator.ui.poundsLb")}</button>
              <button type="button" onClick={() => setUnit("kg")} className={`px-2.5 py-1 rounded ${unit === "kg" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>{t("chicken-feed-calculator.ui.kilogramsKg")}</button>
            </div>
          </div>
          <div>
            <Label>{t("chicken-feed-calculator.ui.flockBirdCount")}</Label>
            <Input type="number" min={1} max={500} value={birds} onChange={(e) => setBirds(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("chicken-feed-calculator.ui.flockProductionLifeStage")}</Label>
            <Select value={stage} onValueChange={(v) => setStage(v as typeof stage)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="chick">{t("chicken-feed-calculator.ui.chicks06WeeksBrooderStarter")}</SelectItem>
                <SelectItem value="grower">{t("chicken-feed-calculator.ui.growerPullets718WeeksPre")}</SelectItem>
                <SelectItem value="layer">{t("chicken-feed-calculator.ui.activeLayingHens19WeeksIn")}</SelectItem>
                <SelectItem value="broiler">{t("chicken-feed-calculator.ui.meatbirdsBroilersFastGrowth")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={unit === "lb" ? t("chicken-feed-calculator.ui.dailyLbs", { v: dailyLb }) : t("chicken-feed-calculator.ui.dailyKg", { v: dailyKg })} label={t("chicken-feed-calculator.ui.dailyFlockFeedIntake")} unit={unit === "lb" ? t("chicken-feed-calculator.ui.monthlyLbs", { v: monthlyLb }) : t("chicken-feed-calculator.ui.monthlyKg", { v: monthlyKg })} />
          <Rows items={[
            { label: t("chicken-feed-calculator.ui.n50LbCommercialFeedBags"), value: t("chicken-feed-calculator.ui.bagsPerMonth50Lb22", { bagsPerMonth50lb }) },
            { label: t("chicken-feed-calculator.ui.targetDietaryCrudeProtein"), value: t(`chicken-feed-calculator.ui.specs.${stage}.protein`) },
            { label: t("chicken-feed-calculator.ui.calciumMineralStandard"), value: t(`chicken-feed-calculator.ui.specs.${stage}.calcium`) },
            { label: t("chicken-feed-calculator.ui.insolubleGizzardGrit"), value: t(`chicken-feed-calculator.ui.specs.${stage}.grit`) },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("chicken-feed-calculator.ui.scratchGrainTreatRule")}</p>
          </div>
        </div>
      }
    />
  );
}

export function GoatWater() {
  const { t } = useTranslation("tools");
  const [goats, setGoats] = useState(4);
  const [temp, setTemp] = useState<"cool" | "mild" | "hot">("mild");
  const [goatType, setGoatType] = useState<"wether" | "dairy" | "meat">("dairy");

  const basePerGoat = goatType === "dairy" ? 3.5 : goatType === "meat" ? 2.5 : 1.75;
  const tempMultiplier = temp === "hot" ? 1.7 : temp === "cool" ? 0.85 : 1.0;
  const dailyGal = Math.round(goats * basePerGoat * tempMultiplier);
  const dailyLiters = Math.round(dailyGal * 3.78541);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t("goat-water-calculator.ui.herdSizeNumberOfGoats")}</Label>
            <Input type="number" min={1} max={200} value={goats} onChange={(e) => setGoats(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("goat-water-calculator.ui.herdClassProductivity")}</Label>
            <Select value={goatType} onValueChange={(v) => setGoatType(v as typeof goatType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="wether">{t("goat-water-calculator.ui.dryDoesCastratedWethersPets")}</SelectItem>
                <SelectItem value="dairy">{t("goat-water-calculator.ui.dairyDoesInActiveMilkProduction")}</SelectItem>
                <SelectItem value="meat">{t("goat-water-calculator.ui.meatGoatsBoerKiko")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("goat-water-calculator.ui.ambientTemperatureWeather")}</Label>
            <Select value={temp} onValueChange={(v) => setTemp(v as typeof temp)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cool">{t("goat-water-calculator.ui.winterFreezing40F4C")}</SelectItem>
                <SelectItem value="mild">{t("goat-water-calculator.ui.moderateSpringAutumn4575F")}</SelectItem>
                <SelectItem value="hot">{t("goat-water-calculator.ui.summerHeatwave85F29C")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("goat-water-calculator.ui.gallonsDay", { dailyGal })} label={t("goat-water-calculator.ui.dailyHerdWaterRequirement")} unit={t("goat-water-calculator.ui.litersDay", { dailyLiters })} />
          <Rows items={[
            { label: t("goat-water-calculator.ui.perGoatDailyVolume"), value: t("goat-water-calculator.ui.galLPerGoat", { v0: (dailyGal / goats).toFixed(1), v1: ((dailyGal * 3.785) / goats).toFixed(1) }) },
            { label: t("goat-water-calculator.ui.bucketEquivalents"), value: t("goat-water-calculator.ui.standard5GallonBuckets", { v0: Math.ceil(dailyGal / 5) }) },
            { label: t("goat-water-calculator.ui.sanitationOdorRule"), value: t("goat-water-calculator.ui.scrubTroughsDailyGoatsRefuseSaliva") },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("goat-water-calculator.ui.goatHydrationBehavior")}</p>
          </div>
        </div>
      }
    />
  );
}

export function SheepFeed() {
  const { t } = useTranslation("tools");
  const [sheep, setSheep] = useState(6);
  const [stage, setStage] = useState<"maintenance" | "early_gest" | "late_gest" | "lactating">("maintenance");
  const [unit, setUnit] = useState<"lb" | "kg">("lb");

  const lbsPerHead = {
    maintenance: { forage: 3.5, grain: 0 },
    early_gest: { forage: 4.0, grain: 0.25 },
    late_gest: { forage: 4.5, grain: 1.0 },
    lactating: { forage: 5.5, grain: 1.75 },
  }[stage];

  const totalForageLb = Math.round(sheep * lbsPerHead.forage);
  const totalGrainLb = (sheep * lbsPerHead.grain).toFixed(1);
  const displayForage = unit === "lb" ? `${totalForageLb} lbs` : `${(totalForageLb / 2.20462).toFixed(1)} kg`;
  const displayGrain = unit === "lb" ? `${totalGrainLb} lbs` : `${(Number(totalGrainLb) / 2.20462).toFixed(1)} kg`;

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="inline-flex rounded-md border p-0.5 text-xs">
              <button type="button" onClick={() => setUnit("lb")} className={`px-2.5 py-1 rounded ${unit === "lb" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>{t("sheep-feed-calculator.ui.poundsLb")}</button>
              <button type="button" onClick={() => setUnit("kg")} className={`px-2.5 py-1 rounded ${unit === "kg" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>{t("sheep-feed-calculator.ui.kilogramsKg")}</button>
            </div>
          </div>
          <div>
            <Label>{t("sheep-feed-calculator.ui.flockEweRamCount")}</Label>
            <Input type="number" min={1} max={500} value={sheep} onChange={(e) => setSheep(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("sheep-feed-calculator.ui.productionBreedingStage")}</Label>
            <Select value={stage} onValueChange={(v) => setStage(v as typeof stage)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">{t("sheep-feed-calculator.ui.dryEweRamMaintenanceNonPregnant")}</SelectItem>
                <SelectItem value="early_gest">{t("sheep-feed-calculator.ui.earlyGestationFirst100Days")}</SelectItem>
                <SelectItem value="late_gest">{t("sheep-feed-calculator.ui.lateGestationLast46Weeks")}</SelectItem>
                <SelectItem value="lactating">{t("sheep-feed-calculator.ui.lactatingEweNursingLambsPeakDemand")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("sheep-feed-calculator.ui.forageDay", { displayForage })} label={t("sheep-feed-calculator.ui.dailyFlockForageRequirement")} unit={t("sheep-feed-calculator.ui.grainDay", { displayGrain })} />
          <Rows items={[
            { label: t("sheep-feed-calculator.ui.perHeadRationStandard"), value: t(`sheep-feed-calculator.ui.desc.${stage}`) },
            { label: t("sheep-feed-calculator.ui.latePregnancyToxemiaAlert"), value: stage === "late_gest" ? t("sheep-feed-calculator.ui.toxemiaMandatory") : t("sheep-feed-calculator.ui.forageMaintenance") },
            { label: t("sheep-feed-calculator.ui.mineralSaltRequirement"), value: t("sheep-feed-calculator.ui.provideSpecializedLooseSHEEPMineralZero") },
          ]} />
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            {t("sheep-feed-calculator.ui.cRITICALCOPPERTOXICITYWARNING")}
          </div>
        </div>
      }
    />
  );
}

export function DuckFeed() {
  const { t } = useTranslation("tools");
  const [ducks, setDucks] = useState(6);
  const [stage, setStage] = useState<"duckling" | "grower" | "layer" | "winter">("layer");
  const [unit, setUnit] = useState<"lb" | "kg">("lb");

  const specs = {
    duckling: { grams: 50 },
    grower: { grams: 130 },
    layer: { grams: 180 },
    winter: { grams: 160 },
  }[stage];

  const dailyGrams = ducks * specs.grams;
  const dailyLb = (dailyGrams / 453.592).toFixed(2);
  const dailyKg = (dailyGrams / 1000).toFixed(2);
  const monthlyLb = (Number(dailyLb) * 30).toFixed(1);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="flex justify-end">
            <div className="inline-flex rounded-md border p-0.5 text-xs">
              <button type="button" onClick={() => setUnit("lb")} className={`px-2.5 py-1 rounded ${unit === "lb" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>{t("duck-feed-calculator.ui.poundsLb")}</button>
              <button type="button" onClick={() => setUnit("kg")} className={`px-2.5 py-1 rounded ${unit === "kg" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>{t("duck-feed-calculator.ui.kilogramsKg")}</button>
            </div>
          </div>
          <div>
            <Label>{t("duck-feed-calculator.ui.flockWaterfowlCount")}</Label>
            <Input type="number" min={1} max={200} value={ducks} onChange={(e) => setDucks(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("duck-feed-calculator.ui.lifeProductionStage")}</Label>
            <Select value={stage} onValueChange={(v) => setStage(v as typeof stage)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="duckling">{t("duck-feed-calculator.ui.ducklings03WeeksBrooderStarter")}</SelectItem>
                <SelectItem value="grower">{t("duck-feed-calculator.ui.growingDucklings418WeeksPre")}</SelectItem>
                <SelectItem value="layer">{t("duck-feed-calculator.ui.activeLayingDucksPekinKhakiCampbell")}</SelectItem>
                <SelectItem value="winter">{t("duck-feed-calculator.ui.nonLayingWinterFlockMaintenance")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={unit === "lb" ? t("duck-feed-calculator.ui.dailyLbs", { v: dailyLb }) : t("duck-feed-calculator.ui.dailyKg", { v: dailyKg })} label={t("duck-feed-calculator.ui.dailyWaterfowlFeedIntake")} unit={t("duck-feed-calculator.ui.monthlyLbs", { monthlyLb })} />
          <Rows items={[
            { label: t("duck-feed-calculator.ui.nutritionalProteinProfile"), value: t(`duck-feed-calculator.ui.specs.${stage}.protein`) },
            { label: t("duck-feed-calculator.ui.niacinVitaminB3Target"), value: t(`duck-feed-calculator.ui.specs.${stage}.niacin`) },
            { label: t("duck-feed-calculator.ui.pelletVsMashMandate"), value: t("duck-feed-calculator.ui.alwaysFeedPELLETFormDryMashes") },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("duck-feed-calculator.ui.niacinWaterRule")}</p>
          </div>
        </div>
      }
    />
  );
}

/* ─────────── GENERAL ─────────── */
export function PetHydrationCalculator() {
  const { t } = useTranslation("tools");
  const [species, setSpecies] = useState("dog");
  const [kg, setKg] = useState(15);
  const mlPerKg: Record<string, number> = { dog: 60, cat: 55, rabbit: 100, "guinea-pig": 100, bird: 50, ferret: 75 };
  const ml = Math.round(kg * mlPerKg[species]);
  return (
    <CalculatorLayout
      form={<div className="space-y-4">
        <SelectField label={t("pet-hydration-calculator.ui.speciesLabel")} value={species} onChange={setSpecies} options={Object.keys(mlPerKg)} optionLabel={(o) => t(`pet-hydration-calculator.ui.species.${o}`)} />
        <NumberField label={t("pet-hydration-calculator.ui.weightKg")} value={kg} onChange={setKg} step={0.5} />
      </div>}
      result={<div className="space-y-4">
        <Big value={t("pet-hydration-calculator.ui.ml", { ml })} label={t("pet-hydration-calculator.ui.dailyWaterTarget")} />
        <Note>{t("pet-hydration-calculator.ui.wetFoodAndFreshProduceContribute")}</Note>
      </div>}
    />
  );
}

export function TrainingTreatPlanner() {
  const { t } = useTranslation("tools");
  const [dailyKcal, setDailyKcal] = useState(400);
  const treatCap = Math.round(dailyKcal * 0.1);
  const perTreat = 3;
  const maxTreats = Math.floor(treatCap / perTreat);
  return (
    <CalculatorLayout
      form={<NumberField label={t("training-treat-planner.ui.petSDailyCalorieNeedsKcal")} value={dailyKcal} onChange={setDailyKcal} min={50} />}
      result={<div className="space-y-4">
        <Big value={t("training-treat-planner.ui.kcalDay", { treatCap })} label={t("training-treat-planner.ui.maxTrainingTreatAllowance")} />
        <Note>{t("training-treat-planner.ui.maxTreatsStandard3KcalTreatsReduce", { maxTreats })}</Note>
      </div>}
    />
  );
}
