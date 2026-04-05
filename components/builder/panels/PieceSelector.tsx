'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/lib/stores/builderStore'
import { providers, CATEGORIES } from '@/lib/providers/registry'
import { ProviderDefinition, WorkflowStep } from '@/lib/providers/types'

function generateStepId() {
  return `step-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
}

export default function PieceSelector() {
  const { isPieceSelectorOpen, pieceSelectorMode, closePieceSelector, addStep } = useBuilderStore()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<ProviderDefinition | null>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  if (!isPieceSelectorOpen) return null

  const isTriggerMode = pieceSelectorMode === 'trigger'

  const filteredProviders = providers.filter(p => {
    const hasRelevant = isTriggerMode ? (p.triggers?.length ?? 0) > 0 : p.actions.length > 0
    if (!hasRelevant) return false
    if (selectedCategory && p.category !== selectedCategory) return false
    if (search) {
      const q = search.toLowerCase()
      return p.displayName.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    }
    return true
  })

  const handleSelectAction = (provider: ProviderDefinition, actionKey: string) => {
    const action = isTriggerMode
      ? provider.triggers?.find(t => t.key === actionKey)
      : provider.actions.find(a => a.key === actionKey)

    if (!action) return

    const step: WorkflowStep = {
      id: generateStepId(),
      name: `${provider.key}_${actionKey}`.replace(/-/g, '_'),
      displayName: `${provider.displayName}: ${action.displayName}`,
      provider: provider.key,
      actionKey: actionKey,
      type: isTriggerMode ? 'trigger' : (provider.key === 'ai' ? 'ai' : provider.key === 'filter' ? 'condition' : 'action'),
      config: {},
      valid: false,
    }

    addStep(step)
    setSearch('')
    setSelectedCategory(null)
    setSelectedProvider(null)
    setSelectedKey(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={closePieceSelector}>
      <div className="bg-white rounded-2xl shadow-2xl w-[640px] max-h-[75vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-zinc-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-zinc-900">
              {isTriggerMode ? '🎯 トリガーを選ぶ' : '➕ アクションを追加'}
            </h3>
            <button onClick={closePieceSelector} className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              autoFocus
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30"
              placeholder="アプリ・機能を検索..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Categories */}
          {!search && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-orange-500 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
              >
                すべて
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Provider list */}
          <div className="w-52 border-r border-zinc-100 overflow-y-auto p-2">
            {filteredProviders.map(provider => (
              <button
                key={provider.key}
                onClick={() => { setSelectedProvider(provider); setSelectedKey(null) }}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${selectedProvider?.key === provider.key ? 'bg-orange-50 text-orange-700' : 'hover:bg-zinc-50 text-zinc-700'}`}
              >
                <span className="text-xl flex-shrink-0">{provider.icon}</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{provider.displayName}</div>
                  <div className="text-[10px] text-zinc-400">{provider.category}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Action list */}
          <div className="flex-1 overflow-y-auto p-4">
            {!selectedProvider ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <div className="text-3xl mb-2">👈</div>
                <div className="text-sm">左からアプリを選んでください</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">{selectedProvider.displayName} の{isTriggerMode ? 'トリガー' : 'アクション'}</div>
                {(isTriggerMode ? (selectedProvider.triggers ?? []) : selectedProvider.actions).map(action => (
                  <button
                    key={action.key}
                    onClick={() => handleSelectAction(selectedProvider, action.key)}
                    className="w-full text-left p-3 rounded-xl border border-zinc-200 hover:border-orange-300 hover:bg-orange-50 transition-all group"
                  >
                    <div className="text-sm font-semibold text-zinc-800 group-hover:text-orange-700">{action.displayName}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{action.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
