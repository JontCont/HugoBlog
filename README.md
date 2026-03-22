# 我的技術部落格

基於 [Hugo](https://gohugo.io/) 建立的個人技術部落格，涵蓋前端、後端、DevOps 等各類開發筆記。

## 技術棧

- **框架**：Hugo (Static Site Generator)
- **主題**：自訂主題 (`custom-theme`)
- **語言**：繁體中文 (`zh-TW`)

## 文章分類

| 分類 | 說明 |
|------|------|
| C# / .NET | ASP.NET Core、Entity Framework、Unit Test、NPOI 等 |
| JavaScript | Fetch、AJAX、正規表示式、非同步處理等 |
| TypeScript | 型別應用與擴充 |
| HTML / CSS | 前端基礎技術、SCSS |
| React / Angular / Vue | 前端框架實作筆記 |
| SQL Server | 資料庫操作與管理 |
| Git / GitHub | Git Flow、GitHub Actions、CI/CD |
| Docker | 容器化部署與設定 |
| Azure / Azure DevOps | 雲端服務與 DevOps 流程 |
| Playwright | 自動化測試 |
| Golang | 基礎語法與應用 |
| VBA / VB | Excel 自動化腳本 |
| 工具筆記 | VSCode、LinqPAD、Synology NAS 等 |

## 環境需求

- [Hugo](https://gohugo.io/installation/) (建議使用 Extended 版本)
- Node.js (選用，用於部分建置腳本)

## 本地開發

### 啟動開發伺服器

```bash
hugo server -D --bind 127.0.0.1 --port 1313
```

> `-D` 參數會一併載入草稿文章

開啟瀏覽器前往 [http://localhost:1313](http://localhost:1313)

### 建置靜態檔案

```bash
hugo
```

產出檔案位於 `public/` 目錄。

## 專案結構

```
HugoBlog/
├── hugo.toml           # Hugo 設定檔
├── archetypes/         # 文章範本
├── assets/             # 靜態資源 (CSS、JS)
├── content/
│   ├── posts/          # 部落格文章
│   └── page/           # 固定頁面 (about、archives 等)
├── layouts/            # 自訂版面 (覆寫主題)
├── static/             # 靜態檔案
├── themes/
│   └── custom-theme/   # 自訂主題
└── public/             # 建置輸出目錄 (自動產生)
```

## 新增文章

```bash
hugo new posts/YYYY-MM-DD-文章標題.md
```

## 設定

主要設定位於 [`hugo.toml`](hugo.toml)：

```toml
baseURL = 'http://localhost:1313/'
languageCode = 'zh-TW'
title = 'JConte'
theme = 'custom-theme'
```

> GitHub Pages 部署時會由 workflow 使用 `--baseURL` 覆蓋為線上網址，
> 本機開發保持 localhost 設定即可。

## GitHub Pages 部署

本專案使用 GitHub Actions 自動部署至 GitHub Pages。

### 一次性設定

1. 到 GitHub Repository `Settings` -> `Pages`
2. 將 `Source` 設為 `GitHub Actions`
3. 確認 [`.github/workflows/hugo.yml`](.github/workflows/hugo.yml) 已存在

### 發布流程

```bash
git push origin main
```

推送後會自動執行 Hugo build 並發布到 Pages。

### 網址

預設專案頁面網址：

`https://jontcont.github.io/HugoBlog/`
