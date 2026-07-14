'use client'

import { useStore } from '@/store/useStore'
import { themes } from '@/lib/themes'

export default function ThemePanel() {
  const show = useStore((s) => s.showThemePanel)
  const setShow = useStore((s) => s.setShowThemePanel)
  const themeId = useStore((s) => s.themeId)
  const setTheme = useStore((s) => s.setTheme)
  const isPro = useStore((s) => s.isPro)

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShow(false)}>
      <div
        className="bg-white rounded-xl shadow-2xl w-[480px] max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">选择主题</h2>
          <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="p-5 grid grid-cols-2 gap-3">
          {themes.map((theme) => {
            const locked = !theme.free && !isPro
            return (
              <button
                key={theme.id}
                onClick={() => {
                  if (locked) return
                  setTheme(theme.id)
                  setShow(false)
                }}
                disabled={locked}
                className={`relative text-left p-4 rounded-lg border-2 transition ${
                  themeId === theme.id
                    ? 'border-amber-500 bg-amber-50'
                    : locked
                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 hover:border-amber-300 bg-white'
                }`}
              >
                {locked && (
                  <span className="absolute top-2 right-2 text-xs bg-gray-400 text-white px-1.5 py-0.5 rounded">
                    PRO
                  </span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full border"
                    style={{ background: theme.styles['--accent'] }}
                  />
                  <span className="font-bold text-sm">{theme.name}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {theme.description}
                </p>
                <div className="mt-2 flex gap-1">
                  <div className="w-4 h-3 rounded" style={{ background: theme.styles['--bg'] }} />
                  <div className="w-4 h-3 rounded" style={{ background: theme.styles['--title'] }} />
                  <div className="w-4 h-3 rounded" style={{ background: theme.styles['--accent'] }} />
                  <div className="w-4 h-3 rounded" style={{ background: theme.styles['--text'] }} />
                </div>
              </button>
            )
          })}
        </div>

        {!isPro && (
          <div className="px-5 pb-5">
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <p className="text-sm text-amber-800">
                解锁 <strong>浅草</strong>、<strong>暮色</strong> 主题 和更多功能
              </p>
              <button
                onClick={() => {
                  setShow(false)
                  useStore.getState().setShowPayWall(true)
                }}
                className="mt-2 text-xs bg-amber-500 text-white px-4 py-1.5 rounded-full hover:bg-amber-600"
              >
                升级 PRO ￥9.9
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
