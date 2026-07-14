'use client'

import { useState, useRef, useCallback } from 'react'
import { importFile } from '@/lib/import'

interface FileUploaderProps {
  onFileLoaded: (content: string, fileName: string) => void
  children?: React.ReactNode
  className?: string
}

export default function FileUploader({ onFileLoaded, children, className }: FileUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    try {
      const content = await importFile(file)
      onFileLoaded(content, file.name)
    } catch {
      alert('文件读取失败，请重试')
    }
  }, [onFileLoaded])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleClick = () => {
    fileRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".md,.markdown,.txt,.docx,.doc"
        onChange={handleChange}
        className="hidden"
      />
      <div
        onClick={handleClick}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`cursor-pointer ${className || ''}`}
      >
        {children}
      </div>
    </>
  )
}
