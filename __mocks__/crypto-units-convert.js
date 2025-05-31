// __mocks__/crypto-units-convert.js

const actualUnits = {
  // Mock for Bitcoin
  btcUnits: {
    BTC: "Bitcoin",
    sats: "Satoshis", // This will be the last unit if mBTC is removed or ordered after
    mBTC: "MilliBitcoin",
  },
  convertBTC: jest.fn((amount, fromUnit, toUnit) => {
    if (typeof amount !== 'number') amount = parseFloat(amount);
    if (fromUnit === 'BTC' && toUnit === 'sats') return amount * 100000000;
    if (fromUnit === 'sats' && toUnit === 'BTC') return amount / 100000000;
    if (fromUnit === 'BTC' && toUnit === 'mBTC') return amount * 1000;
    if (fromUnit === 'mBTC' && toUnit === 'BTC') return amount / 1000;
    if (fromUnit === 'mBTC' && toUnit === 'sats') return amount * 100000; // BTC -> mBTC -> sats
    if (fromUnit === 'sats' && toUnit === 'mBTC') return amount / 100000;
    if (fromUnit === toUnit) return amount;
    return amount;
  }),

  // Mock for Ethereum
  ethUnits: {
    ETH: "Ethereum",
    gwei: "Gwei",
    wei: "Wei", // This will be the last unit
  },
  convertETH: jest.fn((amount, fromUnit, toUnit) => {
    if (typeof amount !== 'number') amount = parseFloat(amount);
    if (fromUnit === 'ETH' && toUnit === 'gwei') return amount * 1000000000;
    if (fromUnit === 'gwei' && toUnit === 'ETH') return amount / 1000000000;
    if (fromUnit === 'ETH' && toUnit === 'wei') return amount * 1000000000000000000;
    if (fromUnit === 'wei' && toUnit === 'ETH') return amount / 1000000000000000000;
    if (fromUnit === 'gwei' && toUnit === 'wei') return amount * 1000000000;
    if (fromUnit === 'wei' && toUnit === 'gwei') return amount / 1000000000;
    if (fromUnit === toUnit) return amount;
    return amount;
  }),

  solUnits: {
    SOL: "Solana",
    lamports: "Lamports"
  },
  convertSOL: jest.fn((amount, fromUnit, toUnit) => {
    if (typeof amount !== 'number') amount = parseFloat(amount);
    if (fromUnit === 'SOL' && toUnit === 'lamports') return amount * 1000000000;
    if (fromUnit === 'lamports' && toUnit === 'SOL') return amount / 1000000000;
    if (fromUnit === toUnit) return amount;
    return amount;
  }),
};

const Units = new Proxy({}, {
  get: (target, prop) => {
    if (prop === 'btcUnits') return actualUnits.btcUnits;
    if (prop === 'convertBTC') return actualUnits.convertBTC;
    if (prop === 'ethUnits') return actualUnits.ethUnits;
    if (prop === 'convertETH') return actualUnits.convertETH;
    if (prop === 'solUnits') return actualUnits.solUnits;
    if (prop === 'convertSOL') return actualUnits.convertSOL;

    // For any other property (e.g., dogeUnits, convertDOGE), return undefined
    // This will make them "unsupported" in the component logic
    return undefined;
  }
});

module.exports = { Units, __esModule: true };
