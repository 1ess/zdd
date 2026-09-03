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

  // Keep video sources untouched. A lightweight local poster prevents the
  // blank frame shown while a remote video establishes its first frame.
  const fallbackPoster = hexo.config.root.replace(/\/?$/, '/') + 'images/video-poster.svg';
  data.content = data.content.replace(/<video\b[^>]*>/gi, function (tag) {
    if (/\bposter\s*=/i.test(tag) || !/\bsrc\s*=\s*(["'])https?:\/\//i.test(tag)) return tag;
    return tag.replace(/^<video\b/i, '<video poster="' + fallbackPoster + '"');
  });

  return data;
});
