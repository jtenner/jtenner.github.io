---
title: "Facet"
description: "A small Core WebAssembly system interface with explicit Memory32, Memory64, multi-memory, WebAssembly GC array, text-width, and capability-oriented resource support."
semver: "0.1 draft"
github: "https://github.com/jtenner/facet-spec"
projectUrl: "https://github.com/jtenner/facet-spec"
latestReleaseUrl: "https://github.com/jtenner/wago-facet/releases/tag/v0.1.0"
featured: 1
---

## Facet

Facet is a small system interface for Core WebAssembly. It uses ordinary WebAssembly imports and does not require the Component Model, a Canonical ABI, or a special linker.

Its main design choice is to make guest representation explicit. A system operation can have separate imports for Memory32, Memory64, and supported WebAssembly GC arrays instead of routing all data through memory 0 or a hidden scratch buffer.

Facet 0.1 defines:

- Explicit memory selection for linear-memory operations
- Memory32 and Memory64 address forms
- Numeric and `v128` WebAssembly GC arrays as I/O buffers
- Nested GC arrays for scatter/gather operations
- Explicit UTF-8, UTF-16, and UTF-32 text forms
- Capability-oriented files, paths, sockets, polling, clocks, and resource handles
- Synchronous call lifetimes that prevent the host from retaining borrowed guest storage
- Import-driven feature detection through normal Core WebAssembly linking

The specification includes 143 focused conformance and harness tests. The reference implementation, `wago-facet`, implements the Facet 0.1 surface as a Wago plugin with 261 canonical imports and currently passes the complete conformance gate on Linux amd64 and arm64.

Facet 0.1 remains an experimental draft while the ABI is hardened and tested across runtime implementations.
