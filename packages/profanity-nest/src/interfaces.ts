import type { EngineOptions, LanguagePack } from "@your-scope/profanity-core";

export interface ProfanityModuleOptions extends EngineOptions {
  packs: LanguagePack[];
}
