'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

// Produce a separate deploy directory. Never change Hexo inputs or Vercel's public/.
const origins = {
  'zhangdd.tech': 'blog.zhangdd.tech',
  'cdn.zhangdd.tech': 'blogcdn.zhangdd.tech'
};
const textExtensions = new Set(['.html', '.xml', '.txt', '.json', '.geojson', '.webmanifest', '.css', '.js', '.svg']);
const omittedNames = new Set(['CNAME', 'node_modules', 'package.json', 'package-lock.json', 'yarn.lock',
  'vercel.json', 'media-report.json', 'remote-media-report.json', '_worker.js', '_routes.json']);

function rewriteOrigins(text) {
  // Match complete URL tokens so an owned URL inside a third-party query is untouched.
  return text.replace(/(?:https?:)?\/\/[^\s"'<>`\\)]+/gi, (url) =>
    url.replace(/^(?:https?:)?\/\/(cdn\.zhangdd\.tech|zhangdd\.tech)(?=[/?#]|$)/i,
      (_, host) => 'https://' + origins[host.toLowerCase()]));
}

function omitted(name) {
  return name.startsWith('.') || omittedNames.has(name) || /\.(?:md|ya?ml|map)$/i.test(name);
}

function collectFiles(directory, relative = '', files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (omitted(entry.name)) continue;
    const source = path.join(directory, entry.name);
    const name = path.join(relative, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symbolic links are not deployable: ${name}`);
    if (entry.isDirectory()) collectFiles(source, name, files);
    else if (entry.isFile()) files.push({ source, name, size: fs.statSync(source).size });
    else throw new Error(`Unsupported file type: ${name}`);
  }
  return files;
}

function checkLimits(files) {
  if (files.length > 20000) throw new Error(`Pages Free allows at most 20,000 files; found ${files.length}.`);
  const oversized = files.find((file) => file.size > 25 * 1024 * 1024);
  if (oversized) throw new Error(`Pages asset exceeds 25 MiB: ${oversized.name}`);
}

function refreshSearchFingerprint(directory) {
  const manifestPath = path.join(directory, 'search-index.json');
  if (!fs.existsSync(manifestPath)) return;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!/^\/search\/content\.[a-f0-9]{16}\.json$/.test(manifest.contentUrl)) {
    throw new Error('Unexpected search content path.');
  }
  const oldPath = path.join(directory, manifest.contentUrl.slice(1));
  const content = JSON.parse(fs.readFileSync(oldPath, 'utf8'));
  const version = crypto.createHash('sha256').update(JSON.stringify(content.contents)).digest('hex').slice(0, 16);
  content.version = manifest.version = version;
  manifest.contentUrl = `/search/content.${version}.json`;
  const newPath = path.join(directory, manifest.contentUrl.slice(1));
  fs.writeFileSync(newPath, JSON.stringify(content));
  fs.writeFileSync(manifestPath, JSON.stringify(manifest));
  if (oldPath !== newPath) fs.unlinkSync(oldPath);
}

function preparePages(inputDirectory, outputDirectory) {
  const input = path.resolve(inputDirectory);
  const output = path.resolve(outputDirectory);
  if (input === output || input.startsWith(output + path.sep) || output.startsWith(input + path.sep)) {
    throw new Error('Pages input and output directories must not overlap.');
  }
  if (!fs.statSync(input).isDirectory()) throw new Error('Pages input must be a directory.');
  const files = collectFiles(input);
  checkLimits(files);
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  for (const file of files) {
    const destination = path.join(output, file.name);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    if (textExtensions.has(path.extname(file.name).toLowerCase())) {
      fs.writeFileSync(destination, rewriteOrigins(fs.readFileSync(file.source, 'utf8')));
    } else {
      fs.copyFileSync(file.source, destination);
    }
  }
  refreshSearchFingerprint(output);
  const result = collectFiles(output);
  checkLimits(result); // Rewriting can make a file larger.
  return { files: result.length, bytes: result.reduce((sum, file) => sum + file.size, 0) };
}

if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const result = preparePages(path.join(root, 'public'), path.join(root, 'public-pages'));
  console.log(`Pages output ready: public-pages/ (${result.files} files, ${result.bytes} bytes).`);
}

module.exports = { rewriteOrigins, preparePages };
