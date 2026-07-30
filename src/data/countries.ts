// Country-specific pet cost baselines. Monthly USD-equivalent midpoints for a medium-sized dog
// (multipliers apply to species and size in the UI). Sourced from public consumer-pet surveys.

export interface CountryCost {
  slug: string;
  name: string;
  currency: string;
  currencySymbol: string;
  fxToLocal: number; // multiply USD by this to display native currency
  monthly: {
    food: number;
    insurance: number;
    vet: number;
    vaccines: number;
    toys: number;
    training: number;
    grooming: number;
    travel: number;
  };
  oneTime: {
    adoption: number;
    supplies: number;
    spayNeuter: number;
  };
  notes: string;
}

export const COUNTRIES: CountryCost[] = [
  {
    slug: "usa",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    fxToLocal: 1,
    monthly: { food: 60, insurance: 45, vet: 40, vaccines: 15, toys: 15, training: 25, grooming: 40, travel: 20 },
    oneTime: { adoption: 300, supplies: 400, spayNeuter: 250 },
    notes: "Insurance is optional but common. Vet costs vary widely by state.",
  },
  {
    slug: "canada",
    name: "Canada",
    currency: "CAD",
    currencySymbol: "$",
    fxToLocal: 1.36,
    monthly: { food: 55, insurance: 40, vet: 45, vaccines: 15, toys: 15, training: 25, grooming: 45, travel: 20 },
    oneTime: { adoption: 350, supplies: 400, spayNeuter: 300 },
    notes: "Urban vet clinics (Toronto, Vancouver) trend 20-30% higher.",
  },
  {
    slug: "uk",
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    fxToLocal: 0.79,
    monthly: { food: 45, insurance: 30, vet: 35, vaccines: 10, toys: 12, training: 20, grooming: 35, travel: 15 },
    oneTime: { adoption: 200, supplies: 350, spayNeuter: 200 },
    notes: "Pet insurance is more common in the UK; PDSA/RSPCA offer low-cost vet care.",
  },
  {
    slug: "australia",
    name: "Australia",
    currency: "AUD",
    currencySymbol: "$",
    fxToLocal: 1.52,
    monthly: { food: 60, insurance: 40, vet: 50, vaccines: 15, toys: 15, training: 30, grooming: 45, travel: 20 },
    oneTime: { adoption: 400, supplies: 500, spayNeuter: 400 },
    notes: "Import restrictions and vet fees run high; council registration required.",
  },
  {
    slug: "germany",
    name: "Germany",
    currency: "EUR",
    currencySymbol: "€",
    fxToLocal: 0.93,
    monthly: { food: 40, insurance: 25, vet: 30, vaccines: 10, toys: 10, training: 20, grooming: 30, travel: 15 },
    oneTime: { adoption: 250, supplies: 350, spayNeuter: 250 },
    notes: "Dog tax (Hundesteuer) applies in most municipalities; liability insurance often required.",
  },
  {
    slug: "india",
    name: "India",
    currency: "INR",
    currencySymbol: "₹",
    fxToLocal: 83,
    monthly: { food: 30, insurance: 8, vet: 15, vaccines: 5, toys: 5, training: 10, grooming: 15, travel: 5 },
    oneTime: { adoption: 50, supplies: 150, spayNeuter: 60 },
    notes: "Costs vary sharply between metro and non-metro cities. Insurance market is growing.",
  },
];

export const COST_CATEGORIES = [
  { key: "food", label: "Food" },
  { key: "insurance", label: "Insurance" },
  { key: "vet", label: "Vet" },
  { key: "vaccines", label: "Vaccines" },
  { key: "toys", label: "Toys & enrichment" },
  { key: "training", label: "Training" },
  { key: "grooming", label: "Grooming" },
  { key: "travel", label: "Travel / boarding" },
] as const;

export type CostCategoryKey = (typeof COST_CATEGORIES)[number]["key"];

export function sizeMultiplier(size: "small" | "medium" | "large") {
  return size === "small" ? 0.7 : size === "large" ? 1.4 : 1;
}
export function speciesMultiplier(species: "dog" | "cat" | "small") {
  return species === "cat" ? 0.75 : species === "small" ? 0.4 : 1;
}
