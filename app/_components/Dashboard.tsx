'use client'

import { useEffect, useState } from 'react'
import { Run } from '../../api/services/runs.service'

export default function Dashboard() {
  const [userName, setUserName] = useState('')
  const [runName, setRunName] = useState<string | undefined>(undefined)
  const [runs, setRuns] = useState<Run[]>([])

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const userKey = localStorage.getItem('userKey')
    const storedUserName = localStorage.getItem('userName')

    if (storedUserName) {
      setUserName(storedUserName)
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
      {userName && (
        <div className='text-center xs:text-sm text-base lg:text-2xl mt-7 lg:mt-20 text-black mb-3 lg:mb-10'>
          Welcome {userName}
        </div>
      )}
      {!userName && (
        <div className='text-center xs:text-sm text-base lg:text-2xl mt-7 lg:mt-20 text-black mb-3 lg:mb-10'>
          You must be logged in to run workflows
        </div>
      )}

      <div className='flex flex-col items-center gap-4'>
        <input
          type='text'
          placeholder='Enter run name'
          value={runName}
          onChange={(e) => setRunName(e.target.value)}
          className='text-black border border-gray-300 px-3 py-2 rounded w-64'
        />

        <button
          disabled={!runName || !userName}
          onClick={async () => {
            const userId = localStorage.getItem('userId')
            const userKey = localStorage.getItem('userKey')

            try {
              await fetch(`/api/users/${userId}/runs/idi?userKey=${userKey}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ runName })
              })

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
            } catch (e) {
              console.error(e)
            }
          }}
          className='bg-blackopac text-white py-2 px-4 rounded hover:bg-blue-700 transition w-64 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Run IDI workflow
        </button>
      </div>

      <div>
        <p className='text-center xs:text-sm text-base lg:text-2xl mt-7 lg:mt-20 text-black mb-3 lg:mb-10'></p>
        <div className='text-black flex flex-col items-center justify-center'>
          {runs && runs.length > 0 ? (
            runs.map((run) => (
              <div
                key={run.id}
                className='bg-white shadow-md rounded-lg p-4 m-2 w-full max-w-md'
              >
                <h2 className='text-lg font-semibold'>{run.name}</h2>
                <p className='text-gray-600'>Workflow: {run.workflow_name}</p>
                <p className='text-gray-600'>
                  Planned date: {run.planned_date}
                </p>
                {run.end_date && (
                  <p className='text-gray-600'>End date: {run.end_date}</p>
                )}
                <p className='text-gray-600'>Status: {run.status}</p>
                {run.files && run.files.length > 0 && (
                  <div className='mt-2'>
                    <h3 className='text-md font-semibold'>Outputs:</h3>
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
              </div>
            ))
          ) : (
            <p>No previous runs found.</p>
          )}
        </div>
      </div>
    </>
  )
}
