import { fileURLToPath, URL } from 'url'
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`

      // you need to set i18n resource including paths !
      include: path.resolve(__dirname, './path/to/src/locales/**')
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
