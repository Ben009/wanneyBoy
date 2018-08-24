<template>
  <mind-dialog
  title="富文本编辑器"
  :visible="true"
  width="50%"
  center
  v-dialogDrag
  @close="handleCancel">
    <el-button type="primary" @click="subEitor" size="small">编辑完毕</el-button>
    <CertificateKindeEitor ref="certificateKindeEitor" :showData="showData"/>
</mind-dialog>
</template>


<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import vueBus from 'vue-bus';
  import '../../util/Base.css'
  import CertificateKindeEitor from './certificateKindeEitor.vue';


  export default {
    name: "certificateKindeEitorDialog",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateKindeEitor,
    },
    props: {
      callback: {
        type:Function,
        required:true
      },
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
    methods:{
      handleCancel(){
        this.callback(this.$refs.certificateKindeEitor.getKindEditorData());
      },
      subEitor(){
        //将编辑器的数据获得，并回传
        this.handleCancel();
      },
      setEitor(data){
        //将编辑器的数据获得，并回传
        var _this=this
//        setTimeout(function () {
//          _this.$refs.certificateKindeEitor.setKindEditorData(data)
//        },0)
      }
    },
    created () {

    },
  }
</script>

<style>

</style>
