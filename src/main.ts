import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import VeeValidatePlugin from './includes/validation'
import { auth } from './includes/firebase'
import i18n from './includes/i18n'
import ProgressBar from './includes/progress-bar'
import 'nprogress/nprogress.css'

import './tailwind.css'

ProgressBar(router)

let app
// wait firebase to initialize authenticate the user 
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App).use(i18n)
    // The use method allow to register a plug-in
    app.use(createPinia())
    app.use(router)
    app.use(VeeValidatePlugin)

    app.mount('#app')
  }
})