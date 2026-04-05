'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { WorkflowRun } from '@/lib/providers/types'

export default function RunsPage() {
  const [runs, setRuns] = useState<WorkflowRun[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed'>('all')

  useEffect(() => {
    fetch('/api/runs')
      .then(r => r.json())
      .then(d => { setRuns(d.runs ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filteredRuns = runs.filter(run => {
    if (filter === 'completed') return run.status === 'completed'
    if (filter === 'failed') return run.status === 'failed'
    return true
  })

  const completedCount = runs.filter(r => r.status === 'completed').length
  const failedCount = runs.filter(r => r.status === 'failed').length
  const totalDuration = runs.reduce((sum, r) => sum + (r.durationMs ?? 0), 0)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">ROAR</Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">テンプレート</Link>
            <Link href="/workflows" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">ワークフロー</Link>
            <span className="text-sm font-bold text-white border-b-2 border-orange-500 pb-0.5">実行ログ</span>
            <Link href="/connections" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">コネクション</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Title row */}
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-1 tracking-tight">実行ログ</h1>
          <p className="text-zinc-500 text-sm">すべてのワークフロー実行の履歴を確認できます</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: '総実行回数', value: runs.length, color: '' },
            { label: '成功', value: completedCount, color: 'text-emerald-400' },
            { label: 'エラー', value: failedCount, color: 'text-red-400' },
            { label: '総実行時間', value: `${(totalDuration / 1000).toFixed(1)}秒`, color: 'text-orange-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className={`text-2xl font-black mb-1 ${stat.color}`}>{loading ? '—' : stat.value}</div>
              <div className="text-xs text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'completed', 'failed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === tab
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-300 border border-zinc-800'
              }`}
            >
              {tab === 'all' ? 'すべて' : tab === 'completed' ? '成功のみ' : 'エラーのみ'}
            </button>
          ))}
        </div>

        {/* Runs list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl h-20 animate-pulse" />)}
          </div>
        ) : filteredRuns.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl p-16 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-zinc-400 font-semibold">実行ログがありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRuns.map((run) => (
              <Link
                key={run.id}
                href={`/workflows/${run.workflowId}`}
                className="block bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 hover:shadow-[0_0_20px_rgba(249,115,22,0.08)] transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Status icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                    run.status === 'completed' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                  }`}>
                    {run.status === 'completed' ? '✅' : '❌'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-base font-bold text-white group-hover:text-orange-100 transition-colors">
                        {run.workflowName ?? 'Workflow'}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        run.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {run.status === 'completed' ? '成功' : 'エラー'}
                      </span>
                      <span className="text-[11px] text-zinc-600 ml-auto">
                        {new Date(run.startedAt).toLocaleString('ja-JP')}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500">
                      {run.errorMessage ? `エラー: ${run.errorMessage}` : `${run.stepLogs?.length ?? 0} ステップ実行`}
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-base font-black text-orange-400">
                        {run.durationMs ? `${(run.durationMs / 1000).toFixed(2)}s` : '—'}
                      </div>
                      <div className="text-[11px] text-zinc-600">実行時間</div>
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
