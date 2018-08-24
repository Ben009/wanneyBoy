// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//TODO 20180503 登录后 用户权限菜单 架构加载

import './mixins/zsEventsEditor/kindeditor-all-certificate.css';
// import './mixins/zsEventsEditor/resetZScss.css';
import Vue from 'vue';
import Vuex from 'vuex';
import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css'// progress bar style
import 'babel-polyfill';
import Cookies from 'js-cookie'; // cookies设置
import router from './router'; // 路由控制
import store from './store'; // vuex仓库
import './directives/directive.js';//自定义指令
import {ajaxRequest} from '@/components/util/base';
import Mind from './common/src' ; // TODO 20180509 自定义组件集 统一导入
//import {MessageBox,Message} from './common/src' ;

import Elem from './common-el/src' ; // TODO 20180625 自定义组件集 统一导入
//外部第三方组件
import {Button,Radio,Notification,Loading,MessageBox,Message} from './common-el/src';
import axios from 'axios'
// import './common/packages/axios/axios';
/**
 * 页面引入 vue 模板组件 申明
 */
import admin from './components/integration/admin';
import admin2 from './components/integration/admin2';
import App from './App'
import windowParam from './mixins/windowParam'
import tableRetrieve from './mixins/tableRerieve'
import $ from 'jquery'
Vue.use(Vuex);//
/**
 * Vue.use 的在引入类中必须含有方法 const install
 * 例如： src\common\src\index.js
 */
Vue.use(Mind);// TODO 20180509 启用组件集
Vue.use(Elem);
Vue.use(Loading.directive);

Vue.prototype.$axios = axios;
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$loading = Loading;

//Vue.prototype.QJTableMaxHeight = window.innerHeight-200;

Vue.config.productionTip = false;
Vue.mixin(tableRetrieve);
Vue.mixin(windowParam);

NProgress.configure({ showSpinner: false })// NProgress Configuration
//ajax全局响应拦截，判断session是否失效
$.ajaxSetup({
  // contentType:"application/x-www-form-urlencoded;charset=utf-8",
  complete:function(XMLHttpRequest,textStatus){
  },
  error(xhr,status,error) {
    if(xhr.status != 200 && xhr.status!='302' && xhr.status!='404' && xhr.status!='500') {//其他返回码
      // router.push("/500");
      Message.error("请求错误");
    }
  },
  statusCode: {
    302: function() {//session失效
      store.commit('CLEARVIEWS');
      $(`.tbs_info .iframeClass`).each(function(index,val) {
        setTimeout(value => {
          try{
            if($(val)[0].contentWindow.globalEvents){
              let tempEvents = $(val)[0].contentWindow.globalEvents;
              tempEvents['_destroyed'](tempEvents['_this'])
            }
          }catch(e){
          }finally{
            $(val).remove()
          }
        },0)
      })
      setTimeout(val => {
        localStorage.clear();//清除当前保存的登录信息
        sessionStorage.clear();//清除当前保存的登录信息
        router.push("/login");
      },0)
      // localStorage.clear();
      // router.push("/login");
    },
    404: function() {
      // router.push("/404");
      Message.error("路径错误");
    },
    500: function() {
      // router.push("/500");
      Message.error("路径错误");
    }
  }
});
Date.prototype.Format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

let countTemp = 0;
function getTopMenu(){
  return new Promise((resolve) => {
    let routerObj=sessionStorage.getItem('titleArrayObj');
    ajaxRequest('post','back/sysMenu/loadMenu?is_top=true',null,
    function(res){
      if(res && res.length > 0){
        store.commit('HANDLE_MENU_ID',res)
        let modules=res;
        store.dispatch('setleftMenu',modules)
        if(routerObj){
          getRouterObj()
          resolve()
        }else{
          store.dispatch('getAllLoadMenu',{tMenu:res}).then(res => {
            getRouterObj()
            resolve()
          })
        }
      }
      function getRouterObj(){
        store.dispatch('setActive',process.env.INDEX_ID)
        sessionStorage.setItem('topMenuId', process.env.INDEX_ID)
        store.dispatch('handleRoutes',{mPid:process.env.INDEX_ID})
      }
    })
  })
}

router.beforeEach((to,from,next) => {
  window.$routerNow=to;
  NProgress.start()
  countTemp++
  if(to.meta && to.meta.slug === 'first'){
    next();
    return
  }
  if(!localStorage.getItem("userName")) {
    store.commit('CLEARVIEWS');
    $(`.tbs_info .iframeClass`).each(function(index,val) {
      setTimeout(value => {
        try{
          if($(val)[0].contentWindow.globalEvents){
            let tempEvents = $(val)[0].contentWindow.globalEvents;
            tempEvents['_destroyed'](tempEvents['_this'])
          }
        }catch(e){
        }finally{
          $(val).remove()
        }
      },0)
    })
    setTimeout(val => {
      localStorage.clear();//清除当前保存的登录信息
      sessionStorage.clear();//清除当前保存的登录信息
      router.push("/login");
      NProgress.done()
    },0)
  }else {
    if(from && from.path == '/login'){
      // 只用从登录页登录 请求模块列表
      getTopMenu()
      goRouter()
    }else{
      goRouter()
    }
  }
  function goRouter(){
    if(sessionStorage.getItem('titleArrayObj')){
      let tempArrayObj =JSON.parse(sessionStorage.getItem('titleArrayObj'));
      let count = 0;
      let tempArray = tempArrayObj['nameArray'];
      for(let key=0 ; key < tempArray.length; key++){
        if(tempArray[key].name == to.name || to.path.substring(to.path.lastIndexOf('/')+1,to.path.length) == tempArray[key].name){
          countTemp = 0
          count++
          break
        }
      }
      if (count > 0) {
        next();
      }else{
        // 暂时跳转首页
        if(countTemp == 1){
          _this.$store.dispatch('setActive',process.env.INDEX_ID)
          sessionStorage.setItem('topMenuId', process.env.INDEX_ID)
          _this.$store.dispatch('handleRoutes',{mPid:process.env.INDEX_ID})
        }
        next({path:`/admin/${process.env.INDEX_CHILD_ID}`})
      }
    }else{
      next()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
  },
  store,//TODO 案例 VUEX store 在该处全局引入 注意，非重要变量不要全局引入
  router,//
  computed:{
    themeColor(){
      return store.state.admin.themeColor
    },
  },

  beforeCreate:function(){
    //页面加载初始化页面样式
    //document.getElementById("app").className='custom-'+store.state.admin.themeColor;
    //console.log('1-beforeCreate 初始化之后 检测用户是否已经登录');

  },
  created () {
    let _this=this,
        pid=sessionStorage.getItem('topMenuId'),
        routerObj=sessionStorage.getItem('titleArrayObj');
    if(localStorage.getItem("userName")) {
      //加载顶级菜单
      ajaxRequest('post','back/sysMenu/loadMenu?is_top=true',null,
        function(res){
          if(res && res.length > 0){
            store.commit('HANDLE_MENU_ID',res)
            _this.modules=res;
            _this.$store.dispatch('setleftMenu',_this.modules)
            if(routerObj){
              getRouterObj()
            }else{
              _this.$store.dispatch('getAllLoadMenu',{tMenu:res}).then(res => {
                getRouterObj()
              })
            }
          }
          else{
            _this.$message.error('加载列表失败');
          }
          function getRouterObj(){
            if(!pid){
              _this.$store.dispatch('setActive',process.env.INDEX_ID)
              sessionStorage.setItem('topMenuId', process.env.INDEX_ID)
              _this.$store.dispatch('handleRoutes',{mPid:process.env.INDEX_ID})
            }else{
              _this.goRouter();
            }
          }
        })
    }else {
      router.push("/login");
    }

  },
  watch:{
    themeColor(newValue){
      document.getElementById("app").className='custom-'+newValue
    },
  },
  methods:{
    handleToggleTheme(color) {
      this.$store.commit('toggleTheme', color)
    },
    initEditorPlugins(){
      window.KindEditor.lang({
        njmindFontInsert: '插入特殊字符',
      });
    },
    goRouter(){
      if(sessionStorage.getItem('titleArrayObj')){
        let tempArrayObj =JSON.parse(sessionStorage.getItem('titleArrayObj'));
        let tempArray = tempArrayObj['nameArray'];
        for(let key=0 ; key < tempArray.length; key++){
          if(tempArray[key].name == this.$route.name || this.$route.path.substring(this.$route.path.lastIndexOf('/')+1,this.$route.path.length) == tempArray[key].name){
            store.dispatch('handleRoutes',{mPid:tempArray[key].id})
            sessionStorage.setItem('topMenuId', tempArray[key].id)
            store.state.admin.active = tempArray[key].id
            store.commit('SET_STATUS', tempArray[key].id)
            break
          }
        }
      }
    }
  },
  mounted(){
    document.getElementById("app").className='custom-'+store.state.admin.themeColor;
    //console.log(tableRetrieve)
    this.$store.commit('SET_APP_ID', 'app')
    window.onresize = ()=> {
      //由全局混淆  注意如果需要监控窗口变化通过watch监听，vuex 属性即可
      this.getWindowParam();
    };
    this.initEditorPlugins();

    window.$message=this.$message;
  },
  /**
   * admin 只是该js中引入组件的的一个 别名
   * 如果要在template摸板中使用就必须在 components中 添加进去
   */
  components: {admin,admin2,App},
  /**
   * TODO 20180503 引入 模板注意
   * 在指定模板时注意，外部需要带一个dom布局对象，大家都是用 <div></div> 即可
   * <amdin>
   */
  template: '<App/>'


  /**
  '<el-radio :value="themeColor" @input="handleToggleTheme" label="409eff">#409eff</el-radio>' +
  '<el-radio :value="themeColor" @input="handleToggleTheme" label="ff4060">#ff4060</el-radio>' +
  '<el-radio :value="themeColor" @input="handleToggleTheme" label="1d74b7">#1d74b7</el-radio>' +
  '<el-radio :value="themeColor" @input="handleToggleTheme" label="black">black</el-radio>' +
   */
});
