'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { WorkflowDefinition } from '@/lib/providers/types'

const WORKFLOW_ICONS = ['📨', '📊', '🧾', '⚡', '🔔', '📋', '🚀', '💼']

export default function WorkflowsPage() {
  const router = useRouter()
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetch('/api/workflows')
      .then(r => r.json())
      .then(d => { setWorkflows(d.workflows ?? []); setLoading(false) })
  }, [])

  const createNew = async () => {
    setCreating(true)
    const res = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '新しいワークフロー' }),
    })
    const data = await res.json()
    router.push(`/builder/${data.workflow.id}`)
  }

  const activeCount = workflows.filter(w => w.isEnabled).length
  const totalRuns = workflows.reduce((s, w) => s + (w.runCount ?? 0), 0)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">ROAR</Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">テンプレート</Link>
            <span className="text-sm font-bold text-white border-b-2 border-orange-500 pb-0.5">ワークフロー</span>
            <Link href="/connections" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">コネクション</Link>
            <Link href="/runs" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">実行ログ</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Title row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black mb-1 tracking-tight">ワークフロー</h1>
            <p className="text-zinc-500 text-sm">自動化フローを管理・編集できます</p>
          </div>
          <button
            onClick={createNew}
            disabled={creating}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-60"
          >
            {creating ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            )}
            新規作成
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: '稼働中フロー', value: activeCount, color: '' },
            { label: '今月の実行回数', value: `${totalRuns}回`, color: 'text-orange-400' },
            { label: '今月のコスト', value: `¥${(totalRuns * 18).toLocaleString()}`, color: '' },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className={`text-3xl font-black mb-1 ${stat.color}`}>{loading ? '—' : stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Workflow list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl h-24 animate-pulse" />)}
          </div>
        ) : workflows.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl p-16 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <p className="text-zinc-400 font-semibold mb-6">ワークフローがありません</p>
            <button onClick={createNew} className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-6 py-3 rounded-xl text-sm">
              最初のフローを作る →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {workflows.map((wf, i) => (
              <Link key={wf.id} href={`/builder/${wf.id}`} className="block bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 hover:shadow-[0_0_20px_rgba(249,115,22,0.08)] transition-all group">
                <div className="flex items-center gap-5">
                  <div className="text-3xl flex-shrink-0">{WORKFLOW_ICONS[i % WORKFLOW_ICONS.length]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-base font-bold text-white group-hover:text-orange-100 transition-colors">{wf.name}</span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${wf.isEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-700/50 text-zinc-400 border border-zinc-600/50'}`}>
                        {wf.isEnabled ? '稼働中' : '停止中'}
                      </span>
                      <span className="text-[11px] text-zinc-600 ml-auto">
                        最終更新: {new Date(wf.updatedAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 truncate">{wf.description || `${wf.steps.length} ステップ · ${wf.triggerType} トリガー`}</p>
                  </div>
                  <div className="flex items-center gap-5 flex-shrink-0">
                    <div className="text-center">
                      <div className="text-base font-black text-orange-400">{wf.runCount ?? 0}回</div>
                      <div className="text-[11px] text-zinc-600">今月の実行</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-black text-white">{wf.steps.length}</div>
                      <div className="text-[11px] text-zinc-600">ステップ数</div>
                    </div>
                    <svg className="text-zinc-600 group-hover:text-zinc-400 transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
