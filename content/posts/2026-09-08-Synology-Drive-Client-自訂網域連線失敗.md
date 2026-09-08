+++
title = '【Synology】Drive Client 使用自訂網域連線失敗，但手機 App 正常'
date = '2026-09-08T20:00:00'
slug = 'Synology-Drive-Client-自訂網域連線失敗'
description = '記錄 Synology Drive Client 使用自訂網域時持續連線失敗，但手機 App 可以正常使用的原因，以及透過 QuickConnect 或 TCP 6690 解決的方法。'
categories = ['Synology', '問題排除']
tags = ['Synology', 'Synology Drive Client', 'QuickConnect', 'Custom Domain']
keywords = ['Synology Drive Client 連線失敗', 'Synology 自訂網域', 'QuickConnect', 'TCP 6690']
+++

## 前言

最近在外部網路使用 `Synology Drive Client` 時遇到一個奇怪的問題：NAS 已經設定好自己的 Domain，瀏覽器與手機版 Synology Drive App 都能正常登入，但 Windows 或 macOS 的 Drive Client 不管怎麼輸入自訂網域，最後都只得到「連線失敗」。

一開始很容易懷疑是 Domain、SSL 憑證或帳號密碼設定錯誤，不過真正的差異其實是：**手機 App 與桌面版 Drive Client 使用的連線方式不同。**

本文記錄這次問題的原因，以及不開放額外連接埠時，如何改用 `QuickConnect ID` 完成連線。

---

## 一、遇到的問題

目前的環境大致如下：

- NAS 已設定自訂網域，例如 `drive.example.com`
- 自訂網域可透過 HTTPS `443` 連回 NAS
- Synology Drive 手機 App 可正常登入與瀏覽檔案
- Windows／macOS 的 Synology Drive Client 使用相同網域卻顯示連線失敗
- Synology Drive Server 已安裝且運作正常

這種情況不代表自訂網域無法解析，也不一定是憑證錯誤。若目前只有 Web 常用的 `80`、`443` 對外開放，問題通常出在桌面版 Drive Client 所需的 `TCP 6690` 並沒有通過。

---

## 二、為什麼手機 App 正常，桌面 Client 卻失敗？

Synology Drive 的 Web Portal 與手機 App 可以透過 HTTPS 連線，因此自訂網域只要已經正確代理至 `443`，通常就能正常使用。

桌面版 Synology Drive Client 則使用 Drive 的同步通訊協定，預設會連線至 NAS 的 `TCP 6690`。這也表示：

```text
手機 App／Web Portal
自訂網域 -> HTTPS 443 -> NAS

Windows／macOS Drive Client
自訂網域 -> TCP 6690 -> NAS
```

如果反向代理或 Cloudflare 只處理 `HTTP/HTTPS`，即使 `https://drive.example.com` 可以正常開啟，也不代表 `drive.example.com:6690` 可以連線。

> 自訂網域本身並非完全不受支援。Synology 官方文件允許 Drive Client 使用 IP、網域名稱或 QuickConnect ID；真正的問題是該網域背後是否有一條可到達 Drive 同步服務的 `TCP 6690` 連線。

---

## 三、解決方式一：改用 QuickConnect ID

如果不希望在 Router 額外開放 `6690`，最簡單的方式就是讓桌面版 Drive Client 改走 QuickConnect。

### 3-1 啟用 QuickConnect

1. 登入 DSM。
2. 開啟「控制台」。
3. 進入「外部存取」。
4. 選擇「QuickConnect」頁籤。
5. 勾選「啟用 QuickConnect」。
6. 設定或確認自己的 `QuickConnect ID`。

![啟用 QuickConnect 並確認 QuickConnect ID](image/2026-09-08%2010%2046%2014.png)

### 3-2 開放 Synology Drive 使用 QuickConnect

只有啟用 QuickConnect 還不一定足夠，還要確認 Synology Drive 在允許使用的服務清單內：

1. 在 QuickConnect 頁面開啟「進階設定」。
2. 視網路環境勾選「啟用 QuickConnect 轉送服務」。
3. 在「應用程式／服務」清單中勾選 `Synology Drive Server`。
4. 按下「套用」。

![啟用 QuickConnect 轉送服務並勾選 Synology Drive Server](image/2026-09-08%2010%2046%2007.png)

其中「QuickConnect 轉送服務」會在無法建立直接連線時，改由 Synology Relay Server 轉送。這樣不需要自行開放 `6690`，但經過轉送時，速度與延遲可能不如直接連線。

### 3-3 在 Drive Client 改填 QuickConnect ID

重新開啟 Windows 或 macOS 的 Synology Drive Client，伺服器位址不要再輸入自訂網域，直接填入：

```text
你的 QuickConnect ID
```

接著輸入 DSM 帳號與密碼，再建立同步或備份工作即可。

---

## 四、解決方式二：讓自訂網域可連到 TCP 6690

如果希望 Drive Client 直接使用自訂網域，不經過 QuickConnect Relay，就要確保外部網路可以連到 NAS 的 `TCP 6690`。

基本設定包含：

1. 自訂網域的 DNS 必須解析至正確的對外 IP。
2. Router 設定 `TCP 6690` Port Forwarding，轉送至 NAS 的 `6690`。
3. DSM 防火牆允許來源連線至 `TCP 6690`。
4. Drive Client 內填入自訂網域，例如 `drive.example.com`。
5. 確認 Synology Drive Server 與使用者權限皆正常。

可以先在外部網路使用 PowerShell 測試連接埠：

```powershell
Test-NetConnection drive.example.com -Port 6690
```

如果看到以下結果，代表外部網路已能連到該服務：

```text
TcpTestSucceeded : True
```

> 若網域使用 Cloudflare Proxy，不能只因為網站的 `443` 可用，就判定 `6690` 也能通過。請依自己的 DNS、Proxy 與防火牆架構確認 TCP 流量是否真的能抵達 NAS。

---

## 五、仍然無法連線時的檢查清單

若改用 QuickConnect ID 後仍然失敗，可以依序檢查：

1. DSM 的 Synology Drive Server 是否已安裝並正常執行。
2. QuickConnect 的「應用程式／服務」是否已勾選 `Synology Drive Server`。
3. 無法直連時，是否已啟用 QuickConnect 轉送服務。
4. 使用者是否有 Synology Drive 的應用程式權限。
5. 帳號是否具有目標 Team Folder 的讀寫權限。
6. Client 電腦的防火牆、Proxy 或公司網路是否擋住連線。
7. 若使用自訂網域直連，`TCP 6690` 是否真的能從外部連通。

---

## 六、結論

這次的狀況並不是「手機 App 可以，所以桌面 Client 理論上也一定可以」。手機 App 可透過 HTTPS `443` 使用服務，但桌面版 Synology Drive Client 的同步連線預設需要 `TCP 6690`。

因此，當自訂網域只設定 HTTPS 反向代理時，就可能出現 App 正常、桌面 Client 一直連線失敗的情況。

處理方式可以依需求選擇：

- 不想額外開放 Port：啟用 QuickConnect、允許 Synology Drive Server 使用，並在 Client 輸入 QuickConnect ID。
- 希望使用自訂網域直連：設定並保護 `TCP 6690` 的 Port Forwarding 與防火牆規則。
- 不想使用 QuickConnect，也不想公開 `6690`：先透過 VPN 連回家中網路，再使用 NAS 內部 IP 或內部 DNS 連線。

對一般使用者來說，QuickConnect 是設定最少的做法；若重視傳輸效能與連線路徑，則可評估 VPN 或妥善限制來源的 `6690` 直連方案。

---

## 參考文件

- [Synology 官方：Synology Drive Client 說明](https://kb.synology.com/zh-tw/DSM/help/SynologyDriveClient/synologydriveclient?version=7)
- [Synology 官方：Drive Client 無法連線時的檢查方式](https://kb.synology.com/zh-tw/DSM/tutorial/Drive_Client_connection_issue)
- [Synology 官方：QuickConnect 設定說明](https://kb.synology.com/zh-tw/DSM/help/DSM/AdminCenter/connection_quickconnect?version=7)
- [Synology Community：Cannot connect Synology Drive client using custom domain](https://community.synology.com/enu/forum/3/post/157224)
- [Synology Community：手機 App 與桌面 Client 使用不同連接埠的案例](https://community.synology.com/enu/forum/1/post/192507)

> 社群論壇內容屬於使用者經驗分享；連接埠、支援方式與介面名稱仍應以目前使用版本的 Synology 官方文件為準。