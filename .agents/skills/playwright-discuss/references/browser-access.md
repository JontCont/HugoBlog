# Browser Access and Safety

1. Detect browser capabilities available in the current agent environment. Do not assume tool names.
2. GitHub Copilot may use browser or Playwright tools already exposed to it. Other agents must ask the user to enable Playwright MCP or equivalent browser automation when no browser capability is available.
3. Discover the target URL from Playwright config, package scripts, environment examples, and running server output. Reuse one unambiguous repository server, ask when multiple targets exist, and never guess a port.
4. Let the user perform sign-in directly. Never request passwords, MFA codes, tokens, cookies, or storage state in chat.
5. Prefer semantic or accessibility snapshots for structure and screenshots for visual evidence.
6. Require explicit approval before destructive, billable, externally visible, production, access-control, or legally binding actions.
7. If browser access is unavailable, use code and user-provided screenshots, traces, snapshots, or reproduction steps. Mark all unobserved behavior as proposed rather than confirmed.
8. Treat traces, screenshots, videos, HAR files, logs, and reports as potentially sensitive and keep them uncommitted unless the project explicitly approves them.
9. Use headed mode when interactive observation is useful and a display is available. Do not require it in CI or headless environments.