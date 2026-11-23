/* Prototipo C · IMPACTO — comportamiento propio del estilo (se carga después de ../assets/js/site.js) */
(function () {
  'use strict';

  var root = document.documentElement;
  var mobile = window.matchMedia('(max-width: 760px)');
  function qsa(sel, ctx) { return [].slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }

  /* ---------------------------------------------------------------------
     Titulares de cartel: cada [data-fit] se escala hasta ocupar el ancho
     de su caja, en cualquier idioma.
       data-fit="d" | "m" | "dm"   en qué ancho se ajusta (desktop / móvil)
       data-fit-k=".6"             fracción del ancho a ocupar (data-fit-k-m para móvil)
       data-fit-max="12"           tope en vw   (data-fit-max-m para móvil)
       data-fit-maxh="17"          tope en vh   (sólo desktop)
       data-fit-group="x"          todos los del grupo usan el tamaño menor
     --------------------------------------------------------------------- */
  function fitAll() {
    var isM = mobile.matches;
    var groups = {};
    qsa('[data-fit]').forEach(function (el) {
      var mode = el.getAttribute('data-fit') || 'dm';
      el.style.fontSize = '';
      if (mode.indexOf(isM ? 'm' : 'd') < 0) return;
      var box = el.parentElement;
      var cs = window.getComputedStyle(box);
      var avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      el.style.fontSize = '100px';
      var w = el.offsetWidth;
      if (!w || !avail) { el.style.fontSize = ''; return; }
      var k = parseFloat(el.getAttribute(isM ? 'data-fit-k-m' : 'data-fit-k')) || 1;
      var size = 100 * avail * k / w;
      var max = parseFloat(el.getAttribute(isM ? 'data-fit-max-m' : 'data-fit-max'));
      if (max) size = Math.min(size, max * window.innerWidth / 100);
      var maxh = parseFloat(el.getAttribute('data-fit-maxh'));
      if (maxh && !isM) size = Math.min(size, maxh * window.innerHeight / 100);
      var g = el.getAttribute('data-fit-group');
      if (g && !isM) {
        (groups[g] = groups[g] || { els: [], size: Infinity }).els.push(el);
        groups[g].size = Math.min(groups[g].size, size);
      }
      el.style.fontSize = size.toFixed(2) + 'px';
    });
    Object.keys(groups).forEach(function (g) {
      groups[g].els.forEach(function (el) { el.style.fontSize = groups[g].size.toFixed(2) + 'px'; });
    });
    if (window.FX) window.FX.refresh();
  }

  var fitTimer = 0;
  window.addEventListener('resize', function () { window.clearTimeout(fitTimer); fitTimer = window.setTimeout(fitAll, 120); });
  window.addEventListener('load', fitAll);
  document.addEventListener('langchange', fitAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  fitAll();

  /* ---------------------------------------------------------------------
     Módulos apilados: cada tarjeta se achica y se apaga mientras la
     siguiente la tapa (--c 0..1).
     --------------------------------------------------------------------- */
  var cards = qsa('.stack__item');
  function stack() {
    for (var i = 0; i < cards.length; i++) {
      var c = 0;
      if (cards[i + 1]) {
        var a = cards[i].getBoundingClientRect();
        var b = cards[i + 1].getBoundingClientRect();
        c = clamp((a.bottom - b.top) / a.height);
      }
      cards[i].style.setProperty('--c', c.toFixed(3));
    }
  }

  /* ---------------------------------------------------------------------
     Header compacto + CTA fijo abajo en móvil
     --------------------------------------------------------------------- */
  var hero = document.querySelector('.hero');
  var end = document.querySelector('.end');
  function chrome() {
    var vh = window.innerHeight;
    root.classList.toggle('is-scrolled', window.scrollY > 60);
    var past = hero ? hero.getBoundingClientRect().bottom < vh * 0.4 : window.scrollY > vh;
    var nearEnd = end ? end.getBoundingClientRect().top < vh * 0.85 : false;
    root.classList.toggle('is-dock', past && !nearEnd);
  }

  /* ---------------------------------------------------------------------
     Antes / después: el scroll mueve el corte; arrastrar (o flechas del
     teclado) lo toma a mano hasta que se vuelve a scrollear.
     --------------------------------------------------------------------- */
  var ba = document.querySelector('.ba');
  var range = ba && ba.querySelector('.ba__range');
  var scene = ba && ba.closest('[data-scene]');
  var manualAt = null;
  function sceneP() { return scene ? (parseFloat(scene.style.getPropertyValue('--p')) || 0) : 0; }
  function compare() {
    if (!ba) return;
    var p = sceneP();
    if (manualAt !== null && Math.abs(p - manualAt) > 0.05) {
      manualAt = null;
      ba.style.removeProperty('--pos');
    }
    if (manualAt === null) range.value = String(Math.round(95 - clamp((p - 0.1) * 1.5) * 88));
  }
  if (range) {
    range.addEventListener('input', function () {
      manualAt = sceneP();
      ba.style.setProperty('--pos', range.value + '%');
    });
  }

  /* ---------------------------------------------------------------------
     Número con decimal (8,7K): cuenta al entrar y respeta el separador
     del idioma activo.
     --------------------------------------------------------------------- */
  var nums = qsa('[data-k]');
  function sep() { return root.getAttribute('data-lang') === 'en' ? '.' : ','; }
  function paint(el, v) { el.textContent = v.toFixed(1).replace('.', sep()) + 'K'; }
  function countK(el) {
    var to = parseFloat(el.getAttribute('data-k')) || 0;
    el.__done = true;
    if (window.FX && window.FX.reduce) { paint(el, to); return; }
    var t0 = null;
    (function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / 1400);
      paint(el, to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) window.requestAnimationFrame(step);
    })(window.performance.now());
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countK(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { io.observe(el); });
  }
  document.addEventListener('langchange', function () {
    nums.forEach(function (el) { paint(el, parseFloat(el.getAttribute('data-k')) || 0); });
  });
  nums.forEach(function (el) { paint(el, parseFloat(el.getAttribute('data-k')) || 0); });

  function onScroll() { stack(); chrome(); compare(); }
  if (window.FX) window.FX.onScroll(onScroll); else onScroll();
})();
