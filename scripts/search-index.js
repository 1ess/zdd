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
  const contents = [];
  const items = posts.map(function (post) {
    const labels = names(post.tags).concat(names(post.categories));
    const content = plainText(post.content);
    // The initial 180 characters already live in metadata; keep only the tail here.
    contents.push(content.slice(180, 500));
    // Compact tuple: title, URL, date, labels and a lightweight initial excerpt.
    return [
      post.title,
      hexo.config.root + post.path,
      post.date ? post.date.format('YYYY-MM-DD') : '',
      labels.slice(0, 5).join(' · '),
      content.slice(0, 180)
    ];
  });

  return [
    { path: 'search-index.json', data: JSON.stringify(items) },
    { path: 'search-content.json', data: JSON.stringify(contents) }
  ];
});
