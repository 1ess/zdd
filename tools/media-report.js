'use strict';

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const reportFile = path.join(publicDir, 'media-report.json');
const htmlFiles = [];

function walk(directory) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith('.html')) htmlFiles.push(target);
  });
}

function attributes(tag) {
  const result = {};
  tag.replace(/\b([\w-]+)(?:\s*=\s*(["'])(.*?)\2)?/g, (_, name, _quote, value) => {
    result[name.toLowerCase()] = value === undefined ? true : value;
    return _;
  });
  return result;
}

function addOrigin(origins, source) {
  if (!source || typeof source !== 'string') return;
  try {
    const origin = new URL(source, 'https://local.invalid').origin;
    if (origin !== 'https://local.invalid') origins[origin] = (origins[origin] || 0) + 1;
  } catch (_) {}
}

if (!fs.existsSync(publicDir)) {
  console.error('未找到 public 目录，请先生成站点。');
  process.exit(1);
}

walk(publicDir);
const report = {
  generatedAt: new Date().toISOString(),
  pages: htmlFiles.length,
  images: { total: 0, missingAlt: 0, missingDimensions: 0, nativeLazy: 0, origins: {} },
  videos: { total: 0, missingPoster: 0, missingMetadataPreload: 0, origins: {} }
};

htmlFiles.forEach((file) => {
  const html = fs.readFileSync(file, 'utf8');
  (html.match(/<img\b[^>]*>/gi) || []).forEach((tag) => {
    const attrs = attributes(tag);
    report.images.total += 1;
    if (!Object.prototype.hasOwnProperty.call(attrs, 'alt')) report.images.missingAlt += 1;
    if (!attrs.width || !attrs.height) report.images.missingDimensions += 1;
    if (attrs.loading === 'lazy') report.images.nativeLazy += 1;
    addOrigin(report.images.origins, attrs.src);
  });
  (html.match(/<video\b[^>]*>/gi) || []).forEach((tag) => {
    const attrs = attributes(tag);
    report.videos.total += 1;
    if (!attrs.poster) report.videos.missingPoster += 1;
    if (attrs.preload !== 'metadata') report.videos.missingMetadataPreload += 1;
    addOrigin(report.videos.origins, attrs.src);
  });
});

fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
console.log(`媒体报告已生成：${path.relative(process.cwd(), reportFile)}`);
console.log(`图片 ${report.images.total} 张；缺少 alt：${report.images.missingAlt}，缺少宽高：${report.images.missingDimensions}，原生懒加载：${report.images.nativeLazy}。`);
console.log(`视频 ${report.videos.total} 个；缺少封面：${report.videos.missingPoster}，未使用 preload=metadata：${report.videos.missingMetadataPreload}。`);
