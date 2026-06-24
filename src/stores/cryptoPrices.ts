import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { fetchCryptoPrices } from '@/api/coingecko';
import { APP_ERROR_CODES, APP_ERROR_MESSAGES } from '@/constants/app-errors';
import { getAppErrorMessage } from '@/modules/app-error';
import { CRYPTO_SYMBOLS, type CryptoPrices } from '@/types/crypto';

const POLLING_INTERVAL_MS = 60_000;

export const useCryptoPricesStore = defineStore('cryptoPrices', () => {
   const prices = ref<CryptoPrices>({
      [CRYPTO_SYMBOLS.bitcoin]: {
         price: null,
         change24h: null,
      },
      [CRYPTO_SYMBOLS.ethereum]: {
         price: null,
         change24h: null,
      },
   });
   const loading = ref(false);
   const error = ref<string | null>(null);
   const lastUpdated = ref<Date | null>(null);
   const pollingId = ref<ReturnType<typeof setInterval> | null>(null);

   const isPolling = computed(() => pollingId.value !== null);

   const fetchPrices = async () => {
      loading.value = true;
      error.value = null;

      try {
         prices.value = await fetchCryptoPrices();
         lastUpdated.value = new Date();
      } catch (unknownError) {
         error.value = getAppErrorMessage(unknownError, APP_ERROR_MESSAGES[APP_ERROR_CODES.unknown]);
      } finally {
         loading.value = false;
      }
   };

   const startPolling = (interval = POLLING_INTERVAL_MS) => {
      if (pollingId.value) {
         return;
      }

      void fetchPrices();
      pollingId.value = setInterval(() => {
         void fetchPrices();
      }, interval);
   };

   const stopPolling = () => {
      if (!pollingId.value) {
         return;
      }

      clearInterval(pollingId.value);
      pollingId.value = null;
   };

   return {
      prices,
      loading,
      error,
      lastUpdated,
      isPolling,
      fetchPrices,
      startPolling,
      stopPolling,
   };
});
