// containers/types.ts

/**
 * Represents a mapping of unit keys (e.g., "BTC", "sats") to their string values (user input).
 */
export type UnitValue = {
  [key: string]: string;
};

/**
 * Represents a mapping of cryptocurrency slugs (e.g., "BITCOIN", "ETHEREUM")
 * to their price in a reference currency (e.g., USD).
 */
export type CryptoPrice = {
  [key: string]: number; // e.g. { "BITCOIN": 40000.00 }
};

/**
 * Describes the structure for validation errors, indicating which unit has an error and the message.
 */
export type ValidationError = {
  unit: string;  // The unit (e.g., "sats") that has a validation error
  error: string; // The error message
};

/**
 * Base structure for cryptocurrency data after transformation from CMC service,
 * before unit conversion functions and support status are added.
 */
export interface BaseCryptoData {
  name: string;
  slug: string;
  symbol: string;
  icon: string; // e.g., "btc.svg"
  units: Record<string, string>; // Will be populated from crypto-units-convert, e.g. { BTC: "Bitcoin", sats: "Satoshis" }
}

/**
 * Fully transformed cryptocurrency data used within the application,
 * including unit conversion capabilities and support status.
 */
export interface AppSpecificCryptoData extends BaseCryptoData {
  // Explicitly define convertFn type for clarity
  convertFn: null | ((amount: number, fromUnit: string, toUnit: string) => number);
  isSupported: boolean; // Flag to indicate if conversions and full features are supported
}

/**
 * Defines the structure for the map holding all cryptocurrency data, keyed by symbol.
 * e.g. { "BTC": AppSpecificCryptoData_for_Bitcoin, ... }
 */
export type AllCryptosMap = {
  [symbol: string]: AppSpecificCryptoData;
};
