---
title: "Wago"
description: "A WebAssembly runtime for Go that compiles Wasm to native machine code without cgo, a C toolchain, or an interpreter."
semver: "pre-release"
github: "https://github.com/wago-org/wago"
projectUrl: "https://wago.sh"
latestReleaseUrl: "https://github.com/wago-org/wago/releases"
featured: 4
---

## Wago

Wago is a WebAssembly (Wasm) runtime for Go. It compiles Wasm to native machine code. It can run from the command line or inside a Go application.

Wago does not require cgo, a C toolchain, or an interpreter.

### Why I am building it

I want a runtime that is compact, fast, and easy to embed. I also want host features to stay separate from the core runtime.

Wago uses plugins for system interfaces such as WASI, the Component Model, and Facet. This keeps the compiler and execution core smaller. It also lets an embedder choose which host capabilities a guest can use.

### What it does

- Compiles Wasm to native code on amd64 and arm64.
- Runs on Linux, macOS, and Windows.
- Saves precompiled `.wago` artifacts.
- Builds standalone executables that can include Wasm modules and plugins.
- Exposes a Go API for embedded use.
- Supports modern Wasm work, including WebAssembly GC and SIMD.
- Uses plugins for host integrations.

### Engineering focus

Wago is also where I do much of my runtime engineering work. Important areas include:

- validation and type checking;
- native code generation;
- WebAssembly GC representation and collection;
- SIMD lowering;
- fuzzing and conformance testing;
- performance benchmarks;
- allocation and garbage-collection pressure;
- stable precompiled artifacts and release tooling.

### How it fits with the other projects

Wago is the runtime layer for several projects on this site. Dewdrop can produce WasmGC modules that Wago runs. Facet has a Wago reference plugin. Stage Left is designed as a separate process model that a runtime such as Wago could implement.

Wago is still pre-release. The public API and `.wago` artifact format can still change while the project is prepared for a stable release.
