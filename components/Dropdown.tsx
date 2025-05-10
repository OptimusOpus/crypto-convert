import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useCallback } from 'react';
import Image from 'next/image'
import { Crypto, cryptoOptions } from '../containers/types'

type Props = {
    cryptos: cryptoOptions;
    crypto: Crypto;
    handleCryptoChange: (crypto: string) => void;
}

function Dropdown({ cryptos, crypto, handleCryptoChange }: Props) {
    const cryptoKeys = Object.keys(cryptos)
    
    // Memoize dropdown items to prevent unnecessary re-renders
    const renderDropdownItem = useCallback((cryptoKey: string, index: number) => {
        const currentCrypto = cryptos[cryptoKey]
        return (
            <Menu.Item key={currentCrypto.name}>
                {({ active }) => (
                    <button
                        type="button"
                        className={`${active 
                            ? 'bg-blue-lightest text-blue-dark' 
                            : 'text-grey-700'} 
                            flex items-center w-full px-4 py-2 text-sm rounded-md cursor-pointer transition-colors duration-150`}
                        onClick={() => handleCryptoChange(cryptoKey)}
                    >
                        <div className="mr-2">
                            <Image 
                                src={`/icons/${currentCrypto.icon}`} 
                                height={18} 
                                width={18} 
                                alt={currentCrypto.slug} 
                            />
                        </div>
                        <span>{currentCrypto.name}</span>
                    </button>
                )}
            </Menu.Item>
        )
    }, [cryptos, handleCryptoChange])
    
    const dropdownItems = cryptoKeys.map(renderDropdownItem)

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-blue-light bg-white px-4 py-2 text-sm font-600 text-blue-dark shadow-sm hover:bg-blue-lightest focus:outline-none focus:ring-2 focus:ring-blue transition-colors duration-200">
                    Change Crypto
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
                <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {dropdownItems}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default Dropdown