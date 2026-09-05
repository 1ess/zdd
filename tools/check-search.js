'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
let generate;
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../scripts/search-index.js'), 'utf8'), {
  require,
  hexo: { config: { root: '/' }, extend: { generator: { register: (name, callback) => { generate = callback; } } } }
});

function build(posts) {
  const routes = generate({ posts: { sort: () => ({ toArray: () => posts }) } });
  const manifest = JSON.parse(routes[0].data);
  const content = JSON.parse(routes[1].data);
  assert.equal(manifest.version, content.version);
  assert.equal(manifest.contentUrl, '/' + routes[1].path);
  assert.equal(Object.keys(content.contents).length, manifest.items.length);
  for (const item of manifest.items) assert.equal(typeof content.contents[item[4]], 'string');
  return { manifest, content };
}

const article = (title, slug, text) => ({ title, path: slug + '/', content: '<p>' + text + '</p>', date: { format: () => '2026-09-05' }, tags: [{ name: '测试' }], categories: [] });
const oldPost = article('旧游记', 'old-trip', '甲'.repeat(178) + '跨越摘要边界' + '乙'.repeat(400));
const first = build([oldPost]);
const newPost = article('新游记', 'new-trip', '新增地点 新的足迹');
const next = build([newPost, oldPost]);
assert.equal(next.manifest.items[1][4], first.manifest.items[0][4], '新增文章不能改变旧文章 ID');
assert.notEqual(next.manifest.contentUrl, first.manifest.contentUrl, '新增文章必须更新正文文件指纹');
assert.equal(next.content.contents[first.manifest.items[0][4]], first.content.contents[first.manifest.items[0][4]], '新旧正文不能错配');
assert(next.content.contents[first.manifest.items[0][4]].includes('跨越摘要边界'), '摘要边界不能插入空格破坏关键词');
assert.equal(build([oldPost, newPost]).manifest.items[0][4], first.manifest.items[0][4], '排序不改变 ID');
const edited = build([{ ...oldPost, content: '<p>修改后的内容</p>' }]);
assert.notEqual(edited.manifest.contentUrl, first.manifest.contentUrl, '修改正文必须更新文件指纹');
const many = build(Array.from({ length: 35 }, (_, index) => article('文章' + index, 'post-' + index, '内容'.repeat(300))));
assert.equal(many.manifest.items.length, 35);
assert.equal(Object.keys(many.manifest.recent).length, 12, '首屏只携带近期文章摘要');
assert(many.manifest.items.every((item) => item[4].length === 16), '元数据不携带每篇正文');
assert.equal(build([]).manifest.items.length, 0, '空站点也可构建');
assert.throws(() => build([oldPost, oldPost]), /Duplicate search article ID/);
console.log('搜索协议检查通过：新增文章、排序、正文修改、摘要边界、空站点及重复 URL。');
