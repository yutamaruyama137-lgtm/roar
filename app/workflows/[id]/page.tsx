import Link from "next/link"
import { templates } from "@/data/templates"
import WorkflowDetailClient from "./WorkflowDetailClient"

// モックデータ（Phase 2でSupabaseから取得）
const mockWorkflows: Record<
  string,
  {
    id: string
    templateId: string
    status: "active" | "paused"
    lastRunAt: string
    runCount: number
    operationLimit: number
  }
> = {
  "wf-1": {
    id: "wf-1",
    templateId: "inquiry-notify",
    status: "active",
    lastRunAt: "2026-04-04 09:23",
    runCount: 47,
    operationLimit: 2000,
  },
  "wf-2": {
    id: "wf-2",
    templateId: "weekly-report",
    status: "active",
    lastRunAt: "2026-04-01 08:00",
    runCount: 12,
    operationLimit: 2000,
  },
}

interface Props {
  params: { id: string }
}

export default function WorkflowDetailPage({ params }: Props) {
  const workflow = mockWorkflows[params.id]
  if (!workflow) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">ワークフローが見つかりません</p>
          <Link href="/workflows" className="text-orange-500 hover:underline text-sm">
            ← ダッシュボードに戻る
          </Link>
        </div>
      </div>
    )
  }

  const template = templates.find((t) => t.id === workflow.templateId)
  if (!template) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">テンプレートが見つかりません</p>
      </div>
    )
  }

  return (
    <WorkflowDetailClient
      workflow={workflow}
      template={template}
    />
  )
}
