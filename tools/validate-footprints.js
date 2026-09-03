'use strict';

const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'source', 'footprints', 'data.geojson');
const data = JSON.parse(fs.readFileSync(source, 'utf8'));
const errors = [];
const datePattern = /^\d{4}-\d{2}(?:-\d{2})?$/;

if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
  errors.push('根对象必须是包含 features 数组的 FeatureCollection。');
}

(data.features || []).forEach((feature, index) => {
  const label = `features[${index}]`;
  const properties = feature.properties || {};
  const coordinates = feature.geometry && feature.geometry.coordinates;

  if (feature.type !== 'Feature') errors.push(`${label}.type 必须为 Feature。`);
  if (!properties.name || typeof properties.name !== 'string') errors.push(`${label}.properties.name 必须为非空字符串。`);
  if (!feature.geometry || feature.geometry.type !== 'Point' || !Array.isArray(coordinates) || coordinates.length !== 2) {
    errors.push(`${label}.geometry 必须是含 [经度, 纬度] 的 Point。`);
  } else {
    const [longitude, latitude] = coordinates;
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180 || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      errors.push(`${label}.geometry.coordinates 不在有效经纬度范围内。`);
    }
  }
  if (!Array.isArray(properties.visits) || properties.visits.length === 0) {
    errors.push(`${label}.properties.visits 必须包含至少一次访问。`);
    return;
  }
  properties.visits.forEach((visit, visitIndex) => {
    const visitLabel = `${label}.properties.visits[${visitIndex}]`;
    if (!visit || !datePattern.test(visit.date || '')) errors.push(`${visitLabel}.date 必须为 YYYY-MM 或 YYYY-MM-DD。`);
    if (!visit || (!visit.post && !visit.url)) errors.push(`${visitLabel} 至少需要 post 或 url。`);
    if (visit && visit.url && !/^(?:https?:\/\/|\/|\.\.\/)/.test(visit.url)) errors.push(`${visitLabel}.url 必须是绝对 URL、站内根路径或相对路径。`);
  });
});

if (errors.length) {
  console.error('足迹数据校验失败：\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log(`足迹数据校验通过：${data.features.length} 个地点。`);
