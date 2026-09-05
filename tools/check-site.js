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
const cssDir = path.join(publicDir, 'css');
if (fs.existsSync(cssDir)) {
  fs.readdirSync(cssDir).filter((name) => name.endsWith('.css')).forEach((name) => {
    if (/sourceMappingURL/.test(fs.readFileSync(path.join(cssDir, name), 'utf8'))) errors.push(`${name} 意外包含 source map，请通过 npm run build 编译。`);
  });
}
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
    const searchManifest = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
    const searchIndex = searchManifest.items;
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

    if (searchManifest.schema !== 2 || !Array.isArray(searchIndex)) {
      errors.push('搜索索引格式错误：需要 schema 2 及 items 数组。');
    } else {
      if (searchIndex.length !== sourcePostCount) {
        errors.push(`搜索索引包含 ${searchIndex.length} 篇，但 source/_posts 中有 ${sourcePostCount} 篇。`);
      }
      const malformed = searchIndex.some((item) => !Array.isArray(item) || item.length !== 5 || !item[0] || !item[1]);
      if (malformed) errors.push('搜索索引条目格式错误。');
      const urls = searchIndex.map((item) => item && item[1]).filter(Boolean);
      if (new Set(urls).size !== urls.length) errors.push('搜索索引中存在重复 URL。');
      const contentMatch = String(searchManifest.contentUrl).match(/\/search\/(content\.[a-f0-9]{16}\.json)$/);
      if (!contentMatch) throw new Error('搜索正文文件路径格式错误。');
      const searchContent = JSON.parse(fs.readFileSync(path.join(publicDir, 'search', contentMatch[1]), 'utf8'));
      if (searchContent.schema !== 2 || searchContent.version !== searchManifest.version) errors.push('搜索正文与元数据版本不一致。');
      const ids = searchIndex.map((item) => item[4]);
      if (new Set(ids).size !== ids.length) errors.push('搜索索引存在重复文章 ID。');
      if (!searchContent.contents || Object.keys(searchContent.contents).length !== ids.length ||
          ids.some((id) => typeof searchContent.contents[id] !== 'string')) errors.push('搜索正文存在缺失或多余的文章 ID。');
      if (!searchManifest.recent || Object.keys(searchManifest.recent).length > 12 ||
          Object.keys(searchManifest.recent).some((id) => !ids.includes(id))) errors.push('最近文章摘要索引无效。');
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
