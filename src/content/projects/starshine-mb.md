---
title: "Starshine"
description: "A WebAssembly optimizer and transformation toolkit with validation, an owned function IR, analysis overlays, fuzzing, and host-facing interfaces."
semver: "development"
github: "https://github.com/jtenner/starshine-mb"
projectUrl: "https://github.com/jtenner/starshine-mb"
latestReleaseUrl: "https://github.com/jtenner/starshine-mb"
featured: 2
---

## Starshine

Starshine is a WebAssembly optimizer and transformation toolkit. It parses, validates, inspects, changes, and encodes WebAssembly modules.

Starshine is implemented in MoonBit. The implementation language is not the main point of the project. The main work is compiler architecture, optimizer correctness, and WebAssembly tooling.

### Optimizer architecture

Starshine uses `HotFunc` as the owned representation for a function while optimization runs. Raw WebAssembly expressions stay at the decode, encode, validation, and debug boundaries.

Analysis data is derived from `HotFunc`. This includes:

- control-flow graphs (CFGs);
- dominance information;
- liveness;
- use-definition data;
- effect and trap information;
- loop information;
- static single assignment (SSA) data.

These analyses are overlays. They can be rebuilt when a pass changes the function.

### Correctness work

An optimizer must do more than produce valid WebAssembly. It must preserve program behavior.

Starshine uses several layers of checks:

- hot-IR verification before and after optimization;
- final WebAssembly validation;
- deterministic valid-module generation;
- pass-focused fuzzing;
- differential execution and comparison;
- automatic reduction of failing cases.

This work is designed to catch changes that validate correctly but change what a program does.

### Tooling

Starshine also includes:

- WAT and WAST parsing and printing;
- WebAssembly binary decoding and encoding;
- a registry-backed optimization pipeline;
- command-line and JavaScript interfaces;
- a WasmGC foreign-function interface;
- a portable WIT and Component Model facade.

Dewdrop uses Starshine as part of its WebAssembly GC compiler pipeline.

Starshine is under active development. More optimizer passes are moving onto the newer owned function IR and analysis model.
