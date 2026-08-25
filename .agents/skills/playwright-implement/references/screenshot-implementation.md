# Screenshot Implementation

Implement screenshots from the approved screenshot records. Do not invent baselines during implementation.

## Functional Evidence

- For report evidence, call `page.screenshot()` or `locator.screenshot()` using a path derived from the screenshot ID and the project's artifact directory.
- Capture only after a web-first assertion proves the required stable state.
- Attach evidence through the project's existing reporter or `testInfo.attach()` convention when available.

## Visual Regression

- Use the project's existing screenshot assertion convention, normally `expect(page|locator).toHaveScreenshot()`.
- Match the approved viewport, project, theme, locale, timezone, target, masks, and animation policy.
- Keep snapshot names stable and derived from screenshot IDs.
- Review diffs before updating a baseline. A passing baseline update is not proof that the UI change is correct.
- Do not regenerate unrelated snapshots.

## Safety and Stability

- Never capture credentials, tokens, personal data, or unrelated content.
- Use deterministic data and stable fonts. Disable or wait for approved animation behavior through Playwright options and observable state, not fixed sleeps.
- Apply only approved masks. Record any additional nondeterministic region as a plan deviation.
- Report each screenshot ID as created, unchanged, updated, blocked, or intentionally omitted.