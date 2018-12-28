import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title    : "",
    routeType: "",
    fromPath : '',
    footer   : true,
    header   : true,
  },
  //private 不公开
  mutations: {
    showRouteType(state, amount) {
      state.routeType = amount
    },
    showTitle(state, amount) {
      state.title = amount
    },
    showFooter(state, amount) {
      state.footer = amount
    },
    showHeader(state, amount) {
      state.header = amount
    }
  },
  //获取
  getters: {
    getShowRouteType: (state) => {
      return state.routeType
    },
    getShowTitle: (state) => {
      return state.title
    },
    getShowFooter: (state) => {
      return state.footer
    },
    getShowHeader: (state) => {
      return state.header
    }
  }
});
