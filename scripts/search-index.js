'use strict';

const crypto = require('crypto');
function digest(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 16);
}

function plainText(value) {
  return String(value || '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

hexo.extend.generator.register('search-index', function (locals) {
  function names(relation) {
    if (!relation) return [];
    const records = typeof relation.toArray === 'function' ? relation.toArray() : Array.from(relation);
    return records.map(function (item) { return item.name; });
  }

  const posts = locals.posts.sort('-date').toArray();
  const contents = Object.create(null);
  const recent = Object.create(null);
  const items = posts.map(function (post, position) {
    const url = hexo.config.root + post.path;
    const id = digest(url);
    if (Object.prototype.hasOwnProperty.call(contents, id)) throw new Error('Duplicate search article ID: ' + url);
    const labels = Array.from(new Set(names(post.tags).concat(names(post.categories))));
    // Preserve the existing 500-character coverage; fetch body text only on search.
    contents[id] = plainText(post.content).slice(0, 500);
    if (position < 12) recent[id] = contents[id].slice(0, 180);
    // Stable IDs associate bodies with metadata even when publication order changes.
    return [post.title, url, post.date ? post.date.format('YYYY-MM-DD') : '', labels.join(' · '), id];
  });

  const version = digest(JSON.stringify(contents));
  const contentPath = 'search/content.' + version + '.json';
  return [
    { path: 'search-index.json', data: JSON.stringify({ schema: 2, version, contentUrl: hexo.config.root + contentPath, items, recent }) },
    { path: contentPath, data: JSON.stringify({ schema: 2, version, contents }) }
  ];
});
