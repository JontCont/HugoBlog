---
name: playwright-implement
description: "Implement and validate approved Playwright test plans. Use when writing or updating Playwright specs, fixtures, shared UI or API operations, test data, screenshots, visual baselines, or when executing and debugging tasks from proposal.md and tasks.md."
argument-hint: "<proposal, tasks file, module, test case, or task ID>"
---

# Playwright Implement

Implement approved proposal tasks, validate each focused change, and keep task status accurate.

## Required References

Read [Playwright operations](./references/playwright-operations.md) before browser work.

Read [browser automation](./references/browser-automation.md) before discovering targets, writing temporary probes, checking responsive behavior, or configuring browser contexts.

Read [test architecture](./references/test-architecture.md) before choosing test paths, lifecycle boundaries, or shared abstractions.

Read [test authoring rules](./references/test-authoring.md) before editing tests.

Read [test registration](./references/test-registration.md) before adding, renaming, moving, or removing test cases.

Read [screenshot implementation](./references/screenshot-implementation.md) when a task contains screenshot IDs.

## Workflow

1. Locate the approved change ID, discussion, proposal, and tasks artifacts under the active changes directory. Confirm the requested task IDs and existing worktree state.
2. Inspect only the owning code, neighboring tests, fixtures, and config needed for the first pending task.
3. Verify browser access and the relevant UI state according to `playwright-operations.md`.
4. Implement the smallest pending task using existing project conventions. Enclose every case in `test.describe()`, add stable work-item/case/module tags, and update the test index in the same change.
5. Immediately run the task's focused validation command.
6. If validation fails, use the failure, trace, UI, and owning code to repair the same task before expanding scope.
7. Verify every required screenshot against its definition. Update baselines only when the approved plan requires it and the observed change is intentional.
8. Verify the test-index entry resolves to the intended test through Playwright `--list` before marking the task complete.
9. Mark a task complete only after its focused check passes. Record blockers without silently changing scope.
10. After all tasks, run the proposal's broader affected validation and report residual risk. Leave the completed change active until `playwright-archive` verifies and archives it.

## Completion Report

Return changed files, completed and blocked task IDs, test commands and results, screenshot IDs produced or updated, observed evidence versus assumptions, and sensitive artifacts that must remain uncommitted.