'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [userKey, setUserKey] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      fetch(`/api/users?userKey=${userKey}`)
        .then((res) => res.json())
        .then((user) => {
          if (user && user.id) {
            localStorage.setItem('userKey', userKey)
            localStorage.setItem('userId', user.id)
            localStorage.setItem('userName', user.name)
            alert('Login successful')
            router.push('/dashboard')
          } else setError('Invalid key')
        })
        .catch((e) => {
          setError('An unexpected error occurred.')
        })
    } catch (e) {
      setError('An unexpected error occurred.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md space-y-4'
    >
      <h1 className='text-sm font-semibold text-black'>Enter your user key</h1>
      <input
        type='password'
        value={userKey}
        onChange={(e) => setUserKey(e.target.value)}
        placeholder='Your private user Key'
        className='text-black w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400'
      />
      {error && <p className='text-vividred'>{error}</p>}
      <button
        type='submit'
        className='w-full bg-blackopac text-white py-2 rounded hover:bg-blue-700 transition'
      >
        Login
      </button>
    </form>
  )
}
