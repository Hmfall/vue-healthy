<template>
  <v-card>
    <v-card-item>
      <v-row>
        <v-col
          order="6"
          order-md="1"
          align-self="center"
        >
          <v-list-item class="d-flex flex-column text-center pa-0">
            <template #prepend>
              <v-btn
                variant="tonal"
                class="mb-1"
                color="primary"
                :icon="mdiFoodAppleOutline"
                size="small"
              />
            </template>

            <v-list-item-title class="text-h6">
              {{ Math.round(usageKcal) }} ккал
            </v-list-item-title>

            <v-list-item-subtitle>Использованы</v-list-item-subtitle>
          </v-list-item>
        </v-col>
        <v-col
          order="1"
          order-md="6"
          cols="12"
          md="4"
          class="d-flex justify-center"
        >
          <v-progress-circular
            :color="remainingKcal < 0 ? 'error' : 'primary'"
            :width="6"
            :size="240"
            :rotate="360"
            :model-value="remainingKcalRatio"
          >
            <div class="d-flex flex-column align-center">
              <span class="text-center">
                <strong class="text-h4">
                  {{
                    remainingKcal < 0
                      ? Math.round(Math.abs(remainingKcal))
                      : Math.round(remainingKcal)
                  }}
                </strong>
                <br />
                ккал
                <br />
                {{ remainingKcal < 0 ? 'Свыше нормы' : 'Осталось' }}
              </span>
            </div>
          </v-progress-circular>
        </v-col>
        <v-col
          order="12"
          align-self="center"
        >
          <v-list-item class="d-flex flex-column text-center pa-0">
            <template #prepend>
              <v-btn
                variant="tonal"
                class="mb-1"
                color="secondary"
                :icon="mdiBullseyeArrow"
                size="small"
              />
            </template>

            <v-list-item-title class="text-h6">
              {{ Math.round(recommendedKcal) }} ккал
            </v-list-item-title>

            <v-list-item-subtitle>Цель</v-list-item-subtitle>
          </v-list-item>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-list-item class="d-flex justify-center text-center pa-0">
            <v-list-item class="text-h6">Углеводы</v-list-item>
            <v-list-item-subtitle>{{ calendarDay.summary.carbs }} г</v-list-item-subtitle>
          </v-list-item>
        </v-col>
        <v-col>
          <v-list-item class="d-flex justify-center text-center pa-0">
            <v-list-item class="text-h6">Белки</v-list-item>
            <v-list-item-subtitle>{{ calendarDay.summary.proteins }} г</v-list-item-subtitle>
          </v-list-item>
        </v-col>
        <v-col>
          <v-list-item class="d-flex justify-center text-center pa-0">
            <v-list-item class="text-h6">Жиры</v-list-item>
            <v-list-item-subtitle>{{ calendarDay.summary.fats }} г</v-list-item-subtitle>
          </v-list-item>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { mdiBullseyeArrow, mdiFoodAppleOutline } from '@mdi/js';
import { storeToRefs } from 'pinia';
import { useCalendarStore } from '@/store/calendarStore';

const { calendarDay } = storeToRefs(useCalendarStore());

const recommendedKcal = computed(() => calendarDay.value.recommendedCalories);
const usageKcal = computed(() => calendarDay.value.summary.calories);
const remainingKcal = computed(() => calendarDay.value.recommendedCalories - usageKcal.value);
const remainingKcalRatio = computed(
  () => 100 - ((recommendedKcal.value - usageKcal.value) / recommendedKcal.value) * 100,
);
</script>
