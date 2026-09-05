(function () {
    var runtimeScript = document.currentScript;
    function reveal(image) {
      if (!image.hasAttribute('width') && image.naturalWidth) image.setAttribute('width', image.naturalWidth);
      if (!image.hasAttribute('height') && image.naturalHeight) image.setAttribute('height', image.naturalHeight);
      image.classList.add('is-loaded');
    }

    document.querySelectorAll('img.progressive-image').forEach(function (image) {
      if (image.complete) {
        window.requestAnimationFrame(function () { reveal(image); });
      } else {
        image.addEventListener('load', function () { reveal(image); }, { once: true });
        image.addEventListener('error', function () { image.classList.add('is-error'); }, { once: true });
      }
    });

    document.querySelectorAll('.post-body video').forEach(function (video) {
      function applyIntrinsicVideoSize() {
        if (!video.videoWidth || !video.videoHeight) return;
        if (!video.hasAttribute('width')) video.setAttribute('width', video.videoWidth);
        if (!video.hasAttribute('height')) video.setAttribute('height', video.videoHeight);
      }
      if (video.readyState >= 1) applyIntrinsicVideoSize();
      else video.addEventListener('loadedmetadata', applyIntrinsicVideoSize, { once: true });
    });

    var viewportVideos = document.querySelectorAll('.post-body video[data-viewport-autoplay]');
    if (viewportVideos.length && 'IntersectionObserver' in window) {
      var videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;
          var state = video.dataset.viewportPlaybackState || 'paused';
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && state !== 'playing') {
            video.dataset.viewportPlaybackState = 'playing';
            var playPromise = video.play();
            if (playPromise) playPromise.catch(function () { video.dataset.viewportPlaybackState = 'paused'; });
          } else if ((!entry.isIntersecting || entry.intersectionRatio <= 0.15) && state !== 'paused') {
            video.dataset.viewportPlaybackState = 'paused';
            video.pause();
          }
        });
      }, { threshold: [0, 0.15, 0.5, 1] });
      viewportVideos.forEach(function (video) { videoObserver.observe(video); });
    }

    function loadCover(cover) {
      if (cover.dataset.loaded) return;
      cover.dataset.loaded = 'true';
      var source = cover.dataset.imageSrc;
      var image = new Image();
      if (cover.dataset.fetchPriority) image.fetchPriority = cover.dataset.fetchPriority;
      image.onload = function () {
        var imageValue = 'url("' + source.replace(/"/g, '%22') + '")';
        if (cover.classList.contains('home-depth-cover')) cover.style.setProperty('--home-depth-image', imageValue);
        else cover.style.backgroundImage = imageValue;
        window.requestAnimationFrame(function () { cover.classList.add('is-loaded'); });
      };
      image.onerror = function () { cover.classList.add('is-error'); };
      image.src = source;
    }

    var covers = document.querySelectorAll('.progressive-cover[data-image-src]');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          loadCover(entry.target);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '250px 0px' });
      covers.forEach(function (cover) {
        if (cover.dataset.fetchPriority === 'high') loadCover(cover);
        else observer.observe(cover);
      });
    } else {
      covers.forEach(loadCover);
    }

    var depthCovers = Array.prototype.slice.call(document.querySelectorAll('.home-depth-cover'));
    if (depthCovers.length && document.documentElement.scrollHeight > window.innerHeight) {
      var activeDepthCovers = new Set();
      var depthFramePending = false;

      function updateHomeDepth() {
        var viewportCenter = window.innerHeight / 2;
        var amplitude = window.innerWidth <= 1020 ? 12 : 18;
        activeDepthCovers.forEach(function (cover) {
          var rect = cover.getBoundingClientRect();
          var normalized = (viewportCenter - (rect.top + rect.height / 2)) / Math.max(1, viewportCenter + rect.height / 2);
          var offset = Math.max(-1, Math.min(1, normalized)) * amplitude;
          cover.style.setProperty('--home-depth-y', offset.toFixed(2) + 'px');
        });
        depthFramePending = false;
      }

      function requestHomeDepth() {
        if (depthFramePending) return;
        depthFramePending = true;
        window.requestAnimationFrame(updateHomeDepth);
      }

      if ('IntersectionObserver' in window) {
        var depthObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) activeDepthCovers.add(entry.target);
            else activeDepthCovers.delete(entry.target);
          });
          requestHomeDepth();
        }, { rootMargin: '120px 0px' });
        depthCovers.forEach(function (cover) { depthObserver.observe(cover); });
      } else {
        depthCovers.forEach(function (cover) { activeDepthCovers.add(cover); });
      }

      window.addEventListener('scroll', requestHomeDepth, { passive: true });
      window.addEventListener('resize', requestHomeDepth, { passive: true });
      requestHomeDepth();
    }

    var article = document.querySelector('.post-body');
    var toc = document.getElementById('article-toc');
    var progress = document.getElementById('reading-progress-bar');
    if (article && toc) {
      var headings = Array.prototype.slice.call(article.querySelectorAll('h2, h3, h4'));
      if (headings.length >= 2) {
        var usedIds = {};
        var list = toc.querySelector('ol');
        headings.forEach(function (heading, index) {
          var base = heading.id || heading.textContent.trim().replace(/\s+/g, '-').replace(/[^\w\u3400-\u9fff-]/g, '') || 'section-' + (index + 1);
          var id = base;
          var suffix = 2;
          while (usedIds[id] || (document.getElementById(id) && document.getElementById(id) !== heading)) id = base + '-' + suffix++;
          usedIds[id] = true;
          heading.id = id;
          var item = document.createElement('li');
          item.className = 'toc-level-' + heading.tagName.slice(1);
          var link = document.createElement('a');
          link.href = '#' + encodeURIComponent(id);
          link.textContent = heading.textContent;
          item.appendChild(link);
          list.appendChild(item);
        });
        toc.hidden = false;
        var tocLinks = Array.prototype.slice.call(list.querySelectorAll('a'));
        function setActiveToc(id) {
          tocLinks.forEach(function (link) { link.classList.toggle('active', decodeURIComponent(link.hash.slice(1)) === id); });
        }
        tocLinks.forEach(function (link) {
          link.addEventListener('click', function () { setActiveToc(decodeURIComponent(link.hash.slice(1))); });
        });
        var tocTicking = false;
        function updateActiveToc() {
          var current = headings[0];
          headings.forEach(function (heading) { if (heading.getBoundingClientRect().top <= 150) current = heading; });
          if (current) setActiveToc(current.id);
          tocTicking = false;
        }
        window.addEventListener('scroll', function () {
          if (!tocTicking) { tocTicking = true; window.requestAnimationFrame(updateActiveToc); }
        }, { passive: true });
        updateActiveToc();
      }
    }

    if (article && progress) {
      var updateProgress = function () {
        var start = article.getBoundingClientRect().top + window.pageYOffset;
        var distance = Math.max(1, article.offsetHeight - window.innerHeight);
        var percentage = Math.max(0, Math.min(100, (window.pageYOffset - start) / distance * 100));
        progress.style.width = percentage + '%';
      };
      updateProgress();
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress);
    }

    if (article) {
      var galleryImages = Array.prototype.slice.call(article.querySelectorAll('img:not(.no-lightbox)'));
      if (galleryImages.length && 'HTMLDialogElement' in window) {
        var lightbox = document.createElement('dialog');
        lightbox.className = 'image-lightbox';
        lightbox.innerHTML = '<button class="image-lightbox-close" type="button" aria-label="关闭图片">×</button>' +
          '<button class="image-lightbox-prev" type="button" aria-label="上一张图片">‹</button>' +
          '<figure><img alt=""><figcaption></figcaption></figure>' +
          '<button class="image-lightbox-next" type="button" aria-label="下一张图片">›</button>';
        document.body.appendChild(lightbox);
        var lightboxImage = lightbox.querySelector('img');
        var lightboxCaption = lightbox.querySelector('figcaption');
        var lightboxIndex = 0;

        function showGalleryImage(index) {
          lightboxIndex = (index + galleryImages.length) % galleryImages.length;
          var selected = galleryImages[lightboxIndex];
          lightboxImage.src = selected.currentSrc || selected.src;
          lightboxImage.alt = selected.alt || '';
          lightboxCaption.textContent = selected.alt || (lightboxIndex + 1) + ' / ' + galleryImages.length;
          lightbox.querySelector('.image-lightbox-prev').hidden = galleryImages.length < 2;
          lightbox.querySelector('.image-lightbox-next').hidden = galleryImages.length < 2;
        }

        galleryImages.forEach(function (image, index) {
          image.classList.add('lightbox-enabled');
          image.tabIndex = 0;
          image.setAttribute('role', 'button');
          image.setAttribute('aria-label', (image.alt || '查看图片') + '，点击全屏查看');
          function openLightbox() {
            showGalleryImage(index);
            lightbox.showModal();
          }
          image.addEventListener('click', openLightbox);
          image.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(); }
          });
        });

        lightbox.querySelector('.image-lightbox-close').addEventListener('click', function () { lightbox.close(); });
        lightbox.querySelector('.image-lightbox-prev').addEventListener('click', function () { showGalleryImage(lightboxIndex - 1); });
        lightbox.querySelector('.image-lightbox-next').addEventListener('click', function () { showGalleryImage(lightboxIndex + 1); });
        lightbox.addEventListener('click', function (event) { if (event.target === lightbox) lightbox.close(); });
        lightbox.addEventListener('keydown', function (event) {
          if (event.key === 'ArrowLeft') showGalleryImage(lightboxIndex - 1);
          if (event.key === 'ArrowRight') showGalleryImage(lightboxIndex + 1);
        });
      }
    }

    var themeToggles = Array.prototype.slice.call(document.querySelectorAll('.theme-toggle'));
    function updateThemeButtons() {
      var dark = document.documentElement.classList.contains('dark-theme');
      themeToggles.forEach(function (button) {
        button.innerHTML = dark
          ? '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
          : '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.4A8 8 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" fill="currentColor"/></svg>';
        button.setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式');
        button.title = dark ? '切换浅色模式' : '切换深色模式';
        button.setAttribute('aria-pressed', dark ? 'true' : 'false');
      });
      var themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.content = dark ? '#17211b' : '#f5f3ee';
    }
    var themeTransitionTimer;
    themeToggles.forEach(function (button) {
      button.addEventListener('click', function () {
        clearTimeout(themeTransitionTimer);
        document.documentElement.classList.add('theme-transition');
        void document.documentElement.offsetWidth;
        document.documentElement.classList.toggle('dark-theme');
        try { localStorage.setItem('color-theme', document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light'); } catch (error) {}
        updateThemeButtons();
        themeTransitionTimer = setTimeout(function () {
          document.documentElement.classList.remove('theme-transition');
        }, 320);
      });
    });
    updateThemeButtons();

    if ('serviceWorker' in navigator && location.protocol !== 'file:' && runtimeScript) {
      window.addEventListener('load', function () {
        var workerUrl = runtimeScript.dataset.serviceWorkerUrl;
        if (!workerUrl) return;
        navigator.serviceWorker.register(workerUrl).then(function (registration) {
          registration.update();
        }).catch(function () {});
      });
    }

  }());
