'use client'

import { useStore } from '@/store/useStore'
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

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r bg-white">
          <Editor isDark={isDark} />
        </div>
        <div className="w-1/2">
          <Preview />
        </div>
      </div>
      <Footer />

      <ThemePanel />
      <ArticleManager />
      <AISettingsPanel />
      <CustomCSSPanel />
      <PayWall />

      <div className="fixed bottom-6 right-6 z-40">
        <ExportImage />
      </div>
    </div>
  )
}
