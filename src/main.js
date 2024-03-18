import { createApp } from 'vue'
import App from './App.vue'
import routers from './routers/router.js' // router import

const app = createApp(App)
app.use(routers)
app.mount('#app')
