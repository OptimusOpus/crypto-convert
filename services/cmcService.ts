// services/cmcService.ts
import axios from 'axios';
import { BaseCryptoData } from '../containers/types'; // Import BaseCryptoData

export interface CMCCrypto {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  // Potentially add other fields like cmc_rank, circulating_supply, etc. if needed later
}

export interface CMCResponse {
  data: CMCCrypto[];
  // status: { // Example: CoinMarketCap API includes a status object
  //   timestamp: string;
  //   error_code: number;
  //   error_message: string | null;
  //   elapsed: number;
  //   credit_count: number;
  //   notice: string | null;
  // };
}

// Cache duration: 1 hour
const CACHE_DURATION_MS = 1 * 60 * 60 * 1000;
const CACHE_KEY = 'cmcTop100Cache';

interface CachedData {
  timestamp: number;
  data: CMCCrypto[];
}

// Mock data has been moved to __tests__/mocks/mockCryptoData.ts for unit testing

export async function fetchTop100Cryptos(): Promise<CMCCrypto[]> {
  try {
    // Check for localStorage availability and then try to get cached data
    if (typeof localStorage !== 'undefined') {
      const cachedItem = localStorage.getItem(CACHE_KEY);
      if (cachedItem) {
        const parsedCache: CachedData = JSON.parse(cachedItem);
        const now = Date.now();
        if (now - parsedCache.timestamp < CACHE_DURATION_MS) {
          console.log("Returning cached CMC data");
          return parsedCache.data;
        } else {
          console.log("CMC Cache expired");
          localStorage.removeItem(CACHE_KEY); // Remove expired cache
        }
      }
    }
  } catch (error) {
    console.warn("Error reading from localStorage:", error);
    // If localStorage fails, proceed to fetch without caching
  }

  console.log("Fetching fresh CMC data from API");

  // Determine the correct API URL based on the environment (client-side vs server-side)
  let apiUrl = '/api/crypto/listings';
  if (typeof window === 'undefined') {
    // Server-side: construct absolute URL
    // Ensure NEXT_PUBLIC_APP_URL is set in your .env.local (e.g., http://localhost:3000 for dev)
    const baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; 
    apiUrl = `${baseURL}/api/crypto/listings`;
    console.log(`Executing server-side API call to: ${apiUrl}`);
  } else {
    console.log(`Executing client-side API call to: ${apiUrl}`);
  }

  try {
    const response = await axios.get<CMCResponse>(apiUrl); // CMCResponse expects { data: CMCCrypto[] }
    const fetchedData = response.data.data; // Access the nested 'data' array
    
    // Cache the new data
    // Ensure localStorage is only accessed on the client-side
    if (typeof window !== 'undefined') {
      try {
        const dataToCache: CachedData = { timestamp: Date.now(), data: fetchedData };
        localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
        console.log("CMC data cached successfully via API route");
      } catch (cacheError) {
        console.warn("Error writing to localStorage:", cacheError);
      }
    }
    
    return fetchedData;
  } catch (apiError) {
    // Log the error and re-throw to be caught by the calling function
    if (axios.isAxiosError(apiError)) {
      console.error("API call to /api/crypto/listings failed:", apiError.response?.data || apiError.message);
    } else {
      console.error("Error fetching from /api/crypto/listings:", apiError);
    }
    throw apiError; 
  }
}

// The old AppCrypto interface is replaced by BaseCryptoData from types.ts
// export interface AppCrypto {
//   name: string;
//   slug: string;
//   symbol: string;
//   icon: string;
//   units: Record<string, string>; // Or a more specific type if unit structure is known
//   convertFn: null | ((amount: number, fromUnit: string, toUnit: string) => number); // Placeholder for actual function type
// }

export function transformCMCToAppData(cmcData: CMCCrypto[]): BaseCryptoData[] {
  return cmcData.map(crypto => ({
    name: crypto.name,
    slug: crypto.slug,
    symbol: crypto.symbol,
    icon: `${crypto.symbol.toLowerCase()}.svg`, // Placeholder icon logic
    units: {}, // To be populated later
    // convertFn is not part of BaseCryptoData, it's added later in index.tsx when creating AppSpecificCryptoData
  }));
}
