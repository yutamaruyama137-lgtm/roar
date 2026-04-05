'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { useBuilderStore } from '@/lib/stores/builderStore'

export interface StepNodeData {
  stepId: string
  displayName: string
  provider: string | null
  actionKey: string | null
  type: 'trigger' | 'action' | 'ai' | 'condition'
  valid: boolean
  isSelected: boolean
  providerIcon: string
  label: string
}

const TYPE_COLORS = {
  trigger: 'border-blue-400 bg-blue-50',
  action: 'border-zinc-200',
  ai: 'border-purple-300 bg-purple-50/30',
  condition: 'border-amber-300 bg-amber-50/30',
}

const TYPE_ICON_BG = {
  trigger: 'bg-blue-100',
  action: 'bg-zinc-100',
  ai: 'bg-purple-100',
  condition: 'bg-amber-100',
}

function StepNode({ data }: NodeProps) {
  const nodeData = data as unknown as StepNodeData
  const { selectStep, selectedStepId } = useBuilderStore()
  const isSelected = selectedStepId === nodeData.stepId

  return (
    <div
      className={`
        bg-white rounded-2xl border-2 shadow-sm w-72 cursor-pointer transition-all duration-150
        hover:shadow-md hover:-translate-y-0.5
        ${isSelected
          ? 'border-orange-400 shadow-orange-100 shadow-md'
          : TYPE_COLORS[nodeData.type] || 'border-zinc-200'
        }
      `}
      onClick={() => selectStep(nodeData.stepId)}
    >
      {/* Top handle (hidden for triggers) */}
      {nodeData.type !== 'trigger' && (
        <Handle type="target" position={Position.Top} style={{ background: '#d4d4d8', width: 8, height: 8, border: 'none' }} />
      )}

      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-colors ${
            isSelected ? 'bg-orange-100' : TYPE_ICON_BG[nodeData.type] || 'bg-zinc-100'
          }`}>
            {nodeData.providerIcon}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-0.5">
              {nodeData.label}
            </div>
            <div className="text-sm font-semibold text-zinc-800 truncate leading-tight">
              {nodeData.displayName}
            </div>
          </div>

          {/* Status + actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {nodeData.valid ? (
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </div>
        </div>
      </div>

      {/* Bottom handle */}
      <Handle type="source" position={Position.Bottom} style={{ background: '#d4d4d8', width: 8, height: 8, border: 'none' }} />
    </div>
  )
}

export default memo(StepNode)
