<template>
  <div style="position:relative;">
    <div>
      <div v-if="defaultOpen">
        <Retrieve  ref="retrieve-wapper"
                   :rowsCondition='rowsCondition'
                   :sortBy="sortBy"
                   :order="order"
                   :paramJson="paramJson"
                   :retrieveCondition="retrieveCondition"/>
      </div>

      <div>
        <div style="display: flex;justify-content: space-between;margin: 10px 0px;">
          <div style="display: inline-block;text-align: center;margin:0 auto;">
            <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
            <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning" >&nbsp;清空</el-button>
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
              <div class="el-icon-info shuoming">
               <el-row class="el-sm">
                 <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">事项说明</p>
                 <dl style="padding:6px 10px; ">
                 <p>1、有效期15天内的器具显示在该节点</p>
                 </dl>
            </el-row>
            </div>
            </span>
        </div>

        <div style="margin-top:10px;">
          <el-table :max-height="QJTableMaxHeight"
            :data="tableData"
            border
            style="width: 100%"
            @sort-change="handleSort"
            @selection-change="handleSelectionChange"
          v-loading="loading">
            <el-table-column  type="index" fixed label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              prop="dwMc"
              label="单位名称"
            >
            </el-table-column>
            <el-table-column
              prop="warningEquCount"
              label="即将超期备案数"
            >
            </el-table-column>
            <el-table-column
              prop="lxr"
              label="联系人"
            >
            </el-table-column>

            <el-table-column
              prop="mobile"
              label="联系电话"
            >
            </el-table-column>

            <el-table-column
              prop="dz"
              label="单位地址"
            >
            </el-table-column>

            <el-table-column v-if="headObj.zzjgdm"
                             prop="zzjgdm"
                             label="统一社会信用代码"

            ></el-table-column>

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
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentPageChange">
          </mind-pagination>
        </div>
      </div>
    </div>

  </div>


</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import {ajaxRequest, formatArrayToTree} from '../../util/base';
  import Retrieve from '../../Retrieve';
  import WorkMould from '../../mould/WorkMould';
  import TableColumnHeader from '../../Table/TableColumnHeader';
  import paramJson from "../equipmentAudit/company"; //同目录下json数据

/*   import { Table, TableColumn ,Pagination} from 'element--ui';
  Vue.use(Table);
  Vue.use(TableColumn); */
  export default {
    name: "parameter-table",
    data(){
      return{
        page:1,
        rows:10,
        total:0,
        searchKey:'',
        orderProperty:'id',
        orderType:'desc',
        tableData:[],
        multipleSelection:[],
        sourceData:["","强检平台","公共服务平台"],
        fuzzySearch:0,
        isSetting:0,
        edit:null,

        /*高级检索相关项*/
        rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
        paramJson: paramJson, //同目录下json数据 常量
        moduleList: [], //模板列表
        templateValue: "", //当前选择的模板id
        sortBy: "", //排序字段
        order: "", //desc降序 asc升序
        headObj: {}, //表头显示对象 {category:true}
        defaultOpen: true, //默认开启高级查询
        loading:false,
        userId: "",
        allModules: {}, //所有模板
        resultCondition: [],
        retrieveCondition: [],
      }
    },
    computed: Vuex.mapState(["themeColor", "themeColors"]),
    watch:{
      themeColor(newValue){
        document.body.className='custom-'+newValue
      },
    },
    methods:{
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

      getTableList(){
        this.loading=true
        this.tableData = [];

        ajaxRequest('get','back/equipmentQuery/getOverTimeWarningCustomerlist',{
          fuzzySearch:1,
          page:this.page,
          rows:this.rows,
          orderProperty:this.orderProperty,
          orderType:this.orderType,
          total:0,
          sc:this.sc
        },(res)=>{
          if(res.code===200){
            var data =res.rows;
            this.tableData=data;
            this.total=res.total;
            this.multipleSelection=[];
          }
          this.loading=false
        })
      },
      dealDate: function (row, column, cellValue) {
        return formatDate(cellValue, "YYYY-MM-DD");
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
      handleDetail(rowInfo){
        this.$router.push({
          path:'/admin/515',
          query:{
            id:rowInfo.dwId,
          }
        })
      },
    },
    components:{
      WorkMould,
      TableColumnHeader,
      Retrieve
    },
    mounted() {
      let userId = localStorage.getItem("userId");
      this.userId = userId;

      this.getTableList();
      this.QJGetMounted();
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
  .el-icon-setting {
    background: none !important;
    border: none !important;
    color: #3094e0 !important;
  }
  .el-icon-setting:hover {
    color: #3094e0 !important;
  }

  .shuoming {
    border: none !important;
    color: #56BC4E !important;
    font-size: 16px !important;
  }

  .shuoming::after {
    content: "";
    width: 35px;
    height: 40px;
    /*background: #fff;*/
    position: absolute;
    z-index: 999;
    /* top: 0; */
    /* left: -65px; */
    margin-left: -16px;

  }

  .el-sm {
    background: #ffffff;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 7px 33px -9px #969696;
    box-shadow: 1px 7px 33px -9px #969696;
    border: 2px solid #56bc4e8c;
    border-radius: 5px;
    color: dimgrey;
    margin-left: -301px;
    word-break: break-all;
    margin-top: 18px;
    padding: 0px 0px;
    font-size: 14px;
    opacity: 50;
    width: 320px;
    float: right;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
  }

  .shuoming .el-sm {
    display: none;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
  }

</style>
