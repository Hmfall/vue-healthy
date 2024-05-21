<template>
  <v-expansion-panels
    v-model="panel"
    multiple
  >
    <template
      v-for="meal in meals"
      :key="meal.value"
    >
      <MealSectionItem :meal="meal" />
    </template>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCalendarStore } from '@/store/calendarStore';
import MealSectionItem from '@/components/MealSection/MealSectionItem.vue';
import type { Meal } from '@/shared/types';

const calendarStore = useCalendarStore();

const panel = ref();

watch(
  () => calendarStore.calendarDay,
  () => (panel.value = []),
);

const meals: Meal[] = [
  {
    value: 'breakfast',
    label: 'Завтрак',
  },
  {
    value: 'lunch',
    label: 'Обед',
  },
  {
    value: 'dinner',
    label: 'Ужин',
  },
];
</script>
