import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Waves,
  Gauge,
  Droplets,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Fish,
} from "lucide-react";

interface BioloadProfile {
  id: string;
  name: string;
  turnoverMin: number;
  turnoverMax: number;
  description: string;
  recommendedSpecies: string;
  flowSensitivity: "gentle" | "moderate" | "brisk" | "high";
}

const NS = "aquarium-filter-flow-rate";

type T = (key: string, options?: Record<string, unknown>) => string;

function getBioloadProfiles(t: T): BioloadProfile[] {
  return [
    {
      id: "low-flow",
      name: t(`${NS}.ui.bioloadLowFlowName`),
      turnoverMin: 3,
      turnoverMax: 4,
      description: t(`${NS}.ui.bioloadLowFlowDesc`),
      recommendedSpecies: t(`${NS}.ui.bioloadLowFlowSpecies`),
      flowSensitivity: "gentle",
    },
    {
      id: "community",
      name: t(`${NS}.ui.bioloadCommunityName`),
      turnoverMin: 4,
      turnoverMax: 6,
      description: t(`${NS}.ui.bioloadCommunityDesc`),
      recommendedSpecies: t(`${NS}.ui.bioloadCommunitySpecies`),
      flowSensitivity: "moderate",
    },
    {
      id: "planted",
      name: t(`${NS}.ui.bioloadPlantedName`),
      turnoverMin: 5,
      turnoverMax: 8,
      description: t(`${NS}.ui.bioloadPlantedDesc`),
      recommendedSpecies: t(`${NS}.ui.bioloadPlantedSpecies`),
      flowSensitivity: "brisk",
    },
    {
      id: "heavy",
      name: t(`${NS}.ui.bioloadHeavyName`),
      turnoverMin: 8,
      turnoverMax: 10,
      description: t(`${NS}.ui.bioloadHeavyDesc`),
      recommendedSpecies: t(`${NS}.ui.bioloadHeavySpecies`),
      flowSensitivity: "high",
    },
    {
      id: "marine",
      name: t(`${NS}.ui.bioloadMarineName`),
      turnoverMin: 10,
      turnoverMax: 20,
      description: t(`${NS}.ui.bioloadMarineDesc`),
      recommendedSpecies: t(`${NS}.ui.bioloadMarineSpecies`),
      flowSensitivity: "high",
    },
  ];
}

interface FilterTypeProfile {
  id: string;
  name: string;
  baselineMediaLoss: number; // percentage loss from media
  headLossFactor: number; // sensitivity to vertical pumping height
  description: string;
}

function getFilterTypes(t: T): FilterTypeProfile[] {
  return [
    {
      id: "canister",
      name: t(`${NS}.ui.filterCanisterName`),
      baselineMediaLoss: 0.35,
      headLossFactor: 0.08,
      description: t(`${NS}.ui.filterCanisterDesc`),
    },
    {
      id: "hob",
      name: t(`${NS}.ui.filterHobName`),
      baselineMediaLoss: 0.25,
      headLossFactor: 0.02,
      description: t(`${NS}.ui.filterHobDesc`),
    },
    {
      id: "internal",
      name: t(`${NS}.ui.filterInternalName`),
      baselineMediaLoss: 0.20,
      headLossFactor: 0.01,
      description: t(`${NS}.ui.filterInternalDesc`),
    },
    {
      id: "sponge",
      name: t(`${NS}.ui.filterSpongeName`),
      baselineMediaLoss: 0.15,
      headLossFactor: 0.04,
      description: t(`${NS}.ui.filterSpongeDesc`),
    },
    {
      id: "sump",
      name: t(`${NS}.ui.filterSumpName`),
      baselineMediaLoss: 0.20,
      headLossFactor: 0.10,
      description: t(`${NS}.ui.filterSumpDesc`),
    },
  ];
}

interface MediaTier {
  id: "light" | "standard" | "dense";
  label: string;
  desc: string;
}

function getMediaTiers(t: T): MediaTier[] {
  return [
    { id: "light", label: t(`${NS}.ui.tierLightLabel`), desc: t(`${NS}.ui.tierLightDesc`) },
    { id: "standard", label: t(`${NS}.ui.tierStandardLabel`), desc: t(`${NS}.ui.tierStandardDesc`) },
    { id: "dense", label: t(`${NS}.ui.tierDenseLabel`), desc: t(`${NS}.ui.tierDenseDesc`) },
  ];
}

const PRESET_GALLONS = [10, 20, 29, 40, 55, 75, 125];

function presetLabel(t: T, gal: number): string {
  return t(`${NS}.ui.presetLabel`, { gal, l: Math.round(gal * 3.78541) });
}

export function AquariumFilterFlowRate() {
  const { t } = useTranslation("tools");
  const [unit, setUnit] = useState<"gal" | "liters">("gal");
  const [tankVolumeInput, setTankVolumeInput] = useState<number>(40);
  const [selectedBioload, setSelectedBioload] = useState<string>("community");
  const [selectedFilterType, setSelectedFilterType] = useState<string>("canister");
  const [mediaDensity, setMediaDensity] = useState<"light" | "standard" | "dense">("standard");
  const [headHeightFt, setHeadHeightFt] = useState<number>(3.5);

  const BIOLOAD_PROFILES = useMemo(() => getBioloadProfiles(t), [t]);
  const FILTER_TYPES = useMemo(() => getFilterTypes(t), [t]);
  const MEDIA_TIERS = useMemo(() => getMediaTiers(t), [t]);

  const safeVolume = typeof tankVolumeInput === "number" && !isNaN(tankVolumeInput) && tankVolumeInput > 0 ? tankVolumeInput : 40;

  // Convert input to US Gallons for calculation
  const tankGallons = useMemo(() => {
    if (unit === "liters") {
      return Math.max(1, safeVolume / 3.78541);
    }
    return Math.max(1, safeVolume);
  }, [safeVolume, unit]);

  const bioload = useMemo(
    () => BIOLOAD_PROFILES.find((b) => b.id === selectedBioload) ?? BIOLOAD_PROFILES[1],
    [selectedBioload, BIOLOAD_PROFILES],
  );

  const filterType = useMemo(
    () => FILTER_TYPES.find((f) => f.id === selectedFilterType) ?? FILTER_TYPES[0],
    [selectedFilterType, FILTER_TYPES],
  );

  // Media drag modifier
  const mediaDragModifier = useMemo(() => {
    switch (mediaDensity) {
      case "light":
        return 0.85; // 15% extra drag
      case "dense":
        return 1.25; // 25% extra drag
      case "standard":
      default:
        return 1.0;
    }
  }, [mediaDensity]);

  // Calculations
  const results = useMemo(() => {
    // 1. Net effective flow rate required inside the tank (GPH)
    const netGphMin = tankGallons * bioload.turnoverMin;
    const netGphMax = tankGallons * bioload.turnoverMax;
    const netGphOptimal = (netGphMin + netGphMax) / 2;

    // 2. Real-world flow loss factor:
    // Filter base loss + vertical head loss * height
    const baseLoss = filterType.baselineMediaLoss * mediaDragModifier;
    const verticalLoss = filterType.headLossFactor * Math.max(0, headHeightFt);
    const totalLossFraction = Math.min(0.65, Math.max(0.15, baseLoss + verticalLoss));
    const practicalFlowEfficiency = 1 - totalLossFraction;

    // 3. Recommended Manufacturer Box Rating to purchase (Gross GPH):
    // To achieve netGphOptimal after losses:
    const grossGphRecommended = Math.round(netGphOptimal / practicalFlowEfficiency);
    const grossGphMin = Math.round(netGphMin / practicalFlowEfficiency);
    const grossGphMax = Math.round(netGphMax / practicalFlowEfficiency);

    // Convert to Liters Per Hour (LPH)
    const grossLphRecommended = Math.round(grossGphRecommended * 3.78541);
    const netLphOptimal = Math.round(netGphOptimal * 3.78541);

    // Biological media volume recommendation (Rule of thumb: 1 liter biological media per 25-30 gallons of water)
    const bioMediaLitersMin = Math.max(0.5, (tankGallons / 30) * (bioload.turnoverMin / 4));
    const bioMediaLitersOptimal = Math.max(0.8, (tankGallons / 25) * (bioload.turnoverMax / 5));

    // Surface agitation & gas exchange rating
    const turnoverTimes = Math.round(netGphOptimal / tankGallons);

    return {
      netGphMin: Math.round(netGphMin),
      netGphMax: Math.round(netGphMax),
      netGphOptimal: Math.round(netGphOptimal),
      grossGphRecommended,
      grossGphMin,
      grossGphMax,
      grossLphRecommended,
      netLphOptimal,
      turnoverTimes,
      lossPercentage: Math.round(totalLossFraction * 100),
      bioMediaLitersMin: +bioMediaLitersMin.toFixed(1),
      bioMediaLitersOptimal: +bioMediaLitersOptimal.toFixed(1),
    };
  }, [tankGallons, bioload, filterType, mediaDragModifier, headHeightFt]);

  const handlePresetClick = (gal: number) => {
    if (unit === "liters") {
      setTankVolumeInput(Math.round(gal * 3.78541));
    } else {
      setTankVolumeInput(gal);
    }
  };

  const handleReset = () => {
    setUnit("gal");
    setTankVolumeInput(40);
    setSelectedBioload("community");
    setSelectedFilterType("canister");
    setMediaDensity("standard");
    setHeadHeightFt(3.5);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-muted-foreground sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
            <Waves className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">
              {t(`${NS}.ui.bannerTitle`)}
            </h2>
            <p className="mt-1 leading-relaxed">
              {t(`${NS}.ui.bannerP1`)} <strong>{t(`${NS}.ui.bannerP2`)}</strong>.{" "}
              {t(`${NS}.ui.bannerP3`)} <strong>{t(`${NS}.ui.bannerP4`)}</strong>.{" "}
              {t(`${NS}.ui.bannerP5`)} <strong>{t(`${NS}.ui.bannerP6`)}</strong>{" "}
              {t(`${NS}.ui.bannerP7`)} <strong>{t(`${NS}.ui.bannerP8`)}</strong>{" "}
              {t(`${NS}.ui.bannerP9`)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Input Configuration Column */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{t(`${NS}.ui.section1Title`)}</CardTitle>
                  <CardDescription>{t(`${NS}.ui.section1Desc`)}</CardDescription>
                </div>
                <div className="inline-flex rounded-lg border bg-muted p-1 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      if (unit !== "gal") {
                        setUnit("gal");
                        setTankVolumeInput(Math.round(tankVolumeInput / 3.78541));
                      }
                    }}
                    className={`rounded-md px-3 py-1 transition-all ${
                      unit === "gal" ? "bg-background font-semibold text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(`${NS}.ui.unitGallons`)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (unit !== "liters") {
                        setUnit("liters");
                        setTankVolumeInput(Math.round(tankVolumeInput * 3.78541));
                      }
                    }}
                    className={`rounded-md px-3 py-1 transition-all ${
                      unit === "liters" ? "bg-background font-semibold text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(`${NS}.ui.unitLiters`)}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-sm font-medium">
                  <Label htmlFor="tank-volume">{t(`${NS}.ui.tankVolumeLabel`)}</Label>
                  <span className="text-primary font-mono text-base font-bold">
                    {safeVolume} {unit === "gal" ? t(`${NS}.ui.unitShortGal`) : t(`${NS}.ui.unitShortLiter`)}
                  </span>
                </div>
                <Input
                  id="tank-volume"
                  type="number"
                  min={2}
                  max={1000}
                  value={tankVolumeInput || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setTankVolumeInput(isNaN(val) ? 0 : val);
                  }}
                  className="mt-2 text-base font-semibold"
                />
              </div>

              {/* Quick presets */}
              <div>
                <Label className="text-xs text-muted-foreground">{t(`${NS}.ui.presetsLabel`)}</Label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {PRESET_GALLONS.map((gal) => (
                    <Button
                      key={gal}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetClick(gal)}
                      className="h-7 text-xs"
                    >
                      {presetLabel(t, gal)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bioload & Inhabitant Profile */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">{t(`${NS}.ui.section2Title`)}</CardTitle>
              <CardDescription>{t(`${NS}.ui.section2Desc`)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {BIOLOAD_PROFILES.map((profile) => {
                const isSelected = selectedBioload === profile.id;
                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => setSelectedBioload(profile.id)}
                    className={`w-full rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border/60 bg-card hover:border-primary/40 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{profile.name}</span>
                      <Badge variant={isSelected ? "default" : "outline"} className="text-xs font-mono">
                        {profile.turnoverMin}× – {profile.turnoverMax}× /hr
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{profile.description}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-primary/90">
                      <Fish className="size-3.5 shrink-0" />
                      <span className="line-clamp-1">{profile.recommendedSpecies}</span>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Filtration Mechanics & Drag */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">{t(`${NS}.ui.section3Title`)}</CardTitle>
              <CardDescription>{t(`${NS}.ui.section3Desc`)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-sm font-medium">{t(`${NS}.ui.filterStyleLabel`)}</Label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {FILTER_TYPES.map((ft) => {
                    const isSelected = selectedFilterType === ft.id;
                    return (
                      <button
                        key={ft.id}
                        type="button"
                        onClick={() => setSelectedFilterType(ft.id)}
                        className={`rounded-lg border p-3 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border/60 hover:border-primary/40"
                        }`}
                      >
                        <div className="font-semibold text-xs text-foreground">{ft.name}</div>
                        <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{ft.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Media Density */}
              <div>
                <Label className="text-sm font-medium">{t(`${NS}.ui.mediaDensityLabel`)}</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {MEDIA_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setMediaDensity(tier.id)}
                      className={`rounded-lg border p-2.5 text-left transition-all ${
                        mediaDensity === tier.id
                          ? "border-primary bg-primary/5 font-semibold text-primary"
                          : "border-border/60 text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <div className="text-xs">{tier.label}</div>
                      <div className="mt-0.5 text-[10px] opacity-75">{tier.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vertical Head Height Range (For Canisters and Sumps) */}
              {(selectedFilterType === "canister" || selectedFilterType === "sump") && (
                <div className="rounded-xl bg-muted/40 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <Label htmlFor="head-height" className="flex items-center gap-1.5">
                      <Gauge className="size-3.5 text-primary" />
                      {t(`${NS}.ui.headHeightLabel`)}
                    </Label>
                    <span className="font-mono font-bold text-foreground">
                      {t(`${NS}.ui.headHeightValue`, { ft: headHeightFt, m: (headHeightFt * 0.3048).toFixed(1) })}
                    </span>
                  </div>
                  <input
                    id="head-height"
                    type="range"
                    min={1}
                    max={6}
                    step={0.5}
                    value={headHeightFt}
                    onChange={(e) => setHeadHeightFt(parseFloat(e.target.value) || 3.5)}
                    className="w-full h-2 rounded-lg bg-muted-foreground/25 accent-primary cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{t(`${NS}.ui.headLow`)}</span>
                    <div className="flex gap-1.5">
                      {[2, 3.5, 5].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setHeadHeightFt(h)}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-mono border transition-colors ${
                            headHeightFt === h
                              ? "border-primary bg-primary/10 text-primary font-bold"
                              : "border-border/60 hover:bg-muted"
                          }`}
                        >
                          {t(`${NS}.ui.headQuick`, { h })}
                        </button>
                      ))}
                    </div>
                    <span>{t(`${NS}.ui.headHigh`)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {t(`${NS}.ui.headHeightNote`)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Output & Engineering Dashboard Column */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="sticky top-24 border-primary/30 bg-card shadow-md">
            <CardHeader className="border-b border-border/50 bg-primary/5 pb-4">
              <Badge variant="outline" className="w-fit border-primary/40 bg-background font-mono text-primary text-xs">
                {t(`${NS}.ui.outputBadge`)}
              </Badge>
              <CardTitle className="text-2xl font-display mt-2">{t(`${NS}.ui.outputTitle`)}</CardTitle>
              <CardDescription>
                {t(`${NS}.ui.outputDesc`, {
                  vol: tankVolumeInput,
                  unit: unit === "gal" ? t(`${NS}.ui.unitLongGallons`) : t(`${NS}.ui.unitLongLiters`),
                  bioload: bioload.name,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Main Stat: Recommended Box Rating */}
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-center shadow-inner">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(`${NS}.ui.boxRatingLabel`)}
                </div>
                <div className="mt-2 text-4xl font-black tracking-tight text-primary font-mono sm:text-5xl">
                  {results.grossGphRecommended} <span className="text-2xl font-semibold">{t(`${NS}.ui.boxRatingUnit`)}</span>
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-muted-foreground">
                  {t(`${NS}.ui.boxRatingLph`, { lph: results.grossLphRecommended.toLocaleString() })}
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs text-foreground shadow-sm">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  {t(`${NS}.ui.boxRange`, { min: results.grossGphMin, max: results.grossGphMax })}
                </div>
              </div>

              {/* Real World Performance Breakdown */}
              <div className="space-y-3 rounded-xl border bg-muted/20 p-4 text-xs">
                <div className="font-semibold text-foreground flex items-center justify-between">
                  <span>{t(`${NS}.ui.breakdownTitle`)}</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {t(`${NS}.ui.frictionLoss`, { pct: results.lossPercentage })}
                  </Badge>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">{t(`${NS}.ui.netFlowLabel`)}</span>
                  <span className="font-mono font-bold text-foreground">
                    {t(`${NS}.ui.netFlowValue`, { gph: results.netGphOptimal, lph: results.netLphOptimal })}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">{t(`${NS}.ui.turnoverLabel`)}</span>
                  <span className="font-mono font-bold text-primary">
                    {t(`${NS}.ui.turnoverValue`, { times: results.turnoverTimes })}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">{t(`${NS}.ui.bioMediaLabel`)}</span>
                  <span className="font-mono font-bold text-foreground">
                    {t(`${NS}.ui.bioMediaValue`, { min: results.bioMediaLitersMin, max: results.bioMediaLitersOptimal })}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">{t(`${NS}.ui.flowRatingLabel`)}</span>
                  <span className="font-semibold uppercase tracking-wider text-primary">
                    {t(`${NS}.ui.flow${bioload.flowSensitivity[0].toUpperCase()}${bioload.flowSensitivity.slice(1)}`)}{" "}
                    {t(`${NS}.ui.flowCurrentSuffix`)}
                  </span>
                </div>
              </div>

              {/* Specialist Advice / Baffle Notice */}
              {bioload.id === "low-flow" && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-950 dark:text-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="size-4 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <strong>{t(`${NS}.ui.baffleTitle`)}</strong> {t(`${NS}.ui.baffleBody1`)}{" "}
                      <strong>{t(`${NS}.ui.baffleBody2`)}</strong> {t(`${NS}.ui.baffleBody3`)}
                    </div>
                  </div>
                </div>
              )}

              {bioload.id === "heavy" && (
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-xs text-blue-950 dark:text-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="size-4 shrink-0 text-blue-500 mt-0.5" />
                    <div>
                      <strong>{t(`${NS}.ui.dualTitle`)}</strong> {t(`${NS}.ui.dualBody1`)}{" "}
                      <strong>{t(`${NS}.ui.dualBody2`)}</strong> {t(`${NS}.ui.dualBody3`)}
                    </div>
                  </div>
                </div>
              )}

              {/* Filtration Architecture Guide */}
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" />
                  {t(`${NS}.ui.mediaConfigTitle`)}
                </div>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-primary">{t(`${NS}.ui.mediaStage1Label`)}</span>
                    {t(`${NS}.ui.mediaStage1Text`)}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-primary">{t(`${NS}.ui.mediaStage2Label`)}</span>
                    {t(`${NS}.ui.mediaStage2Before`, { liters: results.bioMediaLitersOptimal })}<em>Nitrosomonas</em>{t(`${NS}.ui.mediaStage2Between`)}<em>Nitrospira</em>{t(`${NS}.ui.mediaStage2After`)}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-primary">{t(`${NS}.ui.mediaStage3Label`)}</span>
                    {t(`${NS}.ui.mediaStage3Text`)}
                  </li>
                </ul>
              </div>

              {/* Reset action */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="w-full text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="mr-1.5 size-3.5" />
                  {t(`${NS}.ui.resetButton`)}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
