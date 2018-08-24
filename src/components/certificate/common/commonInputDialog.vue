<template>
  <mind-dialog
    :title="title"
    :visible="true"
    width="430"
    height="210"
    center
    v-dialogDrag
    @close="handleCancel">
    <div class="inputDialogStyle">
      <div style="margin-right: 30px;">
        <span >{{label}}：</span>
      </div>
      <div style="width: 400px;">
        <el-input type="textarea"
          :rows="2"
          v-model="message" :placeholder="placeholder"></el-input>
      </div>
    </div>
<!--     <el-form ref="form"  >
      <el-col :span="5">
        <el-form-item>
          <span >{{label}}：</span>
        </el-form-item>
      </el-col>
      <el-col :span="15">
        <el-form-item >
          <el-input type="textarea"
                    :rows="2"
                    v-model="message" :placeholder="placeholder"></el-input>
        </el-form-item>
      </el-col>
    </el-form> -->
    <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">确 认</el-button>
            <el-button @click="handleCancel">取 消</el-button>
          </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../util/base';
  import $ from 'jquery';

  export default {
    name: "CommonInputDialog",
    props: {
      title: {
        required:true,
        default: "",
      },
      label: {
        required:true,
        default: "",
      },
      placeholder: {
        required:false,
        default: "",
      },
      callback: {
        type:Function,
        required:true
      }
    },
    data() {
      return {
        message:"",
      }
    },
    mounted() {
//      this.getUserInfo();
    },
    methods: {
      handleSubmit() {
        if(this.message!=""){
          this.callback(this.message);
        }else {
          this.$message.warning(this.placeholder);
        }
      },
      handleCancel(){
        this.callback();
      },
    },
  }
</script>

<style lang="scss">
.inputDialogStyle{
  display:flex;
  margin-top: 10px;
  justify-content: center;
}
</style>
