/*
 * Arma el sitio publicado (waltermolina.pro) a partir de v2/consultoria.html.
 *
 *   node tools/build-site.mjs <carpeta-de-salida>
 *
 * - La consultoría de la v2 pasa a ser la página principal (index.html).
 * - Sin probador de versiones (<html data-final>), sin v1/v3, sin la página de entrada.
 * - Español y portugués (lo define data-langs en v2/consultoria.html).
 * - br/index.html: la misma página empezando en portugués (waltermolina.pro/br).
 * - Cualquier dirección vieja (/v2/consultoria.html, /v1/, ...) redirige a la principal.
 *
 * Para cambiar el sitio, editá v2/consultoria.html, v2/style.css, v2/textos.js, v2/app.js
 * o assets/, y volvé a correr este script.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
// seguridad: la carpeta de salida se borra entera, así que nunca puede ser el repo, algo que lo contenga,
// ni otra carpeta del repo que no sea dist/
const inRepo = !path.relative(ROOT, OUT).startsWith('..');
const holdsRepo = !path.relative(OUT, ROOT).startsWith('..');
if (holdsRepo || (inRepo && path.relative(ROOT, OUT).split(path.sep)[0] !== 'dist')) {
  console.error('La salida tiene que ser dist/ o una carpeta fuera del repo.'); process.exit(1);
}

let html = fs.readFileSync(path.join(ROOT, 'v2/consultoria.html'), 'utf8');
function swap(from, to, all = false) {
  if (!html.includes(from)) throw new Error('No encontré en v2/consultoria.html: ' + from);
  html = all ? html.split(from).join(to) : html.replace(from, to);
}

swap('<html ', '<html data-final ');
swap('../assets/', 'assets/', true);
swap('href="style.css"', 'href="v2/style.css"');
swap('src="textos.js"', 'src="v2/textos.js"');
swap('src="app.js"', 'src="v2/app.js"');
// ya no hay página de inicio: el logo vuelve arriba y el link "Inicio" del pie se va
swap('class="logo" href="index.html"', 'class="logo" href="#main"', true);
html = html.replace(/\s*<a href="index\.html" data-i18n="nav_home">[^<]*<\/a>/, '');
if (/href="(index|consultoria)\.html"|\.\.\//.test(html)) throw new Error('Quedó un link a otra página de los prototipos.');

// waltermolina.pro/br: la misma página, pero empieza en portugués.
// Título y descripción ya en portugués en el HTML (las vistas previas de WhatsApp no ejecutan JS).
const SITE = 'https://waltermolina.pro';
const alt = '<link rel="alternate" hreflang="es" href="' + SITE + '/">\n' +
  '<link rel="alternate" hreflang="pt-BR" href="' + SITE + '/br/">\n' +
  '<link rel="alternate" hreflang="x-default" href="' + SITE + '/">\n';
let br = html;
function swapBr(from, to, all = false) {
  if (!br.includes(from)) throw new Error('No encontré (br): ' + from);
  br = all ? br.split(from).join(to) : br.replace(from, to);
}
swapBr('<html data-final lang="es"', '<html data-final lang="pt-BR" data-lang-start="pt"');
swapBr('src="assets/', 'src="../assets/', true);
swapBr('href="assets/', 'href="../assets/', true);
swapBr('src="v2/', 'src="../v2/', true);
swapBr('href="v2/', 'href="../v2/', true);
br = br.replace(/<title([^>]*)>[^<]*<\/title>/, '<title$1>Consultoria de visagismo · Walter Molina</title>');
br = br.replace(/<meta name="description" content="[^"]*">/,
  '<meta name="description" content="Consultoria de visagismo online 1 a 1 com Walter Molina: videoconferência online, projeto estratégico de imagem e um guia personalizado para melhorar a sua imagem.">');
br = br.replace('</head>', '<link rel="canonical" href="' + SITE + '/br/">\n' + alt + '</head>');
if (/(src|href)="(assets|v2)\//.test(br)) throw new Error('Quedó una ruta sin ../ en /br');
html = html.replace('</head>', '<link rel="canonical" href="' + SITE + '/">\n' + alt + '</head>');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'v2'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'br'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.writeFileSync(path.join(OUT, 'br', 'index.html'), br);
for (const f of ['style.css', 'textos.js', 'app.js']) fs.copyFileSync(path.join(ROOT, 'v2', f), path.join(OUT, 'v2', f));
fs.cpSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), { recursive: true });
// Netlify: lo que no existe va a la principal (los archivos que sí existen no se tocan)
// (las direcciones viejas de los prototipos; lo que existe, como v2/style.css, no se toca)
const OLD = ['/v1/*', '/v2/*', '/v3/*', '/atelier/*', '/blueprint/*', '/impacto/*', '/anteriores.html'];
fs.writeFileSync(path.join(OUT, '_redirects'), OLD.map((p) => p + '  /  301').join('\n') + '\n');

console.log('Sitio listo en ' + OUT);
