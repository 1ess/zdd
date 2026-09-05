(function () {
  'use strict';
  var script = document.currentScript;
  var input = document.getElementById('site-search-input');
  if (!input || !script) return;
  var indexUrl = script.dataset.indexUrl;
  var status = document.getElementById('site-search-status');
  var results = document.getElementById('site-search-results');
  var retry = document.getElementById('site-search-retry');
  var manifest;
  var records = [];
  var contents;
  var normalizedContents;
  var contentRequest;
  var contentFailed = false;
  var composing = false;
  var inputTimer;

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function readJson(url, revalidate) {
    return fetch(url, { credentials: 'same-origin', cache: revalidate ? 'no-cache' : 'default' })
      .then(function (response) {
        if (!response.ok) throw new Error('Search request failed: ' + response.status);
        return response.json();
      });
  }

  function loadMetadata() {
    return readJson(indexUrl, true).then(function (data) {
      if (data.schema !== 2 || !Array.isArray(data.items) || !data.version || !data.contentUrl || !data.recent) throw new Error('Invalid search metadata');
      if (data.items.some(function (item) { return !Array.isArray(item) || item.length !== 5 || !item[0] || !item[1] || !item[4]; })) throw new Error('Invalid search record');
      var url = new URL(data.contentUrl, location.href);
      if (url.origin !== location.origin || !/\/search\/content\.[a-f0-9]{16}\.json$/.test(url.pathname)) throw new Error('Invalid search content URL');
      if (!manifest || manifest.version !== data.version) {
        contents = null;
        normalizedContents = null;
      }
      manifest = data;
      records = data.items.map(function (item) { return { item: item, title: normalize(item[0]), labels: normalize(item[3]) }; });
      document.querySelector('.site-search label').textContent = '搜索 ' + records.length + ' 篇文章';
      input.disabled = false;
    });
  }

  function snippet(content, query) {
    var position = normalize(content).indexOf(query);
    var start = Math.max(0, position < 0 ? 0 : position - 45);
    return (start ? '…' : '') + content.slice(start, start + 150) + (start + 150 < content.length ? '…' : '');
  }

  function render() {
    if (!manifest) return;
    var query = normalize(input.value);
    var matches = records.map(function (record) {
      var id = record.item[4];
      var body = normalizedContents ? normalizedContents[id] : normalize(manifest.recent[id]);
      var score = !query ? 1 : (record.title.indexOf(query) >= 0 ? 100 : 0) + (record.labels.indexOf(query) >= 0 ? 40 : 0) + (body.indexOf(query) >= 0 ? 10 : 0);
      return { item: record.item, score: score };
    }).filter(function (entry) { return entry.score > 0; });
    if (query) matches.sort(function (a, b) { return b.score - a.score || b.item[2].localeCompare(a.item[2]) || a.item[1].localeCompare(b.item[1]); });

    var total = matches.length;
    var visible = matches.slice(0, query ? 40 : 12);
    if (!query) status.textContent = '最近发布的 ' + visible.length + ' 篇文章。';
    else if (!contents && !contentFailed) status.textContent = '正在搜索正文，已找到 ' + total + ' 条标题、标签及近期摘要的结果…';
    else if (contentFailed) status.textContent = '正文索引暂时无法加载，当前显示标题、标签及近期摘要的结果。';
    else status.textContent = total ? '找到 ' + total + ' 条结果。' + (total > 40 ? '显示前 40 条，请细化关键词。' : '') : '没有找到相关文章。';
    retry.hidden = !contentFailed;
    results.setAttribute('aria-busy', String(Boolean(query && !contents && !contentFailed)));
    results.innerHTML = visible.map(function (entry) {
      var item = entry.item;
      var text = contents ? contents[item[4]] : manifest.recent[item[4]] || '';
      var labels = escapeHtml(item[3]);
      return '<li><a href="' + escapeHtml(item[1]) + '"><strong>' + escapeHtml(item[0]) + '</strong></a>' +
        '<div class="site-search-meta">' + escapeHtml(item[2]) + (labels ? ' · ' + labels : '') + '</div>' +
        (text ? '<p>' + escapeHtml(snippet(text, query)) + '</p>' : '') + '</li>';
    }).join('');
  }

  function loadContent() {
    if (contents) return Promise.resolve();
    if (contentRequest) return contentRequest;
    contentFailed = false;
    function requestContent() {
      var expectedVersion = manifest.version;
      return readJson(manifest.contentUrl).then(function (data) {
        if (data.schema !== 2 || data.version !== expectedVersion || !data.contents ||
            records.some(function (record) { return typeof data.contents[record.item[4]] !== 'string'; })) throw new Error('Inconsistent search version');
        contents = data.contents;
        normalizedContents = Object.create(null);
        records.forEach(function (record) { normalizedContents[record.item[4]] = normalize(contents[record.item[4]]); });
      });
    }
    contentRequest = requestContent().catch(function () {
      // A deployment may remove an older file while this search page stays open.
      return loadMetadata().then(requestContent);
    }).catch(function () { contentFailed = true; }).then(function () {
      contentRequest = null;
      render();
    });
    return contentRequest;
  }

  function search() {
    if (normalize(input.value)) loadContent();
    render();
  }

  function initialize() {
    retry.hidden = true;
    status.textContent = '正在加载搜索索引…';
    return loadMetadata().then(search).catch(function () {
      input.disabled = true;
      status.textContent = '搜索索引加载失败，请重试。';
      retry.hidden = false;
    });
  }

  input.addEventListener('compositionstart', function () { composing = true; clearTimeout(inputTimer); });
  input.addEventListener('compositionend', function () { composing = false; search(); });
  input.addEventListener('input', function () {
    clearTimeout(inputTimer);
    if (!composing) inputTimer = setTimeout(search, 120);
  });
  retry.addEventListener('click', function () {
    if (!manifest) initialize();
    else { loadContent(); render(); }
  });
  var initial = new URLSearchParams(location.search).get('q');
  if (initial) input.value = initial;
  initialize();
}());
