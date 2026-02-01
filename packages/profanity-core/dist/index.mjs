// src/tokenize.ts
function tokenizeWords(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    while (i < text.length && text[i] === " ") i++;
    const start = i;
    while (i < text.length && text[i] !== " ") i++;
    const end = i;
    if (end > start) {
      tokens.push({ value: text.slice(start, end), start, end });
    }
  }
  return tokens;
}

// src/normalizers.ts
var nfkc = {
  name: "nfkc",
  run: (s) => s.normalize("NFKC")
};
var lower = {
  name: "lower",
  run: (s) => s.toLowerCase()
};
var collapseWhitespace = {
  name: "collapseWhitespace",
  run: (s) => s.replace(/\s+/g, " ").trim()
};
var stripPunctuation = {
  name: "stripPunctuation",
  run: (s) => s.replace(/[^\p{L}\p{N}\u0900-\u097F ]+/gu, " ")
};
function collapseRepeats(maxRepeats = 2) {
  return {
    name: "collapseRepeats",
    run: (s) => s.replace(/(.)\1{2,}/g, (_m, ch) => String(ch).repeat(maxRepeats))
  };
}
var leetspeak = {
  name: "leetspeak",
  run: (s) => s.replace(/[@]/g, "a").replace(/[!]/g, "i").replace(/[0]/g, "o").replace(/[1|]/g, "i").replace(/[$]/g, "s")
};

// src/engine.ts
function uniq(arr) {
  return Array.from(new Set(arr));
}
function clampText(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max);
}
var ProfanityEngine = class {
  constructor(packs, options) {
    this.packs = [];
    this.packs = packs;
    this.opts = {
      severityThreshold: options?.severityThreshold ?? 1,
      enabledLanguages: options?.enabledLanguages ?? [],
      extraTerms: options?.extraTerms ?? [],
      extraAllowlist: options?.extraAllowlist ?? [],
      enableRepeatCollapse: options?.enableRepeatCollapse ?? true,
      maxTextLength: options?.maxTextLength ?? 2e4
    };
  }
  analyze(input) {
    const text = clampText(input ?? "", this.opts.maxTextLength);
    const enabled = this.opts.enabledLanguages.length ? this.packs.filter((p) => this.opts.enabledLanguages.includes(p.code)) : this.packs;
    const matches = [];
    for (const pack of enabled) {
      const normalized = this.normalizeForPack(text, pack);
      const allow = new Set(uniq([...pack.allowlist ?? [], ...this.opts.extraAllowlist]).map((x) => this.normalizeForPack(x, pack)));
      const allTerms = [...pack.terms, ...this.opts.extraTerms];
      const expanded = this.expandTerms(allTerms);
      const tokens = tokenizeWords(normalized);
      const wordIndex = /* @__PURE__ */ new Map();
      for (const t of expanded.filter((x) => (x.match ?? "word") === "word")) {
        const key = this.normalizeForPack(t.term, pack);
        if (!wordIndex.has(key)) wordIndex.set(key, []);
        wordIndex.get(key).push(t);
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
      const phrases = expanded.filter((x) => (x.match ?? "word") === "phrase");
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
    const maxSeverity = matches.length ? matches.reduce((m, x) => x.severity > m ? x.severity : m, 0) : 0;
    const score = matches.length ? Math.min(100, matches.length * 15 + maxSeverity * 10) : 0;
    return {
      profane: matches.length > 0,
      score,
      maxSeverity,
      matches
    };
  }
  isProfane(text) {
    return this.analyze(text).profane;
  }
  censor(text, options) {
    const result = this.analyze(text);
    if (!result.profane) return text;
    const censorChar = options?.censorChar ?? "*";
    const replaceWith = options?.replaceWith;
    const preservePrefix = options?.preservePrefix ?? (options?.preserveFirstLast ? 1 : 0);
    const preserveSuffix = options?.preserveSuffix ?? (options?.preserveFirstLast ? 1 : 0);
    const makeMasked = (term) => {
      if (replaceWith) return replaceWith;
      const len = term.length;
      const pre = Math.max(0, Math.min(preservePrefix, len));
      const suf = Math.max(0, Math.min(preserveSuffix, len - pre));
      let mid = Math.max(0, len - pre - suf);
      if (len >= 2 && mid === 0) {
        const safePre = Math.max(0, Math.min(pre, len - 1));
        return term.slice(0, safePre) + censorChar + term.slice(safePre + 1);
      }
      return term.slice(0, pre) + censorChar.repeat(mid) + term.slice(len - suf);
    };
    let out = text;
    for (const m of result.matches) {
      const term = m.term;
      if (!term) continue;
      const replacement = makeMasked(term);
      const re = new RegExp(escapeRegExp(term), "gi");
      out = out.replace(re, replacement);
    }
    return out;
  }
  expandTerms(terms) {
    const out = [];
    for (const t of terms) {
      out.push(t);
      for (const v of t.variants ?? []) {
        out.push({ ...t, term: v });
      }
    }
    return out;
  }
  normalizeForPack(text, pack) {
    const steps = [
      nfkc,
      lower,
      ...pack.code === "en" ? [leetspeak] : [],
      ...this.opts.enableRepeatCollapse ? [collapseRepeats(2)] : [],
      stripPunctuation,
      collapseWhitespace,
      ...pack.normalizers ?? []
    ];
    let s = text;
    for (const step of steps) s = step.run(s);
    return s;
  }
};
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export {
  ProfanityEngine,
  collapseRepeats,
  collapseWhitespace,
  leetspeak,
  lower,
  nfkc,
  stripPunctuation
};
