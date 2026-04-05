'use client'

import { useEffect, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { useBuilderStore } from '@/lib/stores/builderStore'
import BuilderHeader from '@/components/builder/BuilderHeader'
import FlowCanvas from '@/components/builder/FlowCanvas'
import StepConfigPanel from '@/components/builder/panels/StepConfigPanel'
import PieceSelector from '@/components/builder/panels/PieceSelector'
import BuilderSidebar from '@/components/builder/BuilderSidebar'
import RunResultModal from '@/components/builder/RunResultModal'
import { WorkflowRun } from '@/lib/providers/types'

export default function BuilderPage({ params }: { params: { id: string } }) {
  const { setWorkflow, setIsSaving, setIsRunning, workflow } = useBuilderStore()
  const [runResult, setRunResult] = useState<WorkflowRun | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/workflows/${params.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.workflow) setWorkflow(d.workflow)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id, setWorkflow])

  const handleSave = async () => {
    if (!workflow) return
    setIsSaving(true)
    try {
      await fetch(`/api/workflows/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow),
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRun = async () => {
    setIsRunning(true)
    try {
      const res = await fetch(`/api/workflows/${params.id}/trigger`, { method: 'POST' })
      const data = await res.json()
      setRunResult(data.run)
    } finally {
      setIsRunning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-zinc-400 text-sm flex items-center gap-2">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          読み込み中...
        </div>
      </div>
    )
  }

  return (
    <ReactFlowProvider>
      <div className="flex h-screen overflow-hidden bg-zinc-50">
        <BuilderSidebar workflowId={params.id} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <BuilderHeader workflowId={params.id} onSave={handleSave} onRun={handleRun} />
          <div className="flex-1 flex overflow-hidden">
            <FlowCanvas />
            <StepConfigPanel />
          </div>
          {/* Footer */}
          <footer className="bg-white border-t border-zinc-200 h-7 flex items-center justify-between px-4 flex-shrink-0">
            <span className="text-[11px] text-zinc-400">
              {workflow?.steps.length ?? 0} ステップ · Escで閉じる · Ctrl+Sで保存
            </span>
            <span className="text-[11px] text-zinc-400">
              {workflow?.runCount ?? 0} 実行 / 今月
            </span>
          </footer>
        </div>
      </div>
      <PieceSelector />
      <RunResultModal run={runResult} onClose={() => setRunResult(null)} />
    </ReactFlowProvider>
  )
}
