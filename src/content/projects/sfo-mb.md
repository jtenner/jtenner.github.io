---
title: "sfo-mb"
description: "A fully tested System F-ω style typechecker in MoonBit, featuring higher-kinded types, traits, recursive types, borrow checking, and import/rename tooling."
semver: "0.1.1"
github: "https://github.com/jtenner/system-f-omega-moonbit"
projectUrl: "https://github.com/jtenner/system-f-omega-moonbit"
latestReleaseUrl: "https://mooncakes.io/docs/jtenner/sfo@0.1.1"
featured: 3
---

## sfo-mb

`sfo-mb` is a MoonBit port of a System F-ω style typechecker with a focus on explicit type theory features:

- higher-kinded types (`*` and `k1 -> k2`)
- polymorphism (`Forall`, `BoundedForall`)
- records, tuples, variants, and recursive `Mu` types
- native borrow/reference terms (`borrow_shared`, `borrow_mut`, `deref`, `assign`, `move`)
- trait dictionaries and constraint-driven resolution
- import/rename machinery for composing module contexts

The project is intentionally small in surface area but heavy on correctness. It has hundreds of tests and explicit whitebox coverage for both core typing behavior and borrow-specific error paths.

If you are building compilers, language tooling, or type-driven APIs, this is a good reference implementation for a practical, stateful algorithmic type checker.
