<template>
<div>
  <div style="width:200px;">
    <mind-upload ref="upFiles"  :limitNumb="limitNumb" 
                :disabled="disabled"
                :data="fdata"
                :callBack="callBack" 
                :uploadTip="uploadTip" 
                :checkedFile="checkedFile"
                :checkedTitle="checkedTitle"
                >
               
    </mind-upload>
                <!-- :attachIds="attachIds"  -->
                <!-- disabled=true 上传控件失效 只能查看 -->
                <!--  <template slot="item" slot-scope="scope">
                  <span>  看到了吗！</span>
                </template> -->
  </div>
  <div style="width:200px;height:200px;">
    <mind-upimage ref="upImage" :disabled="disabled" :callBack="callBack" :data="fdata"  >
    </mind-upimage>
  </div>

  <div> <button @click="deleteFile"> 删除</button> </div>
</div>
</template>
<script>
  import Vue from 'vue';
  import $ from 'jquery'
  import {ajaxProxyRequest} from '@/components/util/base'
  /**
   * TODO 案例 附件上传
   * 
   * 
   * 根据附件ids获取
   * /njmind/findParam/findAttachDownUrl
   *  传参数 {attach_ids:"'id1','id2'"}
   *  即可返回 下载地址和文件名
   */
  export default {
      name: "upload-file",
      data(){
          return {
            fileList:[], //
            limitNumb:4,//附件上传个数限制
            attachIds:'A00000000214,A00000000215',//初始化加载附件 [非必填]
            up_url:'',//自定义上传路径 [非必填]  默认不用修改
            disabled:false, //true上传控件失效 只能查看
            fdata:{//附件额外参数
              //v_is_down:'0',//允许下载 1允许0不允许 默认是1
              serverId:'',//服务id     [非必填]  分布式附件服务可以用默认不用配制
              flowId:'', //流程id      [非必填]  流程相关
              execType:'签名',//操作类型   [非必填]  业务相关
              caseId:'',//登记号       [非必填]  业务相关的登记号
              childPath:"证书/@yyyy/MM/dd@", //例如 证书指定路径  【1】@yyyyMMdd@  会自动替换成当前日期 yyyyMMdd
            },
            uploadTip:'上传控件提示',
            checkedTitle:'不允许下载',
          }
      },
      methods:{
        //callBack上传组件数据发生变化回调
        callBack(file,list){
          this.fileList=list;
          console.log("调用上传页面收到的 附件列表",this.fileList);
          /* 
          返回参数说明
          list:[{
            id:"附件id",
            name:"附件名",
            url:"附件下载链接",
            //注意：response*只有新上传才有该属性，初始化加载的附件没有该属性
            response:{v_attach_id:"附件id",
                      v_server_url:"下载前缀",
                      v_stream_url:"流读取前缀加上（v_attach_id）后可以在后台读取，用于上传导入具体后台方法见文档"}
          },{……}]
          */
        },
        aproxy(){
              // 测试传集合
              /*
              let data=[{id:"1",valu:"ddd"},{id:"2",valu:"ddd"},{id:"3",valu:"ddd"}];
              $.ajax({
                  url:'/njmind/findtest',
                  type:'post',
                  data:{list:JSON.stringify(data)} ,
                  xhrFields:{
                    withCredentials:true
                  },
                  crossDomain:true,
                  success:(res)=>{
                      console.log(res);
                  }
              });
              */
          },
          deleteFile(){
            this.$refs.upFiles.deleteFile();
          },
          /** 选中checkbox选中附件 */
          checkedFile(file){
            //console.log("选中的附件",JSON.stringify(file) );
            
            if(file && file['checked'] !=null ){
              let param ={"v_attach_id":file.id,"v_is_down":file['checked']?'0':'1'}; 
              ajaxProxyRequest('post','/njmind/exeProc/setAttachFlag',param,(res)=>{
                if(res && res['v_msg'] && res['v_msg']=='success'){
                  this.$message.success("设置成功！");
                }else if(res['v_msg']){
                  this.$message.error(res['v_msg']);
                }else{
                  this.$message.error("设置失败！");
                }
              });
            }
          }

        },
        mounted(){
          //this.aproxy()
          //动态变更 初始化附件
          this.$refs.upFiles.loadAttacheIds('A00000000214,A00000000215');
          this.$refs.upImage.loadAttacheIds('A00000000371');

          
        }
  }



</script>