import { NextRequest, NextResponse } from 'next/server'
import { workflowsStore } from '@/lib/workflows/store'

export async function GET() {
  const workflows = workflowsStore.getAll()
  return NextResponse.json({ workflows })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const workflow = workflowsStore.create({ name: body.name || '新しいワークフロー', description: body.description })
  return NextResponse.json({ workflow }, { status: 201 })
}
