'use client'

import Link from 'next/link'
import { useBuilderStore } from '@/lib/stores/builderStore'

const icons: Record<string, string> = {
  'wf-1': '📨', 'wf-2': '📊', default: '⚡',
}

export default function BuilderHeader({ workflowId, onSave, onRun }: {
  workflowId: string
  onSave: () => void
  onRun: () => void
}) {
  const { workflow, toggleEnabled, isDirty, isSaving, isRunning } = useBuilderStore()

  if (!workflow) return null

  return (
    <header className="bg-white border-b border-zinc-200 h-14 flex items-center gap-3 px-4 flex-shrink-0 z-10">
      {/* Back */}
      <Link href="/workflows" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
      </Link>

      {/* Icon + title */}
      <span className="text-xl flex-shrink-0">{icons[workflowId] ?? '⚡'}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-zinc-400 flex items-center gap-1">
          <Link href="/workflows" className="hover:text-zinc-600">ワークフロー</Link>
          <span>›</span>
          <span className="font-semibold text-zinc-800 truncate">{workflow.name}</span>
        </div>
        <div className="text-[10px] text-zinc-400">ステップをクリックして設定を開く · Escで閉じる</div>
      </div>

      {/* Toggle */}
      <button
        onClick={toggleEnabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
          workflow.isEnabled
            ? 'border-orange-300 bg-orange-50 text-orange-600'
            : 'border-zinc-300 bg-white text-zinc-500'
        }`}
      >
        <span>{workflow.isEnabled ? 'ON' : 'OFF'}</span>
        <div className={`w-8 h-4 rounded-full relative transition-colors ${workflow.isEnabled ? 'bg-orange-500' : 'bg-zinc-300'}`}>
          <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${workflow.isEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </div>
      </button>

      {/* Test Run */}
      <button
        onClick={onRun}
        disabled={isRunning}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-lg text-xs font-semibold hover:bg-orange-100 transition-colors disabled:opacity-50"
      >
        {isRunning ? (
          <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        )}
        テスト実行
      </button>

      {/* Save */}
      <button
        onClick={onSave}
        disabled={!isDirty || isSaving}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
          isDirty && !isSaving
            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'
            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
        }`}
      >
        {isSaving ? '保存中...' : isDirty ? '保存' : '保存済み'}
      </button>

      {/* Menu */}
      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
      </button>
    </header>
  )
}
