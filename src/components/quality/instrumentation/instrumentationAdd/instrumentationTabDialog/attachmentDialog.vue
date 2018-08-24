<template>
  <div>
    <mind-dialog title="查看附件" :visible='true' dialogSize="mini" center v-dialogDrag @close ="cancel" style="height:auto;">
      <el-form  border label-width="150px" >
        <el-form-item label="附件">
          <mind-upload  ref="upFiles" :multiple="false" :disabled="true" :attachIds="attachmentIds"></mind-upload>
        </el-form-item>
      </el-form>
      <div slot="footer"class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      </div>
    </mind-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import { ajaxRequest } from '../../../../util/base';
export default {
  props: {
    attachmentIds: {
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
      fileList:[],
    };
  },
  mounted() {
    // this.$nextTick(()=>{
    //   this.$refs.upFiles.loadAttacheIds(this.fileId);
    // })
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
  .el-dialog .el-dialog--center{
    height: auto;
    max-height: 40vh; 
  }
</style>

