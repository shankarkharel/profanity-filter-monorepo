import type { LanguagePack, TermEntry } from "@shankarkharel/profanity-core";
import { NE_RO_WORDS } from "./ne";

const OVERRIDES: Record<string, Partial<TermEntry>> = {
  // Example:
  // "madarchod": { severity: 5, category: ["sexual", "insult"] },
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
      severity: 3,
      category: ["general"],
      match: w.includes(" ") ? "phrase" : "word",
    };

    return OVERRIDES[w] ? ({ ...base, ...OVERRIDES[w] } as TermEntry) : base;
  });
}

export const neRom: LanguagePack = {
  code: "ne-rom",
  version: "0.1.0",
  allowlist: ["assistant", "class"],
  terms: toTermEntries(NE_RO_WORDS),
};

export default neRom;
