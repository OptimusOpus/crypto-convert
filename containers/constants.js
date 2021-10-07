import Units from 'crypto-units-convert';

export const cryptos = {
    BTC: {
        name: 'Bitcoin',
        slug: 'btc',
        units: Units.btcUnits,
        convertFn: Units.convertBTC,
        icon: "btc.svg",
    },
    BCH: {
        name: 'Bitcoin Cash',
        slug: 'bch',
        units: Units.bchUnits,
        convertFn: Units.convertBCH,
        icon: "bch.svg",
    },
    ETH: {
        name: 'Ethereum',
        slug: 'eth',
        units: Units.ethUnits,
        convertFn: Units.convertETH,
        icon: "eth.svg",
    },
    XRP: {
        name: 'Ripple',
        slug: 'xrp',
        units: Units.xrpUnits,
        convertFn: Units.convertXRP,
        icon: "xrp.png",
    },
    LTC: {
        name: 'Litecoin',
        slug: 'ltc',
        units: Units.ltcUnits,
        convertFn: Units.convertLTC,
        icon: "ltc.svg",
    },
    DASH: {
        name: 'Dash',
        slug: 'dash',
        units: Units.dashUnits,
        convertFn: Units.convertDASH,
        icon: "dash.svg",
    },
    XMR: {
        name: 'Monero',
        slug: 'xmr',
        units: Units.xmrUnits,
        convertFn: Units.convertXMR,
        icon: "xmr.svg",
    },
    DOT: {
        name: 'Polkadot',
        slug: 'dot',
        units: Units.dotUnits,
        convertFn: Units.convertDOT,
        icon: "dot.svg",
    },
    ZEC: {
        name: 'Zcash',
        slug: 'zec',
        units: Units.zecUnits,
        convertFn: Units.convertZEC,
        icon: "zec.svg",
    }
}
