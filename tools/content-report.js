'use strict';

const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '..', 'source', '_posts');
const reportDir = path.join(__dirname, '..', 'reports');
const reportFile = path.join(reportDir, 'content-quality.json');
const posts = [];

function walk(directory) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith('.md')) posts.push(target);
  });
}

function frontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: content, valid: false };
  const data = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const field = line.match(/^([\w-]+):\s*(.*)$/);
    if (field) data[field[1]] = field[2].replace(/^['"]|['"]$/g, '');
  });
  return { data, body: content.slice(match[0].length), valid: true };
}

walk(postsDir);
const report = {
  generatedAt: new Date().toISOString(),
  posts: posts.length,
  missingFrontMatter: [],
  missingDescription: [],
  missingFeaturedImage: [],
  nonStandardDate: [],
  imagesMissingAlt: []
};

posts.forEach((file) => {
  const relative = path.relative(postsDir, file).replace(/\\/g, '/');
  const { data, body, valid } = frontMatter(fs.readFileSync(file, 'utf8'));
  if (!valid) {
    report.missingFrontMatter.push(relative);
    return;
  }
  if (!data.description && !data.intro) report.missingDescription.push(relative);
  if (!data.featured_image) report.missingFeaturedImage.push(relative);
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) report.nonStandardDate.push({ file: relative, date: data.date });
  const markdownImages = body.match(/!\[\]\([^)]*\)/g) || [];
  if (markdownImages.length) report.imagesMissingAlt.push({ file: relative, count: markdownImages.length });
});

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
console.log(`内容报告已生成：${path.relative(process.cwd(), reportFile)}`);
console.log(`文章 ${report.posts} 篇；缺少描述 ${report.missingDescription.length}，缺少题图 ${report.missingFeaturedImage.length}，非标准日期 ${report.nonStandardDate.length}，含空替代文本图片的文章 ${report.imagesMissingAlt.length}。`);
