// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/css/theme/409eff/index.css';
import './assets/css/theme/ff4060/index.css';
import Vue from 'vue'
import Vuex from 'vuex';
import {Button,Radio} from 'element-ui';
import Mind from './common/src'
import Retrieve from './components/Retrieve';
import Layout from './components/Layout';

import '@/styles/elementStyle.css';
Vue.use(Vuex);
Vue.use(Mind)
Vue.use(Button);
Vue.use(Radio);

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    themeColor:'409eff'
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
  computed: Vuex.mapState({
    themeColor:state => state.themeColor
  }),
  mounted() {

  },
  watch:{
    themeColor(newValue){
      document.body.className='custom-'+newValue
    }
  },
  methods:{
    handleToggleTheme(color) {
      this.$store.commit('toggleTheme', color)
    }
  },
  components: { Retrieve, Layout, VueBarcode },
  template: '<div>' +
  '<el-button type="primary">显示主色调</el-button>' +
  '<el-radio :value="themeColor" @input="handleToggleTheme" label="409eff">#409eff</el-radio>' +
  '<el-radio :value="themeColor" @input="handleToggleTheme" label="ff4060">#ff4060</el-radio>' +
  '<Retrieve />' +
  '<Layout />' +
  '</div>'
});
