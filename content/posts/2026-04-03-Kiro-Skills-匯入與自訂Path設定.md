+++
title = '【Kiro】- Skills 匯入與自訂 Path 設定'
date = '2026-04-03T14:30:00'
slug = 'Kiro-Skills-匯入與自訂Path設定'
description = '記錄 Kiro IDE 如何匯入 Skills，以及必須手動設定 resources 路徑才能讓 Agent 正確讀取的注意事項。'
categories = ['筆記', 'AI 助手']
tags = ['Kiro', 'Skills', 'AI IDE', 'AWS']
keywords = ['Kiro skills', 'Kiro resources', 'Kiro settings.json', 'AI IDE 設定']
image = ''
+++

## 前言

[Kiro](https://kiro.dev/) 是 AWS 推出的 AI IDE，主要聚焦在 spec-driven development（規格驅動開發），以 `specs/` 資料夾管理需求與設計文件。目前**尚未開放類似 Skills / Plugin 的社群市集**，但可以手動匯入 Skills。

比較特別的是，Kiro 匯入 Skills 之後並不會自動生效，還需要手動設定 `resources` 路徑，這篇筆記記錄完整的設定流程 🔧

> 📌 **備註**：VSCode Copilot CLI 也支援 `.agents/skills/` 路徑，但目前無法自訂，只能使用固定的 `.github/skills/` 和 `.agents/skills/`。Kiro 的優勢在於可以透過 `settings.json` 自由指定任意路徑。

---

## 一、匯入 Skills

在 Kiro IDE 的側邊欄中操作：

1. 點擊左側 **Kiro 幽靈圖示** 開啟 Kiro 面板
2. 找到 **Agent Steering & Skills** 區塊
3. 點擊 **+** → **Import a skill**
4. 選擇 **GitHub URL** 或**本機資料夾**

匯入後，Skill 會放入 `.kiro/skills/` 目錄。

---

## 二、設定 Resources 路徑（重要 ⚠️）

匯入 Skill 之後，Agent 的 `resources` 欄位**仍需手動加入對應路徑**，否則 Agent 不會讀取到 Skills。

編輯 `.kiro/settings.json`，加入 `resources` 設定：

```json
{
  "resources": [
    {
      "path": ".agents/skills"
    }
  ]
}
```

> 💡 如果你的 Skills 放在其他路徑，例如 `.kiro/skills/`，記得調整 `path` 對應的值。

---

## 三、驗證設定

設定完成後，重新啟動 Kiro 或重新載入 Agent，確認 Skills 已正確載入。

---

## 結論

Kiro 的 Skills 匯入流程本身很簡單，但最容易踩到的坑就是忘記設定 `resources` 路徑，導致 Agent 找不到 Skills。記得匯入後一定要去 `.kiro/settings.json` 補上對應的 `path`，才算真正完成設定 🎯
