export type Theme = 'dark' | 'light';

export interface AppSetting {
  theme?: Theme;
  stats?: DateRange;
}

export type AppDate = string;

export type Calendar = Record<AppDate, CalendarDay>;

export interface CalendarDay {
  date: AppDate;
  meals: Meals;
  summary: Summary;
  recommendedCalories: number;
}

export interface User {
  age: Nullable<number>;
  height: Nullable<number>;
  weight: Nullable<number>;
  gender: Nullable<number>;
  activity: Nullable<number>;
}

export interface Summary {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

export interface ProductDto {
  name: string;
  calories: string;
  proteins: string;
  fats: string;
  carbs: string;
}

export interface Product extends Summary {
  name: string;
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

export type DateRangeVariant = 'week' | 'twoWeeks' | 'month';

export interface ConstEntity<V, T> {
  value: V;
  title?: T;
}

export type CaloriesСonsumptionRate = ConstEntity<string, string> & {
  description: string;
  status?: string;
};
