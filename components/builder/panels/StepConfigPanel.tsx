'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/lib/stores/builderStore'
import { getProvider } from '@/lib/providers/registry'
import { FieldSchema } from '@/lib/providers/types'

function FieldInput({ field, value, onChange }: { field: FieldSchema; value: string; onChange: (v: string) => void }) {
  if (field.type === 'service_connect') {
    return (
      <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl p-3">
        <span className="text-lg">{field.service === 'gmail' ? '✉️' : field.service === 'slack' ? '💬' : '🔗'}</span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-zinc-800 capitalize">{field.service}</div>
          <div className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            接続済み
          </div>
        </div>
        <button className="text-xs text-orange-500 font-semibold hover:text-orange-700">変更</button>
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={4}
        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 resize-y outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20 min-h-[80px] font-mono text-xs leading-relaxed"
      />
    )
  }

  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-orange-400 cursor-pointer"
      >
        {field.options?.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    )
  }

  return (
    <input
      type={field.type === 'number' ? 'number' : 'text'}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={field.placeholder}
      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20"
    />
  )
}

function VariablePicker({ onInsert }: { onInsert: (v: string) => void }) {
  const { workflow, selectedStepId } = useBuilderStore()
  if (!workflow || !selectedStepId) return null

  const currentIdx = workflow.steps.findIndex(s => s.id === selectedStepId)
  const prevSteps = workflow.steps.slice(0, currentIdx)

  if (prevSteps.length === 0) return null

  return (
    <div className="mt-2">
      <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">前のステップの出力を参照</div>
      <div className="flex flex-wrap gap-1">
        {prevSteps.map(step => (
          <button
            key={step.id}
            onClick={() => onInsert(`{{${step.name}.output}}`)}
            className="text-[11px] font-semibold px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-md hover:bg-orange-100 transition-colors"
          >
            {`{{${step.name}.output}}`}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function StepConfigPanel() {
  const { workflow, selectedStepId, isPanelOpen, closePanel, updateStepConfig, updateStepDisplayName, removeStep } = useBuilderStore()
  const [activeTab, setActiveTab] = useState<'settings' | 'test' | 'logs'>('settings')

  if (!isPanelOpen || !selectedStepId || !workflow) return null

  const step = workflow.steps.find(s => s.id === selectedStepId)
  if (!step) return null

  const provider = step.provider ? getProvider(step.provider) : null
  const actionDef = step.type === 'trigger'
    ? provider?.triggers?.find(t => t.key === step.actionKey)
    : provider?.actions.find(a => a.key === step.actionKey)

  const handleConfigChange = (key: string, value: string) => {
    updateStepConfig(step.id, { [key]: value })
  }

  return (
    <aside className="w-80 bg-white border-l border-zinc-200 flex flex-col flex-shrink-0 overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-zinc-100 flex items-center gap-3 px-4 flex-shrink-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
          step.type === 'trigger' ? 'bg-blue-100' : step.type === 'ai' ? 'bg-purple-100' : 'bg-zinc-100'
        }`}>
          {provider?.icon ?? '⚡'}
        </div>
        <div className="flex-1 min-w-0">
          <input
            className="text-sm font-bold text-zinc-900 bg-transparent outline-none border-b border-transparent hover:border-zinc-200 focus:border-orange-400 w-full truncate transition-colors"
            value={step.displayName}
            onChange={e => updateStepDisplayName(step.id, e.target.value)}
          />
          <div className="text-[10px] text-zinc-400">
            {provider?.displayName ?? '—'} · {step.type === 'trigger' ? 'トリガー' : step.type === 'ai' ? 'AI処理' : 'アクション'}
          </div>
        </div>
        <button onClick={closePanel} className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex-shrink-0">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-100 flex-shrink-0">
        {(['settings', 'test', 'logs'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
              activeTab === tab
                ? 'text-orange-500 border-orange-500'
                : 'text-zinc-400 border-transparent hover:text-zinc-600'
            }`}
          >
            {tab === 'settings' ? '設定' : tab === 'test' ? 'テスト' : 'ログ'}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'settings' && (
          <div className="p-4 space-y-5">
            {actionDef?.inputSchema.map(field => (
              <div key={field.key}>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                <FieldInput
                  field={field}
                  value={String(step.config[field.key] ?? '')}
                  onChange={v => handleConfigChange(field.key, v)}
                />
                {field.description && (
                  <p className="text-[11px] text-zinc-400 mt-1">{field.description}</p>
                )}
                {(field.type === 'text' || field.type === 'textarea') && step.type !== 'trigger' && (
                  <VariablePicker onInsert={v => handleConfigChange(field.key, String(step.config[field.key] ?? '') + v)} />
                )}
              </div>
            ))}
            {(!actionDef || actionDef.inputSchema.length === 0) && (
              <div className="text-center text-zinc-400 py-8">
                <div className="text-2xl mb-2">✅</div>
                <div className="text-sm">このステップには設定項目がありません</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'test' && (
          <div className="p-4">
            <div className="text-xs text-zinc-500 mb-4">テストデータを使ってこのステップを単体でテストします。</div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 font-mono text-xs text-zinc-600">
              <div className="text-zinc-400 mb-2">// サンプルの入力データ</div>
              <pre className="whitespace-pre-wrap">{JSON.stringify({ subject: 'テスト件名', from: 'test@example.com', body: 'テスト本文' }, null, 2)}</pre>
            </div>
            <button className="mt-3 w-full py-2 bg-orange-50 border border-orange-200 text-orange-600 rounded-xl text-sm font-semibold hover:bg-orange-100 transition-colors flex items-center justify-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              このステップをテスト実行
            </button>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="p-4">
            <div className="space-y-2">
              {[
                { time: '09:23:02', status: 'ok', msg: '完了 — 1.2秒' },
                { time: '09:15:44', status: 'ok', msg: '完了 — 0.8秒' },
                { time: '08:55:10', status: 'error', msg: 'エラー: timeout' },
              ].map((log, i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${log.status === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  <span>{log.status === 'ok' ? '✓' : '✗'}</span>
                  <span className="text-zinc-400 font-mono">{log.time}</span>
                  <span>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-100 flex gap-2 flex-shrink-0">
        <button className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          変更を保存
        </button>
        {step.type !== 'trigger' && (
          <button
            onClick={() => removeStep(step.id)}
            className="w-9 h-9 flex items-center justify-center bg-red-50 border border-red-200 text-red-400 rounded-xl hover:bg-red-100 transition-colors"
            title="ステップを削除"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        )}
      </div>
    </aside>
  )
}
