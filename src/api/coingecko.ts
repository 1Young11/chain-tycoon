import { APP_ERROR_CODES } from '@/constants/app-errors';
import { createAppError } from '@/modules/app-error';
import { CRYPTO_SYMBOLS, type CoinGeckoSimplePriceResponse, type CryptoPrices } from '@/types/crypto';

const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;

export async function fetchCryptoPrices(): Promise<CryptoPrices> {
   const params = new URLSearchParams({
      ids: `${CRYPTO_SYMBOLS.bitcoin},${CRYPTO_SYMBOLS.ethereum}`,
      vs_currencies: 'usd',
      include_24hr_change: 'true',
   });

   if (apiKey) {
      params.set('x_cg_demo_api_key', apiKey);
   }

   const url = `https://api.coingecko.com/api/v3/simple/price?${params}`;

   const response = await fetch(url);

   if (!response.ok) {
      throw createAppError(APP_ERROR_CODES.server);
   }

   const data = (await response.json()) as CoinGeckoSimplePriceResponse;

   return {
      bitcoin: {
         price: data[CRYPTO_SYMBOLS.bitcoin]?.usd ?? null,
         change24h: data[CRYPTO_SYMBOLS.bitcoin]?.usd_24h_change ?? null,
      },
      ethereum: {
         price: data[CRYPTO_SYMBOLS.ethereum]?.usd ?? null,
         change24h: data[CRYPTO_SYMBOLS.ethereum]?.usd_24h_change ?? null,
      },
   };
}
