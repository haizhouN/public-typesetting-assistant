'use client'

import { useState, useCallback, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { copyRichText } from '@/lib/utils'
import { renderMarkdown } from '@/lib/markdown'
import { htmlToMarkdown, importFile } from '@/lib/import'

export default function Toolbar() {
  const setShowThemePanel = useStore((s) => s.setShowThemePanel)
  const setShowArticleManager = useStore((s) => s.setShowArticleManager)
  const setShowAISettings = useStore((s) => s.setShowAISettings)
  const setShowCustomCSS = useStore((s) => s.setShowCustomCSS)
  const setShowPayWall = useStore((s) => s.setShowPayWall)
  const undo = useStore((s) => s.undo)
  const redo = useStore((s) => s.redo)
  const content = useStore((s) => s.content)
  const setContent = useStore((s) => s.setContent)
  const charCount = useStore((s) => s.charCount)
  const isPro = useStore((s) => s.isPro)
  const currentArticleId = useStore((s) => s.currentArticleId)
  const articles = useStore((s) => s.articles)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

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

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await importFile(file)
      setContent(content ? content + '\n\n' + text : text)
    } catch {
      alert('文件读取失败')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const handlePasteFromWord = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (!text) {
        alert('剪贴板中没有内容，请先复制 Word 文档中的内容')
        return
      }
      setContent(content ? content + '\n\n' + text : text)
    } catch {
      const text = prompt('请粘贴 Word 或其他文本内容：')
      if (text) setContent(content ? content + '\n\n' + text : text)
    }
  }

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('.cm-content') as HTMLElement
    if (textarea) {
      const selection = window.getSelection()
      const selectedText = selection?.toString() || ''
      const newText = prefix + selectedText + suffix
      document.execCommand('insertText', false, newText)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">排</span>
            </div>
            <span className="font-bold text-gray-800 text-sm">公众排版助手</span>
          </div>

          <div className="h-5 w-px bg-gray-200" />

          <div className="flex items-center gap-1">
            <button onClick={undo} className="toolbar-btn" title="撤销 Ctrl+Z">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </button>
            <button onClick={redo} className="toolbar-btn" title="重做 Ctrl+Y">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
            </button>
          </div>

          <div className="h-5 w-px bg-gray-200" />

          <div className="flex items-center gap-1">
            <button onClick={() => insertMarkdown('**', '**')} className="toolbar-btn" title="加粗"><b>B</b></button>
            <button onClick={() => insertMarkdown('*', '*')} className="toolbar-btn" title="斜体"><i>I</i></button>
            <button onClick={() => insertMarkdown('\n## ', '')} className="toolbar-btn text-xs" title="标题">H</button>
            <button onClick={() => insertMarkdown('\n> ', '')} className="toolbar-btn text-xs" title="引用">❝</button>
            <button onClick={() => insertMarkdown('\n- ', '')} className="toolbar-btn text-xs" title="列表">≡</button>
            <button onClick={() => insertMarkdown('`', '`')} className="toolbar-btn text-xs font-mono" title="代码">&lt;/&gt;</button>
            <button onClick={() => insertMarkdown('\n---\n')} className="toolbar-btn text-xs" title="分隔线">─</button>
          </div>

          <div className="h-5 w-px bg-gray-200" />

          <input
            ref={fileRef}
            type="file"
            accept=".md,.markdown,.txt,.docx,.doc"
            onChange={handleFileImport}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="toolbar-btn text-xs flex items-center gap-1"
            title="导入文件（Markdown/Word/文本）"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            导入
          </button>
          <button
            onClick={handlePasteFromWord}
            className="toolbar-btn text-xs flex items-center gap-1"
            title="粘贴 Word/文本内容"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/></svg>
            粘贴
          </button>

          <button
            onClick={() => setShowAISettings(true)}
            className="toolbar-btn text-xs flex items-center gap-1 text-purple-600 hover:bg-purple-50"
            title="AI 智能排版"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            AI排版
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowThemePanel(true)}
            className="toolbar-btn text-xs flex items-center gap-1"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            主题
          </button>

          <button
            onClick={() => setShowArticleManager(true)}
            className="toolbar-btn text-xs flex items-center gap-1"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            文章
          </button>

          {isPro && (
            <button
              onClick={() => setShowCustomCSS(true)}
              className="toolbar-btn text-xs flex items-center gap-1"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              CSS
            </button>
          )}

          <div className="h-5 w-px bg-gray-200" />

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span className="tabular-nums">{charCount.toLocaleString()} 字</span>
            <span className="text-gray-300">·</span>
            <span className="truncate max-w-[80px]">{currentArticle?.title || '未命名'}</span>
          </div>

          {!isPro && (
            <button
              onClick={() => setShowPayWall(true)}
              className="text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2.5 py-1 rounded-full font-medium hover:from-amber-500 hover:to-orange-600 shadow-sm transition"
            >
              PRO
            </button>
          )}
          {isPro && (
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
              PRO
            </span>
          )}

          <button
            onClick={handleCopy}
            className={`text-xs px-4 py-1.5 rounded-lg font-medium transition shadow-sm ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {copied ? '✓ 已复制' : '一键复制'}
          </button>
        </div>
      </div>
    </header>
  )
}
