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
    let label = "Low risk";
    let advice = "Normal outdoor time is fine. Always provide shade and fresh water.";
    if (s >= 80) { tone = "extreme"; label = "Extreme — do not exercise outdoors"; advice = "Keep indoors with AC. Even brief exposure risks fatal heatstroke, especially for flat-faced or senior pets."; }
    else if (s >= 55) { tone = "danger"; label = "High risk"; advice = "Limit outdoors to bathroom breaks only. Walk before sunrise or after sunset. Watch for excessive panting, drooling, or wobbliness."; }
    else if (s >= 30) { tone = "caution"; label = "Moderate — take precautions"; advice = "Shorten walks, avoid pavement, carry water, take shade breaks every 10 minutes."; }
    return { score: s, tone, label, advice };
  }, [tempF, humidity, brachy, coat, activity, senior]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Air temperature: {tempF}°F</Label>
        <Slider value={[tempF]} min={40} max={115} step={1} onValueChange={(v) => setTempF(v[0])} />
      </div>
      <div>
        <Label>Humidity: {humidity}%</Label>
        <Slider value={[humidity]} min={0} max={100} step={5} onValueChange={(v) => setHumidity(v[0])} />
      </div>
      <div>
        <Label>Coat type</Label>
        <Select value={coat} onValueChange={setCoat}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short / thin</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="thick">Thick single coat</SelectItem>
            <SelectItem value="double">Double coat (Husky, Golden, etc.)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Activity level</Label>
        <Select value={activity} onValueChange={setActivity}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="rest">Resting outdoors</SelectItem>
            <SelectItem value="moderate">Walk / light play</SelectItem>
            <SelectItem value="vigorous">Running / fetch / hike</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={brachy} onCheckedChange={(v) => setBrachy(!!v)} /> Flat-faced breed (Bulldog, Pug, Persian, etc.)</label>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={senior} onCheckedChange={(v) => setSenior(!!v)} /> Senior or has heart / respiratory condition</label>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">Heatstroke risk</div>
      <div className="font-display text-4xl font-semibold">{score}</div>
      <Badge tone={tone}>{label}</Badge>
      <p className="text-sm text-muted-foreground">{advice}</p>
      <div className="mt-4 rounded-lg bg-background/60 p-3 text-xs">
        <strong>Emergency signs:</strong> heavy panting, bright red gums, drooling ropes of saliva, vomiting, collapse. Cool with room-temperature (not ice) water on paws/belly and drive to the ER immediately.
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 2. COLD WEATHER SAFETY SCORE ═══════════════ */
export function ColdWeatherSafetyScore() {
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
    let label = "Safe";
    let advice = "Normal outdoor time. Watch for lifted paws — that's the first sign your pet is cold.";
    if (felt <= 0) { tone = "extreme"; label = "Life-threatening"; advice = "Bathroom breaks only, under 5 minutes. Frostbite risk on ears, tail, paws. Use boots and an insulated coat."; }
    else if (felt <= 20) { tone = "danger"; label = "Dangerous"; advice = "Limit to short outings (10-15 min). Coat and booties recommended for small or short-coated pets."; }
    else if (felt <= 32) { tone = "caution"; label = "Chilly — dress for it"; advice = "Small or short-haired dogs benefit from a sweater. Keep walks brisk to maintain body heat."; }
    return { label, tone, advice, windchill: Math.round(wc) };
  }, [tempF, wind, wet, size, coat, puppy]);

  const form = (
    <div className="space-y-4">
      <div><Label>Air temperature: {tempF}°F</Label><Slider value={[tempF]} min={-30} max={60} step={1} onValueChange={(v) => setTempF(v[0])} /></div>
      <div><Label>Wind speed: {wind} mph</Label><Slider value={[wind]} min={0} max={45} step={1} onValueChange={(v) => setWind(v[0])} /></div>
      <div>
        <Label>Size</Label>
        <Select value={size} onValueChange={setSize}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
          <SelectItem value="toy">Toy (&lt; 10 lb)</SelectItem><SelectItem value="small">Small (10-25 lb)</SelectItem>
          <SelectItem value="medium">Medium (25-60 lb)</SelectItem><SelectItem value="large">Large (60+ lb)</SelectItem>
        </SelectContent></Select>
      </div>
      <div>
        <Label>Coat</Label>
        <Select value={coat} onValueChange={setCoat}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
          <SelectItem value="short">Short / single</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="double">Thick double coat</SelectItem>
        </SelectContent></Select>
      </div>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={wet} onCheckedChange={(v) => setWet(!!v)} /> Rain, snow, or wet fur</label>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={puppy} onCheckedChange={(v) => setPuppy(!!v)} /> Puppy, senior, or thin body condition</label>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">Wind chill</div>
      <div className="font-display text-4xl font-semibold">{windchill}°F</div>
      <Badge tone={tone}>{label}</Badge>
      <p className="text-sm text-muted-foreground">{advice}</p>
      <div className="mt-4 rounded-lg bg-background/60 p-3 text-xs">
        <strong>Hypothermia signs:</strong> shivering, weakness, slow breathing, pale gums. Warm gradually with blankets and call your vet.
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 3. PAW PAD TEMPERATURE CHECKER ═══════════════ */
export function PawPadTemperatureChecker() {
  const [air, setAir] = useState(85);
  const [surface, setSurface] = useState("asphalt");
  const [sun, setSun] = useState("full");

  const { padTemp, tone, label, seconds } = useMemo(() => {
    // Empirical: asphalt in full sun ≈ air + 40-60°F
    const base: Record<string, number> = { asphalt: 45, concrete: 25, sand: 40, grass: 5, dirt: 15, wood: 20 };
    const sunMult = sun === "full" ? 1 : sun === "partial" ? 0.6 : 0.2;
    const pad = Math.round(air + base[surface] * sunMult);
    let tone: "safe" | "caution" | "danger" | "extreme" = "safe";
    let label = "Safe to walk";
    let sec = "Unlimited";
    if (pad >= 140) { tone = "extreme"; label = "Skin destruction in seconds"; sec = "Do not walk"; }
    else if (pad >= 125) { tone = "danger"; label = "Burns likely"; sec = "≤ 5 seconds contact"; }
    else if (pad >= 110) { tone = "caution"; label = "Uncomfortable — will burn on prolonged contact"; sec = "Under 60 seconds"; }
    return { padTemp: pad, tone, label, seconds: sec };
  }, [air, surface, sun]);

  const form = (
    <div className="space-y-4">
      <div><Label>Air temperature: {air}°F</Label><Slider value={[air]} min={40} max={115} step={1} onValueChange={(v) => setAir(v[0])} /></div>
      <div>
        <Label>Surface</Label>
        <Select value={surface} onValueChange={setSurface}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
          <SelectItem value="asphalt">Asphalt / blacktop</SelectItem><SelectItem value="concrete">Concrete / sidewalk</SelectItem>
          <SelectItem value="sand">Sand (beach)</SelectItem><SelectItem value="dirt">Dirt trail</SelectItem>
          <SelectItem value="grass">Grass</SelectItem><SelectItem value="wood">Wood deck</SelectItem>
        </SelectContent></Select>
      </div>
      <div>
        <Label>Sun exposure</Label>
        <Select value={sun} onValueChange={setSun}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
          <SelectItem value="full">Full sun</SelectItem><SelectItem value="partial">Partial shade</SelectItem><SelectItem value="shade">Full shade</SelectItem>
        </SelectContent></Select>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">Estimated pad temperature</div>
      <div className="font-display text-4xl font-semibold">{padTemp}°F</div>
      <Badge tone={tone}>{label}</Badge>
      <div className="text-sm"><strong>Safe contact:</strong> {seconds}</div>
      <div className="mt-4 rounded-lg bg-background/60 p-3 text-xs">
        <strong>7-second test:</strong> place the back of your hand on the ground. If you can't hold it for 7 seconds, it's too hot for paws. Walk on grass, in shade, or use boots.
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 4. FIREWORKS ANXIETY PREP ═══════════════ */
const FIREWORKS_TASKS = [
  { g: "1 week before", items: ["Ask vet about calming meds (Sileo, trazodone) if severe", "Order a pressure wrap (Thundershirt) if new", "Start playing low-volume firework sounds during meals to desensitize", "Update microchip and ID tag — most lost-pet reports spike on July 4"] },
  { g: "Day of", items: ["Long walk / exercise in the morning to burn energy", "Feed dinner early before noise starts", "Take a final potty break before dusk", "Close all windows, blinds, and doors", "Set up a den: covered crate or interior bathroom with bedding"] },
  { g: "During the show", items: ["Turn on white noise, TV, or classical music", "Stay calm — pets mirror your energy", "Offer a high-value chew or lick mat", "Don't punish hiding — let them retreat", "Never take pets to firework displays"] },
  { g: "Emergency", items: ["Have vet ER phone saved", "Recent photo on your phone for lost-pet posters", "Neighbors know your pet in case of escape"] },
];
export function FireworksAnxietyPrep() {
  const [done, setDone] = useLocal<Record<string, boolean>>("furtools:fireworks", {});
  const total = FIREWORKS_TASKS.reduce((s, g) => s + g.items.length, 0);
  const complete = Object.values(done).filter(Boolean).length;
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-cream-deep p-4">
        <div className="text-xs uppercase text-muted-foreground">Preparation progress</div>
        <div className="font-display text-3xl font-semibold">{complete} / {total}</div>
      </div>
      {FIREWORKS_TASKS.map((g) => (
        <div key={g.g}>
          <div className="font-display text-lg font-semibold mb-2">{g.g}</div>
          <ul className="space-y-2">
            {g.items.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm">
                <Checkbox checked={!!done[t]} onCheckedChange={(v) => setDone((d) => ({ ...d, [t]: !!v }))} />
                <span className={done[t] ? "line-through text-muted-foreground" : ""}>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════ 5. HALLOWEEN SAFETY CHECKER ═══════════════ */
const HALLOWEEN_HAZARDS = [
  { name: "Chocolate", risk: "toxic", detail: "Dark and baking chocolate most dangerous. Even small amounts cause vomiting, tremors, seizures." },
  { name: "Xylitol (sugar-free candy/gum)", risk: "toxic", detail: "Extremely toxic to dogs — causes rapid hypoglycemia and liver failure. Even one piece can be fatal." },
  { name: "Raisins & grapes", risk: "toxic", detail: "Cause acute kidney failure in dogs. Common in trick-or-treat mix." },
  { name: "Candy wrappers & lollipop sticks", risk: "hazard", detail: "Foreign body obstruction risk; often need surgery." },
  { name: "Glow sticks", risk: "hazard", detail: "Bitter-tasting fluid causes drooling and mouth foaming (rarely fatal but distressing)." },
  { name: "Costumes", risk: "caution", detail: "Never leave a costumed pet unsupervised. Check nothing restricts breathing, vision, or movement." },
  { name: "Open door / escapes", risk: "hazard", detail: "Trick-or-treaters mean constant door opening — biggest cause of lost pets on Halloween." },
  { name: "Jack-o'-lantern candles", risk: "hazard", detail: "Curious tails and paws can knock over open flames." },
  { name: "Black cats", risk: "caution", detail: "Keep indoor-only for the week around Halloween due to cruelty risk." },
];
export function HalloweenSafetyChecker() {
  const [q, setQ] = useState("");
  const results = HALLOWEEN_HAZARDS.filter((h) => h.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <Input placeholder="Search a Halloween item (chocolate, costume, glow stick…)" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((h) => {
          const tone = h.risk === "toxic" ? "extreme" : h.risk === "hazard" ? "danger" : "caution";
          return (
            <div key={h.name} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{h.name}</div>
                <Badge tone={tone as "extreme" | "danger" | "caution"}>{h.risk}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{h.detail}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg bg-cream-deep p-3 text-xs">
        <strong>Emergency:</strong> ASPCA Animal Poison Control 1-888-426-4435 (fee applies). Call your ER vet immediately if ingestion is suspected.
      </div>
    </div>
  );
}

/* ═══════════════ 6. CHRISTMAS HAZARD LOOKUP ═══════════════ */
const CHRISTMAS_HAZARDS = [
  { name: "Poinsettia", risk: "caution", detail: "Mildly toxic — mouth irritation and drooling. Rarely serious but keep out of reach." },
  { name: "Holly & mistletoe", risk: "toxic", detail: "Berries cause vomiting, diarrhea, and cardiovascular effects with mistletoe." },
  { name: "Lilies (all types)", risk: "toxic", detail: "Deadly to cats — any part causes acute kidney failure. Even pollen or vase water." },
  { name: "Christmas tree water", risk: "hazard", detail: "May contain fertilizer, bacteria, or preservatives — cover the base." },
  { name: "Tinsel & ribbon", risk: "hazard", detail: "Linear foreign body — cats love it; nearly always requires surgery if swallowed." },
  { name: "Glass ornaments", risk: "hazard", detail: "Cuts to mouth, paws, or GI tract. Hang fragile ornaments high." },
  { name: "String lights", risk: "hazard", detail: "Chewing causes electrical burns and shock. Unplug when unsupervised." },
  { name: "Chocolate & baked goods", risk: "toxic", detail: "Rich holiday foods = pancreatitis. Chocolate and macadamia especially dangerous." },
  { name: "Onions, garlic, leeks", risk: "toxic", detail: "In stuffing and gravy — cause hemolytic anemia in dogs and cats." },
  { name: "Alcohol", risk: "toxic", detail: "Even eggnog and rum cake are dangerous. Rapid drop in blood sugar and body temperature." },
  { name: "Turkey bones", risk: "hazard", detail: "Cooked bones splinter — GI perforation risk. Give raw carrots instead." },
  { name: "Snow globes (imported)", risk: "toxic", detail: "May contain antifreeze/ethylene glycol — deadly in tiny amounts." },
  { name: "Candles", risk: "hazard", detail: "Burns and fire risk from tails, jumping cats. Use flameless." },
  { name: "Wrapping paper & bows", risk: "hazard", detail: "GI obstruction if swallowed. Clean up promptly." },
];
export function ChristmasHazardLookup() {
  const [q, setQ] = useState("");
  const results = CHRISTMAS_HAZARDS.filter((h) => h.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <Input placeholder="Search: poinsettia, tinsel, turkey bones…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((h) => {
          const tone = h.risk === "toxic" ? "extreme" : h.risk === "hazard" ? "danger" : "caution";
          return (
            <div key={h.name} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{h.name}</div>
                <Badge tone={tone as "extreme" | "danger" | "caution"}>{h.risk}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{h.detail}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg bg-cream-deep p-3 text-xs">
        <strong>Poison Control:</strong> ASPCA 1-888-426-4435 or Pet Poison Helpline 1-855-764-7661.
      </div>
    </div>
  );
}

/* ═══════════════ 7. ALLERGY SEASON TRACKER ═══════════════ */
type AllergyLog = { id: string; date: string; itch: number; pollen: number; symptoms: string[]; notes: string };
const SYMPTOMS = ["Paw licking", "Ear scratching", "Face rubbing", "Belly rash", "Hair loss", "Watery eyes", "Sneezing", "Hot spots"];
export function AllergySeasonTracker() {
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
      <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div><Label>Itch severity: {itch}/10</Label><Slider value={[itch]} min={0} max={10} step={1} onValueChange={(v) => setItch(v[0])} /></div>
      <div><Label>Local pollen index: {pollen}/10</Label><Slider value={[pollen]} min={0} max={10} step={1} onValueChange={(v) => setPollen(v[0])} /></div>
      <div>
        <Label className="mb-2 block">Symptoms today</Label>
        <div className="grid grid-cols-2 gap-2">
          {SYMPTOMS.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <Checkbox checked={sym.includes(s)} onCheckedChange={() => toggle(s)} /> {s}
            </label>
          ))}
        </div>
      </div>
      <div><Label>Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="New food, bath, walked in tall grass…" /></div>
      <Button onClick={add} className="w-full">Log entry</Button>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><div className="text-xs uppercase text-muted-foreground">Avg itch</div><div className="font-display text-2xl font-semibold">{avgItch}/10</div></div>
        <div><div className="text-xs uppercase text-muted-foreground">Entries</div><div className="font-display text-2xl font-semibold">{logs.length}</div></div>
      </div>
      {worst && (<div className="text-sm">Worst day: <strong>{worst.date}</strong> — itch {worst.itch}/10</div>)}
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {logs.slice(0, 12).map((l) => (
          <div key={l.id} className="rounded-lg bg-background/60 p-2 text-xs">
            <div className="flex justify-between"><strong>{l.date}</strong><span>Itch {l.itch} · Pollen {l.pollen}</span></div>
            {l.symptoms.length > 0 && <div className="mt-1 text-muted-foreground">{l.symptoms.join(", ")}</div>}
            {l.notes && <div className="mt-1 italic">{l.notes}</div>}
          </div>
        ))}
        {logs.length === 0 && <div className="text-sm text-muted-foreground">No entries yet. Log daily during allergy season to spot triggers.</div>}
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════ 8. AIR QUALITY IMPACT ASSESSOR ═══════════════ */
export function AirQualityImpactAssessor() {
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
    let cat = "Good";
    if (aqi > 300) cat = "Hazardous"; else if (aqi > 200) cat = "Very Unhealthy";
    else if (aqi > 150) cat = "Unhealthy"; else if (aqi > 100) cat = "Unhealthy for Sensitive Groups";
    else if (aqi > 50) cat = "Moderate";
    let tone: "safe" | "caution" | "danger" | "extreme" = "safe";
    let label = "Normal outdoor activity";
    let action = "Enjoy walks and outdoor play as usual.";
    if (eff >= 200) { tone = "extreme"; label = "Keep indoors"; action = "Cancel all outdoor exercise. Run an air purifier. Keep windows closed. Birds especially vulnerable to particulate lung damage."; }
    else if (eff >= 150) { tone = "danger"; label = "Bathroom breaks only"; action = "Skip walks and outdoor play. Watch for coughing or lethargy. Pets with heart or lung disease need extra caution."; }
    else if (eff >= 100) { tone = "caution"; label = "Shorten outdoor time"; action = "Cut walks in half. Avoid strenuous exercise. Wipe paws and coat after outings to remove particulates."; }
    return { tone, label, action, cat };
  }, [aqi, sensitive, brachy, species]);

  const form = (
    <div className="space-y-4">
      <div><Label>Local AQI: {aqi}</Label><Slider value={[aqi]} min={0} max={500} step={5} onValueChange={(v) => setAqi(v[0])} /></div>
      <div>
        <Label>Species</Label>
        <Select value={species} onValueChange={setSpecies}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
          <SelectItem value="dog">Dog</SelectItem><SelectItem value="cat">Cat</SelectItem>
          <SelectItem value="bird">Bird (highly sensitive)</SelectItem><SelectItem value="small">Small pet</SelectItem>
        </SelectContent></Select>
      </div>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={brachy} onCheckedChange={(v) => setBrachy(!!v)} /> Flat-faced (Bulldog, Pug, Persian)</label>
      <label className="flex items-center gap-2 text-sm"><Checkbox checked={sensitive} onCheckedChange={(v) => setSensitive(!!v)} /> Senior, puppy, or has heart / lung condition</label>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="text-xs uppercase text-muted-foreground">Air quality</div>
      <div className="font-display text-4xl font-semibold">{aqi}</div>
      <div className="text-sm">{cat}</div>
      <Badge tone={tone}>{label}</Badge>
      <p className="text-sm text-muted-foreground">{action}</p>
      <div className="mt-4 rounded-lg bg-background/60 p-3 text-xs">
        <strong>Warning signs:</strong> coughing, wheezing, watery eyes, reluctance to move, reduced appetite. Contact your vet if symptoms persist after 24h indoors.
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}
