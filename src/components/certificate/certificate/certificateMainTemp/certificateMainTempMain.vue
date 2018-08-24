<template>
    <div ref="mainTemp-page" style="height:100%;display: flex">
      <div class="certificateLeftMenu" style="width:250px;padding:0px 5px;" v-divDrag="{'drag':_ => calcOtherWidth()}" ref="certLeftMenu">
        <div></div>
        <CertificateListTree  ref="certificateListTree"  :dataList="dataList" :keyId="keyId" :treePid="treePid" :propsKey="propsKey" :currentKey="currentKey"
                              :leftClickMain="leftClick" @showRightClickMenu="showRightClickMenu" :expandAll="true"/>
      </div>
      <div class="certificateContent" :style="{'width':calcWidth+'px','padding':'0px 5px','z-index':'1'}">
        <CertificateMainTemplateDetail v-if="!!isRouterAlive" :zmbId="zmbId" />
        <CertificateMainTempForm v-if="!!edit" :data="edit" :callback="handleEditCallback"/>
      </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import CertificateListTree from '../../common/certificateListTree';
  import CertificateMainTemplateDetail from './certificateMainTemplateDetail';
  import Clickoutside from '@/common-el/src/utils/clickoutside';
  import CertificateMainTempForm from './certificateMainTempForm';
  import {ajaxRequest } from '../../../util/base';
  import vueBus from 'vue-bus';
  import '../../../util/Base.css';
  import $ from 'jquery'

/*   import {Container,Aside,Main} from 'element--ui';
  Vue.use(Container);
  Vue.use(Aside);
  Vue.use(Main); */

  export default {
    name: "CertificateMainTempMain",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateListTree,CertificateMainTemplateDetail,CertificateMainTempForm,
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
        isRouterAlive:false,
        calcWidth:'',
      }
    },
    watch:{
      innerWidth(v){
        this.calcOtherWidth();
      },
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
          this.zmbId = zmbId;
          this.reload();
//          this.currentKey = this.zmbId;
        }
      },
      getDataList() {
        ajaxRequest('get', 'back/certificateMainTemp/list', {
          status:0,
        }, (res) => {
          res.rows.push({"zmbType":0,"zmbName":"信息页","zmbId":1},{"zmbType":0,"zmbName":"结果页","zmbId":2},);
          if (res.code === 200) {
            this.dataList = res.rows;
          }
        });
      },
      showRightClickMenu(event,obj,node){
        let handleOperation=this.handleOperation;
        let ops=[],
            temp=false;
        //判断当前选择的是什么节点
        if(obj.zmbType == '0'){
          ops=[this.folderOps[0]];//1、防止下面的粘贴按钮多次追加；2、防止信息页的主模板粘贴到结果页的主模板中去
          if(this.copyZmbId){
            if(this.copyType == obj.zmbId){
              temp=true;
              ops.push({"type":"4","name":"粘贴"});
            }
          }
        }else if(obj.zmbType == '1' || obj.zmbType == '2'){
          ops=this.fileOps;
        }
        let RightClickMenu = Vue.extend({
          data(){
            return {
              ops:ops,
              temp:temp
            }
          },
          methods: {
            handleClose () {
              this.$destroy(true);
              if(this.$el.parentNode){
                this.$el.parentNode.removeChild(this.$el);
              }
            },
            handleRightClickOperation (op,_this) {
              this.handleClose();
              handleOperation(obj,node, op,_this)
            },
            handleOpen(){
              this.$el.style.visibility='hidden'
              return true
            }
          },
          directives: { Clickoutside },
          template:`<ul class="right-click-menu" v-clickoutside="handleClose">
                      <li v-if="${obj.zmbType} == 0" v-mindPopover="{message:'<div>新增证书模板</div><div><el-input v-model=flag3 v-focusSelectFull></el-input></div>',success:handleRightClickOperation.bind(this,0),info:'',placement:'bottom',isOpen:handleOpen.bind(this)}">增加模板</li>
                      <li v-if="${temp} == true" @click="handleRightClickOperation(4)">粘贴</li>
                      <li v-if="${obj.zmbType} == 1 || ${obj.zmbType} == 2" v-mindPopover="{message:'<div>重命名证书模板名称为</div><div><el-input v-model=flag3 v-focusSelectFull></el-input></div>',success:handleRightClickOperation.bind(this,1),info:'${obj.zmbName}',isOpen:handleOpen.bind(this)}">重命名</li>
                      <li v-if="${obj.zmbType} == 1 || ${obj.zmbType} == 2" @click="handleRightClickOperation(2)">复制</li>
                      <li v-if="${obj.zmbType} == 1 || ${obj.zmbType} == 2" v-mindPopover="{message:'是否删除?',success:handleRightClickOperation.bind(this,3),isOpen:handleOpen.bind(this)}">删除</li>
                    </ul>`
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
      // handleEdit(rowInfo,op){
        // var pId = rowInfo.zmbId ;
        // //删除上一层及的属性
        // delete rowInfo.parents ;
        // if(op == 0){
        //   //新增主模板
        //   rowInfo = {}
        //   rowInfo.zmbType = pId ;
        // }
        // else if(op == 1) {
        //   //模板重命名
        //   //获得菜单树的key
        //   this.currentKey = rowInfo.zmbId;
        // }
        // this.edit = rowInfo
      // },
      handleEdit(rowInfo,op,_value){
        //删除上一层及的属性
        delete rowInfo.parents ;
        if(op == 1) {
          //模板重命名
          //获得菜单树的key
          this.currentKey = rowInfo.zmbId;
        }
        if(_value.flag3 == ''){
          this.$message.error('证书模板名称不能为空')
          return true
        }
        let _this = this;
        if (op == 0) {
          ajaxRequest("post", "back/certificateMainTemp/", {zmbType:rowInfo.zmbId,zmbName:_value.flag3}, function(res) {
            if (res.code == 200) {
                _this.$message.success('添加成功');
                _this.$refs.certificateListTree.updateNode(res.daoResult.zmbType,res.rows);
            } else {
              _this.$message.error("添加失败");
            }
          });
        } else {
          //把时间字段删掉
          ajaxRequest("post", "back/certificateMainTemp/renameZmbName",{_method:'post',zmbId:rowInfo.zmbId,zmbName:_value.flag3,backupType:1,zmbType:rowInfo.zmbType}, function(res) {
            if (res.code == 200) {
              _this.$message.success("修改成功");
              _this.$refs.certificateListTree.updateNode(res.daoResult.zmbType,res.rows);
            } else {
              _this.$message.error("修改失败");
            }
          });
        }
      },
      //弹出层回调
      handleEditCallback(key,children){
        this.edit=null;
        this.$refs.certificateListTree.updateNode(key,children);
      },
      handleOperation (obj,node, op,_this){
        if(op == 3){
          //删除模板
          this.handleDelete(obj);
        } else if( op == 2){
          //复制模板
          this.handleCopy(obj);
        }else if( op == 4) {
          //粘贴模板
          this.handlePaste(this.copyZmbId);
        }else{
          //新增或重命名
          this.handleEdit(obj,op,_this);
        }
      },
      //删除模板
      handleDelete (data) {
        let _this = this;
        if (data.zmbId) {
          // this.$confirm('确定要删除该模板?', '提示', {
          //             confirmButtonText: '确定',
          //             cancelButtonText: '取消',
          //             type: 'warning',
          //             center:true,
          //           }).then(() => {
                      ajaxRequest("post", "back/certificateMainTemp/deleteZmb",{_method:'post',zmbId:data.zmbId,status:1,backupType:0,zmbType:data.zmbType}, function(res) {
                         if (res.code == 200) {
                           _this.$message.success('删除成功')
                           _this.handleEditCallback(res.daoResult.zmbType,res.rows);

                           if (_this.copyZmbId == data.zmbId) {
                             //已删除的模板不允许再进行复制
                             _this.copyZmbId = "";
                           }
                           if (data.zmbId == _this.zmbId) {
                             //已删除的模板不允许再进行编辑
                             _this.isRouterAlive = false;
                           }
                         } else {
                           _this.$message.error('删除失败')
                         }
                       });
                    // },()=>{

                    // })
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
         // this.folderOps.push({"type":"0","name":"增加模板"},{"type":"4","name":"粘贴"});
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
//           ajaxRequest('get', 'back/certificateMainTemp/'+copyZmbId,null, (res) => {
//            if (res.code === 200) {
//              if(res.daoResult){
//                  //查询出来进行添加操作
//                  //把时间字段删掉
//                  delete res.daoResult.addTime
//                  delete res.daoResult.updateTime
//                  delete res.daoResult.deleteTime
//                  delete res.daoResult.enableDate
//                  delete res.daoResult.disableDate
//                  delete res.daoResult.backupTime
//                  delete res.daoResult.auditSubmitTime
//                  delete res.daoResult.auditOneTime
//                  delete res.daoResult.auditTwoTime
//                  delete res.daoResult.unAuditSubmitTime
//                  delete res.daoResult.unAuditOneTime
//                  delete res.daoResult.unAuditTwoTime
//                  delete res.daoResult.jdTime
//                  delete res.daoResult.hyTime
//                  delete res.daoResult.pzTime
//                  delete res.daoResult.folderClearTime
//                  delete res.daoResult.printTime
//                  delete res.daoResult.pdfTime
//                  delete res.daoResult.enableDate
//                  delete res.daoResult.disableDate
//                  delete res.daoResult.zsjdrq
//                  delete res.daoResult.zsyxrq
//                  delete res.daoResult.dataDate1
                    ajaxRequest("post", "back/certificateMainTemp/copyCertificateById", {copyZmbId:copyZmbId}, function(res) {
                      if (res.code == 200) {
                        _this.handleEditCallback(res.daoResult.zmbType,res.rows);
                        _this.$message.success("粘贴成功");
                      } else {
                        _this.$message.error("粘贴失败");
                      }
                   });
//              }else{
//                _this.$message.error("粘贴失败");
//              }
//            }
//          });
        }
      },
      calcOtherWidth(){
        this.calcWidth = $(this.$refs['mainTemp-page']).parents('.tbs_info').width() - $(this.$refs['certLeftMenu']).width()
      },  
      reload(){
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      },
    },
    created () {
      console.group('%c%s', 'color:blue', 'created 创建完毕状态》')
      this.getDataList();
    },
  }
</script>

<style lang="scss" scoped>
  .certificateLeftMenu {
    top: 0px;
    left: 0px;
    width: 200px;
    bottom: 0px;
    overflow: auto;
  }
  .certificateContent {
    width:100%;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 200px;
  }
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
