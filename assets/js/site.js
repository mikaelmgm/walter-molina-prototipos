/*
 * Walter Molina — prototipos. Helpers compartidos por las 6 páginas.
 *
 *  IDIOMAS  El HTML trae el texto en español. Cada página define antes de este script:
 *             window.I18N = { pt: { clave: 'html' }, en: { clave: 'html' } }
 *           y marca los textos con  data-i18n="clave"  (innerHTML)
 *           o atributos con         data-i18n-attr="alt:clave, aria-label:otra"
 *           Botones de idioma:      <button data-lang-btn="es|pt|en">
 *           Evento:                 document 'langchange'  (detail.lang)
 *
 *  WHATSAPP <a data-wa="consultoria|curso">  → href con mensaje en el idioma activo
 *
 *  SCROLL   [data-reveal]            → recibe .is-in al entrar en pantalla
 *           [data-scene]             → --p 0..1 mientras se recorre (contenedor alto con hijo sticky)
 *           [data-scene][data-steps="4"] → además data-step="0..3"
 *           [data-view]              → --v 0..1 mientras el elemento cruza la pantalla
 *           [data-count="10"]        → cuenta hasta el número al entrar
 *           [data-split]             → envuelve cada palabra: <span class="w"><span class="wi" style="--i:n">
 *           video[data-autoplay]     → reproduce sólo cuando está visible
 *           html                     → --scroll 0..1 (progreso de la página)
 *           FX.onScroll(fn)          → callback en cada frame de scroll/resize
 */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) root.classList.add('reduce-motion');

  /* ------------------------------------------------------------------ i18n */
  /* <html data-langs="es pt"> limita los idiomas de la página; en ese caso el idioma
     inicial es siempre español (salvo ?lang= o lo que el visitante eligió antes) */
  var LIMITED = !!root.getAttribute('data-langs');
  var LANGS = LIMITED ? root.getAttribute('data-langs').split(/\s+/) : ['es', 'pt', 'en'];
  var HTML_LANG = { es: 'es', pt: 'pt-BR', en: 'en' };
  var WA_NUMBER = '5548991327454';
  var WA_MSG = {
    consultoria: {
      es: 'Hola Walter, tengo interés en la consultoría de visagismo online. ¿Cómo funciona? Me gustaría saber más.',
      pt: 'Olá Walter, tenho interesse na consultoria de visagismo online. Como funciona? Gostaria de saber mais.',
      en: "Hi Walter, I'm interested in the online visagism consultation. How does it work? I'd like to know more."
    },
    curso: {
      es: 'Hola Walter, quiero saber más sobre el curso Barbero Visagista.',
      pt: 'Olá Walter, quero saber mais sobre o curso Barbeiro Visagista.',
      en: "Hi Walter, I'd like to know more about the Visagist Barber course."
    },
    'curso-pronto': {
      es: 'Hola Walter, quiero que me avises cuando abra el curso Barbero Visagista.',
      pt: 'Olá Walter, quero ser avisado quando abrir o curso Barbeiro Visagista.',
      en: "Hi Walter, please let me know when the Visagist Barber course opens."
    },
    soporte: {
      es: 'Hola Walter, tengo una consulta.',
      pt: 'Olá Walter, tenho uma dúvida.',
      en: 'Hi Walter, I have a question.'
    }
  };

  var dict = window.I18N || {};
  var textEls = [].slice.call(document.querySelectorAll('[data-i18n]'));
  var attrEls = [].slice.call(document.querySelectorAll('[data-i18n-attr]'));

  textEls.forEach(function (el) { el.__es = el.innerHTML; });
  attrEls.forEach(function (el) {
    el.__attrs = el.getAttribute('data-i18n-attr').split(',').map(function (pair) {
      var p = pair.split(':');
      var attr = p[0].trim();
      return { attr: attr, key: (p[1] || '').trim(), es: el.getAttribute(attr) || '' };
    });
  });

  function pick(lang, key, fallback) {
    var d = dict[lang];
    return d && d[key] != null ? d[key] : fallback;
  }

  function initialLang() {
    var q = /[?&]lang=(es|pt|en)\b/.exec(location.search);
    if (q && LANGS.indexOf(q[1]) > -1) return q[1];
    try {
      var s = localStorage.getItem('wm_lang');
      if (LANGS.indexOf(s) > -1) return s;
    } catch (e) { /* sin storage */ }
    if (LIMITED) return 'es';
    var n = (navigator.language || 'es').slice(0, 2).toLowerCase();
    return LANGS.indexOf(n) > -1 ? n : 'es';
  }

  var current = 'es';

  function waHref(kind, lang) {
    var msg = (WA_MSG[kind] || WA_MSG.consultoria)[lang || current];
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  }

  function setLang(lang, silent) {
    if (LANGS.indexOf(lang) < 0) lang = 'es';
    current = lang;
    root.lang = HTML_LANG[lang];
    root.setAttribute('data-lang', lang);

    textEls.forEach(function (el) {
      el.innerHTML = pick(lang, el.getAttribute('data-i18n'), el.__es);
    });
    attrEls.forEach(function (el) {
      el.__attrs.forEach(function (a) { el.setAttribute(a.attr, pick(lang, a.key, a.es)); });
    });
    [].forEach.call(document.querySelectorAll('[data-lang-btn]'), function (b) {
      var on = b.getAttribute('data-lang-btn') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    [].forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
      a.href = waHref(a.getAttribute('data-wa'), lang);
      a.target = '_blank';
      a.rel = 'noopener';
    });
    splitAll();
    if (!silent) { try { localStorage.setItem('wm_lang', lang); } catch (e) { /* sin storage */ } }
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
    schedule();
  }

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-lang-btn]');
    if (b) { ev.preventDefault(); setLang(b.getAttribute('data-lang-btn')); }
  });

  /* ----------------------------------------------------------- word split */
  function splitNode(node, counter) {
    [].slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var parts = child.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span');
          w.className = 'w';
          var wi = document.createElement('span');
          wi.className = 'wi';
          wi.style.setProperty('--i', counter.n++);
          wi.textContent = part;
          w.appendChild(wi);
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        splitNode(child, counter);
      }
    });
  }

  function splitAll() {
    [].forEach.call(document.querySelectorAll('[data-split]'), function (el) {
      if (el.querySelector('.w')) return;           // ya dividido (el innerHTML se repone al cambiar idioma)
      var counter = { n: 0 };
      splitNode(el, counter);
      el.style.setProperty('--n', counter.n);
    });
  }

  /* --------------------------------------------------------------- scroll */
  var scenes = [].slice.call(document.querySelectorAll('[data-scene]'));
  var views = [].slice.call(document.querySelectorAll('[data-view]'));
  var callbacks = [];
  var ticking = false;
  var rafId = 0;
  var timerId = 0;

  function clamp(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }

  function update() {
    ticking = false;
    window.cancelAnimationFrame(rafId);
    window.clearTimeout(timerId);
    var vh = window.innerHeight;
    var max = root.scrollHeight - vh;
    root.style.setProperty('--scroll', max > 0 ? clamp(window.scrollY / max).toFixed(4) : '0');

    scenes.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var total = r.height - vh;
      var p = total > 0 ? clamp(-r.top / total) : (r.top < 0 ? 1 : 0);
      el.style.setProperty('--p', p.toFixed(4));
      var steps = parseInt(el.getAttribute('data-steps'), 10);
      if (steps) {
        var s = String(Math.min(steps - 1, Math.floor(p * steps)));
        if (el.getAttribute('data-step') !== s) el.setAttribute('data-step', s);
      }
    });
    views.forEach(function (el) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--v', clamp((vh - r.top) / (vh + r.height)).toFixed(4));
    });
    callbacks.forEach(function (fn) { fn(); });
  }

  function schedule() {
    if (ticking) return;
    ticking = true;
    rafId = window.requestAnimationFrame(update);
    timerId = window.setTimeout(update, 150);       // por si la pestaña está en segundo plano y rAF no corre
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);

  /* --------------------------------------------------------------- reveal */
  var revealEls = [].slice.call(document.querySelectorAll('[data-reveal]'));
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------- count */
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    if (reduce) { el.textContent = String(target); return; }
    var t0 = null;
    var dur = 1400;
    function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = String(Math.round(target * eased));
      if (k < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  var countEls = [].slice.call(document.querySelectorAll('[data-count]'));
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    countEls.forEach(function (el) { cio.observe(el); });
  } else {
    countEls.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------------------------------------------------------------- video */
  var vids = [].slice.call(document.querySelectorAll('video[data-autoplay]'));
  vids.forEach(function (v) { v.muted = true; v.playsInline = true; v.loop = true; });
  if (!reduce && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.05 });
    vids.forEach(function (v) { vio.observe(v); });
  }

  /* ------------------------------------------------- chip "volver a protos" */
  var proto = document.body.getAttribute('data-proto');
  if (proto) {
    var chip = document.createElement('a');
    chip.href = '../anteriores.html';
    chip.textContent = '◂ ' + proto;
    chip.setAttribute('aria-label', 'Volver a la lista de prototipos');
    // pestaña lateral: no pisa ni el header ni las barras fijas de abajo en celular
    chip.style.cssText = 'position:fixed;left:0;top:50%;z-index:9999;display:block;width:max-content;' +
      'transform-origin:0 0;transform:rotate(-90deg) translateX(-50%);' +
      'font:500 10px/1 system-ui,sans-serif;letter-spacing:.06em;white-space:nowrap;' +
      'color:#fff;background:rgba(20,20,20,.85);' +
      'padding:6px 10px;border-radius:0 0 7px 7px;text-decoration:none;' +
      'border:1px solid rgba(255,255,255,.22);border-top:0;opacity:.75';
    chip.style.setProperty('bottom', 'auto', 'important');   // ignora reglas viejas que la mandaban abajo
    document.body.appendChild(chip);
  }

  window.FX = {
    onScroll: function (fn) { callbacks.push(fn); schedule(); },
    refresh: schedule,
    update: update,
    reduce: reduce,
    lang: function () { return current; },
    setLang: setLang,
    waHref: waHref,
    t: function (key) { var d = dict[current] || {}; var e = dict.es || {}; return d[key] != null ? d[key] : (e[key] != null ? e[key] : ''); }
  };

  setLang(initialLang(), true);
  update();
})();
