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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
}
.gallery-card {
  border: 1px solid var(--card-separator-color, #e0e0e0);
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.2s;
  background: var(--card-background, #fff);
}
.gallery-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}
.gallery-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.gallery-card .card-body {
  padding: 0.8rem 1rem;
}
.gallery-card .card-body h3 {
  margin: 0 0 0.3rem 0;
  font-size: 1.1rem;
}
.gallery-card .card-body p {
  margin: 0;
  color: var(--body-text-color, #666);
  font-size: 0.9rem;
}
</style>

<div class="gallery-grid">

<div class="gallery-card">
  <img src="https://images.squarespace-cdn.com/content/v1/5144a1bde4b033f38036b7b9/1407854646011-5Q5FIY47OV9VCSN5CO21/Microsoft.gif" alt="Micosoft" loading="lazy">
  <div class="card-body">
    <h3>Micosoft</h3>
    <p>Micosoft 相關圖檔</p>
  </div>
</div>

<div class="gallery-card">
  <img src="https://www.weya.com.tw/uploads/designitem/324c87017df5065bff4c859ecc5cb292.gif" alt="Web" loading="lazy">
  <div class="card-body">
    <h3>Web</h3>
    <p>網頁相關圖庫</p>
  </div>
</div>

<div class="gallery-card">
  <img src="https://www.futureconceptretail.com/wp-content/uploads/2020/01/Design-Thinking-1.jpg" alt="Design" loading="lazy">
  <div class="card-body">
    <h3>Design</h3>
    <p>相關設計</p>
  </div>
</div>

<div class="gallery-card">
  <img src="https://kaochenlong.com/images/2019/programming-language.jpg" alt="Language" loading="lazy">
  <div class="card-body">
    <h3>Language</h3>
    <p>程式語言圖庫</p>
  </div>
</div>

<div class="gallery-card">
  <img src="https://drawio-app.com/wp-content/uploads/2018/06/interactive-diagrams-with-custom-links-and-actions.gif" alt="flower" loading="lazy">
  <div class="card-body">
    <h3>flower</h3>
    <p>流程圖</p>
  </div>
</div>

</div>
