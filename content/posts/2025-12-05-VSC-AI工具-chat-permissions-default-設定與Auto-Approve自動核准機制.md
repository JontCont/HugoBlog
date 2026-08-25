+++
image = '/image/20251205_vscode_permissions_cover.jpg'
title = '【工具】VS Code / AI Agent 權限配置指南：chat.permissions.default 設定與 Auto Approve 自動核准機制'
date = '2025-12-05T10:00:00'
slug = 'VSC-AI工具-chat-permissions-default-設定與Auto-Approve自動核准機制'
description = '解析 VS Code、Copilot Agent 與 Antigravity 工具中的 chat.permissions.default 設定，說明如何啟用 Auto Approve 自動核准機制以提升 AI 自動化開發效率與安全性控管。'
categories = ['開發工具', 'VSCode']
tags = ['VSCode', 'Copilot', 'Antigravity', 'AI', 'AutoApprove', '工具筆記']
keywords = ['chat.permissions.default', 'Auto Approved', 'AI Agent', 'VSCode', 'Copilot']
+++

## 前言

隨著 AI Agent（如 GitHub Copilot Agent Mode、VS Code Chat、Antigravity CLI 等）從傳統的程式碼自動補全演進為能**自主執行指令、讀寫檔案與呼叫 MCP 工具**的開發助手，使用者每次授權工具執行的提示彈窗（Prompt Modal）往往會成為長任務或自動化批次處理的瓶頸。

為了平衡「開發效率」與「操作授權」，許多 IDE 與 AI Agent 工具提供了 `chat.permissions.default`（或對應的權限預設值設定），允許開發者配置 **Auto Approved（自動核准）** 機制。

本篇將深入介紹 `chat.permissions.default` 設定的作用、配置方式以及安全注意事項。

### 參考文件
- [VS Code Official Docs — Agent Approvals and Permission Levels](https://code.visualstudio.com/docs/agents/approvals#_permission-levels)

---

## 一、 什麼是 `chat.permissions.default`？

`chat.permissions.default` 是用於控制 AI Agent 在發起工具呼叫 (Tool Calls) 時的**預設權限行為**設定。

當 AI 助手試圖執行以下操作時：
- 執行終端機命令 (Terminal Command Execution)
- 讀取或修改專案檔案 (File Read / Write)
- 呼叫外部 API 或 MCP 服務 (Model Context Protocol)

工具會根據 `chat.permissions.default` 的值決定是**直接自動執行**，還是**停下來等待使用者人工點擊核准**。

---

## 二、 為什麼需要啟用 Auto Approved（自動核准）？

在沒有啟用 Auto Approved 的情況下，AI Agent 執行一個複雜的重構任務（例如批次修改 20 個檔案並跑單元測試），開發者可能需要手動點擊 20~30 次「Approve / 同意」按鈕，這會產生以下問題：

1. **阻礙全自動化/夜間任務**：無法放手讓 AI Agent 自主執行背景任務（例如下發 `/goal` 命令後離席）。
2. **中斷開發心流 (Flow State)**：頻繁的彈窗打斷思考。
3. **核准疲勞 (Approval Fatigue)**：因彈窗過多，開發者容易不假思索地全部點擊同意，反而失去了安全審查的初衷。

啟用 **Auto Approved** 後，只要符合安全邊界，AI Agent 即可流暢地連貫完成任務。

---

## 三、 `chat.permissions.default` 的常見設定值解析

在 `settings.json` 或 AI 工具設定檔中，`chat.permissions.default` 通常支援以下配置選項：

| 設定值 (Value) | 說明 (Description) | 適用場景 |
| :--- | :--- | :--- |
| **`auto-approve` / `allow`** | **自動核准 (Auto Approved)**：預設授權工具自動執行，不再跳出二次確認彈窗。 | 信任的本機專案、容器沙盒環境、長任務自動化。 |
| **`prompt` / `ask`** *(預設值)* | **每次提示**：遇到敏感操作或未預先授權的命令時，強制彈出確認視窗。 | 日常開發、存取不熟悉的第三方程式庫時。 |
| **`deny` / `block`** | **預設拒絕**：禁止 AI 自動執行任何命令或檔案修改。 | 高敏感度環境、唯讀稽核場景。 |

---

## 四、 如何配置 `chat.permissions.default`？

### 1. 在 VS Code `settings.json` 中配置

開啟 VS Code 設定檔 (`ctrl + shift + p` $\rightarrow$ `Open User Settings (JSON)`)，加入以下設定：

```json
{
  // 啟用 AI Chat / Agent 工具的自動核准預設值
  "chat.permissions.default": "auto-approve",

  // 亦可針對特定工具型別獨立設定
  "chat.permissions.tools": {
    "read_file": "auto-approve",
    "write_file": "auto-approve",
    "run_command": "prompt" // 終端機命令可維持提示以確保安全
  }
}
```

### 2. 在 Antigravity / AI Agent CLI 中配置

若使用 CLI 工具或 MCP 環境，亦可透過 `ask_permission` 或配置檔將指定的 Action 設為自動允許：

```json
{
  "permissions": {
    "command": "git",
    "read_file": "/path/to/project",
    "write_file": "/path/to/project"
  }
}
```

---

## 五、 安全注意事項與最佳做法 (Security Best Practices)

啟用 Auto Approved 雖然能極大化開發效率，但也伴隨著一定程度的安全風險（例如 Prompt Injection 攻擊或誤刪檔案）。建議遵循以下最佳做法：

1. **搭配 Docker / 沙盒環境使用**：在隔離的 DevContainer 或 Docker 中啟用 Auto Approved，即使 AI 執行了破壞性指令也不會影響宿主機。
2. **最小權限原則 (Narrow Scope)**：僅針對當前工作區 (Workspace) 開放 `write_file` 權限，避免開放全域根目錄。
3. **終端機命令保護**：建議將檔案讀寫設為 `auto-approve`，但涉及破壞性系統命令（如 `rm -rf`、刪除資料庫等）仍維持 `prompt` 確認。
4. **版本控制防護**：在讓 AI 進行 Auto Approved 批次修改前，確保當前 Git Working Tree 是乾淨的 (Clean Commit)，隨時可以透過 `git reset --hard` 還原。

---

## 六、 結論

`chat.permissions.default` 設為 `auto-approve` 是解放 AI Agent 完全自主開發能力的金鑰。合理運用自動核准機制，能讓 AI 從「需要打一下動一下的助手」真正升級為「能獨立完成長任務的 Pair Programmer」！
