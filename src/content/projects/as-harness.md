---
title: "as-harness"
description: "An AssemblyScript testing framework that compiles tests to WebAssembly and runs them through deterministic, replaceable host runtimes."
semver: "0.6.0"
github: "https://github.com/jtenner/as-harness"
projectUrl: "https://github.com/jtenner/as-harness"
latestReleaseUrl: "https://github.com/jtenner/as-harness/releases/tag/v0.6.0"
---

## as-harness

`as-harness` is a testing framework for AssemblyScript. It compiles tests to WebAssembly and runs them through a shared host contract.

The test model is not tied to one WebAssembly runtime.

### What it provides

- Native `as-harness` declarations.
- Synchronous `node:test` support.
- Deterministic dependency-aware scheduling.
- JavaScript, wazero, and wasmtime hosts.
- Custom host modules.
- Thin adapters for Jest, Mocha, Jasmine, AVA, TAP, Tape, QUnit, Vitest, and uvu.
- Coverage output in text, JSON, YAML, CSV, LCOV, and Cobertura formats.
- Explicit snapshot update support.
- Structured reports for planning, blocked tests, aborts, traces, and source locations.

### Why the host owns the plan

The WebAssembly guest describes the test tree. The host builds the execution plan.

This split lets the host enforce dependencies, stable ordering, failure policy, and worker scheduling without putting host-specific behavior into the guest module.

Hints such as `inBand`, `bail`, and `continueOnFailure` remain host-owned planning inputs.

### Status

`as-harness` is still pre-1.0. The current release is 0.6.0.

The main goal is a stable Wasm-first testing contract with replaceable runtimes and predictable execution.
