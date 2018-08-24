<template>
  <div>
    <el-upload
      ref="upImage"
    class="avatar-uploader"
    style="padding-top: 10px"
    :action="up_url"
    :disabled="disabled"
    :data="data"
    :accept="accept"
    :before-upload="beforeUpload"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-exceed="handleExceed"
    :show-file-list="false"
    v-if="!disabled">
    <img v-if="imageUrl" :src="imageUrl" style="display: block;" :width="width+'px'" :height="height+'px'">
    <span v-else class="el-icon-plus avatar-uploader-icon" :style="{width:width+'px',height:height+'px',display:'inline-block',lineHeight:height+'px'}"></span>
    </el-upload>
    <!-- img上传的时候与下面的for循环看不出关系 -->
    <div v-if="disabled">
      <ul>
        <li v-for="(item,index) in fileList" style="cursor:pointer;" :key="index">
          <a :herf="item.url" :download="item.name">
            <img :src="item.url" :width="width+'px'" :height="height+'px'">
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
  import Vue from 'vue'
  import $ from 'jquery'
  //import { Upload } from 'element--ui'
  import {ajaxProxyRequest} from '@/components/util/base'
	//Vue.use(Upload)
  export default {
    name:"mindUpimage",
    data() {
      return {
        fileList: [],
        imageUrl: '',
      };
    },
    props: {
          callBack:{
            type:Function
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
          // 上传图片的类型 字符串类型 逗号分隔
          fileType:{
            type:String,
            default(){
              return 'image/jpeg'
            }
          },
          width:{type:String, default:'178px'},//展示图片宽度
          height:{type:String, default:'178px'}//展示图片高度
    },
    mounted(){
      //初始化加载附件
      this.findAttachments()
      //this.hiddenUploadBtn()
    },
    methods: {
      downloadItem(index){
        window.open(this.fileList[index].url);
      },
      beforeUpload(file){
            let tempFileType = this.fileType.split(',');
            const isJPG = tempFileType.indexOf(file.type) !== -1;
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                let reg = new RegExp( 'image/' , "g" );
                this.$message.error(`上传图片只能是 ${this.fileType.replace(reg,'')} 格式!`);
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;

      },
      handleRemove(file, fileList) {
        //debugger;
        //是否删除服务器数据？
        //console.log(file, fileList);
        if(this.callBack){
            this.callBack(file,fileList);
        }
      },
      handlePreview(file) {
        //点击下载操作
        //console.log(file);
        //window.open(file.url);
      },
      handleExceed(files, fileList) {
        //debugger;
        this.$message.warning(`当前限制选择 ${limitNumb} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        //debugger;
        if(file && file.status==="success"){
          return this.$confirm(`确定移除 ${ file.name }？`);
        }
      },
      handleSuccess(response, file){
        //文件上传成功时的钩子
        //console.log(file,fileList);
        //msg:"上传成功！"
        //success:"1"
        //v_attach_id:"A00000000363"
        //v_server_url:"http://192.168.99.118:7900/attachment/down/"
        //v_stream_url:"http://192.168.99.118:7900/attachment/outputStream/
        if(response.success=='1'){
          this.$message.success(response.msg);
          file.url=response.v_server_url+response.v_attach_id;
          file['id']=response.v_attach_id;
          this.imageUrl=file.url;
          Vue.set(this.fileList,0,file)
          if(this.callBack){
              this.callBack(file,this.fileList);
          }
        }else{
          this.$message.error(response.msg);
        }
      },
      handleError(err, file, fileList) {
        //文件上传失败时的钩子
        //debugger;
        //console.log(err,file,fileList);
        this.$message.error(err);
      },
      loadAttacheIds(ids){
        let _this=this;
        var reg = new RegExp(",","g");//g,表示全部替换。
        let tids="'"+ids.replace(reg,"','")+"'";
          //TODO 案例 findParam 字典数据单个获取【带参数，不使用缓存调用】
         /*  ajaxProxyRequest('post', '/njmind/findParam/findAttachDownUrl', {attach_ids:tids,cache:"false"}, (res) => {
                  //console.log(res.list);
                  //code 下载地址（优先级外网地址>>内网地址）无外网地址显示内网地址
                  //remark 文件名
                  //pcode 内网下载地址
                  //premark 附件id
              if(res && res.list){
                for(let i=0;i<res.list.length;i++){
                  let ent=res.list[i];
                  Vue.set(this.fileList,i,{name:ent.remark,url:ent.code,id:ent.premark})
                  _this.imageUrl=ent.code
                }

                //_this.callBack(null,_this.fileList);
                //console.log(_this.$refs.upImage.$el);
                Vue.nextTick(function () {
                  if(_this.callBack){
                    _this.callBack(null,_this.fileList);
                    //$(".avatar-uploader .el-upload").show();
                  }
                })
              }
          }) */

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
                  Vue.set(this.fileList,i,{name:ent.remark,url:ent.code,id:ent.premark})
                  _this.imageUrl=ent.code
                } 
                Vue.nextTick(function () {
                  if(_this.callBack){
                    _this.callBack(null,_this.fileList); 
                  }
                })
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
        this.imageUrl = '';
        this.fileList=[];
      }
    },
    computed:{

    }
  }
</script>

<style lang="scss" scoped>
.avatar-uploader{
  height: 100%;
  width: 100%;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    padding-top:10px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
    border:1px dashed;
  }
</style>
