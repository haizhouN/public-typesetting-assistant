'use client'

import { useState } from 'react'
import { useStore } from '@/store/useStore'

export default function CustomCSSPanel() {
  const show = useStore((s) => s.showCustomCSS)
  const setShow = useStore((s) => s.setShowCustomCSS)
  const customCSS = useStore((s) => s.customCSS)
  const setCustomCSS = useStore((s) => s.setCustomCSS)
  const [code, setCode] = useState(customCSS)

  const handleSave = () => {
    setCustomCSS(code)
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShow(false)}>
      <div
        className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">🎯 自定义 CSS</h2>
          <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-500">
            使用 CSS 变量自定义排版样式。仅 PRO 会员可用。
          </p>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-2 font-medium">可用 CSS 变量：</p>
            <code className="text-xs text-gray-600 block whitespace-pre-wrap">
{`--bg, --text, --text-secondary, --title
--accent, --accent-light, --border
--code-bg, --code-text
--blockquote-bg, --blockquote-border, --blockquote-text
--link, --font, --line-height, --text-size
--title-size, --padding, --radius`}
            </code>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`.preview-content p {\n  font-size: 16px;\n  letter-spacing: 2px;\n}\n\n.preview-content blockquote {\n  border-left-color: #ff6b6b;\n}`}
            className="w-full h-48 px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none focus:border-amber-400 resize-none"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600"
            >
              保存并应用
            </button>
            <button
              onClick={() => {
                setCode('')
                setCustomCSS('')
                setShow(false)
              }}
              className="px-4 py-2.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              重置
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
