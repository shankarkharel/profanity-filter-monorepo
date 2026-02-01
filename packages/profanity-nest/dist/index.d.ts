import { DynamicModule } from '@nestjs/common';
import * as _shankarkharel_profanity_core from '@shankarkharel/profanity-core';
import { EngineOptions, LanguagePack, ProfanityEngine } from '@shankarkharel/profanity-core';

interface ProfanityModuleOptions extends EngineOptions {
    packs: LanguagePack[];
}

declare class ProfanityModule {
    static forRoot(options: ProfanityModuleOptions): DynamicModule;
}

declare class ProfanityService {
    private readonly engine;
    constructor(engine: ProfanityEngine);
    analyze(text: string): _shankarkharel_profanity_core.AnalyzeResult;
    isProfane(text: string): boolean;
    censor(text: string, opts?: {
        censorChar?: string;
        preserveFirstLast?: boolean;
        replaceWith?: string;
    }): string;
}

export { ProfanityModule, type ProfanityModuleOptions, ProfanityService };
