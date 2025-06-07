// services/__tests__/cmcService.test.ts
import { fetchTop100Cryptos, transformCMCToAppData, CMCCrypto } from '../cmcService';
import { BaseCryptoData } from '../../containers/types';

// Mock data similar to what cmcService provides
const mockApiData: CMCCrypto[] = [
  { id: 1, name: "Bitcoin", symbol: "BTC", slug: "bitcoin" },
  { id: 1027, name: "Ethereum", symbol: "ETH", slug: "ethereum" },
  { id: 52, name: "XRP", symbol: "XRP", slug: "xrp" },
];

// Store original console.log and console.warn
const originalLog = console.log;
const originalWarn = console.warn;

describe('cmcService', () => {
  let localStorageMock: Record<string, string> = {};
  let dateNowSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => localStorageMock[key] || null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
      delete localStorageMock[key];
    });

    // Mock Date.now() for cache timestamp testing
    dateNowSpy = jest.spyOn(Date, 'now');

    // Suppress console.log and console.warn during tests for cleaner output
    console.log = jest.fn();
    console.warn = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks, including localStorage and Date.now
    // Restore console.log and console.warn
    console.log = originalLog;
    console.warn = originalWarn;
  });

  describe('fetchTop100Cryptos', () => {
    const CACHE_KEY = 'cmcTop100Cache';
    const CACHE_DURATION_MS = 1 * 60 * 60 * 1000; // 1 hour (must match service)

    it('should fetch fresh data and cache it when localStorage is empty', async () => {
      dateNowSpy.mockReturnValue(1000000000000); // Current time

      // fetchTop100Cryptos in cmcService uses its own mockCryptoData for the "API call"
      // For this test, we rely on that internal mock, then check if it's cached.
      const data = await fetchTop100Cryptos();

      expect(data.length).toBeGreaterThan(0); // Ensure some data is returned (from the service's internal mock)
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(CACHE_KEY, JSON.stringify({
        timestamp: 1000000000000,
        data: data // The data returned by the mock API call in the service
      }));
    });

    it('should return cached data if valid cache exists', async () => {
      const cachedTimestamp = 1000000000000;
      dateNowSpy.mockReturnValue(cachedTimestamp + CACHE_DURATION_MS / 2); // Time is within cache duration

      const cachedData = {
        timestamp: cachedTimestamp,
        data: mockApiData
      };
      localStorageMock[CACHE_KEY] = JSON.stringify(cachedData);

      const data = await fetchTop100Cryptos();

      expect(data).toEqual(mockApiData);
      expect(localStorage.getItem).toHaveBeenCalledWith(CACHE_KEY);
      expect(localStorage.setItem).not.toHaveBeenCalled(); // Should not call setItem if cache is hit
    });

    it('should fetch fresh data if cache is expired', async () => {
      const cachedTimestamp = 1000000000000;
      // Set current time to be past the cache duration
      dateNowSpy.mockReturnValue(cachedTimestamp + CACHE_DURATION_MS + 1000);

      const expiredCachedData = {
        timestamp: cachedTimestamp,
        data: mockApiData
      };
      localStorageMock[CACHE_KEY] = JSON.stringify(expiredCachedData);

      // spy on the setTimeout to ensure the "API call" part is reached
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      const data = await fetchTop100Cryptos();

      expect(localStorage.removeItem).toHaveBeenCalledWith(CACHE_KEY);
      expect(setTimeoutSpy).toHaveBeenCalled(); // Indicates fresh fetch path was taken
      expect(localStorage.setItem).toHaveBeenCalledTimes(1); // New data should be cached
      expect(data.length).toBeGreaterThan(0); // Fresh data (from service's mock)
      expect(data).not.toEqual(mockApiData); // Should be different from the expired mockApiData if service's internal mock is different

      setTimeoutSpy.mockRestore();
    });

    it('should handle localStorage read error gracefully and fetch fresh data', async () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
          throw new Error('LocalStorage Read Error');
        });
        dateNowSpy.mockReturnValue(1000000000000);

        const data = await fetchTop100Cryptos();
        expect(data.length).toBeGreaterThan(0); // Fetched fresh data
        expect(localStorage.setItem).toHaveBeenCalledTimes(1); // Should still try to cache it
        expect(console.warn).toHaveBeenCalledWith("Error reading from localStorage:", expect.any(Error));
    });

    it('should handle localStorage write error gracefully after fetching fresh data', async () => {
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
          throw new Error('LocalStorage Write Error');
        });
        dateNowSpy.mockReturnValue(1000000000000);

        const data = await fetchTop100Cryptos();
        expect(data.length).toBeGreaterThan(0); // Fetched fresh data
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Error writing"), expect.any(Error));
    });
  });

  describe('transformCMCToAppData', () => {
    it('should transform CMCCrypto array to BaseCryptoData array correctly', () => {
      const input: CMCCrypto[] = [
        { id: 1, name: 'Bitcoin', symbol: 'BTC', slug: 'bitcoin' },
        { id: 1027, name: 'Ethereum', symbol: 'ETH', slug: 'ethereum' },
      ];

      const expectedOutput: BaseCryptoData[] = [
        {
          name: 'Bitcoin',
          slug: 'bitcoin',
          symbol: 'BTC',
          icon: 'btc.svg', // Based on current logic: symbol.toLowerCase() + '.svg'
          units: {},      // Initialized as empty object
        },
        {
          name: 'Ethereum',
          slug: 'ethereum',
          symbol: 'ETH',
          icon: 'eth.svg',
          units: {},
        },
      ];

      const result = transformCMCToAppData(input);
      expect(result).toEqual(expectedOutput);
    });

    it('should return an empty array if input is empty', () => {
      const input: CMCCrypto[] = [];
      const expectedOutput: BaseCryptoData[] = [];
      const result = transformCMCToAppData(input);
      expect(result).toEqual(expectedOutput);
    });
  });
});
