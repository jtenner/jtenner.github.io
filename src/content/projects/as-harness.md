---
title: "as-harness"
description: "An AssemblyScript testing framework that compiles tests to WebAssembly and runs them through deterministic host harnesses, with adapters, coverage, snapshots, and dependency-aware scheduling."
semver: "0.6.0"
github: "https://github.com/jtenner/as-harness"
projectUrl: "https://github.com/jtenner/as-harness"
latestReleaseUrl: "https://github.com/jtenner/as-harness/releases/tag/v0.6.0"
---

## as-harness

`as-harness` is a testing framework for AssemblyScript. It compiles tests to WebAssembly and runs them through a shared harness contract instead of tying the test model to one host runtime.

The current release includes:

- Native `as-harness` declarations and synchronous `node:test` support
- Dependency-aware test scheduling with deterministic ordering
- Host-owned `inBand`, `bail`, and `continueOnFailure` planning hints
- JavaScript, wazero, and wasmtime runtime hosts
- Custom runtime harness modules
- Thin adapters for Jest, Mocha, Jasmine, AVA, TAP, Tape, QUnit, Vitest, and uvu
- Coverage output in text, JSON, YAML, CSV, LCOV, and Cobertura formats
- Snapshot update support
- Structured reporting for planning, blocked tests, aborts, traces, and source locations

The project is still pre-1.0. Its main goal is to give AssemblyScript tests a stable Wasm-first execution contract while keeping the host runtime replaceable.
