<template>
  <el-row style="height:100%">
    <el-col :sm="5">
      <div style="width:95%;">
        <el-row>
          <el-form :inline="true">
            <el-form-item style="float: left;width:40%;margin-right: 4px">
              <el-select v-model="searchType">
                <el-option value="0" label="报价单编号"></el-option>
                <el-option value="1" label="单位名称"></el-option>
                <el-option value="2" label="录入人"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="float: left;width:35%;margin-right: 4px">
              <el-input clearable v-model="searchKey"></el-input>
            </el-form-item>
            <el-form-item style="float: left;width:20%;margin-right: 0px">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      <el-row>
        <el-col>
          <!--<ul style="height:700px;overflow-y: scroll;font-size:14px;">
            <li :class="currentId==val.id?'bg-red':'bg-white'" @click="refreshDetail(val)" v-for="val in tableData"
                style="border-bottom:1px grey solid;cursor:pointer;margin-bottom:10px;">
              <table>
                <tr>
                  <td>
                    <div v-if="val.quotationNo">
                    <span style="color: blue" >{{val.quotationNo}}</span><br>
                    </div>
                    <span style="font-weight: bold">{{val.companyName}}</span>
                    <br>{{val.addPersonName }}&nbsp;&nbsp;&nbsp;&nbsp;{{val.addTime | myCurrency}}
                  </td>
                </tr>
              </table>
            </li>
          </ul>-->

                <el-table ref="leftMenu" :show-header="false" :data="tableData" @row-click='refreshDetail'  :max-height="QJTableMaxHeight" >
                      <el-table-column align='left'>
                        <template slot-scope="scope" align="left">
                            <div :class="{cursor:true,'current-row':planData && planData.id == scope.row.id }">
                                <p v-if="scope.row.quotationNo!=null" >报价单编号：<font style="color: blue">{{scope.row.quotationNo}}</font></p>
                              <p >委托单位：<font style="font-weight: bold">{{scope.row.companyName}}</font></p>
                                <p >添加人：{{scope.row.addPersonName }}</p>
                              <p>添加时间：{{scope.row.addTime | myCurrency}}</p>
                            </div>
                        </template>
                      </el-table-column>
                </el-table>
          <mind-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            layout="prev,next,countpage,total"
            :page-size="rows"
            :total="total"
            style="margin-left: 80px;margin-top:10px;"
          >
          </mind-pagination>
        </el-col>
      </el-row>
      </div>
    </el-col>

    <el-col :sm="19" style="position: relative;height:100%;">
      <arrangeDetail
            :quotationNo="quotationNo"
            :planData="planData"
            :planId="planId"
            :callback="handleCallback"
            :returnCallback="handleQuoReturn"
            ></arrangeDetail>
    </el-col>

  </el-row>

</template>

<script>
  import Vue from "vue";
  import Vuex from "vuex";

  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../util/base";
  import arrangeDetail from "./arrangeDetail.vue";

/*   import {
    Button,
    Table,
    TableColumn,
    Row,
    Col,
    Radio,
    RadioGroup
  } from "element--ui";
  Vue.use(Button);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Radio);
  Vue.use(RadioGroup); */

  export default {
    data() {
      return {
        searchType: "1",//默认查询条件
        searchKey: "",//查询检索词
        page: 1,
        rows: 20,
        total: 0,
        tableData: [],//左侧列表
        planId: 0,
        quotationNo: '', //报价单编号
        currentId:0,//当前点击的计划任务
        planData: {}, //器具信息
      };
    },
    components: {arrangeDetail},
    methods: {
      //行点击事件
      refreshDetail(rowInfo, event, column) {
        console.log(rowInfo);
        this.currentId = rowInfo.id;
        this.planId = rowInfo.id;
        this.planData = rowInfo;
        this.quotationNo = rowInfo.quotationNo;
      },
      //查询按钮
      search() {
        let paramters = {
          page: this.page,
          rows: this.rows,
          total: 0
        };
        if (this.searchType == "0") {
          if (this.searchKey != '') {
            paramters["quotationNo"] = this.searchKey;
          }
        } else if (this.searchType == "1") {
          if (this.searchKey != '') {
            paramters["companyName"] = this.searchKey;
          }
        } else {
          if (this.searchKey != '') {
            paramters["addPersonName"] = this.searchKey;
          }
        }
        this.getTableData(paramters)
      },
      getTableData(paramters) {
        paramters = paramters == null ? {page: this.page, rows: this.rows, total: 0} : paramters;
        ajaxRequest("get", "back/plan/getPlanIsBankOrderNo", paramters, res => {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
            this.planData = {};
            this.currentId = 0;
            this.quotationNo= '';
            this.planId = 0;
            if(!!this.tableData.length){
              setTimeout(() => {
                this.planData = this.tableData[0];
                this.currentId = this.planData.id;
                this.quotationNo= this.planData.quotationNo;
                this.planId = this.planData.id;
              }, 0);
            }
          }
        });
      },
      handleSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getTableData(null);
      },
      handleCurrentChange(currentPage) {
        this.page = currentPage;
        this.getTableData(null);
      },
      //任务安排
      handleCallback(planId,checkedData,data) {
        ajaxRequest(
          "post",
          "back/arrange/planApplianceArrange",
          {
            planAppliance: JSON.stringify(checkedData),
            isSelfarrange: data.isSelfarrange,
            planTime: Array.from(new Set(data.allPlanTime)).toString(),
            leader: data.leader,
            vehicle: data.vehicle,
            driver: data.driver,
            planId: planId,
          },
          res => {
            if (res.code == 200) {
              this.getTableData(null);
              let str = res.map.scene
                ? "<div>现场委托单编号:" + res.map.scene + "</div>"
                : "";
              str += res.map.bringBack
                ? "<div>带回委托单编号为:" + res.map.bringBack + "</div>"
                : "";
              str +=
                '<button style="color:#fff;background-color:#409eff;padding:5px 5px;border-radius:3px;">打印委托单<button>';
              this.$alert(str, "成功", {
                confirmButtonText: "关闭",
                dangerouslyUseHTMLString: true,
                callback: action => {
                  this.$message.success("操作成功");
                }
              });
            }
          }
        );
      },
      //报价单退回
      handleQuoReturn(backReason,planId,quotationNo,quotationId,phone){
        ajaxRequest(
          "post",
          "back/plan/returnToQuo",
          {
            backReason: backReason,
            quotationNo: quotationNo,
            planId: planId,
            quotationId:quotationId,
            phone:phone,
          },
          res => {
            if (res.code == 200) {
              this.$message.success('退回成功');
              //刷新列表
              this.getTableData(null);
            }else{
              this.$message.success('操作失败');
            }
          }
        );
      },
    },
    filters: {
      myCurrency(myInput) {
        return formatDate(myInput, "YYYY-MM-DD hh:mm:ss");
      },
    },
    created() {
    },
    mounted() {
      //查询左侧待安排计划任务
      this.getTableData();
    }
  };
</script>

<style scoped>
  .bg-red{
    background: #c9d6de;
  }
  .bg-white{
    background: white;
  }

  </style>
