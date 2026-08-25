# Playwright Test Architecture

This architecture provides safe defaults for users and agents that are not testing or coding specialists. Prefer readable, independent tests over framework-heavy abstractions.

## Standard Layout

Use the repository's equivalent structure when one is already established. For a new Playwright test structure, use:

```text
tests/
├── test-cases/
│   └── <work-item-id>/
│       ├── feature.spec.ts
│       ├── regression.spec.ts
│       └── local-fixture.ts
├── shared/
│   ├── fixtures/
│   ├── ui/
│   ├── api/
│   └── data/
├── auth/
└── playwright-test-index.json
```

- Put executable test cases under `tests/test-cases/<work-item-id>/`.
- Keep code used by only one work item beside that work item's specs.
- Move code to `tests/shared/` only when multiple work items reuse the same cohesive behavior.
- Put reusable setup and teardown in `shared/fixtures/`, UI operations in `shared/ui/`, API operations in `shared/api/`, and non-sensitive test data in `shared/data/`.
- Do not create vague dumping grounds such as `utils.ts`, `common.ts`, or a general-purpose helper.
- Keep auth state, test results, reports, traces, videos, and other sensitive or generated artifacts out of version control.

Planning and evidence documents remain separate from executable tests under the repository's Playwright documentation convention, normally `docs/playwright/changes/<change-id>/`.

## Test and Work Item Boundaries

- Every test case must be enclosed by a `test.describe()` block. The block is the lifecycle and ownership boundary for its related hooks and cases.
- Add `@workitem:<WORK-ITEM-ID>` to the describe metadata, and add one immutable `@case:<CASE-ID>` plus one `@module:<module>` to each test.
- A new feature normally adds a test case. A changed feature may update an existing case when its intended behavior changes.
- A bug with existing coverage repairs or strengthens that case. A bug without coverage adds a regression case that reproduces the defect.
- Retire removed behavior through the test index. Never delete or reuse a retired case ID.
- Tests must run independently and in any order. Do not make one test depend on another test's output.

Use `beforeAll` only for immutable or safely isolated resources shared by the describe block. Use `beforeEach` for state that each test mutates. Hooks do not justify shared mutable accounts, order-dependent tests, or leaked state.

## Low-Coupling Rules

Apply SOLID principles pragmatically:

- Keep specs responsible for scenarios and assertions rather than infrastructure details.
- Keep fixtures, UI operations, API operations, and test data focused on one responsibility.
- Depend on explicit fixtures and configuration instead of hard-coded environments, credentials, or hidden global state.
- Keep shared interfaces small and replaceable.
- Extend cohesive shared behavior without changing unrelated existing cases.

Do not force an abstraction for a single simple operation. Write UI actions directly in the test until a flow is reused or has enough complexity to deserve a focused function in `shared/ui/`. Page Object classes are optional, not the default.

## Automation Boundary

- Register tests that Playwright can execute as automated or hybrid flows.
- A hybrid flow may require an approved external or human step, such as completing a verification challenge, before Playwright continues with observable assertions.
- Do not create placeholder Playwright tests for purely manual checks.
- Do not claim a hybrid flow is fully automated, and do not store secrets, verification codes, or user input in the test index.

## CI Boundary

CI selects executable tests through case, module, work item, tag, title, or spec metadata and verifies the resolved set with Playwright `--list`. Markdown artifacts preserve decisions and evidence but are not executable selectors.