import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalculatorLayout } from "@/components/layouts/tool-layouts";

function catHumanYears(age: number): number {
  if (age <= 0) return 0;
  if (age <= 1) return Math.round(15 * age);
  if (age <= 2) return Math.round(15 + 9 * (age - 1));
  return Math.round(24 + 4 * (age - 2));
}

export function CatAgeCalculator() {
  const { t } = useTranslation(["tools", "common"]);
  const [age, setAge] = useState(3);
  const years = useMemo(() => catHumanYears(age), [age]);
  return (
    <CalculatorLayout
      form={
        <div>
          <Label htmlFor="cat-age">{t("tools:ageCalculator.catAge", "Cat age (years)")}</Label>
          <Input
            id="cat-age"
            type="number"
            min={0}
            step={0.5}
            value={age}
            onChange={(e) => setAge(Number(e.target.value) || 0)}
            className="mt-1.5"
          />
        </div>
      }
      result={
        <div className="text-center">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("tools:ageCalculator.inHumanYears", "In human years")}
          </div>
          <div className="mt-2 font-display text-6xl font-semibold text-primary">{years}</div>
          <div className="mt-2 text-sm text-muted-foreground">
            {t("tools:ageCalculator.catAgeSummary", "Your cat is {{age}} year(s) old.", { age })}
          </div>
        </div>
      }
    />
  );
}
