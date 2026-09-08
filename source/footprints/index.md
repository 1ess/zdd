---
title: 遊蹤
layout: page
comments: false
footprints: true
---

<link rel="stylesheet" href="/vendor/leaflet/leaflet.css?v=1.9.4">

<div class="footprints-toolbar" aria-label="足迹筛选">
  <input id="footprints-place" type="search" placeholder="搜索地点" aria-label="搜索地点" autocomplete="off">
</div>
<div id="footprints-map" aria-label="足迹地图" role="application"></div>
<p id="footprints-status" class="footprints-status" role="status" aria-live="polite">正在加载足迹数据…</p>

<script src="/vendor/leaflet/leaflet.js?v=1.9.4"></script>
<script>
window.addEventListener('load', function () {
  var status = document.getElementById('footprints-status');
  function setStatus(message) { status.textContent = message; }
  document.documentElement.classList.add('footprints-document');
  ['.single-column-header-container', '.post-head-wrapper-text-only', '.single-column-footer'].forEach(function (selector) {
    var element = document.querySelector(selector);
    if (element) element.hidden = true;
  });

  // 缩放配置。核心场景：城市级足迹查看——进入页面自动框住全部标记，
  // 滚轮/捏合缩放用于局部观察，不提供街道级放大。
  // 边界条件（与高德中文底图的瓦片覆盖范围对齐）：
  //   floor        最小缩放硬下限（z=2 无世界瓦片，故从 3 起），实际下限会随视口在 clampZoom 中动态抬高；
  //   ceiling      最大缩放 8 级：国内为城市轮廓细节，海外仍有完整中文注记，更高缩放海外为空白瓦片；
  //   fitPadding   初次框选时标记距视口边缘的留白（px）；
  //   fitCeiling   多点框选的缩放上限，防止邻近标记（如上海/苏州）把视图拉得过近；
  //   singleZoom   筛选后仅剩一个标记时的固定缩放。
  var ZOOM = { floor: 3, ceiling: 8, fitPadding: 48, fitCeiling: 7, singleZoom: 7 };
  var worldBounds = L.latLngBounds(
    L.latLng(-85.05112878, -180),
    L.latLng(85.05112878, 180)
  );
  var map = L.map('footprints-map', {
    scrollWheelZoom: true,
    wheelDebounceTime: 80,
    wheelPxPerZoomLevel: 90,
    fadeAnimation: false,
    zoomAnimation: false,
    markerZoomAnimation: false,
    zoomControl: false,
    attributionControl: false,
    worldCopyJump: false,
    minZoom: ZOOM.floor,
    maxZoom: ZOOM.ceiling,
    maxBounds: worldBounds,
    maxBoundsViscosity: 1
  }).setView([35.5, 109], 4);
  // 高德中文底图：全球城市与地理要素均以中文注记（lang=zh_cn），
  // 无需 API key；国内坐标为 GCJ-02，城市级标记在 z≤8 下偏差小于 3px，可忽略。
  L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    subdomains: ['1', '2', '3', '4'],
    maxZoom: ZOOM.ceiling,
    noWrap: true,
    bounds: worldBounds,
    updateWhenZooming: true,
    updateWhenIdle: true,
    keepBuffer: 4,
    attribution: '&copy; <a href="https://ditu.amap.com/">高德地图</a>'
  }).addTo(map);

  // 动态抬高最小缩放：保证世界底图（256×2^z px）始终铺满视口较长边，
  // 避免缩得太小时露出底图外的灰色空白；视口尺寸变化后重新夹取视图。
  function clampZoom() {
    var size = map.getSize();
    var floor = Math.max(ZOOM.floor, Math.ceil(Math.log2(Math.max(size.x, size.y) / 256)));
    map.setMinZoom(floor);
    if (map.getZoom() < floor) map.setZoom(floor);
    map.panInsideBounds(worldBounds, { animate: false });
  }
  clampZoom();
  map.on('resize', clampZoom);

  var allData;
  var footprintsLayer = L.layerGroup().addTo(map);
  var markerCache = {};
  var placeInput = document.getElementById('footprints-place');

  fetch('footprints.geojson')
    .then(function (response) {
      if (!response.ok) throw new Error('无法读取 GeoJSON 数据');
      return response.json();
    })
    .then(function (data) {
      allData = data;
      renderFootprints(true);
      var searchTimer;
      placeInput.addEventListener('input', function () {
        window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(function () { renderFootprints(false); }, 120);
      });
    })
    .catch(function () {
      setStatus('足迹数据加载失败，请刷新页面后重试。');
    });

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
        var latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
        bounds.push(latlng);
        var marker = markerCache[name];
        if (!marker) {
          marker = markerCache[name] = L.marker(latlng);
        }
        marker.setIcon(L.divIcon({ className: 'footprints-marker', html: count, iconSize: [30, 30], iconAnchor: [15, 15] }));
        var rows = visits.map(function (visit) {
          var postUrl = visit.url || '../' + encodeURIComponent(visit.post) + '/';
          return '<li><time>' + escapeHtml(visit.date) + '</time> · <a href="' + escapeHtml(postUrl) + '">' + escapeHtml(visit.post) + '</a></li>';
        }).join('');
        marker.bindPopup('<div class="footprints-popup"><h3>' + escapeHtml(name) + '</h3><ul>' + rows + '</ul></div>');
        if (!footprintsLayer.hasLayer(marker)) footprintsLayer.addLayer(marker);
      });
      Object.keys(markerCache).forEach(function (name) {
        if (!visibleNames[name] && footprintsLayer.hasLayer(markerCache[name])) footprintsLayer.removeLayer(markerCache[name]);
      });
      if (fitMap && bounds.length) {
        // 框选前同步一次容器尺寸，确保按最终视口计算最小包围盒。
        map.invalidateSize({ animate: false });
        if (bounds.length === 1) {
          map.setView(bounds[0], ZOOM.singleZoom, { animate: false });
        } else {
          // 仅用视口留白一种机制，fitBounds 自会选取能容纳全部标记的最高缩放。
          map.fitBounds(L.latLngBounds(bounds), {
            padding: [ZOOM.fitPadding, ZOOM.fitPadding],
            maxZoom: ZOOM.fitCeiling,
            animate: false
          });
        }
        window.setTimeout(function () {
          map.invalidateSize({ animate: false });
          map.panInsideBounds(worldBounds, { animate: false });
        }, 100);
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
