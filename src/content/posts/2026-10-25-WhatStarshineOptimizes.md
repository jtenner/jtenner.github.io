---

title: "What Starshine Optimizes: A Tour of the Pass Families"
description: "Starshine, my WebAssembly optimizer written in MoonBit, currently implements 69 distinct optimization passes. Here is what each family of passes does, with a small example of each."
pubDate: '2026-10-25'
author: "Joshua Tenner"
authorEmail: "tenner.joshua@gmail.com"
categories:

- "WASM"
- "Coding"
- "Tech"
- "Open Source"
image: ""

---

Starshine is my WebAssembly optimizer, written in [MoonBit](https://www.moonbitlang.com). It reads a Wasm module, runs optimization passes over it, and writes a smaller or faster module back out. Most compilers for other languages have had decades to accumulate their bag of tricks. Wasm is young enough that you can still hold the whole bag in your head, so I thought I would lay it out.

Starshine currently implements 69 distinct passes, 74 names if you count a few aliases. They group into nine families by what they do.

When you use the `--optimize` flag, it runs a short, safe queue. At higher levels, like `-O4z`, it brings in the full pipeline and any pass can be requested by name. A tour of what exists is not a promise that every module gets every trick, and you can combine them for real gains in size and speed, depending on the module.

The examples below are small [WAT](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Understanding_the_text_format) modules I wrote to show the shape of each change. They are illustrations, not snapshots of the printer, and they keep the readable names that a real run might strip.

## Dead code and unused elements

Every program accumulates cruft: instructions after a return that can never run, functions that aren't called, module elements that aren't referenced or used.

This family of transforms removes them. Dead code elimination cuts instructions that are unreachable. A vacuum run sweeps up unused values too. Remove-unused-module-elements works at module scale and asks what is actually reachable from the exports and start function.

This is the least glamorous family and the one everything else depends on. Almost every other pass leaves a little debris behind, and this family is the broom. It also shrinks the file directly, which matters for Wasm more than for most formats, because Wasm modules are so often shipped over a network.

```wat
;; before
(module
  (func (export "run") (result i32)
    i32.const 7
    return
    i32.const 99
    drop))

;; after
(module
  (func (export "run") (result i32)
    i32.const 7
    return))
```

## Local cleanup and coalescing

Compilers generate locals the way I generate browser tabs: freely, and with no plan to close them. A value gets copied from local to local to local, each hop pointless.

Simplify-locals follows those copy chains and removes the hops. Coalesce-locals goes further and lets two locals share one slot when their live ranges never overlap, the same trick a register allocator plays. Reorder-locals tidies the declarations that remain, and redundant-set-elimination deletes writes that overwrite a value nobody read.

Fewer locals means fewer instructions, a smaller encoding, and less traffic for the engine that runs the module. The variants with names like `notee` and `nostructure` are the same pass with some rewrites fenced off, for callers who need the shape of their code preserved.

```wat
;; before
(module
  (func (export "copy") (param $x i32) (result i32)
    (local $a i32) (local $b i32)
    local.get $x
    local.set $a
    local.get $a
    local.set $b
    local.get $b))

;; after
(module
  (func (export "copy") (param $x i32) (result i32)
    local.get $x))
```

## Control flow cleanup

Blocks inside blocks, branches to the very next instruction, the same code copied at the end of both arms of an if are all examples of things that can be cleaned up. Merge-blocks flattens wrappers that no branch targets; why have a branch in a block when the block could just be inlined? Remove-unused-brs deletes branches that go nowhere interesting. Code-pushing moves a computation into the one branch arm that uses it, so the other path never pays for it. Code-folding shares equal code at branch ends instead of keeping two copies.

Simpler control flow makes later analysis easier. A pass that can reason about a neat graph makes fewer mistakes than a messy one.

```wat
;; before
(module
  (global $g (mut i32) (i32.const 0))
  (func (export "set") (param $x i32)
    (block
      (block
        (global.set $g (local.get $x))))))

;; after
(module
  (global $g (mut i32) (i32.const 0))
  (func (export "set") (param $x i32)
    (global.set $g (local.get $x))))
```

## Constant folding, propagation, and expression reuse

If an expression is built entirely from constants, the cheapest time to run it is before the program ships. Precompute does exactly that, and precompute-propagate carries known values to the places that use them, including across function bodies. Optimize-instructions is the big bag of small rewrites: strength reductions, algebraic identities, comparisons turned inside out when that is cheaper. Constraint-analysis proves facts about values, such as ranges, and local-cse spots a repeated expression and computes it once into a temporary.

The discipline in this family is restraint. A fold that changes trap behavior or floating point results is not an optimization, it is a bug with good PR. Every rewrite has to preserve effects and numeric behavior exactly. A very common example of this is division which can trap when the divisor is 0.

```wat
;; before
(module
  (func (export "answer") (result i32)
    i32.const 7
    i32.const 35
    i32.add))

;; after
(module
  (func (export "answer") (result i32)
    i32.const 42))
```

## Inlining and call cleanup

A call is not free. The engine has to set up the frame, move the arguments, and come back. For a tiny function called in a hot loop, that overhead can cost more than the work. Inlining replaces a small call with the body of the function, which also exposes the joined code to every other pass. Directize turns an indirect call into a direct one when the target is provably known, which is both faster and easier to analyze. Once-reduction is a favorite of mine: some functions are built to run once, guarded by a flag, and this pass removes repeat calls that the guard makes meaningless.

The tradeoff is size. Inlining a function into ten call sites makes ten copies, so the pass family carries its own governors, including the `no-inline` controls for callers who need their function boundaries left alone.

```wat
;; before
(module
  (func $seven (result i32)
    i32.const 7)
  (func (export "run") (result i32)
    call $seven))

;; after
(module
  (func (export "run") (result i32)
    i32.const 7))
```

The reason why size matters is because shipping a binary over the internet might affect load times negatively in the browser. On the server side, this problem isn't a big deal.

## Memory and heap optimizations

Loads and stores are where a Wasm program touches memory, so this family is extremely careful. Pick-load-signs chooses the signed or unsigned load variant that matches how the value is actually used, which can remove a separate extension instruction. Avoid-reinterprets is a neat one: loading four bytes as a float and then reinterpreting them as an integer is two operations where a single integer load is one. Heap-store-optimization folds stores into a GC object as it is being constructed, instead of building the object and then poking each field. Heap2local is the boldest: when a GC object provably never escapes its function, it can be replaced by plain scalar locals, and the allocation disappears entirely and pulls all the fields of a struct onto the stack from the heap.

Memory-packing works on the data segments themselves, repacking them tighter. Every rewrite here has to preserve bounds checks, traps, and the order of visible effects, because memory is the one place where reordering mistakes are observable.

```wat
;; before
(module
  (memory 1)
  (func (export "bits") (param $p i32) (result i32)
    local.get $p
    f32.load
    i32.reinterpret_f32))

;; after
(module
  (memory 1)
  (func (export "bits") (param $p i32) (result i32)
    local.get $p
    i32.load))
```

## Type and signature refinement

Wasm GC gives modules a real type system, and code written against a general type often provably uses a narrower one. Global-refining looks at every write to a private global and narrows its declared type to what is actually stored. Global-struct-inference does the same style of reasoning for struct fields. Optimize-casts removes casts that the refined types prove redundant. Stronger types are not just hygiene: each fact a pass proves becomes a fact the next pass can spend.

In plain terms: when one pass proves something about the code, the passes after it can trust that proof instead of checking again. If a global is proven to only ever hold the narrower type, the cast at each use can go away. The proofs pile up, and each one makes the next pass a little braver.

This family is also home to dead argument elimination, DAE. If a parameter is never used, or a result is never read, DAE removes it from the signature and from every call site, and dae2 runs it again after other passes have exposed more dead arguments. Smaller signatures mean less work at every call.

```wat
;; before: the global is declared as the base type
(global $g (mut (ref null $base)) (ref.null $child))

;; after: every write stores the child type, so the global narrows
(global $g (mut (ref null $child)) (ref.null $child))
```

## Code size, sharing, and metadata

Two functions with identical bodies are stored twice... so why have them?

![Gee Bill! How come your mom lets you define two identical functions?](/images/posts/two-identical-functions.png)

Duplicate-function-elimination finds them and keeps one, with care around function identity, because host code can sometimes tell two functions apart. Merge-similar-functions is bolder and rewrites near-duplicates into one parameterized function. String-gathering shares repeated string constants, reorder-globals puts frequently used globals at low indices that encode in fewer bytes, and strip-debug removes the name section when names are no longer needed.

For a format that travels over the wire, these unglamorous passes are often the whole ballgame. A module that is 15 percent smaller downloads faster, parses faster, and starts sooner.

```wat
;; before
(module
  (func $a (result i32) i32.const 7)
  (func $b (result i32) i32.const 7)
  (func (export "sum") (result i32)
    call $a
    call $b
    i32.add))

;; after
(module
  (func $a (result i32) i32.const 7)
  (func (export "sum") (result i32)
    call $a
    call $a
    i32.add))
```

## Lowering and optimization preparation

The last family is the stage crew. These passes rewrite code into a shape that other passes, or other tools, can work with, and they do not always make anything smaller or faster on their own. Flatten turns nested expressions into a flat instruction stream. The SSA passes rebuild values into single-assignment form, which makes data flow questions easy to answer, at the cost of extra locals that later cleanup removes. Untee expands a combined set-and-use into its two plain halves. Dealign relaxes alignment hints, and the lowering passes rewrite newer or wider operations, such as 64-bit saturating float conversions, into forms an older target accepts.

I include this family because it is most of what an optimizer actually is: not a bag of independent tricks, but a pipeline where each stage sets up the next. The flashy passes get the examples. The preparation passes make them possible.

```wat
;; before
(module
  (func (export "save") (param $x i32) (result i32)
    (local $saved i32)
    local.get $x
    local.tee $saved))

;; after
(module
  (func (export "save") (param $x i32) (result i32)
    (local $saved i32)
    local.get $x
    local.set $saved
    local.get $saved))
```

## The full list

For the completionists, here are the families and their passes. I've only described about 50 here; the rest are on my [GitHub](https://github.com/jtenner/starshine-mb). Most are automatic in the full pipeline; the ones marked explicit run only when named.

- **Dead code and unused elements (5):** dead-code-elimination, vacuum, remove-unused-module-elements, remove-unused-nonfunction-module-elements (explicit), remove-empty-function-exports (explicit)
- **Local cleanup and coalescing (14):** simplify-locals and its notee, nonesting, and nostructure variants, merge-locals, coalesce-locals, coalesce-locals-cfg, reorder-locals, redundant-set-elimination, tuple-optimization
- **Control flow cleanup (5):** remove-unused-names, remove-unused-brs, merge-blocks, code-pushing, code-folding
- **Constant folding, propagation, and expression reuse (7):** optimize-instructions, precompute, precompute-propagate, constraint-analysis, local-cse, simplify-globals-optimizing, propagate-globals-globally (explicit)
- **Inlining and call cleanup (12):** inlining, inlining-optimizing, directize, once-reduction, duplicate-import-elimination, inline-main (explicit), tail-call (explicit)
- **Memory and heap optimizations (5):** heap-store-optimization, heap2local, memory-packing, pick-load-signs, avoid-reinterprets (explicit)
- **Type and signature refinement (12):** optimize-casts, global-refining, global-struct-inference, local-subtyping, dae, dae2, and their optimizing variants
- **Code size, sharing, and metadata (5):** duplicate-function-elimination, merge-similar-functions, string-gathering, reorder-globals, strip-debug
- **Lowering and optimization preparation (9):** flatten, ssa, ssa-nomerge, untee (explicit), make-shared-objects (explicit), intrinsic-lowering (explicit), i64-trunc-sat-float-lowering (explicit), dealign (explicit), apply-compiler-facts (explicit)

These passes were all derived from [Binaryen's](https://github.com/WebAssembly/binaryen) passes, which helped inspire this project. I have credited them under a separate license for the work I built on, and I have added my own fixes and performance gains on top of their algorithms. Please show them some love too.

If you want to try any of this, Starshine is on [GitHub](https://github.com/jtenner/starshine-mb) and the release that collects this weekend's work is in preparation now. Suggestions for a tenth family are welcome.