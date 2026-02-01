// src/ne.ts
var NE_RO_WORDS = [
  "sale",
  "pakhe",
  "harami",
  "chhoro",
  "gandu",
  "loda",
  "bhainsko",
  "kutta",
  "madarchod",
  "bhenchod",
  "saala",
  "saali",
  "chutiya",
  "jutho",
  "tharki",
  "nangaa",
  "fokatko",
  "dhor",
  "bhokali",
  "jhandi",
  "kharab",
  "nashila",
  "nasha",
  "sala"
];

// src/index.ts
var OVERRIDES = {
  // Example:
  // "madarchod": { severity: 5, category: ["sexual", "insult"] },
};
function normalizeTerm(s) {
  return s.trim().toLowerCase();
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
var neRom = {
  code: "ne-rom",
  version: "0.1.0",
  allowlist: ["assistant", "class"],
  terms: toTermEntries(NE_RO_WORDS)
};
var index_default = neRom;
export {
  index_default as default,
  neRom
};
