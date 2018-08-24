<!--
  证书审核
 -->
<template>
    <div class="main">
        <div  class="el-col el-col-24 el-col-sm-6 left">
            <div style="width:95%;">
                <el-select v-model="searchType" style="width:100px;">
                    <el-option v-for="item in searchOption" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input style="width:210px;" v-model="searchKey" v-focusSelect @keyup.enter="getTableList"></el-input>
                <el-button type="primary" icon="el-icon-search"  @click="getTableList" style="position:relative;top:-1px;" >查询</el-button>
                <el-table :data="tableData" @row-click='selectData'  :max-height="QJTableMaxHeight">
                    <el-table-column align='left'>
                        <template slot-scope="scope" align="left">
                            <div :class="{cursor:true,'current-row':standardDetail == scope.row.id }">
                                <p>设备名称：{{scope.row.instrumentationName}}</p>
                                <p>出厂/设备编号：{{scope.row.manufacturingCode}}/{{scope.row.deviceNumber}}</p>
                                <p>发起人/时间：{{scope.row.addUserName}} / {{scope.row.addTime | dateFormat}}</p>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="margin-top:10px;text-align:center;float:right;">
                <mind-pagination
                    :current-page="page"
                    :page-size="rows"
                    :total="total"
                    layout="prev,next,countpage,total"
                    style="margin-left:80px;"
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>
        </div>
        <div class="right  el-col el-col-24 el-col-sm-18 right" >
            <div v-if="!!standardDetail">
                <!-- <company-content :data="dataDetail" :callback="callback" :isWatch="true"></company-content> -->
                <instrumentation-tab v-if="standardDetail" :standardId="instId"  type="traceabilityConfirm"></instrumentation-tab>
                <div class="result">
                    <div class="title-item mb20"><span>审核结果</span></div>
                    <el-form ref="result" :model="resultInfo" :rules="resultRules" label-width="20%">
                        <el-row>
                            <el-col class="confirm">
                                <span style="color:#606266;">经确认，本次检校数据能否满足相关要求</span>
                                <el-radio-group  v-model="resultInfo.departmentReviewResult">
                                    <el-radio label="0">否</el-radio>
                                    <el-radio label="1">是</el-radio>
                                </el-radio-group>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <el-form-item label="审核意见" prop="departmentReviewAdvise">
                                    <el-input v-model="resultInfo.departmentReviewAdvise"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="text-align:center">
                            <el-col>
                                <el-button type="primary" @click="saveResult">保存</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
        </div>
    </div>

</template>
<script type="text/javascript">
import { ajaxRequest,ajaxSyncRequest } from '../../../util/base.js';
import $ from 'jquery';
import instrumentationTab from '../instrumentationTab.vue'
const resultInfoDefault = {
    departmentReviewResult:"1",
    departmentReviewAdvise:'',
}
export default {
  name:'traceabilytyConfirm',
  components:{instrumentationTab},
  props: {

  },
  data() {
    return {
      page: 1,
      rows: 10,
      total: 0,
      tableData:[],
      //   检索条件
      searchType:undefined,
      searchKey:undefined,
      searchOption:[{label:'设备名称',value:0},{label:'出厂编号',value:1},{label:'设备名称',value:2}],
    //   左侧显示详细数据的id
      standardDetail:undefined,
      instId:undefined,
      resultInfo:$.extend({},resultInfoDefault),
      resultRules:{
        departmentReviewAdvise:[{required:false,max:200,message:'最多不能超过200字符',trigger:'blur'}]
      },
    };
  },
    filters:{
        dateFormat(value){
            if(value){
                return new Date(value).format('YYYY-MM-DD')
            }
            return ''
        }
    },
  computed: {

  },
  methods: {
    dealDate(row, column, cellValue) {
      if (cellValue) {
        return new Date(cellValue).format("YYYY-MM-DD");
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
    getTableList() {
      ajaxRequest("get", "back/instrmentationAud/list",{
        page: this.page,
        rows: this.rows,
        total: 0,
        isDelete: 0,
        isTrace:0,
        isFinished:0,
        isDepartmentReview:0,
        status:0
      },res => {
        this.total = res.total;
        this.tableData=res.rows
        if(!!this.tableData.length){
            this.selectData(this.tableData[0])
        }
      });
    },
    // 异步编程管理
    async asyncInitFunction() {
      await Promise.all([this.getTableList()]);
    },
    selectData(row, event, column){
      this.standardDetail = null;
      this.instId = null;
        setTimeout(() => {
          this.standardDetail = row.id;
          this.instId = row.instId;
        }, 0);
    },
    // 结果保存
    saveResult(){
      this.$confirm("确认审核?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.resultInfo.id = this.standardDetail;
        this.resultInfo.instId = this.instId;
        ajaxSyncRequest('put',"back/instrmentationAud/certificateReview",this.resultInfo,res=>{
          if(res.code===200){
            this.$message.success("审核成功");
            this.getTableList();
          }
        })
      })
    }
  },
  mounted() {
    this.asyncInitFunction();
  }
};
</script>
<style type="text/css" scoped>
.current-row{
    background-color: #f0f9eb;
}
.cursor{
    cursor: pointer !important;
    padding: 10px;
}

.right{
    max-height: 85vh;
    overflow: scroll;
    overflow-x: hidden;
}
.result{
    margin-top: 10px;
}
.confirm{
    display: flex;
    justify-content: space-around;
}
</style>
