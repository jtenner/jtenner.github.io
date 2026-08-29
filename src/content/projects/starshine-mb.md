---
title: "Starshine"
description: "A MoonBit WebAssembly toolkit for parsing, validation, binary roundtrips, optimizer IR, transformation passes, fuzzing, and portable host-facing interfaces."
semver: "development"
github: "https://github.com/jtenner/starshine-mb"
projectUrl: "https://github.com/jtenner/starshine-mb"
latestReleaseUrl: "https://github.com/jtenner/starshine-mb"
featured: 2
---

## Starshine

Starshine is a WebAssembly toolkit and optimizer implemented in MoonBit. It provides the infrastructure needed to parse, validate, inspect, transform, and encode WebAssembly modules.

The project now includes:

- WAT and WAST parsing and printing
- WebAssembly binary decoding and encoding
- Module validation and deterministic valid-module generation
- `HotFunc`, an owned optimizer function representation with explicit lift and lower boundaries
- Derived CFG, dominance, liveness, use-def, effect, loop, and SSA analyses
- A registry-backed optimization pipeline with module and function passes
- Verification before and after hot-IR optimization, followed by final module validation
- Differential and pass-focused fuzzing infrastructure
- CLI and JavaScript wrappers
- A WasmGC FFI surface and a portable WIT Component Model facade

Starshine is also used by Dewdrop as part of its WebAssembly GC backend. The optimizer remains under active development while passes continue to move onto the newer hot-IR architecture.
