<template>
  <div>
    <div id="certificateJgyDiv">
    </div>
    <OriginalLogTreeDialog :queryType="2"
                           v-if="dialogShow" :callback="dialogClose" ></OriginalLogTreeDialog>

  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../../util/base';
  import $ from 'jquery';
  import OriginalLogTreeDialog from "../../common/originalLogCommon/originalLogTreeDialog.vue";
  import CertificateKindeEitorDialog from '../../common/certificateKindeEitorDialog.vue';
  import Clickoutside from '@/common-el/src/utils/clickoutside';
  import zsEvents from '@/mixins/zsEvents'
  import CertificateCommon from "@/components/certificate/common/certificateCommon.js";

/*   import {
    Input,
    Col,
  } from 'element--ui';
  Vue.use(Input)
  Vue.use(Col); */

  const defaults = {
    hoho:''
  };
  export default {
    name: "OriginalLogTempJgy",
    components:{
      /** 模块对象 import 进来 后的别名  */
      OriginalLogTreeDialog,CertificateKindeEitorDialog,
    },
    mixins:[zsEvents,CertificateCommon],
    props: {
      //获得父页面传进来的参数
//      jgyIdArray: {required: true},
//      jgyMainContentMap: {required: true },
//      jgyContentArray: {required: true },
      setZsbh:{
        type:Function,
        required:false,
        default: null,
      },
      certificateCanEdit:{default: false},
    },
    data() {
      return {
        form: {},
        rules: {
        },
        loading: false,
        dialogShow:null,
        jgyZmbId:0,
      }
    },
    watch:{
      //监听参数的变化

    },
    created(){

    },
    mounted() {

    },
    methods: {
      //append 当前的追加
      //addGjy 追加最后
      //relationGjy 替换当前
      relationJgy(){
        this.dialogShow = true;
      },
      dialogClose(jgyZmbId){
        //隐藏弹出层
        if(!jgyZmbId){
          this.dialogShow = null;
          return;
        }
        this.$emit('getJgyCont', jgyZmbId );
        this.dialogShow = null;
      },
      setContent(jgyContent){
        console.log(jgyContent,'jgyContent')

        $("#certificateJgyDiv").html(jgyContent);
        if(typeof this.setZsbh == "function"){
          this.setZsbh();
        }
      },
      getJgyAllContent(){
        //获得所有的结果页内容字段、结果页ID
        var jgyDiv = $("#certificateJgyDiv");

        this.initCheckboxRadioSelect(jgyDiv)


        return jgyDiv.html();
      },
      setJgyAllContent(jgyDivHtml){
        //获得所有的结果页内容字段、结果页ID
        $("#certificateJgyDiv").html(jgyDivHtml)
      },
      //设置证书编号
      setJgyZsbh(zsbh){
        $("#certificateJgyDiv [name='zs_zsbh']").html(zsbh)
      },
    },
    updated () {
    },
  }

</script>

<style lang="scss" >

  .right-click-menu {
    position: fixed;
    border: 1px solid #ccc;
    padding: 2px 0;
    background: #fff;
    width: 200px;
    z-index: 9999;
  }
  .right-click-menu li {
    padding: 3px 10px;
    cursor: default;
    font-size: 14px;
    color: #606266;
  }
  .right-click-menu li:hover {
    color: #409eff;
  }
  .btn{
    text-align: center;
    margin: 4% !important;
  }

</style>
