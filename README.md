## Crypto-convert
![complex calculations ](https://github.com/OptimusOpus/crypto-convert/assets/34178563/821f473f-8082-4933-bc55-239e4d095998)

When working with cryptocurrencies in a development environment, especially in the context of blockchain applications, it's essential to accurately handle and display the native assets of blockchains. These assets are typically stored and transacted in their smallest denominational units to maintain precision and avoid floating-point errors. For example, Ethereum uses 'wei' as its smallest unit, where 1 ether equals 1,000,000,000,000,000,000 wei (10^18 wei).

However, while these smallest units are practical for computational accuracy and smart contract interactions, they are not user-friendly for human interpretation. It's much easier for me to understand and interact with cryptocurrencies in their more familiar, larger units like ether (ETH) instead of wei. This discrepancy between machine efficiency and human usability creates the need for a reliable conversion tool that can quickly switch between a cryptocurrency's base unit and its more readable form.

I found that existing cryptocurrency unit conversion tools didn't support all the cryptocurrencies I was working with or didn't maintain the base units as integers, which is crucial for precision and avoiding errors in financial calculations. To address this gap, I decided to fork an existing project named crypto-unit-convert. Forking allows me to take the existing codebase and modify it to meet my specific requirements. In this case, it was essential to ensure that base units remain as integers, which is a fundamental requirement for blockchain transactions to maintain accuracy and prevent rounding errors.

By integrating this customized unit conversion tool into my applications, I provided a solution that combines computational precision with user-friendly interfaces. This makes it easier for users to understand transaction amounts, wallet balances, and other financial information in terms familiar to them, like ETH, BTC, etc., instead of wei, satoshis, or other base units.

This approach not only enhances the user experience by presenting information in a more accessible format but also maintains the integrity of transactions on the blockchain by ensuring that all calculations and data storage continue to use the precise, smallest unit denominations. This dual-focus solution—technical accuracy for the blockchain and readability for human users—is a common and necessary balance in the development of blockchain applications and financial software.

## Getting Started

Pull, then run the development server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

I have implimented this here https://crypto-convert.vercel.app/
