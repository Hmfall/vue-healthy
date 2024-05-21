import type { ChartOptions } from 'chart.js';
import type { ConstEntity, DateRangeVariant, CaloriesСonsumptionRate } from '@/shared/types';

export const dateRanges: ConstEntity<DateRangeVariant, string>[] = [
  {
    value: 'week',
    title: 'Неделя',
  },
  {
    value: 'twoWeeks',
    title: 'Две недели',
  },
  {
    value: 'month',
    title: 'Месяц',
  },
];

export const caloriesСonsumptionRate: CaloriesСonsumptionRate[] = [
  {
    value: 'flaw',
    title: 'Недостаток',
    description: 'Превышение рекомендуемого количества калорий.',
  },
  {
    value: 'normal',
    title: 'В пределах нормы (не более 3%)',
    description:
      'Недостаток калорий, не превышающий 3% от рекомендуемого количества калорий находится в пределах нормы.',
    status: 'primary',
  },
  {
    value: 'exceed',
    title: 'Свыше нормы',
    description: 'Превышение рекомендуемого количества калорий.',
    status: 'error',
  },
];

export const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  scales: {
    x: {
      position: 'bottom',
      border: {
        width: 2,
        color: 'rgba(67, 160, 71, 0.2)',
      },
    },
    y: {
      position: 'left',
      border: {
        width: 2,
        color: 'rgba(67, 160, 71, 0.2)',
      },
      title: {
        display: true,
        text: 'Калории',
        padding: {
          bottom: 12,
        },
        font: {
          size: 16,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    bar: {
      borderRadius: 4,
    },
    line: {
      borderColor: 'rgb(0, 102, 216, 0.4)',
    },
  },
};

export const summaryTableHeaders = [
  { key: 'title', title: '', sortable: false },
  { key: 'calories', title: 'Калории (ккал)', sortable: false },
  { key: 'proteins', title: 'Белки (г)', sortable: false },
  { key: 'fats', title: 'Жиры (г)', sortable: false },
  { key: 'carbs', title: 'Углеводы (г)', sortable: false },
] as const;

export const summaryDateRangeTableHeaders = [
  { key: 'date', title: 'Дата', minWidth: '120' },
  {
    title: 'Калории (ккал)',
    align: 'center',
    children: [
      { value: 'calories.usage', title: 'Потребленные', sortable: true, maxWidth: '145' },
      { value: 'calories.recommended', title: 'Рекомендуемые', sortable: true, maxWidth: '145' },
    ],
  },
  { key: 'proteins', title: 'Белки (г)' },
  { key: 'fats', title: 'Жиры (г)' },
  { key: 'carbs', title: 'Углеводы (г)' },
] as const;
