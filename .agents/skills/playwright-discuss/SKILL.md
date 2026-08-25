---
name: playwright-discuss
description: "Discuss and discover Playwright test coverage before planning or implementation. Use when defining test cases, test names, modules, user flows, acceptance criteria, browser evidence, screenshot requirements, scope, risks, or open questions from UI and code."
argument-hint: "<feature, module, URL, requirement, or user flow>"
---

# Playwright Discuss

Turn an incomplete testing request into an evidence-backed discussion artifact. Do not write production test code in this phase.

## Required References

Read [browser access and safety](./references/browser-access.md) before inspecting a UI.

Read [screenshot definition](./references/screenshot-definition.md) before proposing or capturing screenshots.

## Workflow

1. Identify the requested work item, feature, module boundary, actors, environment, and business risk.
2. Inspect neighboring product code, routes, existing Playwright tests, fixtures, and test naming conventions.
3. Inspect the rendered UI when browser access is available. Correlate visible behavior with the code that controls it.
4. Enumerate candidate test cases. For each case define:
   - module and test title;
   - automation mode: automated or hybrid;
   - priority and rationale;
   - preconditions and test data;
   - user actions;
   - observable outcomes;
   - screenshot IDs and capture moments;
   - exclusions, side effects, and cleanup.
   Record coverage that cannot execute through Playwright separately; do not turn a purely manual check into a placeholder test case.
5. Separate confirmed facts, proposed behavior, and unanswered questions.
6. Resolve high-impact ambiguity with the user. Do not invent product requirements.
7. Confirm the owning work item and assign a lowercase kebab-case change ID for this module-scoped effort, such as `auth-login-coverage`.
8. Create or update a discussion artifact using [the template](./assets/discussion.template.md). Follow an existing project documentation convention when one exists; otherwise use `docs/playwright/changes/<change-id>/discussion.md`.

## Completion Gate

Discussion is complete when the work item, change ID, module, executable test names, automation modes, expected behavior, screenshot concept, assumptions, and open decisions are explicit enough for planning.

Return the artifact path and a concise list of decisions still requiring user approval.