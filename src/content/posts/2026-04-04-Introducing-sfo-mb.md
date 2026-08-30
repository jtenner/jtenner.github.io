---
title: "Introducing sfo-mb: a beginner-friendly guide to a MoonBit type checker"
description: "A simple introduction to sfo-mb, with practical examples of terms, types, kinds, traits, and borrow checks."
pubDate: 2026-04-04
author: "Joshua Tenner"
authorEmail: "tenner.joshua@gmail.com"
categories:
  - "WASM"
  - "Coding"
  - "Tech"
  - "Tutorials"
  - "Open Source"
image: ""
---

> **Project status — August 2026:** `sfo-mb` is still at version 0.1.1. The core ideas in this guide still match the project. See the [project page](/projects/sfo-mb/) for the current summary.

If you are new to type systems, this guide starts with the practical parts.

You only need basic MoonBit syntax and comfort with short code examples.

You do not need category theory or heavy mathematical notation.

## Start with three ideas

`sfo-mb` is easier to understand when you separate three concepts:

1. A **term** is a program expression.
2. A **type** describes the value that a term can produce.
3. A **kind** describes how a type can be used.

For example:

- `Term::var_term("x")` means the variable named `x`.
- `Type::con("Int")` means the type named `Int`.
- `Kind::star()` means a normal value type, such as `Int` or `Bool`.

A type constructor can have a different kind. For example, a generic container type can take one type and produce another type.

This is one of the ideas modeled by System F-ω. System F-ω is a typed lambda calculus with polymorphism and type-level functions.

`sfo-mb` is not a complete compiler. It is a focused library for type-system work.

## What the project includes

At a practical level, `sfo-mb` supports:

- variables, functions, applications, and patterns;
- `Forall` and `BoundedForall` polymorphism;
- higher-kinded types;
- recursive types with `Mu`, `Fold`, and `Unfold`;
- traits and explicit trait dictionaries;
- shared and mutable borrows;
- moves, dereference, and assignment;
- region and lifetime checks;
- module import and rename helpers.

## A small glossary

- `TypeCheckerState`: the current state of the type checker.
- `Context`: the known names, types, terms, traits, and implementations.
- `MetaEnv`: temporary unknown types that the checker is trying to solve.
- `Result`: MoonBit’s success-or-error return type.
- **Inference**: finding a type from a term.
- **Checking**: confirming that a term matches a known type.

## Start with one small example

The basic flow is:

1. Create a type-checker state.
2. Add known types.
3. Build a term.
4. Ask the checker for the term’s type.

```moonbit
import "jtenner/sfo"

fn must_state(r : Result[TypeCheckerState, TypingError]) -> TypeCheckerState {
  match r {
    Ok(state) => state
    Err(_) => panic("initialization failed")
  }
}

fn must_type(r : Result[Type, TypingError]) -> Type {
  match r {
    Ok(ty) => ty
    Err(_) => panic("type check failed")
  }
}

fn main() {
  // Start with an empty state.
  let state0 = TypeCheckerState::fresh()

  // Add two base types.
  let state1 = must_state(state0.add_type("Int", Kind::star()))
  let state2 = must_state(state1.add_type("Bool", Kind::star()))

  // This is the function: x -> x, where x is Int.
  let id = Term::lam("x", Type::con("Int"), Term::var_term("x"))

  // Ask the checker for the function type.
  let id_ty = must_type(state2.infer_type(id))

  assert(id_ty == Type::arrow(Type::con("Int"), Type::con("Int")))
}
```

The result is `Int -> Int`.

The state is explicit. Each call returns a new state with more known information.

Each type operation also returns `Ok` or `Err`. Type errors are normal results, not hidden exceptions.

## Infer a type or check a type

The two most important operations are `infer_type` and `check_type`.

Use `infer_type` when you do not know the type yet.

Use `check_type` when you already know the required type.

```moonbit
let expected = Type::arrow(Type::con("Int"), Type::con("Bool"))
let result = state2.check_type(id, expected)
```

The `id` function has type `Int -> Int`. The expected type is `Int -> Bool`.

The check therefore returns an error.

This is similar to assigning a function to an explicit function type in another statically typed language.

```rust
fn add(x: i32, y: i32) -> i32 {
  x + y
}

fn main() {
  let expected: fn(i32, i32) -> i32 = add;
  assert_eq!(expected(3, 4), 7);
}
```

## Polymorphism

Polymorphism lets one definition work with more than one type.

This example creates a generic identity function:

```moonbit
let poly = Term::tylam(
  "A",
  Kind::star(),
  Term::lam("x", Type::var_type("A"), Term::var_term("x")),
)

let poly_app = Term::tyapp(poly, Type::con("Int"))
let poly_ty = must_type(state2.infer_type(poly_app))
assert(poly_ty == Type::arrow(Type::con("Int"), Type::con("Int")))
```

Read it in three steps:

1. `A` is an unknown type.
2. The function accepts a value of type `A` and returns the same value.
3. Applying the function at `Int` produces `Int -> Int`.

TypeScript uses the same broad idea with generics:

```typescript
function poly<A>(x: A): A {
  return x
}

const polyInt: (x: number) => number = poly
```

## Traits as dictionaries

A trait describes required behavior.

A dictionary is a value that contains one concrete implementation of that behavior.

For example, an equality trait can require an `eq` function:

```moonbit
trait Eq[A] {
  fn eq(left: A, right: A): Bool
}
```

A source language can hide the dictionary. `sfo-mb` can model it explicitly.

```moonbit
let state3 = must_state(
  state2.add_trait_def(
    "Eq",
    "A",
    Kind::star(),
    [("eq", Type::arrow(Type::var_type("A"), Type::arrow(Type::var_type("A"), Type::con("Bool"))))],
  ),
)
```

A concrete dictionary then supplies the required operation for a concrete type.

```moonbit
let int_dict = Term::dict(
  "Eq",
  Type::con("Int"),
  [
    (
      "eq",
      Term::lam(
        "left",
        Type::con("Int"),
        Term::lam("right", Type::con("Int"), Term::con("true", Type::con("Bool"))),
      ),
    ),
  ],
)

let state4 = must_state(state3.add_dict("eqInt", int_dict))
```

The important separation is:

- trait definition: what must exist;
- dictionary: one implementation;
- checker state: where the implementation is registered.

This model is useful for compilers that lower traits or interfaces to explicit runtime values.

## Borrow-style operations

`sfo-mb` also models ownership-style checks.

A shared borrow can read a value. A mutable borrow can allow mutation. The checker rejects invalid combinations.

For example, this tries to assign through a shared borrow:

```moonbit
let invalid = Term::let_term(
  "x",
  Term::con("1", Type::con("Int")),
  Term::assign(
    Term::borrow_shared(Term::var_term("x")),
    Term::con("2", Type::con("Int")),
  ),
)

let borrow_result = state4.infer_type(invalid)
match borrow_result {
  Ok(_) => panic("expected borrow error")
  Err(_) => ()
}
```

The checker rejects the assignment because a shared borrow is not mutable.

Other checks cover conflicting borrows, use after move, invalid reference escape, and lifetime constraints.

## What to read next

A useful order is:

1. kinds and simple types;
2. type inference and checking;
3. polymorphism;
4. traits and dictionaries;
5. borrow-aware terms.

The [project page for sfo-mb](/projects/sfo-mb/) has the current feature summary.
