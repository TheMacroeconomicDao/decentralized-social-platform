#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// --- Slugify (build-time): pandoc-style, deduplicated ---
const slugSeen = new Map();
function slugify(text, index) {
  if (typeof text !== 'string') text = '';
  let s = text
    .toLowerCase()
    .normalize('NFC')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/[^\p{L}\p{N}\-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (!s) s = `section-${index}`;
  const count = (slugSeen.get(s) || 0) + 1;
  slugSeen.set(s, count);
  return count === 1 ? s : `${s}-${count}`;
}

function resetSlugState() {
  slugSeen.clear();
}

// --- First H1 from markdown content (no front matter title) ---
function getFirstH1(content) {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '';
}

// --- Escape for HTML attribute ---
function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

// --- Embedded CSS (verbatim from spec) ---
const EMBEDDED_CSS = `:root {
  --primary-color: #1a1a2e;
  --secondary-color: #16213e;
  --accent-color: #0f3460;
  --highlight-color: #e94560;
  --text-color: #2c2c2c;
  --light-bg: #f8f9fa;
  --border-color: #e0e0e0;
  --code-bg: #f4f4f4;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
               'Helvetica Neue', Arial, sans-serif;
  line-height: 1.7;
  color: var(--text-color);
  background: #fff;
}
header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: 3rem 2rem;
  position: relative;
  overflow: hidden;
}
header::before {
  content: '';
  position: absolute; top:0; left:0; right:0; bottom:0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}
header h1 {
  font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;
  position: relative; z-index: 1; color: #fff;
}
header .subtitle {
  font-size: 1.2rem; opacity: 0.9; position: relative; z-index: 1;
}
header .meta {
  margin-top: 1.5rem; font-size: 0.9rem; opacity: 0.8;
  position: relative; z-index: 1;
}
.nav-sidebar {
  position: fixed; left: 0; top: 0; width: 280px; height: 100vh;
  background: var(--light-bg); border-right: 1px solid var(--border-color);
  overflow-y: auto; padding: 5rem 1.5rem 1.5rem; z-index: 100; display: none;
}
.nav-sidebar.active { display: block; }
.nav-toggle {
  position: fixed; left: 1rem; top: 1rem; z-index: 101;
  background: var(--primary-color); color: white; border: none;
  padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer;
  font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1); transition: background 0.2s;
}
.nav-toggle:hover { background: var(--secondary-color); }
.nav-toggle.open { background: var(--highlight-color); }
.nav-title {
  font-size: 0.85rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.05em; color: var(--accent-color);
  margin-bottom: 1rem; padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--highlight-color);
}
.nav-list { list-style: none; }
.nav-list li { margin-bottom: 0.25rem; }
.nav-list a {
  display: block; padding: 0.4rem 0.5rem; color: var(--text-color);
  text-decoration: none; font-size: 0.9rem; border-radius: 4px; transition: all 0.2s;
}
.nav-list a:hover { background: var(--border-color); color: var(--highlight-color); }
.nav-list .section { font-weight: 600; color: var(--primary-color); margin-top: 1rem; padding-left: 0; }
.nav-list .subsection { padding-left: 1rem; font-size: 0.85rem; }
.nav-list .subsubsection { padding-left: 2rem; font-size: 0.8rem; color: #666; }
main { max-width: 900px; margin: 0; padding: 2rem; }
main.with-nav { margin-left: 280px; }
body.nav-open header { margin-left: 280px; }
body.nav-open main { margin-left: 280px; }
h1,h2,h3,h4,h5,h6 { color: var(--primary-color); margin-top: 2rem; margin-bottom: 1rem; line-height: 1.3; }
h1 { font-size: 2.2rem; }
h2 { font-size: 1.8rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; }
h3 { font-size: 1.4rem; }
h4 { font-size: 1.2rem; }
p { margin-bottom: 1rem; }
table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
th,td { padding: 0.75rem; text-align: left; border: 1px solid var(--border-color); }
th { background: var(--light-bg); font-weight: 600; }
tr:nth-child(even) { background: #fafafa; }
pre,code {
  background: var(--code-bg);
  font-family: 'SF Mono','Monaco','Inconsolata','Fira Code',monospace;
  font-size: 0.85rem;
}
pre { padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0; border: 1px solid var(--border-color); }
code { padding: 0.2rem 0.4rem; border-radius: 4px; }
pre code { padding: 0; background: none; }
blockquote {
  border-left: 4px solid var(--highlight-color); padding: 1rem;
  margin: 1.5rem 0; font-style: italic; color: #555;
  background: var(--light-bg); border-radius: 0 8px 8px 0;
}
ul,ol { margin-left: 1.5rem; margin-bottom: 1rem; }
li { margin-bottom: 0.5rem; }
a { color: var(--accent-color); text-decoration: none; }
a:hover { color: var(--highlight-color); text-decoration: underline; }
hr { border: none; border-top: 1px solid var(--border-color); margin: 2rem 0; }
.back-to-top {
  position: fixed; bottom: 2rem; right: 2rem;
  background: var(--highlight-color); color: white;
  width: 50px; height: 50px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; opacity: 0; transition: opacity 0.3s;
  box-shadow: 0 4px 15px rgba(233,69,96,0.3);
}
.back-to-top.visible { opacity: 1; }
.search-box {
  position: sticky; top: 0; background: var(--light-bg);
  padding-bottom: 1rem; margin-bottom: 1rem; z-index: 10;
}
.search-box input {
  width: 100%; padding: 0.75rem 1rem; border: 2px solid var(--border-color);
  border-radius: 8px; font-size: 0.95rem; transition: border-color 0.3s, box-shadow 0.3s;
  background: white;
}
.search-box input:focus {
  outline: none; border-color: var(--highlight-color);
  box-shadow: 0 0 0 3px rgba(233,69,96,0.15);
}
.search-box input::placeholder { color: #999; }
.print-btn {
  position: fixed; bottom: 2rem; right: 5rem;
  background: var(--accent-color); color: white;
  width: 50px; height: 50px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: 0 4px 15px rgba(15,52,96,0.3);
  border: none; font-size: 1.3rem; z-index: 50;
}
.print-btn:hover { background: var(--primary-color); }
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--light-bg); }
::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent-color); }
figure { margin: 1.5rem 0; text-align: center; }
figcaption { font-size: 0.9rem; color: #666; margin-top: 0.5rem; font-style: italic; }
@media print {
  .nav-toggle,.nav-sidebar,.back-to-top,.print-btn { display: none !important; }
  main { margin-left: 0 !important; max-width: 100% !important; padding: 0 !important; }
  body { font-size: 11pt; line-height: 1.5; }
  header { padding: 1rem 0; background: none !important; color: var(--primary-color) !important; }
  header .subtitle, header .meta { color: var(--text-color) !important; opacity: 1 !important; }
  h1,h2,h3,h4 { page-break-after: avoid; }
  pre,blockquote,table,figure { page-break-inside: avoid; }
  pre { white-space: pre-wrap; word-wrap: break-word; }
  a { color: var(--text-color) !important; text-decoration: none !important; }
}
@media (max-width: 768px) {
  .nav-sidebar { width: 100%; height: auto; max-height: 60vh; position: relative; }
  main { max-width: 100%; margin-left: 0; margin-right: 0; padding: 1.25rem; }
  main.with-nav { margin-left: 0; }
  body.nav-open header, body.nav-open main { margin-left: 0; }
  header { padding: 2rem 1.25rem; }
  header h1 { font-size: 1.8rem; }
  table { font-size: 0.8rem; }
}
`;

// --- Embedded JS (verbatim from spec) ---
const EMBEDDED_JS = `// Auto-assign short numeric IDs (e.g. "1.", "1.1.", "4.6.5.", "1.2a.")
(function() {
  const headings = document.querySelectorAll('main h1, main h2, main h3, main h4');
  headings.forEach(function(h) {
    const text = h.textContent.trim();
    const match = text.match(/^(\\d+(?:\.\\d+)*[a-z]?)[\\.\\s]/);
    if (match && !h.id) h.setAttribute('id', match[1]);
  });
  headings.forEach(function(h) {
    const text = h.textContent.trim();
    if (h.id) return;
    if (/^Приложение\\s+([A-Z])\\./.test(text)) {
      const letter = text.match(/^Приложение\\s+([A-Z])\\./)[1];
      h.setAttribute('id', 'appendix-' + letter);
    }
    if (/^Аннотация/.test(text)) h.setAttribute('id', 'abstract');
    if (/^Содержание/.test(text)) h.setAttribute('id', 'toc');
  });
})();

function toggleNav() {
  const sidebar = document.getElementById('navSidebar');
  const main = document.getElementById('mainContent');
  const toggleBtn = document.querySelector('.nav-toggle');
  sidebar.classList.toggle('active');
  main.classList.toggle('with-nav');
  toggleBtn.classList.toggle('open');
  document.body.classList.toggle('nav-open');
  const span = toggleBtn.querySelector('span');
  span.textContent = sidebar.classList.contains('active') ? '\\u2715' : '\\u2630';
}

function filterNav() {
  const filter = document.getElementById('searchInput').value.toLowerCase();
  const items = document.getElementById('navList').getElementsByTagName('li');
  for (let i = 0; i < items.length; i++) {
    const a = items[i].querySelector('a');
    if (!a) continue;
    items[i].style.display =
      (a.textContent || a.innerText).toLowerCase().includes(filter) ? '' : 'none';
  }
}

window.onscroll = function() {
  const btn = document.getElementById('backToTop');
  const scrolled = document.body.scrollTop > 300 || document.documentElement.scrollTop > 300;
  btn.classList.toggle('visible', scrolled);
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Smooth scroll with Cyrillic ID support
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    let target = document.getElementById(targetId);
    if (!target) {
      try { target = document.getElementById(decodeURIComponent(targetId)); } catch(_) {}
    }
    if (target) {
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
`;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildNavList(toc) {
  return toc
    .map(({ depth, slug, text }) => {
      const cls =
        depth === 2 ? 'section' : depth === 3 ? 'subsection' : 'subsubsection';
      return `<li><a href="#${escapeAttr(slug)}" class="${cls}">${escapeHtml(text)}</a></li>`;
    })
    .join('\n    ');
}

function buildMeta(version, license, author, date) {
  const parts = [];
  if (version) parts.push(`<strong>Версия:</strong> ${escapeHtml(version)}`);
  if (license) parts.push(`<strong>Лицензия:</strong> ${escapeHtml(license)}`);
  if (author) parts.push(`<strong>Авторство:</strong> ${escapeHtml(author)}`);
  if (date) parts.push(`<strong>Дата:</strong> ${escapeHtml(date)}`);
  if (parts.length === 0) return '';
  return `\n    <div class="meta">\n      ${parts.join(' | ')}\n    </div>`;
}

function convert(inputPath, outputPath) {
  if (!fs.existsSync(inputPath)) {
    process.stderr.write(`Error: input file not found: ${inputPath}\n`);
    process.exit(1);
  }

  const outDir = path.dirname(outputPath);
  if (outDir && !fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const raw = fs.readFileSync(inputPath, 'utf8');
  const { data: front, content } = matter(raw);

  const title =
    front.title != null && front.title !== ''
      ? String(front.title)
      : getFirstH1(content) || 'Document';
  const subtitle = front.subtitle != null ? String(front.subtitle) : '';
  const version = front.version != null ? String(front.version) : '';
  const license = front.license != null ? String(front.license) : '';
  const author = front.author != null ? String(front.author) : '';
  const date = front.date != null ? String(front.date) : '';
  const lang = front.lang != null ? String(front.lang) : 'ru';

  resetSlugState();
  const toc = [];
  let slugIndex = 0;

  const renderer = {
    heading(token) {
      const depth = token.depth;
      const text = token.text || '';
      const htmlContent = this.parser.parseInline(token.tokens);
      if (depth >= 2 && depth <= 4) {
        const slug = slugify(text, slugIndex++);
        toc.push({ depth, slug, text });
        return `<h${depth} id="${escapeAttr(slug)}">${htmlContent}</h${depth}>\n`;
      }
      return `<h${depth}>${htmlContent}</h${depth}>\n`;
    },
  };
  marked.use({ renderer });

  const bodyHtml = marked.parse(content);
  const navListHtml = buildNavList(toc);
  const metaHtml = buildMeta(version, license, author, date);

  const html = `<!DOCTYPE html>
<html lang="${escapeAttr(lang)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>${EMBEDDED_CSS}</style>
</head>
<body>

  <!-- Toggle button -->
  <button class="nav-toggle" onclick="toggleNav()">
    <span>☰</span> Содержание
  </button>

  <!-- Sidebar nav -->
  <nav class="nav-sidebar" id="navSidebar">
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="Поиск..." oninput="filterNav()">
    </div>
    <div class="nav-title">Содержание</div>
    <ul class="nav-list" id="navList">
    ${navListHtml}
    </ul>
  </nav>

  <!-- Header -->
  <header>
    <h1>${escapeHtml(title)}</h1>
    <div class="subtitle">${escapeHtml(subtitle)}</div>${metaHtml}
  </header>

  <!-- Content -->
  <main id="mainContent">
${bodyHtml.trim()}
  </main>

  <!-- Back to top -->
  <div class="back-to-top" id="backToTop" onclick="scrollToTop()">↑</div>

  <!-- Print button -->
  <button class="print-btn" onclick="window.print()" title="Сохранить как PDF">🖨</button>

  <script>${EMBEDDED_JS}</script>
</body>
</html>
`;

  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`✓ Converted: ${inputPath} → ${outputPath}`);
}

// --- CLI ---
const args = process.argv.slice(2);
if (args.length < 1) {
  process.stderr.write('Usage: node md2html.js <input.md> [output.html]\n');
  process.exit(1);
}

const inputPath = path.resolve(args[0]);
const outputPath =
  args[1] != null
    ? path.resolve(args[1])
    : inputPath.replace(/\.(md|markdown)$/i, '.html');

convert(inputPath, outputPath);
