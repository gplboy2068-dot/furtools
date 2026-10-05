import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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

function Badge({ tone, children }: { tone: "safe" | "caution" | "danger" | "extreme"; children: React.ReactNode }) {
  const cls =
    tone === "safe" ? "bg-emerald-100 text-emerald-800"
    : tone === "caution" ? "bg-amber-100 text-amber-800"
    : tone === "danger" ? "bg-orange-100 text-orange-800"
    : "bg-red-100 text-red-800";
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{children}</span>;
}

/* ═══════════════ 1. HEATSTROKE RISK CALCULATOR ═══════════════ */
export function HeatstrokeRiskCalculator() {
  const { t } = useTranslation("tools");
  const [tempF, setTempF] = useState(85);
  const [humidity, setHumidity] = useState(55);
  const [brachy, setBrachy] = useState(false);
  const [coat, setCoat] = useState("medium");
  const [activity, setActivity] = useState("moderate");
  const [senior, setSenior] = useState(false);

  const { score, tone, label, advice } = useMemo(() => {
    // Heat index approximation (Rothfusz simplified)
    const T = tempF, R = humidity;
    let hi = -42.379 + 2.04901523*T + 10.14333127*R - 0.22475541*T*R
      - 0.00683783*T*T - 0.05481717*R*R + 0.00122874*T*T*R
      + 0.00085282*T*R*R - 0.00000199*T*T*R*R;
    if (T < 80) hi = T;
    let s = 0;
    if (hi >= 70) s += (hi - 70) * 1.4;
    if (brachy) s += 25;
    if (senior) s += 10;
    if (coat === "thick") s += 12; else if (coat === "double") s += 15; else if (coat === "short") s -= 3;
    if (activity === "vigorous") s += 20; else if (activity === "moderate") s += 8;
    s = Math.max(0, Math.round(s));
    let tone: "safe" | "caution" | "danger" | "extreme" = "safe";
    let label = t("heatstroke-risk-calculator.ui.riskLow");
    let advice = t("heatstroke-risk-calculator.ui.adviceLow");
    if (s >= 80) { tone = "extreme"; label = t("heatstroke-risk-calculator.ui.riskExtreme"); advice = t("heatstroke-risk-calculator.ui.adviceExtreme"); }
    else if (s >= 55) { tone = "danger"; label = t("heatstroke-risk-calculator.ui.riskHigh"); advice = t("heatstroke-risk-calculator.ui.adviceHigh"); }
    else if (s >= 30) { tone = "caution"; label = t("heatstroke-risk-calculator.ui.riskModerate"); advice = t("heatstroke-risk-calculator.ui.adviceModerate"); }
    return { score: s, tone, label, advice };
  }, [tempF, humidity, brachy, coat, activity, senior, t]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("heatstroke-risk-calculator.ui.tempLabel", { temp: tempF })}</Label>
        <Slider value={[tempF]} min={40} max={115} step={1} onValueChange={(v) => setTempF(v[0])} />
      </div>
      <div>
        <Label>{t("heatstroke-risk-calculator.ui.humidityLabel", { humidity })}</Label>
        <Slider value={[humidity]} min={0} max={100} step={5} onValueChange={(v) => setHumidity(v[0])} />
      </div>
      <div>
        <Label>{t("heatstroke-risk-calculator.ui.coatLabel")}</Label>
        <Select value={coat} onValueChange={setCoat}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="short">{t("heatstroke-risk-calculator.ui.coatShort")}</SelectItem>
            <SelectItem value="medium">{t("heatstroke-risk-calculator.ui.coatMedium")}</SelectItem>
            <SelectItem value="thick">{t("heatstroke-risk-calculator.ui.coatThick")}</SelectItem>
            <SelectItem value="double">{t("heatstroke-risk-calculator.ui.coatDouble")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("heatstroke-risk-calculator.ui.activityLabel")}</Label>
        <Select value={activity} onValueChange={setActivity}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="rest">{t("heatstroke-risk-calculator.ui.actRest")}</SelectItem>
            <SelectItem value="moderate">{t("heatstroke-risk-calculator.ui.actModerate")}</SelectItem>
            <SelectItem value="vigorous">{t("heatstroke-risk-calculator.ui.actVigorous")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={brachy} onCheckedChange={(v) => setBrachy(!!v)} /> {t("heatstroke-risk-calculator.ui.brachyLabel")}</label>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={senior} onCheckedChange={(v) => setSenior(!!v)} /> {t("heatstroke-risk-calculator.ui.seniorLabel")}</label>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">{t("heatstroke-risk-calculator.ui.riskTitle")}</div>
      <div className="font-display text-4xl font-semibold">{score}</div>
      <Badge tone={tone}>{label}</Badge>
      <p className="text-sm text-muted-foreground">{advice}</p>
      <div className="mt-4 rounded-lg bg-background/60 p-3 text-xs">
        {t("heatstroke-risk-calculator.ui.emergencyNote")}
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 2. COLD WEATHER SAFETY SCORE ═══════════════ */
export function ColdWeatherSafetyScore() {
  const { t } = useTranslation("tools");
  const [tempF, setTempF] = useState(35);
  const [wind, setWind] = useState(10);
  const [wet, setWet] = useState(false);
  const [size, setSize] = useState("medium");
  const [coat, setCoat] = useState("medium");
  const [puppy, setPuppy] = useState(false);

  const { label, tone, advice, windchill } = useMemo(() => {
    // NWS wind chill
    const wc = tempF <= 50 && wind >= 3
      ? 35.74 + 0.6215*tempF - 35.75*Math.pow(wind, 0.16) + 0.4275*tempF*Math.pow(wind, 0.16)
      : tempF;
    let felt = wc;
    if (wet) felt -= 10;
    if (coat === "short") felt -= 5; else if (coat === "double") felt += 8;
    if (size === "toy") felt -= 6; else if (size === "large") felt += 3;
    if (puppy) felt -= 4;
    let tone: "safe" | "caution" | "danger" | "extreme" = "safe";
    let label = t("cold-weather-safety-score.ui.labelSafe");
    let advice = t("cold-weather-safety-score.ui.adviceSafe");
    if (felt <= 0) { tone = "extreme"; label = t("cold-weather-safety-score.ui.labelExtreme"); advice = t("cold-weather-safety-score.ui.adviceExtreme"); }
    else if (felt <= 20) { tone = "danger"; label = t("cold-weather-safety-score.ui.labelDanger"); advice = t("cold-weather-safety-score.ui.adviceDanger"); }
    else if (felt <= 32) { tone = "caution"; label = t("cold-weather-safety-score.ui.labelChilly"); advice = t("cold-weather-safety-score.ui.adviceChilly"); }
    return { label, tone, advice, windchill: Math.round(wc) };
  }, [tempF, wind, wet, size, coat, puppy, t]);

  const form = (
    <div className="space-y-4">
      <div><Label>{t("cold-weather-safety-score.ui.tempLabel", { temp: tempF })}</Label><Slider value={[tempF]} min={-30} max={60} step={1} onValueChange={(v) => setTempF(v[0])} /></div>
      <div><Label>{t("cold-weather-safety-score.ui.windLabel", { wind })}</Label><Slider value={[wind]} min={0} max={45} step={1} onValueChange={(v) => setWind(v[0])} /></div>
      <div>
        <Label>{t("cold-weather-safety-score.ui.sizeLabel")}</Label>
        <Select value={size} onValueChange={setSize}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
          <SelectItem value="toy">{t("cold-weather-safety-score.ui.sizeToy")}</SelectItem><SelectItem value="small">{t("cold-weather-safety-score.ui.sizeSmall")}</SelectItem>
          <SelectItem value="medium">{t("cold-weather-safety-score.ui.sizeMedium")}</SelectItem><SelectItem value="large">{t("cold-weather-safety-score.ui.sizeLarge")}</SelectItem>
        </SelectContent></Select>
      </div>
      <div>
        <Label>{t("cold-weather-safety-score.ui.coatLabel")}</Label>
        <Select value={coat} onValueChange={setCoat}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
          <SelectItem value="short">{t("cold-weather-safety-score.ui.coatShort")}</SelectItem><SelectItem value="medium">{t("cold-weather-safety-score.ui.coatMedium")}</SelectItem><SelectItem value="double">{t("cold-weather-safety-score.ui.coatDouble")}</SelectItem>
        </SelectContent></Select>
      </div>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={wet} onCheckedChange={(v) => setWet(!!v)} /> {t("cold-weather-safety-score.ui.wetLabel")}</label>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={puppy} onCheckedChange={(v) => setPuppy(!!v)} /> {t("cold-weather-safety-score.ui.puppyLabel")}</label>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">{t("cold-weather-safety-score.ui.windchillTitle")}</div>
      <div className="font-display text-4xl font-semibold">{t("cold-weather-safety-score.ui.windchillValue", { wc: windchill })}</div>
      <Badge tone={tone}>{label}</Badge>
      <p className="text-sm text-muted-foreground">{advice}</p>
      <div className="mt-4 rounded-lg bg-background/60 p-3 text-xs">
        {t("cold-weather-safety-score.ui.hypoNote")}
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 3. PAW PAD TEMPERATURE CHECKER ═══════════════ */
export function PawPadTemperatureChecker() {
  const { t } = useTranslation("tools");
  const [air, setAir] = useState(85);
  const [surface, setSurface] = useState("asphalt");
  const [sun, setSun] = useState("full");

  const { padTemp, tone, label, seconds } = useMemo(() => {
    // Empirical: asphalt in full sun ≈ air + 40-60°F
    const base: Record<string, number> = { asphalt: 45, concrete: 25, sand: 40, grass: 5, dirt: 15, wood: 20 };
    const sunMult = sun === "full" ? 1 : sun === "partial" ? 0.6 : 0.2;
    const pad = Math.round(air + base[surface] * sunMult);
    let tone: "safe" | "caution" | "danger" | "extreme" = "safe";
    let label = t("paw-pad-temperature-checker.ui.labelSafe");
    let sec = t("paw-pad-temperature-checker.ui.secUnlimited");
    if (pad >= 140) { tone = "extreme"; label = t("paw-pad-temperature-checker.ui.labelExtreme"); sec = t("paw-pad-temperature-checker.ui.secDoNotWalk"); }
    else if (pad >= 125) { tone = "danger"; label = t("paw-pad-temperature-checker.ui.labelDanger"); sec = t("paw-pad-temperature-checker.ui.secDanger"); }
    else if (pad >= 110) { tone = "caution"; label = t("paw-pad-temperature-checker.ui.labelCaution"); sec = t("paw-pad-temperature-checker.ui.secCaution"); }
    return { padTemp: pad, tone, label, seconds: sec };
  }, [air, surface, sun, t]);

  const form = (
    <div className="space-y-4">
      <div><Label>{t("paw-pad-temperature-checker.ui.tempLabel", { temp: air })}</Label><Slider value={[air]} min={40} max={115} step={1} onValueChange={(v) => setAir(v[0])} /></div>
      <div>
        <Label>{t("paw-pad-temperature-checker.ui.surfaceLabel")}</Label>
        <Select value={surface} onValueChange={setSurface}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
          <SelectItem value="asphalt">{t("paw-pad-temperature-checker.ui.surfaceAsphalt")}</SelectItem><SelectItem value="concrete">{t("paw-pad-temperature-checker.ui.surfaceConcrete")}</SelectItem>
          <SelectItem value="sand">{t("paw-pad-temperature-checker.ui.surfaceSand")}</SelectItem><SelectItem value="dirt">{t("paw-pad-temperature-checker.ui.surfaceDirt")}</SelectItem>
          <SelectItem value="grass">{t("paw-pad-temperature-checker.ui.surfaceGrass")}</SelectItem><SelectItem value="wood">{t("paw-pad-temperature-checker.ui.surfaceWood")}</SelectItem>
        </SelectContent></Select>
      </div>
      <div>
        <Label>{t("paw-pad-temperature-checker.ui.sunLabel")}</Label>
        <Select value={sun} onValueChange={setSun}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
          <SelectItem value="full">{t("paw-pad-temperature-checker.ui.sunFull")}</SelectItem><SelectItem value="partial">{t("paw-pad-temperature-checker.ui.sunPartial")}</SelectItem><SelectItem value="shade">{t("paw-pad-temperature-checker.ui.sunShade")}</SelectItem>
        </SelectContent></Select>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">{t("paw-pad-temperature-checker.ui.padTitle")}</div>
      <div className="font-display text-4xl font-semibold">{t("paw-pad-temperature-checker.ui.padValue", { pad: padTemp })}</div>
      <Badge tone={tone}>{label}</Badge>
      <div className="text-sm"><strong>{t("paw-pad-temperature-checker.ui.safeContactLabel")}</strong> {seconds}</div>
      <div className="mt-4 rounded-lg bg-background/60 p-3 text-xs">
        {t("paw-pad-temperature-checker.ui.testNote")}
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 4. FIREWORKS ANXIETY PREP ═══════════════ */
export function FireworksAnxietyPrep() {
  const { t } = useTranslation("tools");
  const taskGroups = [
    { g: t("fireworks-anxiety-prep.ui.groupWeek"), items: [
      t("fireworks-anxiety-prep.ui.week1"), t("fireworks-anxiety-prep.ui.week2"),
      t("fireworks-anxiety-prep.ui.week3"), t("fireworks-anxiety-prep.ui.week4"),
    ] },
    { g: t("fireworks-anxiety-prep.ui.groupDay"), items: [
      t("fireworks-anxiety-prep.ui.day1"), t("fireworks-anxiety-prep.ui.day2"),
      t("fireworks-anxiety-prep.ui.day3"), t("fireworks-anxiety-prep.ui.day4"),
      t("fireworks-anxiety-prep.ui.day5"),
    ] },
    { g: t("fireworks-anxiety-prep.ui.groupDuring"), items: [
      t("fireworks-anxiety-prep.ui.during1"), t("fireworks-anxiety-prep.ui.during2"),
      t("fireworks-anxiety-prep.ui.during3"), t("fireworks-anxiety-prep.ui.during4"),
      t("fireworks-anxiety-prep.ui.during5"),
    ] },
    { g: t("fireworks-anxiety-prep.ui.groupEmergency"), items: [
      t("fireworks-anxiety-prep.ui.emergency1"), t("fireworks-anxiety-prep.ui.emergency2"),
      t("fireworks-anxiety-prep.ui.emergency3"),
    ] },
  ];
  const [done, setDone] = useLocal<Record<string, boolean>>("furtools:fireworks", {});
  const total = taskGroups.reduce((s, g) => s + g.items.length, 0);
  const complete = Object.values(done).filter(Boolean).length;
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-cream-deep p-4">
        <div className="text-xs uppercase text-muted-foreground">{t("fireworks-anxiety-prep.ui.progressLabel")}</div>
        <div className="font-display text-3xl font-semibold">{complete} / {total}</div>
      </div>
      {taskGroups.map((g) => (
        <div key={g.g}>
          <div className="font-display text-lg font-semibold mb-2">{g.g}</div>
          <ul className="space-y-2">
            {g.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Checkbox checked={!!done[item]} onCheckedChange={(v) => setDone((d) => ({ ...d, [item]: !!v }))} />
                <span className={done[item] ? "line-through text-muted-foreground" : ""}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════ 5. HALLOWEEN SAFETY CHECKER ═══════════════ */
export function HalloweenSafetyChecker() {
  const { t } = useTranslation("tools");
  const hazards = [
    { key: "chocolate", risk: "toxic", name: t("halloween-safety-checker.ui.hChocolate"), detail: t("halloween-safety-checker.ui.dChocolate") },
    { key: "xylitol", risk: "toxic", name: t("halloween-safety-checker.ui.hXylitol"), detail: t("halloween-safety-checker.ui.dXylitol") },
    { key: "raisins", risk: "toxic", name: t("halloween-safety-checker.ui.hRaisins"), detail: t("halloween-safety-checker.ui.dRaisins") },
    { key: "wrappers", risk: "hazard", name: t("halloween-safety-checker.ui.hWrappers"), detail: t("halloween-safety-checker.ui.dWrappers") },
    { key: "glow", risk: "hazard", name: t("halloween-safety-checker.ui.hGlow"), detail: t("halloween-safety-checker.ui.dGlow") },
    { key: "costumes", risk: "caution", name: t("halloween-safety-checker.ui.hCostumes"), detail: t("halloween-safety-checker.ui.dCostumes") },
    { key: "door", risk: "hazard", name: t("halloween-safety-checker.ui.hDoor"), detail: t("halloween-safety-checker.ui.dDoor") },
    { key: "candles", risk: "hazard", name: t("halloween-safety-checker.ui.hCandles"), detail: t("halloween-safety-checker.ui.dCandles") },
    { key: "blackcats", risk: "caution", name: t("halloween-safety-checker.ui.hBlackCats"), detail: t("halloween-safety-checker.ui.dBlackCats") },
  ];
  const riskLabels: Record<string, string> = {
    toxic: t("halloween-safety-checker.ui.riskToxic"),
    hazard: t("halloween-safety-checker.ui.riskHazard"),
    caution: t("halloween-safety-checker.ui.riskCaution"),
  };
  const [q, setQ] = useState("");
  const results = hazards.filter((h) => h.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <Input placeholder={t("halloween-safety-checker.ui.searchPlaceholder")} value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((h) => {
          const tone = h.risk === "toxic" ? "extreme" : h.risk === "hazard" ? "danger" : "caution";
          return (
            <div key={h.key} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{h.name}</div>
                <Badge tone={tone as "extreme" | "danger" | "caution"}>{riskLabels[h.risk]}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{h.detail}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg bg-cream-deep p-3 text-xs">
        {t("halloween-safety-checker.ui.emergencyNote")}
      </div>
    </div>
  );
}

/* ═══════════════ 6. CHRISTMAS HAZARD LOOKUP ═══════════════ */
export function ChristmasHazardLookup() {
  const { t } = useTranslation("tools");
  const hazards = [
    { key: "poinsettia", risk: "caution", name: t("christmas-hazard-lookup.ui.hPoinsettia"), detail: t("christmas-hazard-lookup.ui.dPoinsettia") },
    { key: "holly", risk: "toxic", name: t("christmas-hazard-lookup.ui.hHolly"), detail: t("christmas-hazard-lookup.ui.dHolly") },
    { key: "lilies", risk: "toxic", name: t("christmas-hazard-lookup.ui.hLilies"), detail: t("christmas-hazard-lookup.ui.dLilies") },
    { key: "treewater", risk: "hazard", name: t("christmas-hazard-lookup.ui.hTreeWater"), detail: t("christmas-hazard-lookup.ui.dTreeWater") },
    { key: "tinsel", risk: "hazard", name: t("christmas-hazard-lookup.ui.hTinsel"), detail: t("christmas-hazard-lookup.ui.dTinsel") },
    { key: "ornaments", risk: "hazard", name: t("christmas-hazard-lookup.ui.hOrnaments"), detail: t("christmas-hazard-lookup.ui.dOrnaments") },
    { key: "lights", risk: "hazard", name: t("christmas-hazard-lookup.ui.hLights"), detail: t("christmas-hazard-lookup.ui.dLights") },
    { key: "chocolate", risk: "toxic", name: t("christmas-hazard-lookup.ui.hChocolate"), detail: t("christmas-hazard-lookup.ui.dChocolate") },
    { key: "onions", risk: "toxic", name: t("christmas-hazard-lookup.ui.hOnions"), detail: t("christmas-hazard-lookup.ui.dOnions") },
    { key: "alcohol", risk: "toxic", name: t("christmas-hazard-lookup.ui.hAlcohol"), detail: t("christmas-hazard-lookup.ui.dAlcohol") },
    { key: "bones", risk: "hazard", name: t("christmas-hazard-lookup.ui.hBones"), detail: t("christmas-hazard-lookup.ui.dBones") },
    { key: "snowglobes", risk: "toxic", name: t("christmas-hazard-lookup.ui.hSnowGlobes"), detail: t("christmas-hazard-lookup.ui.dSnowGlobes") },
    { key: "candles", risk: "hazard", name: t("christmas-hazard-lookup.ui.hCandles"), detail: t("christmas-hazard-lookup.ui.dCandles") },
    { key: "wrapping", risk: "hazard", name: t("christmas-hazard-lookup.ui.hWrapping"), detail: t("christmas-hazard-lookup.ui.dWrapping") },
  ];
  const riskLabels: Record<string, string> = {
    toxic: t("christmas-hazard-lookup.ui.riskToxic"),
    hazard: t("christmas-hazard-lookup.ui.riskHazard"),
    caution: t("christmas-hazard-lookup.ui.riskCaution"),
  };
  const [q, setQ] = useState("");
  const results = hazards.filter((h) => h.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <Input placeholder={t("christmas-hazard-lookup.ui.searchPlaceholder")} value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((h) => {
          const tone = h.risk === "toxic" ? "extreme" : h.risk === "hazard" ? "danger" : "caution";
          return (
            <div key={h.key} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{h.name}</div>
                <Badge tone={tone as "extreme" | "danger" | "caution"}>{riskLabels[h.risk]}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{h.detail}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg bg-cream-deep p-3 text-xs">
        {t("christmas-hazard-lookup.ui.poisonNote")}
      </div>
    </div>
  );
}

/* ═══════════════ 7. ALLERGY SEASON TRACKER ═══════════════ */
type AllergyLog = { id: string; date: string; itch: number; pollen: number; symptoms: string[]; notes: string };
export function AllergySeasonTracker() {
  const { t } = useTranslation("tools");
  const symptoms = [
    t("allergy-season-tracker.ui.symptom1"),
    t("allergy-season-tracker.ui.symptom2"),
    t("allergy-season-tracker.ui.symptom3"),
    t("allergy-season-tracker.ui.symptom4"),
    t("allergy-season-tracker.ui.symptom5"),
    t("allergy-season-tracker.ui.symptom6"),
    t("allergy-season-tracker.ui.symptom7"),
    t("allergy-season-tracker.ui.symptom8"),
  ];
  const [logs, setLogs] = useLocal<AllergyLog[]>("furtools:allergy-log", []);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [itch, setItch] = useState(3);
  const [pollen, setPollen] = useState(5);
  const [sym, setSym] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  function toggle(s: string) {
    setSym((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }
  function add() {
    setLogs((prev) => [{ id: crypto.randomUUID(), date, itch, pollen, symptoms: sym, notes }, ...prev].slice(0, 90));
    setSym([]); setNotes("");
  }
  const avgItch = logs.length ? (logs.reduce((s, l) => s + l.itch, 0) / logs.length).toFixed(1) : "—";
  const worst = logs.length ? [...logs].sort((a, b) => b.itch - a.itch)[0] : null;

  const form = (
    <div className="space-y-4">
      <div><Label>{t("allergy-season-tracker.ui.dateLabel")}</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div><Label>{t("allergy-season-tracker.ui.itchLabel", { itch })}</Label><Slider value={[itch]} min={0} max={10} step={1} onValueChange={(v) => setItch(v[0])} /></div>
      <div><Label>{t("allergy-season-tracker.ui.pollenLabel", { pollen })}</Label><Slider value={[pollen]} min={0} max={10} step={1} onValueChange={(v) => setPollen(v[0])} /></div>
      <div>
        <Label className="mb-2 block">{t("allergy-season-tracker.ui.symptomsLabel")}</Label>
        <div className="grid grid-cols-2 gap-2">
          {symptoms.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <Checkbox checked={sym.includes(s)} onCheckedChange={() => toggle(s)} /> {s}
            </label>
          ))}
        </div>
      </div>
      <div><Label>{t("allergy-season-tracker.ui.notesLabel")}</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("allergy-season-tracker.ui.notesPlaceholder")} /></div>
      <Button onClick={add} className="w-full">{t("allergy-season-tracker.ui.logButton")}</Button>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><div className="text-xs uppercase text-muted-foreground">{t("allergy-season-tracker.ui.avgTitle")}</div><div className="font-display text-2xl font-semibold">{t("allergy-season-tracker.ui.avgValue", { avg: avgItch })}</div></div>
        <div><div className="text-xs uppercase text-muted-foreground">{t("allergy-season-tracker.ui.entriesTitle")}</div><div className="font-display text-2xl font-semibold">{logs.length}</div></div>
      </div>
      {worst && (<div className="text-sm">{t("allergy-season-tracker.ui.worstDay", { date: worst.date, itch: worst.itch })}</div>)}
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {logs.slice(0, 12).map((l) => (
          <div key={l.id} className="rounded-lg bg-background/60 p-2 text-xs">
            <div className="flex justify-between"><strong>{l.date}</strong><span>{t("allergy-season-tracker.ui.logMeta", { itch: l.itch, pollen: l.pollen })}</span></div>
            {l.symptoms.length > 0 && <div className="mt-1 text-muted-foreground">{l.symptoms.join(", ")}</div>}
            {l.notes && <div className="mt-1 italic">{l.notes}</div>}
          </div>
        ))}
        {logs.length === 0 && <div className="text-sm text-muted-foreground">{t("allergy-season-tracker.ui.emptyState")}</div>}
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 8. AIR QUALITY IMPACT ASSESSOR ═══════════════ */
export function AirQualityImpactAssessor() {
  const { t } = useTranslation("tools");
  const [aqi, setAqi] = useState(75);
  const [sensitive, setSensitive] = useState(false);
  const [brachy, setBrachy] = useState(false);
  const [species, setSpecies] = useState("dog");

  const { tone, label, action, cat } = useMemo(() => {
    let boost = 0;
    if (sensitive) boost += 30;
    if (brachy) boost += 25;
    if (species === "bird") boost += 40; // birds are extremely air-sensitive
    const eff = aqi + boost;
    let cat = t("air-quality-impact-assessor.ui.catGood");
    if (aqi > 300) cat = t("air-quality-impact-assessor.ui.catHazardous"); else if (aqi > 200) cat = t("air-quality-impact-assessor.ui.catVeryUnhealthy");
    else if (aqi > 150) cat = t("air-quality-impact-assessor.ui.catUnhealthy"); else if (aqi > 100) cat = t("air-quality-impact-assessor.ui.catSensitive");
    else if (aqi > 50) cat = t("air-quality-impact-assessor.ui.catModerate");
    let tone: "safe" | "caution" | "danger" | "extreme" = "safe";
    let label = t("air-quality-impact-assessor.ui.labelNormal");
    let action = t("air-quality-impact-assessor.ui.actionNormal");
    if (eff >= 200) { tone = "extreme"; label = t("air-quality-impact-assessor.ui.labelIndoors"); action = t("air-quality-impact-assessor.ui.actionIndoors"); }
    else if (eff >= 150) { tone = "danger"; label = t("air-quality-impact-assessor.ui.labelBathroom"); action = t("air-quality-impact-assessor.ui.actionBathroom"); }
    else if (eff >= 100) { tone = "caution"; label = t("air-quality-impact-assessor.ui.labelShorten"); action = t("air-quality-impact-assessor.ui.actionShorten"); }
    return { tone, label, action, cat };
  }, [aqi, sensitive, brachy, species, t]);

  const form = (
    <div className="space-y-4">
      <div><Label>{t("air-quality-impact-assessor.ui.aqiLabel", { aqi })}</Label><Slider value={[aqi]} min={0} max={500} step={5} onValueChange={(v) => setAqi(v[0])} /></div>
      <div>
        <Label>{t("air-quality-impact-assessor.ui.speciesLabel")}</Label>
        <Select value={species} onValueChange={setSpecies}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
          <SelectItem value="dog">{t("air-quality-impact-assessor.ui.speciesDog")}</SelectItem><SelectItem value="cat">{t("air-quality-impact-assessor.ui.speciesCat")}</SelectItem>
          <SelectItem value="bird">{t("air-quality-impact-assessor.ui.speciesBird")}</SelectItem><SelectItem value="small">{t("air-quality-impact-assessor.ui.speciesSmall")}</SelectItem>
        </SelectContent></Select>
      </div>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={brachy} onCheckedChange={(v) => setBrachy(!!v)} /> {t("air-quality-impact-assessor.ui.brachyLabel")}</label>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={sensitive} onCheckedChange={(v) => setSensitive(!!v)} /> {t("air-quality-impact-assessor.ui.sensitiveLabel")}</label>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">{t("air-quality-impact-assessor.ui.aqiTitle")}</div>
      <div className="font-display text-4xl font-semibold">{aqi}</div>
      <div className="text-sm">{cat}</div>
      <Badge tone={tone}>{label}</Badge>
      <p className="text-sm text-muted-foreground">{action}</p>
      <div className="mt-4 rounded-lg bg-background/60 p-3 text-xs">
        {t("air-quality-impact-assessor.ui.warningNote")}
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}
