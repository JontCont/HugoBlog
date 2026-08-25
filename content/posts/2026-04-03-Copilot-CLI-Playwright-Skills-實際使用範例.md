+++
title = '【Copilot CLI】- Playwright Skills 實際使用範例'
date = '2026-04-03T14:30:00'
slug = 'Copilot-CLI-Playwright-Skills-實際使用範例'
description = '透過 Playwright Skills 搭配 MCP Server，讓 Copilot Agent 實際操作瀏覽器、自動產生與探索測試。'
categories = ['筆記', 'AI 助手']
tags = ['Copilot CLI', 'Skills', 'Playwright', 'MCP', '自動化測試']
keywords = ['Copilot CLI', 'Playwright', 'MCP Server', 'Skills', '自動化測試']
image = ''
+++

## 前言

上一篇整理了 Skills 和 Plugin 的安裝方式，這篇接著用 **Playwright Skills** 做實際範例，展示 Agent 如何透過 MCP 操作瀏覽器、自動產生測試程式碼 🎯

> 前篇：[Skills / Plugin 安裝方式筆記](/2026/04/03/Copilot-CLI-Skills-Plugin-安裝方式筆記/)

---

## 一、前置準備

這些 Skills 需要搭配 **Playwright MCP Server** 使用，Agent 會透過 MCP 工具與瀏覽器互動。

### 已安裝的 Playwright Skills

| Skill | 說明 | 安全評估 |
|-------|------|---------|
| `playwright-generate-test` | 自動產生 Playwright 測試 | Safe / 0 alerts / Low Risk |
| `playwright-explore-website` | 探索網站結構與元素 | Safe / 0 alerts / Med Risk |

---

## 二、playwright-generate-test（自動產生測試）

**用途**：根據描述的測試情境，自動產生 Playwright 測試程式碼。

### 使用方式

在 Agent 對話中描述測試情境即可：

```
幫我產生一個測試：
打開 http://localhost:2001/website/index.html，
在使用者名稱欄位輸入 "Hello"，
點擊 Alert 測試按鈕，
驗證 alert 訊息內容為 "哈囉，Hello！這是一個 Alert 測試 🎉"
```

### 執行流程

1. Agent 根據情境，透過 Playwright MCP 實際操作瀏覽器
2. 逐步執行每個操作並記錄互動過程
3. 完成後產生 TypeScript 測試檔案並存入 `tests/` 目錄
4. 自動執行測試，若失敗會反覆修正直到通過

---

## 三、playwright-explore-website（探索網站）

**用途**：自動探索網站，辨識核心功能與 UI 元素，並提出測試建議。

### 使用方式

在 Agent 對話中提供網址即可：

```
幫我探索 http://localhost:2001/website/life-cycle.html
```

### 執行流程

1. Agent 透過 Playwright MCP 導航到指定 URL
2. 自動辨識並互動 3–5 個核心功能或使用者流程
3. 記錄 UI 元素的 locator 與預期結果
4. 關閉瀏覽器，提供探索摘要
5. 根據探索結果提出測試案例建議

---

## 結論

Playwright Skills 讓測試自動化變得非常直覺——只要用自然語言描述情境，Agent 就會自己操作瀏覽器、產生測試、驗證結果。搭配 explore 功能還能快速了解不熟悉的網站結構，省去手動探索的時間 🚀
