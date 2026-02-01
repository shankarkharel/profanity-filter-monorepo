"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default,
  neRom: () => neRom
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  neRom
});
