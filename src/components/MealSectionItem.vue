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
            :icon="mappedMealValues[props.meal.value].icon"
            :color="mappedMealValues[props.meal.value].color"
          />
        </template>

        <v-list-item-title class="text-h6">{{ props.meal.label }}</v-list-item-title>

        <v-list-item-subtitle>{{ Math.round(caloriesPerMeal.calories) }} ккал</v-list-item-subtitle>

        <template #append>
          <v-dialog max-width="600">
            <template #activator="{ props: activatorProps }">
              <div class="flex-center">
                <v-btn
                  v-bind="activatorProps"
                  variant="tonal"
                  color="primary"
                  :icon="mdiPlusCircle"
                />
              </div>
            </template>

            <template #default="{ isActive }">
              <v-card>
                <v-card-item class="pb-1">
                  <v-card-title>{{ props.meal.label }}</v-card-title>

                  <template #append>
                    <v-chip
                      variant="outlined"
                      class="w-100 flex-center"
                    >
                      {{ Math.round(caloriesPerMeal.calories) }} ккал
                    </v-chip>
                  </template>
                </v-card-item>

                <v-card-item class="pb-1">
                  <v-text-field
                    v-model="searchQuery"
                    density="comfortable"
                    placeholder="Поиск"
                    hide-details
                  >
                    <template #prepend-inner>
                      <v-icon :icon="mdiMagnify" />
                    </template>
                  </v-text-field>
                </v-card-item>

                <v-card-item class="mb-4">
                  <v-virtual-scroll
                    :height="450"
                    :items="filteredProducts"
                  >
                    <template #default="{ item }: { item: Product }">
                      <v-list-item class="pl-0 pr-1 pb-2">
                        <template #prepend>
                          <v-sheet width="80">
                            <v-text-field
                              v-model.number="productWeights[item.name]"
                              density="compact"
                              type="number"
                              hide-spin-buttons
                              hide-details
                            >
                              <template #append-inner>г</template>
                            </v-text-field>
                          </v-sheet>
                        </template>

                        <v-list-item :title="item.name">
                          <v-list-item-subtitle class="d-flex align-center">
                            <v-sheet
                              tag="span"
                              width="8"
                              height="8"
                              class="mr-1"
                              :class="getCaloriesStatusColor(item.calories)"
                              rounded
                            />
                            <span>{{ item.calories }} ккал</span>
                          </v-list-item-subtitle>
                        </v-list-item>

                        <template #append>
                          <v-btn
                            variant="text"
                            color="primary"
                            :icon="mdiPlusCircle"
                            @click="handleAddProductToMeal(item)"
                          />
                        </template>
                      </v-list-item>
                    </template>
                  </v-virtual-scroll>
                </v-card-item>

                <v-card-actions>
                  <v-spacer />

                  <v-btn
                    variant="text"
                    color="primary"
                    @click="isActive.value = false"
                  >
                    Готово
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
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
                :icon="mdiMinusCircle"
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
import {
  mdiMagnify,
  mdiMinusCircle,
  mdiPlusCircle,
  mdiWeatherSunny,
  mdiWeatherSunset,
  mdiWeatherSunsetUp,
} from '@mdi/js';
import { useCalendarStore } from '@/store/calendarStore';
import { useProductStore } from '@/store/pruductStore/pruductStore';
import type { Meal, MealValues, ProductPerMeal } from '@/shared/types/calendar.types';
import type { Product } from '@/shared/types/product.types';

interface Props {
  meal: Meal;
}

const props = defineProps<Props>();

const productStore = useProductStore();
const calendarStore = useCalendarStore();

const searchQuery = ref('');
const isActiveEdit = ref(false);
const productWeights = ref(
  Object.fromEntries(productStore.products.map((item) => [item.name, 100])),
);

const productsPerMeal = computed(() => calendarStore.calendarDay.meals[props.meal.value]);
const filteredProducts = computed(() => {
  if (searchQuery.value) {
    return productStore.products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  }
  return productStore.products;
});
const caloriesPerMeal = computed(() => {
  return calendarStore.calendarDay.meals[props.meal.value].reduce(
    (acc, product) => {
      acc.calories += product.calories;
      return acc;
    },
    { calories: 0 },
  );
});

const handleRemoveProductFromMeal = (product: ProductPerMeal) => {
  calendarStore.removeProductFromMeal(product, props.meal.value);
};

const handleAddProductToMeal = (product: Product) => {
  calendarStore.addProductToMeal(product, productWeights.value[product.name], props.meal.value);
  productWeights.value[product.name] = 100;
};

const getCaloriesStatusColor = (calories: number) => {
  if (calories > 200) {
    return 'bg-red-accent-4';
  } else if (calories > 100) {
    return 'bg-deep-orange-lighten-1';
  } else {
    return 'bg-green-darken-1';
  }
};

watch(
  [() => productsPerMeal.value.length, () => calendarStore.calendarDay],
  ([mealProductsLength, calendarDay], [_, prevCalendarDay]) => {
    if (mealProductsLength === 0 || calendarDay !== prevCalendarDay) {
      isActiveEdit.value = false;
    }
  },
);

const mappedMealValues: Record<MealValues, { icon: string; color: string }> = {
  breakfast: {
    icon: mdiWeatherSunsetUp,
    color: 'yellow-accent-4',
  },
  lunch: {
    icon: mdiWeatherSunny,
    color: 'light-blue-darken-3',
  },
  dinner: {
    icon: mdiWeatherSunset,
    color: 'orange-darken-3',
  },
};
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
