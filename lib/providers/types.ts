export type FieldType = 'text' | 'textarea' | 'select' | 'number' | 'toggle' | 'service_connect'

export interface FieldSchema {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  options?: string[]
  required?: boolean
  description?: string
  service?: string // for service_connect
}

export interface ActionDefinition {
  key: string
  displayName: string
  description: string
  inputSchema: FieldSchema[]
}

export interface TriggerDefinition {
  key: string
  displayName: string
  description: string
  type: 'schedule' | 'webhook' | 'event' | 'manual'
  inputSchema: FieldSchema[]
}

export interface ProviderDefinition {
  key: string
  displayName: string
  description: string
  icon: string // emoji
  category: string
  triggers?: TriggerDefinition[]
  actions: ActionDefinition[]
}

export interface WorkflowStep {
  id: string
  name: string
  displayName: string
  provider: string | null
  actionKey: string | null
  type: 'trigger' | 'action' | 'ai' | 'condition'
  config: Record<string, unknown>
  position?: { x: number; y: number }
  valid: boolean
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  condition?: Record<string, unknown>
}

export interface WorkflowDefinition {
  id: string
  name: string
  description?: string
  isEnabled: boolean
  triggerType: string
  triggerConfig: Record<string, unknown>
  steps: WorkflowStep[]
  edges: WorkflowEdge[]
  createdAt: string
  updatedAt: string
  runCount?: number
}

export interface WorkflowRun {
  id: string
  workflowId: string
  workflowName?: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: string
  completedAt?: string
  durationMs?: number
  errorMessage?: string
  stepLogs?: StepLog[]
}

export interface StepLog {
  stepId: string
  stepName: string
  status: 'running' | 'completed' | 'failed' | 'skipped'
  startedAt: string
  completedAt?: string
  durationMs?: number
  inputData?: Record<string, unknown>
  outputData?: Record<string, unknown>
  errorMessage?: string
}
