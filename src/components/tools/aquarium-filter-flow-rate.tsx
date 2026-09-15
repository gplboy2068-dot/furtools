import { useState, useMemo } from "react";
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

const BIOLOAD_PROFILES: BioloadProfile[] = [
  {
    id: "low-flow",
    name: "Low-Flow / Delicate Species",
    turnoverMin: 3,
    turnoverMax: 4,
    description: "Gentle surface agitation with minimal current. Prevents fin fatigue and swimming stress.",
    recommendedSpecies: "Betta splendens, Fancy Guppies, Dwarf Shrimp (Neocaridina), Axolotls, Discus, Fry nursery",
    flowSensitivity: "gentle",
  },
  {
    id: "community",
    name: "Standard Tropical Community",
    turnoverMin: 4,
    turnoverMax: 6,
    description: "Balanced circulation supporting healthy oxygenation without buffeting peaceful community fish.",
    recommendedSpecies: "Tetras (Neon, Cardinal), Rasboras, Corydoras, Livebearers (Platies, Mollies), Dwarf Gouramis",
    flowSensitivity: "moderate",
  },
  {
    id: "planted",
    name: "High-Tech Planted / Aquascape",
    turnoverMin: 5,
    turnoverMax: 8,
    description: "High continuous water movement to circulate dissolved CO2 and liquid macro/micronutrients past leaf surfaces.",
    recommendedSpecies: "Heavily planted aquascapes, Rummy-nose Tetras, Otocinclus, Amano Shrimp, Rainbowfish",
    flowSensitivity: "brisk",
  },
  {
    id: "heavy",
    name: "Heavy Bioload / Messy Waste",
    turnoverMin: 8,
    turnoverMax: 10,
    description: "High-velocity mechanical turnover and oversized biological contact to handle massive organic waste.",
    recommendedSpecies: "Fancy & Common Goldfish, African Cichlids (Mbuna), Oscars, Large Plecos, Aquatic Turtles",
    flowSensitivity: "high",
  },
  {
    id: "marine",
    name: "Marine / Reef Aquarium",
    turnoverMin: 10,
    turnoverMax: 20,
    description: "Vigorous non-laminar current simulating ocean surges to feed coral polyps and prevent detritus settling.",
    recommendedSpecies: "Clownfish, Tangs, Soft Corals, LPS, SPS Corals, Marine Invertebrates",
    flowSensitivity: "high",
  },
];

interface FilterTypeProfile {
  id: string;
  name: string;
  baselineMediaLoss: number; // percentage loss from media
  headLossFactor: number; // sensitivity to vertical pumping height
  description: string;
}

const FILTER_TYPES: FilterTypeProfile[] = [
  {
    id: "canister",
    name: "External Canister Filter",
    baselineMediaLoss: 0.35,
    headLossFactor: 0.08,
    description: "High media capacity; placed under cabinet. Experience 35–50% flow reduction from media + vertical tubing lift.",
  },
  {
    id: "hob",
    name: "Hang-on-Back (HOB) Filter",
    baselineMediaLoss: 0.25,
    headLossFactor: 0.02,
    description: "Direct hang on tank rim. Minimal vertical lift, but media cartridges and sponges introduce 20–30% drag.",
  },
  {
    id: "internal",
    name: "Internal Power Filter",
    baselineMediaLoss: 0.20,
    headLossFactor: 0.01,
    description: "Submerged inside the tank. Zero head height loss; 15–25% flow drop as filter sponges load with debris.",
  },
  {
    id: "sponge",
    name: "Air-Driven Sponge Filter",
    baselineMediaLoss: 0.15,
    headLossFactor: 0.04,
    description: "Pneumatic airlift driven by air pump. Safe for fry and shrimp; best rated by air output and gentle water displacement.",
  },
  {
    id: "sump",
    name: "Sump / Wet-Dry Overflow System",
    baselineMediaLoss: 0.20,
    headLossFactor: 0.10,
    description: "Under-tank reservoir. Powerful return pump subject to significant head pressure loss (30–45% typical drop).",
  },
];

const STANDARD_PRESETS = [
  { label: "10 gal (38 L)", gal: 10 },
  { label: "20 gal Long (76 L)", gal: 20 },
  { label: "29 gal (110 L)", gal: 29 },
  { label: "40 gal Breeder (151 L)", gal: 40 },
  { label: "55 gal (208 L)", gal: 55 },
  { label: "75 gal (284 L)", gal: 75 },
  { label: "125 gal (473 L)", gal: 125 },
];

export function AquariumFilterFlowRate() {
  const [unit, setUnit] = useState<"gal" | "liters">("gal");
  const [tankVolumeInput, setTankVolumeInput] = useState<number>(40);
  const [selectedBioload, setSelectedBioload] = useState<string>("community");
  const [selectedFilterType, setSelectedFilterType] = useState<string>("canister");
  const [mediaDensity, setMediaDensity] = useState<"light" | "standard" | "dense">("standard");
  const [headHeightFt, setHeadHeightFt] = useState<number>(3.5);

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
    [selectedBioload],
  );

  const filterType = useMemo(
    () => FILTER_TYPES.find((f) => f.id === selectedFilterType) ?? FILTER_TYPES[0],
    [selectedFilterType],
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
              Specialist Aquatic Filtration & Fluid Turnover Model
            </h2>
            <p className="mt-1 leading-relaxed">
              Aquarium filter manufacturers test flow ratings on an <strong>empty pump chamber with zero filter media and zero vertical head lift</strong>.
              In real-world setups, coarse foam, biological ceramic rings, fine polishing pads, and tubing friction reduce flow by <strong>30% to 50%</strong>.
              This calculator computes both your <strong>True Net Flow</strong> and the exact <strong>Manufacturer Box Rating (Gross GPH/LPH)</strong> required to sustain continuous aerobic nitrification.
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
                  <CardTitle className="text-xl">1. Aquarium Parameters</CardTitle>
                  <CardDescription>Enter tank water volume and dimensions</CardDescription>
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
                    US Gallons
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
                    Liters
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-sm font-medium">
                  <Label htmlFor="tank-volume">Tank Water Volume</Label>
                  <span className="text-primary font-mono text-base font-bold">
                    {safeVolume} {unit === "gal" ? "gal" : "L"}
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
                <Label className="text-xs text-muted-foreground">Standard Tank Size Presets:</Label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {STANDARD_PRESETS.map((p) => (
                    <Button
                      key={p.label}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetClick(p.gal)}
                      className="h-7 text-xs"
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bioload & Inhabitant Profile */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">2. Bioload & Species Swim Dynamics</CardTitle>
              <CardDescription>Select the metabolic waste load and current sensitivity of your livestock</CardDescription>
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
              <CardTitle className="text-xl">3. Hardware Architecture & Head Drag</CardTitle>
              <CardDescription>Accounts for hydraulic friction, media density, and gravity head loss</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-sm font-medium">Filter Construction Style</Label>
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
                <Label className="text-sm font-medium">Filter Media Density Tier</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { id: "light", label: "Coarse / Light", desc: "Open-cell coarse foam only" },
                    { id: "standard", label: "Standard 3-Stage", desc: "Foam + Ceramic Rings + Carbon" },
                    { id: "dense", label: "Dense Polishing", desc: "Micro-floss + Matrix + Purigen" },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setMediaDensity(tier.id as typeof mediaDensity)}
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
                      Vertical Head Height (Under-tank to Rim)
                    </Label>
                    <span className="font-mono font-bold text-foreground">
                      {headHeightFt} ft (~{(headHeightFt * 0.3048).toFixed(1)} m)
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
                    <span>1 ft (Low)</span>
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
                          {h} ft
                        </button>
                      ))}
                    </div>
                    <span>6 ft (High)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Vertical tubing elevation forces the impeller to push against gravity, dissipating pump head pressure.
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
                Hydrodynamic Sizing Output
              </Badge>
              <CardTitle className="text-2xl font-display mt-2">Filter Sizing Benchmark</CardTitle>
              <CardDescription>
                Calculated for {tankVolumeInput} {unit === "gal" ? "Gallons" : "Liters"} ({bioload.name})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Main Stat: Recommended Box Rating */}
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-center shadow-inner">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Required Manufacturer Box Rating
                </div>
                <div className="mt-2 text-4xl font-black tracking-tight text-primary font-mono sm:text-5xl">
                  {results.grossGphRecommended} <span className="text-2xl font-semibold">GPH</span>
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-muted-foreground">
                  ≈ {results.grossLphRecommended.toLocaleString()} Liters / Hour (LPH)
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs text-foreground shadow-sm">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  Target Box Range: {results.grossGphMin} – {results.grossGphMax} GPH
                </div>
              </div>

              {/* Real World Performance Breakdown */}
              <div className="space-y-3 rounded-xl border bg-muted/20 p-4 text-xs">
                <div className="font-semibold text-foreground flex items-center justify-between">
                  <span>Fluid Dynamics & Flow Drop Analysis</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    ~{results.lossPercentage}% Friction Loss
                  </Badge>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">True Net Flow Delivered:</span>
                  <span className="font-mono font-bold text-foreground">
                    {results.netGphOptimal} GPH ({results.netLphOptimal} LPH)
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Effective Turnover Rate:</span>
                  <span className="font-mono font-bold text-primary">
                    {results.turnoverTimes}× tank volume per hour
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Recommended Bio-Media Volume:</span>
                  <span className="font-mono font-bold text-foreground">
                    {results.bioMediaLitersMin} – {results.bioMediaLitersOptimal} Liters
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Inhabitant Flow Rating:</span>
                  <span className="font-semibold uppercase tracking-wider text-primary">
                    {bioload.flowSensitivity} current
                  </span>
                </div>
              </div>

              {/* Specialist Advice / Baffle Notice */}
              {bioload.id === "low-flow" && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-950 dark:text-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="size-4 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <strong>Flow Baffling Recommended:</strong> For long-finned Bettas or Axolotls, install a 
                      <strong> spray bar directed against the rear glass</strong> or a foam intake/outflow baffle to dissipate directional shear velocity while preserving filtration volume.
                    </div>
                  </div>
                </div>
              )}

              {bioload.id === "heavy" && (
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-xs text-blue-950 dark:text-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="size-4 shrink-0 text-blue-500 mt-0.5" />
                    <div>
                      <strong>Dual Filtration Strategy:</strong> Goldfish and large cichlids thrive best with 
                      <strong> dual redundant filters</strong> (e.g., two medium canisters or one canister + one large HOB). This prevents catastrophic ammonia spikes during maintenance cleaning.
                    </div>
                  </div>
                </div>
              )}

              {/* Filtration Architecture Guide */}
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" />
                  Optimal 3-Stage Media Configuration:
                </div>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-primary">1. Mechanical:</span>
                    Coarse reticulated foam (20–30 PPI) to trap fish feces and uneaten food before it fouls biological media.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-primary">2. Biological:</span>
                    Porous sintered glass rings or Matrix ({results.bioMediaLitersOptimal}L) colonizing <em>Nitrosomonas</em> and <em>Nitrospira</em>.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-primary">3. Chemical / Polish:</span>
                    Synthetic resin (Seachem Purigen) or activated carbon to remove organic tannins and dissolved DOCs.
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
                  Reset to Standard Community Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
