// Shared veterinary formulas used by many calculators.

export function lbToKg(lb: number) {
  return lb / 2.2046;
}

export function kgToLb(kg: number) {
  return kg * 2.2046;
}

/** Resting Energy Requirement, kcal/day. */
export function rer(weightLb: number): number {
  const kg = lbToKg(weightLb);
  return 70 * Math.pow(Math.max(kg, 0.1), 0.75);
}

export type DogActivity = "low" | "moderate" | "active" | "working";
export type DogStage = "puppy" | "adult" | "senior";
export type CatActivity = "indoor" | "active" | "outdoor";
export type CatStage = "kitten" | "adult" | "senior";

export const DOG_ACTIVITY: Record<DogActivity, number> = {
  low: 1.2, moderate: 1.6, active: 2.0, working: 2.5,
};
export const DOG_STAGE: Record<DogStage, number> = { puppy: 2.0, adult: 1.0, senior: 0.9 };
export const CAT_ACTIVITY: Record<CatActivity, number> = { indoor: 1.0, active: 1.2, outdoor: 1.4 };
export const CAT_STAGE: Record<CatStage, number> = { kitten: 2.5, adult: 1.0, senior: 0.9 };

export function dogMER(weightLb: number, activity: DogActivity, stage: DogStage): number {
  return rer(weightLb) * DOG_ACTIVITY[activity] * DOG_STAGE[stage];
}
export function catMER(weightLb: number, activity: CatActivity, stage: CatStage): number {
  return rer(weightLb) * CAT_ACTIVITY[activity] * CAT_STAGE[stage];
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}
