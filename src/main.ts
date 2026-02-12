import { createSSRApp } from 'vue'
import App from './App.vue'
import { requestInterceptor } from './http/interceptor'
import { routeInterceptor } from './router/interceptor'
import uviewPlus from 'uview-plus'

import store from './store'
import '@/style/index.scss'
import 'virtual:uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(uviewPlus)
  app.use(routeInterceptor)
  app.use(requestInterceptor)

  return {
    app,
  }
}
