/*
 * V2 · Estudio — comportamiento propio (después de site.js y wm.js).
 *  - header: fondo al hacer scroll, menú en celular, sección actual
 *  - la sesión: el ítem activo cambia la foto sticky
 *  - resultados: grilla simple; sólo el tirador de cada antes/después se arrastra
 */
(function () {
  'use strict';
  var FX = window.FX;
  if (!FX) return;
  var root = document.documentElement;
  var reduce = FX.reduce;

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------------------------------------------------------------- header */
  var hdr = document.querySelector('.hdr');
  if (hdr) {
    var menuBtn = hdr.querySelector('.menu-btn');
    var nav = hdr.querySelector('.nav');
    var setOpen = function (open) {
      hdr.classList.toggle('is-open', open);
      if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    if (menuBtn) menuBtn.addEventListener('click', function () { setOpen(!hdr.classList.contains('is-open')); });
    if (nav) nav.addEventListener('click', function (ev) { if (ev.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && hdr.classList.contains('is-open')) { setOpen(false); if (menuBtn) menuBtn.focus(); }
    });
    document.addEventListener('click', function (ev) {
      if (hdr.classList.contains('is-open') && !hdr.contains(ev.target)) setOpen(false);
    });
    var mq = window.matchMedia('(min-width: 1281px)');
    var onMq = function () { if (mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);

    /* sección actual en el menú: la última cuyo borde superior pasó el 35% de la pantalla */
    var links = [].slice.call(hdr.querySelectorAll('.nav a[href^="#"]:not([data-curso])'));
    var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var lastCur = -2;
    FX.onScroll(function () {
      root.classList.toggle('is-scrolled', window.scrollY > 8);
      var line = window.innerHeight * 0.35;
      var cur = -1;
      targets.forEach(function (t, i) {
        if (!t || !t.offsetParent) return;
        if (t.getBoundingClientRect().top <= line) cur = i;
      });
      if (cur !== lastCur) {
        lastCur = cur;
        links.forEach(function (a, i) { a.classList.toggle('is-current', i === cur); });
      }
    });
  }

  /* ------------------------------------------------------------- la sesión */
  var sess = document.querySelector('.sess');
  if (sess) {
    var items = [].slice.call(sess.querySelectorAll('.item'));
    var shots = [].slice.call(sess.querySelectorAll('.sess__frame > *'));   // <img> o .shot (foto + líneas)
    var curEl = sess.querySelector('.sess__cur');
    var nowEl = sess.querySelector('.sess__now');   // título del paso activo (franja sticky del celular)
    var active = -1;
    var showNow = function () {
      var h = items[Math.max(0, active)] && items[Math.max(0, active)].querySelector('h3');
      if (nowEl && h) nowEl.textContent = h.textContent;
    };
    FX.onScroll(function () {
      var mid = window.innerHeight * (window.innerWidth <= 860 ? 0.7 : 0.56);
      var idx = 0;
      items.forEach(function (it, i) { if (it.getBoundingClientRect().top < mid) idx = i; });
      if (idx === active) return;
      active = idx;
      items.forEach(function (it, i) { it.classList.toggle('is-active', i === idx); });
      shots.forEach(function (im, i) { im.classList.toggle('is-on', i === idx); });
      if (curEl) curEl.textContent = pad2(idx + 1);
      showNow();
    });
    document.addEventListener('langchange', showNow);
  }

  /* resultados: los antes/después van uno debajo del otro (sin fila horizontal);
     el tirador de cada uno lo maneja wm.js */
})();
