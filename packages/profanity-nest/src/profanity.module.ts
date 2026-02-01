import { DynamicModule, Module, Provider } from "@nestjs/common";
import { ProfanityEngine } from "@shankarkharel/profanity-core";
import { PROFANITY_ENGINE, PROFANITY_OPTIONS } from "./constants.js";
import type { ProfanityModuleOptions } from "./interfaces.js";
import { ProfanityService } from "./profanity.service.js";

@Module({})
export class ProfanityModule {
  static forRoot(options: ProfanityModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: PROFANITY_OPTIONS,
      useValue: options
    };

    const engineProvider: Provider = {
      provide: PROFANITY_ENGINE,
      useFactory: () => new ProfanityEngine(options.packs, options)
    };

    return {
      module: ProfanityModule,
      providers: [optionsProvider, engineProvider, ProfanityService],
      exports: [ProfanityService]
    };
  }
}
