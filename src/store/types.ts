export interface Article {
  id: string
  title: string
  content: string
  themeId: string
  createdAt: number
  updatedAt: number
  history: HistoryEntry[]
  historyIndex: number
}

export interface HistoryEntry {
  content: string
  timestamp: number
}

export interface AppState {
  content: string
  themeId: string
  isPro: boolean
  activationCode: string
  articles: Article[]
  currentArticleId: string | null
  wordCount: number
  charCount: number

  showThemePanel: boolean
  showArticleManager: boolean
  showAISettings: boolean
  showCustomCSS: boolean
  showPayWall: boolean

  customCSS: string
  apiKey: string
  useOwnApi: boolean
  systemApiKey: string

  setContent: (content: string) => void
  setTheme: (themeId: string) => void
  setPro: (isPro: boolean) => void
  setActivationCode: (code: string) => void

  createArticle: (title: string) => void
  loadArticle: (id: string) => void
  deleteArticle: (id: string) => void
  renameArticle: (id: string, title: string) => void
  saveCurrentArticle: () => void

  undo: () => void
  redo: () => void
  pushHistory: (content: string) => void

  setShowThemePanel: (show: boolean) => void
  setShowArticleManager: (show: boolean) => void
  setShowAISettings: (show: boolean) => void
  setShowCustomCSS: (show: boolean) => void
  setShowPayWall: (show: boolean) => void

  setCustomCSS: (css: string) => void
  setApiKey: (key: string) => void
  setUseOwnApi: (useOwn: boolean) => void
  setSystemApiKey: (key: string) => void

  updateStats: () => void
}

export const DEFAULT_CONTENT = `# 欢迎使用公众排版助手

> 写文章，从此变得优雅而简单。

## 快速上手

1. **左侧编辑** Markdown 内容
2. **右侧实时预览** 公众号排版效果
3. 选择喜欢的 **主题风格**
4. 点击 **一键复制** 粘贴到公众号编辑器

## 功能亮点

- 🎨 多种文艺主题，一键切换
- 📝 AI 智能排版，瞬间美化
- 📸 导出高清长图，分享更方便
- 💾 本地存储，隐私安全

---

### 代码示例

\`\`\`javascript
function sayHello() {
  console.log("你好，世界！");
}
\`\`\`

### 主要特性

| 特性 | 说明 |
|------|------|
| Markdown | 支持全部基本语法 |
| 主题 | 5种精美主题 |
| 导出 | 一键复制 / 导出长图 |

> 开始写作吧，你的第一篇文章将在这里诞生。

---

*公众排版助手 — 让每一篇文章都值得被看见*
`
