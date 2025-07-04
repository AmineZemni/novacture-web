import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import GeneratorForm from '../../../_components/GeneratorForm'

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

  return (
    <div className='flex justify-center items-center text-blackopac'>
      <div className='p-8 w-full max-w-2xl'>
        <h1 className='text-2xl font-bold mb-4 text-novablue w-full'>
          IFRS proj Generator
        </h1>
        <GeneratorForm runId={runId} userId={userId} userKey={userKey} />
      </div>
    </div>
  )
}
