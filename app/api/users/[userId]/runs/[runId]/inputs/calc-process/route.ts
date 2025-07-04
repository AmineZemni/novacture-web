import { NextRequest, NextResponse } from 'next/server'
import { postIfrsCalcProcessInput } from '../../../../../../../../api/services/ifrs.service'

export async function POST(
  req: NextRequest,
  {
    params
  }: {
    params: {
      userId: string
      runId: string
    }
  }
) {
  const userKey = req.nextUrl.searchParams.get('userKey')
  if (!userKey) {
    return NextResponse.json({ error: 'Missing userKey' }, { status: 400 })
  }

  let payload

  try {
    payload = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const success = await postIfrsCalcProcessInput(
    params.userId,
    params.runId,
    userKey,
    payload
  )

  return NextResponse.json({ success })
}
