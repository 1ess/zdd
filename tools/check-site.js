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

['index.html', '404.html', path.join('footprints', 'index.html'), path.join('about', 'index.html'), path.join('search', 'index.html'), 'search-index.json', 'sitemap.xml', 'robots.txt', 'manifest.webmanifest', 'service-worker.js'].forEach((page) => {
  if (!fs.existsSync(path.join(publicDir, page))) errors.push(`缺少关键页面：/${page.replace(/\\/g, '/')}`);
});

const homeHtml = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
if (!/<link rel="manifest"/i.test(homeHtml)) errors.push('首页缺少 Web App Manifest 声明。');
if (!/<script type="application\/ld\+json">/i.test(homeHtml)) errors.push('首页缺少 JSON-LD 结构化数据。');
if (!/<link rel="canonical"/i.test(homeHtml)) errors.push('首页缺少 canonical URL。');

const searchIndexPath = path.join(publicDir, 'search-index.json');
if (fs.existsSync(searchIndexPath)) {
  try {
    const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
    const postsDir = path.join(__dirname, '..', 'source', '_posts');
    let sourcePostCount = 0;
    function countPosts(directory) {
      fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) countPosts(target);
        else if (/\.md$/i.test(entry.name)) sourcePostCount += 1;
      });
    }
    countPosts(postsDir);

    if (!Array.isArray(searchIndex)) {
      errors.push('搜索索引格式错误：根节点必须是数组。');
    } else {
      if (searchIndex.length !== sourcePostCount) {
        errors.push(`搜索索引包含 ${searchIndex.length} 篇，但 source/_posts 中有 ${sourcePostCount} 篇。`);
      }
      const malformed = searchIndex.some((item) => !Array.isArray(item) || item.length !== 5 || !item[0] || !item[1]);
      if (malformed) errors.push('搜索索引条目格式错误。');
      const urls = searchIndex.map((item) => item && item[1]).filter(Boolean);
      if (new Set(urls).size !== urls.length) errors.push('搜索索引中存在重复 URL。');
    }
  } catch (error) {
    errors.push(`搜索索引无法解析：${error.message}`);
  }
}

if (errors.length) {
  console.error('站点冒烟检查失败：\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log(`站点冒烟检查通过：${htmlFiles.length} 个 HTML 页面，${imageCount} 个图片标签。`);
