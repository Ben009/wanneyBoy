<template>
  <mind-dialog
    title="个性化设置"
    v-dialogDrag
    :visible="true"
    width="800px"
    center
    @close="handleCancel">
  <div>
    <!--<div class="left-menu" style="position:relative">
      <el-menu
        default-active="2">

        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">我的工作</span>
        </el-menu-item>

      </el-menu>
    </div>-->
    <div class="right-content">
      <div class="default-start">
        <span style="font-size:16px;margin-right: 10px;vertical-align: middle">是否默认开启高级查询</span>
        <el-switch
          v-model="defaultOpen"
          class="default-switch"
          active-color="#409EFF"
          inactive-color="#cacaca">
        </el-switch>
        <el-button type="primary" round @click="handleDefaultOpen" style="float:right;margin-right:20px;margin-top:12px">保存</el-button>
      </div>

      <div class="conditions">
        <div class="title-item">
          <span>查询条件设置</span>
        </div>
        <div class="conditions-content">
          <div class="all-conditions">
            <div class="flex">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
              <p class="ml10">所有条件</p>
            </div>
            <ul>
              <el-checkbox-group v-model="checkedConditions" @change="handleCheckedConditons">
                <li v-for="(items,index) in tempRowConDition" :key="index">
                  <div>
                    <el-checkbox :label="items.name"></el-checkbox>
                  </div>
                </li>
              </el-checkbox-group>
            </ul>
          </div>
          <div class="action">
            <div :class="'moveRight '+(isRight?'active':'')" @click="moveRight">
              <i class="iconfont el-icon-arrow-right"></i>
            </div>
            <div :class="'moveLeft ' +(isLeft?'active':'')" @click="moveLeft">
              <i class="iconfont el-icon-arrow-left"></i>
            </div>
          </div>
          <div class="set-conditions">
            <div class="flex">
              <el-checkbox :indeterminate="isIndeterminateSet" v-model="checkAllSet" @change="handleCheckAllChangeSet"></el-checkbox>
              <p class="ml10">设置条件</p>
            </div>
            <ul>
              <el-checkbox-group v-model="checkedConditionsSet" @change="handleCheckedConditonsSet">
                <li v-for="(items,index) in conditions">
                  <div class="flex conditionsSetItem">
                    <el-checkbox :label="items.name"></el-checkbox>
                    <p>
                      <span class="el-icon-sort-up" @click="moveUp(index)"></span>
                      <span class="el-icon-sort-down" @click="moveDown(index)"></span>
                    </p>
                  </div>
                </li>
              </el-checkbox-group>
            </ul>
          </div>
            <el-button type="primary" round @click="setConditions" style="float:right;margin-right:20px;">保存</el-button>
        </div>

      </div>

      <div v-if="sortCondition.length" class="rank">
        <div class="title-item">
          <span>默认排序</span>
        </div>
        <div class="rank-content">
          <span class="dot"></span>
          <span>查询结果默认排序方式：</span>
          <el-select v-model="fieldValue" placeholder="请选择" @change="handleRankField" :popperAppendToBody="false">
            <el-option
              v-for="item in sortCondition"
              :key="item.name"
              :label="item.name"
              :value="item.sqlSeg">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="请选择" @change="handleRankType" :popperAppendToBody="false">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" round @click="handleDefaultSort" style="float:right;margin-right:20px;">保存</el-button>
         <!-- <div class="mark">
            备注：您可在查询结果中点击相应表头进行相应的排序！
          </div>-->

        </div>

      </div>

      <div v-if="resultCondition.length" class="result">
        <div class="title-item">
          <span>查询结果</span>
        </div>
        <div class="result-content">
          <el-tabs v-model="moduleName" type="card" closable @tab-remove="removeTab" @tab-click="clickTab" class="module-out" ref="module-out">
            <el-tab-pane
              :key="item.name"
              v-for="(item, index) in moduleList"
              :label="item.name"
              :name="item.name"
            >
              <div class="search-title">
                <!--<p><el-checkbox :indeterminate="isIndeterminateResult" v-model="checkAllResult" @change="handleCheckAllResultChange" label="全选"></el-checkbox></p>-->
                <el-checkbox-group v-model="checkList" @change="handleResultTitle">
                  <el-checkbox v-for="(items,key) in resultCondition" :label="items.nameCode">{{items.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-tab-pane>
          </el-tabs>

          <div class='content-btn'>
             <p style="float:left;">
                  <el-button type="primary"  @click="CheckAllMould(true)" >全选</el-button>
                  <el-button type="warning"  @click="CheckAllMould(false)">清空</el-button>
                </p>
            <el-button type="success" round @click="editMould(false)">保存</el-button>
            <el-button type="primary" round @click="handleSaveMould(false)">新增</el-button>
            <el-button type="primary" round @click="editMould(true)" v-if="setDefault">设为默认</el-button>
          </div>
          <div class="mark">
            备注：您可将常用结果保存为常用模板，查询时可选择切换！
          </div>

        </div>
      </div>
    </div>

  </div>
  </mind-dialog>

</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import $ from 'jquery';
  import {ajaxRequest,ajaxSyncRequest, formatArrayToTree} from '../util/base';

/*   import {Button, Menu,MenuItem,Switch,Icon,CheckboxGroup,Checkbox,Transfer} from 'element--ui';
  Vue.use(Button);
  Vue.use(Menu);
  Vue.use(MenuItem);
  Vue.use(Switch);
  Vue.use(Icon);
  Vue.use(Checkbox);
  Vue.use(CheckboxGroup);
  Vue.use(Transfer); */

  /*父组件需要传一个字段rowsCondition 实为父组件对应json信息*/
    export default {
      name: "work-mould",
      props:{
        rowsCondition:{
          type:Array,
          required:true
        },
        callback:{
          type:Function,
          required:true
        },
        handleMouldBack:{
          type:Function,
          /*required:true*/
        },
        needSort:{
          type:Boolean,
          default(){
            return true
          }
        }
      },
      computed:{
        setDefault(){
          return this.moduleName!=this.DefModuleName
        }
      },
      watch:{
        checkedConditions(n){
          if(n.length>0){
            this.isRight=1;
          }else{
            this.isRight=0;
          }
        },
        checkedConditionsSet(n){
          if(n.length>0){
            this.isLeft=1;
          }else{
            this.isLeft=0;
          }
        },
        /*checkList(n){
          this.isIndeterminateResult = n.length>0 && n.length !==this.resultCondition.length;
          if(n.length ===this.resultCondition.length){
            this.checkAllResult=true;
          }
        },*/
        moduleList(n){
          if(n.length>1&&n[0].isDefault==1){
            this.moduleList.splice(0,1);
          }
        }
      },
      data() {
        return {
          userId:"",
          fieldValue:'',  //排序字段 默认第一条信息
          defaultOpen:false,   //是否默认开启高级查询
          options: [{
            value: '1',
            label: '降序'
          }, {
            value: '2',
            label: '升序'
          }],
          value:'1',           //查询字段排序方式 1降序 2升序
          checkList: [],      //查询结果字段id信息
          conditions:[],
          tempRowConDition:[],

          dataId:null,
          moduleList:[],
          moduleType:'',            //url解析的模板类型
          selectedModuleInfo:{},   //当前选中的模板信息,
          moduleName:'',           //当前选中模板名

          sortCondition:[],
          resultCondition:[],

          // 所有条件全选
          checkAll:false,
          checkedConditions:[],
          isIndeterminate:false,
          // 设置条件全选
          checkAllSet:false,
          checkedConditionsSet:[],
          isIndeterminateSet:false,

          isRight:0,
          isLeft:0,
          //checkAllResult:false,
          //isIndeterminateResult:false,

          DefModuleName:null,    //默认模板名
          defaultCheckList:[],   //默认表格显示数据

        }
      },
      methods: {
        /*查询结果全选清空操作*/
        CheckAllMould(flag){
          if(flag){
            this.checkList=this.resultCondition.map(v=>{return v.nameCode});
          }else{
            this.checkList=[];
          }
        },
        handleCheckAllResult(flag){
          this.checkList=[];
          if(flag){
            this.resultCondition.forEach(v=>{
              this.checkList.push(v.nameCode)
            })
          }
        },
        /**
         * [handleCheckAllChange 查询条件设置---未选择 全部选中行为]
         * @return {[type]} [description]
         */
        handleCheckAllChange(val){
          let rowsConditionNames = [];
          this.tempRowConDition.forEach(val => {
            rowsConditionNames.push(val.name)
          })
          this.checkedConditions = val ? rowsConditionNames : [];
          this.isIndeterminate = false;
        },
        /**
         * [handleCheckAllChange 查询条件设置---未选择 单个选中行为]
         * @return {[type]} [description]
         */
        handleCheckedConditons(value){
          let checkedCount = value.length;
          this.checkAll = checkedCount === this.tempRowConDition.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.tempRowConDition.length;
        },

        /**
         * [handleCheckAllChangeSet 查询条件设置---选择 全部选中行为]
         * @return {[type]} [description]
         */
        handleCheckAllChangeSet(val){
          let rowsConditionNames = [];
          this.conditions.forEach(val => {
            rowsConditionNames.push(val.name)
          });
          this.checkedConditionsSet = val ? rowsConditionNames : [];
          this.isIndeterminateSet = false;
        },
        /**
         * [handleCheckAllChange 查询条件设置---选择 单个选中行为]
         * @return {[type]} [description]
         */
        handleCheckedConditonsSet(value){
          let checkedCount = value.length;
          this.checkAllSet = checkedCount === this.conditions.length;
          this.isIndeterminateSet = checkedCount > 0 && checkedCount < this.conditions.length;
        },
        /**
         * [moveLeft 查询条件设置 取消设置条件]
         * @return {[type]} [description]
         */
        moveLeft(){
          let arr = [].concat(this.rowsCondition).filter(v=>{
            return v.isQueryCondition  == 1;
          });
          let tempArr = [].concat(this.conditions),checkedArr=[].concat(this.checkedConditionsSet);
          for(let i = 0;i<checkedArr.length;i++ ){
            for(let j = 0;j <tempArr.length;j++){
              if(tempArr[j].name==checkedArr[i]){
                tempArr.splice(j,1);
                i--;
                break
              }
            }
          }
          this.conditions=tempArr;
          /*this.checkedConditionsSet.forEach((val) => {
              this.conditions.forEach((temp,index) => {
                if(temp.name === val){
                  this.conditions.splice(index,1)
                }
              })
          });*/
          this.conditions.forEach(v=>{
            arr.forEach((item,index)=>{
              if(v.name===item.name){
                arr.splice(index,1);
              }
            })
          });
          this.tempRowConDition=arr;
          this.checkedConditionsSet = [];
//          if(this.conditions.length == 0){
            this.isIndeterminateSet = false;
            this.checkAllSet=false;
//          }
        },
        /**
         * [moveLeft 查询条件设置 设置为设置条件]
         * @return {[type]} [description]
         */
        moveRight(){
          this.checkedConditions.forEach((val) => {
              this.tempRowConDition.forEach((temp,index) => {
                if(temp.name === val){
                  this.conditions.push(temp)
                  this.tempRowConDition.splice(index,1)
                }
              })
          });
          this.checkedConditions = [];
//          if(this.tempRowConDition.length == 0){
            this.isIndeterminate = false;
            this.checkAll=false;
//          }
        },
        moveUp(index){
          if(index!=0){
            var temp = this.conditions[index];
            Vue.set(this.conditions, index, this.conditions[index-1]);
            Vue.set(this.conditions, index-1, temp);
          }
        },
        moveDown(index){
          if(index < this.conditions.length-1){
            var temp = this.conditions[index];
            Vue.set(this.conditions, index, this.conditions[index+1]);
            Vue.set(this.conditions, index+1, temp);
          }
        },
        moveClose(index){
          this.conditions.splice(index,1);
        },
        editMouldAjax(param,index){
          param.moduleType=this.moduleType;
          param.id=this.dataId;
          ajaxRequest('post','back/settingTemplate/',param,(res)=>{
            if(res.code==200){
              this.$message({
                type: 'success',
                message: '保存成功'
              });
              this.dataId=res.daoResult.id;
              /*改变父组件*/
              if(index==1){
                this.handleMouldBack(1,this.defaultOpen);
              }else if(index==2){
                this.handleMouldBack(2,this.conditions);
              }else if(index==3){
                this.handleMouldBack(3,[this.fieldValue,this.value]);
              }

            }
          });
        },
        handleDefaultOpen(){
          this.editMouldAjax({isOpen:this.defaultOpen?1:0},1);
        },
        handleDefaultSort(){
          this.editMouldAjax({defOrder:JSON.stringify([this.fieldValue,this.value])},3);
        },
        /*条件设置*/
        setConditions(){
          if(this.conditions.length){
              let arr = this.conditions.map(v=>{
                  return {
                      name:v.name,
                      nameCode:v.nameCode,
                  }
              });
            this.editMouldAjax({findWhere:JSON.stringify(arr)},2);
          }else{
            this.$message({
              type: 'error',
              message: '请至少选择一个查询条件！'
            });
          }
        },
        handleRankField(value){
          /*var obj= this.fieldOptions.filter(function(v){return v.id == value})[0];
          this.value=obj.fieldRank;*/

        },
        handleRankType(value){
          /*var temp = [].concat(this.fieldOptions);
          var obj = temp.filter((v)=>{return v.id == this.fieldValue})[0];
          obj.fieldRank = value;
          this.fieldOptions=temp;*/
        },
        handleResultTitle(checkedList){
          console.log(this.checkList)
        },
        /*新增模板*/
        handleSaveMould(flag){ //flag是否将新增模板设为默认模板
          const _this = this;
          if(!flag){
            this.$prompt('请输入模板名称', '提示',{
              confirmButtonText: '保存',
              center:true,
              confirmButtonPosition:'left',
              beforeClose(action, instance, done){
                if(action == 'confirm'){
                  var value = instance.$refs.input.$vnode.data.props.value;
                  if(value==null){
                    this.$message({
                      type: 'error',
                      message: '模板名称不能为空'
                    });
                    return
                  }
                  var param = {},obj={[value]:_this.checkList};
                  param.content=JSON.stringify(obj);
                  param.moduleType=_this.moduleType;
                  param.id=_this.dataId;
                  flag?param.isDefModule=value:null;
                  if(_this.checkList.length == 0){
                    this.$message({
                      type: 'error',
                      message: '请至少选择一个查询结果！'
                    });
                    return
                  }
                  let arr = _this.moduleList.filter(v=>{return v.name==value});
                  if(arr.length>0){
                    _this.$message({
                      type: 'error',
                      message: '模板名称重复'
                    });
                  }else{
                    ajaxRequest('post','back/settingTemplate/',param,(res)=>{
                      if(res.code==200){
                        done();
                        _this.$message({
                          type: 'success',
                          message: '新增成功'
                        });
                        _this.moduleList.push({name:value,checkList:_this.checkList});
                        _this.moduleName=value;
                        flag?_this.DefModuleName=value:null;
                        /*if(flag){
                          Vue.set(_this.moduleList,0,{name:'默认（'+value+')',checkList:_this.checkList,isDefault:1})
                        }*/
                      }
                    });

                  }
                }else{
                  done();
                }

              }
            }).then(({ value }) => {


            },(rej)=>{

            });
          }
          else{
            var param = {},value='默认',obj={[value]:_this.checkList};
            param.content=JSON.stringify(obj);
            param.moduleType=_this.moduleType;
            param.id=_this.dataId;
            flag?param.isDefModule=value:null;
            if(_this.checkList.length == 0){
              this.$message({
                type: 'error',
                message: '请至少选择一个查询结果！'
              });
              return
            }
            ajaxRequest('post','back/settingTemplate/',param,(res)=>{
              if(res.code==200){
                _this.$message({
                  type: 'success',
                  message: '新增成功'
                });
                _this.moduleList.push({name:value,checkList:_this.checkList});
                _this.moduleName=value;
                flag?_this.DefModuleName=value:null;
              }
            });
          }


        },
        /*编辑模板*/
        editMould(slug){
          var param = {},obj={[this.moduleName]:this.checkList};
          slug?param.isDefModule=this.moduleName:null;
          param.moduleType=this.moduleType;
          param.id=this.dataId;

          if(this.moduleName=='默认（原始）'){ //若是原始模板保存 即为新增模板并设为默认模板
            this.handleSaveMould(true);
            return
          }
          this.moduleList.forEach(v=>{//若是自定义默认模板保存
            if(v.isDefault==1 && this.moduleName==v.name){
              let name=v.name.substring(3,v.name.length-1);
              obj={[name]:this.checkList};
            }
          });
          for(let item in obj){
            if(obj[item].length == 0){
              this.$message.error('查询结果不能为空！')
              return ;
            }
          }
          param.content=JSON.stringify(obj);
          ajaxRequest('post','/back/settingTemplate/',param,(res)=>{
            if(res.code==200){
              this.$message({
                type:'success',
                message: slug ? '设为默认模板成功' : '保存成功'
              });
              this.recoverInfo(res.daoResult,true);
            }
          })
        },
        recoverInfo(items,judgeFlag){
          this.dataId=items.id;
          var info = items.content?$.extend({},JSON.parse(items.content)):{};
          let defaultName = items.isDefModule;
          this.DefModuleName=defaultName;
          // 重置行为
          /*检索条件*/
          if(items.findWhere){
            this.conditions=items.findWhere?JSON.parse(items.findWhere):[];
            this.conditions.forEach(val => {
              this.tempRowConDition.forEach((temp,index) => {
                if(val.nameCode === temp.nameCode){
                  this.tempRowConDition.splice(index,1)
                }
              })
            });
          }
          console.log(info,$.isEmptyObject(info),'infoooooooooooo')
          /*结果*/
          if($.isEmptyObject(info)){
            // 如果没有模板则选中默认default项 ---只针对查询结果项
            this.getResultDefault();
          }
          else{
            this.moduleList=[];
            for(let i in info){
              this.moduleList.push({name:i,checkList:info[i]});
            }
          }
          if(!judgeFlag){//默认加载第一个模板
            this.moduleName=this.moduleList[0].name;
            this.checkList=this.moduleList[0].checkList;
          }


          console.log(this.moduleList,'mouldlisttttttttt')
          /*开启*/
          this.defaultOpen=items.isOpen=='1'?true:false;
          /*排序*/
          if(!items.defOrder){ //若未设置 拿默认
            this.getSortDefault();
          }else{
            let orderInfo = items.defOrder?JSON.parse(items.defOrder):[];
            console.log(orderInfo,'orderInfoooooooooooooooo')
            this.fieldValue=orderInfo[0];
            this.value=orderInfo[1];
            console.log(this.fieldValue)
          }
        },
        getModuleType(){
          let currentRouter = this.$route,
              currentType = '';
          if(currentRouter.matched && currentRouter.matched.length){
            currentRouter.matched.forEach(val => {
              if(val.path == currentRouter.path){
                currentType = val.components.default['__file']
              }
            })
          }
          let index = currentType.lastIndexOf('\\');
          currentType = currentType.substring(index+1)
          currentType = currentType.substring(-1,currentType.lastIndexOf('.'))
          return currentType
        },
        handleCancel(){
          this.callback();
        },
        getSortCondition(){
          this.rowsCondition.forEach((v)=>{
            v.isSort==1?this.sortCondition.push(v):null;
          });
          //this.fieldValue=this.sortCondition.length?this.sortCondition[0].sqlSeg:'';
        },
        getResultCondition(){
          this.rowsCondition.forEach((v)=>{
            v.isQueryResult == 1?this.resultCondition.push(v):null;
          })
        },

        removeTab(targetName){
          this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let tabs = this.moduleList;
            for(let i=0,l=tabs.length;i<l;i++){
              if(tabs[i].name==targetName&& tabs[i].isDefault==1){//默认模板
                if(targetName=="默认（原始）"){
                  this.$message({
                    type:'error',
                    message:'原始模板不可删除'
                  });
                  return
                }
                /*else{
                  var param = {};
                  param.moduleType=this.moduleType;
                  param.id=this.dataId;
                  param.isDefModule=null;
                  ajaxRequest('post','back/settingTemplate/',param,(res)=>{
                    if(res.code==200){
                      this.$message({
                        type:'success',
                        message:'取消默认模板成功'
                      });
                      Vue.set(this.moduleList, 0, {name:'默认（原始）',checkList:this.defaultCheckList,isDefault:1});
                      this.moduleName='默认（原始）';
                      this.checkList=this.defaultCheckList;
                    }
                  });
                  return
                }*/
              }
            }
            console.log(this.DefModuleName,targetName,'this.DefModuleNamethis.DefModuleName')
            if(this.DefModuleName==targetName){//删除的模板是默认模板
              this.ajaxRemove(targetName,1);
            }else{
              this.ajaxRemove(targetName);
            }


          }).catch(() => {

          });
        },
        ajaxRemove(targetName,flag){
          var param = {},obj={[targetName]:'delete'};
          param.moduleType=this.moduleType;
          param.id=this.dataId;
          param.content=JSON.stringify(obj);
          ajaxRequest('post','back/settingTemplate/',param,(res)=>{
            if(res.code==200){
              this.$message({
                type:'success',
                message:'删除成功'
              });
              this.removeTabItem(targetName);
              /*if(flag){
                Vue.set(this.moduleList, 0, {name:'默认（原始）',checkList:this.defaultCheckList,isDefault:1});
                this.moduleName='默认（原始）';
                this.checkList=this.defaultCheckList;
              }*/
            }
          })
        },
        removeTabItem(targetName){
          let tabs = this.moduleList;
          let activeName = this.moduleName;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          this.moduleName = activeName;
          this.moduleList = tabs.filter(tab => tab.name !== targetName);
          if(this.moduleList.length==0){
            this.getResultDefault();
          }
        },
        clickTab(tab){
          let tabs = this.moduleList;
          tabs.forEach((item, index) => {
            if (tab.name === item.name) {
              this.checkList=item.checkList;
            }
          });

        },
        getSortDefault(){
          let temp = [].concat(this.rowsCondition).filter(v=>{return v.isSort && v.isSortDefault});
          this.fieldValue=temp.length?temp[0].sqlSeg:'';
          this.value='1';
        },
        getResultDefault(){
          this.moduleList = [{name:'默认（原始）',checkList:this.defaultCheckList,isDefault:1}];
          this.moduleName='默认（原始）';
          this.checkList=this.defaultCheckList;
        },

        getDefaultCheckList(){
          let arr=[];
          [].concat(this.rowsCondition).forEach(v=>{
            if(v.isTableDefault && v.isQueryResult){
              arr.push(v.nameCode)
            }
          });
          this.defaultCheckList=arr;
        }
      },
      mounted(){
        let userId = localStorage.getItem("userId");
        this.userId=userId;
        var type=this.getModuleType('moduleType');
        this.moduleType = type;
        this.tempRowConDition=[].concat(this.rowsCondition).filter(v=>{
          return v.isQueryCondition  == 1;
        });
        this.getDefaultCheckList();
        ajaxSyncRequest('get','back/settingTemplate/list',{userId:userId,moduleType:type,isDelete:0},(res)=>{
          if(res.code==200){
            if(res.rows.length>0){
              this.recoverInfo(res.rows[0]);
            }else{
              this.getResultDefault();
              this.getSortDefault();
            }
          }
        });
        this.getSortCondition();
        this.getResultCondition();

      },
      updated(){
        if(!$.isEmptyObject(this.$refs)){
          $(this.$refs['module-out'].$el).find('#tab-'+this.DefModuleName).siblings().css({'backgroundColor':"#fff",color:'#333'});
          $(this.$refs['module-out'].$el).find('#tab-'+this.DefModuleName).siblings('.el-tabs__item.is-active').css({'backgroundColor':"#56BC4E",color:'#fff'});
          $(this.$refs['module-out'].$el).find('#tab-'+this.DefModuleName).css({'backgroundColor':"#1a68a5",color:'#fff'});
        }
      }
    }
</script>

<style scoped lang="scss">
  .module-out.el-tabs--card>.el-tabs__header .el-tabs__item.is-active.is-closable{
    background-color:#fff;
    color:#333;
  }
  .moveLeft{
    margin-bottom: 20px;
  }
  .conditionsSetItem{
    justify-content: space-between;
    p{
      span{
        cursor:pointer;
      }
    }
  }
  body,p{
    margin:0;
    padding:0;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
  .left-menu{
    width:190px;
    display:inline-block;
    padding: 10px 10px 40px;
  }
  .right-content{
    /*position: absolute;
    left:200px;
    top:0;
    right:0;*/
    width:auto;
    /*display:inline-block;*/
    padding: 0px 20px 20px 20px;
    bottom:0;
    overflow: auto;
  }
  .default-start{
    text-align: center;
    height:40px;
    line-height:40px;
    /*padding-top:42px;
    box-sizing: border-box;*/
  }

  .setting{
    background: #1fbba6;
    color:#fff;
    text-align: center;
    height:42px;
    font-size:16px;
    line-height: 42px;
  }
  .conditions{
  }

  .conditions .conditions-content{
    width:100%;
    margin:0 auto;
    overflow: hidden;
    position:relative;
  }

  .conditions-content >.action{
    display:inline-block;
    margin-top: 235px;
    vertical-align: top;
    width:15%;
    float: left;
    text-align: center;
    color: #409EFF;
    font-size:30px;
    font-weight:bold;
    cursor: pointer;
  }
  .conditions .all-conditions,
  .conditions .set-conditions{
    width:42%;
    height:530px;
    display:inline-block;
    float:left;
  }
  .conditions .all-conditions>ul,
  .conditions .set-conditions>ul{
    height:420px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    overflow-y: auto;
    padding-left:20px;
    padding-top:10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .conditions .all-conditions>ul li,
  .conditions .set-conditions>ul li{
    list-style: none;
    font-size:16px;
    height:29px;
    line-height:29px;
    padding-right:20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .conditions .all-conditions>div,
  .conditions .set-conditions>div{
    justify-content: center;
    align-items: center;
    color: #333;
    font-size:16px;
    margin: 40px 0 16px;
  }
  .conditions .all-conditions>ul{
    background: #f3f3f3;
  }
  .conditions .set-conditions>ul{
    border:1px #409EFF solid;
  }
  .conditions .set-conditions>ul li>p:nth-of-type(1){
    float:left;
    margin:0;
    min-width: 88px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width:63%;
  }
  @media screen and (max-width:1200px) and (min-width: 1100px){
    /*.conditions .conditions-content{
      width:80%;
    }*/
  }
  @media screen and (max-width:1100px) and (min-width: 768px){
    .conditions .conditions-content{
      width:100%;
    }
    .conditions .set-conditions>ul li>p:nth-of-type(1){
      max-width:50%;
      min-width:50px;
    }
  }
  .conditions .set-conditions>ul li>p:nth-of-type(2){
    float:right;
    margin:0;
    width:60px;
  }
  .conditions .set-conditions>ul li>p>span{
    cursor:pointer;
    font-weight:bold;
  }

  span.dot{
    width:10px;
    height:10px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    background:#409EFF;
    display:inline-block;
  }
  .rank-content{
    margin: 30px 0 50px;
  }
  .rank-content span{
    font-size:16px;
  }
  .rank-content .el-select{
    width:180px;
  }
  .rank-content .el-select .el-input{
    height:35px;
  }
 .mark{
    box-sizing:border-box;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    background: #e1f5fe;
    height:40px;
    line-height:40px;
    color:#333;
    border:1px #c8e4e8 solid;
    font-size:14px;
    margin:20px 0 0;
    padding-left: 10px;
    width:100%;
  }

  @media screen and (max-width:1100px) and (min-width: 768px) {
    .rank .mark{
      width:100%;
    }
  }
  .mould-item{
    display:inline-block;
    position:relative;
    background:#21b9aa;
    line-height: 30px;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;
    border-radius: 30px;
    color:#fff;
    text-align: center;
    font-size:14px;
    padding: 0 20px;
    margin-right:25px;
    margin-bottom:20px;
    cursor:pointer;
  }
  .mould-item.active{
    background: #c1c1c1;
  }
  .mould-item >span{
    position: absolute;
    top:-5px;
    right:-5px;
    font-size:20px;
    color:#8b8b8b;
    background: #fff;
    cursor:pointer;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .dot-box{
    margin-bottom:15px;
    font-size:16px;
  }
  .search-title{
    box-sizing: border-box;
    width:100%;
    min-height:100px;
    height:auto;
    background: #f2f2f2;
    margin:20px 0;
    padding: 20px;
  }
  .search-title .el-checkbox{
    margin-left:0;
    margin-bottom:10px;
    width:160px;
  }
  .result .actions-btn{
    text-align: right;
  }
  .right-content{
    position: relative;
    /*height:600px;
    overflow:auto;*/
  }

  .moveRight,.moveLeft{
    margin: 15px auto;
    width: 35px;
    height: 35px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    background: #f5f7fa;
    color:#c0c4cc;
    border: 1px #c0c4cc solid;
  }
  .moveRight i,.moveLeft i{
    font-size:20px;
  }
  .moveRight.active,.moveLeft.active{
    background: #00b6ff;
    color:#fff;
  }
  .content-btn{
    text-align: right;
  }
    .but-qx{background: none!important;
    border: none!important;
    color: #333!important;
    font-size: 14px!important;
    left: 5px!important;
    margin-left: -15px!important}

    .but-qk{background: none!important;
    border: none!important;
    color: #ff8585!important;
    font-size: 14px!important;
    left: 5px!important;
    margin-left: -15px!important}
    .el-button--success{color: #ffffff;
    border: none;
    background: #67c23a;}
</style>
