'use client'

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { aiTypeset } from '@/lib/ai'

export default function AISettingsPanel() {
  const show = useStore((s) => s.showAISettings)
  const setShow = useStore((s) => s.setShowAISettings)
  const content = useStore((s) => s.content)
  const setContent = useStore((s) => s.setContent)
  const isPro = useStore((s) => s.isPro)
  const apiKey = useStore((s) => s.apiKey)
  const setApiKey = useStore((s) => s.setApiKey)
  const useOwnApi = useStore((s) => s.useOwnApi)
  const setUseOwnApi = useStore((s) => s.setUseOwnApi)
  const systemApiKey = useStore((s) => s.systemApiKey)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rawText, setRawText] = useState('')
  const [usageCount, setUsageCount] = useState(0)

  if (!show) return null

  const handleAITypeset = async () => {
    const text = rawText.trim() || content.trim()
    if (!text) {
      setError('请输入需要排版的文本')
      return
    }

    const key = useOwnApi ? apiKey.trim() : systemApiKey
    if (!key) {
      setError('请在下方 API 设置中填写 API Key')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await aiTypeset(text, key)
      setContent(result)
      setRawText('')
      setUsageCount((c) => c + 1)
      setShow(false)
    } catch (e: any) {
      setError(e.message || 'AI 排版失败，请检查 API Key 或网络')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShow(false)}>
      <div
        className="bg-white rounded-xl shadow-2xl w-[520px] max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">✨ AI 智能排版</h2>
          <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="p-5 space-y-4">
          {!isPro && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800 mb-2">
                AI 排版是 <strong>PRO 会员</strong> 功能。本地试用后请升级解锁。
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              粘贴需要排版的文本（留空则排版当前编辑器内容）
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="粘贴纯文本，AI 将自动识别结构并排版..."
              className="w-full h-32 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">API 设置</h3>

            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!useOwnApi}
                  onChange={() => setUseOwnApi(false)}
                  className="text-amber-500"
                />
                <span className="text-sm text-gray-600">使用系统 API</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={useOwnApi}
                  onChange={() => setUseOwnApi(true)}
                  className="text-amber-500"
                />
                <span className="text-sm text-gray-600">使用自己的 Key</span>
              </label>
            </div>

            {!useOwnApi && !systemApiKey && (
              <p className="text-xs text-gray-400 mb-2">
                系统 API 未配置。请使用自己的 API Key 或联系管理员。
              </p>
            )}

            {useOwnApi && (
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  DeepSeek API Key（<a href="https://platform.deepseek.com" target="_blank" className="text-amber-600 underline">获取 Key</a>，新用户赠送 500万 tokens）
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleAITypeset}
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium text-white transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> AI 排版中...
              </span>
            ) : (
              '开始 AI 排版'
            )}
          </button>

          {usageCount > 0 && (
            <p className="text-xs text-center text-gray-400">
              本次已使用 {usageCount} 次 AI 排版
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
