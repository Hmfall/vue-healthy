<template>
  <v-app-bar elevation="2">
    <v-app-bar-nav-icon>
      <v-menu
        location="top start"
        :close-on-content-click="false"
      >
        <template #activator="{ props }">
          <v-btn
            icon="$menu"
            variant="text"
            v-bind="props"
          />
        </template>

        <AppSettings />
      </v-menu>
    </v-app-bar-nav-icon>

    <v-app-bar-title>
      <div class="d-flex justify-center align-center">
        <span>{{ currentDate }}</span>
      </div>
    </v-app-bar-title>

    <template #append>
      <v-menu
        v-model="isCalendarVisible"
        location="top end"
        :close-on-content-click="false"
      >
        <template #activator="{ props }">
          <v-btn
            variant="text"
            icon="$calendar"
            v-bind="props"
          />
        </template>

        <v-date-picker
          v-model="date"
          :max="dayjs().toISOString()"
          rounded="lg"
          class="bg-surface"
          width="400"
          elevation="12"
          show-adjacent-months
          hide-header
        />
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useCalendarStore } from '@/store/calendarStore';
import AppSettings from '@/components/AppSettings.vue';
import useAppDate from '@/shared/utils/useAppDate';

const appDate = useAppDate();
const calendarStore = useCalendarStore();

const isCalendarVisible = ref(false);
const date = ref(dayjs().toDate());

const currentDate = computed(() => {
  if (appDate === calendarStore.calendarDay.date) {
    return `cегодня, ${dayjs(appDate).format('D MMMM')}`;
  }
  return dayjs(calendarStore.calendarDay.date).format('dddd, D MMMM');
});

watch(date, () => {
  calendarStore.setCalendarDay(useAppDate(date.value));
  isCalendarVisible.value = false;
});
</script>

<style scoped lang="scss">
.v-toolbar ::v-deep(.v-toolbar__content) {
  max-width: 992px;
  margin: 0 auto;
}
</style>
