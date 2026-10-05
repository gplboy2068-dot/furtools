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

export function WaterIntakeCalculator() {
  const { t } = useTranslation("tools");
  const [weight, setWeight] = useState(30);
  const [pet, setPet] = useState<"dog" | "cat">("dog");
  const [climate, setClimate] = useState<"cool" | "temperate" | "hot">("temperate");

  const ounces = useMemo(() => {
    const base = pet === "dog" ? weight * 1.0 : weight * 0.7; // oz per lb
    const factor = climate === "hot" ? 1.25 : climate === "cool" ? 0.9 : 1;
    return Math.round(base * factor);
  }, [weight, pet, climate]);

  const cups = (ounces / 8).toFixed(1);

  return (
    <CalculatorLayout
      form={
        <>
          <div>
            <Label htmlFor="pet">{t("shared.waterIntake.ui.petLabel")}</Label>
            <Select value={pet} onValueChange={(v: "dog" | "cat") => setPet(v)}>
              <SelectTrigger id="pet" className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">{t("shared.waterIntake.ui.petDog")}</SelectItem>
                <SelectItem value="cat">{t("shared.waterIntake.ui.petCat")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="weight-w">{t("shared.waterIntake.ui.weightLabel")}</Label>
            <Input id="weight-w" type="number" min={1} value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="climate">{t("shared.waterIntake.ui.climateLabel")}</Label>
            <Select value={climate} onValueChange={(v: "cool" | "temperate" | "hot") => setClimate(v)}>
              <SelectTrigger id="climate" className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cool">{t("shared.waterIntake.ui.climateCool")}</SelectItem>
                <SelectItem value="temperate">{t("shared.waterIntake.ui.climateTemperate")}</SelectItem>
                <SelectItem value="hot">{t("shared.waterIntake.ui.climateHot")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      }
      result={
        <div className="text-center">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("shared.waterIntake.ui.dailyWater")}</div>
          <div className="mt-2 font-display text-5xl font-semibold text-primary">{t("shared.waterIntake.ui.ouncesValue", { ounces })}</div>
          <div className="mt-1 text-sm text-muted-foreground">{t("shared.waterIntake.ui.cupsPerDay", { cups })}</div>
        </div>
      }
    />
  );
}
