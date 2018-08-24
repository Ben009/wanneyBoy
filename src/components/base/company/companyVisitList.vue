<template>
    <div style="position:relative;">

              <!--高级查询-->
      <div style="margin-bottom:10px;">
        <Retrieve  ref="retrieve-wapper"
                  v-if="defaultOpen"
                  :rowsCondition='rowsCondition'
                  :sortBy="sortBy"
                  :order="order"
                  :paramJson="paramJson"
                  :retrieveCondition="retrieveCondition"
                  :collectionInfo="collectionInfo"/>
        </div>
      <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
      <div style="display: flex;justify-content: space-between; margin:10px 0px;">
        <el-button style="opacity:0;" size="small" type="primary" icon="el-icon-plus"></el-button>
        <div style="display: inline-block;text-align: center">
            <el-button type="primary"  @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">查询</el-button>
            <el-button type="warning"  @click="QJEmptyCondition" class="el-icon-warning" v-if="defaultOpen">&nbsp;清空</el-button>
        </div>
        <div style="float: right">
          <el-select size="mini" v-model="templateValue"   placeholder="请选择" @change="QJHandleSelectTemplate">
            <el-option
              v-for="item in moduleList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
            <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
            <global-tootips>
                <p>未处理客户名称标记为红色</p>
            </global-tootips>
        </div>
      </div>



        <div >
            <div style="margin-top:10px;">
                <el-table  :data="tableData"
                        border
                        style="width: 100%;min-height:39vh;"
                        @sort-change="handleSort"
                        :max-height="QJTableMaxHeight"
                           v-loading="loading"
                        >

                    <el-table-column
                            label="序号"
                            type="index"
                            width="60">
                    </el-table-column>

                    <el-table-column
                        prop="customerName"
                        label="客户名称"
                        :render-header="QJrenderHeader"
                    >
                      <template slot-scope="name">
                          <span :class="{color:name.row.isHandle ==0?true:false}">{{name.row.customerName}}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                            prop="visitor"
                            label="拜访人"
                            :render-header="QJrenderHeader"
                    >
                    </el-table-column>


                    <el-table-column
                            prop="visitDate"
                            label="拜访时间"
                            :render-header="QJrenderHeader"
                            :formatter="function(row, column, cellValue, index){return  new Date(cellValue).format('YYYY-MM-DD')}"
                    >
                    </el-table-column>

                    <el-table-column
                        v-if="headObj.wayOfVisiting"
                        prop="wayOfVisiting"
                        label="拜访方式"
                        :render-header="QJrenderHeader"
                    >
                    </el-table-column>

                    <el-table-column
                      v-if="headObj.receptionist"
                      prop="receptionist"
                      label="接待人"
                      :render-header="QJrenderHeader"
                    >
                    </el-table-column>

                    <el-table-column
                      v-if="headObj.contactInformation"
                      prop="contactInformation"
                      label="联系方式"
                      :render-header="QJrenderHeader"
                    >
                    </el-table-column>

                    <el-table-column
                      v-if="headObj.visitSituation"
                      prop="visitSituation"
                      label="拜访情况"
                      :render-header="QJrenderHeader"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="addTime"
                      label="添加时间"
                      :formatter="function(row,column,cellValue,index){return cellValue ? new Date(cellValue).format('YYYY-MM-DD') :'' }"
                      :render-header="QJrenderHeader"
                    >
                    </el-table-column>

                    <el-table-column
                      v-if="headObj.handleAdvice"
                      prop="handleAdvice"
                      label="处理意见"
                      :render-header="QJrenderHeader"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="isHandle"
                      :formatter="function(row, column, cellValue, index){return cellValue === 0?'未处理':'已处理'}"
                      label="处理状态"
                      :render-header="QJrenderHeader"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="handleUserName"
                      label="处理人"
                      :render-header="QJrenderHeader"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="handleTime"
                      label="处理时间"
                      :formatter="function(row,column,cellValue,index){return cellValue ? new Date(cellValue).format('YYYY-MM-DD') :'' }"
                      :render-header="QJrenderHeader"
                    >
                    </el-table-column>


                    <el-table-column
                            label="操作"
                            width="80">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-edit-outline" title="编辑"></i>
                            </el-button>
                            <el-button v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,[scope.row]),placement:'left'}"
                            type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-delete" title="删除"></i>
                            </el-button>
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
            <companyVisitForm v-if="!!edit" :data="edit" :callback="handleEditCallback" :isAut="true"></companyVisitForm>
        </div>
    </div>


</template>

<script>
import Vue from "vue";
import Vuex from "vuex";

import { ajaxRequest, formatArrayToTree } from "../../util/base";
import companyVisitForm from "./companyVisitForm";

/**************************高级检索相关*********************/
import Retrieve from "../../Retrieve";
import WorkMould from "../../mould/WorkMould";
import TableColumnHeader from "../../Table/TableColumnHeader";
import paramJson from "./companyVisit"; //同目录下json数据
/**************************高级检索相关*********************/

export default {
  name: "parameter-table",
  components: {
    WorkMould,
    TableColumnHeader,
    Retrieve,
    companyVisitForm
  },
  data() {
    return {
      page: 1,
      rows: 10,
      total: 0,
      searchKey: "",
      tableData: [],
      fuzzySearch: 0,
      edit: null,

      /**************************高级检索相关*********************/
      orderProperty: "c.ADD_TIME",
      orderType: "desc",
      multipleSelection: [],
      /*高级检索相关项*/
      rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
      paramJson: paramJson, //同目录下json数据 常量
      moduleList: [], //模板列表
      templateValue: "", //当前选择的模板id
      sortBy: "", //排序字段
      order: "", //desc降序 asc升序
      headObj: {}, //表头显示对象 {category:true}
      defaultOpen: true,
      isSetting: 0,
      retrieveCondition: [],
      collectionInfo: [],
      sc:'',
      loading:false
      /**************************高级检索相关*********************/
    };
  },
  methods: {
    getTableList() {
      this.loading=true
      // if (this.searchKey || this.fuzzySearch === 1) {
      ajaxRequest(
        "get",
        "back/companyVisit/retrieve",
        {
          fuzzySearch: 1,
          page: this.page,
          rows: this.rows,
          orderProperty: this.orderProperty,
          orderType: this.orderType,
          total: 0,
          sc: this.sc
        },
        res => {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
            this.multipleSelection = [];
          }
          this.loading=false
        }
      );
      // }
      // else {
      //     ajaxRequest('get', 'back/companyVisit/list', {
      //         page: this.page,
      //         rows: this.rows,
      //         orderProperty: this.orderProperty,
      //         orderType: this.orderType,
      //         total: 0
      //     }, function (res) {
      //         if (res.code === 200) {
      //             this.tableData = res.rows;
      //             this.total = res.total;
      //             this.multipleSelection = [];
      //         }
      //     }.bind(this))
      // }
    },

    handlePageSizeChange(size) {
      this.page = 1;
      this.rows = size;
      this.getTableList();
    },
    handleCurrentPageChange(currentPage) {
      this.page = currentPage;
      this.getTableList();
    },
    handleEdit(rowInfo) {
      this.edit = rowInfo || {};
    },
    handleDelete(data) {
      if (data.length > 0) {
        let ids = data
          .map(function(v) {
            return v.id;
          })
          .join(",");
        ajaxRequest(
          "post",
          "back/companyVisit/list/" + ids,
          { _method: "delete" },
          function(res) {
            if (res.code === 200) {
              this.$message.success("删除成功");
              this.getTableList();
            } else {
              this.$message.error("删除失败");
            }
          }.bind(this)
        );
      } else {
        this.$message({
          message: "请先选择要删除的数据",
          type: "warning"
        });
      }
    },
    handleEditCallback(rowInfo) {
      let _this = this;
      if (rowInfo) {
        if (rowInfo.id) {
          ajaxRequest("put", "back/companyVisit/", rowInfo, function(res) {
            if (res.code === 200) {
              _this.$message.success("编辑成功");
              _this.edit = null;
              _this.getTableList();
            } else {
              _this.$message.error("编辑失败");
            }
          });
        } else {
          ajaxRequest("post", "back/companyVisit/", rowInfo, function(res) {
            if (res.code === 200) {
              _this.$message.success("新增成功");
              _this.edit = null;
              _this.getTableList();
            } else {
              _this.$message.error("新增失败");
            }
          });
        }
      } else {
        this.edit = null;
      }
    },
    handleSort(column) {
      this.orderProperty= column.prop
      this.orderType = ''
      if(column.order == "ascending"){
          this.orderType = 'asc'
      }
      if(column.order == "descending"){
          this.orderType = 'desc'
      }
      this.getTableList();
    }
  },
  mounted() {
    this.getTableList();
    this.QJGetMounted();
  },

};
</script>

<style scoped>
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
    transition: all 0.8s;}

 .shuoming .el-sm{
    display: none;-webkit-transition: all 0.8s;transition: all 0.8s;
   }
   .color{
     color: red;
   }
</style>
