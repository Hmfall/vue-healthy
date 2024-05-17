<template>
  <div class="d-flex flex-column ga-6">
    <SummarySection />
    <MealSection />
  </div>
</template>

<script setup lang="ts">
import MealSection from '@/components/MealSection/MealSection.vue';
import SummarySection from '@/components/SummarySection.vue';
</script>
