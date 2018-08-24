<template>
  <div style="display: flex;height:100%" ref="temp-page">
      <div class="certificateLeftMenu" style="width:250px;height:100%;padding:0px 5px;" v-divDrag="{'drag':_ => calcOtherWidth()}" ref="certLeftMenu">
        <div class="btn">
          <el-button type="primary" @click="searchDialog">搜索模板</el-button>
          <global-tootips style="float:right;margin-top:5px;" :width="170">
            <p><span>公共文件夹单独权限控制</span></p>
            <p>模板名称<span style="color:red">红色未开始审核</span></p>
            <p>模板名称<span style="color:green">绿色已一级审核</span></p>
            <p>模板名称<span>黑色已二级审核</span></p>
          </global-tootips>
        </div>
        <CertificateListTree ref="originalLogListTree" :dataList="dataList" :keyId="keyId" :treePid="treePid"
                             :propsKey="propsKey" :currentKey="currentKey" :isLazy="isLazy"
                             :leftClickMain="leftClick" @showRightClickMenu="showRightClickMenu" @getDataList="getDataList"
                             v-on:checkMb="checkMb" />
      </div>

      <div class="certificateContent" :style="{'width':calcWidth+'px','padding':'0px 5px','z-index':'1'}">
        <OriginalLogTemplateDetailMain v-if="isRouterAlive"
                                       :mbId="mbId"
                                       :changeJdyNoCkeck="changeJdyNoCkeck"
        />
        <OriginalLogTempMlForm v-if="!!edit" :data="edit" :callback="handleEditCallback"/>
        <OriginalLogTempDepartOrFolder  @refreshTree="refreshTree" v-if="!!departEdit" :data="departEdit" :callback="handleEditCallback"></OriginalLogTempDepartOrFolder>
        <OriginalLogTempSearch v-if="!!searchDialogShow"  :callback="handleCallback"  v-on:checkMb="checkMb"></OriginalLogTempSearch>
      </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import CertificateListTree from '../../common/certificateListTree';
  import OriginalLogTemplateDetailMain from './originalLogTemplateDetailMain.vue';
  import Clickoutside from '@/common-el/src/utils/clickoutside';
  import OriginalLogTempMlForm from './originalLogTempMlForm';
  import OriginalLogTempSearch from '../../common/originalLogCommon/originalLogTempSearch.vue';
  import {ajaxRequest,ajaxSyncRequest } from '../../../util/base';
  import vueBus from 'vue-bus';
  import '../../../util/Base.css';
  import OriginalLogTempDepartOrFolder from '../../common/originalLogCommon/originalLogTempDepartOrFolder.vue';
  import $ from 'jquery'

/*   import {Container,Aside,Main} from 'element--ui';
  Vue.use(Container);
  Vue.use(Aside);
  Vue.use(Main); */

  export default {
    name: "OriginalLogTempMain",
    components:{
      /** 模块对象 import 进来 后的别名  */
      CertificateListTree,OriginalLogTemplateDetailMain,OriginalLogTempMlForm,OriginalLogTempDepartOrFolder,OriginalLogTempSearch
    },
    data(){
      //rentun中的变量仅针对当前组件有效
      return{
        isSetting:0,
        menuIndex:7,
        tempValue:null,
        /** sidtran:"兄弟组件间交互缓存变量",*/
        dataList:[],
        demo:null,
        defaultExpandedKeys:[],
        mlId:"0",
        keyId:"keyMlId",
        keyMlId:"0",
        treePid:"mlIdParentTemp",
        propsKey:{label: 'mlName', children: 'children',isLeaf:'isLeaf'},

        //证书模板文件夹的事件
        folderOpsNotMP:[
          {"type":"7","name":"增加目录"},
          // {"type":"7","name":"增加文件夹"}
        ],
        //主文件夹的事件
        folderOpsNotP:[
          {"type":"0","name":"增加目录","extraConfig":{
            messageName:'增加目录名称',
          }},
          {"type":"1","name":"增加模板","extraConfig":{
            messageName:'增加模板名称',
          }}
        ],
        folderOps:[
          {"type":"0","name":"增加目录","extraConfig":{
            messageName:'增加目录名称',
          }},
          {"type":"2","name":"重命名","extraConfig":{
            messageName:'重命名目录名称',
            slug:'record'
          }},
          {"type":"1","name":"增加模板","extraConfig":{
            messageName:'增加模板名称',
          }},
//          {"type":"3","name":"复制"},
          {"type":"4","name":"剪切"},
//          {"type":"5","name":"删除","extraConfig":true}
//          {"type":"5","name":"删除"}
        ],
        //主模板的事件
        fileOps:[
          {"type":"2","name":"重命名","extraConfig":{
            messageName:'重命名模板名称',
            slug:'record'
          }},
          {"type":"3","name":"复制"},
          {"type":"4","name":"剪切"},
//          {"type":"5","name":"删除","extraConfig":true}
//          {"type":"5","name":"删除"}
        ],
        edit:null,
        //树的key
        currentKey:0,
        isLazy:true,
//        updateNode:null,
        mbId:null,
        isRouterAlive: false,
        //右键目录/菜单表的id
        copyId: null,
        //类型
        handType:null,
        dealTreeNodeType:null,
        departEdit:null,
        searchDialogShow: false,
        //模板维护时修改检定员信息
        changeJdyNoCkeck: true,
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
        console.log("进入方法 reFreashDateList")
        this.getDataList(index);
      },
      leftClick(data ){
        console.log("进入方法 leftClick")

        console.log(this.$refs.originalLogListTree.$refs.tree,"this.$refs.originalLogListTree.$refs.tree11111111111111111")
        //判断是否模板
        if(data.isLeaf){
          this.keyMlId = data.keyMlId ;
          this.mbId = data.mlId ;
          this.currentKey = this.keyMlId;
          //强制刷新组件
          this.reload();

        }else {
          this.mlId = data.mlId ;
          this.getDataList(this.mlId);

        }
      },
      //从后台获得数据
      getDataList(mlId) {
        console.log("进入方法 getDataList")

//        this.mlId = mlId ;
        let count = 0;
        //重命名进来的
        if(mlId){
        }
        //第一次进来的
        else {
          mlId = 0 ;
          this.dataList = [{"mlName":"记录模板","mlId":"0","keyMlId":"W0","isParent":"-1"}];
          this.$nextTick(()=>{
            //点击第一个文件夹
            this.$refs.originalLogListTree.$refs.tree.$children[0].handleClick();
          })
          return ;
        }
        ajaxSyncRequest('get', 'back/originalLogTemp/'+mlId, null, (res) => {
          if (res.code === 200) {
            count++;
            this.dataList = res.rows;
            console.log(this.dataList,'查出来的this.dataList')
            if(this.dataList.length == 1 && mlId == 0){// 如果只存在一个child 则默认展开 并且第一次进入的时候
              setTimeout(val => {
                this.demo = this.$refs.originalLogListTree.$refs.tree.$children[0];
                this.demo.$children[count].handleClick();
                this.demo = this.demo.$children[count];
              },1000)
            }
          }else {
            this.dataList = [];
          }
        });
      },
      showRightClickMenu(event,obj,node){
        let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限

        console.log("进入方法 showRightClickMenu")

        console.log(event,obj,node,'右击');
        let handleOperation=this.handleOperation;
        let ops=[];
        //判断当前选择的是什么节点
        if(obj.isParent == '1'){
          ops=JSON.parse(JSON.stringify(this.folderOpsNotP));
          if(obj.mlIdParent != 0){
            ops=JSON.parse(JSON.stringify(this.folderOps));
          }
          if(this.handType){
            console.log(this.$refs.originalLogListTree.getTreeNode(this.currentKey).parent.data.keyMlId,this.$refs.originalLogListTree.getTreeNode(this.currentKey).data.keyMlId,'aaa')
            if(this.handType == 4
              &&
              (
                obj.keyMlId == this.$refs.originalLogListTree.getTreeNode(this.currentKey).parent.data.keyMlId   //剪切 选择的文件夹非自己的父级
                ||
                obj.keyMlId == this.$refs.originalLogListTree.getTreeNode(this.currentKey).data.keyMlId   //剪切 选择的文件夹非自己
              )

            ){

            }else {
              ops[ops.length]={"type":"6","name":"粘贴"};
            }
          }
          if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
            btnPower = "@@";
          }
          if(btnPower.indexOf("@M27005@")!=-1 && obj.mlIdParent !=0 ){   //按钮_模板维护可删除目录  不是顶级目录
            ops[ops.length]={"type":"5","name":"删除","extraConfig":true};
          }
        }else if(obj.isParent == '0') {
          ops=JSON.parse(JSON.stringify(this.fileOps));
          if(btnPower==null || btnPower==undefined) {//没有权限，所有涉及权限的按钮都不展示
            btnPower = "@@";
          }
          if(btnPower.indexOf("@M27005@")!=-1){   //按钮_模板维护可删除模板
            ops[ops.length]={"type":"5","name":"删除","extraConfig":true};
          }
        }else if(obj.isParent == '-1') {
          ops=JSON.parse(JSON.stringify(this.folderOpsNotMP));
        }else {
          return ;
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
              if(this.$el.parentNode){
                this.$el.parentNode.removeChild(this.$el);
              }
            },
            handleRightClickOperation (op,_value) {
              console.log(_value,'111111111111')
              this.handleClose();
              return handleOperation(obj,node, op,_value)
            },
            handleOpen(){
              this.$el.style.visibility='hidden'
              return true
            }
          },
          directives: { Clickoutside },
          // template:
          // '<ul class="right-click-menu" v-clickoutside="handleClose">' +
          // '<li v-for="v in ops" @click="handleRightClickOperation(v.type)">{{v.name}}</li>' +
          // '</ul>'
          render(h){
            return (
              <ul class="right-click-menu" v-clickoutside={this.handleClose}>
                {
                  this._l(this.ops,(row,$index)=>
                    row.extraConfig ?
                  <li v-mind-popover={ {
                      message:row.extraConfig.messageName ? `<div>${row.extraConfig.messageName}</div><div><el-input v-model=flag3 v-focusSelectFull></el-input></div>` : '确认删除？',
                      success:this.handleRightClickOperation.bind(this,row.type),
                      info:row.extraConfig.slug == 'record' ? obj.mlName : '',
                      placement:row.extraConfig.placement ? row.extraConfig.placement : 'top',
                      isOpen:_ => this.handleOpen()
                    } }
                >{row.name}</li> : <li on-click={_ => this.handleRightClickOperation(row.type)}>{row.name}</li>
                  )
                }
              </ul>
            )
          }
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
      handleEdit(rowInfo,op,_value){
        console.log("进入方法 handleEdit")

        var pId = rowInfo.mlId ;
        //删除上一层及的属性
        delete rowInfo.parents ;
        //新增目录
        if(op == 0){
          rowInfo = {}
          rowInfo.mlIdParent = pId ;
          rowInfo.isParent = 1 ;
        }
        //新增模板
        else if(op == 1) {
          rowInfo = {}
          rowInfo.mlIdParent = pId ;
          rowInfo.isParent = 0 ;
        }
        //重命名
        else if(op == 2) {
          //获得菜单树的key
          this.currentKey = rowInfo.keyMlId;
        }
        //复制
        else if(op == 3){
          this.handleCopy(pId,op,rowInfo.keyMlId,rowInfo.isParent);
          return;
        }
        //剪切
        else if(op == 4){
          this.handleCopy(pId,op,rowInfo.keyMlId,rowInfo.isParent);
          return;
        }
        //删除
        else if(op == 5){
          this.handleDelete(pId,rowInfo.keyMlId,rowInfo.isParent);
          return;
        }
        //粘贴
        else if(op == 6){
          this.handlePaste(pId,rowInfo.keyMlId);

          return;
        }
        //增加目录
        else if(op == 7){
          this.departEdit=rowInfo;
          return;
        }
        // this.edit = rowInfo
        return this.handleDate(rowInfo,_value)
      },
      handleDate(rowInfo,_value) {
        console.log("进入方法 handleDate")

        if(_value.flag3 == ''){
          this.$message.error('名称不能为空!')
          return true
        }
        let form = Object.assign({},rowInfo);
        form['mlName']=_value.flag3;
        //如果是文件夹就传 W、模板就传 M
        if(!form.mlId){
          //文件夹
          if(form.isParent=='1'){
            form.actionType = "目录添加" ;
            ajaxRequest('post',"back/originalLogTemp/addOriginalLogTempMl",form,res => {
              if(res.code == 200){
                this.$message.success('添加成功');
                this.handleEditCallback(res.daoResult,"W","add");
              }else {
                this.$message.error('添加失败');
              }
            },'unicode');
          }
          //模板
          else if(form.isParent=='0'){
            //把form 转一下，转成模板的对象
            var subForm = {};
            subForm.mlId = form.mlIdParent;
            subForm.mbName = form.mlName;
            subForm.actionType = "模板添加" ;
            ajaxRequest('post',"back/originalLogTemp/addOriginalLogTemp",subForm,res => {
              if(res.code == 200){
                var retForm = {};
                retForm.mlId = res.daoResult.mbId;
                retForm.keyMlId = "M"+res.daoResult.mbId;
                retForm.mlName = subForm.mbName;
                retForm.isParent = 0 ;
                retForm.auditFlag = 0 ;
                retForm.isLeaf = true ;
                retForm.mlIdParent = res.daoResult.mlId;
                this.$message.success('添加成功');
                this.handleEditCallback(retForm,"M","add");
              }else {
                this.$message.error('添加失败');
              }
            },'unicode');

          }
        }else{
          //把时间字段删掉
          this.dealData(form);
          if(form.isParent=='1'){
            form.actionType = "目录重命名" ;
            form.actionContent = (rowInfo.mlName + "->" + form.mlName);
            console.log(form.actionContent,'_this.form.actionContent')
            ajaxRequest('put',"back/originalLogTemp/updateOriginalLogTempMl",form,res => {
              if(res.code == 200){
                this.$message.success('修改成功','update');
                this.handleEditCallback(form,'W',"update");
              }else {
                this.$message.error('修改失败');
              }
            },'unicode');
          }
          //模板
          else if(form.isParent=='0'){

            var subForm = {};
            subForm.mbId = form.mlId;
            subForm.mbName = form.mlName;

            subForm.actionType = "模板重命名" ;
            subForm.actionContent = (rowInfo.mlName + "->" + form.mlName);
            ajaxRequest('put',"back/originalLogTemp/updateOriginalLogTemp4Info",subForm,res=>{
              if(res.code == 200){
                this.$message.success('修改成功','update');
                this.handleEditCallback(form,"M","update");
              }else {
                this.$message.error('添加失败');
              }
            },'unicode');
          }
        }
      },
      dealData(form){
        //把时间字段删掉
        delete form.addTime;
        delete form.updateTime;
        delete form.deleteTime;
        delete form.enableDate;
        delete form.disableDate;
        delete form.backupTime;
        delete form.auditSubmitTime;
        delete form.auditOneTime;
        delete form.auditTwoTime;
        delete form.unAuditSubmitTime;
        delete form.unAuditOneTime;
        delete form.unAuditTwoTime;
        delete form.jdTime;
        delete form.hyTime;
        delete form.pzTime;
        delete form.folderClearTime;
        delete form.printTime;
        delete form.pdfTime;
        delete form.enableDate;
        delete form.disableDate;
        delete form.zsjdrq;
        delete form.zsyxrq;
        delete form.dataDate1;
      },
      //弹出层回调
      handleEditCallback(form,nodeType,type){
        console.log("进入方法 handleEditCallback")

        this.edit=null;
        this.departEdit=null;
        if(!form){
          return;
        }
//        form.type = type ;
        form[this.keyId] =nodeType+form.mlId;
        form[this.treePid] ='W'+form.mlIdParent;
        console.log(form,'addform');
        this.$refs.originalLogListTree.appenTreeNode(form);
//        this.updateNode = form;
      },
      handleDepartCallback(form,nodeType,type){
        console.log("进入方法 handleDepartCallback")

        this.departEdit=null;
        form[this.keyId] =nodeType+form.mlId;
        form[this.treePid] ='W'+form.mlIdParent;
        this.$refs.originalLogListTree.appenTreeNode(form);
      },
      handleOperation (obj,node, op,_value){
        console.log("进入方法 handleOperation")

        return this.handleEdit(obj,op,_value);
      },
      reload(){
        console.log("进入方法 reload")

        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      },
      //删除模板
      handleDelete (id,keyMlId,isParent) {
        console.log("进入方法 handleDelete")

        let _this = this;
        if (id) {
          if(isParent == 1){
            // this.$confirm('确定要删除该目录?', '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'warning',
            //   center:true,
            // }).then(() => {
              ajaxRequest("put", "back/originalLogTemp/updateOriginalLogTempMl4Del", {
                mlId: id,
                status: 1,
                actionType: "目录删除"
              }, function (res) {
                if (res.code == 200) {
                  _this.$message.success('删除成功')
                  _this.$refs.originalLogListTree.delTreeNode(keyMlId);

                  _this.copyId = null;
                  _this.handType = null;
                  _this.isParent = null;

                } else {
                  _this.$message.error(res.msg)
                }
              });
            // },()=>{

            // })
          }else if(isParent == 0){
              ajaxRequest("put", "back/originalLogTemp/updateOriginalLogTemp4Del", {
                mbId: id,
                status: 1,
                actionType: "模板删除"
              }, function (res) {
                if (res.code == 200) {
                  _this.$message.success('删除成功')

                  _this.copyId = null;
                  _this.handType = null;
                  _this.isParent = null;

                  _this.$refs.originalLogListTree.delTreeNode(keyMlId);
                  if(_this.mbId == id){
                    _this.isRouterAlive = false ;
                    _this.mbId = null ;
                  }
                } else {
                  _this.$message.error(res.msg)
                }
              });
          }else {
            _this.$message({
              message: '请先选择要删除的模板',
              type: 'warning'
            })
          }
        } else {
          _this.$message({
            message: '请先选择要删除的模板',
            type: 'warning'
          })
        }
      },
      //复制/剪切模板
      handleCopy (id,type,currentKey,dealTreeNodeType) {
        console.log("进入方法 handleCopy")

        if (id) {
          this.copyId = id ;
          this.handType=type;
          this.currentKey = currentKey ;
          this.dealTreeNodeType = dealTreeNodeType;
          if(type == 3){
            this.$message.success('复制成功')
          }else if(type == 4){
            this.$message.success('剪切成功')
          }
        } else {
          this.$message({
            message: '请先选择模板',
            type: 'warning'
          })
        }
      },
      //粘贴模板
      handlePaste (id,keyMlId) {
        console.log("进入方法 handlePaste")

        console.log(id,keyMlId,'当前选择的');
        if (id) {
          var _this = this ;
          if(this.handType == 3){
            if(_this.dealTreeNodeType == 1){

            }else if(_this.dealTreeNodeType == 0){
              //更新后台
              //获得原来的节点

              var treeTempOld = _this.$refs.originalLogListTree.getTreeNode(_this.currentKey);
              console.log(treeTempOld.parent.label,'treeTempOld')
              var treeTempNew = _this.$refs.originalLogListTree.getTreeNode(keyMlId);
              console.log(treeTempNew.label,'treeTempNew')
              ajaxRequest("put", "back/originalLogTemp/copyOriginalLogTempByIds",{mbId:_this.copyId,mlId:id,actionType:"模板复制",actionContent:(treeTempOld.parent.label + "->" + treeTempNew.label)}, function(res) {
                if (res.code == 200) {
//                  var newDate = res.daoResult ;

                  ajaxSyncRequest('get', 'back/originalLogTemp/'+id, null, (res) => {
                    if (res.code === 200) {
                      var dataListTemp = res.rows;
                      _this.refreshTree(keyMlId,dataListTemp);
                      _this.copyId = null ;
                      _this.handType=null ;
                      _this.isParent=null ;
                      _this.$message.success('复制成功')
                    }else {
                      _this.$message.error('复制失败')
                    }
                  });

//                  newDate[_this.keyId] = "M"+res.daoResult.mbId;
//                  newDate[_this.treePid] = keyMlId;
//                  newDate[_this.propsKey.isLeaf] = true;
//                  newDate[_this.propsKey.label] = res.daoResult.mbName;
//                  newDate.isParent = 0;
//                  newDate.mlId = res.daoResult.mbId;
//                  _this.$refs.originalLogListTree.appenTreeNode(newDate);


                } else {
                  _this.$message.error('复制失败')
                }
              });
            }
          }else if(this.handType == 4){
            if(_this.dealTreeNodeType == 1){
              //更新后台
              var treeTempOld = _this.$refs.originalLogListTree.getTreeNode(_this.currentKey);
              console.log(treeTempOld.parent.label,'treeTempOld')
              var treeTempNew = _this.$refs.originalLogListTree.getTreeNode(keyMlId);
              console.log(treeTempNew.label,'treeTempNew')

              ajaxRequest("put", "back/originalLogTemp/moveTempleteDirectory",{mlId:_this.copyId,mlIdParent:id,actionType:"目录移动",actionContent:(treeTempOld.parent.label + "->" + treeTempNew.label)}, function(res) {
                if (res.code == 200) {
                  //获得原来的节点
//                  var treeTempOld = _this.$refs.originalLogListTree.getTreeNode(_this.currentKey);

                  _this.$refs.originalLogListTree.delTreeNode(_this.currentKey);

                  ajaxSyncRequest('get', 'back/originalLogTemp/'+id, null, (res) => {
                    if (res.code === 200) {
                      var dataListTemp = res.rows;
                      _this.refreshTree(keyMlId,dataListTemp);
                      _this.copyId = null ;
                      _this.handType=null ;
                      _this.isParent=null ;
                      _this.$message.success('移动成功')
                    }else {
                      _this.$message.error('移动失败')
                    }
                  });

//                  console.log(treeTempOld.data,'111111')
//                  treeTempOld.data[_this.treePid] = keyMlId;
//                  console.log(treeTempOld.data,'222222')
//                  _this.$refs.originalLogListTree.appenTreeNode(treeTempOld.data);
//                  console.log(treeTempOld.data,'333333')
////                  _this.$refs.originalLogListTree.reFreashParentTreeNode(treeTempOld.data);
//
//                  _this.copyId = null ;
//                  _this.handType=null ;
//                  _this.isParent=null ;
//
//                  _this.$message.success('移动成功')
                } else {
                  if (res.msg) {
                    _this.$message.error(res.msg);
                  } else {
                    _this.$message.error('移动失败');
                  }
                }
              },'unicode');
            }else if(_this.dealTreeNodeType == 0){
              var treeTempOld = _this.$refs.originalLogListTree.getTreeNode(_this.currentKey);
              console.log(treeTempOld.parent.label,'treeTempOld')
              var treeTempNew = _this.$refs.originalLogListTree.getTreeNode(keyMlId);
              console.log(treeTempNew.label,'treeTempNew')
              //更新后台
              ajaxRequest("put", "back/originalLogTemp/updateOriginalLogTemp4Move",{mbId:_this.copyId,mlId:id,actionType:"模板移动",actionContent:(treeTempOld.parent.label + "->" + treeTempNew.label)}, function(res) {
                if (res.code == 200) {
                  //获得原来的节点
//                  var treeTempOld = _this.$refs.originalLogListTree.getTreeNode(_this.currentKey);

                  _this.$refs.originalLogListTree.delTreeNode(_this.currentKey);

                  ajaxSyncRequest('get', 'back/originalLogTemp/'+id, null, (res) => {
                    if (res.code === 200) {
                      var dataListTemp = res.rows;
                      _this.refreshTree(keyMlId,dataListTemp);
                      _this.copyId = null ;
                      _this.handType=null ;
                      _this.isParent=null ;
                      _this.$message.success('移动成功')
                    }else {
                      _this.$message.error('移动失败')
                    }
                  });

//                  console.log(treeTempOld,'111111')
//                  treeTempOld.data[_this.treePid] = keyMlId;
//                  console.log(treeTempOld,'222222')
//
//                  _this.$refs.originalLogListTree.appenTreeNode(treeTempOld.data);
//                  console.log(treeTempOld,'333333')
//                  console.log(treeTempOld,'旧的目录')
//                  console.log(treeTempNew,'新的目录')
////                  _this.$refs.originalLogListTree.reFreashParentTreeNode(treeTempOld.data);

//                  _this.copyId = null ;
//                  _this.handType=null ;
//                  _this.isParent=null ;
//
//                  _this.$message.success('移动成功')
                } else {
                  _this.$message.error('移动失败')
                }
              },'unicode');
            }
          }
        } else {
          this.$message({
            message: '请先选择要粘贴的模板',
            type: 'warning'
          })
        }
      },
      deepClone(obj){
        console.log("进入方法 deepClone")

        if(!obj){
          return obj;
        }
        var newObj = obj.constructor === Array ? []:{};
        if(typeof obj !== 'object'){
          return
        }else{
          for(var i in obj){
            if(obj.hasOwnProperty(i)){
              newObj[i] = typeof obj[i] === 'object'?this.deepClone(obj[i]):obj[i];
            }
          }
        }
        return newObj
      },
      refreshTree(pKey,data){
        console.log("进入方法 refreshTree")

//        this.departEdit=null;
        this.$refs.originalLogListTree.updateNode(pKey,data);

      },
      //搜索模版回调
      checkMb(data){
        console.log("进入方法 checkMb")

        if(data){
          this.mbId = data.mbId;
          this.currentKey = this.keyMlId;
          //强制刷新组件
          this.reload();
        }
      },
      //显示弹出层
        searchDialog() {
          this.searchDialogShow = true;
        },
        handleCallback(){
           this.searchDialogShow = false;
        },
        calcOtherWidth(){
          this.calcWidth = $(this.$refs['temp-page']).parents('.tbs_info').width() - $(this.$refs['certLeftMenu']).width()
        },
    },
    created () {
      this.getDataList();
    },
  }
</script>

<style lang="scss" scoped>
.certificateLeftMenu {
  // position: absolute;
  top: 0px;
  left: 0px;
  width: 200px;
  bottom: 0px;
  overflow: auto;
}
.certificateContent {
  // position: absolute;
  width:100%;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 200px;
  // overflow: auto;
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

.right-click-menu {
  position: fixed;
  border: 1px solid #ccc;
  padding: 2px 0;
  background: #fff;
  width: 120px;
  z-index: 9999;
}
.right-click-menu li {
  padding: 3px 10px;
  cursor: default;
  font-size: 14px;
  color: #606266;
}
.right-click-menu li:hover {
  color: #409eff;
}
.btn{
  text-align: center;
  margin: 4% !important;
}
.zs_input_class input{
  height:100%!important;
}
.zs_select_class .el-input,.zs_select_class .el-input__inner{
  height:100%!important;
}
</style>
