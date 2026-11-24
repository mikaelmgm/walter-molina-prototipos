/*
 * Walter Molina — piezas compartidas de las versiones nuevas (v1, v2, v3).
 * Cargar después de content.js y site.js.  Necesita prefs.js en el <head>.
 *
 *  BARRA DEL PROBADOR   se crea sola (arriba, fixed). Versión / página / tema / portada /
 *                       formato del video / testimonios / idioma / copiar enlace.
 *                       <html data-v="1" data-page="inicio|consultoria">
 *
 *  VIDEO DE PRESENTACIÓN  <div data-wm-player-slot="top"></div> y <div data-wm-player-slot="bottom"></div>
 *                       Con portada=video se monta en "top"; con portada=imagen en "bottom".
 *                       Formatos (html[data-vfmt]): a = presentación + resultados debajo,
 *                       b = Walter y transformaciones lado a lado, c = edición intercalada.
 *                       Clases: .wmp .wmp--a|b|c .wmp__stage .wmp__screen(--main|--side) .wmp__video
 *                               .wmp__cap .wmp__sound .wmp__bar .wmp__strip .wmp__thumb .wmp__tag
 *
 *  CURSO "PRONTO"       cualquier [data-curso] abre el aviso (.wmc …). Botón a WhatsApp.
 *
 *  ANTES / DESPUÉS      [data-ba] con .ba__img--after, .ba__before > img, .ba__handle → --ba: 0%..100%
 */
(function () {
  'use strict';
  var root = document.documentElement;
  var P = window.WM_PREFS;
  var FX = window.FX;
  if (!P || !FX) return;

  var me = document.currentScript && document.currentScript.src;
  var ASSETS = me ? me.replace(/js\/wm\.js(\?.*)?$/, '') : '../assets/';
  var VERSION = root.getAttribute('data-v') || '1';
  var PAGE = root.getAttribute('data-page') || 'inicio';
  var reduce = FX.reduce;
  var t = FX.t;
  try { if (/^[123]$/.test(VERSION)) localStorage.setItem('wm_v', VERSION); } catch (e) { /* sin storage */ }

  /* ======================================================= barra del probador */
  var UI = {
    es: { tag: 'Prototipo', ver: 'Versión', page: 'Página', home: 'Inicio', consult: 'Consultoría', theme: 'Tema', dark: 'Oscuro', light: 'Claro',
      hero: 'Portada', heroV: 'Con video', heroI: 'Sólo imagen', vfmt: 'Video de presentación (página de inicio)',
      a: 'A · Presentación primero', b: 'B · Al mismo tiempo', c: 'C · Editado (intercalado)',
      aD: 'Walter habla y los resultados aparecen debajo.', bD: 'Walter a un lado y las transformaciones al otro.', cD: 'Su voz sigue y la imagen alterna con transformaciones.',
      ba: 'Antes y después', baC: 'Comparar', baR: 'Arrastrar desde el antes', baT: 'Tocar (fundido)', baS: 'Con el scroll',
      baCD: 'Empieza en la mitad y arrastrás para comparar.', baRD: 'Empieza sólo en el antes; arrastrás para descubrir el después.',
      baTD: 'Tocás la foto y el antes se funde en el después.', baSD: 'La transformación ocurre sola mientras bajás la página.',
      dep: 'Testimonios', depS: 'Mostrar ejemplo', depH: 'Ocultar', lang: 'Idioma', more: 'Opciones', copy: 'Copiar enlace con esta configuración', copied: '¡Enlace copiado!',
      reset: 'Restablecer', hide: 'Ocultar barra', show: 'Probar versiones', close: 'Cerrar',
      names: { 1: 'Atelier', 2: 'Estudio', 3: 'Proporción' } },
    pt: { tag: 'Protótipo', ver: 'Versão', page: 'Página', home: 'Início', consult: 'Consultoria', theme: 'Tema', dark: 'Escuro', light: 'Claro',
      hero: 'Capa', heroV: 'Com vídeo', heroI: 'Só imagem', vfmt: 'Vídeo de apresentação (página inicial)',
      a: 'A · Apresentação primeiro', b: 'B · Ao mesmo tempo', c: 'C · Editado (intercalado)',
      aD: 'Walter fala e os resultados aparecem embaixo.', bD: 'Walter de um lado e as transformações do outro.', cD: 'A voz continua e a imagem alterna com as transformações.',
      ba: 'Antes e depois', baC: 'Comparar', baR: 'Arrastar a partir do antes', baT: 'Tocar (esvanecer)', baS: 'Com o scroll',
      baCD: 'Começa na metade e você arrasta para comparar.', baRD: 'Começa só no antes; você arrasta para revelar o depois.',
      baTD: 'Você toca na foto e o antes se dissolve no depois.', baSD: 'A transformação acontece sozinha enquanto você desce a página.',
      dep: 'Depoimentos', depS: 'Mostrar exemplo', depH: 'Ocultar', lang: 'Idioma', more: 'Opções', copy: 'Copiar link com esta configuração', copied: 'Link copiado!',
      reset: 'Restaurar', hide: 'Ocultar barra', show: 'Testar versões', close: 'Fechar',
      names: { 1: 'Atelier', 2: 'Estúdio', 3: 'Proporção' } },
    en: { tag: 'Prototype', ver: 'Version', page: 'Page', home: 'Home', consult: 'Consultation', theme: 'Theme', dark: 'Dark', light: 'Light',
      hero: 'Cover', heroV: 'With video', heroI: 'Image only', vfmt: 'Intro video (home page)',
      a: 'A · Intro first', b: 'B · Side by side', c: 'C · Edited (intercut)',
      aD: 'Walter talks and the results show up below.', bD: 'Walter on one side, transformations on the other.', cD: 'His voice continues while the picture cuts to transformations.',
      ba: 'Before & after', baC: 'Compare', baR: 'Drag from before', baT: 'Tap (fade)', baS: 'On scroll',
      baCD: 'Starts in the middle; drag to compare.', baRD: 'Starts on the before; drag to reveal the after.',
      baTD: 'Tap the photo and the before fades into the after.', baSD: 'The transformation plays by itself as you scroll down.',
      dep: 'Testimonials', depS: 'Show sample', depH: 'Hide', lang: 'Language', more: 'Options', copy: 'Copy link with these settings', copied: 'Link copied!',
      reset: 'Reset', hide: 'Hide bar', show: 'Try versions', close: 'Close',
      names: { 1: 'Atelier', 2: 'Studio', 3: 'Proportion' } }
  };
  function u(k) { var d = UI[FX.lang()] || UI.es; return d[k] != null ? d[k] : UI.es[k]; }

  function query(extra) {
    var q = new URLSearchParams();
    ['tema', 'portada', 'video', 'antesdespues', 'testimonios'].forEach(function (k) { q.set(k, P.get(k)); });
    q.set('lang', FX.lang());
    if (extra) Object.keys(extra).forEach(function (k) { q.set(k, extra[k]); });
    return '?' + q.toString();
  }
  function urlFor(v, page) {
    return '../v' + v + '/' + (page === 'consultoria' ? 'consultoria.html' : 'index.html') + query();
  }
  function syncUrl() {
    try { history.replaceState(null, '', location.pathname + query() + location.hash); } catch (e) { /* file:// */ }
  }

  var bar = document.createElement('div');
  bar.className = 'wmbar';
  bar.setAttribute('role', 'region');
  var tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'wmtab';

  function seg(attr, value, label, on, extraClass) {
    return '<button type="button" class="wmbar__seg' + (on ? ' is-on' : '') + (extraClass ? ' ' + extraClass : '') +
      '" data-' + attr + '="' + value + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + label + '</button>';
  }
  function row(label, inner, desc) {
    return '<div class="wmbar__row"><span class="wmbar__rl">' + label + '</span><div class="wmbar__opts">' + inner + '</div>' +
      (desc ? '<p class="wmbar__desc">' + desc + '</p>' : '') + '</div>';
  }

  var sheetOpen = false;
  function renderBar() {
    var names = u('names');
    var theme = P.get('tema'), hero = P.get('portada'), vf = P.get('video'), dep = P.get('testimonios'), lang = FX.lang();
    var bm = P.get('antesdespues'), BM = { comparar: 'C', revelar: 'R', tocar: 'T', scroll: 'S' };
    var vers = [1, 2, 3].map(function (n) { return seg('ver', n, String(n), String(n) === VERSION); }).join('');
    var pages = seg('page', 'inicio', u('home'), PAGE === 'inicio') + seg('page', 'consultoria', u('consult'), PAGE === 'consultoria');
    var themes = seg('set', 'tema:oscuro', '<span aria-hidden="true">◐</span> ' + u('dark'), theme === 'oscuro', 'wmbar__seg--theme') +
      seg('set', 'tema:claro', '<span aria-hidden="true">○</span> ' + u('light'), theme === 'claro', 'wmbar__seg--theme');
    bar.setAttribute('aria-label', u('show'));
    bar.innerHTML =
      '<div class="wmbar__in">' +
        '<span class="wmbar__tag"><i></i>' + u('tag') + '</span>' +
        '<div class="wmbar__grp"><span class="wmbar__lbl">' + u('ver') + '</span>' + vers +
          '<span class="wmbar__name">' + names[VERSION] + '</span></div>' +
        '<div class="wmbar__grp wmbar__grp--page">' + pages + '</div>' +
        '<div class="wmbar__grp wmbar__grp--theme">' + themes + '</div>' +
        '<button type="button" class="wmbar__more" aria-expanded="' + sheetOpen + '"><span aria-hidden="true">⚙</span> <span class="wmbar__moretx">' + u('more') + '</span></button>' +
        '<button type="button" class="wmbar__x" aria-label="' + u('hide') + '" title="' + u('hide') + '">×</button>' +
      '</div>' +
      '<div class="wmbar__sheet"' + (sheetOpen ? '' : ' hidden') + '>' +
        row(u('ver'), [1, 2, 3].map(function (n) { return seg('ver', n, n + ' · ' + names[n], String(n) === VERSION); }).join('')) +
        row(u('page'), pages) +
        row(u('theme'), seg('set', 'tema:oscuro', u('dark'), theme === 'oscuro') + seg('set', 'tema:claro', u('light'), theme === 'claro')) +
        row(u('hero'), seg('set', 'portada:video', u('heroV'), hero === 'video') + seg('set', 'portada:imagen', u('heroI'), hero === 'imagen')) +
        row(u('vfmt'), seg('set', 'video:a', u('a'), vf === 'a') + seg('set', 'video:b', u('b'), vf === 'b') + seg('set', 'video:c', u('c'), vf === 'c'), u(vf + 'D')) +
        row(u('ba'), Object.keys(BM).map(function (m) { return seg('set', 'antesdespues:' + m, u('ba' + BM[m]), bm === m); }).join(''), u('ba' + BM[bm] + 'D')) +
        row(u('dep'), seg('set', 'testimonios:1', u('depS'), dep === '1') + seg('set', 'testimonios:0', u('depH'), dep === '0')) +
        row(u('lang'), ['es', 'pt', 'en'].map(function (l) { return seg('lang', l, l.toUpperCase(), l === lang); }).join('')) +
        '<div class="wmbar__actions"><button type="button" class="wmbar__copy">' + u('copy') + '</button>' +
        '<button type="button" class="wmbar__reset">' + u('reset') + '</button></div>' +
      '</div>';
    tab.textContent = '⚙ ' + u('show');
    tab.setAttribute('aria-label', u('show'));
  }

  bar.addEventListener('click', function (ev) {
    ev.wmInside = true;
    var b = ev.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-ver')) {
      if (b.getAttribute('data-ver') !== VERSION) location.href = urlFor(b.getAttribute('data-ver'), PAGE);
      return;
    }
    if (b.hasAttribute('data-page')) {
      if (b.getAttribute('data-page') !== PAGE) location.href = urlFor(VERSION, b.getAttribute('data-page'));
      return;
    }
    if (b.hasAttribute('data-lang')) { FX.setLang(b.getAttribute('data-lang')); return; }
    if (b.hasAttribute('data-set')) {
      var kv = b.getAttribute('data-set').split(':');
      P.set(kv[0], kv[1]);
      return;
    }
    if (b.classList.contains('wmbar__more')) { sheetOpen = !sheetOpen; renderBar(); return; }
    if (b.classList.contains('wmbar__x')) { sheetOpen = false; P.set('panel', '0'); return; }
    if (b.classList.contains('wmbar__reset')) {
      try { localStorage.removeItem('wm_prefs'); } catch (e) { /* */ }
      location.href = location.pathname;
      return;
    }
    if (b.classList.contains('wmbar__copy')) {
      var link = new URL(location.pathname + query(), location.href).href;
      var done = function () { b.textContent = u('copied'); setTimeout(renderBar, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, function () { window.prompt(u('copy'), link); });
      else window.prompt(u('copy'), link);
    }
  });
  tab.addEventListener('click', function () { P.set('panel', '1'); });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && sheetOpen) { sheetOpen = false; renderBar(); }
  });
  document.addEventListener('click', function (ev) {
    if (sheetOpen && !ev.wmInside && !bar.contains(ev.target)) { sheetOpen = false; renderBar(); }
  });

  renderBar();
  document.body.appendChild(bar);
  document.body.appendChild(tab);

  /* ============================================================ video player */
  var SUBS = {};
  function loadSubs(lang) {
    if (SUBS[lang]) return SUBS[lang];
    SUBS[lang] = fetch(ASSETS + 'subs/walter.' + lang + '.vtt').then(function (r) { return r.text(); }).then(function (txt) {
      var cues = [];
      txt.replace(/\r/g, '').split('\n\n').forEach(function (block) {
        var lines = block.split('\n').filter(Boolean);
        var i = lines.findIndex(function (l) { return l.indexOf('-->') > -1; });
        if (i < 0) return;
        var m = lines[i].split('-->').map(function (s) {
          var p = s.trim().split(':').map(parseFloat);
          return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1];
        });
        cues.push({ s: m[0], e: m[1], t: lines.slice(i + 1).join(' ') });
      });
      return cues;
    }).catch(function () { return []; });
    return SUBS[lang];
  }

  var player = null;

  function videoEl(src, poster, cls) {
    var v = document.createElement('video');
    v.className = cls || 'wmp__video';
    v.muted = true; v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.playsInline = true;
    v.preload = 'metadata';
    if (poster) v.poster = poster;
    v.src = src;
    return v;
  }
  function safePlay(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }

  function buildPlayer() {
    if (player) { player.destroy(); player = null; }
    var slots = [].slice.call(document.querySelectorAll('[data-wm-player-slot]'));
    if (!slots.length) return;
    var want = P.get('portada') === 'imagen' ? 'bottom' : 'top';
    var slot = document.querySelector('[data-wm-player-slot="' + want + '"]') || slots[0];
    slots.forEach(function (s) { s.innerHTML = ''; });

    var fmt = P.get('video');
    var V = ASSETS + 'video/';
    var fig = document.createElement('figure');
    fig.className = 'wmp wmp--' + fmt;
    var stage = document.createElement('div');
    stage.className = 'wmp__stage';
    var mainScreen = document.createElement('div');
    mainScreen.className = 'wmp__screen wmp__screen--main';
    var main = videoEl(V + (fmt === 'c' ? 'intercalado.mp4' : 'apresentacao.mp4'), V + 'apresentacao.jpg');
    main.loop = true;
    mainScreen.appendChild(main);
    var cap = document.createElement('div');
    cap.className = 'wmp__cap';
    cap.setAttribute('aria-hidden', 'true');
    var capTx = document.createElement('span');
    cap.appendChild(capTx);
    mainScreen.appendChild(cap);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wmp__sound';
    btn.innerHTML = '<svg class="wmp__ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square">' +
      '<path d="M3.5 9h4l5-4v14l-5-4h-4z" fill="currentColor" stroke="none"/>' +
      '<path class="wmp__waves" d="M16 8.5a5 5 0 0 1 0 7M18.6 5.8a8.8 8.8 0 0 1 0 12.4"/>' +
      '<path class="wmp__x" d="M16 9.5l5 5M21 9.5l-5 5"/></svg>' +
      '<span class="wmp__lbl"></span><span class="wmp__len"></span>';
    mainScreen.appendChild(btn);
    var barEl = document.createElement('div');
    barEl.className = 'wmp__bar';
    barEl.innerHTML = '<i></i>';
    mainScreen.appendChild(barEl);
    stage.appendChild(mainScreen);

    var side = null, sideIdx = 0, clips = ['t1', 't2', 't3', 't4'];
    if (fmt === 'b') {
      var sideScreen = document.createElement('div');
      sideScreen.className = 'wmp__screen wmp__screen--side';
      side = videoEl(V + clips[0] + '.mp4', V + clips[0] + '.jpg');
      sideScreen.appendChild(side);
      var tag = document.createElement('span');
      tag.className = 'wmp__tag';
      sideScreen.appendChild(tag);
      stage.appendChild(sideScreen);
      side.addEventListener('ended', function () {
        sideIdx = (sideIdx + 1) % clips.length;
        side.src = V + clips[sideIdx] + '.mp4';
        safePlay(side);
      });
    }
    fig.appendChild(stage);

    var strip = null;
    if (fmt === 'a') {
      strip = document.createElement('div');
      strip.className = 'wmp__strip';
      var stripTag = document.createElement('span');
      stripTag.className = 'wmp__tag';
      strip.appendChild(stripTag);
      clips.forEach(function (c, i) {
        var th = document.createElement('div');
        th.className = 'wmp__thumb';
        th.style.setProperty('--i', i);
        var tv = videoEl(V + c + '.mp4', V + c + '.jpg', 'wmp__tv');
        tv.loop = true;
        th.appendChild(tv);
        strip.appendChild(th);
      });
      fig.appendChild(strip);
    }
    slot.appendChild(fig);

    var listening = false, cues = [], visible = false, raf = 0;

    function labels() {
      btn.querySelector('.wmp__lbl').textContent = listening ? t('video_mute') : t('video_sound');
      btn.querySelector('.wmp__len').textContent = listening ? '' : t('video_len');
      btn.setAttribute('aria-pressed', listening ? 'true' : 'false');
      fig.classList.toggle('is-listening', listening);
      [].forEach.call(fig.querySelectorAll('.wmp__tag'), function (el) { el.textContent = t('video_results'); });
    }
    function setCues() { loadSubs(FX.lang()).then(function (c) { cues = c; tick(); }); }
    function tick() {
      var now = main.currentTime || 0;
      var c = null;
      for (var i = 0; i < cues.length; i++) { if (now >= cues[i].s && now < cues[i].e) { c = cues[i]; break; } }
      var txt = c ? c.t : '';
      if (capTx.textContent !== txt) { capTx.textContent = txt; cap.classList.toggle('is-on', !!txt); }
      if (main.duration) barEl.style.setProperty('--t', (now / main.duration).toFixed(4));
    }
    function loop() { tick(); raf = requestAnimationFrame(loop); }
    function playAll() {
      if (reduce && !listening) return;
      safePlay(main); if (side) safePlay(side);
      if (strip) [].forEach.call(strip.querySelectorAll('video'), safePlay);
    }
    function pauseAll() {
      main.pause(); if (side) side.pause();
      if (strip) [].forEach.call(strip.querySelectorAll('video'), function (v) { v.pause(); });
    }
    function toggleSound() {
      listening = !listening;
      if (listening) {
        main.loop = false; main.currentTime = 0; main.muted = false;
        if (side) { sideIdx = 0; side.src = V + clips[0] + '.mp4'; }
        playAll();
      } else {
        main.muted = true; main.loop = true;
      }
      labels();
    }
    btn.addEventListener('click', toggleSound);
    main.addEventListener('click', toggleSound);
    main.addEventListener('ended', function () {
      listening = false; main.muted = true; main.loop = true; main.currentTime = 0;
      labels(); if (visible) playAll();
    });
    main.addEventListener('play', function () { cancelAnimationFrame(raf); loop(); fig.classList.add('is-playing'); });
    main.addEventListener('pause', function () { cancelAnimationFrame(raf); tick(); fig.classList.remove('is-playing'); });
    main.addEventListener('loadedmetadata', tick);

    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          visible = e.isIntersecting;
          if (visible) playAll(); else if (!listening) pauseAll();
        });
      }, { threshold: 0.25 });
      io.observe(stage);
    } else { playAll(); }

    function onLang() { labels(); setCues(); }
    document.addEventListener('langchange', onLang);
    labels(); setCues();

    player = {
      destroy: function () {
        cancelAnimationFrame(raf);
        if (io) io.disconnect();
        document.removeEventListener('langchange', onLang);
        pauseAll();
        [].forEach.call(fig.querySelectorAll('video'), function (v) { v.removeAttribute('src'); v.load(); });
        fig.remove();
      }
    };
  }

  /* ============================================================ curso pronto */
  var modal = document.createElement('div');
  modal.className = 'wmc';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'wmc-title');
  modal.innerHTML =
    '<div class="wmc__backdrop" data-close></div>' +
    '<div class="wmc__card" tabindex="-1">' +
      '<button type="button" class="wmc__x" data-close>×</button>' +
      '<p class="wmc__kicker"></p>' +
      '<h2 class="wmc__title" id="wmc-title"></h2>' +
      '<p class="wmc__status"><i aria-hidden="true"></i><span></span></p>' +
      '<p class="wmc__text"></p>' +
      '<a class="wmc__cta" target="_blank" rel="noopener"></a>' +
    '</div>';
  document.body.appendChild(modal);
  var lastFocus = null;
  function fillModal() {
    modal.querySelector('.wmc__kicker').innerHTML = t('course_kicker');
    modal.querySelector('.wmc__title').innerHTML = t('course_title');
    modal.querySelector('.wmc__status span').innerHTML = t('course_status');
    modal.querySelector('.wmc__text').innerHTML = t('course_text');
    var cta = modal.querySelector('.wmc__cta');
    cta.textContent = t('course_cta');
    cta.href = FX.waHref('curso-pronto');
    modal.querySelector('.wmc__x').setAttribute('aria-label', t('course_close'));
  }
  function openModal() {
    fillModal();
    lastFocus = document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
    root.classList.add('wmc-lock');
    modal.querySelector('.wmc__card').focus();
  }
  function closeModal() {
    modal.classList.remove('is-open');
    root.classList.remove('wmc-lock');
    setTimeout(function () { modal.hidden = true; }, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click', function (ev) {
    var c = ev.target.closest && ev.target.closest('[data-curso]');
    if (c) { ev.preventDefault(); openModal(); return; }
    if (!modal.hidden && ev.target.closest('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && !modal.hidden) closeModal();
  });

  /* ======================================================== antes / después */
  /* Modos (html[data-bamode]): comparar = empieza en 50% y se arrastra;
     revelar = empieza sólo en el antes (puxador a la derecha) y al arrastrar aparece el después;
     tocar = un toque funde el antes en el después (y vuelve);
     scroll = el después se descubre solo mientras se baja la página.          */
  var HINT = {
    es: { comparar: 'Deslizá para comparar', revelar: 'Arrastrá para ver el después', tocar: 'Tocá para ver el después', back: 'Tocá para ver el antes' },
    pt: { comparar: 'Arraste para comparar', revelar: 'Arraste para ver o depois', tocar: 'Toque para ver o depois', back: 'Toque para ver o antes' },
    en: { comparar: 'Drag to compare', revelar: 'Drag to see the after', tocar: 'Tap to see the after', back: 'Tap to see the before' }
  };
  function hintTx(k) { var d = HINT[FX.lang()] || HINT.es; return d[k] || ''; }
  var baList = [];
  [].forEach.call(document.querySelectorAll('[data-ba]'), function (el) {
    var handle = el.querySelector('.ba__handle');
    var hint = el.querySelector('.ba__hint');
    if (!hint) { hint = document.createElement('span'); hint.className = 'ba__hint'; hint.setAttribute('aria-hidden', 'true'); el.appendChild(hint); }
    var state = document.createElement('span');
    state.className = 'ba__state';
    state.setAttribute('aria-live', 'polite');
    el.appendChild(state);
    var start = parseFloat(el.getAttribute('data-ba')) || 50;
    var pos = start, mode = '', touched = false, dragging = false, moved = 0;

    function set(v) {
      pos = Math.max(0, Math.min(100, v));
      el.style.setProperty('--ba', pos + '%');
      var w = el.clientWidth || 1, px = pos / 100 * w, k = 22;
      el.style.setProperty('--ba-k', (px < k ? k - px : px > w - k ? (w - k) - px : 0) + 'px');
      if (handle) handle.setAttribute('aria-valuenow', Math.round(pos));
    }
    function labels() {
      state.textContent = mode === 'tocar' ? FX.t(el.classList.contains('is-after') ? 'after' : 'before') : '';
      hint.textContent = mode === 'tocar' ? hintTx(el.classList.contains('is-after') ? 'back' : 'tocar') : mode === 'scroll' ? '' : hintTx(mode);
      el.classList.toggle('is-touched', touched);
      el.setAttribute('aria-label', mode === 'tocar' ? hint.textContent : hintTx('comparar'));
    }
    function reset() {
      mode = P.get('antesdespues');
      touched = false;
      el.classList.remove('is-after');
      if (mode === 'tocar') { el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); }
      else { el.removeAttribute('role'); el.removeAttribute('tabindex'); }
      set(mode === 'comparar' || mode === 'tocar' ? start : 100);   // revelar/scroll: sólo el antes (antes a la izquierda, después a la derecha)
      if (mode === 'scroll') scrollTick();
      labels();
    }
    function fromEvent(ev) {
      var r = el.getBoundingClientRect();
      set((ev.clientX - r.left) / r.width * 100);
    }
    function canDrag() { return mode === 'comparar' || mode === 'revelar'; }
    el.addEventListener('pointerdown', function (ev) {
      moved = 0;
      if (!canDrag()) return;
      dragging = true; el.classList.add('is-drag');
      try { el.setPointerCapture(ev.pointerId); } catch (e) { /* */ }
      if (mode === 'comparar') fromEvent(ev);
    });
    el.addEventListener('pointermove', function (ev) {
      if (!dragging) return;
      moved += Math.abs(ev.movementX || 0);
      fromEvent(ev);
      if (!touched && moved > 6) { touched = true; labels(); }
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (n) {
      el.addEventListener(n, function () { dragging = false; el.classList.remove('is-drag'); });
    });
    function toggle() {
      if (mode !== 'tocar') return;
      touched = true;
      el.classList.toggle('is-after');
      labels();
    }
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', function (ev) {
      if (mode === 'tocar' && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); toggle(); }
    });
    if (handle) {
      handle.setAttribute('role', 'slider');
      handle.setAttribute('tabindex', '0');
      handle.setAttribute('aria-valuemin', '0');
      handle.setAttribute('aria-valuemax', '100');
      handle.addEventListener('keydown', function (ev) {
        if (!canDrag()) return;
        if (ev.key === 'ArrowLeft') { set(pos - 5); ev.preventDefault(); }
        if (ev.key === 'ArrowRight') { set(pos + 5); ev.preventDefault(); }
        if (!touched) { touched = true; labels(); }
      });
    }
    function scrollTick() {
      if (mode !== 'scroll') return;
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      // empieza cuando la foto entra por abajo y termina cuando su centro llega al 40% de la pantalla
      var p = (vh - r.top) / (vh * 0.6 + r.height * 0.5);
      set((1 - Math.max(0, Math.min(1, p))) * 100);
    }
    FX.onScroll(scrollTick);
    window.addEventListener('resize', function () { set(pos); });
    baList.push({ reset: reset, labels: labels });
    reset();
  });

  /* ================================================== encuadre por rostro */
  /* object-position calculado detectando el rostro en cada archivo (con aire para pelo y barba).
     Se aplica inline; para desactivarlo: data-focus="off" en el elemento o en <html>. */
  var FOCUS = {
    'img/antes.jpg': '54% 54%', 'img/despues.jpg': '54% 54%',
    'img/ba1-antes.jpg': '48% 41%', 'img/ba1-despues.jpg': '48% 41%', 'img/ba2-antes.jpg': '52% 52%', 'img/ba2-despues.jpg': '52% 52%',
    'img/ba3-antes.jpg': '50% 57%', 'img/ba3-despues.jpg': '50% 57%', 'img/ba4-antes.jpg': '45% 54%', 'img/ba4-despues.jpg': '45% 54%',
    'img/barba.jpg': '55% 50%', 'img/cliente-frente.jpg': '55% 70%', 'img/consulta-mesa.jpg': '56% 36%', 'img/corte-perfil.jpg': '50% 60%',
    'img/lateral.jpg': '50% 45%', 'img/medicion.jpg': '50% 45%', 'img/tijera.jpg': '50% 45%', 'img/reel-05.jpg': '52% 42%', 'img/reel-12.jpg': '55% 56%',
    'img/walter-bust.jpg': '31% 37%', 'img/walter-face.jpg': '41% 50%', 'img/walter-full.jpg': '31% 17%', 'img/walter-hero.jpg': '68% 28%', 'img/walter-wood.jpg': '23% 30%',
    'video/t1': '50% 41%', 'video/t2': '50% 51%', 'video/t3': '50% 58%', 'video/t4': '46% 54%', 'video/hero-loop': '50% 52%',
    'video/estructura': '65% 44%', 'video/lateral': '72% 57%', 'video/tijera': '54% 52%', 'video/transformacion': '47% 64%'
  };
  function focusKey(src) {
    var m = /(img|video)\/([^\/?#]+)$/.exec(src || '');
    if (!m) return null;
    return m[1] === 'video' ? 'video/' + m[2].replace(/\.(mp4|jpg)$/, '') : 'img/' + m[2];
  }
  function applyFocus(scope) {
    if (root.getAttribute('data-focus') === 'off') return;
    [].forEach.call((scope || document).querySelectorAll('img, video'), function (el) {
      if (el.getAttribute('data-focus') === 'off' || el.closest('.wmp')) return;
      var src = el.currentSrc || el.getAttribute('src') || (el.querySelector('source') || {}).src || el.getAttribute('poster');
      var k = focusKey(src);
      if (k && FOCUS[k]) el.style.objectPosition = FOCUS[k];
    });
  }

  /* ================================================================ eventos */
  document.addEventListener('wm:prefs', function (ev) {
    var k = ev.detail.key;
    if (k === 'portada' || k === 'video') buildPlayer();
    if (k === 'antesdespues') baList.forEach(function (b) { b.reset(); });
    renderBar();
    syncUrl();
    FX.refresh();
  });
  document.addEventListener('langchange', function () {
    renderBar();
    if (!modal.hidden) fillModal();
    baList.forEach(function (b) { b.labels(); });
    syncUrl();
  });

  buildPlayer();
  applyFocus();
  syncUrl();
  window.WM = { rebuildPlayer: buildPlayer, openCourse: openModal, applyFocus: applyFocus };
})();
