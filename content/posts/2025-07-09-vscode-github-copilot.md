+++
title = 'VSCode 使用 GitHub Copilot - Prompt / instrucion'
date = '2025-08-09T13:30:00'
slug = 'vscode-github-copilot'
url = '/2025/07/09/vscode-github-copilot/'
description = ''
categories = ['工具教學', 'AI 助手']
tags = ['VSCode', 'Copilot', 'AI', '開發工具']
keywords = []
image = '/image/20250810_08-17-43.png'
+++

在這篇文章中，將完整介紹如何在 VSCode 中安裝、啟用與善用 GitHub Copilot，讓你的程式開發事半功倍！🚀

## 什麼是 GitHub Copilot？

GitHub Copilot 是由 OpenAI 與 GitHub 共同開發的 AI 程式碼助手。它能根據你的輸入自動補全程式碼、產生函式、甚至協助解釋程式邏輯，支援多種語言與框架，是現代開發者不可或缺的利器。

## 安裝與啟用步驟

1. 開啟 VSCode，進入「擴充套件市集」。
2. 搜尋並安裝「GitHub Copilot」擴充套件。
3. 安裝完成後，登入你的 GitHub 帳號並啟用 Copilot 功能。
4. 若首次使用，請確認已訂閱 Copilot 服務。

## 使用技巧與建議

- **即時建議**：在撰寫程式時，Copilot 會自動給出建議，按下 `Tab` 鍵即可快速套用。
- **自然語言描述**：可用註解（如英文或中文）描述需求，Copilot 會嘗試產生對應程式碼。
- **多語言支援**：支援 Python、JavaScript、TypeScript、Go、Ruby、C# 等多種語言。
- **框架整合**：適用於主流框架如 React、Vue、Django 等。

## 常見問題與排解

- **無法啟用 Copilot？**
  - 請確認已登入正確的 GitHub 帳號，且帳號有 Copilot 訂閱權限。
  - 若遇到授權問題，可嘗試重新登入或檢查網路連線。
- **建議不準確？**
  - 嘗試用更明確的註解描述需求，或多給幾個範例。
- **安全性疑慮？**
  - Copilot 產生的程式碼建議仍需自行審查，避免直接用於生產環境。

---


## 一、Visual Studio Code 設定 prompt / instrucion

VSCode 已經出一段時間有關 prompt 功能，如果使用在全部專案中，會特別寫 ``` .github/copilot-instructions.md ``` 檔案，這樣就可以在所有專案中使用。

### 1-1 自訂 commit prompt

在專案根目錄下建立 `commit-instructions.md` 檔案，並加入你想要設定怎樣規範的 commit 訊息。

```markdown
# Commit 訊息規範

請遵循以下規範撰寫 commit 訊息：

1. 標題行應簡潔明瞭，限制在 50 個字元以內。
2. 使用祈使句，開頭字母大寫，例如：`Add feature`、`Fix bug`。
3. 如果有需要，請在標題下方添加詳細描述，說明變更的原因和背景。

```

設定內容後， 需要前往 ```settings.json``` 檔案中，加入以下設定: 

```json
{
    "github.copilot.chat.commitMessageGeneration.instructions": [
        {
            "file": "commit-instructions.md"
        }
    ]
}
```

### 1-2 自訂 prompt

點擊 copilot 圖示 > 齒輪後，可以看到 prompt 設定選項，這裡可以自訂 prompt 的內容。

![](/image/20250809_17-44-53.png)

#### 自訂 prompt 範例
當你想要 Copilot 協助撰寫 REST API 時，可以在 prompt 中加入以下內容：

```

---
mode : agent
---

請協助我撰寫一個簡單的 REST API

```

接下來，在輸入時候僅需要 ```/{檔名}```，Copilot 就會根據這個 prompt 來生成相關的程式碼。

![](/image/20250809_18-41-22.png)


### 1-3 使用 instruction

instruction 不會跟 prompt 呼叫方式一樣，他是透過 PATH 來指定 Target。例如 : `/api/users` 定義裡面的定義，只要輸入你想做的事情他就會參考相關的 instruction 來生成程式碼。

#### 使用範例

這裡使用 create blog post 的指令，接下來只需要說你要創建 Blog Post 他就會參考相關的 instruction 來生成程式碼。

```md
---
applyTo: '**/_posts/**'
---

# Create a new blog post
To create a new blog post, follow these steps:
1. **Create a new file**: In the `_posts` directory, create a new file with the format `YYYY-MM-DD-title.md`, where `YYYY-MM-DD` is the date of the post and `title` is a descriptive title for your post.
2. **Add front matter**: At the top of your new file, include the following front matter:
   ```yaml
   ---
   layout: post
   title: "Your Post Title"
   date: YYYY-MM-DD HH:MM:SS +0000
   categories: [category1, category2]
   tags: [tag1, tag2]
   ---
    ```

3. **Write your content**: Below the front matter, write your blog post content in Markdown format. You can include headings, lists, images, and links as needed.
4. **Preview your post**: If you're using a local development environment, run your site
    to preview your post. Make sure everything looks good and is formatted correctly.
5. **Commit your changes**: Once you're satisfied with your post, commit the new file to your repository with a descriptive commit message.
6. **Push your changes**: Push your changes to the remote repository to make your post live.
7. **Share your post**: After pushing, share the link to your new blog post
    on social media or with your audience to let them know about your new content.
8. **Update the index**: If your site has an index page or a list of recent posts, make sure to update it to include your new post.
9. **Check for errors**: After your post is live, check for any formatting issues or errors. If you find any, edit the post and push the changes again.
10. **Engage with readers**: After publishing, monitor comments or feedback on your post and engage with your readers to foster community interaction.

Remember to follow any additional guidelines or style conventions your blog may have. Happy blogging!
```

---


## 結論 

透過 GitHub Copilot 的強大功能，開發者可以更快速地撰寫程式碼、生成文檔，甚至進行測試。善用 prompt 和 instruction 的設定，可以讓 Copilot 更加貼合你的需求，提升開發效率。希望這篇文章能幫助你更好地理解和使用 GitHub Copilot，讓你的開發工作更加輕鬆愉快！