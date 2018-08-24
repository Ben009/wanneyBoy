// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/css/theme/409eff/index.css';
import './assets/css/theme/ff4060/index.css';
import Vue from 'vue'
import Vuex from 'vuex';
import FormView from './components/mould/FormView';
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
  components: {FormView},
  template: '<div>' +
  '<FormView/>' +
  '</div>'
});
