/*
 * BLUEPRINT · prototipo B — piezas propias del estilo.
 * Se carga ANTES de ../assets/js/site.js: inyecta el esquema del rostro (para que site.js
 * encuentre sus textos traducibles) y suma al diccionario los textos comunes a las dos páginas.
 * Lo que depende de FX (site.js) corre en DOMContentLoaded.
 */
(function () {
  'use strict';

  /* ------------------------------------------------ textos comunes (pt / en) */
  var COMMON = {
    pt: {
      'c.skip': 'Pular para o conteúdo',
      'c.sub': 'Método · Visagismo',
      'c.nav.curso': 'Curso',
      'c.nav.cons': 'Consultoria',
      'c.langs': 'Idioma',
      'c.stat1': 'anos de ofício',
      'c.stat2n': '8,7 mil',
      'c.stat2': 'seguidores no Instagram',
      'c.stat3': 'dias com conteúdo educativo',
      'c.role': 'Barbeiro consultor e visagista',
      'c.foot.method': 'Método',
      'c.foot.wa': 'Escrever pelo WhatsApp',
      'c.foot.note': 'Protótipo B · Blueprint. Conteúdos de exemplo, sujeitos a revisão.',
      'c.foot.sheet': 'Prancha final',
      'c.lam': 'Prancha',
      'c.step': 'Passo',
      'c.scale': 'ESC. 1:1',
      'c.ig': 'Abrir o Instagram de Walter Molina (abre em outra aba)',
      'h.title': 'Esquema técnico de um rosto masculino com linhas de análise',
      'h.hairline': 'LINHA DO CABELO',
      'h.brows': 'SOBRANCELHAS',
      'h.nose': 'BASE DO NARIZ',
      'h.chin': 'QUEIXO',
      'h.volume': 'VOLUME +',
      'h.sides1': 'LATERAIS',
      'h.sides2': 'BAIXAS',
      'h.part': 'RISCA LATERAL',
      'h.cheek1': 'LINHA DA',
      'h.cheek2': 'BOCHECHA',
      'h.chinvol1': 'VOLUME',
      'h.chinvol2': 'NO QUEIXO',
      'h.format': 'FORMATO'
    },
    en: {
      'c.skip': 'Skip to content',
      'c.sub': 'Method · Visagism',
      'c.nav.curso': 'Course',
      'c.nav.cons': 'Consultation',
      'c.langs': 'Language',
      'c.stat1': 'years in the trade',
      'c.stat2n': '8.7k',
      'c.stat2': 'followers on Instagram',
      'c.stat3': 'days of educational content',
      'c.role': 'Consultant barber & visagist',
      'c.foot.method': 'Method',
      'c.foot.wa': 'Message on WhatsApp',
      'c.foot.note': 'Prototype B · Blueprint. Sample content, subject to review.',
      'c.foot.sheet': 'Final sheet',
      'c.lam': 'Sheet',
      'c.step': 'Step',
      'c.scale': 'SCALE 1:1',
      'c.ig': "Open Walter Molina's Instagram (opens in a new tab)",
      'h.title': 'Technical diagram of a male face with analysis lines',
      'h.hairline': 'HAIRLINE',
      'h.brows': 'BROWS',
      'h.nose': 'BASE OF NOSE',
      'h.chin': 'CHIN',
      'h.volume': 'VOLUME +',
      'h.sides1': 'LOW',
      'h.sides2': 'SIDES',
      'h.part': 'SIDE PART',
      'h.cheek1': 'CHEEK',
      'h.cheek2': 'LINE',
      'h.chinvol1': 'CHIN',
      'h.chinvol2': 'VOLUME',
      'h.format': 'FACE SHAPE'
    }
  };
  var dict = window.I18N = window.I18N || {};
  ['pt', 'en'].forEach(function (lang) {
    var target = dict[lang] = dict[lang] || {};
    Object.keys(COMMON[lang]).forEach(function (k) { if (!(k in target)) target[k] = COMMON[lang][k]; });
  });

  /* ------------------------------------------------ esquema del rostro (SVG) */
  var HAIR = 'M104,214 C100,180 94,130 108,92 C122,50 162,22 208,22 C254,22 292,48 300,92 C308,130 300,180 296,214 ' +
    'L286,212 C288,196 292,182 293,168 C294,140 284,120 262,112 C240,104 215,110 200,110 C190,110 170,105 146,110 ' +
    'C118,116 106,138 107,168 C108,182 112,196 114,212 Z';
  var BEARD = 'M104,214 C106,258 114,286 128,304 C144,330 170,366 200,366 C230,366 256,330 272,304 C286,286 294,258 296,214 ' +
    'L286,212 C284,244 274,270 250,284 C240,290 232,285 226,290 C216,282 208,284 200,284 C192,284 184,282 174,290 ' +
    'C168,285 160,290 150,284 C126,270 116,244 114,212 Z M178,304 C186,296 214,296 222,304 C214,319 186,319 178,304 Z';
  var count = 0;

  function headSVG() {
    var id = 'bp-hatch-' + (++count);
    var tid = 'bp-head-title-' + count;
    var d = function (path, k, cls) {
      return '<path class="draw' + (cls ? ' ' + cls : '') + '" pathLength="1" style="--k:' + k + '" d="' + path + '"/>';
    };
    return '' +
      '<svg class="head-svg" viewBox="-70 0 540 540" role="img" aria-labelledby="' + tid + '" xmlns="http://www.w3.org/2000/svg">' +
      '<title id="' + tid + '" data-i18n="h.title">Esquema técnico de un rostro masculino con líneas de análisis</title>' +
      '<defs class="h-acc"><pattern id="' + id + '" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<path d="M0,0 V7" stroke="currentColor" stroke-width="1.1" fill="none"/></pattern></defs>' +

      /* cabello: estructura del corte */
      '<g class="hl hl-hair h-acc">' +
        '<path class="hatch" style="fill:url(#' + id + ')" d="' + HAIR + '"/>' +
        d(HAIR, 0) +
        d('M150,109 C154,82 166,58 186,36', 1, 'thin') +
        d('M162,104 C188,72 238,62 284,86', 2, 'thin') +
        d('M184,107 C208,90 250,86 290,116', 3, 'thin') +
        '<g class="notes">' +
          '<path class="thin" d="M208,18 V4 M208,4 L204,10 M208,4 L212,10"/>' +
          '<text x="218" y="13" data-i18n="h.volume">VOLUMEN +</text>' +
          '<path class="thin" d="M332,150 H308 M308,150 L315,146 M308,150 L315,154"/>' +
          '<text x="338" y="148" data-i18n="h.sides1">LATERALES</text>' +
          '<text x="338" y="162" data-i18n="h.sides2">BAJOS</text>' +
          '<path class="thin" d="M66,150 H92 M92,150 L85,146 M92,150 L85,154"/>' +
          '<path class="thin" d="M160,72 L104,46"/>' +
          '<text x="100" y="44" text-anchor="end" data-i18n="h.part">RAYA LATERAL</text>' +
        '</g>' +
      '</g>' +

      /* barba */
      '<g class="hl hl-beard h-acc">' +
        '<path class="hatch" style="fill:url(#' + id + ')" fill-rule="evenodd" d="' + BEARD + '"/>' +
        d(BEARD, 0) +
        '<g class="notes">' +
          '<path class="thin" d="M280,252 L322,268"/>' +
          '<text x="326" y="266" data-i18n="h.cheek1">LÍNEA DE</text>' +
          '<text x="326" y="280" data-i18n="h.cheek2">MEJILLA</text>' +
          '<path class="thin" d="M234,360 L296,376"/>' +
          '<text x="300" y="374" data-i18n="h.chinvol1">VOLUMEN</text>' +
          '<text x="300" y="388" data-i18n="h.chinvol2">EN MENTÓN</text>' +
        '</g>' +
      '</g>' +

      /* base: contorno, orejas, cuello, rasgos */
      '<g class="h-base">' +
        d('M200,40 C252,40 292,78 295,142 C296,170 296,196 293,222 C290,258 284,282 272,300 C262,318 248,336 232,346 ' +
          'C222,351 212,352 200,352 C188,352 178,351 168,346 C152,336 138,318 128,300 C116,282 110,258 107,222 ' +
          'C104,196 104,170 105,142 C108,78 148,40 200,40 Z', 0) +
        d('M295,196 C305,186 316,196 314,218 C312,238 305,252 293,250', 4) +
        d('M105,196 C95,186 84,196 86,218 C88,238 95,252 107,250', 4) +
        d('M250,338 C250,362 252,384 258,396 C286,416 338,428 370,450 C388,462 396,486 398,540', 6) +
        d('M150,338 C150,362 148,384 142,396 C114,416 62,428 30,450 C12,462 4,486 2,540', 6) +
        d('M146,400 C166,430 234,430 254,400', 9, 'thin') +
        d('M107,168 C106,138 118,116 146,110 C170,105 190,110 200,110 C215,110 240,104 262,112 C284,120 294,140 293,168', 8, 'thin') +
        d('M216,190 C230,181 252,181 268,189', 10, 'bold') +
        d('M184,190 C170,181 148,181 132,189', 10, 'bold') +
        d('M222,212 C232,204 252,204 262,212 C252,218 232,218 222,212 Z', 11) +
        d('M178,212 C168,204 148,204 138,212 C148,218 168,218 178,212 Z', 11) +
        '<circle class="draw" pathLength="1" style="--k:12" cx="242" cy="211" r="4"/>' +
        '<circle class="draw" pathLength="1" style="--k:12" cx="158" cy="211" r="4"/>' +
        d('M184,258 C181,266 187,271 194,270 C198,273 202,273 206,270 C213,271 219,266 216,258', 13) +
        d('M174,303 C186,298 194,300 200,302 C206,300 214,298 226,303', 14) +
        d('M184,311 C194,317 206,317 216,311', 14, 'thin') +
      '</g>' +

      /* tercios */
      '<g class="hl hl-thirds h-acc">' +
        '<path class="axis" d="M200,10 V386"/>' +
        d('M74,110 H336', 0, 'thin') + d('M74,190 H336', 1, 'thin') + d('M74,270 H336', 2, 'thin') + d('M74,350 H336', 3, 'thin') +
        '<g class="lbl-left">' +
          '<text x="66" y="114" text-anchor="end" data-i18n="h.hairline">LÍNEA DEL CABELLO</text>' +
          '<text x="66" y="194" text-anchor="end" data-i18n="h.brows">CEJAS</text>' +
          '<text x="66" y="274" text-anchor="end" data-i18n="h.nose">BASE DE LA NARIZ</text>' +
          '<text x="66" y="354" text-anchor="end" data-i18n="h.chin">MENTÓN</text>' +
        '</g>' +
        '<g class="dims">' +
          '<path class="thin" d="M356,110 V350 M349,110 H363 M349,190 H363 M349,270 H363 M349,350 H363"/>' +
          '<text x="368" y="154">1/3</text><text x="368" y="234">1/3</text><text x="368" y="314">1/3</text>' +
        '</g>' +
      '</g>' +

      /* formato */
      '<g class="hl hl-format h-acc">' +
        d('M118,118 L282,118 L292,232 L270,298 L232,346 L168,346 L130,298 L108,232 Z', 0) +
        '<path class="chord" d="M118,118 H282 M108,232 H292 M130,298 H270"/>' +
        '<g class="notes">' +
          '<path class="thin" d="M282,118 H305 M292,232 H321 M270,298 H291"/>' +
          '<circle class="balloon" cx="314" cy="118" r="9.5"/><text x="314" y="122.4" text-anchor="middle">A</text>' +
          '<circle class="balloon" cx="330" cy="232" r="9.5"/><text x="330" y="236.4" text-anchor="middle">B</text>' +
          '<circle class="balloon" cx="300" cy="298" r="9.5"/><text x="300" y="302.4" text-anchor="middle">C</text>' +
          '<text x="330" y="34" data-i18n="h.format">FORMATO</text>' +
          '<text class="big" x="330" y="54">OVAL</text>' +
          '<text x="330" y="72">A ≈ C &lt; B</text>' +
        '</g>' +
        '<circle class="node" cx="118" cy="118" r="3.4"/><circle class="node" cx="282" cy="118" r="3.4"/>' +
        '<circle class="node" cx="292" cy="232" r="3.4"/><circle class="node" cx="270" cy="298" r="3.4"/>' +
        '<circle class="node" cx="232" cy="346" r="3.4"/><circle class="node" cx="168" cy="346" r="3.4"/>' +
        '<circle class="node" cx="130" cy="298" r="3.4"/><circle class="node" cx="108" cy="232" r="3.4"/>' +
      '</g>' +
      '</svg>';
  }

  [].forEach.call(document.querySelectorAll('[data-head]'), function (el) {
    var variants = el.getAttribute('data-head').split(/\s+/);
    el.classList.add('head');
    variants.forEach(function (v) { if (v) el.classList.add('head--' + v); });
    el.innerHTML = headSVG();
  });

  /* ------------------------------------------------ interacción (después de site.js) */
  var LAYERS = ['thirds', 'format', 'hair', 'beard'];
  var MAPS = {
    read: [{}, { thirds: 'on' }, { thirds: 'dim', format: 'on' }, { format: 'dim', hair: 'on' }, { hair: 'mid', beard: 'on' }],
    doc: [{}, { thirds: 'on', format: 'on' }, { thirds: 'dim', format: 'dim', hair: 'on' }, { hair: 'mid', beard: 'on' }, { hair: 'on', beard: 'on' }]
  };

  function applyScene(scene) {
    var step = parseInt(scene.getAttribute('data-step'), 10) || 0;
    if (scene.__step === step) return;
    scene.__step = step;
    var map = (MAPS[scene.getAttribute('data-layers')] || [])[step] || {};
    LAYERS.forEach(function (name) {
      [].forEach.call(scene.querySelectorAll('.hl-' + name), function (g) {
        g.classList.toggle('is-on', map[name] === 'on');
        g.classList.toggle('is-dim', map[name] === 'dim');
        g.classList.toggle('is-mid', map[name] === 'mid');
      });
    });
    [].forEach.call(scene.querySelectorAll('.step'), function (panel, i) {
      var on = i === step;
      panel.classList.toggle('is-current', on);
      panel.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    [].forEach.call(scene.querySelectorAll('[data-at]'), function (el) {
      el.classList.toggle('is-filled', step >= parseInt(el.getAttribute('data-at'), 10));
    });
  }

  function init() {
    var FX = window.FX;
    var scenes = [].slice.call(document.querySelectorAll('[data-scene][data-layers]'));
    var fab = document.querySelector('.fab');
    var foot = document.querySelector('.foot');

    function onScroll() {
      scenes.forEach(applyScene);
      if (fab) {
        var past = window.scrollY > window.innerHeight * 0.75;
        var nearEnd = foot ? foot.getBoundingClientRect().top < window.innerHeight * 0.92 : false;
        fab.classList.toggle('is-on', past && !nearEnd);
      }
    }
    if (FX && FX.onScroll) FX.onScroll(onScroll);
    else { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }

    /* comparador antes / después */
    [].forEach.call(document.querySelectorAll('.cmp'), function (cmp) {
      var input = cmp.querySelector('input[type="range"]');
      if (!input) return;
      function set() {
        cmp.style.transition = 'none';
        cmp.style.setProperty('--pos', input.value + '%');
      }
      input.addEventListener('input', set);
      input.addEventListener('change', set);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
