/*
 * Walter Molina · V3 «Proporción 1,618» — comportamiento propio de las dos páginas.
 * Va después de content.js, site.js y wm.js.
 *
 *  - menú plegable (celular / tablet)
 *  - grosor de los fios SVG = 1px de pantalla (--u)
 *  - [data-draw]  dibuja la firma áurea por tiempo al entrar (página de entrada)
 *    (en la consultoría la firma sigue al scroll: --p de la escena / --v de la figura, sólo CSS)
 *  - menú: sección activa (aria-current)
 */
(function () {
  'use strict';
  var root = document.documentElement;
  var FX = window.FX || null;
  var reduce = FX ? FX.reduce : !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasIO = 'IntersectionObserver' in window;

  function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  /* ------------------------------------------------------------ menú */
  var hdr = document.querySelector('[data-hdr]');
  var menu = hdr && hdr.querySelector('.menu');
  function setMenu(open) {
    if (!menu) return;
    hdr.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (menu) {
    menu.addEventListener('click', function (ev) {
      ev.stopPropagation();
      setMenu(!hdr.classList.contains('is-open'));
    });
    [].forEach.call(hdr.querySelectorAll('.nav a, .nav [data-curso]'), function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && hdr.classList.contains('is-open')) { setMenu(false); menu.focus(); }
    });
    document.addEventListener('click', function (ev) { if (!hdr.contains(ev.target)) setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1180) setMenu(false); });
  }

  /* -------------------------------------- fios SVG: 1px real en cualquier tamaño */
  var svgs = [].slice.call(document.querySelectorAll('.phi__svg, .fin__phi'));
  function units() {
    svgs.forEach(function (s) {
      var w = s.getBoundingClientRect().width;
      var vb = (s.viewBox && s.viewBox.baseVal && s.viewBox.baseVal.width) || 1000;
      if (w > 0) s.style.setProperty('--u', (vb / w).toFixed(3));
    });
  }
  units();
  window.addEventListener('load', units);
  window.addEventListener('resize', units);
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(units);
    svgs.forEach(function (s) { ro.observe(s); });
  }

  /* ------------------------------------------- firma áurea dibujada por tiempo */
  function drawIn(el, dur, delay) {
    if (reduce) { el.style.setProperty('--k', '1'); return; }
    var t0 = null;
    var done = false;
    function step(t) {
      if (done) return;
      if (t0 === null) t0 = t;
      var x = Math.min(1, Math.max(0, (t - t0 - delay) / dur));
      el.style.setProperty('--k', ease(x).toFixed(4));
      if (x < 1) window.requestAnimationFrame(step); else done = true;
    }
    window.requestAnimationFrame(step);
    // si la pestaña está oculta y rAF no corre, igual queda dibujada
    window.setTimeout(function () { if (!done) { done = true; el.style.setProperty('--k', '1'); } }, dur + delay + 2500);
  }
  var draws = [].slice.call(document.querySelectorAll('[data-draw]'));
  if (draws.length) {
    if (reduce || !hasIO) {
      draws.forEach(function (el) { el.style.setProperty('--k', '1'); });
    } else {
      draws.forEach(function (el) { el.style.setProperty('--k', '0'); });
      var dio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          dio.unobserve(e.target);
          drawIn(e.target, 3400, 300);
        });
      }, { threshold: 0.2 });
      draws.forEach(function (el) { dio.observe(el); });
    }
  }

  /* antes / después: el comportamiento (modos del probador) es de wm.js — acá no se toca --ba */

  /* ------------------------------------------------- menú: sección activa */
  var links = [].slice.call(document.querySelectorAll('.nav a[data-nav]'));
  if (links.length && FX) {
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute('data-nav')); });
    FX.onScroll(function () {
      var mark = window.innerHeight * 0.4;
      var cur = -1;
      targets.forEach(function (t, i) {
        if (!t || !t.getClientRects().length) return;
        var r = t.getBoundingClientRect();
        if (r.top <= mark && r.bottom > mark) cur = i;
      });
      links.forEach(function (a, i) {
        if (i === cur) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }

  /* ---------------------------------------------- header: estado al bajar */
  function scrolled() { root.classList.toggle('is-scrolled', window.scrollY > 8); }
  if (FX) FX.onScroll(scrolled); else window.addEventListener('scroll', scrolled, { passive: true });
})();
