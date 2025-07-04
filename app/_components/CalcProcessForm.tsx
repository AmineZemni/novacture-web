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
    const target = e.target

    const updated = [...forms]

    if (target instanceof HTMLInputElement) {
      const { name, value, type, checked } = target
      if (type === 'checkbox') {
        // @ts-ignore
        updated[index][name] = checked ? 1 : 0
      } else if (type === 'number' || type === 'range') {
        // @ts-ignore
        updated[index][name] = Number(value)
      } else {
        // @ts-ignore
        updated[index][name] = value
      }
    } else if (target instanceof HTMLSelectElement) {
      const { name, value } = target
      // @ts-ignore
      updated[index][name] = value
    }

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
            Calculation Process {index + 1}
          </h2>

          {/* calc_process_id */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Calculation Process ID
            </label>
            <input
              type='text'
              name='calc_process_id'
              value={form.calc_process_id}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            />
          </div>

          {/* uoa_id */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>Unit of Account ID</label>
            <select
              name='uoa_id'
              value={form.uoa_id}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            >
              <option value=''>Select UoA</option>
              {uoaIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          {/* calc_start_date */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Calculation Start Date
            </label>
            <input
              type='date'
              name='calc_start_date'
              value={form.calc_start_date}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            />
          </div>

          {/* calc_end_date */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Calculation End Date
            </label>
            <input
              type='date'
              name='calc_end_date'
              value={form.calc_end_date}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            />
          </div>

          {/* calc_freq dropdown */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Calculation Frequency
            </label>
            <select
              name='calc_freq'
              value={form.calc_freq}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
              required
            >
              <option value=''>Select Frequency</option>
              <option value='m'>Monthly</option>
              <option value='q'>Quarterly</option>
              <option value='y'>Yearly</option>
            </select>
          </div>

          {/* lc_calc_activated */}
          <div className='mb-3 flex items-center gap-2'>
            <input
              type='checkbox'
              name='lc_calc_activated'
              checked={form.lc_calc_activated === 1}
              onChange={(e) => handleChange(index, e)}
              className='border rounded'
            />
            <label className='font-medium'>LC Calculation Activated</label>
          </div>

          {/* lic_calc_activated */}
          <div className='mb-3 flex items-center gap-2'>
            <input
              type='checkbox'
              name='lic_calc_activated'
              checked={form.lic_calc_activated === 1}
              onChange={(e) => handleChange(index, e)}
              className='border rounded'
            />
            <label className='font-medium'>LIC Calculation Activated</label>
          </div>

          {/* calc_precision slider */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>
              Calculation Precision ({form.calc_precision}%)
            </label>
            <input
              type='range'
              name='calc_precision'
              min={0}
              max={100}
              step={1}
              value={form.calc_precision}
              onChange={(e) => handleChange(index, e)}
              className='w-full'
            />
          </div>

          {/* sensitivity_type */}
          <div className='mb-3'>
            <label className='block mb-1 font-medium'>Sensitivity Type</label>
            <input
              type='text'
              name='sensitivity_type'
              value={form.sensitivity_type}
              onChange={(e) => handleChange(index, e)}
              className='border rounded p-2 w-full'
            />
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
        ➕ Add more calculation process
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
            Calculation processes successfully uploaded
          </span>
          <button
            type='button'
            onClick={() => router.push(`report-process`)}
            className='bg-green text-white py-2 px-4 rounded font-semibold'
          >
            Next Step
          </button>
        </div>
      )}
    </form>
  )
}
