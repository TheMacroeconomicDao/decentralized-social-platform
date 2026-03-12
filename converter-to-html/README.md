# md2html — Markdown to self-contained HTML

CLI converts Markdown to a single HTML file with embedded CSS/JS, TOC, front matter, and pandoc-style heading IDs.

## Setup

```bash
npm install
```

## Usage

```bash
node md2html.js <input.md> [output.html]
```

- If `output.html` is omitted, output is `input.html` in the same directory.
- See project root `md2html-prompt.md` for full spec (front matter, TOC, slug rules, CSS/JS).

## Example

```bash
node md2html.js /prompts/md2html-prompt.md
# → ../md2html-prompt.html

node md2html.js doc.md dist/out.html
# → dist/out.html (creates dist if needed)
```
## Example 2

- Copy file PROJECT_OVERVIEW.md into converter-to-html
- In Cursor use menu Open Folder on converter-to-html
- npm install (if not exist)
- node md2html.js PROJECT_OVERVIEW.md