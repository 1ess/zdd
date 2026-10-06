'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { spawnSync } = require('node:child_process');
const { getPagesConfig } = require('../tools/pages-config');

const builderPath = path.join(__dirname, '../tools/build-pages.js');
function builder() {
  assert.ok(fs.existsSync(builderPath), 'Pages output builder must exist');
  return require(builderPath);
}
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'zdd-pages-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const source = path.join(root, 'public');
  const output = path.join(root, 'public-pages');
  fs.mkdirSync(source);
  const write = (name, value) => {
    fs.mkdirSync(path.dirname(path.join(source, name)), { recursive: true });
    fs.writeFileSync(path.join(source, name), value);
  };
  return { root, source, output, write, read: (name) => fs.readFileSync(path.join(output, name)) };
}

test('rewrites owned URL origins while preserving unrelated links and paths', () => {
  const { rewriteOrigins } = builder();
  const original = '<link href="https://zhangdd.tech/a/?q=1#top"> ' +
    '<img src="https://cdn.zhangdd.tech/contentImg/a.webp?v=2"> ' +
    'url(//cdn.zhangdd.tech/blogImg/a.webp) https://zhangdd.tech ' +
    'https://example.com/?next=https://zhangdd.tech/a/ ' +
    'https://cdn.zhangdd.tech.example.com/a https://zhangdd.tech:8443/a ' +
    'https://api.maptiler.com/maps/streets-v2/style.json?key=public-key';
  assert.equal(rewriteOrigins(original, getPagesConfig({})), '<link href="https://blog.zhangdd.tech/a/?q=1#top"> ' +
    '<img src="https://blogcdn.zhangdd.tech/contentImg/a.webp?v=2"> ' +
    'url(https://blogcdn.zhangdd.tech/blogImg/a.webp) https://blog.zhangdd.tech ' +
    'https://example.com/?next=https://zhangdd.tech/a/ ' +
    'https://cdn.zhangdd.tech.example.com/a https://zhangdd.tech:8443/a ' +
    'https://api.maptiler.com/maps/streets-v2/style.json?key=public-key');
});

test('builds distinct Pages HTML, RSS, sitemap, robots and media URLs without touching the original', (t) => {
  const f = fixture(t);
  const files = {
    'index.html': '<link rel="canonical" href="https://zhangdd.tech/"><img src="https://cdn.zhangdd.tech/a.webp">',
    '404.html': '<p>Not found</p>',
    'atom.xml': '<id>https://zhangdd.tech/</id>',
    'sitemap.xml': '<loc>https://zhangdd.tech/article/</loc>',
    'robots.txt': 'Sitemap: https://zhangdd.tech/sitemap.xml',
    'footprints/index.html': 'https://api.maptiler.com/maps/streets-v2/style.json?key=public-key',
    'css/style.css': 'body{background:url(https://cdn.zhangdd.tech/bg.webp)}',
    'images/test.png': Buffer.from([0, 255, 127, 0, 23])
  };
  Object.entries(files).forEach(([name, value]) => f.write(name, value));
  builder().preparePages(f.source, f.output, {});
  assert.match(f.read('index.html').toString(), /href="https:\/\/blog\.zhangdd\.tech\/"/);
  assert.match(f.read('index.html').toString(), /https:\/\/blogcdn\.zhangdd\.tech\/a.webp/);
  assert.equal(f.read('atom.xml').toString(), '<id>https://blog.zhangdd.tech/</id>');
  assert.equal(f.read('sitemap.xml').toString(), '<loc>https://blog.zhangdd.tech/article/</loc>');
  assert.equal(f.read('robots.txt').toString(), 'Sitemap: https://blog.zhangdd.tech/sitemap.xml');
  assert.equal(f.read('css/style.css').toString(), 'body{background:url(https://blogcdn.zhangdd.tech/bg.webp)}');
  assert.deepEqual(f.read('images/test.png'), files['images/test.png']);
  assert.equal(f.read('footprints/index.html').toString(), files['footprints/index.html']);
  for (const [name, value] of Object.entries(files)) {
    assert.deepEqual(fs.readFileSync(path.join(f.source, name)), Buffer.from(value));
  }
});

test('cleans old output and omits reports, source files, host settings and hidden files', (t) => {
  const f = fixture(t);
  ['CNAME', 'media-report.json', 'remote-media-report.json', '.env', '.git/config', 'node_modules/pkg/index.js',
    'package.json', 'package-lock.json', 'vercel.json', 'README.md', '_config.yml', 'style.css.map', '_worker.js'].forEach((name) => f.write(name, 'private build input'));
  f.write('index.html', '<p>New</p>');
  f.write('404.html', '<p>Not found</p>');
  fs.mkdirSync(f.output);
  fs.writeFileSync(path.join(f.output, 'obsolete.html'), 'stale');
  builder().preparePages(f.source, f.output, {});
  assert.deepEqual(fs.readdirSync(f.output).sort(), ['404.html', 'index.html']);
});

test('rejects overlapping paths or missing input before deleting anything', (t) => {
  const f = fixture(t);
  f.write('index.html', 'preserve');
  const { preparePages } = builder();
  for (const output of [f.source, path.join(f.source, 'nested'), f.root]) {
    assert.throws(() => preparePages(f.source, output, {}), /overlap/i);
  }
  fs.mkdirSync(f.output);
  fs.writeFileSync(path.join(f.output, 'keep.html'), 'preserve');
  assert.throws(() => preparePages(path.join(f.root, 'missing'), f.output, {}), /input|ENOENT/i);
  assert.equal(f.read('keep.html').toString(), 'preserve');
  assert.equal(fs.readFileSync(path.join(f.source, 'index.html'), 'utf8'), 'preserve');
});

test('rejects symlinks rather than copying files outside generated output', (t) => {
  const f = fixture(t);
  fs.writeFileSync(path.join(f.root, 'private.txt'), 'secret');
  fs.symlinkSync(path.join(f.root, 'private.txt'), path.join(f.source, 'linked.txt'));
  assert.throws(() => builder().preparePages(f.source, f.output, {}), /symbolic|symlink/i);
});

test('fails on assets above the Pages Free 25 MiB limit', (t) => {
  const f = fixture(t);
  f.write('large.mp4', '');
  fs.truncateSync(path.join(f.source, 'large.mp4'), 25 * 1024 * 1024 + 1);
  assert.throws(() => builder().preparePages(f.source, f.output, {}), /25 MiB/);
});

test('fails on more than 20,000 Pages Free output files', (t) => {
  const f = fixture(t);
  for (let i = 0; i < 20001; i++) f.write(`${i}.txt`, '');
  assert.throws(() => builder().preparePages(f.source, f.output, {}), /20,000/);
});

test('keeps search manifest and fingerprinted body consistent when a text URL changes', (t) => {
  const f = fixture(t);
  const contents = { abc: 'Visit https://zhangdd.tech/article/' };
  const oldVersion = crypto.createHash('sha256').update(JSON.stringify(contents)).digest('hex').slice(0, 16);
  f.write(`search/content.${oldVersion}.json`, JSON.stringify({ schema: 2, version: oldVersion, contents }));
  f.write('search-index.json', JSON.stringify({ schema: 2, version: oldVersion, contentUrl: `/search/content.${oldVersion}.json`, items: [], recent: contents }));
  builder().preparePages(f.source, f.output, {});
  const manifest = JSON.parse(f.read('search-index.json'));
  const content = JSON.parse(f.read(manifest.contentUrl.slice(1)));
  const newVersion = crypto.createHash('sha256').update(JSON.stringify(content.contents)).digest('hex').slice(0, 16);
  assert.equal(content.contents.abc, 'Visit https://blog.zhangdd.tech/article/');
  assert.notEqual(newVersion, oldVersion);
  assert.equal(manifest.version, newVersion);
  assert.equal(content.version, newVersion);
  assert.equal(manifest.contentUrl, `/search/content.${newVersion}.json`);
  assert.equal(fs.existsSync(path.join(f.output, `search/content.${oldVersion}.json`)), false);
});

test('Pages origins default independently and normalize root slashes and host casing', () => {
  assert.deepEqual(getPagesConfig({}), { site: 'https://blog.zhangdd.tech', cdn: 'https://blogcdn.zhangdd.tech' });
  assert.deepEqual(getPagesConfig({ PAGES_SITE_URL: 'HTTPS://ZDD-BLOG.PAGES.DEV/' }), {
    site: 'https://zdd-blog.pages.dev', cdn: 'https://blogcdn.zhangdd.tech'
  });
  assert.deepEqual(getPagesConfig({ PAGES_CDN_URL: 'https://zdd-blogcdn.pages.dev/' }), {
    site: 'https://blog.zhangdd.tech', cdn: 'https://zdd-blogcdn.pages.dev'
  });
  assert.equal(getPagesConfig({ PAGES_SITE_URL: 'https://[::1]:8443/' }).site, 'https://[::1]:8443');
  assert.equal(getPagesConfig({ PAGES_SITE_URL: 'https://例子.测试/' }).site, 'https://xn--fsqu00a.xn--0zwm56d');
});

test('invalid Pages origins name the variable and leave previous output intact', (t) => {
  const f = fixture(t);
  f.write('index.html', 'source untouched');
  fs.mkdirSync(f.output);
  fs.writeFileSync(path.join(f.output, 'keep.html'), 'previous output');
  for (const name of ['PAGES_SITE_URL', 'PAGES_CDN_URL']) {
    for (const value of ['', ' ', 'example.com', '//example.com', 'http://example.com', 'ftp://example.com',
      'https://user:password@example.com', 'https://example.com/path', 'https://example.com/a/..',
      'https://example.com/%2e', 'https://example.com?',
      'https://example.com/#', 'https://example.com/\n', 'https://example.com\\', 'https://example.com:99999', 42]) {
      assert.throws(() => builder().preparePages(f.source, f.output, { [name]: value }),
        (error) => error.message.startsWith(`${name} must be an absolute HTTPS origin`));
      assert.equal(f.read('keep.html').toString(), 'previous output');
      assert.equal(fs.readFileSync(path.join(f.source, 'index.html'), 'utf8'), 'source untouched');
    }
  }
});

test('Pages build and checker CLIs agree for default, pages.dev and original-origin targets', (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.root, 'tools'));
  for (const name of ['build-pages.js', 'check-pages.js', 'pages-config.js']) {
    fs.copyFileSync(path.join(__dirname, '..', 'tools', name), path.join(f.root, 'tools', name));
  }
  fs.mkdirSync(path.join(f.root, 'source'));
  fs.writeFileSync(path.join(f.root, 'source/robots.txt'), 'Sitemap: https://zhangdd.tech/sitemap.xml');
  f.write('index.html', '<link rel="canonical" href="https://zhangdd.tech/"><img src="https://cdn.zhangdd.tech/a.webp">');
  f.write('about/index.html', '<link rel="canonical" href="https://zhangdd.tech/about/"><img src="https://cdn.zhangdd.tech/contentImg/about/about.webp">');
  f.write('atom.xml', '<id>https://zhangdd.tech/</id><content>https://cdn.zhangdd.tech/video.mp4</content>');
  f.write('sitemap.xml', '<loc>https://zhangdd.tech/</loc>');
  f.write('robots.txt', 'Sitemap: https://zhangdd.tech/sitemap.xml');
  f.write('footprints/index.html', 'https://api.maptiler.com/maps/streets-v2/style.json?key=public-key');
  f.write('data.json', JSON.stringify({ url: 'https://zhangdd.tech/post/?q=1#top', video: 'https://cdn.zhangdd.tech/video.mp4' }));
  f.write('binary.png', Buffer.from([0, 255, 17]));
  const contents = { post: 'Article https://zhangdd.tech/post/ and https://cdn.zhangdd.tech/video.mp4' };
  const version = crypto.createHash('sha256').update(JSON.stringify(contents)).digest('hex').slice(0, 16);
  f.write(`search/content.${version}.json`, JSON.stringify({ version, contents }));
  f.write('search-index.json', JSON.stringify({ version, contentUrl: `/search/content.${version}.json`, items: [], recent: contents }));
  const original = fs.readFileSync(path.join(f.source, 'index.html'));
  const baseEnv = { ...process.env };
  delete baseEnv.PAGES_SITE_URL;
  delete baseEnv.PAGES_CDN_URL;
  const run = (name, vars) => spawnSync(process.execPath, [path.join(f.root, 'tools', name)], {
    env: { ...baseEnv, ...vars }, encoding: 'utf8'
  });
  for (const vars of [{}, {
    PAGES_SITE_URL: 'https://zdd-blog.pages.dev/', PAGES_CDN_URL: 'https://zdd-blogcdn.pages.dev/'
  }, { PAGES_SITE_URL: 'https://zhangdd.tech', PAGES_CDN_URL: 'https://cdn.zhangdd.tech' }]) {
    const config = getPagesConfig(vars);
    const built = run('build-pages.js', vars);
    assert.equal(built.status, 0, built.stderr);
    const checked = run('check-pages.js', vars);
    assert.equal(checked.status, 0, checked.stderr);
    const data = JSON.parse(f.read('data.json'));
    assert.equal(data.url, `${config.site}/post/?q=1#top`);
    assert.equal(data.video, `${config.cdn}/video.mp4`);
    assert.deepEqual(f.read('binary.png'), Buffer.from([0, 255, 17]));
    assert.deepEqual(fs.readFileSync(path.join(f.source, 'index.html')), original);
    const manifest = JSON.parse(f.read('search-index.json'));
    const body = JSON.parse(f.read(manifest.contentUrl.slice(1)));
    assert.equal(body.contents.post, `Article ${config.site}/post/ and ${config.cdn}/video.mp4`);
    if (vars.PAGES_SITE_URL?.includes('pages.dev')) {
      assert.notEqual(run('check-pages.js', {}).status, 0, 'Checker must reject mismatched target configuration');
    }
  }
  for (const value of ['https://user:password@example.com', 'https://foo"bar', "https://foo'bar", 'https://foo`bar',
    'https://foo%22bar', 'https://foo%27bar', 'https://foo%60bar']) {
    for (const name of ['build-pages.js', 'check-pages.js']) {
      const bad = run(name, { PAGES_CDN_URL: value });
      assert.notEqual(bad.status, 0);
      assert.match(bad.stderr, /PAGES_CDN_URL must be/);
      assert(!bad.stderr.includes(value), 'Configuration errors must not echo invalid input');
      assert(!bad.stderr.includes('user:password'), 'Configuration errors must not echo credentials');
    }
  }
});

test('invalid Pages hostnames fail before replacing output and do not echo input', (t) => {
  const f = fixture(t);
  f.write('index.html', 'source untouched');
  fs.mkdirSync(f.output);
  fs.writeFileSync(path.join(f.output, 'keep.html'), 'previous output');
  const values = ['https://foo"bar', "https://foo'bar", 'https://foo`bar',
    'https://foo%22bar', 'https://foo%27bar', 'https://foo%60bar',
    'https://foo!bar', 'https://foo_bar', 'https://-foo.example', 'https://foo-.example',
    'https://foo..example', `https://${'a'.repeat(64)}.example`];
  for (const name of ['PAGES_SITE_URL', 'PAGES_CDN_URL']) {
    for (const value of values) {
      assert.throws(() => builder().preparePages(f.source, f.output, { [name]: value }), (error) => {
        assert.equal(error.message, `${name} must be an absolute HTTPS origin without credentials, a path, query or fragment.`);
        return true;
      });
      assert.equal(f.read('keep.html').toString(), 'previous output');
      assert.equal(fs.readFileSync(path.join(f.source, 'index.html'), 'utf8'), 'source untouched');
    }
  }
});
