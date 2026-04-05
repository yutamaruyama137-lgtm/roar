import { NextRequest, NextResponse } from 'next/server'
import { workflowsStore } from '@/lib/workflows/store'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const wf = workflowsStore.getById(params.id)
  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ workflow: wf })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const wf = workflowsStore.update(params.id, body)
  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ workflow: wf })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const ok = workflowsStore.delete(params.id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
