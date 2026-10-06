'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'public-pages');
const read = (name) => fs.readFileSync(path.join(output, name), 'utf8');
const site = 'https://blog.zhangdd.tech';
const cdn = 'https://blogcdn.zhangdd.tech';
const files = [];
function walk(directory, relative = '') {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const name = path.join(relative, entry.name);
    assert(!entry.isSymbolicLink(), `Unexpected symlink: ${name}`);
    assert(!entry.name.startsWith('.'), `Unexpected hidden file: ${name}`);
    if (entry.isDirectory()) walk(path.join(directory, entry.name), name);
    else files.push(name);
  }
}
walk(output);
assert(files.length <= 20000, 'Pages Free file-count limit exceeded');
for (const name of files) {
  assert(fs.statSync(path.join(output, name)).size <= 25 * 1024 * 1024, `Asset exceeds 25 MiB: ${name}`);
  assert(!/(?:^|\/)(?:CNAME|node_modules|media-report.json|remote-media-report.json|package.json|package-lock.json|vercel.json|_worker.js)$/.test(name), `Unexpected build input: ${name}`);
  assert(!/\.(?:md|ya?ml|map)$/.test(name), `Unexpected source file: ${name}`);
}
const htmlFiles = files.filter((name) => name.endsWith('.html'));
let canonicals = 0;
for (const name of htmlFiles) {
  const html = read(name);
  for (const match of html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/g)) {
    assert.equal(new URL(match[1]).origin, site, `Incorrect canonical: ${name}`);
    canonicals++;
  }
  // All direct URL references to the original hosts must be migrated.
  assert(!/(?:["'\s>])(?:https?:)?\/\/(?:cdn\.)?zhangdd\.tech(?:[/?#]|["'\s<])/i.test(html), `Original-domain URL remains: ${name}`);
}
assert(canonicals > 0, 'No canonical URLs found');
assert(read('index.html').includes(`href="${site}/"`), 'Homepage canonical missing');
assert(read('index.html').includes(`${cdn}/`), 'Homepage must use the Pages CDN');
assert(read('about/index.html').includes(`${cdn}/contentImg/about/about.webp`), 'About image uses wrong CDN');
assert(read('robots.txt').includes(`Sitemap: ${site}/sitemap.xml`), 'Incorrect robots sitemap');
for (const match of read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)) {
  assert.equal(new URL(match[1]).origin, site, 'Incorrect sitemap origin');
}
assert(read('sitemap.xml').includes(`<loc>${site}/`), 'Sitemap has no Pages URLs');
assert(read('atom.xml').includes(`<id>${site}/</id>`), 'RSS channel ID uses wrong origin');
assert(!/https?:\/\/(?:cdn\.)?zhangdd\.tech[\/\s<]/.test(read('atom.xml')), 'RSS still references the original domains');
assert(read('footprints/index.html').includes('https://api.maptiler.com/maps/streets-v2/style.json'), 'MapTiler URL unexpectedly changed');
const manifest = JSON.parse(read('search-index.json'));
assert(/^\/search\/content\.[a-f0-9]{16}\.json$/.test(manifest.contentUrl), 'Unexpected search content path');
const content = JSON.parse(read(manifest.contentUrl.slice(1)));
const version = crypto.createHash('sha256').update(JSON.stringify(content.contents)).digest('hex').slice(0, 16);
assert.equal(content.version, version, 'Search body fingerprint mismatch');
assert.equal(manifest.version, version, 'Search manifest fingerprint mismatch');
assert.equal(manifest.contentUrl, `/search/content.${version}.json`);

// The original build remains the deployable rollback target.
assert(fs.readFileSync(path.join(root, 'public/index.html'), 'utf8').includes('href="https://zhangdd.tech/"'), 'Vercel canonical was changed');
assert(fs.readFileSync(path.join(root, 'source/robots.txt'), 'utf8').includes('https://zhangdd.tech/sitemap.xml'), 'Source robots was changed');
console.log(`Pages checks passed: ${files.length} files, ${htmlFiles.length} HTML pages, ${canonicals} canonical URLs, both build targets preserved.`);
