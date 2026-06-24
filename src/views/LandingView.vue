<script setup lang="ts">
   import LandingCta from '@/features/landing/components/LandingCta.vue';
   import LandingFaq from '@/features/landing/components/LandingFaq.vue';
   import LandingFeatures from '@/features/landing/components/LandingFeatures.vue';
   import LandingFooter from '@/features/landing/components/LandingFooter.vue';
   import LandingHeader from '@/features/landing/components/LandingHeader.vue';
   import LandingHero from '@/features/landing/components/LandingHero.vue';
   import LandingHowItWorks from '@/features/landing/components/LandingHowItWorks.vue';
   import LandingLeaderboard from '@/features/landing/components/LandingLeaderboard.vue';
   import LandingLearnPlaying from '@/features/landing/components/LandingLearnPlaying.vue';
   import LandingPath from '@/features/landing/components/LandingPath.vue';
   import LandingStats from '@/features/landing/components/LandingStats.vue';
   import LandingTestimonials from '@/features/landing/components/LandingTestimonials.vue';
</script>

<template>
   <div class="landing">
      <LandingHeader />
      <LandingHero />
      <LandingHowItWorks />
      <LandingStats />
      <LandingFeatures />
      <LandingPath />
      <LandingLearnPlaying />
      <LandingLeaderboard />
      <LandingTestimonials />
      <LandingFaq />
      <LandingCta />
      <LandingFooter />
   </div>
</template>

<style scoped lang="scss">

</style>
