<template>
    <mind-dialog title="查看附件" :visible='true' dialogSize="mini" center v-dialogDrag @close ="cancel">
      <el-form  border label-width="150px" >
        <el-form-item label="附件">
          <mind-upload  :limitNumb="limitNumb" ref="upFiles"  :disabled="true"></mind-upload>
        </el-form-item>
      </el-form>
      <div style="text-align:center;margin:20px 0;">
      <el-button @click="cancel">取消</el-button>
      </div>
    </mind-dialog>
</template>
<script>
import Vue from "vue";

import { ajaxRequest, ajaxSyncRequest } from "../../util/base";
import $ from "jquery";
export default {
  props: {
    fileId: {
      required:true
    }
    ,
    callBack: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      limitNumb: 4,
      fileList:[],
    };
  },
  mounted() {
    this.$nextTick(()=>{
      this.$refs.upFiles.loadAttacheIds(this.fileId);
    })
    // if (!!this.form.attachment) {
    //   let fileId = this.form.attachment.slice(0,this.form.attachment.length - 1);
    //     setTimeout(() => {
    //     }, 200);
    // }
  },
  methods: {
    cancel(){
      this.callBack();
    }
  }
};
</script>
<style scoped>
</style>

