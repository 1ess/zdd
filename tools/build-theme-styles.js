'use strict';

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const themeRoot = path.resolve(__dirname, '../themes/journal');
const source = path.join(themeRoot, 'scss/journal.scss');
const output = path.join(themeRoot, 'source/css');
const dependency = (name) => require(require.resolve(name, { paths: [themeRoot] }));
const sass = dependency('sass');
const postcss = dependency('postcss');
const autoprefixer = dependency('autoprefixer');

// Classify components, never the articles that happen to exist at build time.
// New Markdown and unknown/custom selectors keep working without a purge list.
function bundleFor(selector) {
  if (/(?:[.#]footprints[-\w]*|\.leaflet[-\w]*)/.test(selector)) return 'footprints';
  if (/\.site-search(?:[-\w]*)(?![\w-])/.test(selector)) return 'search';
  if (/(?:\.post(?![\w-])|\.post-(?:body|head|title|meta|pagination|comment|discovery|series|image-gallery)[-\w]*|\.(?:article-toc|image-lightbox|reading-progress|reading-time|related-posts|toc-level)[-\w]*|#(?:reading-progress-bar|lv-container)|\.(?:highlight|hljs)[-\w]*)/.test(selector)) return 'content';
  if (/(?:^|[\s>+~,(])(?:code|pre|blockquote)(?=[\s.#:[>+~),]|$)/.test(selector)) return 'content';
  return 'journal';
}

function splitContainer(container, target) {
  const copy = container.clone({ nodes: [] });
  for (const node of container.nodes || []) {
    if (node.type === 'rule') {
      const selectors = node.selectors.filter((selector) => bundleFor(selector) === target);
      if (selectors.length) copy.append(node.clone({ selector: selectors.join(',') }));
    } else if (node.type === 'atrule' && node.nodes && !/keyframes$/i.test(node.name)) {
      const nested = splitContainer(node, target);
      if (nested.nodes.length) copy.append(nested);
    } else if (target === 'journal' && node.type !== 'comment') {
      copy.append(node.clone());
    }
  }
  return copy;
}

// Only remove byte-for-byte equivalent rules in the same conditional context.
// Keep the final occurrence so existing specificity and late theme overrides
// retain their position; differing colors and browser fallbacks stay intact.
function removeExactDuplicates(root) {
  const seen = new Map();
  root.walkRules((rule) => {
    const context = [];
    for (let parent = rule.parent; parent && parent.type !== 'root'; parent = parent.parent) {
      context.unshift(`${parent.name} ${parent.params}`);
    }
    const key = JSON.stringify([context, rule.selector, rule.nodes.map((node) => node.toString())]);
    if (seen.has(key)) seen.get(key).remove();
    seen.set(key, rule);
  });
  root.walkAtRules((rule) => {
    if (rule.nodes && !rule.nodes.length) rule.remove();
  });
  return root;
}

async function build() {
  const compiled = sass.compile(source, { style: 'compressed', sourceMap: false });
  const result = await postcss([autoprefixer]).process(compiled.css, {
    from: source,
    map: false
  });
  fs.mkdirSync(output, { recursive: true });
  for (const name of ['journal', 'content', 'footprints', 'search']) {
    const css = removeExactDuplicates(splitContainer(result.root, name)).toString();
    fs.writeFileSync(path.join(output, `${name}.css`), css);
    console.log(`${name}.css: ${Buffer.byteLength(css)} bytes; gzip ${zlib.gzipSync(css).length} bytes`);
  }
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

if (process.argv.includes('--watch')) {
  let pending;
  fs.watch(path.dirname(source), { recursive: true }, () => {
    clearTimeout(pending);
    pending = setTimeout(() => build().catch(console.error), 100);
  });
}
