<template>
  <div>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <div class="title-item"><span>单位信息</span></div>
          <el-Row>
            <el-col :span="0">
            <el-form-item label="主键" prop="data.id">
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

          <el-row v-if="isShowCompany">
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
          </el-Row>

          <el-row v-if="isShowCompany">

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

          <el-row v-if="isShowCompany">
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

         <el-row v-if="isShowCompany">
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
         <el-row v-if="isShowCompany">
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

         <el-row v-if="isShowCompany">
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
        <el-row style="margin-top: 10px;margin-bottom: 10px">
          <a v-if="!isShowCompany" style="float: right" @click="showCompany()">详情</a>
          <a v-else style="float: right" @click="showCompany()">返回</a>
        </el-row>

        <div class="title-item"><span>待审核器具</span></div>

        <div style="margin-top:10px;">
          <div style="margin-bottom: 10px">
            <el-button type="primary" @click="handleAuditBatch(multipleSelection)">批量审核</el-button>
          </div>
          <el-table :max-height="QJTableMaxHeight"
            :data="tableData"
            border
            style="width: 100%"
            @sort-change="handleSort"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index"  fixed  label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              prop="sbmc"
              label="器具名称"

            >
            </el-table-column>
            <el-table-column
              prop="applytime"
              label="申请日期"

              :formatter="dealDate"
            >
            </el-table-column>

            <el-table-column
              prop="applyreason"
              label="申请原因"

            >
            </el-table-column>

            <el-table-column
              prop="sqr"
              label="申请人"

            >
            </el-table-column>

            <el-table-column
              prop="sbzt"
              label="变更前状态"

            >
            </el-table-column>

            <el-table-column
              prop="modifystatus"
              label="变更后状态"

            >
            </el-table-column>

            <el-table-column
              label="操作"
              fixed="right"  width="60px">
              <template slot-scope="scope">
                <el-button @click="handleSingleAudit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                  class="el-icon-document" title="审核"></i></el-button>
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

      </el-form>
      <div style="width: 100%;text-align: center;margin-top: 30px;margin-bottom: 50px;">

        <el-button @click="handleCancel">返 回</el-button>
      </div>

    <bitchAuditForm v-if="!!bitchAuditAllData" :data="bitchAuditAllData" :callback="handleBitchAuditCallback"></bitchAuditForm>

    <!--<chooseCompanyList v-if="!!choose" :data="choose" :callback="chooseCallback"></chooseCompanyList>-->
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
  import bitchAuditForm from './bitchAuditForm';
  import paramJson from "../equipmentQuery/equipment"; //同目录下json数据

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
    Table, TableColumn ,} from 'element--ui';
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox);  */
  Vue.use(vueBus);

  const defaults = {
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
//      var validateReason = (rule, value, callback) => {
//        if (!this.form.reason && '-1' ==this.form.realShflag ) {
//          callback(new Error("请输入审核意见"))
//        } else {
//          callback();
//        }
//      };

      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
//          reason: [{validator: validateReason, trigger: 'blur'}],
//          companyName:[{validator: companyNameReason, trigger: 'blur'}]
        },

        fileList :[],
        cmiimsUrl : "",
        loading: false,
        currentInfo:"",
        remoteOptions: [],
        choose:null,
        erpCompany:{},
        isShowCompany :false,
        tabType : "auditTab",

        // 审核页面需要的一些值
        bitchAudit:null,
        bitchAuditArray:null,
        bitchAuditAllData:null,

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
      this.getTableList();
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
      handleSingleAudit(data){
        // 单个审核的模式，将单个数据直接放进数组中
        this.bitchAudit ={};
        this.bitchAudit.deviceId = data.id;
        this.bitchAudit.sbzt = data.modifystatus;
        this.bitchAuditArray = [];
        this.bitchAuditArray.push(this.bitchAudit);
        this.bitchAuditAllData ={};
        this.bitchAuditAllData.dataArray = this.bitchAuditArray;
        this.bitchAuditAllData.shStatus = 1;
      },
      handleAuditBatch(data){
        if(data.length >0){
          let _this = this;
          _this.bitchAuditArray = [];

          // 初始设置可审核通过
          // 若选中的器具项别、种别、检定周期、检定单位有一个未设置，则不可审核通过
          for(var i=0;i<data.length;i++){
            _this.bitchAudit ={};
            _this.bitchAudit.deviceId = data[i].id;
            _this.bitchAudit.sbzt = data[i].modifystatus;
            _this.bitchAuditArray.push(_this.bitchAudit);
          }
          _this.bitchAuditAllData ={};
          _this.bitchAuditAllData.dataArray = this.bitchAuditArray;
          _this.bitchAuditAllData.shStatus = 1;
        }else{
          this.$message.success('请选择器具');
        }
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
          path:'/admin/453',
        })
      },
      showCompany(){
        this.isShowCompany = !this.isShowCompany;
      },
      dealDate: function (row, column, cellValue) {
        return formatDate(cellValue, "YYYY-MM-DD");
      },

      getTableList(){
        this.tableData=[];
        var qjshstatus = '3';
        // 若查历史，则查审核状态为1的
        if('historyTab' == this.tabType){
          qjshstatus = '1'
        }

        ajaxRequest('get','back/equipmentChangeAudit/getEquipmetForChangeAudit',{
          fuzzySearch:1,
          page:this.page,
          rows:this.rows,
          orderProperty:this.orderProperty,
          orderType:this.orderType,
          total:0,
          sc:this.sc,
          dwId:this.$route.query.id,
          qjshstatus:qjshstatus,
          tzOrQj:"1"
        },(res)=>{
          if(res.code===200){
            console.info(res)
            var data =res.map.forceInstrumentsArray;
            this.tableData=data;
            this.total=res.total;
            this.multipleSelection=[];
          }
        })

      },
      handleBitchAuditCallback(data){

        let _this = this;
        if (data) {
          ajaxRequest('get', 'back/equipmentChangeAudit/approve', {
            dataArray:JSON.stringify(data.dataArray),opinion:data.opinion,shStatus:data.shStatus,equipmentType:"0",
          },(res)=>{
            if(res.code===200){
              this.$message.success('批量审核成功');
              this.getTableList();
            }else{
              this.$message.error('批量审核失败');
            }
          })

          this.bitchAuditAllData = null;
        }
        else {
          this.bitchAuditAllData = null;
        }

      }


    },
    components:{
      ElRow,
      WorkMould,
      TableColumnHeader,
      Retrieve,
//      singleAuditForm,
//      bitchSetForm,
      bitchAuditForm,
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
</style>
