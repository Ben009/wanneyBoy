<template>

  <mind-dialog title="计划任务委托单信息" :visible="true" width="650px"   @close="handleCancel">
    <el-form ref="form" :model="form"  label-width="150px">
      <el-form-item    label=" 请输入退号原因:：">
        <el-input type="textarea" :rows="2"  placeholder="请输入内容" v-model="textarea">
        </el-input>
      </el-form-item>

      <el-row type="flex" justify="center">
          <el-button type="primary"  @click="confirm(ids)">确认
          </el-button>
        &nbsp;&nbsp;
          <el-button type="warning" @click="handleCancel">关闭
          </el-button>
      </el-row>
    </el-form>
  </mind-dialog>
</template>
<script>
  import Vue from "vue";
  import Vuex from "vuex";
  import $ from "jquery";
  import { ajaxRequest, ajaxSyncRequest,formatDate } from "../../util/base";

/*   import {
    Button,
    Table,
    TableColumn,
    Row,
    Col,
    Radio,
    RadioGroup
  } from "element--ui";
  Vue.use(Button);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Row);
  Vue.use(Col); */

  export default {
    props:{
      callback: {
        type: Function,
        required: true
      },
      ids:{
        required:true
      },
      orderNo:{
        required:true
      },
    },
    data() {
      return {
        textarea: '',
        form: {}
      }
    },methods:{
      handleCancel:function() {
        this.callback(null);
      },
      confirm:function (ids) {
        //获取是否填写了textarea的内容
        if(this.textarea==""||this.textarea==null){
          this.$message.error('请填写退号原因!');
          return false;
        }
        var index=0;
        if(ids!=null&&ids!=""){
          ids=ids.toString();
          index=ids.indexOf(",");
        }
        if(index!=-1){
          ajaxRequest(
            "PUT",
            "back/planAppliance/list/"+ids,
            {
              isClaim: '2',
              returnReason: this.textarea
            },
            res => {
              if (res.code == 200) {
                if (res.message == '1') {
                  this.$message.success('退号成功!');
                  this.callback(null);
                  this.$emit("reaload",this.orderNo);
                } else {
                  this.$message.error('退号失败!');
                  this.callback(null);
                }
              } else {
                this.$message.error("退号失败!");
                this.callback(null);
              }
            }
          );
        }else {
          ajaxRequest(
            "PUT",
            "back/planAppliance/",
            {
              id:ids,
              isClaim: '2',
              returnReason: this.textarea
            },
            res => {
              if (res.code == 200) {
                if (res.message == '1') {
                  this.$message.success('退号成功!');
                  this.callback(null);
                  this.$emit("reaload",this.orderNo);
                } else {
                  this.$message.error('退号失败!');
                  this.callback(null);
                }
              } else {
                this.$message.error("退号失败!");
                this.callback(null);
              }
            }
          );
        }
      }
    },mounted(){
    }
  }
</script>
<style scoped>

</style>
