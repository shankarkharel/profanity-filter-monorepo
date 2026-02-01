type Severity = 1 | 2 | 3 | 4 | 5;
type MatchKind = "word" | "phrase";
interface TermEntry {
    term: string;
    severity: Severity;
    category?: string[];
    match?: MatchKind;
    variants?: string[];
}
interface NormalizerStep {
    name: string;
    run: (input: string) => string;
}
interface LanguagePack {
    code: string;
    version: string;
    terms: TermEntry[];
    allowlist?: string[];
    normalizers?: NormalizerStep[];
}
interface MatchDetail {
    pack: string;
    term: string;
    severity: Severity;
    category: string[];
    index: number;
}
interface AnalyzeResult {
    profane: boolean;
    score: number;
    maxSeverity: Severity | 0;
    matches: MatchDetail[];
}
interface EngineOptions {
    severityThreshold?: Severity;
    enabledLanguages?: string[];
    extraTerms?: TermEntry[];
    extraAllowlist?: string[];
    enableRepeatCollapse?: boolean;
    maxTextLength?: number;
}
interface CensorOptions {
    censorChar?: string;
    preserveFirstLast?: boolean;
    replaceWith?: string;
}
interface CensorOptions {
    censorChar?: string;
    replaceWith?: string;
    preserveFirstLast?: boolean;
    preservePrefix?: number;
    preserveSuffix?: number;
}

declare class ProfanityEngine {
    private packs;
    private opts;
    constructor(packs: LanguagePack[], options?: EngineOptions);
    analyze(input: string): AnalyzeResult;
    isProfane(text: string): boolean;
    censor(text: string, options?: {
        censorChar?: string;
        replaceWith?: string;
        preserveFirstLast?: boolean;
        preservePrefix?: number;
        preserveSuffix?: number;
    }): string;
    private expandTerms;
    private normalizeForPack;
}

declare const nfkc: NormalizerStep;
declare const lower: NormalizerStep;
declare const collapseWhitespace: NormalizerStep;
declare const stripPunctuation: NormalizerStep;
declare function collapseRepeats(maxRepeats?: number): NormalizerStep;
declare const leetspeak: NormalizerStep;

export { type AnalyzeResult, type CensorOptions, type EngineOptions, type LanguagePack, type MatchDetail, type MatchKind, type NormalizerStep, ProfanityEngine, type Severity, type TermEntry, collapseRepeats, collapseWhitespace, leetspeak, lower, nfkc, stripPunctuation };
