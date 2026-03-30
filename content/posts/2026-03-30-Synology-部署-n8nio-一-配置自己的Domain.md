+++
title = '【Synology】部署 n8nio (一) - 配置自己的 Domain'
date = '2026-03-30T21:30:00'
slug = 'Synology-部署-n8nio-一-配置自己的Domain'
description = '記錄在 Synology NAS 部署 n8n 前，先把自己的 Domain、DNS 與子網域規劃完成，方便後續串接 Cloudflare Tunnel 或反向代理。'
categories = ['DevOps', 'Synology']
tags = ['Synology', 'n8n', 'Domain', 'DNS', 'Cloudflare']
keywords = ['Synology n8n', 'n8nio', 'Domain', 'DNS', 'Cloudflare Tunnel']
image = '/image/20260323.png'
+++

## 前言

前陣子我有整理一篇關於 `n8n` 部署的筆記，這篇則是延伸把前置作業補齊，記錄如何用接近零成本的方式，先設定一個屬於自己的 `Domain`，並交給 `Cloudflare` 代管。

目前網路上不少教學文章或影片的介面都已經偏舊，所以這篇會直接以現在的 `Cloudflare` 後台畫面與操作邏輯來說明，讓大家在正式部署 `n8n` 之前，先把 `Domain` 這件事整理好。

---

## 什麼是 Domain？
`Domain` 就是我們常說的「網域」，它是網路上用來識別一個網站或服務的名稱，類似於我們在現實生活中的地址。當我們想要訪問一個網站時，我們會輸入它的 `Domain`，例如 `www.example.com`，這樣瀏覽器就能找到對應的伺服器並顯示網站內容。

既然是資深免費仔，當然不想花錢買一個 `Domain`，所以我們可以利用一些免費的 `Domain` 服務來達成這個目的。接下來，我會介紹幾個常見的免費 `Domain` 服務，並說明如何使用它們來設定自己的 `Domain`。

### 一、[DNSHe](https://my.dnshe.com/clientarea.php)

之前我對於 Cloudflare 的印象是他會提供免費的 Domain 註冊服務，但實際上 Cloudflare 只提供 DNS 代管服務，並不提供 Domain 註冊服務。因此，我們需要先在其他地方註冊一個 Domain，然後再把它的 DNS 交給 Cloudflare 來管理。

DNSHe 是一個提供免費 Domain 註冊的服務平台，使用者可以在這裡註冊一個免費的 Domain，並且可以選擇不同的頂級域名（TLD），例如 `.com`, `.net`, `.org` 等等。註冊過程非常簡單，只需要提供一些基本的資訊，例如電子郵件地址和想要的 Domain 名稱，就可以完成註冊。


#### 1-1 設定步驟

按照以下圖檔創建一個新的 Domain。如果計畫使用 Cloudflare Tunnel，建議在此步驟直接設定好主網域，例如 `yourdomain.com`。這樣後續在 Cloudflare Tunnel 中便可創建子網域，如 `tunnel.yourdomain.com`、`api.yourdomain.com` 等，方便後續應用的部署與管理。

![](/image/202603Mo_143410.png)
![](/image/202603Mo_143851.png)
![](/image/2026-03-30_22-21-55.png)


### 二、[Cloudflare](https://dash.cloudflare.com/)

#### 2-1 取得 Domain 並設定 DNShe 的 DNS 代管

接著我們需要把剛剛在 DNSHe 註冊的 Domain 交給 Cloudflare 來管理。首先，我們需要在 Cloudflare 上創建一個帳戶，然後添加我們的 Domain。 
![](/image/202603Mo_223544.png)

從 Cloudflare 後臺取得 NS 伺服器的資訊，然後回到 DNSHe 的後台，把 DNS 伺服器的資訊更新為 Cloudflare 提供的 NS 伺服器。這樣 Cloudflare 就能夠管理我們的 Domain 的 DNS 設定了。

![](/image/202603Mo_223848.png)
![](/image/202603Mo_224254.png)

#### 2-2 驗證 DNS 設定是否生效

更新 NS 伺服器後，DNS 通常需要 24-48 小時才能完全生效（實際上通常更快）。您可以用以下方式驗證：

- **線上工具**：使用 [Google DNS Checker](https://dns.google/) 或 [WhatsMyDNS](https://www.whatsmydns.net/) 查詢你的 Domain
- **PowerShell 命令**：
  ```powershell
  nslookup yourdomain.com
  ```
- **確認結果**：應該能看到 Cloudflare 提供的 NS 伺服器資訊

#### 2-3 配置 SSL/TLS 設定 (免費方案跳過)
備註 :　在設定 domain 預設是開起來

在 Cloudflare 後台進行以下設定，確保後續服務的 HTTPS 安全性：

1. 進入 Domain 設定 > SSL/TLS
2. 選擇 **Full** 或 **Full (strict)** 模式
3. 啟用 **Always Use HTTPS**
4. 可選：啟用 **HSTS** 以強制 HTTPS

#### 2-4 在 Cloudflare 設定子網域

接下來就是設定 Cloudflare Tunnel 的步驟。注意新版介面中，Tunnel 功能位於 **Networking > Tunnels**，而不是在 **Domains** 的選項中。

![](/image/202603Mo_224613.png)

#### 2-5 建立 Cloudflare Tunnel

1. 進入 Cloudflare 後台 > **Networking > Tunnels**
2. 點擊 **Create a tunnel**
3. 選擇 **Cloudflared** 作為連接器
4. 給 Tunnel 命名（例如 `synology-nas-tunnel`）
5. Cloudflare 會產生一個唯一的 Token，**務必妥善保管**
6. 選擇作業系統和架構
7. 複製安裝命令，在 NAS 上執行

#### 2-6 設定服務與子網域映射

完成 Tunnel 連接後，在 **Public Hostnames** 標籤中設定：

- **Subdomain**：填入映射的子網域名稱（例如 `tunnel`）
- **Domain**：選擇你的主 Domain
- **Protocol**：選擇 `http`（連接到 NAS 內部服務）
- **URL**：填入 NAS 內部的 IP 和連接埠（例如 `http://192.168.1.100:5678`）

這樣在這裡我們可以創建多個子網域，例如 `tunnel.yourdomain.com`、`api.yourdomain.com` 等，每個都指向不同的內部服務。當我們訪問 `tunnel.yourdomain.com` 的時候，就會自動轉發到我們的內部服務上，進而訪問我們部署在 Synology NAS 上的 n8n 服務。

#### 2-7 Docker 部署方式（可選）

如果偏好使用 Docker Compose 部署 Tunnel，系統會自動生成設定檔。在部署時注意：

- 使用 NAS 內部的本機 IP 位址（如 `192.168.1.100`）
- 確保 Tunnel Token 正確設定在環境變數中
- Tunnel 會自動將外部請求轉發到內部服務

![](/image/202603Mo_225138.png)

---

## 常見問題排除

### Q1: Domain 無法解析？
**A:** 
1. 確認 DNSHe 已更新為 Cloudflare 的 NS 伺服器
2. 等待 24-48 小時讓 DNS 完全生效
3. 使用 `nslookup` 或線上工具驗證
4. 清除本機 DNS 快取：`ipconfig /flushdns`（Windows）

### Q2: Tunnel 連接失敗？
**A:**
1. 確認 NAS 有穩定的網路連接
2. 檢查防火牆設定是否允許出站連接
3. 驗證 Tunnel Token 是否正確
4. 查看 Cloudflare Tunnel 日誌尋找具體錯誤訊息

### Q3: 子網域無法訪問？
**A:**
1. 確認子網域已在 Cloudflare Tunnel 的 Public Hostnames 中配置
2. 檢查內部服務 IP 和連接埠是否正確
3. 驗證防火牆未阻止 NAS 上的該連接埠
4. 確認內部服務已正常運行

### Q4: HTTPS 顯示不安全警告？
**A:**
1. 確認 Cloudflare SSL/TLS 設定為 Full 模式
2. 如果使用自簽憑證，須在 Cloudflare 後台上傳憑證
3. 等待憑證生效（通常數分鐘）

---

## 完整成本總結

| 項目 | 成本 | 說明 |
|------|------|------|
| DNSHe Domain | 免費 | 支援多個免費 TLD（如 .com、.net 等） |
| Cloudflare DNS 代管 | 免費 | 包含基本 DNS、DDOS 防護、WAF |
| Cloudflare Tunnel | 免費 | 無頻寬限制，無流量費用 |
| Cloudflare SSL/TLS | 免費 | 自動簽發和續期 |
| **總成本** | **完全免費** | 零成本方案 |

---

## 後續步驟

依照本文的設定完成後，你已經擁有：
✅ 一個免費的 Domain  
✅ 免費的 DNS 代管服務  
✅ 安全的 HTTPS 連接  
✅ Cloudflare Tunnel 遠端存取能力  

接下來就可以準備在 Synology NAS 上部署 n8n 服務。在部署時，直接使用已設定的子網域（如 `tunnel.yourdomain.com`）即可訪問，無需額外的反向代理配置。



