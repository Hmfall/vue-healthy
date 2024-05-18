import dayjs from 'dayjs';
import type { AppDate } from '@/shared/types';

export default function useAppDate(date?: Date): AppDate {
  return dayjs(date).format('YYYYMMDD');
}
