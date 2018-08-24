<template>
  <el-col>
    <el-row class="m-b-20  m-t-10" v-if="!!quoInfo">
      <el-col :sm="12" v-if="!!quoInfo">报价单编号：<span style="color:blue" @click="toPrintQuotation">{{quoInfo.quotationNo}}</span></el-col>
      <el-col :sm="12" v-if="!!quoInfo">报价单备注：{{quoInfo.remark}}</el-col>
    </el-row>
    <el-row class="m-b-20" v-if="!!quoInfo">
      <el-col :sm="12" v-if="!!quoInfo"> 报价单附件：
        <mind-upload ref="upFiles"
                     :disabled="disabled"
                     :attachIds="quoInfo.attachment" >
        </mind-upload>
      </el-col>
    </el-row>
    <el-row class="m-b-20 " v-if="!!planData">
      <el-col :sm="12">委托单位：{{planData.companyName}}</el-col>
      <el-col :sm="12">联系人：{{planData.contacter}}</el-col>
    </el-row>
    <el-row class="m-b-20 " v-if="!!planData">
      <el-col :sm="12">单位地址：{{planData.address}}</el-col>
      <el-col :sm="12">联系电话：{{planData.telephone}}</el-col>
    </el-row>
    <el-row class="m-b-20 " v-if="!!planData">
      <el-col :sm="12">证书单位名称：{{planData.certificateCompanyName}} </el-col>
      <el-col :sm="12">证书日期：{{planData.certificatePrintTime | DateFormat}}</el-col>
    </el-row>
    <el-row class="m-b-20 " v-if="!!planData">
      <el-col :sm="12">证书单位地址：{{planData.certificateCompanyAddress}}</el-col>
      <el-col :sm="12">上门检测地址：{{planData.detectionSite}}</el-col>
    </el-row>
    <el-row class="m-b-20 " v-if="!!planData">
      <el-col :sm="12">备注：{{planData.specialRequirement}}</el-col>
    </el-row>
    <el-row class="m-b-20 " v-if="!!planData">
      <el-col :sm="12">附件：
        <mind-upload v-if="planData.attachment" ref="uploadFile"
                     :disabled="disabled"
                     :attachIds="planData.attachment"></mind-upload>
      </el-col>
    </el-row>
    <el-row >
      <el-col :sm="24">
        <el-form :inline="true">
          <el-form-item label="预估工作量(小时)" label-width="140px" prop="planHour" :rules="{type: 'number', message: '请输入数字'}">
            <el-input  v-model="planHour" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="执行人" label-width="80px" prop="taskPerson">
            <el-input v-model="taskPerson.join()" readonly></el-input>
          </el-form-item>
          <el-form-item prop="depart">
            <el-select v-model="depart" @change="departChangeEvt">
              <el-option v-for="val in departData" :label="val.departName" :value="val.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="user">
            <el-select v-model="user" @change="userChangeEvt" placeholder="请选择">
              <el-option v-for="val in userData" :label="val.userName" :value="val.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <template>
              <el-tooltip content="勾选检测方式为现场的器具，认领器具；带回器具无需操作" placement="bottom" effect="light">
                <el-button type="primary" size="mini" @click="claimEvt">认领</el-button>
              </el-tooltip>
            </template>
            <template>
              <el-tooltip content="勾选检测方式为现场的器具，撤销已认领数据；带回器具无需操作" placement="bottom" effect="light">
                <el-button type="warning" size="mini" @click="revokeTaskPerson">撤销</el-button>
              </el-tooltip>
            </template>
            <template>
              <el-tooltip content="清空本行数据" placement="bottom" effect="light">
                <el-button type="warning" size="mini" @click="cleanSelectData">清空</el-button>
              </el-tooltip>
            </template>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :sm="24">
        <div>
          <el-table :data="planApplianceData" :max-height="QJTableMaxHeight" ref="multipleTable" border stripe @select-all="selectAll"
                    style="width: 100%" @select="selectEvt">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="applianceName" label="器具名称" :formatter="handleApplianceName" align="center"
                             show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
            <el-table-column prop="setNumber" label="套数" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="departName" label="检测部门" align="center" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
            <el-table-column prop="model" label="规格型号" align="center" show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
            <el-table-column prop="detectionParameter" label="检测参数" align="center"
                             show-overflow-tooltip :render-header="QJrenderHeader"></el-table-column>
            <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="detectionMethod" label="检测方式" :formatter="handleMethod" align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="inspector" label="执行人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="estimatedWorkload" label="工作量" align="center"
                             show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <div style="margin-top:10px;text-align:center; float:right;">
          <mind-pagination
            :current-page="page"
            :page-size="rows"
            :total="total"
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentPageChange">
          </mind-pagination>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-form ref="form" :model="arrangeForm" label-width="100px">
        <el-row>
          <el-col :sm="8">
            <el-form-item >
              <template slot = "label">
                <span>是否自排</span>
                <el-tooltip class="item" effect="dark" content="自排无需选择计划安排日期，由各检测部门自己安排时间">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-radio-group v-model="arrangeForm.isSelfarrange" @change="clearPlanTime">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :sm="16" v-if="arrangeForm.isSelfarrange=='1'">
            <el-form-item>
              <template slot = "label">
                <span>计划日期</span>
                <el-tooltip class="item" effect="dark" content="能添加多个">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-date-picker type="dates" v-model="arrangeForm.allPlanTime" placeholder="选择一个或多个日期" style="width: 100%"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="8">
            <el-form-item >
              <template slot = "label">
                <span>带队人</span>
                <el-tooltip class="item" effect="dark" content="委托单对应检测人员的带队人">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-select v-model="arrangeForm.leaderPar" @change="leaderChangeEvt">
                <el-option v-for="val in departData" :label="val.departName" :value="val.id" :key="val.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="16">
            <el-form-item>
              <el-select v-model="arrangeForm.leader">
                <el-option v-for="val in userData" :label="val.userName" :value="val.id" :key="val.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="8">
            <el-form-item>
              <template slot = "label">
                <span>车辆情况</span>
                <el-tooltip class="item" effect="dark" content="下厂的车辆信息">
                  <i class="el-icon-info ft12"></i>
                </el-tooltip>
              </template>
              <el-select v-model="arrangeForm.vehicle">
                <el-option label="车辆情况" value="车辆情况"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="8">
            <el-form-item label="司机">
              <el-select v-model="arrangeForm.driverPar" @change="driverChangeEvt">
                <el-option v-for="val in departData" :label="val.departName" :value="val.id"  :key="val.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="8">
            <el-form-item>
              <el-select v-model="arrangeForm.driver">
                <el-option v-for="val in driverData" :label="val.userName" :value="val.id" :key="val.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :sm="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="arrangeForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="!!quoInfo">
          <el-col :sm="24">
            <el-form-item label="退回原因">
              <el-input v-model="backReason"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row type="flex" class=" m-t-10" justify="center">
      <el-col :sm="24">
        <span style="display: block; text-align: center;">
        <el-button type="primary" @click="handleArrange">安排</el-button>
        <template>
          <el-tooltip content="只有报价单转过来的任务且未派单的，可以整单退回。退回需要填写退回原因，成功后会向委托单位联系人发送短信" placement="bottom" effect="light">
            <el-button v-show="!!quoInfo"
                       v-mindPopover="{message:'整单退回报价转过来的器具，数据将不能恢复！确认退回?',success:handleReturn.bind(this),isOpen:handleOpen.bind(this)}"
                       type="warning">退回
            </el-button>
          </el-tooltip>
        </template>
        </span>
      </el-col>
    </el-row>
  </el-col>
</template>
<script>
  import Vue from "vue";
  import Vuex from "vuex";
  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../util/base";
  import paramJson from './applianceSearchJson';

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
    name:"arrange-detail",
    props: {
      quotationNo: {//报价单编号
        type: String
      },
      planData: {
        type: Object,
        required: true
      },
      planId: {
        type: Number,
        required: true
      },
      callback: {
        type: Function,
        required: true
      },
      returnCallback: {
        type: Function,
      },
    },
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        planApplianceData: [],//器具列表
        arrangeForm: {"allPlanTime": [],"driver":'',"leader":''},//安排信息
        departData: [],
        userData: [],
        planHour: null,//工作量
        taskPerson: [],//任务执行人
        taskIds: [],
        depart: null,
        user: null,
        driverData: null,
        backReason: null,
        tempId: 0,
        tempQuoNo: 0,
        quoInfo: null,//报价单信息
        disabled: true,
        rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
        paramJson: paramJson, //同目录下json数据 常量
      };
    },
    watch: {
      tempId() {
        this.getPlanApplianceData(this.planId);
      },
      planId() {
        this.tempId = this.planId
      },
      tempQuoNo() {
        this.getQuoInfo(this.quotationNo);
      },
      quotationNo() {
        this.tempQuoNo = this.quotationNo;
      },
    },
    methods: {
      //根据报价单编号获取报价单信息
      getQuoInfo(quotationNo) {
        ajaxRequest(
          "get", "back/plan/getQuoInfoByQuoNo", {quotationNo: quotationNo},
          res => {
            if (res.code === 200) {
              if (res.daoResult != null) {
                this.quoInfo = res.daoResult;
              } else {
                this.quoInfo = null;
              }
            }
          }
        );
      },
      //器具列表高级检索
      QJhandleSearch(column,value){
        var comparison = this.getComparison(column.property);
        var sqlSeg = this.getSqlSeg(column.property);
        this.sc = JSON.stringify([{"nameCode":column.property,"sqlSeg":sqlSeg,"comparison":comparison,"value":value}])
        this.getPlanApplianceData(this.planId);
      },
      //获取器具列表
      getPlanApplianceData(planId) {
        ajaxRequest(
          "get",
          "back/planAppliance/getPlanApplianceListNotArr",
          {
            planId: planId, page: this.page, rows: this.rows, total: 0,sc:this.sc,
          },
          res => {
            if (res.code == 200) {
              this.total = res.total;
              this.planApplianceData = res.rows;
              this.planApplianceData.forEach(val => {
                Object.assign(val, {
                  checked: false
                });
              });
            }
          }
        )
      },
      departChangeEvt(departId) {
        ajaxRequest(
          "get",
          "back/user/retrieve",
          {
            isDelete: 0,
            departId: departId
          },
          res => {
            if (res.code === 200) {
              this.userData = res.rows;
              this.user = "";
            }
          }
        );
      },
      userChangeEvt(userId) {
        this.userData.forEach(val => {
          if (val.id == userId) {
            this.taskPerson.push(val.userName);
            this.taskPerson = Array.from(new Set(this.taskPerson));
            this.taskIds.push(val.id);
            this.taskIds = Array.from(new Set(this.taskIds));
          }
        });
      },
      getDepartData() {
        ajaxRequest(
          "get",
          "back/depart/list",
          {
            isDelete: 0
          },
          res => {
            if (res.code === 200) {
              this.departData = res.rows;
            }
          }
        );
      },
      getUserData() {
        ajaxRequest(
          "get",
          "back/user/retrieve",
          {
            isDelete: 0,
          },
          res => {
            if (res.code === 200) {
              this.userData = res.rows;
              this.driverData = res.rows;
            }
          }
        );
      },
      leaderChangeEvt(departId) {
        ajaxRequest(
          "get",
          "back/user/retrieve",
          {
            isDelete: 0,
            departId: departId
          },
          res => {
            if (res.code === 200) {
              this.userData = res.rows;
              if (res.rows.length > 0) {
                this.arrangeForm.leader = res.rows[0].id;
              } else {
                this.arrangeForm.leader = null;
              }

            }
          }
        );
      },
      driverChangeEvt(departId) {
        ajaxRequest(
          "get",
          "back/user/retrieve",
          {
            isDelete: 0,
            departId: departId
          },
          res => {
            if (res.code === 200) {
              this.driverData = res.rows;
              if (res.rows.length > 0) {
                this.arrangeForm.driver = res.rows[0].id;
              } else {
                this.arrangeForm.driver = null;
              }

            }
          }
        );
      },
      selectAll(selection) {
        if (selection.length > 0) {
          selection.forEach(val => {
            Object.assign(val, {
              checked: true
            });
          });
        } else {
          selection.forEach(val => {
            Object.assign(val, {
              checked: false
            });
          });
        }
      },
      selectEvt(selection, rows) {
        if (rows.checked == true) {
          rows["checked"] = false;
        } else {
          rows["checked"] = true;
        }
      },
      // 认领
      claimEvt() {
        let inspectors = "";
        this.taskPerson.forEach((v, i) => {
          if (i == 0) {
            inspectors += v;
          } else {
            inspectors += ",";
            inspectors += v;
          }
        });
        let checked = false;
        if(inspectors == ""){
          this.$message.error('请选择执行人和工作量！');
          return;
        }
        this.planApplianceData.forEach(val => {
          if (val.checked && val.detectionMethod != "2") {
            checked = true;
            Object.assign(val, {
              inspector: inspectors,
              estimatedWorkload: this.planHour
            });
          }
        });
        if (!checked) {
          this.$message.error('请勾选检测方式为现场的器具');
          return;
        }
      },
      // 撤销任务执行人
      revokeTaskPerson() {
        this.planApplianceData.forEach(val => {
          if (val.checked == true) {
            // this.$refs.multipleTable.toggleRowSelection(val);
            Object.assign(val, {
              inspector: "",
              estimatedWorkload: ""
            });
          }
        });
      },
      //清空
      cleanSelectData(){
        this.taskPerson = [];
        this.planHour = null;
        this.depart=null;
        this.user=null;
        this.userData=[];
      },
      //器具名称格式化
      handleApplianceName(val) {
        return val.applianceActualName || val.applianceName;
      },
      //检测方式格式化
      handleMethod(val) {
        switch (val.detectionMethod) {
          case "0":
            return "现场";
            break;
          case "1":
            return "送检";
            break;
          case "2":
            return "带回";
            break;
          default:
            break;
        }
      },
      // 安排
      handleArrange() {
        console.log(this.arrangeForm.allPlanTime, '安排')
        //非自排请选择计划时间
        if (this.arrangeForm.isSelfarrange == '1' && this.arrangeForm.allPlanTime.length == 0) {
          this.$message.error('非自排请选择计划时间');
          return;
        }
        //不同检测部门
        let checkedData = [], xc = 0, dh = 0;//勾选的器具
        this.planApplianceData.forEach(val => {
          if (val.checked == true) {
            checkedData.push(val);
            console.log(val, '选择器具信息');
            if (val.detectionMethod == '0') {
              xc++;
            } else if (val.detectionMethod == '2') {
              dh++;
            }
          }
          delete val.checked;
        });
        if (checkedData.length < 1) {
          this.$message.error('请勾选器具');
          return;
        }
        //同时包含现场和带回，系统将自动拆单
        if (xc > 0 && dh > 0) {
          this.$confirm('同时包含现场和带回器具，系统将自动拆单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.callback(this.planId, checkedData, this.arrangeForm);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消安排'
            })
          })
        } else {
          this.callback(this.planId, checkedData, this.arrangeForm);
        }
      },
      /**
       * [handleOpen 如果未通过则不出现提示框]
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      handleOpen() {
        return new Promise(resolve => {
          ajaxRequest('get', 'back/planAppliance/judgeQuoAppHasArr', {
            planId: this.planId,
            quotationNo: this.quotationNo
          },res => {
            if (res.code === 200) {
              if (res.total > 0) {
                this.$message.error('报价单下已有器具被安排，不能整单退回')
                resolve(false)
              }else{
                //是否填写退回原因
                if (this.backReason == null || this.backReason == "") {
                  this.$message.error('请填写退回原因');
                  resolve(false)
                }
              }
              resolve(true)
            }
          })
        })
      },
      //报价单退回
      handleReturn() {
        console.log(this.quoInfo,'报价单信息');
        this.returnCallback(this.backReason, this.planId, this.quotationNo,this.quoInfo.quotationId,this.quoInfo.phone);
      },
      //自排-->非自排，清空之前选择的计划日期
      clearPlanTime() {
        if (this.arrangeForm.isSelfarrange == '1') {
          this.arrangeForm.allPlanTime = [];
        }
      },
      handlePageSizeChange(size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size;
        this.getPlanApplianceData(this.planId);
      },
      handleCurrentPageChange(currentPage) {
        this.page = currentPage;
        this.getPlanApplianceData(this.planId);
      },
      toPrintQuotation() {
        console.log(this.quoInfo,"报价单打印")
        this.printHtml("quotationPrint",{quotationId:this.quoInfo.quotationId});
      },
    },
    filters: {
      DateFormat(myInput) {
        return formatDate(myInput, "YYYY-MM-DD");
      }
    },
    created() {
      this.getDepartData();
    },

    mounted() {
      this.tempId = this.planId;
      Vue.set(this.arrangeForm, 'isSelfarrange', '1');
    }
  };
</script>
<style scoped>
  .m-b-10 {
    margin-bottom: 10px;
  }

  .m-b-20 {
    margin-bottom: 20px;
  }

  .inline {
    display: inline;
  }

  .m-r-10 {
    margin-right: 661px;
  }

  .m-f-10 {
    margin-left: 10px;
  }

  .m-t-10 {
    margin-top: 10px;
  }

  .m-l-10 {
    margin-left: 10px;
  }

  .m-l-5 {
    margin-left: 5px;
  }

  .font-blod {
    font-weight: bold;
  }
</style>
