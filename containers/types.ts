export type UnitValue = {
    [key: string]: string;
};

export type Crypto = {
    name: string,
    slug: string,
    units: any,
    convertFn: any,
    icon: string,
};

export type cryptoOptions = {
    [key: string]: Crypto
};

export type CryptoPrice = {
    [key: string]: number;
};

export type Props = {
    cryptoPrices: CryptoPrice
}

export type ValidationError = {
    unit: string,
    error: string,
}