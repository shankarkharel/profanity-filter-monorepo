import type { LanguagePack, TermEntry } from "@your-scope/profanity-core";
import { EN_WORDS } from "./en"; // <-- put your big array in src/words.ts

// Optional: override a few terms you care about (severity/category/match)
// Keep this small and curated.
const OVERRIDES: Record<string, Partial<TermEntry>> = {
  // Examples (edit as you like):
  // "fuck": { severity: 4, category: ["sexual"] },
  // "shit": { severity: 3, category: ["general"] },
  // "bitch": { severity: 3, category: ["insult"] },
  // "motherfucker": { severity: 5, category: ["sexual", "insult"], match: "word" },
};

function normalizeTerm(s: string): string {
  return s.trim().toLowerCase();
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function toTermEntries(words: string[]): TermEntry[] {
  const normalized = uniq(words.map(normalizeTerm)).filter(Boolean);

  return normalized.map((w) => {
    const base: TermEntry = {
      term: w,
      severity: 3, // default severity (tune later)
      category: ["general"], // default category
      match: w.includes(" ") ? "phrase" : "word",
    };

    const override = OVERRIDES[w];
    return override ? ({ ...base, ...override } as TermEntry) : base;
  });
}

export const en: LanguagePack = {
  code: "en",
  version: "0.1.0",
  allowlist: ["assistant", "class"],
  terms: toTermEntries(EN_WORDS),
};

export default en;
