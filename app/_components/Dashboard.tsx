'use client'

import { useEffect, useState } from 'react'
import { Run, RunStatus } from '../../api/services/runs.service'
import Cookies from 'js-cookie'
import { WorkflowName } from '../../api/services/workflows.service'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  const [userName, setUserName] = useState<string | undefined>(undefined)
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [userKey, setUserKey] = useState<string | undefined>(undefined)
  const [workflowName, setWorkflowName] = useState<WorkflowName>(
    WorkflowName.IFRS
  )
  const [runName, setRunName] = useState<string | undefined>(undefined)
  const [runDescription, setRunDescription] = useState<string | undefined>(
    undefined
  )
  const [runs, setRuns] = useState<Run[]>([])
  const [runId, setRunId] = useState<string | undefined>(undefined)
  const [myFile, setMyFile] = useState<File | undefined>(undefined)
  const [fileError, setFileUploadError] = useState<string | undefined>(
    undefined
  )

  function WorkflowSelector() {
    const workflowNames = Object.values(WorkflowName).sort((a, b) => {
      if (a === 'IDI') return 1
      if (b === 'IDI') return -1
      return 0
    })

    return (
      <div className='space-x-4 text-xl text-novablue font-semibold flex items-center flex-row'>
        {workflowNames.map((name) => (
          <label
            key={name}
            className={`bg-white px-2 rounded-lg border border-novablue flex items-center space-x-2 ${
              name === 'IDI'
                ? 'text-blackopac2 border-blackopac2 cursor-not-allowed'
                : ''
            }`}
          >
            <input
              type='radio'
              value={name}
              checked={workflowName === name}
              onChange={() => setWorkflowName(name as WorkflowName)}
              disabled={name === 'IDI'}
            />
            <span>{name === 'IFRS' ? 'IFRS-17' : name}</span>
          </label>
        ))}
      </div>
    )
  }

  const handleUpload = async (file?: File) => {
    setFileUploadError(undefined)
    if (!file) return

    try {
      let newRunId = runId
      if (!newRunId) {
        newRunId = await handleCreateNewRun()
      }

      const fileStructure = 'yield_curves'
      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_structure', fileStructure)

      const res = await fetch(
        `/api/users/${userId}/runs/${newRunId}/inputs?userKey=${encodeURIComponent(
          userKey!
        )}`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!res.ok) {
        // handle HTTP errors (e.g. 400, 500)
        console.error('Upload failed with status:', res.status)
        setFileUploadError('Upload failed')
        setMyFile(undefined)
        return
      }

      const data = await res.json()

      if (!data.success) {
        console.error('API returned unsuccessful result:', data)
        setFileUploadError(`Validation of ${fileStructure} failed`)
        setMyFile(undefined)
        return
      }

      console.log(data.success)
    } catch (err) {
      console.error('Error uploading file:', err)
      setFileUploadError('Unknown error')
      setMyFile(undefined)
    }
    setMyFile(file)
    console.log('File uploaded successfully:', file.name)
  }

  const handleCreateNewRun = async () => {
    const res = await fetch(
      `/api/users/${userId}/runs?userKey=${encodeURIComponent(userKey!)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          runName,
          workflowName,
          description: runDescription
        })
      }
    )

    const data = await res.json()
    console.log(data)
    if (data?.run_id) {
      setRunId(data.run_id)
      return data.run_id
    }
  }

  useEffect(() => {
    const userId = Cookies.get('userId')
    const userKey = Cookies.get('userKey')
    const userName = Cookies.get('userName')

    if (userName) {
      setUserName(userName)
      setUserKey(userKey)
      setUserId(userId)
    }

    try {
      fetch(`/api/users/${userId}/runs?userKey=${userKey}`)
        .then((res) => res.json())
        .then((runs) => {
          if (runs && runs.length > 0) {
            setRuns(runs)
          }
        })
        .catch((e) => {
          console.error(e)
        })
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <>
      {!userName && (
        <div className='xs:text-sm text-base lg:text-2xl mt-7 lg:mt-20 text-black mb-3 lg:mb-10'>
          You must be logged in to run workflows
        </div>
      )}

      {userName && (
        <div className=''>
          <div className='mt-20 mb-10'>
            <p className='font-semibold text-2xl text-novablue'>My dashboard</p>

            {/* <p className='text-base text-blackopac mt-2'>
              Nocavture bla bla Lorem ipsum
            </p> */}
          </div>
          <div className='text-lg text-blackopac mb-3'>
            Create a new project
          </div>

          <div className='flex flex-col p-10 items-center gap-4 border border-titan rounded-lg'>
            <div
              className='items-start w-1/2
'
            >
              <WorkflowSelector />
            </div>

            <input
              type='text'
              placeholder='Enter project name*'
              value={runName}
              onChange={(e) => setRunName(e.target.value)}
              className='text-black border border-gray-300 px-3 py-2 rounded w-1/2'
              maxLength={30}
            />
            <input
              type='text'
              placeholder='Project description'
              value={runDescription}
              onChange={(e) => setRunDescription(e.target.value)}
              className='text-black border border-gray-300 px-3 py-2 rounded w-1/2'
              maxLength={60}
            />

            <div className='w-1/2 flex flex-col gap-2'>
              <button
                disabled={!runName || !workflowName}
                type='button'
                onClick={() => document.getElementById('fileInput')?.click()}
                className='bg-whiteopac2 hover:bg-gray-300 text-black py-2 px-4 rounded border border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Import yield curves*
              </button>
              <input
                id='fileInput'
                type='file'
                accept='.csv'
                onChange={async (e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0]
                    await handleUpload(file)
                  }
                }}
                className='hidden'
              />
              {myFile && (
                <p className='text-black text-sm'>
                  Imported file:{' '}
                  <span className='font-semibold'>{myFile.name}</span>
                </p>
              )}
              {fileError && (
                <p className='text-vividred text-sm'>{fileError}</p>
              )}
            </div>

            <button
              disabled={!runName || !workflowName || !myFile}
              onClick={() => {
                router.push(`/projects/${runId}/uoa`)
              }}
              className='bg-novablue text-white py-2 px-4 rounded hover:bg-blue-700 transition w-1/2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Create new project
            </button>
          </div>

          <div className='text-lg text-blackopac mt-20 mb-3'>
            Previous projects
          </div>
          <div>
            <div className='text-black flex flex-col items-center justify-center border border-titan rounded-lg p-10'>
              {runs && runs.length > 0 ? (
                runs.map((run) => (
                  <div
                    key={run.id}
                    className='bg-white shadow-md rounded-lg p-4 m-2 w-full max-w-md'
                  >
                    <h2 className='text-lg font-semibold'>{run.name}</h2>
                    <p className='text-gray-600'>
                      Workflow: {run.workflow_name}
                    </p>
                    <p className='text-gray-600'>
                      Planned date: {run.planned_date}
                    </p>
                    {run.end_date && (
                      <p className='text-gray-600'>End date: {run.end_date}</p>
                    )}
                    <p className='text-gray-600'>
                      Status: {mapRunStatusToText(run.status)}
                    </p>
                    {run.files && run.files.length > 0 && (
                      <div className='mt-2'>
                        <h3 className='text-md font-semibold'>Files</h3>
                        <ul className='ml-4 text-novablue underline list-inside'>
                          {run.files.map((file) => (
                            <li key={file.name}>
                              <a
                                href={file.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-500 hover:underline'
                              >
                                {file.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className='w-full flex justify-end space-x-2'>
                      {run.status !== RunStatus.SUCCESS && (
                        <button
                          className='border border-novablue text-novablue py-2 px-4 rounded transition mt-4'
                          onClick={() =>
                            router.push(
                              `/projects/${run.id}${mapRunStatusToUrl(
                                run.status
                              )}`
                            )
                          }
                        >
                          Resume project
                        </button>
                      )}
                      {run.status === RunStatus.SUCCESS && (
                        <>
                          <button
                            className='border border-novablue text-novablue py-2 px-4 rounded transition mt-4'
                            onClick={() =>
                              router.push(`/projects/${run.id}/engine`)
                            }
                          >
                            Retry project
                          </button>
                          <button
                            className='bg-novablue text-white py-2 px-4 rounded transition mt-4'
                            onClick={() => router.push(`/projects/${run.id}`)}
                          >
                            View details
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No previous runs found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function mapRunStatusToUrl(status: RunStatus): string {
  switch (status) {
    case RunStatus.UPLOADING_INPUTS:
      return '/uoa'
    case RunStatus.UOA:
      return '/calc-process'
    case RunStatus.CALC_PROCESS:
      return '/report-process'
    case RunStatus.REPORT_PROCESS:
      return '/generator'
    case RunStatus.GENERATOR:
      return '/engine'
    default:
      return ''
  }
}

function mapRunStatusToText(status: RunStatus): string {
  switch (status) {
    case RunStatus.UPLOADING_INPUTS:
      return 'Uploading units of account'
    case RunStatus.UOA:
      return 'Uploading calc process'
    case RunStatus.CALC_PROCESS:
      return 'Uploading report process'
    case RunStatus.REPORT_PROCESS:
      return 'Generating'
    case RunStatus.GENERATOR:
      return 'Running engine'
    case RunStatus.SUCCESS:
      return 'Success'
    case RunStatus.FAILURE:
      return 'Failure'
    default:
      return 'Unknown'
  }
}
