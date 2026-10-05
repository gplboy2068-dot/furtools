import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";

type Activity = "low" | "moderate" | "active" | "working";
type Stage = "puppy" | "adult" | "senior";

const activityMultiplier: Record<Activity, number> = {
  low: 1.2,
  moderate: 1.6,
  active: 2.0,
  working: 2.5,
};

const stageAdjustment: Record<Stage, number> = {
  puppy: 2.0,
  adult: 1.0,
  senior: 0.9,
};

const NS = "dog-food-calculator";

export function DogFoodCalculator() {
  const { t } = useTranslation("tools");
  const [weight, setWeight] = useState(30); // lb
  const [activity, setActivity] = useState<Activity>("moderate");
  const [stage, setStage] = useState<Stage>("adult");
  const [caloriesPerCup, setCaloriesPerCup] = useState(350);

  const { rer, mer, cups } = useMemo(() => {
    const kg = weight / 2.2046;
    const rer = 70 * Math.pow(kg, 0.75);
    const mer = rer * activityMultiplier[activity] * stageAdjustment[stage];
    const cups = caloriesPerCup > 0 ? mer / caloriesPerCup : 0;
    return { rer: Math.round(rer), mer: Math.round(mer), cups: cups.toFixed(2) };
  }, [weight, activity, stage, caloriesPerCup]);

  return (
    <CalculatorLayout
      form={
        <>
          <div>
            <Label htmlFor="weight">{t(`${NS}.ui.weightLabel`)}</Label>
            <Input
              id="weight"
              type="number"
              min={1}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value) || 0)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="activity">{t(`${NS}.ui.activityLabel`)}</Label>
            <Select value={activity} onValueChange={(v: Activity) => setActivity(v)}>
              <SelectTrigger id="activity" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t(`${NS}.ui.activityLow`)}</SelectItem>
                <SelectItem value="moderate">{t(`${NS}.ui.activityModerate`)}</SelectItem>
                <SelectItem value="active">{t(`${NS}.ui.activityActive`)}</SelectItem>
                <SelectItem value="working">{t(`${NS}.ui.activityWorking`)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="stage">{t(`${NS}.ui.stageLabel`)}</Label>
            <Select value={stage} onValueChange={(v: Stage) => setStage(v)}>
              <SelectTrigger id="stage" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="puppy">{t(`${NS}.ui.stagePuppy`)}</SelectItem>
                <SelectItem value="adult">{t(`${NS}.ui.stageAdult`)}</SelectItem>
                <SelectItem value="senior">{t(`${NS}.ui.stageSenior`)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="kcal">{t(`${NS}.ui.kcalLabel`)}</Label>
            <Input
              id="kcal"
              type="number"
              min={1}
              value={caloriesPerCup}
              onChange={(e) => setCaloriesPerCup(Number(e.target.value) || 0)}
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {t(`${NS}.ui.kcalHint`)}
            </p>
          </div>
        </>
      }
      result={
        <div className="space-y-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t(`${NS}.ui.resultEyebrow`)}
            </div>
            <div className="mt-1 font-display text-5xl font-semibold text-primary">{cups}</div>
            <div className="text-sm text-muted-foreground">{t(`${NS}.ui.cupsPerDay`)}</div>
          </div>
          <dl className="grid grid-cols-2 gap-3 border-t border-border/50 pt-4 text-sm">
            <div>
              <dt className="text-muted-foreground">{t(`${NS}.ui.maintenanceKcal`)}</dt>
              <dd className="font-medium">{t(`${NS}.ui.kcalPerDay`, { kcal: mer })}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t(`${NS}.ui.restingKcal`)}</dt>
              <dd className="font-medium">{t(`${NS}.ui.kcalPerDay`, { kcal: rer })}</dd>
            </div>
          </dl>
        </div>
      }
    />
  );
}
