import type { NextPage } from 'next'
import Head from 'next/head'
import CryptoCalc from '../containers/'
import EllipsisText from "react-ellipsis-text";


const Home: NextPage = () => {
  return (
    <div className={'bg-grey-400 h-screen'}>
      <Head>
      <title>Crypto Converter</title>
        <link rel="icon" href="/calc.ico" />
        <meta name="Crypto unit converter" content="Crypto unit converter" />
      </Head>

      <header className='flex items-center bg-blue-dark p-4 h-36'>
        <h1 className={'mx-auto container p-2 my-2 font-600 text-blue-light text-2xl'}>
        Crypto Unit Converter
        </h1>
    </header>
      <main className={'p-2 my-8 mx-auto container'}>
        <CryptoCalc />
      </main>

      <footer className='bg-blue-dark p-2 h-full'>
        <div className='mx-auto container p-2 my-4 font-600 text-blue-light'>
          Donate to the coffee fund 
          <EllipsisText className='md:hidden' text={' 0xc0ffEe284afC4fdA06cC831e4DA43097146f704D'} length={32} />
          <div className='hidden md:flex'> <span className='text-green-dark'>0xc0ffEe</span>284afC4fdA06cC831e4DA43097146f704D </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
