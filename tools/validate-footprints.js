'use strict';

const fs = require('fs');
const path = require('path');
const frontMatter = require('hexo-front-matter');

const postsRoot = path.join(__dirname, '..', 'source', '_posts');
const errors = [];
const places = new Map();
let visitCount = 0;
const datePattern = /^\d{4}-\d{2}(?:-\d{2})?$/;

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(target) : entry.name.endsWith('.md') ? [target] : [];
  });
}

function entries(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

markdownFiles(postsRoot).forEach((file) => {
  const relative = path.relative(postsRoot, file);
  const post = frontMatter.parse(fs.readFileSync(file, 'utf8'));
  entries(post.travel).forEach((travel, index) => {
    const label = `${relative}: travel[${index}]`;
    if (!travel || typeof travel.place !== 'string' || !travel.place.trim()) {
      errors.push(`${label}.place 必须为非空字符串。`);
      return;
    }
    const coordinates = travel.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      errors.push(`${label}.coordinates 必须是 [经度, 纬度]。`);
      return;
    }
    const [longitude, latitude] = coordinates;
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180 ||
        !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      errors.push(`${label}.coordinates 不在有效经纬度范围内。`);
    }
    if (travel.date && !datePattern.test(String(travel.date))) {
      errors.push(`${label}.date 必须为 YYYY-MM 或 YYYY-MM-DD。`);
    }
    const known = places.get(travel.place);
    if (known && (known[0] !== longitude || known[1] !== latitude)) {
      errors.push(`${label} 与其他文章中的「${travel.place}」坐标不一致。`);
    } else {
      places.set(travel.place, coordinates);
    }
    visitCount += 1;
  });
});

if (errors.length) {
  console.error('足迹配置校验失败：\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log(`足迹配置校验通过：${places.size} 个地点，${visitCount} 次足迹。`);
