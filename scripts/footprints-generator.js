'use strict';

const fs = require('fs');
const path = require('path');

function travelEntries(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

hexo.extend.generator.register('footprints-data', function (locals) {
  const sourceFile = path.join(hexo.source_dir, 'footprints', 'data.geojson');
  const collection = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  const featuresByName = new Map();
  collection.features.forEach(function (feature) { featuresByName.set(feature.properties.name, feature); });

  locals.posts.toArray().forEach(function (post) {
    travelEntries(post.travel).forEach(function (travel) {
      if (!travel || !travel.place || !Array.isArray(travel.coordinates) || travel.coordinates.length !== 2) return;
      var feature = featuresByName.get(travel.place);
      if (!feature) {
        feature = {
          type: 'Feature',
          properties: { name: travel.place, visits: [] },
          geometry: { type: 'Point', coordinates: travel.coordinates }
        };
        collection.features.push(feature);
        featuresByName.set(travel.place, feature);
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

  return { path: 'footprints/footprints.geojson', data: JSON.stringify(collection, null, 2) };
});
