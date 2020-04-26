import Vuex from 'vuex'
import Vue from 'vue'
import api from '@/api/account'

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
    async updateUser(context) {
      try {
        const res = await api.getUserInfo()
        context.commit('updateUser', res.data)
      } catch (e) {
        console.error(e)
      }
    },
    updatePublicKey(context, publicKey) {
      context.commit('updatePublicKey', publicKey)
    }
  }
})

export default store
