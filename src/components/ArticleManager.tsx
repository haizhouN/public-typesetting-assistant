'use client'

import { useState } from 'react'
import { useStore } from '@/store/useStore'

export default function ArticleManager() {
  const show = useStore((s) => s.showArticleManager)
  const setShow = useStore((s) => s.setShowArticleManager)
  const articles = useStore((s) => s.articles)
  const currentArticleId = useStore((s) => s.currentArticleId)
  const createArticle = useStore((s) => s.createArticle)
  const loadArticle = useStore((s) => s.loadArticle)
  const deleteArticle = useStore((s) => s.deleteArticle)
  const renameArticle = useStore((s) => s.renameArticle)
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  if (!show) return null

  const handleCreate = () => {
    const title = newTitle.trim() || `文章 ${articles.length + 1}`
    createArticle(title)
    setNewTitle('')
    setShow(false)
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShow(false)}>
      <div
        className="bg-white rounded-xl shadow-2xl w-[480px] max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">文章管理</h2>
          <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="p-5">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="输入文章标题..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-amber-400"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
            >
              新建
            </button>
          </div>

          <div className="space-y-1 max-h-[400px] overflow-auto">
            {articles.map((article) => (
              <div
                key={article.id}
                className={`flex items-center gap-3 p-3 rounded-lg group ${
                  article.id === currentArticleId
                    ? 'bg-amber-50 border border-amber-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  {editingId === article.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => {
                        if (editTitle.trim()) {
                          renameArticle(article.id, editTitle.trim())
                        }
                        setEditingId(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && editTitle.trim()) {
                          renameArticle(article.id, editTitle.trim())
                          setEditingId(null)
                        }
                      }}
                      className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:border-amber-400"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => loadArticle(article.id)}
                      className="text-sm font-medium text-gray-700 text-left w-full truncate"
                    >
                      {article.title}
                    </button>
                  )}
                  <p className="text-xs text-gray-400">
                    {article.content.length} 字 · {new Date(article.updatedAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => {
                      setEditingId(article.id)
                      setEditTitle(article.title)
                    }}
                    className="text-xs px-2 py-1 rounded hover:bg-gray-200 text-gray-500"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`确定删除「${article.title}」？`)) {
                        deleteArticle(article.id)
                      }
                    }}
                    className="text-xs px-2 py-1 rounded hover:bg-red-100 text-red-400"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
