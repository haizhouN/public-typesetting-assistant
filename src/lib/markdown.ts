import { marked } from 'marked'
import hljs from 'highlight.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderer: any = {
  code({ text, lang }: { text: string; lang?: string }) {
    let highlighted = text
    if (lang && hljs.getLanguage(lang)) {
      try {
        highlighted = hljs.highlight(text, { language: lang }).value
      } catch {
        highlighted = hljs.highlightAuto(text).value
      }
    } else {
      highlighted = hljs.highlightAuto(text).value
    }
    return `<pre style="font-size:13px;line-height:1.6;overflow-x:auto;padding:14px 16px;border-radius:var(--radius);background:var(--code-bg);color:var(--code-text);margin:14px 0;white-space:pre-wrap;word-break:break-all;"><code>${highlighted}</code></pre>`
  },

  blockquote({ text }: { text: string }) {
    return `<blockquote style="margin:14px 0;padding:14px 18px;border-left:4px solid var(--blockquote-border);background:var(--blockquote-bg);color:var(--blockquote-text);border-radius:0 var(--radius) var(--radius) 0;font-size:14px;">${text}</blockquote>`
  },

  heading({ text, depth }: { text: string; depth: number }) {
    const sizes = ['26px', '22px', '18px', '16px', '15px', '14px']
    const margins = ['28px 0 14px', '24px 0 12px', '20px 0 10px', '18px 0 8px', '16px 0 6px', '14px 0 4px']
    const d = Math.min(depth, 6) - 1
    return `<h${depth} style="font-size:${sizes[d]};font-weight:700;color:var(--title);margin:${margins[d]};line-height:1.4;">${text}</h${depth}>`
  },

  image({ href, title, text }: { href: string; title?: string | null; text: string }) {
    const t = title || text
    return `<figure style="margin:16px 0;text-align:center;">
    <img src="${href}" alt="${text}" title="${t}" style="max-width:100%;border-radius:var(--radius);" />
    ${t ? `<figcaption style="font-size:13px;color:var(--text-secondary);margin-top:6px;">${t}</figcaption>` : ''}
  </figure>`
  },

  link({ href, title, text }: { href: string; title?: string | null; text: string }) {
    const t = title ? ` title="${title}"` : ''
    return `<a href="${href}"${t} style="color:var(--link);text-decoration:none;border-bottom:1px solid var(--link);padding-bottom:1px;" target="_blank" rel="noopener">${text}</a>`
  },

  table({ header, body }: { header: string; body: string }) {
    return `<div style="overflow-x:auto;margin:14px 0;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>${header}</thead>
      <tbody>${body}</tbody>
    </table>
  </div>`
  },

  tablerow({ text }: { text: string }) {
    return `<tr style="border-bottom:1px solid var(--border);">${text}</tr>`
  },

  tablecell({ text, align, header }: { text: string; align: string; header: boolean }) {
    const style = header
      ? `padding:10px 12px;background:var(--accent-light);font-weight:600;color:var(--title);text-align:${align || 'left'};`
      : `padding:8px 12px;text-align:${align || 'left'};`
    const tag = header ? 'th' : 'td'
    return `<${tag} style="${style}">${text}</${tag}>`
  },

  hr() {
    return `<hr style="border:none;border-top:1px solid var(--border);margin:24px 0;" />`
  },

  paragraph({ text }: { text: string }) {
    return `<p style="margin:10px 0;line-height:var(--line-height);font-size:var(--text-size);color:var(--text);">${text}</p>`
  },

  listitem({ text }: { text: string }) {
    return `<li style="margin:4px 0;line-height:var(--line-height);">${text}</li>`
  },

  list({ items, ordered }: { items: string; ordered: boolean }) {
    const tag = ordered ? 'ol' : 'ul'
    const style = ordered
      ? 'padding-left:24px;margin:8px 0;color:var(--text);'
      : 'padding-left:20px;margin:8px 0;color:var(--text);list-style-type:disc;'
    return `<${tag} style="${style}">${items}</${tag}>`
  },

  strong({ text }: { text: string }) {
    return `<strong style="color:var(--title);font-weight:700;">${text}</strong>`
  },

  em({ text }: { text: string }) {
    return `<em style="color:var(--accent);font-style:italic;font-weight:500;">${text}</em>`
  },
}

marked.use({ renderer })

export function renderMarkdown(content: string): string {
  if (!content || !content.trim()) {
    return '<p style="color:var(--text-secondary);text-align:center;padding:40px 0;">在左侧输入 Markdown 开始预览 ✨</p>'
  }
  try {
    return marked.parse(content, { breaks: true, gfm: true }) as string
  } catch {
    return '<p style="color:var(--text-secondary);">解析错误，请检查 Markdown 语法</p>'
  }
}
