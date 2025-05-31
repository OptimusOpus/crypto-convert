// services/cmcService.ts
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

const mockCryptoData: CMCCrypto[] = [
  { id: 1, name: "Bitcoin", symbol: "BTC", slug: "bitcoin" },
  { id: 1027, name: "Ethereum", symbol: "ETH", slug: "ethereum" },
  { id: 825, name: "Tether USDt", symbol: "USDT", slug: "tether" },
  { id: 1839, name: "BNB", symbol: "BNB", slug: "bnb" },
  { id: 5426, name: "Solana", symbol: "SOL", slug: "solana" },
  { id: 3408, name: "USDC", symbol: "USDC", slug: "usd-coin" },
  { id: 52, name: "XRP", symbol: "XRP", slug: "xrp" },
  { id: 74, name: "Dogecoin", symbol: "DOGE", slug: "dogecoin" },
  { id: 2010, name: "Cardano", symbol: "ADA", slug: "cardano" },
  { id: 1958, name: "TRON", symbol: "TRX", slug: "tron" },
];

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

  // Simulate API call delay
  console.log("Fetching fresh CMC data (mock)");
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real scenario, this would be an axios call to CoinMarketCap
  // For example:
  // try {
  //   const response = await axios.get<CMCResponse>('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100', {
  //     headers: { 'X-CMC_PRO_API_KEY': 'YOUR_API_KEY_HERE' },
  //   });
  //   const fetchedData = response.data.data;
  //   // Cache the new data
  //   try {
  //     if (typeof localStorage !== 'undefined') {
  //       const dataToCache: CachedData = { timestamp: Date.now(), data: fetchedData };
  //       localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
  //       console.log("CMC data cached successfully");
  //     }
  //   } catch (cacheError) {
  //     console.warn("Error writing to localStorage:", cacheError);
  //   }
  //   return fetchedData;
  // } catch (apiError) {
  //   console.error("API call failed:", apiError);
  //   throw apiError; // Propagate API error
  // }

  // Using mock data:
  const fetchedData = mockCryptoData; // Simulate successful fetch

  try {
    if (typeof localStorage !== 'undefined') {
      const dataToCache: CachedData = { timestamp: Date.now(), data: fetchedData };
      localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
      console.log("Mock CMC data cached successfully");
    }
  } catch (cacheError) {
    console.warn("Error writing mock data to localStorage:", cacheError);
  }

  return fetchedData;
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
