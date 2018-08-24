<template>
  <mind-dialog title="计划任务委托单信息" :visible="true" dialog-size="mid" center v-dialogDrag @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :sm="8">
          <el-form-item label="委托单号" prop="orderNo">
            <span>{{form.orderNo}}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="16">
          <el-form-item label="是否自排" prop="isSelfarrange">
            <el-radio-group v-model="form.isSelfarrange">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24">
          <el-form-item label="计划日期">
            <el-date-picker type="dates" v-model="form.allPlanTime" placeholder="选择一个或多个日期" style="width: 100%"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="8">
          <el-form-item label="带队人">
            <el-select v-model="form.leaderPar" @change="leaderChangeEvt">
              <el-option v-for="val in departData" :label="val.departName" :value="val.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="16">
          <el-form-item>
            <el-select v-model="form.leader">
              <el-option v-for="val in userData" :label="val.userName" :value="val.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="8">
          <el-form-item label="车辆情况" prop="vehicle">
            <el-select v-model="form.vehicle">
              <el-option label="车辆情况" value="车辆情况"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="8">
          <el-form-item label="司机" prop="driver">
            <el-select v-model="form.driverPar" @change="driverChangeEvt">
              <el-option v-for="val in departData" :label="val.departName" :value="val.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="8">
          <el-form-item>
            <el-select v-model="form.driver">
              <el-option v-for="val in driverData" :label="val.userName" :value="val.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :sm="24">
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <template>
        <el-tooltip content="根据总单编号批量重新安排，如果其中存在已要号的则不允许重新安排" placement="bottom" effect="light">
          <el-button type="danger" v-show="isShow" @click="handleArrange">重新安排</el-button>
        </el-tooltip>
      </template>
      <el-button type="primary" v-has="'M13927'" @click="handleSubmit">保 存</el-button>
      <template>
        <el-tooltip content="安排计划日期后您可点此按钮发送短信给客户告知上门信息" placement="bottom" effect="light">
          <el-button type="warning" v-show="form.isSelfarrange=='0'"  v-has="'M13945'" @click="handleMessage">通知客户</el-button>
        </el-tooltip>
      </template>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from "vue";
  import $ from "jquery";
  import {ajaxRequest, formatDate, ajaxProxyRequest} from "../../util/base";

/*   import {
    Button,
    Table,
    TableColumn,
    Form,
    Row,
    Col,
    FormItem
  } from "element--ui";
  Vue.use(Button);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Row);
  Vue.use(Col); */

  export default {
    name: "assigment-dialog",
    props: {
      orderNo: {
        type: String,
      },
      callback: {
        type: Function,
        required: true
      },
      resetArrangeCallBack: {
        type: Function
      },
      isShow: {
        type: Boolean
      }
    },
    data() {
      return {
        form: {},
        departData: [],
        leaders: null,

        userData: [],
        driverData: [],
        drivers: null,
        planDate: null,
        rules: {}
      };
    },
    created() {
      this.getDepartData();
      this.getUserData();
    },
    mounted() {
      this.getArrangeData();//获取委托单信息
    },
    methods: {
      handleMessage(){
        ajaxRequest(
          "post",
          "back/arrange/noticeCustomer",
          {
            orderNo:this.orderNo,
          },
          res => {
            if (res.code === 200) {
              this.$message.success("通知成功");
            }else if (res.code === 300){
              this.$message.error(res.msg);
            }else{
              this.$message.error("通知失败");
            }
          }
        );
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
                this.form.leader = res.rows[0].id;
              } else {
                this.form.leader = null;
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
                this.form.driver = res.rows[0].id;
              } else {
                this.form.driver = null;
              }

            }
          }
        );
      },
      //获取委托单信息
      getArrangeData() {
        ajaxRequest(
          "get",
          "back/arrange/getArrangeByOrderNo",
          {
            orderNo: this.orderNo
          },
          res => {
            if (res.code === 200) {
              console.log(res.daoResult, 'daoResult');
              this.form = res.daoResult;
              //处理安排日期
              let array = [];
              if (this.form.allPlanTime != undefined && this.form.allPlanTime != null && this.form.allPlanTime != '') {
                array = this.form.allPlanTime.split(",");
              }
              this.form.allPlanTime = array;
            }
          }
        );
      },
      //修改
      handleSubmit() {
        if (this.form.isHaveNumber == 1) {
          this.$message.error('该任务已要号，不能修改');
          return false;
        } else {
          this.$refs.form.validate(valid => {
            if (valid) {
              this.callback(this.form);
            } else {
              return false;
            }
          })
        }
      },
      handleCancel() {
        this.callback(null);
      },
      //重新安排
      handleArrange() {
        this.resetArrangeCallBack(this.orderNo);
      },
    }
  };
</script>

<style scoped>
</style>
