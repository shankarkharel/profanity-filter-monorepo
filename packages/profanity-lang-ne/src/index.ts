import type { LanguagePack, TermEntry } from "@your-scope/profanity-core";
import { NE_WORDS } from "./ne";

const OVERRIDES: Record<string, Partial<TermEntry>> = {
  // Example:
  // "चूतिया": { severity: 4, category: ["sexual"] },
};

function normalizeTerm(s: string): string {
  // Keep Devanagari intact, just trim.
  // Don't force lowercasing here because it does nothing for Devanagari
  // and can cause odd behavior with some unicode.
  return s.trim();
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function toTermEntries(words: string[]): TermEntry[] {
  const normalized = uniq(words.map(normalizeTerm)).filter(Boolean);

  return normalized.map((w) => {
    const base: TermEntry = {
      term: w,
      severity: 3,
      category: ["general"],
      match: w.includes(" ") ? "phrase" : "word",
    };

    return OVERRIDES[w] ? ({ ...base, ...OVERRIDES[w] } as TermEntry) : base;
  });
}

export const ne: LanguagePack = {
  code: "ne",
  version: "0.1.0",
  allowlist: ["assistant", "class"],
  terms: toTermEntries(NE_WORDS),
};

export default ne;
