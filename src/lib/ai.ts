const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

const SYSTEM_PROMPT = `你是一个公众号排版专家。将用户输入的文本转化为结构清晰、排版优美的 Markdown 格式。

要求：
1. 自动识别文章结构，为各部分添加合适的标题（使用 # ## ### ）
2. 为关键句子或金句添加 **加粗** 或 > 引用块
3. 自动将长段落拆分为短段落（手机端 2-3 行一段）
4. 如果有列表内容，使用 - 或 1. 格式
5. 保留原文的核心信息和情感色彩
6. 不要在开头添加"好的，已为您排版如下"之类的回复
7. 直接输出排版后的 Markdown，不要加任何说明
8. 适当使用 --- 分隔不同主题的内容块
9. 如果原文有对话，使用 > 引用格式
10. 段落之间保持适当间距

只输出排版后的 Markdown 内容。`

export async function aiTypeset(
  text: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `请为以下内容排版：\n\n${text}` },
      ],
      max_tokens: 4096,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `AI 请求失败: ${response.status}`)
  }

  const data = await response.json()
  const result = data.choices?.[0]?.message?.content || ''
  return result.trim()
}

export const DEFAULT_SYSTEM_API_KEY = ''
