import { NextRequest } from 'next/server'
import { getUserByKey } from '../../../api/services/users.service'

export async function GET(req: NextRequest) {
  const userKey = req.nextUrl.searchParams.get('userKey')!
  const user = await getUserByKey(userKey)
  if (!user) return Response.json({})
  return Response.json(user)
}
