<template>
  <v-bottom-navigation
    v-model="currentRoute"
    class="position-fixed"
    color="primary"
    mandatory
    grow
  >
    <v-btn value="Home">
      <v-icon
        :icon="mdiSilverwareForkKnife"
        class="mb-2"
      />

      <span>Дневник</span>
    </v-btn>

    <v-btn value="Stats">
      <v-icon
        :icon="mdiChartBar"
        class="mb-2"
      />

      <span>Отчеты</span>
    </v-btn>

    <v-btn value="Catalog">
      <v-icon
        :icon="mdiNotebook"
        class="mb-2"
      />

      <span>Справочник</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { mdiChartBar, mdiNotebook, mdiSilverwareForkKnife } from '@mdi/js';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const currentRoute = ref(route.name || 'Home');

watch(currentRoute, () => router.push({ name: currentRoute.value }));
</script>
