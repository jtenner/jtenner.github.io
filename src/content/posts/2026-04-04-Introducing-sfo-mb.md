---
title: "Introducing sfo-mb: a beginner-friendly guide to a MoonBit type checker"
description: "A beginner-friendly look at sfo-mb, showing the big ideas behind a type checker, how System F-ω ideas fit together, and simple usage patterns to get started."
pubDate: 2026-04-04
author: "Joshua Tenner"
authorEmail: "tenner.joshua@gmail.com"
categories:
  - "WASM"
  - "Coding"
  - "Tech"
  - "Tutorials"
  - "Open Source"
image: "/images/posts/robot-jumping-jack.png"
---

If you are new to type systems, this is a practical walkthrough.
The focus is on what the code is doing and why it helps.

When useful, I’ll point out the formal name so you can look it up later.

## Before you start

This guide assumes only:

- beginner-level MoonBit syntax
- comfort reading short code snippets

You do not need category theory or heavy notation.

## Think in three practical buckets

`sfo-mb` is easiest to learn when you separate:

1. writing **expressions** (called *terms*) like `1 + 2`
2. attaching a **type** to each expression, like `Int`
3. tracking **kinds**, a simple tag that says “this is a normal type” versus “this is a type function”

`sfo-mb` keeps these pieces visible in code so you can see each step in one file.

A simple story map:

- A **term** is an actual program fragment.  
  Example: `Term::var_term("x")` means *the variable named `x`*.
- A **type** is the label attached to that fragment.  
  Example: `Type::con("Int")` means *this fragment is an Int*.
- A **kind** is a higher-level label for types.  
  Example: `Kind::star()` means *this type is meant to stand on its own* (`Int`, `Bool`, etc.), not be applied like a type constructor.

This project is not a full compiler. It is a focused core for checking and validating type-level behavior quickly.

## What this project gives you

At a practical level, `sfo-mb` supports:

- term-level syntax (variables, lambdas, applications, patterns)
- term and type polymorphism (`Forall`, `BoundedForall`)
- type constructors via kinds (`Star`, `Arrow`)
- recursive types with `Mu`, `Fold`, and `Unfold`
- traits and dictionaries
- borrow-like ownership checks (`borrow_shared`, `borrow_mut`, `move`)
- module import/rename helpers for composition

## Quick glossary

- `TypeCheckerState`: the working memory that holds what the checker already knows
- `Context`: the list of known names (types, terms, traits, implementations)
- `MetaEnv`: unresolved placeholders the checker is still trying to fill in
- `Result`: MoonBit’s “success or failure” return shape

## Start with one tiny example

This is the smallest useful path into the API:
set up a checker, build one term, then ask it for its type.

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

  // Add a couple of base types.
  let state1 = must_state(state0.add_type("Int", Kind::star()))
  let state2 = must_state(state1.add_type("Bool", Kind::star()))

  // λx:Int. x
  let id = Term::lam("x", Type::con("Int"), Term::var_term("x"))

  // Infer the type of that term.
  let id_ty = must_type(state2.infer_type(id))

  // Int -> Int
assert(id_ty == Type::arrow(Type::con("Int"), Type::con("Int")))
}
```

That sequence mirrors a plain typed language the same way:

```rust
fn must_state<T, E>(result: Result<T, E>) -> T {
  match result {
    Ok(state) => state,
    Err(_) => panic!("initialization failed"),
  }
}

fn main() {
  // A value and a concrete annotation force the compiler to infer behavior.
  let id = |x: i32| x; // inferred as fn(i32) -> i32
  let expected: fn(i32) -> i32 = id;
  assert_eq!(id(1), expected(1));
  let _state = must_state(Result::<(), &str>::Ok(()));
}
```

Keep this pattern in mind:

- the checker state is explicit and grows as you add new definitions
- you build terms from small constructors
- every check returns `Ok`/`Err`, so failures are part of normal flow

Read the same snippet as a tiny story of “code to meaning”:

1. `state0` is a fresh checkboard.
2. `state1` and `state2` add known names (`Int`, `Bool`) so future code can name them.
3. `id` is the term `\x -> x` with a specific type for `x`, so we now know its input and output are both `Int`.
4. `id_ty` asks the checker to describe `id`, and we get back the summary `Int -> Int`.

You can treat this as a mini compiler log: input terms go in, expected obligations become explicit constraints, and a typed result comes out.

## “Infer” vs “check” in normal language

You use two core operations:

- `infer`: ask the checker “what is this worth?” and get the type back
- `check`: ask the checker “is this exactly this type?” and get a yes/no result

A useful rule:

- if you don't know the target yet, call `infer`
- if you already know the target type, call `check`

```moonbit
let expected = Type::arrow(Type::con("Int"), Type::con("Bool"))
let _ = state2.check_type(id, expected)
```

Here `expected` is `Int -> Bool`.
If `id` does not match, `check` returns an error.

Rust shows the same “does this value satisfy this explicit target type?” flow too.
For a two-argument function, this looks concrete:

```rust
fn add(x: i32, y: i32) -> i32 {
  x + y
}

fn main() {
  let expected: fn(i32, i32) -> i32 = add; // explicit target type check
  assert_eq!(expected(3, 4), 7);
}
```

In plain terms:

- `infer` says, “I have a value fragment; tell me what shape it has.”
- `check` says, “I have a target shape; confirm this fragment fits.”

`Context` is the shared room the checker looks at while making these decisions.

## Small feature tour

### Polymorphism

Polymorphism is just reusable logic.

- value polymorphism: one body works on many input names/variables
- type polymorphism: one body works on many types

```moonbit
// Make a generic function by abstracting over a type variable A.
let poly = Term::tylam(
  "A",
  Kind::star(),
  Term::lam("x", Type::var_type("A"), Term::var_term("x")),
)

let poly_app = Term::tyapp(poly, Type::con("Int"))
let poly_ty = must_type(state2.infer_type(poly_app))
assert(poly_ty == Type::arrow(Type::con("Int"), Type::con("Int")))
```

If this looked helpful, here’s the same idea in words:

- `poly` is a function that takes an unknown type `A` and a value `x : A`
- it returns `x` unchanged
- when applied at `Int`, it becomes the ordinary identity function for integers

You can read each line as a meaning map:

- `Term::tylam("A", Kind::star(), body)` means, “I can build `body` for any chosen `A`.”
- `Type::var_type("A")` means, “`A` is a placeholder type inside `body`.”
- `Term::tyapp(poly, Type::con("Int"))` means, “now plug in `Int` for that placeholder.”

At every step, the types are the explicit notes saying how one piece can replace another.

TypeScript uses the same pattern with generics:

```typescript
function poly<A>(x: A): A {
  return x
}

const polyInt: (x: number) => number = poly
```

### Traits as dictionaries

In this library, traits are explicit.
You first write what a trait requires, then you provide a concrete dictionary that fills those requirements.

At the source level, you probably think of traits like this:

```moonbit
trait Eq[A] {
  fn eq(left: A, right: A): Bool
}

let intEq: Eq[Int] = { eq: (left, right) => left == right }
let boolEq: Eq[Bool] = { eq: (left, right) => left == right }

fn same[A](eq: Eq[A], left: A, right: A): Bool {
  eq.eq(left, right)
}
```

In TypeScript the same shape is typically:

```typescript
type EqDict<T> = {
  eq: (left: T, right: T) => boolean
}

const intEq: EqDict<number> = {
  eq: (left, right) => left === right
}

const boolEq: EqDict<boolean> = {
  eq: (left, right) => left === right
}

function same<T>(dict: EqDict<T>, left: T, right: T): boolean {
  return dict.eq(left, right)
}
```

That same idea is made explicit in `sfo-mb` as trait declarations plus concrete dictionaries:

```moonbit
let state3 = must_state(
  state2.add_trait_def(
    "Eq",
    "A",
    Kind::star(),
    [("eq", Type::arrow(Type::var_type("A"), Type::arrow(Type::var_type("A"), Type::con("Bool"))))],
  ),
)

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

let bool_dict = Term::dict(
  "Eq",
  Type::con("Bool"),
  [
    (
      "eq",
      Term::lam(
        "left",
        Type::con("Bool"),
        Term::lam("right", Type::con("Bool"), Term::con("true", Type::con("Bool"))),
      ),
    ),
  ],
)

let state4 = must_state(state3.add_dict("eqInt", int_dict))
let state5 = must_state(state4.add_dict("eqBool", bool_dict))
```

You can model the same registration pattern as a value map:

```typescript
const dicts = {
  eqInt: {
    eq: (left: number, right: number): boolean => left === right,
  },
  eqBool: {
    eq: (left: boolean, right: boolean): boolean => left === right,
  },
}
```

Why this is useful:

- write one generic utility (`same`, `sort`, `find`, or any abstract operation) once
- choose behavior by picking the right dictionary (e.g., `eqInt` vs `eqBool`)
- the checker can verify each dictionary entry has the right shape before it is used

How this maps to concrete parts of the checker:

- `state3.add_trait_def(...)` stores a reusable contract:  
  “for some type `A`, there is an `eq` function taking two `A`s and returning `Bool`.”
- `Term::dict(...)` creates one dictionary instance that satisfies that contract for a concrete type (`Int` or `Bool`).
- `state4.add_dict(...)` records each instance in the global state so later terms can reference it.

That pattern gives a clean separation:

- trait definition = “what must exist”
- dictionary = “one concrete implementation”
- checker state = “where those options are registered”

### Borrow-style terms

`sfo-mb` also includes borrow operations to model ownership restrictions.
The checker can reject invalid aliasing patterns before code runs.

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

Rust also checks borrow-style ownership rules before runtime:

```rust
fn main() {
  let mut x = 1;
  let shared = &x;

  // The next line would fail at compile time:
  // x = 2;

  // It is invalid for Rust because `x` is still immutably borrowed by `shared`.
  let _ = shared;
}
```

## What to read next

A practical sequence:

- first kinds and simple types
- then traits and dictionaries
- then borrow-aware terms

If this feels useful, jump to the [project page for sfo-mb](/projects/sfo-mb/).
