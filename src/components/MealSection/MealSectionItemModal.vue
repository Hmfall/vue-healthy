<template>
  <v-card>
    <v-card-item class="pb-1">
      <v-card-title>{{ props.meal.label }}</v-card-title>

      <template #append>
        <v-chip
          variant="outlined"
          class="w-100 flex-center"
        >
          {{ Math.round(caloriesPerMeal) }} ккал
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
        @click="emit('close')"
      >
        Готово
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { mdiMagnify, mdiPlusCircle } from '@mdi/js';
import { useCalendarStore } from '@/store/calendarStore';
import { useProductStore } from '@/store/pruductStore/pruductStore';
import type { Meal } from '@/shared/types/calendar.types';
import type { Product } from '@/shared/types/product.types';

interface Props {
  meal: Meal;
  caloriesPerMeal: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const productStore = useProductStore();
const calendarStore = useCalendarStore();

const filteredProducts = computed(() => {
  if (searchQuery.value) {
    return productStore.products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase().trim()),
    );
  }
  return productStore.products;
});

const searchQuery = ref('');
const productWeights = ref(
  Object.fromEntries(productStore.products.map((item) => [item.name, 100])),
);

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
</script>
