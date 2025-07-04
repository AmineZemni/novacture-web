import { NextRequest, NextResponse } from 'next/server'
import { postRunInput } from '../../../../../../../api/services/runs.service'

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

  const formData = await req.formData()

  const file = formData.get('file')
  const fileStructure = formData.get('file_structure')

  if (!(file instanceof Blob) || typeof fileStructure !== 'string') {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const success = await postRunInput(
    params.userId,
    params.runId,
    userKey,
    file,
    fileStructure
  )

  return NextResponse.json({ success })
}
