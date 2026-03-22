---
title: 圖片檔
slug: gallery
url: /gallery/
date: 2016-02-01T20:29:57+08:00
image: https://i.loli.net/2019/11/10/T7Mu8Aod3egmC4Q.png
menu:
  main:
    weight: -50
    params:
      icon: hash
comments: false
---

<!--
  Migrated from Hexo: source/gallery/index.md
  Original used Hexo Butterfly {% galleryGroup %} plugin tags.
  Converted to plain HTML card grid. Each card links to the original gallery sub-path.
  NOTE: Hexo sub-gallery pages (Micosoft/, Web/, Design/, Language/, flower/) containing
  individual images are NOT migrated here. This page preserves the gallery index/overview.
-->

<style>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  margin: 1.5rem 0;
}
.gallery-card {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 16px;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
  background: var(--surface, #fff);
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}
.gallery-card:hover {
  border-color: var(--primary, #4f46e5);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
  transform: translateY(-2px);
}
.gallery-card img {
  width: 100%;
  height: 190px;
  object-fit: cover;
}
.gallery-card .card-body {
  padding: 0.95rem 1.05rem 1rem;
}
.gallery-card .card-body h2 {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.35;
}
.gallery-card .card-body h2 a {
  color: var(--text, #0f172a);
  text-decoration: none;
}
.gallery-card .card-body h2 a:hover {
  color: var(--primary, #4f46e5);
}
.gallery-card .card-body p {
  margin: 0.45rem 0 0;
  color: var(--text-muted, #64748b);
  font-size: 0.9rem;
  line-height: 1.55;
}
.gallery-meta {
  color: var(--text-faint, #94a3b8);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 0.45rem;
}
.gallery-card .card-footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.65rem;
  border-top: 1px solid var(--border, #e2e8f0);
}
.gallery-readmore {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: var(--primary-light, #eef2ff);
  color: var(--primary, #4f46e5);
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
}
.gallery-readmore:hover {
  color: var(--primary-hover, #4338ca);
}
.gallery-tags {
  color: var(--text-muted, #64748b);
  font-size: 0.78rem;
}
</style>

<div class="gallery-grid">

<div class="gallery-card">
  <a href="/gallery/Micosoft/">
    <img src="https://images.squarespace-cdn.com/content/v1/5144a1bde4b033f38036b7b9/1407854646011-5Q5FIY47OV9VCSN5CO21/Microsoft.gif" alt="Micosoft" loading="lazy">
  </a>
  <div class="card-body">
    <div class="gallery-meta">圖庫分類</div>
    <h2><a href="/gallery/Micosoft/">Micosoft</a></h2>
    <p>Microsoft 相關截圖與動畫素材，整理常見產品介面與實作示意圖。</p>
    <div class="card-footer">
      <span class="gallery-tags">#Windows #Office #Azure</span>
      <a class="gallery-readmore" href="/gallery/Micosoft/">查看圖庫</a>
    </div>
  </div>
</div>

<div class="gallery-card">
  <a href="/gallery/Web/">
    <img src="https://www.weya.com.tw/uploads/designitem/324c87017df5065bff4c859ecc5cb292.gif" alt="Web" loading="lazy">
  </a>
  <div class="card-body">
    <div class="gallery-meta">圖庫分類</div>
    <h2><a href="/gallery/Web/">Web</a></h2>
    <p>收錄網頁前端相關的 UI 示意圖、動態流程圖與畫面設計靈感範例。</p>
    <div class="card-footer">
      <span class="gallery-tags">#HTML #CSS #JavaScript</span>
      <a class="gallery-readmore" href="/gallery/Web/">查看圖庫</a>
    </div>
  </div>
</div>

<div class="gallery-card">
  <a href="/gallery/Design/">
    <img src="https://www.futureconceptretail.com/wp-content/uploads/2020/01/Design-Thinking-1.jpg" alt="Design" loading="lazy">
  </a>
  <div class="card-body">
    <div class="gallery-meta">圖庫分類</div>
    <h2><a href="/gallery/Design/">Design</a></h2>
    <p>整理設計思考、版面編排、配色參考等視覺素材，方便快速回顧與比對。</p>
    <div class="card-footer">
      <span class="gallery-tags">#UI #UX #Branding</span>
      <a class="gallery-readmore" href="/gallery/Design/">查看圖庫</a>
    </div>
  </div>
</div>

<div class="gallery-card">
  <a href="/gallery/Language/">
    <img src="https://kaochenlong.com/images/2019/programming-language.jpg" alt="Language" loading="lazy">
  </a>
  <div class="card-body">
    <div class="gallery-meta">圖庫分類</div>
    <h2><a href="/gallery/Language/">Language</a></h2>
    <p>彙整程式語言主題圖示、學習路線圖與語法比較圖，方便文章引用。</p>
    <div class="card-footer">
      <span class="gallery-tags">#CSharp #SQL #Frontend</span>
      <a class="gallery-readmore" href="/gallery/Language/">查看圖庫</a>
    </div>
  </div>
</div>

<div class="gallery-card">
  <a href="/gallery/flower/">
    <img src="https://drawio-app.com/wp-content/uploads/2018/06/interactive-diagrams-with-custom-links-and-actions.gif" alt="flower" loading="lazy">
  </a>
  <div class="card-body">
    <div class="gallery-meta">圖庫分類</div>
    <h2><a href="/gallery/flower/">flower</a></h2>
    <p>流程圖與圖解示意資源，適合用於教學文章中的流程步驟解說。</p>
    <div class="card-footer">
      <span class="gallery-tags">#Flowchart #Diagram</span>
      <a class="gallery-readmore" href="/gallery/flower/">查看圖庫</a>
    </div>
  </div>
</div>

</div>
