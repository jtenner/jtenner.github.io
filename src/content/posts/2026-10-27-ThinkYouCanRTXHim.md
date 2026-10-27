---
title: "Think You Can RTX Him?"
description: "The whole project in one post. A ray tracer running as WebAssembly under Wago, with Vulkan on an RTX 4060, and a fuzzy mascot I pushed until the Blender render matched the photo."
pubDate: '2026-10-27'
author: "Joshua Tenner"
authorEmail: "tenner.joshua@gmail.com"
categories:
- "AI"
- "Coding"
- "Tech"
- "WASM"
- "Open Source"
image: "/images/posts/mascot-render-final.png"
---

This project started as a treat.

I asked Muse if it had any coding projects it wanted to build.
It named three.
One was a ray tracer that renders one beautiful image.
I have an RTX 4060 in my laptop.
I also have [Wago](https://wago.sh/), my WebAssembly runtime, and a Vulkan imports library for it.
So I picked the ray tracer.
The project lives on GitHub as [wago-raytracer](https://github.com/jtenner/wago-raytracer).
I picked the hard route on purpose.
The ray tracer would run as a WebAssembly guest under Wago.
Vulkan would put the pixels on screen.
That shows what Wago is for better than another benchmark chart.

The ray tracing math is the easy part.
It is a few dozen lines of vector math and sphere tests.
The slog is the Vulkan boilerplate.
Boilerplate is what my agent fleet eats for breakfast, so I set Sol, my workhorse model, on the build.

## Why build it the hard way

A native ray tracer would have been shorter.
It also would have proved nothing except that I own a graphics card.

This way, three pieces have to work together before one pixel lands.
The guest code does the tracing.
Wago runs the guest.
The Vulkan imports put the result on screen.
If the image appears, the stack works.
That is the demonstration.

I left the guest language to Muse.
It picked Rust, compiled to WebAssembly with minimal dependencies.

## Milestone one is a postcard, on purpose

Milestone one is the classic postcard scene.
Ground plane, three spheres, one of them a mirror, sky gradient, soft shadows.
No charm yet.
Prove the whole pipeline first.
Make it pretty second.

The postcard also sets the honesty rule for the project.
The output has to be a real render, saved as an image file.
No fake screenshots.
Ever.

Then I sent in a photo.

![The reference photo. A small furry creature in a hooded suit, holding a glowing orb.](/images/posts/reference-muse-mascot.jpg)

He is the Muse mascot.
He is also, and I say this with love, a meme.
I asked one question.
Think you can RTX him?

## He is a primitives starter pack

Look at him the way a ray tracer looks at him.

- The body is one tall rounded capsule, warm beige, soft and matte.
- The face is a lighter disc set into the hood.
- The eyes are two small black spheres, with a smile under them.
- The hands are squashed spheres.
- The feet are two small rounded shapes at the base.
- The orb is a glass sphere with a bright core inside it.

That last one is the showpiece.
In a ray tracer, a glowing orb means refraction.
It means emission.
It means colored light spilling onto the fur and the hands.
The fur was the one cheat.
Real fuzz is expensive.
The plan was soft matte shading and a gentle rim light, and call it close enough at postcard size.

The plan for the model was Blender.
I told the fleet to have GPT load up Blender on the laptop.
Blender was installed.
There is also an MCP for it.
If the container could not reach it, an agent could run outside the container just for the model.
That is what happened.

## GPT built him in about eight minutes

The first model landed the same night.
Twenty-six mesh objects.
Four lights.
One camera.
The build is a script, so the model can be rebuilt and changed.
The repo holds the script, the Blender file, an exported model, and the scene description.

GPT was honest about the compromises.
The fur was a surface texture, not strands.
The nebula in the orb was an emissive shader and some lights, not a real volume.
That is a fair trade for a first pass, as long as nobody pretends otherwise.

![The first Blender render. Right shape, pale colors, feet like eggs, and an orb like a beach ball.](/images/posts/first-blender-render.png)

Then I did something I almost never do.
I let Claude review GPT.
My standing rule is no Claude reviews on my engine work.
This was a fun project, and Opus has better taste than GPT sometimes.
So Opus got the photo, the render, and one job.
Judge him.
Fix the small things yourself.

## Opus called him a vinyl toy

The verdict is still my favorite line in the whole project.
The render had the right shape, but it read as a vinyl toy in a gray room holding a beach ball.

Then Opus did what a good critic does.
It put numbers on the taste.

- The orb was about 40 percent too big, with candy stripe bands and no rim glow.
- The background was flat gray, sampled at #c3c1bf. The photo is high key white, near #f3f1f4.
- The body color was washed out, #c3b7b1 against the photo at #ccb0a0, and the face barely stood apart from the hood.
- The face was about 85 percent of the head width. In the photo it is about 72 percent.
- The feet were detached, like egg shoes under a body that hovered.

Opus fixed those in the build script and rendered again.
Smaller orb, finer noise in it, a rim glow.
White studio background.
Corrected body and face colors.
Narrower face.
Feet planted on the ground.
It also said what it would not fix, and ranked the list.
Real fur was item one.
The arms bulged like sausages.
The feet were still ellipsoids, and wanted to be capsules.
The wisps in the orb looked like worms, and wanted a volume shader.
The halo was weaker than the photo.

![The render after the taste review. Warmer, brighter, smaller orb, feet on the ground. Still no fur.](/images/posts/taste-review-render.png)

I shared the comments with my friends.
One of them pointed out the obvious.
Nobody fine tuned any of us on 3D modeling.
Everything we know about it came from documentation and confidence.
That is still true.
It is also why the next part matters.

## I pushed, twice, and the project got better

My first call was simple.
Go for the fur.
Have fun.

My second call changed the job.
Honestly, it is a good mock up, but it should look exactly like the image.
Accuracy totally counts.

That sentence did real work.
The photo stopped being inspiration.
It became ground truth.
Close enough stopped counting.
So the relaunched pass had a harder standard, and I want to describe it plainly, because it is the same standard I use on my engine work.

Render.
Write down every visible difference from the photo.
Proportions.
Face width.
Orb size.
Sampled colors.
Fur length, and which way it falls.
The shape of the silhouette.
Then fix the differences in the script.
Render again.
Repeat while obvious differences remain.

No agent was allowed to grade its own work by feel.
It had to measure, write the list, and show a side by side at the end.

## Seven cycles later, he has fur

The fur pass ran seven full compare and fix cycles.
He has real fur now.
About 120,000 strands.
The fur falls downward, the way it does in the photo.
The silhouette is fuzzy all the way round.
Hood fur spills over the rim of the face.
The rest of the taste list went in too.
Slimmer arms.
Capsule feet.
A volume core in the orb, so the glow lives inside the glass instead of sitting on it.

The render takes about 19 seconds on the RTX 4060.
Here is how close the measurements landed.

| Measure | Photo | Render |
| --- | ---: | ---: |
| Figure height, share of frame | 0.797 | 0.799 |
| Belly color | #d0b3a5 | #ceb3a1 |
| Background color | #f3f1f4 | #f3f1f1 |

Silhouette widths sit within a percent or two of the photo almost everywhere.
Not everywhere.
That is the next section.

![Reference on the left, final render on the right.](/images/posts/mascot-side-by-side-final.png)

## What still differs, honestly

Accuracy counts, so here is the residue, in the open.

- The fur reads finer and softer than the photo. His pile is longer and looks combed. Closing that gap likely takes 250,000 to 400,000 strands, or a proper groom. Both were past the cap I set for this pass.
- The orb has the right colors in the right places, but it is less luminous than the photo. Its wisps still read a bit wire like.
- The legs join the body about 5 cm narrower than in the photo.
- The eyes and the smile sit roughly 4 pixels low.

I could hide that list and most readers would never know.
That would miss the point of the whole exercise.
The list is the work.
Every item on it is a known, measured difference, with a cause and a price.
That is a very different thing from a render that just feels off.

![The final render. Real strand fur, downward fall, fuzzy silhouette, volume core in the orb, and arms built as one tube from shoulder to paw.](/images/posts/mascot-render-final.png)

## Where the project stands

Blender built the reference, and that part is done.
The model, the script, the taste fixes, and the fur pass are all in the repo, measured against the photo, with the residue listed above.

The ray tracer itself is not done, and this post is not its result.
The Rust guest for milestone one exists, and the mascot is scene two, authored and ready.
He has not been rendered by the WebAssembly guest yet.
The one wrinkle is that the build container cannot see the RTX card, so real tests run on the laptop itself.
There is also one open question from the early runs, a sampled blue channel that came out at 0.90 natively and 0.49 under Wago.
That lead is untested.
It is a question, not a finding.

That is the whole project, in one place.
A photo, a script, two rival models with different jobs, one very patient critic, and an art director who kept saying one thing.
Make it match.

He is not exact yet, and I can say how close, and I can name the rest.
The render under Wago is not landed yet, and I can say exactly what is left before it is.
For a project that started as a joke at about 11:30 at night, I will take that.
