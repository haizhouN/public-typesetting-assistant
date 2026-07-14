import html2canvas from 'html2canvas'

export async function exportToImage(element: HTMLElement, scale: number = 2): Promise<string> {
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  })
  return canvas.toDataURL('image/png')
}

export function downloadImage(dataUrl: string, filename: string = 'article.png') {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function copyRichText(html: string) {
  const blob = new Blob([html], { type: 'text/html' })
  const clipboardItem = new ClipboardItem({
    'text/html': blob,
    'text/plain': new Blob([html.replace(/<[^>]*>/g, '')], { type: 'text/plain' }),
  })
  await navigator.clipboard.write([clipboardItem])
}

export function getActivationCodes(): string[] {
  return [
    'TYPESET2024',
    'PAIBAN888',
    'PRO8888',
    'WRITER666',
    'CODE2024',
    'AI2024VIP',
    'PRO2024ZX',
    'VIP8888',
  ]
}

export function validateActivationCode(code: string): boolean {
  const codes = getActivationCodes()
  return codes.includes(code.toUpperCase().trim())
}
