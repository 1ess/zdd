---
title: 尋文
layout: page
search: true
comments: false
description: 搜索博客文章、标签和分类。
---

<div class="site-search" role="search">
  <label for="site-search-input">搜索文章</label>
  <input id="site-search-input" type="search" placeholder="输入标题、正文、标签或分类" autocomplete="off" aria-describedby="site-search-status" disabled>
  <p id="site-search-status" class="site-search-status" role="status" aria-live="polite">正在加载搜索索引…</p>
  <button id="site-search-retry" type="button" hidden>重试</button>
  <ol id="site-search-results" class="site-search-results"></ol>
</div>
