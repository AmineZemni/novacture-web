import { NextRequest } from 'next/server'
import { getRuns } from '../../../../../api/services/runs.service'

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
