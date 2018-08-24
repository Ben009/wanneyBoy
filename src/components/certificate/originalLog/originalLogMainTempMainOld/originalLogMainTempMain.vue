<template>
  <el-container>
    <el-container>
      <el-aside width="200px">
        <CertificateListTree :dataList="dataList" :keyId="keyId" :treePid="treePid" :propsKey="propsKey" :currentKey="currentKey"
                             :leftClickMain="leftClick" @showRightClickMenu="showRightClickMenu" />
      </el-aside>
      <el-main >
        <OriginalLogMainTemplateDetail v-if="!!zmbId" :zmbId="zmbId" />
        <OriginalLogMainTempForm v-if="!!edit" :data="edit" :callback="handleEditCallback"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import CertificateListTree from '../../common/certificateListTree';
  import OriginalLogMainTemplateDetail from './originalLogMainTemplateDetail';
  import Clickoutside from '@/common-el/src/utils/clickoutside';
  import OriginalLogMainTempForm from './originalLogMainTempForm';

  import {ajaxRequest } from '../../../util/base';
  import vueBus from 'vue-bus';
  import '../../../util/Base.css'

/*   import {Container,Aside,Main} from 'element--ui';
  Vue.use(Container);
  Vue.use(Aside);
  Vue.use(Main); */

  export default {
    name: "admin",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateListTree,OriginalLogMainTemplateDetail,OriginalLogMainTempForm,
    },
    data(){
      //rentun中的变量仅针对当前组件有效
      return{
        isSetting:0,
        menuIndex:7,
        tempValue:null,
        /** sidtran:"兄弟组件间交互缓存变量",*/
        dataList:[],
        zmbId:"",
        keyId:"zmbId",
        treePid:"zmbType",
        propsKey:{label: 'zmbName', children: 'children'},
        //主文件夹的事件
        folderOps:[
          {"type":"0","name":"增加模板"},
        ],
        //主模板的事件
        fileOps:[
          {"type":"1","name":"重命名"},
          {"type":"2","name":"复制"},
          {"type":"3","name":"删除"}
        ],
        edit:null,
        currentKey:null,
        copyZmbId:"",
        copyInfo:"",
        copyType:"",
      }
    },
    watch:{
    },
    methods:{
      reFreashDateList(index){
        this.getDataList();
      },
      leftClick(data ){
        var zmbId = data.zmbId ;
        var zmbType = data.zmbType
        //判断是否父节点
        if(zmbType != 0 ){
          this.zmbId = zmbId ;
//          this.currentKey = this.zmbId;
        }
      },
      getDataList() {
        let _this = this;
        ajaxRequest('get', 'back/originalogMainTemp/list', {
          status:0,
        }, (res) => {
          if (res.code === 200) {
//            let dataTreeList = this.formatArrayToTree(res.rows, [], 0, []);
           res.rows.push({"zmbType":0,"zmbName":"信息页","zmbId":1},{"zmbType":0,"zmbName":"HTML模板","zmbId":2},);
           _this.dataList = res.rows;
          }
        });
      },
      showRightClickMenu(event,obj,node){
        let handleOperation=this.handleOperation;
        let ops=[];
        this.folderOps = [{"type":"0","name":"增加模板"}];
        //判断当前选择的是什么节点
        if(obj.zmbType == '0'){
          if(this.copyZmbId){
            if(this.copyType == obj.zmbId){
              this.folderOps.push({"type":"4","name":"粘贴"});
            }
          }
          ops=this.folderOps;
        }else if(obj.zmbType == '1' || obj.zmbType == '2'){
          ops=this.fileOps;
        }
        let RightClickMenu = Vue.extend({
          data(){
            return {
              ops:ops
            }
          },
          methods: {
            handleClose () {
              this.$destroy(true);
              this.$el.parentNode.removeChild(this.$el);
            },
            handleRightClickOperation (op) {
              this.handleClose();
              handleOperation(obj,node, op)
            }
          },
          directives: { Clickoutside },
          template:
          '<ul class="right-click-menu" v-clickoutside="handleClose">' +
          '<li v-for="v in ops" @click="handleRightClickOperation(v.type)">{{v.name}}</li>' +
          '</ul>'
        });
        let instance = new RightClickMenu().$mount();

        document.body.appendChild(instance.$el);
        let windowWidth=document.documentElement.clientWidth,
          windowHeight=document.documentElement.clientHeight,
          eventX=event.clientX,
          eventY=event.clientY;
        let dom=instance.$el,
          menu=dom.getBoundingClientRect();
        let left=eventX+menu.width>windowWidth ? eventX-menu.width : eventX,
          top=eventY+menu.height>windowHeight ? eventY-menu.height : eventY;
        dom.style.top=top+'px';
        dom.style.left=left+'px';
      },
      //显示弹出层
      handleEdit(rowInfo,op){
        var pId = rowInfo.zmbId ;
        //删除上一层及的属性
        delete rowInfo.parents ;
        //新增主模板
        if(op == 0){
          rowInfo = {}
          rowInfo.zmbType = pId ;
        }
        //模板重命名
        else if(op == 1) {
          //获得菜单树的key
          this.currentKey = rowInfo.zmbId;
        }
        this.edit = rowInfo
//          this.edit = rowInfo || {}
      },
      //弹出层回调
      handleEditCallback(zmbId){
        this.edit=null;
        if(zmbId){
          this.currentKey = zmbId;
        }
        this.reFreashDateList();
        this.zmbId = zmbId ;
      },
      handleOperation (obj,node, op){
        if(op == 3){
          //删除模板
          this.handleDelete(obj);
        } else if( op == 2){
          //复制模板
          this.handleCopy(obj);
        }else if( op == 4) {
          //粘贴模板
          this.handlePaste(this.copyZmbId);
        } else{
          //新增或重命名
          this.handleEdit(obj,op);
        }
      },
      //删除模板
      handleDelete (data) {
        let _this = this;
        if (data.zmbId) {
          this.$confirm('确定要删除该模板?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center:true,
                  }).then(() => {
                    ajaxRequest("post", "back/originalogMainTemp/updateOriginalog",{_method:'post',zmbId:data.zmbId,status:1,backupType:0}, function(res) {
                       if (res.code == 200) {
                         _this.$message.success('删除成功')
                         _this.getDataList()
                       } else {
                         _this.$message.error('删除失败')
                       }
                     });
                  },()=>{

                  })
        } else {
          _this.$message({
            message: '请先选择要删除的模板',
            type: 'warning'
          })
        }
      },
      //复制模板
      handleCopy (data) {
        //this.folderOps=[];
        this.copyZmbId = data.zmbId;
        this.copyType = data.zmbType;//copy的证书类型
        if (this.copyZmbId) {
          //this.folderOps.push({"type":"0","name":"增加模板"},{"type":"4","name":"粘贴"});
          this.$message.success('复制成功')
        } else {
          this.$message({
            message: '请先选择要复制的模板',
            type: 'warning'
          })
        }
      },
      //粘贴模板
      //分为两步 第一步先根据模板查询 第二步根据查询的结果进行插入操作
      handlePaste(copyZmbId) {
        let _this = this;
        if(_this.copyZmbId == ""){
            _this.$message({
            message: '请先选择要复制的模板',
            type: 'warning'
          })
          return;
        }
        if (copyZmbId) {
          //先根据copy模板的ID进行查询
           ajaxRequest('get', 'back/originalogMainTemp/'+copyZmbId,null, (res) => {
            if (res.code === 200) {
              if(res.daoResult){
                  //查询出来进行添加操作
                  //把时间字段删掉
                  delete res.daoResult.addTime
                  delete res.daoResult.updateTime
                  delete res.daoResult.deleteTime
                  delete res.daoResult.enableDate
                  delete res.daoResult.disableDate
                  delete res.daoResult.backupTime
                  delete res.daoResult.auditSubmitTime
                  delete res.daoResult.auditOneTime
                  delete res.daoResult.auditTwoTime
                  delete res.daoResult.unAuditSubmitTime
                  delete res.daoResult.unAuditOneTime
                  delete res.daoResult.unAuditTwoTime
                  delete res.daoResult.jdTime
                  delete res.daoResult.hyTime
                  delete res.daoResult.pzTime
                  delete res.daoResult.folderClearTime
                  delete res.daoResult.printTime
                  delete res.daoResult.pdfTime
                  delete res.daoResult.enableDate
                  delete res.daoResult.disableDate
                  delete res.daoResult.zsjdrq
                  delete res.daoResult.zsyxrq
                  delete res.daoResult.dataDate1
                  ajaxRequest("post", "back/originalogMainTemp/", res.daoResult, function(res) {
                  if (res.code == 200) {
                    //把copy证书ID的值设为空
                    _this.copyZmbId="";
                    _this.folderOps=[{"type":"0","name":"增加模板"},];
                    _this.getDataList();
                    _this.$message.success("粘贴成功");
                  } else {
                    _this.$message.error("粘贴失败");
                  }
               });
              }else{
                _this.$message.error("粘贴失败");
              }
            }
          });
        }
      },
    },
    created () {
      console.group('%c%s', 'color:blue', 'created 创建完毕状态》')
      this.getDataList();
    },
  }
</script>

<style>
  .el-header, .el-footer {
    color: #333;
    text-align: center;
  }

  .el-aside {
    color: #333;
    text-align: center;
  }

  .el-main {
    color: #333;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .el-table{
    overflow: visible;
  }
  .el-table .cell{
    overflow:visible;
  }
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
</style>
