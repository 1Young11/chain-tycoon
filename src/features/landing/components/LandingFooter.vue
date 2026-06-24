<template>
   <footer class="landing-footer">
      <div class="landing-footer__container">
         <div class="landing-footer__brand">
            <a href="/" class="landing-footer__logo">
               <i class="fa-solid fa-cubes"></i>
               Chain Tycoon
            </a>
            <p class="landing-footer__description">
               Evolving financial markets intelligence safely through simulated educational gamification.
            </p>
         </div>

         <nav class="landing-footer__nav" aria-label="Footer navigation">
            <div class="landing-footer__column">
               <h3 class="landing-footer__heading">Game</h3>
               <ul class="landing-footer__list">
                  <li class="landing-footer__item"><a class="landing-footer__link" href="#cta">Dashboard</a></li>
                  <li class="landing-footer__item"><a class="landing-footer__link" href="#how">Leaderboard</a></li>
                  <li class="landing-footer__item"><a class="landing-footer__link" href="#how">Mining Rig</a></li>
               </ul>
            </div>

            <div class="landing-footer__column">
               <h3 class="landing-footer__heading">Learn</h3>
               <ul class="landing-footer__list">
                  <li class="landing-footer__item"><a class="landing-footer__link" href="#how">Crypto Basics</a></li>
                  <li class="landing-footer__item"><a class="landing-footer__link" href="#how">Trading Guide</a></li>
                  <li class="landing-footer__item"><a class="landing-footer__link" href="#how">DeFi Explained</a></li>
               </ul>
            </div>

            <div class="landing-footer__column">
               <h3 class="landing-footer__heading">Community</h3>
               <ul class="landing-footer__list">
                  <li class="landing-footer__item"><a class="landing-footer__link" href="#">Discord</a></li>
                  <li class="landing-footer__item"><a class="landing-footer__link" href="#">Twitter</a></li>
                  <li class="landing-footer__item"><a class="landing-footer__link" href="#">Forum</a></li>
               </ul>
            </div>

            <div class="landing-footer__column">
               <h3 class="landing-footer__heading">Legal</h3>
               <ul class="landing-footer__list">
                  <li class="landing-footer__item"><a class="landing-footer__link" href="#">Privacy</a></li>
                  <li class="landing-footer__item"><a class="landing-footer__link" href="#">Terms</a></li>
                  <li class="landing-footer__item"><a class="landing-footer__link" href="#">EULA</a></li>
               </ul>
            </div>
         </nav>
      </div>

      <div class="landing-footer__bottom">
         &copy; 2026 Chain Tycoon. Learn crypto safely. All portfolio values simulated.
      </div>
   </footer>
</template>

<style lang="scss" scoped>
.landing-footer {
   padding-top: var(--space-16);

   border-top: 1px solid var(--color-border);
   background: #0a0a0f;

   &__container {
      @include container;
      display: grid;
      grid-template-columns: 1.2fr 2fr;
      gap: var(--space-12);

      @include lg {
         grid-template-columns: 1fr;
      }
   }

   &__brand {
      max-width: 320px;
   }

   &__logo {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-4);

      color: var(--color-text-primary);
      font-size: var(--text-xl);
      font-weight: var(--font-bold);

      i {
         color: var(--color-accent);
      }
   }

   &__description {
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
   }

   &__nav {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-8);

      @include md {
         grid-template-columns: repeat(2, 1fr);
      }
   }

   &__heading {
      margin-bottom: var(--space-4);

      color: var(--color-text-primary);
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
   }

   &__list {
      @include flex-col;
      gap: var(--space-2);
   }

   &__link {
      color: var(--color-text-muted);
      font-size: var(--text-sm);
      transition: color var(--duration-fast) var(--ease-default);

      &:hover {
         color: var(--color-accent);
      }
   }

   &__bottom {
      margin-top: var(--space-12);
      padding-block: var(--space-5);

      border-top: 1px solid var(--color-border-subtle);

      color: var(--color-text-muted);
      font-size: var(--text-xs);
      text-align: center;
   }
}
</style>
