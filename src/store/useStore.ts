'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, Article, HistoryEntry } from './types'
import { DEFAULT_CONTENT } from './types'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function createDefaultArticle(): Article {
  return {
    id: generateId(),
    title: '未命名文章',
    content: DEFAULT_CONTENT,
    themeId: 'mo-yun',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    history: [{
      content: DEFAULT_CONTENT,
      timestamp: Date.now(),
    }],
    historyIndex: 0,
  }
}

function countStats(content: string) {
  const text = content.replace(/[#*`~>\-\[\]()|!\\]/g, '')
  const chars = text.replace(/\s/g, '').length
  return { chars }
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => {
      const defaultArticle = createDefaultArticle()
      const defaultArticles = [defaultArticle]

      return {
        content: DEFAULT_CONTENT,
        themeId: 'mo-yun',
        isPro: false,
        activationCode: '',
        articles: defaultArticles,
        currentArticleId: defaultArticle.id,
        wordCount: 0,
        charCount: 0,

        showThemePanel: false,
        showArticleManager: false,
        showAISettings: false,
        showCustomCSS: false,
        showPayWall: false,

        customCSS: '',
        apiKey: '',
        useOwnApi: false,
        systemApiKey: '',

        setContent: (content) => {
          const state = get()
          set({ content })
          const stats = countStats(content)
          set({ wordCount: stats.chars, charCount: stats.chars })
          state.pushHistory(content)
          state.saveCurrentArticle()
        },

        setTheme: (themeId) => {
          set({ themeId })
          const state = get()
          state.saveCurrentArticle()
        },

        setPro: (isPro) => set({ isPro }),
        setActivationCode: (code) => set({ activationCode: code }),

        createArticle: (title) => {
          const article: Article = {
            id: generateId(),
            title,
            content: '',
            themeId: 'mo-yun',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            history: [{
              content: '',
              timestamp: Date.now(),
            }],
            historyIndex: 0,
          }
          const articles = [...get().articles, article]
          set({
            articles,
            currentArticleId: article.id,
            content: '',
            themeId: 'mo-yun',
            wordCount: 0,
            charCount: 0,
          })
        },

        loadArticle: (id) => {
          const article = get().articles.find((a) => a.id === id)
          if (!article) return
          set({
            currentArticleId: id,
            content: article.content,
            themeId: article.themeId,
          })
          const stats = countStats(article.content)
          set({ wordCount: stats.chars, charCount: stats.chars })
        },

        deleteArticle: (id) => {
          const state = get()
          const articles = state.articles.filter((a) => a.id !== id)
          if (articles.length === 0) {
            const newArticle = createDefaultArticle()
            articles.push(newArticle)
          }
          const newCurrentId = state.currentArticleId === id
            ? articles[0].id
            : state.currentArticleId
          set({ articles, currentArticleId: newCurrentId })

          if (state.currentArticleId === id) {
            const newArticle = articles[0]
            set({
              content: newArticle.content,
              themeId: newArticle.themeId,
              wordCount: countStats(newArticle.content).chars,
              charCount: countStats(newArticle.content).chars,
            })
          }
        },

        renameArticle: (id, title) => {
          const articles = get().articles.map((a) =>
            a.id === id ? { ...a, title } : a
          )
          set({ articles })
        },

        saveCurrentArticle: () => {
          const state = get()
          const articles = state.articles.map((a) =>
            a.id === state.currentArticleId
              ? {
                  ...a,
                  content: state.content,
                  themeId: state.themeId,
                  updatedAt: Date.now(),
                }
              : a
          )
          set({ articles })
        },

        undo: () => {
          const state = get()
          const article = state.articles.find((a) => a.id === state.currentArticleId)
          if (!article || article.historyIndex <= 0) return
          const newIndex = article.historyIndex - 1
          const newContent = article.history[newIndex].content
          updateArticleHistory(state, article, newIndex)
          set({ content: newContent })
          const stats = countStats(newContent)
          set({ wordCount: stats.chars, charCount: stats.chars })
        },

        redo: () => {
          const state = get()
          const article = state.articles.find((a) => a.id === state.currentArticleId)
          if (!article || article.historyIndex >= article.history.length - 1) return
          const newIndex = article.historyIndex + 1
          const newContent = article.history[newIndex].content
          updateArticleHistory(state, article, newIndex)
          set({ content: newContent })
          const stats = countStats(newContent)
          set({ wordCount: stats.chars, charCount: stats.chars })
        },

        pushHistory: (content) => {
          const state = get()
          const article = state.articles.find((a) => a.id === state.currentArticleId)
          if (!article) return
          const currentHistoryContent = article.history[article.historyIndex]?.content
          if (currentHistoryContent === content) return

          const newHistory: HistoryEntry[] = [
            ...article.history.slice(0, article.historyIndex + 1),
            { content, timestamp: Date.now() },
          ]
          if (newHistory.length > 50) {
            newHistory.shift()
          }
          const newIndex = newHistory.length - 1
          updateArticleHistory(state, article, newIndex, newHistory)
        },

        setShowThemePanel: (show) => set({ showThemePanel: show }),
        setShowArticleManager: (show) => set({ showArticleManager: show }),
        setShowAISettings: (show) => set({ showAISettings: show }),
        setShowCustomCSS: (show) => set({ showCustomCSS: show }),
        setShowPayWall: (show) => set({ showPayWall: show }),

        setCustomCSS: (css) => set({ customCSS: css }),
        setApiKey: (key) => set({ apiKey: key }),
        setUseOwnApi: (useOwn) => set({ useOwnApi: useOwn }),
        setSystemApiKey: (key) => set({ systemApiKey: key }),

        updateStats: () => {
          const stats = countStats(get().content)
          set({ wordCount: stats.chars, charCount: stats.chars })
        },
      }
    },
    {
      name: 'public-typesetting-storage',
      partialize: (state) => ({
        articles: state.articles,
        currentArticleId: state.currentArticleId,
        isPro: state.isPro,
        activationCode: state.activationCode,
        apiKey: state.apiKey,
        useOwnApi: state.useOwnApi,
        customCSS: state.customCSS,
      }),
    }
  )
)

function updateArticleHistory(
  state: AppState,
  article: Article,
  newIndex: number,
  newHistory?: HistoryEntry[]
) {
  const articles = state.articles.map((a) =>
    a.id === article.id
      ? {
          ...a,
          history: newHistory ?? a.history,
          historyIndex: newIndex,
          content: (newHistory ?? a.history)[newIndex].content,
          updatedAt: Date.now(),
        }
      : a
  )
  const store: { setState: (partial: Partial<AppState>) => void } = useStore as any
  store.setState({ articles })
}
