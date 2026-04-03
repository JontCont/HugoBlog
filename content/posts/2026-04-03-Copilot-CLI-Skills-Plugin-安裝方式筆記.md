+++
title = '【Copilot CLI】- Skills / Plugin 安裝方式筆記'
date = '2026-04-03T14:00:00'
slug = 'Copilot-CLI-Skills-Plugin-安裝方式筆記'
description = '整理 GitHub Copilot CLI 中 Skills 與 Plugin 的安裝、管理指令，以及實際使用方式。'
categories = ['筆記', 'AI 助手']
tags = ['Copilot CLI', 'Skills', 'Plugin', 'AI', '開發工具']
keywords = ['Copilot CLI', 'Skills', 'Plugin', 'Marketplace']
image = ''
+++

## 前言

Skills 其實已經紅了一段時間，但之前一直沒去碰——主要是覺得它的功能跟 GitHub 內建的 instruction 規則太像了，感覺沒什麼必要額外設定。直到最近發現 Skills 可以呼叫 `.py` 檔案，才意識到它已經進化得比想像中更全面，不再只是單純的提示詞規則，而是能真正串接工具與自動化流程。

這篇筆記整理了 Skills 與 Plugin 的安裝、管理指令，方便日後快速查閱 📝

---

## 一、Skills（技能）

Skills 是 Copilot CLI 的技能模組，讓 Agent 具備特定領域的能力。

### 1. 存放位置

Skills 必須放在專案的 `.github/skills/` 目錄下：

```
your-project/
└── .github/
    └── skills/
        └── your-skill-name/
```

### 2. 常用指令

| 指令 | 說明 |
|------|------|
| `/skills list` | 列出所有已安裝的 Skills |
| `/skills info NAME` | 查看特定 Skill 的詳細資訊 |

### 3. 安裝 Skill

透過 `npx` 從 GitHub 安裝：

```bash
npx skills add https://github.com/github/awesome-copilot --skill <SKILL_NAME>
```

安裝完成後，Skill 會存放在 `.agents/skills/` 目錄下。

### 4. 已安裝的 Skills 範例

| Skill | 說明 | 安全評估 |
|-------|------|---------|
| `playwright-generate-test` | 自動產生 Playwright 測試 | Safe / 0 alerts / Low Risk |
| `playwright-explore-website` | 探索網站結構與元素 | Safe / 0 alerts / Med Risk |

---

## 二、Plugin（插件）

Plugin 是另一種擴展機制，透過 Marketplace 進行管理。

### 1. 常用指令

| 指令 | 說明 |
|------|------|
| `copilot plugin marketplace list` | 列出 Marketplace 中的插件 |
| `copilot plugin marketplace add OWNER/REPO` | 安裝插件 |
| `copilot plugin marketplace browse copilot-plugins` | 瀏覽官方插件 |
| `copilot plugin marketplace browse awesome-copilot` | 瀏覽社群插件 |
| `copilot plugin marketplace remove NAME` | 移除插件 |

### 2. Marketplace 網站

以下是可以瀏覽與下載 Skills 的 Marketplace 網站，支援透過 CLI 指令直接安裝：

- [GitHub - awesome-copilot](https://awesome-copilot.github.com/) — GitHub 的 Skills Marketplace，收錄社群開發的 Copilot Skills
- [Claude - Marketplaces](https://claudemarketplaces.com/marketplaces) — Claude 的 Skills Marketplace，收錄適用於 Claude Agent 的 Skills

> 兩個網站都可以直接在頁面上找到 CLI 下載指令，複製貼上即可安裝。

---

## 結論

Copilot CLI 的 Skills 和 Plugin 讓 Agent 不再只是文字對話，而是能夠實際串接工具與自動化流程。透過 CLI 指令或 Marketplace 網站都能快速安裝，上手門檻不高。

下一篇會用 Playwright Skills 做實際範例，展示 Agent 如何透過 MCP 操作瀏覽器、自動產生測試 🚀
