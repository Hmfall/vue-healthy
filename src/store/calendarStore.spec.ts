import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useCalendarStore } from '@/store/calendarStore';
import type { CalendarDay, Product, ProductPerMeal } from '@/shared/types';

describe('Calendar Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should be select correct calendar day', () => {
    const calendarStore = useCalendarStore();

    calendarStore.calendar = {
      '20240420': {
        date: '20240420',
        meals: { breakfast: [], dinner: [], lunch: [] },
        summary: { calories: 0, proteins: 0, fats: 0, carbs: 0 },
        recommendedCalories: 0,
      },
    };

    calendarStore.setCalendarDay('20240421');

    const newCalendarDay: CalendarDay = {
      date: '20240421',
      meals: { breakfast: [], dinner: [], lunch: [] },
      summary: { calories: 0, proteins: 0, fats: 0, carbs: 0 },
      recommendedCalories: 0,
    };

    expect(calendarStore.calendar['20240421']).toEqual(newCalendarDay);
    expect(calendarStore.calendarDay).toEqual(newCalendarDay);
  });

  it('should be add product to meal and calculate summary correct', () => {
    const calendarStore = useCalendarStore();

    calendarStore.calendarDay = {
      date: '20240420',
      meals: { breakfast: [], dinner: [], lunch: [] },
      summary: { calories: 0, proteins: 0, fats: 0, carbs: 0 },
      recommendedCalories: 0,
    };

    const productA: Product = {
      name: 'productA',
      calories: 173,
      proteins: 32,
      fats: 56,
      carbs: 12,
    };

    const productB: Product = {
      name: 'productB',
      calories: 220,
      proteins: 24,
      fats: 85,
      carbs: 74,
    };

    const productMealA: ProductPerMeal = {
      id: expect.any(Number),
      weight: 250,
      name: 'productA',
      calories: 432.5,
      proteins: 80,
      fats: 140,
      carbs: 30,
    };

    const productMealB: ProductPerMeal = {
      id: expect.any(Number),
      weight: 440,
      name: 'productB',
      calories: 968,
      proteins: 105.6,
      fats: 374,
      carbs: 325.6,
    };

    calendarStore.addProductToMeal(productA, 250, 'breakfast');

    expect(calendarStore.calendarDay).toEqual({
      date: '20240420',
      meals: {
        breakfast: expect.arrayContaining([productMealA]),
        dinner: [],
        lunch: [],
      },
      summary: {
        calories: 432.5,
        proteins: 80,
        fats: 140,
        carbs: 30,
      },
      recommendedCalories: 0,
    });

    calendarStore.addProductToMeal(productB, 440, 'dinner');

    expect(calendarStore.calendarDay).toEqual({
      date: '20240420',
      meals: {
        breakfast: expect.arrayContaining([productMealA]),
        dinner: expect.arrayContaining([productMealB]),
        lunch: [],
      },
      summary: {
        calories: 1400.5,
        proteins: 185.6,
        fats: 514,
        carbs: 355.6,
      },
      recommendedCalories: 0,
    });
  });

  it('should be remove product from meal and calculate summary correct', () => {
    const calendarStore = useCalendarStore();

    const productMealA: ProductPerMeal = {
      id: expect.any(Number),
      weight: 250,
      name: 'productA',
      calories: 432.5,
      proteins: 80,
      fats: 140,
      carbs: 30,
    };

    const productMealB: ProductPerMeal = {
      id: expect.any(Number),
      weight: 440,
      name: 'productB',
      calories: 968,
      proteins: 105.6,
      fats: 374,
      carbs: 325.6,
    };

    calendarStore.calendarDay = {
      date: '20240420',
      meals: {
        breakfast: [productMealA, productMealB],
        dinner: [],
        lunch: [],
      },
      summary: {
        calories: 1400.5,
        proteins: 185.6,
        fats: 514,
        carbs: 355.6,
      },
      recommendedCalories: 0,
    };

    calendarStore.removeProductFromMeal(productMealA, 'breakfast');

    expect(calendarStore.calendarDay).toEqual({
      date: '20240420',
      meals: {
        breakfast: expect.arrayContaining([productMealA]),
        dinner: [],
        lunch: [],
      },
      summary: {
        calories: 968,
        proteins: 105.6,
        fats: 374,
        carbs: 325.6,
      },
      recommendedCalories: 0,
    });
  });

  it('should be generate summary date range correct', () => {
    const calendarStore = useCalendarStore();

    calendarStore.calendar = {
      '20240410': {
        date: '20240410',
        meals: { breakfast: [], dinner: [], lunch: [] },
        summary: { calories: 1200, proteins: 34, fats: 36, carbs: 38 },
        recommendedCalories: 2100,
      },
      '20240411': {
        date: '20240411',
        meals: { breakfast: [], dinner: [], lunch: [] },
        summary: { calories: 1400, proteins: 12, fats: 14, carbs: 16 },
        recommendedCalories: 2100,
      },
      '20240412': {
        date: '20240412',
        meals: { breakfast: [], dinner: [], lunch: [] },
        summary: { calories: 1600, proteins: 42, fats: 44, carbs: 46 },
        recommendedCalories: 2100,
      },
      '20240414': {
        date: '20240414',
        meals: { breakfast: [], dinner: [], lunch: [] },
        summary: { calories: 1800, proteins: 62, fats: 64, carbs: 66 },
        recommendedCalories: 2200,
      },
      '20240418': {
        date: '20240418',
        meals: { breakfast: [], dinner: [], lunch: [] },
        summary: { calories: 2000, proteins: 10, fats: 20, carbs: 40 },
        recommendedCalories: 2200,
      },
    };

    const summaryDateRange = calendarStore.summaryDateRange([
      '20240410',
      '20240411',
      '20240412',
      '20240413',
      '20240414',
      '20240415',
      '20240416',
      '20240417',
      '20240418',
      '20240419',
      '20240420',
    ]);

    expect(summaryDateRange).toEqual({
      summaryDateRange: [
        {
          date: '20240410',
          calories: { usage: 1200, recommended: 2100 },
          proteins: 34,
          fats: 36,
          carbs: 38,
        },
        {
          date: '20240411',
          calories: { usage: 1400, recommended: 2100 },
          proteins: 12,
          fats: 14,
          carbs: 16,
        },
        {
          date: '20240412',
          calories: { usage: 1600, recommended: 2100 },
          proteins: 42,
          fats: 44,
          carbs: 46,
        },
        {
          date: '20240413',
          calories: { usage: 0, recommended: 0 },
          proteins: 0,
          fats: 0,
          carbs: 0,
        },
        {
          date: '20240414',
          calories: { usage: 1800, recommended: 2200 },
          proteins: 62,
          fats: 64,
          carbs: 66,
        },
        {
          date: '20240415',
          calories: { usage: 0, recommended: 0 },
          proteins: 0,
          fats: 0,
          carbs: 0,
        },
        {
          date: '20240416',
          calories: { usage: 0, recommended: 0 },
          proteins: 0,
          fats: 0,
          carbs: 0,
        },
        {
          date: '20240417',
          calories: { usage: 0, recommended: 0 },
          proteins: 0,
          fats: 0,
          carbs: 0,
        },
        {
          date: '20240418',
          calories: { usage: 2000, recommended: 2200 },
          proteins: 10,
          fats: 20,
          carbs: 40,
        },
        {
          date: '20240419',
          calories: { usage: 0, recommended: 0 },
          proteins: 0,
          fats: 0,
          carbs: 0,
        },
        {
          date: '20240420',
          calories: { usage: 0, recommended: 0 },
          proteins: 0,
          fats: 0,
          carbs: 0,
        },
      ],
      summary: { calories: 8000, proteins: 160, fats: 178, carbs: 206 },
    });
  });
});
