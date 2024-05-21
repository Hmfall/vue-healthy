<template>
  <v-card
    min-width="405"
    elevation="12"
  >
    <v-card-item class="mb-3">
      <v-card-title class="mb-4">Пользователь</v-card-title>

      <UserInfoForm />
    </v-card-item>

    <v-divider />

    <v-card-item>
      <v-card-title class="mb-2">Тема</v-card-title>

      <v-btn-toggle
        v-model="theme"
        class="w-100"
        color="primary"
        variant="outlined"
        divided
        mandatory
        group
      >
        <v-btn
          class="w-50"
          prepend-icon="$weatherBalanceSunny"
          value="light"
        >
          Светлая
        </v-btn>

        <v-btn
          class="w-50"
          prepend-icon="$weatherNight"
          value="dark"
        >
          Темная
        </v-btn>
      </v-btn-toggle>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useThemeStore } from '@/store/themeStore';
import UserInfoForm from '@/components/UserInfoForm.vue';

const themeStore = useThemeStore();

const theme = ref(themeStore.currentTheme);

watch(theme, () => themeStore.toggleTheme(theme.value));
</script>
