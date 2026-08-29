---
title: "sfo-mb"
description: "A fully tested System F-ω style typechecker in MoonBit, featuring higher-kinded types, traits, recursive types, borrow checking, and import/rename tooling."
semver: "0.1.1"
github: "https://github.com/jtenner/system-f-omega-moonbit"
projectUrl: "https://github.com/jtenner/system-f-omega-moonbit"
latestReleaseUrl: "https://mooncakes.io/docs/jtenner/sfo@0.1.1"
---

## sfo-mb

`sfo-mb` is a MoonBit implementation of a System F-ω style typechecker with a small, explicit typed core.

It includes:

- Higher-kinded types and type-level functions
- `Forall` and trait-constrained `BoundedForall` polymorphism
- Records, tuples, variants, and recursive `Mu` types
- Trait dictionaries and constraint-driven resolution
- Native borrow and reference terms, including shared and mutable borrows, dereference, assignment, and move semantics
- Region and lifetime checks for invalid escapes and conflicting loans
- Import, dependency, and rename helpers for composing module contexts

The project is designed as a practical reference for compiler, DSL, and type-system work where explicit kinds, normalization, inference state, traits, and ownership-style checks need to coexist in one compact implementation.
