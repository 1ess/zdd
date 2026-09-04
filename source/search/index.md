---
title: 搜索
layout: page
comments: false
description: 搜索博客文章、标签和分类。
---

<div class="site-search" role="search">
  <label for="site-search-input">搜索文章</label>
  <input id="site-search-input" type="search" placeholder="输入标题、正文、标签或分类" autocomplete="off" aria-describedby="site-search-status">
  <p id="site-search-status" class="site-search-status" role="status" aria-live="polite">输入关键词开始搜索。</p>
  <ol id="site-search-results" class="site-search-results"></ol>
</div>

<script src="/search-index.js"></script>
<script>
window.addEventListener('load', function () {
  var input = document.getElementById('site-search-input');
  var status = document.getElementById('site-search-status');
  var results = document.getElementById('site-search-results');
  var index = Array.isArray(window.__BLOG_SEARCH_INDEX__) ? window.__BLOG_SEARCH_INDEX__ : [];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function normalize(value) {
    return String(value || '').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  }

  function snippet(content, query) {
    var normalizedContent = normalize(content);
    var position = normalizedContent.indexOf(query);
    var start = Math.max(0, position < 0 ? 0 : position - 45);
    var text = content.slice(start, start + 150);
    return (start ? '…' : '') + text + (start + 150 < content.length ? '…' : '');
  }

  function search() {
    var query = normalize(input.value);
    results.innerHTML = '';
    var matches = index.map(function (item) {
      var title = normalize(item.title);
      var tags = Array.isArray(item.tags) ? item.tags : [];
      var categories = Array.isArray(item.categories) ? item.categories : [];
      var metadata = normalize(tags.concat(categories).join(' '));
      var content = normalize(item.content);
      var score = !query ? 1 : (title.indexOf(query) >= 0 ? 100 : 0) + (metadata.indexOf(query) >= 0 ? 40 : 0) + (content.indexOf(query) >= 0 ? 10 : 0);
      return { item: item, score: score };
    }).filter(function (entry) { return entry.score > 0; })
      .sort(function (a, b) { return b.score - a.score || b.item.date.localeCompare(a.item.date); })
      .slice(0, query ? 40 : 12);

    status.textContent = query ? (matches.length ? '找到 ' + matches.length + ' 条结果。' : '没有找到相关文章。') : '最近更新的 12 篇文章。';
    results.innerHTML = matches.map(function (entry) {
      var item = entry.item;
      var labels = (item.tags || []).concat(item.categories || []).slice(0, 5).map(escapeHtml).join(' · ');
      return '<li><a href="' + escapeHtml(item.url) + '"><strong>' + escapeHtml(item.title) + '</strong></a>' +
        '<div class="site-search-meta">' + escapeHtml(item.date) + (labels ? ' · ' + labels : '') + '</div>' +
        '<p>' + escapeHtml(snippet(item.content, query)) + '</p></li>';
    }).join('');
  }

  if (index.length) {
    input.disabled = false;
    status.textContent = '索引已就绪，共 ' + index.length + ' 篇文章。';
    document.querySelector('.site-search label').textContent = '搜索 ' + index.length + ' 篇文章';
    input.focus();
    input.addEventListener('input', search);
    var initial = new URLSearchParams(location.search).get('q');
    if (initial) input.value = initial;
    search();
  } else {
    input.disabled = true;
    status.textContent = '搜索索引加载失败，请刷新后重试。';
  }
});
</script>
