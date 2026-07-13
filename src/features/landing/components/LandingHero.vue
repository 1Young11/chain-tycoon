<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';

import { useCryptoPricesStore } from '@/stores/cryptoPrices';

const cryptoPricesStore = useCryptoPricesStore();

const formatCurrency = (value: number | null) => {
   if (value === null) {
      return '--';
   }

   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   }).format(value);
};

const formatChange = (value: number | null) => {
   if (value === null) {
      return '--';
   }

   const sign = value > 0 ? '+' : '';

   return `${sign}${value.toFixed(1)}%`;
};

const bitcoinPrice = computed(() => formatCurrency(cryptoPricesStore.prices.bitcoin.price));
const bitcoinChange = computed(() => formatChange(cryptoPricesStore.prices.bitcoin.change24h));
const isBitcoinUp = computed(() => (cryptoPricesStore.prices.bitcoin.change24h ?? 0) >= 0);
const ethereumPrice = computed(() => formatCurrency(cryptoPricesStore.prices.ethereum.price));
const ethereumChange = computed(() => formatChange(cryptoPricesStore.prices.ethereum.change24h));
const isEthereumUp = computed(() => (cryptoPricesStore.prices.ethereum.change24h ?? 0) >= 0);

onMounted(() => {
   cryptoPricesStore.startPolling();
});

onBeforeUnmount(() => {
   cryptoPricesStore.stopPolling();
});
</script>

<template>
   <section class="hero">
      <div class="hero__container">
         <div class="hero__content">
            <div class="hero__badge">🎓Educational Crypto Platform</div>
            <h1 class="hero__title">Learn Crypto.<br>Play Safe. Win Big.</h1>
            <p class="hero__description">
               The only place where losing $10,000 is a learning experience,
               not a disaster. Real crypto prices, virtual capital.
            </p>
            <div class="hero__buttons">
               <a href="#cta" class="hero__btn hero__btn--filled">Start Learning Free</a>
               <a href="#how" class="hero__btn hero__btn--ghost landing-button-outline">See How It Works</a>
            </div>
         </div>

         <div class="hero__visual">
            <div class="hero__card">
               <div class="hero__card-meta">
                  <div class="hero__coin-icon">
                     <i class="fa-brands fa-bitcoin"></i>
                  </div>
                  <div class="hero__coin-info">
                     <div class="hero__coin-symbol">BTC</div>
                     <div class="hero__coin-name">Bitcoin Index</div>
                  </div>
               </div>
               <div class="hero__card-price">
                  <div class="hero__price">{{ bitcoinPrice }}</div>
                  <div class="hero__change" :class="isBitcoinUp ? 'hero__change--up' : 'hero__change--down'">
                     <i class="fa-solid" :class="isBitcoinUp ? 'fa-caret-up' : 'fa-caret-down'"></i>
                     {{ bitcoinChange }}
                  </div>
               </div>
            </div>

            <div class="hero__balance">
               <div class="hero__balance-label">Safe Sandbox Balance</div>
               <div class="hero__balance-value">$10,000.00</div>
            </div>

            <div class="hero__card">
               <div class="hero__card-meta">
                  <div class="hero__coin-icon hero__coin-icon--eth">
                     <i class="fa-brands fa-ethereum"></i>
                  </div>
                  <div class="hero__coin-info">
                     <div class="hero__coin-symbol">ETH</div>
                     <div class="hero__coin-name">Ethereum Index</div>
                  </div>
               </div>
               <div class="hero__card-price">
                  <div class="hero__price">{{ ethereumPrice }}</div>
                  <div class="hero__change" :class="isEthereumUp ? 'hero__change--up' : 'hero__change--down'">
                     <i class="fa-solid" :class="isEthereumUp ? 'fa-caret-up' : 'fa-caret-down'"></i>
                     {{ ethereumChange }}
                  </div>
               </div>
            </div>
         </div>
      </div>
   </section>
</template>

<style lang="scss" scoped>
.hero {
   position: relative;

   padding-block: var(--space-24);

   background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
   background-size: 32px 32px;

   @include lg {
      padding-block: var(--space-16);
   }

   @include md {
      padding-block: var(--space-12);
      background-size: 24px 24px;
   }

   &__container {
      @include container;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: var(--space-16);
      align-items: center;

      @include lg {
         grid-template-columns: 1fr;
         gap: var(--space-10);
      }
   }

   &__content {
      @include flex-col;
      align-items: flex-start;

      @include lg {
         align-items: center;

         text-align: center;
      }
   }

   &__badge {
      @include flex-center;
      gap: var(--space-2);
      max-width: 100%;
      padding: var(--space-2) var(--space-4);

      border: 1px solid var(--color-border-accent);
      border-radius: var(--radius-full);
      background: var(--color-accent-subtle);

      color: var(--color-accent);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      line-height: var(--leading-normal);
      text-align: center;
   }

   &__title {
      margin: var(--space-4) 0 var(--space-6);

      font-size: 58px;
      font-weight: var(--font-bold);
      line-height: 1.15;

      @include gradient-text;

      @include lg {
         text-align: center;
      }

      @include md {
         font-size: var(--text-3xl);
         line-height: var(--leading-tight);
      }
   }

   &__description {
      max-width: 520px;
      margin-bottom: var(--space-10);

      color: var(--color-text-secondary);
      font-size: var(--text-lg);

      @include md {
         margin-bottom: var(--space-6);

         font-size: var(--text-base);
      }
   }

   &__buttons {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-4);

      @include lg {
         justify-content: center;
      }

      @include md {
         width: 80%;
         flex-direction: column;
      }
   }

   &__btn {
      padding: var(--space-3) var(--space-6);

      border-radius: var(--radius-md);

      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      line-height: var(--leading-normal);
      text-align: center;
      transition: all var(--duration-base) var(--ease-default);

      @include md {
         width: 100%;
      }

      &--filled {
         background: var(--color-accent);
         color: var(--color-text-primary);

         &:hover {
            background: var(--color-accent-hover);
            @include glow;
         }
      }
   }

   &__visual {
      @include flex-col;
      position: relative;
      gap: var(--space-5);
      min-width: 0;

      @include lg {
         width: 100%;
         max-width: 560px;
         margin-inline: auto;
      }
   }

   &__card {
      @include glass;
      @include flex-between;
      gap: var(--space-4);
      width: 100%;
      min-width: 0;
      padding: var(--space-6);

      border-radius: var(--radius-lg);

      @include md {
         padding: var(--space-5);
      }
   }

   &__card-meta {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      min-width: 0;
   }

   &__coin-icon {
      @include flex-center;
      flex: 0 0 auto;
      width: 44px;
      height: 44px;

      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);

      color: #f7931a;
      font-size: 20px;

      &--eth {
         color: #627eea;
      }
   }

   &__coin-info {
      min-width: 0;
   }

   &__coin-symbol {
      color: var(--color-text-primary);
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
   }

   &__coin-name {
      overflow: hidden;

      color: var(--color-text-muted);
      font-size: 11px;
      text-overflow: ellipsis;
      white-space: nowrap;
   }

   &__card-price {
      flex: 0 0 auto;

      text-align: right;
   }

   &__price {
      color: var(--color-text-primary);
      font-family: var(--font-mono);
      font-size: var(--text-base);
      font-weight: var(--font-semibold);

      @include md {
         font-size: var(--text-sm);
      }
   }

   &__change {
      font-family: var(--font-mono);
      font-size: var(--text-xs);

      &--up {
         color: var(--color-profit);
      }

      &--down {
         color: var(--color-loss);
      }
   }

   &__balance {
      @include glass;
      @include flex-col;
      gap: var(--space-2);
      padding: var(--space-10) var(--space-8);

      border-color: rgba(108, 99, 255, 0.2);
      border-radius: var(--radius-lg);

      text-align: center;

      @include md {
         padding: var(--space-8) var(--space-5);
      }
   }

   &__balance-label {
      color: var(--color-text-secondary);
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
      letter-spacing: var(--tracking-widest);
      text-transform: uppercase;
   }

   &__balance-value {
      margin-top: 6px;

      color: var(--color-accent-hover);
      font-family: var(--font-mono);
      font-size: 38px;
      font-weight: var(--font-bold);
      text-shadow: 0 0 25px rgba(108, 99, 255, 0.35);

      @include md {
         font-size: var(--text-2xl);
      }
   }
}
</style>
