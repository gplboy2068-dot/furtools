import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";

const CARE_TASKS: Record<string, string[]> = {
  Feeding: ["Morning meal", "Evening meal", "Fresh water"],
  Exercise: ["Morning walk", "Evening walk", "Play session"],
  Grooming: ["Brush coat", "Check ears", "Clip nails"],
  Cleaning: ["Wash bowls", "Wash bedding", "Clean litter/potty area"],
  Training: ["Short training session", "Puzzle feeder"],
};

/* Display keys for group/task internal keys (internal keys stay stable; only display text is translated) */
const GROUP_KEY: Record<string, string> = {
  Feeding: "feeding",
  Exercise: "exercise",
  Grooming: "grooming",
  Cleaning: "cleaning",
  Training: "training",
};
const TASK_KEY: Record<string, string> = {
  "Morning meal": "morningMeal",
  "Evening meal": "eveningMeal",
  "Fresh water": "freshWater",
  "Morning walk": "morningWalk",
  "Evening walk": "eveningWalk",
  "Play session": "playSession",
  "Brush coat": "brushCoat",
  "Check ears": "checkEars",
  "Clip nails": "clipNails",
  "Wash bowls": "washBowls",
  "Wash bedding": "washBedding",
  "Clean litter/potty area": "cleanLitterPottyArea",
  "Short training session": "shortTrainingSession",
  "Puzzle feeder": "puzzleFeeder",
};

export function PetCarePlanner() {
  const { t } = useTranslation("tools");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    Feeding: true, Exercise: true, Grooming: true, Cleaning: true,
  });
  const groups = Object.entries(CARE_TASKS).filter(([g]) => enabled[g]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Object.keys(CARE_TASKS).map((g) => (
          <label key={g} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-sm">
            <Checkbox checked={!!enabled[g]} onCheckedChange={(v) => setEnabled((e) => ({ ...e, [g]: !!v }))} /> {t(`pet-care-planner.ui.${GROUP_KEY[g]}`)}
          </label>
        ))}
      </div>
      <div className="rounded-xl bg-cream-deep p-6">
        <div className="text-xs uppercase text-muted-foreground mb-4">{t("pet-care-planner.ui.weeklyPlan")}</div>
        <div className="grid gap-4 sm:grid-cols-2">
          {groups.map(([g, tasks]) => (
            <div key={g}>
              <div className="font-display text-lg font-semibold">{t(`pet-care-planner.ui.${GROUP_KEY[g]}`)}</div>
              <ul className="mt-2 space-y-1 text-sm">
                {tasks.map((task) => (
                  <li key={task} className="flex gap-2"><span className="text-primary">•</span>{t(`pet-care-planner.ui.${TASK_KEY[task]}`)}</li>
                ))}
              </ul>
            </div>
          ))}
          {groups.length === 0 && (
            <div className="text-sm text-muted-foreground">{t("pet-care-planner.ui.selectAtLeastOne")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
