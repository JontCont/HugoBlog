# Screenshot Definition

Screenshots are test evidence with a purpose, not decoration. Define them during discussion and verify them during implementation.

## Screenshot Record

Every proposed screenshot must include:

- **ID**: stable kebab-case identifier, such as `checkout-validation-error`.
- **Purpose**: the behavior or visual risk the image proves.
- **Capture moment**: the exact completed action and stable UI state.
- **Target**: full page, viewport, or a named component/region.
- **Viewport**: project/device name or exact width and height.
- **Theme and locale**: only when relevant to expected rendering.
- **Required visible state**: headings, messages, controls, or data that must appear.
- **Masks**: dynamic, personal, secret, timestamp, animation, or unstable regions.
- **Baseline policy**: evidence-only screenshot or committed visual-regression baseline.

## Rules

- Do not use screenshots as the only functional assertion.
- Capture after a meaningful state is stable; never stabilize with fixed sleeps.
- Prefer component or region screenshots when only a local UI contract matters.
- Keep deterministic viewport, fonts, locale, timezone, animations, and test data for visual comparisons.
- Mask only genuinely nondeterministic content. Excessive masking can hide regressions.
- Do not capture credentials, tokens, personal data, or unrelated user content.
- Use names derived from the screenshot ID so discussion, plan, implementation, and reports remain traceable.