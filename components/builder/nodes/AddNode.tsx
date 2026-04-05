'use client'

import { memo } from 'react'
import { NodeProps } from '@xyflow/react'
import { Handle, Position } from '@xyflow/react'
import { useBuilderStore } from '@/lib/stores/builderStore'

export interface AddNodeData {
  afterStepId: string
}

function AddNode({ data }: NodeProps) {
  const nodeData = data as unknown as AddNodeData
  const { openPieceSelector } = useBuilderStore()

  return (
    <div className="flex flex-col items-center">
      <Handle type="target" position={Position.Top} style={{ background: '#a1a1aa', width: 6, height: 6, border: 'none' }} />
      <button
        onClick={() => openPieceSelector('action', nodeData.afterStepId)}
        className="w-7 h-7 bg-zinc-700 hover:bg-orange-500 rounded-full flex items-center justify-center text-white transition-colors shadow-sm group"
        title="ステップを追加"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <Handle type="source" position={Position.Bottom} style={{ background: '#a1a1aa', width: 6, height: 6, border: 'none' }} />
    </div>
  )
}

export default memo(AddNode)
