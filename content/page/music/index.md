---
title: 音樂
slug: music
url: /music/
date: 2021-10-28T15:06:46+08:00
menu:
  main:
    weight: -40
    params:
      icon: infinity
comments: false
---

<!--
  Migrated from Hexo: source/music/index.md
  Original used APlayer plugin with Netease Music integration.
  APlayer requires external JS/CSS to function. The HTML embeds are preserved below.
  
  FEATURE GAP: APlayer JS/CSS are NOT loaded by default in Hugo Stack theme.
  To activate, add APlayer CDN resources to a custom head partial or this page's head block:
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
    <script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>
-->

## 🎵 音樂播放器

以下播放器需要載入 [APlayer](https://aplayer.js.org/) 與 [MetingJS](https://github.com/metowolf/MetingJS) 才能正常運作。

<!-- Netease Music playlist player (fixed, autoplay) -->
<div class="aplayer no-destroy" data-id="60198" data-server="netease" data-type="playlist" data-fixed="true" data-autoplay="true"> </div>

<!-- Netease Music artist player -->
<div class="aplayer" data-id="60198" data-server="netease" data-type="artist" data-mutex="true" data-preload="auto" data-theme="#3F51B5"></div>

<details>
<summary>📋 如何啟用播放器</summary>

在 Hugo 中啟用 APlayer，請將以下程式碼加入自訂 head partial（`layouts/partials/head/custom.html`）：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>
```

</details>
