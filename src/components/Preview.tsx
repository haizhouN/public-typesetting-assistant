'use client'

import { useMemo, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { renderMarkdown } from '@/lib/markdown'
import { getActiveThemeStyles } from '@/lib/themes'

export default function Preview() {
  const content = useStore((s) => s.content)
  const themeId = useStore((s) => s.themeId)
  const customCSS = useStore((s) => s.customCSS)
  const isPro = useStore((s) => s.isPro)
  const previewRef = useRef<HTMLDivElement>(null)

  const themeStyles = useMemo(() => getActiveThemeStyles(themeId), [themeId])
  const html = useMemo(() => renderMarkdown(content), [content])

  return (
    <div className="h-full overflow-auto bg-gray-100 p-6">
      <div
        id="preview-container"
        ref={previewRef}
        className="preview-content mx-auto max-w-[420px] min-h-full shadow-xl"
        style={{
          background: themeId === 'mu-se' ? '#1e1e2e' : '#ffffff',
          padding: '24px 28px',
          borderRadius: '0',
          fontFamily: "var(--font)",
          lineHeight: 'var(--line-height)',
          fontSize: 'var(--text-size)',
          color: 'var(--text)',
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            .preview-content { ${themeStyles} }
            .preview-content img { max-width: 100%; height: auto; border-radius: 4px; }
            .preview-content p { margin: 10px 0; line-height: var(--line-height); font-size: var(--text-size); color: var(--text); }
            .preview-content strong { color: var(--title); font-weight: 700; }
            .preview-content em { color: var(--accent); font-style: italic; }
            ${isPro ? customCSS : ''}
          `
        }} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}
