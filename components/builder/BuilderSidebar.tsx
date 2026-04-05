'use client'

import Link from 'next/link'

export default function BuilderSidebar({ workflowId }: { workflowId: string }) {
  return (
    <aside className="w-14 bg-white border-r border-zinc-200 flex flex-col items-center py-3 gap-1 flex-shrink-0 z-10">
      {/* Logo */}
      <Link href="/" className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-black text-sm mb-3 hover:opacity-90 transition-opacity flex-shrink-0">
        R
      </Link>

      <SidebarBtn href="/workflows" icon={<GridIcon />} title="ダッシュボード" />
      <SidebarBtn href="/workflows" icon={<FlowIcon />} title="ワークフロー" active />
      <SidebarBtn href={`/runs?workflow=${workflowId}`} icon={<ClockIcon />} title="実行ログ" />
      <SidebarBtn href="/connections" icon={<LinkIcon />} title="コネクション" />

      <div className="flex-1" />

      <SidebarBtn href="/settings" icon={<SettingsIcon />} title="設定" />
    </aside>
  )
}

function SidebarBtn({ href, icon, title, active }: { href: string; icon: React.ReactNode; title: string; active?: boolean }) {
  return (
    <Link href={href} title={title} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${active ? 'bg-orange-50 text-orange-500' : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'}`}>
      {icon}
    </Link>
  )
}

const GridIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const FlowIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
const ClockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
const LinkIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
const SettingsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
