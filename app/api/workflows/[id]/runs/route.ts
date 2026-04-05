import { NextRequest, NextResponse } from 'next/server'
import { runsStore } from '@/lib/workflows/store'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const runs = runsStore.getByWorkflowId(params.id)
  return NextResponse.json({ runs })
}
