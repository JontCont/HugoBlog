+++
title = '【Synology】NAS 部署 n8n + Cloudflare Tunnel 完整實作紀錄'
date = '2026-03-21T20:00:00'
slug = 'Synology-NAS-部署-n8n-Cloudflare-Tunnel-完整實作紀錄'
description = '記錄如何在 Synology NAS 上使用 Docker 部署 n8n，並透過 Cloudflare Tunnel 對外提供 HTTPS 服務。'
categories = ['DevOps', 'Synology']
tags = ['Synology', 'Docker', 'n8n', 'Cloudflare Tunnel']
keywords = ['Synology NAS', 'n8n', 'Cloudflare Tunnel', 'Docker']
image = 'https://www.docker.com/wp-content/uploads/2021/09/Moby-run.png'
+++

## 前言

這篇主要是記錄我在 `Synology NAS` 上部署 `n8n`，再搭配 `Cloudflare Tunnel` 對外開放的完整流程。

這套做法很適合家用 NAS 或沒有公網 IP 的環境，因為整個過程不需要開 Router Port，也能直接取得 HTTPS。

最終實際可用網址如下：

- `https://n8n-demo.example.com`

文件建立日期與實作環境如下：

- 文件建立日期：`2026-03-21`
- 實作環境：`Synology NAS + Docker + DNSHe 免費網域 + Cloudflare`
- 最終成果：`https://n8n-demo.example.com`

---

## 一、架構總覽

整體架構如下：

```text
外部使用者（瀏覽器）
    ↓ HTTPS
https://n8n-demo.example.com
    ↓ Cloudflare CDN + SSL（自動憑證）
Cloudflare Tunnel（cloudflared 容器）
    ↓ Docker 內網
n8n 容器（port 5678）
    ↓
Synology NAS 本機儲存
```

這套架構的核心優勢：

- ✅ 零成本（免費網域 + Cloudflare 免費方案）
- ✅ 無需開放任何 Router Port
- ✅ 自動 HTTPS / SSL 憑證
- ✅ 支援 CGNAT / 無公網 IP 環境
- ✅ 真實 IP 不對外暴露

---

## 二、前置準備

開始前先準備以下項目：

| 項目 | 說明 |
|------|------|
| Synology NAS | 已安裝 `Container Manager`（Docker） |
| DNSHe 帳號 | 用來申請免費網域 |
| Cloudflare 帳號 | 免費方案即可 |
| 免費網域 | 例如：`example.com` |

如果這幾項都準備好了，就可以開始往下做。

---

## 三、步驟一：取得 DNSHe 免費網域

1. 前往 [DNSHe](https://www.dns.he.net/) 註冊帳號。
2. 申請免費子網域，例如：`example.com`。
3. 先把 DNSHe 預設提供的 `Nameserver` 記下來，後面會用到。

> 注意：2026 年 1 月後申請的網域，需要每 180 天手動續期一次，建議直接在行事曆設提醒。

---

## 四、步驟二：將網域接管至 Cloudflare

### 4.1 在 Cloudflare 新增網域

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 點選 `Add a Site`
3. 輸入你的網域，例如：`example.com`
4. 選擇 `Free` 方案
5. Cloudflare 會提供兩組新的 NS 位址，例如：

```text
danica.ns.cloudflare.com
rustam.ns.cloudflare.com
```

### 4.2 在 DNSHe 更新 Nameserver

1. 登入 DNSHe 後台
2. 找到 `example.com` 的 `NS` 設定
3. 將原本的 NS 改成 Cloudflare 提供的兩組位址
4. 儲存後等待 DNS 傳播

> DNS 傳播最長可能需要 48 小時，這段時間 Cloudflare 有可能還是顯示 `Pending`。

### 4.3 驗證 NS 委派是否成功

可以在本機執行以下指令：

```console
nslookup -type=NS example.com
```

預期會看到類似結果：

```text
example.com nameserver = danica.ns.cloudflare.com
example.com nameserver = rustam.ns.cloudflare.com
```

> 出現「未經授權的回答」通常是正常現象，代表查詢結果來自本機 DNS 快取，重點是 NS 內容是否正確。

### 4.4 確認 Cloudflare 網域狀態

回到 Cloudflare Dashboard，如果網域顯示 `Active`，就代表接管完成。

---

## 五、步驟三：部署 n8n（Docker Compose）

接下來在 Synology NAS 建立 `docker-compose.yml`。

```yaml
version: "3"

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - GENERIC_TIMEZONE=Asia/Taipei
      - WEBHOOK_URL=https://n8n-demo.example.com/
    volumes:
      - ./n8n_data:/home/node/.n8n
    networks:
      - n8n_net

  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: always
    command: tunnel --no-autoupdate run --token <YOUR_TUNNEL_TOKEN>
    network_mode: host

networks:
  n8n_net:
    driver: bridge

volumes:
  n8n_data:
```

幾個關鍵點要特別注意：

1. `cloudflared` 使用 `network_mode: host`，直接走 NAS 主機網路，不需要與 n8n 放在同一個 Docker Network。
2. `WEBHOOK_URL` 一定要填公開網址，不然後續 webhook 很容易有問題。
3. n8n 的資料建議掛載到 `./n8n_data`，避免容器重建後資料遺失。

啟動方式：

```console
docker compose up -d
```

> 重要：`cloudflared` 使用 `network_mode: host`，代表它跑在 NAS 主機的網路層，因此連接 n8n 時要用 `localhost:5678`（NAS 主機視角），而非容器名稱。

---

## 六、步驟四：建立 Cloudflare Tunnel

### 6.1 建立 Tunnel

1. 登入 Cloudflare Dashboard
2. 前往 `Zero Trust`
3. 點進 `Networks` → `Tunnels`
4. 點選 `Create a tunnel`
5. 選擇 `Cloudflared`
6. 輸入 Tunnel 名稱，例如：`synology-n8n`
7. 複製產生的 Token，貼回 `docker-compose.yml` 的 `<YOUR_TUNNEL_TOKEN>`

### 6.2 設定 Public Hostname

在 Tunnel 設定頁面中新增 Public Hostname：

| 欄位 | 填入值 |
|------|--------|
| Subdomain | `n8n-demo` |
| Domain | `example.com` |
| Service Type | `HTTP` |
| URL | `localhost:5678` |

> ⚠️ 這裡最容易填錯的是 Service URL。因為 `cloudflared` 使用 `network_mode: host`，它直接看到 NAS 主機的網路，所以要填 `localhost:5678`，不要填容器名稱 `n8n:5678`。

`n8n` 容器有對外 expose `5678` port（`ports: - "5678:5678"`），所以 host 網路的 `localhost:5678` 就能正確打到 n8n。

---

## 七、步驟五：驗證 DNS 記錄

Tunnel 建好之後，Cloudflare 通常會自動建立一筆 `CNAME`：

| 類型 | 名稱 | 內容 | Proxy 狀態 |
|------|------|------|------------|
| CNAME | `n8nio` | `<TunnelID>.cfargotunnel.com` | `Proxied` |

這邊一定要確認是橘色雲朵，也就是 `Proxied`。

> ⚠️ 如果誤設成灰色雲朵 `DNS Only`，流量不會正確走 Cloudflare Tunnel。

---

## 八、步驟六：最終驗證

### 8.1 DNS 解析驗證

```console
nslookup n8n-demo.example.com
```

實際成功結果如下：

```text
名稱:    n8n-demo.example.com
Addresses:  2001:db8::10
            2001:db8::20
            203.0.113.10
            203.0.113.20
```

如果回傳的是 Cloudflare IP，代表 DNS 導向基本上沒有問題。

### 8.2 容器狀態確認

```console
docker logs cloudflared
```

如果看到類似以下訊息，通常就代表 Tunnel 已成功建立連線：

```text
Connection established connIndex=0
```

### 8.3 瀏覽器存取測試

最後直接在瀏覽器打開：

```text
https://n8n-demo.example.com
```

如果能順利看到 `n8n` 的登入畫面，就代表整套架構完成了。🎉

---

## 九、常見問題排查

| 症狀 | 可能原因 | 解決方式 |
|------|----------|----------|
| `NXDOMAIN` | NS 尚未指向 Cloudflare | 回 DNSHe 檢查 NS 設定 |
| `Timeout` | 本機 DNS / 網路問題 | 用 DNSChecker 等工具交叉確認 |
| 網站無法連線 | CNAME 被設成 `DNS Only` | 改成 `Proxied` |
| Webhook URL 異常 | 未設定 `WEBHOOK_URL` | 在 Compose 補上環境變數 |
| cloudflared 無法連 n8n | `network_mode` 設定錯誤 | 確認 `cloudflared` 使用 `network_mode: host`，且 Service URL 填 `localhost:5678` |
| Cloudflare 顯示 `Pending` | NS 尚未傳播完成 | 等待最長 48 小時 |

這裡我自己最有感的兩個坑：

1. `Service URL` 一定要寫 `localhost:5678`（因為 `cloudflared` 用 `network_mode: host`）
2. DNS 一定要是橘色雲朵 `Proxied`

這兩個地方只要有一個錯，通常就會卡很久。

---

## 十、後續維護建議

### 10.1 定期備份 n8n 資料

```console
# 備份 n8n 資料
cp -r ./n8n_data ./n8n_data_backup_$(date +%Y%m%d)
```

### 10.2 DNSHe 網域續期提醒

- DNSHe 免費網域需要每 180 天手動續期一次
- 建議直接設行事曆提醒
- 我自己會設成每 5 個月提醒一次，避免忘記

### 10.3 監控容器狀態

```console
docker ps
docker logs cloudflared --tail 50
```

這兩個指令在日常維護時很好用，尤其是你發現網址突然連不到的時候，先看這兩個通常就能定位大方向。

---

## 十一、完整架構驗證清單

- [ ] DNSHe 網域申請完成
- [ ] Cloudflare 已接管 DNS（NS 指向 Cloudflare）
- [ ] Cloudflare 網域狀態為 `Active`
- [ ] `n8n` 容器正常運行
- [ ] `cloudflared` 容器正常運行
- [ ] Tunnel Public Hostname 設定正確（Service URL 為 `localhost:5678`）
- [ ] DNS CNAME 記錄 Proxy 狀態為 `Proxied`
- [ ] `nslookup` 回傳 Cloudflare IP
- [ ] 瀏覽器可正常存取 n8n 介面
- [ ] `WEBHOOK_URL` 環境變數已設定

---

## 結論

如果你的環境是 `Synology NAS + Docker`，又不想開放外網 Port，那麼 `Cloudflare Tunnel` 真的是很好用的一條路。

這次實作完成後，我認為最大的優點有三個：

1. 幾乎零成本
2. 不需要處理複雜的 SSL 憑證
3. 不需要公網 IP 也能穩定對外提供服務

對於 `n8n` 這類需要 webhook、又希望能從外部直接連入的服務來說，這個組合真的很實用。

如果你後面還要再加別的服務，例如：`MinIO`、`Uptime Kuma`、`Vaultwarden`，其實也可以沿用一樣的做法，只要再多加 Public Hostname 就行。

---

> 📌 文件版本：`v1.0`
>
> 📌 適用環境：`Synology NAS / Docker / DNSHe / Cloudflare Free Plan`
>
> 📌 零成本架構：網域（免費）+ Cloudflare（免費）+ NAS（自有硬體）