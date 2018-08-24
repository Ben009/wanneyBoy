<!-- 历史数据导入 -->
<template>
  <mind-dialog
    :title="'历史数据导入'"
    :visible="true"
    center
    dialogSize="large"
    v-dialogDrag
    appendToBody
    @close="handleCancel">
    <div style="position:relative;">
      <div style="margin-bottom:10px;">
        <Retrieve  ref="retrieve-wapper"
                   :rowsCondition='rowsCondition'
                   :sortBy="sortBy"
                   :order="order"
                   :needSort=false
                   :paramJson="paramJson"
                   :retrieveCondition="retrieveCondition"
                   :collectionInfo="collectionInfo"/>
      </div>

      <div>
        <div style="display: flex;justify-content: space-between;">
          <div style="display: inline-block;text-align: center">
            <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
            <el-button type="primary"  @click="handleSubmit" >&nbsp;确定</el-button>
            <el-button type="warning"  @click="handleCancel" class="el-icon-warning" >&nbsp;取消</el-button>

          </div>

        </div>
        <div style="margin-top:10px;">
          <el-table :max-height="QJTableMaxHeight"
            :data="tableData"
            border
            style="width: 100%"
            @sort-change="handleSort"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column  type="index"  label="序号" width="50" align="center"></el-table-column>
            <el-table-column  prop="companyName"  label="委托单位"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column  prop="applianceName"  label="器具名称" :render-header="QJrenderHeader" ></el-table-column>
            <el-table-column  prop="applianceActualName"  label="器具实际名称" :render-header="QJrenderHeader" ></el-table-column>
            <el-table-column  prop="model" label="型号规格" :render-header="QJrenderHeader" ></el-table-column>
            <el-table-column  prop="factoryNo" label="出厂编号" :render-header="QJrenderHeader" ></el-table-column>
            <el-table-column  prop="equipmentNo" label="设备编号"  :render-header="QJrenderHeader"></el-table-column>
            <el-table-column  prop="setNumber" label="套数" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column  prop="certificateNumber" label="证书数量" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column  prop="unitPrice" label="检测单价" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column  prop="afterDiscountPrice" label="折后单价" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column  prop="afterDiscountTotal" label="检测费" :render-header="QJrenderHeader"></el-table-column>
          </el-table>
        </div>
        <div style="margin-top:10px;text-align:center;float:right;">
          <!-- TODO 案例 分页控件 mind-pagination  -->
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

  </mind-dialog>
</template>

<script>
  import Vue from "vue";
  import { ajaxRequest } from "../../util/base";
  import Retrieve from "../../Retrieve";
  import TableColumnHeader from "../../Table/TableColumnHeader";
  import paramJson from "./paramHistoryImport"; //同目录下json数据

/*   import { Table, TableColumn,} from "element--ui";
  Vue.use(Table);
  Vue.use(TableColumn); */

  export default {
    name: "QuotationHistoryImport",
    props: {//用于接收从父组件中传来的数据
      companyName: {
        type: String
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: "",
        orderProperty: "q.id",
        orderType: "desc",
        tableData: [],
        multipleSelection: [],
        isPut: true,

        isSetting: 0, //控制个性化设置弹窗是否展示
        edit: null, //控制编辑弹窗是否展示
        isInner: 0,

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
        collectionInfo:[],
      };
    },
    methods: {
      handleCancel () {
        this.callback()
      },
      handleSort: function(column, prop, order) {
        this.orderProperty = column["prop"];
        if (column["order"] == "descending") {
          this.orderType = "desc";
        } else {
          this.orderType = "asc";
        }
        this.getTableList();
      },

      getTableList() {
        ajaxRequest("get", "back/quotationAppliance/getHistoryByCompany", {
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
            // 进行升序降序排列的标志
            orderType: this.orderType,
            total: 0,
            sc: this.sc,
          },
          res => {
            if (res.code === 200) {
              this.tableData = res.rows;
              this.total = res.total;
              this.multipleSelection = [];
            }
          }
        );
      },
      handleSubmit(){
        if(this.multipleSelection.length == 0){
          this.$message.error("请先选择器具！");
        }else{
          this.callback(this.multipleSelection);
        }
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableList();
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getTableList();
      },
    },
    components: {
      TableColumnHeader,
      Retrieve,
    },
    mounted() {
      this.$nextTick(()=>{
        this.$refs['retrieve-wapper'].search.conditions[0].nameCode = 'companyName';
        this.$refs['retrieve-wapper'].search.conditions[0].sqlSeg = 'q.COMPANY_NAME';
        this.$refs['retrieve-wapper'].search.conditions[0].comparison = '1';
        this.$refs['retrieve-wapper'].search.conditions[0].value = this.companyName;
      });
      this.sc = '[{"nameCode":"companyName","sqlSeg":"q.COMPANY_NAME","comparison":"1","value":' + this.companyName + '}]';
      this.getTableList();
      this.QJGetMounted();
      this.multipleSelection = [];
    }
  };
</script>

<style scoped>
  .flex-one {
    flex: 1;
  }
  .flex {
    display: flex;
  }
  .custom-input {
    width: 200px;
    height: 32px;
  }

  .custom-input .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  .custom-input .el-input-group__append {
    padding: 0 10px;
  }
  .el-icon-setting {
    background: none !important;
    border: none !important;
    color: #3094e0 !important;
  }
  .el-icon-setting:hover {
    color: #3094e0 !important;
  }
  .shuoming{border: none!important;color:#56BC4E!important;font-size:16px!important;}
  .shuoming::after{
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

  .el-sm{background: #ffffff;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 7px 33px -9px #969696;
    box-shadow: 1px 7px 33px -9px #969696;
    border: 1px solid #56bc4e8c;
    border-radius: 5px;
    color: dimgrey;
    margin-left: -361px;
    word-break: break-all;
    margin-top: 18px;
    padding: 4px 5px;
    font-size: 14px;
    opacity: 50;
    float: right; -webkit-transition: all 0.8s;transition: all 0.8s;}

  .shuoming .el-sm{
    display: none;-webkit-transition: all 0.8s;transition: all 0.8s;
  }
  .el-button--warning:hover{
    background:#ff9c9c!important; border:1px solid #ff9c9c!important;

  }

</style>
