import { Menu, Transition } from '@headlessui/react'
import { ReactChild, ReactFragment, ReactPortal } from 'react';
import Image from 'next/image'
import { Crypto } from './constants'

type SetCrypto = (crypto: string) => void;

type Props = {
    cryptos: any,
    crypto: Crypto,
    handleCryptoChange: SetCrypto
}

function Dropdown(props: Props) {
    const { cryptos, crypto, handleCryptoChange } = props;
    const cryptoKeys = Object.keys(cryptos)

    const dropdownItems = cryptoKeys.map( (crypto, index) => {
        return(
        <Menu.Item key={cryptos[crypto].name}>
            {({ active }) => (
            <a
                className={`${
                    active ? 'bg-blue-500 text-blue p-1 m-1 items-center' : 'bg-white text-black p-1 m-1 items-center'
                }`}
                onClick={() => handleCryptoChange(cryptoKeys[index])}
            >
                {<Image src={`/icons/${cryptos[crypto].icon}`} height={15} width={15} alt={cryptos[crypto].slug}/>}
                <span className='p-2'>{cryptos[crypto].name}</span>
            </a>
            )}
        </Menu.Item>
     )})





  return (
    <Menu>
      <div className='flex flex-col cursor-pointer'>
      <Menu.Button className='rounded border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700'>
          Change Crypto
      </Menu.Button>
      <Menu.Items className='absolute flex flex-col rounded border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50' id="menu-button" aria-expanded="true" aria-haspopup="true">
        {dropdownItems}
      </Menu.Items>
      </div>
    </Menu>
  )
}

export default Dropdown