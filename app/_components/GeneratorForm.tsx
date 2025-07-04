'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface IFRSGeneratorResponse {
  run_id: string
  input_structure_errors: string[]
  files: FileFromRun[]
}

export interface FileFromRun {
  name: string
  url: string
  category?: string
}

export interface IFRSEngineFiles {
  name: string
  url: string
}

export interface IFRSEngineDataframes {
  report_process_id: string
  dataframes: IFRSEngineFiles[]
}

export interface IFRSEngineUOA {
  uoa_id: string
  report_process_dataframes: IFRSEngineDataframes[]
}

export interface IFRSEngineResponse {
  run_id: string
  input_structure_errors?: string[] | null
  files?: IFRSEngineUOA[] | null
}

export default function GeneratorForm({
  runId,
  userId,
  userKey
}: {
  runId: string
  userId: string
  userKey: string
}) {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [files, setFiles] = useState<FileFromRun[]>([])
  const [uploadingFile, setUploadingFile] = useState<string | null>(null)

  const [isRunningEngine, setIsRunningEngine] = useState(false)
  const [engineData, setEngineData] = useState<IFRSEngineResponse | null>(null)

  const handleGenerate = async () => {
    setError(undefined)
    setIsSubmitting(true)

    try {
      const res = await fetch(
        `/api/users/${userId}/runs/${runId}/generator?userKey=${encodeURIComponent(
          userKey
        )}`,
        {
          method: 'POST'
        }
      )

      if (!res.ok) {
        setError('Generation failed')
        setIsSubmitting(false)
        return
      }

      const data = await res.json()

      console.log('Generator response:', data)

      if (!data.success) {
        setError('Unexpected API response')
        setIsSubmitting(false)
        return
      }

      setFiles(data.success.files || [])
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError('Unknown error')
    }

    setIsSubmitting(false)
  }

  const handleFileChange = async (file: File, fileStructure: string) => {
    setUploadingFile(fileStructure)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_structure', fileStructure)

      console.log('filestructure', fileStructure)

      const res = await fetch(
        `/api/users/${userId}/runs/${runId}/inputs?userKey=${encodeURIComponent(
          userKey
        )}`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!res.ok) {
        setError('Upload failed')
        setUploadingFile(null)
        return
      }

      const data = await res.json()
      console.log('File upload response:', data)
      if (!data.success) {
        setError('Upload error')
      } else {
        setError(undefined)
      }
    } catch (e) {
      setError('Unknown upload error')
    }

    setUploadingFile(null)
  }

  const handleRunEngine = async () => {
    setError(undefined)
    setIsRunningEngine(true)

    try {
      const res = await fetch(
        `/api/users/${userId}/runs/${runId}/engine?userKey=${encodeURIComponent(
          userKey
        )}`,
        {
          method: 'POST'
        }
      )

      if (!res.ok) {
        setError('Engine run failed')
        setIsRunningEngine(false)
        return
      }

      const data = await res.json()
      console.log('Engine response:', data)
      if (!data || !data.success) {
        setError('Unexpected engine API response')
        setIsRunningEngine(false)
        return
      }

      setEngineData(data.success)
    } catch (err) {
      console.error(err)
      setError('Unknown engine error')
    }

    setIsRunningEngine(false)
  }

  return (
    <div className='flex flex-col items-center w-full'>
      {!success && (
        <button
          onClick={handleGenerate}
          disabled={isSubmitting}
          className='bg-novablue text-white py-2 px-4 rounded mt-10'
        >
          {isSubmitting ? 'Generating...' : 'Generate'}
        </button>
      )}

      {error && <div className='text-vividred mt-6 font-semibold'>{error}</div>}

      {success && (
        <>
          <div className='w-full max-w-3xl mt-8 flex flex-col gap-4'>
            <h2 className='text-xl font-semibold'>Generated Files</h2>

            {files.length === 0 && <p>No files returned by the generator.</p>}

            {files.map((file) => (
              <div
                key={file.url}
                className='border rounded p-4 flex justify-between items-center'
              >
                <div className='flex flex-col'>
                  <span className='font-medium'>{file.name}</span>
                  {file.category && (
                    <span className='text-sm text-gray-600'>
                      Category: {file.category}
                    </span>
                  )}
                  <a
                    href={file.url}
                    download
                    className='text-novablue underline text-sm mt-1'
                  >
                    Download
                  </a>
                </div>
                <div className='flex gap-2 items-center'>
                  <input
                    type='file'
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0], file.name)
                      }
                    }}
                  />
                  {uploadingFile === file.category && (
                    <span className='text-sm text-gray-500'>Uploading...</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-center mt-14 w-full'>
            <button
              type='button'
              onClick={handleRunEngine}
              disabled={isRunningEngine}
              className='bg-green text-white py-2 px-4 rounded font-semibold'
            >
              {isRunningEngine ? 'Running engine...' : 'Run IFRS engine'}
            </button>
          </div>

          {engineData && (
            <div className='w-full max-w-4xl mt-10'>
              <h2 className='text-2xl font-semibold mb-4'>
                IFRS Engine Output
              </h2>

              {engineData.input_structure_errors &&
                engineData.input_structure_errors.length > 0 && (
                  <div className='text-vividred mb-4'>
                    <h3 className='font-bold'>Input Structure Errors:</h3>
                    <ul className='list-disc list-inside'>
                      {engineData.input_structure_errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {engineData.files &&
                engineData.files.map((uoa) => (
                  <div
                    key={uoa.uoa_id}
                    className='mb-8 border rounded p-4 bg-gray-50'
                  >
                    <h3 className='text-lg font-semibold mb-2'>
                      UOA: {uoa.uoa_id}
                    </h3>
                    {uoa.report_process_dataframes.map((rp) => (
                      <div key={rp.report_process_id} className='ml-4 mb-4'>
                        <h4 className='font-medium mb-1'>
                          Report Process: {rp.report_process_id}
                        </h4>
                        <ul className='list-disc list-inside'>
                          {rp.dataframes.map((df) => (
                            <li key={df.url}>
                              <a
                                href={df.url}
                                download
                                className='text-novablue underline'
                              >
                                {df.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
