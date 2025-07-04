'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { IFRSCalcProcessInput } from '../../api/services/ifrs.service'

export default function CalcProcessForm({
  runId,
  userId,
  userKey,
  uoaIds
}: {
  runId: string
  userId: string
  userKey: string
  uoaIds: string[]
}) {
  const router = useRouter()

  const emptyFormValues = (): IFRSCalcProcessInput => ({
    calc_process_id: '',
    calc_start_date: '',
    calc_end_date: '',
    calc_freq: '',
    lc_calc_activated: 0,
    lic_calc_activated: 0,
    calc_precision: 0,
    sensitivity_type: '',
    uoa_id: ''
  })

  const [forms, setForms] = useState<IFRSCalcProcessInput[]>([
    emptyFormValues()
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updated = [...forms]
    // @ts-ignore
    updated[index][e.target.name] = e.target.value
    setForms(updated)
  }

  const handleAddForm = () => {
    setForms([...forms, emptyFormValues()])
  }

  const handleRemoveForm = (index: number) => {
    const updated = [...forms]
    updated.splice(index, 1)
    setForms(updated)
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
        calc_start_date: formatDate(f.calc_start_date),
        calc_end_date: formatDate(f.calc_end_date)
      }))

      const res = await fetch(
        `/api/users/${userId}/runs/${runId}/inputs/calc-process?userKey=${userKey}`,
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
            Unit of Account {index + 1}
          </h2>

          <div className='mb-3'>
            <label className='block mb-1 font-medium'>Unit of Account ID</label>
            <input
              type='text'
              name='uoa_id'
              value={form.uoa_id}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            />
          </div>

          <div className='mb-3'>
            <label className='block mb-1 font-medium'>Scenario ID</label>
            <input
              type='text'
              name='scenario_id'
              value={form.scenario_id}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            />
          </div>

          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Initial Recognition Date
            </label>
            <input
              type='date'
              name='uoa_initrecog_date'
              value={form.uoa_initrecog_date}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            />
          </div>

          <div className='mb-3'>
            <label className='block mb-1 font-medium'>Expiry Date</label>
            <input
              type='date'
              name='uoa_expiry_date'
              value={form.uoa_expiry_date}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            />
          </div>

          <div className='mb-3'>
            <label className='block mb-1 font-medium'>Yield Curve</label>
            <select
              name='lkd_yield_curve'
              value={form.lkd_yield_curve}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            >
              <option value=''>Select Yield Curve</option>
              {yieldCurveIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          {forms.length > 1 && (
            <button
              type='button'
              onClick={() => handleRemoveForm(index)}
              className='absolute top-4 right-4 py-2 px-4 rounded text-vividred bg-white border border-vividred'
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        type='button'
        onClick={handleAddForm}
        className='py-2 px-4 rounded self-end text-novablue bg-white border border-novablue'
      >
        ➕ Add more unit of account
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
            Units of Accounts successfully uploaded
          </span>
          <button
            type='button'
            onClick={() => router.push(`calc-process`)}
            className='bg-green text-white py-2 px-4 rounded font-semibold'
          >
            Next Step
          </button>
        </div>
      )}
    </form>
  )
}
