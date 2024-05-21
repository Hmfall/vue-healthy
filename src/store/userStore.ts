import { defineStore } from 'pinia';
import type { User } from '@/shared/types';
import useStorage from '@/shared/utils/useStorage';

interface State {
  user: User;
}

export const appUserStore = useStorage<User>('user');

export const useUserStore = defineStore('user', {
  state: (): State => ({
    user: appUserStore.get() || {
      age: null,
      height: null,
      weight: null,
      activity: null,
      gender: null,
    },
  }),
  getters: {
    recommendedCalories(state) {
      const {
        user: { weight, height, age, activity, gender },
      } = state;

      if (!weight || !height || !age || !activity || gender === null) {
        return 0;
      }

      const base = 10 * weight + 6.25 * height - 5 * age;

      // gender (Nullable<number>) как свойство интерфейса User представлен в приложении
      // в виде 0 (мужчина) и 1 (женщина), в данном случае используется как boolean значение
      return Math.ceil(gender ? (base - 161) * activity : (base + 5) * activity);
    },
  },
  actions: {
    updateUser(user: User) {
      this.user = user;
      appUserStore.set(user);
    },
  },
});
