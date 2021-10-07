import React from 'react';
import Image from 'next/image'

import Dropdown from '../components/Dropdown'
import UnitFeild from '../components/UnitFeild'

import { cryptos, UnitValue } from './constants'


const CryptoCalc = (): JSX.Element => {

    const [crypto , setCrypto] = React.useState(cryptos['ETH'])

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
        setCrypto(cryptos[crypto])

        let units = Object.keys(cryptos[crypto].units)

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
        <div className='flex my-4 font-600 text-blue-dark text-xl items-center'>
          {<Image src={`/icons/${crypto.icon}`} height={24} width={24} alt={crypto.slug}/>}
          <span className='p-2'>{crypto.name}</span>
          </div>
          <div className="flex justify-start container mx-auto my-4">
          {Dropdown({cryptos, crypto, handleCryptoChange})}
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