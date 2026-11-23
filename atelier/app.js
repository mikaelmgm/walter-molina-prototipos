/* ATELIER — comportamiento propio de las dos páginas (va después de ../assets/js/site.js) */
(function () {
  'use strict';
  var root = document.documentElement;
  var FX = window.FX;

  /* cabecera: fondo al empezar a bajar */
  function header() { root.classList.toggle('is-scrolled', window.scrollY > 30); }
  if (FX) FX.onScroll(header); else window.addEventListener('scroll', header, { passive: true });

  /* consultoría: entrada del retrato */
  var chero = document.querySelector('.chero');
  if (chero) window.setTimeout(function () { chero.classList.add('is-in'); }, 60);

  /* consultoría: la sesión — qué imagen muestra el marco fijo */
  var session = document.querySelector('.session');
  if (session) {
    var items = [].slice.call(session.querySelectorAll('.sitem'));
    var setActive = function () {
      var mid = window.innerHeight / 2;
      var best = 0;
      var bestDist = Infinity;
      items.forEach(function (it, i) {
        var r = it.getBoundingClientRect();
        var d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (session.getAttribute('data-active') !== String(best)) {
        session.setAttribute('data-active', best);
        items.forEach(function (it, i) { it.classList.toggle('is-on', i === best); });
      }
    };
    if (FX) FX.onScroll(setActive); else setActive();
  }

  /* antes / después: range accesible + arrastre directo */
  [].forEach.call(document.querySelectorAll('.ba'), function (ba) {
    var input = ba.querySelector('input');
    if (!input) return;
    var dragging = false;
    function paint() { ba.style.setProperty('--x', input.value + '%'); }
    function fromPointer(ev) {
      var r = ba.getBoundingClientRect();
      var v = Math.max(0, Math.min(100, ((ev.clientX - r.left) / r.width) * 100));
      input.value = String(Math.round(v * 10) / 10);
      paint();
    }
    input.addEventListener('input', paint);
    input.addEventListener('pointerdown', function (ev) {
      dragging = true;
      try { input.setPointerCapture(ev.pointerId); } catch (e) { /* sin captura */ }
      fromPointer(ev);
    });
    input.addEventListener('pointermove', function (ev) { if (dragging) fromPointer(ev); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (type) {
      input.addEventListener(type, function () { dragging = false; });
    });
    paint();
  });
})();
