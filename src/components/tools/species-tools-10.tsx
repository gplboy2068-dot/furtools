import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";

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
const UVB_SPECIES: Record<string, { hours: number; uvi: string; note: string }> = {
  "bearded-dragon": { hours: 12, uvi: "4.0-6.0", note: "Desert species — high UVB demand. Use T5-HO 10-12% linear bulb across ⅔ of the enclosure length." },
  "leopard-gecko": { hours: 10, uvi: "0.5-1.5", note: "Crepuscular; low UVB (2-5% T5 or shade-dweller bulb) still improves bone health and behaviour." },
  "crested-gecko": { hours: 10, uvi: "0.5-1.5", note: "Shade-dweller — 2-5% T5 or Arcadia ShadeDweller 5.5%." },
  "ball-python": { hours: 10, uvi: "0.5-1.0", note: "Nocturnal — Arcadia ShadeDweller or 5% T5 improves circadian rhythm and vitamin D." },
  "corn-snake": { hours: 12, uvi: "1.0-2.0", note: "Diurnal in the wild. 5-7% T5 helps immune function and colour." },
  "russian-tortoise": { hours: 12, uvi: "4.0-7.0", note: "Grassland species — needs strong UVB. 10-12% T5-HO." },
  "sulcata": { hours: 12, uvi: "5.0-8.0", note: "Arid grazer — 12% T5-HO or outdoor sunlight is ideal." },
  "red-eared-slider": { hours: 12, uvi: "3.0-6.0", note: "Aquatic. Mount UVB above the basking dock, not through glass." },
  "chameleon": { hours: 12, uvi: "3.0-6.0", note: "Panther/Veiled — 6% T5-HO across the screen top; monitor with Solarmeter 6.5." },
  "blue-tongue-skink": { hours: 12, uvi: "3.0-5.0", note: "Diurnal omnivore — 6% T5 across ½ enclosure." },
};

export function ReptileUvbSchedule() {
  const [species, setSpecies] = useState("bearded-dragon");
  const [installDate, setInstallDate] = useLocal<string>("furtools:uvb:install", "");
  const [bulbType, setBulbType] = useState<"t5-ho" | "t8" | "compact" | "mercury">("t5-ho");

  const info = UVB_SPECIES[species];
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
        <Label>Species</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(UVB_SPECIES).map((k) => <SelectItem key={k} value={k}>{k.replace(/-/g, " ")}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div>
        <Label>Bulb type</Label>
        <Select value={bulbType} onValueChange={(v) => setBulbType(v as typeof bulbType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="t5-ho">T5-HO linear (best)</SelectItem>
            <SelectItem value="t8">T8 linear</SelectItem>
            <SelectItem value="compact">Compact / coil</SelectItem>
            <SelectItem value="mercury">Mercury vapour</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Bulb install date</Label>
        <Input type="date" value={installDate} onChange={(e) => setInstallDate(e.target.value)} />
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">Daily UVB on-time</div>
      <div className="font-display text-4xl font-semibold">{info.hours} hours</div>
      <p className="text-sm">Target UVI at basking spot: <strong>{info.uvi}</strong></p>
      <p className="text-sm text-muted-foreground">{info.note}</p>
      <div className="mt-4 rounded-lg bg-background/60 p-3 text-sm space-y-1">
        <div><strong>Recommended bulb life:</strong> {life} months</div>
        {replaceAt && <div><strong>Replace on:</strong> {replaceAt} {daysLeft !== null && <span className="text-muted-foreground">({daysLeft} days)</span>}</div>}
        {daysLeft !== null && daysLeft < 30 && <Pill tone={daysLeft < 0 ? "danger" : "caution"}>{daysLeft < 0 ? "Overdue — replace now" : "Replace soon"}</Pill>}
      </div>
      <p className="text-xs text-muted-foreground">Even when a UVB bulb still glows visibly, its UVB output drops sharply after the rated life — reptiles then develop metabolic bone disease silently.</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 2. TANK TEMPERATURE GRADIENT CALCULATOR ═══════════════ */
const TEMP_SPECIES: Record<string, { basking: [number, number]; warm: [number, number]; cool: [number, number]; night: [number, number]; note: string }> = {
  "bearded-dragon": { basking: [100, 110], warm: [85, 90], cool: [75, 80], night: [65, 75], note: "Never use heat rocks — surface burns are common." },
  "leopard-gecko": { basking: [90, 95], warm: [82, 88], cool: [72, 78], night: [68, 74], note: "Belly heat is critical — use a DHP or under-tank heater on a thermostat." },
  "crested-gecko": { basking: [78, 82], warm: [72, 78], cool: [68, 72], night: [65, 72], note: "Sensitive to heat — above 85°F is dangerous." },
  "ball-python": { basking: [88, 92], warm: [82, 86], cool: [75, 80], night: [72, 78], note: "Provide two identical hides on each side of the gradient." },
  "corn-snake": { basking: [85, 90], warm: [80, 85], cool: [72, 78], night: [65, 75], note: "Cool side can safely drop into the 60s at night." },
  "russian-tortoise": { basking: [95, 100], warm: [80, 85], cool: [68, 75], night: [55, 65], note: "Requires a strong day/night temperature drop." },
  "red-eared-slider": { basking: [90, 95], warm: [78, 82], cool: [75, 78], night: [70, 75], note: "Water 75-80°F; measure basking dock surface temp, not air." },
  "chameleon": { basking: [85, 90], warm: [72, 80], cool: [68, 72], night: [60, 68], note: "Nighttime drop is essential — never heat the enclosure at night unless below 55°F." },
};

export function TankTemperatureGradient() {
  const [species, setSpecies] = useState("bearded-dragon");
  const [current, setCurrent] = useState({ basking: 100, warm: 85, cool: 75 });
  const t = TEMP_SPECIES[species];

  const status = (val: number, [lo, hi]: [number, number]) =>
    val < lo - 3 ? "too-cold" : val > hi + 3 ? "too-hot" : val < lo || val > hi ? "close" : "ok";
  const chip = (s: string) => s === "ok" ? <Pill tone="safe">In range</Pill>
    : s === "close" ? <Pill tone="caution">Slightly off</Pill>
    : <Pill tone="danger">{s === "too-hot" ? "Too hot" : "Too cold"}</Pill>;

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Species</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(TEMP_SPECIES).map((k) => <SelectItem key={k} value={k}>{k.replace(/-/g, " ")}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div><Label>Your basking spot: {current.basking}°F</Label><Slider value={[current.basking]} min={60} max={130} step={1} onValueChange={(v) => setCurrent({ ...current, basking: v[0] })} /></div>
      <div><Label>Your warm side: {current.warm}°F</Label><Slider value={[current.warm]} min={60} max={110} step={1} onValueChange={(v) => setCurrent({ ...current, warm: v[0] })} /></div>
      <div><Label>Your cool side: {current.cool}°F</Label><Slider value={[current.cool]} min={50} max={95} step={1} onValueChange={(v) => setCurrent({ ...current, cool: v[0] })} /></div>
    </div>
  );
  const rows: Array<[string, [number, number], number | null]> = [
    ["Basking", t.basking, current.basking],
    ["Warm side", t.warm, current.warm],
    ["Cool side", t.cool, current.cool],
    ["Nighttime", t.night, null],
  ];
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">Target gradient</div>
      <div className="space-y-2 text-sm">
        {rows.map(([zone, [lo, hi], val]) => (
          <div key={zone} className="flex items-center justify-between rounded-lg bg-background/60 p-3">
            <div>
              <div className="font-medium">{zone}</div>
              <div className="text-xs text-muted-foreground">{lo}-{hi}°F</div>
            </div>
            {val !== null ? <div className="flex items-center gap-2"><span className="font-semibold">{val}°F</span>{chip(status(val, [lo, hi]))}</div> : <span className="text-xs text-muted-foreground">Passive</span>}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">{t.note} Measure with an infrared temp gun at the actual surface — stick-on gauges lie.</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 3. BIRD WING CLIPPING GUIDE (v2) ═══════════════ */
export function BirdWingClippingGuide() {
  const [species, setSpecies] = useState<"budgie" | "cockatiel" | "conure" | "amazon" | "african-grey" | "macaw">("cockatiel");
  const [purpose, setPurpose] = useState<"safety" | "training" | "none">("safety");
  const style: Record<typeof species, { feathers: string; symmetry: string; notes: string }> = {
    "budgie": { feathers: "First 4-5 primaries, both wings", symmetry: "Always both wings equally", notes: "Very light — a small over-clip can prevent all glide." },
    "cockatiel": { feathers: "First 4-6 primaries, both wings", symmetry: "Always both wings", notes: "Leave a small gliding capability so a startled bird can descend safely instead of crashing." },
    "conure": { feathers: "First 5-7 primaries, both wings", symmetry: "Always both", notes: "Muscular fliers — under-clipping still leaves powerful lift." },
    "amazon": { feathers: "First 6-8 primaries, both wings", symmetry: "Always both", notes: "Heavy body — avoid over-clip that causes hard falls." },
    "african-grey": { feathers: "First 5-7 primaries, both wings", symmetry: "Always both", notes: "Prone to keel-bone injury from hard landings — leave glide capability." },
    "macaw": { feathers: "First 6-8 primaries, both wings", symmetry: "Always both", notes: "Very heavy — many experts recommend leaving flighted with a harness instead of clipping." },
  } as const;
  const s = style[species];

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Species</Label>
        <Select value={species} onValueChange={(v) => setSpecies(v as typeof species)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {(["budgie","cockatiel","conure","amazon","african-grey","macaw"] as const).map(k => <SelectItem key={k} value={k}>{k.replace(/-/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Reason for clipping</Label>
        <Select value={purpose} onValueChange={(v) => setPurpose(v as typeof purpose)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="safety">Household safety (ceiling fans, open doors)</SelectItem>
            <SelectItem value="training">Early taming / stepping up</SelectItem>
            <SelectItem value="none">Considering leaving flighted</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">Recommended clip</div>
      <div className="rounded-lg bg-background/60 p-3 text-sm space-y-2">
        <div><strong>Feathers:</strong> {s.feathers}</div>
        <div><strong>Symmetry:</strong> {s.symmetry}</div>
        <div className="text-muted-foreground">{s.notes}</div>
      </div>
      {purpose === "none" && <Pill tone="safe">Flighted is healthiest when the room is truly bird-proofed.</Pill>}
      <div className="rounded-lg border p-3 text-xs text-muted-foreground space-y-1">
        <p><strong>Never clip:</strong> blood feathers (dark shafts), secondaries, coverts, or tail feathers.</p>
        <p><strong>Never clip only one wing</strong> — birds spin, crash and injure the keel.</p>
        <p><strong>Never clip fledglings</strong> — they must learn to fly for lifelong coordination.</p>
        <p><strong>Get professional help</strong> the first time. Wing clipping is educational information only, not a substitute for an avian vet or experienced groomer.</p>
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 4. FERRET LITTER TRAINER ═══════════════ */
const FERRET_STEPS = [
  "Place a low corner litter box in each room your ferret plays in — ferrets rarely walk more than 2 metres to relieve themselves.",
  "Use dust-free paper pellets or recycled newspaper pellets. Never clumping clay or pine/cedar shavings.",
  "Confine to a small area (a cage or exercise pen) for the first 1-2 weeks to build the habit.",
  "Every time your ferret starts backing into a corner, gently place them in the litter box.",
  "Reward successful use immediately with a lickable meat treat (bacon fat, salmon oil, high-protein paste).",
  "Clean accidents with an enzymatic cleaner (never ammonia — it smells like urine).",
  "Slowly expand freedom room-by-room only after a full week of no accidents.",
  "Add a second litter box in every new room you unlock.",
  "Scoop 1-2 times daily; ferrets refuse dirty boxes and will pick a corner instead.",
  "Expect 60-80% reliability — even trained ferrets occasionally miss. This is normal.",
];

export function FerretLitterTrainer() {
  const [done, setDone] = useLocal<string[]>("furtools:ferret-litter", []);
  const [accidents, setAccidents] = useLocal<{ date: string; note: string }[]>("furtools:ferret-accidents", []);
  const [note, setNote] = useState("");
  const toggle = (s: string) => setDone((d) => d.includes(s) ? d.filter(x => x !== s) : [...d, s]);
  const pct = Math.round((done.length / FERRET_STEPS.length) * 100);

  const form = (
    <div className="space-y-3">
      <div>
        <div className="text-xs mb-2 text-muted-foreground">Progress: {pct}%</div>
        <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
      </div>
      <ol className="space-y-2 text-sm">
        {FERRET_STEPS.map((s, i) => (
          <li key={s} className="flex gap-2 items-start">
            <Checkbox checked={done.includes(s)} onCheckedChange={() => toggle(s)} />
            <span className={done.includes(s) ? "line-through text-muted-foreground" : ""}><strong>Step {i + 1}.</strong> {s}</span>
          </li>
        ))}
      </ol>
      <div className="rounded-lg border p-3 space-y-2">
        <Label>Log an accident</Label>
        <Input placeholder="e.g. behind couch after wake-up" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button size="sm" onClick={() => { if (note.trim()) { setAccidents((a) => [...a, { date: new Date().toISOString().slice(0,10), note: note.trim() }]); setNote(""); } }}>Log</Button>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">Recent accidents</div>
      {accidents.length === 0 ? <p className="text-sm text-muted-foreground">None logged yet — nice work.</p> : (
        <ul className="text-sm space-y-1">
          {accidents.slice(-8).reverse().map((a, i) => <li key={i}><span className="text-muted-foreground">{a.date}</span> — {a.note}</li>)}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">If accidents cluster in one spot, place a litter box there. Ferrets rarely un-learn a preferred corner.</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 5. TURTLE BASKING TIME CALCULATOR ═══════════════ */
const TURTLE: Record<string, { basking: number; uvi: string; waterTemp: [number, number]; note: string }> = {
  "red-eared-slider": { basking: 12, uvi: "3.0-6.0", waterTemp: [75, 82], note: "Fully aquatic — needs a large dry dock reachable in one motion." },
  "yellow-bellied-slider": { basking: 12, uvi: "3.0-6.0", waterTemp: [75, 82], note: "Nearly identical care to red-eared." },
  "painted-turtle": { basking: 12, uvi: "3.0-5.0", waterTemp: [70, 78], note: "Cooler water tolerated; still needs strong UVB." },
  "musk-turtle": { basking: 6, uvi: "1.0-3.0", waterTemp: [72, 78], note: "Rarely basks — provide a low platform they'll actually use." },
  "map-turtle": { basking: 12, uvi: "3.0-6.0", waterTemp: [72, 80], note: "Skittish — bask most when tank is in a low-traffic area." },
  "russian-tortoise": { basking: 12, uvi: "4.0-7.0", waterTemp: [0, 0], note: "Land tortoise — soak weekly in shallow warm water." },
  "sulcata": { basking: 12, uvi: "5.0-8.0", waterTemp: [0, 0], note: "Outdoor sunshine is best when weather allows." },
  "greek-tortoise": { basking: 12, uvi: "4.0-7.0", waterTemp: [0, 0], note: "Mediterranean species — Similar to Russian." },
};

export function TurtleBaskingTime() {
  const [species, setSpecies] = useState("red-eared-slider");
  const t = TURTLE[species];

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Species</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(TURTLE).map((k) => <SelectItem key={k} value={k}>{k.replace(/-/g, " ")}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">Daily basking light on</div>
      <div className="font-display text-4xl font-semibold">{t.basking} hours</div>
      <div className="rounded-lg bg-background/60 p-3 text-sm space-y-1">
        <div><strong>UVI at basking spot:</strong> {t.uvi}</div>
        <div><strong>Basking surface temp:</strong> 90-95°F</div>
        {t.waterTemp[1] > 0 && <div><strong>Water temp:</strong> {t.waterTemp[0]}-{t.waterTemp[1]}°F</div>}
        <div className="text-muted-foreground">{t.note}</div>
      </div>
      <p className="text-xs text-muted-foreground">A turtle that never basks is nearly always cold, sick or scared. Verify the dock is dry, easy to climb, and under real UVB — not filtered through glass or plastic.</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 6. GOAT HOOF TRIM REMINDER ═══════════════ */
export function GoatHoofTrimReminder() {
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
      <div><Label>Goat name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Daisy" /></div>
      <div><Label>Last trim date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div>
        <Label>Interval: {interval} weeks</Label>
        <Slider value={[interval]} min={4} max={12} step={1} onValueChange={(v) => setInterval(v[0])} />
        <p className="text-xs text-muted-foreground mt-1">Most goats: 6-8 weeks. Rocky terrain wears hooves and extends interval; damp bedding shortens it.</p>
      </div>
      <Button onClick={add} className="w-full">Add goat</Button>
    </div>
  );
  const result = (
    <div className="space-y-2">
      <div className="text-xs uppercase text-muted-foreground">Herd schedule</div>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">Add goats to see next trim dates.</p> : (
        <ul className="space-y-2 text-sm">
          {rows.map(r => (
            <li key={r.id} className="flex items-center justify-between rounded-lg bg-background/60 p-3">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground">Next: {r.nextDate}</div>
              </div>
              <div className="flex items-center gap-2">
                <Pill tone={r.days < 0 ? "danger" : r.days < 7 ? "caution" : "safe"}>{r.days < 0 ? `${-r.days}d overdue` : `${r.days}d`}</Pill>
                <Button size="sm" variant="ghost" onClick={() => remove(r.id)}>×</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted-foreground mt-2">Trim in bright natural light. Cut only the soft, curled outer wall until the sole is flat and level with the toe.</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 7. HORSE FARRIER SCHEDULE ═══════════════ */
export function HorseFarrierSchedule() {
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
      <div><Label>Horse name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rocket" /></div>
      <div><Label>Last farrier visit</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div>
        <Label>Interval: {interval} weeks</Label>
        <Slider value={[interval]} min={4} max={10} step={1} onValueChange={(v) => setInterval(v[0])} />
        <p className="text-xs text-muted-foreground mt-1">Shod horses: typically 6 weeks. Barefoot: 6-8. Faster-growing hooves (spring/summer) shorten cycle.</p>
      </div>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={shod} onCheckedChange={(v) => setShod(!!v)} /> Currently shod</label>
      <Button onClick={add} className="w-full">Add horse</Button>
    </div>
  );
  const result = (
    <div className="space-y-2">
      <div className="text-xs uppercase text-muted-foreground">Farrier rotation</div>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground">Add horses to build the schedule.</p> : (
        <ul className="space-y-2 text-sm">
          {rows.map(r => (
            <li key={r.id} className="flex items-center justify-between rounded-lg bg-background/60 p-3">
              <div>
                <div className="font-medium">{r.name} <span className="text-xs text-muted-foreground">· {r.shod ? "shod" : "barefoot"}</span></div>
                <div className="text-xs text-muted-foreground">Next: {r.nextDate}</div>
              </div>
              <div className="flex items-center gap-2">
                <Pill tone={r.days < 0 ? "danger" : r.days < 7 ? "caution" : "safe"}>{r.days < 0 ? `${-r.days}d overdue` : `${r.days}d`}</Pill>
                <Button size="sm" variant="ghost" onClick={() => remove(r.id)}>×</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted-foreground mt-2">A stretched cycle causes long-toe / low-heel imbalance, which drives navicular pain and hoof cracks. Book the next appointment before the farrier leaves.</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 8. VIVARIUM HUMIDITY CALCULATOR ═══════════════ */
const HUMIDITY: Record<string, { range: [number, number]; misting: string; substrate: string; note: string }> = {
  "bearded-dragon": { range: [30, 40], misting: "Do not mist", substrate: "Loose soil / tile — arid", note: "Excess humidity causes respiratory infection. Aim under 40%." },
  "leopard-gecko": { range: [30, 40], misting: "1× light mist at night", substrate: "Tile or paper towel; humid hide with moss for shedding", note: "Dedicated humid hide with damp sphagnum moss is essential for shedding." },
  "crested-gecko": { range: [60, 80], misting: "Heavy mist 1× at night, light 1× morning", substrate: "Bioactive with leaf litter", note: "Allow humidity to drop to 50% between mistings — constant wet causes bacterial skin infection." },
  "ball-python": { range: [55, 65], misting: "Only during shed", substrate: "Cypress mulch or coco husk", note: "Boost to 70% only during shed cycle." },
  "corn-snake": { range: [40, 60], misting: "1× light during shed", substrate: "Aspen or cypress", note: "Humid hide during shed prevents dysecdysis." },
  "chameleon": { range: [50, 70], misting: "2-3× daily heavy mist + dripper/fogger at night", substrate: "Bare screen bottom or bioactive", note: "Chameleons drink only from moving droplets — a dripper is required, not a bowl." },
  "day-gecko": { range: [60, 80], misting: "2× daily", substrate: "Bioactive tropical", note: "Live plants stabilise humidity better than any mister." },
  "dart-frog": { range: [80, 100], misting: "Auto misting 4-6× daily", substrate: "Bioactive with drainage layer", note: "Never let humidity fall under 70%." },
  "russian-tortoise": { range: [30, 50], misting: "None; weekly soak", substrate: "Topsoil + play sand", note: "Arid species — high humidity causes shell rot." },
  "red-eared-slider": { range: [50, 70], misting: "Ambient from water", substrate: "None in water, none on dock", note: "Ambient humidity from the water is usually sufficient." },
};

export function VivariumHumidityCalculator() {
  const [species, setSpecies] = useState("crested-gecko");
  const [current, setCurrent] = useState(60);
  const h = HUMIDITY[species];
  const state = current < h.range[0] - 5 ? "too-dry" : current > h.range[1] + 5 ? "too-wet" : current < h.range[0] || current > h.range[1] ? "close" : "ok";

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Species</Label>
        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{Object.keys(HUMIDITY).map((k) => <SelectItem key={k} value={k}>{k.replace(/-/g, " ")}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div><Label>Current humidity: {current}%</Label><Slider value={[current]} min={10} max={100} step={1} onValueChange={(v) => setCurrent(v[0])} /></div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">Target range</div>
      <div className="font-display text-4xl font-semibold">{h.range[0]}–{h.range[1]}%</div>
      {state === "ok" && <Pill tone="safe">In range</Pill>}
      {state === "close" && <Pill tone="caution">Adjust slightly</Pill>}
      {state === "too-dry" && <Pill tone="danger">Too dry — add misting / bigger water bowl / cover part of screen top</Pill>}
      {state === "too-wet" && <Pill tone="danger">Too wet — increase ventilation, reduce misting, swap to more absorbent substrate</Pill>}
      <div className="rounded-lg bg-background/60 p-3 text-sm space-y-1">
        <div><strong>Misting:</strong> {h.misting}</div>
        <div><strong>Substrate:</strong> {h.substrate}</div>
        <div className="text-muted-foreground">{h.note}</div>
      </div>
      <p className="text-xs text-muted-foreground">Measure with a digital hygrometer at animal height. Analog dial hygrometers are typically off by 10-15%.</p>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}
