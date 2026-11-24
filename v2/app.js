/*
 * V2 · Estudio — comportamiento propio (después de site.js y wm.js).
 *  - header: fondo al hacer scroll, menú en celular, sección actual
 *  - la sesión: el ítem activo cambia la foto sticky
 *  - resultados: flechas, contador y barra de la fila horizontal;
 *    en pantallas táctiles la foto se arrastra para pasar y el tirador compara
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
    var shots = [].slice.call(sess.querySelectorAll('.sess__frame img'));
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

  /* ------------------------------------------------------------ resultados */
  var track = document.querySelector('.res__track');
  if (track) {
    var cards = [].slice.call(track.querySelectorAll('.bac'));
    var bar = document.querySelector('.res__bar');
    var count = document.querySelector('.res__cur');
    var prev = document.querySelector('.res__nav [data-dir="-1"]');
    var next = document.querySelector('.res__nav [data-dir="1"]');
    var stepW = function () { return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth; };

    [prev, next].forEach(function (b) {
      if (!b) return;
      b.addEventListener('click', function () {
        track.scrollBy({ left: stepW() * parseInt(b.getAttribute('data-dir'), 10), behavior: reduce ? 'auto' : 'smooth' });
      });
    });

    var sync = function () {
      var max = track.scrollWidth - track.clientWidth;
      var vis = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
      var p = max > 0 ? track.scrollLeft / max : 0;
      if (bar) {
        bar.style.setProperty('--rw', (vis * 100).toFixed(2) + '%');
        bar.style.setProperty('--rl', (p * (1 - vis) * 100).toFixed(2) + '%');
      }
      var i = Math.min(cards.length - 1, Math.round(track.scrollLeft / (stepW() || 1)));
      if (max > 0 && track.scrollLeft >= max - 4) i = cards.length - 1;
      if (count) count.textContent = pad2(i + 1);
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = max <= 4 || track.scrollLeft >= max - 4;
    };
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    window.addEventListener('load', sync);
    sync();
    /* táctil: arrastrar sobre la foto compara / revela (wm.js); la fila avanza con las flechas.
       En los modos "tocar" y "scroll" la foto no se arrastra, así que el swipe vuelve a pasar de foto (ver CSS). */
  }
})();
