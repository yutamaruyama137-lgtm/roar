import { NextResponse } from 'next/server'
import { runsStore } from '@/lib/workflows/store'

export async function GET() {
  const runs = runsStore.getAll()
  const sorted = [...runs].sort((a, b) =>
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  )
  return NextResponse.json({ runs: sorted })
}
