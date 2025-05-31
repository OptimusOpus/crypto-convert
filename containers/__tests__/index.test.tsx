// containers/__tests__/index.test.tsx
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // For user interactions
import CryptoCalc from '../index'; // The component to test
import { fetchTop100Cryptos, transformCMCToAppData } from '../../services/cmcService';
import { AppSpecificCryptoData, CryptoPrice } from '../types';
import { BaseCryptoData } from '../types';

// Mock the cmcService
jest.mock('../../services/cmcService');
const mockedFetchTop100Cryptos = fetchTop100Cryptos as jest.MockedFunction<typeof fetchTop100Cryptos>;
const mockedTransformCMCToAppData = transformCMCToAppData as jest.MockedFunction<typeof transformCMCToAppData>;

// crypto-units-convert is automatically mocked due to __mocks__/crypto-units-convert.js

const mockCryptoPrices: CryptoPrice = {
  BITCOIN: 50000,
  ETHEREUM: 4000,
  SOLANA: 150,
  RIPPLE: 1.5, // For XRP
  DOGECOIN: 0.25,
};

const mockBaseCryptos: BaseCryptoData[] = [
  { name: 'Bitcoin', symbol: 'BTC', slug: 'bitcoin', icon: 'btc.svg', units: {} },
  { name: 'Ethereum', symbol: 'ETH', slug: 'ethereum', icon: 'eth.svg', units: {} },
  { name: 'Solana', symbol: 'SOL', slug: 'solana', icon: 'sol.svg', units: {} },
  { name: 'XRP', symbol: 'XRP', slug: 'ripple', icon: 'xrp.svg', units: {} }, // Slug matches CryptoPrice key
  { name: 'Dogecoin', symbol: 'DOGE', slug: 'dogecoin', icon: 'doge.svg', units: {} }, // Not in mock crypto-units-convert
];

// This is what transformCMCToAppData would return, but we use it to shape the final data for CryptoCalc
const mockTransformedDataForCalc: AppSpecificCryptoData[] = [
    {
        name: 'Bitcoin', symbol: 'BTC', slug: 'bitcoin', icon: 'btc.svg',
        units: { BTC: "Bitcoin", sats: "Satoshis" }, // From mock crypto-units-convert
        convertFn: jest.fn((amount, from, to) => from === 'BTC' && to === 'sats' ? amount * 1e8 : amount / 1e8),
        isSupported: true
    },
    {
        name: 'Ethereum', symbol: 'ETH', slug: 'ethereum', icon: 'eth.svg',
        units: { ETH: "Ethereum", gwei: "Gwei" }, // From mock crypto-units-convert
        convertFn: jest.fn(amount => amount * 1e9),
        isSupported: true
    },
    {
        name: 'Solana', symbol: 'SOL', slug: 'solana', icon: 'sol.svg',
        units: { SOL: "Solana", lamports: "Lamports" }, // From mock crypto-units-convert
        convertFn: jest.fn(amount => amount * 1e9),
        isSupported: true
    },
    {
        name: 'XRP', symbol: 'XRP', slug: 'ripple', icon: 'xrp.svg',
        units: { XRP: "XRP", drops: "Drops" }, // Assume XRP is also "supported" by mock
        convertFn: jest.fn(amount => amount * 1e6),
        isSupported: true
    },
    {
        name: 'Dogecoin', symbol: 'DOGE', slug: 'dogecoin', icon: 'doge.svg',
        units: {}, // Not supported by our mock crypto-units-convert
        convertFn: null,
        isSupported: false
    },
];


describe('CryptoCalc Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockedFetchTop100Cryptos.mockReset();
    mockedTransformCMCToAppData.mockReset();

    // Default mock implementation:
    // fetchTop100Cryptos returns raw data (which we don't strictly need to match cmcService's internal mock for these tests)
    mockedFetchTop100Cryptos.mockResolvedValue([
      { id: 1, name: "Bitcoin", symbol: "BTC", slug: "bitcoin" },
      { id: 1027, name: "Ethereum", symbol: "ETH", slug: "ethereum" },
      { id: 5426, name: "Solana", symbol: "SOL", slug: "solana" },
      { id: 52, name: "XRP", symbol: "XRP", slug: "ripple" },
      { id: 74, name: "Dogecoin", symbol: "DOGE", slug: "dogecoin" },
    ]);
    // transformCMCToAppData returns the BaseCryptoData structure
    mockedTransformCMCToAppData.mockReturnValue(mockBaseCryptos);
  });

  it('should display loading state initially, then render data', async () => {
    render(<CryptoCalc cryptoPrices={mockCryptoPrices} />);
    expect(screen.getByText(/Loading cryptocurrency data.../i)).toBeInTheDocument();

    // Wait for data to load (selectedCrypto to be set)
    // The first crypto in mockTransformedDataForCalc is Bitcoin (BTC) if ETH is not first choice by default
    // Let's assume ETH is default or first supported. Our mock has ETH as supported.
    // The default selected crypto is ETH if supported, or first supported.
    // Our mock crypto-units-convert supports BTC, ETH, SOL.
    // So, ETH should be selected.
    await waitFor(() => {
      expect(screen.getByText('Ethereum')).toBeInTheDocument(); // Check for selected crypto name
    });
    expect(screen.queryByText(/Loading cryptocurrency data.../i)).not.toBeInTheDocument();
    expect(screen.getByText('$ 4000.00 USD')).toBeInTheDocument(); // ETH Price
  });

  it('should display reference conversion for a supported crypto (ETH)', async () => {
    render(<CryptoCalc cryptoPrices={mockCryptoPrices} />);
    await waitFor(() => {
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });
    // Mock for ETH in crypto-units-convert.js: ETH -> gwei (1e9)
    // Reference string: "1 ETH = 1,000,000,000 gwei" (or similar, depending on mockUnits)
    // The mockUnits defines ETH, gwei, wei. First is ETH, last is wei.
    expect(await screen.findByText(/1 ETH = 1,000,000,000,000,000,000 wei/i)).toBeInTheDocument();
  });

  it('should display reference conversion for BTC (first unit to last unit)', async () => {
    // Temporarily make BTC the default for this test by only "fetching" BTC
    // and ensuring its data is correctly set up for being "supported"
     const btcBase = mockBaseCryptos.find(c => c.symbol === 'BTC');
     if (!btcBase) throw new Error("BTC not in mockBaseCryptos for test setup");
     mockedTransformCMCToAppData.mockReturnValue([btcBase]);

    render(<CryptoCalc cryptoPrices={mockCryptoPrices} />);
    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    });
    // Mock for BTC: { BTC: "Bitcoin", sats: "Satoshis", mBTC: "MilliBitcoin" }
    // First is BTC, last is mBTC. 1 BTC = 1,000 mBTC
    expect(await screen.findByText(/1 BTC = 1,000 mBTC/i)).toBeInTheDocument();
  });


  it('should not display reference conversion or show appropriate message for unsupported crypto (Dogecoin)', async () => {
    // To select Dogecoin, we need to simulate a click or make it the only option
    mockedTransformCMCToAppData.mockReturnValue([mockBaseCryptos[4]]); // Only Dogecoin

    render(<CryptoCalc cryptoPrices={mockCryptoPrices} />);

    await waitFor(() => {
      expect(screen.getByText('Dogecoin')).toBeInTheDocument(); // DOGE is selected
    });

    // Check that the specific reference conversion text for supported cryptos is NOT there
    expect(screen.queryByText(/1 ETH = 1,000,000,000,000,000,000 wei/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/1 BTC = 1,000 mBTC/i)).not.toBeInTheDocument();

    // Based on updated mock, Dogecoin will be isSupported:false, so referenceConversion will be null.
    // The div for referenceConversion won't render if referenceConversion is null.
    // So, we check that NO "1 ANYUNIT = X OTHERUNIT" string is present under the dropdown.
    // A more robust way would be to add a data-testid to the reference conversion div.
    const assetButton = screen.getByRole('button', { name: /Change Asset/i });
    const parentOfDropdown = assetButton.closest('div.flex.flex-col.my-2');
    expect(parentOfDropdown).not.toHaveTextContent(/1\s+\w+\s+=\s+[\d,]+\s+\w+/); // Regex for "1 UNIT = X VAL"

    // Also, unit fields should show "Conversions not supported"
    expect(screen.getByText(/Conversions not supported for Dogecoin/i)).toBeInTheDocument();
  });

  it('should change selected crypto and update UI when new crypto is selected from dropdown', async () => {
    render(<CryptoCalc cryptoPrices={mockCryptoPrices} />);
    await waitFor(() => {
      expect(screen.getByText('Ethereum')).toBeInTheDocument(); // Initial: ETH
    });
    expect(screen.getByText('$ 4000.00 USD')).toBeInTheDocument(); // ETH Price
    expect(screen.getByText(/1 ETH = 1,000,000,000,000,000,000 wei/i)).toBeInTheDocument(); // ETH to wei


    // Simulate selecting Bitcoin
    const dropdownButton = screen.getByRole('button', { name: /Change Asset/i });
    await act(async () => { userEvent.click(dropdownButton); });

    // Debug: print the state of the DOM after clicking the dropdown
    // This will help see if the menu items are rendered as expected.
    // screen.debug(undefined, 30000); // Temporarily add for debugging

    // Explicitly wait for items to be available after clicking dropdown
    await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /Bitcoin \(BTC\)/i })).toBeVisible();
        expect(screen.getByRole('menuitem', { name: /Dogecoin \(DOGE\)/i })).toBeVisible(); // Check another item too
    });

    const bitcoinOption = screen.getByRole('menuitem', { name: /Bitcoin \(BTC\)/i });
    await act(async () => { userEvent.click(bitcoinOption); });

    // Verify UI updates for Bitcoin
    await waitFor(() => { expect(screen.getByText('Bitcoin')).toBeInTheDocument(); });
    expect(screen.getByText('$ 50000.00 USD')).toBeInTheDocument(); // BTC Price
    expect(screen.getByText(/1 BTC = 1,000 mBTC/i)).toBeInTheDocument(); // BTC reference
  });

  it('should display an error message if data fetching fails', async () => {
    mockedFetchTop100Cryptos.mockRejectedValue(new Error('Network Error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error for this test

    render(<CryptoCalc cryptoPrices={mockCryptoPrices} />);

    expect(await screen.findByText(/Failed to load cryptocurrency data. Please try again later./i)).toBeInTheDocument();
    expect(screen.queryByText(/Loading cryptocurrency data.../i)).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to load cryptocurrency data:", expect.any(Error));
    consoleErrorSpy.mockRestore();
  });

  // Test for isSupported flag logic
  it('should correctly determine isSupported based on crypto-units-convert mock', async () => {
    render(<CryptoCalc cryptoPrices={mockCryptoPrices} />);

    // Wait for ETH (supported)
    await waitFor(() => {
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });
    // ETH unit fields should be enabled (or rather, no "not supported" message)
    expect(screen.queryByText(/Conversions not supported for Ethereum/i)).not.toBeInTheDocument();

    // Change to Dogecoin (not supported by mock crypto-units-convert)
    const dropdownButton = screen.getByRole('button', { name: /Change Asset/i });
    await act(async () => { userEvent.click(dropdownButton); });

    await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /Dogecoin \(DOGE\)/i })).toBeVisible();
    });
    const dogecoinOption = screen.getByRole('menuitem', { name: /Dogecoin \(DOGE\)/i });
    await act(async () => { userEvent.click(dogecoinOption); });

    await waitFor(() => {
      expect(screen.getByText('Dogecoin')).toBeInTheDocument();
    });
    expect(screen.getByText(/Conversions not supported for Dogecoin/i)).toBeInTheDocument();
  });

});
