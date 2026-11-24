# Walter Molina — protótipos de site

Site de consultoria de visagismo online (com o curso "em breve"), em ES / PT / EN.

## Versões novas (rodada 2)
Cada versão tem duas páginas: **entrada** (`index.html`, estilo link-na-bio com o vídeo de apresentação) e **consultoria** (`consultoria.html`, a landing principal).

- **v1 · Atelier** — evolução do Atelier que ele gostou: café, cobre, ripas de madeira
- **v2 · Estudio** — clara, luz do escritório, fotografia
- **v3 · Proporción** — proporção áurea 1,618, fios que se desenham

A barra no topo de cada página (o "probador") troca versão, página, tema claro/escuro, capa com vídeo ou só imagem, formato do vídeo (A presentação primeiro · B ao mesmo tempo · C editado intercalado), depoimentos e idioma — e copia um link já configurado.
Parâmetros de URL: `?v=2&pagina=consultoria&tema=claro&portada=imagen&video=b&testimonios=0&lang=pt` (`v` e `pagina` só na raiz).

Peças compartilhadas: `assets/js/content.js` (textos), `assets/js/prefs.js`, `assets/js/wm.js`, `assets/css/wm-base.css`, `assets/subs/` (legendas do vídeo).

## Rodada 1
Os 3 estilos anteriores (Atelier, Blueprint, Impacto) continuam em `anteriores.html`.

Rodar localmente: `node tools/serve.js` e abrir http://localhost:4173/.

> Protótipos: depoimentos e parte dos textos são exemplos para ajustar com o conteúdo real.

## Site publicado (waltermolina.pro)

O site no ar é **só a consultoria da v2**, em espanhol e português, sem o probador de versões.
Ele é gerado a partir de `v2/consultoria.html` (+ `v2/style.css`, `v2/textos.js`, `v2/app.js` e `assets/`):

```
node tools/build-site.mjs dist
netlify deploy --prod --dir dist --site 945eb9b4-049f-4a10-b266-a3850409af50
```

Para mudar o site, edite esses arquivos da v2 e gere de novo. Os protótipos (v1, v2, v3, probador) continuam no GitHub Pages.
