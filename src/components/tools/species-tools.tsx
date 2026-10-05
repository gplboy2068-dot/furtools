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
import { useTranslation } from "react-i18next";

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
interface BirdCageData {  singleMin: string;
  singleDimensions: { w: number; d: number; h: number };
  minPerchCount: number;
  outOfCageMinHours: number;
}

const BIRD_CAGES: Record<string, BirdCageData> = {
  finch: {  singleMin: "30\" W × 18\" D × 18\" H", singleDimensions: { w: 30, d: 18, h: 18 },   minPerchCount: 3, outOfCageMinHours: 0, },
  canary: {  singleMin: "24\" W × 16\" D × 18\" H", singleDimensions: { w: 24, d: 16, h: 18 },   minPerchCount: 3, outOfCageMinHours: 1, },
  budgie: {  singleMin: "18\" W × 18\" D × 24\" H", singleDimensions: { w: 18, d: 18, h: 24 },   minPerchCount: 3, outOfCageMinHours: 2, },
  lovebird: {  singleMin: "24\" W × 24\" D × 24\" H", singleDimensions: { w: 24, d: 24, h: 24 },   minPerchCount: 3, outOfCageMinHours: 3, },
  cockatiel: {  singleMin: "24\" W × 24\" D × 30\" H", singleDimensions: { w: 24, d: 24, h: 30 },   minPerchCount: 4, outOfCageMinHours: 3, },
  conure: {  singleMin: "30\" W × 24\" D × 36\" H", singleDimensions: { w: 30, d: 24, h: 36 },   minPerchCount: 4, outOfCageMinHours: 4, },
  "african-grey": {  singleMin: "36\" W × 28\" D × 48\" H", singleDimensions: { w: 36, d: 28, h: 48 },   minPerchCount: 5, outOfCageMinHours: 4, },
  cockatoo: {  singleMin: "40\" W × 32\" D × 54\" H", singleDimensions: { w: 40, d: 32, h: 54 },   minPerchCount: 5, outOfCageMinHours: 5, },
  macaw: {  singleMin: "48\" W × 36\" D × 66\" H", singleDimensions: { w: 48, d: 36, h: 66 },   minPerchCount: 5, outOfCageMinHours: 5, },
};

export function BirdCageSize() {
  const { t } = useTranslation("tools");
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
            <Label>{t("bird-cage-size-calculator.ui.birdSpecies")}</Label>
            <Select value={sp} onValueChange={setSp}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(BIRD_CAGES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{t(`bird-cage-size-calculator.ui.species.${k}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("bird-cage-size-calculator.ui.numberOfBirdsInEnclosure")}</Label>
            <Input type="number" min={1} max={12} value={count} onChange={(e) => setCount(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={`${scaledW}" W × ${scaledD}" D × ${scaledH}" H`} label={t("bird-cage-size-calculator.ui.minEnclosureDimensions", { count, birdWord: count > 1 ? t("bird-cage-size-calculator.ui.birds") : t("bird-cage-size-calculator.ui.bird") })} unit={`≈ ${totalVolumeCuFt} cu ft`} />
          <Rows items={[
            { label: t("bird-cage-size-calculator.ui.maxSafeBarSpacing"), value: t(`bird-cage-size-calculator.ui.barSpacing.${sp}`) },
            { label: t("bird-cage-size-calculator.ui.barOrientationLabel"), value: t(`bird-cage-size-calculator.ui.barOrientation.${sp}`) },
            { label: t("bird-cage-size-calculator.ui.recommendedPerches"), value: t("bird-cage-size-calculator.ui.variedNaturalBranches", { v0: Math.round(d.minPerchCount * (count > 1 ? 1.4 : 1)) }) },
            { label: t("bird-cage-size-calculator.ui.dailyOutOfCageFlight"), value: t("bird-cage-size-calculator.ui.hoursDaily", { outOfCageMinHours: d.outOfCageMinHours }) },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("bird-cage-size-calculator.ui.ethologicalNote")} {t(`bird-cage-size-calculator.ui.speciesNote.${sp}`)}</p>
            <p className="text-destructive font-medium">{t("bird-cage-size-calculator.ui.warningNeverUseRoundCagesLacks")}</p>
          </div>
        </div>
      }
    />
  );
}

interface BirdDietProfile {  avgWeightGrams: number;
  pelletRatio: number;
  freshRatio: number;
  fruitRatio: number;
  seedNutRatio: number;
  specialDietNote?: string;
}

const BIRD_DIETS: Record<string, BirdDietProfile> = {
  finch: {  avgWeightGrams: 18, pelletRatio: 0.40, freshRatio: 0.35, fruitRatio: 0.05, seedNutRatio: 0.20, },
  budgie: {  avgWeightGrams: 35, pelletRatio: 0.60, freshRatio: 0.25, fruitRatio: 0.05, seedNutRatio: 0.10, },
  lovebird: {  avgWeightGrams: 50, pelletRatio: 0.65, freshRatio: 0.25, fruitRatio: 0.05, seedNutRatio: 0.05, },
  cockatiel: {  avgWeightGrams: 95, pelletRatio: 0.60, freshRatio: 0.25, fruitRatio: 0.05, seedNutRatio: 0.10, },
  conure: {  avgWeightGrams: 100, pelletRatio: 0.65, freshRatio: 0.25, fruitRatio: 0.05, seedNutRatio: 0.05, },
  "african-grey": {  avgWeightGrams: 420, pelletRatio: 0.70, freshRatio: 0.20, fruitRatio: 0.05, seedNutRatio: 0.05, },
  amazon: {  avgWeightGrams: 400, pelletRatio: 0.70, freshRatio: 0.22, fruitRatio: 0.05, seedNutRatio: 0.03, },
  eclectus: {  avgWeightGrams: 430, pelletRatio: 0.15, freshRatio: 0.60, fruitRatio: 0.20, seedNutRatio: 0.05, },
  cockatoo: {  avgWeightGrams: 550, pelletRatio: 0.70, freshRatio: 0.22, fruitRatio: 0.05, seedNutRatio: 0.03, },
  macaw: {  avgWeightGrams: 1100, pelletRatio: 0.60, freshRatio: 0.20, fruitRatio: 0.05, seedNutRatio: 0.15, },
};

export function BirdFood({ slug }: { slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.BirdFood";
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
            <Label>{t(`${p}.ui.birdSpecies`)}</Label>
            <Select value={sp} onValueChange={setSp}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(BIRD_DIETS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{t(`${p}.ui.species.${k}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t(`${p}.ui.lifeStageEnergyExpenditure`)}</Label>
            <Select value={activity} onValueChange={(v) => setActivity(v as typeof activity)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">{t(`${p}.ui.companionBirdStandardInCageModest`)}</SelectItem>
                <SelectItem value="flighted">{t(`${p}.ui.activeFlightedAviaryBird20Calories`)}</SelectItem>
                <SelectItem value="breeding">{t(`${p}.ui.moltingBreedingBird40ProteinEnergy`)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t(`${p}.ui.g`, { totalGrams })} label={t(`${p}.ui.totalDailyDietaryTarget`)} unit={t(`${p}.ui.ozDay`, { v0: (totalGrams / 28.35).toFixed(1) })} />
          <Rows items={[
            { label: t(`${p}.ui.highQualityPellets`), value: t(`${p}.ui.g2`, { pelletGrams, v0: Math.round(d.pelletRatio * 100) }) },
            { label: t(`${p}.ui.freshDarkLeafyGreensVeggies`), value: t(`${p}.ui.g3`, { freshGrams, v0: Math.round(d.freshRatio * 100) }) },
            { label: t(`${p}.ui.lowSugarFruitsBerries`), value: t(`${p}.ui.g4`, { fruitGrams, v0: Math.round(d.fruitRatio * 100) }) },
            { label: t(`${p}.ui.healthySeedsInShellNuts`), value: t(`${p}.ui.g5`, { seedNutGrams, v0: Math.round(d.seedNutRatio * 100) }) },
          ]} />
          {d.specialDietNote && (
            <div className="rounded-lg bg-primary/10 p-3 text-xs text-primary font-medium">
              💡 {t(`${p}.ui.dietNote.${sp}`)}
            </div>
          )}
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            {t(`${p}.ui.strictlyLethalToxicFoods`)} Avocado (*persin* poison), Chocolate (*theobromine*), Caffeine, Alcohol, Apple seeds/Fruit pits (cyanide), Onions/Garlic, and Salty junk food.
          </div>
        </div>
      }
    />
  );
}

interface BirdLifespanProfile {  captiveMedian: number;
  captiveMax: number;
  ownerEstatePlanning: boolean;
}

const BIRD_LIFE_PROFILES: Record<string, BirdLifespanProfile> = {
  finch: {   captiveMedian: 7, captiveMax: 12, ownerEstatePlanning: false, },
  canary: {   captiveMedian: 10, captiveMax: 15, ownerEstatePlanning: false, },
  budgie: {   captiveMedian: 8, captiveMax: 15, ownerEstatePlanning: false, },
  lovebird: {   captiveMedian: 15, captiveMax: 20, ownerEstatePlanning: false, },
  cockatiel: {   captiveMedian: 18, captiveMax: 28, ownerEstatePlanning: false, },
  conure: {   captiveMedian: 22, captiveMax: 32, ownerEstatePlanning: true, },
  "african-grey": {   captiveMedian: 45, captiveMax: 65, ownerEstatePlanning: true, },
  amazon: {   captiveMedian: 50, captiveMax: 70, ownerEstatePlanning: true, },
  cockatoo: {   captiveMedian: 55, captiveMax: 75, ownerEstatePlanning: true, },
  macaw: {   captiveMedian: 60, captiveMax: 85, ownerEstatePlanning: true, },
};

export function BirdLifespan() {
  const { t } = useTranslation("tools");
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
            <Label>{t("bird-lifespan-estimator.ui.birdSpecies")}</Label>
            <Select value={sp} onValueChange={setSp}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(BIRD_LIFE_PROFILES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{t(`bird-lifespan-estimator.ui.species.${k}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("bird-lifespan-estimator.ui.husbandryQualityPreventiveCareTier")}</Label>
            <Select value={careTier} onValueChange={(v) => setCareTier(v as typeof careTier)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="optimal">{t("bird-lifespan-estimator.ui.optimalTier70PelletsDailyFlight")}</SelectItem>
                <SelectItem value="standard">{t("bird-lifespan-estimator.ui.suboptimalStandardHighSeedDietModerate")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={projectedYears} label={t("bird-lifespan-estimator.ui.projectedCaptiveLifespan")} unit={t("bird-lifespan-estimator.ui.years")} />
          <Rows items={[
            { label: t("bird-lifespan-estimator.ui.wildNaturalLifespan"), value: t(`bird-lifespan-estimator.ui.wildLifespan.${sp}`) },
            { label: t("bird-lifespan-estimator.ui.recordVerifiedCaptiveAge"), value: t("bird-lifespan-estimator.ui.years2", { captiveMax: d.captiveMax }) },
            { label: t("bird-lifespan-estimator.ui.keyVeterinaryFocus"), value: t(`bird-lifespan-estimator.ui.healthScreenings.${sp}`) },
          ]} />
          {d.ownerEstatePlanning && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
{t("bird-lifespan-estimator.ui.lifetimeGuardianshipNotice")}
            </div>
          )}
        </div>
      }
    />
  );
}

export function BirdWingClipGuide({ slug }: { slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.BirdWingClipGuide";
  const [style, setStyle] = useState<"none" | "conservative" | "aggressive">("none");
  const advice: Record<string, { title: string; lines: string[]; status: "safe" | "warning" | "danger" }> = {
    none: {
      title: t(`${p}.ui.advice.none.title`),
      status: "safe",
      lines: [
      t(`${p}.ui.advice.none.lines.0`),
      t(`${p}.ui.advice.none.lines.1`),
      t(`${p}.ui.advice.none.lines.2`),
      ],
    },
    conservative: {
      title: t(`${p}.ui.advice.conservative.title`),
      status: "warning",
      lines: [
      t(`${p}.ui.advice.conservative.lines.0`),
      t(`${p}.ui.advice.conservative.lines.1`),
      t(`${p}.ui.advice.conservative.lines.2`),
      ],
    },
    aggressive: {
      title: t(`${p}.ui.advice.aggressive.title`),
      status: "danger",
      lines: [
      t(`${p}.ui.advice.aggressive.lines.0`),
      t(`${p}.ui.advice.aggressive.lines.1`),
      t(`${p}.ui.advice.aggressive.lines.2`),
      ],
    },
  };

  const cur = advice[style];

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t(`${p}.ui.flightManagementStrategy`)}</Label>
            <Select value={style} onValueChange={(v) => setStyle(v as typeof style)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t(`${p}.ui.fullFlightFlightedWithBirdProofing`)}</SelectItem>
                <SelectItem value="conservative">{t(`${p}.ui.conservativeSymmetricalMicroClip`)}</SelectItem>
                <SelectItem value="aggressive">{t(`${p}.ui.severeHeavyAsymmetricalClipHazardAlert`)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={cur.title} label={t(`${p}.ui.flightManagementAssessment`)} />
          <Bullets lines={cur.lines} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t(`${p}.ui.firstTimeProtocol`)} Never attempt wing clipping without prior in-person instruction from an avian veterinarian. Always have styptic powder or cornstarch ready in case a growing blood feather is accidentally nicked.</p>
          </div>
        </div>
      }
    />
  );
}

/* ─────────── FISH ─────────── */
export function AquariumVolume() {
  const { t } = useTranslation("tools");
  const [L, setL] = useState(36); const [W, setW] = useState(18); const [H, setH] = useState(20);
  const gal = (L * W * H) / 231;
  const actual = gal * 0.9;
  return (
    <CalculatorLayout
      form={<>
        <div className="grid grid-cols-3 gap-3">
          <div><Label>{t("aquarium-volume-calculator.ui.lengthIn")}</Label><Input type="number" value={L} onChange={(e) => setL(+e.target.value || 0)} className="mt-1.5" /></div>
          <div><Label>{t("aquarium-volume-calculator.ui.widthIn")}</Label><Input type="number" value={W} onChange={(e) => setW(+e.target.value || 0)} className="mt-1.5" /></div>
          <div><Label>{t("aquarium-volume-calculator.ui.heightIn")}</Label><Input type="number" value={H} onChange={(e) => setH(+e.target.value || 0)} className="mt-1.5" /></div>
        </div>
      </>}
      result={<div className="space-y-4">
        <Big value={`${actual.toFixed(1)} gal`} label={t("aquarium-volume-calculator.ui.actualWaterVolume")} unit={t("aquarium-volume-calculator.ui.liters", { v0: (actual * 3.785).toFixed(0) })} />
        <Rows items={[
          { label: t("aquarium-volume-calculator.ui.dryVolume"), value: `${gal.toFixed(1)} gal` },
          { label: t("aquarium-volume-calculator.ui.after10Displacement"), value: `${actual.toFixed(1)} gal` },
        ]} />
      </div>}
    />
  );
}

export function FishStocking() {
  const { t } = useTranslation("tools");
  const [gal, setGal] = useState(20);
  const [inches, setInches] = useState(6);
  const [turnover, setTurnover] = useState(5);
  const bio = Math.min(100, Math.round((inches / gal) * 100 * (5 / Math.max(turnover, 1))));
  const label = bio < 60 ? t("fish-stocking-calculator.ui.comfortable") : bio < 80 ? t("fish-stocking-calculator.ui.fullButOk") : bio < 100 ? t("fish-stocking-calculator.ui.crowded") : t("fish-stocking-calculator.ui.overstocked");
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("fish-stocking-calculator.ui.waterVolumeGal")}</Label><Input type="number" value={gal} onChange={(e) => setGal(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t("fish-stocking-calculator.ui.combinedAdultFishLengthIn")}</Label><Input type="number" value={inches} onChange={(e) => setInches(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t("fish-stocking-calculator.ui.filterTurnoverTankVolumeHr")}</Label><Input type="number" value={turnover} onChange={(e) => setTurnover(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-4">
        <Big value={t("fish-stocking-calculator.ui.text", { bio })} label={t("fish-stocking-calculator.ui.bioload")} unit={label} />
        <p className="text-sm text-muted-foreground text-center">{t("fish-stocking-calculator.ui.under80IsASafeLong")}</p>
      </div>}
    />
  );
}

export function TankCyclingTracker() {
  const { t } = useTranslation("tools");
  const [nh3, setNh3] = useState(0);
  const [no2, setNo2] = useState(0);
  const [no3, setNo3] = useState(20);
  const status =
    nh3 === 0 && no2 === 0 && no3 > 5 ? t("tank-cycling-tracker.ui.cycledReadyForFish") :
    nh3 > 0 && no2 === 0 ? t("tank-cycling-tracker.ui.ammoniaStageEarly") :
    no2 > 0 ? t("tank-cycling-tracker.ui.nitriteSpikeKeepGoing") :
    t("tank-cycling-tracker.ui.stillCyclingTestDaily");
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("tank-cycling-tracker.ui.ammoniaPpm")}</Label><Input type="number" step={0.25} value={nh3} onChange={(e) => setNh3(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t("tank-cycling-tracker.ui.nitritePpm")}</Label><Input type="number" step={0.25} value={no2} onChange={(e) => setNo2(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t("tank-cycling-tracker.ui.nitratePpm")}</Label><Input type="number" value={no3} onChange={(e) => setNo3(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<Big value={status} label={t("tank-cycling-tracker.ui.cycleStatus")} />}
    />
  );
}

export function WaterChangeScheduler() {
  const { t } = useTranslation("tools");
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
        <div><Label>{t("water-change-scheduler.ui.tankSizeGal")}</Label><Input type="number" value={gal} onChange={(e) => setGal(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t("water-change-scheduler.ui.stocking")}</Label>
          <Select value={load} onValueChange={(v: "light" | "medium" | "heavy") => setLoad(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t("water-change-scheduler.ui.light")}</SelectItem><SelectItem value="medium">{t("water-change-scheduler.ui.medium")}</SelectItem><SelectItem value="heavy">{t("water-change-scheduler.ui.heavy")}</SelectItem>
            </SelectContent></Select></div>
        <div><Label>{t("water-change-scheduler.ui.plants")}</Label>
          <Select value={planted} onValueChange={(v: "none" | "some" | "dense") => setPlanted(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t("water-change-scheduler.ui.none")}</SelectItem><SelectItem value="some">{t("water-change-scheduler.ui.some")}</SelectItem><SelectItem value="dense">{t("water-change-scheduler.ui.dense")}</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<Big value={t("water-change-scheduler.ui.weekly", { pct })} label={t("water-change-scheduler.ui.recommendedChange")} unit={t("water-change-scheduler.ui.galEachWeek", { vol })} />}
    />
  );
}

export function FishFood() {
  const { t } = useTranslation("tools");
  const [count, setCount] = useState(6);
  const [size, setSize] = useState<"nano" | "small" | "medium" | "large">("small");
  const gPer = { nano: 0.05, small: 0.15, medium: 0.5, large: 2 }[size];
  const total = (count * gPer).toFixed(2);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("fish-food-calculator.ui.numberOfFish")}</Label><Input type="number" min={1} value={count} onChange={(e) => setCount(+e.target.value || 1)} className="mt-1.5" /></div>
        <div><Label>{t("fish-food-calculator.ui.adultSize")}</Label>
          <Select value={size} onValueChange={(v: "nano" | "small" | "medium" | "large") => setSize(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="nano">{t("fish-food-calculator.ui.nano1In")}</SelectItem>
              <SelectItem value="small">{t("fish-food-calculator.ui.small23In")}</SelectItem>
              <SelectItem value="medium">{t("fish-food-calculator.ui.medium46In")}</SelectItem>
              <SelectItem value="large">{t("fish-food-calculator.ui.large7In")}</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<Big value={t("fish-food-calculator.ui.g", { total })} label={t("fish-food-calculator.ui.totalFoodPerDay")} unit={t("fish-food-calculator.ui.splitInto12Feedings")} />}
    />
  );
}

export function HeaterWattage() {
  const { t } = useTranslation("tools");
  const [gal, setGal] = useState(20);
  const [rise, setRise] = useState(10);
  const min = gal * 3 * (rise / 10);
  const comfy = gal * 5 * (rise / 10);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("aquarium-heater-wattage-calculator.ui.tankSizeGal")}</Label><Input type="number" value={gal} onChange={(e) => setGal(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t("aquarium-heater-wattage-calculator.ui.desiredTempRiseFAboveRoom")}</Label><Input type="number" value={rise} onChange={(e) => setRise(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-4">
        <Big value={t("aquarium-heater-wattage-calculator.ui.w", { min: Math.round(min), comfy: Math.round(comfy) })} label={t("aquarium-heater-wattage-calculator.ui.recommendedHeater")} />
        <p className="text-sm text-muted-foreground text-center">{t("aquarium-heater-wattage-calculator.ui.forSafetySplitIntoTwoSmaller")}</p>
      </div>}
    />
  );
}

export function AquariumLighting() {
  const { t } = useTranslation("tools");
  const [tier, setTier] = useState<"low" | "medium" | "high">("low");
  const target = { low: "20–30 PAR", medium: "30–60 PAR", high: "60–120 PAR (CO2 required)" }[tier];
  const tips = {
    low: [t("aquarium-lighting-calculator.ui.tips.low.0"), t("aquarium-lighting-calculator.ui.tips.low.1"), t("aquarium-lighting-calculator.ui.tips.low.2")],
    medium: [t("aquarium-lighting-calculator.ui.tips.medium.0"), t("aquarium-lighting-calculator.ui.tips.medium.1"), t("aquarium-lighting-calculator.ui.tips.medium.2")],
    high: [t("aquarium-lighting-calculator.ui.tips.high.0"), t("aquarium-lighting-calculator.ui.tips.high.1"), t("aquarium-lighting-calculator.ui.tips.high.2")],
  }[tier];
  return (
    <CalculatorLayout
      form={<div><Label>{t("aquarium-lighting-calculator.ui.plantDemand")}</Label>
        <Select value={tier} onValueChange={(v: "low" | "medium" | "high") => setTier(v)}>
          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">{t("aquarium-lighting-calculator.ui.lowLightEasyPlants")}</SelectItem>
            <SelectItem value="medium">{t("aquarium-lighting-calculator.ui.mediumLight")}</SelectItem>
            <SelectItem value="high">{t("aquarium-lighting-calculator.ui.highLightCarpetsRed")}</SelectItem>
          </SelectContent>
        </Select></div>}
      result={<div className="space-y-4">
        <Big value={target} label={t("aquarium-lighting-calculator.ui.targetPARAtSubstrate")} />
        <Bullets lines={tips} />
      </div>}
    />
  );
}

export function FishTankCost() {
  const { t } = useTranslation("tools");
  const [gal, setGal] = useState(20);
  const [tier, setTier] = useState<"basic" | "planted" | "reef">("basic");
  const perGal = { basic: 11, planted: 22, reef: 55 }[tier];
  const total = gal * perGal + 60; // base kit
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("fish-tank-cost-calculator.ui.tankSizeGal")}</Label><Input type="number" value={gal} onChange={(e) => setGal(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t("fish-tank-cost-calculator.ui.tier")}</Label>
          <Select value={tier} onValueChange={(v: "basic" | "planted" | "reef") => setTier(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">{t("fish-tank-cost-calculator.ui.basicFreshwater")}</SelectItem>
              <SelectItem value="planted">{t("fish-tank-cost-calculator.ui.plantedCommunity")}</SelectItem>
              <SelectItem value="reef">{t("fish-tank-cost-calculator.ui.reefSaltwater")}</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<Big value={`~$${total.toFixed(0)}`} label={t("fish-tank-cost-calculator.ui.estimatedStartupCost")} unit={t("fish-tank-cost-calculator.ui.tankFilterHeaterLightSubstrateDecor")} />}
    />
  );
}

/* ─────────── SMALL PETS (ADVANCED CALCULATORS) ─────────── */
export function RabbitHay({ slug }: { slug?: string }) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.RabbitHay";
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

  const hayNotes = t(`${p}.ui.hayNote.${hayType}`);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t(`${p}.ui.unit`)}</Label>
              <Select value={unit} onValueChange={(v: "lb" | "kg") => setUnit(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lb">{t(`${p}.ui.poundsLb`)}</SelectItem>
                  <SelectItem value="kg">{t(`${p}.ui.kilogramsKg`)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t(`${p}.ui.rabbitWeightUnit`, { unit })}</Label>
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
            <Label>{t(`${p}.ui.hayVariety`)}</Label>
            <Select value={hayType} onValueChange={(v: typeof hayType) => setHayType(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="timothy2">{t(`${p}.ui.n2ndCutTimothyRecommendedStandard`)}</SelectItem>
                <SelectItem value="timothy1">{t(`${p}.ui.n1stCutTimothyMaximumDentalWear`)}</SelectItem>
                <SelectItem value="orchard">{t(`${p}.ui.orchardGrassSoftAllergyFriendly`)}</SelectItem>
                <SelectItem value="meadow">{t(`${p}.ui.meadowHayHerbalForageBlend`)}</SelectItem>
                <SelectItem value="alfalfa">{t(`${p}.ui.alfalfaLegumeBunnies6MonthsONLY`)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t(`${p}.ui.gDay`, { dailyGrams })} label={t(`${p}.ui.dailyHayRequirement`)} unit={t(`${p}.ui.bodyVolumeInLooseHay`)} />
          <Rows
            items={[
              { label: t(`${p}.ui.weeklyConsumption`), value: t(`${p}.ui.kgLbs`, { weeklyKg, v0: ((dailyGrams * 7) / 453.592).toFixed(1) }) },
              { label: t(`${p}.ui.monthlySupplyNeeded`), value: t(`${p}.ui.lbs30Days`, { monthlyLbs }) },
              { label: t(`${p}.ui.estMonthlyCost`), value: t(`${p}.ui.text`, { estimatedCost }) },
              { label: t(`${p}.ui.dietPercentage`), value: t(`${p}.ui.n8085OfTotalIntake`) },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">{t(`${p}.ui.hayNotes`, { hayNotes })}</p>
        </div>
      }
    />
  );
}

export function RabbitCageSize() {
  const { t } = useTranslation("tools");
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
              <Label>{t("rabbit-cage-size-calculator.ui.numberOfRabbits")}</Label>
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
              <Label>{t("rabbit-cage-size-calculator.ui.breedSizeCategory")}</Label>
              <Select value={breedSize} onValueChange={(v: typeof breedSize) => setBreedSize(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dwarf">{t("rabbit-cage-size-calculator.ui.dwarf4Lbs18Kg")}</SelectItem>
                  <SelectItem value="standard">{t("rabbit-cage-size-calculator.ui.standard48Lbs18")}</SelectItem>
                  <SelectItem value="large">{t("rabbit-cage-size-calculator.ui.large812Lbs36")}</SelectItem>
                  <SelectItem value="giant">{t("rabbit-cage-size-calculator.ui.giant1218LbsFlemish")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>{t("rabbit-cage-size-calculator.ui.housingSetupStyle")}</Label>
            <Select value={housing} onValueChange={(v: typeof housing) => setHousing(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pen">{t("rabbit-cage-size-calculator.ui.indoorExercisePenXPenC")}</SelectItem>
                <SelectItem value="free-roam">{t("rabbit-cage-size-calculator.ui.freeRoamWithBunnyBasecamp")}</SelectItem>
                <SelectItem value="hutch-run">{t("rabbit-cage-size-calculator.ui.outdoorPredatorProofHutchRun")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("rabbit-cage-size-calculator.ui.sqFt", { penArea: Math.round(penArea) })} label={t("rabbit-cage-size-calculator.ui.minimumBaseEnclosure")} unit={`≈ ${(penArea * 0.0929).toFixed(1)} m²`} />
          <Rows
            items={[
              { label: t("rabbit-cage-size-calculator.ui.minimumVerticalClearance"), value: t("rabbit-cage-size-calculator.ui.inchesPreventsEscapes", { heightInches }) },
              { label: t("rabbit-cage-size-calculator.ui.attachedExerciseRun"), value: t("rabbit-cage-size-calculator.ui.sqFtM", { runArea: Math.round(runArea), v0: (runArea * 0.0929).toFixed(1) }) },
              { label: t("rabbit-cage-size-calculator.ui.litterBoxesNeeded"), value: t("rabbit-cage-size-calculator.ui.boxesN1Rule", { litterBoxes }) },
              { label: t("rabbit-cage-size-calculator.ui.dailyOutOfPenExercise"), value: t("rabbit-cage-size-calculator.ui.n4HoursMinimum") },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">{t("rabbit-cage-size-calculator.ui.commercialWireCagesSoldInPet")}</p>
        </div>
      }
    />
  );
}

export function RabbitFood() {
  const { t } = useTranslation("tools");
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
              <Label>{t("rabbit-food-calculator.ui.unit")}</Label>
              <Select value={unit} onValueChange={(v: "lb" | "kg") => setUnit(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lb">{t("rabbit-food-calculator.ui.poundsLb")}</SelectItem>
                  <SelectItem value="kg">{t("rabbit-food-calculator.ui.kilogramsKg")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("rabbit-food-calculator.ui.rabbitWeightUnit", { unit })}</Label>
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
              <Label>{t("rabbit-food-calculator.ui.lifeStage")}</Label>
              <Select value={stage} onValueChange={(v: typeof stage) => setStage(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="young">{t("rabbit-food-calculator.ui.babyJunior6Months")}</SelectItem>
                  <SelectItem value="adult">{t("rabbit-food-calculator.ui.adult6Months5Years")}</SelectItem>
                  <SelectItem value="senior">{t("rabbit-food-calculator.ui.senior5Years")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("rabbit-food-calculator.ui.weightGoal")}</Label>
              <Select value={goal} onValueChange={(v: typeof goal) => setGoal(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintain">{t("rabbit-food-calculator.ui.maintainIdealWeight")}</SelectItem>
                  <SelectItem value="lose">{t("rabbit-food-calculator.ui.weightReductionSlimming")}</SelectItem>
                  <SelectItem value="gain">{t("rabbit-food-calculator.ui.weightGainRecovery")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("rabbit-food-calculator.ui.gDay", { pelletGrams })} label={t("rabbit-food-calculator.ui.dailyMeasuredPellets")} unit={t("rabbit-food-calculator.ui.cupTbsp", { pelletCups, finalTbsp })} />
          <Rows
            items={[
              { label: t("rabbit-food-calculator.ui.freshDarkLeafyGreens"), value: t("rabbit-food-calculator.ui.cupsPackedRomaineCilantroParsley", { dailyGreensCups }) },
              { label: t("rabbit-food-calculator.ui.grassHayTimothyOrchard"), value: t("rabbit-food-calculator.ui.unlimited8085OfTotalDiet") },
              { label: t("rabbit-food-calculator.ui.pelletFiberRequirement"), value: t("rabbit-food-calculator.ui.minimum22CrudeFiber") },
              { label: t("rabbit-food-calculator.ui.treatAllowanceFruitCarrot"), value: t("rabbit-food-calculator.ui.max1Tsp2LbsBody") },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">{t("rabbit-food-calculator.ui.neverFeedSeedMuesliMixesWith")}</p>
        </div>
      }
    />
  );
}

export function RabbitAge() {
  const { t } = useTranslation("tools");
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
      ? t("rabbit-age-calculator.ui.stage.baby")
      : totalYears < 1
      ? t("rabbit-age-calculator.ui.stage.junior")
      : totalYears < 5
      ? t("rabbit-age-calculator.ui.stage.prime")
      : totalYears < 8
      ? t("rabbit-age-calculator.ui.stage.senior")
      : t("rabbit-age-calculator.ui.stage.geriatric");

  const screeningAdvice =
    totalYears >= 5
      ? t("rabbit-age-calculator.ui.screeningAdvice.geriatric")
      : t("rabbit-age-calculator.ui.screeningAdvice.standard");

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("rabbit-age-calculator.ui.ageYears")}</Label>
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
              <Label>{t("rabbit-age-calculator.ui.months")}</Label>
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
            <Label>{t("rabbit-age-calculator.ui.breedSize")}</Label>
            <Select value={breedSize} onValueChange={(v: typeof breedSize) => setBreedSize(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dwarf">{t("rabbit-age-calculator.ui.dwarfSmallLifespan1014Yrs")}</SelectItem>
                <SelectItem value="standard">{t("rabbit-age-calculator.ui.mediumStandardLifespan812Yrs")}</SelectItem>
                <SelectItem value="giant">{t("rabbit-age-calculator.ui.giantBreedLifespan58Yrs")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("rabbit-age-calculator.ui.humanYears", { humanAge })} label={t("rabbit-age-calculator.ui.biologicalAgeEquivalent")} unit={stage} />
          <Rows
            items={[
              { label: t("rabbit-age-calculator.ui.lifeStageClassification"), value: stage },
              { label: t("rabbit-age-calculator.ui.expectedLifespanRange"), value: breedSize === "dwarf" ? t("rabbit-age-calculator.ui.lifespan.dwarf") : breedSize === "giant" ? t("rabbit-age-calculator.ui.lifespan.giant") : t("rabbit-age-calculator.ui.lifespan.standard") },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            {t("rabbit-age-calculator.ui.careBenchmarkNote", { benchmark: t("rabbit-age-calculator.ui.veterinaryCareBenchmark"), advice: screeningAdvice })}
          </p>
        </div>
      }
    />
  );
}

export function HamsterCageSize() {
  const { t } = useTranslation("tools");
  const [species, setSpecies] = useState<"syrian_female" | "syrian_male" | "dwarf" | "robo" | "chinese">("syrian_female");

  const specs = {
    syrian_female: {
      minSqIn: 800,
      recSqIn: 1000,
      minBedding: 10,
      recBedding: 12,
      note: t("hamster-cage-size-calculator.ui.note.syrian_female"),
    },
    syrian_male: {
      minSqIn: 600,
      recSqIn: 800,
      minBedding: 8,
      recBedding: 10,
      note: t("hamster-cage-size-calculator.ui.note.syrian_male"),
    },
    dwarf: {
      minSqIn: 500,
      recSqIn: 700,
      minBedding: 6,
      recBedding: 8,
      note: t("hamster-cage-size-calculator.ui.note.dwarf"),
    },
    robo: {
      minSqIn: 500,
      recSqIn: 750,
      minBedding: 6,
      recBedding: 8,
      note: t("hamster-cage-size-calculator.ui.note.robo"),
    },
    chinese: {
      minSqIn: 500,
      recSqIn: 700,
      minBedding: 6,
      recBedding: 8,
      note: t("hamster-cage-size-calculator.ui.note.chinese"),
    },
  }[species];

  const minSqCm = Math.round(specs.minSqIn * 6.4516);
  const recSqCm = Math.round(specs.recSqIn * 6.4516);

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t("hamster-cage-size-calculator.ui.hamsterSpeciesGender")}</Label>
            <Select value={species} onValueChange={(v: typeof species) => setSpecies(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="syrian_female">{t("hamster-cage-size-calculator.ui.femaleSyrianHamsterHighestSpaceNeed")}</SelectItem>
                <SelectItem value="syrian_male">{t("hamster-cage-size-calculator.ui.maleSyrianHamster")}</SelectItem>
                <SelectItem value="dwarf">{t("hamster-cage-size-calculator.ui.dwarfHamsterCampbellWinterWhite")}</SelectItem>
                <SelectItem value="robo">{t("hamster-cage-size-calculator.ui.roborovskiDwarfHamster")}</SelectItem>
                <SelectItem value="chinese">{t("hamster-cage-size-calculator.ui.chineseHamster")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("hamster-cage-size-calculator.ui.sqIn", { recSqIn: specs.recSqIn })} label={t("hamster-cage-size-calculator.ui.recommendedUnbrokenFloorSpace")} unit={t("hamster-cage-size-calculator.ui.cmSqInAbsoluteMin", { recSqCm, minSqIn: specs.minSqIn })} />
          <Rows
            items={[
              { label: t("hamster-cage-size-calculator.ui.minimumUnbrokenArea"), value: t("hamster-cage-size-calculator.ui.sqInCm", { minSqIn: specs.minSqIn, minSqCm }) },
              { label: t("hamster-cage-size-calculator.ui.recommendedBeddingDepth"), value: t("hamster-cage-size-calculator.ui.inchesCmForBurrows", { recBedding: specs.recBedding, v0: Math.round(specs.recBedding * 2.54) }) },
              { label: t("hamster-cage-size-calculator.ui.minimumBeddingDepth"), value: t("hamster-cage-size-calculator.ui.inchesCm", { minBedding: specs.minBedding, v0: Math.round(specs.minBedding * 2.54) }) },
              { label: t("hamster-cage-size-calculator.ui.enclosureType"), value: t("hamster-cage-size-calculator.ui.glassTank4075GalBreeder") },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            {t("hamster-cage-size-calculator.ui.cageNote", { note: specs.note })}
          </p>
        </div>
      }
    />
  );
}

export function HamsterFood() {
  const { t } = useTranslation("tools");
  const [species, setSpecies] = useState<"syrian" | "dwarf" | "robo">("syrian");
  const [weightGrams, setWeightGrams] = useState(140);
  const [feedMethod, setFeedMethod] = useState<"scatter" | "bowl">("scatter");

  const gramsDaily = species === "syrian" ? Math.max(10, Math.round(weightGrams * 0.08)) : Math.max(5, Math.round(weightGrams * 0.12));
  const proteinTarget = species === "dwarf" ? t("hamster-food-calculator.ui.proteinTarget.dwarf") : t("hamster-food-calculator.ui.proteinTarget.other");
  const mealwormsWeekly = species === "syrian" ? t("hamster-food-calculator.ui.mealwormsWeekly.syrian") : t("hamster-food-calculator.ui.mealwormsWeekly.other");

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("hamster-food-calculator.ui.species")}</Label>
              <Select value={species} onValueChange={(v: typeof species) => setSpecies(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="syrian">{t("hamster-food-calculator.ui.syrianHamster")}</SelectItem>
                  <SelectItem value="dwarf">{t("hamster-food-calculator.ui.dwarfCampbellWinterWhite")}</SelectItem>
                  <SelectItem value="robo">{t("hamster-food-calculator.ui.roborovskiHamster")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("hamster-food-calculator.ui.bodyWeightGrams")}</Label>
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
            <Label>{t("hamster-food-calculator.ui.feedingMethod")}</Label>
            <Select value={feedMethod} onValueChange={(v: typeof feedMethod) => setFeedMethod(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="scatter">{t("hamster-food-calculator.ui.scatterFeedingInBeddingBestEnrichment")}</SelectItem>
                <SelectItem value="bowl">{t("hamster-food-calculator.ui.foodBowlFeeding")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("hamster-food-calculator.ui.gDay", { gramsDaily })} label={t("hamster-food-calculator.ui.dailySeedPelletMix")} unit={t("hamster-food-calculator.ui.n12Tablespoons")} />
          <Rows
            items={[
              { label: t("hamster-food-calculator.ui.targetCrudeProtein"), value: proteinTarget },
              { label: t("hamster-food-calculator.ui.targetCrudeFat"), value: t("hamster-food-calculator.ui.n57AvoidExcessiveSunflowerPeanuts") },
              { label: t("hamster-food-calculator.ui.animalProteinSupplement"), value: mealwormsWeekly },
              { label: t("hamster-food-calculator.ui.freshSafeVegetables"), value: t("hamster-food-calculator.ui.n1Tsp23WeeklyBroccoli") },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">
            {feedMethod === "scatter"
              ? t("hamster-food-calculator.ui.feedingNote.scatter")
              : t("hamster-food-calculator.ui.feedingNote.bowl")}
          </p>
        </div>
      }
    />
  );
}

export function GuineaPigVitaminC() {
  const { t } = useTranslation("tools");
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
              <Label>{t("guinea-pig-vitamin-c-calculator.ui.weightGrams")}</Label>
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
              <Label>{t("guinea-pig-vitamin-c-calculator.ui.healthStatus")}</Label>
              <Select value={status} onValueChange={(v: typeof status) => setStatus(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">{t("guinea-pig-vitamin-c-calculator.ui.healthyAdultMaintenance")}</SelectItem>
                  <SelectItem value="growing">{t("guinea-pig-vitamin-c-calculator.ui.growingPup6Months")}</SelectItem>
                  <SelectItem value="pregnant">{t("guinea-pig-vitamin-c-calculator.ui.pregnantLactatingSow")}</SelectItem>
                  <SelectItem value="scurvy">{t("guinea-pig-vitamin-c-calculator.ui.illnessScurvyRecovery")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("guinea-pig-vitamin-c-calculator.ui.mgDay", { targetMg })} label={t("guinea-pig-vitamin-c-calculator.ui.requiredActiveVitaminC")} unit={t("guinea-pig-vitamin-c-calculator.ui.essentialDailyIntake")} />
          <Rows
            items={[
              { label: t("guinea-pig-vitamin-c-calculator.ui.yellowRedBellPepper"), value: t("guinea-pig-vitamin-c-calculator.ui.mediumSliceS190Mg100g", { v0: Math.max(1, Math.round(targetMg / 30)) }) },
              { label: t("guinea-pig-vitamin-c-calculator.ui.freshCilantroCoriander"), value: t("guinea-pig-vitamin-c-calculator.ui.n1SmallHandful27Mg100g") },
              { label: t("guinea-pig-vitamin-c-calculator.ui.stabilizedPellets"), value: t("guinea-pig-vitamin-c-calculator.ui.n18CupDailyOxbowEssentials") },
              { label: t("guinea-pig-vitamin-c-calculator.ui.directOralSupplement"), value: status === "scurvy" ? t("guinea-pig-vitamin-c-calculator.ui.supplement.scurvy") : t("guinea-pig-vitamin-c-calculator.ui.supplement.other") },
            ]}
          />
          <p className="text-xs text-amber-800 dark:text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
{t("guinea-pig-vitamin-c-calculator.ui.neverPutLiquidVitaminCIn")}
          </p>
        </div>
      }
    />
  );
}

export function HamsterLifespan() {
  const { t } = useTranslation("tools");
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
            <Label>{t("hamster-lifespan-estimator.ui.hamsterSpecies")}</Label>
            <Select value={species} onValueChange={(v: typeof species) => setSpecies(v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="syrian">{t("hamster-lifespan-estimator.ui.syrianHamsterAvg23Yrs")}</SelectItem>
                <SelectItem value="dwarf_campbell">{t("hamster-lifespan-estimator.ui.campbellSDwarfHamsterAvg1")}</SelectItem>
                <SelectItem value="dwarf_winter">{t("hamster-lifespan-estimator.ui.winterWhiteDwarfAvg15")}</SelectItem>
                <SelectItem value="robo">{t("hamster-lifespan-estimator.ui.roborovskiHamsterLongest34Yrs")}</SelectItem>
                <SelectItem value="chinese">{t("hamster-lifespan-estimator.ui.chineseHamsterAvg23Yrs")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("hamster-lifespan-estimator.ui.geneticsOrigin")}</Label>
              <Select value={origin} onValueChange={(v: typeof origin) => setOrigin(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethical_breeder">{t("hamster-lifespan-estimator.ui.ethicalLineagePedigree")}</SelectItem>
                  <SelectItem value="pet_store">{t("hamster-lifespan-estimator.ui.commercialRetailPetStore")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("hamster-lifespan-estimator.ui.careEnvironment")}</Label>
              <Select value={careTier} onValueChange={(v: typeof careTier) => setCareTier(v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="optimal">{t("hamster-lifespan-estimator.ui.highEnrichment700SqIn10")}</SelectItem>
                  <SelectItem value="standard">{t("hamster-lifespan-estimator.ui.standardEnclosure")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("hamster-lifespan-estimator.ui.years", { minYears, maxYears })} label={t("hamster-lifespan-estimator.ui.estimatedLifespanProjection")} unit={t("hamster-lifespan-estimator.ui.months", { v0: Math.round(Number(minYears) * 12), v1: Math.round(Number(maxYears) * 12) })} />
          <Rows
            items={[
              { label: t("hamster-lifespan-estimator.ui.primeAdulthood"), value: t("hamster-lifespan-estimator.ui.months414") },
              { label: t("hamster-lifespan-estimator.ui.seniorTransition"), value: t("hamster-lifespan-estimator.ui.n18MonthsReducedRunningDeeperSleep") },
              { label: t("hamster-lifespan-estimator.ui.seniorCareAdjustment"), value: t("hamster-lifespan-estimator.ui.lowerWaterBottlesSoftRampsShallow") },
            ]}
          />
          <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl border border-border/60">{t("hamster-lifespan-estimator.ui.roborovskiHamstersNaturallyLiveTheLongest")}</p>
        </div>
      }
    />
  );
}

/* ─────────── REPTILES ─────────── */

/* 1. REPTILE ENCLOSURE SIZE CALCULATOR */
interface ReptileSpeciesProfile {  scientific: string;
  type: "terrestrial" | "arboreal" | "semi-arboreal" | "fossorial" | "tortoise-table";
  adultLength: string;
  adultMinLIn: number;
  adultMinWIn: number;
  adultMinHIn: number;
  adultMinGal: number;
  uvbZone: string;
  baskingTemp: string;
}

const REPTILE_PROFILES: Record<string, ReptileSpeciesProfile> = {
  "bearded-dragon": {
    
    scientific: "Pogona vitticeps",
    type: "terrestrial",
    adultLength: "18–24 in (45–60 cm)",
    adultMinLIn: 48, adultMinWIn: 24, adultMinHIn: 24, adultMinGal: 120,
    
    uvbZone: "Ferguson Zone 3 (UVI 3.0–5.0, 10.0/12% T5-HO)",
    baskingTemp: "100–110°F (38–43°C)",
    
    
  },
  "leopard-gecko": {
    
    scientific: "Eublepharis macularius",
    type: "terrestrial",
    adultLength: "8–11 in (20–28 cm)",
    adultMinLIn: 36, adultMinWIn: 18, adultMinHIn: 18, adultMinGal: 40,
    
    uvbZone: "Ferguson Zone 1 (UVI 0.5–1.5, 2.4%/5.0% T5 ShadeDweller)",
    baskingTemp: "90–94°F (32–34°C)",
    
    
  },
  "crested-gecko": {
    
    scientific: "Correlophus ciliatus",
    type: "arboreal",
    adultLength: "8–10 in (20–25 cm)",
    adultMinLIn: 18, adultMinWIn: 18, adultMinHIn: 36, adultMinGal: 50,
    
    uvbZone: "Ferguson Zone 1 (UVI 0.5–1.0, 2.4% / ShadeDweller)",
    baskingTemp: "75–80°F (24–27°C) - Temp >85°F is lethal!",
    
    
  },
  "ball-python": {
    
    scientific: "Python regius",
    type: "semi-arboreal",
    adultLength: "3.5–5.0 ft (100–150 cm)",
    adultMinLIn: 48, adultMinWIn: 24, adultMinHIn: 24, adultMinGal: 120,
    
    uvbZone: "Ferguson Zone 1-2 (UVI 0.7–1.5, 5% / 6% T5-HO)",
    baskingTemp: "88–92°F (31–33°C)",
    
    
  },
  "corn-snake": {
    
    scientific: "Pantherophis guttatus",
    type: "semi-arboreal",
    adultLength: "4.0–5.5 ft (120–165 cm)",
    adultMinLIn: 48, adultMinWIn: 24, adultMinHIn: 24, adultMinGal: 120,
    
    uvbZone: "Ferguson Zone 1-2 (UVI 1.0–2.0, 5% / 6% T5-HO)",
    baskingTemp: "85–88°F (29–31°C)",
    
    
  },
  "blue-tongue-skink": {
    
    scientific: "Tiliqua scincoides",
    type: "fossorial",
    adultLength: "18–24 in (45–60 cm)",
    adultMinLIn: 48, adultMinWIn: 24, adultMinHIn: 24, adultMinGal: 120,
    
    uvbZone: "Ferguson Zone 2-3 (UVI 2.0–4.0, 10.0 T5-HO)",
    baskingTemp: "100–108°F (38–42°C)",
    
    
  },
  "veiled-chameleon": {
    
    scientific: "Chamaeleo calyptratus / Furcifer pardalis",
    type: "arboreal",
    adultLength: "14–24 in (35–60 cm)",
    adultMinLIn: 24, adultMinWIn: 24, adultMinHIn: 48, adultMinGal: 120,
    
    uvbZone: "Ferguson Zone 3 (UVI 3.0–4.0, 6% / 10.0 T5-HO Linear)",
    baskingTemp: "85–88°F (29–31°C)",
    
    
  },
  "uromastyx": {
    
    scientific: "Uromastyx spp.",
    type: "terrestrial",
    adultLength: "10–18 in (25–45 cm)",
    adultMinLIn: 48, adultMinWIn: 24, adultMinHIn: 24, adultMinGal: 120,
    
    uvbZone: "Ferguson Zone 3-4 (UVI 4.0–6.0, 12% / 14% T5-HO)",
    baskingTemp: "115–125°F (46–52°C) - Intense Basking Heat!",
    
    
  },
  "russian-tortoise": {
    
    scientific: "Testudo horsfieldii / hermanni",
    type: "tortoise-table",
    adultLength: "6–10 in (15–25 cm)",
    adultMinLIn: 48, adultMinWIn: 36, adultMinHIn: 16, adultMinGal: 120,
    
    uvbZone: "Ferguson Zone 3 (UVI 3.0–5.0, 10.0 / 12% T5-HO)",
    baskingTemp: "95–100°F (35–38°C)",
    
    
  },
  "green-anole": {
    
    scientific: "Anolis carolinensis",
    type: "arboreal",
    adultLength: "5–8 in (13–20 cm)",
    adultMinLIn: 18, adultMinWIn: 18, adultMinHIn: 24, adultMinGal: 30,
    
    uvbZone: "Ferguson Zone 2 (UVI 1.5–2.5, 5% / 6% T5-HO)",
    baskingTemp: "88–92°F (31–33°C)",
    
    
  },
};

export function ReptileEnclosure() {
  const { t } = useTranslation("tools");
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
    const text = t("reptile-enclosure-size-calculator.ui.copySpecsText", { species: t(`reptile-enclosure-size-calculator.ui.species.${spKey}`), lifeStage: lifeStage.toUpperCase(), adultLength: profile.adultLength, dims: `${dim.minLIn}"L × ${dim.minWIn}"W × ${dim.minHIn}"H (${dim.minLCm} × ${dim.minWCm} × ${dim.minHCm} cm)`, footprint: `${dim.floorAreaSqFt} sq ft (${dim.floorAreaSqM} m²)`, volume: `~${dim.volumeGal} Gallons (${dim.volumeLiters} L)`, habitatType: profile.type.toUpperCase(), material: t(`reptile-enclosure-size-calculator.ui.material.${spKey}`), baskingTemp: profile.baskingTemp, humidity: t(`reptile-enclosure-size-calculator.ui.humidity.${spKey}`), uvbZone: profile.uvbZone });

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(t("reptile-enclosure-size-calculator.ui.enclosureSpecsCopiedToClipboard"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <div>
            <h3 className="font-semibold text-foreground">{t("reptile-enclosure-size-calculator.ui.reptileSpeciesEnclosureSizing")}</h3>
            <p className="text-xs text-muted-foreground">{t("reptile-enclosure-size-calculator.ui.selectSpeciesAndLifeStageTo")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("imperial")}
              className="h-8 text-xs font-medium"
            >{t("reptile-enclosure-size-calculator.ui.inchesGallons")}</Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("metric")}
              className="h-8 text-xs font-medium"
            >{t("reptile-enclosure-size-calculator.ui.centimetersLiters")}</Button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-enclosure-size-calculator.ui.selectSpecies")}</Label>
            <Select value={spKey} onValueChange={setSpKey}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {Object.entries(REPTILE_PROFILES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {t(`reptile-enclosure-size-calculator.ui.species.${k}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-enclosure-size-calculator.ui.lifeStage")}</Label>
            <Select value={lifeStage} onValueChange={(v: "baby" | "juvenile" | "adult") => setLifeStage(v)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adult">{t("reptile-enclosure-size-calculator.ui.adultFullGrownMinimum")}</SelectItem>
                <SelectItem value="juvenile">{t("reptile-enclosure-size-calculator.ui.juvenileSubAdult")}</SelectItem>
                <SelectItem value="baby">{t("reptile-enclosure-size-calculator.ui.babyHatchling")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Box */}
      <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">{t("reptile-enclosure-size-calculator.ui.minimumRecommendedDimensions")}</span>
            <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              {unit === "imperial" ? (
                <>{dim.minLIn}&quot; L × {dim.minWIn}&quot; W × {dim.minHIn}&quot; H</>
              ) : (
                <>{dim.minLCm} × {dim.minWCm} × {dim.minHCm} cm</>
              )}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {t(`reptile-enclosure-size-calculator.ui.species.${spKey}`)} ({profile.scientific}) • {t("reptile-enclosure-size-calculator.ui.adultSize", { adultLength: profile.adultLength })}
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={copySpecs} className="gap-1.5 text-xs font-medium shrink-0">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? t("reptile-enclosure-size-calculator.ui.copied") : t("reptile-enclosure-size-calculator.ui.copySpecs")}
          </Button>
        </div>

        {/* 4 Stat Badges */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-enclosure-size-calculator.ui.floorFootprint")}</div>
            <div className="mt-1 text-lg font-bold text-foreground">
              {unit === "imperial" ? t("reptile-enclosure-size-calculator.ui.sqFtValue", { v: dim.floorAreaSqFt }) : t("reptile-enclosure-size-calculator.ui.sqMValue", { v: dim.floorAreaSqM })}
            </div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-enclosure-size-calculator.ui.enclosureVolume")}</div>
            <div className="mt-1 text-lg font-bold text-foreground">
              {unit === "imperial" ? t("reptile-enclosure-size-calculator.ui.gallonsValue", { v: dim.volumeGal }) : t("reptile-enclosure-size-calculator.ui.litersValue", { v: dim.volumeLiters })}
            </div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-enclosure-size-calculator.ui.baskingSurface")}</div>
            <div className="mt-1 text-sm font-bold text-rose-600 dark:text-rose-400">{profile.baskingTemp}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-enclosure-size-calculator.ui.uVBTarget")}</div>
            <div className="mt-1 text-xs font-bold text-amber-600 dark:text-amber-400">{profile.uvbZone.split("(")[0]}</div>
          </div>
        </div>

        {/* Husbandry summary table */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border p-3 bg-muted/20">
            <span className="font-semibold text-foreground">{t("reptile-enclosure-size-calculator.ui.recommendedMaterial")}</span>
            <span className="text-muted-foreground">{t(`reptile-enclosure-size-calculator.ui.material.${spKey}`)}</span>
          </div>
          <div className="rounded-xl border p-3 bg-muted/20">
            <span className="font-semibold text-foreground">{t("reptile-enclosure-size-calculator.ui.targetHumidity")}</span>
            <span className="text-muted-foreground">{t(`reptile-enclosure-size-calculator.ui.humidity.${spKey}`)}</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p>{t(`reptile-enclosure-size-calculator.ui.notes.${spKey}`)}</p>
        </div>
      </div>
    </div>
  );
}

/* 2. REPTILE UVB DISTANCE GUIDE */
export function ReptileUVB() {
  const { t } = useTranslation("tools");
  const [species, setSpecies] = useState<string>("bearded-dragon");
  const [bulbType, setBulbType] = useState<string>("t5-10");
  const [reflector, setReflector] = useState<string>("curved");
  const [screenMesh, setScreenMesh] = useState<string>("standard");

  const speciesData: Record<string, { zone: string; targetUvi: string; notes: string }> = {
    "bearded-dragon": { zone: "Ferguson Zone 3", targetUvi: "3.0 – 4.5 UVI" },
    "leopard-gecko": { zone: "Ferguson Zone 1", targetUvi: "0.5 – 1.2 UVI" },
    "crested-gecko": { zone: "Ferguson Zone 1", targetUvi: "0.5 – 1.0 UVI" },
    "ball-python": { zone: "Ferguson Zone 1-2", targetUvi: "0.7 – 1.5 UVI" },
    "corn-snake": { zone: "Ferguson Zone 1-2", targetUvi: "1.0 – 2.0 UVI" },
    "veiled-chameleon": { zone: "Ferguson Zone 3", targetUvi: "2.8 – 3.8 UVI" },
    "russian-tortoise": { zone: "Ferguson Zone 3", targetUvi: "3.0 – 4.5 UVI" },
    "blue-tongue-skink": { zone: "Ferguson Zone 2-3", targetUvi: "2.5 – 3.5 UVI" },
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
        <h3 className="font-semibold text-foreground">{t("reptile-uvb-distance-guide.ui.reptileUVBDistanceFergusonZoneSetup")}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t("reptile-uvb-distance-guide.ui.calculateExactSafeBulbToBasking")}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-uvb-distance-guide.ui.reptileSpecies")}</Label>
            <Select value={species} onValueChange={setSpecies}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(speciesData).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{t(`reptile-uvb-distance-guide.ui.species.${k}.name`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-uvb-distance-guide.ui.uVBLampModel")}</Label>
            <Select value={bulbType} onValueChange={setBulbType}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="t5-10">{t("reptile-uvb-distance-guide.ui.t5HO10012Desert")}</SelectItem>
                <SelectItem value="t5-6">{t("reptile-uvb-distance-guide.ui.t5HO506Forest")}</SelectItem>
                <SelectItem value="t5-shadedweller">{t("reptile-uvb-distance-guide.ui.t5ShadeDweller247Gecko")}</SelectItem>
                <SelectItem value="t5-14">{t("reptile-uvb-distance-guide.ui.t5HO14ExtraHighOutput")}</SelectItem>
                <SelectItem value="t8-10">{t("reptile-uvb-distance-guide.ui.t8100TubeStandard")}</SelectItem>
                <SelectItem value="t8-5">{t("reptile-uvb-distance-guide.ui.t850TubeStandard")}</SelectItem>
                <SelectItem value="compact-10">{t("reptile-uvb-distance-guide.ui.compactCoilBulbScrewIn")}</SelectItem>
                <SelectItem value="mvb-100">{t("reptile-uvb-distance-guide.ui.mercuryVaporBulb100WHeatUVB")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-uvb-distance-guide.ui.meshScreenBarrier")}</Label>
            <Select value={screenMesh} onValueChange={setScreenMesh}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("reptile-uvb-distance-guide.ui.noScreenMountedInsideEnclosure")}</SelectItem>
                <SelectItem value="standard">{t("reptile-uvb-distance-guide.ui.standardWireMesh30UVBReduction")}</SelectItem>
                <SelectItem value="fine">{t("reptile-uvb-distance-guide.ui.fineWovenScreen45UVBReduction")}</SelectItem>
                <SelectItem value="glass">{t("reptile-uvb-distance-guide.ui.glassAcrylicBlocks100UVB")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-uvb-distance-guide.ui.fixtureReflector")}</Label>
            <Select value={reflector} onValueChange={setReflector}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="curved">{t("reptile-uvb-distance-guide.ui.highlyPolishedCurvedReflectorArcadiaZoomed")}</SelectItem>
                <SelectItem value="flat">{t("reptile-uvb-distance-guide.ui.standardFlatReflector")}</SelectItem>
                <SelectItem value="none">{t("reptile-uvb-distance-guide.ui.noReflectorBareFixture")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {screenMesh === "glass" ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-destructive flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-base">{t("reptile-uvb-distance-guide.ui.cRITICALDANGERGlassBlocks100Of")}</h4>
            <p className="text-xs mt-1 leading-relaxed">{t("reptile-uvb-distance-guide.ui.standardGlassAcrylicAndPlasticCompletely")}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase">{t("reptile-uvb-distance-guide.ui.recommendedSafeBaskingDistance")}</span>
              <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
                {calculations.minIn}&quot; – {calculations.maxIn}&quot; ({calculations.minCm} – {calculations.maxCm} cm)
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t("reptile-uvb-distance-guide.ui.measureDirectlyFromTheBottomOf")}</p>
            </div>

            <Badge variant="outline" className="text-xs font-medium px-3 py-1.5">
              {currentSp.zone} • Target: {currentSp.targetUvi}
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border bg-card/80 p-3 text-center">
              <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-uvb-distance-guide.ui.screenLoss")}</div>
              <div className="mt-1 text-lg font-bold text-foreground">-{calculations.meshLossPct}% UVB</div>
              <div className="text-[10px] text-muted-foreground">{t("reptile-uvb-distance-guide.ui.meshFilterPenalty")}</div>
            </div>

            <div className="rounded-xl border bg-card/80 p-3 text-center">
              <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-uvb-distance-guide.ui.bulbLifespan")}</div>
              <div className="mt-1 text-lg font-bold text-foreground">{calculations.lifespan} Months</div>
              <div className="text-[10px] text-muted-foreground">{t("reptile-uvb-distance-guide.ui.replaceBeforeUVIDrops")}</div>
            </div>

            <div className="rounded-xl border bg-card/80 p-3 text-center">
              <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-uvb-distance-guide.ui.targetUVI")}</div>
              <div className="mt-1 text-base font-bold text-amber-600 dark:text-amber-400">{currentSp.targetUvi}</div>
              <div className="text-[10px] text-muted-foreground">{t("reptile-uvb-distance-guide.ui.fergusonIndex")}</div>
            </div>

            <div className="rounded-xl border bg-card/80 p-3 text-center">
              <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("reptile-uvb-distance-guide.ui.mBDPrevention")}</div>
              <div className="mt-1 text-base font-bold text-emerald-600 dark:text-emerald-400">{t("reptile-uvb-distance-guide.ui.n100Safe")}</div>
              <div className="text-[10px] text-muted-foreground">{t("reptile-uvb-distance-guide.ui.d3SynthesisActive")}</div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-muted-foreground">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5 text-amber-500" /> Species Care Note:
            </div>
            <p className="mt-1 leading-relaxed">{t(`reptile-uvb-distance-guide.ui.species.${species}.notes`)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* 3. REPTILE FEEDER SIZE & NUTRITION CALCULATOR */
export function ReptileFeeder() {
  const { t } = useTranslation("tools");
  const [petType, setPetType] = useState<"lizard" | "snake">("lizard");
  const [measurementInches, setMeasurementInches] = useState<number>(0.75);
  const [feederChoice, setFeederChoice] = useState<string>("dubia");

  const feederNutrition: Record<string, { protein: string; fat: string; notes: string }> = {
    dubia: { protein: "21.4%", fat: "6.1%" },
    crickets: { protein: "18.5%", fat: "5.5%" },
    bsfl: { protein: "17.3%", fat: "9.4%" },
    mealworms: { protein: "18.7%", fat: "13.4%" },
    superworms: { protein: "19.7%", fat: "17.7%" },
    hornworms: { protein: "9.0%", fat: "3.0%" },
    silkworms: { protein: "14.6%", fat: "3.2%" },
    mice: { protein: "55.8%", fat: "23.6%" },
    rats: { protein: "61.8%", fat: "28.0%" },
  };

  const calculation = useMemo(() => {
    let preyName = "";
    let maxSafeSize = "";

    if (petType === "lizard") {
      const eyeSpace = measurementInches;
      maxSafeSize = `${eyeSpace}" (${(eyeSpace * 25.4).toFixed(0)} mm)`;
      if (eyeSpace <= 0.25) preyName = t("reptile-feeder-size-calculator.ui.preyLizard0");
      else if (eyeSpace <= 0.45) preyName = t("reptile-feeder-size-calculator.ui.preyLizard1");
      else if (eyeSpace <= 0.75) preyName = t("reptile-feeder-size-calculator.ui.preyLizard2");
      else if (eyeSpace <= 1.1) preyName = t("reptile-feeder-size-calculator.ui.preyLizard3");
      else preyName = t("reptile-feeder-size-calculator.ui.preyLizard4");
    } else {
      const girth = measurementInches;
      maxSafeSize = t("reptile-feeder-size-calculator.ui.maxSafeSizeSnake", { girth, mm: (girth * 25.4).toFixed(0) });
      if (girth <= 0.5) preyName = t("reptile-feeder-size-calculator.ui.preySnake0");
      else if (girth <= 0.8) preyName = t("reptile-feeder-size-calculator.ui.preySnake1");
      else if (girth <= 1.1) preyName = t("reptile-feeder-size-calculator.ui.preySnake2");
      else if (girth <= 1.5) preyName = t("reptile-feeder-size-calculator.ui.preySnake3");
      else if (girth <= 2.2) preyName = t("reptile-feeder-size-calculator.ui.preySnake4");
      else if (girth <= 3.2) preyName = t("reptile-feeder-size-calculator.ui.preySnake5");
      else preyName = t("reptile-feeder-size-calculator.ui.preySnake6");
    }

    return { preyName, maxSafeSize };
  }, [petType, measurementInches]);

  const selectedNutr = feederNutrition[feederChoice] || feederNutrition["dubia"];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <h3 className="font-semibold text-foreground">{t("reptile-feeder-size-calculator.ui.reptileFeederSizingNutritionalGuide")}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t("reptile-feeder-size-calculator.ui.determineTheSafePreySizeTo")}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-feeder-size-calculator.ui.reptileType")}</Label>
            <Select value={petType} onValueChange={(v: "lizard" | "snake") => setPetType(v)}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="lizard">{t("reptile-feeder-size-calculator.ui.lizardGeckoChameleonInsectivoreOmnivore")}</SelectItem>
                <SelectItem value="snake">{t("reptile-feeder-size-calculator.ui.snakeCarnivoreRodentFeeder")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              {petType === "lizard" ? t("reptile-feeder-size-calculator.ui.spaceBetweenEyes") : t("reptile-feeder-size-calculator.ui.widestBodyGirth")}
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
            <Label className="text-xs font-medium text-muted-foreground">{t("reptile-feeder-size-calculator.ui.inspectFeederProfile")}</Label>
            <Select value={feederChoice} onValueChange={setFeederChoice}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dubia">{t("reptile-feeder-size-calculator.ui.dubiaRoachesTopStaple")}</SelectItem>
                <SelectItem value="crickets">{t("reptile-feeder-size-calculator.ui.cricketsClassicStaple")}</SelectItem>
                <SelectItem value="bsfl">{t("reptile-feeder-size-calculator.ui.blackSoldierFlyLarvaeHighCalcium")}</SelectItem>
                <SelectItem value="hornworms">{t("reptile-feeder-size-calculator.ui.hornwormsHydrationBooster")}</SelectItem>
                <SelectItem value="silkworms">{t("reptile-feeder-size-calculator.ui.silkwormsGentleSuperfood")}</SelectItem>
                <SelectItem value="mealworms">{t("reptile-feeder-size-calculator.ui.mealwormsChitinTreat")}</SelectItem>
                <SelectItem value="superworms">{t("reptile-feeder-size-calculator.ui.superwormsHighFatTreat")}</SelectItem>
                <SelectItem value="mice">{t("reptile-feeder-size-calculator.ui.frozenThawedMice")}</SelectItem>
                <SelectItem value="rats">{t("reptile-feeder-size-calculator.ui.frozenThawedRats")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sizing Results Box */}
      <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-sm">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase">{t("reptile-feeder-size-calculator.ui.recommendedFeederSize")}</span>
        <div className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
          {calculation.preyName}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          t("reptile-feeder-size-calculator.ui.maximumSafeLimit") <strong className="text-foreground">{calculation.maxSafeSize}</strong>
        </p>

        {/* Selected Feeder Nutrition Breakdown */}
        <div className="mt-6 rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="font-semibold text-sm text-foreground">{t(`reptile-feeder-size-calculator.ui.feeder.${feederChoice}.name`)}</div>
            <Badge variant="outline" className="text-[11px] font-medium">{t(`reptile-feeder-size-calculator.ui.feeder.${feederChoice}.caRatio`)} Ca:P</Badge>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 text-center text-xs">
            <div className="rounded-lg border p-2 bg-muted/20">
              <span className="text-muted-foreground text-[10px] uppercase">{t("reptile-feeder-size-calculator.ui.crudeProtein")}</span>
              <div className="font-bold text-foreground mt-0.5">{selectedNutr.protein}</div>
            </div>
            <div className="rounded-lg border p-2 bg-muted/20">
              <span className="text-muted-foreground text-[10px] uppercase">{t("reptile-feeder-size-calculator.ui.crudeFat")}</span>
              <div className="font-bold text-foreground mt-0.5">{selectedNutr.fat}</div>
            </div>
            <div className="rounded-lg border p-2 bg-muted/20">
              <span className="text-muted-foreground text-[10px] uppercase">{t("reptile-feeder-size-calculator.ui.bestSuitedFor")}</span>
              <div className="font-medium text-foreground mt-0.5 truncate">{t(`reptile-feeder-size-calculator.ui.feeder.${feederChoice}.bestFor`)}</div>
            </div>
            <div className="rounded-lg border p-2 bg-muted/20">
              <span className="text-muted-foreground text-[10px] uppercase">{t("reptile-feeder-size-calculator.ui.dustingRule")}</span>
              <div className="font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">{t("reptile-feeder-size-calculator.ui.calcium4xWk")}</div>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{t(`reptile-feeder-size-calculator.ui.feeder.${feederChoice}.notes`)}</p>
        </div>
      </div>
    </div>
  );
}

/* 4. SNAKE FEEDING SCHEDULE & REFUSAL TRACKER */
export function SnakeFeedingSchedule() {
  const { t } = useTranslation("tools");
  const [snakeType, setSnakeType] = useState<string>("ball");
  const [snakeWeightGrams, setSnakeWeightGrams] = useState<number>(350);
  const [feedingStatus, setFeedingStatus] = useState<string>("regular");

  const scheduleProfiles: Record<string, { adultInterval: string; juvenileInterval: string; tips: string }> = {
    ball: { adultInterval: "Every 10–14 days (small rat 50-80g)", juvenileInterval: "Every 7 days (rat pup 20-30g or hopper mouse)" },
    corn: { adultInterval: "Every 10–14 days (large adult mouse 20-30g)", juvenileInterval: "Every 5–7 days (pinky to fuzzy mouse)" },
    king: { adultInterval: "Every 10–12 days (adult mouse)", juvenileInterval: "Every 5–7 days (pinky to fuzzy)" },
    boa: { adultInterval: "Every 2–4 weeks (medium to large rat)", juvenileInterval: "Every 10–14 days (weanling rat)" },
    hognose: { adultInterval: "Every 7–10 days (fuzzy to hopper mouse)", juvenileInterval: "Every 4–6 days (pinky mouse)" },
    garter: { adultInterval: "Every 5–7 days (pinky mouse / fish fillet)", juvenileInterval: "Every 3–5 days (chopped worm / silversides)" },
  };

  const selectedSnake = scheduleProfiles[snakeType] || scheduleProfiles["ball"];

  const plan = useMemo(() => {
    const wt = snakeWeightGrams;
    let stage = t("snake-feeding-schedule.ui.stageJuvenile");
    let targetPreyWeight = t("snake-feeding-schedule.ui.targetPreyWeightDefault");
    let interval = t("snake-feeding-schedule.ui.interval7Days");
    let preyName = t("snake-feeding-schedule.ui.preyNameDefault");

    if (wt < 100) {
      stage = t("snake-feeding-schedule.ui.stageHatchlingBaby");
      targetPreyWeight = t("snake-feeding-schedule.ui.targetPreyWeight1215", { lo: Math.round(wt * 0.12), hi: Math.round(wt * 0.15) });
      interval = t("snake-feeding-schedule.ui.interval57Days");
      preyName = t("snake-feeding-schedule.ui.preyNamePinkyFuzzy");
    } else if (wt < 500) {
      stage = t("snake-feeding-schedule.ui.stageJuvenileSubAdult");
      targetPreyWeight = t("snake-feeding-schedule.ui.targetPreyWeight1013", { lo: Math.round(wt * 0.10), hi: Math.round(wt * 0.13) });
      interval = t("snake-feeding-schedule.ui.interval710Days");
      preyName = t("snake-feeding-schedule.ui.preyNameWeanling");
    } else {
      stage = t("snake-feeding-schedule.ui.stageAdult");
      targetPreyWeight = t("snake-feeding-schedule.ui.targetPreyWeight58", { lo: Math.round(wt * 0.05), hi: Math.round(wt * 0.08) });
      interval = t("snake-feeding-schedule.ui.interval1218Days");
      preyName = wt > 1500 ? t("snake-feeding-schedule.ui.preyNameLargeRat") : t("snake-feeding-schedule.ui.preyNameSmallMediumRat");
    }

    return { stage, targetPreyWeight, interval, preyName };
  }, [snakeWeightGrams]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card/60 p-5 shadow-xs">
        <h3 className="font-semibold text-foreground">{t("snake-feeding-schedule.ui.snakeFeedingSchedulePreyPortionPlanner")}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t("snake-feeding-schedule.ui.calculatesOptimalMealWeightAndFeeding")}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("snake-feeding-schedule.ui.snakeSpecies")}</Label>
            <Select value={snakeType} onValueChange={setSnakeType}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(scheduleProfiles).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{t(`snake-feeding-schedule.ui.species.${k}.name`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("snake-feeding-schedule.ui.snakeWeightGrams")}</Label>
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
            <Label className="text-xs font-medium text-muted-foreground">{t("snake-feeding-schedule.ui.feedingCondition")}</Label>
            <Select value={feedingStatus} onValueChange={setFeedingStatus}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">{t("snake-feeding-schedule.ui.activeRegularFeeder")}</SelectItem>
                <SelectItem value="shedding">{t("snake-feeding-schedule.ui.inShedBlueEyesOftenRefuses")}</SelectItem>
                <SelectItem value="winter">{t("snake-feeding-schedule.ui.winterSeasonFasting")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">{t("snake-feeding-schedule.ui.recommendedMealSchedule")}</span>
            <div className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
              {plan.interval} — {plan.preyName}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              t("snake-feeding-schedule.ui.targetMealSize") <strong className="text-foreground">{plan.targetPreyWeight}</strong> • t("snake-feeding-schedule.ui.lifeStage") <Badge variant="outline" className="ml-1 text-[11px]">{plan.stage}</Badge>
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("snake-feeding-schedule.ui.targetInterval")}</div>
            <div className="mt-1 text-base font-bold text-foreground">{plan.interval}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("snake-feeding-schedule.ui.recommendedPrey")}</div>
            <div className="mt-1 text-xs font-bold text-primary truncate">{t(`snake-feeding-schedule.ui.species.${snakeType}.preyType`)}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("snake-feeding-schedule.ui.digestionPeriod")}</div>
            <div className="mt-1 text-base font-bold text-foreground">{t("snake-feeding-schedule.ui.n48Hours")}</div>
            <div className="text-[10px] text-muted-foreground">{t("snake-feeding-schedule.ui.doNotHandle")}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase">{t("snake-feeding-schedule.ui.preyTempTarget")}</div>
            <div className="mt-1 text-base font-bold text-rose-600 dark:text-rose-400">{t("snake-feeding-schedule.ui.n100F38C")}</div>
          </div>
        </div>

        {feedingStatus === "shedding" && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p>{t("snake-feeding-schedule.ui.inShed")}</p>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground">
          {t("snake-feeding-schedule.ui.expertFeedingTip")} {t(`snake-feeding-schedule.ui.species.${snakeType}.tips`)}
        </div>
      </div>
    </div>
  );
}

/* 5. TURTLE TANK & FILTRATION CALCULATOR */
export function TurtleTank() {
  const { t } = useTranslation("tools");
  const [species, setSpecies] = useState<string>("slider");
  const [shellInches, setShellInches] = useState<number>(6);
  const [turtleCount, setTurtleCount] = useState<number>(1);
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  const turtleData: Record<string, { adultSize: string; swimmingStyle: string; notes: string }> = {
    slider: { adultSize: "8–12 in (20–30 cm)", swimmingStyle: "Active deep swimmer" },
    painted: { adultSize: "6–9 in (15–23 cm)", swimmingStyle: "Active swimmer" },
    musk: { adultSize: "3.5–5 in (9–13 cm)", swimmingStyle: "Bottom walker / Shallow swimmer" },
    map: { adultSize: "6–10 in (15–25 cm)", swimmingStyle: "Active river swimmer" },
    softshell: { adultSize: "10–18 in (25–45 cm)", swimmingStyle: "Deep water burrower" },
    box: { adultSize: "5–7 in (13–18 cm)", swimmingStyle: "Terrestrial / Shallow wader" },
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
            <h3 className="font-semibold text-foreground">{t("turtle-tank-calculator.ui.aquaticTurtleTankFiltrationSizer")}</h3>
            <p className="text-xs text-muted-foreground">{t("turtle-tank-calculator.ui.calculatesGallonsTankDimensionsCanisterFilter")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("imperial")}
              className="h-8 text-xs font-medium"
            >{t("turtle-tank-calculator.ui.gallonsInches")}</Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("metric")}
              className="h-8 text-xs font-medium"
            >{t("turtle-tank-calculator.ui.litersCm")}</Button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("turtle-tank-calculator.ui.turtleSpecies")}</Label>
            <Select value={species} onValueChange={setSpecies}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(turtleData).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{t(`turtle-tank-calculator.ui.species.${k}.name`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              {t("turtle-tank-calculator.ui.straightCarapaceLength")} ({unit === "imperial" ? t("turtle-tank-calculator.ui.inches") : t("turtle-tank-calculator.ui.cm")})
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
            <Label className="text-xs font-medium text-muted-foreground">{t("turtle-tank-calculator.ui.numberOfTurtles")}</Label>
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
        <span className="text-xs font-semibold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase">{t("turtle-tank-calculator.ui.minimumWaterEnclosureRequirement")}</span>
        <div className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
          {unit === "imperial" ? (
            <>{t("turtle-tank-calculator.ui.gallonsMinimum", { v: calc.minWaterGallons })}</>
          ) : (
            <>{t("turtle-tank-calculator.ui.litersMinimum", { v: calc.minWaterLiters })}</>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          t("turtle-tank-calculator.ui.recommendedTankFootprint") <strong>{calc.tankLIn}&quot; L × {calc.tankWIn}&quot; W × {calc.tankHIn}&quot; H</strong> ({Math.round(calc.tankLIn * 2.54)} × {Math.round(calc.tankWIn * 2.54)} × {Math.round(calc.tankHIn * 2.54)} cm)
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Waves className="h-3.5 w-3.5 text-cyan-500" /> {t("turtle-tank-calculator.ui.filterFlow")}
            </div>
            <div className="mt-1 text-lg font-bold text-foreground">{calc.minFilterGph} GPH</div>
            <div className="text-[10px] text-muted-foreground">{t("turtle-tank-calculator.ui.canisterFilter35Volume")}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Sun className="h-3.5 w-3.5 text-amber-500" /> {t("turtle-tank-calculator.ui.baskingDock")}
            </div>
            <div className="mt-1 text-lg font-bold text-foreground">{calc.minDockAreaSqFt} sq ft</div>
            <div className="text-[10px] text-muted-foreground">{t("turtle-tank-calculator.ui.n100DryPlatform")}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" /> {t("turtle-tank-calculator.ui.waterHeater")}
            </div>
            <div className="mt-1 text-lg font-bold text-foreground">{t("turtle-tank-calculator.ui.watts", { v: calc.heaterWattage })}</div>
            <div className="text-[10px] text-muted-foreground">{t("turtle-tank-calculator.ui.target7580F2427")}</div>
          </div>

          <div className="rounded-xl border bg-card/80 p-3 text-center">
            <div className="text-[11px] font-medium text-muted-foreground uppercase flex items-center justify-center gap-1">
              <Thermometer className="h-3.5 w-3.5 text-rose-500" /> {t("turtle-tank-calculator.ui.dockTemp")}
            </div>
            <div className="mt-1 text-lg font-bold text-rose-600 dark:text-rose-400">{t("turtle-tank-calculator.ui.n9095F")}</div>
            <div className="text-[10px] text-muted-foreground">{t("turtle-tank-calculator.ui.surfaceBaskingHeat")}</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3.5 text-xs text-muted-foreground">
          <strong>{t("turtle-tank-calculator.ui.speciesHusbandryNote", { name: t(`turtle-tank-calculator.ui.species.${species}.name`) })}</strong> {t(`turtle-tank-calculator.ui.species.${species}.notes`)}
        </div>
      </div>
    </div>
  );
}

/* ─────────── HORSES ─────────── */
export function HorseFeed() {
  const { t } = useTranslation("tools");
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
              <button type="button" onClick={() => setUnit("lb")} className={`px-2.5 py-1 rounded ${unit === "lb" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>{t("horse-feed-calculator.ui.poundsLb")}</button>
              <button type="button" onClick={() => setUnit("kg")} className={`px-2.5 py-1 rounded ${unit === "kg" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>{t("horse-feed-calculator.ui.kilogramsKg")}</button>
            </div>
          </div>
          <div>
            <Label>{t("horse-feed-calculator.ui.horseBodyWeightUnit", { unit })}</Label>
            <Input type="number" min={200} max={2500} value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("horse-feed-calculator.ui.physiologicalWorkloadStatus")}</Label>
            <Select value={work} onValueChange={(v) => setWork(v as typeof work)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">{t("horse-feed-calculator.ui.maintenancePastureIdleSenior")}</SelectItem>
                <SelectItem value="light">{t("horse-feed-calculator.ui.lightWorkPleasureRiding13")}</SelectItem>
                <SelectItem value="moderate">{t("horse-feed-calculator.ui.moderateWorkSchoolingJumping35")}</SelectItem>
                <SelectItem value="heavy">{t("horse-feed-calculator.ui.heavyWorkEventingPoloRacingRanching")}</SelectItem>
                <SelectItem value="lactating">{t("horse-feed-calculator.ui.lactatingBroodmarePeakMilkDemand")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("horse-feed-calculator.ui.primaryForageBase")}</Label>
            <Select value={forageType} onValueChange={(v) => setForageType(v as typeof forageType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="timothy">{t("horse-feed-calculator.ui.grassHayTimothyOrchardCoastalBermuda")}</SelectItem>
                <SelectItem value="alfalfa">{t("horse-feed-calculator.ui.legumeHayAlfalfaLucerneMix")}</SelectItem>
                <SelectItem value="pasture">{t("horse-feed-calculator.ui.managedLushPastureGrazing")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("horse-feed-calculator.ui.text", { displayForage, unit })} label={t("horse-feed-calculator.ui.dailyForageHayMinimum")} unit={t("horse-feed-calculator.ui.standardFlakesDay", { flakesApprox })} />
          <Rows items={[
            { label: t("horse-feed-calculator.ui.recommendedConcentrateGrain"), value: t("horse-feed-calculator.ui.daySplitInto23Small", { displayConcentrate, unit }) },
            { label: t("horse-feed-calculator.ui.totalDryMatterIntakeTarget"), value: `${unit === "kg" ? (totalDmiLb / 2.20462).toFixed(1) : totalDmiLb.toFixed(1)} ${unit}/day (${(dmiPercent * 100).toFixed(1)}% BW)` },
            { label: t("horse-feed-calculator.ui.equineDigestiveSafetyLimit"), value: t("horse-feed-calculator.ui.neverFeed05BWIn") },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("horse-feed-calculator.ui.clinicalFeedingRule")}</p>
          </div>
        </div>
      }
    />
  );
}

export function HorseWater() {
  const { t } = useTranslation("tools");
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
              <button type="button" onClick={() => setUnit("gal")} className={`px-2.5 py-1 rounded ${unit === "gal" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>{t("horse-water-intake-calculator.ui.gallons")}</button>
              <button type="button" onClick={() => setUnit("liter")} className={`px-2.5 py-1 rounded ${unit === "liter" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"}`}>{t("horse-water-intake-calculator.ui.liters")}</button>
            </div>
          </div>
          <div>
            <Label>{t("horse-water-intake-calculator.ui.horseBodyWeightLb")}</Label>
            <Input type="number" min={300} max={2500} value={weightLb} onChange={(e) => setWeightLb(+e.target.value || 0)} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("horse-water-intake-calculator.ui.ambientTemperatureHumidity")}</Label>
            <Select value={temp} onValueChange={(v) => setTemp(v as typeof temp)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cool">{t("horse-water-intake-calculator.ui.coolWinter45F7C")}</SelectItem>
                <SelectItem value="moderate">{t("horse-water-intake-calculator.ui.moderateSpring4575F7")}</SelectItem>
                <SelectItem value="hot">{t("horse-water-intake-calculator.ui.hotSummer85F29C")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("horse-water-intake-calculator.ui.dailyExerciseSweatRate")}</Label>
            <Select value={work} onValueChange={(v) => setWork(v as typeof work)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="idle">{t("horse-water-intake-calculator.ui.restingPastureZeroVisibleSweat")}</SelectItem>
                <SelectItem value="light">{t("horse-water-intake-calculator.ui.lightWorkLightNeckLather1")}</SelectItem>
                <SelectItem value="heavy">{t("horse-water-intake-calculator.ui.heavyWorkCompetitionHeavySweatDripping")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("horse-water-intake-calculator.ui.dietMoistureBase")}</Label>
            <Select value={feedType} onValueChange={(v) => setFeedType(v as typeof feedType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dry">{t("horse-water-intake-calculator.ui.dryForageHay1012Moisture")}</SelectItem>
                <SelectItem value="pasture">{t("horse-water-intake-calculator.ui.freshGreenPasture7080Moisture")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={displayVal} label={t("horse-water-intake-calculator.ui.minimumDailyWaterRequirement")} unit={unit === "gal" ? `≈ ${totalLiters} L / day` : `≈ ${totalGal} gal / day`} />
          <Rows items={[
            { label: t("horse-water-intake-calculator.ui.bucketEquivalents"), value: t("horse-water-intake-calculator.ui.standard5GallonWaterBuckets", { v0: Math.ceil(totalGal / 5) }) },
            { label: t("horse-water-intake-calculator.ui.winterTemperatureWarning"), value: t("horse-water-intake-calculator.ui.waterMustBe4565F") },
            { label: t("horse-water-intake-calculator.ui.electrolyteMandate"), value: work === "heavy" || temp === "hot" ? t("horse-water-intake-calculator.ui.electrolyteHeavy") : t("horse-water-intake-calculator.ui.saltBlock") },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("horse-water-intake-calculator.ui.colicPreventionRule")}</p>
          </div>
        </div>
      }
    />
  );
}

export function HorseAge() {
  const { t } = useTranslation("tools");
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
  const lifeStage = years < 1 ? t("horse-age-calculator.ui.lifeStageFoal") : years < 3 ? t("horse-age-calculator.ui.lifeStageYoungstock") : years < 6 ? t("horse-age-calculator.ui.lifeStageYoungAdult") : years < 15 ? t("horse-age-calculator.ui.lifeStagePrimeAdult") : years < 20 ? t("horse-age-calculator.ui.lifeStageVeteran") : t("horse-age-calculator.ui.lifeStageGeriatric");

  return (
    <CalculatorLayout
      form={
        <div className="space-y-4">
          <div>
            <Label>{t("horse-age-calculator.ui.equineTypeBreedClass")}</Label>
            <Select value={breedType} onValueChange={(v) => setBreedType(v as typeof breedType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pony">{t("horse-age-calculator.ui.ponyMiniatureLongevity3040Years")}</SelectItem>
                <SelectItem value="light">{t("horse-age-calculator.ui.lightHorseQuarterHorseThoroughbredArabian")}</SelectItem>
                <SelectItem value="warmblood">{t("horse-age-calculator.ui.warmbloodSportHorse2226Years")}</SelectItem>
                <SelectItem value="draft">{t("horse-age-calculator.ui.draftHorseClydesdalePercheron1822")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("horse-age-calculator.ui.horseChronologicalAgeYears")}</Label>
            <Input type="number" min={0} max={50} value={years} onChange={(e) => setYears(+e.target.value || 0)} className="mt-1.5" />
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("horse-age-calculator.ui.years", { humanAge })} label={t("horse-age-calculator.ui.humanPhysiologicalEquivalentAge")} unit={lifeStage} />
          <Rows items={[
            { label: t("horse-age-calculator.ui.equineLifeStageClassification"), value: lifeStage },
            { label: t("horse-age-calculator.ui.veterinaryDentalRoutine"), value: years >= 15 ? t("horse-age-calculator.ui.dentalSenior") : t("horse-age-calculator.ui.dentalAdult") },
            { label: t("horse-age-calculator.ui.endocrineMetabolicScreening"), value: years >= 15 ? t("horse-age-calculator.ui.endocrineSenior") : t("horse-age-calculator.ui.endocrineAdult") },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("horse-age-calculator.ui.seniorCareProtocol")}</p>
          </div>
        </div>
      }
    />
  );
}

export function HorseBCS() {
  const { t } = useTranslation("tools");
  const [neck, setNeck] = useState<1 | 3 | 5 | 7 | 9>(5);
  const [withers, setWithers] = useState<1 | 3 | 5 | 7 | 9>(5);
  const [spine, setSpine] = useState<1 | 3 | 5 | 7 | 9>(5);
  const [ribs, setRibs] = useState<1 | 3 | 5 | 7 | 9>(5);
  const [shoulder, setShoulder] = useState<1 | 3 | 5 | 7 | 9>(5);
  const [tailhead, setTailhead] = useState<1 | 3 | 5 | 7 | 9>(5);

  const avgScore = Math.round((neck + withers + spine + ribs + shoulder + tailhead) / 6);
  const classifications: Record<number, { title: string; desc: string; tone: "safe" | "warning" | "danger" }> = {
    1: { title: t("horse-body-condition-score.ui.bcs.1.title"), desc: t("horse-body-condition-score.ui.bcs.1.desc"), tone: "danger" },
    2: { title: t("horse-body-condition-score.ui.bcs.2.title"), desc: t("horse-body-condition-score.ui.bcs.2.desc"), tone: "danger" },
    3: { title: t("horse-body-condition-score.ui.bcs.3.title"), desc: t("horse-body-condition-score.ui.bcs.3.desc"), tone: "warning" },
    4: { title: t("horse-body-condition-score.ui.bcs.4.title"), desc: t("horse-body-condition-score.ui.bcs.4.desc"), tone: "warning" },
    5: { title: t("horse-body-condition-score.ui.bcs.5.title"), desc: t("horse-body-condition-score.ui.bcs.5.desc"), tone: "safe" },
    6: { title: t("horse-body-condition-score.ui.bcs.6.title"), desc: t("horse-body-condition-score.ui.bcs.6.desc"), tone: "safe" },
    7: { title: t("horse-body-condition-score.ui.bcs.7.title"), desc: t("horse-body-condition-score.ui.bcs.7.desc"), tone: "warning" },
    8: { title: t("horse-body-condition-score.ui.bcs.8.title"), desc: t("horse-body-condition-score.ui.bcs.8.desc"), tone: "danger" },
    9: { title: t("horse-body-condition-score.ui.bcs.9.title"), desc: t("horse-body-condition-score.ui.bcs.9.desc"), tone: "danger" },
  };

  const cur = classifications[avgScore] || classifications[5];

  return (
    <CalculatorLayout
      form={
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{t("horse-body-condition-score.ui.rateEachAnatomicalPalpationZoneAccording")}</p>
          <div>
            <Label className="text-xs">{t("horse-body-condition-score.ui.n1CrestOfTheNeck")}</Label>
            <Select value={String(neck)} onValueChange={(v) => setNeck(+v as typeof neck)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{t("horse-body-condition-score.ui.eweNeckBoneVisibleBCS1")}</SelectItem>
                <SelectItem value="3">{t("horse-body-condition-score.ui.slightFatOverCrestBCS3")}</SelectItem>
                <SelectItem value="5">{t("horse-body-condition-score.ui.smoothBlendIntoShoulderNoHard")}</SelectItem>
                <SelectItem value="7">{t("horse-body-condition-score.ui.noticeableFirmCrestBCS67")}</SelectItem>
                <SelectItem value="9">{t("horse-body-condition-score.ui.heavyBulgingCrestyNeckRollingTo")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{t("horse-body-condition-score.ui.n2WithersShoulder")}</Label>
            <Select value={String(withers)} onValueChange={(v) => setWithers(+v as typeof withers)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{t("horse-body-condition-score.ui.sharpHollowedBehindShoulderBCS1")}</SelectItem>
                <SelectItem value="5">{t("horse-body-condition-score.ui.roundedWithersSmoothShoulderBlendBCS")}</SelectItem>
                <SelectItem value="9">{t("horse-body-condition-score.ui.bulgingFatPadsBehindShoulderWithers")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{t("horse-body-condition-score.ui.n3RibPalpation")}</Label>
            <Select value={String(ribs)} onValueChange={(v) => setRibs(+v as typeof ribs)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{t("horse-body-condition-score.ui.prominentlyVisibleIndividuallyBCS12")}</SelectItem>
                <SelectItem value="3">{t("horse-body-condition-score.ui.visibleAtADistanceBCS3")}</SelectItem>
                <SelectItem value="5">{t("horse-body-condition-score.ui.notSeenVisuallyEasilyFeltWith")}</SelectItem>
                <SelectItem value="7">{t("horse-body-condition-score.ui.feltOnlyWithFirmPressureBCS")}</SelectItem>
                <SelectItem value="9">{t("horse-body-condition-score.ui.cannotBePalpatedUnderThickFat")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">{t("horse-body-condition-score.ui.n4SpineLoinTailhead")}</Label>
            <Select value={String(spine)} onValueChange={(v) => setSpine(+v as typeof spine)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{t("horse-body-condition-score.ui.sharpRidgeSpineProminentTailheadBone")}</SelectItem>
                <SelectItem value="5">{t("horse-body-condition-score.ui.flatLevelBackWithSpongyTailhead")}</SelectItem>
                <SelectItem value="9">{t("horse-body-condition-score.ui.deepGutterCreaseDownSpineBulging")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("horse-body-condition-score.ui.n9", { avgScore })} label={t("horse-body-condition-score.ui.hennekeBodyConditionScore")} unit={t(`horse-body-condition-score.ui.bcs.${avgScore}.title`)} />
          <div className={`rounded-lg p-3 text-xs ${cur.tone === "safe" ? "bg-primary/10 text-primary" : cur.tone === "warning" ? "bg-amber-500/10 text-amber-900 dark:text-amber-200" : "bg-destructive/10 text-destructive"}`}>
            {t("horse-body-condition-score.ui.assessment")} {t(`horse-body-condition-score.ui.bcs.${avgScore}.desc`)}
          </div>
          {avgScore >= 7 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
              {t("horse-body-condition-score.ui.laminitisEMSWarning")}
            </div>
          )}
        </div>
      }
    />
  );
}

/* ─────────── FARM ─────────── */
export function ChickenCoopSize() {
  const { t } = useTranslation("tools");
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
            <Label>{t("chicken-coop-size-calculator.ui.numberOfLayingHens")}</Label>
            <Input type="number" min={1} max={500} value={count} onChange={(e) => setCount(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("chicken-coop-size-calculator.ui.breedSizeClass")}</Label>
            <Select value={breedType} onValueChange={(v) => setBreedType(v as typeof breedType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bantam">{t("chicken-coop-size-calculator.ui.bantamBreedsSilkiePekinSebright2")}</SelectItem>
                <SelectItem value="standard">{t("chicken-coop-size-calculator.ui.standardLayersLeghornEasterEggerISA")}</SelectItem>
                <SelectItem value="heavy">{t("chicken-coop-size-calculator.ui.heavyDualPurposeOrpingtonBrahmaJersey")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("chicken-coop-size-calculator.ui.dailyConfinementManagement")}</Label>
            <Select value={confinement} onValueChange={(v) => setConfinement(v as typeof confinement)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="run_only">{t("chicken-coop-size-calculator.ui.enclosedRunOnly100TimeIn")}</SelectItem>
                <SelectItem value="free_range">{t("chicken-coop-size-calculator.ui.supervisedDailyFreeRangePasture")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("chicken-coop-size-calculator.ui.sqFt", { minCoopSqFt })} label={t("chicken-coop-size-calculator.ui.minimumCoopFloorSpace")} unit={t("chicken-coop-size-calculator.ui.runSqFt", { minRunSqFt })} />
          <Rows items={[
            { label: t("chicken-coop-size-calculator.ui.enclosedPredatorRun"), value: t("chicken-coop-size-calculator.ui.sqFt12HardwareCloth", { minRunSqFt }) },
            { label: t("chicken-coop-size-calculator.ui.totalRoostingBarLength"), value: t("chicken-coop-size-calculator.ui.linearFeet2x4FlatSideUp", { roostLengthFeet }) },
            { label: t("chicken-coop-size-calculator.ui.nestingBoxesNeeded"), value: t("chicken-coop-size-calculator.ui.privateBoxes1212In", { nestBoxes }) },
            { label: t("chicken-coop-size-calculator.ui.minimumHighVentilationArea"), value: t("chicken-coop-size-calculator.ui.sqFtUpperSoffitVents", { ventilationSqFt }) },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("chicken-coop-size-calculator.ui.predatorSecurityRule")}</p>
          </div>
        </div>
      }
    />
  );
}

export function ChickenEggProduction() {
  const { t } = useTranslation("tools");
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
            <Label>{t("chicken-egg-production-tracker.ui.flockHenCount")}</Label>
            <Input type="number" min={1} max={500} value={count} onChange={(e) => setCount(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("chicken-egg-production-tracker.ui.henBreedGenetics")}</Label>
            <Select value={breed} onValueChange={(v) => setBreed(v as typeof breed)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hybrid">{t("chicken-egg-production-tracker.ui.productionHybridISABrownGoldenComet")}</SelectItem>
                <SelectItem value="heritage">{t("chicken-egg-production-tracker.ui.highYieldHeritageWhiteLeghornAustralorp")}</SelectItem>
                <SelectItem value="dual">{t("chicken-egg-production-tracker.ui.dualPurposeHeritageRhodeIslandRed")}</SelectItem>
                <SelectItem value="bantam">{t("chicken-egg-production-tracker.ui.bantamOrnamentalSilkiesPolish130Eggs")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("chicken-egg-production-tracker.ui.henAgeGroup")}</Label>
            <Select value={ageYears} onValueChange={(v) => setAgeYears(v as typeof ageYears)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{t("chicken-egg-production-tracker.ui.year1PointOfLayTo")}</SelectItem>
                <SelectItem value="2">{t("chicken-egg-production-tracker.ui.year2PostFirstMolt82")}</SelectItem>
                <SelectItem value="3">{t("chicken-egg-production-tracker.ui.year3MatureAdult65Of")}</SelectItem>
                <SelectItem value="4">{t("chicken-egg-production-tracker.ui.year4SeniorHen45Of")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("chicken-egg-production-tracker.ui.winterLightingManagement")}</Label>
            <Select value={lighting} onValueChange={(v) => setLighting(v as typeof lighting)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="natural">{t("chicken-egg-production-tracker.ui.naturalSeasonalPhotoperiodWinterRestLaying")}</SelectItem>
                <SelectItem value="supplemental">{t("chicken-egg-production-tracker.ui.supplementalLighting1416HrsLight")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("chicken-egg-production-tracker.ui.eggsWk", { weeklyAvg })} label={t("chicken-egg-production-tracker.ui.estimatedWeeklyEggHarvest")} unit={t("chicken-egg-production-tracker.ui.dozenMonth", { dozensMonthly })} />
          <Rows items={[
            { label: t("chicken-egg-production-tracker.ui.annualProjectedHarvest"), value: t("chicken-egg-production-tracker.ui.totalEggsDozen", { v0: totalAnnualEggs.toLocaleString(), v1: Math.round(totalAnnualEggs / 12) }) },
            { label: t("chicken-egg-production-tracker.ui.dailyPeakRate"), value: t("chicken-egg-production-tracker.ui.toEggsPerDay", { v0: Math.round(weeklyAvg / 7), v1: Math.ceil(weeklyAvg / 7) }) },
            { label: t("chicken-egg-production-tracker.ui.calciumProteinSupport"), value: t("chicken-egg-production-tracker.ui.offerFreeChoiceCrushedOysterShell") },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("chicken-egg-production-tracker.ui.avianPhotoperiodScience")}</p>
          </div>
        </div>
      }
    />
  );
}

export function GoatFeed() {
  const { t } = useTranslation("tools");
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
            <Label>{t("goat-feed-calculator.ui.goatBodyWeightLb")}</Label>
            <Input type="number" min={20} max={350} value={weightLb} onChange={(e) => setWeightLb(Math.max(10, +e.target.value || 10))} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("goat-feed-calculator.ui.productionPhysiologicalClass")}</Label>
            <Select value={goatClass} onValueChange={(v) => setGoatClass(v as typeof goatClass)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="wether">{t("goat-feed-calculator.ui.dryDoeCastratedWetherPetMaintenance")}</SelectItem>
                <SelectItem value="lactating">{t("goat-feed-calculator.ui.highYieldDairyDoeInMilk")}</SelectItem>
                <SelectItem value="pregnant">{t("goat-feed-calculator.ui.lateGestationDoeLast46")}</SelectItem>
                <SelectItem value="growing">{t("goat-feed-calculator.ui.growingMeatDairyKidWeanling")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("goat-feed-calculator.ui.primaryForageSource")}</Label>
            <Select value={forageType} onValueChange={(v) => setForageType(v as typeof forageType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="grass">{t("goat-feed-calculator.ui.grassHayTimothyOrchardCoastalBermuda")}</SelectItem>
                <SelectItem value="alfalfa">{t("goat-feed-calculator.ui.alfalfaLucerneHighCalciumProtein")}</SelectItem>
                <SelectItem value="browse">{t("goat-feed-calculator.ui.woodyShrubBrowsePasture")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("goat-feed-calculator.ui.lbHayDay", { v0: hayLb.toFixed(1) })} label={t("goat-feed-calculator.ui.dailyForageHayMinimum")} unit={t("goat-feed-calculator.ui.grainLbDay", { v0: grainLb.toFixed(1) })} />
          <Rows items={[
            { label: t("goat-feed-calculator.ui.dryMatterIntakeDMI"), value: t("goat-feed-calculator.ui.lbsTotalDryMatterDayBW", { v0: totalDmiLb.toFixed(1), v1: (dmiPercent * 100).toFixed(1) }) },
            { label: t("goat-feed-calculator.ui.dailyGrainConcentrate"), value: grainLb > 0 ? t("goat-feed-calculator.ui.grainLbsDaySplit", { v: grainLb.toFixed(1) }) : t("goat-feed-calculator.ui.forageOnlyDiet") },
            { label: t("goat-feed-calculator.ui.urinaryCalculiProtection"), value: goatClass === "wether" ? t("goat-feed-calculator.ui.wetherMineralMandatory") : t("goat-feed-calculator.ui.goatMineralsCopper") },
          ]} />
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            {t("goat-feed-calculator.ui.wetherUrinaryCalculiHazard")}
          </div>
        </div>
      }
    />
  );
}

export function DuckPondSize() {
  const { t } = useTranslation("tools");
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
            <Label>{t("duck-pond-size-calculator.ui.numberOfWaterfowlDucksGeese")}</Label>
            <Input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.max(1, +e.target.value || 1))} className="mt-1.5" />
          </div>
          <div>
            <Label>{t("duck-pond-size-calculator.ui.duckBreedSize")}</Label>
            <Select value={breedSize} onValueChange={(v) => setBreedSize(v as typeof breedSize)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bantam">{t("duck-pond-size-calculator.ui.bantamDucksCallDuckMallard1")}</SelectItem>
                <SelectItem value="medium">{t("duck-pond-size-calculator.ui.mediumProductionPekinKhakiCampbellCayuga")}</SelectItem>
                <SelectItem value="heavy">{t("duck-pond-size-calculator.ui.heavyBreedsGeeseMuscovyRouenToulouse")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t("duck-pond-size-calculator.ui.pondInfrastructureSetup")}</Label>
            <Select value={pondType} onValueChange={(v) => setPondType(v as typeof pondType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="filtered_pond">{t("duck-pond-size-calculator.ui.permanentInGroundFilteredPond")}</SelectItem>
                <SelectItem value="kiddie_pool">{t("duck-pond-size-calculator.ui.heavyDutyPlasticDrainableStockTank")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      result={
        <div className="space-y-4">
          <Big value={t("duck-pond-size-calculator.ui.gallons", { minWaterGal })} label={t("duck-pond-size-calculator.ui.minimumPondWaterCapacity")} unit={t("duck-pond-size-calculator.ui.surfaceSqFt", { pondSurfaceSqFt })} />
          <Rows items={[
            { label: t("duck-pond-size-calculator.ui.minimumPondDepth"), value: t("duck-pond-size-calculator.ui.n18To24InchesAllowsFull") },
            { label: t("duck-pond-size-calculator.ui.nightCoopFloorSpace"), value: t("duck-pond-size-calculator.ui.sqFtDryBedding", { v0: count * 4 }) },
            { label: t("duck-pond-size-calculator.ui.enclosedDaytimeRunSpace"), value: t("duck-pond-size-calculator.ui.sqFtSecureRun", { v0: count * 15 }) },
            { label: t("duck-pond-size-calculator.ui.requiredFiltrationTurnover"), value: t("duck-pond-size-calculator.ui.gPHBogWetlandMechanicalPreFilter", { flowRateGph }) },
          ]} />
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p>{t("duck-pond-size-calculator.ui.duckHydrodynamicsNote")}</p>
          </div>
        </div>
      }
    />
  );
}

/* ─────────── EXTRA D/C/G ─────────── */
export function DogChocolateToxicity() {
  const { t } = useTranslation("tools");
  const [lb, setLb] = useState(20);
  const [type, setType] = useState<"white" | "milk" | "dark" | "baking">("milk");
  const [oz, setOz] = useState(1);
  const mgPerOz = { white: 1, milk: 60, dark: 150, baking: 400 }[type];
  const kg = lb / 2.2046;
  const dose = (oz * mgPerOz) / kg;
  const risk = dose < 20 ? t("dog-chocolate-toxicity-calculator.ui.riskLow") : dose < 40 ? t("dog-chocolate-toxicity-calculator.ui.riskModerate") : dose < 60 ? t("dog-chocolate-toxicity-calculator.ui.riskSerious") : t("dog-chocolate-toxicity-calculator.ui.riskCritical");
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("dog-chocolate-toxicity-calculator.ui.dogWeightLb")}</Label><Input type="number" value={lb} onChange={(e) => setLb(+e.target.value || 0)} className="mt-1.5" /></div>
        <div><Label>{t("dog-chocolate-toxicity-calculator.ui.chocolateType")}</Label>
          <Select value={type} onValueChange={(v: "white" | "milk" | "dark" | "baking") => setType(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="white">{t("dog-chocolate-toxicity-calculator.ui.white")}</SelectItem>
              <SelectItem value="milk">{t("dog-chocolate-toxicity-calculator.ui.milk")}</SelectItem>
              <SelectItem value="dark">{t("dog-chocolate-toxicity-calculator.ui.darkSemiSweet")}</SelectItem>
              <SelectItem value="baking">{t("dog-chocolate-toxicity-calculator.ui.bakingChocolate")}</SelectItem>
            </SelectContent></Select></div>
        <div><Label>{t("dog-chocolate-toxicity-calculator.ui.amountEatenOz")}</Label><Input type="number" step={0.25} value={oz} onChange={(e) => setOz(+e.target.value || 0)} className="mt-1.5" /></div>
      </>}
      result={<div className="space-y-3">
        <Big value={risk} label={t("dog-chocolate-toxicity-calculator.ui.riskLevel")} />
        <p className="text-center text-sm text-muted-foreground">t("dog-chocolate-toxicity-calculator.ui.theobromineDose") <span className="font-medium text-foreground">{dose.toFixed(1)} mg/kg</span></p>
        <p className="text-center text-xs text-muted-foreground">{t("dog-chocolate-toxicity-calculator.ui.aSPCAPoisonControl8884264435")}</p>
      </div>}
    />
  );
}

export function DogBenadrylDose() {
  const { t } = useTranslation("tools");
  const [lb, setLb] = useState(30);
  const mg = lb; // 1 mg/lb
  return (
    <CalculatorLayout
      form={<div><Label>{t("dog-benadryl-dose-calculator.ui.dogWeightLb")}</Label>
        <Input type="number" value={lb} onChange={(e) => setLb(+e.target.value || 0)} className="mt-1.5" /></div>}
      result={<div className="space-y-3">
        <Big value={t("dog-benadryl-dose-calculator.ui.mg", { mg })} label={t("dog-benadryl-dose-calculator.ui.perDose")} unit={t("dog-benadryl-dose-calculator.ui.upTo3DailyConfirmWith")} />
        <p className="text-center text-sm text-muted-foreground">t("dog-benadryl-dose-calculator.ui.standard25MgTablets") <span className="font-medium text-foreground">{Math.max(0.5, Math.round((mg / 25) * 2) / 2)} t("dog-benadryl-dose-calculator.ui.tab")</span></p>
      </div>}
    />
  );
}

export function CatLitterBoxCount() {
  const { t } = useTranslation("tools");
  const [n, setN] = useState(1);
  return (
    <CalculatorLayout
      form={<div><Label>{t("cat-litter-box-count-calculator.ui.numberOfCats")}</Label>
        <Input type="number" min={1} value={n} onChange={(e) => setN(+e.target.value || 1)} className="mt-1.5" /></div>}
      result={<div className="space-y-3">
        <Big value={n + 1} label={t("cat-litter-box-count-calculator.ui.litterBoxesNeeded")} unit={t("cat-litter-box-count-calculator.ui.n1Rule")} />
        <p className="text-center text-sm text-muted-foreground">{t("cat-litter-box-count-calculator.ui.spreadAcrossFloorsAwayFromFood")}</p>
      </div>}
    />
  );
}

export function PetCarbonPawprint() {
  const { t } = useTranslation("tools");
  const [pet, setPet] = useState<"small-dog" | "med-dog" | "large-dog" | "cat">("med-dog");
  const [diet, setDiet] = useState<"meat" | "mixed" | "insect">("meat");
  const base = { "small-dog": 350, "med-dog": 770, "large-dog": 1400, cat: 310 }[pet];
  const mult = { meat: 1, mixed: 0.7, insect: 0.4 }[diet];
  const co2 = Math.round(base * mult);
  return (
    <CalculatorLayout
      form={<>
        <div><Label>{t("pet-carbon-pawprint-calculator.ui.pet")}</Label>
          <Select value={pet} onValueChange={(v: "small-dog" | "med-dog" | "large-dog" | "cat") => setPet(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="small-dog">{t("pet-carbon-pawprint-calculator.ui.smallDog")}</SelectItem>
              <SelectItem value="med-dog">{t("pet-carbon-pawprint-calculator.ui.mediumDog")}</SelectItem>
              <SelectItem value="large-dog">{t("pet-carbon-pawprint-calculator.ui.largeDog")}</SelectItem>
              <SelectItem value="cat">{t("pet-carbon-pawprint-calculator.ui.cat")}</SelectItem>
            </SelectContent></Select></div>
        <div><Label>{t("pet-carbon-pawprint-calculator.ui.diet")}</Label>
          <Select value={diet} onValueChange={(v: "meat" | "mixed" | "insect") => setDiet(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="meat">{t("pet-carbon-pawprint-calculator.ui.meatBased")}</SelectItem>
              <SelectItem value="mixed">{t("pet-carbon-pawprint-calculator.ui.mixedLowerMeat")}</SelectItem>
              <SelectItem value="insect">{t("pet-carbon-pawprint-calculator.ui.insectNovelProtein")}</SelectItem>
            </SelectContent></Select></div>
      </>}
      result={<Big value={t("pet-carbon-pawprint-calculator.ui.kg", { co2 })} label={t("pet-carbon-pawprint-calculator.ui.cO2ePerYear")} unit={t("pet-carbon-pawprint-calculator.ui.mostlyFromDiet")} />}
    />
  );
}

export function PetMemorialGenerator() {
  const { t } = useTranslation("tools");
  const [name, setName] = useState("Lucy");
  const [years, setYears] = useState(12);
  const [traits, setTraits] = useState("gentle, playful, loyal");
  const [tone, setTone] = useState<"gentle" | "celebratory" | "spiritual">("gentle");
  const text = useMemo(() => {
    const traitList = traits.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4).join(", ");
    if (tone === "celebratory") {
      return t("pet-loss-memorial-generator.ui.textCelebratory", { years, name, traitList });
    }
    if (tone === "spiritual") {
      return t("pet-loss-memorial-generator.ui.textSpiritual", { years, name, traitList });
    }
    return t("pet-loss-memorial-generator.ui.textGentle", { years, name, traitList });
  }, [name, years, traits, tone, t]);
  return (
    <GeneratorLayout
      controls={<div className="grid gap-3 sm:grid-cols-2">
        <div><Label>{t("pet-loss-memorial-generator.ui.petSName")}</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
        <div><Label>{t("pet-loss-memorial-generator.ui.yearsTogether")}</Label><Input type="number" value={years} onChange={(e) => setYears(+e.target.value || 0)} className="mt-1.5" /></div>
        <div className="sm:col-span-2"><Label>{t("pet-loss-memorial-generator.ui.traitsCommaSeparated")}</Label>
          <Input value={traits} onChange={(e) => setTraits(e.target.value)} className="mt-1.5" placeholder={t("pet-loss-memorial-generator.ui.gentlePlayfulLoyal")} /></div>
        <div className="sm:col-span-2"><Label>{t("pet-loss-memorial-generator.ui.tone")}</Label>
          <Select value={tone} onValueChange={(v: "gentle" | "celebratory" | "spiritual") => setTone(v)}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="gentle">{t("pet-loss-memorial-generator.ui.gentle")}</SelectItem>
              <SelectItem value="celebratory">{t("pet-loss-memorial-generator.ui.celebratory")}</SelectItem>
              <SelectItem value="spiritual">{t("pet-loss-memorial-generator.ui.spiritual")}</SelectItem>
            </SelectContent></Select></div>
        <div className="sm:col-span-2 flex justify-end">
          <Button onClick={() => navigator.clipboard?.writeText(text)} className="gap-2"><Sparkles className="size-4" />{t("pet-loss-memorial-generator.ui.copy")}</Button>
        </div>
      </div>}
      results={<Textarea readOnly value={text} className="min-h-[200px] font-serif text-base leading-relaxed" />}
    />
  );
}
