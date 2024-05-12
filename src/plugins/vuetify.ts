import { useI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import colors from 'vuetify/util/colors';
import i18n from './i18n';

export default createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: colors.green.darken1,
          'on-primary': colors.grey.lighten2,
          secondary: colors.indigo.darken1,
          info: colors.grey.lighten1,
          error: colors.red.lighten2,
          'on-surface': '#ffffff',
        },
      },
      light: {
        dark: false,
        colors: {
          primary: colors.green.darken1,
          'on-primary': colors.grey.lighten2,
          secondary: colors.indigo.darken3,
          surface: '#f4f5f6',
          info: colors.grey.darken2,
          error: colors.red.darken3,
        },
      },
    },
  },
  defaults: {
    VContainer: {
      style: [{ maxWidth: '992px' }],
      class: 'px-4 py-6',
    },
    VSheet: {
      class: 'bg-transparent',
    },
    VCard: {
      class: 'pa-2',
      rounded: 'lg',
    },
    VExpansionPanels: {
      rounded: 'lg',
    },
    VBtn: {
      rounded: 'xs',
      class: 'text-none',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VChip: {
      density: 'comfortable',
    },
    VDataTableVirtual: {
      density: 'comfortable',
    },
  },
  icons: {
    aliases,
    sets: {
      mdi,
    },
  },
});
