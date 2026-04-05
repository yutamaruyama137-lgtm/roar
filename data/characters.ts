/**
 * data/characters.ts
 *
 * ROAR ではAI社員機能は使用しない。
 * 既存の admin・api/chat コードとの互換性のためスタブとして残す。
 */

import type { AICharacter } from "@/types"

// types/index.ts の AICharacter を再エクスポート
export type { AICharacter } from "@/types"

export const characters: AICharacter[] = []

export function getCharacter(_id: string): AICharacter | undefined {
  return undefined
}
