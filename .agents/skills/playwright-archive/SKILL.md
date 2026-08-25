---
name: playwright-archive
description: "Archive a completed module-scoped Playwright test change after discussion, proposal, multiple tasks, implementation, screenshots, registration, and validation are complete. Use when closing a test change, moving completed spec artifacts to history, preserving decisions, or distinguishing completed workflow archives from retired test cases."
argument-hint: "<change ID, module, or active change path>"
---

# Playwright Archive

Close one completed module-scoped test change while preserving its decisions, tasks, evidence, and results. Archiving a workflow does not retire the tests it created.

## Required References

Read [archive rules](./references/archive-rules.md) before moving artifacts or changing test-index lifecycle state.

Use [the archive summary template](./assets/archive-summary.template.md) for the final record.

## Workflow

1. Resolve exactly one active change by change ID. By default it lives at `docs/playwright/changes/<change-id>/`.
2. Confirm the change belongs to one work item and one primary module. It may contain multiple tasks, case IDs, screenshots, and spec files.
3. Validate the archive gate:
   - discussion, proposal, and tasks artifacts exist;
   - every required task is complete or explicitly waived with approval;
   - focused and broader validation results are recorded;
   - required screenshot IDs are accounted for;
   - active tests are registered and resolve by work item through `playwright-run`;
   - blockers and residual risks are explicit.
4. Create `archive-summary.md` from the template and record final case IDs, files, commands, results, screenshots, decisions, waivers, and residual risks.
5. Determine test lifecycle separately:
   - tests that remain valid keep `status: active`;
   - only tests intentionally retired from executable coverage become `status: archived` with date and reason.
6. Move the complete change directory to `docs/playwright/archive/<YYYY-MM-DD>-<change-id>/`. Preserve repository history; do not reconstruct or discard artifacts.
7. Verify no active change remains at the old path and all relative links inside the archive still resolve.
8. Report the archive path, work item, module, completed task IDs, active and retired case IDs, validation evidence, and any approved waivers.

## Safety

Do not archive a partially completed change merely to clear the active list. Stop on unresolved required tasks, missing evidence, failed validation, ambiguous case lifecycle, or an archive destination collision unless the user explicitly approves a documented waiver.