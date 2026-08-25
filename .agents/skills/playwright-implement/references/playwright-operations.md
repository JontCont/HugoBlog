# Playwright Operations

This is the primary extension point for browser-operation guidance. Add focused reference files beside this document when new domains such as authentication, network mocking, visual testing, mobile emulation, or trace debugging need substantial rules, then link them from `SKILL.md` or this index.

## Capability Selection

1. Prefer browser or Playwright tools already exposed by the current agent.
2. GitHub Copilot may use its provided browser tools. Other agents must obtain user approval for Playwright MCP or equivalent browser control when required.
3. If no browser tool is available, use the target project's installed Playwright runner when execution is permitted.
4. Do not install packages, browsers, or system dependencies without explaining the change and obtaining approval when required by the environment.
5. If execution remains unavailable, implement provisionally from code and supplied evidence, and report that live UI validation is still required.

## Browser Workflow

1. Discover the target URL from Playwright config, package scripts, environment examples, or running server output. Reuse one unambiguous repository server, ask when multiple targets exist, and never guess a port.
2. Use local, preview, staging, or dedicated test environments and synthetic accounts.
3. Inspect semantic or accessibility state before choosing locators. Use screenshots for visual evidence.
4. Perform only the approved user flow and observe meaningful outcomes.
5. Let users enter secrets directly. Never request passwords, MFA codes, tokens, cookies, or storage state in chat.
6. Require explicit approval for destructive, billable, externally visible, production, access-control, or legally binding actions.
7. Keep traces, screenshots, videos, HAR files, logs, auth state, and personal data uncommitted unless explicitly approved.
8. Use disposable scripts in the OS temporary directory only for one-off investigation. Persistent coverage belongs under `tests/test-cases/`; never write generated automation into the skill directory.

## Execution

- Prefer the repository's package manager and Playwright scripts.
- Keep target origins configurable through Playwright config, approved environment variables, or one clearly named constant.
- Run one changed spec, project, or title filter first.
- Rely on Playwright actionability and web-first assertions rather than fixed delays.
- Enable trace according to repository configuration when diagnosing failures.
- Use retries only to expose flakiness, never to declare an unstable test healthy.
- Use headed mode for interactive discovery or debugging when useful; keep repository defaults for normal validation and CI.
- Broaden execution when shared fixtures, auth, config, or cross-browser behavior changed.