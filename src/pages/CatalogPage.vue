<template>
  <v-card>
    <v-card-item class="d-flex justify-space-between flex-column flex-sm-row mb-2">
      <v-card-title class="mb-3 mb-sm-0">Список продуктов</v-card-title>

      <template #append>
        <v-dialog max-width="600">
          <template #default="{ isActive }">
            <div class="overflow-auto">
              <v-snackbar
                v-model="isSnackbarVisible"
                timeout="2000"
                location="top"
              >
                Успешно добавлено
              </v-snackbar>

              <v-form
                ref="form"
                v-model="isFormValid"
                validate-on="blur"
                @submit.prevent="handleAddProduct"
              >
                <v-card width="520">
                  <v-card-item>
                    <v-card-title>Добавить продукт</v-card-title>

                    <template #append>
                      <v-btn
                        variant="text"
                        :icon="mdiClose"
                        @click="isActive.value = false"
                      />
                    </template>
                  </v-card-item>

                  <v-card-item class="pb-0">
                    <div class="mt-1">
                      <v-text-field
                        v-model="product.name"
                        class="mb-4"
                        label="Название"
                        :rules="[rules.required]"
                        required
                      />

                      <v-text-field
                        v-model.number="product.calories"
                        class="mb-4"
                        label="Калории (г)"
                        :rules="[rules.required, rules.notNull]"
                        type="number"
                        required
                      />

                      <v-text-field
                        v-model.number="product.proteins"
                        class="mb-4"
                        label="Белки (г)"
                        :rules="[rules.required]"
                        type="number"
                        required
                      />

                      <v-text-field
                        v-model.number="product.fats"
                        class="mb-4"
                        label="Жиры (г)"
                        :rules="[rules.required]"
                        type="number"
                        required
                      />

                      <v-text-field
                        v-model.number="product.carbs"
                        class="mb-4"
                        label="Углеводы (г)"
                        :rules="[rules.required]"
                        type="number"
                        required
                      />
                    </div>
                  </v-card-item>

                  <v-card-actions class="pt-0">
                    <v-spacer />

                    <v-btn
                      type="submit"
                      variant="text"
                      color="primary"
                    >
                      Добавить
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </div>
          </template>

          <template #activator="{ props: activatorProps }">
            <v-btn
              variant="tonal"
              color="primary"
              :prepend-icon="mdiPlus"
              v-bind="activatorProps"
            >
              Добавить продукт
            </v-btn>
          </template>
        </v-dialog>
      </template>
    </v-card-item>

    <v-card-item>
      <v-text-field
        v-model="searchQuery"
        class="mb-4"
        label="Поиск"
        :prepend-inner-icon="mdiMagnify"
        hide-details
        single-line
      />
    </v-card-item>

    <v-card-item>
      <v-data-table
        filter-keys="name"
        :search="searchQuery"
        :headers="tableHeaders"
        :items="productStore.products"
        :items-per-page-options="tableItemsPerPageOptions"
      />
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { mdiClose, mdiMagnify, mdiPlus } from '@mdi/js';
import { useProductStore } from '@/store/pruductStore/pruductStore';
import type { Product } from '@/shared/types/product.types';

const productStore = useProductStore();

const initialProduct: Product = {
  name: '',
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
};

const searchQuery = ref('');
const isFormValid = ref(false);
const isSnackbarVisible = ref(false);
const form = ref<HTMLFormElement | null>(null);
const product = reactive({ ...initialProduct });

const handleAddProduct = async () => {
  if (!form.value) {
    return;
  }

  const { valid } = await form.value.validate();

  if (valid) {
    isSnackbarVisible.value = true;
    productStore.addProduct({ ...product });
    Object.assign(product, initialProduct);
  }
};

const rules = {
  required: (v: any) => v !== '' || 'Обязательно для заполнения',
  notNull: (v: any) => v > 0 || 'Некорректное значение',
};

const tableHeaders = [
  { title: 'Продукты', key: 'name', width: '60%' },
  { title: 'Калории (ккал)', key: 'calories' },
  { title: 'Белки (г)', key: 'proteins' },
  { title: 'Жиры (г)', key: 'fats' },
  { title: 'Углеводы (г)', key: 'carbs' },
];

const tableItemsPerPageOptions = [
  { value: 15, title: '15' },
  { value: 25, title: '25' },
  { value: 50, title: '50' },
];
</script>
