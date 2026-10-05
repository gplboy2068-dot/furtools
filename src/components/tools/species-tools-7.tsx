import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";
import { useTranslation } from "react-i18next";

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
export function ClickerTrainingPlanner() {
  const { t } = useTranslation("tools");
  const [sessionsPerDay, setSessionsPerDay] = useState(3);
  const phases = [
    { key: "charge", days: "1-3", name: t("clicker-training-planner.ui.phaseChargeName"), desc: t("clicker-training-planner.ui.phaseChargeDesc") },
    { key: "capture", days: "4-10", name: t("clicker-training-planner.ui.phaseCaptureName"), desc: t("clicker-training-planner.ui.phaseCaptureDesc") },
    { key: "lure", days: "11-20", name: t("clicker-training-planner.ui.phaseLureName"), desc: t("clicker-training-planner.ui.phaseLureDesc") },
    { key: "cue", days: "21-30", name: t("clicker-training-planner.ui.phaseCueName"), desc: t("clicker-training-planner.ui.phaseCueDesc") },
    { key: "proof", days: "31-45", name: t("clicker-training-planner.ui.phaseProofName"), desc: t("clicker-training-planner.ui.phaseProofDesc") },
    { key: "reduce", days: "46+", name: t("clicker-training-planner.ui.phaseReduceName"), desc: t("clicker-training-planner.ui.phaseReduceDesc") },
  ];
  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("clicker-training-planner.ui.sessionsLabel")}</Label>
        <Input type="number" min={1} max={6} value={sessionsPerDay} onChange={(e) => setSessionsPerDay(+e.target.value || 1)} />
        <p className="mt-1 text-xs text-muted-foreground">{t("clicker-training-planner.ui.sessionsHint")}</p>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      {phases.map((p) => (
        <div key={p.key} className="rounded-lg bg-background/60 p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">{p.name}</div>
            <span className="text-xs text-muted-foreground">{t("clicker-training-planner.ui.phaseDays", { days: p.days })}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
        </div>
      ))}
      <div className="rounded-lg bg-primary/10 p-3 text-xs">
        {t("clicker-training-planner.ui.totalSessions", { count: sessionsPerDay * 30 })}
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   2. POTTY TRAINING SCHEDULE
═══════════════════════════════════════════════════════════ */
export function PottyTrainingSchedule() {
  const { t } = useTranslation("tools");
  const [ageMonths, setAgeMonths] = useState(3);
  const [wakeHour, setWakeHour] = useState(7);
  const [bedHour, setBedHour] = useState(22);
  const plan = useMemo(() => {
    // Rule of thumb: puppies can hold roughly (age in months) hours, max 6-8.
    const holdHours = Math.max(1, Math.min(6, ageMonths));
    const outings: string[] = [];
    for (let h = wakeHour; h <= bedHour; h += holdHours) {
      outings.push(t("potty-training-schedule.ui.outing", { time: `${String(h).padStart(2, "0")}:00` }));
    }
    // Always add key trigger outings.
    return {
      holdHours,
      outings,
      triggers: [
        t("potty-training-schedule.ui.triggerWake"),
        t("potty-training-schedule.ui.triggerMeal"),
        t("potty-training-schedule.ui.triggerPlay"),
        t("potty-training-schedule.ui.triggerCrate"),
      ],
    };
  }, [ageMonths, wakeHour, bedHour, t]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("potty-training-schedule.ui.ageLabel")}</Label>
        <Input type="number" min={2} max={12} value={ageMonths} onChange={(e) => setAgeMonths(+e.target.value || 2)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>{t("potty-training-schedule.ui.wakeLabel")}</Label>
          <Input type="number" min={4} max={11} value={wakeHour} onChange={(e) => setWakeHour(+e.target.value || 7)} />
        </div>
        <div>
          <Label>{t("potty-training-schedule.ui.bedLabel")}</Label>
          <Input type="number" min={18} max={24} value={bedHour} onChange={(e) => setBedHour(+e.target.value || 22)} />
        </div>
      </div>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-primary/10 p-3 text-sm">
        {t("potty-training-schedule.ui.bladderCapacity", { hours: plan.holdHours })}
      </div>
      <div className="rounded-lg bg-background/60 p-3">
        <div className="font-medium">{t("potty-training-schedule.ui.scheduledTitle")}</div>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {plan.outings.map((o) => <li key={o}>{o}</li>)}
        </ul>
      </div>
      <div className="rounded-lg bg-background/60 p-3">
        <div className="font-medium">{t("potty-training-schedule.ui.triggersTitle")}</div>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {plan.triggers.map((trig) => <li key={trig}>• {trig}</li>)}
        </ul>
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   3. CRATE TRAINING TIMELINE
═══════════════════════════════════════════════════════════ */
export function CrateTrainingTimeline() {
  const { t } = useTranslation("tools");
  const timeline = [
    { key: "d12", day: t("crate-training-timeline.ui.day12"), goal: t("crate-training-timeline.ui.goalIntroduce"), detail: t("crate-training-timeline.ui.detailIntroduce") },
    { key: "d34", day: t("crate-training-timeline.ui.day34"), goal: t("crate-training-timeline.ui.goalMeals"), detail: t("crate-training-timeline.ui.detailMeals") },
    { key: "d57", day: t("crate-training-timeline.ui.day57"), goal: t("crate-training-timeline.ui.goalCloseDoor"), detail: t("crate-training-timeline.ui.detailCloseDoor") },
    { key: "d810", day: t("crate-training-timeline.ui.day810"), goal: t("crate-training-timeline.ui.goalStays"), detail: t("crate-training-timeline.ui.detailStays") },
    { key: "d1114", day: t("crate-training-timeline.ui.day1114"), goal: t("crate-training-timeline.ui.goalLeave"), detail: t("crate-training-timeline.ui.detailLeave") },
    { key: "d1521", day: t("crate-training-timeline.ui.day1521"), goal: t("crate-training-timeline.ui.goalAbsences"), detail: t("crate-training-timeline.ui.detailAbsences") },
    { key: "d22p", day: t("crate-training-timeline.ui.day22p"), goal: t("crate-training-timeline.ui.goalOvernight"), detail: t("crate-training-timeline.ui.detailOvernight") },
  ];
  return (
    <CalculatorLayout
      form={<p className="text-sm text-muted-foreground">{t("crate-training-timeline.ui.intro")}</p>}
      result={
        <div className="space-y-2">
          {timeline.map((s) => (
            <div key={s.key} className="rounded-lg bg-background/60 p-3">
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
export function LeashTrainingProgress() {
  const { t } = useTranslation("tools");
  const milestones = [
    t("leash-training-progress.ui.m1"),
    t("leash-training-progress.ui.m2"),
    t("leash-training-progress.ui.m3"),
    t("leash-training-progress.ui.m4"),
    t("leash-training-progress.ui.m5"),
    t("leash-training-progress.ui.m6"),
    t("leash-training-progress.ui.m7"),
    t("leash-training-progress.ui.m8"),
    t("leash-training-progress.ui.m9"),
    t("leash-training-progress.ui.m10"),
  ];
  const [done, setDone] = useLocalState<Record<string, boolean>>("furtools:leash-progress", {});
  const completed = milestones.filter((m) => done[m]).length;
  const pct = Math.round((completed / milestones.length) * 100);
  return (
    <CalculatorLayout
      form={<p className="text-sm text-muted-foreground">{t("leash-training-progress.ui.intro")}</p>}
      result={
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/10 p-3 text-center">
            <div className="text-3xl font-bold text-primary">{t("leash-training-progress.ui.percent", { pct })}</div>
            <div className="text-xs text-muted-foreground">{t("leash-training-progress.ui.progress", { completed, total: milestones.length })}</div>
          </div>
          <ul className="space-y-2">
            {milestones.map((m, i) => (
              <li key={m} className="flex items-start gap-3 rounded-lg bg-background/60 p-3">
                <Checkbox id={`ls-${i}`} checked={!!done[m]} onCheckedChange={(v) => setDone((p) => ({ ...p, [m]: !!v }))} />
                <label htmlFor={`ls-${i}`} className="text-sm">{t("leash-training-progress.ui.milestoneLabel", { n: i + 1, label: m })}</label>
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
  const { t } = useTranslation("tools");
  const envOptions = [
    { value: "Indoors", label: t("recall-training-tracker.ui.envIndoors") },
    { value: "Yard", label: t("recall-training-tracker.ui.envYard") },
    { value: "Quiet park", label: t("recall-training-tracker.ui.envQuietPark") },
    { value: "Busy park", label: t("recall-training-tracker.ui.envBusyPark") },
    { value: "Off-leash trail", label: t("recall-training-tracker.ui.envTrail") },
  ];
  const [logs, setLogs] = useLocalState<RecallLog[]>("furtools:recall-log", []);
  const [env, setEnv] = useState("Yard");
  const [success, setSuccess] = useState(8);
  const [total, setTotal] = useState(10);
  const add = () => setLogs((p) => [{ date: new Date().toISOString().slice(0, 10), env, success, total }, ...p].slice(0, 30));
  const remove = (i: number) => setLogs((p) => p.filter((_, idx) => idx !== i));
  const overall = useMemo(() => {
    if (!logs.length) return 0;
    const s = logs.reduce((a, l) => a + l.success, 0);
    const tot = logs.reduce((a, l) => a + l.total, 0);
    return tot ? Math.round((s / tot) * 100) : 0;
  }, [logs]);

  const form = (
    <div className="space-y-4">
      <div>
        <Label>{t("recall-training-tracker.ui.envLabel")}</Label>
        <Select value={env} onValueChange={setEnv}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {envOptions.map((e) => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>{t("recall-training-tracker.ui.successesLabel")}</Label><Input type="number" min={0} value={success} onChange={(e) => setSuccess(+e.target.value || 0)} /></div>
        <div><Label>{t("recall-training-tracker.ui.attemptsLabel")}</Label><Input type="number" min={1} value={total} onChange={(e) => setTotal(+e.target.value || 1)} /></div>
      </div>
      <Button onClick={add} className="w-full">{t("recall-training-tracker.ui.logButton")}</Button>
    </div>
  );
  const result = (
    <div className="space-y-3">
      <div className="rounded-lg bg-primary/10 p-3 text-center">
        <div className="text-3xl font-bold text-primary">{t("recall-training-tracker.ui.percent", { pct: overall })}</div>
        <div className="text-xs text-muted-foreground">{t("recall-training-tracker.ui.overallLabel", { count: logs.length })}</div>
        <p className="mt-2 text-xs text-muted-foreground">{t("recall-training-tracker.ui.targetHint")}</p>
      </div>
      <ul className="space-y-2">
        {logs.length === 0 && <li className="text-xs text-muted-foreground">{t("recall-training-tracker.ui.emptyState")}</li>}
        {logs.map((l, i) => (
          <li key={i} className="flex items-center justify-between rounded-lg bg-background/60 p-2 text-xs">
            <span>{l.date} · {l.env}: <b>{l.success}/{l.total}</b> {t("recall-training-tracker.ui.sessionPct", { pct: Math.round((l.success / l.total) * 100) })}</span>
            <Button size="sm" variant="ghost" onClick={() => remove(i)}>{t("recall-training-tracker.ui.removeButton")}</Button>
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
export function SocializationChecklist() {
  const { t } = useTranslation("tools");
  const groups = [
    { title: t("socialization-checklist.ui.groupPeople"), items: [
      t("socialization-checklist.ui.people1"), t("socialization-checklist.ui.people2"), t("socialization-checklist.ui.people3"),
      t("socialization-checklist.ui.people4"), t("socialization-checklist.ui.people5"), t("socialization-checklist.ui.people6"),
      t("socialization-checklist.ui.people7"),
    ] },
    { title: t("socialization-checklist.ui.groupAnimals"), items: [
      t("socialization-checklist.ui.animals1"), t("socialization-checklist.ui.animals2"), t("socialization-checklist.ui.animals3"),
      t("socialization-checklist.ui.animals4"), t("socialization-checklist.ui.animals5"),
    ] },
    { title: t("socialization-checklist.ui.groupEnvironments"), items: [
      t("socialization-checklist.ui.env1"), t("socialization-checklist.ui.env2"), t("socialization-checklist.ui.env3"),
      t("socialization-checklist.ui.env4"), t("socialization-checklist.ui.env5"), t("socialization-checklist.ui.env6"),
      t("socialization-checklist.ui.env7"),
    ] },
    { title: t("socialization-checklist.ui.groupSurfaces"), items: [
      t("socialization-checklist.ui.surfaces1"), t("socialization-checklist.ui.surfaces2"), t("socialization-checklist.ui.surfaces3"),
      t("socialization-checklist.ui.surfaces4"), t("socialization-checklist.ui.surfaces5"), t("socialization-checklist.ui.surfaces6"),
      t("socialization-checklist.ui.surfaces7"),
    ] },
    { title: t("socialization-checklist.ui.groupHandling"), items: [
      t("socialization-checklist.ui.handling1"), t("socialization-checklist.ui.handling2"), t("socialization-checklist.ui.handling3"),
      t("socialization-checklist.ui.handling4"), t("socialization-checklist.ui.handling5"), t("socialization-checklist.ui.handling6"),
    ] },
  ];
  const [done, setDone] = useLocalState<Record<string, boolean>>("furtools:socialization", {});
  const all = groups.flatMap((g) => g.items);
  const completed = all.filter((i) => done[i]).length;
  const pct = Math.round((completed / all.length) * 100);
  return (
    <CalculatorLayout
      form={<p className="text-sm text-muted-foreground">{t("socialization-checklist.ui.intro")}</p>}
      result={
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/10 p-3 text-center">
            <div className="text-3xl font-bold text-primary">{t("socialization-checklist.ui.percent", { pct })}</div>
            <div className="text-xs text-muted-foreground">{t("socialization-checklist.ui.progress", { completed, total: all.length })}</div>
          </div>
          {groups.map((g) => (
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
export function PuppyMilestoneTracker() {
  const { t } = useTranslation("tools");
  const milestones = [
    { week: 3, label: t("puppy-milestone-tracker.ui.w3") },
    { week: 4, label: t("puppy-milestone-tracker.ui.w4") },
    { week: 6, label: t("puppy-milestone-tracker.ui.w6") },
    { week: 8, label: t("puppy-milestone-tracker.ui.w8") },
    { week: 10, label: t("puppy-milestone-tracker.ui.w10") },
    { week: 12, label: t("puppy-milestone-tracker.ui.w12") },
    { week: 16, label: t("puppy-milestone-tracker.ui.w16") },
    { week: 20, label: t("puppy-milestone-tracker.ui.w20") },
    { week: 26, label: t("puppy-milestone-tracker.ui.w26") },
    { week: 52, label: t("puppy-milestone-tracker.ui.w52") },
  ];
  const [done, setDone] = useLocalState<Record<string, boolean>>("furtools:puppy-milestones", {});
  return (
    <CalculatorLayout
      form={<p className="text-sm text-muted-foreground">{t("puppy-milestone-tracker.ui.intro")}</p>}
      result={
        <ul className="space-y-2">
          {milestones.map((s) => (
            <li key={s.week} className="flex items-start gap-3 rounded-lg bg-background/60 p-3">
              <Checkbox id={`pm-${s.week}`} checked={!!done[String(s.week)]} onCheckedChange={(v) => setDone((p) => ({ ...p, [String(s.week)]: !!v }))} />
              <label htmlFor={`pm-${s.week}`} className="text-sm">
                <span className="font-medium">{t("puppy-milestone-tracker.ui.weekLabel", { week: s.week })}</span> {s.label}
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
export function AggressionRiskAssessment() {
  const { t } = useTranslation("tools");
  const questions = [
    t("aggression-risk-assessment.ui.q1"),
    t("aggression-risk-assessment.ui.q2"),
    t("aggression-risk-assessment.ui.q3"),
    t("aggression-risk-assessment.ui.q4"),
    t("aggression-risk-assessment.ui.q5"),
    t("aggression-risk-assessment.ui.q6"),
    t("aggression-risk-assessment.ui.q7"),
    t("aggression-risk-assessment.ui.q8"),
  ];
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const score = Object.values(answers).filter(Boolean).length;
  const risk = score === 0 ? t("aggression-risk-assessment.ui.riskLow") : score <= 2 ? t("aggression-risk-assessment.ui.riskModerate") : score <= 4 ? t("aggression-risk-assessment.ui.riskHigh") : t("aggression-risk-assessment.ui.riskVeryHigh");
  const color = score === 0 ? "text-emerald-600" : score <= 2 ? "text-amber-600" : "text-red-600";
  const form = (
    <div className="space-y-3">
      {questions.map((q) => (
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
        <div className="text-sm text-muted-foreground">{t("aggression-risk-assessment.ui.riskScoreLabel")}</div>
        <div className={`text-3xl font-bold ${color}`}>{t("aggression-risk-assessment.ui.scoreValue", { score, total: questions.length })}</div>
        <div className="mt-1 text-sm font-medium">{risk}</div>
      </div>
      <div className="rounded-lg border border-red-500/30 bg-red-50/60 p-3 text-xs dark:bg-red-950/20">
        {t("aggression-risk-assessment.ui.safetyNote")}
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   9. SEPARATION ANXIETY SCORE
═══════════════════════════════════════════════════════════ */
export function SeparationAnxietyScore() {
  const { t } = useTranslation("tools");
  const questions = [
    t("separation-anxiety-score.ui.q1"),
    t("separation-anxiety-score.ui.q2"),
    t("separation-anxiety-score.ui.q3"),
    t("separation-anxiety-score.ui.q4"),
    t("separation-anxiety-score.ui.q5"),
    t("separation-anxiety-score.ui.q6"),
    t("separation-anxiety-score.ui.q7"),
    t("separation-anxiety-score.ui.q8"),
  ];
  const freqOptions = [
    { val: 0, label: t("separation-anxiety-score.ui.freqNever") },
    { val: 1, label: t("separation-anxiety-score.ui.freqSometimes") },
    { val: 2, label: t("separation-anxiety-score.ui.freqOften") },
    { val: 3, label: t("separation-anxiety-score.ui.freqAlways") },
  ];
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  const max = SEP_QUESTIONS.length * 3;
  const pct = Math.round((total / max) * 100);
  const band = pct < 20 ? t("separation-anxiety-score.ui.bandMinimal") : pct < 40 ? t("separation-anxiety-score.ui.bandMild") : pct < 65 ? t("separation-anxiety-score.ui.bandModerate") : t("separation-anxiety-score.ui.bandSevere");
  const color = pct < 20 ? "text-emerald-600" : pct < 40 ? "text-yellow-600" : pct < 65 ? "text-orange-600" : "text-red-600";
  const form = (
    <div className="space-y-3">
      {questions.map((q) => (
        <div key={q} className="rounded-lg bg-background/60 p-3">
          <div className="mb-2 text-sm">{q}</div>
          <div className="flex gap-2">
            {freqOptions.map(({ val, label }) => (
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
        <div className="text-sm text-muted-foreground">{t("separation-anxiety-score.ui.scoreLabel")}</div>
        <div className={`text-3xl font-bold ${color}`}>{t("separation-anxiety-score.ui.percent", { pct })}</div>
        <div className="mt-1 font-medium">{band}</div>
      </div>
      <div className="rounded-lg bg-background/60 p-3 text-xs text-muted-foreground">
        {t("separation-anxiety-score.ui.adviceNote")}
      </div>
    </div>
  );
  return <CalculatorLayout form={form} result={result} />;
}

/* ═══════════════════════════════════════════════════════════
   10. TRICK TRAINING LIBRARY
═══════════════════════════════════════════════════════════ */
export function TrickTrainingLibrary() {
  const { t } = useTranslation("tools");
  const tricks = [
    { key: "sit", level: "Beginner", name: t("trick-training-library.ui.trickSitName"), steps: t("trick-training-library.ui.trickSitSteps") },
    { key: "down", level: "Beginner", name: t("trick-training-library.ui.trickDownName"), steps: t("trick-training-library.ui.trickDownSteps") },
    { key: "shake", level: "Beginner", name: t("trick-training-library.ui.trickShakeName"), steps: t("trick-training-library.ui.trickShakeSteps") },
    { key: "spin", level: "Beginner", name: t("trick-training-library.ui.trickSpinName"), steps: t("trick-training-library.ui.trickSpinSteps") },
    { key: "rollover", level: "Intermediate", name: t("trick-training-library.ui.trickRolloverName"), steps: t("trick-training-library.ui.trickRolloverSteps") },
    { key: "bow", level: "Intermediate", name: t("trick-training-library.ui.trickBowName"), steps: t("trick-training-library.ui.trickBowSteps") },
    { key: "speak", level: "Intermediate", name: t("trick-training-library.ui.trickSpeakName"), steps: t("trick-training-library.ui.trickSpeakSteps") },
    { key: "fetch", level: "Intermediate", name: t("trick-training-library.ui.trickFetchName"), steps: t("trick-training-library.ui.trickFetchSteps") },
    { key: "weave", level: "Advanced", name: t("trick-training-library.ui.trickWeaveName"), steps: t("trick-training-library.ui.trickWeaveSteps") },
    { key: "playdead", level: "Advanced", name: t("trick-training-library.ui.trickPlaydeadName"), steps: t("trick-training-library.ui.trickPlaydeadSteps") },
    { key: "tidy", level: "Advanced", name: t("trick-training-library.ui.trickTidyName"), steps: t("trick-training-library.ui.trickTidySteps") },
  ];
  const levelLabels: Record<string, string> = {
    Beginner: t("trick-training-library.ui.levelBeginner"),
    Intermediate: t("trick-training-library.ui.levelIntermediate"),
    Advanced: t("trick-training-library.ui.levelAdvanced"),
  };
  const [level, setLevel] = useState<string>("all");
  const list = level === "all" ? tricks : tricks.filter((x) => x.level === level);
  return (
    <CalculatorLayout
      form={
        <div>
          <Label>{t("trick-training-library.ui.difficultyLabel")}</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[["all", t("trick-training-library.ui.levelAll")], ["Beginner", levelLabels.Beginner], ["Intermediate", levelLabels.Intermediate], ["Advanced", levelLabels.Advanced]].map(([v, label]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      }
      result={
        <ul className="space-y-2">
          {list.map((tr) => (
            <li key={tr.key} className="rounded-lg bg-background/60 p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{tr.name}</div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs">{levelLabels[tr.level]}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{tr.steps}</p>
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
export function CommandVocabularyBuilder() {
  const { t } = useTranslation("tools");
  const starter: Command[] = [
    { word: t("command-vocabulary-builder.ui.cmdSitWord"), meaning: t("command-vocabulary-builder.ui.cmdSitMeaning"), learned: false },
    { word: t("command-vocabulary-builder.ui.cmdDownWord"), meaning: t("command-vocabulary-builder.ui.cmdDownMeaning"), learned: false },
    { word: t("command-vocabulary-builder.ui.cmdComeWord"), meaning: t("command-vocabulary-builder.ui.cmdComeMeaning"), learned: false },
    { word: t("command-vocabulary-builder.ui.cmdStayWord"), meaning: t("command-vocabulary-builder.ui.cmdStayMeaning"), learned: false },
    { word: t("command-vocabulary-builder.ui.cmdLeaveWord"), meaning: t("command-vocabulary-builder.ui.cmdLeaveMeaning"), learned: false },
  ];
  const [list, setList] = useLocalState<Command[]>("furtools:vocab", starter);
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
          <div><Label>{t("command-vocabulary-builder.ui.wordLabel")}</Label><Input value={word} onChange={(e) => setWord(e.target.value)} placeholder={t("command-vocabulary-builder.ui.wordPlaceholder")} /></div>
          <div><Label>{t("command-vocabulary-builder.ui.meaningLabel")}</Label><Input value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder={t("command-vocabulary-builder.ui.meaningPlaceholder")} /></div>
          <Button onClick={add} className="w-full">{t("command-vocabulary-builder.ui.addButton")}</Button>
        </div>
      }
      result={
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/10 p-3 text-center">
            <div className="text-3xl font-bold text-primary">{learned}</div>
            <div className="text-xs text-muted-foreground">{t("command-vocabulary-builder.ui.mastered", { total: list.length })}</div>
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
  const { t } = useTranslation("tools");
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
          <div><Label>{t("behavior-journal.ui.dateLabel")}</Label><Input type="date" value={e.date} onChange={(ev) => setE({ ...e, date: ev.target.value })} /></div>
          <div><Label>{t("behavior-journal.ui.triggerLabel")}</Label><Input value={e.trigger} onChange={(ev) => setE({ ...e, trigger: ev.target.value })} placeholder={t("behavior-journal.ui.triggerPlaceholder")} /></div>
          <div><Label>{t("behavior-journal.ui.behaviorLabel")}</Label><Input value={e.behavior} onChange={(ev) => setE({ ...e, behavior: ev.target.value })} placeholder={t("behavior-journal.ui.behaviorPlaceholder")} /></div>
          <div><Label>{t("behavior-journal.ui.responseLabel")}</Label><Input value={e.response} onChange={(ev) => setE({ ...e, response: ev.target.value })} placeholder={t("behavior-journal.ui.responsePlaceholder")} /></div>
          <div><Label>{t("behavior-journal.ui.notesLabel")}</Label><Textarea rows={2} value={e.notes} onChange={(ev) => setE({ ...e, notes: ev.target.value })} /></div>
          <Button onClick={add} className="w-full">{t("behavior-journal.ui.saveButton")}</Button>
        </div>
      }
      result={
        <div className="space-y-2">
          {entries.length === 0 && <p className="text-xs text-muted-foreground">{t("behavior-journal.ui.emptyState")}</p>}
          {entries.map((en, i) => (
            <div key={i} className="rounded-lg bg-background/60 p-3 text-sm">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{en.date}</span>
                <Button size="sm" variant="ghost" onClick={() => remove(i)}>{t("behavior-journal.ui.removeButton")}</Button>
              </div>
              <div className="mt-1"><b>{t("behavior-journal.ui.triggerPrefix")}</b> {en.trigger || "—"}</div>
              <div><b>{t("behavior-journal.ui.behaviorPrefix")}</b> {en.behavior}</div>
              <div><b>{t("behavior-journal.ui.responsePrefix")}</b> {en.response || "—"}</div>
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
  const { t } = useTranslation("tools");
  const [stage, setStage] = useState<"acquisition" | "fluency" | "generalization" | "maintenance">("acquisition");
  const plan = {
    acquisition: { schedule: t("reward-schedule-calculator.ui.scheduleAcquisition"), ratio: t("reward-schedule-calculator.ui.ratioAcquisition"), note: t("reward-schedule-calculator.ui.noteAcquisition") },
    fluency: { schedule: t("reward-schedule-calculator.ui.scheduleFluency"), ratio: t("reward-schedule-calculator.ui.ratioFluency"), note: t("reward-schedule-calculator.ui.noteFluency") },
    generalization: { schedule: t("reward-schedule-calculator.ui.scheduleGeneralization"), ratio: t("reward-schedule-calculator.ui.ratioGeneralization"), note: t("reward-schedule-calculator.ui.noteGeneralization") },
    maintenance: { schedule: t("reward-schedule-calculator.ui.scheduleMaintenance"), ratio: t("reward-schedule-calculator.ui.ratioMaintenance"), note: t("reward-schedule-calculator.ui.noteMaintenance") },
  }[stage];
  return (
    <CalculatorLayout
      form={
        <div>
          <Label>{t("reward-schedule-calculator.ui.stageLabel")}</Label>
          <Select value={stage} onValueChange={(v) => setStage(v as typeof stage)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="acquisition">{t("reward-schedule-calculator.ui.stageAcquisition")}</SelectItem>
              <SelectItem value="fluency">{t("reward-schedule-calculator.ui.stageFluency")}</SelectItem>
              <SelectItem value="generalization">{t("reward-schedule-calculator.ui.stageGeneralization")}</SelectItem>
              <SelectItem value="maintenance">{t("reward-schedule-calculator.ui.stageMaintenance")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      result={
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/10 p-4">
            <div className="text-sm text-muted-foreground">{t("reward-schedule-calculator.ui.scheduleTitle")}</div>
            <div className="text-xl font-semibold text-primary">{plan.schedule}</div>
            <div className="mt-1 text-xs text-muted-foreground">{t("reward-schedule-calculator.ui.rewardRatioLabel")}: <b>{plan.ratio}</b></div>
          </div>
          <p className="rounded-lg bg-background/60 p-3 text-sm">{plan.note}</p>
          <div className="rounded-lg bg-background/60 p-3 text-xs text-muted-foreground">
            {t("reward-schedule-calculator.ui.ruleNote")}
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
  const { t } = useTranslation("tools");
  const triggerOptions = [
    { value: "Doorbell", label: t("barking-log.ui.triggerDoorbell") },
    { value: "Stranger passing", label: t("barking-log.ui.triggerStranger") },
    { value: "Other dog", label: t("barking-log.ui.triggerDog") },
    { value: "Noise outside", label: t("barking-log.ui.triggerNoise") },
    { value: "Alone/anxious", label: t("barking-log.ui.triggerAlone") },
    { value: "Attention seeking", label: t("barking-log.ui.triggerAttention") },
    { value: "Other", label: t("barking-log.ui.triggerOther") },
  ];
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
            <Label>{t("barking-log.ui.triggerLabel")}</Label>
            <Select value={trigger} onValueChange={setTrigger}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {triggerOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div><Label>{t("barking-log.ui.durationLabel")}</Label><Input type="number" min={0} value={duration} onChange={(e) => setDuration(+e.target.value || 0)} /></div>
          <Button onClick={add} className="w-full">{t("barking-log.ui.logButton")}</Button>
        </div>
      }
      result={
        <div className="space-y-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <div className="text-xs text-muted-foreground">{t("barking-log.ui.topTitle")}</div>
            {summary.top.length === 0 ? (
              <div className="text-sm text-muted-foreground">{t("barking-log.ui.emptyTop")}</div>
            ) : (
              <ul className="mt-1 space-y-1 text-sm">
                {summary.top.map(([trig, n]) => <li key={trig}>• <b>{trig}</b>{t("barking-log.ui.events", { n })}</li>)}
              </ul>
            )}
            <div className="mt-2 text-xs text-muted-foreground">{t("barking-log.ui.totalLoggedLabel")}: <b>{t("barking-log.ui.totalMinutes", { minutes: summary.totalMinutes })}</b></div>
          </div>
          <ul className="space-y-2">
            {logs.slice(0, 15).map((l, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-background/60 p-2 text-xs">
                <span>{t("barking-log.ui.logEntry", { date: l.date, time: l.time, trigger: l.trigger, duration: l.duration })}</span>
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
  const { t } = useTranslation("tools");
  const [species, setSpecies] = useState<"cat" | "rabbit">("cat");
  const plan = species === "cat"
    ? [
        { day: t("litter-training-planner.ui.catDay1"), step: t("litter-training-planner.ui.catStep1") },
        { day: t("litter-training-planner.ui.catDay23"), step: t("litter-training-planner.ui.catStep23") },
        { day: t("litter-training-planner.ui.catDay47"), step: t("litter-training-planner.ui.catStep47") },
        { day: t("litter-training-planner.ui.catWeek2"), step: t("litter-training-planner.ui.catStepW2") },
        { day: t("litter-training-planner.ui.catWeek34"), step: t("litter-training-planner.ui.catStepW34") },
      ]
    : [
        { day: t("litter-training-planner.ui.rabbitDay1"), step: t("litter-training-planner.ui.rabbitStep1") },
        { day: t("litter-training-planner.ui.rabbitDay23"), step: t("litter-training-planner.ui.rabbitStep23") },
        { day: t("litter-training-planner.ui.rabbitDay47"), step: t("litter-training-planner.ui.rabbitStep47") },
        { day: t("litter-training-planner.ui.rabbitWeek2"), step: t("litter-training-planner.ui.rabbitStepW2") },
        { day: t("litter-training-planner.ui.rabbitWeek3p"), step: t("litter-training-planner.ui.rabbitStepW3p") },
      ];
  return (
    <CalculatorLayout
      form={
        <div>
          <Label>{t("litter-training-planner.ui.speciesLabel")}</Label>
          <Select value={species} onValueChange={(v) => setSpecies(v as "cat" | "rabbit")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cat">{t("litter-training-planner.ui.speciesCat")}</SelectItem>
              <SelectItem value="rabbit">{t("litter-training-planner.ui.speciesRabbit")}</SelectItem>
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
            {t("litter-training-planner.ui.vetNote")}
          </li>
        </ul>
      }
    />
  );
}
