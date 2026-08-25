# Playwright Test Authoring Rules

## Evidence and Locators

- Derive behavior from the rendered UI and owning implementation code.
- Treat codegen output as a draft.
- Preserve repository conventions for imports, fixtures, projects, naming, and directories.
- Prefer locators in this order: `getByRole()` with accessible name, `getByLabel()`, `getByPlaceholder()`, `getByText()`, `getByTestId()`, then narrow CSS as a last resort.
- Avoid XPath, generated classes, long CSS chains, positional selectors, and broad `.first()` or `.nth()` calls used only to silence strictness errors.

## Waiting and Assertions

- Rely on actionability and auto-waiting.
- Use async web-first assertions such as `await expect(locator).toBeVisible()`.
- Never add `waitForTimeout()` to make a test pass.
- Wait for a meaningful UI state; wait for a response only when no observable UI equivalent exists.
- Assert meaningful outcomes rather than every action.
- A screenshot does not replace a functional assertion.

## Isolation and Structure

- Tests must run independently and in any order.
- Create deterministic data through existing fixtures, APIs, or setup projects.
- Do not depend on production data, another test's output, wall-clock timing, or shared mutable accounts.
- Keep one user behavior per test.
- Enclose every test case in a `test.describe()` block that owns its hooks and lifecycle.
- Use `beforeAll` only for immutable or safely isolated shared resources. Use `beforeEach` for state that a test mutates.
- Keep work-item-specific code under `tests/test-cases/<work-item-id>/`.
- Move cohesive behavior to `tests/shared/` only after multiple work items reuse it.
- Keep repeated UI operations as focused functions under `shared/ui/`. Page Object classes are optional, not the default.
- Apply SOLID principles pragmatically without adding layers for a single simple operation.
- Do not leave `test.only`, debug pauses, console logging, secrets, auth state, or generated artifacts.

## Test Identity

- Give every describe block one `@workitem:<WORK-ITEM-ID>` tag and every agent-selectable test one stable `@case:<CASE-ID>` tag plus one `@module:<module>` tag using Playwright's native test metadata.
- Case IDs are immutable identities. Rename the human-readable title without changing the case ID.
- Keep titles descriptive and unique within a spec; do not encode all metadata into the title.
- Add optional purpose tags such as `@smoke`, `@regression`, `@hybrid`, or `@visual` only when the project defines their meaning.
- Do not create placeholder Playwright tests for purely manual checks.