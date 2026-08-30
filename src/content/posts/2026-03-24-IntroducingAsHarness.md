---
title: "Introducing as-harness, a new testing framework for AssemblyScript"
description: "A practical introduction to as-harness, a Wasm-first AssemblyScript test framework with deterministic planning, coverage, snapshots, and multiple runtime hosts."
pubDate: 2026-03-24
author: "Joshua Tenner"
authorEmail: "tenner.joshua@gmail.com"
categories:
  - "WASM"
  - "Coding"
  - "Open Source"
  - "Tutorials"
image: ""
---

> **Update — August 2026:** `as-harness` is now at version 0.6.0. The project has added more adapters, stronger release checks, and more host support. This article still explains the core design. See the [current project page](/projects/as-harness/) for current status.

I have been working on an AssemblyScript testing framework called `as-harness`.

It compiles tests to WebAssembly, usually called Wasm. A host runtime then discovers and runs those tests through a shared contract.

The goal is simple: keep the test model stable while allowing the host runtime to change.

## Getting started

The easiest host to start with is `js`.

```bash
npm install -D assemblyscript @as-harness/cli
```

Create a test file:

```ts
import { test } from "as-harness";

test("adds two numbers", (t) => {
  t.assert.strictEqual<i32>(1 + 1, 2);
});
```

Run it:

```bash
npx as-harness run ./math.test.ts
```

You should get output similar to this:

```text
PASS 1 passed, 0 failed, 1 discovered with js.
```

Enable coverage with:

```bash
npx as-harness run --coverage ./math.test.ts
```

The built-in hosts are `js`, `wazero`, and `wasmtime`.

You can also use several synchronous test APIs. These include the native `as-harness` API, `node:test`, uvu, Jest, Mocha, Jasmine, TAP, Tape, QUnit, AVA, and Vitest.

## The basic design

The command-line flow has six main steps:

1. `as-harness` creates a temporary entry file that imports your test modules.
2. AssemblyScript compiles that entry file and the harness code to Wasm.
3. The Wasm module exports a small test interface.
4. The host creates the Wasm instance and asks it to describe the test tree.
5. The host builds a deterministic execution plan.
6. The host runs selected test nodes, collects events, merges coverage, and prints a report.

The split between guest and host is the main design choice.

The **guest** is the compiled Wasm test module. It describes tests and runs selected test code.

The **host** is the runtime process. It owns planning, scheduling, files, reports, and other host-specific behavior.

Because of this split, the framework does not depend on one Wasm engine.

## Writing tests

The native API includes familiar operations such as `test`, `describe`, hooks, `skip`, `todo`, and `only`.

It also includes explicit scheduling information.

For example:

```ts
import { sequential, test } from "as-harness";

const parse = test("parses input", (t) => {
  t.assert.ok<bool>(true);
});

test("evaluates parsed input", (t) => {
  t.assert.strictEqual<i32>(40 + 2, 42);
}).dependsOn(parse);

sequential("ordered formatting checks", () => {
  test("format 1", () => {});
  test("format 2", () => {});
});
```

Important controls include:

- `dependsOn(...)` for explicit prerequisites;
- `sequential(...)` for ordered scopes;
- `inBand(...)` as a host hint for main-lane execution;
- `bail(...)` as a host hint to stop related work after a failure;
- `continueOnFailure(...)` as a failure-policy hint;
- `expectFailure(...)` for tests that are expected to fail.

Adapters use the same underlying planner. This means different test APIs can share the same execution and reporting model.

## The guest interface

The guest exports a small application binary interface (ABI). An ABI is the low-level contract between two compiled parts of a system.

The important exports include:

- `allocateNodeIndexBuffer(length)`;
- `discover()`;
- `run()`;
- `invoke()`;
- `memory`;
- `__start` when the module has one.

A key concept is `NodeIndex`.

A `NodeIndex` identifies one location in the discovered test tree. The host stages that index before it asks the guest to discover or run that node.

The host does not need one opaque "run everything" call. It can select work one node at a time.

That makes deterministic planning possible on the host side.

## Scheduling

The host owns the scheduler.

It discovers the visible test nodes, builds a plan, and runs work when prerequisites are satisfied. If more than one test is ready, declaration order is the stable tie-breaker.

This gives the framework predictable behavior:

- a failed prerequisite can block dependent tests;
- a blocked test can also block tests that depend on it;
- dependency cycles are reported as cycles;
- `skip`, `todo`, and `only` affect which tests can run;
- an expected failure can satisfy a dependency when it fails as expected;
- `bail` and `inBand` remain host policy instead of guest guarantees.

## Coverage

Coverage is part of both compilation and execution.

When you use `--coverage`, an AssemblyScript transform adds coverage points to the source. The compiled guest reports when those points run.

A coverage point records:

- file;
- line;
- column;
- point type.

The point type can be:

- function;
- block;
- expression.

The host merges coverage from the complete run.

The CLI can write the result as:

- text;
- JSON;
- YAML;
- CSV;
- LCOV;
- Cobertura.

You can also limit which source files or point types are instrumented:

```bash
npx as-harness run --coverage \
  --coverage-include "src/**/*.ts" \
  --coverage-exclude "**/*.spec.ts" \
  --coverage-point-type function \
  --coverage-point-type block \
  ./math.test.ts
```

The generated temporary entry file is not reported as if it were normal project source.

## Snapshots and fixtures

Snapshots are host-owned files. The Wasm guest does not write them directly.

For example, the uvu adapter can use snapshot and fixture helpers:

```ts
import { test } from "uvu";
import { fixture, snapshot } from "uvu/assert";

test("snapshot smoke", () => {
  snapshot<string>(fixture("cases/alpha.txt"), "snapshot smoke");
});
```

Fixtures live under `__fixtures__/`. Snapshots live under `__snapshots__/`.

Normal test runs do not rewrite snapshots.

Use this command when you intend to update them:

```bash
npx as-harness run --update-snapshots ./suite.test.ts
```

This makes snapshot changes explicit. It also makes stale snapshot data visible instead of silently accepting it.

## Debug information

The runner can also receive structured information from `abort(...)` and `trace(...)` calls.

A debug event can include:

- the source of the event;
- the message;
- numeric trace values;
- source-location data when available;
- the active suite, test, or hook.

This gives the host more context than a raw Wasm trap alone.

## Where the project is going

`as-harness` is still pre-1.0. Its synchronous API is intentional. Async and Promise-based test APIs are not part of the current contract.

The important part of the project is not only that it runs AssemblyScript tests.

The important part is the execution model: explicit Wasm boundaries, deterministic host planning, replaceable runtimes, and structured test metadata.

That is the foundation I want to keep stable as the project grows.

> JT
