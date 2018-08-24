// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//TODO 20180503 登录后 用户权限菜单 架构加载
import './assets/css/theme/ceriticateStyle/index.scss';
import './mixins/zsEventsEditor/kindeditor-all-certificate.css';
// import './mixins/zsEventsEditor/resetZScss.css';
import Vue from 'vue';
import Vuex from 'vuex';
import 'babel-polyfill';
import store from './store'; // vuex仓库
import './directives/directive.js';//自定义指令
import Mind from './common/src' ; // TODO 20180509 自定义组件集 统一导入
import Elem from './common-el/src' ; // TODO 20180625 自定义组件集 统一导入
//外部第三方组件
import {Notification,Loading,MessageBox,Message} from './common-el/src';
import axios from 'axios'
/**
 * 页面引入 vue 模板组件 申明
 */
import certApp from './certApp'
import windowParam from './mixins/windowParam'
import $ from 'jquery'
//import tableRetrieve from './mixins/tableRerieve'
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
//Vue.mixin(tableRetrieve);
Vue.mixin(windowParam);
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

/* eslint-disable no-new */
new Vue({
  el: '#certApp',
  data: {
  },
  store,//TODO 案例 VUEX store 在该处全局引入 注意，非重要变量不要全局引入
  computed:{
  },
  methods:{
    initEditorPlugins(){
      window.KindEditor.lang({
        njmindFontInsert: '插入特殊字符',
      });
    }
  },
  mounted(){
    // document.getElementById("certApp").className='cerCommonStyle'
    //console.log(tableRetrieve)
    this.$store.commit('SET_APP_ID', 'certApp')
    window.onresize = ()=> {
      //由全局混淆  注意如果需要监控窗口变化通过watch监听，vuex 属性即可
      this.getWindowParam("true");
    };
    this.initEditorPlugins();
  },
  /**
   * admin 只是该js中引入组件的的一个 别名
   * 如果要在template摸板中使用就必须在 components中 添加进去
   */
  components: {certApp},
  /**
   * TODO 20180503 引入 模板注意
   * 在指定模板时注意，外部需要带一个dom布局对象，大家都是用 <div></div> 即可
   * <amdin>
   */
  template: '<cert-app/>'

 
});
