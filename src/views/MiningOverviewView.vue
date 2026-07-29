<template>
   <div class="mining-overview">
      <section class="mining-overview__hero">
         <span>Mining operations</span>
         <h1>Mining Center</h1>
         <p>Build your hardware fleet, assign equipment to farms, and optimize every watt.</p>
         <RouterLink :to="{ name: 'mining-inventory' }">Open Inventory <i class="fa-solid fa-arrow-right"></i></RouterLink>
      </section>
      <section class="mining-overview__cards">
         <article><i class="fa-solid fa-boxes-stacked"></i><div><strong>Equipment Inventory</strong><small>Review hardware, condition, status, and value.</small></div></article>
         <article><i class="fa-solid fa-server"></i><div><strong>Mining Farms</strong><small>Farm management will be available in the next stage.</small></div></article>
         <article><i class="fa-solid fa-chart-line"></i><div><strong>Performance</strong><small>Detailed mining analytics are coming soon.</small></div></article>
      </section>
   </div>
</template>

<style scoped lang="scss">
.mining-overview { display:grid;gap:16px;padding:24px 32px; }
.mining-overview__hero { padding:28px;border:1px solid var(--color-border);border-radius:var(--radius-lg);background:radial-gradient(circle at 80% 10%,rgba(108,99,255,.17),transparent 38%),var(--color-bg-tertiary); }
.mining-overview__hero>span{color:var(--color-accent);font-size:9px;font-weight:var(--font-bold);letter-spacing:.12em;text-transform:uppercase;}.mining-overview__hero h1{margin-top:5px;font-size:var(--text-2xl);}.mining-overview__hero p{max-width:520px;margin-top:7px;color:var(--color-text-secondary);font-size:11px;}.mining-overview__hero a{display:inline-flex;align-items:center;gap:7px;margin-top:20px;padding:8px 12px;border-radius:var(--radius-sm);background:var(--color-accent);color:#fff;font-size:10px;font-weight:var(--font-bold);}
.mining-overview__cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}.mining-overview__cards article{display:flex;gap:12px;padding:16px;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-bg-tertiary);}.mining-overview__cards i{color:var(--color-accent);}.mining-overview__cards div{display:grid;}.mining-overview__cards strong{font-size:11px;}.mining-overview__cards small{color:var(--color-text-secondary);font-size:9px;}
@include lg{.mining-overview__cards{grid-template-columns:1fr;}}@include md{.mining-overview{padding:16px 12px;}}
</style>
