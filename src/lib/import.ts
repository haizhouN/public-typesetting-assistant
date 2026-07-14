'use client'

import mammoth from 'mammoth'

export async function importFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'md':
    case 'markdown':
    case 'txt':
      return await readAsText(file)
    case 'docx':
      return await parseDocx(file)
    default:
      return await readAsText(file)
  }
}

async function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file, 'UTF-8')
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mammothApi = mammoth as any

async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammothApi.convertToMarkdown(
    { arrayBuffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => # ${p}",
        "p[style-name='Heading 2'] => ## ${p}",
        "p[style-name='Heading 3'] => ### ${p}",
        "p[style-name='Heading 4'] => #### ${p}",
        "r[style-name='Strong'] => **${p}**",
        "r[style-name='Emphasis'] => *${p}*",
      ],
    }
  )
  return result.value || '无法解析文档内容'
}

export function htmlToMarkdown(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html

  function processNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || ''
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return ''

    const el = node as HTMLElement
    const children = Array.from(el.childNodes).map(processNode).join('')

    switch (el.tagName.toLowerCase()) {
      case 'h1': return `\n# ${children}\n`
      case 'h2': return `\n## ${children}\n`
      case 'h3': return `\n### ${children}\n`
      case 'h4': return `\n#### ${children}\n`
      case 'h5': return `\n##### ${children}\n`
      case 'h6': return `\n###### ${children}\n`
      case 'p': return `\n${children}\n`
      case 'br': return '\n'
      case 'strong':
      case 'b': return `**${children}**`
      case 'em':
      case 'i': return `*${children}*`
      case 'u': return `__${children}__`
      case 'a': return `[${children}](${el.getAttribute('href') || ''})`
      case 'img': return `![${el.getAttribute('alt') || ''}](${el.getAttribute('src') || ''})`
      case 'blockquote': return `\n> ${children.replace(/\n/g, '\n> ')}\n`
      case 'ul': return `\n${children}\n`
      case 'ol': return `\n${children}\n`
      case 'li': return `- ${children}\n`
      case 'hr': return '\n---\n'
      case 'pre':
      case 'code': return `\`\`\`\n${children}\n\`\`\``
      default: return children
    }
  }

  const result = processNode(div)
  return result.replace(/\n{3,}/g, '\n\n').trim()
}

export const ACCEPTED_TYPES = '.md,.markdown,.txt,.docx,.doc'
