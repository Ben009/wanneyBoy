<template>
  <mind-dialog
    :visible="true"
    :title="'到款导入'"
    width="40%"
    v-dialogDrag
    center
    @close="handleCancel">
  <div style="text-align: center;">
    <div style="width: 100%">
      <div style="float: left">
        <span>请选择要导入的文件
          <el-tooltip class="item" effect="dark" content="导入EXCEL表头内容（第一行）不可修改，但列的顺序可以调整；">
                  <i class="el-icon-info ft12"></i>
          </el-tooltip>
          ：
        </span>
      </div>
      <div style="float: left">
        <mind-upload :limitNumb="limitNumb" :callBack="fileCallBack"></mind-upload>
      </div>
      <div>
        <el-button type="primary" @click="downloadFile">下载模板</el-button>
      </div>
    </div>
  </div>
    <span slot="footer" class="dialog-footer" >
      <el-button type="primary" v-mindPopover="{message:'确认导入到款信息?',success:handleSubmit.bind(this),isOpen:handleOpen.bind(this)}">导 入</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../util/base';
  import $ from 'jquery';


  const defaults = {
  };
  export default {
    name: "file-upload",
    props: {
      callback: {
        type:Function,
        required:true
      }
    },
    data(){
      return {
        fileList:[], //
        limitNumb:1,//附件上传个数限制
        up_url:'',//自定义上传路径 [非必填]  默认不用修改
        fdata:{//附件额外参数
              serverId:'',//服务id     [非必填]  分布式附件服务可以用默认不用配制
              flowId:'', //流程id      [非必填]  流程相关
              execType:'',//操作类型   [非必填]  业务相关
              caseId:'',//登记号       [非必填]  业务相关的登记号
        },
      }
    },

    mounted() {
    },
    methods: {
      //下载模板
      downloadFile() {
        let url ="/back/accountRecord/downloadFile";
        let form = $("<form></form>").attr("action", url).attr("method", "post");
        form.append($("<input></input>").attr("type", "hidden").attr("name", "isDown").attr("value", "true"));
        form.appendTo('body').submit().remove();
      },
      //导入提交事件
      handleSubmit() {
        let _this = this;
        if(this.fileList.length===0){
          _this.$message.error('请先选择要导入的excle！');
          return;
        }
        //取出上传文件的扩展名
        var index = this.fileList[0].name.lastIndexOf(".");
        var ext = this.fileList[0].name.substr(index+1);
        if(ext != "xls" && ext != "xlsx"){
          _this.$message.error('请先上传正确的Excel文件！');
          return;
        }

        let obj = this.fileList[0].response;
        let fileName = this.fileList[0].name;
        let filePath = obj.v_stream_url+obj.v_attach_id;
        ajaxRequest('put','back/accountRecord/uploadAccount',{filePath:filePath,fileName:fileName},(res)=>{
          if(res.code===200){
            _this.callback("success");
          }else{
            _this.callback("error");
          }
        });
      },
      //提交前验证
      handleOpen(){
        let _this = this;
        if(this.fileList.length===0){
          _this.$message.error('请先选择要导入的excle！');
          return false;
        }
        //取出上传文件的扩展名
        var index = this.fileList[0].name.lastIndexOf(".");
        var ext = this.fileList[0].name.substr(index+1);
        if(ext != "xls" && ext != "xlsx"){
          _this.$message.error('请先上传正确的Excel文件！');
          return false;
        }

        return true;
      },
      //关闭弹窗
      handleCancel(){
        this.callback();
      },
      //callBack上传组件数据发生变化回调
      fileCallBack(file,list){
        this.fileList=list;
        console.log("调用上传页面收到的 附件列表",this.fileList);
      },
    },
  }
</script>

<style>
  .right-click-menu{
    position:fixed;
    border:1px solid #ccc;
    padding: 2px 0;
    background:#fff;
    width:100px;
    z-index:9999;
  }
  .right-click-menu li{
    padding:3px 10px;
    cursor:default;
    font-size:14px;
    color:#606266;
  }
  .right-click-menu li:hover{
    color:#409eff;
  }
  ul, li{
    margin:0;
    padding:0;
    list-style:none;
  }
</style>
