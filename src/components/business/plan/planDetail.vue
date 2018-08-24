<template>
  <div>
    <div class="title-item" style="text-align: left;margin-bottom: 10px">
      <span style="width: 95%">客户信息</span>
      <span style="width: 5%">
          <global-tootips :width="600">
            <p>1、报检单转入的现场任务器具不能单个删除，若想删除，请进行整单删除操作；</p>
          </global-tootips>
          </span>
    </div>
    <PlanForm ref="planForm" :isAddNew="isAddNew" :callback="handleCustomerEditCallback"></planForm>
    <span slot="footer" class="dialog-footer">
    <div style="width: 100%;text-align: center">
      <el-button type="primary" @click="updateCustomer">保 存</el-button>
       <template>
         <el-tooltip content="若不存在已要号的器具，删除客户信息和所有的器具信息" placement="bottom" effect="light">
           <!--source='4'为外网转入-->
           <el-button type="warning" v-has="'M13915'" v-if="planData.source!='4'"
                      v-mindPopover="{message:'是否整单删除?',success:deleteAll.bind(this),isOpen:handleOpen.bind(this)}">整单删除</el-button>
         </el-tooltip>
       </template>
       <el-button @click="handleBack">返 回</el-button>
    </div>
    </span>
    <div class="title-item"><span>已安排委托单</span></div>
    <div>
      <el-table :data="orderList" :max-height="QJTableMaxHeight" style="width: 100%" @expand-change="rowExpand" >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <subTable :row="scope.row" :applianceList="applianceList" :getOrderApplianceList="getOrderApplianceList"
                      :handleEdit="handleEdit"
                      :rowsCondition='rowsCondition' :paramJson='paramJson'></subTable>
          </template>
        </el-table-column>
        <el-table-column label="委托单号" prop="orderNo">
        </el-table-column>
        <el-table-column label="计划时间" prop="allPlanTime">
        </el-table-column>
        <el-table-column label="带队人" prop="leaderName">
        </el-table-column>
        <el-table-column label="车辆" prop="vehicle">
        </el-table-column>
        <el-table-column label="司机" prop="driverName">
        </el-table-column>
        <el-table-column label="备注" prop="remark">
        </el-table-column>
        <el-table-column label="安排时间" prop="addTime" :formatter="formatterTime">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleOrderEdit(scope.row)">委托单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: center;margin-top: 10px" >
    <span slot="footer">
      <el-button type="primary" @click="handleEdit(null,false)">追加器具</el-button>
      <template>
         <el-tooltip content="对未安排的器具进行安排" placement="bottom" effect="light">
           <el-button v-if="notArrApplianceList.length>0" type="warning" @click="handleArrange()">安 排</el-button>
         </el-tooltip>
       </template>
    </span>
    </div>
    <div class="title-item"><span>未安排器具</span></div>
    <div>
      <el-table :data="notArrApplianceList" :max-height="QJTableMaxHeight" style="width: 100%">
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column label="器具名称" prop="applianceName" :formatter="handleApplianceName">
        </el-table-column>
        <el-table-column label="套数" prop="setNumber">
        </el-table-column>
        <el-table-column label="检测部门" prop="departName">
        </el-table-column>
        <el-table-column label="岗位" prop="postName">
        </el-table-column>
        <el-table-column label="规格型号" prop="model">
        </el-table-column>
        <el-table-column label="检测参数" prop="detectionParameter">
        </el-table-column>
        <el-table-column label="备注" prop="remark">
        </el-table-column>
        <el-table-column label="检测方式" prop="detectionMethod" :formatter="handleDetectionMethod">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleEdit(scope.row,false)">器具详情</el-button>
            <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)" v-if="scope.row.source!='9'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--器具详情弹窗-->
    <planApplianceEdit v-if="!!edit" :data="edit" :orderFlag="orderFlag"
                       :callback="handleApplianceEditCallback" :resetApplianceArrange="doApplianceReset"
                       :delOrderAppliance="delOrderAppliance"></planApplianceEdit>
    <!--委托单详情弹窗-->
    <AssigmentDialog v-if="!!AssigmentDialog" :isShow="arrangeFlag" :orderNo="AssigmentDialog"
                     :callback="handleOrderEditCallback" :resetArrangeCallBack="doArrangeReset"></AssigmentDialog>
    <!--器具安排弹窗-->
    <ArrangeDialog v-if="!!arrangeEdit" :quoInfo="quoInfo" :planData="planData" :planId="planId"
                   :callback="handelArrangeCallback"></ArrangeDialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import {ajaxRequest, formatDate,ajaxSyncRequest} from '../../util/base'
  import PlanForm from './PlanForm.vue'
  import planApplianceEdit from './planApplianceEdit.vue'
  import AssigmentDialog from './AssigmentDialog.vue';
  import vueBus from 'vue-bus'
  import $ from 'jquery'
  import ArrangeDialog from "./ArrangeDialog.vue";
  import paramJson from './applianceSearchJson';
  import subTable from './childTable.vue'

/*   import {Button,  Table, TableColumn, Container, Header} from 'element--ui'
  Vue.use(Button)
  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(Container)
  Vue.use(Header) */


  Vue.use(vueBus)
  const defaults = {}
  export default {
    name: 'plan-detail',
    props: {
      data: {
        type: Number
      },
    },
    data() {
      return {
        orderList: [],
        applianceList: [],
        notArrApplianceList: [],
        edit: null,
        arrangeEdit: null,
        AssigmentDialog: null,
        orderFlag: true,
        arrangeFlag: true,
        planId: 0,
        planData: {}, //器具信息
        quoInfo: {}, //报价单编号 报价单附件 报价单备注
        isAddNew: false,
        rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
        paramJson: paramJson, //同目录下json数据 常量
      }
    },
    components: {PlanForm, planApplianceEdit, AssigmentDialog, ArrangeDialog,subTable},
    methods: {
      //修改客户信息
      updateCustomer() {
        let _this = this;
        console.log(this.$refs.planForm.form, '修改后客户信息');
        var forms = this.$refs.planForm.form;
        forms.certificatePrintTime = forms.certificatePrintTime ? new Date(forms.certificatePrintTime).format('YYYY-MM-DD') : "";
        delete forms.updateTime;
        delete forms.addTime;

        ajaxRequest('put', 'back/plan/', forms, function (res) {
          if (res.code === 200) {
            _this.$message.success('编辑成功')
          }
          else {
            _this.$message.error('编辑失败')
          }
        }.bind(this))
      },
      handleSubmit() {

      },
      handleCustomerEditCallback(customerInfo) {//修改客户信息
        if (customerInfo) {
          var httpMethod//http请求方式
          if (!this.form.id || this.form.id == '') {//新增 注意:通过id是否存在来判断是新增还是编辑
            httpMethod = 'post'
          } else {//更新
            httpMethod = 'put'
          }
          ajaxRequest(httpMethod, 'back/plan/', this.form, (res) => {
            if (res.code == 200) {
              this.$message.success('编辑成功')
            }
          })
        } else {
          return false
        }
      },
      getCustomerInfo() {
        ajaxRequest('get', 'back/plan/' + this.$route.query.id, {}, res => {
          if (res.code === 200) {
            Vue.set(this.$refs.planForm, "form", res.daoResult);
            this.planData = res.daoResult;
            this.getQuoInfo(this.planData.quotationNo);
            this.planId = this.planData.id;
          }
        })
      },
      getOrderInfo() {
        ajaxRequest('get', 'back/plan/getArrangeOrderList', {
          planId: this.$route.query.id
        }, res => {
          if (res.code === 200) {
            console.log(res.rows, '委托单');
            this.orderList = res.rows;
          }
        })
      },
      rowExpand: function (row, rows) {

        ajaxRequest('get', 'back/plan/getApplianceListByOrderNo', {
          orderNo: row.orderNo
        }, res => {
          if (res.code === 200) {
            Vue.set(this.applianceList, row.orderNo, res.rows)
          }
        })
      },
      getOrderApplianceList (orderNo,sc) {
        //let orderNo = this.orderList[index].orderNo;
        console.log(orderNo,'getOrderApplianceList');
        ajaxRequest('get', 'back/plan/getApplianceListByOrderNo', {
          sc:sc,
          orderNo: orderNo
        }, (res) => {
          if (res.code === 200) {
            Vue.set(this.applianceList, orderNo, res.rows)
          }
        })
      },

      formatterTime: function (row, column) {
        return formatDate(row.addTime, 'YYYY-MM-DD');
      },
      handleOrderEdit(rowInfo) {
        console.log(rowInfo.orderNo, '委托单编号')
        this.AssigmentDialog = rowInfo.orderNo;
      },
      handleOrderEditCallback(data) {
        console.log(data, "委托单信息");
        if (data) {
          console.log(Array.from(new Set(data.allPlanTime)).toString());
          if (data.id) {
            ajaxRequest(
              "put",
              "back/arrange/",
              {
                id: data.id,
                orderNo: data.orderNo,
                isSelfarrange: data.isSelfarrange,
                allPlanTime: Array.from(new Set(data.allPlanTime)).toString(),
                leader: data.leader,
                driver: data.driver,
                vehicle: data.vehicle,
                remark: data.remark
              },
              res => {
                if (res.code == 200) {
                  /*this.$emit('refreshData');*/
                  this.getOrderInfo();
                  this.$message.success("编辑成功");
                }
              }
            );
            this.AssigmentDialog = null;
          }
        } else {
          this.AssigmentDialog = null;
        }
        /*this.$emit('refreshData');*/
      },
      getApplianceList() {
        ajaxRequest('get', 'back/plan/getNotArrangeAppliance', {
          planId: this.$route.query.id
        }, res => {
          console.log(res.code)
          if (res.code === 200) {
            console.log(res.rows, '未安排器具')
            this.notArrApplianceList = res.rows;
          }
        })
      },
      //未安排器具弹窗
      handleEdit(rowInfo, demo) {
        this.orderFlag = demo;
        console.log(rowInfo);
        this.edit = rowInfo || {};
      },
      //关闭 未安排器具 弹窗
      handleApplianceEditCallback(rowInfo) {
        let _this = this;
        if (rowInfo) {
          delete rowInfo.startTime;
          delete rowInfo.finishDate;
          delete rowInfo.certificatePrintTime;
          //加急等级
          rowInfo.isUrgent = rowInfo.urgentDayPercent.split("@@")[0];
          //加急比例
          rowInfo.urgentProportions = rowInfo.urgentDayPercent.split("@@")[1];
          console.log(rowInfo, '关闭器具弹窗');
          if (rowInfo.id) {//修改
            ajaxRequest('put', 'back/planAppliance/', rowInfo, function (res) {
              if (res.code === 200) {
                _this.$message.success('编辑成功');
                _this.edit = null;
                //刷新列表
                _this.getOrderInfo();
                _this.getApplianceList();
              }
              else {
                _this.$message.error('编辑失败');
              }
            });
          } else {//新增
            rowInfo.planId = this.$route.query.id;
            ajaxRequest('post', 'back/planAppliance/', rowInfo, function (res) {
              if (res.code === 200) {
                _this.$message.success('编辑成功');
                _this.edit = null;
                //刷新列表
                _this.getApplianceList();
              }
              else {
                _this.$message.error('编辑失败');
              }
            })
          }
        } else {
          _this.getApplianceList();
          _this.edit = null
        }
      },
      handleArrange() {
        this.arrangeEdit = {};
      },
      handleDelete(data) {
        //报价单器具不能单个删除
        console.log(data, '删除器具');
        if (this.planData.quotationNo != null ) {
          this.$message.error('报价单转过来的器具不能单个删除');
        }else{
          this.$confirm('是否确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ajaxRequest('delete', 'back/planAppliance/list/' + data.id, {}, function (res) {
              if (res.code === 200) {
                this.$message.success('删除成功');
                this.getApplianceList()
              } else {
                this.$message.error('删除失败')
              }
            }.bind(this))
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      //重新安排任务
      doArrangeReset(data) {
        if (data) {
          this.$confirm('是否确认重新安排?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ajaxRequest('put', 'back/planAppliance/resetOrder', {orderNo: data}, function (res) {
              if (res.code === 200) {
                this.$message.success('重新安排成功');
                //刷新
                this.getOrderInfo();
                this.getApplianceList();
                //关闭弹窗
                this.AssigmentDialog = null;
              } else if (res.code === 300) {//委托单下存在已要号的器具
                this.$message.error(res.msg);
              } else {
                this.$message.error('操作失败');
              }
            }.bind(this))
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消重新安排'
            })
          })
        } else {
          this.$message.success('操作失败');
        }
      },
      //重新安排器具
      doApplianceReset(data) {
        if (data) {
          this.$confirm('是否确认重新安排?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ajaxRequest('put', 'back/planAppliance/resetAppliance', {
              id: data.id,
              orderNo: data.orderNo
            }, function (res) {
              if (res.code === 200) {
                this.$message.success('重新安排成功');
                //刷新
                this.getOrderInfo();
                this.getApplianceList();
                //关闭弹窗
                this.edit = null;
              } else if (res.code === 300) {//器具已要号
                this.$message.error(res.msg);
              } else {
                this.$message.error('操作失败');
              }
            }.bind(this))
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消重新安排'
            })
          })
        } else {
          this.$message.success('操作失败');
        }
      },
      //删除委托单下器具
      delOrderAppliance(data) {
        if (data) {
          if (this.planData.quotationNo != null || this.planData.quotationNo != "") {
            this.$message.error('报价单转过来的器具不能单个删除');
          }else{
            this.$confirm('是否确认删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              ajaxRequest('put', 'back/planAppliance/deleteApplianceInOrder', {
                id: data.id,
                orderNo: data.orderNo,
                planId: data.planId
              }, function (res) {
                if (res.code === 200) {
                  this.$message.success('删除成功');
                  //刷新
                  this.getOrderInfo();
                  this.getApplianceList();
                  //关闭弹窗
                  this.edit = null;
                } else if (res.code === 300) {//器具已要号
                  this.$message.error(res.msg);
                } else {
                  this.$message.error('操作失败');
                }
              }.bind(this))
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          }
        } else {
          this.$message.success('操作失败');
        }
      },
      handleBack() {
        this.$router.push({
          path: '/admin/146',
        })
      },

      //根据报价单编号获取报价单 附件 备注
      getQuoInfo(quotationNo) {
        ajaxRequest(
          "get",
          "back/plan/getQuoInfoByQuoNo",
          {
            quotationNo: quotationNo
          },
          res => {
            if (res.code === 200) {
              this.quoInfo = res.daoResult;
            }
          }
        );
      },
      handelArrangeCallback() {
        this.getOrderInfo();
        this.getApplianceList();
        this.arrangeEdit = null;
      },
      //整单删除校验
      handleOpen(){
        let _this = this;
        let flag = true;
        //判断是否存在已要号器具
        ajaxSyncRequest('get', 'back/planAppliance/countByCondit',
          {
            isHaveNumber:1,
            planId:this.planId,
          },
          function (res) {
            if(res.total >0){
              _this.$message.error("存在已要号器具，不能删除");
              flag =  false;
            }
        }.bind(this))
        return flag;
      },
      //整单删除
      deleteAll() {
        let _this = this;
        ajaxRequest('delete', 'back/plan/' + this.planId, {}, function (res) {
          if (res.code === 200) {
            //返回到查询列表页
            this.handleBack();
            _this.$message.success('操作成功');
          }
          else if (res.code === 300) {//存在已要号器具，不能删除
            _this.$message.error(res.msg);
          } else {
            _this.$message.error('操作失败');
          }
        }.bind(this))
      },

      handleDetectionMethod: function (row, column, cellValue) {
        if (cellValue == '0') {
          return "现场";
        } else if (cellValue == '1') {
          return "送检";
        } else if (cellValue == '2') {
          return "带回";
        }
      },
      handleApplianceName: function (row, column, cellValue) {
        console.log(row,column)
        return row.applianceActualName || row.applianceName;
      }
    },

    mounted() {
      this.getCustomerInfo()

    },
    created() {
      this.getOrderInfo();
      this.getApplianceList();
    },
  }
</script>

<style>
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

</style>
