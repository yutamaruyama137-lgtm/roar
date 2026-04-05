/**
 * Global in-memory store for workflows and runs.
 * Uses globalThis to persist across hot reloads in development.
 * In production, replace with Supabase queries.
 */
import { WorkflowDefinition, WorkflowRun, StepLog } from '@/lib/providers/types'

// Seed data
const seedWorkflows: WorkflowDefinition[] = [
  {
    id: 'wf-1',
    name: '問い合わせを即座に通知',
    description: 'Gmailに届いた問い合わせをSlackに通知し、担当者にメール転送',
    isEnabled: true,
    triggerType: 'event',
    triggerConfig: {},
    runCount: 47,
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-04T09:23:00Z',
    steps: [
      { id: 'step-1', name: 'trigger', displayName: 'Gmailに問い合わせメール着信', provider: 'gmail', actionKey: 'new_email', type: 'trigger', config: { label: 'INBOX', filter: 'お問い合わせ' }, valid: true },
      { id: 'step-2', name: 'ai_process', displayName: '内容を要約・分類', provider: 'ai', actionKey: 'summarize', type: 'ai', config: { text: '{{trigger.body}}', length: '中程度（300字以内）' }, valid: true },
      { id: 'step-3', name: 'slack_notify', displayName: 'Slackに通知', provider: 'slack', actionKey: 'send_message', type: 'action', config: { channel: '#cs-inquiries', message: '📩 新しい問い合わせ\n差出人: {{trigger.from}}\n\n{{ai_process.output}}' }, valid: true },
      { id: 'step-4', name: 'email_forward', displayName: '担当者に転送', provider: 'gmail', actionKey: 'send_email', type: 'action', config: { to: 'tanaka@reqs-lab.com', subject: '[要確認] {{trigger.subject}}', body: '{{trigger.body}}' }, valid: true },
    ],
    edges: [
      { id: 'step-1->step-2', source: 'step-1', target: 'step-2' },
      { id: 'step-2->step-3', source: 'step-2', target: 'step-3' },
      { id: 'step-3->step-4', source: 'step-3', target: 'step-4' },
    ],
  },
  {
    id: 'wf-2',
    name: '週次レポートを自動配信',
    description: '毎週月曜の朝にSlack/メールで自動配信',
    isEnabled: true,
    triggerType: 'schedule',
    triggerConfig: { day: '月曜', hour: '9', timezone: 'Asia/Tokyo' },
    runCount: 12,
    createdAt: '2026-03-15T00:00:00Z',
    updatedAt: '2026-04-01T08:00:00Z',
    steps: [
      { id: 'step-1', name: 'trigger', displayName: '毎週月曜 9:00 に起動', provider: 'schedule', actionKey: 'every_week', type: 'trigger', config: { day: '月曜', hour: '9', timezone: 'Asia/Tokyo' }, valid: true },
      { id: 'step-2', name: 'generate_report', displayName: 'レポートを生成', provider: 'ai', actionKey: 'generate_text', type: 'ai', config: { prompt: '先週の主なトピックと成果を400字でまとめてください。', model: 'claude-sonnet-4-6' }, valid: true },
      { id: 'step-3', name: 'send_slack', displayName: 'Slackで配信', provider: 'slack', actionKey: 'send_message', type: 'action', config: { channel: '#weekly-report', message: '📊 週次レポート\n\n{{generate_report.output}}' }, valid: true },
    ],
    edges: [
      { id: 'step-1->step-2', source: 'step-1', target: 'step-2' },
      { id: 'step-2->step-3', source: 'step-2', target: 'step-3' },
    ],
  },
  {
    id: 'wf-3',
    name: '受注→請求書を自動作成',
    description: '受注情報を入力するだけで請求書PDFを生成・顧客に送信',
    isEnabled: false,
    triggerType: 'manual',
    triggerConfig: {},
    runCount: 0,
    createdAt: '2026-03-20T00:00:00Z',
    updatedAt: '2026-03-20T14:00:00Z',
    steps: [
      { id: 'step-1', name: 'trigger', displayName: '手動トリガー', provider: 'manual', actionKey: 'manual', type: 'trigger', config: {}, valid: true },
      { id: 'step-2', name: 'generate_invoice', displayName: '請求書を生成', provider: 'ai', actionKey: 'generate_text', type: 'ai', config: { prompt: '受注情報から請求書を作成してください。', model: 'claude-sonnet-4-6' }, valid: false },
      { id: 'step-3', name: 'send_email', displayName: '顧客にメール送信', provider: 'gmail', actionKey: 'send_email', type: 'action', config: { to: '', subject: '【請求書】', body: '' }, valid: false },
    ],
    edges: [
      { id: 'step-1->step-2', source: 'step-1', target: 'step-2' },
      { id: 'step-2->step-3', source: 'step-2', target: 'step-3' },
    ],
  },
]

const seedRuns: WorkflowRun[] = [
  {
    id: 'run-1',
    workflowId: 'wf-1',
    status: 'completed',
    startedAt: '2026-04-04T09:23:00Z',
    completedAt: '2026-04-04T09:23:02Z',
    durationMs: 2100,
    stepLogs: [
      { stepId: 'step-1', stepName: 'Gmailに問い合わせメール着信', status: 'completed', startedAt: '2026-04-04T09:23:00Z', completedAt: '2026-04-04T09:23:00Z', durationMs: 100, outputData: { subject: 'お問い合わせ', from: 'customer@example.com', body: 'サービスについて質問があります。' } },
      { stepId: 'step-2', stepName: '内容を要約・分類', status: 'completed', startedAt: '2026-04-04T09:23:00Z', completedAt: '2026-04-04T09:23:01Z', durationMs: 800, outputData: { output: 'サービスに関する一般的なお問い合わせ。カテゴリ: 情報提供依頼' } },
      { stepId: 'step-3', stepName: 'Slackに通知', status: 'completed', startedAt: '2026-04-04T09:23:01Z', completedAt: '2026-04-04T09:23:01Z', durationMs: 600, outputData: { messageId: 'C1234567890.123456' } },
      { stepId: 'step-4', stepName: '担当者に転送', status: 'completed', startedAt: '2026-04-04T09:23:01Z', completedAt: '2026-04-04T09:23:02Z', durationMs: 600, outputData: { messageId: 'msg-123' } },
    ],
  },
  {
    id: 'run-2',
    workflowId: 'wf-1',
    status: 'failed',
    startedAt: '2026-04-03T14:15:00Z',
    completedAt: '2026-04-03T14:15:01Z',
    durationMs: 1200,
    errorMessage: 'Slack API Error: channel_not_found',
    stepLogs: [
      { stepId: 'step-1', stepName: 'Gmailに問い合わせメール着信', status: 'completed', startedAt: '2026-04-03T14:15:00Z', durationMs: 100 },
      { stepId: 'step-2', stepName: '内容を要約・分類', status: 'completed', startedAt: '2026-04-03T14:15:00Z', durationMs: 900 },
      { stepId: 'step-3', stepName: 'Slackに通知', status: 'failed', startedAt: '2026-04-03T14:15:01Z', durationMs: 200, errorMessage: 'channel_not_found' },
    ],
  },
  {
    id: 'run-3',
    workflowId: 'wf-2',
    status: 'completed',
    startedAt: '2026-04-01T08:00:00Z',
    completedAt: '2026-04-01T08:00:03Z',
    durationMs: 3200,
    stepLogs: [
      { stepId: 'step-1', stepName: '毎週月曜 9:00 に起動', status: 'completed', startedAt: '2026-04-01T08:00:00Z', durationMs: 50 },
      { stepId: 'step-2', stepName: 'レポートを生成', status: 'completed', startedAt: '2026-04-01T08:00:00Z', durationMs: 2400, outputData: { output: '先週の主なトピック：新規顧客3社の獲得、ROARのPhase1完了、チームミーティング5件' } },
      { stepId: 'step-3', stepName: 'Slackで配信', status: 'completed', startedAt: '2026-04-01T08:00:02Z', durationMs: 750 },
    ],
  },
]

// Global singleton using globalThis to survive hot reload
declare global {
  // eslint-disable-next-line no-var
  var __roarWorkflows: WorkflowDefinition[] | undefined
  // eslint-disable-next-line no-var
  var __roarRuns: WorkflowRun[] | undefined
}

if (!globalThis.__roarWorkflows) {
  globalThis.__roarWorkflows = [...seedWorkflows]
}
if (!globalThis.__roarRuns) {
  globalThis.__roarRuns = [...seedRuns]
}

export const workflowsStore = {
  getAll(): WorkflowDefinition[] {
    return globalThis.__roarWorkflows!
  },
  getById(id: string): WorkflowDefinition | undefined {
    return globalThis.__roarWorkflows!.find(w => w.id === id)
  },
  create(data: Partial<WorkflowDefinition>): WorkflowDefinition {
    const wf: WorkflowDefinition = {
      id: `wf-${Date.now()}`,
      name: data.name || '新しいワークフロー',
      description: data.description || '',
      isEnabled: false,
      triggerType: 'manual',
      triggerConfig: {},
      steps: [],
      edges: [],
      runCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    }
    globalThis.__roarWorkflows!.push(wf)
    return wf
  },
  update(id: string, data: Partial<WorkflowDefinition>): WorkflowDefinition | null {
    const idx = globalThis.__roarWorkflows!.findIndex(w => w.id === id)
    if (idx === -1) return null
    globalThis.__roarWorkflows![idx] = {
      ...globalThis.__roarWorkflows![idx],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return globalThis.__roarWorkflows![idx]
  },
  delete(id: string): boolean {
    const idx = globalThis.__roarWorkflows!.findIndex(w => w.id === id)
    if (idx === -1) return false
    globalThis.__roarWorkflows!.splice(idx, 1)
    return true
  },
}

export const runsStore = {
  getAll(): WorkflowRun[] {
    return globalThis.__roarRuns!
  },
  getByWorkflowId(workflowId: string): WorkflowRun[] {
    return globalThis.__roarRuns!.filter(r => r.workflowId === workflowId)
  },
  create(run: WorkflowRun): WorkflowRun {
    globalThis.__roarRuns!.unshift(run)
    // Increment run count on workflow
    const wf = workflowsStore.getById(run.workflowId)
    if (wf) workflowsStore.update(run.workflowId, { runCount: (wf.runCount ?? 0) + 1 })
    return run
  },
}
