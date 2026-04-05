'use client'

import { WorkflowRun } from '@/lib/providers/types'

interface Props {
  run: WorkflowRun | null
  onClose: () => void
}

export default function RunResultModal({ run, onClose }: Props) {
  if (!run) return null

  const isSuccess = run.status === 'completed'
  const duration = run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}秒` : '—'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${isSuccess ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {isSuccess ? '✅' : '❌'}
          </div>
          <div className="flex-1">
            <div className="text-base font-bold text-zinc-900">
              {isSuccess ? 'テスト実行 — 成功' : 'テスト実行 — エラー'}
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">
              {isSuccess ? `すべてのステップが正常完了 · ${duration}` : run.errorMessage}
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Step logs */}
        <div className="overflow-y-auto p-5 space-y-2">
          {run.stepLogs?.map((log, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-zinc-50 border border-zinc-100 rounded-xl">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.status === 'completed' ? 'bg-emerald-400' : log.status === 'failed' ? 'bg-red-400' : 'bg-zinc-300'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-zinc-800">{log.stepName}</div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  {log.status === 'completed' ? `完了 · ${log.durationMs}ms` : log.errorMessage ?? log.status}
                </div>
                {log.outputData && (
                  <pre className="mt-2 text-[11px] bg-white border border-zinc-200 rounded-lg p-2 overflow-x-auto text-zinc-600 font-mono">
                    {JSON.stringify(log.outputData, null, 2)}
                  </pre>
                )}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${log.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {log.status === 'completed' ? '✓ 完了' : '✗ 失敗'}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-100">
          <button onClick={onClose} className="w-full py-2 bg-zinc-100 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-200 transition-colors">
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
