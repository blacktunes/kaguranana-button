import { createApp } from 'vue'
import App from './App.vue'
import i18n from '@/assets/script/i18n'
import router from '@/router'
import '@/assets/script/analytics/index'
import '@/assets/script/voices'
import '@/assets/style/transition.styl'
import './registerServiceWorker.js'

createApp(App).use(router).use(i18n).mount('#app')
