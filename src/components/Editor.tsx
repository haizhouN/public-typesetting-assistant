'use client'

import { useEffect, useRef } from 'react'
import { EditorView, keymap, placeholder, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { oneDark } from '@codemirror/theme-one-dark'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { useStore } from '@/store/useStore'
import { htmlToMarkdown } from '@/lib/import'

interface EditorProps {
  isDark: boolean
}

export default function Editor({ isDark }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const content = useStore((s) => s.content)
  const setContent = useStore((s) => s.setContent)
  const contentRef = useRef(content)

  useEffect(() => {
    contentRef.current = content
  }, [content])

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newContent = update.state.doc.toString()
        if (newContent !== contentRef.current) {
          setContent(newContent)
        }
      }
    })

    const extensions = [
      markdown(),
      lineNumbers(),
      highlightActiveLine(),
      history(),
      syntaxHighlighting(defaultHighlightStyle),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      placeholder('输入 Markdown 或粘贴纯文本/Word内容...'),
      EditorView.lineWrapping,
      EditorView.domEventHandlers({
        paste: (event, view) => {
          const clipboardData = event.clipboardData
          if (!clipboardData) return false

          const html = clipboardData.getData('text/html')
          if (html) {
            event.preventDefault()
            const markdown = htmlToMarkdown(html)
            const { from, to } = view.state.selection.main
            view.dispatch({
              changes: { from, to, insert: markdown },
            })
            return true
          }
          return false
        },
      }),
      updateListener,
    ]

    if (isDark) {
      extensions.push(oneDark)
    }

    const state = EditorState.create({
      doc: contentRef.current,
      extensions,
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [isDark])

  useEffect(() => {
    if (!viewRef.current) return
    const view = viewRef.current
    const currentDoc = view.state.doc.toString()
    if (currentDoc !== content) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: content,
        },
      })
    }
  }, [content])

  return (
    <div className="h-full overflow-auto" ref={editorRef} />
  )
}
