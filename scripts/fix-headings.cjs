// One-off: convert HTML headings (<h1>-<h6>) in markdown to real markdown
// headings, and ensure each page has an H1 (from frontmatter `title`).
// Required for VitePress local search to index page titles/sections.
// Run: node scripts/fix-headings.cjs
const fs = require('fs')
const path = require('path')

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (['.vitepress', 'node_modules', 'public'].includes(e.name)) continue
      walk(p, acc)
    } else if (e.name.endsWith('.md')) acc.push(p)
  }
  return acc
}

const FENCE = /(```|~~~)[\s\S]*?\n\1[ \t]*(?=\n|$)/g
const HEADING = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi

const docsDir = path.resolve(__dirname, '..', 'docs')
let changed = 0

for (const file of walk(docsDir)) {
  const orig = fs.readFileSync(file, 'utf8')
  let src = orig

  // 1) Protect fenced code blocks (so HTML examples inside them stay intact)
  const blocks = []
  src = src.replace(FENCE, (m) => {
    blocks.push(m)
    return `xCODEBLOCKx${blocks.length - 1}xENDx`
  })

  // 2) HTML headings -> markdown headings (strip inner tags like <b>)
  src = src.replace(HEADING, (_m, lvl, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    return text ? `\n\n${'#'.repeat(Number(lvl))} ${text}\n\n` : ''
  })

  // 3) Restore code blocks
  src = src.replace(/xCODEBLOCKx(\d+)xENDx/g, (_m, i) => blocks[Number(i)])

  // 4) Ensure an H1 (from frontmatter `title`) if the page has none
  const fm = src.match(/^---\n[\s\S]*?\n---\n?/)
  if (fm && !/^# .+/m.test(src)) {
    const t = fm[0].match(/\ntitle:\s*(.+)/)
    if (t) {
      const title = t[1].trim().replace(/^["']|["']$/g, '')
      src = fm[0] + `\n# ${title}\n\n` + src.slice(fm[0].length)
    }
  }

  // 5) Collapse 3+ blank lines
  src = src.replace(/\n{3,}/g, '\n\n')

  if (src !== orig) {
    fs.writeFileSync(file, src)
    changed++
    console.log('fixed:', path.relative(docsDir, file))
  }
}
console.log('--- Files changed:', changed)
