# Execution and Reporting

## Command Construction

- Use the repository's existing package script when it preserves Playwright CLI arguments; otherwise use its package manager's Playwright executable.
- Pass resolved spec paths as separate arguments.
- Pass case/module/tag filters through Playwright `--grep`; escape title input as a literal unless the user explicitly requests regex.
- Apply `--project` only when requested or required by established repository defaults.
- Use `--only-changed[=<ref>]` and `--last-failed` directly for those native modes.
- Do not combine selectors whose Playwright semantics cannot be represented safely. Split into explicit runs and aggregate results instead.

## Preflight

1. Validate the test index with the resolver.
2. Confirm every resolved record has `status: active`; archived records must never reach command construction.
3. Resolve the target from Playwright config and the selected environment. Do not guess a localhost port or silently switch environments.
4. Run the final command with `--list`.
5. Confirm the listed tests correspond to resolved case IDs and expected projects.
6. Stop on zero matches. Do not broaden filters automatically.

## Execution Safety

- Use approved local, preview, staging, or test environments.
- Never print or pass secrets through chat-generated command text.
- Require approval for destructive, billable, externally visible, production, access-control, or legally binding flows.
- Do not use `--update-snapshots`, additional retries, headed/debug mode, or broad `all` runs unless requested or required by the approved plan.
- Apply custom headers only through approved Playwright configuration or non-secret environment variables. Never print secret values.

## Report

Include:

- selectors and resolved case IDs;
- preflight listed count and project expansion;
- exact executed command;
- passed, failed, skipped, interrupted, and flaky counts;
- duration and failed test titles with concise causes;
- trace, screenshot, video, and report paths;
- environment blockers or sensitive artifacts that must remain uncommitted.