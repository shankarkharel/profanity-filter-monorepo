// src/ne.ts
var NE_WORDS = [
  "\u092E\u0942\u0930\u094D\u0916",
  "\u092C\u0947\u0935\u0915\u0942\u092B",
  "\u0939\u0930\u093E\u092E\u0940",
  "\u0917\u0927\u093E",
  "\u0915\u0941\u0915\u0941\u0930",
  "\u091A\u0942\u0924\u093F\u092F\u093E",
  "\u091D\u0942\u0920\u094B",
  "\u0920\u0917",
  "\u0928\u0902\u0917\u093E",
  "\u0927\u094B\u0915\u093E",
  "\u092D\u094B\u0915\u093E\u0932\u0940",
  "\u091D\u0928\u094D\u0921\u0940",
  "\u0916\u0930\u093E\u092C",
  "\u0928\u0936\u093F\u0932\u093E",
  "\u0928\u0936\u093E",
  "\u0938\u093E\u0932\u093E"
];

// src/index.ts
var OVERRIDES = {
  // Example:
  // "चूतिया": { severity: 4, category: ["sexual"] },
};
function normalizeTerm(s) {
  return s.trim();
}
function uniq(arr) {
  return Array.from(new Set(arr));
}
function toTermEntries(words) {
  const normalized = uniq(words.map(normalizeTerm)).filter(Boolean);
  return normalized.map((w) => {
    const base = {
      term: w,
      severity: 3,
      category: ["general"],
      match: w.includes(" ") ? "phrase" : "word"
    };
    return OVERRIDES[w] ? { ...base, ...OVERRIDES[w] } : base;
  });
}
var ne = {
  code: "ne",
  version: "0.1.0",
  allowlist: ["assistant", "class"],
  terms: toTermEntries(NE_WORDS)
};
var index_default = ne;
export {
  index_default as default,
  ne
};
