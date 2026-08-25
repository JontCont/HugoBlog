# /rules-bridge

Sync your `AGENTS.md` rules and repo-local agent/skill metadata to one or all supported AI tool configurations.

## Usage

```
/rules-bridge [target]
```

### Arguments

| Argument  | Description                                                         |
|-----------|---------------------------------------------------------------------|
| `copilot` | Write rules to `.github/copilot-instructions.md` and mirror repo agent/skill metadata |
| `cursor`  | Write rules to `.cursor/rules/base.mdc` (with `.mdc` frontmatter)   |
| `codex`   | Verify that `AGENTS.md` exists (Codex CLI reads it natively)        |
| `antigravity` | Write rules to `.agents/AGENTS.md` and mirror repo agent/skill metadata |
| `all`     | Run all of the above (default when no argument is given)            |

## Steps

1. Determine the target from `$ARGUMENTS` (default: `all`).
2. Run the conversion script:

```bash
bash scripts/convert.sh $ARGUMENTS
```

3. Review the `✅` / `❌` status lines printed by the script.
4. Commit any newly created or updated files if appropriate.

## Examples

Sync to all supported tools:
```
/rules-bridge
/rules-bridge all
```

Sync only to GitHub Copilot:
```
/rules-bridge copilot
```

Sync only to Cursor:
```
/rules-bridge cursor
```

Verify Codex CLI compatibility:
```
/rules-bridge codex
```

Sync only to Antigravity:
```
/rules-bridge antigravity
```

## Notes

- The script reads `AGENTS.md` from the **current working directory**.
  Make sure you run this command from the project root.
- If `AGENTS.md` does not exist, the script will exit with an error.
- The script creates any missing parent directories automatically.
