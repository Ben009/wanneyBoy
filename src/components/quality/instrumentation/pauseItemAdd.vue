<template>
    <div class="pauseItem">
        <div class="title-item mb20"><span>暂停项目添加</span></div>
        <div>
            <div style="margin-bottom:5px;">
                <Retrieve  ref="retrieve-wapper"
                        :rowsCondition='rowsCondition'
                        :sortBy="sortBy"
                        :order="order"
                        :paramJson="paramJson"
                        :retrieveCondition="retrieveCondition"/>
            </div>
            <div style="display: flex;justify-content: space-between;" class="mb20">
            <div style="display: inline-block;text-align: center;margin:0 auto" >
                <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
                <el-button @click="handleCancel" class="el-icon-back">返回</el-button>
            </div>
            </div>
            <el-table :max-height="QJTableMaxHeight"
                ref="table"
                border
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column
                prop="categoryName"
                 :render-header="QJrenderHeader"
                label="计量器具类别">
                </el-table-column>
                <el-table-column
                prop="applianceName"
                :render-header="QJrenderHeader"
                label="计量器具名称">
                </el-table-column>
                <el-table-column
                prop="measureRange"
                :render-header="QJrenderHeader"
                label="测量范围">
                </el-table-column>
                <el-table-column
                prop="accuracyDegree"
                :render-header="QJrenderHeader"
                label="准确度等级">
                </el-table-column>
                <el-table-column
                prop="departName"
                :render-header="QJrenderHeader"
                label="检测部门">
                </el-table-column>
                <el-table-column
                prop="postName"
                :render-header="QJrenderHeader"
                label="检测岗位">
                </el-table-column>
            </el-table>
            <div>
              <div style="float:left;margin-top:10px;margin-left:10px;">
              <el-button type="primary" @click="handleSubmit" :disabled="!multipleSelection.length">提交</el-button>
              </div>
              <div style="margin-top:10px;text-align:center;float:right">
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
    </div>
</template>
<script>
import Vue from "vue";
import Vuex from "vuex";
import $ from "jquery";
import { ajaxRequest, formatArrayToTree } from "../../util/base.js";
import Retrieve from "../../Retrieve.vue";
import WorkMould from "../../mould/WorkMould.vue";
import TableColumnHeader from "../../Table/TableColumnHeader.vue";
import paramJson from "./pauseItemAdd.js";//同目录下json数据

const defaults = {};
export default {
  name: "pause-item",
  components: {
    WorkMould,
    TableColumnHeader,
    Retrieve,
  },
  props: {
    rowInfo:{
      type:Object
    },
    rowId: {
      type:Number
    },
    data: {
      type: Object
    },
    callback: {
      type: Function
    },
    beforeClose: Function
  },
  data() {
    return {
      page: 1,
      rows: 10,
      total: 0,
      searchKey: "",
      orderProperty: "id",
      orderType: "desc",
      tableData: [],
      multipleSelection:[],
      fuzzySearch: 0,
      comeback: false,

      isSetting: 0, //控制个性化设置弹窗是否展示

      /*高级检索相关项*/
      rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
      paramJson: paramJson, //同目录下json数据 常量
      moduleList: [], //模板列表
      sortBy: "", //排序字段
      order: "", //desc降序 asc升序
      headObj: {}, //表头显示对象 {category:true}
      defaultOpen: true, //这个变量没有产生效果？？加入之后页面内容产生很大的破坏

      userId: "",
      allModules: {}, //所有模板
      resultCondition: [],
      retrieveCondition: []
    };
  },
  created(){
    console.log(this.rowId)
  },
  methods: {
    //字符串转日期
    stringToDate : function(fDate){
      var fullDate = fDate.split("-");

      return new Date(fullDate[0], fullDate[1]-1, fullDate[2], 0, 0, 0);
    },

    //提交
    handleSubmit(){
      if(this.multipleSelection.length>0){
        ajaxRequest('post','back/xmzt/insertXmztByBatch',
          {traid:this.rowInfo.id,
            instId:this.rowId,
            jlqj:this.multipleSelection,
            startTime:this.stringToDate(this.rowInfo.sendDate),
            endTime:this.stringToDate(this.rowInfo.returnDate) },res=>{
          if(res.code===200){
            this.$confirm("添加成功,是否继续添加?", "提示", {
            confirmButtonText: "是",
            cancelButtonText: "否",
            type: "warning"
            }).then(() => {
              this.getTableList()
            }).catch(()=>{
              this.$emit("pauseItemAdd", this.comeback);
            })

          }else{
            this.$message.error("添加失败")
          }
        })
      }else{
        this.$message.error('请先选择')
      }
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
      ajaxRequest( "get", "back/appliance/retrieve", {
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          // 进行升序降序排列的标志
          orderType: this.orderType,
          total: 0,
          sc: this.sc
        },  res => {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
            this.multipleSelection=[]
          }
        }
      );
    },
    handleSelectionChange(val) {
      let id=''
      if (val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          id = val[i].id + ',' + id
        }
      }
      if (id != '') {
        id = id.substring(0, id.length - 1)
        this.multipleSelection = id
      }
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

    //返回
    handleCancel() {
      this.$emit("pauseItemAdd", this.comeback);
    },
    //表格时间格式化
    dealDate: function(row, column, cellValue) {
      if (cellValue) {
        return new Date(cellValue).format("YYYY-MM-DD");
      }
    }
  },
  mounted() {
    this.getTableList();
    this.QJGetMounted();
  }
};
</script>
<style scoped>
.mb20 {
  margin-bottom: 20px !important;
}
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
</style>
