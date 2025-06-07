import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Units } from 'crypto-units-convert';

import Dropdown from '../components/Dropdown';
import UnitField from '../components/UnitField';

// Updated type imports from ./types
import {
    UnitValue,
    CryptoPrice,
    ValidationError,
    AppSpecificCryptoData, // Use AppSpecificCryptoData from types.ts
    AllCryptosMap          // Use AllCryptosMap from types.ts
} from './types';
import { fetchTop100Cryptos, transformCMCToAppData } from '../services/cmcService'; // AppCrypto import removed

type Props = {
    cryptoPrices: CryptoPrice;
};

// Local type definitions for TransformedCryptoData and AllCryptosMap are removed,
// as they are now imported from ./types.ts.


const CryptoCalc = (props: Props): JSX.Element => {
    const { cryptoPrices } = props;

    const [allCryptosData, setAllCryptosData] = useState<AllCryptosMap>({});
    const [selectedCrypto, setSelectedCrypto] = useState<AppSpecificCryptoData | null>(null); // Use AppSpecificCryptoData
    const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
    const [errorLoadingData, setErrorLoadingData] = useState<string | null>(null);
    const [referenceConversion, setReferenceConversion] = useState<string | null>(null);

    const [validationError, setValidationError] = useState<ValidationError>({
        unit: "",
        error: "",
    });

    useEffect(() => {
        const loadData = async () => {
            setIsDataLoading(true);
            setErrorLoadingData(null);
            try {
                const cmcData = await fetchTop100Cryptos();
                // transformedBaseData is BaseCryptoData[] as per cmcService
                const transformedBaseData = transformCMCToAppData(cmcData);

                const newAllCryptosData: AllCryptosMap = {};
                // crypto is BaseCryptoData here
                transformedBaseData.forEach(baseCrypto => {
                    const symbolUpper = baseCrypto.symbol.toUpperCase();
                    const unitKey = `${baseCrypto.symbol.toLowerCase()}Units`;
                    const convertFnKey = `convert${symbolUpper}`;

                    let unitsData = {};
                    let convertFunction = null;
                    let isSupported = false;

                    if (Units[unitKey] && typeof Units[convertFnKey] === 'function') {
                        unitsData = Units[unitKey];
                        convertFunction = Units[convertFnKey];
                        isSupported = true;
                    }

                    // Construct AppSpecificCryptoData for the state
                    newAllCryptosData[symbolUpper] = { // Type is inferred from AllCryptosMap
                        ...baseCrypto,
                        units: unitsData,
                        convertFn: convertFunction,
                        isSupported: isSupported,
                    };
                });

                setAllCryptosData(newAllCryptosData);

                // Set initial selected crypto
                let initialSelected: AppSpecificCryptoData | null = null; // Use AppSpecificCryptoData
                if (newAllCryptosData['ETH']?.isSupported) {
                    initialSelected = newAllCryptosData['ETH'];
                } else {
                    const supportedCryptos = Object.values(newAllCryptosData).filter(c => c.isSupported);
                    if (supportedCryptos.length > 0) {
                        initialSelected = supportedCryptos[0];
                    } else if (Object.keys(newAllCryptosData).length > 0) {
                        initialSelected = newAllCryptosData[Object.keys(newAllCryptosData)[0]];
                    }
                }
                setSelectedCrypto(initialSelected);

            } catch (error) {
                console.error("Failed to load cryptocurrency data:", error);
                setErrorLoadingData("Failed to load cryptocurrency data. Please try again later.");
            } finally {
                setIsDataLoading(false);
            }
        };

        loadData();
    }, []);
    
    // Calculate crypto price with proper error handling
    const cryptoPrice = selectedCrypto && cryptoPrices[selectedCrypto.slug.toUpperCase()]
        ? Math.round(cryptoPrices[selectedCrypto.slug.toUpperCase()] * 100) / 100
        : 0;
    
    // Get units for the selected crypto
    const units = selectedCrypto ? Object.keys(selectedCrypto.units) : [];
    
    // Initialize unit values using useCallback to avoid recreating on every render
    const initializeUnitValues = useCallback((crypto: AppSpecificCryptoData | null): UnitValue => { // Use AppSpecificCryptoData
        if (!crypto) return {};
        const unitKeys = Object.keys(crypto.units);
        const values: UnitValue = {}
        unitKeys.forEach(unit => {
            values[unit] = '0'
        })
        return values
    }, [])
    
    // State for unit values
    const [value, setValue] = useState<UnitValue>(() => initializeUnitValues(selectedCrypto));

    // Update values when crypto changes
    useEffect(() => {
        setValue(initializeUnitValues(selectedCrypto));

        // Update reference conversion string
        if (selectedCrypto && selectedCrypto.isSupported && selectedCrypto.units && selectedCrypto.convertFn) {
            const unitKeys = Object.keys(selectedCrypto.units);
            if (unitKeys.length >= 2) {
                const largestUnit = unitKeys[0]; // Assuming largest is first
                const smallestUnit = unitKeys[unitKeys.length - 1]; // Assuming smallest is last
                try {
                    // crypto-units-convert convertFn typically takes number for amount
                    const conversionResult = selectedCrypto.convertFn(1, largestUnit, smallestUnit);
                    // Format to a string, handling potential floating point inaccuracies for display
                    const formattedResult = Number(conversionResult).toLocaleString(undefined, { maximumFractionDigits: 8 });

                    setReferenceConversion(`1 ${largestUnit} = ${formattedResult} ${smallestUnit}`);
                } catch (e) {
                    console.error("Error calculating reference conversion:", e);
                    setReferenceConversion("Could not calculate reference conversion.");
                }
            } else {
                setReferenceConversion("Not enough units to show a reference conversion.");
            }
        } else {
            setReferenceConversion(null);
        }

    }, [selectedCrypto, initializeUnitValues]);

    // Handle crypto change
    const handleCryptoChange = useCallback((cryptoSymbol: string) => {
        const newSelectedCrypto = allCryptosData[cryptoSymbol.toUpperCase()];
        if (newSelectedCrypto) {
            setSelectedCrypto(newSelectedCrypto);
            // Reset validation errors when changing crypto
            setValidationError({
                unit: "",
                error: "",
            });
        }
    }, [allCryptosData]);

    // Handle amount change with improved error handling
    const handleAmountChange = useCallback((amount: string, updatedUnit: string) => {
        if (!selectedCrypto || !selectedCrypto.convertFn || Object.keys(selectedCrypto.units).length === 0) {
            // If conversions are not supported, or no units, do nothing or show a message.
            // For now, just update the specific field and don't attempt conversion.
            setValue(prev => ({ ...prev, [updatedUnit]: amount }));
            setValidationError({
                unit: updatedUnit,
                error: "Conversions not supported for this asset.",
            });
            return;
        }

        // Create a new state object to update all units at once
        const newValues: UnitValue = { ...value };
        
        // Update the changed unit
        newValues[updatedUnit] = amount;
        
        // Only attempt conversion if there's a value
        if (amount !== '') {
            try {
                // Update all other units
                units.forEach(unit => {
                    if (unit !== updatedUnit) {
                        // Ensure convertFn is not null before calling
                        if (selectedCrypto.convertFn) {
                           newValues[unit] = selectedCrypto.convertFn(parseFloat(amount), updatedUnit, unit).toString();
                        }
                    }
                });
                
                // Clear any validation errors
                setValidationError({
                    unit: "",
                    error: "",
                });
            } catch (e: unknown) {
                // Handle conversion errors
                let errorMessage = "Conversion error"; // Default message
                
                if (typeof e === "string") {
                    errorMessage = e.toUpperCase();
                } else if (e instanceof Error) {
                    errorMessage = e.message;
                }
                
                setValidationError({
                    unit: updatedUnit,
                    error: errorMessage,
                });
            }
        } else {
            // If the field is empty, set all other fields to 0 or empty string
            units.forEach(unit => {
                if (unit !== updatedUnit) {
                    newValues[unit] = '0'; // Or '' depending on desired behavior
                }
            });
             setValidationError({ unit: "", error: "" }); // Clear error if input is cleared
        }
        
        // Update state once with all changes
        setValue(newValues);
    }, [units, value, selectedCrypto]);

    // Memoize the rendered fields to avoid unnecessary re-renders
    const renderedFields = React.useMemo(() => {
        if (!selectedCrypto || !selectedCrypto.isSupported || units.length === 0) {
            return (
                <div className="text-center text-gray-500 py-4">
                    Conversions not supported for {selectedCrypto?.name || 'this asset'}.
                </div>
            );
        }
        return units.map(unit => (
            <UnitField 
                key={unit}
                unit={unit}
                value={value}
                handleAmountChange={handleAmountChange}
                validationError={validationError}
                disabled={!selectedCrypto.isSupported} // Disable field if not supported
            />
        ));
    }, [units, value, handleAmountChange, validationError, selectedCrypto]);

    if (isDataLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg">Loading cryptocurrency data...</p>
                {/* You could add a spinner icon here */}
            </div>
        );
    }

    if (errorLoadingData) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg text-red-500">{errorLoadingData}</p>
            </div>
        );
    }

    if (!selectedCrypto) {
         return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg text-gray-500">No cryptocurrency data available or selected.</p>
            </div>
        );
    }

    // Prepare crypto options for the dropdown
    const dropdownOptions = Object.values(allCryptosData).map(c => ({
        name: c.name,
        symbol: c.symbol,
        icon: c.icon, // Assuming icon is part of TransformedCryptoData
        slug: c.slug, // Assuming slug is part of TransformedCryptoData
    }));


    return (
        <div className="overflow-hidden shadow-lg rounded-lg">
          <section className="flex flex-col content-center rounded-t-lg justify-start bg-white border-b border-grey-200 px-4 md:px-6 py-4">
            <div className='flex my-2 font-600 text-blue-darkest text-xl justify-between items-center'>
              <div className='flex items-center'>
                <div className="bg-blue-lightest p-2 rounded-full mr-2">
                  {/* Ensure selectedCrypto.icon is valid. Use a default if necessary. */}
                  {selectedCrypto.icon && <Image src={`/icons/${selectedCrypto.icon}`} height={28} width={28} alt={selectedCrypto.slug}/>}
                </div>
                <span className='font-600'>{selectedCrypto.name}</span>
              </div>
              <div className='flex flex-col text-right'>
                <span className="text-sm text-grey-600">Current Price</span>
                <span className='mt-1 text-right text-lg font-600 text-blue-dark'>$ {cryptoPrice.toFixed(2)} USD</span>
              </div>
            </div>
            <div className='flex justify-between items-center mt-4'>
              <div className="flex flex-col my-2"> {/* Changed to flex-col to stack dropdown and reference */}
                <Dropdown
                    cryptos={dropdownOptions} // Pass transformed data
                    selectedCryptoSymbol={selectedCrypto.symbol}
                    handleCryptoChange={handleCryptoChange}
                />
                {selectedCrypto && selectedCrypto.isSupported && referenceConversion && (
                  <div className="text-xs text-gray-500 mt-2 pl-1"> {/* Adjusted styling and margin */}
                    {referenceConversion}
                  </div>
                )}
              </div>
              <div className="flex flex-col text-right font-500 text-blue-darkest">
                <span className='text-sm text-grey-600'>Converted Value</span>
                <span className='mt-1 text-right text-lg font-600 text-green-light'>
                  $ {selectedCrypto.isSupported && units.length > 0 ? (Math.round(cryptoPrice * (parseFloat(value[units[units.length - 1]]) || 0) * 100) / 100).toFixed(2) : '0.00'} USD
                </span>
              </div>
            </div>
          </section>
          <section className="flex flex-col content-center rounded-b-lg items-center justify-between bg-grey-100 px-4 py-6 md:px-6">
            <div className="w-full mx-auto space-y-4">
              {renderedFields}
            </div>
            {!selectedCrypto.isSupported && units.length > 0 && (
                 <p className="text-sm text-orange-500 mt-2 text-center">
                    Note: Unit conversions are not available for {selectedCrypto.name}. Values shown are for display only.
                 </p>
            )}
          </section>
        </div>
    );
};

export default CryptoCalc;