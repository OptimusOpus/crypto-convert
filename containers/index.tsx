import React from 'react';
import Image from 'next/image'

import Dropdown from '../components/Dropdown'
import UnitFeild from '../components/UnitFeild'

import { cryptos } from './constants'

// Types

//////////////////////////////
type UnitValue = {
    [key: string]: string;
};

type Crypto = {
    name: string,
    slug: string,
    units: any,
    convertFn: any,
    icon: string,
};

type cryptoOptions = {
    [key: string]: Crypto
};

//This is a dup
type CryptoPrice = {
    [key: string]: number;
};

type Props = {
    cryptoPrices: CryptoPrice
}
//////////////////////////////



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
        <>
        <section className="flex flex-col content-center rounded-t justify-start bg-grey-200 px-2 md:px-4 h-18">
        <div className='flex my-4 font-600 text-blue-dark text-xl  justify-between'>
          <div className='flex items-center'>
            {<Image src={`/icons/${crypto.icon}`} height={24} width={24} alt={crypto.slug}/>}
            <span className='p-2'>{crypto.name}</span>
          </div>
          <div className='flex flex-col text-right'>
              <span>Current Price</span>
              <span className='mt-1 text-right text-md'>~ ${cryptoPrice} USD</span>
          </div>
          </div>
          <div className='flex'>
          <div className="flex container  my-4">
          {Dropdown({cryptos, crypto, handleCryptoChange})}
          </div>
          <div className="flex flex-col text-right font-500">
            <span className=''>Converted</span>
            <span className='mt-1 text-right'>
                ~ ${Math.round(cryptoPrice * parseFloat(value[units[units.length - 1]])  * 100) / 100} USD
            </span>
          </div>
          </div>
        </section>
        <section className="flex flex-col content-center rounded-b items-center justify-between bg-grey-200 px-2 h-full md:px-4">
          <div className="justify-evenly container mx-auto my-4">
            {renderedFeilds}
          </div>
        </section>
      </>
    )
}

export default CryptoCalc