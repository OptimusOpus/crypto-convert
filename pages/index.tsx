import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react';
import CryptoCalc from '../containers/'


const Home: NextPage = () => {
  return (
    <div className={'bg-grey-400 h-full'}>
      <Head>
      <title>Crypto Converter</title>
        <link rel="icon" href="/calc.ico" />
        <meta name="Crypto unit converter" content="Crypto unit converter" />
      </Head>

      <header className='flex items-center justify-start bg-blue-dark p-4 h-full md:py-12'>
        <h1 className={'mx-auto container p-2 my-4 md:my-8 font-600 text-blue-dark bg-grey-200 rounded text-2xl w-auto'}>
        Crypto Unit Converter
        </h1>
      </header>
      <main className={'p-2 my-8 mx-auto container'}>
        <CryptoCalc />
      </main>

      <footer className='bg-blue-dark p-4 md:py-12 h-full'>
        <div className='mx-auto container p-2 my-4 md:my-16 font-600 text-blue-dark leading-loose bg-grey-200 rounded'>
          <p className='my-4'>
          After using a few similar cryptocurrency unit converting apps I couldn’t find one that had all the cryptos I was working with. I decided to fork  crypto-unit-convert (to ensure base units are always integers) and implement it here for ease of use. 
          </p>
          <p className='my-4'>
          If you find any issues feel free to raise it <a className='text-red hover:underline' href='https://github.com/OptimusOpus/crypto-convert' target='_blank'>here</a>.
          </p>
          Donate to the coffee fund 
          <div className='md:hidden text-sm overflow'> <span className='text-green-dark'>0xc0ffEe</span> 284afC4fdA06cC831e4DA43097146f704D </div>
          <div className='hidden md:flex'> <span className='text-green-dark'>0xc0ffEe</span>284afC4fdA06cC831e4DA43097146f704D </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
