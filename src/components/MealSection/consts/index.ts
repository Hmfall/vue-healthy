import type { Meal, MealValues } from '@/shared/types';

export const meals: Meal[] = [
  {
    value: 'breakfast',
    title: 'Завтрак',
  },
  {
    value: 'lunch',
    title: 'Обед',
  },
  {
    value: 'dinner',
    title: 'Ужин',
  },
];

export const mealValues: Record<MealValues, { icon: string; color: string }> = {
  breakfast: {
    icon: '$weatherSunUp',
    color: 'yellow-accent-4',
  },
  lunch: {
    icon: '$weatherSunny',
    color: 'light-blue-darken-3',
  },
  dinner: {
    icon: '$weatherSunSet',
    color: 'orange-darken-3',
  },
};
