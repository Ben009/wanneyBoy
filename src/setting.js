// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Setting from './components/Setting';

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
  },
  components: { Setting },
  template: '<Setting />'
});
