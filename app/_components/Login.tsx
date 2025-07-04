'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

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
            Cookies.set('userKey', userKey, { expires: 30, path: '/' })
            Cookies.set('userId', user.id, { expires: 30, path: '/' })
            Cookies.set('userName', user.name, { expires: 30, path: '/' })
            window.location.href = '/'
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
      <h1 className='text-sm font-semibold text-black'>
        Already have an account?
      </h1>
      <input
        type='password'
        value={userKey}
        onChange={(e) => setUserKey(e.target.value)}
        placeholder='Your private user key'
        className='text-black w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400'
      />
      <button
        type='submit'
        className='w-full bg-blackopac text-white py-2 rounded hover:bg-blue-700 transition'
      >
        Login
      </button>
      {error && <p className='text-vividred'>{error}</p>}
      {!error && (
        <button
          className='text-blackopac2 hover:underline'
          onClick={() => {
            router.push('/contact')
          }}
        >
          Forgot key?
        </button>
      )}
    </form>
  )
}
