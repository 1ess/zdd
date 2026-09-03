'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const publicDir = path.join(__dirname, '..', 'public');
const reportFile = path.join(publicDir, 'remote-media-report.json');
const limitArgument = process.argv.find((arg) => arg.startsWith('--limit='));
const limit = limitArgument ? Number(limitArgument.split('=')[1]) : Infinity;
const concurrency = 8;

function walk(directory, files) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target, files);
    else if (entry.name.endsWith('.html')) files.push(target);
  });
}

function collectUrls() {
  const files = [];
  walk(publicDir, files);
  const urls = new Set();
  files.forEach((file) => {
    const html = fs.readFileSync(file, 'utf8');
    const pattern = /<(?:img|video)\b[^>]*\bsrc\s*=\s*(["'])(https?:\/\/.*?)\1/gi;
    let match;
    while ((match = pattern.exec(html))) urls.add(match[2]);
  });
  return [...urls].slice(0, Number.isFinite(limit) ? limit : undefined);
}

function request(url, method = 'HEAD', redirects = 0) {
  return new Promise((resolve) => {
    const client = url.startsWith('https:') ? https : http;
    const requestInstance = client.request(url, { method, timeout: 10000, headers: { 'User-Agent': 'zdd-site-media-check/1.0' } }, (response) => {
      const status = response.statusCode || 0;
      const location = response.headers.location;
      response.resume();
      if (status >= 300 && status < 400 && location && redirects < 3) {
        resolve(request(new URL(location, url).toString(), method, redirects + 1));
        return;
      }
      if ((status === 405 || status === 403) && method === 'HEAD') {
        resolve(request(url, 'GET', redirects));
        return;
      }
      resolve({ url, status, contentType: response.headers['content-type'] || '', ok: status >= 200 && status < 400 });
    });
    requestInstance.on('timeout', () => requestInstance.destroy(new Error('请求超时')));
    requestInstance.on('error', (error) => resolve({ url, status: 0, contentType: '', ok: false, error: error.message }));
    requestInstance.end();
  });
}

async function main() {
  if (!fs.existsSync(publicDir)) throw new Error('未找到 public 目录，请先生成站点。');
  const urls = collectUrls();
  const results = [];
  let cursor = 0;
  async function worker() {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      results.push(await request(url));
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, worker));
  results.sort((a, b) => a.url.localeCompare(b.url));
  const failures = results.filter((item) => !item.ok);
  const invalidTypes = results.filter((item) => item.ok && !/^\s*(image\/|video\/|application\/octet-stream)/i.test(item.contentType));
  const report = { generatedAt: new Date().toISOString(), checked: results.length, failures, invalidTypes, results };
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
  console.log(`远程媒体检查完成：${results.length} 个资源，失败 ${failures.length} 个，类型异常 ${invalidTypes.length} 个。`);
  console.log(`报告：${path.relative(process.cwd(), reportFile)}`);
  if (failures.length || invalidTypes.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`远程媒体检查无法执行：${error.message}`);
  process.exitCode = 1;
});
