'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Connection {
  id: string
  service: string
  name: string
  connectedAt: string
  email?: string
  status: 'connected' | 'expired' | 'error'
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading connections
    const timer = setTimeout(() => {
      setConnections([
        {
          id: '1',
          service: 'gmail',
          name: 'Personal Gmail',
          email: 'user@gmail.com',
          connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'connected',
        },
        {
          id: '2',
          service: 'slack',
          name: 'Team Workspace',
          email: 'workspace@slack.com',
          connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'connected',
        },
      ])
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleConnect = async (service: string) => {
    setConnecting(service)
    // Simulate connection flow
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newConnection: Connection = {
      id: String(connections.length + 1),
      service,
      name: `${service.charAt(0).toUpperCase() + service.slice(1)} Account`,
      connectedAt: new Date().toISOString(),
      status: 'connected',
    }
    setConnections([...connections, newConnection])
    setConnecting(null)
  }

  const handleDisconnect = (id: string) => {
    setConnections(connections.filter(c => c.id !== id))
  }

  const serviceIcons: Record<string, string> = {
    gmail: '✉️',
    slack: '💬',
    github: '🐙',
    webhook: '🪝',
    notion: '📝',
    airtable: '📊',
  }

  const availableServices = [
    { id: 'gmail', name: 'Gmail', description: 'メール送受信の自動化' },
    { id: 'slack', name: 'Slack', description: 'チャットメッセージの送信' },
    { id: 'github', name: 'GitHub', description: 'リポジトリのモニタリング' },
    { id: 'webhook', name: 'Webhook', description: 'カスタムHTTPリクエスト' },
    { id: 'notion', name: 'Notion', description: 'ドキュメント管理の自動化' },
    { id: 'airtable', name: 'Airtable', description: 'データベースの連携' },
  ]

  const connectedServices = connections.map(c => c.service)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">ROAR</Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">テンプレート</Link>
            <Link href="/workflows" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">ワークフロー</Link>
            <Link href="/runs" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">実行ログ</Link>
            <span className="text-sm font-bold text-white border-b-2 border-orange-500 pb-0.5">コネクション</span>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Title row */}
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-1 tracking-tight">コネクション</h1>
          <p className="text-zinc-500 text-sm">外部サービスとの連携を管理します</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: '接続済み', value: connectedServices.length, color: 'text-emerald-400' },
            { label: '利用可能', value: availableServices.length, color: 'text-orange-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Connected section */}
        {connections.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">接続済みサービス</h2>
            <div className="space-y-3">
              {connections.map(conn => (
                <div key={conn.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 hover:border-zinc-700 transition-colors group">
                  <div className="text-2xl flex-shrink-0">{serviceIcons[conn.service] || '🔗'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="text-base font-bold text-white">{conn.name}</span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        接続済み
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500">
                      {conn.email || `接続日: ${new Date(conn.connectedAt).toLocaleDateString('ja-JP')}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDisconnect(conn.id)}
                    className="px-4 py-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors border border-red-500/20 rounded-xl hover:bg-red-500/10"
                  >
                    切断
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available services */}
        <div>
          <h2 className="text-xl font-bold mb-4">利用可能なサービス</h2>
          <div className="grid grid-cols-2 gap-4">
            {availableServices.map(service => {
              const isConnected = connectedServices.includes(service.id)
              return (
                <div key={service.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-3xl flex-shrink-0">{serviceIcons[service.id] || '🔗'}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white mb-1">{service.name}</h3>
                      <p className="text-sm text-zinc-500">{service.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect(service.id)}
                    disabled={isConnected || connecting === service.id}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isConnected
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : connecting === service.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white opacity-60'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white'
                    }`}
                  >
                    {isConnected ? '接続済み' : connecting === service.id ? '接続中...' : '接続'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
