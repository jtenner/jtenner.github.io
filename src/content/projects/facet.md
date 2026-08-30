---
title: "Facet"
description: "A Core WebAssembly system interface for Memory32, Memory64, multi-memory, WebAssembly GC arrays, explicit text widths, and capability-based resources."
semver: "0.1 draft"
github: "https://github.com/jtenner/facet-spec"
projectUrl: "https://github.com/jtenner/facet-spec"
latestReleaseUrl: "https://github.com/jtenner/wago-facet/releases/tag/v0.1.0"
featured: 1
---

## Facet

Facet is a small system interface for Core WebAssembly. It uses ordinary WebAssembly imports. It does not require the Component Model, a Canonical ABI, or a special linker.

### Why does Facet exist?

Many WebAssembly system interfaces assume that guest data lives in one linear memory. Memory 0 often becomes the default path for strings, buffers, and system calls.

That assumption becomes restrictive when a module uses:

- more than one memory;
- Memory64;
- WebAssembly GC arrays;
- UTF-16 or UTF-32 data;
- a runtime that should not copy GC data through hidden linear-memory scratch space.

Facet makes the guest representation explicit instead of hiding it.

For example, the same read operation can have separate imports for Memory32, Memory64, and supported GC array types. The guest selects the representation through the import that it uses.

### What Facet defines

Facet 0.1 includes:

- explicit memory selection for linear-memory operations;
- Memory32 and Memory64 address forms;
- numeric and `v128` WebAssembly GC arrays as I/O buffers;
- nested GC arrays for scatter and gather I/O;
- explicit UTF-8, UTF-16, and UTF-32 text forms;
- capability-based files, paths, sockets, polling, clocks, and resource handles;
- synchronous call lifetimes for borrowed guest storage;
- feature detection through normal Core WebAssembly linking.

The host cannot keep a borrowed guest pointer or GC reference after an imported Facet call returns.

### Reference implementation

The specification includes 143 focused conformance and harness tests.

`wago-facet` is the first reference implementation. It implements Facet 0.1 as a Wago plugin with 261 canonical imports. It passes the complete Facet conformance gate on Linux amd64 and arm64.

Facet 0.1 is still an experimental draft. The ABI is being tested and hardened before it is frozen.
