<template>
  <mind-dialog
  title="选择模板"
  :visible="true"
  width="300"
  height="400"
  center
  v-dialogDrag
  @close="handleCancel">
  <div>
    <CertificateListTree :dataList="dataList" :keyId="keyId" :treePid="treePid" :propsKey="propsKey" :expandAll="expandAll"
                         :leftClickMain="leftClick"  />
  </div>
</mind-dialog>
</template>


<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import CertificateListTree from '../certificateListTree';
  import {ajaxRequest } from '../../../util/base';
  import vueBus from 'vue-bus';
  import '../../../util/Base.css'

/*   import {Container,Aside,Main} from 'element--ui';
  Vue.use(Container);
  Vue.use(Aside);
  Vue.use(Main); */

  export default {
    name: "certificateTreeDialog",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateListTree,
    },
    props: {
      callback: {
        type:Function,
        required:true
      },
      queryType: {required: true},

    },
    data(){
      //rentun中的变量仅针对当前组件有效
      return{
        /** sidtran:"兄弟组件间交互缓存变量",*/
        dataList:[],
        zmbId:"",
        keyId:"zmbId",
        treePid:"zmbType",
        expandAll:true,
        propsKey:{label: 'zmbName', children: 'children'},
        //主文件夹的事件
      }
    },
    watch:{
    },
    methods:{
      leftClick(data ){
        var zmbId = data.zmbId ;
        var zmbType = data.zmbType
        //判断是否父节点
        if(zmbType != 0 ){
          //存储模板ID
          this.zmbId = zmbId ;
          //关闭弹出层
          this.handleCancel();
//          this.currentKey = this.zmbId;
        }
      },
      getDataList() {
        let _this = this;
        ajaxRequest('get', 'back/originalLogMainTemp/list', {queryType:this.queryType}, (res) => {
          if (res.code === 200) {
//            let dataTreeList = this.formatArrayToTree(res.rows, [], 0, []);
            if(this.queryType == 1){
              res.rows.push({"zmbType":0,"zmbName":"信息页","zmbId":1});
            }else if(this.queryType == 2){
              res.rows.push({"zmbType":0,"zmbName":"HTML模板","zmbId":2},);
            }
            _this.dataList = res.rows;
          }
        });
      },
      handleCancel(){
//        console.log('关闭')
        this.callback(this.zmbId);
      }
    },
    created () {
      console.group('%c%s', 'color:blue', 'created 创建完毕状态》')
      this.getDataList();
    },
  }
</script>

<style>

</style>
