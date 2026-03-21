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

When people think about project metadata, they usually think about files like `package.json`, `Cargo.toml`, or `go.mod`.

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

That guesswork is where a lot of wasted time comes from, for both people and agents, at least in my experience. However, there is more to it than that. It is possible to overload your agents with too much information and drown them in context. It is also possible to waste context and spend more on tokens than necessary to get the job done. That is why I think the idea of "irreducible complexity" is so important.

In biology, irreducible complexity is the claim that some systems only work when all of their parts are present together, so they supposedly could not have developed through simpler intermediate stages. For an AGENTS.md, the more useful comparison is not "all parts must exist," but rather that "some instructions are load-bearing." A lean agent guide should keep only the few pieces whose removal would reliably cause failures, bad edits, or wasted cycles: the repo’s critical commands, constraints, and workflow invariants. Everything else is "fluffy context" and not irreducible complexity.

Optimizing your `AGENTS.md` file is not nearly as difficult as you might think, because a few simple rules and questions can help you find the right balance of information to include.

Some questions you might ask yourself when writing an `AGENTS.md` file:

- Which top-level folders should an agent know about right away?
- Are they described succinctly and accurately?
- How do I communicate the purpose of this workflow without overloading the agent with too much information?
- Can I hide this complexity behind a link to a more detailed document?
- Does each instruction serve a purpose, or can I combine it with another to reduce the total number of tokens spent?
- Are there deliverables I expect with every interaction?

![Uhoh. Something smells fishy.](/images/posts/robot-checklist-smells.png)

## How to reduce a code smell with AGENTS.md

A code smell is a surface indicator that something deeper is wrong. Sometimes you will find that the agent you use has a bad habit that will create more work for you later. There is usually a threshold of "annoying" and "enough" that tells me I should mention the problem in my agents file. For example, in a functional programming project, it might be a good idea to mention a preference for immutability over mutable data, or a preference for constructors over alternatives. These rules can reduce smells before they even happen, but you need to justify each one by showing that the agent is regularly doing something that needs to be fixed. Each entry in `AGENTS.md` should be justified.

```md
## Rules:

- Do not run task "X" because it takes too long to run.
- Put all discovered generated build files into the `.gitignore` file.
- Don't make big decisions without me.
```

These kinds of rules are like `package.json` event hooks, such as "preinstall" and "postinstall." They are not meant to be exhaustive, but to cover the most common cases where you find yourself repeating the same instruction over and over. Do not let your agents do things that make you uncomfortable or waste your time.

## Example tasks for AGENTS.md

The easiest thing to add is a "commit strategy." Do not write commits for yourself anymore. Teach your agents to write clean, professional commits that you can look back on and understand.

```
## Commit Process

- Run `bun format`.
- Run `bun validate`, confirm zero diagnostics and test failures.
- Before commit, investigate `agent-todo.md` and update the tasks with new blockers, risks, and remove completed items.
- Update `CHANGELOG.md` with entries that include: date, bold title, short description, emphasized GitHub username
- Every commit needs a title and detailed body with changed files and reasons.
- Commit with a temp file via `git commit -F`, then delete it
```

You do not even need to say, "Do this before or after each commit." Just declare that the commit process exists, and the agent will understand that it must follow the process you outlined. Combining a "script" with a "rule" like this is a powerful way to make your agents more efficient and effective. They can also use fewer tokens to activate the steps because the expectations for the workflow are already encoded into a script. Now the agent has to think less because the instructions are already decided.

I recommend the following project structure for agent tasks:

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

There is almost no excuse not to have a good lint, test, commit, and format workflow for your project. It costs very few tokens to make sure your commit history looks clean. Your time is too valuable to waste on menial tasks like making a commit. You are prone to mistakes that create disorder, so let the agent help keep you organized.

Trust me: your agent definitely knows the meaning of "lint," "test," "build," "format," and "commit" better than you think.

![Testing workflow failure! A robot is holding a checklist with a red X on it.](/images/posts/robot-failed-checklist.png)

## Testing workflow

Just like humans, it is easy to start writing code while assuming that the bug you found will be fixed by the code you want to write, or that you already understand the shape of the regression. Agents are certainly better than you might think when it comes to this stuff, but they can still make the same mistakes. Encourage a strict TDD workflow in which the agent must verify a "strict red test phase" before writing any code. This will reduce the likelihood of writing wasted code.

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

Yes, encourage your agent to commit the work directly after it is completed. Directly to the main branch. Full stop. I know this idea is contentious, but hear me out.

This involves doing more work up front, as if you were *managing a developer resource*. Combining your `AGENTS.md` tasks with a proper managerial workflow is the "secret sauce" of this whole thing.

Defining your tasks in slices up front really helps the agent know how much work to do before finishing a task. The truth is that you often will not need to "go back and revert" your code if you scope the work appropriately. In fact, if you *do* need to revert it, just ask the agent to change it back and describe *why* it needs to be changed. That explanation becomes part of your commit history as a detailed post-mortem of the change. This gives your agent more context in the *diff* itself, almost as if you are logging your mistakes for your future self.

Branching? Only do it when you want to explore an "idea" you are not sure about. Ninety-nine percent of the time, you already know what needs to be done. Your problem has already been scoped and solved in a meaningful way. (Because you are a good manager, right?)

Use your `AGENTS.md` file to treat the commit history like a very detailed changelog that the *agent* can use to understand previous context. The changelog you personally care about should be at a much higher level of abstraction, in the form of a `CHANGELOG.md` file in the root of your project. Knowing who made each commit and why has more value than the summary of the work itself.

## You're a manager now.

Every mistake your agent makes is *your* fault now. Sure, it was probably trained poorly, but it's your responsibility to guide it. If it makes a mistake, it's because you allowed it to.

It's pretty harsh, but it's the truth. You're a manager now. Act like one.
