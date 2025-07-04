'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface IFRSReportProcessInput {
  calc_process_id: string
  report_process_id: string
  reporting_opening_date: string
  reporting_closing_date: string
  prv_report_process_id: string
  prv_yield_curve: string
  crr_yield_curve: string
}

export default function ReportProcessForm({
  runId,
  userId,
  userKey,
  yieldCurveIds,
  calcProcessIds
}: {
  runId: string
  userId: string
  userKey: string
  yieldCurveIds: string[]
  calcProcessIds: string[]
}) {
  const router = useRouter()

  const emptyFormValues = (): IFRSReportProcessInput => ({
    calc_process_id: '',
    report_process_id: '',
    reporting_opening_date: '',
    reporting_closing_date: '',
    prv_report_process_id: '',
    prv_yield_curve: '',
    crr_yield_curve: ''
  })

  const [forms, setForms] = useState<IFRSReportProcessInput[]>([
    emptyFormValues()
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  /** ensure prv_report_process_id is always updated */
  const recalculatePreviousIds = (list: IFRSReportProcessInput[]) => {
    return list.map((f, i) => ({
      ...f,
      prv_report_process_id: i === 0 ? '' : list[i - 1].report_process_id || ''
    }))
  }

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target

    const updated = [...forms]

    if (target instanceof HTMLInputElement) {
      const { name, value, type } = target
      // @ts-ignore
      updated[index][name] = value
    } else if (target instanceof HTMLSelectElement) {
      const { name, value } = target
      // @ts-ignore
      updated[index][name] = value
    }

    setForms(recalculatePreviousIds(updated))
  }

  const handleAddForm = () => {
    const updated = [...forms, emptyFormValues()]
    setForms(recalculatePreviousIds(updated))
  }

  const handleRemoveForm = (index: number) => {
    const updated = [...forms]
    updated.splice(index, 1)
    setForms(recalculatePreviousIds(updated))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const updated = [...forms]
    const temp = updated[index - 1]
    updated[index - 1] = updated[index]
    updated[index] = temp
    setForms(recalculatePreviousIds(updated))
  }

  const moveDown = (index: number) => {
    if (index === forms.length - 1) return
    const updated = [...forms]
    const temp = updated[index + 1]
    updated[index + 1] = updated[index]
    updated[index] = temp
    setForms(recalculatePreviousIds(updated))
  }

  const formatDate = (isoDate: string) => {
    if (!isoDate) return ''
    const [year, month, day] = isoDate.split('-')
    return `${day}/${month}/${year}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    setIsSubmitting(true)

    try {
      const payload = forms.map((f) => ({
        ...f,
        reporting_opening_date: formatDate(f.reporting_opening_date),
        reporting_closing_date: formatDate(f.reporting_closing_date)
      }))

      const res = await fetch(
        `/api/users/${userId}/runs/${runId}/inputs/report-process?userKey=${userKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )
      if (!res.ok) {
        setError('Upload failed')
        setIsSubmitting(false)
        return
      }

      const data = await res.json()
      if (!data.success) {
        setError(`API returned error`)
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('unknown error')
      setIsSubmitting(false)
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6 w-full'>
      {forms.map((form, index) => (
        <div key={index} className='border p-4 rounded bg-gray-50 relative'>
          <h2 className='font-semibold text-lg mb-2'>
            Report Process {index + 1}
          </h2>

          {/* calc_process_id */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Calculation Process
            </label>
            <select
              name='calc_process_id'
              value={form.calc_process_id}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            >
              <option value=''>Select Calculation Process</option>
              {calcProcessIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          {/* report_process_id */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>Report Process ID</label>
            <input
              type='text'
              name='report_process_id'
              value={form.report_process_id}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            />
          </div>

          {/* prv_report_process_id */}
          {index > 0 && (
            <div className='mb-3'>
              <label className='block mb-1 font-medium'>
                Previous Report Process ID
              </label>
              <input
                type='text'
                name='prv_report_process_id'
                value={form.prv_report_process_id}
                disabled
                className='border rounded p-2 w-full bg-gray-100 cursor-not-allowed'
              />
            </div>
          )}

          {/* reporting_opening_date */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Reporting Opening Date
            </label>
            <input
              type='date'
              name='reporting_opening_date'
              value={form.reporting_opening_date}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            />
          </div>

          {/* reporting_closing_date */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Reporting Closing Date
            </label>
            <input
              type='date'
              name='reporting_closing_date'
              value={form.reporting_closing_date}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            />
          </div>

          {/* prv_yield_curve */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Previous Yield Curve
            </label>
            <select
              name='prv_yield_curve'
              value={form.prv_yield_curve}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            >
              <option value=''>Select Previous Yield Curve</option>
              {yieldCurveIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          {/* crr_yield_curve */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Current Yield Curve
            </label>
            <select
              name='crr_yield_curve'
              value={form.crr_yield_curve}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            >
              <option value=''>Select Current Yield Curve</option>
              {yieldCurveIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          <div className='flex gap-2 mt-3'>
            <button
              type='button'
              disabled={index === 0}
              onClick={() => moveUp(index)}
              className='py-2 px-3 rounded border border-gray-400 bg-white disabled:cursor-not-allowed'
            >
              ↑ Move Up
            </button>
            <button
              type='button'
              disabled={index === forms.length - 1}
              onClick={() => moveDown(index)}
              className='py-2 px-3 rounded border border-gray-400 bg-white disabled:cursor-not-allowed'
            >
              ↓ Move Down
            </button>
            {forms.length > 1 && (
              <button
                type='button'
                onClick={() => handleRemoveForm(index)}
                className='py-2 px-3 rounded border border-vividred text-vividred bg-white'
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        type='button'
        onClick={handleAddForm}
        className='py-2 px-4 rounded self-end text-novablue bg-white border border-novablue'
      >
        ➕ Add Report Process
      </button>

      <button
        type='submit'
        disabled={isSubmitting}
        className='bg-novablue text-white py-2 px-4 rounded mt-4'
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>

      {error && (
        <div className='text-vividred flex mt-4 items-center justify-end'>
          <span className='font-semibold'>{error}</span>
        </div>
      )}
      {success && (
        <div className='mt-4 flex items-center gap-4 justify-end'>
          <span className='text-green font-semibold'>
            Report processes successfully uploaded
          </span>
          <button
            type='button'
            onClick={() => router.push(`generator`)}
            className='bg-green text-white py-2 px-4 rounded font-semibold'
          >
            Next Step
          </button>
        </div>
      )}
    </form>
  )
}
