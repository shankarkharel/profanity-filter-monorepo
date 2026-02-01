var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/profanity.module.ts
import { Module } from "@nestjs/common";
import { ProfanityEngine as ProfanityEngine2 } from "@your-scope/profanity-core";

// src/constants.ts
var PROFANITY_OPTIONS = /* @__PURE__ */ Symbol("PROFANITY_OPTIONS");
var PROFANITY_ENGINE = /* @__PURE__ */ Symbol("PROFANITY_ENGINE");

// src/profanity.service.ts
import { Inject, Injectable } from "@nestjs/common";
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
function _ts_metadata(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata, "_ts_metadata");
function _ts_param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
__name(_ts_param, "_ts_param");
var _ProfanityService = class _ProfanityService {
  constructor(engine) {
    __publicField(this, "engine");
    this.engine = engine;
  }
  analyze(text) {
    return this.engine.analyze(text);
  }
  isProfane(text) {
    return this.engine.isProfane(text);
  }
  censor(text, opts) {
    return this.engine.censor(text, opts);
  }
};
__name(_ProfanityService, "ProfanityService");
var ProfanityService = _ProfanityService;
ProfanityService = _ts_decorate([
  Injectable(),
  _ts_param(0, Inject(PROFANITY_ENGINE)),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof ProfanityEngine === "undefined" ? Object : ProfanityEngine
  ])
], ProfanityService);

// src/profanity.module.ts
function _ts_decorate2(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate2, "_ts_decorate");
var _ProfanityModule = class _ProfanityModule {
  static forRoot(options) {
    const optionsProvider = {
      provide: PROFANITY_OPTIONS,
      useValue: options
    };
    const engineProvider = {
      provide: PROFANITY_ENGINE,
      useFactory: /* @__PURE__ */ __name(() => new ProfanityEngine2(options.packs, options), "useFactory")
    };
    return {
      module: _ProfanityModule,
      providers: [
        optionsProvider,
        engineProvider,
        ProfanityService
      ],
      exports: [
        ProfanityService
      ]
    };
  }
};
__name(_ProfanityModule, "ProfanityModule");
var ProfanityModule = _ProfanityModule;
ProfanityModule = _ts_decorate2([
  Module({})
], ProfanityModule);
export {
  ProfanityModule,
  ProfanityService
};
