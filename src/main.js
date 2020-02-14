import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router"
import routerConfig from './router.config'
import Vuex from 'vuex'
import store from './store'
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import Quill from 'quill'
import {ImageExtend} from 'quill-image-extend-module'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Quill.register('modules/ImageExtend', ImageExtend)
Vue.prototype.ossUrl= 'http://127.0.0.1:7001/public/'
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VueQuillEditor)

const router = new VueRouter(routerConfig)

const vue = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
export default vue
