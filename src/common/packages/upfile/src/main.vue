<template>
  <div>
    <el-upload
      ref="upFiles"
      v-if="!disabled && visaed"
      class="upload-demo"
      :action="up_url"
      :data="data"
      :accept="accept"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :multiple="multiple"
      :limit="limitNumb"
      :show-file-list="showfileList"
      :on-exceed="handleExceed" 
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :checkedFile="checkedFiles"
      :checkedTitle="checkedTitle"
      >
      <el-button size="mini" type="primary" @click="uploadButtonClick">点击上传</el-button>
      <div v-show="getTipShow" slot="tip" class="el-upload__tip">{{uploadTip}}</div>
    </el-upload>
    <div v-if="disabled">
      <ul>
        <li v-for="(item,index) in fileList" class="displayItem" :key="index" >
          <a :herf="item.url" :download="item.name" @click="downloadItem(index)" style="color:#000000!important;">
            <i class="el-icon-document"></i>
            {{item.name}}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<style>
  .displayItem{
    color: #606266;
    display: block;
    margin-top: 5px;
    overflow: hidden;
    padding-left: 4px !important;
    text-overflow: ellipsis;
    -webkit-transition: color .3s;
    transition: color .3s;
    white-space: nowrap;
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.8;
    cursor:pointer;
    transition: all .5s cubic-bezier(.55,0,.1,1);
  }
  .el-icon-document{
    height: 100%;
    margin-right: 7px;
    color: #909399;
    line-height: inherit;
    background-color: white;
  }
  .displayItem:hover{
    background-color: #f5f7fa;
  }
  a:link,a:visited,a:hover{
    color:#000000!important;text-decoration:none;
  }
</style>

<script>
  import Vue from 'vue'
  import $ from 'jquery'
  //import { Upload } from 'element--ui'
  import {ajaxProxyRequest} from '@/components/util/base'
	//Vue.use(Upload)
  export default {
    name:"mindUpload",
    data() {
      return {
          // 传入的List数据
          fileList: [],
          tipShow:false,
          visaed:true,
          deleteId:"",
      };
    },
    props: {
          // 传入的上传数量限制
          limitNumb:{
            default:99,
            require:true
          },
          showfileList: {
            type: Boolean,
            default() {
              return true;
            }
          },
          uploadTip:{
            type:String,
            default(){
              return ''
            },
          },
          callBack:{
            type:Function
          },
          itemIndex:{
            default(){
              return '0'
            }
          },
          disabled:{
            type:Boolean,
            default(){
              return false
            },
            require:false
          },
          /* 使用 data 替换
           serverId:{type:String},//服务id
           caseId:{type:String},//登记号
           flowId:{type:String}, //流程id
           execType:{type:String},//操作类型
           */
          data:{ //附带参数
            type:Object,
            default(){
              return {}
            },
          },
          accept:{
            type:String,
            default(){
              return ''
            }
          },
          attachIds:{type:String},//默认显示附件ids格式【id1,id2】
          up_url:{
            default(){
              return '/njmind/attachment/upload'
            },
            require:false
          },
          beforeUpload:{
            type:Function,
            require:false,
          },
          checkedFile: Function,//选中
          checkedTitle: String,//显示说明
          successed:{ //在质量控制中的技术资料中用于多文件上传处理 单文件上传成功
            type:Function,
            require:false
          },
          deleted:{ //单文件上传失败
            type:Function,
            require:false,
          },
          buttonClick:{
            type:Function,
            require:false,
          },
          // 是否多文件上传
          multiple:{
            type:Boolean,
            required:false,
            default:true,
          }
    },
    mounted(){
      //初始化加载附件
      this.findAttachments()
      //this.hiddenUploadBtn()
    },
    methods: {
      setDeleteIds(ids){
        this.deleteId=ids;
      },
      downloadItem(index){
        window.open(this.fileList[index].url);
      },
      handleBeforeUpload(file){
        if(this.beforeUpload) {
          return this.beforeUpload(file);
        }
      },
      //hiddenUploadBtn(){
          //TODO 待优化 disabled 状态使用列表方式不使用原控件展现，原控件会影响 统一显示效果
          //因为使用的是 jq方式设置页面控件属性的
          /*if(this.disabled){
            //console.log("disabled",this.disabled);
            $(".el-upload").hide();
            $(".el-upload__tip").hide();
            $(".el-upload-list__item-status-label").each(function(i,row){
              $(this).css("display","none")
            });
          }*/
      //},
      handleRemove(file, fileList) {
        //debugger;
        //是否删除服务器数据？
        if(this.deleted){
          console.log('delete ddd')
          this.deleted(file,fileList,this.itemIndex)
        }
        if(this.callBack){
            this.callBack(file,fileList,this.itemIndex);
        }
      },
      handlePreview(file) {
        //点击下载操作
        //console.log(file);
        window.open(file.url);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`选择限制 `+this.limitNumb+` 个文件，共有 `+(files.length + fileList.length)+` 个文件！如需覆盖请先删除！`);
      },
      beforeRemove(file, fileList) {
        //debugger;
         if(this.deleteId.length==0){
          return this.$confirm(`确定移除 ${ file.name }？`);
         }else{
           return ;
         }
      },
      handleSuccess(response, file, fileList){
        //文件上传成功时的钩子
        //debugger;
        //console.log(file,fileList);
        if(response.success=='1'){
          this.$message.success(response.msg);
          file.url=response.v_server_url+response.v_attach_id;
          file['id']=response.v_attach_id;
          if(this.callBack){
//            debugger
            if(this.deleteId.length>0){
              for(let i=0;i<fileList.length;i++){
                if(this.deleteId.indexOf(fileList[i].id)!=-1){
                  fileList.splice(i,1);
                }
              } 
              this.deleteId="";
            } 
            if(this.successed){
              console.log('upload Function')
              this.successed(file,fileList,this.itemIndex)
            }
            this.callBack(file,fileList,this.itemIndex);
          }
        }else{
          this.$message.error(response.msg);
          fileList.splice(fileList.length,fileList.length);
        }
      },
      handleError(err, file, fileList) {
        //文件上传失败时的钩子
        //debugger;
        //console.log(err,file,fileList);
      },
      getTipShow(){
         if(this.uploadTip && this.uploadTip.length>0){
          this.tipShow=true;
        }else{
          this.tipShow=false;
        }
      },
      loadAttacheIds(ids){
          let _this=this;
          this.fileList=[];
          var reg = new RegExp(",","g");//g,表示全部替换。
          let tids="'"+ids.replace(reg,"','")+"'";
          //TODO 案例 findParam 字典数据单个获取【带参数，不使用缓存调用】
          ajaxProxyRequest('post', '/njmind/findPage/findAttachs', {attach_ids:tids,isAll:'1'}, (res) => {
            //console.log(res.list);
            //code 下载地址（优先级外网地址>>内网地址）无外网地址显示内网地址
            //remark 文件名
            //pcode 内网下载地址
            //premark 附件id
            //this.$emit('getFileList', res.list)
              if(res && res.rows){
                    for(let i=0;i<res.rows.length;i++){
                      let ent=res.rows[i];
                      let obj = {name:ent.remark,url:ent.code,id:ent.premark}
                      if(ent['isDown']=='1'){
                        obj['checked'] = true
                      }else{
                        obj['checked'] = false
                      }
                      Vue.set(_this.fileList,i,obj)
                    }
                //_this.callBack(null,_this.fileList);
                //console.log(_this.$refs.upFiles.$el);
                //if(this.disabled===false){//上传控件有效的情况下需要调用
                  Vue.nextTick(function () {
  //                  debugger
                    if(_this.callBack){
                      _this.callBack(null,_this.fileList,_this.itemIndex);
                      //_this.hiddenUploadBtn();
                    }
                  })
                //}
              }
          })
      },
      findAttachments(){
        //console.log("附件ids：",this.attachIds);
        //debugger;
        if(this.attachIds && this.attachIds.length>0){
            this.loadAttacheIds(this.attachIds);
        }
      },
      deleteFile(){
        this.fileList=[];
      },
      /** 选中点击checkbox触发 */
      checkedFiles(file){
        //console.log("文件checkbox被点击",file);
        if(this.checkedFile){
          this.checkedFile(file);
        }
      },
      /***当点击上传文件按钮时触发的回调**** */
      uploadButtonClick(){
        if(this.buttonClick){
          this.buttonClick();
        }
      }
    },
    computed:{

    },
    watch:{
      fileList(){
        this.visaed=false;
        this.$nextTick(()=>{
          this.visaed=true;
        });
      }
    }
  }
</script>
