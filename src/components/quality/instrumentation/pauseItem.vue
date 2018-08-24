<template>
    <div class="pauseItem">
        <div v-if="!pauseAddshow">
          <div class="title-item mb20"><span>暂停项目</span></div>
            <div style="margin-bottom:5px;">
                <Retrieve  ref="retrieve-wapper"
                        :rowsCondition='rowsCondition'
                        :sortBy="sortBy"
                        :order="order"
                        :paramJson="paramJson"
                        :retrieveCondition="retrieveCondition"/>
            </div>
            <div style="display: flex;justify-content: space-between;" class="mb20">
              <div style="display: inline-block;text-align: center;margin:0 auto">
                  <el-button type="primary" @click="handleAdd" class="el-icon-plus" v-if="addShow">添加</el-button>
                  <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                  <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
                  <el-button @click="handleCancel" class="el-icon-back">返回</el-button>
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
                <el-button type="primary" size="mini" @click="QJPersonalSetting(1)" class="el-icon-setting">个性化设置</el-button>
                <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting" :handleMouldBack="QJHandleMouldBack"/>
              </span>
            </div>
            <el-table :max-height="QJTableMaxHeight"
                ref="table"
                border
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%">
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
                prop="accuracyDergee"
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
                <el-table-column
                prop="startTime"
                :render-header="QJrenderHeader"
                :formatter="dealDate"
                label="暂停开始日期">
                </el-table-column>
                <el-table-column
                prop="finishDate"
                label="暂停结束日期"
                :render-header="QJrenderHeader"
                :formatter="dealDate">
                </el-table-column>
                <el-table-column  label="操作" width="60">
                <template slot-scope="scope">
                    <!-- <el-button @click="handleDelete(scope.row)" type="text" style="padding:0;font-size:18px;"><i class="el-icon-edit-outline" title="删除"></i></el-button> -->
                    <el-button  v-mindPopover="{message:'确定删除?',success:handleDelete.bind(this,[scope.row]),placement:'left'}" type="text"  size="small" style="padding:0;font-size:18px;"><i
										class="el-icon-delete" title="删除"></i></el-button>
                </template>
                </el-table-column>
            </el-table>
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

         <div v-if="pauseAddshow">
            <pauseItemAdd @pauseItemAdd="itemAdd" :rowId="rowId" :rowInfo="rowInfo"></pauseItemAdd>
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
import paramJson from "./pauseItem.js"; //同目录下json数据
import pauseItemAdd from "./pauseItemAdd.vue";

/* import { Table, TableColumn,} from "element--ui";
Vue.use(Table);
Vue.use(TableColumn); */


const defaults = {};
export default {
  name: "pause-item",
  components: {
    WorkMould,
    TableColumnHeader,
    Retrieve,
    pauseItemAdd
  },
  props: {
    instid:{
      type:Number //外送标准器设备id
    },
    rowInfo:{//计划
      type:Object
    },
    rowId: {
      type:Number//计划查询设备id
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
      fuzzySearch: 0,
      tableData: [],
      pauseAddshow: false,//暂停项目添加详细页标志
      addShow:true,//添加按钮标志

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
    if(this.instid){
      this.addShow=false
      this.rowId=this.instid
    }
  },
  methods: {
    itemAdd(data){
        this.pauseAddshow=data
        this.getTableList()
      },
    //添加
    handleAdd() {
        this.pauseAddshow=true
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
        ajaxRequest( "post", "back/xmzt/findBYxmZt", {
            page: this.page,
            rows: this.rows,
            instid:this.rowId,
            orderProperty: this.orderProperty,
            // 进行升序降序排列的标志
            orderType: this.orderType,
            total: 0,
            sc: this.sc
          },
          res => {
            if (res.code === 200) {
              this.tableData = res.rows;
              this.total = res.total;
            }
          }
        );
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

    //返回
    handleCancel() {
      if(this.instid){
        this.$emit('flag',false)
      }else{
        this.$emit("pauseItem", false);
      }
    },
    //删除
    handleDelete(data) {
      // let id = rowInfo.id;
      // this.$confirm("确认删除?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // }).then(() => {
      //   ajaxRequest("put", "back/xmzt/",{"jlQjId":id}, res => {
      //     if (res.code === 200) {
      //       this.$message.success("刪除成功");
      //       this.getTableList()
      //     } else {
      //       this.$message.error("删除失败");
      //     }
      //   });
      // });
       if (data.length > 0) {
        let ids = data
          .map(function(v) {
            return v.id;
          })
          .join(",");
        ajaxRequest(
          "put",
          "back/xmzt/?jlQjId=" + ids,
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
    //表格日期格式化
    dealDate: function(row, column, cellValue) {
      if (cellValue) {
        return new Date(cellValue).format("YYYY-MM-DD");
      }
    }
  },
  mounted() {
    let userId = localStorage.getItem("userId");
    this.userId = userId;
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
