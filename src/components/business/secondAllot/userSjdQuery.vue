<template>
    <div style="position:relative;" class="userSjdQuery">
    <span class="font-14">部门：</span>
    <el-select v-model="departId" @change="getTableList">
      <el-option value="">全部</el-option>
      <el-option
        v-for="item in departs"
        :key="item.id"
        :label="item.departName"
        :value="item.id">
      </el-option>
    </el-select>

    <br>

    <div>
      <div style="float:right">
        <global-tootips>
          <p>1、您可点击具体的数据查看明细内容；</p>
          <p>2、有权限人员可查看有部门，无权限人员查看本部门；</p>
          <p>3、当日任务：证书数量>０，委托日期为今天，且未完成；</p>
          <p>4、所有任务：证书数量>０，且未完成；</p>
          <p>5、加急任务：证书数量>０，加急，且未完成；</p>
          <p>6、预警任务：证书数量>０，提前两天预警，且未完成；</p>
          <p>7、超期任务：证书数量>０，已超期，且未完成。</p>
        </global-tootips>
      </div>

      <div>
        <el-table  :max-height="QJTableMaxHeight"
                   class="userQueryTable"
          :data="tableData"
          border
          :row-class-name="tableRowClassName"
          :span-method="objectSpanMethod"
        >
          <el-table-column
            prop="DEPART_NAME"
            label="部门"
          >
          </el-table-column>

          <el-table-column
            prop="EXECUTOR"
            label="人员"
          >
          </el-table-column>

          <el-table-column
            prop="TODAY"
            label="当天任务"
          >
            <template slot-scope="scope">
          <span class="fontSize18" @click="getDetail(scope.row,'1')" style="cursor: pointer;"
                v-if="scope.row.EXECUTOR!='合计' && scope.row.TODAY>0">{{scope.row.TODAY}}</span>
              <span class="fontSize18" @click="getDeptDetail(scope.row,'1')" style="cursor: pointer;"
                    v-else-if="scope.row.EXECUTOR=='合计' && scope.row.TODAY">{{scope.row.TODAY}}</span>
              <span class="fontSize18" v-else>{{scope.row.TODAY}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="NOTFINISH"
            label="所有任务"
          >
            <template slot-scope="scope">
          <span class="fontSize18" @click="getDetail(scope.row,'3')" style="cursor: pointer;"
                v-if="scope.row.EXECUTOR!='合计'  && scope.row.EXECUTOR!='总合计' && scope.row.NOTFINISH>0">{{scope.row.NOTFINISH}}</span>
              <span class="fontSize18" @click="getDeptDetail(scope.row,'3')" style="cursor: pointer;"
                    v-else-if="(scope.row.EXECUTOR=='合计' ||  scope.row.EXECUTOR=='总合计' )  && scope.row.NOTFINISH>0">{{scope.row.NOTFINISH}}</span>
              <span class="fontSize18" v-else>{{scope.row.NOTFINISH}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="ISURGENT"
            label="加急任务"
          >
            <template slot-scope="scope">
            <span class="fontSize18" @click="getDetail(scope.row,'2')" style="cursor: pointer;"
                  v-if="scope.row.EXECUTOR!='合计'  && scope.row.EXECUTOR!='总合计' && scope.row.ISURGENT>0">{{scope.row.ISURGENT}}</span>
              <span class="fontSize18" @click="getDeptDetail(scope.row,'2')" style="cursor: pointer;"
                    v-else-if="(scope.row.EXECUTOR=='合计' ||  scope.row.EXECUTOR=='总合计' )  && scope.row.ISURGENT>0">{{scope.row.ISURGENT}}</span>
              <span class="fontSize18" v-else>{{scope.row.ISURGENT}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="WARNINGCOUNT"
            label="预警（提前两天）任务"
          >
            <template slot-scope="scope">
          <span class="fontSize18" @click="getDetail(scope.row,'4')" style="cursor: pointer;color: red"
                v-if="scope.row.EXECUTOR!='合计' && scope.row.EXECUTOR!='总合计'  && scope.row.WARNINGCOUNT>0 ">
            {{scope.row.WARNINGCOUNT}}
          </span>
              <span class="fontSize18" @click="getDeptDetail(scope.row,'4')" style="cursor: pointer;color: red"
                    v-else-if="(scope.row.EXECUTOR=='合计' ||  scope.row.EXECUTOR=='总合计' ) && scope.row.WARNINGCOUNT>0 ">
            {{scope.row.WARNINGCOUNT}}
          </span>
              <span class="fontSize18" v-else>{{scope.row.WARNINGCOUNT}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="OVERDUE"
            label="超期任务"
          >
            <template slot-scope="scope">
          <span class="fontSize18" @click="getDetail(scope.row,'5')" style="cursor: pointer;color: red"
                v-if="scope.row.EXECUTOR!='合计' && scope.row.EXECUTOR!='总合计'  && scope.row.OVERDUE>0 ">
            {{scope.row.OVERDUE}}
          </span>
              <span class="fontSize18" @click="getDeptDetail(scope.row,'5')" style="cursor: pointer;color: red"
                    v-else-if="(scope.row.EXECUTOR=='合计' || scope.row.EXECUTOR=='总合计' ) && scope.row.OVERDUE>0">
            {{scope.row.OVERDUE}}
          </span>
              <span class="fontSize18" v-else>{{scope.row.OVERDUE}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>



    </div>


    <!-- 任务明细 -->
    <userSjdQuyeryDetail
      v-if="!!detailFlag"
      :callback="getDetail"
      :detailType="detailType"
      :userId="userId"
      :departId="departId"
    >
    </userSjdQuyeryDetail>
  </div>
</template>

<script>
  var Big = require('big.js')
  import Vue from 'vue'
  // 引入jquery
  import $ from 'jquery'

  import {ajaxRequest, ajaxSyncProxyRequest, ajaxSyncRequest} from "../../util/base";
  import userSjdQuyeryDetail from './userSjdQueryDetail';

  export default {
    name: "userSjdQuery",
    data() {
      return {
        tableData: [],
        departId: null,
        departs: [],
        detailFlag: false,
        detailType: null,
        userId: null,
        departId: null,
        tempDepartId: null
      }
    },
    mounted() {
      this.getTableList();
      this.getDepartList();
    },
    components: {
      userSjdQuyeryDetail
    },
    methods: {
      getTableList(v) {
        this.detailType = null;
        this.userId = null
        this.tempDepartId = v
        this.detailFlag = false
        ajaxRequest("get", "back/secondAllot/sjdForUser", {id: v}, res => {
          if (res.code === 200) {
            let tempId = "";
            let tempName = "";
            let todays = 0, notfinishs = 0, warningcounts = 0, urgents = 0, overdues = 0;
            let lastTodays = 0, lastNotfinishs = 0, lastWarningcounts = 0, lastUrgents = 0, lastOverdues = 0;
            let arr = new Array();
            let lastObj = new Object();
            res.rows.forEach(r => {
              let obj = new Object();
              obj.DEPARTID = r.ID;
              obj.DEPART_NAME = r.DEPART_NAME;
              obj.EXECUTOR = r.EXECUTOR;
              obj.TODAY = r.TODAY;//
              obj.NOTFINISH = r.NOTFINISH;
              obj.WARNINGCOUNT = r.WARNINGCOUNT;
              obj.OVERDUE = r.OVERDUE;
              obj.ISURGENT = r.ISURGENT;
              obj.EXECUTOR_ID = r.EXECUTOR_ID;

              //总合计
              lastTodays += r.TODAY;
              lastNotfinishs += r.NOTFINISH;
              lastWarningcounts += r.WARNINGCOUNT;
              lastOverdues += r.OVERDUE;
              lastUrgents += r.ISURGENT;

              //部门合计
              if (tempId != "" && tempId != r.ID) {
                let objs = new Object();
                objs.DEPART_NAME = tempName;
                objs.EXECUTOR = '合计';
                objs.EXECUTOR_ID = '';
                objs.DEPARTID = tempId;
                objs.TODAY = todays;//
                objs.NOTFINISH = notfinishs;
                objs.WARNINGCOUNT = warningcounts;
                objs.OVERDUE = overdues;
                objs.ISURGENT = urgents;

                arr.push(objs);
                todays = 0;
                notfinishs = 0;
                warningcounts = 0;
                overdues = 0;
                urgents = 0;
              }
              arr.push(obj);
              todays += obj.TODAY;
              notfinishs += obj.NOTFINISH;
              warningcounts += obj.WARNINGCOUNT;
              overdues += obj.OVERDUE;
              tempId = r.ID;
              tempName = r.DEPART_NAME;
              urgents = obj.ISURGENT;

            })
            //合计行
            let objs = new Object();
            objs.DEPART_NAME = tempName
            objs.EXECUTOR = '合计';
            objs.EXECUTOR_ID = '';
            objs.DEPARTID = tempId;
            objs.TODAY = todays;//
            objs.NOTFINISH = notfinishs;
            objs.WARNINGCOUNT = warningcounts;
            objs.ISURGENT = urgents;
            objs.OVERDUE = overdues;
            arr.push(objs);


            if(!this.departId){
              lastObj.DEPART_NAME = '';
              lastObj.EXECUTOR = '总合计';
              lastObj.EXECUTOR_ID = '';
              lastObj.DEPARTID = '';
              lastObj.TODAY = lastTodays;
              lastObj.NOTFINISH = lastNotfinishs;
              lastObj.WARNINGCOUNT = lastWarningcounts;
              lastObj.ISURGENT = lastUrgents;
              lastObj.OVERDUE = lastOverdues;
              arr.push(lastObj);
            }
            this.tableData = arr
          }
        });
      },
      //获取部门数据
      getDepartList() {
        ajaxRequest("get", "back/secondAllot/getDeptByPower/", {}, res => {
          this.departs = res.rows;
        });
      },
      //合计行样式
      tableRowClassName({row, rowIndex}) {
        if (row.EXECUTOR == '合计' || row.EXECUTOR == '总合计') {
          return 'allotBg';
        } else {
          return '';
        }
      },
      //合并列
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        //第一列
        if (columnIndex === 0) {
          var num = 0;
          var max = 0;
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].DEPARTID === row.DEPARTID && i >= rowIndex) {
              num++;
            }
            if (this.tableData[i].DEPARTID === row.DEPARTID) {
              max++;
            }
          }
          if (num > 1) {
            if (max === num) {
              return {
                rowspan: num, colspan: 1
              };
            } else {
              return {
                rowspan: 0, colspan: 0
              };
            }
          } else {
            if (max > 1) {
              return {
                rowspan: 0, colspan: 0
              };
            }
          }
        }
      },
      //查看个人明细
      // type 1 当天 2所有 3所有未完成  4预警（提前两天）任务  5 超期任务
      getDetail(row, type) {
        if (row) {
          this.detailType = type;
          this.userId = row.EXECUTOR_ID
          this.detailFlag = true
        } else {
          this.detailType = null;
          this.userId = null
          this.tempDepartId = null
          this.detailFlag = false
        }
      },
      //查看部门明细
      getDeptDetail(row, type) {
        this.detailType = type;
        if(row.EXECUTOR!="总合计"){
          this.departId = row.DEPARTID;
        }else{
          this.departId = null;
        }
        this.detailFlag = true
      }
    }
  }
</script>

<style type="text/css" lang="scss">
  .userSjdQuery{
    .el-table .allotBg {
      background-color: #dcdcdc !important;
    }
    .fontSize18 {
      font-size: 18px;
    }

    .el-table__footer-wrapper {
      font-size: 18px;
    }

  }



</style>
