import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router"
import routerConfig from './router.config'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI)

const router = new VueRouter(routerConfig)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
