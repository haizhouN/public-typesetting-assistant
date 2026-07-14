'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { verifyToken } from '@/lib/activation'
import Toolbar from '@/components/Toolbar'
import Editor from '@/components/Editor'
import Preview from '@/components/Preview'
import ThemePanel from '@/components/ThemePanel'
import ArticleManager from '@/components/ArticleManager'
import AISettingsPanel from '@/components/AISettingsPanel'
import CustomCSSPanel from '@/components/CustomCSSPanel'
import PayWall from '@/components/PayWall'
import ExportImage from '@/components/ExportImage'
import Footer from '@/components/Footer'

export default function Home() {
  const themeId = useStore((s) => s.themeId)
  const isDark = themeId === 'mu-se'
  const isPro = useStore((s) => s.isPro)
  const proToken = useStore((s) => s.proToken)
  const setPro = useStore((s) => s.setPro)

  useEffect(() => {
    if (isPro && proToken) {
      verifyToken(proToken).then((valid) => {
        if (!valid) {
          setPro(false)
        }
      })
    }
  }, [])

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-100 flex items-center">
            <span className="text-xs text-gray-500 font-medium">编辑器</span>
            <span className="text-xs text-gray-300 ml-2">支持 Markdown / Word / 纯文本</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor isDark={isDark} />
          </div>
        </div>

        <div className="hidden md:block w-px bg-gray-200 self-stretch mx-0" />

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">公众号预览</span>
            <div className="flex items-center gap-2">
              <ExportImage />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Preview />
          </div>
        </div>
      </div>
      <Footer />

      <ThemePanel />
      <ArticleManager />
      <AISettingsPanel />
      <CustomCSSPanel />
      <PayWall />
    </div>
  )
}
