<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
</script>

<template>
   <div class="dashboard">
      <div class="dashboard__body">
         <section v-if="gameStore.isLoading" class="dashboard-state">Loading your company…</section>
         <section v-else-if="gameStore.error" class="dashboard-state dashboard-state--error">
            <span>{{ gameStore.error }}</span>
            <button type="button" @click="gameStore.fetchGameState()">Try again</button>
         </section>

         <section class="stats-row" aria-label="Dashboard statistics">
            <article class="stat-card">
               <span class="stat-card__label">Total Balance</span>
               <div class="stat-card__bottom">
                  <span class="stat-card__value stat-card__value--accent">{{ gameStore.formattedBalance }}</span>
               </div>
            </article>

            <article class="stat-card">
               <span class="stat-card__label">Net Worth</span>
               <div class="stat-card__bottom">
                  <span class="stat-card__value stat-card__value--profit">{{ gameStore.formattedNetWorth }}</span>
               </div>
            </article>

            <article class="stat-card">
               <span class="stat-card__label">Level</span>
               <div class="stat-card__bottom">
                  <span class="stat-card__value">{{ gameStore.level }}</span>
                  <span class="stat-card__meta">{{ gameStore.xp }} XP</span>
               </div>
            </article>

            <article class="stat-card">
               <span class="stat-card__label">Net Income</span>
               <div class="stat-card__bottom">
                  <span class="stat-card__value stat-card__value--profit">{{ gameStore.formattedPassiveIncome }}</span>
                  <span class="stat-card__meta stat-card__meta--warning"><i class="fa-solid fa-bolt"></i></span>
               </div>
            </article>
         </section>

         <section class="activity-section locations-section">
            <div class="section-header">
               <div class="section-header__left">
                  <h2 class="section-header__title">Locations</h2>
                  <span class="section-header__badge">{{ gameStore.locations.length }} locations</span>
               </div>
            </div>
            <div class="locations-grid">
               <article v-for="location in gameStore.locations" :key="location.id" class="location-card" :class="{ 'location-card--locked': !location.isOwned }">
                  <div>
                     <h3>{{ location.name }}</h3>
                     <p v-if="location.isOwned">{{ location.usedSlots }} / {{ location.slotCapacity }} slots</p>
                     <p v-if="location.isOwned">{{ location.powerUsageKw }} / {{ location.powerCapacityKw }} kW</p>
                     <p v-else>Unlocks at level {{ location.requiredLevel }}</p>
                  </div>
                  <span>{{ location.isOwned ? 'Owned' : 'Locked' }}</span>
               </article>
            </div>
         </section>
      </div>
   </div>
</template>

<style scoped lang="scss">
.dashboard {
   min-width: 0;
}

.dashboard-state {
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: var(--space-4);
   padding: var(--space-4);
   border: 1px solid var(--color-border);
   border-radius: var(--radius-sm);
   background: var(--color-bg-tertiary);
   color: var(--color-text-secondary);

   &--error {
      border-color: rgba(255, 83, 112, 0.35);
      color: var(--color-loss);
   }

   button {
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.04);
      color: var(--color-text-primary);
      cursor: pointer;
   }
}

.locations-grid {
   display: grid;
   grid-template-columns: repeat(2, minmax(0, 1fr));
   gap: var(--space-3);
}

.location-card {
   display: flex;
   align-items: flex-start;
   justify-content: space-between;
   gap: var(--space-4);
   padding: var(--space-4);
   border: 1px solid var(--color-border);
   border-radius: var(--radius-sm);
   background: var(--color-bg-tertiary);

   h3 { margin-bottom: var(--space-2); color: var(--color-text-primary); font-size: var(--text-sm); }
   p { color: var(--color-text-muted); font-size: var(--text-xs); line-height: 1.6; }
   > span { color: var(--color-profit); font-size: var(--text-xs); font-weight: var(--font-semibold); }

   &--locked {
      opacity: 0.72;
      > span { color: var(--color-text-muted); }
   }
}

.urgent-banner {
   display: flex;
   height: 44px;
   align-items: center;
   justify-content: space-between;
   gap: var(--space-4);
   padding: 0 var(--space-8);

   border-bottom: 1px solid var(--color-border);
   border-left: 3px solid var(--color-warning);
   background: rgba(255, 181, 71, 0.02);

   &__left {
      display: flex;
      align-items: center;
      gap: 10px;

      color: var(--color-text-primary);
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
   }

   &__indicator {
      width: 6px;
      height: 6px;

      border-radius: var(--radius-full);
      background: var(--color-warning);
      box-shadow: 0 0 8px var(--color-warning);
      animation: pulse-banner 2s infinite ease-in-out;
   }

   &__timer {
      color: var(--color-text-secondary);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
   }

   &__btn {
      border: 0;
      background: transparent;

      color: var(--color-warning);
      font-family: var(--font-sans);
      font-size: 11px;
      font-weight: var(--font-semibold);
      cursor: pointer;
      transition: all var(--duration-base) var(--ease-default);

      &:hover {
         color: #ffd28f;
         transform: translateX(3px);
      }
   }
}

.dashboard__body {
   display: flex;
   flex-direction: column;
   gap: var(--space-6);
   padding: var(--space-8);
}

.stats-row {
   display: grid;
   grid-template-columns: repeat(4, minmax(0, 1fr));
   gap: var(--space-4);
}

.stat-card {
   display: flex;
   height: 80px;
   flex-direction: column;
   justify-content: space-between;
   padding: 14px 18px;

   border: 1px solid rgba(255, 255, 255, 0.06);
   border-radius: 12px;
   background: var(--color-bg-tertiary);
   transition: all var(--duration-base) var(--ease-default);

   &:hover {
      border-color: rgba(108, 99, 255, 0.25);
      transform: translateY(-1px);
   }

   &__label {
      color: var(--color-text-secondary);
      font-size: 11px;
      font-weight: var(--font-semibold);
      letter-spacing: 0.6px;
      text-transform: uppercase;
   }

   &__bottom {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--space-3);
   }

   &__value {
      color: var(--color-text-primary);
      font-family: var(--font-mono);
      font-size: var(--text-lg);
      font-weight: var(--font-bold);

      &--accent {
         color: var(--color-accent);
      }

      &--profit {
         color: var(--color-profit);
      }
   }

   &__meta {
      display: flex;
      align-items: center;
      gap: var(--space-1);

      color: var(--color-text-muted);
      font-family: var(--font-mono);
      font-size: 11px;

      &--warning {
         color: var(--color-warning);
      }
   }
}

.activity-section {
   display: flex;
   flex-direction: column;
   gap: var(--space-4);
}

.section-header {
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: var(--space-4);

   &__left {
      display: flex;
      align-items: center;
      gap: var(--space-3);
   }

   &__title {
      color: var(--color-text-primary);
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
   }

   &__badge {
      padding: 2px 6px;

      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.03);

      color: var(--color-text-muted);
      font-size: 10px;
      font-weight: var(--font-semibold);
   }

   &__date {
      color: var(--color-text-muted);
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
   }
}

.activity-grid {
   display: grid;
   grid-template-columns: repeat(2, minmax(0, 1fr));
   gap: var(--space-4);
}

.activity-column {
   display: flex;
   flex-direction: column;
   gap: var(--space-3);
}

.timeline-entry {
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: var(--space-3);
   padding: var(--space-3) var(--space-4);

   border: 1px solid rgba(255, 255, 255, 0.06);
   border-left: 3px solid var(--color-border);
   border-radius: 6px;
   background: var(--color-bg-tertiary);
   transition: all var(--duration-base) var(--ease-default);

   &:hover {
      background: rgba(255, 255, 255, 0.01);
      transform: translateX(1px);
   }

   &--green {
      border-left-color: var(--color-profit);
   }

   &--red {
      border-left-color: var(--color-loss);
   }

   &--amber {
      border-left-color: var(--color-warning);
   }

   &--purple {
      border-left-color: var(--color-accent);
   }

   &--blue {
      border-left-color: var(--color-info);
   }

   &__left {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: var(--space-3);
   }

   &__time {
      width: 36px;
      flex-shrink: 0;

      color: var(--color-text-muted);
      font-family: var(--font-mono);
      font-size: 11px;
   }

   &__icon-box {
      display: flex;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;

      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.04);

      font-size: 10px;
   }

   &--green &__icon-box {
      background: rgba(61, 214, 140, 0.08);
      color: var(--color-profit);
   }

   &--red &__icon-box {
      background: rgba(255, 83, 112, 0.08);
      color: var(--color-loss);
   }

   &--amber &__icon-box {
      background: rgba(255, 181, 71, 0.08);
      color: var(--color-warning);
   }

   &--purple &__icon-box {
      background: rgba(108, 99, 255, 0.08);
      color: var(--color-accent);
   }

   &--blue &__icon-box {
      background: rgba(77, 184, 255, 0.08);
      color: var(--color-info);
   }

   &__info {
      display: flex;
      min-width: 0;
      flex-direction: column;
      gap: 2px;
   }

   &__title {
      color: var(--color-text-primary);
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
   }

   &__desc {
      overflow: hidden;

      color: var(--color-text-secondary);
      font-size: 11px;
      text-overflow: ellipsis;
      white-space: nowrap;
   }

   &__value {
      flex-shrink: 0;

      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
      text-align: right;

      &--profit {
         color: var(--color-profit);
      }

      &--loss {
         color: var(--color-loss);
      }

      &--warning {
         color: var(--color-warning);
      }

      &--muted {
         color: var(--color-text-muted);
      }
   }
}

.collapsed-block {
   overflow: hidden;

   border: 1px solid var(--color-border);
   border-radius: var(--radius-sm);
   background: var(--color-bg-tertiary);

   &__trigger {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      padding: 14px var(--space-5);

      border: 0;
      background: transparent;

      color: inherit;
      cursor: pointer;
      transition: background var(--duration-base) var(--ease-default);

      &:hover {
         background: rgba(255, 255, 255, 0.01);
      }
   }

   &__title {
      display: flex;
      align-items: center;
      gap: var(--space-2);

      color: var(--color-text-secondary);
      font-size: var(--text-xs);
      font-weight: var(--font-semibold);
   }

   &__arrow {
      color: var(--color-text-muted);
      font-size: 11px;
      transition: transform var(--duration-base) var(--ease-default);
   }

   &--open &__arrow {
      transform: rotate(180deg);
   }

   &__content {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 220px;
      gap: var(--space-8);
      padding: var(--space-5);

      border-top: 1px solid var(--color-border);
      background: rgba(15, 15, 19, 0.4);
   }

   &__stats {
      display: flex;
      align-items: center;
      gap: var(--space-6);
   }
}

.summary-metric {
   display: flex;
   flex-direction: column;
   gap: var(--space-1);

   &__label {
      color: var(--color-text-muted);
      font-size: 10px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
   }

   &__value {
      color: var(--color-text-primary);
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: var(--font-semibold);

      &--profit {
         color: var(--color-profit);
      }

      &--loss {
         color: var(--color-loss);
      }
   }
}

.mini-chart {
   display: flex;
   flex-direction: column;
   gap: var(--space-2);

   &__bars {
      display: flex;
      height: 48px;
      align-items: flex-end;
      justify-content: space-between;
      padding-bottom: var(--space-1);

      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
   }

   &__col {
      position: relative;

      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      gap: var(--space-1);
   }

   &__bar-container {
      display: flex;
      width: 100%;
      height: 36px;
      align-items: flex-end;
      justify-content: center;
   }

   &__bar {
      width: 6px;

      border-radius: var(--radius-full);
      background: var(--color-border);

      &--profit {
         background: var(--color-profit);
      }

      &--loss {
         background: var(--color-loss);
      }

      &--active {
         background: var(--color-accent);
      }
   }

   &__dot {
      position: absolute;
      top: -4px;

      width: 5px;
      height: 5px;

      border-radius: var(--radius-full);
      background: var(--color-accent);
      box-shadow: 0 0 8px var(--color-accent);
   }

   &__label {
      color: var(--color-text-muted);
      font-size: 9px;
      line-height: 1;
   }
}

@keyframes pulse-banner {
   0%,
   100% {
      opacity: 0.4;
      transform: scale(0.9);
   }

   50% {
      opacity: 1;
      transform: scale(1.1);
   }
}

@include lg {
   .stats-row,
   .activity-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
   }

   .collapsed-block__content {
      grid-template-columns: 1fr;
   }
}

@include md {
   .locations-grid { grid-template-columns: 1fr; }
   .urgent-banner {
      height: auto;
      flex-wrap: wrap;
      padding: var(--space-3) var(--space-4);
   }

   .dashboard__body {
      padding: var(--space-5);
   }

   .stats-row,
   .activity-grid {
      grid-template-columns: 1fr;
   }

   .section-header,
   .collapsed-block__stats {
      align-items: flex-start;
      flex-direction: column;
   }
}
</style>
