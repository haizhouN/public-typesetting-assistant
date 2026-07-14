'use client'

import { useState, useCallback } from 'react'
import { useStore } from '@/store/useStore'
import { copyRichText } from '@/lib/utils'
import { renderMarkdown } from '@/lib/markdown'

export default function Toolbar() {
  const setShowThemePanel = useStore((s) => s.setShowThemePanel)
  const setShowArticleManager = useStore((s) => s.setShowArticleManager)
  const setShowAISettings = useStore((s) => s.setShowAISettings)
  const setShowCustomCSS = useStore((s) => s.setShowCustomCSS)
  const setShowPayWall = useStore((s) => s.setShowPayWall)
  const undo = useStore((s) => s.undo)
  const redo = useStore((s) => s.redo)
  const content = useStore((s) => s.content)
  const charCount = useStore((s) => s.charCount)
  const isPro = useStore((s) => s.isPro)
  const currentArticleId = useStore((s) => s.currentArticleId)
  const articles = useStore((s) => s.articles)
  const [copied, setCopied] = useState(false)

  const currentArticle = articles.find((a) => a.id === currentArticleId)

  const handleCopy = useCallback(async () => {
    const html = renderMarkdown(content)
    try {
      await copyRichText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = content
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [content])

  return (
    <header className="border-b bg-white px-4 py-2 flex items-center gap-2 flex-wrap shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 mr-4">
        <span className="text-lg font-bold text-amber-700">公众排版助手</span>
        {!isPro && (
          <button
            onClick={() => setShowPayWall(true)}
            className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full hover:bg-amber-600 transition"
          >
            PRO
          </button>
        )}
        {isPro && (
          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
            PRO
          </span>
        )}
      </div>

      <div className="h-6 w-px bg-gray-200" />

      <button
        onClick={undo}
        className="text-sm px-2 py-1 rounded hover:bg-gray-100 text-gray-600"
        title="撤销 (Ctrl+Z)"
      >
        ↩
      </button>
      <button
        onClick={redo}
        className="text-sm px-2 py-1 rounded hover:bg-gray-100 text-gray-600"
        title="重做 (Ctrl+Y)"
      >
        ↪
      </button>

      <div className="h-6 w-px bg-gray-200" />

      <button
        onClick={() => setShowThemePanel(true)}
        className="text-sm px-3 py-1.5 rounded hover:bg-gray-100 text-gray-700 flex items-center gap-1"
      >
        <span>🎨</span> 主题
      </button>

      <button
        onClick={() => setShowArticleManager(true)}
        className="text-sm px-3 py-1.5 rounded hover:bg-gray-100 text-gray-700 flex items-center gap-1"
      >
        <span>📂</span> 文章
      </button>

      <button
        onClick={() => setShowAISettings(true)}
        className="text-sm px-3 py-1.5 rounded hover:bg-amber-50 text-amber-700 flex items-center gap-1"
      >
        <span>✨</span> AI 排版
      </button>

      {isPro && (
        <button
          onClick={() => setShowCustomCSS(true)}
          className="text-sm px-3 py-1.5 rounded hover:bg-gray-100 text-gray-700 flex items-center gap-1"
        >
          <span>🎯</span> 自定义
        </button>
      )}

      <div className="flex-1" />

      <span className="text-xs text-gray-400">
        {charCount.toLocaleString()} 字
      </span>

      <span className="text-xs text-gray-300">
        {currentArticle?.title || '未命名'}
      </span>

      <button
        onClick={handleCopy}
        className={`text-sm px-4 py-1.5 rounded font-medium transition ${
          copied
            ? 'bg-green-500 text-white'
            : 'bg-amber-500 text-white hover:bg-amber-600'
        }`}
      >
        {copied ? '✓ 已复制' : '一键复制'}
      </button>
    </header>
  )
}
