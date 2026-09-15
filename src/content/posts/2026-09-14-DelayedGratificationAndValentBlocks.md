---
title: "Delayed Gratification and Valent Blocks"
description: "How Wago uses valent blocks and delayed code generation to keep compilation small while producing better machine code."
pubDate: 2026-09-14
author: "Joshua Tenner"
authorEmail: "tenner.joshua@gmail.com"
categories:
  - "WASM"
  - "Coding"
  - "Tech"
  - "Open Source"
image: ""
---

Creating a good compiler is a two-fold juggling task. On one hand, the compiler itself should run quickly and use very little memory. On the other hand, the machine code it produces should actually be fast too. Over the last few months, I have discovered that balancing between these two values is an art form. Very rarely do we get to cheat and get both at the same time.

When it comes to my latest project Wago, my friend Jairus and I stumbled onto a paper that changed our direction completely.

This paper is called ["Valent-Blocks: Scalable High-Performance Compilation of WebAssembly Bytecode For Embedded Systems."](https://doi.org/10.1109/iCCECE49321.2020.9231154)

This technique was designed to be usable by resource-constrained systems, and naturally, it turned out to be very valuable in many other places as well. The central idea?

> The compiler does not need to emit machine code as soon as it reads an instruction. Instead, it can accumulate a small very focused representation using a stack machine and make better decisions once "side effects" actually occur or when something actually needs to become a value.

## An example

Consider a function that calculates `(a + 3) * b`.

First, let's look at an equivalent function in JavaScript.

```javascript
function example(a, b) {
  return (a + 3) * b;
}
```

Typically, I like to use the "wat" format, which stands for "WebAssembly Text Format." This syntax is similar to assembly in a lot of ways, but it's easy to follow along. Each instruction operates on a stack machine instead of on registers.

```wat
(func $example (param $a i32) (param $b i32) (result i32)
  local.get $a
  i32.const 3
  i32.add (; a + 3 ;)

  local.get $b
  i32.mul (; $val * b ;)
)
```

A direct translation of this into machine code might naively turn this into a very big un-optimized mess.

```asm
; local.get $a
mov  eax, DWORD PTR [rbp - 4]
push rax

; i32.const 3
mov  eax, 3
push rax

; i32.add
pop  rcx
pop  rax
add  eax, ecx
push rax

; local.get $b
mov  eax, DWORD PTR [rbp - 8]
push rax

; i32.mul
pop  rcx
pop  rax
imul eax, ecx
push rax

; result
pop  rax
ret
```

Each instruction immediately commits to a physical representation for its result. In doing so, the compiler throws away useful information after almost every instruction.

Additionally, the compiler threw away useful information after each and every instruction. It results in:

- 5 pushes
- 5 pops
- 2 local loads
- 1 constant materialization
- 1 add
- 1 multiply

Instead, what if we stopped mirroring the WebAssembly operand stack into actual machine-stack operations? We can keep a "symbolic" stack during compilation and delay the machine-code decisions until we have more information.

### Step 1: `local.get $a`

Our algorithm can simply push a `LocalGet($a)` to a stack.

```text
stack.push(LocalGet($a))
```

We skip the part where we emit machine instructions.

### Step 2: `i32.const 3`

```text
stack.push(I32Const(3))
```

Now we have two values on top of the stack.

```text
┌──────────────┐
│ I32Const(3)  │
├──────────────┤
│ LocalGet($a) │
└──────────────┘
```

Again, we skip the machine code. No side effects have happened yet anyway.

### Step 3: `i32.add`

Now we need to add the two items on the stack. Instead of emitting an actual add instruction, we can simply produce an `I32Add(LocalGet($a), I32Const(3))` and push it to the stack. Pop each of the items off the top of the stack one by one, and then push the result back on. Notice that the right operand is popped first because it was pushed last. We then reconstruct the operands in their original order.

```text
right = stack.pop()
left = stack.pop()
stack.push(I32Add(left, right))
```

### Step 4: The rest of the function

The last two instructions follow the same pattern:

```text
stack.push(LocalGet($b)) // local.get $b
right = stack.pop()
left = stack.pop()
stack.push(I32Mul(left, right))
```

And we are done!

...

Just kidding. We are done building the expression, but we still have not generated any machine code.

Eventually, something has to consume the value. In this case, we have reached the end of the function, and the function must return the value on top of the Wasm stack. This forces us to resolve, or condense, our deferred expression into actual machine instructions.

This is where things get a bit more complicated.

### Step 5: Resolve `a + 3`

We need to move "a" into a register and add 3 to it, leaving the resulting value inside the register.

```asm
mov eax, DWORD PTR [rbp - 4]
add eax, 3
```

We must assume that the parameter of the function exists at `[rbp - 4]`, but it only results in a single load operation. We use `eax` here to keep a running value of the item on top of the stack, as you will see.

### Step 6: Resolve the multiplication

Finally, we perform the multiplication in a single step here using a memory operand which points to `b`, and follow it up with a `ret` which signifies the end of the function. The return value is already conveniently stored exactly where it needs to be.

```asm
imul eax, DWORD PTR [rbp - 8]
ret
```

Let's put it all together now!

```asm
mov  eax, DWORD PTR [rbp - 4]
add  eax, 3
imul eax, DWORD PTR [rbp - 8]
ret
```

Wow. That's a big difference.

The important part is not only that this code is shorter. By waiting, the compiler kept useful information alive. Since 3 remained a constant, it became an immediate operand to add. Since `$b` remained a local reference, the multiplication could consume it directly from memory. The result of `a + 3` never needed a stack slot at all; it stayed in `eax` until the multiplication consumed it. In this simplified example, leaving the return value in `eax`, exactly where it needs to go, is another nice benefit.

This is the main technique used by my latest project called Wago, which is a single-forward-pass WebAssembly-to-native JIT compiler written in Go. You can check it out here:

[wago-org/wago on GitHub](https://github.com/wago-org/wago)

Wago compiles Wasm directly to machine code without using a whole-function intermediate representation, while using very little memory at compile time. You can check out some of our computed benchmark numbers and install it here at [the Wago homepage](https://wago.sh/).

As a bit of a warning, this software is currently in beta, which means that we are trying to improve stability on both amd64 and arm64 across Linux, macOS, and Windows. If you happen to need a web assembly runtime, we would appreciate it if you took the time to try it out.

Thanks for reading and happy coding.

Joshua Tenner
