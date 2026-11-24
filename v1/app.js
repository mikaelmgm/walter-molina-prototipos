/* V1 · ATELIER MADEIRA — comportamiento propio de las dos páginas.
 * Va después de ../assets/js/site.js y ../assets/js/wm.js.
 *   [data-slats="n"]   → agrega n ripas que cubren la foto; se abren cuando el
 *                        ancestro [data-reveal="slats"] recibe .is-in (site.js)
 *   [data-ripline]     → línea de ripas que crece con el scroll (usa --v de site.js)
 *   .menu-btn / #nav   → menú en celular
 *   [data-res]         → pestañas de antes/después en celular
 */
(function () {
  'use strict';
  var root = document.documentElement;
  var FX = window.FX;

  /* ------------------------------------------------ ripas que cubren la foto */
  [].forEach.call(document.querySelectorAll('[data-slats]'), function (el) {
    var n = parseInt(el.getAttribute('data-slats'), 10) || 7;
    var box = document.createElement('span');
    box.className = 'slats';
    box.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < n; i++) {
      var s = document.createElement('i');
      s.style.setProperty('--i', i);
      box.appendChild(s);
    }
    el.appendChild(box);
  });

  /* ------------------------------------------- línea de ripas entre secciones */
  function rand(k) { var x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  var lines = [].slice.call(document.querySelectorAll('[data-ripline]'));
  function buildLines() {
    lines.forEach(function (el, li) {
      var cs = window.getComputedStyle(el);
      var w = parseFloat(cs.getPropertyValue('--rip-w')) || 15;
      var g = parseFloat(cs.getPropertyValue('--rip-g')) || 5;
      var n = Math.ceil(el.clientWidth / (w + g)) + 1;
      if (el.childElementCount === n) return;
      var frag = document.createDocumentFragment();
      for (var k = 0; k < n; k++) {
        var wave = 0.5 + 0.5 * Math.sin(k * 0.17 + li * 2.3) * Math.cos(k * 0.047 + li);
        var h = 0.16 + 0.84 * wave * (0.72 + 0.28 * rand(k + li * 97));
        var i = document.createElement('i');
        i.style.setProperty('--h', Math.max(0.1, Math.min(1, h)).toFixed(3));
        i.style.setProperty('--r', rand(k * 3.7 + li * 11).toFixed(3));
        frag.appendChild(i);
      }
      el.textContent = '';
      el.appendChild(frag);
    });
  }
  if (lines.length) {
    buildLines();
    var rt = 0;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(buildLines, 120); });
  }

  /* ------------- respaldo del reveal: si IntersectionObserver no llega a correr
     (pestaña en segundo plano, vistas previas), revela lo que ya está en pantalla */
  var pending = [].slice.call(document.querySelectorAll('[data-reveal]'));
  function sweep() {
    if (!pending.length) return;
    var vh = window.innerHeight;
    pending = pending.filter(function (el) {
      if (el.classList.contains('is-in')) return false;
      var r = el.getBoundingClientRect();
      if ((r.width || r.height) && r.bottom > 0 && r.top < vh * 0.94) { el.classList.add('is-in'); return false; }
      return true;
    });
  }
  window.setTimeout(sweep, 900);

  /* ----------------------------------------------------------- cabecera */
  var hdr = document.querySelector('.hdr');
  var spyLinks = [].slice.call(document.querySelectorAll('[data-spy]'));
  function onScroll() {
    sweep();
    if (hdr) root.classList.toggle('is-scrolled', window.scrollY > 24);
    if (!spyLinks.length) return;
    var mark = window.innerHeight * 0.4;
    var current = null;
    spyLinks.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute('data-spy'));
      if (!sec || !sec.offsetParent) return;
      var r = sec.getBoundingClientRect();
      if (r.top <= mark && r.bottom > mark) current = a;
    });
    spyLinks.forEach(function (a) { a.classList.toggle('is-active', a === current); });
  }
  if (FX) FX.onScroll(onScroll); else { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }

  /* ---------------------------------------------------------- menú celular */
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    var setMenu = function (open) {
      root.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    btn.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
    nav.addEventListener('click', function (ev) { if (ev.target.closest('a, button')) setMenu(false); });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); btn.focus(); }
    });
    document.addEventListener('click', function (ev) {
      if (root.classList.contains('menu-open') && !ev.target.closest('.hdr')) setMenu(false);
    });
    var mq = window.matchMedia('(min-width: 1101px)');
    var onMq = function () { if (mq.matches) setMenu(false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
  }

  /* ------------------------------------- resultados: pestañas (celular) */
  var list = document.querySelector('.res__list');
  var tabs = [].slice.call(document.querySelectorAll('[data-res]'));
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      list.setAttribute('data-active', t.getAttribute('data-res'));
      tabs.forEach(function (o) {
        var on = o === t;
        o.classList.toggle('is-on', on);
        o.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (FX) FX.refresh();
    });
  });
})();
