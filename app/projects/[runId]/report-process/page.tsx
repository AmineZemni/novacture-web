import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPreGeneratorInputsIds } from '../../../../api/services/ifrs.service'
import ReportProcessForm from '../../../_components/ReportProcessForm'

interface Props {
  params: { runId: string }
}

export default async function ReportProcessPage({ params }: Props) {
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

  if (
    !preGeneratorInputs ||
    !preGeneratorInputs.yield_curve_ids ||
    !preGeneratorInputs.calc_process_ids
  ) {
    return (
      <div className='text-vividred w-full text-center mt-24 text-xl'>
        Failed to load pre-generator inputs
      </div>
    )
  }

  return (
    <div className='flex justify-center items-center text-blackopac'>
      <div className='p-8 w-full max-w-2xl'>
        <h1 className='text-2xl font-bold mb-4 text-novablue w-full'>
          Report Process Input
        </h1>
        <ReportProcessForm
          runId={runId}
          userId={userId}
          userKey={userKey}
          yieldCurveIds={preGeneratorInputs.yield_curve_ids}
          calcProcessIds={preGeneratorInputs.calc_process_ids}
        />
      </div>
    </div>
  )
}
