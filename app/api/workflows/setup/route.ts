import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { getSessionTenantId } from "@/lib/tenant"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = getSessionTenantId(session)
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 })
    }

    const body = await req.json()
    const { template_id, config } = body

    if (!template_id || !config) {
      return NextResponse.json(
        { error: "template_id and config are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("workflow_configs")
      .insert({
        tenant_id: tenantId,
        template_id,
        config,
        status: "active",
        created_by: session.user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, workflow: data })
  } catch (err) {
    console.error("Setup route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
