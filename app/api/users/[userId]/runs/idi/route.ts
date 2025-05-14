import { NextRequest } from 'next/server'
import { postRunIDI } from '../../../../../../api/services/runs.service'

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userKey = req.nextUrl.searchParams.get('userKey')!
  const userId = params.userId
  const body = await req.json()
  const runName = body.runName
  await postRunIDI(userId, userKey, runName)
  return Response.json({ success: true })
}
