import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useTheme } from 'vuetify';
import type { AppSetting, Theme } from '@/shared/types/app.types';
import useStorage from '@/shared/utils/useStorage';

const appSettingStore = useStorage<AppSetting>('settings');

export const useThemeStore = defineStore('theme', () => {
  const theme = useTheme();
  const themeValue = ref<Theme>(appSettingStore.get()?.theme || 'dark');
  const currentTheme = computed(() => themeValue.value);

  const initTheme = () => {
    theme.global.name.value = currentTheme.value;
  };

  const toggleTheme = (newTheme: Theme) => {
    themeValue.value = newTheme;
    theme.global.name.value = newTheme;
    appSettingStore.set({ theme: newTheme }, { merge: true });
  };

  return { initTheme, toggleTheme, currentTheme };
});
