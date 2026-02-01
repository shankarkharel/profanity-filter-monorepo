import { Inject, Injectable } from "@nestjs/common";
import type { ProfanityEngine } from "@shankarkharel/profanity-core";
import { PROFANITY_ENGINE } from "./constants.js";

@Injectable()
export class ProfanityService {
  constructor(@Inject(PROFANITY_ENGINE) private readonly engine: ProfanityEngine) {}

  analyze(text: string) {
    return this.engine.analyze(text);
  }

  isProfane(text: string) {
    return this.engine.isProfane(text);
  }

  censor(text: string, opts?: { censorChar?: string; preserveFirstLast?: boolean; replaceWith?: string }) {
    return this.engine.censor(text, opts);
  }
}
