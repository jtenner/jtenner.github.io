---
title: "stage_left"
description: "An experimental actor-style process model for Core WebAssembly with isolated instances, links, signals, typed messages, and explicit lifecycle rules."
semver: "0.1-dev"
github: "https://github.com/jtenner"
projectUrl: "https://jtenner.github.io/projects/stage-left/"
latestReleaseUrl: "https://jtenner.github.io/projects/stage-left/"
---

## stage_left

`stage_left` is an experimental process specification for Core WebAssembly. It adds actor-style process concepts without turning the interface into a container or resource-configuration API.

The repository is not public yet. This page describes the current 0.1 design.

### Process model

One Stage Left process is one isolated WebAssembly instance.

A process can spawn another process. The spawn operation includes one Boolean value that decides whether the parent and child are linked.

A link connects process lifecycle events. It does not share mutable WebAssembly state.

### Signals and termination

Stage Left separates normal messages from process signals.

Important operations include:

- `process_link` and `process_unlink`;
- `process_kill` for forced external termination;
- `process_trap_signals` for signal handling;
- `signal_receive` for queued terminal signals.

There is no Stage Left `panic` instruction. An unhandled WebAssembly trap is the process panic outcome.

### Messages

Messages use explicit typed transactions. A sender prepares a message, writes typed values, and then commits or aborts the message.

Committed messages keep first-in, first-out ordering.

WebAssembly GC arrays are copied as values when they cross a process boundary. Mutable GC references are not shared between processes.

### Isolation and policy

Locally defined mutable WebAssembly state is private to each process. Imported mutable state must also be process-private or the runtime must reject the process image.

The runtime or embedder controls resource limits. Stage Left does not give a guest direct control over process quotas, memory budgets, or scheduler budgets.

### Status

The current specification is `0.1-dev`. The base process, message, signal, lifecycle, and portability design has no known high-priority design blocker.

Implementation and conformance work can still find problems before the first `0.1.0` freeze.
