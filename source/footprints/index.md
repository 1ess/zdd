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
    worldCopyJump: false,
    maxBounds: worldBounds,
    maxBoundsViscosity: 1
  }).setView([35.5, 109], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    noWrap: true,
    bounds: worldBounds,
    updateWhenZooming: true,
    updateWhenIdle: true,
    keepBuffer: 4,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  function updateMinimumZoom() {
    var size = map.getSize();
    var minimum = Math.max(2, Math.ceil(Math.log(Math.max(size.x, size.y) / 256) / Math.LN2));
    map.setMinZoom(minimum);
    if (map.getZoom() < minimum) map.setZoom(minimum);
    map.panInsideBounds(worldBounds, { animate: false });
  }
  updateMinimumZoom();
  map.on('resize', updateMinimumZoom);

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
      if (fitMap && bounds.length) map.fitBounds(L.latLngBounds(bounds), { padding: [36, 36], maxZoom: 5 });
      if (fitMap) window.setTimeout(function () { map.invalidateSize(); }, 100);
      setStatus(filtered.features.length ? '已显示 ' + filtered.features.length + ' 个地点，共 ' + totalVisits + ' 次足迹。' : '没有符合筛选条件的足迹。');
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }
});
</script>
