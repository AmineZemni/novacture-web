'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import Login from './Login'
import Dashboard from './Dashboard'

export default function HomeClient() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const userKey = Cookies.get('userKey')
    setUserIsLoggedIn(!!userKey)
  }, [])

  if (userIsLoggedIn === null) {
    return null // Or a spinner
  }

  return (
    <>
      {!userIsLoggedIn && (
        <>
          <div className='flex flex-col space-y-6 items-center text-center xs:text-sm text-base lg:text-2xl mt-7 lg:mt-20 text-black mb-3 lg:mb-10'>
            <p>Novacture Cloud based Actuary Solution</p>
            <Link
              className='text-base text-white bg-novablue p-2 px-4 w-2/7 rounded-lg hover:bg-opacity-80 transition'
              href='/contact'
            >
              Contact our team to get access
            </Link>
          </div>

          <Login />
        </>
      )}

      {userIsLoggedIn && (
        <>
          <Dashboard />
        </>
      )}
    </>
  )
}
