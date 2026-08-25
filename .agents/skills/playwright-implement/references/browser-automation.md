# Browser Automation

Use these rules for browser inspection, one-off probes, and task validation. Persistent coverage still follows `test-architecture.md` and belongs under `tests/test-cases/`.

## Target Discovery

Before automating a localhost flow:

1. Read the repository's Playwright `baseURL`, package scripts, environment examples, and current server output.
2. Reuse a running development server when exactly one target is clearly associated with the repository.
3. Ask the user to choose when multiple plausible servers or applications are running.
4. When no target is running, use an approved repository script to start it or ask for the URL. Do not guess a port.
5. For remote targets, confirm the environment and side-effect risk before navigation.

Keep the target configurable through Playwright config, an approved environment variable, or a clearly named constant. Do not scatter hard-coded origins through tests.

## Persistent Tests and Temporary Probes

- Write approved, repeatable coverage under `tests/test-cases/<work-item-id>/` and register it in the test index.
- Use an OS temporary directory only for disposable investigation code that is not a test case and does not belong in the repository.
- Give temporary files a recognizable `playwright-probe-*` name and report their artifact paths.
- Delete temporary scripts and sensitive artifacts when the task ends unless the user asks to retain them.
- Do not write generated scripts, screenshots, traces, or authentication state into a skill installation directory.
- Prefer browser tools already exposed by the agent over creating a temporary script for a simple inspection.

## Browser Mode

- Use the repository or Playwright project default for normal validation and CI.
- Use headed mode for interactive discovery, demonstrations, or debugging when a display is available and visibility is useful.
- Do not force headed mode in CI or environments without a display.
- Use `slowMo` only for a user-visible demonstration, never to make a test reliable.

## Automation Pattern

For each browser task:

1. Create a browser context with the approved project, viewport, locale, timezone, authentication state, and headers.
2. Navigate to the configured target and verify a meaningful loaded state.
3. Inspect semantic roles and accessible names before choosing locators.
4. Perform the smallest approved interaction sequence.
5. Verify observable outcomes with web-first assertions.
6. Capture only approved screenshots, traces, or other evidence.
7. Close pages, contexts, and browsers through reliable teardown, including failure paths.

Use Playwright locators and assertions instead of raw selectors and manual waits. Do not replace an assertion with console output.

## Responsive Validation

- Use Playwright projects or explicit approved viewport definitions for desktop, tablet, and mobile coverage.
- Reload or recreate the context when the application only computes responsive state during initialization.
- Verify behavior and layout at each required viewport; screenshots alone do not prove responsive correctness.
- Capture screenshots with stable names derived from approved screenshot IDs, not ad hoc viewport names.
- Do not add fixed sleeps between viewport changes. Wait for an observable stable state.

## Links and Forms

- For forms, use synthetic data and assert the resulting UI, URL, network state, or persisted state defined by the case.
- Do not submit forms that send real notifications, create charges, modify production data, or cause other external effects without explicit approval.
- For link checks, resolve relative URLs against the current page, ignore unsupported schemes, and respect authentication and environment boundaries.
- Prefer a request context for HTTP status checks. A successful status does not replace navigation checks when browser behavior matters.
- Treat redirects, expected authentication responses, rate limits, and intentionally unavailable links according to the approved requirement rather than a generic `2xx` rule.

## Custom Headers

- Configure approved headers through Playwright context options, project `use.extraHTTPHeaders`, or non-secret environment variables.
- Use headers for test traffic identification or controlled test-environment behavior only when the target system supports them.
- Never place credentials, tokens, or user-supplied secrets in source, the test index, logs, or chat-generated commands.
- Record environment-specific header requirements in planning without recording their secret values.

## Failure Reporting

On failure, preserve the primary error and report the failed action, URL or route, expected state, observed state, and approved artifact paths. Cleanup must not hide the original failure. Use traces and screenshots for diagnosis, then convert confirmed repeatable behavior into a registered test case only when it belongs to the approved work item.