import { createI18n } from 'vue-i18n';
import { ru } from 'vuetify/locale';

const messages = {
  ru: {
    $vuetify: {
      ...ru,
    },
  },
};

export default createI18n({
  legacy: false,
  locale: 'ru',
  messages,
});
