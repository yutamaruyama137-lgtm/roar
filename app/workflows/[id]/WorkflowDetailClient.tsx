"use client"

import { useState } from "react"
import Link from "next/link"
import { WorkflowTemplate } from "@/data/templates"

interface Workflow {
  id: string
  templateId: string
  status: "active" | "paused"
  lastRunAt: string
  runCount: number
  operationLimit: number
}

interface Props {
  workflow: Workflow
  template: WorkflowTemplate
}

// サイドバーのナビアイコン
const SidebarIcon = ({
  children,
  active,
  href,
  title,
}: {
  children: React.ReactNode
  active?: boolean
  href?: string
  title: string
}) => {
  const cls = `w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer
    ${active ? "bg-orange-50 text-orange-500" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"}`
  if (href) {
    return (
      <Link href={href} title={title} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button title={title} className={cls}>
      {children}
    </button>
  )
}

export default function WorkflowDetailClient({ workflow, template }: Props) {
  const [isActive, setIsActive] = useState(workflow.status === "active")

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ---- 左サイドバー ---- */}
      <aside className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-1 flex-shrink-0 z-10">
        {/* ロゴ */}
        <Link
          href="/"
          className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white text-sm font-black mb-3 flex-shrink-0 hover:opacity-90 transition-opacity"
        >
          R
        </Link>

        <SidebarIcon href="/workflows" title="ダッシュボード">
          {/* grid icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </SidebarIcon>

        <SidebarIcon href="/workflows" active title="ワークフロー">
          {/* flow icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="19" r="2" />
            <circle cx="5" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
            <line x1="12" y1="7" x2="12" y2="17" />
            <line x1="7" y1="12" x2="17" y2="12" />
          </svg>
        </SidebarIcon>

        <SidebarIcon title="実行ログ">
          {/* clock icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 15" />
          </svg>
        </SidebarIcon>

        <SidebarIcon title="通知">
          {/* bell icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </SidebarIcon>

        <div className="flex-1" />

        <SidebarIcon title="設定">
          {/* settings icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </SidebarIcon>
      </aside>

      {/* ---- メインコンテンツ ---- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ---- トップヘッダー ---- */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-3 flex-shrink-0">
          {/* 戻るボタン */}
          <Link
            href="/workflows"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>

          {/* アイコン */}
          <span className="text-2xl flex-shrink-0">{template.icon}</span>

          {/* タイトル・サブタイトル */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-gray-900 truncate">
              {template.title}
            </h1>
            <p className="text-xs text-gray-400">
              下記の手順でワークフローの実行が可能です。
            </p>
          </div>

          {/* トリガートグル */}
          <button
            onClick={() => setIsActive((v) => !v)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold transition-all ${
              isActive
                ? "border-orange-300 bg-orange-50 text-orange-600"
                : "border-gray-300 bg-white text-gray-500"
            }`}
          >
            <span className="text-xs">{isActive ? "トリガーON" : "トリガーOFF"}</span>
            {/* トグルスイッチ */}
            <div className={`w-9 h-5 rounded-full relative transition-colors ${isActive ? "bg-orange-500" : "bg-gray-300"}`}>
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  isActive ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </div>
          </button>

          {/* メニュー */}
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </header>

        {/* ---- キャンバス（ドットグリッド） ---- */}
        <main
          className="flex-1 overflow-auto"
          style={{
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          <div className="p-10 flex flex-col items-start">
            {template.steps.map((step, i) => (
              <div key={i} className="flex flex-col items-start">
                {/* ステップカード */}
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-80 flex items-center gap-3 p-4 hover:shadow-md transition-shadow group cursor-pointer">
                    {/* アイコン */}
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-orange-50 transition-colors">
                      {step.icon}
                    </div>

                    {/* テキスト */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-gray-400 font-medium mb-0.5">
                        {step.label}
                      </div>
                      <div className="text-sm font-semibold text-gray-800 truncate">
                        {step.description}
                      </div>
                    </div>

                    {/* コピーボタン */}
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>

                  {/* 完了チェック */}
                  <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                {/* コネクター（最後のステップ以外） */}
                {i < template.steps.length - 1 && (
                  <div className="flex flex-col items-center ml-9">
                    <div className="w-px h-5 bg-gray-400" />
                    <button className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors shadow-sm">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                    <div className="w-px h-5 bg-gray-400" />
                  </div>
                )}
              </div>
            ))}

            {/* 末尾の追加ボタン */}
            <div className="flex flex-col items-center ml-9">
              <div className="w-px h-5 bg-gray-400" />
              <button className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors shadow-sm">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </main>

        {/* ---- フッター ---- */}
        <footer className="bg-white border-t border-gray-200 h-8 flex items-center justify-end px-4">
          <span className="text-xs text-gray-400">
            {workflow.runCount} オペレーション | {workflow.operationLimit.toLocaleString()} アウト上限
          </span>
        </footer>
      </div>
    </div>
  )
}
