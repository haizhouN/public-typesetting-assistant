export interface Theme {
  id: string
  name: string
  description: string
  free: boolean
  styles: Record<string, string>
}

export const themes: Theme[] = [
  {
    id: 'mo-yun',
    name: '墨韵',
    description: '黑白色调，传统书法意境，适合文学随笔',
    free: true,
    styles: {
      '--bg': '#fefefe',
      '--text': '#333333',
      '--text-secondary': '#666666',
      '--title': '#1a1a1a',
      '--accent': '#8b4513',
      '--accent-light': '#f5f0eb',
      '--border': '#e5e0db',
      '--code-bg': '#f8f5f2',
      '--code-text': '#5c4a3d',
      '--blockquote-bg': '#faf8f5',
      '--blockquote-border': '#c4a97d',
      '--blockquote-text': '#6b5e4f',
      '--link': '#8b4513',
      '--font': '"Songti SC", "宋体", "Noto Serif SC", "Source Han Serif SC", serif',
      '--line-height': '1.9',
      '--title-size': '22px',
      '--text-size': '15px',
      '--padding': '20px',
      '--radius': '4px',
    },
  },
  {
    id: 'nuan-yang',
    name: '暖阳',
    description: '温暖柔和色调，适合生活记录与情感文字',
    free: true,
    styles: {
      '--bg': '#fffcf5',
      '--text': '#4a3f35',
      '--text-secondary': '#8c7b6b',
      '--title': '#3d2e1c',
      '--accent': '#e8964b',
      '--accent-light': '#fff3e6',
      '--border': '#f0e6d8',
      '--code-bg': '#fef9f3',
      '--code-text': '#b0753d',
      '--blockquote-bg': '#fff9f3',
      '--blockquote-border': '#e8964b',
      '--blockquote-text': '#7a6954',
      '--link': '#e8964b',
      '--font': '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
      '--line-height': '1.85',
      '--title-size': '22px',
      '--text-size': '15px',
      '--padding': '20px',
      '--radius': '8px',
    },
  },
  {
    id: 'qing-feng',
    name: '清风',
    description: '清新淡雅，适合旅行游记与摄影笔记',
    free: true,
    styles: {
      '--bg': '#fbfdfc',
      '--text': '#3d5347',
      '--text-secondary': '#7d9387',
      '--title': '#2c4a3e',
      '--accent': '#4a9e7b',
      '--accent-light': '#edf7f1',
      '--border': '#dce8e1',
      '--code-bg': '#f4f9f6',
      '--code-text': '#3d6b53',
      '--blockquote-bg': '#f6faf7',
      '--blockquote-border': '#7cc4a0',
      '--blockquote-text': '#5c7d69',
      '--link': '#4a9e7b',
      '--font': '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
      '--line-height': '1.8',
      '--title-size': '22px',
      '--text-size': '15px',
      '--padding': '20px',
      '--radius': '6px',
    },
  },
  {
    id: 'qian-cao',
    name: '浅草',
    description: '自然绿意，适合健康养生与美食分享',
    free: false,
    styles: {
      '--bg': '#fbfdf8',
      '--text': '#3d4a36',
      '--text-secondary': '#7a8a6e',
      '--title': '#2d3b1e',
      '--accent': '#5b8c3e',
      '--accent-light': '#f2f8eb',
      '--border': '#dde8d2',
      '--code-bg': '#f6faf2',
      '--code-text': '#4a6b38',
      '--blockquote-bg': '#f8fbf3',
      '--blockquote-border': '#8db85f',
      '--blockquote-text': '#5a7348',
      '--link': '#5b8c3e',
      '--font': '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
      '--line-height': '1.85',
      '--title-size': '22px',
      '--text-size': '15px',
      '--padding': '20px',
      '--radius': '8px',
    },
  },
  {
    id: 'mu-se',
    name: '暮色',
    description: '暗黑深夜模式，适合睡前阅读与深度思考',
    free: false,
    styles: {
      '--bg': '#1e1e2e',
      '--text': '#cdd6f4',
      '--text-secondary': '#a6adc8',
      '--title': '#f5c2e7',
      '--accent': '#cba6f7',
      '--accent-light': '#313244',
      '--border': '#45475a',
      '--code-bg': '#313244',
      '--code-text': '#f9e2af',
      '--blockquote-bg': '#313244',
      '--blockquote-border': '#cba6f7',
      '--blockquote-text': '#bac2de',
      '--link': '#89b4fa',
      '--font': '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
      '--line-height': '1.85',
      '--title-size': '22px',
      '--text-size': '15px',
      '--padding': '20px',
      '--radius': '6px',
    },
  },
]

export function getThemeById(id: string): Theme | undefined {
  return themes.find((t) => t.id === id)
}

export function getActiveThemeStyles(themeId: string): string {
  const theme = getThemeById(themeId)
  if (!theme) return ''
  return Object.entries(theme.styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n')
}
