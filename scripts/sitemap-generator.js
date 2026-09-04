'use strict';

function escapeXml(value) {
  return String(value).replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character]));
}

hexo.extend.generator.register('native-sitemap', function (locals) {
  const base = this.config.url.replace(/\/$/, '') + (this.config.root || '/');
  const records = [];
  const add = (item, priority) => {
    if (!item.path || item.path === '404.html' || item.path === 'search-index.json') return;
    records.push({
      location: new URL(item.path.replace(/index\.html$/, ''), base).toString(),
      modified: (item.updated || item.date) && new Date(item.updated || item.date).toISOString().slice(0, 10),
      priority
    });
  };
  locals.posts.forEach((post) => add(post, '0.8'));
  locals.pages.forEach((page) => add(page, page.path === 'index.html' ? '1.0' : '0.6'));
  const unique = Array.from(new Map(records.map((record) => [record.location, record])).values());
  const body = unique.map((record) => `  <url>\n    <loc>${escapeXml(record.location)}</loc>${record.modified ? `\n    <lastmod>${record.modified}</lastmod>` : ''}\n    <priority>${record.priority}</priority>\n  </url>`).join('\n');
  return { path: 'sitemap.xml', data: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n` };
});
