'use strict';

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  console.error('未找到 public 目录，请先生成站点。');
  process.exit(1);
}

const htmlFiles = [];
function walk(directory) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith('.html')) htmlFiles.push(target);
  });
}
walk(publicDir);

const errors = [];
let imageCount = 0;
htmlFiles.forEach((file) => {
  const html = fs.readFileSync(file, 'utf8');
  if (/lazyload-outer-wrap/i.test(html)) errors.push(`${path.relative(publicDir, file)} 仍包含过期 lazyload-outer-wrap 标记。`);
  imageCount += (html.match(/<img\b/gi) || []).length;
});

['index.html', path.join('footprints', 'index.html'), path.join('about', 'index.html')].forEach((page) => {
  if (!fs.existsSync(path.join(publicDir, page))) errors.push(`缺少关键页面：/${page.replace(/\\/g, '/')}`);
});

if (errors.length) {
  console.error('站点冒烟检查失败：\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log(`站点冒烟检查通过：${htmlFiles.length} 个 HTML 页面，${imageCount} 个图片标签。`);
