import type { Product, Summary } from './product.types';

export type Calendar = Record<AppDate, CalendarDay>;

export interface CalendarDay {
  date: AppDate;
  meals: Meals;
  summary: Summary;
  recommendedCalories: number;
}

export interface ProductPerMeal extends Product {
  id: number;
  weight: number;
}

export interface Meals {
  breakfast: ProductPerMeal[];
  lunch: ProductPerMeal[];
  dinner: ProductPerMeal[];
}

export interface Meal {
  value: MealValues;
  label: string;
}

export type MealValues = keyof Meals;

export interface DateRange {
  start: Nullable<AppDate>;
  end: Nullable<AppDate>;
}

export type SummaryPerDate = { date: AppDate } & {
  [K in keyof Summary]: K extends 'calories' ? CaloriesSummary : Summary[K];
};

export interface CaloriesSummary {
  usage: number;
  recommended: number;
}

export type AppDate = string;
