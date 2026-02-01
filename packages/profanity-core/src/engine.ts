import type {
  AnalyzeResult,
  EngineOptions,
  LanguagePack,
  MatchDetail,
  Severity,
  TermEntry
} from "./types.js";
import { tokenizeWords } from "./tokenize.js";
import {
  nfkc,
  lower,
  collapseWhitespace,
  stripPunctuation,
  collapseRepeats,
  leetspeak
} from "./normalizers";

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

function clampText(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max);
}

export class ProfanityEngine {
  private packs: LanguagePack[] = [];
  private opts: Required<EngineOptions>;

  constructor(packs: LanguagePack[], options?: EngineOptions) {
    this.packs = packs;

    this.opts = {
      severityThreshold: options?.severityThreshold ?? 1,
      enabledLanguages: options?.enabledLanguages ?? [],
      extraTerms: options?.extraTerms ?? [],
      extraAllowlist: options?.extraAllowlist ?? [],
      enableRepeatCollapse: options?.enableRepeatCollapse ?? true,
      maxTextLength: options?.maxTextLength ?? 20_000
    };
  }

  public analyze(input: string): AnalyzeResult {
    const text = clampText(input ?? "", this.opts.maxTextLength);

    const enabled = this.opts.enabledLanguages.length
      ? this.packs.filter(p => this.opts.enabledLanguages.includes(p.code))
      : this.packs;

    const matches: MatchDetail[] = [];

    for (const pack of enabled) {
      const normalized = this.normalizeForPack(text, pack);

      const allow = new Set(uniq([...(pack.allowlist ?? []), ...this.opts.extraAllowlist])
        .map(x => this.normalizeForPack(x, pack)));

      const allTerms: TermEntry[] = [...pack.terms, ...this.opts.extraTerms];
      const expanded = this.expandTerms(allTerms);

      // 1) Word matches (token-based)
      const tokens = tokenizeWords(normalized);
      const wordIndex = new Map<string, TermEntry[]>();
      for (const t of expanded.filter(x => (x.match ?? "word") === "word")) {
        const key = this.normalizeForPack(t.term, pack);
        if (!wordIndex.has(key)) wordIndex.set(key, []);
        wordIndex.get(key)!.push(t);
      }

      for (const tok of tokens) {
        if (allow.has(tok.value)) continue;
        const hit = wordIndex.get(tok.value);
        if (hit) {
          for (const h of hit) {
            if (h.severity < this.opts.severityThreshold) continue;
            matches.push({
              pack: pack.code,
              term: h.term,
              severity: h.severity,
              category: h.category ?? [],
              index: tok.start
            });
          }
        }
      }

      // 2) Phrase matches (simple substring on normalized text)
      const phrases = expanded.filter(x => (x.match ?? "word") === "phrase");
      for (const ph of phrases) {
        const needle = this.normalizeForPack(ph.term, pack);
        if (!needle || allow.has(needle)) continue;
        let idx = normalized.indexOf(needle);
        while (idx !== -1) {
          if (ph.severity >= this.opts.severityThreshold) {
            matches.push({
              pack: pack.code,
              term: ph.term,
              severity: ph.severity,
              category: ph.category ?? [],
              index: idx
            });
          }
          idx = normalized.indexOf(needle, idx + needle.length);
        }
      }
    }

    const maxSeverity = matches.length
      ? (matches.reduce((m, x) => (x.severity > m ? x.severity : m), 0 as Severity))
      : 0;

    const score = matches.length
      ? Math.min(100, matches.length * 15 + (maxSeverity * 10))
      : 0;

    return {
      profane: matches.length > 0,
      score,
      maxSeverity,
      matches
    };
  }

  public isProfane(text: string): boolean {
    return this.analyze(text).profane;
  }

public censor(
  text: string,
  options?: {
    censorChar?: string;
    replaceWith?: string;
    preserveFirstLast?: boolean; // legacy shortcut (1 + 1)
    preservePrefix?: number;     // NEW: keep first N chars
    preserveSuffix?: number;     // NEW: keep last N chars
  }
): string {
  const result = this.analyze(text);
  if (!result.profane) return text;

  const censorChar = options?.censorChar ?? "*";
  const replaceWith = options?.replaceWith;

  // If preservePrefix/Suffix not provided, fall back to preserveFirstLast
  const preservePrefix =
    options?.preservePrefix ??
    (options?.preserveFirstLast ? 1 : 0);

  const preserveSuffix =
    options?.preserveSuffix ??
    (options?.preserveFirstLast ? 1 : 0);

  const makeMasked = (term: string) => {
    if (replaceWith) return replaceWith;

    const len = term.length;

    // Clamp to safe range
    const pre = Math.max(0, Math.min(preservePrefix, len));
    const suf = Math.max(0, Math.min(preserveSuffix, len - pre));
    let mid = Math.max(0, len - pre - suf);

    // Safety: don't allow "no masking" for len >= 2 (e.g. preservePrefix+Suffix covers whole word)
    if (len >= 2 && mid === 0) {
      const safePre = Math.max(0, Math.min(pre, len - 1));
      return term.slice(0, safePre) + censorChar + term.slice(safePre + 1);
    }

    return term.slice(0, pre) + censorChar.repeat(mid) + term.slice(len - suf);
  };

  // MVP: replace in ORIGINAL text (best-effort). Later you can map normalized indices to original.
  let out = text;

  for (const m of result.matches) {
    const term = m.term;
    if (!term) continue;

    const replacement = makeMasked(term);

    // Replace all occurrences of the matched term (case-insensitive naive)
    const re = new RegExp(escapeRegExp(term), "gi");
    out = out.replace(re, replacement);
  }

  return out;
}


  private expandTerms(terms: TermEntry[]): TermEntry[] {
    const out: TermEntry[] = [];
    for (const t of terms) {
      out.push(t);
      for (const v of t.variants ?? []) {
        out.push({ ...t, term: v });
      }
    }
    return out;
  }

  private normalizeForPack(text: string, pack: LanguagePack): string {
    const steps = [
      nfkc,
      lower,
      ...(pack.code === "en" ? [leetspeak] : []),
      ...(this.opts.enableRepeatCollapse ? [collapseRepeats(2)] : []),
      stripPunctuation,
      collapseWhitespace,
      ...(pack.normalizers ?? [])
    ];

    let s = text;
    for (const step of steps) s = step.run(s);
    return s;
  }
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
