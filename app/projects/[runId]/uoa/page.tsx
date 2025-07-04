import { redirect } from 'next/navigation'
import { getPreGeneratorInputsIds } from '../../../../api/services/ifrs.service'
import { cookies } from 'next/headers'
import UoaForm from '../../../_components/UoaForm'

interface Props {
  params: { runId: string }
}

export default async function UoaPage({ params }: Props) {
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
          Units of Account Input
        </h1>
        <UoaForm
          runId={runId}
          userId={userId}
          userKey={userKey}
          yieldCurveIds={preGeneratorInputs.yield_curve_ids}
        />
      </div>
    </div>
  )
}
