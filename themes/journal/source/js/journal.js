(function () {
  'use strict';
  var root = document.documentElement;
  var drawer = document.getElementById('single-column-drawer');
  var mask = document.getElementById('single-column-drawer-mask');
  var menuButton = document.getElementById('nav_dropdown_btn');
  var nav = document.getElementById('single-column-nav');
  var navBackground = document.getElementById('single-column-nav-background');
  var navTitle = document.getElementById('single-column-nav-title');
  var pageHead = document.getElementById('single-column-page-head');
  var extra = document.querySelector('.extra-container');
  var stream = document.querySelector('.stream-container');
  var backToTop = document.getElementById('globalBackToTop');
  var framePending = false;

  function setDrawer(open) {
    if (!drawer || !mask || !menuButton) return;
    drawer.classList.toggle('single-column-drawer-container-active', open);
    mask.classList.toggle('single-column-drawer-mask-active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    root.style.overflow = open ? 'hidden' : '';
  }

  function updateScroll() {
    framePending = false;
    var scrollY = window.scrollY || 0;
    var navHeight = nav ? nav.offsetHeight : 0;
    var headHeight = pageHead ? pageHead.offsetHeight : Math.max(navHeight, 1);
    var opacity = Math.min(1, Math.max(0, scrollY / Math.max(1, headHeight - navHeight * 0.8)));
    var showNav = opacity >= 1;
    if (pageHead) {
      pageHead.style.transform = 'translate3d(0,' + (scrollY * 0.3) + 'px,0)';
      pageHead.style.opacity = String(1 - opacity);
    }
    if (navBackground) navBackground.style.opacity = showNav ? '1' : '0';
    if (navTitle) navTitle.style.opacity = showNav ? '1' : '0';
    if (backToTop) backToTop.classList.toggle('invisible', scrollY === 0);
  }

  function requestScrollUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateScroll);
  }

  function updateLayout() {
    if (extra && stream) extra.style.left = (stream.offsetWidth - extra.offsetWidth) + 'px';
    requestScrollUpdate();
  }

  if (menuButton) menuButton.addEventListener('click', function () {
    setDrawer(!drawer.classList.contains('single-column-drawer-container-active'));
  });
  if (mask) mask.addEventListener('click', function () { setDrawer(false); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') setDrawer(false); });
  if (backToTop) backToTop.addEventListener('click', function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', updateLayout, { passive: true });
  updateLayout();
}());
