---
title: "Hello, world"
description: "A short introduction to what I build and what I write about on this site."
pubDate: 2026-03-20
author: "Joshua Tenner"
authorEmail: "tenner.joshua@gmail.com"
categories:
  - "Coding"
image: ""
---

# Hello, world

> **Update — August 2026:** I revised this introduction because my current work is much more focused on compilers, runtimes, and WebAssembly.

Hi, I’m Joshua Tenner.

I build compilers, WebAssembly runtimes, programming languages, testing tools, and other developer tools.

A large part of my work is about WebAssembly, usually called Wasm. I care about the parts that become important when a tool must be correct, fast, and maintainable.

That includes:

- WebAssembly validation and optimization;
- compiler intermediate representations;
- native code generation;
- WebAssembly GC;
- SIMD;
- fuzzing and conformance testing;
- runtime and host interfaces;
- allocation and garbage-collection pressure;
- reproducible builds and release workflows;
- AI-assisted software development.

Several projects on this site work at different layers of the same system.

**Dewdrop** compiles the Dew programming language to WebAssembly GC. **Starshine** validates and optimizes WebAssembly modules. **Wago** compiles and runs WebAssembly as native code. **Facet** defines a system interface for modern Core WebAssembly. **stage_left** explores isolated actor-style processes. **as-harness** provides WebAssembly-based testing infrastructure for AssemblyScript.

I use this blog as an engineering record. Some articles explain a design. Some document a problem and its solution. Others teach a technical idea that I needed to understand clearly myself.

I try to keep the writing simple. Technical subjects already have enough complexity without adding unnecessary prose.

```ts
console.log("Hello world!");
```

If you are interested in compilers, WebAssembly, runtimes, testing, or developer tools, you should find something useful here.

Thanks for reading.

> JT
