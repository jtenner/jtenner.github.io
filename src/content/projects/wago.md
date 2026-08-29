---
title: "Wago"
description: "A compact and extensible WebAssembly runtime for Go that compiles Wasm to native machine code without cgo, a C toolchain, or an interpreter."
semver: "pre-release"
github: "https://github.com/wago-org/wago"
projectUrl: "https://wago.sh"
latestReleaseUrl: "https://github.com/wago-org/wago/releases"
featured: 4
---

## Wago

Wago is a WebAssembly runtime for Go. It compiles WebAssembly to native machine code and can be used from its CLI or embedded as a Go package.

Current capabilities include:

- Native compilation on amd64 and arm64
- Linux, macOS, and Windows support
- Precompiled `.wago` artifacts
- Standalone executable generation
- A Go embedding API
- Plugin-based host integrations instead of putting every system interface into the core runtime
- WASI and Component Model integrations through plugins
- WebAssembly GC and modern WebAssembly feature work
- Validation, fuzzing, benchmark, and allocation-regression infrastructure

Wago is still pre-release. The runtime, artifact format, and public APIs can still change while the project is hardened for a stable release.
