// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import Login from './components/mould/Login';
Vue.use(Vuex);

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    themeColor:'409eff',
    themeColors: ['409eff','ff4060']
  },
  mutations: {
    toggleTheme(state, curColor){
      state.themeColor=curColor
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
  },
  store,
  components: {Login},
  template: '<div>' +
  '<Login/>' +
  '</div>'
});
