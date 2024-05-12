import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { defineStore } from 'pinia';
import { useUserStore } from '@/store/userStore';
import type {
  AppDate,
  Calendar,
  CalendarDay,
  MealValues,
  ProductPerMeal,
  SummaryPerDate,
} from '@/shared/types/calendar.types';
import type { Product, Summary } from '@/shared/types/product.types';
import { objectKeys } from '@/shared/types/utils';
import useAppDate from '@/shared/utils/useAppDate';
import useStorage from '@/shared/utils/useStorage';

dayjs.extend(isSameOrAfter);

interface State {
  calendar: Calendar;
  calendarDay: CalendarDay;
}

export const appCalendarStore = useStorage<Calendar>('calendar');

export const useCalendarStore = defineStore('calendar', {
  state: (): State => {
    // При первом запуске приложения (в случае наличия экземпляра календаря в хранилище используется
    // значение из хранилища) устанавливается сalendarDay с пустыми значениями, далее, после инициализации
    // userStore и заполнения пользовательких данных, происходит вызов calendarStore.setCalendarDay
    // с корректным значением реком. кол-ва калорий
    const appDate = useAppDate();
    const appCalendar = appCalendarStore.get();

    const initCalendarDay: CalendarDay = {
      date: appDate,
      meals: { breakfast: [], dinner: [], lunch: [] },
      summary: { calories: 0, proteins: 0, fats: 0, carbs: 0 },
      recommendedCalories: 0,
    };

    const calendar = appCalendar || {
      [appDate]: initCalendarDay,
    };

    if (!appCalendar) {
      appCalendarStore.set(calendar);
    }

    return {
      calendar,
      calendarDay: calendar[appDate],
    };
  },
  getters: {
    summaryDateRange(state) {
      return (dates: AppDate[]) => {
        // Получение summary (БЖУ, калории) для каждой даты в переданном диапазоне, при отсутствии
        // конкретной даты в календаре - пустые значения (требуется для корректного отображения графика)
        const dateRange = dates.reduce<SummaryPerDate[]>((acc, date) => {
          const calendarDay = state.calendar[date];

          if (calendarDay) {
            acc.push({
              date: calendarDay.date,
              ...calendarDay.summary,
              calories: {
                usage: calendarDay.summary.calories,
                recommended: calendarDay.recommendedCalories,
              },
            });
          } else {
            acc.push({
              date,
              calories: { usage: 0, recommended: 0 },
              proteins: 0,
              fats: 0,
              carbs: 0,
            });
          }

          return acc;
        }, []);

        // Подсчет общего кол-ва калорий, БЖУ за переданный диапазон
        const summary = dateRange.reduce<Summary>(
          (acc, cur) => ({
            calories: parseFloat((acc.calories + cur.calories.usage).toFixed(1)),
            proteins: parseFloat((acc.proteins + cur.proteins).toFixed(1)),
            fats: parseFloat((acc.fats + cur.fats).toFixed(1)),
            carbs: parseFloat((acc.carbs + cur.carbs).toFixed(1)),
          }),
          { calories: 0, proteins: 0, fats: 0, carbs: 0 },
        );

        return {
          summaryDateRange: dateRange,
          summary,
        };
      };
    },
  },
  actions: {
    setCalendarDay(date: AppDate) {
      if (this.calendar[date]) {
        this.calendarDay = this.calendar[date];
      } else {
        const calendarDay: CalendarDay = {
          date,
          meals: { breakfast: [], dinner: [], lunch: [] },
          summary: { calories: 0, proteins: 0, fats: 0, carbs: 0 },
          recommendedCalories: useUserStore().recommendedCalories,
        };

        this.calendarDay = calendarDay;
        this.calendar[date] = calendarDay;
        appCalendarStore.set(this.calendar);
      }
    },
    addProductToMeal(product: Product, weight: number, meal: MealValues) {
      const { name, ...productSummary } = product;

      // Перерасчет summary (БЖУ, калории) переданного продукта с учетом веса
      const updatedProductSummary = objectKeys(productSummary).reduce<Summary>(
        (acc, key) => {
          acc[key] = parseFloat((productSummary[key] * (weight / 100)).toFixed(1));
          return acc;
        },
        { ...productSummary },
      );

      // Представление продуктов, относящихся к конкретному приему пищи
      // расширяется id (продукт может быть добавлен дважды) и весом
      const productMeal: ProductPerMeal = {
        id: Date.now(),
        weight,
        ...product,
        ...updatedProductSummary,
      };

      this.calendarDay.meals[meal].push(productMeal);

      // Перерасчет summary (БЖУ, калории) текущего дня календаря с учетом summary нового продукта
      this.calendarDay.summary = objectKeys(updatedProductSummary).reduce(
        (acc, key) => {
          acc[key] = parseFloat((acc[key] + updatedProductSummary[key]).toFixed(1));
          return acc;
        },
        { ...this.calendarDay.summary },
      );

      appCalendarStore.set(this.calendar);
    },
    removeProductFromMeal(product: ProductPerMeal, meal: MealValues) {
      const { id, name, weight, ...productSummary } = product;

      this.calendarDay.meals[meal] = this.calendarDay.meals[meal].filter((item) => item.id !== id);

      // Перерасчет summary (БЖУ, калории) текущего дня календаря после удаления продукта
      this.calendarDay.summary = objectKeys(productSummary).reduce(
        (acc, key) => {
          acc[key] = parseFloat((acc[key] - productSummary[key]).toFixed(10));
          return acc;
        },
        { ...this.calendarDay.summary },
      );

      appCalendarStore.set(this.calendar);
    },
  },
});
