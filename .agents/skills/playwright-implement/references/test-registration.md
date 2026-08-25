# Test Registration

Agent-selectable tests use two synchronized sources:

1. Native Playwright tags in the spec are the executable identity.
2. `tests/playwright-test-index.json` is the machine-readable discovery index.

## Spec Metadata

Use Playwright's object syntax:

```typescript
test.describe('WORK-1234 authentication', {
  tag: ['@workitem:WORK-1234'],
}, () => {
  test('redirects an authenticated user to the dashboard', {
    tag: ['@case:AUTH-001', '@module:auth', '@smoke'],
  }, async ({ page }) => {
    // Test body.
  });
});
```

- `@case:<CASE-ID>` must be globally unique and immutable.
- `@module:<module>` must use lowercase kebab-case.
- `@workitem:<WORK-ITEM-ID>` identifies the owning delivery or defect work item.
- Optional tags must start with `@` and follow project vocabulary.

## Test Index

Create `tests/playwright-test-index.json` when it does not exist. Preserve repository-specific placement when an equivalent index already exists.

```json
{
  "version": 1,
  "tests": [
    {
      "caseId": "AUTH-001",
      "module": "auth",
      "workItem": "WORK-1234",
      "title": "redirects an authenticated user to the dashboard",
      "spec": "tests/test-cases/WORK-1234/feature.spec.ts",
      "status": "active",
      "tags": ["@smoke"],
      "screenshots": ["auth-dashboard"]
    }
  ]
}
```

Rules:

- Paths are workspace-relative, use `/`, and must not escape the workspace.
- New records must include the owning `workItem` and match the `@workitem:` describe tag.
- Do not duplicate `@case:`, `@module:`, or `@workitem:` in `tags`; they are derived from `caseId`, `module`, and `workItem`.
- Keep records sorted by `caseId` for reviewable diffs.
- Update the index in the same change when a test is added, moved, renamed, retired, or its screenshot contract changes.
- New executable tests use `"status": "active"`.
- Never delete or reuse a retired case ID. Archive it so agents do not treat it as executable while history remains traceable.
- Never store commands, credentials, environment variables, test data, or user input in the index.

## Archiving

When a test is retired, remove its executable test block when appropriate and update its index record:

```json
{
  "caseId": "AUTH-000",
  "module": "auth",
  "workItem": "WORK-1000",
  "title": "supports the legacy login form",
  "spec": "tests/test-cases/WORK-1000/regression.spec.ts",
  "status": "archived",
  "archivedAt": "2026-07-27",
  "archiveReason": "The legacy login form was removed.",
  "replacedBy": "AUTH-001",
  "tags": [],
  "screenshots": []
}
```

- `archivedAt` must be an ISO date (`YYYY-MM-DD`).
- `archiveReason` must explain the product or coverage change.
- `replacedBy` is optional and must reference a different case ID.
- Archived records are historical metadata. They are excluded from normal resolution and execution.
- Reactivating an archived ID requires explicit review. Prefer a new case ID when behavior has materially changed.

## Verification

Resolve the case with `playwright-run` and run Playwright with `--list` before execution. The case tag must map to exactly one active test unless multiple configured projects intentionally expand it. Verify archived IDs are rejected by the resolver.