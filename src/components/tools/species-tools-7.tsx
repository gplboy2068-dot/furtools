import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";

/* ---------- localStorage helpers ---------- */
function useLocalState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : initial; }
    catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }, [key, value]);
  return [value, setValue];
}

/* ═══════════════════════════════════════════════════════════
   1. CLICKER TRAINING PLANNER
═══════════════════════════════════════════════════════════ */
const CLICKER_PHASES = [
  { name: "Charge the clicker", days: "1-3", desc: "Click + treat 20 times with no expectation. Pet learns click = food." },
  { name: "Capture behaviors", days: "4-10", desc: "Click the moment your pet sits, lies down, or looks at you naturally." },
  { name: "Lure & reward", days: "11-20", desc: "Guide with a treat, click at success, then fade the lure over 10 reps." },
  { name: "Add cue word", days: "21-30", desc: "Say the word right before the behavior, then click + treat when it happens." },
  { name: "Proof in new places", days: "31-45", desc: "Practice in the yard, on walks, and around distractions." },
  { name: "Reduce food rewards", days: "46+", desc: "Move to variable reinforcement: reward every 2-3 correct responses." },
];
export function ClickerTrainingPlanner() {
  const [sessionsPerDay, setSessionsPerDay] = useState(3);
  const form = (
    <div className="space-y-4">
      <div>
        <Label>Training sessions per day</Label>
        <Input type="number" min={1} max={6} value={sessionsPerDay} onChange={(e) => setSessionsPerDay(+e.target.value || 1)} />
        <p className="mt-1 text-xs text-muted-foreground">3-5 minute sessions, 2-4x daily, work best for most pets.</p>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      {CLICKER_PHASES.map((p) => (
        <div key={p.name} className="rounded-lg bg-background/60 p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">{p.name}</div>
            <span className="text-xs text-muted-foreground">Days {p.days}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
        </div>
      ))}
      <div className="rounded-lg bg-primary/10 p-3 text-xs">
        Total sessions to solid cue response: ≈ {sessionsPerDay * 30} short sessions over 30 days.
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   2. POTTY TRAINING SCHEDULE
═══════════════════════════════════════════════════════════ */
export function PottyTrainingSchedule() {
  const [ageMonths, setAgeMonths] = useState(3);
  const [wakeHour, setWakeHour] = useState(7);
  const [bedHour, setBedHour] = useState(22);
  const plan = useMemo(() => {
    // Rule of thumb: puppies can hold roughly (age in months) hours, max 6-8.
    const holdHours = Math.max(1, Math.min(6, ageMonths));
    const outings: string[] = [];
    for (let h = wakeHour; h <= bedHour; h += holdHours) {
      outings.push(`${String(h).padStart(2, "0")}:00 — potty break`);
    }
    // Always add key trigger outings.
    return {
      holdHours,
      outings,
      triggers: [
        "Immediately after waking",
        "10-20 minutes after each meal",
        "After every play or training session",
        "Before crate time and before bed",
      ],
    };
  }, [ageMonths, wakeHour, bedHour]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Puppy age (months)</Label>
        <Input type="number" min={2} max={12} value={ageMonths} onChange={(e) => setAgeMonths(+e.target.value || 2)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Wake time (hour)</Label>
          <Input type="number" min={4} max={11} value={wakeHour} onChange={(e) => setWakeHour(+e.target.value || 7)} />
        </div>
        <div>
          <Label>Bedtime (hour)</Label>
          <Input type="number" min={18} max={24} value={bedHour} onChange={(e) => setBedHour(+e.target.value || 22)} />
        </div>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-primary/10 p-3 text-sm">
        Bladder capacity ≈ <b>{plan.holdHours} hours</b> between outings.
      </div>
      <div className="rounded-lg bg-background/60 p-3">
        <div className="font-medium">Scheduled potty breaks</div>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {plan.outings.map((o) => <li key={o}>{o}</li>)}
        </ul>
      </div>
      <div className="rounded-lg bg-background/60 p-3">
        <div className="font-medium">Also go out immediately after:</div>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {plan.triggers.map((t) => <li key={t}>• {t}</li>)}
        </ul>
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   3. CRATE TRAINING TIMELINE
═══════════════════════════════════════════════════════════ */
const CRATE_TIMELINE = [
  { day: "Day 1-2", goal: "Introduce", detail: "Door open, treats and toys inside. Never force." },
  { day: "Day 3-4", goal: "Meals inside", detail: "Feed all meals in the crate with door open." },
  { day: "Day 5-7", goal: "Close door briefly", detail: "Close for 30 sec while eating, reopen calmly." },
  { day: "Day 8-10", goal: "5-15 minute stays", detail: "You in the room, calm praise on quiet." },
  { day: "Day 11-14", goal: "Leave the room", detail: "Step out 5-30 min, ignore whining, reward silence." },
  { day: "Day 15-21", goal: "Absences", detail: "Short errands (30-60 min). Puppies max 3-4 hours." },
  { day: "Day 22+", goal: "Overnight & workday", detail: "Adult dogs max 6-8 hours; puppies need midday break." },
];
export function CrateTrainingTimeline() {
  return (
    <CalculatorLayout
      form={<p className="text-sm text-muted-foreground">A 3-week desensitization plan. Never use the crate as punishment.</p>}
      result={
        <div className="space-y-2">
          {CRATE_TIMELINE.map((s) => (
            <div key={s.day} className="rounded-lg bg-background/60 p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{s.day} — {s.goal}</div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
            </div>
          ))}
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   4. LEASH TRAINING PROGRESS
═══════════════════════════════════════════════════════════ */
const LEASH_MILESTONES = [
  "Wears collar & leash indoors without fuss",
  "Follows me across the living room",
  "Walks 5 min in the yard without pulling",
  "Sits at every curb",
  "Ignores dropped food on sidewalk",
  "Loose leash for a full 10-minute walk",
  "Passes a stranger calmly",
  "Passes another dog under threshold",
  "Recall works on 20-ft long line",
  "Neighborhood walk with no corrections",
];
export function LeashTrainingProgress() {
  const [done, setDone] = useLocalState<Record<string, boolean>>("furtools:leash-progress", {});
  const completed = LEASH_MILESTONES.filter((m) => done[m]).length;
  const pct = Math.round((completed / LEASH_MILESTONES.length) * 100);
  return (
    <CalculatorLayout
      form={<p className="text-sm text-muted-foreground">Tick milestones as your dog masters them. Progress saves to this device.</p>}
      result={
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/10 p-3 text-center">
            <div className="text-3xl font-bold text-primary">{pct}%</div>
            <div className="text-xs text-muted-foreground">{completed} of {LEASH_MILESTONES.length} milestones</div>
          </div>
          <ul className="space-y-2">
            {LEASH_MILESTONES.map((m, i) => (
              <li key={m} className="flex items-start gap-3 rounded-lg bg-background/60 p-3">
                <Checkbox id={`ls-${i}`} checked={!!done[m]} onCheckedChange={(v) => setDone((p) => ({ ...p, [m]: !!v }))} />
                <label htmlFor={`ls-${i}`} className="text-sm">{i + 1}. {m}</label>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   5. RECALL TRAINING TRACKER
═══════════════════════════════════════════════════════════ */
type RecallLog = { date: string; env: string; success: number; total: number };
export function RecallTrainingTracker() {
  const [logs, setLogs] = useLocalState<RecallLog[]>("furtools:recall-log", []);
  const [env, setEnv] = useState("Yard");
  const [success, setSuccess] = useState(8);
  const [total, setTotal] = useState(10);
  const add = () => setLogs((p) => [{ date: new Date().toISOString().slice(0, 10), env, success, total }, ...p].slice(0, 30));
  const remove = (i: number) => setLogs((p) => p.filter((_, idx) => idx !== i));
  const overall = useMemo(() => {
    if (!logs.length) return 0;
    const s = logs.reduce((a, l) => a + l.success, 0);
    const t = logs.reduce((a, l) => a + l.total, 0);
    return t ? Math.round((s / t) * 100) : 0;
  }, [logs]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>Environment</Label>
        <Select value={env} onValueChange={setEnv}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {["Indoors", "Yard", "Quiet park", "Busy park", "Off-leash trail"].map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Successes</Label><Input type="number" min={0} value={success} onChange={(e) => setSuccess(+e.target.value || 0)} /></div>
        <div><Label>Total attempts</Label><Input type="number" min={1} value={total} onChange={(e) => setTotal(+e.target.value || 1)} /></div>
      </div>
      <Button onClick={add} className="w-full">Log session</Button>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-primary/10 p-3 text-center">
        <div className="text-3xl font-bold text-primary">{overall}%</div>
        <div className="text-xs text-muted-foreground">Overall recall reliability ({logs.length} sessions)</div>
        <p className="mt-2 text-xs text-muted-foreground">Target 90%+ before trusting off-leash in unfenced areas.</p>
      </div>
      <ul className="space-y-2">
        {logs.length === 0 && <li className="text-xs text-muted-foreground">Log your first session to start tracking.</li>}
        {logs.map((l, i) => (
          <li key={i} className="flex items-center justify-between rounded-lg bg-background/60 p-2 text-xs">
            <span>{l.date} · {l.env}: <b>{l.success}/{l.total}</b> ({Math.round((l.success / l.total) * 100)}%)</span>
            <Button size="sm" variant="ghost" onClick={() => remove(i)}>Remove</Button>
          </li>
        ))}
      </ul>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   6. SOCIALIZATION CHECKLIST
═══════════════════════════════════════════════════════════ */
const SOCIALIZATION_GROUPS = [
  { title: "People", items: ["Men with beards", "Women wearing hats", "Small children", "Teens", "Elderly", "People with mobility aids", "Delivery workers in uniform"] },
  { title: "Animals", items: ["Vaccinated adult dog", "Puppy of similar age", "Cat (calm)", "Livestock or horses at distance", "Birds"] },
  { title: "Environments", items: ["Pet-friendly store", "Vet lobby (happy visit)", "Café patio", "Elevator", "Stairs (all types)", "Car ride", "Grooming salon visit"] },
  { title: "Surfaces & sounds", items: ["Grass, sand, gravel, metal grate", "Wood floor", "Vacuum on", "Doorbell", "Traffic noise", "Fireworks recording (low volume)", "Baby crying recording"] },
  { title: "Handling", items: ["Ear touch", "Paw handling", "Nail dremel sound", "Toothbrushing", "Wearing a harness", "Being held for exam"] },
];
export function SocializationChecklist() {
  const [done, setDone] = useLocalState<Record<string, boolean>>("furtools:socialization", {});
  const all = SOCIALIZATION_GROUPS.flatMap((g) => g.items);
  const completed = all.filter((i) => done[i]).length;
  const pct = Math.round((completed / all.length) * 100);
  return (
    <CalculatorLayout
      form={<p className="text-sm text-muted-foreground">Aim to expose your puppy positively to 100 new things before 16 weeks.</p>}
      result={
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/10 p-3 text-center">
            <div className="text-3xl font-bold text-primary">{pct}%</div>
            <div className="text-xs text-muted-foreground">{completed} of {all.length} experiences</div>
          </div>
          {SOCIALIZATION_GROUPS.map((g) => (
            <div key={g.title} className="rounded-lg bg-background/60 p-3">
              <div className="mb-2 font-medium">{g.title}</div>
              <ul className="space-y-2">
                {g.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-sm">
                    <Checkbox id={it} checked={!!done[it]} onCheckedChange={(v) => setDone((p) => ({ ...p, [it]: !!v }))} />
                    <label htmlFor={it}>{it}</label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   7. PUPPY MILESTONE TRACKER
═══════════════════════════════════════════════════════════ */
const PUPPY_MILESTONES = [
  { week: 3, m: "Eyes and ears open" },
  { week: 4, m: "Starts eating soft food" },
  { week: 6, m: "First deworming complete" },
  { week: 8, m: "Ready to go home; first vaccine" },
  { week: 10, m: "Basic name recognition" },
  { week: 12, m: "Second vaccine, socialization critical" },
  { week: 16, m: "Third vaccine + rabies; adult teeth erupting" },
  { week: 20, m: "Reliable sit/down/come indoors" },
  { week: 26, m: "Spay/neuter discussion with vet" },
  { week: 52, m: "Switch to adult food (breed-dependent)" },
];
export function PuppyMilestoneTracker() {
  const [done, setDone] = useLocalState<Record<string, boolean>>("furtools:puppy-milestones", {});
  return (
    <CalculatorLayout
      form={<p className="text-sm text-muted-foreground">Standard puppy developmental checkpoints. Confirm timing with your veterinarian.</p>}
      result={
        <ul className="space-y-2">
          {PUPPY_MILESTONES.map((s) => (
            <li key={s.week} className="flex items-start gap-3 rounded-lg bg-background/60 p-3">
              <Checkbox id={`pm-${s.week}`} checked={!!done[String(s.week)]} onCheckedChange={(v) => setDone((p) => ({ ...p, [String(s.week)]: !!v }))} />
              <label htmlFor={`pm-${s.week}`} className="text-sm">
                <span className="font-medium">Week {s.week}:</span> {s.m}
              </label>
            </li>
          ))}
        </ul>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   8. AGGRESSION RISK ASSESSMENT
═══════════════════════════════════════════════════════════ */
const AGG_QUESTIONS = [
  "Stiffens or freezes when approached while eating",
  "Growls when touched or handled",
  "Has bitten a person (any severity)",
  "Reacts intensely to other dogs on leash",
  "Guards toys, food bowl, or resting spot",
  "Shows a hard stare at strangers",
  "Snaps in the air as a warning",
  "History of biting another animal",
];
export function AggressionRiskAssessment() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const score = Object.values(answers).filter(Boolean).length;
  const risk = score === 0 ? "Low" : score <= 2 ? "Moderate — behavior consultant recommended" : score <= 4 ? "High — professional intervention needed" : "Very high — see veterinary behaviorist";
  const color = score === 0 ? "text-emerald-600" : score <= 2 ? "text-amber-600" : "text-red-600";
  const form = (
    <div className="space-y-3">
      {AGG_QUESTIONS.map((q) => (
        <label key={q} className="flex items-start gap-3 rounded-lg bg-background/60 p-3 text-sm">
          <Checkbox checked={!!answers[q]} onCheckedChange={(v) => setAnswers((p) => ({ ...p, [q]: !!v }))} />
          <span>{q}</span>
        </label>
      ))}
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-primary/10 p-4 text-center">
        <div className="text-sm text-muted-foreground">Risk score</div>
        <div className={`text-3xl font-bold ${color}`}>{score} / {AGG_QUESTIONS.length}</div>
        <div className="mt-1 text-sm font-medium">{risk}</div>
      </div>
      <div className="rounded-lg border border-red-500/30 bg-red-50/60 p-3 text-xs dark:bg-red-950/20">
        <b>Safety first.</b> This screening tool does not diagnose aggression. Any bite history, resource
        guarding, or unpredictable reactivity requires evaluation by a certified veterinary behaviorist
        (Dip ACVB) or a certified behavior consultant (CDBC / IAABC). Rule out pain and thyroid disease
        with your veterinarian first — medical issues cause many "sudden" aggression cases.
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   9. SEPARATION ANXIETY SCORE
═══════════════════════════════════════════════════════════ */
const SEP_QUESTIONS = [
  "Vocalizes (barks/whines/howls) when alone",
  "Destroys items only when alone",
  "House soils only when alone (fully trained)",
  "Follows you room to room constantly",
  "Panics at pre-departure cues (keys, shoes)",
  "Excessive drooling or pacing when alone",
  "Won't eat treats or food while alone",
  "Injures self trying to escape",
];
export function SeparationAnxietyScore() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  const max = SEP_QUESTIONS.length * 3;
  const pct = Math.round((total / max) * 100);
  const band = pct < 20 ? "Minimal" : pct < 40 ? "Mild" : pct < 65 ? "Moderate" : "Severe";
  const color = pct < 20 ? "text-emerald-600" : pct < 40 ? "text-yellow-600" : pct < 65 ? "text-orange-600" : "text-red-600";
  const form = (
    <div className="space-y-3">
      {SEP_QUESTIONS.map((q) => (
        <div key={q} className="rounded-lg bg-background/60 p-3">
          <div className="mb-2 text-sm">{q}</div>
          <div className="flex gap-2">
            {["Never", "Sometimes", "Often", "Always"].map((label, val) => (
              <Button
                key={label}
                size="sm"
                variant={answers[q] === val ? "default" : "outline"}
                onClick={() => setAnswers((p) => ({ ...p, [q]: val }))}
              >{label}</Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-primary/10 p-4 text-center">
        <div className="text-sm text-muted-foreground">Separation anxiety score</div>
        <div className={`text-3xl font-bold ${color}`}>{pct}%</div>
        <div className="mt-1 font-medium">{band}</div>
      </div>
      <div className="rounded-lg bg-background/60 p-3 text-xs text-muted-foreground">
        Mild cases respond to counter-conditioning and enrichment. Moderate to severe cases benefit from
        a certified separation-anxiety trainer (CSAT) and, in many cases, medication prescribed by your
        veterinarian. Do not use punishment or "cry it out" methods — they worsen panic.
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   10. TRICK TRAINING LIBRARY
═══════════════════════════════════════════════════════════ */
const TRICKS = [
  { name: "Sit", level: "Beginner", steps: "Lure nose up until rear touches floor, click, treat. Add cue after 10 reps." },
  { name: "Down", level: "Beginner", steps: "From sit, lure straight down to floor between paws." },
  { name: "Shake", level: "Beginner", steps: "Tickle back of paw, click when it lifts. Add hand cue." },
  { name: "Spin", level: "Beginner", steps: "Lure nose in a circle. Fade lure to a finger point." },
  { name: "Roll over", level: "Intermediate", steps: "From down, lure nose over shoulder toward hip." },
  { name: "Bow", level: "Intermediate", steps: "Capture the play bow, mark with clicker, name it." },
  { name: "Speak / Quiet", level: "Intermediate", steps: "Capture a bark on cue, then reward silence to teach 'quiet'." },
  { name: "Fetch to hand", level: "Intermediate", steps: "Trade a toy for a treat; only reward when placed in your hand." },
  { name: "Weave through legs", level: "Advanced", steps: "Lure through leg → step → lure back. Chain into figure-8." },
  { name: "Play dead", level: "Advanced", steps: "From roll-over, add finger-gun cue, wait 3 seconds before release." },
  { name: "Put toys away", level: "Advanced", steps: "Chain 'take it' + 'drop it' over a bin. Reward the release into bin." },
];
export function TrickTrainingLibrary() {
  const [level, setLevel] = useState<string>("all");
  const list = level === "all" ? TRICKS : TRICKS.filter((t) => t.level === level);
  return (
    <CalculatorLayout
      form={
        <div>
          <Label>Difficulty</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["all", "Beginner", "Intermediate", "Advanced"].map((l) => <SelectItem key={l} value={l}>{l === "all" ? "All levels" : l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      }
      result={
        <ul className="space-y-2">
          {list.map((t) => (
            <li key={t.name} className="rounded-lg bg-background/60 p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{t.name}</div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs">{t.level}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t.steps}</p>
            </li>
          ))}
        </ul>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   11. COMMAND VOCABULARY BUILDER
═══════════════════════════════════════════════════════════ */
type Command = { word: string; meaning: string; learned: boolean };
const STARTER: Command[] = [
  { word: "Sit", meaning: "Bum on floor", learned: false },
  { word: "Down", meaning: "Full lie down", learned: false },
  { word: "Come", meaning: "Recall to me", learned: false },
  { word: "Stay", meaning: "Freeze in position", learned: false },
  { word: "Leave it", meaning: "Ignore that item", learned: false },
];
export function CommandVocabularyBuilder() {
  const [list, setList] = useLocalState<Command[]>("furtools:vocab", STARTER);
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const learned = list.filter((c) => c.learned).length;

  const add = () => {
    if (!word.trim()) return;
    setList((p) => [...p, { word: word.trim(), meaning: meaning.trim() || "—", learned: false }]);
    setWord(""); setMeaning("");
  };
  const toggle = (i: number) => setList((p) => p.map((c, idx) => idx === i ? { ...c, learned: !c.learned } : c));
  const remove = (i: number) => setList((p) => p.filter((_, idx) => idx !== i));

  return (
    <CalculatorLayout
      form={
        <div className="space-y-3">
          <div><Label>New command word</Label><Input value={word} onChange={(e) => setWord(e.target.value)} placeholder="e.g. Touch" /></div>
          <div><Label>What it means</Label><Input value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="Nose to my palm" /></div>
          <Button onClick={add} className="w-full">Add command</Button>
        </div>
      }
      result={
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/10 p-3 text-center">
            <div className="text-3xl font-bold text-primary">{learned}</div>
            <div className="text-xs text-muted-foreground">Commands mastered of {list.length}</div>
          </div>
          <ul className="space-y-2">
            {list.map((c, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg bg-background/60 p-3">
                <Checkbox checked={c.learned} onCheckedChange={() => toggle(i)} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{c.word}</div>
                  <div className="text-xs text-muted-foreground">{c.meaning}</div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => remove(i)}>×</Button>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   12. BEHAVIOR JOURNAL
═══════════════════════════════════════════════════════════ */
type JournalEntry = { date: string; trigger: string; behavior: string; response: string; notes: string };
export function BehaviorJournal() {
  const [entries, setEntries] = useLocalState<JournalEntry[]>("furtools:behavior-journal", []);
  const [e, setE] = useState<JournalEntry>({ date: new Date().toISOString().slice(0, 10), trigger: "", behavior: "", response: "", notes: "" });
  const add = () => {
    if (!e.behavior.trim()) return;
    setEntries((p) => [{ ...e }, ...p].slice(0, 60));
    setE({ date: new Date().toISOString().slice(0, 10), trigger: "", behavior: "", response: "", notes: "" });
  };
  const remove = (i: number) => setEntries((p) => p.filter((_, idx) => idx !== i));
  return (
    <CalculatorLayout
      form={
        <div className="space-y-3">
          <div><Label>Date</Label><Input type="date" value={e.date} onChange={(ev) => setE({ ...e, date: ev.target.value })} /></div>
          <div><Label>Trigger (what happened right before?)</Label><Input value={e.trigger} onChange={(ev) => setE({ ...e, trigger: ev.target.value })} placeholder="Doorbell rang" /></div>
          <div><Label>Behavior observed</Label><Input value={e.behavior} onChange={(ev) => setE({ ...e, behavior: ev.target.value })} placeholder="Barked and jumped at door" /></div>
          <div><Label>Your response</Label><Input value={e.response} onChange={(ev) => setE({ ...e, response: ev.target.value })} placeholder="Redirected to mat + treat" /></div>
          <div><Label>Notes</Label><Textarea rows={2} value={e.notes} onChange={(ev) => setE({ ...e, notes: ev.target.value })} /></div>
          <Button onClick={add} className="w-full">Save entry</Button>
        </div>
      }
      result={
        <div className="space-y-2">
          {entries.length === 0 && <p className="text-xs text-muted-foreground">Consistent journaling reveals patterns — most owners spot the trigger cluster within 2 weeks.</p>}
          {entries.map((en, i) => (
            <div key={i} className="rounded-lg bg-background/60 p-3 text-sm">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{en.date}</span>
                <Button size="sm" variant="ghost" onClick={() => remove(i)}>Remove</Button>
              </div>
              <div className="mt-1"><b>Trigger:</b> {en.trigger || "—"}</div>
              <div><b>Behavior:</b> {en.behavior}</div>
              <div><b>Response:</b> {en.response || "—"}</div>
              {en.notes && <div className="mt-1 text-xs text-muted-foreground">{en.notes}</div>}
            </div>
          ))}
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   13. REWARD SCHEDULE CALCULATOR
═══════════════════════════════════════════════════════════ */
export function RewardScheduleCalculator() {
  const [stage, setStage] = useState<"acquisition" | "fluency" | "generalization" | "maintenance">("acquisition");
  const plan = {
    acquisition: { schedule: "Continuous (100%)", ratio: "1:1", note: "Reward every correct response while pet is learning the behavior." },
    fluency: { schedule: "Variable ratio (VR3)", ratio: "≈ 1 in 3", note: "Reward on average every 3rd rep — builds speed and reliability." },
    generalization: { schedule: "Variable ratio (VR5)", ratio: "≈ 1 in 5", note: "In new environments, jackpot occasional big rewards. Keep verbal praise every time." },
    maintenance: { schedule: "Intermittent (VR8-10)", ratio: "≈ 1 in 8-10", note: "Behavior is a lifestyle — reward once every 8-10 reps or after harder repetitions." },
  }[stage];
  return (
    <CalculatorLayout
      form={
        <div>
          <Label>Training stage</Label>
          <Select value={stage} onValueChange={(v) => setStage(v as typeof stage)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="acquisition">Acquisition (just learning)</SelectItem>
              <SelectItem value="fluency">Fluency (knows it well)</SelectItem>
              <SelectItem value="generalization">Generalization (new places)</SelectItem>
              <SelectItem value="maintenance">Maintenance (lifelong)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      result={
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/10 p-4">
            <div className="text-sm text-muted-foreground">Recommended schedule</div>
            <div className="text-xl font-semibold text-primary">{plan.schedule}</div>
            <div className="mt-1 text-xs text-muted-foreground">Reward ratio: <b>{plan.ratio}</b></div>
          </div>
          <p className="rounded-lg bg-background/60 p-3 text-sm">{plan.note}</p>
          <div className="rounded-lg bg-background/60 p-3 text-xs text-muted-foreground">
            <b>Rule:</b> weaken rewards too fast and the behavior extinguishes. If reliability drops
            below 80%, back up one stage for a few days before thinning the schedule again.
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   14. BARKING LOG
═══════════════════════════════════════════════════════════ */
type Bark = { date: string; time: string; trigger: string; duration: number };
export function BarkingLog() {
  const [logs, setLogs] = useLocalState<Bark[]>("furtools:bark-log", []);
  const [trigger, setTrigger] = useState("Doorbell");
  const [duration, setDuration] = useState(2);
  const add = () => {
    const now = new Date();
    setLogs((p) => [{ date: now.toISOString().slice(0, 10), time: now.toTimeString().slice(0, 5), trigger, duration }, ...p].slice(0, 100));
  };
  const remove = (i: number) => setLogs((p) => p.filter((_, idx) => idx !== i));
  const summary = useMemo(() => {
    const map: Record<string, number> = {};
    logs.forEach((l) => { map[l.trigger] = (map[l.trigger] || 0) + 1; });
    const total = logs.reduce((a, l) => a + l.duration, 0);
    return { top: Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5), totalMinutes: total };
  }, [logs]);
  return (
    <CalculatorLayout
      form={
        <div className="space-y-3">
          <div>
            <Label>Trigger</Label>
            <Select value={trigger} onValueChange={setTrigger}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Doorbell", "Stranger passing", "Other dog", "Noise outside", "Alone/anxious", "Attention seeking", "Other"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Duration (minutes)</Label><Input type="number" min={0} value={duration} onChange={(e) => setDuration(+e.target.value || 0)} /></div>
          <Button onClick={add} className="w-full">Log bark event</Button>
        </div>
      }
      result={
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <div className="text-xs text-muted-foreground">Top triggers</div>
            {summary.top.length === 0 ? (
              <div className="text-sm text-muted-foreground">No entries yet.</div>
            ) : (
              <ul className="mt-1 space-y-1 text-sm">
                {summary.top.map(([t, n]) => <li key={t}>• <b>{t}</b> — {n} events</li>)}
              </ul>
            )}
            <div className="mt-2 text-xs text-muted-foreground">Total logged barking: <b>{summary.totalMinutes} min</b></div>
          </div>
          <ul className="space-y-2">
            {logs.slice(0, 15).map((l, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-background/60 p-2 text-xs">
                <span>{l.date} {l.time} — {l.trigger} · {l.duration} min</span>
                <Button size="sm" variant="ghost" onClick={() => remove(i)}>×</Button>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   15. LITTER TRAINING (cats / rabbits)
═══════════════════════════════════════════════════════════ */
export function LitterTrainingPlanner() {
  const [species, setSpecies] = useState<"cat" | "rabbit">("cat");
  const plan = species === "cat"
    ? [
        { day: "Day 1", step: "Set up 1 box per cat +1 in a quiet, low-traffic spot. Use unscented clumping litter, 3 inches deep." },
        { day: "Day 2-3", step: "Place kitten in box after meals and naps. Praise calmly if they dig or eliminate." },
        { day: "Day 4-7", step: "Scoop twice daily. Never punish accidents — clean with enzymatic cleaner to remove scent markers." },
        { day: "Week 2", step: "If accidents continue, add a second box near the accident location." },
        { day: "Week 3-4", step: "Slowly transition litter type if needed (mix 25% new / 75% old for 3 days, then 50/50, then 100%)." },
      ]
    : [
        { day: "Day 1", step: "Place a corner litter box inside the enclosure. Use paper-based litter (never clumping/clay)." },
        { day: "Day 2-3", step: "Add a handful of hay on top — rabbits naturally chew and poop while eating." },
        { day: "Day 4-7", step: "Move any stray droppings into the box to reinforce the scent location." },
        { day: "Week 2", step: "Once 80% of droppings land in the box, allow supervised free-roam." },
        { day: "Week 3+", step: "Spay/neuter around 4-6 months dramatically improves litter reliability." },
      ];
  return (
    <CalculatorLayout
      form={
        <div>
          <Label>Species</Label>
          <Select value={species} onValueChange={(v) => setSpecies(v as "cat" | "rabbit")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cat">Cat / kitten</SelectItem>
              <SelectItem value="rabbit">Rabbit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      result={
        <ul className="space-y-2">
          {plan.map((s) => (
            <li key={s.day} className="rounded-lg bg-background/60 p-3">
              <div className="font-medium">{s.day}</div>
              <p className="mt-1 text-xs text-muted-foreground">{s.step}</p>
            </li>
          ))}
          <li className="rounded-lg border border-amber-500/30 bg-amber-50/60 p-3 text-xs dark:bg-amber-950/20">
            Sudden loss of litter-box habits often signals a UTI, bladder stones, or arthritis. Any regression lasting more than 3 days warrants a vet visit.
          </li>
        </ul>
      }
    />
  );
}
