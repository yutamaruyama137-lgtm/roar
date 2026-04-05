/**
 * lib/orchestrator.ts
 *
 * ROAR ではAI社員オーケストレーターは使用しない。
 * 既存コードとの互換性のためスタブとして残す。
 */

export interface AgenticInput {
  goal: string
  characterId: string
  tenantId: string
  userId?: string
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
}

export function orchestrateStream(_input: AgenticInput): ReadableStream {
  return new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode("（この機能はROARでは使用しません）"))
      controller.close()
    },
  })
}
