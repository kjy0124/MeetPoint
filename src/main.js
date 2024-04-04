import { createApp } from 'vue'
import App from './App.vue'
import routers from './routers/router.js' // router import
import '../src/css/reset.css';
// import '../src/css/InputPage.css';
// import '../src/css/MiddleMap.css';

const app = createApp(App)
app.use(routers)
app.mount('#app')
