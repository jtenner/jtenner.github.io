---
title: "AGENTS.md is a package.json for your agents"
description: "Management tools aren't just for agents."
pubDate: 2026-03-21
author: "Joshua Tenner"
authorEmail: "tenner.joshua@gmail.com"
categories:
  - "AI"
  - "Coding"
  - "Productivity"
image: "/images/posts/robot-todo-list.png"
---

When people think about project metadata, they usually think about files like package.json, Cargo.toml, or go.mod.

Those files tell tools how to work with your project. They define names, dependencies, scripts, versions, and entry points. They make the project legible to machines. This kind of structure is pivotal for both AI and the people who use it because it reduces the complexity of understanding your project and how to work inside it.

## AGENTS.md is a natural extension of this idea.

The point of an AGENTS.md is not to document everything. It is to preserve the few instructions whose absence reliably causes bad edits, wasted time, or repeated correction. Those instructions are load-bearing. Everything else belongs somewhere else.

Without it, an agent has to guess:

- where the source code lives
- which commands are safe to run
- how to build and test the project
- what conventions matter
- which workflows are normal
- what “done” actually means

That guesswork is where a lot of wasted time comes from, for both people and agents, at least in my own personal experience. However there's more to it than that. It's possible to overload your agents with too much information and drown them in context. It's also possible to waste context and spend more on tokens than necessary to get the job done. That's why I think the idea of "irreducible complexity" is so important.

In biology, irreducible complexity is the claim that some systems only work when all of their parts are present together, so they supposedly could not have developed through simpler intermediate stages. For an AGENTS.md, the more useful comparison is not "all parts must exist," but rather that "some instructions are load-bearing." A lean agent guide should keep only the few pieces whose removal would reliably cause failures, bad edits, or wasted cycles: the repo’s critical commands, constraints, and workflow invariants. Everything else is "fluffy context" and not irreducible complexity.

Optimizing your AGENTS.md file is not nearly as difficult as you think either, because a few simple rules and questions you ask yourself can help you find the right balance of information to include.

Some questions you might ask yourself when writing an AGENTS.md file:

- What top level folders should an agent know about right away to find what it needs to know?
- Are they described succinctly and accurately?
- How do I communicate the purpose of this agent workflow without overloading it with too much information?
- Can I hide this complexity behind a link to a more detailed document?
- Does each instruction serve a purpose, or can I combine it with another instruction to reduce the total number of tokens spent?
- Are there deliverables I expect with every interaction?

![Uhoh. Something smells fishy.](/images/posts/robot-checklist-smells.png)

## How to reduce a code-smell with AGENTS.md.

A code-smell is a surface indicator that something deeper is wrong. Sometimes you'll find that the agent you use has a bad habit of doing something that you feel will cause more work for you later. There is a threshold of "annoying" and "enough" that usually indicates to me that I should mention this problem in my agents file. For example, it might be a good idea in a functional programming project mention a preference for immutability over mutable data, or a preference for constructors over alternatives. These rules can reduce smells before they even happen, but you need to justify the rule by demonstrating that the agent is actively doing something regularly that needs to be "fixed." Each entry in AGENTS.md must be justified.

```md
## Rules:

- Do not run task "X" because it takes too long to run.
- Put all discovered generated build files into the `.gitignore` file.
- Don't make big decisions without me.
```

These particular kinds of rules are like `package.json`'s event hooks, like "preinstall" and "postinstall". They are not meant to be exhaustive, but to cover the most common cases where you find yourself repeating the same instruction over and over again. Don't let your agents do things that make you feel uncomfortable or waste your time.

## Example "Tasks" for AGENTS.md

The easiest one to add is a "Commit strategy." Don't write commits for yourself any more. Teach your agents to write clean, professional commits that you can look back on and understand what happened.

```
## Commit Process

- Run `bun format`.
- Run `bun validate`, confirm zero diagnostics and test failures.
- Before commit, investigate `agent-todo.md` and update the tasks with new blockers, risks, and remove completed items.
- Update `CHANGELOG.md` with entries that include: date, bold title, short description, emphasized GitHub username
- Every commit needs a title and detailed body with changed files and reasons.
- Commit with a temp file via `git commit -F`, then delete it
```

You don't even need to say "Do this before/after each commit." Just declare that the commit process exists, and the agent will see and understand it must follow the process you've outlined. Combining a "script" with a "rule" like this is a powerful way to make your agents more efficient and effective. They can also use less tokens to activate the steps because the expectations for the workflow are already encoded into a script. Now the agent has to think less because the instructions are already decided.

I recommend the following project structure for agent tasks.

```
scripts/ 
  ├── README.md # describe your tasks here in detail, not in AGENTS.md
  ├── lint.mjs
  ├── test.mjs
  └── build.mjs
README.md # describe your project here in detail, not in AGENTS.md
AGENTS.md
package.json # put a `bun` script alias here so the agent only needs to run `bun lint` for example
```

There is almost no excuse for not having a nice lint, test, commit, and format workflow for your project. It costs a very small amount of tokens to make sure your commit history looks beautiful. Your time is too valuable to waste on menial tasks like performing a commit. You are prone to mistakes that make you disorganized, so help the agent keep you organized.

Trust me. Your agent definitely knows the meaning of "lint" and "test" and "build" and "format" and "commit" better than you think.

![Testing workflow failure! A robot is holding a checklist with a red X on it.](/images/posts/robot-failed-checklist.png)

## Testing workflow

Just like humans, it's easy to start writing code thinking that a bug you found will be fixed by the code you want to write, or even that you understand the shape of the regression. Agents are certainly better than you think when it comes to this stuff, but they can still make the same mistakes. Encourage a strict TDD workflow where the agent must verify a "strict red test phase" before writing any code. This will reduce the likelihood of writing wasted code.

```
## Working in this repo

- Use strict TDD with explicit red and green phases
- Comment each test in detail to describe what it expects
- Always update every related document with any changes

## Work Deliverables

- Commit hash
- Written tests
- Lint, validation, and test report
- Relevant docs update
- Detailed description of change
```

Yes. Encourage your agent to just commit the work directly after it's completed. Directly to the main branch. Full stop. I know this idea is contentious, but hear me out.

This involves doing more work up front, as if you were *managing a developer resource*. Combining your AGENTS.md file tasks with a proper managerial workflow is the "secret sauce" of this whole thing.

Defining your tasks in slices up front really helps the agent know how much work to do before finishing a task. The truth is you will often not need to "go back and revert" your code if you slice your work appropriately. In fact, if you *do* need to revert it back, just ask the agent to change it back and describe *why* it needs to be changed. This will be included in your commit history as a detailed post-mortem of the change. This gives your agent more context in the *diff* itself, almost as if you are logging your mistakes for future you.

Branching? Only do it when you want to explore an "idea" that you're not sure about. 99% of the time, you already know what needs to be done. Your problem has already been scoped and solved in a meaningful way. (Because you're a good manager, right?)

Use your AGENTS.md file to treat the commit history like a very detailed changelog that the *agent* can use to understand previous context. The changelog you personally care about should be at a much higher level of abstraction in the form of a `CHANGELOG.md` file in the root of your project. Knowing who did what commit and why has more value than the actual summary of the work itself.

## You're a manager now.

Every mistake your agent makes is *your* fault now. Sure, it was probably trained poorly, but it's your responsibility to guide it. If it makes a mistake, it's because you allowed it to.

It's pretty harsh, but it's the truth. You're a manager now. Act like one.

