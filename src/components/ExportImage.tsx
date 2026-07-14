'use client'

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { exportToImage, downloadImage } from '@/lib/utils'

export default function ExportImage() {
  const isPro = useStore((s) => s.isPro)
  const setShowPayWall = useStore((s) => s.setShowPayWall)
  const [showPanel, setShowPanel] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scale, setScale] = useState(2)

  if (!showPanel) {
    return (
      <button
        onClick={() => {
          if (!isPro) {
            setShowPayWall(true)
            return
          }
          setShowPanel(true)
        }}
        className={`text-sm px-3 py-1.5 rounded flex items-center gap-1 ${
          isPro
            ? 'hover:bg-gray-100 text-gray-700'
            : 'text-gray-400 cursor-not-allowed'
        }`}
        title={isPro ? '导出高清长图' : 'PRO 功能'}
      >
        <span>📸</span> 导出
        {!isPro && <span className="text-xs bg-gray-300 text-white px-1 rounded">PRO</span>}
      </button>
    )
  }

  const handleExport = async () => {
    const el = document.getElementById('preview-container')
    if (!el) return

    setLoading(true)
    try {
      const dataUrl = await exportToImage(el, scale)
      downloadImage(dataUrl, '文章排版.png')
    } catch (e) {
      alert('导出失败，请重试')
    } finally {
      setLoading(false)
      setShowPanel(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShowPanel(false)}>
      <div
        className="bg-white rounded-xl shadow-2xl w-[360px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">📸 导出高清长图</h2>
          <button onClick={() => setShowPanel(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              分辨率：{scale}x（{scale === 3 ? '超清' : scale === 2 ? '高清' : '标清'}）
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={1}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1x 标清</span>
              <span>2x 高清</span>
              <span>3x 超清</span>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={loading}
            className="w-full py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 disabled:bg-gray-400"
          >
            {loading ? '导出中...' : '导出 PNG 图片'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            将以当前主题样式导出为高清长图
          </p>
        </div>
      </div>
    </div>
  )
}
