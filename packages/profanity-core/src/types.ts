export type Severity = 1 | 2 | 3 | 4 | 5;

export type MatchKind = "word" | "phrase";

export interface TermEntry {
  term: string;                 // canonical
  severity: Severity;           // 1 mild ... 5 extreme
  category?: string[];          // e.g. ["sexual", "slur"]
  match?: MatchKind;            // default "word"
  variants?: string[];          // additional spellings/romanizations
}

export interface NormalizerStep {
  name: string;
  run: (input: string) => string;
}

export interface LanguagePack {
  code: string;                 // "en", "ne", "ne-rom"
  version: string;
  terms: TermEntry[];
  allowlist?: string[];
  normalizers?: NormalizerStep[];
}

export interface MatchDetail {
  pack: string;                 // language code
  term: string;                 // matched term (canonical)
  severity: Severity;
  category: string[];
  index: number;                // char index in normalized text (best-effort)
}

export interface AnalyzeResult {
  profane: boolean;
  score: number;                // 0..100
  maxSeverity: Severity | 0;
  matches: MatchDetail[];
}

export interface CensorOptions {
  censorChar?: string;          // default "*"
  preserveFirstLast?: boolean;  // default false
  replaceWith?: string;         // if set, replace with this token
}

export interface EngineOptions {
  severityThreshold?: Severity; // default 1
  enabledLanguages?: string[];  // if set, only these
  extraTerms?: TermEntry[];     // app-specific
  extraAllowlist?: string[];    // app-specific
  enableRepeatCollapse?: boolean; // default true
  maxTextLength?: number;       // default 20_000 (safety)
}

export interface CensorOptions {
  censorChar?: string;            // default "*"
  replaceWith?: string;           // optional fixed token
  preserveFirstLast?: boolean;    // legacy shortcut
  preservePrefix?: number;        // e.g. 2
  preserveSuffix?: number;        // e.g. 2
}
