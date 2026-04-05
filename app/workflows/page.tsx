import Link from "next/link"
import { templates } from "@/data/templates"

// モックデータ（実際はSupabaseから取得）
const mockWorkflows = [
  {
    id: "wf-1",
    templateId: "inquiry-notify",
    status: "active" as const,
    lastRunAt: "2026-04-04 09:23",
    runCount: 47,
    monthlyCost: 980,
  },
  {
    id: "wf-2",
    templateId: "weekly-report",
    status: "active" as const,
    lastRunAt: "2026-04-01 08:00",
    runCount: 12,
    monthlyCost: 780,
  },
]

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
          >
            ROAR
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              テンプレート
            </Link>
            <span className="text-sm font-semibold text-white border-b border-orange-500 pb-0.5">
              ダッシュボード
            </span>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">
              稼働中のワークフロー
            </h1>
            <p className="text-zinc-500 text-sm">
              自動化されたフローをすべて管理できます
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all"
          >
            <span className="text-base">+</span>
            新しいワークフローを追加
          </Link>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="text-3xl font-black text-white mb-1">
              {mockWorkflows.filter((w) => w.status === "active").length}
            </div>
            <div className="text-sm text-zinc-500">稼働中フロー</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="text-3xl font-black text-orange-400 mb-1">
              {mockWorkflows.reduce((s, w) => s + w.runCount, 0)}回
            </div>
            <div className="text-sm text-zinc-500">今月の実行回数</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="text-3xl font-black text-white mb-1">
              ¥{mockWorkflows.reduce((s, w) => s + w.monthlyCost, 0).toLocaleString()}
            </div>
            <div className="text-sm text-zinc-500">今月のコスト</div>
          </div>
        </div>

        {/* Workflow list */}
        {mockWorkflows.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl p-16 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <p className="text-zinc-400 font-semibold mb-6">
              まだワークフローがありません
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-6 py-3 rounded-xl text-sm"
            >
              テンプレートを選ぶ →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mockWorkflows.map((workflow) => {
              const template = templates.find(
                (t) => t.id === workflow.templateId
              )
              if (!template) return null

              return (
                <div
                  key={workflow.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-6 hover:border-zinc-700 transition-colors"
                >
                  {/* Icon */}
                  <div className="text-4xl flex-shrink-0">{template.icon}</div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-bold text-white">
                        {template.title}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          workflow.status === "active"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-zinc-700/50 text-zinc-400 border border-zinc-600/50"
                        }`}
                      >
                        {workflow.status === "active" ? "稼働中" : "停止中"}
                      </span>
                      <span className="text-xs text-zinc-600 ml-auto">
                        最終実行: {workflow.lastRunAt}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 truncate">
                      {template.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-center">
                      <div className="text-lg font-black text-orange-400">
                        {workflow.runCount}回
                      </div>
                      <div className="text-xs text-zinc-600">今月の実行</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-black text-white">
                        ¥{workflow.monthlyCost.toLocaleString()}
                      </div>
                      <div className="text-xs text-zinc-600">今月のコスト</div>
                    </div>
                    <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
