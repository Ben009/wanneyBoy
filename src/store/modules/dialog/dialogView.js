/**
 * TODO 20180530
 * dialog弹出框宽高设置
 * 因为最终全局调用，都需要在  store/index.js 进行申明
 */
import $ from 'jquery'
import Vue from 'vue';
const dialogView = {
  state: {
    //小框
    mini:{
      width: 500,
      height: 350,
      width_m:300,
      width_x:500,
    },
    //中框
    mid: {
      width: 800,
      height: 480,
      width_m: 650,
      width_x: 900,
    },
    //大框
    large: {
      width: 1024,
      height: 480,
      width_m: 950,
      width_x: 1024,
    }

  },
  mutations: {
    /**
     * 设置弹出框的宽高
     */
    SET_DIALOG_SIZE: (state,view) => {
      let w_mi,w_md,w_la,w,h;
      w=view['width'];
      h=view['height'];
      w_mi = w*0.4;
      w_md = w*0.6;
      w_la = w*0.9;
      if(w_mi < state.mini.width_m) {
        //state.mini.width = state.mini.width_m;
        Vue.set(state['mini'],'width',state.mini.width_m);
      }else if(w_mi > state.mini.width_x) {
        //state.mini.width = state.mini.width_x;
        Vue.set(state['mini'],'width',state.mini.width_x);
      }else {
        //state.mini.width = w_mi;
        Vue.set(state['mini'],'width',w_mi);
      }
      //state.mini.height = h-260;
      Vue.set(state['mini'],'height',h-260); 

      if(w_md < state.mid.width_m) {
        //state.mid.width = state.mid.width_m;
        Vue.set(state['mid'],'width',state.mid.width_m);  
      }else if(w_md > state.mid.width_x) {
        //state.mid.width = state.mid.width_x;
        Vue.set(state['mid'],'width',state.mid.width_x);   
      }else {
        //state.mid.width = w_md;
        Vue.set(state['mid'],'width',w_md);   
      }
      //state.mid.height = h-260;
      Vue.set(state['mid'],'height',h-260); 
      //state.large.width = w*0.9;
      Vue.set(state['large'],'width',w_la);
      //state.large.height = h*0.9;
      Vue.set(state['large'],'height',h*0.9);
      //console.log('large',state['large']);
    }
  },
  actions: {
    setDialogSize({commit}) {
      return new Promise((resolve)=>{
        commit('SET_DIALOG_SIZE',{ width:window.innerWidth , height:window.innerHeight})
      })
    }
  },
}

export default dialogView
