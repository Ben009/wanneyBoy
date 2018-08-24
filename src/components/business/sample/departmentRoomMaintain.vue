<template>
  <div>
    <div>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增部门</el-button>
    </div>
    <div>
      <el-table  :max-height="QJTableMaxHeight"
        ref="table"
        :data="tableData"
        border
        style="width: 100%"
        @sort-change="handleSort"
        :fit="true">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          prop="deptName"
          label="部门名称"
          >
        </el-table-column>
        <el-table-column
          prop="room"
          label="房间号"
          >
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
              class="el-icon-edit-outline" title="编辑"></i></el-button>
            <el-button v-mindPopover="{message:'确定要删除该部门房间?',success:handleDelete.bind(this,[scope.row])}" type="text" style="padding:0;font-size:18px;"><i
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
    <departmentRoomMaintainForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></departmentRoomMaintainForm>
  </div>
</template>

<script>
  import Vue from 'vue';
  //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
  import Vuex from 'vuex';
  //引入表格和分页插件
  //引入ajax工具
  import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
  //引入高级检索
  import Retrieve from '../../Retrieve';
  //引入个性化设置模版
  import WorkMould from '../../mould/WorkMould';
  //引入自定义表头
  import TableColumnHeader from '../../Table/TableColumnHeader';
  //引入新增部门弹层
  import departmentRoomMaintainForm from './departmentRoomMaintainForm';
  //引入jquery
  import $ from 'jquery';
  import ElCol from "@/common-el/packages/col/src/col";
  import ElRow from "@/common-el/packages/row/src/row";

/*   import {
    Button,
    Checkbox,
    CheckboxGroup,
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
  } from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox); */

  export default {
    components: {
      ElRow,
      ElCol,
      departmentRoomMaintainForm,
      WorkMould,
      TableColumnHeader,
      Retrieve,
    },
    name:"departmentRoomMaintain",
    data() {
      return {
        page:1,//页码
        rows:10,//每页记录数
        fuzzySearch:0,//是否模糊查询，默认关闭模糊查询
        total:0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
        orderProperty:'id',//排序字段
        orderType:'asc',//排序方式
        tableData:[],//表格中的数据
        outData:"",//当前行数据
        edit:"",//新增或编辑

      }
    },
    methods:{
      getTableList(){
        /*获取table数据，维护data数据*/
        ajaxRequest('get',"back/exchange/retrieve",{
          page:this.page,
          rows:this.rows,
          orderProperty:this.orderProperty,
          orderType:this.orderType,
          total:0,
        },(res)=>{
          if(res.code===200){
            this.tableData=res.rows;
            this.total=res.total;
          }
        })
      },
      handleEdit(rowInfo){
        this.edit = rowInfo || {}
      },
      handleDelete: function(data){
        let _this = this;
        /*删除表格数据*/
        if(data.length>0){
          ajaxRequest('PUT','back/exchange/delete', {
            id:data[0].id
          },function(res){
            if(res.code===200){
              _this.$message.success('删除成功')
              _this.getTableList();
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
      handleEditCallback(rowInfo){
        //回调刷新列表页数据
        let _this = this;
        if(rowInfo) {
          this.getTableList();
        }
        this.edit = null;
      },
      dealDate: function (row, column, cellValue) {
        if(cellValue===""||cellValue===null||cellValue===undefined){
          return "";
        }else{
          return new Date(cellValue).format('YYYY-MM-DD');
        }
      },
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
      handlePageSizeChange (size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size
        this.getTableList()
      },
      handleCurrentPageChange (currentPage) {
        this.page = currentPage
        this.getTableList()
      },
    },
    mounted() {
      this.getTableList();
    },
    created(){

    }
  }
</script>

<style scoped>

</style>
