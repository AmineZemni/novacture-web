import Link from 'next/link'

export default async function NotFoundPage() {
  return (
    <>
      <div className='text-black mx-auto w-full flex flex-col items-center justify-around text-xl lg:text-2xl mt-[6rem]'>
        <img src='/lost.svg' alt='Non trouvé(e)' className='max-h-96' />
        <p>Page not found</p>
        <Link
          href='/'
          className='bg-white p-2 shadow px-8 rounded-xl mt-6 text-white italic text-base'
        >
          <img src='/logo.png' alt='' className='h-20' />
        </Link>
        <span className='text-blackopac2 italic text-sm mt-4'>
          Back to home page
        </span>
      </div>
    </>
  )
}
