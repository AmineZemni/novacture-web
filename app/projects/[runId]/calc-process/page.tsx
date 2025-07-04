import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPreGeneratorInputsIds } from '../../../../api/services/ifrs.service'
import CalcProcessForm from '../../../_components/CalcProcessForm'

interface Props {
  params: { runId: string }
}

export default async function CalcProcessPage({ params }: Props) {
  const cookieStore = cookies()
  const userKey = cookieStore.get('userKey')?.value
  const userId = cookieStore.get('userId')?.value
  const runId = params.runId
  if (!userKey || !userId || !runId) {
    redirect('/')
  }

  const preGeneratorInputs = await getPreGeneratorInputsIds(
    userId,
    runId,
    userKey
  )

  if (!preGeneratorInputs) {
    return <div>Failed to load pre-generator inputs</div>
  }

  return (
    <div className='flex justify-center items-center text-blackopac'>
      <div className='p-8 w-full max-w-2xl'>
        <h1 className='text-2xl font-bold mb-4 text-novablue w-full'>
          Calc Process Input
        </h1>
        <CalcProcessForm
          runId={runId}
          userId={userId}
          userKey={userKey}
          uoaIds={preGeneratorInputs.uoa_ids}
        />
      </div>
    </div>
  )
}
