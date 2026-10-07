'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.join(__dirname, '..');
const scriptPath = path.join(root, 'themes/journal/source/js/about-photo.js');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

// Run the real templates without requiring the full Hexo dependency tree.
function render(template, page) {
  let code = 'let output = "";';
  let cursor = 0;
  for (const match of template.matchAll(/<%([=-]?)([\s\S]*?)%>/g)) {
    code += 'output += ' + JSON.stringify(template.slice(cursor, match.index)) + ';';
    code += match[1] ? 'output += (' + match[2] + ');' : match[2];
    cursor = match.index + match[0].length;
  }
  code += 'output += ' + JSON.stringify(template.slice(cursor)) + '; output;';
  return vm.runInNewContext(code, {
    page, config: {}, theme: {}, is_page: () => true, is_post: () => false,
    versioned_asset: (asset) => '/' + asset + '?v=fixture', url_for: (asset) => '/' + asset
  });
}

// Only the DOM methods used by the small pointer enhancement need a fixture.
class Element extends EventTarget {
  constructor() {
    super();
    this.children = [];
    this.properties = new Map();
    this.classes = new Set();
    this.style = {
      setProperty: (key, value) => this.properties.set(key, value),
      removeProperty: (key) => this.properties.delete(key)
    };
    this.classList = {
      add: (name) => this.classes.add(name), remove: (name) => this.classes.delete(name),
      contains: (name) => this.classes.has(name)
    };
  }
  appendChild(child) {
    if (child.parentNode) child.parentNode.children.splice(child.parentNode.children.indexOf(child), 1);
    this.children.push(child);
    child.parentNode = this;
    return child;
  }
  replaceChild(next, previous) {
    this.children[this.children.indexOf(previous)] = next;
    next.parentNode = this;
    previous.parentNode = null;
  }
  getBoundingClientRect() { return { left: 100, top: 50, width: 200, height: 100 }; }
}

function event(target, type, properties = {}) {
  const value = new Event(type, { cancelable: true });
  Object.assign(value, properties);
  target.dispatchEvent(value);
  return value;
}

function fixture({ fine = true, reduced = false, target = true } = {}) {
  assert.ok(fs.existsSync(scriptPath), 'About pointer enhancement must exist');
  const image = new Element();
  image.src = 'https://zdd-blogcdn.pages.dev/contentImg/about/about.webp';
  image.tabIndex = 0;
  const originalParent = new Element();
  originalParent.appendChild(image);
  const fineMedia = Object.assign(new EventTarget(), { matches: fine });
  const reducedMedia = Object.assign(new EventTarget(), { matches: reduced });
  const window = new EventTarget();
  const frames = new Map();
  let frameId = 0;
  Object.assign(window, {
    matchMedia: (query) => query.includes('reduced-motion') ? reducedMedia : fineMedia,
    requestAnimationFrame: (callback) => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: (id) => frames.delete(id)
  });
  const document = {
    querySelector: (selector) => {
      assert.equal(selector, '.post-body img[src$="/contentImg/about/about.webp"]');
      return target ? image : null;
    },
    createElement: () => new Element()
  };
  vm.runInNewContext(fs.readFileSync(scriptPath, 'utf8'), { window, document });
  const shell = originalParent.children[0];
  const surface = shell === image ? null : shell.children[0];
  return {
    image, shell, surface, originalParent, fineMedia, reducedMedia, window, frames,
    flush: () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach((callback) => callback()); }
  };
}

test('loads the enhancement only for the explicitly enabled About page', () => {
  const head = read('themes/journal/layout/_include/head_includes.ejs');
  const tail = read('themes/journal/layout/_include/tail.ejs');
  const about = { path: 'about/index.html', about_photo_effect: true };
  assert.match(render(head, about), /\/css\/about-photo\.css\?v=fixture/);
  assert.match(render(tail, about), /\/js\/about-photo\.js\?v=fixture/);
  for (const page of [{ path: 'about/index.html' }, { path: 'index.html', about_photo_effect: true },
    { path: 'footprints/index.html', about_photo_effect: true }, { path: 'post/index.html', about_photo_effect: true }]) {
    assert.doesNotMatch(render(head, page) + render(tail, page), /about-photo\.(css|js)/);
  }
  const source = read('source/about/index.md');
  assert.match(source, /^about_photo_effect: true$/m);
  assert.match(source, /!\[博客关于页照片\]\(https:\/\/cdn\.zhangdd\.tech\/contentImg\/about\/about\.webp\)/);
});

test('keeps the original focusable image and its existing activation listeners', () => {
  const f = fixture();
  assert.equal(f.surface.children[0], f.image);
  assert.equal(f.image.tabIndex, 0);
  assert.equal(f.image.src, 'https://zdd-blogcdn.pages.dev/contentImg/about/about.webp');
  let opened = 0;
  f.image.addEventListener('click', () => { opened++; });
  assert.equal(event(f.image, 'click').defaultPrevented, false);
  assert.equal(opened, 1);
  assert.equal(event(f.image, 'keydown', { key: 'Enter' }).defaultPrevented, false);
});

test('limits mouse tilt to three degrees and coalesces work into one frame', () => {
  const f = fixture();
  event(f.shell, 'pointermove', { pointerType: 'mouse', clientX: 180, clientY: 70 });
  event(f.shell, 'pointermove', { pointerType: 'mouse', clientX: 900, clientY: -500 });
  assert.equal(f.frames.size, 1);
  f.flush();
  assert.equal(parseFloat(f.surface.properties.get('--about-rotate-x')), 3);
  assert.equal(parseFloat(f.surface.properties.get('--about-rotate-y')), 3);
  assert.equal(f.surface.properties.get('--about-shine-x'), '100.00%');
  assert.equal(f.surface.properties.get('--about-shine-y'), '0.00%');
});

test('resets on pointerleave and cancels a frame that could restore stale tilt', () => {
  const f = fixture();
  event(f.shell, 'pointermove', { pointerType: 'mouse', clientX: 280, clientY: 60 });
  f.flush();
  assert.ok(f.surface.properties.size > 0);
  event(f.shell, 'pointermove', { pointerType: 'mouse', clientX: 300, clientY: 50 });
  event(f.shell, 'pointerleave');
  f.flush();
  assert.equal(f.frames.size, 0);
  assert.equal(f.surface.properties.size, 0);
  assert.equal(f.surface.classList.contains('is-active'), false);
});

for (const resetEvent of ['pointercancel', 'click', 'keydown', 'focus', 'blur']) {
  test('resets for ' + resetEvent + ' without consuming activation', () => {
    const f = fixture();
    event(f.shell, 'pointermove', { pointerType: 'mouse', clientX: 280, clientY: 60 });
    f.flush();
    const target = resetEvent === 'blur' ? f.window : ['focus', 'keydown'].includes(resetEvent) ? f.image : f.shell;
    const value = event(target, resetEvent, { key: 'Enter' });
    assert.equal(value.defaultPrevented, false);
    assert.equal(f.surface.properties.size, 0);
    assert.equal(f.surface.classList.contains('is-active'), false);
  });
}

test('coarse pointers and reduced motion keep the original static image', () => {
  for (const options of [{ fine: false }, { reduced: true }, { target: false }]) {
    const f = fixture(options);
    assert.equal(f.originalParent.children[0], f.image);
    assert.equal(f.frames.size, 0);
  }
});

test('touch input and live preference changes remove tilt immediately', () => {
  const f = fixture();
  const move = (pointerType) => event(f.shell, 'pointermove', { pointerType, clientX: 280, clientY: 60 });
  move('mouse'); f.flush();
  move('touch'); f.flush();
  assert.equal(f.surface.properties.size, 0);
  for (const media of [f.reducedMedia, f.fineMedia]) {
    f.reducedMedia.matches = false; f.fineMedia.matches = true;
    move('mouse'); f.flush();
    assert.ok(f.surface.properties.size > 0);
    media.matches = media === f.reducedMedia;
    event(media, 'change');
    move('mouse'); f.flush();
    assert.equal(f.surface.properties.size, 0);
    assert.equal(f.surface.classList.contains('is-active'), false);
  }
});
