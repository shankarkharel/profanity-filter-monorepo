import type { EngineOptions, LanguagePack } from "@shankarkharel/profanity-core";

export interface ProfanityModuleOptions extends EngineOptions {
  packs: LanguagePack[];
}
