import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const CARE_TASKS: Record<string, string[]> = {
  Feeding: ["Morning meal", "Evening meal", "Fresh water"],
  Exercise: ["Morning walk", "Evening walk", "Play session"],
  Grooming: ["Brush coat", "Check ears", "Clip nails"],
  Cleaning: ["Wash bowls", "Wash bedding", "Clean litter/potty area"],
  Training: ["Short training session", "Puzzle feeder"],
};

export function PetCarePlanner() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    Feeding: true, Exercise: true, Grooming: true, Cleaning: true,
  });
  const groups = Object.entries(CARE_TASKS).filter(([g]) => enabled[g]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.keys(CARE_TASKS).map((g) => (
          <label key={g} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-sm">
            <Checkbox checked={!!enabled[g]} onCheckedChange={(v) => setEnabled((e) => ({ ...e, [g]: !!v }))} /> {g}
          </label>
        ))}
      </div>
      <div className="rounded-xl bg-cream-deep p-6">
        <div className="text-xs uppercase text-muted-foreground mb-4">Your weekly plan</div>
        <div className="grid gap-4 sm:grid-cols-2">
          {groups.map(([g, tasks]) => (
            <div key={g}>
              <div className="font-display text-lg font-semibold">{g}</div>
              <ul className="mt-2 space-y-1 text-sm">
                {tasks.map((t) => (
                  <li key={t} className="flex gap-2"><span className="text-primary">•</span>{t}</li>
                ))}
              </ul>
            </div>
          ))}
          {groups.length === 0 && (
            <div className="text-sm text-muted-foreground">Select at least one category above.</div>
          )}
        </div>
      </div>
    </div>
  );
}
