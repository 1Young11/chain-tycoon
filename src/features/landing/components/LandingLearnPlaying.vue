<template>
   <section class="learn-playing">
      <div class="learn-playing__container">
         <div class="learn-playing__content">
            <h2 class="learn-playing__title">Every action teaches you something</h2>
            <div class="learn-playing__examples">
               <article class="learn-playing__example">
                  <i class="fa-solid fa-circle-check learn-playing__example-icon"></i>
                  <div class="learn-playing__example-body">
                     <h3 class="learn-playing__example-title">Bought BTC</h3>
                     <p class="learn-playing__example-text">
                        Tip appears: "You just made a spot trade. This means purchasing the actual underlying asset outright today..."
                     </p>
                  </div>
               </article>

               <article class="learn-playing__example">
                  <i class="fa-solid fa-circle-check learn-playing__example-icon"></i>
                  <div class="learn-playing__example-body">
                     <h3 class="learn-playing__example-title">Built a Farm</h3>
                     <p class="learn-playing__example-text">
                        Tip appears: "Mining is how consensus is achieved. Rigs allocate proof compute networks to win reward distributions..."
                     </p>
                  </div>
               </article>

               <article class="learn-playing__example">
                  <i class="fa-solid fa-circle-check learn-playing__example-icon"></i>
                  <div class="learn-playing__example-body">
                     <h3 class="learn-playing__example-title">Lost on Event</h3>
                     <p class="learn-playing__example-text">
                        Tip appears: "The pricing fell on macro news headlines. This systemic reaction window is known as volatility..."
                     </p>
                  </div>
               </article>

               <article class="learn-playing__example">
                  <i class="fa-solid fa-circle-check learn-playing__example-icon"></i>
                  <div class="learn-playing__example-body">
                     <h3 class="learn-playing__example-title">Staked Tokens</h3>
                     <p class="learn-playing__example-text">
                        Tip appears: "Staking locks assets to support validation infrastructure, generating yield returns over time..."
                     </p>
                  </div>
               </article>
            </div>
         </div>

         <div class="learn-playing__mockup">
            <div class="learn-playing__phone">
               <div class="learn-playing__screen">
                  <div class="learn-playing__status">
                     <span>12:45 PM</span>
                     <span><i class="fa-solid fa-wifi"></i> <i class="fa-solid fa-battery-three-quarters"></i></span>
                  </div>
                  <div class="learn-playing__screen-label">Ecosystem Dashboard</div>
                  <div class="learn-playing__screen-chart"></div>
                  <div class="learn-playing__popup">
                     <div class="learn-playing__popup-title">
                        <i class="fa-solid fa-graduation-cap"></i>
                        Action Knowledge Card
                     </div>
                     <p class="learn-playing__popup-text">
                        <strong>Position Executed:</strong> You opened a leveraged trade. If market indexes drop past liquidation limits,
                        your initial margin deposit will close permanently to protect the platform pool ledger.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </section>
</template>

<style lang="scss" scoped>
.learn-playing {
   padding-block: var(--space-24);

   @include md {
      padding-block: var(--space-16);
   }

   &__container {
      @include container;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-16);
      align-items: center;

      @include lg {
         grid-template-columns: 1fr;
         gap: var(--space-10);
      }
   }

   &__title {
      margin-bottom: var(--space-8);

      font-size: var(--text-3xl);
      font-weight: var(--font-bold);

      @include md {
         font-size: var(--text-2xl);
      }
   }

   &__examples {
      @include flex-col;
      gap: var(--space-6);
   }

   &__example {
      display: flex;
      gap: var(--space-4);
   }

   &__example-icon {
      flex: 0 0 auto;
      margin-top: 4px;

      color: var(--color-accent-hover);
      font-size: var(--icon-md);
   }

   &__example-title {
      margin-bottom: var(--space-1);

      font-size: var(--text-base);
      font-weight: var(--font-semibold);
   }

   &__example-text {
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
   }

   &__mockup {
      display: flex;
      justify-content: center;
   }

   &__phone {
      width: 100%;
      max-width: 380px;
      padding: var(--space-6) var(--space-4);

      border: 10px solid #22222b;
      border-radius: 36px;
      background: #000;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
   }

   &__screen {
      @include flex-col;
      gap: var(--space-4);
      min-height: 400px;
      padding: var(--space-4);

      border-radius: var(--radius-xl);
      background: var(--color-bg-primary);
   }

   &__status {
      @include flex-between;
      padding-bottom: var(--space-2);

      border-bottom: 1px solid var(--color-border);

      color: var(--color-text-muted);
      font-size: var(--text-xs);
   }

   &__screen-label {
      color: var(--color-text-muted);
      font-size: var(--text-xs);
   }

   &__screen-chart {
      height: 60px;

      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.02);
   }

   &__popup {
      margin-top: auto;
      padding: var(--space-4);

      border: 1px solid rgba(108, 99, 255, 0.3);
      border-radius: var(--radius-md);
      background: var(--color-bg-secondary);
      box-shadow: 0 0 15px rgba(108, 99, 255, 0.1);
   }

   &__popup-title {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: 6px;

      color: var(--color-warning);
      font-size: 13px;
      font-weight: var(--font-bold);
   }

   &__popup-text {
      color: var(--color-text-primary);
      font-size: var(--text-xs);
      line-height: 1.4;
   }
}
</style>
