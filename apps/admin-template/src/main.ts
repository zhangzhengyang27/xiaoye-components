import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import 'xiaoye-components/style.css'
import './style/index.scss'
import { useAppStore } from './stores/app'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

router.beforeEach((to, _from, next) => {
  const appStore = useAppStore()
  
  if (to.meta.requiresAuth && !appStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && appStore.isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

app.use(router)
app.mount('#app')
