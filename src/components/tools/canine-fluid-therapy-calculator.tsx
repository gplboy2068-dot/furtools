import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Activity,
  HeartPulse,
  Droplets,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  Stethoscope,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";

interface DehydrationTier {
  percent: number;
  label: string;
  clinicalSigns: string;
  severity: "normal" | "mild" | "moderate" | "severe" | "critical";
}

const DEHYDRATION_TIERS: DehydrationTier[] = [
  {
    percent: 0,
    label: "0% — Normal Hydration",
    clinicalSigns: "Moist, pink gums; immediate skin turgor recoil (<1s); bright alert eyes; capillary refill time (CRT) < 2s.",
    severity: "normal",
  },
  {
    percent: 5,
    label: "5% — Mild Dehydration (Subclinical)",
    clinicalSigns: "Slightly tacky mucous membranes; normal skin turgor; eyes normal; CRT ~2s.",
    severity: "mild",
  },
  {
    percent: 7,
    label: "7% — Moderate Dehydration",
    clinicalSigns: "Dry/sticky gums; slight loss of skin turgor (delayed skin fold recoil 2–3s); CRT 2–3s; mild depression.",
    severity: "moderate",
  },
  {
    percent: 10,
    label: "10% — Severe Dehydration",
    clinicalSigns: "Marked skin tenting (skin stays pinched >3s); dull sunken eyes (enophthalmos); dry pale gums; CRT > 3s; cold paws.",
    severity: "severe",
  },
  {
    percent: 12,
    label: "12% — Critical / Impending Shock",
    clinicalSigns: "Persistent skin tenting; deeply sunken eyes; signs of hypovolemic shock; weak rapid pulse; cold extremities; depressed consciousness.",
    severity: "critical",
  },
];

export function CanineFluidTherapyCalculator() {
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [weightInput, setWeightInput] = useState<string>("35");
  const [dehydrationPercent, setDehydrationPercent] = useState<number>(7);
  const [replacementHours, setReplacementHours] = useState<number>(24);
  const [ongoingLossTier, setOngoingLossTier] = useState<number>(10); // mL/kg/day
  const [dripFactor, setDripFactor] = useState<number>(15); // 10, 15, 20 (macro), 60 (micro)
  const [formulaType, setFormulaType] = useState<"standard" | "allometric">("standard");

  // Calculate body weight in kg
  const weightKg = useMemo(() => {
    const raw = parseFloat(weightInput) || 0;
    return unit === "lbs" ? raw * 0.453592 : raw;
  }, [weightInput, unit]);

  // Calculations
  const results = useMemo(() => {
    if (weightKg <= 0) return null;

    // 1. Dehydration Deficit: Weight (kg) * (% Dehydration / 100) * 1000 mL
    const deficitMl = weightKg * (dehydrationPercent / 100) * 1000;

    // 2. Maintenance Fluid Rate:
    // Standard Canine: 60 mL/kg/day (AAHA/AAFP guidelines)
    // Allometric (WSAVA): 132 * (weightKg ^ 0.75) mL/day (or 30 * W + 70 for small dogs)
    const maintenanceMl24h =
      formulaType === "standard"
        ? weightKg * 60
        : Math.round(132 * Math.pow(weightKg, 0.75));

    // 3. Ongoing Post-Op Losses: Loss rate (mL/kg/day) * weight (kg)
    const ongoingLossesMl24h = weightKg * ongoingLossTier;

    // Adjusted Deficit for Selected Replacement Window
    const deficitPerHour = replacementHours > 0 ? deficitMl / replacementHours : 0;
    const maintenancePerHour = maintenanceMl24h / 24;
    const ongoingLossesPerHour = ongoingLossesMl24h / 24;

    // Total Infusion Rate (mL/hr) during replacement phase
    const totalMlPerHour = deficitPerHour + maintenancePerHour + ongoingLossesPerHour;

    // Total 24-Hour Projected Volume (mL)
    const total24hVolume = (deficitPerHour * Math.min(24, replacementHours)) + maintenanceMl24h + ongoingLossesMl24h;

    // Drip Rates:
    // Drip rate (drops/min) = (mL/hr * dripFactor) / 60
    const dropsPerMinute = (totalMlPerHour * dripFactor) / 60;
    const secondsPerDrop = dropsPerMinute > 0 ? 60 / dropsPerMinute : 0;

    // Minimum target urine output (Normal: 1 - 2 mL/kg/hr)
    const minUrineOutputPerHour = weightKg * 1.0;
    const maxUrineOutputPerHour = weightKg * 2.0;

    return {
      weightKg: Math.round(weightKg * 10) / 10,
      deficitMl: Math.round(deficitMl),
      maintenanceMl24h: Math.round(maintenanceMl24h),
      ongoingLossesMl24h: Math.round(ongoingLossesMl24h),
      total24hVolume: Math.round(total24hVolume),
      totalMlPerHour: Math.round(totalMlPerHour * 10) / 10,
      dropsPerMinute: Math.round(dropsPerMinute),
      secondsPerDrop: Math.round(secondsPerDrop * 10) / 10,
      minUrineOutputPerHour: Math.round(minUrineOutputPerHour * 10) / 10,
      maxUrineOutputPerHour: Math.round(maxUrineOutputPerHour * 10) / 10,
    };
  }, [weightKg, dehydrationPercent, replacementHours, ongoingLossTier, dripFactor, formulaType]);

  const currentTier =
    DEHYDRATION_TIERS.find((t) => t.percent === dehydrationPercent) || DEHYDRATION_TIERS[2];

  return (
    <div className="space-y-6">
      {/* Top Advisory Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex items-start gap-3">
        <Stethoscope className="size-5 text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
          <span className="font-semibold text-amber-900 dark:text-amber-300">
            Veterinary Clinical Reference:
          </span>{" "}
          This fluid therapy calculator adheres to the **AAHA (American Animal Hospital Association)** and **WSAVA** fluid therapy guidelines for canine post-operative recovery, shock resuscitation, and dehydration restoration. Always monitor patient lung sounds, PCV/TP, and urine output to prevent fluid overload.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Input Parameters Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="p-5 sm:p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <Droplets className="size-5 text-primary" />
              Patient Parameters
            </h3>

            {/* Weight Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="dog-weight" className="text-xs font-semibold uppercase">
                  Dog Body Weight
                </Label>
                <div className="inline-flex rounded-lg border border-border/80 bg-muted/40 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setUnit("lbs")}
                    className={`px-2.5 py-1 rounded-md font-medium transition ${
                      unit === "lbs" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    Pounds (lbs)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit("kg")}
                    className={`px-2.5 py-1 rounded-md font-medium transition ${
                      unit === "kg" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    Kilograms (kg)
                  </button>
                </div>
              </div>
              <div className="relative">
                <Input
                  id="dog-weight"
                  type="number"
                  min="0.5"
                  max="200"
                  step="0.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="font-mono text-base pr-12"
                  placeholder="e.g. 35"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  {unit}
                </span>
              </div>
              {results && (
                <p className="text-[11px] text-muted-foreground">
                  Standardized weight: <span className="font-mono font-semibold text-foreground">{results.weightKg} kg</span>
                </p>
              )}
            </div>

            {/* Dehydration Level Slider */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase">
                  Dehydration Assessment ({dehydrationPercent}%)
                </Label>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-semibold ${
                    dehydrationPercent === 0
                      ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                      : dehydrationPercent <= 5
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : dehydrationPercent <= 8
                      ? "border-amber-500 text-amber-600 dark:text-amber-400"
                      : "border-red-500 text-red-600 dark:text-red-400"
                  }`}
                >
                  {currentTier.label}
                </Badge>
              </div>

              <Slider
                value={[dehydrationPercent]}
                min={0}
                max={12}
                step={1}
                onValueChange={(val) => setDehydrationPercent(val[0])}
                className="py-2"
              />

              <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Clinical Diagnostic Markers: </span>
                {currentTier.clinicalSigns}
              </div>
            </div>

            {/* Replacement Window & Post-Op Losses */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Deficit Replacement Window */}
              <div className="space-y-1.5">
                <Label htmlFor="replacement-hours" className="text-xs font-semibold uppercase">
                  Deficit Correction Time
                </Label>
                <select
                  id="replacement-hours"
                  value={replacementHours}
                  onChange={(e) => setReplacementHours(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={12}>12 Hours (Rapid Rehydration)</option>
                  <option value={24}>24 Hours (Standard Veterinary)</option>
                  <option value={48}>48 Hours (Cardiac / Geriatric Cautious)</option>
                </select>
                <span className="text-[10px] text-muted-foreground block">
                  Deficit volume is distributed across this duration.
                </span>
              </div>

              {/* Ongoing Losses */}
              <div className="space-y-1.5">
                <Label htmlFor="ongoing-losses" className="text-xs font-semibold uppercase">
                  Post-Op Ongoing Losses
                </Label>
                <select
                  id="ongoing-losses"
                  value={ongoingLossTier}
                  onChange={(e) => setOngoingLossTier(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>None / Dry Surgical Field (0 mL/kg)</option>
                  <option value={10}>Mild (Drainage / Mild Emesis) — 10 mL/kg/day</option>
                  <option value={20}>Moderate (Active Diarrhea / Vomiting) — 20 mL/kg/day</option>
                  <option value={30}>Severe (Heavy Fluid Drainage / Polyuria) — 30 mL/kg/day</option>
                </select>
                <span className="text-[10px] text-muted-foreground block">
                  Compensates for surgical fluids, drains, and gastrointestinal loss.
                </span>
              </div>
            </div>

            {/* Delivery Equipment / Drip Set */}
            <div className="mt-6 space-y-1.5">
              <Label htmlFor="drip-set" className="text-xs font-semibold uppercase">
                Delivery Method & IV Administration Set
              </Label>
              <select
                id="drip-set"
                value={dripFactor}
                onChange={(e) => setDripFactor(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={15}>Standard Macro-drip Set (15 gtt/mL) — Common for medium/large dogs</option>
                <option value={10}>Heavy Macro-drip Set (10 gtt/mL) — Large & Giant breeds</option>
                <option value={20}>Standard 20-drop Set (20 gtt/mL)</option>
                <option value={60}>Pediatric Micro-drip Set (60 gtt/mL) — Small dogs & puppies (&lt;10 kg)</option>
              </select>
            </div>
          </Card>
        </div>

        {/* Results Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="p-5 sm:p-6 border-primary/30 bg-card shadow-md">
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <Activity className="size-5 text-primary" />
              Prescribed Infusion Rates
            </h3>

            {results ? (
              <div className="space-y-4">
                {/* Primary Hourly Infusion Rate */}
                <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-4 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Target Infusion Pump Rate
                  </span>
                  <div className="mt-1 font-display text-4xl font-extrabold text-foreground">
                    {results.totalMlPerHour}{" "}
                    <span className="text-lg font-semibold text-muted-foreground">mL/hr</span>
                  </div>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Continuous IV infusion rate during recovery
                  </span>
                </div>

                {/* Gravity Drip Rate */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/80 bg-muted/40 p-3 text-center">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground block">
                      Gravity Drip Rate
                    </span>
                    <span className="font-display text-2xl font-bold text-foreground">
                      {results.dropsPerMinute}
                    </span>
                    <span className="text-[11px] text-muted-foreground block font-medium">drops/min (gtt)</span>
                  </div>

                  <div className="rounded-xl border border-border/80 bg-muted/40 p-3 text-center">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground block">
                      Drip Interval
                    </span>
                    <span className="font-display text-2xl font-bold text-foreground">
                      1 drop every {results.secondsPerDrop}s
                    </span>
                    <span className="text-[11px] text-muted-foreground block font-medium">at {dripFactor} gtt/mL</span>
                  </div>
                </div>

                {/* Total 24-hr Volume */}
                <div className="rounded-xl border border-border/80 bg-card p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total 24-Hour Fluid Plan:</span>
                    <span className="font-mono text-sm text-foreground">{results.total24hVolume.toLocaleString()} mL</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden flex">
                    <div
                      className="h-full bg-blue-500"
                      title="Dehydration Deficit"
                      style={{
                        width: `${Math.round((results.deficitMl / (results.total24hVolume || 1)) * 100)}%`,
                      }}
                    />
                    <div
                      className="h-full bg-primary"
                      title="Maintenance"
                      style={{
                        width: `${Math.round((results.maintenanceMl24h / (results.total24hVolume || 1)) * 100)}%`,
                      }}
                    />
                    <div
                      className="h-full bg-amber-500"
                      title="Ongoing Losses"
                      style={{
                        width: `${Math.round((results.ongoingLossesMl24h / (results.total24hVolume || 1)) * 100)}%`,
                      }}
                    />
                  </div>

                  {/* Legend */}
                  <div className="pt-2 space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-blue-500" />
                        Dehydration Deficit Volume:
                      </span>
                      <span className="font-mono font-medium text-foreground">{results.deficitMl} mL</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-primary" />
                        24-Hour Basal Maintenance:
                      </span>
                      <span className="font-mono font-medium text-foreground">{results.maintenanceMl24h} mL</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-amber-500" />
                        Post-Op Ongoing Losses:
                      </span>
                      <span className="font-mono font-medium text-foreground">{results.ongoingLossesMl24h} mL</span>
                    </div>
                  </div>
                </div>

                {/* Target Urine Output Monitoring */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-xs space-y-1">
                  <div className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    Target Urine Output (Adequate Perfusion)
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Maintain between <span className="font-mono font-semibold text-foreground">{results.minUrineOutputPerHour} – {results.maxUrineOutputPerHour} mL/hr</span> (1.0 to 2.0 mL/kg/hr) to confirm renal recovery and prevent anuria.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground">
                Enter your dog's weight to calculate the fluid prescription.
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Clinical Reference & Monitoring Checklist */}
      <Card className="p-6 shadow-sm">
        <h4 className="font-display text-base font-bold text-foreground flex items-center gap-2 mb-3">
          <ShieldAlert className="size-5 text-primary" />
          Post-Operative Fluid Monitoring & Fluid Overload Warning Signs
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 text-xs leading-relaxed text-muted-foreground">
          <div className="rounded-xl bg-muted/30 p-3.5 border border-border/60">
            <span className="font-semibold text-foreground block mb-1">Common Replacement Crystalloids:</span>
            Balanced electrolyte solutions such as **Lactated Ringer's Solution (LRS)**, **Normosol-R**, or **Plasmalyte-A** are preferred. Avoid pure 0.9% NaCl for prolonged maintenance unless hypochloremia or Addisonian crisis is present.
          </div>
          <div className="rounded-xl bg-muted/30 p-3.5 border border-border/60">
            <span className="font-semibold text-foreground block mb-1">🚨 Signs of Fluid Overload (Hypervolemia):</span>
            Serous nasal discharge, chemosis (swelling of the conjunctiva), tachypnea (rapid breathing), moist lung crackles, restlessness, and sudden excessive body weight gain. Reduce rate immediately if noted.
          </div>
          <div className="rounded-xl bg-muted/30 p-3.5 border border-border/60">
            <span className="font-semibold text-foreground block mb-1">Anesthesia Hypothermia Precaution:</span>
            Use fluid warmers or warm IV lines when administering fluids post-surgery to prevent anesthesia-induced hypothermia, which delays drug clearance and prolongs recovery times.
          </div>
        </div>
      </Card>
    </div>
  );
}
