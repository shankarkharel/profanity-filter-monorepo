"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ProfanityModule: () => ProfanityModule,
  ProfanityService: () => ProfanityService
});
module.exports = __toCommonJS(index_exports);

// src/profanity.module.ts
var import_common2 = require("@nestjs/common");
var import_profanity_core = require("@shankarkharel/profanity-core");

// src/constants.ts
var PROFANITY_OPTIONS = /* @__PURE__ */ Symbol("PROFANITY_OPTIONS");
var PROFANITY_ENGINE = /* @__PURE__ */ Symbol("PROFANITY_ENGINE");

// src/profanity.service.ts
var import_common = require("@nestjs/common");
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
  (0, import_common.Injectable)(),
  _ts_param(0, (0, import_common.Inject)(PROFANITY_ENGINE)),
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
      useFactory: /* @__PURE__ */ __name(() => new import_profanity_core.ProfanityEngine(options.packs, options), "useFactory")
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
  (0, import_common2.Module)({})
], ProfanityModule);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ProfanityModule,
  ProfanityService
});
