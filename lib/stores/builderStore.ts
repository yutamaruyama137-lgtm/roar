import { create } from 'zustand'
import { WorkflowStep, WorkflowEdge, WorkflowDefinition } from '@/lib/providers/types'

interface BuilderState {
  workflow: WorkflowDefinition | null
  selectedStepId: string | null
  isPanelOpen: boolean
  isPieceSelectorOpen: boolean
  pieceSelectorMode: 'trigger' | 'action'
  insertAfterStepId: string | null
  isDirty: boolean
  isSaving: boolean
  isRunning: boolean

  // Actions
  setWorkflow: (wf: WorkflowDefinition) => void
  selectStep: (id: string | null) => void
  closePanel: () => void
  openPieceSelector: (mode: 'trigger' | 'action', afterStepId?: string) => void
  closePieceSelector: () => void
  updateStepConfig: (stepId: string, config: Record<string, unknown>) => void
  updateStepDisplayName: (stepId: string, name: string) => void
  addStep: (step: WorkflowStep) => void
  removeStep: (stepId: string) => void
  toggleEnabled: () => void
  setIsSaving: (v: boolean) => void
  setIsRunning: (v: boolean) => void
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  workflow: null,
  selectedStepId: null,
  isPanelOpen: false,
  isPieceSelectorOpen: false,
  pieceSelectorMode: 'action',
  insertAfterStepId: null,
  isDirty: false,
  isSaving: false,
  isRunning: false,

  setWorkflow: (wf) => set({ workflow: wf, isDirty: false }),

  selectStep: (id) => set({
    selectedStepId: id,
    isPanelOpen: !!id,
    isPieceSelectorOpen: false,
  }),

  closePanel: () => set({ selectedStepId: null, isPanelOpen: false }),

  openPieceSelector: (mode, afterStepId) => set({
    isPieceSelectorOpen: true,
    pieceSelectorMode: mode,
    insertAfterStepId: afterStepId ?? null,
    isPanelOpen: false,
  }),

  closePieceSelector: () => set({ isPieceSelectorOpen: false, insertAfterStepId: null }),

  updateStepConfig: (stepId, config) => set(state => {
    if (!state.workflow) return state
    return {
      isDirty: true,
      workflow: {
        ...state.workflow,
        steps: state.workflow.steps.map(s =>
          s.id === stepId ? { ...s, config: { ...s.config, ...config } } : s
        ),
      },
    }
  }),

  updateStepDisplayName: (stepId, name) => set(state => {
    if (!state.workflow) return state
    return {
      isDirty: true,
      workflow: {
        ...state.workflow,
        steps: state.workflow.steps.map(s =>
          s.id === stepId ? { ...s, displayName: name } : s
        ),
      },
    }
  }),

  addStep: (step) => set(state => {
    if (!state.workflow) return state
    const insertAfter = state.insertAfterStepId
    const steps = [...state.workflow.steps]
    const insertIndex = insertAfter
      ? steps.findIndex(s => s.id === insertAfter) + 1
      : steps.length
    steps.splice(insertIndex, 0, step)

    // Rebuild edges
    const edges: WorkflowEdge[] = steps.map((s, i) =>
      i < steps.length - 1
        ? { id: `${s.id}->${steps[i + 1].id}`, source: s.id, target: steps[i + 1].id }
        : null
    ).filter(Boolean) as WorkflowEdge[]

    return {
      isDirty: true,
      isPieceSelectorOpen: false,
      insertAfterStepId: null,
      selectedStepId: step.id,
      isPanelOpen: true,
      workflow: { ...state.workflow, steps, edges },
    }
  }),

  removeStep: (stepId) => set(state => {
    if (!state.workflow) return state
    const steps = state.workflow.steps.filter(s => s.id !== stepId)
    const edges: WorkflowEdge[] = steps.map((s, i) =>
      i < steps.length - 1
        ? { id: `${s.id}->${steps[i + 1].id}`, source: s.id, target: steps[i + 1].id }
        : null
    ).filter(Boolean) as WorkflowEdge[]
    return {
      isDirty: true,
      selectedStepId: null,
      isPanelOpen: false,
      workflow: { ...state.workflow, steps, edges },
    }
  }),

  toggleEnabled: () => set(state => {
    if (!state.workflow) return state
    return {
      isDirty: true,
      workflow: { ...state.workflow, isEnabled: !state.workflow.isEnabled },
    }
  }),

  setIsSaving: (v) => set({ isSaving: v }),
  setIsRunning: (v) => set({ isRunning: v }),
}))
