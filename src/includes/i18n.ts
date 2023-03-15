import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import pt from '@/locales/pt.json'
import ja from '@/locales/ja.json'
import zh from '@/locales/zh.json'

export default createI18n({
  locale: 'en',
  fallbackLocale: 'pt',
  messages: {
    en,
    pt,
    ja,
    zh
  },
  // object containing translations for numbers + supported currency code
  numberFormats: {
    en: {
      currency: { style: 'currency', currency: 'USD' },
    },
    pt: {
      currency: { style: 'currency', currency: 'BRL' },
    },
    ja: {
      currency: { style: 'currency', currency: 'JPY' },
    },
    zh: {
      currency: { style: 'currency', currency: 'CNY' },
    }
  }
})
