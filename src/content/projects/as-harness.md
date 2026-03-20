---
title: "as-harness"
description: "A modern testing framework for AssemblyScript focused on correctness, WASM-native execution, and improved ergonomics over legacy tools like as-pect."
semver: "0.1.0"
github: "https://github.com/jtenner/as-harness"
projectUrl: "https://github.com/jtenner/as-harness"
latestReleaseUrl: "https://github.com/jtenner/as-harness/releases"
featured: 1
---

## as-harness

`as-harness` is a next-generation testing framework for AssemblyScript designed to address limitations in older tooling like `as-pect`.

It provides a WASM-first testing model, enabling deterministic execution and tighter integration with low-level runtime behavior. The framework is built with correctness, extensibility, and developer ergonomics in mind.

Key goals include:

- Reliable execution across WASM runtimes
- Improved assertion and test composition APIs
- Better support for advanced testing scenarios (e.g. panic/throw simulation)
- A foundation for fuzzing and harness-driven validation
