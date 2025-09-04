import { createI18n } from 'vue-i18n'
import { en, zhHans } from 'vuetify/locale'
import enL from '@/lang/en.json'
import cnL from '@/lang/zh-CN.json'

const messages = {
  en: {
    ...enL,
    $vuetify: en,
  },
  zhHans: {
    ...cnL,
    $vuetify: zhHans,
  },
}

const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'zhHans',
  fallbackLocale: 'zhHans',
  globalInjection: true,
  messages,
  legacy: false,
})

export default i18n
