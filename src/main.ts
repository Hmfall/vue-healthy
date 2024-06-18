import { createApp } from 'vue';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import i18n from '@/plugins/i18n';
import pinia from '@/plugins/pinia';
import { router } from '@/plugins/router';
import vuetify from '@/plugins/vuetify/vuetify';
import type { AppSetting } from '@/shared/types';
import useStorage from '@/shared/utils/useStorage';
import App from './App.vue';
import 'dayjs/locale/ru';

export const appSettingsStore = useStorage<AppSetting>('settings', sessionStorage);

const app = createApp(App);

dayjs.extend(isLeapYear);
dayjs.locale('ru');

app.use(router).use(pinia).use(i18n).use(vuetify);

router.isReady().then(() => app.mount('#app'));
