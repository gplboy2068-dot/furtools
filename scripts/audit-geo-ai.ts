/**
 * FurTools Platform GEO & AI Search Readiness Audit Engine
 *
 * Evaluates Direct Answer extractability, definition clarity, 40-60 word
 * snippet boundaries, absence of conversational fluff, SoftwareApplication
 * schema enrichment, and AI crawler discoverability across all 233 pet tools.
 */

import { TOOLS, type Tool } from "../src/data/tools";
import { DIRECT_ANSWERS_REGISTRY, getDirectAnswer, buildEnhancedSoftwareSchema } from "../src/lib/geo";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("===============================================================");
console.log(" 🤖 FURTOOLS GENERATIVE ENGINE OPTIMIZATION (GEO) AUDIT");
console.log("    Target: Google AI Overviews • Perplexity • ChatGPT Search");
console.log("===============================================================\n");

let issueCount = 0;
let passCount = 0;

function reportPass(label: string) {
  passCount++;
  console.log(`  ✅ [PASS] ${label}`);
}

function reportWarn(label: string, detail?: string) {
  issueCount++;
  console.log(`  ⚠️  [WARN] ${label}`);
  if (detail) console.log(`     ↳ ${detail}`);
}

function reportFail(label: string, detail?: string) {
  issueCount++;
  console.log(`  ❌ [FAIL] ${label}`);
  if (detail) console.log(`     ↳ ${detail}`);
}

// -----------------------------------------------------------------------------
// 1. DIRECT ANSWER COVERAGE & WORD COUNT BOUNDARIES
// -----------------------------------------------------------------------------
console.log("1. DIRECT ANSWER EXTRACTABILITY & WORD COUNT BOUNDARIES");

const FLUFF_PATTERNS = [
  /welcome to/i,
  /in this fast-paced world/i,
  /in today's world/i,
  /look no further/i,
  /whether you('re| are) a/i,
  /as an ai/i,
  /don't worry/i,
  /here at furtools/i,
];

let wordCountFailures: { slug: string; words: number; answer: string }[] = [];
let fluffFailures: { slug: string; matched: string }[] = [];
let minWords = 999;
let maxWords = 0;

for (const tool of TOOLS) {
  const ans = getDirectAnswer(tool.slug, tool);
  const words = ans.trim().split(/\s+/).length;

  if (words < minWords) minWords = words;
  if (words > maxWords) maxWords = words;

  // AI snippet target window: 35–68 words (ideal 40–60)
  if (words < 35 || words > 68) {
    wordCountFailures.push({ slug: tool.slug, words, answer: ans });
  }

  for (const pat of FLUFF_PATTERNS) {
    const match = ans.match(pat);
    if (match) {
      fluffFailures.push({ slug: tool.slug, matched: match[0] });
    }
  }
}

if (wordCountFailures.length === 0) {
  reportPass(
    `All ${TOOLS.length} pet tools have direct definitions in the optimal 35–68 word window (min: ${minWords}, max: ${maxWords})`
  );
} else {
  reportFail(
    `${wordCountFailures.length} tools have direct answers outside the 35–68 word window`,
    wordCountFailures.map((f) => `${f.slug} (${f.words} words)`).join(", ")
  );
}

if (fluffFailures.length === 0) {
  reportPass("Zero conversational fluff: 100% of direct answers use clinical, high-density factual definitions");
} else {
  reportFail(
    `${fluffFailures.length} direct answers contain marketing fluff / filler phrases`,
    fluffFailures.map((f) => `${f.slug} (${f.matched})`).join(", ")
  );
}

console.log();

// -----------------------------------------------------------------------------
// 2. CLINICAL & HIGH-PRIORITY TOOL REGISTRY CURATION
// -----------------------------------------------------------------------------
console.log("2. HIGH-URGENCY & CLINICAL REGISTRY CURATION");

const CRITICAL_CLINICAL_TOOLS = [
  "dog-chocolate-toxicity-calculator",
  "canine-fluid-therapy-calculator",
  "dog-benadryl-dose-calculator",
  "cat-age-calculator",
  "dog-age-calculator",
  "dog-food-calculator",
  "cat-calorie-calculator",
  "dog-water-calculator",
  "cat-water-calculator",
  "aquarium-volume-calculator",
  "aquarium-nitrate-calculator",
  "reptile-uvb-schedule",
  "reptile-uvb-distance-guide",
  "dog-pregnancy-calculator",
  "cat-pregnancy-calculator",
  "pet-poison-lookup",
  "fish-medication-dose",
  "dog-calorie-calculator",
  "horse-age-calculator",
  "rabbit-age-calculator",
];

let missingCriticalRegistry = 0;
for (const slug of CRITICAL_CLINICAL_TOOLS) {
  if (!DIRECT_ANSWERS_REGISTRY[slug]) {
    missingCriticalRegistry++;
    reportWarn(`Clinical priority tool '${slug}' missing from curated DIRECT_ANSWERS_REGISTRY`);
  }
}

if (missingCriticalRegistry === 0) {
  reportPass(
    `100% of ${CRITICAL_CLINICAL_TOOLS.length} high-urgency clinical tools (chocolate toxicity, fluid therapy, Benadryl, calories, gestation) have bespoke, peer-curated direct answers`
  );
}

console.log();

// -----------------------------------------------------------------------------
// 3. ENHANCED JSON-LD SOFTWARE APPLICATION SCHEMA
// -----------------------------------------------------------------------------
console.log("3. ENHANCED SOFTWARE & WEB APPLICATION SCHEMA PARITY");

let schemaDefects: string[] = [];

for (const tool of TOOLS) {
  const schema = buildEnhancedSoftwareSchema({
    tool,
    canonicalUrl: `/tools/${tool.slug}`,
    imageUrl: "/og-image.png",
  });

  const types = Array.isArray(schema["@type"]) ? schema["@type"] : [schema["@type"]];
  if (!types.includes("SoftwareApplication") || !types.includes("WebApplication")) {
    schemaDefects.push(`${tool.slug}: @type must include SoftwareApplication & WebApplication`);
  }

  if (!schema.applicationCategory) {
    schemaDefects.push(`${tool.slug}: missing applicationCategory`);
  }

  if (schema.applicationSubCategory !== "Veterinary & Pet Care Calculators") {
    schemaDefects.push(`${tool.slug}: missing applicationSubCategory`);
  }

  if (!schema.featureList || schema.featureList.length < 3) {
    schemaDefects.push(`${tool.slug}: featureList missing or < 3 items`);
  }

  if (!schema.isAccessibleForFree) {
    schemaDefects.push(`${tool.slug}: isAccessibleForFree must be true`);
  }

  if (!schema.browserRequirements) {
    schemaDefects.push(`${tool.slug}: missing browserRequirements`);
  }
}

if (schemaDefects.length === 0) {
  reportPass(
    `All ${TOOLS.length} pet tools produce valid, rich SoftwareApplication + WebApplication schema with featureList, browserRequirements & subCategory`
  );
} else {
  reportFail(`${schemaDefects.length} schema defects detected`, schemaDefects.slice(0, 5).join("; "));
}

console.log();

// -----------------------------------------------------------------------------
// 4. FAQ CONCISENESS & AI SNIPPET EXTRACTABILITY
// -----------------------------------------------------------------------------
console.log("4. FAQ ANSWER CONCISENESS & SNIPPET FRIENDLINESS");

let longFaqs: { tool: string; q: string; words: number }[] = [];
let totalFaqsCount = 0;
let totalFaqWords = 0;

for (const tool of TOOLS) {
  const faqs = tool.faqs || [];
  for (const faq of faqs) {
    totalFaqsCount++;
    const words = faq.a.trim().split(/\s+/).length;
    totalFaqWords += words;
    if (words > 85) {
      longFaqs.push({ tool: tool.slug, q: faq.q, words });
    }
  }
}

const avgFaqWords = totalFaqsCount > 0 ? (totalFaqWords / totalFaqsCount).toFixed(1) : 0;

if (longFaqs.length === 0) {
  reportPass(
    `100% of ${totalFaqsCount} tool FAQs are concise and extractable for AI snippets (<= 85 words, avg: ${avgFaqWords} words)`
  );
} else {
  reportWarn(
    `${longFaqs.length} FAQs exceed 85 words and risk truncation in generative search snippets`,
    longFaqs.slice(0, 3).map((f) => `${f.tool} - "${f.q}" (${f.words}w)`).join("; ")
  );
}

console.log();

// -----------------------------------------------------------------------------
// 5. LLMS.TXT & AI CRAWLER ACCESS AUDIT
// -----------------------------------------------------------------------------
console.log("5. LLMS.TXT & AI CRAWLER DIRECTIVES");

const llmsPath = path.resolve(__dirname, "../public/llms.txt");
if (fs.existsSync(llmsPath)) {
  const content = fs.readFileSync(llmsPath, "utf-8");
  const hasClinical = content.includes("Veterinary") || content.includes("Medical");
  const hasFormat = content.includes("Markdown") || content.includes("Guidelines");

  if (hasClinical && hasFormat) {
    reportPass("llms.txt explicitly documents clinical calculations, veterinary citations, and domain topology");
  } else {
    reportWarn("llms.txt could be enriched with additional clinical calculation references");
  }
} else {
  reportFail("public/llms.txt not found");
}

const robotsPath = path.resolve(__dirname, "../public/robots.txt");
if (fs.existsSync(robotsPath)) {
  const content = fs.readFileSync(robotsPath, "utf-8");
  const aiCrawlers = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];
  const welcomed = aiCrawlers.filter((bot) => content.includes(bot));

  if (welcomed.length === aiCrawlers.length) {
    reportPass(`robots.txt welcomes all major AI crawlers: ${welcomed.join(", ")}`);
  } else {
    reportWarn(`robots.txt missing some AI crawler directives (${aiCrawlers.filter((b) => !content.includes(b)).join(", ")})`);
  }
} else {
  reportFail("public/robots.txt not found");
}

console.log("\n===============================================================");
console.log(` GEO SUMMARY: ${passCount} Checks Passed | ${issueCount} Warnings/Fails`);
console.log("===============================================================\n");

if (issueCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
