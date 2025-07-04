export default function Footer() {
  return (
    <div className=''>
      <footer className='flex flex-col justify-around items-center mt-1 lg:mt-2 text-xs lg:text-base text-white'>
        <p className=''>Copyright Novacture - 2025</p>
        <a className='underline' href='/contact'>
          Contact us
        </a>

        <div className='flex flex-row space-x-2 m-2 lg:m-4'>
          <a
            href='https://www.linkedin.com/company/novacture'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='/linkedin.svg'
              alt='Linkedin'
              className='h-5 w-5 hover:text-white hover:filter hover:brightness-50 '
            />
          </a>
        </div>
      </footer>
    </div>
  )
}
