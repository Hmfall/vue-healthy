<template>
  <v-expansion-panel>
    <v-expansion-panel-title
      class="py-6"
      hide-actions
    >
      <v-list-item class="w-100 pa-0">
        <template #prepend>
          <v-icon
            size="50"
            :icon="mealValues[meal.value].icon"
            :color="mealValues[meal.value].color"
          />
        </template>

        <v-list-item-title class="text-h6">{{ meal.title }}</v-list-item-title>

        <v-list-item-subtitle>{{ Math.round(caloriesPerMeal) }} ккал</v-list-item-subtitle>

        <template #append>
          <v-btn
            variant="tonal"
            color="primary"
            icon
          >
            <v-icon icon="$plusCircle" />

            <v-dialog
              activator="parent"
              max-width="600"
            >
              <template #default="{ isActive }">
                <MealSectionItemModal
                  :meal="meal"
                  :calories-per-meal="caloriesPerMeal"
                  @close="isActive.value = false"
                />
              </template>
            </v-dialog>
          </v-btn>
        </template>
      </v-list-item>
    </v-expansion-panel-title>

    <v-expansion-panel-text>
      <v-list
        v-if="productsPerMeal.length"
        density="compact"
      >
        <v-list-item
          v-for="product in productsPerMeal"
          :key="product.name"
          class="px-0"
        >
          <template #prepend>
            <span>{{ product.name }}, {{ product.weight }} г</span>
          </template>

          <div class="px-2 mt-4">
            <v-divider color="grey-darken-2" />
          </div>

          <template #append>
            <div>
              <span>{{ Math.round(product.calories) }} ккал</span>
              <v-icon
                v-show="isActiveEdit"
                class="ml-2 mr-2 cursor-pointer"
                icon="$minusCircle"
                color="error"
                @click="handleRemoveProductFromMeal(product)"
              />
            </div>
          </template>
        </v-list-item>
      </v-list>

      <span
        v-else
        class="text-info"
      >
        Список продуктов пуст
      </span>

      <div
        v-if="productsPerMeal.length"
        class="d-flex"
      >
        <v-spacer />

        <v-sheet width="160">
          <v-btn
            :variant="isActiveEdit ? 'flat' : 'tonal'"
            color="primary"
            block
            @click="isActiveEdit = !isActiveEdit"
          >
            {{ isActiveEdit ? 'Готово' : 'Редактировать' }}
          </v-btn>
        </v-sheet>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useCalendarStore } from '@/store/calendarStore';
import { mealValues } from '@/components/MealSection/consts';
import MealSectionItemModal from '@/components/MealSection/MealSectionItemModal.vue';
import type { Meal, ProductPerMeal } from '@/shared/types';

interface Props {
  meal: Meal;
}

const props = defineProps<Props>();

const calendarStore = useCalendarStore();

const isActiveEdit = ref(false);

const productsPerMeal = computed(() => calendarStore.calendarDay.meals[props.meal.value]);
const caloriesPerMeal = computed(() => {
  return calendarStore.calendarDay.meals[props.meal.value].reduce<number>((acc, product) => {
    acc += product.calories;
    return acc;
  }, 0);
});

const handleRemoveProductFromMeal = (product: ProductPerMeal) => {
  calendarStore.removeProductFromMeal(product, props.meal.value);
};

watch(
  [() => productsPerMeal.value.length, () => calendarStore.calendarDay],
  ([mealProductsLength, calendarDay], [_, prevCalendarDay]) => {
    if (mealProductsLength === 0 || calendarDay !== prevCalendarDay) {
      isActiveEdit.value = false;
    }
  },
);
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.15);
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.4);
}
</style>
