---
title: 遊蹤
layout: page
comments: false
footprints: true
---

<link rel="stylesheet" href="/vendor/maplibre-gl/maplibre-gl.css?v=5.24.0">

<div class="footprints-toolbar" aria-label="足迹筛选">
  <input id="footprints-place" type="search" placeholder="搜索地点" aria-label="搜索地点" autocomplete="off">
</div>
<div id="footprints-map" aria-label="足迹地图" role="application"></div>
<p id="footprints-status" class="footprints-status" role="status" aria-live="polite">正在加载足迹数据…</p>

<script src="/vendor/maplibre-gl/maplibre-gl.js?v=5.24.0"></script>
<script>
window.addEventListener('load', function () {
  var status = document.getElementById('footprints-status');
  function setStatus(message) { status.textContent = message; }
  document.documentElement.classList.add('footprints-document');
  ['.single-column-header-container', '.post-head-wrapper-text-only', '.single-column-footer'].forEach(function (selector) {
    var element = document.querySelector(selector);
    if (element) element.hidden = true;
  });

  // MapTiler 前端 key（公开可见，已在 MapTiler 后台配置域名白名单：localhost + 正式域名）。
  // 底图为矢量瓦片，通过 name:zh 字段显示中文标注，覆盖全球城市。
  var MAPTILER_KEY = 'EQVBtata7TLz29eg1rtO';
  var STYLE_URL = 'https://api.maptiler.com/maps/streets-v2/style.json?key=' + MAPTILER_KEY;

  // 缩放配置。核心场景：城市级足迹查看——进入页面自动框住全部标记，
  // 滚轮/捏合缩放用于局部观察，不提供街道级放大。
  // 边界条件（与矢量瓦片覆盖范围对齐）：
  //   floor        最小缩放硬下限（z=2 无法铺满世界），实际下限会随视口在 clampZoom 中动态抬高；
  //   ceiling      最大缩放 8 级：城市轮廓细节，保持一致的全球中文注记；
  //   fitPadding   初次框选时标记距视口边缘的留白（px）；
  //   fitCeiling   多点框选的缩放上限，防止邻近标记（如上海/苏州）把视图拉得过近；
  //   singleZoom   筛选后仅剩一个标记时的固定缩放。
  var ZOOM = { floor: 3, ceiling: 8, fitPadding: 48, fitCeiling: 7, singleZoom: 7 };
  // 平移边界：略微内收于墨卡托世界范围。maplibre v5 在 maxBounds 恰好等于
  // ±180/±85.05 全世界范围时，约束计算会触发空矩阵崩溃，故各向内收 0.1°。
  var worldBounds = [[-179.9, -84.99], [179.9, 84.99]];

  // 中文标注字段：优先 name:zh，缺失时回退简体/拉丁/英文/本地名，保证外国城市也显示中文。
  function chineseLabelField() {
    return ['coalesce',
      ['get', 'name:zh'],
      ['get', 'name:zh-Hans'],
      ['get', 'name:latin'],
      ['get', 'name:en'],
      ['get', 'name']
    ];
  }

  // 关键：样式 JSON 在交给地图构造函数“之前”就把所有文字图层的 text-field
  // 改写为中文标注。若先用默认样式渲染、再在 load 事件里改字段，首帧已经是
  // 英文标注（load 在首帧渲染完成后才触发），页面上会“英文闪一下”。
  function localizeStyle(style) {
    if (style && Array.isArray(style.layers)) {
      style.layers.forEach(function (layer) {
        if (layer.layout && layer.layout['text-field'] !== undefined) {
          layer.layout['text-field'] = chineseLabelField();
        }
      });
    }
    return style;
  }

  var map;

  // 鉴权/配额类失败给出可读错误，避免地图无限转圈。
  var fatalReported = false;
  function reportFatal(message) {
    if (fatalReported) return;
    fatalReported = true;
    setStatus(message);
  }

  // 动态抬高最小缩放：保证世界瓦片始终铺满视口较长边，
  // 避免缩得太小时露出底图外空白；视口尺寸变化后重新夹取。
  function clampZoom() {
    var el = document.getElementById('footprints-map');
    var size = Math.max(el.clientWidth || 0, el.clientHeight || 0);
    var floor = Math.max(ZOOM.floor, Math.ceil(Math.log2(size / 512)));
    map.setMinZoom(floor);
    if (map.getZoom() < floor) map.setZoom(floor);
  }

  var allData;
  var boundsReady = false;
  var markerCache = {};
  var placeInput = document.getElementById('footprints-place');

  // 首次自动框选必须在“边界已生效 + 数据已就绪”之后再执行：maplibre v5 在样式/
  // 矩阵尚未就绪的早期阶段执行 maxBounds / fitBounds 的约束路径会触发空矩阵崩溃，
  // 故将 setMaxBounds 与首次 fitBounds 都放到首个 idle 之后。
  function initialFitIfReady() {
    if (boundsReady && allData) renderFootprints(true);
  }

  // 先拉取样式 JSON 并本地化为中文标注，再构造地图——首帧即为中文底图，不会闪英文。
  setStatus('正在加载地图底图…');
  fetch(STYLE_URL)
    .then(function (response) {
      if (!response.ok) {
        var styleError = new Error('底图样式请求失败：HTTP ' + response.status);
        styleError.status = response.status;
        throw styleError;
      }
      return response.json();
    })
    .then(function (style) {
      map = new maplibregl.Map({
        container: 'footprints-map',
        style: localizeStyle(style),
        center: [109, 35.5],
        zoom: 4,
        minZoom: ZOOM.floor,
        maxZoom: ZOOM.ceiling,
        renderWorldCopies: false,
        attributionControl: false,
        refreshExpiredTiles: false,
        // 关闭自动 ResizeObserver 驱动的 resize：样式加载完成前的早期 resize 会走
        // transform 约束路径并触发 maplibre v5 空矩阵崩溃。改为布局稳定后手动 resize。
        trackResize: false,
        pitch: 0,
        maxPitch: 0,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        // 矢量字形若缺少中文，则回退到系统 CJK 字体，保证中文标注完整渲染。
        localIdeographFontFamily: '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif'
      });

      // 样式已成功拉取后，瓦片/字形/精灵等资源仍可能鉴权失败。
      map.on('error', function (event) {
        var err = event && event.error;
        if (err && (err.status === 401 || err.status === 403)) {
          reportFatal('地图底图鉴权失败（MapTiler key 无效、域名未加白名单或超出配额），请稍后再试。');
        }
      });

      map.on('load', function () {
        // 手动 resize：trackResize 已关闭，需在样式就绪后显式同步一次容器尺寸，
        // 之后监听 window resize 节流同步，保证全屏布局尺寸变化时地图正确适配。
        function syncSize() { map.resize(); clampZoom(); }
        window.addEventListener('resize', function () {
          window.clearTimeout(syncSize._t);
          syncSize._t = window.setTimeout(syncSize, 150);
        });

        map.once('idle', function () {
          syncSize();                    // 布局稳定后按最终尺寸 resize
          map.setMaxBounds(worldBounds);
          boundsReady = true;
          // resize 与 maxBounds 同一帧内生效，变换矩阵需一帧才能稳定；
          // 延后一帧再做首次框选，确保 fitBounds 按最终容器尺寸计算留白（标记不被裁切）。
          window.requestAnimationFrame(function () { initialFitIfReady(); });
        });

        fetch('footprints.geojson')
          .then(function (response) {
            if (!response.ok) throw new Error('无法读取 GeoJSON 数据');
            return response.json();
          })
          .then(function (data) {
            allData = data;
            // 先放置标记（不调视图），首次框选由 idle 后统一触发。
            renderFootprints(false);
            var searchTimer;
            placeInput.addEventListener('input', function () {
              window.clearTimeout(searchTimer);
              searchTimer = window.setTimeout(function () { renderFootprints(false); }, 120);
            });
            initialFitIfReady();
          })
          .catch(function () {
            setStatus('足迹数据加载失败，请刷新页面后重试。');
          });
      });
    })
    .catch(function (error) {
      if (error && (error.status === 401 || error.status === 403)) {
        reportFatal('地图底图鉴权失败（MapTiler key 无效、域名未加白名单或超出配额），请稍后再试。');
      } else {
        setStatus('地图底图加载失败，请检查网络后刷新页面重试。');
      }
    });

  function buildPopup(name, visits) {
    var rows = visits.map(function (visit) {
      var postUrl = visit.url || '../' + encodeURIComponent(visit.post) + '/';
      return '<li><time>' + escapeHtml(visit.date) + '</time> · <a href="' + escapeHtml(postUrl) + '">' + escapeHtml(visit.post) + '</a></li>';
    }).join('');
    return new maplibregl.Popup({ offset: 18, closeButton: true, closeOnClick: true, maxWidth: '280px' })
      .setHTML('<div class="footprints-popup"><h3>' + escapeHtml(name) + '</h3><ul>' + rows + '</ul></div>');
  }

  function renderFootprints(fitMap) {
      var place = placeInput.value.trim().toLocaleLowerCase();
      var filtered = {
        type: 'FeatureCollection',
        features: allData.features.map(function (feature) {
          var visits = feature.properties.visits.slice();
          if (place && feature.properties.name.toLocaleLowerCase().indexOf(place) < 0) visits = [];
          return { type: 'Feature', properties: { name: feature.properties.name, visits: visits }, geometry: feature.geometry };
        }).filter(function (feature) { return feature.properties.visits.length; })
      };
      var totalVisits = 0;
      var visibleNames = {};
      var bounds = [];
      filtered.features.forEach(function (feature) {
        var name = feature.properties.name;
        var visits = feature.properties.visits.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
        var count = visits.length;
        totalVisits += count;
        visibleNames[name] = true;
        // GeoJSON 坐标为 [经度, 纬度]，MapLibre 直接使用该顺序。
        var lngLat = feature.geometry.coordinates;
        bounds.push(lngLat);

        var cache = markerCache[name];
        if (!cache) {
          var el = document.createElement('div');
          el.className = 'footprints-marker';
          var marker = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat(lngLat)
            .addTo(map);
          cache = markerCache[name] = { marker: marker, el: el, on: true };
        }
        cache.el.textContent = String(count);
        cache.marker.setPopup(buildPopup(name, visits));
        if (!cache.on) { cache.marker.addTo(map); cache.on = true; }
      });
      Object.keys(markerCache).forEach(function (name) {
        if (!visibleNames[name]) {
          var cache = markerCache[name];
          if (cache.on) { cache.marker.remove(); cache.on = false; }
        }
      });
      if (fitMap && bounds.length) {
        if (bounds.length === 1) {
          map.jumpTo({ center: bounds[0], zoom: ZOOM.singleZoom });
        } else {
          // padding 为统一留白，fitBounds 自会选取能容纳全部标记的最高缩放。
          var lngs = bounds.map(function (p) { return p[0]; });
          var lats = bounds.map(function (p) { return p[1]; });
          map.fitBounds(
            [[Math.min.apply(null, lngs), Math.min.apply(null, lats)],
             [Math.max.apply(null, lngs), Math.max.apply(null, lats)]],
            { padding: ZOOM.fitPadding, maxZoom: ZOOM.fitCeiling, animate: false, duration: 0 }
          );
        }
      }
      setStatus(filtered.features.length ? '已显示 ' + filtered.features.length + ' 个地点，共 ' + totalVisits + ' 次足迹。' : '没有符合筛选条件的足迹。');
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }
});
</script>
