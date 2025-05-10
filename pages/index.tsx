import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'

import React from 'react';
import CryptoCalc from '../containers/'
import { CryptoPrice } from '../containers/types'
import { cryptos } from '../containers/constants'

const cryptoSymbols = Object.keys(cryptos)

export const getServerSideProps: GetServerSideProps = async () => {
    // This is bad practice but this is just for fun and worst case is someone abuses the endpoint and we get limited
    const headers = {'X-CMC_PRO_API_KEY': 'bd9f56fe-0681-45ba-8585-bfcc7610ad43'}
    const res = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${cryptoSymbols}`,
      {
        method: 'GET',
        headers,
      }
    )
    let prices = {}
    if (res.ok) {
        prices = await res.json()
      } else {
        console.log('failed CMC call')
      }
        
    return {
        props: {
            prices,
        },
    }
}

const Home: NextPage = ({ prices }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  let cryptoPrices: CryptoPrice
  cryptoPrices = {}
  cryptoSymbols.forEach((symbol: string) => {
      cryptoPrices[symbol]= prices.data[symbol].quote.USD.price;
  })
  return (
    <div className={'bg-grey-100 min-h-screen flex flex-col'}>
      <Head>
      <title>Crypto Converter</title>
        <link rel="icon" href="/calc.ico" />
        <meta name="Crypto unit converter" content="Crypto unit converter" />
      </Head>

      <header className='flex items-center justify-start bg-blue-dark p-4 md:py-6 shadow-lg'>
        <h1 className={'mx-auto container p-3 my-4 font-600 text-blue-darkest bg-white rounded-lg shadow-sm text-2xl w-auto text-center'}>
          Crypto Unit Converter
        </h1>
      </header>
      <main className={'p-4 my-8 mx-auto container max-w-3xl flex-grow'}>
        <CryptoCalc cryptoPrices={cryptoPrices}/>
      </main>

      <footer className='bg-blue-dark p-4 md:py-8 shadow-inner'>
        <div className='mx-auto container max-w-3xl p-4 my-4 font-400 text-grey-700 leading-relaxed bg-white rounded-lg shadow-sm'>
          <p className='my-3 text-sm'>
            After using a few similar cryptocurrency unit converting apps I couldn't find one that had all the cryptos I was working with. I decided to fork crypto-unit-convert (to ensure base units are always integers) and implement it here for ease of use.
          </p>
          <p className='my-3 text-sm'>
            If you find any issues feel free to raise it <a className='text-blue hover:text-blue-dark transition-colors duration-200 hover:underline' href='https://github.com/OptimusOpus/crypto-convert' target='_blank' rel='noopener noreferrer'>here</a>.
          </p>
          <div className='mt-6 pt-4 border-t border-grey-200'>
            <p className='text-sm font-600 text-grey-600'>Donate to the coffee fund:</p>
            <div className='md:hidden text-xs overflow-hidden text-grey-600 mt-1'> 
              <span className='text-orange-dark font-mono'>0xc0ffEe</span>284afC4fdA06cC831e4DA43097146f704D 
            </div>
            <div className='hidden md:block text-sm text-grey-600 font-mono mt-1'> 
              <span className='text-orange-dark'>0xc0ffEe</span>284afC4fdA06cC831e4DA43097146f704D 
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
