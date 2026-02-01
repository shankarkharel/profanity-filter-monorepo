

````md
# Profanity Filter (TypeScript)

A small profanity detection + censoring engine with language packs (English + Nepali Devanagari + Nepali Romanized), and a NestJS integration package.

## Packages (npm)

- `@shankarkharel/profanity-core` — core engine
- `@shankarkharel/profanity-lang-en` — English pack
- `@shankarkharel/profanity-lang-ne` — Nepali (Devanagari) pack
- `@shankarkharel/profanity-lang-ne-rom` — Nepali (Romanized) pack
- `@shankarkharel/profanity-nest` — NestJS integration

## Install

### Node / TypeScript

```bash
npm i @shankarkharel/profanity-core @shankarkharel/profanity-lang-en
# optional Nepali packs
npm i @shankarkharel/profanity-lang-ne @shankarkharel/profanity-lang-ne-rom
````

### NestJS

```bash
npm i @shankarkharel/profanity-nest @shankarkharel/profanity-core @shankarkharel/profanity-lang-en
# optional
npm i @shankarkharel/profanity-lang-ne @shankarkharel/profanity-lang-ne-rom
```

## Quick Start

```ts
import { ProfanityEngine } from "@shankarkharel/profanity-core";
import en from "@shankarkharel/profanity-lang-en";
import ne from "@shankarkharel/profanity-lang-ne";
import neRom from "@shankarkharel/profanity-lang-ne-rom";

const engine = new ProfanityEngine([en, ne, neRom], {
  severityThreshold: 1,
});

const text = "this is crap and गधा and kutta";
console.log(engine.analyze(text));
console.log(engine.censor(text, { preserveFirstLast: true }));
```

## Links

* Repo: YOUR_REPO_URL
* Issues: YOUR_REPO_URL/issues

````

---

## ✅ `packages/profanity-core/README.md`

```md
# @shankarkharel/profanity-core

Core profanity detection + censoring engine.

## Install

```bash
npm i @shankarkharel/profanity-core
````

You typically install at least one language pack too:

```bash
npm i @shankarkharel/profanity-lang-en
# optional:
npm i @shankarkharel/profanity-lang-ne @shankarkharel/profanity-lang-ne-rom
```

## Usage

```ts
import { ProfanityEngine } from "@shankarkharel/profanity-core";
import en from "@shankarkharel/profanity-lang-en";

const engine = new ProfanityEngine([en]);

console.log(engine.isProfane("this is clean")); // false
console.log(engine.isProfane("this is crap"));  // true

const result = engine.analyze("this is crap");
console.log(result.profane);    // true
console.log(result.maxSeverity); // depends on pack
console.log(result.matches);     // list of matches
```

## API

### `new ProfanityEngine(packs, options?)`

```ts
const engine = new ProfanityEngine(packs, options);
```

* `packs: LanguagePack[]` — language packs to load (e.g. English, Nepali)
* `options?: EngineOptions`

#### EngineOptions

```ts
export interface EngineOptions {
  severityThreshold?: 1 | 2 | 3 | 4 | 5; // default 1
  enabledLanguages?: string[];           // if set, only these pack codes
  extraTerms?: TermEntry[];              // app-specific extra terms
  extraAllowlist?: string[];             // app-specific allowlist (never match)
  enableRepeatCollapse?: boolean;        // default true (collapses repeated chars)
  maxTextLength?: number;                // default 20_000 (safety)
}
```

Examples:

```ts
// Only analyze English
const engine = new ProfanityEngine([en, ne, neRom], {
  enabledLanguages: ["en"],
});

// Require stronger severity
const engine = new ProfanityEngine([en], {
  severityThreshold: 3,
});

// Add your own terms
const engine = new ProfanityEngine([en], {
  extraTerms: [
    { term: "dummybad", severity: 1, category: ["custom"], match: "word" },
    { term: "very bad phrase", severity: 3, category: ["custom"], match: "phrase" },
  ],
});

// Allow certain words
const engine = new ProfanityEngine([en], {
  extraAllowlist: ["assistant", "class"],
});
```

---

### `engine.analyze(text): AnalyzeResult`

Analyzes text and returns details.

```ts
const res = engine.analyze("this is crap");
```

Returns:

```ts
export interface AnalyzeResult {
  profane: boolean;
  score: number;                // 0..100
  maxSeverity: 0 | 1 | 2 | 3 | 4 | 5;
  matches: MatchDetail[];
}

export interface MatchDetail {
  pack: string;                 // language code (e.g. "en")
  term: string;                 // canonical term from the pack
  severity: 1 | 2 | 3 | 4 | 5;
  category: string[];
  index: number;                // char index in normalized text (best-effort)
}
```

---

### `engine.isProfane(text): boolean`

Convenience wrapper:

```ts
engine.isProfane("hello");     // false
engine.isProfane("this is crap"); // true
```

---

### `engine.censor(text, options?): string`

Censors matched terms in the **original text** (best-effort replacement).

```ts
engine.censor("this is crap");
// "this is ****" (depends on term length)
```

#### Censor options

Your implementation supports:

* `censorChar?: string` — default `"*"`
* `replaceWith?: string` — if provided, replaces term with this fixed token
* `preserveFirstLast?: boolean` — legacy shortcut (preserve 1 prefix + 1 suffix)
* `preservePrefix?: number` — keep first N characters
* `preserveSuffix?: number` — keep last N characters

Examples:

```ts
engine.censor("this is crap", { censorChar: "#" });
// "this is ####"

engine.censor("this is crap", { preserveFirstLast: true });
// "this is c**p"

engine.censor("this is crap", { preservePrefix: 2, preserveSuffix: 1 });
// "this is cr*p"

engine.censor("this is crap", { replaceWith: "[censored]" });
// "this is [censored]"
```

---

## Matching behavior

Each term has `match`:

* `"word"` (default): token-based word matching after normalization
* `"phrase"`: substring matching on normalized text

> Important: `index` returned is on **normalized text**, and censoring currently does a best-effort replace in the original text (regex replace of matched canonical terms). For very advanced use (precise original indices), a future improvement would map normalized indices to original indices.

---

## Normalization pipeline

Before matching, text is normalized with:

* NFKC normalization
* lowercasing
* (English only) leetspeak normalization
* (optional) repeat collapse (default enabled)
* punctuation stripping
* whitespace collapse
* plus any `pack.normalizers` you provide

This helps catch variations like repeated letters, extra punctuation, etc.

---

## Creating a custom Language Pack

A language pack is:

```ts
export interface LanguagePack {
  code: string;                 // "en", "ne", "ne-rom"
  version: string;
  terms: TermEntry[];
  allowlist?: string[];
  normalizers?: NormalizerStep[];
}

export interface TermEntry {
  term: string;                 // canonical form
  severity: 1 | 2 | 3 | 4 | 5;   // 1 mild ... 5 extreme
  category?: string[];          // e.g. ["insult", "sexual", "slur"]
  match?: "word" | "phrase";    // default "word"
  variants?: string[];          // additional spellings/romanizations
}
```

Example pack:

```ts
import type { LanguagePack } from "@shankarkharel/profanity-core";

const myPack: LanguagePack = {
  code: "my-lang",
  version: "1.0.0",
  allowlist: ["assistant"],
  terms: [
    { term: "badword", severity: 3, category: ["general"], match: "word" },
    { term: "very bad phrase", severity: 4, category: ["general"], match: "phrase" },
    { term: "kutta", severity: 3, category: ["insult"], variants: ["kuttaaa"] },
  ],
};

export default myPack;
```

Then:

```ts
const engine = new ProfanityEngine([myPack]);
engine.analyze("badword here");
```

---

## License

MIT (or your chosen license)

````

---

## ✅ `packages/profanity-lang-en/README.md`

```md
# @shankarkharel/profanity-lang-en

English profanity language pack for `@shankarkharel/profanity-core`.

## Install

```bash
npm i @shankarkharel/profanity-core @shankarkharel/profanity-lang-en
````

## Usage

```ts
import { ProfanityEngine } from "@shankarkharel/profanity-core";
import en from "@shankarkharel/profanity-lang-en";

const engine = new ProfanityEngine([en]);

console.log(engine.analyze("this is crap"));
console.log(engine.censor("this is crap", { preserveFirstLast: true }));
```

## Notes

* Matching is normalized (lowercase, punctuation stripped, whitespace collapsed).
* English also applies leetspeak normalization.

````

---

## ✅ `packages/profanity-lang-ne/README.md`

```md
# @shankarkharel/profanity-lang-ne

Nepali profanity language pack (Devanagari) for `@shankarkharel/profanity-core`.

## Install

```bash
npm i @shankarkharel/profanity-core @shankarkharel/profanity-lang-ne
````

## Usage

```ts
import { ProfanityEngine } from "@shankarkharel/profanity-core";
import ne from "@shankarkharel/profanity-lang-ne";

const engine = new ProfanityEngine([ne]);

const text = "तँ गधा हो?";
console.log(engine.analyze(text));
console.log(engine.censor(text, { replaceWith: "[censored]" }));
```

## Tips

* This pack targets Nepali written in **Devanagari**.
* For Romanized Nepali (e.g. `kutta`, `sale`) use `@shankarkharel/profanity-lang-ne-rom`.

````

---

## ✅ `packages/profanity-lang-ne-rom/README.md`

```md
# @shankarkharel/profanity-lang-ne-rom

Nepali profanity language pack (Romanized) for `@shankarkharel/profanity-core`.

## Install

```bash
npm i @shankarkharel/profanity-core @shankarkharel/profanity-lang-ne-rom
````

## Usage

```ts
import { ProfanityEngine } from "@shankarkharel/profanity-core";
import neRom from "@shankarkharel/profanity-lang-ne-rom";

const engine = new ProfanityEngine([neRom]);

const text = "kutta and sale";
console.log(engine.analyze(text));
console.log(engine.censor(text, { preservePrefix: 1, preserveSuffix: 1 }));
```

## Tips

* This pack targets Nepali profanity written in **Latin/Roman letters**.
* For Devanagari Nepali use `@shankarkharel/profanity-lang-ne`.

````

---

## ✅ `packages/profanity-nest/README.md` (NestJS)

**Important:** I’m writing this in a standard way. If your Nest package exports different names than below, paste your `packages/profanity-nest/src/index.ts` and I’ll make it exact.

```md
# @shankarkharel/profanity-nest

NestJS integration for `@shankarkharel/profanity-core`.

## Install

```bash
npm i @shankarkharel/profanity-nest @shankarkharel/profanity-core
npm i @shankarkharel/profanity-lang-en
# optional:
npm i @shankarkharel/profanity-lang-ne @shankarkharel/profanity-lang-ne-rom
````

## Setup

```ts
import { Module } from "@nestjs/common";
import { ProfanityModule } from "@shankarkharel/profanity-nest";

import en from "@shankarkharel/profanity-lang-en";
import ne from "@shankarkharel/profanity-lang-ne";
import neRom from "@shankarkharel/profanity-lang-ne-rom";

@Module({
  imports: [
    ProfanityModule.forRoot({
      packs: [en, ne, neRom],
      options: {
        severityThreshold: 1,
      },
    }),
  ],
})
export class AppModule {}
```

## Use in a service/controller

```ts
import { Controller, Get } from "@nestjs/common";
import { ProfanityService } from "@shankarkharel/profanity-nest";

@Controller()
export class AppController {
  constructor(private readonly profanity: ProfanityService) {}

  @Get("check")
  check() {
    const text = "this is crap and kutta";

    return {
      analysis: this.profanity.analyze(text),
      censored: this.profanity.censor(text, { preserveFirstLast: true }),
      profane: this.profanity.isProfane(text),
    };
  }
}
```

## What it does

* Provides a singleton `ProfanityEngine` configured with packs/options
* Exposes `analyze`, `isProfane`, `censor` via injectable service

## License

MIT 


