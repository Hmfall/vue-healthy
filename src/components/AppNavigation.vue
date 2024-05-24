<template>
  <v-bottom-navigation
    v-model="currentRoute"
    class="position-fixed"
    color="primary"
    mandatory
    grow
  >
    <v-btn
      v-for="item in navigationItems"
      :key="item.value"
      :value="item.value"
    >
      <v-icon
        :icon="item.icon"
        class="mb-2"
      />

      <span>{{ item.title }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { AppNavigationItem } from '@/shared/types';

const route = useRoute();
const router = useRouter();

const currentRoute = ref(route.name || 'Home');

watch(currentRoute, () => router.push({ name: currentRoute.value }));

const navigationItems: AppNavigationItem[] = [
  {
    value: 'Home',
    title: 'Дневник',
    icon: '$forkKnife',
  },
  {
    value: 'Stats',
    title: 'Дневник',
    icon: '$chart',
  },
  {
    value: 'Catalog',
    title: 'Справочник',
    icon: '$notebook',
  },
];
</script>
