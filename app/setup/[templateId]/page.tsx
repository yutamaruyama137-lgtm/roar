import { getTemplate } from "@/data/templates"
import { notFound } from "next/navigation"
import SetupChat from "./SetupChat"

interface Props {
  params: { templateId: string }
}

export default function SetupPage({ params }: Props) {
  const template = getTemplate(params.templateId)
  if (!template) notFound()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-black/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a
            href="/"
            className="text-xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
          >
            ROAR
          </a>
          <a href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← テンプレート一覧に戻る
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Flow Diagram */}
        <aside className="lg:col-span-2">
          <div className="sticky top-20">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{template.icon}</span>
                <div>
                  <h1 className="text-lg font-bold text-white leading-tight">
                    {template.title}
                  </h1>
                  <span className="text-xs text-orange-400 font-semibold uppercase tracking-widest">
                    {template.category}
                  </span>
                </div>
              </div>

              {/* Steps Flow */}
              <div className="space-y-0">
                {template.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                        {step.icon}
                      </div>
                      {index < template.steps.length - 1 && (
                        <div className="w-px h-6 bg-zinc-700 my-1" />
                      )}
                    </div>
                    <div className="pt-2">
                      <div className="text-sm font-bold text-white">
                        {step.label}
                      </div>
                      <div className="text-xs text-zinc-500 leading-relaxed">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost estimate */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
              <div className="text-xs text-orange-400 font-semibold uppercase tracking-widest mb-3">
                費用・効果目安
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-2xl font-black text-white">
                    {template.estimatedMinutesPerMonth}分
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">月間節約時間</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">
                    ¥{template.estimatedCostYen.toLocaleString()}〜
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">月額費用目安</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Setup Chat */}
        <main className="lg:col-span-3">
          <SetupChat template={template} />
        </main>
      </div>
    </div>
  )
}
