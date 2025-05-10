import type { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'

import React, { useState, useEffect } from 'react';
import CryptoCalc from '../containers/'
import { CryptoPrice } from '../containers/types'
import { cryptos } from '../containers/constants'

const cryptoSymbols = Object.keys(cryptos)

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        // This is bad practice but this is just for fun and worst case is someone abuses the endpoint and we get limited
        const headers = {'X-CMC_PRO_API_KEY': 'bd9f56fe-0681-45ba-8585-bfcc7610ad43'}
        const res = await fetch(
          `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${cryptoSymbols}`,
          {
            method: 'GET',
            headers,
          }
        )
        
        if (res.ok) {
            const prices = await res.json()
            return {
                props: {
                    prices,
                    error: null,
                },
            }
        } else {
            console.error('Failed to fetch crypto prices:', res.status, res.statusText)
            return {
                props: {
                    prices: {},
                    error: `API Error: ${res.status} ${res.statusText}`,
                },
            }
        }
    } catch (error) {
        console.error('Error fetching crypto prices:', error)
        return {
            props: {
                prices: {},
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            },
        }
    }
}

const Home: NextPage = ({ prices, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(error)
  
  useEffect(() => {
    setLoading(true)
    try {
      if (prices && prices.data) {
        const formattedPrices: CryptoPrice = {}
        cryptoSymbols.forEach((symbol: string) => {
          if (prices.data[symbol] && prices.data[symbol].quote && prices.data[symbol].quote.USD) {
            formattedPrices[symbol] = prices.data[symbol].quote.USD.price
          } else {
            // Use fallback price if API data is incomplete
            formattedPrices[symbol] = 0
            console.warn(`Missing price data for ${symbol}`)
          }
        })
        setCryptoPrices(formattedPrices)
        setErrorMessage(null)
      } else if (error) {
        setErrorMessage(error)
      }
    } catch (err) {
      console.error('Error processing price data:', err)
      setErrorMessage('Error processing price data')
    } finally {
      setLoading(false)
    }
  }, [prices, error])
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
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-dark mx-auto mb-4"></div>
              <p className="text-blue-dark font-600">Loading crypto prices...</p>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="bg-red-lightest border-l-4 border-red text-red-dark p-6 rounded-lg shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-600 mb-2">Error Loading Prices</h3>
                <p>{errorMessage}</p>
                <p className="mt-4">Using fallback values for calculations.</p>
              </div>
            </div>
          </div>
        ) : null}
        
        <div className={`${loading || errorMessage ? 'mt-6' : ''}`}>
          <CryptoCalc cryptoPrices={cryptoPrices}/>
        </div>
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
