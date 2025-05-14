import Login from './_components/Login'

export default async function Home() {
  return (
    <>
      <div className='text-center xs:text-sm text-base lg:text-2xl mt-7 lg:mt-20 text-black mb-3 lg:mb-10'>
        Novacture tool - Login required
      </div>

      <Login />
    </>
  )
}
