---
title: "AGENTS.md is a package.json for your agents"
description: "How to give coding agents the small set of repository rules, commands, and workflows they need to work safely."
pubDate: 2026-03-21
author: "Joshua Tenner"
authorEmail: "tenner.joshua@gmail.com"
categories:
  - "AI"
  - "Coding"
  - "Productivity"
image: ""
---

Files such as `package.json`, `Cargo.toml`, and `go.mod` help tools understand a project.

They define important facts in a predictable place. A tool does not need to rediscover those facts each time it runs.

I think `AGENTS.md` should serve a similar purpose for coding agents.

## Keep only the important instructions

`AGENTS.md` should not contain all project documentation.

It should contain the instructions that prevent repeated mistakes or wasted work.

Without those instructions, an agent often has to guess:

- where the source code lives;
- how to build the project;
- which validation commands matter;
- which generated files must stay untracked;
- which design rules are important;
- what work must be complete before a task is done.

A small amount of good context can remove a large amount of guesswork.

Too much context causes a different problem. Important rules become harder to find, and the agent spends context on information that it does not need.

I use a simple test: **Would removing this instruction regularly cause a bad edit, a failed check, or repeated correction?**

If the answer is no, the instruction probably belongs in another document.

## Questions to ask when you write AGENTS.md

These questions help me keep the file small:

- Which top-level folders must an agent know about?
- Which commands must run before work is complete?
- Which project rules are easy to violate by accident?
- Can a detailed procedure move into a script or another document?
- Does this instruction prevent a real problem?
- Can two related instructions become one clearer rule?
- Which deliverables do I expect at the end of a task?

The goal is minimum useful context, not minimum text at any cost.

![A robot checks a list for a possible problem.](/images/posts/robot-checklist-smells.png)

## Use AGENTS.md to prevent recurring problems

A useful rule usually comes from a real failure pattern.

For example, a functional project can prefer immutable data when there is no good reason to mutate state. A repository can require generated build files to stay out of Git. A slow command can be reserved for final validation instead of every edit cycle.

The important part is that each rule has a reason to exist.

```md
## Rules

- Do not run task "X" during the normal edit loop because it takes too long.
- Add discovered generated build files to `.gitignore`.
- Ask before making a large architectural change that is outside the requested scope.
```

Do not add a rule only because it sounds useful. Add it when it prevents a problem that you expect to happen again.

## Put procedures in scripts when possible

Long command sequences are easier to maintain as scripts.

`AGENTS.md` can tell the agent which script to run and when to run it.

For example:

```text
scripts/
  README.md
  lint.mjs
  test.mjs
  build.mjs
README.md
AGENTS.md
package.json
```

The detailed procedure can live in `scripts/README.md`. Short aliases can live in `package.json`.

Then `AGENTS.md` can say something simple such as:

```md
## Validation

- Run `bun lint` after code changes.
- Run `bun test` before commit.
- Run `bun build` when build behavior changes.
```

This is easier for people to read too.

## Define a commit process

A coding agent can follow a repeatable commit process if you define one.

For example:

```md
## Commit process

- Run `bun format`.
- Run `bun validate` and confirm that it succeeds.
- Review `agent-todo.md` and update relevant tasks.
- Update `CHANGELOG.md` when the change affects users.
- Write a commit title and a body that explain the reason for the change.
```

This reduces repeated instructions. It also makes the repository history more consistent.

The exact process should match the project. A small library and a production service will not need the same controls.

## Define the testing workflow

Agents can start coding too early, just as people can.

For a bug fix, I usually prefer test-driven development (TDD):

1. Add a focused test that shows the bug.
2. Run the test and confirm that it fails for the expected reason. This is the red phase.
3. Make the smallest useful fix.
4. Run the test and confirm that it passes. This is the green phase.
5. Run the wider validation suite.
6. Refactor only after the behavior is protected by tests.

A repository rule can make this explicit:

```md
## Working in this repo

- Use TDD for behavior changes when a focused regression test is practical.
- Confirm the red phase before writing the fix.
- Update documentation when public behavior changes.

## Work deliverables

- Commit hash.
- Tests added or changed.
- Validation results.
- Relevant documentation changes.
- Short description of the change and its reason.
```

![A robot holds a checklist with a failed test mark.](/images/posts/robot-failed-checklist.png)

## Direct commits are a workflow choice

I often let an agent commit directly to the main branch when the work is small, well scoped, and fully tested.

I do not treat that as a universal rule.

A branch is useful when:

- the design is uncertain;
- the work is large;
- several people need to review it;
- the change has a high operational risk;
- the repository requires pull requests.

The important part is not the branch name. The important part is a controlled workflow with clear scope and validation.

If an agent can modify the main branch, the repository needs strong tests and clear rules. The agent should not have more authority than the workflow can safely support.

## Treat the agent as a managed engineering resource

A coding agent works better when the task has a clear boundary.

Define:

- what must change;
- what must not change;
- how the result will be tested;
- which decisions require approval;
- what evidence proves that the work is complete.

When the agent makes the same mistake more than once, improve the workflow instead of repeating the same correction forever.

That can mean a new test, a new script, a new lint rule, or one new line in `AGENTS.md`.

The best `AGENTS.md` file is not the longest one. It is the one that makes correct work easier and repeated mistakes less likely.
