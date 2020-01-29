import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    userInfo: {}
  },
  mutations: {
    updateUser(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    updateUser(context, userInfo) {
      context.commit('updateUser', userInfo)
    }
  }
})

export default store
