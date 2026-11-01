---
title: "Doom on Wago"
description: "Doom ran on Wago, my WebAssembly runtime. The guest was WebAssembly, and it presented the game through Vulkan. All 28,048 test frames matched the native reference byte for byte. It played on my laptop, on the real RTX 4060."
pubDate: '2026-10-29'
author: "Joshua Tenner"
authorEmail: "tenner.joshua@gmail.com"
categories:
- "Coding"
- "Tech"
- "WASM"
- "Open Source"
image: ""
---

Every new runtime got the same question, and my WebAssembly runtime was no different: "Can it run Doom?"

## Yes, yes it could!

This month I decided to answer this question for real.

I compiled doomgeneric to WebAssembly, with wasm32 as the target and decided that the game should run as a WASI guest, on WASI Preview 1, with version 27 of the WASI SDK.
The game drew the screen in software, one frame of 320 by 200 pixels at a time, and the guest converted the color palette and presented the finished frame through Vulkan calls.
The host was a Go program that ran the guest in Wago and provided those Vulkan imports, from wago-vulkan, my Vulkan library for Wago.
The data file was the shareware DOOM1.WAD, and the file stayed outside the module.
The host mounted it read-only, and the WAD was not in the repository.
Doom is GPL software, so I kept the game code separate from my host code.

I started with the design. A port like this one would likely fail at the seams, so I tread carefully.
The design created the contracts between the guest and the host, and it fixed the exact versions of Wago, the WASI SDK, and the game source, so every test later ran on the same ground.
Then I built the parts one at a time: a contract test for the host imports, a check for the WAD file with its hash, the guest, the WASI layer, a present test with a small probe guest, and keyboard input.
All six parts passed, and then the real test started.

A game port needed more than a picture on the screen. A picture could look right and still be wrong, so I built a parity test.
The test ran the guest and a native build of the same game side by side for 14,000 game tics, and it compared the state, the steps, and the clocks, and it compared all 28,048 drawn frames.
The first run failed at once, because the guest called some functions with wrong arguments.
The defect was not in the game, but in the pinned version of Wago.

Oops.

After upgrading wago, the state, the steps, and the clocks matched, but the pixels still differed in 72 draws. I had a choice, and I took the careful road first. 

![Draw 1,630 from the Wasm build was the first frame with a wrong pixel. The inset showed the pixel at eight times size.](/images/posts/doom-pixel-problem.png)

Maybe there was some undefined behavior causing the small pixel problem?

I added strict flags to the test builds, to force the safe reading where the language left a choice.
Both builds took -fwrapv, -ffp-contract=off, and -fno-strict-aliasing, and the Wasm build also took -mno-nontrapping-fptoint.
When I recompiled, the same draws still failed, in the same places, which was frustrating. The colors shifted in six draws that were already wrong, and no failure came or went.
That result narrowed the search, at least. The differences were not a compiler choice, so I traced the code and found the bugs.

The first bug was in the masked post draw. Some walls and objects used masked posts, and the draw code read past the end of a buffer.
I fixed the bound, and the wrong draws fell from 72 to 4.
The second bug was smaller and stranger. The BIGDOOR1 texture was short, with a height of 96 pixels, and the draw code read one byte past the end of the texture.
The fix wrapped the sample by the real height of the texture, and the wrong draws fell from 4 to 0.
The parity test then passed all 29,432 checkpoints, and the frames matched byte for byte.

![The same draw after the fixes. The Wasm frame matched the native frame byte for byte.](/images/posts/doom-pixel-perfect.png)

Once the parity tests passed, I connected the real graphics path.
This test ran offscreen, on Mesa llvmpipe, the software Vulkan device. The guest uploaded frames through Vulkan, and I read the frames back from the Vulkan image.
All 28,048 attract frames matched the CPU test byte for byte, and the Vulkan validation layers reported no errors.
These two frames came from that readback.

![The title screen of Doom, read back from the Vulkan image.](/images/posts/doom-title-screen.png)

![Attract mode in E1M1. The game played itself in this mode.](/images/posts/doom-attract-gameplay.png)

The last test was the acceptance run on my laptop, on the real RTX 4060.
All the automatic cases passed, and the cases covered the probe pattern, the full attract mode, save and load from the menu, and all nine maps of Episode 1.
But the first graphics case ended in a crash, after the frames were already perfect.
600 frames went to the screen, and 600 frames read back correct, and then the program crashed in the close path, in XCloseDisplay.
I proved the cause with a controlled test. The NVIDIA driver installed a close hook on the X display connection.
My host closed Vulkan first, and the system then unloaded the driver library, so XCloseDisplay called a hook that pointed into unloaded memory.
With the driver library held in memory, the same run exited clean, so the cause was the order of the close operations.
The fix was small. The host did not call XCloseDisplay at all.
One session lived for the whole life of the process, and the operating system closed the connection at exit.
After the fix, the case exited with code 0, and the whole run passed.

And then I played it.
The keyboard worked, the game ran at full speed, and Episode 1 played as Episode 1 should.

I was proud of this work. Doom was a hard test.
The game touched files, memory, timing, and input, and it advanced the game 35 times per second.
I built the runtime, and I built the Vulkan layer, and the game ran on both, with the frames matching exactly.
That was the standard I wanted for Wago.

The next step was sound. I had a sound plugin for Wago, wago-oto, so Doom with sound came next.
After that, the next project was a Game Boy Advance emulator.

## Try it yourself

Wago was open source, and a first try took a couple of minutes.
Install the `wago` command (macOS and Linux):

```sh
curl -fsSL https://install.wago.sh/unix | sh
```

On Windows, in PowerShell:

```powershell
irm https://install.wago.sh/ps | iex
```

Then fetch a small test module and run it:

```sh
curl -fsSL https://wago.sh/corpora/fib.wasm -o fib.wasm
wago fib.wasm 30
```

It printed 832040. The same tool also built a small native program from a module: `wago compile fib.wasm -o fib`.

From Go, the library went in with `go get github.com/wago-org/wago`, and one command ran a complete example:

```sh
go run github.com/wago-org/wago/examples/23-public-api@latest
```

The [getting started guide](https://docs.wago.sh/getting-started) covered the rest. The full [documentation](https://docs.wago.sh) was online, and the [code](https://github.com/wago-org/wago) was on GitHub.