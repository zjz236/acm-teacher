import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    userInfo: {},
    publicKey: ''
  },
  mutations: {
    updateUser(state, userInfo) {
      state.userInfo = userInfo
    },
    updatePublicKey(state, publicKey) {
      state.publicKey = publicKey
    }
  },
  actions: {
    updateUser(context, userInfo) {
      context.commit('updateUser', userInfo)
    },
    updatePublicKey(context, publicKey) {
      context.commit('updatePublicKey', publicKey)
    }
  }
})

export default store
