import { ProfanityEngine } from "@your-scope/profanity-core";
import en from "@your-scope/profanity-lang-en";
import ne from "@your-scope/profanity-lang-ne";
import neRom from "@your-scope/profanity-lang-ne-rom";
const engine = new ProfanityEngine([en, ne, neRom], {
  enabledLanguages: ["en", "ne", "ne-rom"],
  severityThreshold: 1,
  extraTerms: [{ term: "dummybad", severity: 1 }]
});

console.log(en);
console.log(engine.analyze("this is crap and dummybad and गधा and kutta ",{ preserveFirstLast: true }));
console.log(engine.censor("this is crap and dummybad and गधा and kutta",{ preserveFirstLast: true }));
