// components/__tests__/Dropdown.test.tsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from '../Dropdown'; // Adjust path as necessary
import { BaseCryptoData } from '../../containers/types'; // Assuming this type is suitable

// Define the expected shape for dropdown crypto items
type DropdownCryptoItem = Pick<BaseCryptoData, 'name' | 'symbol' | 'icon' | 'slug'>;

const mockCryptos: DropdownCryptoItem[] = [
  { name: 'Bitcoin', symbol: 'BTC', icon: 'btc.svg', slug: 'bitcoin' },
  { name: 'Ethereum', symbol: 'ETH', icon: 'eth.svg', slug: 'ethereum' },
];

describe('Dropdown Component', () => {
  it('renders the "Change Asset" button', () => {
    render(
      <Dropdown
        cryptos={mockCryptos}
        selectedCryptoSymbol="BTC"
        handleCryptoChange={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /Change Asset/i })).toBeInTheDocument();
  });

  it('displays crypto items when clicked and calls handleCryptoChange', async () => {
    const handleCryptoChangeMock = jest.fn();
    render(
      <Dropdown
        cryptos={mockCryptos}
        selectedCryptoSymbol="BTC"
        handleCryptoChange={handleCryptoChangeMock}
      />
    );

    const changeAssetButton = screen.getByRole('button', { name: /Change Asset/i });
    await act(async () => {
      userEvent.click(changeAssetButton);
    });

    // Check if items are displayed (using the name and symbol)
    const bitcoinOption = await screen.findByRole('menuitem', { name: /Bitcoin \(BTC\)/i });
    const ethereumOption = await screen.findByRole('menuitem', { name: /Ethereum \(ETH\)/i });

    expect(bitcoinOption).toBeVisible();
    expect(ethereumOption).toBeVisible();

    // Simulate clicking Ethereum
    await act(async () => {
      userEvent.click(ethereumOption);
    });

    expect(handleCryptoChangeMock).toHaveBeenCalledTimes(1);
    expect(handleCryptoChangeMock).toHaveBeenCalledWith('ETH');
  });

  it('highlights the selected crypto symbol', async () => {
    render(
      <Dropdown
        cryptos={mockCryptos}
        selectedCryptoSymbol="ETH" // Ethereum is selected
        handleCryptoChange={jest.fn()}
      />
    );

    const changeAssetButton = screen.getByRole('button', { name: /Change Asset/i });
     await act(async () => {
        userEvent.click(changeAssetButton);
    });

    const ethereumOption = await screen.findByRole('menuitem', { name: /Ethereum \(ETH\)/i });
    // Check for a class that indicates selection, e.g., 'font-semibold' as used in Dropdown.tsx
    expect(ethereumOption).toHaveClass('font-semibold');

    const bitcoinOption = await screen.findByRole('menuitem', { name: /Bitcoin \(BTC\)/i });
    expect(bitcoinOption).not.toHaveClass('font-semibold');
  });

  it('displays "No assets available." if cryptos array is empty', async () => {
    render(
      <Dropdown
        cryptos={[]}
        selectedCryptoSymbol=""
        handleCryptoChange={jest.fn()}
      />
    );
    const changeAssetButton = screen.getByRole('button', { name: /Change Asset/i });
    await act(async () => {
        userEvent.click(changeAssetButton);
    });

    expect(await screen.findByText(/No assets available./i)).toBeVisible();
  });
});
