---
title: "Introducing as-harness, a new testing framework for AssemblyScript"
description: "A first look at as-harness, a WASM-first AssemblyScript test framework with deterministic planning, coverage, snapshots, and multiple runtime hosts."
pubDate: 2026-03-24
author: "Joshua Tenner"
authorEmail: "tenner.joshua@gmail.com"
categories:
  - "WASM"
  - "Coding"
  - "Open Source"
  - "Tutorials"
image: "/images/posts/robot-working-hard.png"
---

I have been working on a new AssemblyScript testing framework called `as-harness`.

The short version is that it compiles your tests to WebAssembly, runs them through a shared harness contract, and gives you a much more explicit model for discovery, execution, reporting, coverage, and snapshots than older tools like `as-pect`.

## Getting started

The easiest place to start is the default `js` host.

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

You should get output like this:

```text
PASS 1 passed, 0 failed, 1 discovered with js.
```

If you want coverage right away:

```bash
npx as-harness run --coverage ./math.test.ts
```

You can also switch runtimes later with `--harness js`, `--harness wazero`, or `--harness wasmtime`, but the JS host is the easiest way to get moving.

One nice thing about `as-harness` is that you are not locked into one declaration style. The native `as-harness` API works out of the box, and there are also thin synchronous adapters for things like `node:test`, `uvu`, `jest`, `mocha`, `jasmine`, `tap`, `tape`, `qunit`, `ava`, and `vitest`.

## A basic mental model

The CLI flow is roughly this:

1. `as-harness` creates a temporary entry file that imports your test modules.
2. It compiles that entrypoint and the bundled harness libraries to WebAssembly.
3. The Wasm module exports a small harness surface like `discover()` and `run()`.
4. A host runtime instantiates the module and asks it to describe the test tree.
5. The host builds a deterministic execution plan.
6. The host replays targeted test nodes, collects events, merges coverage, and prints a report.

That host/runtime split is the center of the design.

The current shipped hosts are:

- `js`
- `wazero`
- `wasmtime`

So the framework is not tied to one engine or one runtime implementation.

## Writing tests

The native API is intentionally small and direct. You get familiar things like `test`, `describe`, hooks, `skip`, `todo`, and `only`, but you also get execution metadata that is much more useful in a WASM-oriented harness.

For example, test declarations can return chainable handles:

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

That gives you a few important controls:

- `dependsOn(...)` for explicit prerequisite edges
- `sequential(...)` for ordered scopes
- `inBand(...)` as a host-owned hint for keeping a scope on the main execution lane
- `bail(...)` and `continueOnFailure(...)` for failure-policy hints
- `expectFailure(...)` for tests that are meant to fail

The thin adapters lower their own surface onto that same shared machinery. So a familiar test API can still participate in the same planner, same node graph, and same reporting pipeline.

## How it works under the hood

The guest side exports a small ABI:

- `allocateNodeIndexBuffer(length)`
- `discover()`
- `run()`
- `invoke()`
- `memory`
- `__start` when present

The important idea here is `NodeIndex`.

The host does not ask the guest to “run the whole world” in one opaque call. It stages a `NodeIndex`, which is basically a path through the discovered test tree, and then calls `discover()` or `run()` for that specific node. That replay model keeps traversal explicit and gives the host room to do deterministic planning on its own side.

The current scheduler is also host-owned. The host discovers top-level branches, rediscovers each branch to collect visible nodes, builds a module-wide plan, and then runs ready work across same-machine worker slots when it can. If multiple tests are ready at the same time, declaration order is the stable tie-breaker.

That gives the framework some useful behavior:

- dependencies can block other tests transitively
- dependency cycles are reported explicitly
- `skip`, `todo`, and `only` affect discoverability and reachability in predictable ways
- `expectFailure` can satisfy dependents when the failure is intentional
- `bail` and `inBand` remain planner hints owned by the host instead of pretending to be hard guest guarantees

## Coverage

Coverage in `as-harness` is not just a final report formatter. It is wired all the way into the compile and runtime contract.

When you run with `--coverage`, the CLI enables a bundled AssemblyScript transform that instruments your sources and injects coverage declarations and hit calls. The guest imports a tiny `__asCovers` module with two core operations:

- declare a coverage point
- mark a coverage point as hit

Coverage points carry:

- file
- line
- column
- point type

The point types are:

- function
- block
- expression

On the host side, coverage collectors store declared points and covered ids, then merge snapshots across the run. After execution, the CLI can render the merged result as:

- `text`
- `json`
- `yaml`
- `csv`
- `lcov`
- `cobertura`

That is a pretty solid range for a pre-`1.0` tool.

You can also narrow instrumentation with:

```bash
npx as-harness run --coverage \
  --coverage-include "src/**/*.ts" \
  --coverage-exclude "**/*.spec.ts" \
  --coverage-point-type function \
  --coverage-point-type block \
  ./math.test.ts
```

One subtle implementation detail I like is that coverage is reported against your real source files, while the temporary generated run entry file is excluded from the final report.

## Snapshots and fixtures

Snapshots are host-owned artifacts, not something the guest writes to disk by itself.

Right now the shipped snapshot helpers live on the `uvu/assert` surface:

```ts
import { test } from "uvu";
import { fixture, snapshot } from "uvu/assert";

test("snapshot smoke", () => {
  snapshot<string>(fixture("cases/alpha.txt"), "snapshot smoke");
});
```

Fixtures are resolved from `__fixtures__/`, and snapshots are resolved from `__snapshots__/`, both relative to the project root and the active declaration source file.

So if your test file is:

```text
tests/parser/suite.test.ts
```

then the owning snapshot file is:

```text
__snapshots__/tests/parser/suite.test.snap
```

and a fixture like `fixture("cases/alpha.txt")` resolves under:

```text
__fixtures__/tests/parser/cases/alpha.txt
```

Snapshot entries use an `as-pect`-compatible export-map format:

```js
exports[`snapshot smoke~(0)`] = `"fixture text\n"`;
```

The key shape is based on:

- the execution name
- the occurrence ordinal within that execution

That means repeated snapshot calls inside one test become `name~(0)`, `name~(1)`, and so on.

The compare behavior is intentionally strict:

- missing snapshot files fail
- missing entries fail
- mismatched entries fail
- stale untouched entries fail

If you want to rewrite the snapshot state, you must opt in explicitly:

```bash
npx as-harness run --update-snapshots ./suite.test.ts
```

In update mode, missing and mismatched entries are rewritten and stale entries are removed. In normal mode, the run stays read-only.

I like this design a lot. It keeps snapshot churn explicit and makes stale data visible instead of silently tolerating it.

## Debugging details

Another nice detail in the current implementation is that bare `abort(...)` and `trace(...)` calls can be rewritten by the CLI wrapper into richer debug helpers.

That lets the host receive structured debug events with:

- the debug source kind
- the message
- numeric trace values
- best-effort location data
- harness-owned breadcrumb frames

So instead of just seeing a flat trap, the runner can explain which suite, test, or hook you were in when the failure happened.

## Where this is going

`as-harness` still feels early, because it is early. The project is pre-`1.0`, async support is intentionally deferred, and the adapter surfaces are still conservative.

But the foundation already feels right to me.

The important thing is not just that it runs AssemblyScript tests. It is that it gives AssemblyScript a testing model that is actually shaped around WebAssembly, explicit runtime contracts, deterministic planning, and host/guest boundaries that make sense.

That is the part I think is new.

Happy Testing, everyone!

> JT
