---
name: git
description: Describe what this skill does and when to use it. Include keywords that help agents identify relevant tasks.
---

# Skill: Git Commit 規範（部落格專用）

## 說明

定義本部落格 `HugoBlog` 的 Git 操作規範，確保每次 commit 訊息清楚描述變更內容。
遵循 [Conventional Commits](https://www.conventionalcommits.org/) 精神，並針對部落格情境客製化 type 清單。

---

## Commit 訊息格式

```
<type>(<scope>): <subject>
```

- **type**：變更類型（見下表）
- **scope**：影響範圍（可省略），通常是文章分類或功能模組
- **subject**：簡短描述，使用**繁體中文**，動詞開頭，不加句號

### 範例

```
post(C#): 新增 SignalR 使用方式文章
post(Git): 更新 Git Flow 文章內容
fix(theme): 修正手機版排版跑版問題
chore: 更新 hugo.toml baseURL
docs: 更新 README 本地開發說明
```

---

## Type 定義

| Type | 說明 | 適用情境 |
|------|------|----------|
| `post` | 新增或更新文章內容 | 新增 / 修改 `content/posts/` 下的 `.md` 文章 |
| `page` | 新增或更新靜態頁面 | 修改 `content/page/` 下的頁面（about、links 等） |
| `theme` | 主題樣式或版面調整 | 修改 `themes/custom-theme/` 下的任何檔案 |
| `layout` | 自訂版面調整 | 修改根目錄 `layouts/` 下的模板 |
| `fix` | 修正錯誤 | 修正文章內容錯誤、排版問題、連結失效 |
| `chore` | 設定或維護工作 | 修改 `hugo.toml`、`archetypes/`、`static/` 等 |
| `ci` | CI/CD 流程調整 | 修改 GitHub Actions workflow 檔案 |
| `docs` | 說明文件更新 | 修改 `README.md`、`.github/` 下的文件 |
| `assets` | 靜態資源新增或修改 | 新增圖片、CSS、JS 等 `assets/` 或 `static/` 資源 |

---

## Scope 參考值

scope 對應文章分類或功能範圍，常用值如下：

| Scope | 說明 |
|-------|------|
| `C#` | C# / .NET 相關文章 |
| `JS` | JavaScript 相關文章 |
| `TS` | TypeScript 相關文章 |
| `CSS` | CSS / SCSS 相關文章 |
| `HTML` | HTML 相關文章 |
| `SQL` | SQL Server 相關文章 |
| `Git` | Git / GitHub 相關文章 |
| `Docker` | Docker 相關文章 |
| `Azure` | Azure / Azure DevOps 相關文章 |
| `React` | React 相關文章 |
| `Angular` | Angular 相關文章 |
| `Playwright` | Playwright 相關文章 |
| `Golang` | Go 相關文章 |
| `note` | 工具筆記 / 雜記類 |
| `theme` | 主題模組 |

---

## 操作流程

### 新增一篇文章

```bash
# 1. 建立文章檔案
hugo new posts/YYYY-MM-DD-分類-主題.md

# 2. 撰寫完成後加入暫存
git add content/posts/YYYY-MM-DD-分類-主題.md

# 3. 若有同步新增封面圖片
git add static/image/

# 4. Commit
git commit -m "post(分類): 新增 XXX 文章"
```

### 更新已有文章

```bash
git add content/posts/<檔名>.md
git commit -m "post(分類): 更新 XXX 文章 - <說明修改了什麼>"
```

### 主題 / 版面調整

```bash
git add themes/custom-theme/
git commit -m "theme: <說明調整內容>"
```

### 發布（推上 GitHub）

```bash
git push origin main
```

---

## Commit 品質檢查

提交前確認：

- [ ] type 選擇正確，與實際變更一致
- [ ] subject 簡短清楚，中文描述，**動詞開頭**（新增、更新、修正、刪除、調整）
- [ ] 一個 commit 只做一件事，不要混合文章新增 + 主題修改
- [ ] 圖片等附屬資源與文章一起 commit，不要分開

---

## 不好的 commit 範例 ❌

```
update
fix bug
新增文章
test
asdfgh
```

## 好的 commit 範例 ✅

```
post(Docker): 新增 Docker 基本使用方式文章
fix(C#): 修正 NPOI 文章中程式碼排版錯誤
theme: 調整手機版導覽列樣式
chore: 更新 hugo.toml title 設定
assets: 新增 Playwright 系列文章封面圖
ci: 更新 GitHub Actions 發布至 gh-pages 流程
```
