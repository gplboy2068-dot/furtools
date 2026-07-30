import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

/** Calculator layout: form on the left, result card on the right. */
export function CalculatorLayout({
  form,
  result,
}: {
  form: ReactNode;
  result: ReactNode;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
      <div className="space-y-4">{form}</div>
      <Card className="bg-cream-deep">
        <CardContent className="p-6">{result}</CardContent>
      </Card>
    </div>
  );
}

/** Generator layout: controls on top, generated results below. */
export function GeneratorLayout({
  controls,
  results,
}: {
  controls: ReactNode;
  results: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-cream p-4">{controls}</div>
      <div>{results}</div>
    </div>
  );
}
