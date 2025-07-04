import { createNewRun, getRuns } from '../../../../../api/services/runs.service'
import { NextRequest, NextResponse } from 'next/server'
export async function POST(
  req: NextRequest,
  {
    params
  }: {
    params: {
      userId: string
    }
  }
) {
  const userKey = req.nextUrl.searchParams.get('userKey')
  if (!userKey) {
    return NextResponse.json({ error: 'Missing userKey' }, { status: 400 })
  }

  const body = await req.json()
  const run = await createNewRun(
    params.userId,
    userKey,
    body.runName,
    body.workflowName,
    body.description
  )

  if (!run || !run.run_id) {
    return NextResponse.json({}, { status: 200 })
  }

  return NextResponse.json({ run_id: run.run_id })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userKey = req.nextUrl.searchParams.get('userKey')!
  const userId = params.userId
  const runs = await getRuns(userId, userKey)
  if (!runs) return Response.json([])
  return Response.json(runs)
}
