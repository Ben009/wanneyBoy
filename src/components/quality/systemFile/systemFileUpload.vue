<!-- 体系文件，文件上传 -->
<template>
  <div>
    <div class="baseDetail title-item flex mb20">
      <span class="flex-one">体系文件管理</span>
      <div>
        <global-tootips style="float: right">
          <p>1、您可在目录结构处按要求新建文件夹[通过鼠标右键操作]；</p>
          <p>2、上传的文件若需授控（仅可通过系统查看，无法下载、复制、打印），则不要勾中“可下载”按钮（仅支持WORD或EXCEL）；</p>
          <p>3、选择部门则表示仅该部门人员可看到；未选择任何一个部门表示所有部门人员均可查看,有高级查询权限可查看所有；</p>
          <p>4、系统支持批量上传，系统将文件上传至选中的目录下方。</p>
          <p>4、移除文件，需要点击保存按钮。</p>
        </global-tootips>
      </div>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="mini" style="margin-top:10px;">
      <el-row>
        <el-col :span="8">
          <span>附件</span>
          <mind-upload ref="upFiles"
                       :limitNumb="limitNumb"
                       :callBack="callBack"
                       :checkedFile="checkedFile"
                       :checkedTitle="checkedTitle"
                       :beforeUpload="fileChecks"
          >
          </mind-upload>
          <el-input v-model="form.attachment" v-show="show"></el-input>
        </el-col>
      </el-row>

      <br>

      <el-row>
        <el-col :span="4">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        </el-col>
      </el-row>


      <el-row>
        <el-checkbox-group v-model="checkList" @change="selectCk">
          <el-col :lg="6" v-for="item in departs">
            <el-checkbox :label="item.id" :key="item.id">{{item.departName}}</el-checkbox>
          </el-col>
        </el-checkbox-group>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer" style="display: block;  text-align: center;">
          <el-button type="primary" @click="handleSubmit">保 存</el-button>
   </span>

  </div>


</template>

<script>

  import Vue from 'vue'

  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest,ajaxSyncProxyRequest } from '../../util/base'


  export default {
    name: "systemFileUpload",
    props: {
      id: {
        type: String
      },
      type: {
        type: String
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        checkAll:false,
        isIndeterminate: true,
        form: {},
        rules: {},
        departs: [],
        checkList: [],
        show: false,
        attachment: null,
        multipleSelection: [],
        fileList:[], //
        limitNumb:4,//附件上传个数限制
        checkedTitle:'可下载，仅针对pdf，excel、word有效',
      }
    },
    watch: {
      id: function (id, oldId) {
        this.getFileList(id);
      }
    },
    mounted() {
      this.getDepartList()
    },
    methods: {
      handleCheckAllChange(val) {
        let arr = [];
        this.departs.forEach(e=>{
          arr.push(e.id);
        })

        this.checkList = val ? arr : [];
        this.isIndeterminate = false;
      },
      selectCk() {
        console.log("已选中", this.checkList)
      },
      callBack(file, list) {
        // let fileId = ''
        this.fileList = list
        console.log(this.fileList);
      },
      getDepartList() {
        //获取部门数据
        ajaxSyncRequest("get", "back/depart/list/", {isDelete: 0}, res => {
          this.departs = res.rows;
        });
      },
      handleSubmit() {
        if (!this.id) {
          this.$message.success('请选择一个目录');
          return;
        }
        let departId = "";
        this.checkList.forEach((e) => {
          departId = departId + e + ","
        })

        if (departId.length > 0) {
          departId = departId.substr(0, departId.length - 1);
        }
        let fileArr = new Array();
        //文件
        let flag = true;
        this.fileList.forEach((v) => {
          let obj = new Object();
          obj.isDownload = v.checked==true?1:0;
          obj.id = parseInt(this.id);//目录ID
          obj.name = v.name;//文件名称
          obj.departId = departId;//可查看的部门
          obj.address = v.url;//文件url
          obj.attachment = v.id;//文件列表的id
          fileArr.push(obj);
          //批量设置是否可下载
          if(v && v.checked !=null ){
            let param ={"v_attach_id":v.id,"v_is_down":v.checked?'1':'0'};
            ajaxSyncProxyRequest('post','/njmind/exeProc/setAttachFlag',param,(res)=>{
              if(res && res['v_msg'] && res['v_msg']=='success'){
              }else if(res['v_msg']){
                flag = false;
                return;
              }else{
                flag = false;
                return;
              }
            });
          }
        })
        if(!flag){
          this.$message.success('添加失败')
          return;
        }
        ajaxSyncRequest('post', 'back/systemFiles/', {systemFiles: JSON.stringify(fileArr),id:this.id}, (res) => {
          if (res.code === 200) {
            this.$message.success('添加成功')
          } else {
            this.$message.error('添加失败')
          }
        })

      },
      /** 选中checkbox选中附件 */
      checkedFile(file){
        console.log(this.fileList);
        //console.log(file);
        //console.log("选中的附件",JSON.stringify(file) );

        // if(file && file['checked'] !=null ){
        //   let param ={"v_attach_id":file.id,"v_is_down":file['checked']?'0':'1'};
        //   ajaxProxyRequest('post','/njmind/exeProc/setAttachFlag',param,(res)=>{
        //     if(res && res['v_msg'] && res['v_msg']=='success'){
        //       this.$message.success("设置成功！");
        //     }else if(res['v_msg']){
        //       this.$message.error(res['v_msg']);
        //     }else{
        //       this.$message.error("设置失败！");
        //     }
        //   });
        // }
      },
      //获取文件和部门
      getFileList(id) {
        this.$refs.upFiles.loadAttacheIds("")
        if (id){
          this.fileList = [];
          this.checkList = [];
          ajaxSyncRequest('get', 'back/systemFiles/', {directoryId: id}, (res) => {
            let files = "";
            let departs = "";
            if (res.code === 200) {
              res.rows.forEach((v) => {
                files = files + v.attachment + ","
                departs = v.departId;
              })

              if (files.length > 0) {
                files = files.substr(0, files.length - 1);
                this.$refs.upFiles.loadAttacheIds(files)
              }else{
                this.fileList = [];
              }

              let arr = new Array();
              if(departs!=null && departs!=""){
                var strings = departs.split(",");
                strings.forEach((v) => {
                  arr.push(parseInt(v))
                })
                this.checkList = arr;
              }else {
                this.checkList = [];
              }
            } else {
              this.$message.error('添加失败')
            }
          })
        } else {
          this.fileList = [];
          this.checkList = [];
        }

      },
      //文件大小检查
      fileChecks(file){
        const isLt50M = file.size / 1024 / 1024 < 50;
        if(!isLt50M) {
          this.$message.error('大小不能超过 50MB!');
        }
        return isLt50M;
      }
    }
  }
</script>

<style type="text/css" lang="scss">


  .baseDetail {
  .flex-one {
    flex: 1;
  }
  .mb20 {
    margin-bottom: 20px;
  }

  .shuoming {
    border: none !important;
    color: #56BC4E !important;
    font-size: 16px !important;
    float: right;
    cursor: pointer;
  }
  .shuoming::after {
    content: "";
    position: absolute;
    z-index: 999;
  }
  .el-sm {
    background: #ffffff;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 7px 33px -9px #969696;
    box-shadow: 1px 7px 33px -9px #969696;
    border: 1px solid #56bc4e8c;
    border-radius: 5px;
    color: dimgrey;
    margin-left: -345px;
    margin-right: 15px;
    word-break: break-all;
    margin-top: 5px;
    padding: 4px 5px;
    font-size: 14px;
    opacity: 50;
    float: right;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
  }
  }

</style>
