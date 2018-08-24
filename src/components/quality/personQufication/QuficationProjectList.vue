<template>
  <div style="position:relative;">
    <div>
      <Retrieve  ref="retrieve-wapper"
                 :rowsCondition='rowsCondition'
                 :sortBy="sortBy"
                 :order="order"
                 :paramJson="paramJson"
                 :retrieveCondition="retrieveCondition"
                 :collectionInfo="collectionInfo"
                  :needSort="false"/>
    </div>
    <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
    <WorkMould v-if="isSetting" ref="workMould" :rowsCondition='rowsCondition' :callback="QJPersonalSetting"/>
    <div style="display: flex;justify-content: space-between;">
      <el-button @click="handleEdit(null)" type="primary">新增项目维护</el-button>
      <div style="display: inline-block;text-align: center">
        <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
        <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning">&nbsp;清空</el-button>
      </div>
      <span></span>
      <global-tootips style="float: right;text-align: left">
        <p>1.项目通常为证件上可开展的项目，项目供后续将人员与项目进行关联。</p>
        <p>2.可将项目与技术依据、计量标准、CNAS项目进行关联绑定。</p>
      </global-tootips>
    </div>
    <div>
      <div style="margin-top:10px;">
        <el-table :max-height="QJTableMaxHeight"
          :data="tableData"
          border
          style="width: 100%"
          @sort-change="handleSort"
          :fit="true"
          @selection-change="handleSelectionChange"
          v-loading="loading">
          <el-table-column  type="index"  label="序号" width="50" align="center"></el-table-column>
          <el-table-column
            prop="projectName"
            label="项目名称"
            :render-header="QJrenderHeader">
          </el-table-column>
          <el-table-column
            prop="projectType"
            label="项目类别"
            :render-header="QJrenderHeader" >
          </el-table-column>
          <el-table-column
            prop="userName"
            label="添加人"
            :render-header="QJrenderHeader" >
          </el-table-column>
          <el-table-column
            prop="addTime"
            label="添加日期"
            :formatter="dealDate" >
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            :render-header="QJrenderHeader">
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="80px">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-edit-outline" title="编辑"></i></el-button>
              <el-button v-has="'M26205'" v-mindPopover="{message:'确定要删除该项目维护?',success:handleDelete.bind(this,[scope.row])}" type="text" style="padding:0;font-size:18px;"><i
                class="el-icon-delete" title="删除"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top:10px;text-align:center;float:right;">
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
      <quficationProjectForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></quficationProjectForm>
    </div>
  </div>

</template>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest} from '../../util/base';
  //引入高级检索
  import Retrieve from '../../Retrieve';
  //引入个性化设置模版
  import WorkMould from '../../mould/WorkMould';
  //引入自定义表头
  import TableColumnHeader from '../../Table/TableColumnHeader';
  //引入对应的表单编辑页
  import quficationProjectForm from './QuficationProjectForm';
  //引入对应的json文件 当前目录下quficationProjectParam.js文件
  import paramJson from './quficationProjectParam';
  //引入jquery
  import $ from 'jquery';

    export default {
        name: "parameter-table",
        data(){
          return{
            page:1,//页码
            rows:10,//每页记录数
            fuzzySearch:0,//是否模糊查询，默认关闭模糊查询
            total:0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
            searchKey:'',//搜索词
            orderProperty:'c.id',//排序字段
            orderType:'desc',//排序方式
            tableData:[],//表格中的数据
            multipleSelection:[],//多选，选中的数据
            isSetting: 0,  //控制个性化设置弹窗是否展示
            edit: null,   //控制新增弹窗是否展示
            modify: null,   //控制修改弹窗是否展示
            isInner: 0,

            /*高级检索相关项*/
            rowsCondition: paramJson,   //默认同目录下json数据 会依据模板改变
            paramJson: paramJson,      //同目录下json数据 常量
            moduleList: [],           //模板列表
            templateValue: '',       //当前选择的模板id
            sortBy: '',              //排序字段
            order: '',              //desc降序 asc升序
            headObj: {},           //表头显示对象 {category:true}
            defaultOpen: true,

            userId: "",
            allModules: {}, //所有模板
            resultCondition: [],
            retrieveCondition: [],
            collectionInfo:[],
            loading:false,
          }
        },
      methods:{
        handleSort: function(column, prop, order){
            /*用ui组件提供的排序接口,维护实例data数据*/
            this.orderProperty = column['prop'];
            if(column['order'] == 'descending'){
              this.orderType='desc';
            }else{
              this.orderType = 'asc';
            }
          this.getTableList();
        },
//        handleSearch(column,value){
//              /*表格头部检索回调 获取当前列检索信息回显高级搜索组件
//               * comparison 默认显示第一条比较项
//               * column.property 列英文名称
//               * value 检索值
//               * sqlSeg 列sqlSeg信息*/
//              var comparison = this.getComparison(column.property);
//              var sqlSeg = this.getSqlSeg(column.property);
//              this.$refs['retrieve-wapper'].insertRetrieveItem(0, column.property, comparison, value,sqlSeg);
//        },
//        advanceSearch:function(data){
//          /*高级检索事件*/
//          this.sc = JSON.stringify(data.conditions);
//          this.orderProperty = data.sortBy;
//          this.orderType = data.order;
//          this.fuzzySearch = 1;
//          this.getTableList();
//        },
//        getComparison(property){
//              /*通过列属性，找到当前列json配置中第一个比较项*/
//              let temp = paramJson.filter((v)=>{return v.nameCode==property});
//              let comparison =temp.length>0?temp[0].comparison:'';
//              if( Object.prototype.toString.call(comparison)==='[object String]'){
//                  comparison = comparison.split(",")[0];
//              }else{
//                  comparison=comparison[0];
//              }
//              return comparison;
//        },
//        getSqlSeg(property){
//              /*通过列属性，找到当前列json配置中sqlSeg信息*/
//              let temp = paramJson.filter((v)=>{return v.nameCode==property});
//              let sqlSeg =temp.length>0?temp[0].sqlSeg:'';
//              return sqlSeg
//        },
//        renderHeader:function(h, { column, $index }){
//          return <TableColumnHeader column={column} handleSearch={this.handleSearch.bind(this)}></TableColumnHeader>
//        },
//        renderHeader(h, {column, $index}) {
//          /*表格头部自定义渲染  key值必加 隐藏列时需重新渲染头部*/
//          let property = column.property;
//          let currentInfo = paramJson.filter((v)=>{return v.nameCode==property});
//          return (
//                  <TableColumnHeader key={$index+property} column={column}  handleSearch={this.handleSearch.bind(this)} currentInfo={currentInfo}/>
//          )
//
//        },
//        personalSetting(flag) {
//          /*控制显示个性化设置的弹窗 isSetting 默认false*/
//          this.isSetting = flag;
//          !flag ? this.getTemplate():null;
//        },
        getTableList() {
          this.loading=true
          /*获取table数据，维护data数据*/
            ajaxRequest('get','back/quficationProject/list',{
              page:this.page,
              rows:this.rows,
              orderProperty:this.orderProperty,
              orderType:this.orderType,
              total:0,
              sc:this.sc
            },(res)=>{
              if(res.code===200){
                this.tableData=res.rows;
                this.total=res.total;
                this.multipleSelection=[];
              }
              this.loading=false
            })
        },
        handleToggleTheme(color) {
          this.$store.commit('toggleTheme', color)
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        handlePageSizeChange (size) {
          this.page = 1;//Math.floor(this.page * this.rows / size);
          this.rows = size
          this.getTableList()
        },
        handleCurrentPageChange (currentPage) {
          this.page = currentPage
          this.getTableList()
        },
        handleEdit(rowInfo){
          this.edit = rowInfo || {}
        },
        handleDelete: function(data){
          let _this = this
        /*删除表格数据*/
          if(data.length>0){
            let ids = data.map(function (v) {
              return v.id
            }).join(",");
//            _this.$confirm('确认删除?', '提示', {
//              confirmButtonText: '确定',
//              cancelButtonText: '取消',
//              type: 'warning'
//            }).then(() => {
              ajaxRequest('PUT','back/quficationProject/list/'+ids, {isDelete: 1},function(res){
                if(res.code===200){
                  _this.$message.success('删除成功')
                  _this.getTableList()
                }
                else{
                  _this.$message.error('删除失败');
                }
              })
//            })
          }else{
            _this.$message({
              message: '请先选择要删除的数据',
              type: 'warning'
            })
          }
        },
        handleEditCallback(rowInfo){
            //回调刷新列表页数据
          let _this = this;
            if(rowInfo) {
                this.getTableList();
            }
            this.edit = null;
        },
//        getTemplate(){
//          /*获取到当前菜单下模板列表*/
//          ajaxRequest('get','back/settingTemplate/list',{userId:1,moduleType:1,isDelete:0},(res)=>{
//              if(res.code==200){
//              this.moduleList = res.rows;
//              /*个性化设置完成后需通过templateValue刷新当前模板*/
//              var temp = res.rows.filter((v)=>{return v.id==this.templateValue});
//              if(temp.length>0){
//                  this.recoverRetrieve(temp[0]);
//              }else{
//                  this.templateValue='';
//                  this.recoverRetrieve({});
//              }
//          }
//        });
//        },
        recoverRetrieve(temp){
          /*模板信息回显高级搜索组件 模板具体内容放在json格式的content字段里*/
          if(!$.isEmptyObject(temp)){
              let headObj={};
              let info = temp.content ?  JSON.parse(temp.content):[];
              //console.log('bvbvbv',info)

              this.rowsCondition=info.conditions;
              this.sortBy=info.sortBy;
              this.order=info.order;
              if(info.headList){
                  for(let i = 0 ,len=info.headList.length; i <len; i++){
                      headObj[info.headList[i]]=true;
                  }
              }
              this.headObj=headObj;
              this.defaultOpen=info.defaultOpen;
          }
        },
        handleSelectTemplate(value){
          ajaxRequest('get','back/settingTemplate/list',{id:value},(res)=>{
              if(res.code==200){
              var temp = res.rows[0];
              this.recoverRetrieve(temp);
          }
      });
      },
      defaultShowAllCol(){//默认显示列
          let param = [].concat(this.paramJson), headObj = {}
          console.log(param)
          param.forEach(v => v.isDefault == 1 ? headObj[v.nameCode] = true : null)
          this.headObj = headObj
          console.log(this.headObj,this.paramJson)
      },
       dealDate: function (row, column, cellValue) {
          return new Date(cellValue).format('YYYY-MM-DD')
       },
      },
      components:{
        WorkMould,
        TableColumnHeader,
        Retrieve,
        quficationProjectForm,
        paramJson
      },
      mounted() {
        this.getTableList();
//        this.getTemplate();
        /*处理默认展示的表格列*/
        this.defaultShowAllCol()
        this.QJGetMounted;
      }
    }
</script>

<style scoped>
  .custom-input{
    width:200px;
    height:32px;
  }
  .custom-input .el-input__inner{
    height:32px;
    line-height:32px;
  }
  .custom-input .el-input-group__append{
    padding:0 10px;
  }
</style>
