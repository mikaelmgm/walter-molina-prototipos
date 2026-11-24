/*
 * Walter Molina — preferencias del probador de versiones.
 * Va en el <head> (síncrono) para que el tema/portada estén puestos antes de pintar.
 *
 * Lee ?tema=&portada=&video=&testimonios=&panel=  (o lo último guardado) y pone en <html>:
 *   data-theme="oscuro|claro"      (por defecto: <html data-theme-default="...">)
 *   data-hero="video|imagen"       portada con video o sólo imagen
 *   data-vfmt="a|b|c"              formato del video de presentación
 *   data-dep="1|0"                 mostrar / ocultar testimonios
 *   data-bamode="comparar|revelar|tocar|scroll"   cómo funciona el antes / después
 *   data-panel="1|0"               barra del probador visible
 *   --wm-bar                       alto de la barra (44px o 0px): usalo en todo lo fixed/sticky arriba
 */
(function () {
  var root = document.documentElement;
  var OPTS = {
    tema: ['oscuro', 'claro'],
    portada: ['video', 'imagen'],
    video: ['a', 'b', 'c'],
    testimonios: ['1', '0'],
    antesdespues: ['comparar', 'revelar', 'tocar', 'scroll'],
    panel: ['1', '0']
  };
  var DEF = { portada: 'video', video: 'c', testimonios: '1', antesdespues: 'comparar', panel: '1' };
  var stored = {};
  try { stored = JSON.parse(localStorage.getItem('wm_prefs') || '{}') || {}; } catch (e) { stored = {}; }
  var q = new URLSearchParams(location.search);
  var p = {};
  Object.keys(OPTS).forEach(function (k) {
    var v = q.get(k);
    if (OPTS[k].indexOf(v) < 0) v = stored[k];
    if (OPTS[k].indexOf(v) > -1) p[k] = v;
  });
  // lo que vino por URL queda guardado
  try { localStorage.setItem('wm_prefs', JSON.stringify(p)); } catch (e) { /* sin storage */ }

  function eff(k) {
    if (p[k]) return p[k];
    if (k === 'tema') return root.getAttribute('data-theme-default') || 'oscuro';
    return DEF[k];
  }
  function apply() {
    root.setAttribute('data-theme', eff('tema'));
    root.setAttribute('data-hero', eff('portada'));
    root.setAttribute('data-vfmt', eff('video'));
    root.setAttribute('data-dep', eff('testimonios'));
    root.setAttribute('data-bamode', eff('antesdespues'));
    root.setAttribute('data-panel', eff('panel'));
    root.style.setProperty('--wm-bar', eff('panel') === '1' ? '44px' : '0px');
  }
  apply();

  window.WM_PREFS = {
    OPTS: OPTS,
    get: eff,
    explicit: p,
    set: function (k, v) {
      if (OPTS[k] && OPTS[k].indexOf(v) > -1) p[k] = v;
      try { localStorage.setItem('wm_prefs', JSON.stringify(p)); } catch (e) { /* sin storage */ }
      apply();
      document.dispatchEvent(new CustomEvent('wm:prefs', { detail: { key: k, value: eff(k) } }));
    }
  };
})();
