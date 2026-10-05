import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";
import { useTranslation } from "react-i18next";

function useLocal<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try { const r = localStorage.getItem(key); return r ? (JSON.parse(r) as T) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ } }, [key, v]);
  return [v, setV];
}

function Pill({ tone, children }: { tone: "safe" | "caution" | "danger"; children: React.ReactNode }) {
  const cls =
    tone === "safe" ? "bg-emerald-100 text-emerald-800"
    : tone === "caution" ? "bg-amber-100 text-amber-800"
    : "bg-red-100 text-red-800";
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{children}</span>;
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg bg-background/60 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Notes({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
      {items.map((n) => <li key={n}>• {n}</li>)}
    </ul>
  );
}

/* ═══════════ 1. TARANTULA ENCLOSURE SIZE ═══════════ */
export function TarantulaEnclosureCalculator() {
  const { t } = useTranslation("tools");
  const [type, setType] = useState<"terrestrial" | "arboreal" | "fossorial">("terrestrial");
  const [dls, setDls] = useState(5); // diagonal leg span, inches
  const [stage, setStage] = useState<"sling" | "juvenile" | "adult">("adult");

  const floorSide = Math.round(dls * (type === "arboreal" ? 2 : 3));
  const height =
    type === "arboreal" ? Math.round(dls * 4)
    : type === "fossorial" ? Math.round(dls * 3)
    : Math.min(Math.round(dls * 1.5), Math.round(dls + 4));
  const substrate =
    type === "fossorial" ? Math.round(dls * 2.5)
    : type === "arboreal" ? 2
    : Math.max(2, Math.round(dls * 0.8));
  const ventilation = type === "arboreal" ? t("tarantula-enclosure-size-calculator.ui.ventArboreal") : t("tarantula-enclosure-size-calculator.ui.ventTerrestrial");

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("tarantula-enclosure-size-calculator.ui.typeLabel")}</Label>
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="terrestrial">{t("tarantula-enclosure-size-calculator.ui.typeTerrestrial")}</SelectItem>
            <SelectItem value="arboreal">{t("tarantula-enclosure-size-calculator.ui.typeArboreal")}</SelectItem>
            <SelectItem value="fossorial">{t("tarantula-enclosure-size-calculator.ui.typeFossorial")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("tarantula-enclosure-size-calculator.ui.dlsLabel")}</Label>
        <Input type="number" min={0.2} step={0.25} value={dls} onChange={(e) => setDls(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>{t("tarantula-enclosure-size-calculator.ui.stageLabel")}</Label>
        <Select value={stage} onValueChange={(v) => setStage(v as typeof stage)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sling">{t("tarantula-enclosure-size-calculator.ui.stageSling")}</SelectItem>
            <SelectItem value="juvenile">{t("tarantula-enclosure-size-calculator.ui.stageJuvenile")}</SelectItem>
            <SelectItem value="adult">{t("tarantula-enclosure-size-calculator.ui.stageAdult")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={dls > 0 ? "safe" : "caution"}>{t("tarantula-enclosure-size-calculator.ui.pillTitle")}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label={t("tarantula-enclosure-size-calculator.ui.statFloor")} value={`${floorSide} × ${Math.round(floorSide * 0.7)} in`} hint={t("tarantula-enclosure-size-calculator.ui.statFloorHint")} />
        <Stat label={t("tarantula-enclosure-size-calculator.ui.statHeight")} value={`${height} in`} hint={type === "terrestrial" ? t("tarantula-enclosure-size-calculator.ui.statHeightTerrestrial") : t("tarantula-enclosure-size-calculator.ui.statHeightArboreal")} />
        <Stat label={t("tarantula-enclosure-size-calculator.ui.statSubstrate")} value={`${substrate} in`} />
        <Stat label={t("tarantula-enclosure-size-calculator.ui.statVent")} value="Cross-flow" hint={ventilation} />
      </div>
      <Notes items={[
        stage === "sling" ? t("tarantula-enclosure-size-calculator.ui.noteSling") : t("tarantula-enclosure-size-calculator.ui.noteRehouse"),
        type === "terrestrial" ? t("tarantula-enclosure-size-calculator.ui.noteTerrestrial") : t("tarantula-enclosure-size-calculator.ui.noteArboreal"),
        t("tarantula-enclosure-size-calculator.ui.noteWater"),
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 2. TARANTULA FEEDING SCHEDULE ═══════════ */
export function TarantulaFeedingSchedule() {
  const { t } = useTranslation("tools");
  const [stage, setStage] = useState<"sling" | "juvenile" | "subadult" | "adult">("juvenile");
  const [dls, setDls] = useState(3);
  const [premoult, setPremoult] = useState(false);

  const plan = {
    sling: { every: 3, prey: t("tarantula-feeding-schedule.ui.preySling"), count: 1 },
    juvenile: { every: 5, prey: t("tarantula-feeding-schedule.ui.preyJuvenile"), count: 2 },
    subadult: { every: 7, prey: t("tarantula-feeding-schedule.ui.preySubadult"), count: 2 },
    adult: { every: 10, prey: t("tarantula-feeding-schedule.ui.preyAdult"), count: 3 },
  }[stage];

  const preySize = Math.max(0.25, Math.round(dls * 0.5 * 4) / 4);
  const perMonth = premoult ? 0 : Math.round(30 / plan.every) * plan.count;

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("tarantula-feeding-schedule.ui.stageLabel")}</Label>
        <Select value={stage} onValueChange={(v) => setStage(v as typeof stage)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sling">{t("tarantula-feeding-schedule.ui.stageSling")}</SelectItem>
            <SelectItem value="juvenile">{t("tarantula-feeding-schedule.ui.stageJuvenile")}</SelectItem>
            <SelectItem value="subadult">{t("tarantula-feeding-schedule.ui.stageSubadult")}</SelectItem>
            <SelectItem value="adult">{t("tarantula-feeding-schedule.ui.stageAdult")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("tarantula-feeding-schedule.ui.dlsLabel")}</Label>
        <Input type="number" min={0.2} step={0.25} value={dls} onChange={(e) => setDls(Number(e.target.value) || 0)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={premoult} onCheckedChange={(c) => setPremoult(Boolean(c))} />
        {t("tarantula-feeding-schedule.ui.premoultLabel")}
      </label>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={premoult ? "caution" : "safe"}>{premoult ? t("tarantula-feeding-schedule.ui.pillPremoult") : t("tarantula-feeding-schedule.ui.pillPlan")}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label={t("tarantula-feeding-schedule.ui.statFeedEvery")} value={premoult ? t("tarantula-feeding-schedule.ui.pauseValue") : t("tarantula-feeding-schedule.ui.daysValue", { days: plan.every })} />
        <Stat label={t("tarantula-feeding-schedule.ui.statPreyCount")} value={premoult ? "0" : `${plan.count}`} hint={plan.prey} />
        <Stat label={t("tarantula-feeding-schedule.ui.statPreySize")} value={`≤ ${preySize}"`} hint={t("tarantula-feeding-schedule.ui.preySizeHint")} />
        <Stat label={t("tarantula-feeding-schedule.ui.statPerMonth")} value={`${perMonth}`} />
      </div>
      <Notes items={[
        t("tarantula-feeding-schedule.ui.noteRemove"),
        premoult ? t("tarantula-feeding-schedule.ui.noteResume") : t("tarantula-feeding-schedule.ui.notePlump"),
        t("tarantula-feeding-schedule.ui.noteWater"),
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 3. HEDGEHOG WHEEL SIZE ═══════════ */
export function HedgehogWheelSize() {
  const { t } = useTranslation("tools");
  const [weight, setWeight] = useState(450); // grams
  const [length, setLength] = useState(8); // inches nose-to-tail
  const [surface, setSurface] = useState<"solid" | "mesh" | "bucket">("solid");

  const diameter = length >= 9 || weight >= 600 ? 14 : length >= 7 ? 12 : 11;
  const safe = surface === "solid";

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("hedgehog-wheel-size-calculator.ui.weightLabel")}</Label>
        <Input type="number" min={100} value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>{t("hedgehog-wheel-size-calculator.ui.lengthLabel")}</Label>
        <Input type="number" min={3} step={0.5} value={length} onChange={(e) => setLength(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>{t("hedgehog-wheel-size-calculator.ui.surfaceLabel")}</Label>
        <Select value={surface} onValueChange={(v) => setSurface(v as typeof surface)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">{t("hedgehog-wheel-size-calculator.ui.surfaceSolid")}</SelectItem>
            <SelectItem value="bucket">{t("hedgehog-wheel-size-calculator.ui.surfaceBucket")}</SelectItem>
            <SelectItem value="mesh">{t("hedgehog-wheel-size-calculator.ui.surfaceMesh")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={safe ? "safe" : "danger"}>{safe ? t("hedgehog-wheel-size-calculator.ui.pillSafe") : t("hedgehog-wheel-size-calculator.ui.pillUnsafe")}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label={t("hedgehog-wheel-size-calculator.ui.statMinDiameter")} value={`${diameter} in`} hint={t("hedgehog-wheel-size-calculator.ui.statMinHint")} />
        <Stat label={t("hedgehog-wheel-size-calculator.ui.statIdealDiameter")} value={`${diameter + 1} in`} />
        <Stat label={t("hedgehog-wheel-size-calculator.ui.statDistance")} value="3-8 km" hint={t("hedgehog-wheel-size-calculator.ui.statDistanceHint")} />
        <Stat label={t("hedgehog-wheel-size-calculator.ui.statVerdict")} value={safe ? t("hedgehog-wheel-size-calculator.ui.verdictSolid") : t("hedgehog-wheel-size-calculator.ui.verdictMesh")} />
      </div>
      <Notes items={[
        t("hedgehog-wheel-size-calculator.ui.noteSpine"),
        t("hedgehog-wheel-size-calculator.ui.noteWire"),
        t("hedgehog-wheel-size-calculator.ui.noteClean"),
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 4. HEDGEHOG DIET CALCULATOR ═══════════ */
export function HedgehogDietCalculator() {
  const { t } = useTranslation("tools");
  const [weight, setWeight] = useState(450);
  const [activity, setActivity] = useState<"low" | "normal" | "high">("normal");
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain">("maintain");
  const [kcalPerCup, setKcal] = useState(350);

  const base = weight * 0.16; // kcal/day approx (70 * (kg^0.75) style simplified for insectivore)
  const actMul = activity === "low" ? 0.9 : activity === "high" ? 1.15 : 1;
  const goalMul = goal === "lose" ? 0.85 : goal === "gain" ? 1.15 : 1;
  const kcal = Math.round(base * actMul * goalMul);
  const grams = Math.round((kcal / kcalPerCup) * 120); // 1 cup ≈ 120 g kibble
  const tbsp = Math.round((grams / 8) * 10) / 10;

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("hedgehog-diet-calculator.ui.weightLabel")}</Label>
        <Input type="number" min={100} value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>{t("hedgehog-diet-calculator.ui.activityLabel")}</Label>
        <Select value={activity} onValueChange={(v) => setActivity(v as typeof activity)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">{t("hedgehog-diet-calculator.ui.activityLow")}</SelectItem>
            <SelectItem value="normal">{t("hedgehog-diet-calculator.ui.activityNormal")}</SelectItem>
            <SelectItem value="high">{t("hedgehog-diet-calculator.ui.activityHigh")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("hedgehog-diet-calculator.ui.goalLabel")}</Label>
        <Select value={goal} onValueChange={(v) => setGoal(v as typeof goal)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="maintain">{t("hedgehog-diet-calculator.ui.goalMaintain")}</SelectItem>
            <SelectItem value="lose">{t("hedgehog-diet-calculator.ui.goalLose")}</SelectItem>
            <SelectItem value="gain">{t("hedgehog-diet-calculator.ui.goalGain")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("hedgehog-diet-calculator.ui.kcalLabel")}</Label>
        <Input type="number" min={100} value={kcalPerCup} onChange={(e) => setKcal(Number(e.target.value) || 1)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={weight < 250 || weight > 700 ? "caution" : "safe"}>
        {weight < 250 ? t("hedgehog-diet-calculator.ui.pillUnder") : weight > 700 ? t("hedgehog-diet-calculator.ui.pillOver") : t("hedgehog-diet-calculator.ui.pillHealthy")}
      </Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label={t("hedgehog-diet-calculator.ui.statCalories")} value={`${kcal} kcal`} />
        <Stat label={t("hedgehog-diet-calculator.ui.statDryFood")} value={`${grams} g/day`} hint={t("hedgehog-diet-calculator.ui.dryFoodHint", { tbsp })} />
        <Stat label={t("hedgehog-diet-calculator.ui.statInsects")} value="3-5 items" hint={t("hedgehog-diet-calculator.ui.insectsHint")} />
        <Stat label={t("hedgehog-diet-calculator.ui.statVeg")} value="1 tsp" hint={t("hedgehog-diet-calculator.ui.vegHint")} />
      </div>
      <Notes items={[
        t("hedgehog-diet-calculator.ui.noteKibble"),
        t("hedgehog-diet-calculator.ui.noteNever"),
        t("hedgehog-diet-calculator.ui.noteWeigh"),
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 5. AXOLOTL TANK TEMPERATURE ═══════════ */
export function AxolotlTankTemperature() {
  const { t } = useTranslation("tools");
  const [temp, setTemp] = useState(19);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [roomTemp, setRoomTemp] = useState(24);

  const c = unit === "C" ? temp : (temp - 32) * (5 / 9);
  const roomC = unit === "C" ? roomTemp : (roomTemp - 32) * (5 / 9);
  const tone: "safe" | "caution" | "danger" = c >= 16 && c <= 20 ? "safe" : c > 20 && c <= 22 ? "caution" : "danger";
  const verdict =
    c < 12 ? t("axolotl-tank-temperature-calculator.ui.verdictTooCold")
    : c < 16 ? t("axolotl-tank-temperature-calculator.ui.verdictCool")
    : c <= 20 ? t("axolotl-tank-temperature-calculator.ui.verdictIdeal")
    : c <= 22 ? t("axolotl-tank-temperature-calculator.ui.verdictWarm")
    : t("axolotl-tank-temperature-calculator.ui.verdictDangerous");
  const cooling = roomC - c;

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("axolotl-tank-temperature-calculator.ui.unitLabel")}</Label>
        <Select value={unit} onValueChange={(v) => setUnit(v as typeof unit)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="C">{t("axolotl-tank-temperature-calculator.ui.unitC")}</SelectItem>
            <SelectItem value="F">{t("axolotl-tank-temperature-calculator.ui.unitF")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("axolotl-tank-temperature-calculator.ui.waterTempLabel", { unit })}</Label>
        <Input type="number" step={0.5} value={temp} onChange={(e) => setTemp(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>{t("axolotl-tank-temperature-calculator.ui.roomTempLabel", { unit })}</Label>
        <Input type="number" step={0.5} value={roomTemp} onChange={(e) => setRoomTemp(Number(e.target.value) || 0)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={tone}>{verdict}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label={t("axolotl-tank-temperature-calculator.ui.statIdeal")} value="16-18 °C" hint={t("axolotl-tank-temperature-calculator.ui.idealHint")} />
        <Stat label={t("axolotl-tank-temperature-calculator.ui.statMax")} value="22 °C" hint={t("axolotl-tank-temperature-calculator.ui.maxHint")} />
        <Stat label={t("axolotl-tank-temperature-calculator.ui.statCooling")} value={`${cooling >= 0 ? "-" : "+"}${Math.abs(Math.round(cooling * 10) / 10)} °C`} hint={t("axolotl-tank-temperature-calculator.ui.coolingHint")} />
        <Stat label={t("axolotl-tank-temperature-calculator.ui.statFix")} value={c > 20 ? t("axolotl-tank-temperature-calculator.ui.fixCooling") : t("axolotl-tank-temperature-calculator.ui.fixMaintain")} />
      </div>
      <Notes items={[
        t("axolotl-tank-temperature-calculator.ui.noteHeater"),
        c > 20 ? t("axolotl-tank-temperature-calculator.ui.noteCool") : t("axolotl-tank-temperature-calculator.ui.noteShade"),
        t("axolotl-tank-temperature-calculator.ui.noteSigns"),
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 6. AXOLOTL TANK SIZE ═══════════ */
export function AxolotlTankSize() {
  const { t } = useTranslation("tools");
  const [count, setCount] = useState(1);
  const [length, setLength] = useState(9); // inches
  const [filtration, setFiltration] = useState<"sponge" | "canister" | "hob">("sponge");

  const first = length >= 8 ? 20 : 15;
  const gallons = first + Math.max(0, count - 1) * 10;
  const footprint = gallons >= 40 ? '36" × 18"' : gallons >= 29 ? '30" × 12"' : '24" × 12"';
  const flowNote = filtration === "sponge" ? t("axolotl-tank-size-calculator.ui.flowSponge") : filtration === "canister" ? t("axolotl-tank-size-calculator.ui.flowCanister") : t("axolotl-tank-size-calculator.ui.flowHob");

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("axolotl-tank-size-calculator.ui.countLabel")}</Label>
        <Input type="number" min={1} max={6} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
      </div>
      <div>
        <Label>{t("axolotl-tank-size-calculator.ui.lengthLabel")}</Label>
        <Input type="number" min={2} step={0.5} value={length} onChange={(e) => setLength(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>{t("axolotl-tank-size-calculator.ui.filtrationLabel")}</Label>
        <Select value={filtration} onValueChange={(v) => setFiltration(v as typeof filtration)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sponge">{t("axolotl-tank-size-calculator.ui.filtrationSponge")}</SelectItem>
            <SelectItem value="canister">{t("axolotl-tank-size-calculator.ui.filtrationCanister")}</SelectItem>
            <SelectItem value="hob">{t("axolotl-tank-size-calculator.ui.filtrationHob")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone="safe">{t("axolotl-tank-size-calculator.ui.pillSetup")}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label={t("axolotl-tank-size-calculator.ui.statVolume")} value={`${gallons} gallons`} hint={t("axolotl-tank-size-calculator.ui.volumeHint", { litres: Math.round(gallons * 3.79) })} />
        <Stat label={t("axolotl-tank-size-calculator.ui.statFootprint")} value={footprint} hint={t("axolotl-tank-size-calculator.ui.footprintHint")} />
        <Stat label={t("axolotl-tank-size-calculator.ui.statHides")} value={`${count + 1}`} />
        <Stat label={t("axolotl-tank-size-calculator.ui.statFlow")} value={flowNote} />
      </div>
      <Notes items={[
        t("axolotl-tank-size-calculator.ui.noteFloor"),
        t("axolotl-tank-size-calculator.ui.noteSand"),
        count > 1 ? t("axolotl-tank-size-calculator.ui.noteMulti") : t("axolotl-tank-size-calculator.ui.noteSolitary"),
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 7. SUGAR GLIDER DIET CALCULATOR ═══════════ */
export function SugarGliderDietCalculator() {
  const { t } = useTranslation("tools");
  const [count, setCount] = useState(2);
  const [weight, setWeight] = useState(120); // grams each
  const [plan, setPlan] = useState<"bml" | "tpg" | "hpw">("hpw");

  const perGlider = Math.round(weight * 0.15); // ~15% bodyweight in wet diet
  const total = perGlider * count;
  const staple = Math.round(total * 0.5);
  const produce = Math.round(total * 0.4);
  const protein = Math.round(total * 0.1);
  const planName = plan === "bml" ? t("sugar-glider-diet-calculator.ui.planBml") : plan === "tpg" ? t("sugar-glider-diet-calculator.ui.planTpg") : t("sugar-glider-diet-calculator.ui.planHpw");

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("sugar-glider-diet-calculator.ui.countLabel")}</Label>
        <Input type="number" min={1} max={8} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
      </div>
      <div>
        <Label>{t("sugar-glider-diet-calculator.ui.weightLabel")}</Label>
        <Input type="number" min={50} value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>{t("sugar-glider-diet-calculator.ui.planLabel")}</Label>
        <Select value={plan} onValueChange={(v) => setPlan(v as typeof plan)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="hpw">{t("sugar-glider-diet-calculator.ui.optionHpw")}</SelectItem>
            <SelectItem value="bml">{t("sugar-glider-diet-calculator.ui.optionBml")}</SelectItem>
            <SelectItem value="tpg">{t("sugar-glider-diet-calculator.ui.optionTpg")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={count === 1 ? "caution" : "safe"}>{count === 1 ? t("sugar-glider-diet-calculator.ui.pillSingle") : planName}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label={t("sugar-glider-diet-calculator.ui.statNightly")} value={`${total} g`} hint={t("sugar-glider-diet-calculator.ui.perGliderHint", { grams: perGlider })} />
        <Stat label={t("sugar-glider-diet-calculator.ui.statStaple")} value={`${staple} g`} hint={planName} />
        <Stat label={t("sugar-glider-diet-calculator.ui.statProduce")} value={`${produce} g`} hint={t("sugar-glider-diet-calculator.ui.produceHint")} />
        <Stat label={t("sugar-glider-diet-calculator.ui.statProtein")} value={`${protein} g`} hint={t("sugar-glider-diet-calculator.ui.proteinHint")} />
      </div>
      <Notes items={[
        t("sugar-glider-diet-calculator.ui.noteDusk"),
        t("sugar-glider-diet-calculator.ui.noteCalcium"),
        t("sugar-glider-diet-calculator.ui.noteNever"),
        t("sugar-glider-diet-calculator.ui.noteColony"),
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 8. SUGAR GLIDER CAGE SIZE ═══════════ */
export function SugarGliderCageSize() {
  const { t } = useTranslation("tools");
  const [count, setCount] = useState(2);
  const [barSpacing, setBarSpacing] = useState(0.5);

  const width = 24 + Math.max(0, count - 2) * 6;
  const depth = 24;
  const height = 36 + Math.max(0, count - 2) * 6;
  const cuFt = Math.round(((width * depth * height) / 1728) * 10) / 10;
  const barOk = barSpacing <= 0.5;
  const pouches = Math.max(2, count);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("sugar-glider-cage-size-calculator.ui.countLabel")}</Label>
        <Input type="number" min={1} max={8} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
      </div>
      <div>
        <Label>{t("sugar-glider-cage-size-calculator.ui.barSpacingLabel")}</Label>
        <Input type="number" min={0.1} step={0.05} value={barSpacing} onChange={(e) => setBarSpacing(Number(e.target.value) || 0)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={barOk ? "safe" : "danger"}>{barOk ? t("sugar-glider-cage-size-calculator.ui.pillSafe") : t("sugar-glider-cage-size-calculator.ui.pillUnsafe")}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label={t("sugar-glider-cage-size-calculator.ui.statMinCage")} value={`${width}" W × ${depth}" D × ${height}" H`} />
        <Stat label={t("sugar-glider-cage-size-calculator.ui.statVolume")} value={`${cuFt} cu ft`} />
        <Stat label={t("sugar-glider-cage-size-calculator.ui.statPouches")} value={`${pouches}`} />
        <Stat label={t("sugar-glider-cage-size-calculator.ui.statMaxBar")} value={'0.5"'} hint={t("sugar-glider-cage-size-calculator.ui.maxBarHint")} />
      </div>
      <Notes items={[
        t("sugar-glider-cage-size-calculator.ui.noteHeight"),
        t("sugar-glider-cage-size-calculator.ui.noteWire"),
        t("sugar-glider-cage-size-calculator.ui.noteFill"),
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 9. CHINCHILLA DUST BATH SCHEDULE ═══════════ */
export function ChinchillaDustBathSchedule() {
  const { t } = useTranslation("tools");
  const [humidity, setHumidity] = useState(45);
  const [coat, setCoat] = useState<"normal" | "greasy" | "dry">("normal");
  const [last, setLast] = useLocal<string>("furtools:chin-dust:last", "");

  const baseTimes = humidity > 60 ? 4 : humidity > 45 ? 3 : 2;
  const times = coat === "greasy" ? baseTimes + 1 : coat === "dry" ? Math.max(1, baseTimes - 1) : baseTimes;
  const intervalDays = Math.max(1, Math.round(7 / times));
  const minutes = coat === "greasy" ? 15 : 10;

  const nextDate = useMemo(() => {
    if (!last) return null;
    const d = new Date(last);
    d.setDate(d.getDate() + intervalDays);
    return d.toISOString().slice(0, 10);
  }, [last, intervalDays]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("chinchilla-dust-bath-schedule.ui.humidityLabel")}</Label>
        <Input type="number" min={0} max={100} value={humidity} onChange={(e) => setHumidity(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>{t("chinchilla-dust-bath-schedule.ui.coatLabel")}</Label>
        <Select value={coat} onValueChange={(v) => setCoat(v as typeof coat)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">{t("chinchilla-dust-bath-schedule.ui.coatNormal")}</SelectItem>
            <SelectItem value="greasy">{t("chinchilla-dust-bath-schedule.ui.coatGreasy")}</SelectItem>
            <SelectItem value="dry">{t("chinchilla-dust-bath-schedule.ui.coatDry")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("chinchilla-dust-bath-schedule.ui.lastLabel")}</Label>
        <Input type="date" value={last} onChange={(e) => setLast(e.target.value)} />
      </div>
      {last ? <Button variant="outline" onClick={() => setLast(new Date().toISOString().slice(0, 10))}>{t("chinchilla-dust-bath-schedule.ui.logButton")}</Button> : null}
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={humidity > 60 ? "caution" : "safe"}>{humidity > 60 ? t("chinchilla-dust-bath-schedule.ui.pillHumid") : t("chinchilla-dust-bath-schedule.ui.pillReady")}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label={t("chinchilla-dust-bath-schedule.ui.statPerWeek")} value={`${times}`} hint={t("chinchilla-dust-bath-schedule.ui.intervalHint", { days: intervalDays })} />
        <Stat label={t("chinchilla-dust-bath-schedule.ui.statSession")} value={`${minutes} min`} hint={t("chinchilla-dust-bath-schedule.ui.sessionHint")} />
        <Stat label={t("chinchilla-dust-bath-schedule.ui.statDepth")} value={'1-2"'} hint={t("chinchilla-dust-bath-schedule.ui.depthHint")} />
        <Stat label={t("chinchilla-dust-bath-schedule.ui.statNext")} value={nextDate ?? t("chinchilla-dust-bath-schedule.ui.setDateValue")} />
      </div>
      <Notes items={[
        t("chinchilla-dust-bath-schedule.ui.noteLeaving"),
        humidity > 60 ? t("chinchilla-dust-bath-schedule.ui.noteDehumidifier") : t("chinchilla-dust-bath-schedule.ui.noteTemp"),
        t("chinchilla-dust-bath-schedule.ui.noteReuse"),
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 10. CHINCHILLA CAGE SIZE ═══════════ */
export function ChinchillaCageSize() {
  const { t } = useTranslation("tools");
  const [count, setCount] = useState(2);
  const [barSpacing, setBarSpacing] = useState(0.5);
  const [levels, setLevels] = useState(3);

  const width = 30 + Math.max(0, count - 2) * 6;
  const depth = 24;
  const height = 36 + Math.max(0, count - 2) * 6;
  const floorArea = Math.round(((width * depth) / 144) * 10) / 10;
  const needed = count * 4;
  const barOk = barSpacing <= 0.6;
  const shelvesOk = levels >= 3;

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("chinchilla-cage-size-calculator.ui.countLabel")}</Label>
        <Input type="number" min={1} max={6} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
      </div>
      <div>
        <Label>{t("chinchilla-cage-size-calculator.ui.barSpacingLabel")}</Label>
        <Input type="number" min={0.1} step={0.05} value={barSpacing} onChange={(e) => setBarSpacing(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>{t("chinchilla-cage-size-calculator.ui.levelsLabel")}</Label>
        <Input type="number" min={1} max={8} value={levels} onChange={(e) => setLevels(Number(e.target.value) || 1)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={barOk && shelvesOk ? "safe" : "caution"}>
        {!barOk ? t("chinchilla-cage-size-calculator.ui.pillBarWide") : !shelvesOk ? t("chinchilla-cage-size-calculator.ui.pillMoreLevels") : t("chinchilla-cage-size-calculator.ui.pillGood")}
      </Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label={t("chinchilla-cage-size-calculator.ui.statMinCage")} value={`${width}" W × ${depth}" D × ${height}" H`} />
        <Stat label={t("chinchilla-cage-size-calculator.ui.statFloorArea")} value={`${floorArea} sq ft`} hint={t("chinchilla-cage-size-calculator.ui.floorHint", { sqft: needed })} />
        <Stat label={t("chinchilla-cage-size-calculator.ui.statLevels")} value={`${levels}`} hint={t("chinchilla-cage-size-calculator.ui.levelsHint")} />
        <Stat label={t("chinchilla-cage-size-calculator.ui.statMaxBar")} value={'0.6"'} />
      </div>
      <Notes items={[
        t("chinchilla-cage-size-calculator.ui.noteShelves"),
        t("chinchilla-cage-size-calculator.ui.noteTemp"),
        t("chinchilla-cage-size-calculator.ui.noteInclude"),
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 11. TORTOISE HIBERNATION PLANNER ═══════════ */
export function TortoiseHibernationPlanner() {
  const { t } = useTranslation("tools");
  const hibernators: Record<string, { weeks: [number, number]; hibernates: boolean; note: string }> = {
    "hermann": { weeks: [8, 16], hibernates: true, note: t("tortoise-hibernation-planner.ui.noteHermann") },
    "russian": { weeks: [8, 14], hibernates: true, note: t("tortoise-hibernation-planner.ui.noteRussian") },
    "greek-spur-thighed": { weeks: [8, 12], hibernates: true, note: t("tortoise-hibernation-planner.ui.noteGreek") },
    "marginated": { weeks: [8, 14], hibernates: true, note: t("tortoise-hibernation-planner.ui.noteMarginated") },
    "sulcata": { weeks: [0, 0], hibernates: false, note: t("tortoise-hibernation-planner.ui.noteSulcata") },
    "leopard": { weeks: [0, 0], hibernates: false, note: t("tortoise-hibernation-planner.ui.noteLeopard") },
    "red-footed": { weeks: [0, 0], hibernates: false, note: t("tortoise-hibernation-planner.ui.noteRedFooted") },
    "box-turtle": { weeks: [8, 16], hibernates: true, note: t("tortoise-hibernation-planner.ui.noteBoxTurtle") },
  };
  const speciesLabels: Record<string, string> = {
    "hermann": t("tortoise-hibernation-planner.ui.speciesHermann"),
    "russian": t("tortoise-hibernation-planner.ui.speciesRussian"),
    "greek-spur-thighed": t("tortoise-hibernation-planner.ui.speciesGreek"),
    "marginated": t("tortoise-hibernation-planner.ui.speciesMarginated"),
    "sulcata": t("tortoise-hibernation-planner.ui.speciesSulcata"),
    "leopard": t("tortoise-hibernation-planner.ui.speciesLeopard"),
    "red-footed": t("tortoise-hibernation-planner.ui.speciesRedFooted"),
    "box-turtle": t("tortoise-hibernation-planner.ui.speciesBoxTurtle"),
  };
  const [species, setSpecies] = useState("hermann");
  const [weight, setWeight] = useState(800); // grams
  const [lengthCm, setLengthCm] = useState(15);
  const [start, setStart] = useState("");
  const [weeks, setWeeks] = useState(10);

  const info = hibernators[species];
  const jackson = Math.round((weight / Math.pow(lengthCm, 3)) * 1000 * 100) / 100; // ratio g/cm³ ×1000
  const jacksonOk = jackson >= 0.19 && jackson <= 0.24;

  const dates = useMemo(() => {
    if (!start) return null;
    const fastStart = new Date(start);
    const cooling = new Date(fastStart); cooling.setDate(cooling.getDate() + 14);
    const sleep = new Date(cooling); sleep.setDate(sleep.getDate() + 7);
    const wake = new Date(sleep); wake.setDate(wake.getDate() + weeks * 7);
    const warmUp = new Date(wake); warmUp.setDate(warmUp.getDate() + 2);
    const f = (d: Date) => d.toISOString().slice(0, 10);
    return { fast: f(fastStart), cooling: f(cooling), sleep: f(sleep), wake: f(wake), warmUp: f(warmUp) };
  }, [start, weeks]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("tortoise-hibernation-planner.ui.speciesLabel")}</Label>
        <Select value={species} onValueChange={(v) => setSpecies(v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(hibernators).map((k) => <SelectItem key={k} value={k}>{speciesLabels[k]}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("tortoise-hibernation-planner.ui.weightLabel")}</Label>
        <Input type="number" min={10} value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} />
      </div>
      <div>
        <Label>{t("tortoise-hibernation-planner.ui.lengthLabel")}</Label>
        <Input type="number" min={2} step={0.5} value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value) || 1)} />
      </div>
      <div>
        <Label>{t("tortoise-hibernation-planner.ui.startLabel")}</Label>
        <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
      </div>
      <div>
        <Label>{t("tortoise-hibernation-planner.ui.weeksLabel")}</Label>
        <Input type="number" min={4} max={20} value={weeks} onChange={(e) => setWeeks(Number(e.target.value) || 4)} />
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone={!info.hibernates ? "danger" : jacksonOk ? "safe" : "caution"}>
        {!info.hibernates ? t("tortoise-hibernation-planner.ui.pillNoHibernate") : jacksonOk ? t("tortoise-hibernation-planner.ui.pillSuitable") : t("tortoise-hibernation-planner.ui.pillUnsafe")}
      </Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label={t("tortoise-hibernation-planner.ui.statLength")} value={info.hibernates ? t("tortoise-hibernation-planner.ui.lengthValue", { lo: info.weeks[0], hi: info.weeks[1] }) : t("tortoise-hibernation-planner.ui.lengthNone")} />
        <Stat label={t("tortoise-hibernation-planner.ui.statJackson")} value={`${jackson}`} hint={t("tortoise-hibernation-planner.ui.jacksonHint")} />
        <Stat label={t("tortoise-hibernation-planner.ui.statTemp")} value="4-8 °C" hint={t("tortoise-hibernation-planner.ui.tempHint")} />
        <Stat label={t("tortoise-hibernation-planner.ui.statWeightLoss")} value={`${Math.round(weight * 0.01)} g`} hint={t("tortoise-hibernation-planner.ui.weightLossHint")} />
      </div>
      {dates && info.hibernates ? (
        <div className="mt-4 space-y-2 text-sm">
          <p className="font-semibold">{t("tortoise-hibernation-planner.ui.timelineTitle")}</p>
          <p>{t("tortoise-hibernation-planner.ui.fastStartLabel")}: <strong>{dates.fast}</strong> {t("tortoise-hibernation-planner.ui.fastStartHint")}</p>
          <p>{t("tortoise-hibernation-planner.ui.coolingLabel")}: <strong>{dates.cooling}</strong></p>
          <p>{t("tortoise-hibernation-planner.ui.sleepLabel")}: <strong>{dates.sleep}</strong></p>
          <p>{t("tortoise-hibernation-planner.ui.wakeLabel")}: <strong>{dates.wake}</strong></p>
          <p>{t("tortoise-hibernation-planner.ui.warmUpLabel")}: <strong>{dates.warmUp}</strong></p>
        </div>
      ) : null}
      <Notes items={[
        info.note,
        t("tortoise-hibernation-planner.ui.noteVet"),
        t("tortoise-hibernation-planner.ui.noteWeigh"),
        t("tortoise-hibernation-planner.ui.noteNever"),
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════ 12. QUAIL COOP SIZE ═══════════ */
export function QuailCoopSize() {
  const { t } = useTranslation("tools");
  const [count, setCount] = useState(10);
  const [breed, setBreed] = useState<"coturnix" | "bobwhite" | "button">("coturnix");
  const [housing, setHousing] = useState<"cage" | "aviary" | "hutch">("cage");

  const perBird = breed === "bobwhite" ? 1.5 : breed === "button" ? 0.5 : 1; // sq ft
  const multiplier = housing === "aviary" ? 2 : housing === "hutch" ? 1.25 : 1;
  const sqft = Math.round(count * perBird * multiplier * 10) / 10;
  const height = breed === "button" ? 10 : 12;
  const feeders = Math.max(1, Math.ceil(count / 10));
  const waterers = Math.max(1, Math.ceil(count / 8));
  const dustBaths = Math.max(1, Math.ceil(count / 8));
  const males = Math.max(1, Math.floor(count / 5));

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("quail-coop-size-calculator.ui.countLabel")}</Label>
        <Input type="number" min={1} max={200} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
      </div>
      <div>
        <Label>{t("quail-coop-size-calculator.ui.breedLabel")}</Label>
        <Select value={breed} onValueChange={(v) => setBreed(v as typeof breed)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="coturnix">{t("quail-coop-size-calculator.ui.breedCoturnix")}</SelectItem>
            <SelectItem value="bobwhite">{t("quail-coop-size-calculator.ui.breedBobwhite")}</SelectItem>
            <SelectItem value="button">{t("quail-coop-size-calculator.ui.breedButton")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("quail-coop-size-calculator.ui.housingLabel")}</Label>
        <Select value={housing} onValueChange={(v) => setHousing(v as typeof housing)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="cage">{t("quail-coop-size-calculator.ui.housingCage")}</SelectItem>
            <SelectItem value="hutch">{t("quail-coop-size-calculator.ui.housingHutch")}</SelectItem>
            <SelectItem value="aviary">{t("quail-coop-size-calculator.ui.housingAviary")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const result = (
    <div className="space-y-3">
      <Pill tone="safe">{t("quail-coop-size-calculator.ui.pillHousing")}</Pill>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label={t("quail-coop-size-calculator.ui.statFloor")} value={`${sqft} sq ft`} hint={t("quail-coop-size-calculator.ui.perBirdHint", { perBird })} />
        <Stat label={t("quail-coop-size-calculator.ui.statCeiling")} value={`${height} in`} hint={t("quail-coop-size-calculator.ui.ceilingHint")} />
        <Stat label={t("quail-coop-size-calculator.ui.statFeeders")} value={`${feeders} / ${waterers}`} />
        <Stat label={t("quail-coop-size-calculator.ui.statDustBaths")} value={`${dustBaths}`} hint={t("quail-coop-size-calculator.ui.dustBathHint")} />
      </div>
      <Notes items={[
        t("quail-coop-size-calculator.ui.noteMales", { males, plural: males > 1 ? "s" : "" }),
        t("quail-coop-size-calculator.ui.noteWire"),
        t("quail-coop-size-calculator.ui.noteCover"),
        housing === "cage" ? t("quail-coop-size-calculator.ui.noteCage") : t("quail-coop-size-calculator.ui.noteLitter"),
      ]} />
    </div>
  );

  return <CalculatorLayout form={form} result={result} />;
}
