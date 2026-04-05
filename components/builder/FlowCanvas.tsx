'use client'

import { useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useBuilderStore } from '@/lib/stores/builderStore'
import { getProvider } from '@/lib/providers/registry'
import StepNode from './nodes/StepNode'
import AddNode from './nodes/AddNode'

const nodeTypes = { stepNode: StepNode, addNode: AddNode }

const STEP_WIDTH = 288
const STEP_HEIGHT = 80
const VSPACE = 100

export default function FlowCanvas() {
  const { workflow, selectedStepId, closePanel } = useBuilderStore()
  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[])
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[])

  useEffect(() => {
    if (!workflow) return

    const steps = workflow.steps
    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    steps.forEach((step, i) => {
      const provider = step.provider ? getProvider(step.provider) : null
      const y = i * (STEP_HEIGHT + VSPACE)

      newNodes.push({
        id: step.id,
        type: 'stepNode',
        position: { x: 0, y },
        data: {
          stepId: step.id,
          displayName: step.displayName,
          provider: step.provider,
          actionKey: step.actionKey,
          type: step.type,
          valid: step.valid,
          isSelected: selectedStepId === step.id,
          providerIcon: provider?.icon ?? '⚡',
          label: step.type === 'trigger' ? 'トリガー' : step.type === 'ai' ? 'AI処理' : step.type === 'condition' ? '条件' : 'アクション',
        },
        draggable: false,
      })

      // Add "+" node between steps
      if (i < steps.length - 1) {
        const addId = `add-${step.id}`
        newNodes.push({
          id: addId,
          type: 'addNode',
          position: { x: STEP_WIDTH / 2 - 14, y: y + STEP_HEIGHT + (VSPACE / 2) - 14 },
          data: { afterStepId: step.id },
          draggable: false,
          selectable: false,
        })

        // Edge from step to add node
        newEdges.push({
          id: `${step.id}-add`,
          source: step.id,
          target: addId,
          type: 'smoothstep',
          style: { stroke: '#d4d4d8', strokeWidth: 1.5 },
          animated: false,
        })

        // Edge from add node to next step
        newEdges.push({
          id: `add-${steps[i + 1].id}`,
          source: addId,
          target: steps[i + 1].id,
          type: 'smoothstep',
          style: { stroke: '#d4d4d8', strokeWidth: 1.5 },
          animated: false,
        })
      }
    })

    // Final "+" add button
    if (steps.length > 0) {
      const lastStep = steps[steps.length - 1]
      const lastY = (steps.length - 1) * (STEP_HEIGHT + VSPACE)
      newNodes.push({
        id: 'add-final',
        type: 'addNode',
        position: { x: STEP_WIDTH / 2 - 14, y: lastY + STEP_HEIGHT + 20 },
        data: { afterStepId: lastStep.id },
        draggable: false,
        selectable: false,
      })
      newEdges.push({
        id: `${lastStep.id}-add-final`,
        source: lastStep.id,
        target: 'add-final',
        type: 'smoothstep',
        style: { stroke: '#d4d4d8', strokeWidth: 1.5 },
      })
    }

    setNodes(newNodes)
    setEdges(newEdges)
  }, [workflow, selectedStepId, setNodes, setEdges])

  return (
    <div className="flex-1" style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.4}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        onPaneClick={() => closePanel()}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d4d4d8" />
        <Controls showInteractive={false} style={{ background: '#fff', border: '1px solid #e4e4e7' } as React.CSSProperties} />
        <MiniMap nodeColor="#f97316" maskColor="rgba(0,0,0,0.05)" style={{ background: '#f9fafb', border: '1px solid #e4e4e7', borderRadius: 8 }} />
      </ReactFlow>
    </div>
  )
}
