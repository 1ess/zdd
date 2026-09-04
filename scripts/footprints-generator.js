'use strict';

function travelEntries(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

hexo.extend.generator.register('footprints-data', function (locals) {
  const collection = { type: 'FeatureCollection', features: [] };
  const featuresByName = new Map();

  locals.posts.toArray().forEach(function (post) {
    travelEntries(post.travel).forEach(function (travel) {
      if (!travel || !travel.place || !Array.isArray(travel.coordinates) || travel.coordinates.length !== 2) {
        throw new Error('文章「' + post.title + '」的 travel 配置不完整。');
      }
      var feature = featuresByName.get(travel.place);
      if (!feature) {
        feature = {
          type: 'Feature',
          properties: { name: travel.place, visits: [] },
          geometry: { type: 'Point', coordinates: travel.coordinates }
        };
        collection.features.push(feature);
        featuresByName.set(travel.place, feature);
      } else if (feature.geometry.coordinates[0] !== travel.coordinates[0] || feature.geometry.coordinates[1] !== travel.coordinates[1]) {
        throw new Error('地点「' + travel.place + '」在不同文章中使用了不一致的坐标。');
      }
      var visit = {
        date: travel.date || post.date.format('YYYY-MM-DD'),
        post: post.title,
        url: hexo.config.root + post.path
      };
      var exists = feature.properties.visits.some(function (item) {
        return item.post === visit.post && item.date === visit.date;
      });
      if (!exists) feature.properties.visits.push(visit);
    });
  });

  collection.features.sort(function (a, b) { return a.properties.name.localeCompare(b.properties.name, 'zh-CN'); });
  collection.features.forEach(function (feature) {
    feature.properties.visits.sort(function (a, b) { return a.date.localeCompare(b.date); });
  });

  return { path: 'footprints/footprints.geojson', data: JSON.stringify(collection, null, 2) };
});
