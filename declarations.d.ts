// declarations.d.ts

declare module 'crypto-units-convert' {
  // You can be more specific with types if you know the structure of Units
  // For now, 'any' will suffice to remove the TS7016 error.
  // A more robust approach would be to define the structure of the Units object.
  // Example:
  // export const Units: {
  //   [key: string]: any; // e.g., btcUnits, ethUnits
  //   convertBTC?: (amount: number | string, fromUnit: string, toUnit: string) => string;
  //   convertETH?: (amount: number | string, fromUnit: string, toUnit: string) => string;
  //   // Add other specific convert functions or a generic one
  //   [convertFnKey: string]: ((amount: number | string, fromUnit: string, toUnit: string) => string) | any;
  // };

  const Units: any;
  export { Units };
}
