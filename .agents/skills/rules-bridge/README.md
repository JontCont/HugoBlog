# rules-bridge

[English](#rules-bridge) | [繁體中文](#rules-bridge-1)

> An Agent Skill that bridges your AI rule files to every tool you use.

`rules-bridge` reads your `AGENTS.md` (or `CLAUDE.md`) and automatically
converts it to the native configuration format expected by GitHub Copilot,
Cursor, and Codex CLI — all from a single slash command inside Claude Code.
It also mirrors repo-local agent and skill metadata so Codex can pick up the
same guidance that Copilot sees.

---

## Supported Tools

| Tool             | Output path                        | Format                        |
|------------------|------------------------------------|-------------------------------|
| GitHub Copilot   | `.github/copilot-instructions.md`  | Plain Markdown                |
| Cursor           | `.cursor/rules/base.mdc`           | Markdown + YAML frontmatter   |
| Codex CLI        | `AGENTS.md` *(no conversion)*      | Native (read as-is)           |
| Antigravity      | `.agents/AGENTS.md`                | Plain Markdown                |

---

## Installation

Add this skill to your Claude Code setup with:

```bash
npx skills add JontCont/rules-bridge
```

---

## Usage

Open Claude Code in your project root and run:

```
/rules-bridge [target]
```

### Targets

| Target    | Effect                                                          |
|-----------|-----------------------------------------------------------------|
| `all`     | Sync to **all** supported tools (default when omitted)          |
| `copilot` | Write `.github/copilot-instructions.md` and mirror repo agent/skill metadata |
| `cursor`  | Write `.cursor/rules/base.mdc` with `.mdc` YAML frontmatter     |
| `codex`   | Verify `AGENTS.md` exists (Codex CLI reads it natively)         |
| `antigravity` | Write `.agents/AGENTS.md` and mirror repo agent/skill metadata |

### Examples

```bash
# Sync to every tool at once
/rules-bridge
/rules-bridge all

# Sync only to GitHub Copilot
/rules-bridge copilot

# Sync only to Cursor
/rules-bridge cursor

# Check Codex CLI compatibility
/rules-bridge codex

# Sync only to Antigravity
/rules-bridge antigravity
```

---

## How it works

1. **`SKILL.md`** — declares the skill metadata and triggers recognised by
   Claude Code (both English and Chinese keywords).
2. **`commands/rules-bridge.md`** — defines the `/rules-bridge` slash command
   and passes `$ARGUMENTS` to the conversion script.
3. **`scripts/convert.sh`** — the core logic: reads `AGENTS.md`, creates the
   required directories, and writes the converted files. It also mirrors
   `.github/agents/` and `.github/skills/` into `.agents/agents/` and
   `.agents/skills/` so Codex and Antigravity can consume the same repo-local guidance.
   Each step prints a `✅` success or `❌` failure status.

---

## Requirements

- An `AGENTS.md` file in the root of your project.
- Bash 3.2+ (compatible with the default shell on macOS and all major Linux
  distributions).
- Claude Code with Agent Skills support.

---

## Project structure

```
rules-bridge/
├── SKILL.md                   # Skill metadata & documentation
├── commands/
│   └── rules-bridge.md        # /rules-bridge slash-command definition
├── scripts/
│   └── convert.sh             # Conversion logic (copilot / cursor / codex / antigravity / all)
├── README.md                  # This file
└── LICENSE                    # MIT
```

---

## Contributing

Pull requests and issues are welcome! Please open an issue before submitting a
large change so we can discuss the approach.

---

## License

[MIT](LICENSE) © JontCont

---
---

# rules-bridge

> 一個 Agent Skill，將你的 AI 規則檔案橋接到你使用的每一個工具。

`rules-bridge` 讀取你的 `AGENTS.md`（或 `CLAUDE.md`），並自動轉換為 GitHub Copilot、Cursor 和 Codex CLI 所需的原生設定格式——全部只需在 Claude Code 中執行一個斜線命令即可完成。
它還會鏡像複製 repo 本地的 agent 和 skill 中繼資料，讓 Codex 也能獲取與 Copilot 相同的指引。

---

## 支援工具

| 工具             | 輸出路徑                           | 格式                          |
|------------------|------------------------------------|-------------------------------|
| GitHub Copilot   | `.github/copilot-instructions.md`  | 純 Markdown                   |
| Cursor           | `.cursor/rules/base.mdc`           | Markdown + YAML frontmatter   |
| Codex CLI        | `AGENTS.md` *（無需轉換）*          | 原生格式（直接讀取）            |
| Antigravity      | `.agents/AGENTS.md`                | 純 Markdown                   |

---

## 安裝

透過以下命令將此 skill 加入你的 Claude Code 設定：

```bash
npx skills add JontCont/rules-bridge
```

---

## 使用方式

在專案根目錄開啟 Claude Code，然後執行：

```
/rules-bridge [target]
```

### 目標參數

| 參數      | 效果                                                            |
|-----------|-----------------------------------------------------------------|
| `all`     | 同步到**所有**支援的工具（省略時的預設值）                          |
| `copilot` | 寫入 `.github/copilot-instructions.md` 並鏡像複製 repo agent/skill 中繼資料 |
| `cursor`  | 寫入 `.cursor/rules/base.mdc`，包含 `.mdc` YAML frontmatter      |
| `codex`   | 驗證 `AGENTS.md` 是否存在（Codex CLI 會直接讀取）                  |
| `antigravity` | 寫入 `.agents/AGENTS.md` 並鏡像複製 repo agent/skill 中繼資料       |

### 範例

```bash
# 一次同步到所有工具
/rules-bridge
/rules-bridge all

# 僅同步到 GitHub Copilot
/rules-bridge copilot

# 僅同步到 Cursor
/rules-bridge cursor

# 檢查 Codex CLI 相容性
/rules-bridge codex

# 僅同步到 Antigravity
/rules-bridge antigravity
```

---

## 運作原理

1. **`SKILL.md`** — 宣告 Claude Code 識別的 skill 中繼資料與觸發關鍵字（支援英文與中文關鍵字）。
2. **`commands/rules-bridge.md`** — 定義 `/rules-bridge` 斜線命令，並將 `$ARGUMENTS` 傳遞給轉換腳本。
3. **`scripts/convert.sh`** — 核心邏輯：讀取 `AGENTS.md`、建立所需目錄，並寫入轉換後的檔案。它還會將 `.github/agents/` 和 `.github/skills/` 鏡像複製到 `.agents/agents/` 和 `.agents/skills/`，讓 Codex 和 Antigravity 也能使用相同的 repo 本地指引。每個步驟會顯示 `✅` 成功或 `❌` 失敗狀態。

---

## 系統需求

- 專案根目錄中需有 `AGENTS.md` 檔案。
- Bash 3.2+（與 macOS 預設 shell 及所有主要 Linux 發行版相容）。
- 支援 Agent Skills 的 Claude Code。

---

## 專案結構

```
rules-bridge/
├── SKILL.md                   # Skill 中繼資料與文件
├── commands/
│   └── rules-bridge.md        # /rules-bridge 斜線命令定義
├── scripts/
│   └── convert.sh             # 轉換邏輯（copilot / cursor / codex / antigravity / all）
├── README.md                  # 本檔案
└── LICENSE                    # MIT
```

---

## 貢獻

歡迎提交 Pull Request 和 Issue！若要進行較大的變更，請先開 Issue 討論方案。

---

## 授權條款

[MIT](LICENSE) © JontCont
