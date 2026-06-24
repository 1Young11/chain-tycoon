export const CRYPTO_SYMBOLS = {
   bitcoin: 'bitcoin',
   ethereum: 'ethereum',
} as const;

export type CryptoSymbol = (typeof CRYPTO_SYMBOLS)[keyof typeof CRYPTO_SYMBOLS];

export type CryptoPrice = {
   price: number | null;
   change24h: number | null;
};

export type CryptoPrices = Record<CryptoSymbol, CryptoPrice>;

export type CoinGeckoSimplePriceResponse = Partial<
   Record<
      CryptoSymbol,
      {
         usd?: number;
         usd_24h_change?: number;
      }
   >
>;
