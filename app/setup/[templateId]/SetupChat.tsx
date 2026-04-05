"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Nango from "@nangohq/frontend"
import { WorkflowTemplate } from "@/data/templates"

interface Message {
  role: "ai" | "user"
  content: string
}

interface Props {
  template: WorkflowTemplate
}

const SERVICE_ICONS: Record<string, string> = {
  gmail: "📧",
  slack: "💬",
  notion: "📄",
}

const SERVICE_LABELS: Record<string, string> = {
  gmail: "Gmail",
  slack: "Slack",
  notion: "Notion",
}

export default function SetupChat({ template }: Props) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: `「${template.title}」のセットアップを始めます。いくつか質問に答えてください。`,
    },
    {
      role: "ai",
      content: template.setupQuestions[0]?.question ?? "",
    },
  ])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [textInput, setTextInput] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [connectedServices, setConnectedServices] = useState<Set<string>>(
    new Set()
  )
  const [connectingService, setConnectingService] = useState<string | null>(null)

  const currentQuestion = template.setupQuestions[currentStep]
  const isLastStep = currentStep === template.setupQuestions.length - 1

  function handleAnswer(value: string) {
    const key = currentQuestion.key
    const newAnswers = { ...answers, [key]: value }
    setAnswers(newAnswers)

    const userMessage: Message = { role: "user", content: value }

    if (isLastStep) {
      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          role: "ai",
          content:
            "ありがとうございます！すべての設定が完了しました。ワークフローを起動する準備ができています。",
        },
      ])
      setIsComplete(true)
    } else {
      const nextQuestion = template.setupQuestions[currentStep + 1]
      setMessages((prev) => [
        ...prev,
        userMessage,
        { role: "ai", content: nextQuestion.question },
      ])
      setCurrentStep((prev) => prev + 1)
    }
    setTextInput("")
  }

  async function handleServiceConnect(service: string) {
    setConnectingService(service)
    try {
      // 1. サーバーからNangoセッショントークンを取得
      const res = await fetch("/api/nango/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integration: service }),
      })
      const data = await res.json() as { token?: string; error?: string }

      if (!data.token) {
        throw new Error(data.error ?? "セッショントークンの取得に失敗しました")
      }

      // 2. Nango Connect UIを開く
      const nango = new Nango({ connectSessionToken: data.token })
      await nango.openConnectUI({
        onEvent: (event: { type: string }) => {
          if (event.type === "close") {
            setConnectingService(null)
          }
        },
      })

      // 3. 連携成功 → チャットを次のステップへ
      setConnectedServices((prev) => {
        const next = new Set(prev)
        next.add(service)
        return next
      })
      handleAnswer(`${SERVICE_LABELS[service] ?? service} を連携しました`)
    } catch (err) {
      console.error("[connect] error:", err)
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `連携中にエラーが発生しました: ${err instanceof Error ? err.message : "もう一度お試しください"}`,
        },
      ])
    } finally {
      setConnectingService(null)
    }
  }

  async function handleLaunch() {
    setIsSubmitting(true)
    try {
      await fetch("/api/workflows/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: template.id,
          config: answers,
        }),
      })
      router.push("/workflows")
    } catch {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
        {/* Chat header */}
        <div className="border-b border-zinc-800 px-5 py-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-zinc-300">
            ROARセットアップアシスタント
          </span>
          <span className="ml-auto text-xs text-zinc-600">
            {currentStep + (isComplete ? 1 : 0)} / {template.setupQuestions.length} 完了
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 p-5 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-xs font-black text-white mr-3 flex-shrink-0 mt-0.5">
                  R
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "ai"
                    ? "bg-zinc-800 text-zinc-200 rounded-tl-sm"
                    : "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-tr-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        {!isComplete && currentQuestion && (
          <div className="border-t border-zinc-800 p-5">
            {currentQuestion.type === "text" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (textInput.trim()) handleAnswer(textInput.trim())
                }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="入力してください..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-3 rounded-xl text-sm transition-all"
                >
                  送信
                </button>
              </form>
            )}

            {currentQuestion.type === "select" && (
              <div className="flex flex-wrap gap-2">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-orange-500 text-zinc-200 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "service_connect" && currentQuestion.service && (
              <div className="flex items-center gap-4">
                {connectedServices.has(currentQuestion.service) ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                    <span className="text-lg">✅</span>
                    {SERVICE_LABELS[currentQuestion.service]} 連携済み
                  </div>
                ) : (
                  <button
                    onClick={() => handleServiceConnect(currentQuestion.service!)}
                    disabled={connectingService === currentQuestion.service}
                    className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed border border-zinc-700 hover:border-orange-500 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-all"
                  >
                    {connectingService === currentQuestion.service ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        連携中...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">
                          {SERVICE_ICONS[currentQuestion.service] ?? "🔗"}
                        </span>
                        {SERVICE_LABELS[currentQuestion.service] ?? currentQuestion.service} を連携する
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Launch button */}
        {isComplete && (
          <div className="border-t border-zinc-800 p-5">
            <button
              onClick={handleLaunch}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 disabled:opacity-60 text-white font-black py-4 rounded-xl text-base transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  起動中...
                </>
              ) : (
                "このワークフローを起動する 🚀"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
