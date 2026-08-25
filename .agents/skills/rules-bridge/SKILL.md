---
name: rules-bridge
description: |
  Syncs and converts AI development rule files (AGENTS.md / CLAUDE.md) to the
  corresponding configuration formats for mainstream IDE and CLI tools.
  Supports: GitHub Copilot, Cursor, Codex CLI, Antigravity.

  Trigger keywords (English): sync rules, convert rules, bridge rules,
  rules sync, rules convert, rules bridge, export rules, propagate rules,
  update copilot instructions, update cursor rules

  觸發關鍵詞（中文）：同步規則、轉換規則、橋接規則、規則同步、規則轉換、
  規則橋接、匯出規則、更新規則、同步 AI 規則、將規則同步到工具

  Use the `/rules-bridge` command to sync your AGENTS.md plus repo agent/skill
  metadata to one or all supported tools at once.
---

# rules-bridge Skill

`rules-bridge` is an Agent Skill that bridges your AI rule definitions to the
native configuration formats expected by each supported tool.

## What it does

Given an `AGENTS.md` (or `CLAUDE.md`) file at the root of your project, this
skill converts and writes its content to:

| Target    | Output path                          | Notes                                  |
|-----------|--------------------------------------|----------------------------------------|
| `copilot` | `.github/copilot-instructions.md`    | Plain Markdown copy; also syncs instructions, agents, and skills between repo metadata folders |
| `cursor`  | `.cursor/rules/base.mdc`             | Wraps content in `.mdc` YAML frontmatter |
| `codex`   | `AGENTS.md` *(no change)*            | Codex reads `AGENTS.md` + `.agents/*/` natively |
| `antigravity` | `.agents/AGENTS.md`              | Project-scoped rules for Antigravity; also mirrors instructions, agents, and skills from `.github/` to `.agents/` |
| `all`     | All four targets above               | Runs all conversions in one step       |

## Command

```
/rules-bridge [target]
```

- `target` — one of `copilot`, `cursor`, `codex`, or `all` (default: `all`)

## How it works

1. The `/rules-bridge` command (defined in `commands/rules-bridge.md`) is
   invoked with an optional `[target]` argument.
2. The command delegates to `scripts/convert.sh $ARGUMENTS`, passing the
   target name as `$1`.
3. `convert.sh` reads `AGENTS.md` from the current working directory and
   writes the converted output to the appropriate path(s), including repo
   agent/skill mirrors when present.
4. Each operation prints a `✅` success or `❌` failure status line.

## File responsibilities

| File                        | Responsibility                                              |
|-----------------------------|-------------------------------------------------------------|
| `SKILL.md`                  | Skill metadata and high-level documentation (this file)    |
| `commands/rules-bridge.md`  | Slash-command definition; passes `$ARGUMENTS` to the script |
| `scripts/convert.sh`        | All conversion logic; reads AGENTS.md, writes target files  |
| `README.md`                 | End-user documentation, installation, and usage examples    |

## Conversion details

### copilot

Copies the full content of `AGENTS.md` verbatim to
`.github/copilot-instructions.md`. Creates the `.github/` directory if it
does not exist.

Also syncs all `.md` files from `.agents/instructions/` to `.github/instructions/`,
and mirrors `.github/agents/` + `.github/skills/` into `.agents/agents/` + `.agents/skills/`,
so GitHub Copilot and Codex can read the same repo-local guidance.

### cursor

Wraps the content of `AGENTS.md` inside a Cursor `.mdc` file with the
required YAML frontmatter:

```markdown
---
alwaysApply: true
---

<content of AGENTS.md>
```

Writes the result to `.cursor/rules/base.mdc`. Creates the
`.cursor/rules/` directory if it does not exist.

### codex

Codex CLI reads `AGENTS.md` natively, so no file conversion is needed.
The script verifies that `AGENTS.md` exists and reports the result.

Also verifies that `.agents/instructions/`, `.agents/agents/`, and
`.agents/skills/` exist and reports the available file/folder counts. Codex
reads these natively via the repo instruction references.

### all

Runs the `copilot`, `cursor`, and `codex` conversions sequentially and
prints a summary.

## Requirements

- Bash 3.2+ (macOS default shell is compatible)
- An `AGENTS.md` file in the project root (or current working directory)

## Error handling

- If `AGENTS.md` is not found, the script exits with code `1` and prints an
  `❌` error message.
- If a target directory cannot be created or the file cannot be written, the
  script prints an `❌` error message for that target and continues with
  the remaining targets (when using `all`).
- Unknown target names print a usage hint and exit with code `1`.
