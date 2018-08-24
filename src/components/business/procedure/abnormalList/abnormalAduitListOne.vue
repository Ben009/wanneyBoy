<template>
	<div class="abnormalAduitList">
			<div class="left">
				<div class="search">
					<el-select v-model="searchProperty" style="width:150px;">
						<el-option 	v-for="item in selectOption"
						:label="item.label"
						:value="item.value"></el-option>
					</el-select>
					<el-input v-model.trim="searchKey" style="width:200px;"></el-input>
					<el-button type="primary" @click="searchInfo">查询</el-button>
				</div>
				<el-table :data="abnormalList" 
                  :max-height="QJTableMaxHeight"
                  @select="singleSelect"
									@selection-change="handleSelectionChange" 
									@cell-click="rowClick" 
									:row-class-name="tableRowClassName"
									class="table">
					<el-table-column
						type="selection"
						width="40">
					</el-table-column>
					<el-table-column align="left" label="审核数据" class-name="content">
						<template slot-scope="scope">
              <div :class="{active:abnormalId==scope.row.id}">
                <P><span class="label">登记号:</span>{{scope.row.registrationNo}}</P>
                <p><span class="label">器具名称:</span>{{scope.row.applianceName}}</P>
                <P><span class="label">单位名称:</span>{{scope.row.companyName}}</P>
                <P><span class="label">申请人/申请时间:</span>{{scope.row.addUserName}}/{{scope.row.applyDate}}</P>
              </div>
						</template>
					</el-table-column>
				</el-table>
				<div class="leftBottom">
					<div>
						<el-button size="small" type="primary"  v-mindPopover="{message:'确定批量审核通过?',success:batchDepartAduit.bind(this)}">批量一审</el-button>
						<!-- <el-button size="small" type="primary" v-has="'M706'" v-mindPopover="{message:'确定批量审核通过?',success:batchAduit.bind(this)}">批量二审</el-button> -->
						<el-button size="small" type="primary" v-mindPopover="{message:'确定批量拒绝?',success:batchRefused.bind(this)}">批量拒绝</el-button>
					</div>
					<div style="margin-top:10px;text-align:center; float:right;">
						<mind-pagination
							:current-page="page"
							:page-size="rows"
							:total="total"
              :layout="layout"
							@size-change="handlePageSizeChange"
							@current-change="handleCurrentPageChange">
						</mind-pagination>
					</div>
				</div>
			</div>
			<div class="right">
				<abnormal-detail v-if="abnormalType == 'aduit'" type="aduit" level="one" @resolveSubmit="refresh"></abnormal-detail>
			</div>
	</div>
</template>
<script type="text/javascript">
import abnormalCommon from "./mixins/abnormalCommon";
import abnormalDetail from "./abnormalDetail";
import Retrieve from "@/components/Retrieve";
import WorkMould from "@/components/mould/WorkMould";
import TableColumnHeader from "@/components/Table/TableColumnHeader";
import paramJson from "./retrieveConfig/retrieveConfig";
export default {
  name: "abnormalAduitList",
  data() {
    return {
      abnormalList: [], // 异常流程列表
      multipleAnormalList: [], // 所有选中的异常任务

      /*高级检索相关项*/
      isSetting: 0, //控制个性化设置弹窗是否展示
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
      page: 1,
      rows: 10,
      total: 0,
      layout:"prev,next,countpage,total",
      // 搜索需要的字段
      searchKey: "",
      searchProperty: "registrationNo",
      selectOption: [
        { label: "登记号", value: "registrationNo" },
        { label: "委托单位", value: "companyName" },
        { label: "委托单号", value: "orderNo" },
        { label: "流转单号", value: "orderStringNo" }
      ]
    };
  },
  computed: {
    abnormalType() {
      return this.$store.state.Procedure.abnormalInfo.type;
    },
    abnormalId() {
      return this.$store.state.Procedure.abnormalInfo.id;
    }
  },
  watch: {
    // abnormalType(newvalue, oldvalue) {
    //   if (newvalue == "") {
    //     this.getTableList();
    //   }
    // }
  },
  mixins: [abnormalCommon],
  methods: {
    /******************************************** 表单操作 start **************************************/
    /**
     * [handleReview 查看异常申请的详情]
     * @return {[type]} [description]
     */
    handleAduit(row) {
      this.$store.commit("SET_ABNORMAL_INFO", {
        type: "aduit",
        id: row.id
      });
    },
    /**
     * [batchDepartAduit 批量一审 需要过滤出所有一审已审核过的登记号]
     * @return {[type]} [description]
     */
    batchDepartAduit() {
      let tempFilterList = [],
        tempId = [];
      // 收集所有的一审审核未通过的id
      if (this.multipleAnormalList.length > 0) {
        this.multipleAnormalList.forEach(val => {
          if (val.bmShFlag == "0") {
            tempId.push(val.id);
          }
        });
      } else {
        this.$message.error("请至少勾选一个异常任务！");
        return;
      }
      // 如果所勾选的所有的异常任务都已近审核通过则提示并终止任务
      if (tempId.length == 0) {
        this.$message.error("所勾选的内容已经全部一审通过！");
        return;
      }
      this.$store
        .dispatch("batchDepartAduit", {
          firstIds: tempId.join()
        })
        .then(res => {
          this.$message.success({
            message: "审核成功！",
            duration: 1000,
            onClose: () => {
              this.asyncInitFunction();
            }
          });
        });
    },
    // 批量拒绝
      batchRefused() {
      let tempId = [];
      if (this.multipleAnormalList.length > 0) {
        this.multipleAnormalList.forEach(val => {
          tempId.push(val.id);
        });
      } else {
        this.$message.error("请至少勾选一个异常任务！");
        return;
      }
      this.$store
        .dispatch("batchRefused", {
          refuseIds: tempId.join()
        })
        .then(res => {
          this.$message.success({
            message: "批量拒绝成功！",
            duration: 1000,
            onClose: () => {
              this.asyncInitFunction();
            }
          });
        });
    },
    /**
     * [handleSelectionChange 找出所有勾选过得异常任务]
     * @return {[type]} [description]
     */
    handleSelectionChange(val) {
      this.multipleAnormalList = val;
    },
    /******************************************** 表单操作 end **************************************/

    /******************************************** 初始化操作 start **************************************/
    /**
     * [getTableList 查询出所有的异常流程]
     * @return {[type]} [description]
     */
    getTableList() {
      return this.$store
        .dispatch("getAbnormalList", {
          orderProperty: this.orderProperty,
          orderType: this.orderType, // 进行升序降序排列的标志
          sc: this.sc,
          page: this.page,
          rows: this.rows,
          total: 0,
          showFlag: '2' //显示一级审核
        })
        .then(res => {
          this.abnormalList = res.rows;
          this.total = res.total;
          // 每次获取数据总是显示第一条数据
          if(this.abnormalList.length == 0){
              this.$store.commit("SET_ABNORMAL_INFO", {
                type: "",
                id:''
              });
          }else{
            this.handleAduit(this.abnormalList[0])
          }
          return res;
        })
        .catch(rej => {
          this.$message.error(rej);
        });
    },
    // 异步编程管理
    async asyncInitFunction() {
      await Promise.all([this.QJGetMounted(),this.getTableList()]).then(data=>{
        if (!!data[1].rows.length) {
          console.log(data[1],'table数据')
        this.handleAduit(data[1].rows[0]);
      }
      });
    },
    /******************************************** 初始化操作 end **************************************/
    rowClick(row, column, cell, event) {
      this.$store.commit("SET_ABNORMAL_INFO", {
        type: "",
        id: row.id
      });
      setTimeout(() => {
        this.$store.commit("SET_ABNORMAL_INFO", {
          type: "aduit",
          id: row.id
        });
      }, 0);
    },
    // 搜索信息
    searchInfo() {
      // this.$store.commit("SET_ABNORMAL_INFO", {
      //   type: "",
      //   id: ""
      // });
      let info = this.searchProperty;
      if(this.searchProperty == 'registrationNo' && !this.searchKey){
        this.$message.error('登记号不能为空！')
      }
      let param = {
        page: this.page,
        rows: this.rows,
        total: 0,
        fuzzySearch: 1,
        isDelete: 0,
        showFlag: "2"
      };
      param[info] = this.searchKey;
      this.$store
        .dispatch("getAbnormalList", param)
        .then(res => {
          this.abnormalList = res.rows;
          this.total = res.total;
          if(this.abnormalList.length == 0){
              this.$store.commit("SET_ABNORMAL_INFO", {
                type: "",
                id:''
              });
          }else{
            this.handleAduit(this.abnormalList[0])
          }
        })
        .catch(rej => {
          this.$message.error(rej);
        });
      
    },
    // 审核成功后的表格刷新
    refresh(){
      console.log('收到请求，进行刷新')
      this.asyncInitFunction();
    },
    // 修改表格颜色
    tableRowClassName({ row, rowIndex }) {
      if (row.id === this.abnormalId) {
        return "success-row";
      }
    },
    singleSelect(selection,row){
      this.$store.commit("SET_ABNORMAL_INFO", {
        type: "aduit",
        id: row.id
      });
    }
  },

  components: {
    abnormalDetail,
    Retrieve,
    WorkMould,
    TableColumnHeader
  },
  mounted() {
    this.asyncInitFunction();

  }
};
</script>
<style type="text/css" scoped>
.abnormalAduitList {
  position: relative;
}
.left {
  width: 23vw;
  display: inline-block;
  vertical-align: top;
  height: 88vh;
  overflow-y: hidden;
  overflow-x: hidden;
}
.table {
  padding-bottom: 120px;
}
.leftBottom {
  position: absolute;
  bottom: 0;
  padding: 10px 0;
  z-index: 10;
  background-color:white;
  width: 21vw;
}
.right {
  width: 60vw;
  display: inline-block;
  margin-left: 20px;
  vertical-align: top;
  max-height: 88vh;
  overflow: scroll;
  overflow-x: hidden;
}
.label {
  color: #303133;
}
/*当点击表格时显示的颜色*/
.active {
  background-color: #f0f9eb !important;
}
</style>
