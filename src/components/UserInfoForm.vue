<template>
  <v-form
    ref="form"
    v-model="isFormValid"
    class="d-flex flex-column ga-2"
    @submit.prevent="updateUser"
  >
    <v-text-field
      v-model.number="user.age"
      label="Возраст"
      type="number"
      :rules="[rules.required]"
      :disabled="isDisabledInput"
      required
    />

    <v-text-field
      v-model.number="user.height"
      label="Рост"
      type="number"
      :rules="[rules.required]"
      :disabled="isDisabledInput"
      required
    />

    <v-text-field
      v-model.number="user.weight"
      label="Вес"
      type="number"
      :step="0.1"
      :rules="[rules.required]"
      :disabled="isDisabledInput"
      required
    />

    <v-select
      v-model.number="user.activity"
      label="Уровень активности"
      :items="activityLevels"
      item-title="level"
      item-value="value"
      :rules="[rules.required]"
      :disabled="isDisabledInput"
      required
    />

    <v-select
      v-if="!appUserStore.get()"
      v-model="user.gender"
      :items="genders"
      :rules="[(v) => rules.required(v?.toString())]"
      label="Пол"
      required
    />

    <template v-if="directEdit">
      <v-btn
        type="submit"
        variant="flat"
        color="primary"
        text="Подтвердить"
        :disabled="!isFormValid"
        hide-details
        block
      />
    </template>

    <template v-else-if="!isRetroactivelyEdit">
      <div>
        <v-btn
          :type="isActiveEdit ? 'button' : 'submit'"
          :variant="isActiveEdit ? 'flat' : 'tonal'"
          :prepend-icon="isActiveEdit ? mdiCheck : mdiPencil"
          class="mb-4"
          color="primary"
          :disabled="!isFormValid"
          hide-details
          block
          @click="isActiveEdit = !isActiveEdit"
        >
          {{ isActiveEdit ? 'Подтвердить' : 'Редактировать' }}
        </v-btn>

        <v-btn
          v-show="isActiveEdit"
          variant="tonal"
          :prepend-icon="mdiClose"
          class="mt-1"
          color="error"
          hide-details
          block
          @click="handleReset"
        >
          Отменить
        </v-btn>
      </div>
    </template>
  </v-form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { mdiCheck, mdiClose, mdiPencil } from '@mdi/js';
import dayjs from 'dayjs';
import { useCalendarStore } from '@/store/calendarStore';
import { appUserStore, useUserStore } from '@/store/userStore';

interface Props {
  // Редактирование формы без активации режима редактирования
  // (по умолчанию - редактирование заблокированно)
  directEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  directEdit: false,
});

const userStore = useUserStore();
const calendarStore = useCalendarStore();

const isFormValid = ref(false);
const isActiveEdit = ref(false);
const form = ref<HTMLFormElement | null>(null);
const user = reactive({ ...userStore.user });

// Функция редактивания пользовательких данных задним числом отключена
const isRetroactivelyEdit = computed(() =>
  dayjs(calendarStore.calendarDay.date).isBefore(dayjs(), 'day'),
);
const isDisabledInput = computed(() => !props.directEdit && !isActiveEdit.value);

const handleReset = () => {
  Object.assign(user, userStore.user);
  isActiveEdit.value = false;
};

const updateUser = async () => {
  if (!form.value) {
    return;
  }

  const { valid } = await form.value.validate();

  if (valid) {
    userStore.updateUser({ ...user });
  }
};

const rules = {
  required: (v: any) => !!v || 'Обязательно для заполнения',
};

const activityLevels = [
  { value: 1.2, level: 'Минимальная активность' },
  { value: 1.375, level: 'Cлабый уровень активности' },
  { value: 1.55, level: 'Умеренный уровень активности' },
  { value: 1.7, level: 'Тяжелая или трудоемкая активность' },
  { value: 1.9, level: 'Экстремальный уровень' },
];

const genders = [
  { title: 'Мужской', value: 0 },
  { title: 'Женский', value: 1 },
];
</script>
