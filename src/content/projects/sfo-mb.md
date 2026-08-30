---
title: "sfo-mb"
description: "A System F-ω style type checker in MoonBit with higher-kinded types, traits, recursive types, borrow checks, and module composition tools."
semver: "0.1.1"
github: "https://github.com/jtenner/system-f-omega-moonbit"
projectUrl: "https://github.com/jtenner/system-f-omega-moonbit"
latestReleaseUrl: "https://mooncakes.io/docs/jtenner/sfo@0.1.1"
---

## sfo-mb

`sfo-mb` is a small type-checking library written in MoonBit. It uses ideas from System F-ω, a typed lambda calculus that supports polymorphism and type-level functions.

### What it models

- Higher-kinded types and type-level functions.
- `Forall` polymorphism.
- Trait-constrained `BoundedForall` polymorphism.
- Records, tuples, variants, and recursive `Mu` types.
- Trait dictionaries and constraint-based resolution.
- Shared and mutable borrows.
- Dereference, assignment, and move operations.
- Region and lifetime checks.
- Import, dependency, and rename helpers for module composition.

### Why it exists

The project keeps the type-system machinery explicit. Kinds, type normalization, inference state, trait evidence, and ownership checks are visible in the API instead of being hidden behind a complete language frontend.

This makes the library useful as a compact reference for compiler work, typed domain-specific languages, and experiments with type-system design.
