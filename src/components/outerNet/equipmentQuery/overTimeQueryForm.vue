<template>
  <div>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-tabs type="border-card" v-model="tabType" @tab-click="handleClick">
          <el-tab-pane label="单位信息" name="companyTab">
          </el-tab-pane>
          <el-tab-pane label="超期器具" name="overTimeTab">
          </el-tab-pane>

          <div v-show="tabType =='companyTab'" style="margin-top:10px;" >
            <el-Row>
              <el-col :span="0">
              <el-form-item label="主键" prop="id">
              </el-form-item>
              </el-col>

              <el-col :span="1">
              <el-form-item label="单位名称:" prop="companyName">
                {{form.companyName}}
              </el-form-item>
              </el-col>

              <el-col :span="1">
              <el-form-item label="通讯地址:" prop="address">
                {{form.address}}
              </el-form-item>
              </el-col>
            </el-Row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="行政区划:" prop="area">
                  {{form.area}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="统一社会信用代码:" prop="companyCode">
                  {{form.companyCode}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="所属行业:" prop="sshy">
                  {{form.sshy}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
              <el-form-item label="单位性质:" prop="qyxz">
                {{form.qyxz}}
              </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="法人代表:" prop="frfb">
                  {{form.frfb}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="计量管理部门:" prop="jlglbm">
                  {{form.jlglbm}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="部门负责人:" prop="bmfzr">
                  {{form.bmfzr}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="联系电话:" prop="phone">
                  {{form.phone}}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
               <el-col :span="8">
                <el-form-item label="固定资产(万元):" prop="gdzc">
                  {{form.gdzc}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="上年销售额(万元):" prop="snxse">
                  {{form.snxse}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="上年利税(万元):" prop="snls">
                  {{form.snls}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="计量器具资产(万元):" prop="jlqjzc">
                  {{form.jlqjzc}}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="职工人数:" prop="zgrs">
                  {{form.zgrs}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="邮编:" prop="postcode">
                  {{form.postcode}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="电子邮箱:" prop="email">
                  {{form.email}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="主要产品:" prop="zycp">
                  {{form.zycp}}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="计量标准(项):" prop="jljlbz">
                  {{form.jljlbz}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="最高标准(项):" prop="zgjlbz">
                  {{form.zgjlbz}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="计量器具总数(台/件):" prop="jlqjzs">
                  {{form.jlqjzs}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="强检器具(台/件):" prop="qjqjts">
                  {{form.qjqjts}}
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="质量体系:" prop="zltx">
                  {{form.zltx}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="计量体系:" prop="jltx">
                  {{form.jltx}}
                </el-form-item>
              </el-col>
            </el-Row>

          </div>

          <div v-show="tabType !='companyTab'" >
            <div style="margin-bottom:10px;"	v-if="defaultOpen">
              <Retrieve  ref="retrieve-wapper"
                         :rowsCondition='rowsCondition'
                         :sortBy="sortBy"
                         :order="order"
                         :paramJson="paramJson"
                         :retrieveCondition="retrieveCondition"/>
            </div>

            <div style="display: flex;justify-content: space-between;">
              <div style="display: inline-block;text-align: center;margin:0 auto;">
               <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning" >&nbsp;清空</el-button>
              </div>
              <span style="float: right">
              <el-select size="mini" v-if="resultCondition.length" v-model="templateValue"  placeholder="请选择" @change="QJHandleSelectTemplate">
                <el-option
                  v-for="item in moduleList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
              <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
              <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>

            </span>
            </div>

            <div v-show="tabType =='overTimeTab'" style="margin-top:10px;">
              <el-table :max-height="QJTableMaxHeight"
                :data="tableData"
                border
                style="width: 100%"
                @sort-change="handleSort">
                <el-table-column  type="index" fixed label="序号" width="50" align="center"></el-table-column>
                <el-table-column
                  prop="sbmc"
                  label="器具名称"
                >
                </el-table-column>
                <el-table-column
                  prop="ccbh"
                  label="出厂编号"
                >
                </el-table-column>

                <el-table-column
                  prop="xhgg"
                  label="型号规格"
                >
                </el-table-column>

                <el-table-column
                  prop="zqddj"
                  label="准确度等级"
                >
                </el-table-column>

                <el-table-column
                  prop="jdzq"
                  label="检定周期(月)"
                >
                </el-table-column>

                <el-table-column
                  prop="jddw"
                  label="检定机构"
                >
                </el-table-column>

                <el-table-column
                  prop="yxq"
                  label="有效期"
                  :formatter="dealDate"
                >
                </el-table-column>

                <el-table-column
                  label="操作"
                  fixed="right"  width="60px">
                  <template slot-scope="scope">
                    <el-button @click="handleDetail(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                      class="el-icon-document" title="详情"></i></el-button>
                  </template>
                </el-table-column>

              </el-table>
            </div>
            <div style="margin-top:20px;text-align:center;float:right;">
              <mind-pagination
                :current-page="page"
                :page-size="rows"
                :total="total"
                :marginBottom = false
                @size-change="handlePageSizeChange"
                @current-change="handleCurrentPageChange">
              </mind-pagination>
            </div>
          </div>

        </el-tabs>

      </el-form>
      <div style="width: 100%;text-align: center;margin-top: 10px;margin-bottom: 50px">

        <el-button @click="handleCancel">返 回</el-button>
      </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import vueBus from 'vue-bus';
  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../util/base";
  import $ from 'jquery';
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import ElRow from "@/common-el/packages/row/src/row";
  import Retrieve from '../../Retrieve';
  import WorkMould from '../../mould/WorkMould';
  import TableColumnHeader from '../../Table/TableColumnHeader';
  import paramJson from "./equipment"; //同目录下json数据

/*   import {
    Button,
    Checkbox,
    CheckboxGroup,
    Col,
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
    Row,
    Table, TableColumn, Pagination } from 'element--ui';
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox);
  Vue.use(Row);
  Vue.use(Col);
 */
  Vue.use(vueBus);


  const defaults = {
    hoho:''
  };
  export default {
    name: "layout",
    props: {
      data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
        },

        fileList :[],
        cmiimsUrl : "",
        loading: false,
        currentInfo:"",
        remoteOptions: [],
        choose:null,
        erpCompany:{},
        tabType : "companyTab",

        /*高级检索相关项*/
        rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
        paramJson: paramJson, //同目录下json数据 常量
        moduleList: [], //模板列表
        templateValue: "", //当前选择的模板id
        sortBy: "", //排序字段
        order: "", //desc降序 asc升序
        headObj: {}, //表头显示对象 {category:true}
        defaultOpen: true, //默认开启高级查询

        userId: "",
        allModules: {}, //所有模板
        resultCondition: [],
        retrieveCondition: [],

        // 初始化下方列表信息
        page:1,
        rows:10,
        total:0,
        searchKey:'',
        orderProperty:'id',
        orderType:'desc',
        tableData:[],
        multipleSelection:[],
        fuzzySearch:0,
        isSetting: 0, //控制个性化设置弹窗是否展示
      }
    },
    mounted() {
      this.remoteMethod();
      let userId = localStorage.getItem("userId");
      this.userId = userId;
      this.QJGetMounted();
    },
    created () {
      this.getCompanyInfo();
      this.handleClick();
    },
    directives:{ rightclick },
    mixins:[rightClick],
    methods: {
      handleSort: function(column, prop, order){
        this.orderProperty = column['prop'];
        if(column['order'] == 'descending'){
          this.orderType='desc';
        }else{
          this.orderType = 'asc';
        }
        this.getTableList();
      },
      handleSearch(column,value){
        this.$refs['retrieve-wapper'].insertRetrieveItem(0,column['property'],0,value);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePageSizeChange(size){
        this.page=1;//Math.floor(this.page * this.rows / size);
        this.rows=size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage){
        this.page=currentPage;
        this.getTableList();
      },
      getCompanyInfo () {
        ajaxRequest('get', 'back/customer/findCustomerInfoById', {
          id: this.$route.query.id
        }, res => {
          if (res.code === 200) {
            this.form = res.map || {};
          }
        })
      },
      remoteMethod(keyWords) {
        this.loading = true;
        $.ajax();
      },
      handleCancel(){
        this.$router.push({
          path:'/admin/498',
        })
      },
      handleDetail(rowInfo){
        var detailPath = '/admin/438';

        if("3" == rowInfo.tzOrQj){
          detailPath = '/admin/476';
        }
        this.$router.push({
          path:detailPath,
          query:{
            id:rowInfo.id,
          }
        })

      },
      dealDate: function (row, column, cellValue) {
        return formatDate(cellValue, "YYYY-MM-DD");
      },
      handleClick(tab, event) {

        if(!tab || tab.name=="" || tab.name=="companyTab"){
          this.tabType = 'companyTab';
        }else if(tab.name=="overTimeTab"){
          this.tabType = 'overTimeTab';
          this.getTableList();
        }
      },
      getTableList(){
        this.tableData=[];

        ajaxRequest('get','back/equipmentQuery/queryOverTimeEqu',{
          fuzzySearch:1,
          page:this.page,
          rows:this.rows,
          orderProperty:this.orderProperty,
          orderType:this.orderType,
          total:0,
          sc:this.sc,
          dwId:this.$route.query.id,
        },(res)=>{
          if(res.code===200){
            var data =res.rows;
            this.tableData=data;
            console.log(3333333);
            console.log(data);
            this.total=res.total;
            this.multipleSelection=[];
          }
        })

      },
    },
    components:{
      ElRow,
      WorkMould,
      TableColumnHeader,
      Retrieve,
    },
    filters: {
      myCurrency(myInput) {
        return formatDate(myInput, "YYYY-MM-DD hh:mm:ss");
      },
    }
  }
</script>

<style>
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
  ul, li{
    margin:0;
    padding:0;
    list-style:none;
  }
  .custom-1d74b7 .el-col-1 {
  width: 50%;
}
.custom-1d74b7 .el-col-8 {
  width: 25%;
}
@media screen and (max-width:1500px){
  /*.custom-1d74b7 .el-col-1{width: 100%!important;}*/
  .custom-1d74b7 .el-col-8{width: 50%!important;}
}
  .but-yywtd{border:1px solid #3094e0!important; background:none!important;color:#3094e0!important;}
  .but-yywtd:hover{background:#3094e0!important;color:#fff!important;}

  .el-icon-setting {
    background: none !important;
    border: none !important;
    color: #3094e0 !important;
  }
  .el-icon-setting:hover {
    color: #3094e0 !important;
  }
</style>
