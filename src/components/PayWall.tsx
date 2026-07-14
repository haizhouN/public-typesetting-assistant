'use client'

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { validateActivationCode } from '@/lib/utils'

export default function PayWall() {
  const show = useStore((s) => s.showPayWall)
  const setShow = useStore((s) => s.setShowPayWall)
  const setPro = useStore((s) => s.setPro)
  const setActivationCode = useStore((s) => s.setActivationCode)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!show) return null

  const handleActivate = () => {
    if (validateActivationCode(code)) {
      setPro(true)
      setActivationCode(code)
      setSuccess(true)
      setError('')
      setTimeout(() => setShow(false), 1500)
    } else {
      setError('激活码无效，请检查后重试')
      setSuccess(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setShow(false)}>
      <div
        className="bg-white rounded-xl shadow-2xl w-[440px] max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold">升级 PRO</h2>
          <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
            <div className="text-center">
              <span className="text-3xl font-bold text-amber-700">￥9.9</span>
              <span className="text-sm text-gray-500 ml-1">/ 永久买断</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 全部 5 种精美主题
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> AI 智能排版（100次）
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 导出高清长图
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> CSS 自定义主题
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 历史版本管理
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 批量导入 .md 文件
              </li>
            </ul>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              方式一：扫码支付（微信/支付宝），付款后将自动获取激活码
            </p>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                收款码占位
              </div>
              <p className="text-xs text-gray-400 mt-2">付款后联系客服获取激活码</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              方式二：输入激活码
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError('')
                }}
                placeholder="输入激活码..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-amber-400"
                onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
              />
              <button
                onClick={handleActivate}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
              >
                激活
              </button>
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            {success && <p className="text-sm text-green-500 mt-2">激活成功！享受 PRO 功能</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
