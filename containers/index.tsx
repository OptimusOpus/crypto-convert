import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image'

import Dropdown from '../components/Dropdown'
import UnitField from '../components/UnitField'

import { UnitValue, cryptoOptions, CryptoPrice, ValidationError } from './types'
import { cryptos } from './constants'

type Props = {
    cryptoPrices: CryptoPrice
}



const CryptoCalc = (props: Props): JSX.Element => {
    const Cryptos: cryptoOptions = cryptos
    const { cryptoPrices } = props

    const [selectedCrypto, setSelectedCrypto] = useState(cryptos['ETH'])
    const [validationError, setValidationError] = useState<ValidationError>({
        unit: "",
        error: "",
    })
    
    // Calculate crypto price with proper error handling
    const cryptoPrice = cryptoPrices[selectedCrypto.slug.toUpperCase()] 
        ? Math.round(cryptoPrices[selectedCrypto.slug.toUpperCase()] * 100) / 100 
        : 0
    
    // Get units for the selected crypto
    const units = Object.keys(selectedCrypto.units)
    
    // Initialize unit values using useCallback to avoid recreating on every render
    const initializeUnitValues = useCallback((crypto: typeof selectedCrypto): UnitValue => {
        const unitKeys = Object.keys(crypto.units)
        const values: UnitValue = {}
        unitKeys.forEach(unit => {
            values[unit] = '0'
        })
        return values
    }, [])
    
    // State for unit values
    const [value, setValue] = useState<UnitValue>(() => initializeUnitValues(selectedCrypto))

    // Update values when crypto changes
    useEffect(() => {
        setValue(initializeUnitValues(selectedCrypto))
    }, [selectedCrypto, initializeUnitValues])

    // Handle crypto change
    const handleCryptoChange = useCallback((crypto: string) => {
        if (Cryptos[crypto]) {
            setSelectedCrypto(Cryptos[crypto])
            // Reset validation errors when changing crypto
            setValidationError({
                unit: "",
                error: "",
            })
        }
    }, [Cryptos])

    // Handle amount change with improved error handling
    const handleAmountChange = useCallback((amount: string, updatedUnit: string) => {
        // Create a new state object to update all units at once
        const newValues: UnitValue = { ...value }
        
        // Update the changed unit
        newValues[updatedUnit] = amount
        
        // Only attempt conversion if there's a value
        if (amount !== '') {
            try {
                // Update all other units
                units.forEach(unit => {
                    if (unit !== updatedUnit) {
                        newValues[unit] = selectedCrypto.convertFn(amount, updatedUnit, unit)
                    }
                })
                
                // Clear any validation errors
                setValidationError({
                    unit: "",
                    error: "",
                })
            } catch (e: unknown) {
                // Handle conversion errors
                let errorMessage = "Unknown error occurred"
                
                if (typeof e === "string") {
                    errorMessage = e.toUpperCase()
                } else if (e instanceof Error) {
                    errorMessage = e.message
                }
                
                setValidationError({
                    unit: updatedUnit,
                    error: errorMessage,
                })
            }
        } else {
            // If the field is empty, set all other fields to 0
            units.forEach(unit => {
                if (unit !== updatedUnit) {
                    newValues[unit] = '0'
                }
            })
        }
        
        // Update state once with all changes
        setValue(newValues)
    }, [units, value, selectedCrypto])

    // Memoize the rendered fields to avoid unnecessary re-renders
    const renderedFields = React.useMemo(() => {
        return units.map(unit => (
            <UnitField 
                key={unit}
                unit={unit}
                value={value}
                handleAmountChange={handleAmountChange}
                validationError={validationError}
            />
        ))
    }, [units, value, handleAmountChange, validationError])
    return (
        <div className="overflow-hidden shadow-lg rounded-lg">
          <section className="flex flex-col content-center rounded-t-lg justify-start bg-white border-b border-grey-200 px-4 md:px-6 py-4">
            <div className='flex my-2 font-600 text-blue-darkest text-xl justify-between items-center'>
              <div className='flex items-center'>
                <div className="bg-blue-lightest p-2 rounded-full mr-2">
                  {<Image src={`/icons/${selectedCrypto.icon}`} height={28} width={28} alt={selectedCrypto.slug}/>}
                </div>
                <span className='font-600'>{selectedCrypto.name}</span>
              </div>
              <div className='flex flex-col text-right'>
                <span className="text-sm text-grey-600">Current Price</span>
                <span className='mt-1 text-right text-lg font-600 text-blue-dark'>$ {cryptoPrice} USD</span>
              </div>
            </div>
            <div className='flex justify-between items-center mt-4'>
              <div className="flex my-2">
                <Dropdown cryptos={cryptos} crypto={selectedCrypto} handleCryptoChange={handleCryptoChange} />
              </div>
              <div className="flex flex-col text-right font-500 text-blue-darkest">
                <span className='text-sm text-grey-600'>Converted Value</span>
                <span className='mt-1 text-right text-lg font-600 text-green-light'>
                  $ {Math.round(cryptoPrice * (parseFloat(value[units[units.length - 1]]) || 0) * 100) / 100} USD
                </span>
              </div>
            </div>
          </section>
          <section className="flex flex-col content-center rounded-b-lg items-center justify-between bg-grey-100 px-4 py-6 md:px-6">
            <div className="w-full mx-auto space-y-4">
              {renderedFields}
            </div>
          </section>
        </div>
    )
}

export default CryptoCalc