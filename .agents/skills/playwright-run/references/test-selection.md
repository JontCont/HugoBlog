# Test Selection

## Canonical Identity

- Executable identity: Playwright tag `@case:<CASE-ID>` in the spec.
- Group identity: Playwright tag `@module:<module>`.
- Delivery identity: Playwright describe tag `@workitem:<WORK-ITEM-ID>`.
- Discovery source: `tests/playwright-test-index.json`.
- Lifecycle source: index `status`; only `active` cases are executable.

## Supported Selectors

| User request | Resolution |
| --- | --- |
| Work item `WORK-1234` | Exact index `workItem`, then resolved specs plus `--grep @workitem:WORK-1234` |
| Case ID `AUTH-001` | Exact index `caseId`, then `--grep @case:AUTH-001` |
| Module `auth` | Exact index `module`, then resolved specs plus `--grep @module:auth` |
| Tag `@smoke` | Exact member of index `tags`, then `--grep @smoke` |
| Title text | Index title substring, then resolved specs plus escaped `--grep` |
| Spec path | Exact normalized workspace-relative spec path |
| Changed | Playwright `--only-changed` or `--only-changed=<git-ref>` |
| Last failed | Playwright `--last-failed` |
| All | Playwright test command without a test filter, only with explicit user intent |

Selectors from different categories are ANDed. Multiple values in one category are ORed by the resolver.

## Resolution Rules

1. Prefer case ID over mutable title text.
2. Validate every index path is workspace-relative and cannot escape the workspace.
3. Reject duplicate case IDs, malformed records, unknown selectors, and zero matches.
4. Exclude `archived` records from every selection, including `all`, module, tag, title, and spec path.
5. When an exact requested case ID is archived, stop and report its archive date, reason, and replacement ID when present.
6. Do not fuzzy-match work items, case IDs, modules, tags, or spec paths.
7. Ask before running a broad selection when the user appeared to request one test.
8. Use `--list` with the final filters before actual execution.
9. A single logical test may appear once per selected Playwright project; report that expansion explicitly.

## Examples

```text
Run case AUTH-001 on chromium.
Run work item WORK-1234.
Run module auth tagged @smoke.
Run tests in tests/test-cases/WORK-2345/feature.spec.ts whose title contains "empty cart".
Run tests changed since main.
Rerun the last failed tests.
```