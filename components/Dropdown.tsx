import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useCallback } from 'react';
import Image from 'next/image';
import { BaseCryptoData } from '../containers/types'; // Import BaseCryptoData

// Define the expected shape of a crypto object for the dropdown props
// It's a subset of BaseCryptoData
type DropdownCryptoProps = Pick<BaseCryptoData, 'name' | 'symbol' | 'icon' | 'slug'>;

type Props = {
    cryptos: DropdownCryptoProps[]; // Now an array of DropdownCryptoProps
    selectedCryptoSymbol: string; // To indicate which one is currently selected (optional, for styling)
    handleCryptoChange: (cryptoSymbol: string) => void;
};

function Dropdown({ cryptos, selectedCryptoSymbol, handleCryptoChange }: Props) {
    // Memoize dropdown items to prevent unnecessary re-renders
    const renderDropdownItem = useCallback((currentCrypto: DropdownCryptoProps) => {
        return (
            <Menu.Item key={currentCrypto.symbol}>
                {({ active }) => (
                    <button
                        type="button"
                        className={`${active 
                            ? 'bg-blue-lightest text-blue-dark' 
                            : 'text-grey-700'} 
                            ${currentCrypto.symbol === selectedCryptoSymbol ? 'font-semibold' : ''}
                            flex items-center w-full px-4 py-2 text-sm rounded-md cursor-pointer transition-colors duration-150`}
                        onClick={() => handleCryptoChange(currentCrypto.symbol)}
                    >
                        <div className="mr-2">
                            {/* Assuming icon path is still /icons/symbol.svg or similar */}
                            <Image 
                                src={`/icons/${currentCrypto.icon}`} 
                                height={18} 
                                width={18} 
                                alt={currentCrypto.slug} 
                            />
                        </div>
                        <span>{currentCrypto.name} ({currentCrypto.symbol})</span>
                    </button>
                )}
            </Menu.Item>
        );
    }, [handleCryptoChange, selectedCryptoSymbol]);
    
    const dropdownItems = cryptos.map(renderDropdownItem);

    return (
        <Menu as="div" className="relative inline-block text-left z-20"> {/* Added z-20 for potential overlap issues */}
            <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-blue-light bg-white px-4 py-2 text-sm font-600 text-blue-dark shadow-sm hover:bg-blue-lightest focus:outline-none focus:ring-2 focus:ring-blue transition-colors duration-200">
                    Change Asset
                    {/* Icon can be dynamic based on selectedCryptoSymbol if needed, or generic */}
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute left-0 mt-2 w-64 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto"> {/* Increased width, added max-height and overflow */}
                    <div className="py-1">
                        {dropdownItems.length > 0 ? dropdownItems : <p className="text-center text-gray-500 py-2">No assets available.</p>}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}

export default Dropdown;