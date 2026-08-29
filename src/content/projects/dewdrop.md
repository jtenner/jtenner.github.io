---
title: "Dewdrop"
description: "The reference compiler and standard library for Dew, a statically typed language that targets WebAssembly GC with deterministic compilation and low runtime overhead."
semver: "development"
github: "https://github.com/jtenner/dewdrop"
projectUrl: "https://github.com/jtenner/dewdrop"
latestReleaseUrl: "https://github.com/jtenner/dewdrop"
featured: 3
---

## Dewdrop

Dewdrop is the reference compiler and standard library for Dew, a statically typed programming language that compiles to WebAssembly GC.

The project is built around a few priorities: fast generated programs, low memory use, deterministic output, clear compiler-phase boundaries, and a practical expression-oriented language.

The implemented language and toolchain include:

- Structs, enums, tuples, pattern matching, traits, generics, and closures
- Typed WasmGC dictionaries for trait values
- Deterministic specialization of generic runtime carriers
- Multi-file modules and statically linked programs
- UTF-8 strings, byte collections, iterators, ordered collections, JSON, SemVer, and SHA-256 in the standard library
- Native SIMD and WebAssembly intrinsic access
- Source-level tests with compiler-produced metadata
- WASI Preview 1 support
- Capability-based filesystem and process abstractions with WASI and Facet adapters
- Deterministic diagnostics, WAT snapshots, and WebAssembly execution tests

Dewdrop uses Starshine for WebAssembly validation and encoding. The language is under active development and does not yet have a stable release.
