'use strict';

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
  const items = posts.map(function (post) {
    return {
      title: post.title,
      url: hexo.config.root + post.path,
      date: post.date ? post.date.format('YYYY-MM-DD') : '',
      tags: names(post.tags),
      categories: names(post.categories),
      content: plainText(post.content).slice(0, 1600)
    };
  });

  const json = JSON.stringify(items);
  return [
    { path: 'search-index.json', data: json },
    { path: 'search-index.js', data: 'window.__BLOG_SEARCH_INDEX__=' + json.replace(/[\u2028\u2029]/g, '') + ';\n' }
  ];
});
