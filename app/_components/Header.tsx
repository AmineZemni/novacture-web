'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)

  const switchMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  // @@ts-expect-error
  const handleClickOutside = (event: any) => {
    if (
      menuRef.current &&
      // @ts-expect-error
      !menuRef.current.contains(event.target) &&
      // @ts-expect-error
      !menuButtonRef.current.contains(event.target) // Ignore clicks on menu button
    ) {
      setIsMenuOpen(false)
    }
  }

  const handleScroll = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className='bg-whiteBG'>
      {/* Header with fixed position */}
      <div className={`w-full fixed z-10 bg-novablue`}>
        <header className='flex flex-row w-[90%] lg:w-4/6 items-center justify-between mx-auto h-10 lg:h-12'>
          {/* Mobile Logo on the Right and Desktop Logo */}
          <button
            onClick={() => {
              window.location.href = '/'
            }}
          >
            <img
              src='/logo_rect.png'
              alt='app.novacture.com'
              className='rounded-lg h-24 hover:invert'
            />
          </button>

          {/* Mobile Burger Menu Icon on the Left */}
          <button
            onClick={switchMenu}
            ref={menuButtonRef}
            className='xl:hidden flex flex-col lg:flex-row-reverse items-center text-white'
          >
            <img
              src='/menu.svg'
              className='h-7 lg:h-12 w-7 lg:w-12'
              alt='Ouvrir le menu'
            />
            <span className='text-xs lg:text-base lg:mr-2 -mt-1'>Menu</span>
          </button>

          {/* Desktop Menu Links */}
          <nav className='hidden xl:flex space-x-5'>
            <Link
              className='flex space-x-2 items-center hover:underline'
              href='/dashboard'
            >
              <img src='/gears.svg' className='h-5' />
              <p className='text-sm'>My dashboard</p>
            </Link>
            <Link
              className='flex space-x-2 items-center hover:underline'
              href='/profile'
            >
              <img src='/man.svg' className='h-5' />
              <p className='text-sm'>Profile</p>
            </Link>
          </nav>
        </header>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className='xl:hidden fixed bg-blackopac top-10 w-full text-white z-50 lg:w-4/6 inset-x-0 text-center mx-auto'
        >
          <Link
            className='w-full block px-4 py-2 hover:bg-whiteopac  bg-novablue border-b border-whiteopac flex justify-end'
            onClick={() => {
              setIsMenuOpen(false)
            }}
            href='/dashboard'
          >
            My dashboard
            <img src='/gears.svg' className='h-6 ml-2 mr-1' />
          </Link>
          <Link
            href='/profile'
            className='w-full block px-4 py-2 hover:bg-whiteopac bg-novablue border-b border-whiteopac2 flex justify-end'
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
            <img src='/man.svg' className='h-6 ml-2 mr-1' />
          </Link>
        </div>
      )}

      {/* Bottom Spacer to avoid content overlap */}
      <div className={`mt-10 lg:mt-12`}></div>
    </div>
  )
}
