---
title: 足迹
layout: page
comments: false
footprints: true
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">

<div id="footprints-map" aria-label="足迹地图"></div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script>
window.addEventListener('load', function () {
  document.documentElement.classList.add('footprints-document');
  ['.single-column-header-container', '.post-head-wrapper-text-only', '.single-column-footer'].forEach(function (selector) {
    var element = document.querySelector(selector);
    if (element) element.hidden = true;
  });

  var map = L.map('footprints-map', { scrollWheelZoom: true, fadeAnimation: false }).setView([35.5, 109], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  fetch('data.geojson')
    .then(function (response) {
      if (!response.ok) throw new Error('无法读取 GeoJSON 数据');
      return response.json();
    })
    .then(function (data) {
      var totalVisits = 0;
      var layer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          var count = feature.properties.visits.length;
          totalVisits += count;
          return L.marker(latlng, {
            icon: L.divIcon({ className: 'footprints-marker', html: count, iconSize: [30, 30], iconAnchor: [15, 15] })
          });
        },
        onEachFeature: function (feature, marker) {
          var visits = feature.properties.visits.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
          var rows = visits.map(function (visit) {
            var postUrl = visit.url || '../' + encodeURIComponent(visit.post) + '/';
            return '<li><time>' + escapeHtml(visit.date) + '</time> · <a href="' + escapeHtml(postUrl) + '">' + escapeHtml(visit.post) + '</a></li>';
          }).join('');
          marker.bindPopup('<div class="footprints-popup"><h3>' + escapeHtml(feature.properties.name) + '</h3><ul>' + rows + '</ul></div>');
        }
      }).addTo(map);
      map.fitBounds(layer.getBounds(), { padding: [36, 36], maxZoom: 5 });
      window.setTimeout(function () { map.invalidateSize(); }, 100);
    })
    .catch(function () {});
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }
});
</script>
