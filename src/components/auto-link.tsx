// AutoLink — scans plain text for keywords managed in the internal_links table
// and turns matches into TanStack Router <Link>s. First occurrence per keyword
// per render, longest-first to avoid partial overlaps.
import { Fragment, useMemo, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface InternalLink {
  keyword: string;
  url: string;
  title?: string | null;
}

async function fetchInternalLinks(): Promise<InternalLink[]> {
  const { data } = await supabase
    .from("internal_links")
    .select("keyword,target_url,title")
    .eq("enabled", true);
  return ((data ?? []) as Array<{ keyword: string; target_url: string; title: string | null }>).map((r) => ({
    keyword: r.keyword,
    url: r.target_url,
    title: r.title,
  }));
}

function useInternalLinks() {
  return useQuery({
    queryKey: ["internal_links"],
    queryFn: fetchInternalLinks,
    staleTime: 5 * 60 * 1000,
  });
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface AutoLinkProps {
  text: string;
  /** Skip these URLs (usually the page's own URL) */
  excludeUrl?: string;
  /** Max total links to insert */
  max?: number;
  className?: string;
}

/**
 * <AutoLink text="Learn about dog nutrition and grooming." />
 * Turns keywords defined in the internal_links table into <Link>s.
 */
export function AutoLink({ text, excludeUrl, max = 5, className }: AutoLinkProps) {
  const { data: links } = useInternalLinks();
  const rendered = useMemo(() => renderWithLinks(text, links ?? [], excludeUrl, max), [text, links, excludeUrl, max]);
  return <span className={className}>{rendered}</span>;
}

export function renderWithLinks(
  text: string,
  links: InternalLink[],
  excludeUrl?: string,
  max = 5,
): ReactNode[] {
  if (!links.length) return [text];
  const usable = links
    .filter((l) => l.url !== excludeUrl && l.keyword && l.url)
    .sort((a, b) => b.keyword.length - a.keyword.length);

  const used = new Set<string>();
  let inserted = 0;
  let remaining = text;
  const out: ReactNode[] = [];
  let key = 0;

  outer: while (remaining.length > 0 && inserted < max) {
    let matchIndex = -1;
    let matchLink: InternalLink | null = null;
    let matchLen = 0;

    for (const link of usable) {
      if (used.has(link.keyword.toLowerCase())) continue;
      const re = new RegExp(`\\b${escapeRegExp(link.keyword)}\\b`, "i");
      const m = remaining.match(re);
      if (m && m.index !== undefined) {
        if (matchIndex === -1 || m.index < matchIndex) {
          matchIndex = m.index;
          matchLink = link;
          matchLen = m[0].length;
        }
      }
    }

    if (!matchLink || matchIndex < 0) {
      out.push(remaining);
      break outer;
    }

    if (matchIndex > 0) out.push(remaining.slice(0, matchIndex));
    const matched = remaining.slice(matchIndex, matchIndex + matchLen);
    out.push(
      <Link
        key={`al-${key++}`}
        to={matchLink.url}
        title={matchLink.title ?? matchLink.keyword}
        className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
      >
        {matched}
      </Link>,
    );
    used.add(matchLink.keyword.toLowerCase());
    inserted++;
    remaining = remaining.slice(matchIndex + matchLen);
  }

  return out.map((n, i) => <Fragment key={i}>{n}</Fragment>);
}
