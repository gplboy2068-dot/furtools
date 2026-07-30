import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TOOLS, searchTools } from "@/data/tools";
import { CATEGORIES } from "@/data/categories";

export function GlobalSearch({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (slug: string) => void;
}) {
  const [q, setQ] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const results = q ? searchTools(q) : TOOLS;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search tools, calculators, guides…"
        value={q}
        onValueChange={setQ}
      />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        <CommandGroup heading="Tools">
          {results.slice(0, 8).map((t) => (
            <CommandItem
              key={t.slug}
              value={`${t.name} ${t.keywords.join(" ")}`}
              onSelect={() => {
                onSelect(t.slug);
                onOpenChange(false);
              }}
            >
              <div className="flex flex-col">
                <span className="font-medium">{t.name}</span>
                <span className="text-xs text-muted-foreground">{t.tagline}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Categories">
          {CATEGORIES.map((c) => (
            <CommandItem
              key={c.slug}
              value={`category ${c.name}`}
              onSelect={() => {
                onOpenChange(false);
                window.location.href = `/categories/${c.slug}`;
              }}
            >
              {c.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
