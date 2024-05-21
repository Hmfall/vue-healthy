<template>
  <v-app>
    <v-layout>
      <AppHeader />

      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>

      <AppNavigation />

      <v-dialog
        v-model="isInvalidUserInfo"
        max-width="420"
        persistent
      >
        <v-card>
          <v-card-item class="text-center pb-0">
            <v-icon
              size="50"
              icon="$account"
            />
          </v-card-item>

          <v-card-item class="text-center pt-2">
            <span>Привет! <br />Введите свои персональные данные</span>
          </v-card-item>

          <v-card-item class="mb-4">
            <UserInfoForm
              class="mt-2"
              direct-edit
            />
          </v-card-item>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { appCalendarStore, useCalendarStore } from '@/store/calendarStore';
import { useProductStore } from '@/store/pruductStore/pruductStore';
import { useThemeStore } from '@/store/themeStore';
import { useUserStore } from '@/store/userStore';
import AppHeader from '@/components/AppHeader.vue';
import AppNavigation from '@/components/AppNavigation.vue';
import UserInfoForm from '@/components/UserInfoForm.vue';
import { objectKeys } from '@/shared/types/utils';
import useAppDate from '@/shared/utils/useAppDate';

const appDate = useAppDate();
const userStore = useUserStore();
const productStore = useProductStore();
const calendarStore = useCalendarStore();
const themeStore = useThemeStore();

themeStore.initTheme();
productStore.fetchProducts();
calendarStore.setCalendarDay(appDate);

const isInvalidUserInfo = computed(() =>
  objectKeys(userStore.user).every((key) => userStore.user[key] === null),
);

watch(
  () => userStore.user,
  () => {
    // При изменении пользовательских данных происходит перерасчет кол-ва реком. калорий для сегодняшней
    // даты (для всех последующих дат будет использоваться пересчитанное кол-во калорий, более ранние
    // даты не затрагиваются)
    calendarStore.calendar[useAppDate()].recommendedCalories = userStore.recommendedCalories;
    appCalendarStore.set(calendarStore.calendar);
  },
);
</script>
