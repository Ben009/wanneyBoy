<template>
    <div name="kindeditor" style="width:100%;height: 600px;"></div>
</template>


<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import vueBus from 'vue-bus';
  import '../../util/Base.css'


  export default {
    name: "certificateKindeEitor",
    components:{
      /** 模块对象 import 进来 后的别名  */
    },
    props: {
      showData:{required: true},
    },
    data(){
      //rentun中的变量仅针对当前组件有效
      return{
        /** sidtran:"兄弟组件间交互缓存变量",*/
      }
    },
    watch:{
    },
    mounted() {
      //加载KindEditor，再调用查询的方法
      this.loadJS(this.setKindEditorData)
    },
    methods:{
      //引入 kindeditor
      loadJS(callBackFunction){
//        var _this = this;
//        先引入kindeditor
//        var script=document.createElement('script');
//        script.src='./static/js/kindeditor/kindeditor.js';
//        document.body.appendChild(script);
//        script.onload=function(){
//          加载完毕后引入语言包
//          script=document.createElement('script')
//          script.src='./static/js/kindeditor/lang/zh_CN.js';
//          document.body.appendChild(script);
        this.kindEditor = window.KindEditor.create( 'div[name="kindeditor"]');
//          script.onload=function(){
            if(typeof callBackFunction == 'function'){
              callBackFunction();
            }
//          }
//        }
      },
      getKindEditorData() {
        return this.kindEditor.html();
      },
      setKindEditorData() {
        this.kindEditor.html(this.showData);
        this.kindEditor.focus();
      },
    },
    created () {
      console.group('%c%s', 'color:blue', 'created 创建完毕状态》')
    },
  }
</script>

<style>

</style>
