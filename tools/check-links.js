'use strict';

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const htmlFiles = [];
const errors = [];
let checked = 0;

function walk(directory) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith('.html')) htmlFiles.push(target);
  });
}

function isLocalReference(value) {
  return value && !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value);
}

function targetExists(fromFile, reference) {
  const cleanReference = reference.split('#')[0].split('?')[0];
  if (!cleanReference) return true;
  let decoded;
  try {
    decoded = decodeURIComponent(cleanReference);
  } catch (_) {
    return false;
  }
  const candidate = decoded.startsWith('/')
    ? path.join(publicDir, decoded.slice(1))
    : path.resolve(path.dirname(fromFile), decoded);
  const attempts = [candidate, `${candidate}.html`, path.join(candidate, 'index.html')];
  return attempts.some((attempt) => fs.existsSync(attempt));
}

if (!fs.existsSync(publicDir)) {
  console.error('未找到 public 目录，请先生成站点。');
  process.exit(1);
}

walk(publicDir);
htmlFiles.forEach((file) => {
  const html = fs.readFileSync(file, 'utf8')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const pattern = /\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const reference = match[2].trim();
    if (!isLocalReference(reference)) continue;
    checked += 1;
    if (!targetExists(file, reference)) {
      errors.push(`${path.relative(publicDir, file)} 引用了不存在的本地资源：${reference}`);
    }
  }
});

if (errors.length) {
  console.error('站内链接检查失败：\n- ' + errors.slice(0, 50).join('\n- ') + (errors.length > 50 ? `\n- 另有 ${errors.length - 50} 项。` : ''));
  process.exit(1);
}

console.log(`站内链接检查通过：${htmlFiles.length} 个页面，${checked} 个本地引用。`);
