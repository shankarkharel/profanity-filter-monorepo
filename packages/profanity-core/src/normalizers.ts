import type { NormalizerStep } from "./types";

export const nfkc: NormalizerStep = {
  name: "nfkc",
  run: (s) => s.normalize("NFKC"),
};

export const lower: NormalizerStep = {
  name: "lower",
  run: (s) => s.toLowerCase(),
};

export const collapseWhitespace: NormalizerStep = {
  name: "collapseWhitespace",
  run: (s) => s.replace(/\s+/g, " ").trim(),
};

export const stripPunctuation: NormalizerStep = {
  name: "stripPunctuation",
  run: (s) => s.replace(/[^\p{L}\p{N}\u0900-\u097F ]+/gu, " "),
};

export function collapseRepeats(maxRepeats = 2): NormalizerStep {
  return {
    name: "collapseRepeats",
    run: (s) => s.replace(/(.)\1{2,}/g, (_m, ch) => String(ch).repeat(maxRepeats)),
  };
}

export const leetspeak: NormalizerStep = {
  name: "leetspeak",
  run: (s) =>
    s
      .replace(/[@]/g, "a")
      .replace(/[!]/g, "i")
      .replace(/[0]/g, "o")
      .replace(/[1|]/g, "i")
      .replace(/[$]/g, "s"),
};
