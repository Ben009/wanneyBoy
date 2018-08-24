import Vue from 'vue'
import Vuex from 'vuex';
import './components/util/Base.css';
import Framework from './components/framework/Framework';

Vue.use(Vuex);

Vue.config.productionTip = true;

const store = new Vuex.Store({
  state: {
    themeColor:'black'
  },
  mutations: {
    toggleTheme(state, curColor){
      state.themeColor=curColor
    }
  }
});

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
      document.getElementById("app").className='custom-'+newValue
    }
  },
  methods:{
    handleToggleTheme(color) {
      this.$store.commit('toggleTheme', color)
    }
  },
  components: { Framework },
  template: '<div>' +
  '<Framework/>' +
  '</div>'
});
