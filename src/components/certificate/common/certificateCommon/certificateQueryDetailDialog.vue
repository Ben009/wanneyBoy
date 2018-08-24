<template>
  <mind-dialog
  title="查看证书"
  :visible="true"
  width="80%"
  center
  v-dialogDrag
  @close="handleCancel">
  <div>
    <CertificateQueryDetail
      :certificateId="certificateId"
    />
  </div>
</mind-dialog>
</template>


<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import CertificateQueryDetail from './CertificateQueryDetail';
  import {ajaxRequest } from '../../../util/base';
  import vueBus from 'vue-bus';
  import '../../../util/Base.css'

/*   import {Container,Aside,Main} from 'element--ui';
  Vue.use(Container);
  Vue.use(Aside);
  Vue.use(Main); */

  export default {
    name: "CertificateQueryDetailDialog",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateQueryDetail,
    },
    props: {
      certificateId:{required:true},
      callback: {
        type:Function,
        required:true
      },
    },
    data(){
      //rentun中的变量仅针对当前组件有效
      return{


      }
    },
    watch:{
    },
    methods:{
      handleCancel(){
        this.callback();
      },

    },
    created () {
      console.group('%c%s', 'color:blue', 'created 创建完毕状态》')
    },
  }
</script>

<style>

</style>
