+++
title = '【AI工具】- agent-chat：基於 FastAPI 的非同步多代理人即時聊天平台'
date = '2026-06-28'
slug = 'agent-chat-introduction'
description = '探索 agent-chat 如何透過非同步訊息機制與中介軟體模式，提供多使用者共享 AI 代理人聊天室與靈活的插件擴展能力。'
categories = ['AI工具', '開發工具']
tags = ['agent-chat', 'FastAPI', 'AI-Agent', '即時聊天', '非同步']
keywords = ['agent-chat', 'FastAPI', 'AI 聊天室', '非同步通訊']
image = '/image/agent_chat_cover.png'
+++

## 前言

傳統的 AI 聊天應用（如普通的 Chatbot 介面）大多採用「要求-回應（Request-Response）」的同步模式——使用者發送訊息，接著網頁轉圈圈等待 AI API 呼叫完畢後才顯示回覆。然而，在真實的 **AI Agent（智慧代理人）** 場景中，一個任務可能需要花費數分鐘去執行工具、搜索網頁、甚至與其他子代理人（Subagents）進行多輪溝通。

如果繼續沿用傳統的同步模式，使用者體驗將會非常糟糕。

為了解決這個問題，開源專案 **[agent-chat](https://github.com/JontCont/agent-chat)** 提供了一個嶄新的設計思路：一個專為 AI Agent 打造的 **「非同步（Asynchronous）多代理人即時聊天平台」**！

---

## 一、什麼是 agent-chat？

`agent-chat` 是一個基於 Python FastAPI 與 WebSockets 構建的開源即時聊天專案。它的核心目標在於實現 **「非同步訊息傳遞與多代理人中介（Agent-Environment Middleware）」**。

在這個平台上，使用者與 AI 代理人的互動就像在使用 Slack 或 Discord 一樣：你可以發送一條指令，AI 隨即在後台開始工作，而你不需要在頁面上卡死等待。當 AI 完成網頁搜索、資料庫查詢或與其他代理人溝通後，會主動透過 WebSocket 將進度與最終回覆即時推送到你的對話視窗中。

---

## 二、agent-chat 的三大核心特色

`agent-chat` 的架構設計極其先進，具備以下幾大亮點：

### 1. 真正的非同步訊息流 (True Async Messaging)
- 採用 Message Queue 與 WebSocket 技術，傳送訊息後立即可做其他操作，AI 會以串流（Streaming）或非同步事件（Event-driven）回傳執行狀態與進度。

### 2. 多人共享聊天室 (Shared Rooms)
- 支援多個使用者或多個 AI 代理人加入同一個房間（Room）。大家可以協同對同一個 AI Agent 下指令，觀察 AI 的推導過程，甚至讓多個 AI Agent 在同一個聊天室中相互交談（Multi-Agent Collaboration）。

### 3. 可插拔的代理人技能插件 (Composable Plugins)
- 內建豐富的工具整合：
  - **Google Search 插件**：讓 AI 實時聯網搜尋。
  - **WebSocket UI 插件**：動態更新執行進度條。
  - **Subagent 傳播插件**：允許一個主代理人在對話中動態生成並指派任務給子代理人。

---

## 三、技術架構

`agent-chat` 採用了非常現代且高效的技術棧：

- **後端 (Backend)**: Python, FastAPI (提供高性能 Web API 與 Websocket 連線), Asyncio (處理非同步任務)。
- **前端 (Frontend)**: Modern HTML/JS + Tailwind CSS (提供極致流暢、美觀的聊天介面與動態微動畫)。
- **通訊 (Communication)**: WebSockets (提供雙向即時事件通訊)。

---

## 四、如何快速部署？

要快速啟動一個本地的 `agent-chat` 服務，只需以下幾個簡單步驟：

```bash
# 1. 複製專案
git clone https://github.com/JontCont/agent-chat.git
cd agent-chat

# 2. 安裝依賴
pip install -r requirements.txt

# 3. 設定環境變數 (填入你的 LLM API Key)
export OPENAI_API_KEY="your-key-here"

# 4. 啟動 FastAPI 伺服器
uvicorn main:app --reload
```

服務啟動後，直接瀏覽 `http://localhost:8000` 即可開啟精美的多人 AI 聊天室，體驗真正的非同步人機協作！

---

## 五、結語

隨著 AI 任務複雜度的提升，非同步與多人協作將成為 AI Chat UI 的必然趨勢。`agent-chat` 不僅僅是一個聊天展示，更是一個實現複雜 AI Agent 工作流的架構示範。

如果你也想為你的 AI 代理人建立一個即時、流暢且具備插件能力的對話平台，歡迎前往 **[agent-chat GitHub 專案庫](https://github.com/JontCont/agent-chat)** 探索、提交 PR 或是點個 Star 支援我們！
