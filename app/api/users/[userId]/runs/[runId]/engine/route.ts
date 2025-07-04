import { NextRequest, NextResponse } from 'next/server'
import { postIFRSEngine } from '../../../../../../../api/services/ifrs.service'

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

  const success = await postIFRSEngine(params.userId, params.runId, userKey)

  return NextResponse.json({ success })
}
