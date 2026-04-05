import Link from "next/link"
import WorkflowCard from "@/components/WorkflowCard"
import Header from "@/components/Header"
import { templates } from "@/data/templates"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
          AI ワークフロー自動化
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6 max-w-4xl">
          業務を自動化する、
          <br />
          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
            最速の方法。
          </span>
        </h1>

        <p className="text-zinc-400 text-lg sm:text-xl max-w-xl leading-relaxed mb-12">
          自然言語で指示するだけ。
          <br />
          AIがワークフローをセットアップします。
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#templates"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg shadow-orange-500/20"
          >
            テンプレートを見る
          </a>
          <Link
            href="/workflows"
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200 border border-zinc-700"
          >
            ダッシュボードへ
          </Link>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="max-w-6xl mx-auto w-full px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            すぐに使えるテンプレート
          </h2>
          <p className="text-zinc-500 text-base">
            選んで、つなげて、即稼働。セットアップは5分以内。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <WorkflowCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-lg font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            ROAR
          </span>
          <p className="text-zinc-600 text-sm">
            © 2026 REQS Lab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
