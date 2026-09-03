'use strict';

// Keep article images as ordinary <img> elements while opting them into
// browser-native lazy loading and asynchronous decoding.
hexo.extend.filter.register('after_post_render', function (data) {
  data.content = data.content.replace(/<img\b[^>]*>/gi, function (tag) {
    if (/\bno-lazy\b|\bloading\s*=|\bdata-src\s*=/i.test(tag)) return tag;

    if (/\bclass\s*=/i.test(tag)) {
      return tag
        .replace(/\bclass\s*=\s*(["'])(.*?)\1/i, function (_, quote, classes) {
          return 'class=' + quote + classes + ' progressive-image' + quote;
        })
        .replace(/^<img\b/i, '<img loading="lazy" decoding="async"');
    }

    return tag.replace(/^<img\b/i, '<img class="progressive-image" loading="lazy" decoding="async"');
  });

  return data;
});
