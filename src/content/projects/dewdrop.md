---
title: "Dewdrop"
description: "The compiler and standard library for Dew, a statically typed programming language that compiles directly to WebAssembly GC."
semver: "development"
github: "https://github.com/jtenner/dewdrop"
projectUrl: "https://github.com/jtenner/dewdrop"
latestReleaseUrl: "https://github.com/jtenner/dewdrop"
featured: 3
---

## Dewdrop

### What is Dew?

Dew is a statically typed programming language. Dewdrop is its reference compiler and standard library.

Dew compiles directly to WebAssembly GC (WasmGC). WasmGC gives a WebAssembly program managed structs, arrays, strings, closures, and other reference types without requiring the language to build all of them in linear memory.

### Why does it exist?

Dewdrop explores what a language can look like when WasmGC is a primary compilation target.

The compiler has a few important goals:

- fast generated programs;
- low memory use;
- deterministic output;
- clear compiler-phase boundaries;
- practical language features without a large runtime layer.

### What is unusual about it?

Dew already includes substantial language and standard-library work:

- structs, enums, tuples, pattern matching, traits, generics, and closures;
- typed WasmGC dictionaries for runtime trait values;
- deterministic specialization for generic runtime representations;
- multi-file modules and static linking;
- GC-backed collections and iterators;
- UTF-8 strings and byte data;
- JSON, Semantic Versioning, and SHA-256 support;
- native SIMD and generated WebAssembly intrinsics;
- source-level tests with compiler-produced metadata;
- capability-based filesystem and process APIs;
- WASI and Facet adapters.

Dewdrop uses Starshine to validate and encode WebAssembly modules. It also uses Starshine as part of its optimizer and backend work.

The language is under active development. There is not yet a stable Dew release.
