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

function Pill({ tone, children }: { tone: "safe" | "caution" | "danger"; children: React.ReactNode }) {
  const cls =
    tone === "safe" ? "bg-emerald-100 text-emerald-800"
    : tone === "caution" ? "bg-amber-100 text-amber-800"
    : "bg-red-100 text-red-800";
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{children}</span>;
}

/* ═══════════════ 1. REPTILE UVB SCHEDULE ═══════════════ */
export function ReptileUvbSchedule() {
  const { t } = useTranslation("tools");
  const uvbSpecies: Record<string, { hours: number; uvi: string; note: string }> = {
    "bearded-dragon": { hours: 12, uvi: "4.0-6.0", note: t("reptile-uvb-schedule.ui.noteBeardedDragon") },
    "leopard-gecko": { hours: 10, uvi: "0.5-1.5", note: t("reptile-uvb-schedule.ui.noteLeopardGecko") },
    "crested-gecko": { hours: 10, uvi: "0.5-1.5", note: t("reptile-uvb-schedule.ui.noteCrestedGecko") },
    "ball-python": { hours: 10, uvi: "0.5-1.0", note: t("reptile-uvb-schedule.ui.noteBallPython") },
    "corn-snake": { hours: 12, uvi: "1.0-2.0", note: t("reptile-uvb-schedule.ui.noteCornSnake") },
    "russian-tortoise": { hours: 12, uvi: "4.0-7.0", note: t("reptile-uvb-schedule.ui.noteRussianTortoise") },
    "sulcata": { hours: 12, uvi: "5.0-8.0", note: t("reptile-uvb-schedule.ui.noteSulcata") },
    "red-eared-slider": { hours: 12, uvi: "3.0-6.0", note: t("reptile-uvb-schedule.ui.noteRedEaredSlider") },
    "chameleon": { hours: 12, uvi: "3.0-6.0", note: t("reptile-uvb-schedule.ui.noteChameleon") },
    "blue-tongue-skink": { hours: 12, uvi: "3.0-5.0", note: t("reptile-uvb-schedule.ui.noteBlueTongueSkink") },
  };
  const speciesLabels: Record<string, string> = {
    "bearded-dragon": t("reptile-uvb-schedule.ui.speciesBeardedDragon"),
    "leopard-gecko": t("reptile-uvb-schedule.ui.speciesLeopardGecko"),
    "crested-gecko": t("reptile-uvb-schedule.ui.speciesCrestedGecko"),
    "ball-python": t("reptile-uvb-schedule.ui.speciesBallPython"),
    "corn-snake": t("reptile-uvb-schedule.ui.speciesCornSnake"),
    "russian-tortoise": t("reptile-uvb-schedule.ui.speciesRussianTortoise"),
    "sulcata": t("reptile-uvb-schedule.ui.speciesSulcata"),
    "red-eared-slider": t("reptile-uvb-schedule.ui.speciesRedEaredSlider"),
    "chameleon": t("reptile-uvb-schedule.ui.speciesChameleon"),
    "blue-tongue-skink": t("reptile-uvb-schedule.ui.speciesBlueTongueSkink"),
  };
  const [species, setSpecies] = useState("bearded-dragon");
  const [installDate, setInstallDate] = useLocal<string>("furtools:uvb:install", "");
  const [bulbType, setBulbType] = useState<"t5-ho" | "t8" | "compact" | "mercury">("t5-ho");

  const info = uvbSpecies[species];
  const life = bulbType === "t5-ho" ? 12 : bulbType === "mercury" ? 12 : bulbType === "t8" ? 6 : 6;
  const replaceAt = useMemo(() => {
    if (!installDate) return null;
    const d = new Date(installDate);
    d.setMonth(d.getMonth() + life);
    return d.toISOString().slice(0, 10);
  }, [installDate, life]);

  const daysLeft = useMemo(() => {
    if (!replaceAt) return null;
    return Math.round((new Date(replaceAt).getTime() - Date.now()) / 86400000);
  }, [replaceAt]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("reptile-uvb-schedule.ui.speciesLabel")}</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(uvbSpecies).map((k) => <SelectItem key={k} value={k}>{speciesLabels[k]}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("reptile-uvb-schedule.ui.bulbLabel")}</Label>
        <Select value={bulbType} onValueChange={(v) => setBulbType(v as typeof bulbType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="t5-ho">{t("reptile-uvb-schedule.ui.bulbT5")}</SelectItem>
            <SelectItem value="t8">{t("reptile-uvb-schedule.ui.bulbT8")}</SelectItem>
            <SelectItem value="compact">{t("reptile-uvb-schedule.ui.bulbCompact")}</SelectItem>
            <SelectItem value="mercury">{t("reptile-uvb-schedule.ui.bulbMercury")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("reptile-uvb-schedule.ui.installLabel")}</Label>
        <Input type="date" value={installDate} onChange={(e) => setInstallDate(e.target.value)} />
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">{t("reptile-uvb-schedule.ui.onTimeTitle")}</div>
      <div className="font-display text-4xl font-semibold">{t("reptile-uvb-schedule.ui.hoursValue", { hours: info.hours })}</div>
      <p className="text-sm">{t("reptile-uvb-schedule.ui.targetUviLabel")}: <strong>{info.uvi}</strong></p>
      <p className="text-sm text-muted-foreground">{info.note}</p>
      <div className="mt-4 rounded-lg bg-background/60 p-3 text-sm space-y-1">
        <div><strong>{t("reptile-uvb-schedule.ui.bulbLifeLabel")}</strong> {t("reptile-uvb-schedule.ui.bulbLifeValue", { months: life })}</div>
        {replaceAt && <div><strong>{t("reptile-uvb-schedule.ui.replaceOnLabel")}</strong> {replaceAt} {daysLeft !== null && <span className="text-muted-foreground">{t("reptile-uvb-schedule.ui.daysLeftValue", { days: daysLeft })}</span>}</div>}
        {daysLeft !== null && daysLeft < 30 && <Pill tone={daysLeft < 0 ? "danger" : "caution"}>{daysLeft < 0 ? t("reptile-uvb-schedule.ui.overdueNow") : t("reptile-uvb-schedule.ui.replaceSoon")}</Pill>}
      </div>
      <p className="text-xs text-muted-foreground">{t("reptile-uvb-schedule.ui.bulbLifeNote")}</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 2. TANK TEMPERATURE GRADIENT CALCULATOR ═══════════════ */
export function TankTemperatureGradient() {
  const { t } = useTranslation("tools");
  const tempSpecies: Record<string, { basking: [number, number]; warm: [number, number]; cool: [number, number]; night: [number, number]; note: string }> = {
    "bearded-dragon": { basking: [100, 110], warm: [85, 90], cool: [75, 80], night: [65, 75], note: t("tank-temperature-gradient-calculator.ui.noteBeardedDragon") },
    "leopard-gecko": { basking: [90, 95], warm: [82, 88], cool: [72, 78], night: [68, 74], note: t("tank-temperature-gradient-calculator.ui.noteLeopardGecko") },
    "crested-gecko": { basking: [78, 82], warm: [72, 78], cool: [68, 72], night: [65, 72], note: t("tank-temperature-gradient-calculator.ui.noteCrestedGecko") },
    "ball-python": { basking: [88, 92], warm: [82, 86], cool: [75, 80], night: [72, 78], note: t("tank-temperature-gradient-calculator.ui.noteBallPython") },
    "corn-snake": { basking: [85, 90], warm: [80, 85], cool: [72, 78], night: [65, 75], note: t("tank-temperature-gradient-calculator.ui.noteCornSnake") },
    "russian-tortoise": { basking: [95, 100], warm: [80, 85], cool: [68, 75], night: [55, 65], note: t("tank-temperature-gradient-calculator.ui.noteRussianTortoise") },
    "red-eared-slider": { basking: [90, 95], warm: [78, 82], cool: [75, 78], night: [70, 75], note: t("tank-temperature-gradient-calculator.ui.noteRedEaredSlider") },
    "chameleon": { basking: [85, 90], warm: [72, 80], cool: [68, 72], night: [60, 68], note: t("tank-temperature-gradient-calculator.ui.noteChameleon") },
  };
  const speciesLabels: Record<string, string> = {
    "bearded-dragon": t("tank-temperature-gradient-calculator.ui.speciesBeardedDragon"),
    "leopard-gecko": t("tank-temperature-gradient-calculator.ui.speciesLeopardGecko"),
    "crested-gecko": t("tank-temperature-gradient-calculator.ui.speciesCrestedGecko"),
    "ball-python": t("tank-temperature-gradient-calculator.ui.speciesBallPython"),
    "corn-snake": t("tank-temperature-gradient-calculator.ui.speciesCornSnake"),
    "russian-tortoise": t("tank-temperature-gradient-calculator.ui.speciesRussianTortoise"),
    "red-eared-slider": t("tank-temperature-gradient-calculator.ui.speciesRedEaredSlider"),
    "chameleon": t("tank-temperature-gradient-calculator.ui.speciesChameleon"),
  };
  const [species, setSpecies] = useState("bearded-dragon");
  const [current, setCurrent] = useState({ basking: 100, warm: 85, cool: 75 });
  const spec = tempSpecies[species];

  const status = (val: number, [lo, hi]: [number, number]) =>
    val < lo - 3 ? "too-cold" : val > hi + 3 ? "too-hot" : val < lo || val > hi ? "close" : "ok";
  const chip = (s: string) => s === "ok" ? <Pill tone="safe">{t("tank-temperature-gradient-calculator.ui.inRange")}</Pill>
    : s === "close" ? <Pill tone="caution">{t("tank-temperature-gradient-calculator.ui.slightlyOff")}</Pill>
    : <Pill tone="danger">{s === "too-hot" ? t("tank-temperature-gradient-calculator.ui.tooHot") : t("tank-temperature-gradient-calculator.ui.tooCold")}</Pill>;

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("tank-temperature-gradient-calculator.ui.speciesLabel")}</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(tempSpecies).map((k) => <SelectItem key={k} value={k}>{speciesLabels[k]}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div><Label>{t("tank-temperature-gradient-calculator.ui.baskingLabel", { temp: current.basking })}</Label><Slider value={[current.basking]} min={60} max={130} step={1} onValueChange={(v) => setCurrent({ ...current, basking: v[0] })} /></div>
      <div><Label>{t("tank-temperature-gradient-calculator.ui.warmLabel", { temp: current.warm })}</Label><Slider value={[current.warm]} min={60} max={110} step={1} onValueChange={(v) => setCurrent({ ...current, warm: v[0] })} /></div>
      <div><Label>{t("tank-temperature-gradient-calculator.ui.coolLabel", { temp: current.cool })}</Label><Slider value={[current.cool]} min={50} max={95} step={1} onValueChange={(v) => setCurrent({ ...current, cool: v[0] })} /></div>
    </div>
  );
  const rows: Array<[string, [number, number], number | null]> = [
    [t("tank-temperature-gradient-calculator.ui.zoneBasking"), spec.basking, current.basking],
    [t("tank-temperature-gradient-calculator.ui.zoneWarm"), spec.warm, current.warm],
    [t("tank-temperature-gradient-calculator.ui.zoneCool"), spec.cool, current.cool],
    [t("tank-temperature-gradient-calculator.ui.zoneNight"), spec.night, null],
  ];
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">{t("tank-temperature-gradient-calculator.ui.targetTitle")}</div>
      <div className="space-y-2 text-sm">
        {rows.map(([zone, [lo, hi], val]) => (
          <div key={zone} className="flex items-center justify-between rounded-lg bg-background/60 p-3">
            <div>
              <div className="font-medium">{zone}</div>
              <div className="text-xs text-muted-foreground">{lo}-{hi}°F</div>
            </div>
            {val !== null ? <div className="flex items-center gap-2"><span className="font-semibold">{val}°F</span>{chip(status(val, [lo, hi]))}</div> : <span className="text-xs text-muted-foreground">{t("tank-temperature-gradient-calculator.ui.passiveLabel")}</span>}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">{spec.note} {t("tank-temperature-gradient-calculator.ui.measureNote")}</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 3. BIRD WING CLIPPING GUIDE (v2) ═══════════════ */
export function BirdWingClippingGuide() {
  const { t } = useTranslation("tools");
  const [species, setSpecies] = useState<"budgie" | "cockatiel" | "conure" | "amazon" | "african-grey" | "macaw">("cockatiel");
  const [purpose, setPurpose] = useState<"safety" | "training" | "none">("safety");
  const style: Record<typeof species, { feathers: string; symmetry: string; notes: string }> = {
    "budgie": { feathers: t("bird-wing-clipping-guide.ui.feathersBudgie"), symmetry: t("bird-wing-clipping-guide.ui.symmetryBudgie"), notes: t("bird-wing-clipping-guide.ui.notesBudgie") },
    "cockatiel": { feathers: t("bird-wing-clipping-guide.ui.feathersCockatiel"), symmetry: t("bird-wing-clipping-guide.ui.symmetryCockatiel"), notes: t("bird-wing-clipping-guide.ui.notesCockatiel") },
    "conure": { feathers: t("bird-wing-clipping-guide.ui.feathersConure"), symmetry: t("bird-wing-clipping-guide.ui.symmetryConure"), notes: t("bird-wing-clipping-guide.ui.notesConure") },
    "amazon": { feathers: t("bird-wing-clipping-guide.ui.feathersAmazon"), symmetry: t("bird-wing-clipping-guide.ui.symmetryAmazon"), notes: t("bird-wing-clipping-guide.ui.notesAmazon") },
    "african-grey": { feathers: t("bird-wing-clipping-guide.ui.feathersAfricanGrey"), symmetry: t("bird-wing-clipping-guide.ui.symmetryAfricanGrey"), notes: t("bird-wing-clipping-guide.ui.notesAfricanGrey") },
    "macaw": { feathers: t("bird-wing-clipping-guide.ui.feathersMacaw"), symmetry: t("bird-wing-clipping-guide.ui.symmetryMacaw"), notes: t("bird-wing-clipping-guide.ui.notesMacaw") },
  } as const;
  const s = style[species];

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("bird-wing-clipping-guide.ui.speciesLabel")}</Label>
        <Select value={species} onValueChange={(v) => setSpecies(v as typeof species)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {[["budgie", t("bird-wing-clipping-guide.ui.speciesBudgie")], ["cockatiel", t("bird-wing-clipping-guide.ui.speciesCockatiel")], ["conure", t("bird-wing-clipping-guide.ui.speciesConure")], ["amazon", t("bird-wing-clipping-guide.ui.speciesAmazon")], ["african-grey", t("bird-wing-clipping-guide.ui.speciesAfricanGrey")], ["macaw", t("bird-wing-clipping-guide.ui.speciesMacaw")]].map(([v, label]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{t("bird-wing-clipping-guide.ui.purposeLabel")}</Label>
        <Select value={purpose} onValueChange={(v) => setPurpose(v as typeof purpose)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="safety">{t("bird-wing-clipping-guide.ui.purposeSafety")}</SelectItem>
            <SelectItem value="training">{t("bird-wing-clipping-guide.ui.purposeTraining")}</SelectItem>
            <SelectItem value="none">{t("bird-wing-clipping-guide.ui.purposeNone")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">{t("bird-wing-clipping-guide.ui.clipTitle")}</div>
      <div className="rounded-lg bg-background/60 p-3 text-sm space-y-2">
        <div><strong>{t("bird-wing-clipping-guide.ui.feathersLabel")}</strong> {s.feathers}</div>
        <div><strong>{t("bird-wing-clipping-guide.ui.symmetryLabel")}</strong> {s.symmetry}</div>
        <div className="text-muted-foreground">{s.notes}</div>
      </div>
      {purpose === "none" && <Pill tone="safe">{t("bird-wing-clipping-guide.ui.flightedNote")}</Pill>}
      <div className="rounded-lg border p-3 text-xs text-muted-foreground space-y-1">
        <p>{t("bird-wing-clipping-guide.ui.warnBlood")}</p>
        <p>{t("bird-wing-clipping-guide.ui.warnOneWing")}</p>
        <p>{t("bird-wing-clipping-guide.ui.warnFledgling")}</p>
        <p>{t("bird-wing-clipping-guide.ui.warnPro")}</p>
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 4. FERRET LITTER TRAINER ═══════════════ */
export function FerretLitterTrainer() {
  const { t } = useTranslation("tools");
  const steps = [
    t("ferret-litter-trainer.ui.step1"),
    t("ferret-litter-trainer.ui.step2"),
    t("ferret-litter-trainer.ui.step3"),
    t("ferret-litter-trainer.ui.step4"),
    t("ferret-litter-trainer.ui.step5"),
    t("ferret-litter-trainer.ui.step6"),
    t("ferret-litter-trainer.ui.step7"),
    t("ferret-litter-trainer.ui.step8"),
    t("ferret-litter-trainer.ui.step9"),
    t("ferret-litter-trainer.ui.step10"),
  ];
  const [done, setDone] = useLocal<string[]>("furtools:ferret-litter", []);
  const [accidents, setAccidents] = useLocal<{ date: string; note: string }[]>("furtools:ferret-accidents", []);
  const [note, setNote] = useState("");
  const toggle = (s: string) => setDone((d) => d.includes(s) ? d.filter(x => x !== s) : [...d, s]);
  const pct = Math.round((done.length / steps.length) * 100);

  const form = (
    <div className="space-y-3">
      <div>
        <div className="text-xs mb-2 text-muted-foreground">{t("ferret-litter-trainer.ui.progress", { pct })}</div>
        <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
      </div>
      <ol className="space-y-2 text-sm">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-2 items-start">
            <Checkbox checked={done.includes(s)} onCheckedChange={() => toggle(s)} />
            <span className={done.includes(s) ? "line-through text-muted-foreground" : ""}><strong>{t("ferret-litter-trainer.ui.stepLabel", { n: i + 1 })}</strong> {s}</span>
          </li>
        ))}
      </ol>
      <div className="rounded-lg border p-3 space-y-2">
        <Label>{t("ferret-litter-trainer.ui.logLabel")}</Label>
        <Input placeholder={t("ferret-litter-trainer.ui.logPlaceholder")} value={note} onChange={(e) => setNote(e.target.value)} />
        <Button size="sm" onClick={() => { if (note.trim()) { setAccidents((a) => [...a, { date: new Date().toISOString().slice(0,10), note: note.trim() }]); setNote(""); } }}>{t("ferret-litter-trainer.ui.logButton")}</Button>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">{t("ferret-litter-trainer.ui.recentTitle")}</div>
      {accidents.length === 0 ? <p className="text-sm text-muted-foreground">{t("ferret-litter-trainer.ui.emptyState")}</p> : (
        <ul className="text-sm space-y-1">
          {accidents.slice(-8).reverse().map((a, i) => <li key={i}><span className="text-muted-foreground">{a.date}</span> — {a.note}</li>)}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">{t("ferret-litter-trainer.ui.tipNote")}</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 5. TURTLE BASKING TIME CALCULATOR ═══════════════ */
export function TurtleBaskingTime() {
  const { t } = useTranslation("tools");
  const turtle: Record<string, { basking: number; uvi: string; waterTemp: [number, number]; note: string }> = {
    "red-eared-slider": { basking: 12, uvi: "3.0-6.0", waterTemp: [75, 82], note: t("turtle-basking-time-calculator.ui.noteRedEaredSlider") },
    "yellow-bellied-slider": { basking: 12, uvi: "3.0-6.0", waterTemp: [75, 82], note: t("turtle-basking-time-calculator.ui.noteYellowBelliedSlider") },
    "painted-turtle": { basking: 12, uvi: "3.0-5.0", waterTemp: [70, 78], note: t("turtle-basking-time-calculator.ui.notePaintedTurtle") },
    "musk-turtle": { basking: 6, uvi: "1.0-3.0", waterTemp: [72, 78], note: t("turtle-basking-time-calculator.ui.noteMuskTurtle") },
    "map-turtle": { basking: 12, uvi: "3.0-6.0", waterTemp: [72, 80], note: t("turtle-basking-time-calculator.ui.noteMapTurtle") },
    "russian-tortoise": { basking: 12, uvi: "4.0-7.0", waterTemp: [0, 0], note: t("turtle-basking-time-calculator.ui.noteRussianTortoise") },
    "sulcata": { basking: 12, uvi: "5.0-8.0", waterTemp: [0, 0], note: t("turtle-basking-time-calculator.ui.noteSulcata") },
    "greek-tortoise": { basking: 12, uvi: "4.0-7.0", waterTemp: [0, 0], note: t("turtle-basking-time-calculator.ui.noteGreekTortoise") },
  };
  const speciesLabels: Record<string, string> = {
    "red-eared-slider": t("turtle-basking-time-calculator.ui.speciesRedEaredSlider"),
    "yellow-bellied-slider": t("turtle-basking-time-calculator.ui.speciesYellowBelliedSlider"),
    "painted-turtle": t("turtle-basking-time-calculator.ui.speciesPaintedTurtle"),
    "musk-turtle": t("turtle-basking-time-calculator.ui.speciesMuskTurtle"),
    "map-turtle": t("turtle-basking-time-calculator.ui.speciesMapTurtle"),
    "russian-tortoise": t("turtle-basking-time-calculator.ui.speciesRussianTortoise"),
    "sulcata": t("turtle-basking-time-calculator.ui.speciesSulcata"),
    "greek-tortoise": t("turtle-basking-time-calculator.ui.speciesGreekTortoise"),
  };
  const [species, setSpecies] = useState("red-eared-slider");
  const spec = turtle[species];

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("turtle-basking-time-calculator.ui.speciesLabel")}</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(turtle).map((k) => <SelectItem key={k} value={k}>{speciesLabels[k]}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">{t("turtle-basking-time-calculator.ui.baskingTitle")}</div>
      <div className="font-display text-4xl font-semibold">{t("turtle-basking-time-calculator.ui.hoursValue", { hours: spec.basking })}</div>
      <div className="rounded-lg bg-background/60 p-3 text-sm space-y-1">
        <div><strong>{t("turtle-basking-time-calculator.ui.uviLabel")}</strong> {spec.uvi}</div>
        <div><strong>{t("turtle-basking-time-calculator.ui.surfaceLabel")}</strong> {t("turtle-basking-time-calculator.ui.surfaceValue")}</div>
        {spec.waterTemp[1] > 0 && <div><strong>{t("turtle-basking-time-calculator.ui.waterLabel")}</strong> {t("turtle-basking-time-calculator.ui.waterValue", { lo: spec.waterTemp[0], hi: spec.waterTemp[1] })}</div>}
        <div className="text-muted-foreground">{spec.note}</div>
      </div>
      <p className="text-xs text-muted-foreground">{t("turtle-basking-time-calculator.ui.neverBaskNote")}</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 6. GOAT HOOF TRIM REMINDER ═══════════════ */
export function GoatHoofTrimReminder() {
  const { t } = useTranslation("tools");
  const [goats, setGoats] = useLocal<{ id: string; name: string; lastTrim: string; interval: number }[]>("furtools:goat-hoof", []);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [interval, setInterval] = useState(8);

  const add = () => {
    if (!name || !date) return;
    setGoats((g) => [...g, { id: crypto.randomUUID(), name, lastTrim: date, interval }]);
    setName(""); setDate("");
  };
  const remove = (id: string) => setGoats((g) => g.filter(x => x.id !== id));

  const rows = goats.map(g => {
    const next = new Date(g.lastTrim);
    next.setDate(next.getDate() + g.interval * 7);
    const days = Math.round((next.getTime() - Date.now()) / 86400000);
    return { ...g, nextDate: next.toISOString().slice(0, 10), days };
  });

  const form = (
    <div className="space-y-3">
      <div><Label>{t("goat-hoof-trim-reminder.ui.nameLabel")}</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("goat-hoof-trim-reminder.ui.namePlaceholder")} /></div>
      <div><Label>{t("goat-hoof-trim-reminder.ui.dateLabel")}</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div>
        <Label>{t("goat-hoof-trim-reminder.ui.intervalLabel", { weeks: interval })}</Label>
        <Slider value={[interval]} min={4} max={12} step={1} onValueChange={(v) => setInterval(v[0])} />
        <p className="text-xs text-muted-foreground mt-1">{t("goat-hoof-trim-reminder.ui.intervalHint")}</p>
      </div>
      <Button onClick={add} className="w-full">{t("goat-hoof-trim-reminder.ui.addButton")}</Button>
    </div>
  );
  const result = (
    <div className="space-y-2">
      <div className="text-xs uppercase text-muted-foreground">{t("goat-hoof-trim-reminder.ui.herdTitle")}</div>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">{t("goat-hoof-trim-reminder.ui.emptyState")}</p> : (
        <ul className="space-y-2 text-sm">
          {rows.map(r => (
            <li key={r.id} className="flex items-center justify-between rounded-lg bg-background/60 p-3">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground">{t("goat-hoof-trim-reminder.ui.nextLabel", { date: r.nextDate })}</div>
              </div>
              <div className="flex items-center gap-2">
                <Pill tone={r.days < 0 ? "danger" : r.days < 7 ? "caution" : "safe"}>{r.days < 0 ? t("goat-hoof-trim-reminder.ui.overdue", { days: -r.days }) : t("goat-hoof-trim-reminder.ui.daysLeft", { days: r.days })}</Pill>
                <Button size="sm" variant="ghost" onClick={() => remove(r.id)}>×</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted-foreground mt-2">{t("goat-hoof-trim-reminder.ui.trimTip")}</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 7. HORSE FARRIER SCHEDULE ═══════════════ */
export function HorseFarrierSchedule() {
  const { t } = useTranslation("tools");
  const [horses, setHorses] = useLocal<{ id: string; name: string; last: string; interval: number; shod: boolean }[]>("furtools:horse-farrier", []);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [interval, setInterval] = useState(6);
  const [shod, setShod] = useState(true);

  const add = () => {
    if (!name || !date) return;
    setHorses((h) => [...h, { id: crypto.randomUUID(), name, last: date, interval, shod }]);
    setName(""); setDate("");
  };
  const remove = (id: string) => setHorses((h) => h.filter(x => x.id !== id));

  const rows = horses.map(h => {
    const next = new Date(h.last);
    next.setDate(next.getDate() + h.interval * 7);
    const days = Math.round((next.getTime() - Date.now()) / 86400000);
    return { ...h, nextDate: next.toISOString().slice(0, 10), days };
  });

  const form = (
    <div className="space-y-3">
      <div><Label>{t("horse-farrier-schedule.ui.nameLabel")}</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("horse-farrier-schedule.ui.namePlaceholder")} /></div>
      <div><Label>{t("horse-farrier-schedule.ui.dateLabel")}</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div>
        <Label>{t("horse-farrier-schedule.ui.intervalLabel", { weeks: interval })}</Label>
        <Slider value={[interval]} min={4} max={10} step={1} onValueChange={(v) => setInterval(v[0])} />
        <p className="text-xs text-muted-foreground mt-1">{t("horse-farrier-schedule.ui.intervalHint")}</p>
      </div>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={shod} onCheckedChange={(v) => setShod(!!v)} /> {t("horse-farrier-schedule.ui.shodLabel")}</label>
      <Button onClick={add} className="w-full">{t("horse-farrier-schedule.ui.addButton")}</Button>
    </div>
  );
  const result = (
    <div className="space-y-2">
      <div className="text-xs uppercase text-muted-foreground">{t("horse-farrier-schedule.ui.rotationTitle")}</div>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">{t("horse-farrier-schedule.ui.emptyState")}</p> : (
        <ul className="space-y-2 text-sm">
          {rows.map(r => (
            <li key={r.id} className="flex items-center justify-between rounded-lg bg-background/60 p-3">
              <div>
                <div className="font-medium">{r.name} <span className="text-xs text-muted-foreground">· {r.shod ? t("horse-farrier-schedule.ui.shodTrue") : t("horse-farrier-schedule.ui.shodFalse")}</span></div>
                <div className="text-xs text-muted-foreground">{t("horse-farrier-schedule.ui.nextLabel", { date: r.nextDate })}</div>
              </div>
              <div className="flex items-center gap-2">
                <Pill tone={r.days < 0 ? "danger" : r.days < 7 ? "caution" : "safe"}>{r.days < 0 ? t("horse-farrier-schedule.ui.overdue", { days: -r.days }) : t("horse-farrier-schedule.ui.daysLeft", { days: r.days })}</Pill>
                <Button size="sm" variant="ghost" onClick={() => remove(r.id)}>×</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted-foreground mt-2">{t("horse-farrier-schedule.ui.cycleTip")}</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 8. VIVARIUM HUMIDITY CALCULATOR ═══════════════ */
export function VivariumHumidityCalculator() {
  const { t } = useTranslation("tools");
  const humidity: Record<string, { range: [number, number]; misting: string; substrate: string; note: string }> = {
    "bearded-dragon": { range: [30, 40], misting: t("vivarium-humidity-calculator.ui.mistingBeardedDragon"), substrate: t("vivarium-humidity-calculator.ui.substrateBeardedDragon"), note: t("vivarium-humidity-calculator.ui.noteBeardedDragon") },
    "leopard-gecko": { range: [30, 40], misting: t("vivarium-humidity-calculator.ui.mistingLeopardGecko"), substrate: t("vivarium-humidity-calculator.ui.substrateLeopardGecko"), note: t("vivarium-humidity-calculator.ui.noteLeopardGecko") },
    "crested-gecko": { range: [60, 80], misting: t("vivarium-humidity-calculator.ui.mistingCrestedGecko"), substrate: t("vivarium-humidity-calculator.ui.substrateCrestedGecko"), note: t("vivarium-humidity-calculator.ui.noteCrestedGecko") },
    "ball-python": { range: [55, 65], misting: t("vivarium-humidity-calculator.ui.mistingBallPython"), substrate: t("vivarium-humidity-calculator.ui.substrateBallPython"), note: t("vivarium-humidity-calculator.ui.noteBallPython") },
    "corn-snake": { range: [40, 60], misting: t("vivarium-humidity-calculator.ui.mistingCornSnake"), substrate: t("vivarium-humidity-calculator.ui.substrateCornSnake"), note: t("vivarium-humidity-calculator.ui.noteCornSnake") },
    "chameleon": { range: [50, 70], misting: t("vivarium-humidity-calculator.ui.mistingChameleon"), substrate: t("vivarium-humidity-calculator.ui.substrateChameleon"), note: t("vivarium-humidity-calculator.ui.noteChameleon") },
    "day-gecko": { range: [60, 80], misting: t("vivarium-humidity-calculator.ui.mistingDayGecko"), substrate: t("vivarium-humidity-calculator.ui.substrateDayGecko"), note: t("vivarium-humidity-calculator.ui.noteDayGecko") },
    "dart-frog": { range: [80, 100], misting: t("vivarium-humidity-calculator.ui.mistingDartFrog"), substrate: t("vivarium-humidity-calculator.ui.substrateDartFrog"), note: t("vivarium-humidity-calculator.ui.noteDartFrog") },
    "russian-tortoise": { range: [30, 50], misting: t("vivarium-humidity-calculator.ui.mistingRussianTortoise"), substrate: t("vivarium-humidity-calculator.ui.substrateRussianTortoise"), note: t("vivarium-humidity-calculator.ui.noteRussianTortoise") },
    "red-eared-slider": { range: [50, 70], misting: t("vivarium-humidity-calculator.ui.mistingRedEaredSlider"), substrate: t("vivarium-humidity-calculator.ui.substrateRedEaredSlider"), note: t("vivarium-humidity-calculator.ui.noteRedEaredSlider") },
  };
  const speciesLabels: Record<string, string> = {
    "bearded-dragon": t("vivarium-humidity-calculator.ui.speciesBeardedDragon"),
    "leopard-gecko": t("vivarium-humidity-calculator.ui.speciesLeopardGecko"),
    "crested-gecko": t("vivarium-humidity-calculator.ui.speciesCrestedGecko"),
    "ball-python": t("vivarium-humidity-calculator.ui.speciesBallPython"),
    "corn-snake": t("vivarium-humidity-calculator.ui.speciesCornSnake"),
    "chameleon": t("vivarium-humidity-calculator.ui.speciesChameleon"),
    "day-gecko": t("vivarium-humidity-calculator.ui.speciesDayGecko"),
    "dart-frog": t("vivarium-humidity-calculator.ui.speciesDartFrog"),
    "russian-tortoise": t("vivarium-humidity-calculator.ui.speciesRussianTortoise"),
    "red-eared-slider": t("vivarium-humidity-calculator.ui.speciesRedEaredSlider"),
  };
  const [species, setSpecies] = useState("crested-gecko");
  const [current, setCurrent] = useState(60);
  const h = humidity[species];
  const state = current < h.range[0] - 5 ? "too-dry" : current > h.range[1] + 5 ? "too-wet" : current < h.range[0] || current > h.range[1] ? "close" : "ok";

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("vivarium-humidity-calculator.ui.speciesLabel")}</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(humidity).map((k) => <SelectItem key={k} value={k}>{speciesLabels[k]}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div><Label>{t("vivarium-humidity-calculator.ui.humidityLabel", { value: current })}</Label><Slider value={[current]} min={10} max={100} step={1} onValueChange={(v) => setCurrent(v[0])} /></div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">{t("vivarium-humidity-calculator.ui.targetTitle")}</div>
      <div className="font-display text-4xl font-semibold">{t("vivarium-humidity-calculator.ui.rangeValue", { lo: h.range[0], hi: h.range[1] })}</div>
      {state === "ok" && <Pill tone="safe">{t("vivarium-humidity-calculator.ui.pillOk")}</Pill>}
      {state === "close" && <Pill tone="caution">{t("vivarium-humidity-calculator.ui.pillClose")}</Pill>}
      {state === "too-dry" && <Pill tone="danger">{t("vivarium-humidity-calculator.ui.pillDry")}</Pill>}
      {state === "too-wet" && <Pill tone="danger">{t("vivarium-humidity-calculator.ui.pillWet")}</Pill>}
      <div className="rounded-lg bg-background/60 p-3 text-sm space-y-1">
        <div><strong>{t("vivarium-humidity-calculator.ui.mistingLabel")}</strong> {h.misting}</div>
        <div><strong>{t("vivarium-humidity-calculator.ui.substrateLabel")}</strong> {h.substrate}</div>
        <div className="text-muted-foreground">{h.note}</div>
      </div>
      <p className="text-xs text-muted-foreground">{t("vivarium-humidity-calculator.ui.hygrometerNote")}</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}
