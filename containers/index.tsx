import React from 'react';
import Image from 'next/image'

import Dropdown from '../components/Dropdown'
import UnitFeild from '../components/UnitFeild'

import { UnitValue, cryptoOptions, CryptoPrice} from './types'
import { cryptos } from './constants'

type Props = {
    cryptoPrices: CryptoPrice
}



const CryptoCalc = (props: Props ): JSX.Element => {
    const Cryptos: cryptoOptions = cryptos
    const { cryptoPrices } = props

    const [crypto , setCrypto] = React.useState(cryptos['ETH'])
    const cryptoPrice = Math.round(cryptoPrices[crypto.slug.toUpperCase()] * 100) / 100 

    const [validationError, setValidationError] = React.useState({
        unit: "",
        error: "",
    })

    let units = Object.keys(crypto.units)

    let unitValues: UnitValue
    unitValues = {}
    units.forEach(unit => {
        unitValues[unit] = '0';
    })

    const [value, setValue] = React.useState(unitValues)

    const handleCryptoChange = (crypto: string) => {
        const x = Cryptos[crypto]
        setCrypto(Cryptos[crypto])

        let units = Object.keys(Cryptos[crypto].units)

        let unitValues: UnitValue
        unitValues = {}
        units.forEach(unit => {
            unitValues[unit] = '0';
        })

        setValue((prevState) => ({
            ...prevState,
            ...unitValues
        }));

    }

    const handleAmountChange = (amount: string, updatedUnit: string) => {
        units.forEach(unit => {
            if (unit == updatedUnit) {
                setValue((prevState) => ({
                    ...prevState,
                    [unit]: amount,}));
            } else if (unit != updatedUnit && amount != ''){
                // add error check here
                try {
                const newValue = crypto.convertFn(amount, updatedUnit, unit)
                setValue((prevState) => ({
                    ...prevState,
                    [unit]: newValue,}));
                setValidationError((prevState) => ({
                    ...prevState,
                    unit: "",
                    error: "",
                }));
            } catch (e: unknown) {
                let errorMesssage: string;
                if (typeof e === "string") {
                    errorMesssage = e.toUpperCase();
                  } else if (e instanceof Error) {
                      errorMesssage = e.message;
                  }
                  setValidationError((prevState) => ({
                    ...prevState,
                    unit: updatedUnit,
                    error: errorMesssage,
                }));
                }
            }
        })
    }

    let renderedFeilds = units.map(unit => {
        return UnitFeild({unit, value, handleAmountChange, validationError})
    })
    return (
        <div className="overflow-hidden shadow-lg rounded-lg">
          <section className="flex flex-col content-center rounded-t-lg justify-start bg-white border-b border-grey-200 px-4 md:px-6 py-4">
            <div className='flex my-2 font-600 text-blue-darkest text-xl justify-between items-center'>
              <div className='flex items-center'>
                <div className="bg-blue-lightest p-2 rounded-full mr-2">
                  {<Image src={`/icons/${crypto.icon}`} height={28} width={28} alt={crypto.slug}/>}
                </div>
                <span className='font-600'>{crypto.name}</span>
              </div>
              <div className='flex flex-col text-right'>
                <span className="text-sm text-grey-600">Current Price</span>
                <span className='mt-1 text-right text-lg font-600 text-blue-dark'>$ {cryptoPrice} USD</span>
              </div>
            </div>
            <div className='flex justify-between items-center mt-4'>
              <div className="flex my-2">
                {Dropdown({cryptos, crypto, handleCryptoChange})}
              </div>
              <div className="flex flex-col text-right font-500 text-blue-darkest">
                <span className='text-sm text-grey-600'>Converted Value</span>
                <span className='mt-1 text-right text-lg font-600 text-green-light'>
                  $ {Math.round(cryptoPrice * parseFloat(value[units[units.length - 1]]) * 100) / 100} USD
                </span>
              </div>
            </div>
          </section>
          <section className="flex flex-col content-center rounded-b-lg items-center justify-between bg-grey-100 px-4 py-6 md:px-6">
            <div className="w-full mx-auto space-y-4">
              {renderedFeilds}
            </div>
          </section>
        </div>
    )
}

export default CryptoCalc