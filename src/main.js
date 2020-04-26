import Vue from 'vue'
import App from './App.vue'
import router from './router.config'
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
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VueQuillEditor)
console.log(store)
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  store.dispatch('updateUser')
  next()
})

const vue = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
export default vue
