'use strict';

// Keep article images as ordinary <img> elements while opting them into
// prioritized first-image loading plus browser-native lazy loading and
// asynchronous decoding for the remaining article images.
hexo.extend.filter.register('after_post_render', function (data) {
  let articleImageIndex = 0;
  data.content = data.content.replace(/<img\b[^>]*>/gi, function (tag) {
    const isFirstArticleImage = articleImageIndex++ === 0;
    if (/\bdata-src\s*=/i.test(tag)) return tag;

    tag = tag.replace(/\sloading\s*=\s*(["']).*?\1/gi, '');

    if (!/\bprogressive-image\b/i.test(tag)) {
      if (/\bclass\s*=/i.test(tag)) {
        tag = tag.replace(/\bclass\s*=\s*(["'])(.*?)\1/i, function (_, quote, classes) {
          return 'class=' + quote + classes + ' progressive-image' + quote;
        });
      } else {
        tag = tag.replace(/^<img\b/i, '<img class="progressive-image"');
      }
    }
    if (isFirstArticleImage) {
      tag = tag.replace(/^<img\b/i, '<img loading="eager"');
      if (!/\bfetchpriority\s*=/i.test(tag)) tag = tag.replace(/^<img\b/i, '<img fetchpriority="high"');
    }
    if (!/\bdecoding\s*=/i.test(tag)) tag = tag.replace(/^<img\b/i, '<img decoding="async"');
    if (!/\balt\s*=/i.test(tag)) tag = tag.replace(/^<img\b/i, '<img alt=""');
    return tag;
  });

  // Turn adjacent images into a count-aware compact gallery.
  // Authors only need to keep image tags next to each other in Markdown.
  function renderGallery(images) {
    const count = images.length;
    const parity = count % 2 ? ' post-image-gallery-odd' : ' post-image-gallery-even';
    return '<div class="post-image-gallery' + parity + '" data-image-count="' + count + '">' + images.join('') + '</div>';
  }
  data.content = data.content.replace(/((?:<img\b[^>]*>\s*){2,})/gi, function (run) {
    return renderGallery(run.match(/<img\b[^>]*>/gi) || []);
  });
  data.content = data.content.replace(/((?:<p>\s*<img\b[^>]*>\s*<\/p>\s*){2,})/gi, function (run) {
    const images = run.match(/<img\b[^>]*>/gi) || [];
    return renderGallery(images);
  });
  data.content = data.content.replace(/<div class="post-image-gallery[^>]*>[\s\S]*?<\/div>/gi, function (gallery) {
    return gallery.replace(/<img\b[^>]*>/gi, function (tag) {
      if (/\bfetchpriority\s*=\s*(["'])high\1/i.test(tag) || /\bno-lazy\b/i.test(tag)) return tag;
      return tag.replace(/^<img\b/i, '<img loading="lazy"');
    });
  });

  // Keep video sources untouched. A lightweight local poster prevents the
  // blank frame shown while a remote video establishes its first frame.
  const fallbackPoster = hexo.config.root.replace(/\/?$/, '/') + 'images/video-poster.svg';
  data.content = data.content.replace(/<video\b[^>]*>/gi, function (tag) {
    if (/\sautoplay(?:\s*=\s*(["'])?autoplay\1)?/i.test(tag)) {
      tag = tag.replace(/\sautoplay(?:\s*=\s*(["'])?autoplay\1)?/i, ' data-viewport-autoplay="true"');
      if (/\bpreload\s*=/i.test(tag)) {
        tag = tag.replace(/\bpreload\s*=\s*(["']).*?\1/i, 'preload="metadata"');
      } else {
        tag = tag.replace(/^<video\b/i, '<video preload="metadata"');
      }
    }
    if (/\sautoplay(?:\s*=\s*(["'])?autoplay\1)?/i.test(tag)) {
      tag = tag.replace(/\sautoplay(?:\s*=\s*(["'])?autoplay\1)?/i, ' data-viewport-autoplay="true"');
      if (/\bpreload\s*=/i.test(tag)) {
        tag = tag.replace(/\bpreload\s*=\s*(["']).*?\1/i, 'preload="metadata"');
      } else {
        tag = tag.replace(/^<video\b/i, '<video preload="metadata"');
      }
    }
    if (!/\bposter\s*=/i.test(tag) && /\bsrc\s*=\s*(["'])https?:\/\//i.test(tag)) {
      tag = tag.replace(/^<video\b/i, '<video poster="' + fallbackPoster + '"');
    }
    return tag;
  });

  return data;
});
