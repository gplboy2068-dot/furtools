import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  COUNTRIES,
  COST_CATEGORIES,
  sizeMultiplier,
  speciesMultiplier,
  type CostCategoryKey,
} from "@/data/countries";
import { breadcrumbSchema } from "@/lib/schema";

const PALETTE = [
  "#c95f4c", "#e59866", "#a3a86b", "#7c8f4f", "#f2c14e", "#b18cbe", "#6ea8b6", "#d68d7a",
];

export const Route = createFileRoute("/cost-planner")({
  head: () => ({
    meta: [
      { title: "Pet Cost Planner — Country-by-Country | FurTools" },
      {
        name: "description",
        content:
          "Estimate the monthly, yearly and lifetime cost of owning a pet — US, UK, Canada, Australia, Germany, India. Food, insurance, vet, vaccines, toys, grooming, training, and travel.",
      },
      { property: "og:title", content: "Pet Cost Planner — FurTools" },
      { property: "og:description", content: "Country-by-country pet cost estimator." },
      { property: "og:url", content: "/cost-planner" },
    ],
    links: [{ rel: "canonical", href: "/cost-planner" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Cost Planner", url: "/cost-planner" },
          ]),
        ),
      },
    ],
  }),
  component: CostPlannerPage,
});

function CostPlannerPage() {
  const [country, setCountry] = useState(COUNTRIES[0].slug);
  const [species, setSpecies] = useState<"dog" | "cat" | "small">("dog");
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [years, setYears] = useState(12);

  const c = COUNTRIES.find((x) => x.slug === country)!;
  const mult = sizeMultiplier(size) * speciesMultiplier(species);

  const monthlyBreakdown = useMemo(
    () =>
      COST_CATEGORIES.map((cat) => ({
        key: cat.key as CostCategoryKey,
        label: cat.label,
        usd: Math.round(c.monthly[cat.key as CostCategoryKey] * mult),
      })),
    [c, mult],
  );

  const monthlyTotal = monthlyBreakdown.reduce((s, x) => s + x.usd, 0);
  const oneTimeTotal = Math.round(
    (c.oneTime.adoption + c.oneTime.supplies + c.oneTime.spayNeuter) * mult,
  );
  const yearlyTotal = monthlyTotal * 12;
  const lifetimeTotal = yearlyTotal * years + oneTimeTotal;

  function fmt(usd: number) {
    const local = usd * c.fxToLocal;
    return c.currencySymbol + local.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  const chartData = monthlyBreakdown.map((b) => ({ name: b.label, value: b.usd }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 print:py-6">
      <Breadcrumbs items={[{ label: "Cost Planner" }]} />
      <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Pet Cost Planner
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Country-by-country estimates of monthly, yearly, and lifetime pet costs — food,
            insurance, vet, vaccines, toys, grooming, training, and travel.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 print:hidden"
        >
          <Download className="size-4" aria-hidden /> Download PDF
        </button>
      </header>

      {/* Controls */}
      <section className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-4 print:hidden">
        <Field label="Country">
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            {COUNTRIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Species">
          <select value={species} onChange={(e) => setSpecies(e.target.value as typeof species)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="small">Small pet (rabbit/hamster)</option>
          </select>
        </Field>
        <Field label="Size">
          <select value={size} onChange={(e) => setSize(e.target.value as typeof size)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </Field>
        <Field label={`Expected years (${years})`}>
          <input
            type="range"
            min={1}
            max={20}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full"
          />
        </Field>
      </section>

      {/* Summary */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Monthly" value={fmt(monthlyTotal)} />
        <Stat label="Yearly" value={fmt(yearlyTotal)} />
        <Stat label={`Lifetime (${years} yrs)`} value={fmt(lifetimeTotal)} highlight />
      </section>

      {/* Charts */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-semibold">Monthly breakdown</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 40, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" fontSize={11} interval={0} />
                <YAxis tickFormatter={(v) => `${c.currencySymbol}${Math.round(Number(v) * c.fxToLocal)}`} fontSize={11} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-semibold">Where the money goes</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Line-item table */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Category</th>
              <th className="p-4">Monthly</th>
              <th className="p-4">Yearly</th>
              <th className="p-4">Lifetime</th>
            </tr>
          </thead>
          <tbody>
            {monthlyBreakdown.map((row) => (
              <tr key={row.key} className="border-t border-border">
                <td className="p-4 font-medium">{row.label}</td>
                <td className="p-4">{fmt(row.usd)}</td>
                <td className="p-4">{fmt(row.usd * 12)}</td>
                <td className="p-4">{fmt(row.usd * 12 * years)}</td>
              </tr>
            ))}
            <tr className="border-t border-border bg-muted/20">
              <td className="p-4 font-semibold">One-time (adoption + supplies + spay/neuter)</td>
              <td className="p-4">—</td>
              <td className="p-4">{fmt(oneTimeTotal)}</td>
              <td className="p-4">{fmt(oneTimeTotal)}</td>
            </tr>
            <tr className="border-t border-border bg-primary/5 font-semibold">
              <td className="p-4">Total</td>
              <td className="p-4">{fmt(monthlyTotal)}</td>
              <td className="p-4">{fmt(yearlyTotal)}</td>
              <td className="p-4 text-primary">{fmt(lifetimeTotal)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        <strong>{c.name}:</strong> {c.notes}
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={"rounded-2xl border p-5 " + (highlight ? "border-primary/50 bg-primary/5" : "border-border bg-card")}>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={"mt-2 font-display text-3xl font-semibold " + (highlight ? "text-primary" : "")}>{value}</div>
    </div>
  );
}
