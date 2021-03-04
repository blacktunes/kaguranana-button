import { createApp } from 'vue'
import App from './App.vue'
import i18n from '@/assets/script/i18n'
import router from '@/router'
import lazyload from '@/assets/script/lazyload.js'
import '@/assets/script/analytics/index'
import '@/assets/style/transition.styl'
import './registerServiceWorker.js'

createApp(App).use(router).use(i18n).use(lazyload).mount('#app')
