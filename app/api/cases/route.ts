import { NextResponse } from 'next/server'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { dashboardCases } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = await db.select().from(dashboardCases).orderBy(desc(dashboardCases.createdAt))
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  const caseNumber = String(body.caseNumber ?? '').trim()
  const institution = String(body.institution ?? '').trim()
  const issue = String(body.issue ?? '').trim()
  if (!caseNumber || !institution || !issue) return NextResponse.json({ error: 'Case number, institution, and issue are required.' }, { status: 400 })
  const [created] = await db.insert(dashboardCases).values({ caseNumber, institution, issue, severity: String(body.severity ?? 'Medium'), status: 'Open', owner: 'Unassigned', progress: 0 }).returning()
  return NextResponse.json(created, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const id = Number(body.id)
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'A valid case id is required.' }, { status: 400 })
  const [updated] = await db.update(dashboardCases).set({ status: body.status ? String(body.status) : undefined, progress: body.progress === undefined ? undefined : Math.max(0, Math.min(100, Number(body.progress))), owner: body.owner ? String(body.owner) : undefined }).where(eq(dashboardCases.id, id)).returning()
  return updated ? NextResponse.json(updated) : NextResponse.json({ error: 'Case not found.' }, { status: 404 })
}
