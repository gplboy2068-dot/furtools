import { SITE } from "@/lib/site";
import { toAbsoluteUrl } from "@/lib/seo";
import { DEFAULT_AUTHOR, type Author } from "@/data/authors";

export function personSchema(author: Author = DEFAULT_AUTHOR) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    description: author.shortBio,
    url: toAbsoluteUrl(`/author/${author.slug}`),
    image: toAbsoluteUrl(author.avatar),
    sameAs: [author.socials.linkedin, author.socials.instagram].filter(Boolean),
    worksFor: {
      "@type": "Organization",
      name: SITE.name,
      url: toAbsoluteUrl("/"),
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    description: SITE.description,
    url: toAbsoluteUrl("/"),
    logo: toAbsoluteUrl("/favicon.png"),
    founder: {
      "@type": "Person",
      name: DEFAULT_AUTHOR.name,
      jobTitle: DEFAULT_AUTHOR.role,
      url: toAbsoluteUrl(`/author/${DEFAULT_AUTHOR.slug}`),
    },
    sameAs: [
      DEFAULT_AUTHOR.socials.linkedin,
      DEFAULT_AUTHOR.socials.instagram,
    ].filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: toAbsoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: toAbsoluteUrl(it.url),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function articleSchema(a: {
  title: string;
  description?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
  authorUrl?: string;
  authorSameAs?: string[];
  section?: string;
  tags?: string[];
}) {
  const pageUrl = toAbsoluteUrl(a.url);
  const imageUrl = toAbsoluteUrl(a.image || "/og-image.png");
  const authorName = a.authorName ?? DEFAULT_AUTHOR.name;
  const authorUrl = toAbsoluteUrl(a.authorUrl ?? `/author/${DEFAULT_AUTHOR.slug}`);
  const authorSameAs = a.authorSameAs ?? [
    DEFAULT_AUTHOR.socials.linkedin,
    DEFAULT_AUTHOR.socials.instagram,
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    image: [imageUrl],
    author: {
      "@type": "Person",
      name: authorName,
      url: authorUrl,
      sameAs: authorSameAs,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: toAbsoluteUrl("/favicon.png") },
    },
    articleSection: a.section,
    keywords: a.tags?.join(", "),
  };
}

export function softwareApplicationSchema(t: {
  name: string;
  description: string;
  url: string;
  category?: string;
  image?: string;
  ratingValue?: number;
  ratingCount?: number;
}) {
  const appUrl = toAbsoluteUrl(t.url);
  const imageUrl = toAbsoluteUrl(t.image || "/og-image.png");

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t.name,
    description: t.description,
    url: appUrl,
    applicationCategory: t.category ?? "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    image: imageUrl,
  };
  if (t.ratingValue && t.ratingCount) {
    base.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: t.ratingValue,
      ratingCount: t.ratingCount,
    };
  }
  return base;
}

export function imageObjectSchema(img: {
  url: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  const imageUrl = toAbsoluteUrl(img.url);
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: imageUrl,
    url: imageUrl,
    caption: img.caption,
    width: img.width,
    height: img.height,
  };
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: toAbsoluteUrl(it.url),
    })),
  };
}

export function howToSchema(h: {
  name: string;
  description?: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: h.name,
    description: h.description,
    step: h.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
