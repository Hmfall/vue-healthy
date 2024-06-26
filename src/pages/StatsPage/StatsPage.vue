<template>
  <v-card>
    <v-card-title>Статистика</v-card-title>

    <v-card-subtitle>Выберите диапазон</v-card-subtitle>

    <v-card-item>
      <div class="d-flex align-center mt-2">
        <div class="mr-4">
          <v-text-field
            v-model="dateRange.start"
            label="Начало"
            type="Date"
            hide-details
            :max="dateRange.end"
          />
        </div>

        <div class="mr-4">
          <v-text-field
            v-model="dateRange.end"
            label="Конец"
            type="Date"
            hide-details
            :min="dateRange.start"
          />
        </div>

        <v-btn
          variant="tonal"
          rounded
          icon="$filterRemove"
          @click="handleResetDateRange"
        />
      </div>
    </v-card-item>

    <v-card-item>
      <div class="d-flex ga-3 flex-wrap">
        <v-btn
          v-for="range in dateRanges"
          :key="range.value"
          variant="tonal"
          density="comfortable"
          rounded
          @click="setDateRange(range.value)"
        >
          {{ range.title }}
        </v-btn>
      </div>
    </v-card-item>

    <v-card-item>
      <Bar
        :data="dateRangeStats.chart"
        :options="chartOptions"
      />
    </v-card-item>

    <v-card-item class="pb-0">
      <div class="d-flex">
        <v-spacer />

        <div class="d-flex flex-column">
          <div class="d-flex flex-wrap mb-2 ga-2">
            <v-chip
              v-for="consumptionRate in caloriesСonsumptionRates"
              :key="consumptionRate.value"
              :color="consumptionRate.status"
            >
              <v-tooltip>
                <span>
                  {{ consumptionRate.description }}
                </span>

                <template #activator="{ props }">
                  <span
                    v-bind="props"
                    class="on-surface"
                  >
                    {{ consumptionRate.title }}
                  </span>
                </template>
              </v-tooltip>
            </v-chip>
          </div>

          <v-spacer />

          <div class="d-flex justify-start justify-sm-end">
            <v-chip color="blue-darken-1">
              <span class="on-surface">Рекомендуемое кол-во калорий</span>
            </v-chip>
          </div>
        </div>
      </div>
    </v-card-item>

    <v-card-item>
      <v-data-table-virtual
        id="summary-table"
        :height="mdAndUp ? 92 : 230"
        item-value="date"
        mobile-breakpoint="md"
        :headers="summaryTableHeaders"
        no-filter
        :items="[{ title: 'Всего: ', ...dateRangeStats.summary }]"
      >
        <template #[`item.calories`]="{ value }">
          <v-chip
            v-if="dateRangeStats.chart.datasets[0].data.length"
            variant="outlined"
          >
            <span class="on-surface">{{ Math.round(value) }}</span>
          </v-chip>
        </template>
      </v-data-table-virtual>
    </v-card-item>

    <v-card-item>
      <v-data-table-virtual
        height="460"
        item-value="date"
        :mobile="false"
        :headers="summaryDateRangeTableHeaders"
        :items="dateRangeStats.summaryDateRange"
      >
        <template #item="{ item }: { item: SummaryPerDate }">
          <tr>
            <td>{{ item.date }}</td>
            <td>
              <v-chip :color="getStatusColor(item.calories, { output: 'template' })">
                <span class="on-surface">
                  {{ Math.round(item.calories.usage) || '—' }}
                </span>
              </v-chip>
            </td>
            <td>
              <v-chip
                :color="
                  item.calories.recommended && item.calories.usage ? 'blue-darken-1' : 'transparent'
                "
              >
                <span class="on-surface">
                  {{
                    item.calories.recommended && item.calories.usage
                      ? Math.round(item.calories.recommended)
                      : '—'
                  }}
                </span>
              </v-chip>
            </td>
            <td>{{ item.proteins || '—' }}</td>
            <td>{{ item.fats || '—' }}</td>
            <td>{{ item.carbs || '—' }}</td>
          </tr>
        </template>
      </v-data-table-virtual>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Bar } from 'vue-chartjs';
import { useDisplay } from 'vuetify';
import { appSettingsStore } from '@/main';
import { useCalendarStore } from '@/store/calendarStore';
import type { CaloriesSummary, DateRange, DateRangeVariant, SummaryPerDate } from '@/shared/types';
import useAppDate from '@/shared/utils/useAppDate';
import {
  caloriesСonsumptionRates,
  chartOptions,
  dateRanges,
  summaryDateRangeTableHeaders,
  summaryTableHeaders,
} from './consts';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
);

const calendarStore = useCalendarStore();
const { mdAndUp } = useDisplay();

const initialDateRange: DateRange = {
  start: null,
  end: null,
};

const dateRange = reactive(appSettingsStore.get()?.stats || { ...initialDateRange });

const dateRangeStats = computed(() => {
  if (dateRange.start && dateRange.end) {
    const generatedDateRange = generateDateRange(dateRange);
    const labels = generatedDateRange.map((item) => dayjs(item).format('D MMM'));
    const { summaryDateRange, summary } = calendarStore.summaryDateRange(generatedDateRange);
    const statusColor = summaryDateRange.map((item) =>
      getStatusColor(item.calories, { output: 'canvas' }),
    );

    const generateBarDataset = () => summaryDateRange.map((item) => item.calories.usage);

    const generateLineDataset = () => {
      // Требуется для корректного отображения линейного графика кол-ва реком. калорий:
      // если дата из выбранного диапазона отсутвует в календаре, значение реком. кол-ва калорий получится
      // равным нулю, в этом случае ноль заменяется ближайшим по дате реком. кол-вом калорий не равным нулю
      const buff = summaryDateRange.reduce<number[]>((acc, cur) => {
        if (cur.calories.recommended) {
          acc.push(cur.calories.recommended);
        }
        return acc;
      }, []);

      return summaryDateRange.map((item) => {
        if (item.calories.recommended === buff[1]) {
          buff.shift();
        }
        return buff[0];
      });
    };

    return {
      chart: {
        labels,
        datasets: [
          {
            data: generateBarDataset(),
            backgroundColor: statusColor,
          },
          {
            type: 'line',
            data: generateLineDataset(),
            backgroundColor: statusColor,
          },
        ],
      } as any,
      summaryDateRange: summaryDateRange.map((item) => ({
        ...item,
        date: dayjs(item.date).format('D MMMM'),
      })),
      summary,
    };
  }

  return {
    chart: {
      labels: [],
      datasets: [{ data: [] }],
    },
    summaryDateRange: [],
    summary: null,
  };
});

const handleResetDateRange = () => {
  Object.assign(dateRange, initialDateRange);
};

// Генерация массива дат (формата AppDate: YYYYMMDD) переданного диапазона
const generateDateRange = (dateRange: DateRange) => {
  const startDate = dayjs(dateRange.start).toDate();
  const endDate = dayjs(dateRange.end).toDate();

  return Array.from({ length: dayjs(endDate).diff(startDate, 'day') + 1 }, (_, index) => {
    return useAppDate(dayjs(startDate).add(index, 'day').toDate());
  });
};

const getStatusColor = (calories: CaloriesSummary, options: { output: 'canvas' | 'template' }) => {
  const { usage, recommended } = calories;
  const { output } = options;

  if (usage > recommended) {
    return output === 'canvas' ? 'rgba(198, 40, 40, 0.2)' : 'error';
  } else if (usage === 0 && output !== 'canvas') {
    return 'transparent';
  }

  if (recommended && usage && recommended - usage < Math.round((recommended * 3) / 100)) {
    return output === 'canvas' ? 'rgba(67, 160, 71, 0.2)' : 'primary';
  }

  return output === 'canvas' ? 'rgba(134, 134, 134, 0.4)' : undefined;
};

const setDateRange = (range: DateRangeVariant) => {
  const useInputDateFormat = (date: Dayjs) => dayjs(date).format('YYYY-MM-DD');

  switch (range) {
    case 'week':
      dateRange.start = useInputDateFormat(dayjs().subtract(1, 'week').add(1, 'day'));
      break;
    case 'twoWeeks':
      dateRange.start = useInputDateFormat(dayjs().subtract(2, 'week').add(1, 'day'));
      break;
    case 'month':
      dateRange.start = useInputDateFormat(dayjs().subtract(1, 'month'));
      break;
  }

  dateRange.end = useInputDateFormat(dayjs());
};

watch(dateRange, () => appSettingsStore.set({ stats: dateRange }, { merge: true }));
</script>

<style scoped lang="scss">
@media (max-width: 768px) {
  #summary-table ::v-deep(thead) {
    display: none;
  }
}
</style>
