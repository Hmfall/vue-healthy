import type { DateRange } from './calendar.types';

export type Theme = 'dark' | 'light';

export interface AppSetting {
  theme?: Theme;
  stats?: DateRange;
}
