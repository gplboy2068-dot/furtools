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

type Size = "small" | "medium" | "large" | "giant";

/**
 * Modern size-aware dog-age formula (approximation of the AVMA guideline):
 * y1 = 15, y2 = +9, then per size:
 *   small  +4/yr, medium +5/yr, large +6/yr, giant +7-8/yr
 */
function dogHumanYears(age: number, size: Size): number {
  if (age <= 0) return 0;
  const perYear: Record<Size, number> = { small: 4, medium: 5, large: 6, giant: 7.5 };
  if (age <= 1) return Math.round(15 * age);
  if (age <= 2) return Math.round(15 + 9 * (age - 1));
  return Math.round(24 + perYear[size] * (age - 2));
}

export function DogAgeCalculator() {
  const { t } = useTranslation(["tools", "common"]);
  const [age, setAge] = useState(3);
  const [size, setSize] = useState<Size>("medium");
  const years = useMemo(() => dogHumanYears(age, size), [age, size]);

  return (
    <CalculatorLayout
      form={
        <>
          <div>
            <Label htmlFor="dog-age">{t("tools:ageCalculator.dogAge", "Dog age (years)")}</Label>
            <Input
              id="dog-age"
              type="number"
              min={0}
              step={0.5}
              value={age}
              onChange={(e) => setAge(Number(e.target.value) || 0)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="dog-size">{t("tools:ageCalculator.size", "Size")}</Label>
            <Select value={size} onValueChange={(v: Size) => setSize(v)}>
              <SelectTrigger id="dog-size" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{t("tools:ageCalculator.small", "Small (under 20 lb)")}</SelectItem>
                <SelectItem value="medium">{t("tools:ageCalculator.medium", "Medium (20–50 lb)")}</SelectItem>
                <SelectItem value="large">{t("tools:ageCalculator.large", "Large (50–90 lb)")}</SelectItem>
                <SelectItem value="giant">{t("tools:ageCalculator.giant", "Giant (over 90 lb)")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      }
      result={
        <div className="text-center">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("tools:ageCalculator.inHumanYears", "In human years")}
          </div>
          <div className="mt-2 font-display text-6xl font-semibold text-primary">{years}</div>
          <div className="mt-2 text-sm text-muted-foreground">
            {t("tools:ageCalculator.basedOn", "Based on a {{size}} dog, {{age}} year(s) old.", { size: t(`tools:ageCalculator.${size}`, size), age })}
          </div>
        </div>
      }
    />
  );
}
