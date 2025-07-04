export default async function Home() {
  return (
    <>
      <div className='flex flex-col space-y-10 items-center text-center xs:text-sm text-base lg:text-2xl mt-7 lg:mt-20 text-black mb-3 lg:mb-10'>
        <p>Contact form coming soon..</p>
        <p className='text-base'>
          Contact{' '}
          <a
            href='mailto:amine.zemni@novacture.com'
            className='underline italic'
          >
            amine.zemni@novacture.com
          </a>{' '}
          for any question or access
        </p>
      </div>
    </>
  )
}
