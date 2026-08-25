---
name: playwright-plan
description: "Create an implementation proposal and executable task list for Playwright coverage. Use after test-case discussion when defining scope, architecture, files, fixtures, screenshot work, dependencies, validation commands, proposal.md, or tasks.md without implementing tests yet."
argument-hint: "<discussion artifact, module, or approved test cases>"
---

# Playwright Plan

Convert an approved discussion into a reviewable implementation proposal and ordered tasks. Do not implement test code in this phase.

## Required Input

Locate the discussion artifact produced by `playwright-discuss`, or obtain equivalent approved decisions. If material behavior, test names, or screenshot definitions remain ambiguous, return to discussion instead of guessing.

Read [planning rules](./references/planning-rules.md) before writing the proposal.

## Workflow

1. Recheck the target repository's Playwright config, fixtures, auth setup, helpers, test layout, package scripts, and CI projects.
2. Map every approved test case and screenshot ID to the smallest implementation surface and a stable case ID.
3. Decide test data setup, isolation, cleanup, locator strategy, assertion strategy, screenshot stability, test-index registration, and focused validation commands.
4. Identify dependencies, risks, migration needs, and explicit non-goals.
5. Reuse the discussion's change ID. Create or update:
   - [proposal](./assets/proposal.template.md) at `docs/playwright/changes/<change-id>/proposal.md` by default;
   - [tasks](./assets/tasks.template.md) at `docs/playwright/changes/<change-id>/tasks.md` by default.
6. Make each task independently checkable and order tasks by dependency.
7. Do not mark implementation tasks complete during planning.

Follow established project documentation paths when they exist.

## Completion Gate

Planning is complete when every approved test case and screenshot ID maps to files, stable Playwright tags, test-index entries, setup, assertions, evidence, and a validation command, with no unresolved blocker hidden as an assumption.

Return the change ID, proposal and task paths, plus any decision that still blocks implementation.