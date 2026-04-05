import { NextRequest, NextResponse } from 'next/server'
import { workflowsStore, runsStore } from '@/lib/workflows/store'
import { WorkflowRun, StepLog } from '@/lib/providers/types'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const workflow = workflowsStore.getById(params.id)
  if (!workflow) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const runId = `run-${Date.now()}`
  const startedAt = new Date().toISOString()

  const stepLogs: StepLog[] = workflow.steps.map((step, i) => ({
    stepId: step.id,
    stepName: step.displayName,
    status: 'completed' as const,
    startedAt: new Date(Date.now() + i * 400).toISOString(),
    completedAt: new Date(Date.now() + i * 400 + 350).toISOString(),
    durationMs: 350 + Math.floor(Math.random() * 500),
    outputData: { success: true, stepName: step.name },
  }))

  const run: WorkflowRun = {
    id: runId,
    workflowId: params.id,
    status: 'completed',
    startedAt,
    completedAt: new Date(Date.now() + workflow.steps.length * 400).toISOString(),
    durationMs: workflow.steps.length * 400,
    stepLogs,
  }

  runsStore.create(run)
  return NextResponse.json({ run }, { status: 201 })
}
