/**
 * lib/tools/index.ts
 *
 * ROAR ではClaude Tool Useによるツール実行は使用しない。
 * 既存コードとの互換性のためスタブとして残す。
 */

export const ALL_TOOLS: [] = []
export const TOOLS_WITHOUT_DELEGATION: [] = []

export async function executeTool(
  toolName: string,
  _toolInput: Record<string, string>,
  _tenantId: string,
  _userId?: string
): Promise<string> {
  return `ツール「${toolName}」はROARでは使用しません。`
}

export async function executeDelegateToAgent(
  _agentId: string,
  _task: string,
  _context: string,
  _tenantId: string
): Promise<string> {
  return "エージェント委託はROARでは使用しません。"
}
