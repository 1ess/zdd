(function () {
  'use strict';

  var image = document.querySelector('.post-body img[src$="/contentImg/about/about.webp"]');
  if (!image || !window.matchMedia) return;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer.matches || reducedMotion.matches) return;

  // Keep the same image node, including the existing lightbox and keyboard handlers.
  var shell = document.createElement('span');
  var surface = document.createElement('span');
  shell.className = 'about-photo-tilt';
  surface.className = 'about-photo-surface';
  image.parentNode.replaceChild(shell, image);
  shell.appendChild(surface);
  surface.appendChild(image);
  var frame = 0;
  var point;

  function reset() {
    window.cancelAnimationFrame(frame);
    frame = 0;
    surface.classList.remove('is-active');
    ['--about-rotate-x', '--about-rotate-y', '--about-shine-x', '--about-shine-y'].forEach(function (property) {
      surface.style.removeProperty(property);
    });
  }

  shell.addEventListener('pointermove', function (event) {
    if (event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion.matches) { reset(); return; }
    point = { x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = window.requestAnimationFrame(function () {
      frame = 0;
      var rect = shell.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var x = Math.max(0, Math.min(1, (point.x - rect.left) / rect.width));
      var y = Math.max(0, Math.min(1, (point.y - rect.top) / rect.height));
      surface.style.setProperty('--about-rotate-x', ((.5 - y) * 6).toFixed(2) + 'deg');
      surface.style.setProperty('--about-rotate-y', ((x - .5) * 6).toFixed(2) + 'deg');
      surface.style.setProperty('--about-shine-x', (x * 100).toFixed(2) + '%');
      surface.style.setProperty('--about-shine-y', (y * 100).toFixed(2) + '%');
      surface.classList.add('is-active');
    });
  }, { passive: true });
  shell.addEventListener('pointerleave', reset);
  shell.addEventListener('pointercancel', reset);
  shell.addEventListener('click', reset, true);
  image.addEventListener('focus', reset);
  image.addEventListener('keydown', reset);
  window.addEventListener('blur', reset);
  finePointer.addEventListener('change', reset);
  reducedMotion.addEventListener('change', reset);
}());
