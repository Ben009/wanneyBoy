<template>
  <div>
    <div style="margin-bottom: 10px" v-if="!isSubmit">
      <el-button type="primary" @click="historyPlanInspection">历史数据导入</el-button>
      <!--<el-button type="primary" @click="">单位台帐</el-button>-->
      <el-button type="primary" @click="handleFileUpload">EXCEL导入</el-button>
    </div>
    <div class="title-item"><span>客户信息</span></div>
    <PlanForm ref="planForm" :isAddNew="isAddNew" @focusCompanyName="focusCompanyName"
              :submitHidden="submitHidden"></planForm>
    <div class="title-item"><span>器具信息</span></div>
    <!--器具双表头组件-->
    <InstrumentInfo ref="instrumentinfo"
                    v-if="!demo"
                    :columnsInfo="columnsInfo"
                    :batchInfo="batchInfo"
                    :header="header"
                    :defaultList="defaultList"
                    :wtdInfo="wtdInfo"
                    :tableData="tableData"
                    :instrumentDelShow="instrumentDelShow"
                    :moduleFlag="1"
    ></InstrumentInfo>
    <br/>
    <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
      <el-button type="primary" v-show="!isSubmit" @click="handleSubmit">保 存</el-button>
      <el-button type="primary" v-show="isSubmit" @click="handleEntryAgain">继续录入</el-button>
      <el-button type="primary" v-show="isSubmit" @click="handleArrange">安排任务</el-button>
      <el-button type="warning" v-show="isSubmit" v-mindPopover="{message:'确认撤销?',success:handleRevoke.bind(this)}">撤销本次录入</el-button>
    </span>
    <!--器具安排弹窗-->
    <ArrangeDialog v-if="!!arrangeEdit" :quotationNo="quotationNo" :planData="planData" :planId="planId"
                   :callback="handelArrangeCallback"></ArrangeDialog>
    <!--Excel导入弹窗-->
    <fileUpload v-if="!!fileData" :callback="handlefileUploadCallback"></fileUpload>
    <!--历史数据弹窗-->
    <historyPlanInspection v-if="showHistoryPlanInspection" ref="historyPlanInspectionInfo"
                           :companyName="this.$refs.planForm.form.companyName"
                           :alreadyAddId="alreadyAddId"
                           :callback="handleHistoryPlanInspectionCallback"></historyPlanInspection>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'

  import {ajaxRequest, formatArrayToTree} from '../../util/base'
  import InstrumentInfo from './InstrumentInfo.vue'
  import PlanForm from './PlanForm.vue'
  import vueBus from 'vue-bus';
  import {header, defaultList, batchInfo, columnsInfo} from '@/json/tableJson';
  import ArrangeDialog from "./ArrangeDialog.vue";
  import historyPlanInspection from "./historyPlanInspection.vue";
  import fileUpload from "./fileUpload.vue";

  Vue.use(vueBus);
  // 回车焦点事件
  Vue.directive('focusNextOnEnter', {
    bind: function (el, {value}, vnode) {
      el.addEventListener('keyup', (ev) => {
        if (ev.keyCode === 13) {
          let nextInput = null;
          if (value.index == 1) {//委托单信息互跳
            nextInput = vnode.context.$refs[value.value]
          } else if (value.index == 2) {//委托单信息跳器具组件
            nextInput = vnode.context.$refs.instrumentinfo.$refs["form0"][0].$refs[value.value][0]
          } else if (value.index == 3) {//器具组件信息互跳
            nextInput = vnode.context.$refs[value.value][0]
          } else if (value.index == 4) {//器具组件跳委托单信息
            vnode.context.$emit('focusCompanyName');
            return;
          }

          if (nextInput && typeof nextInput.focus === 'function') {
            nextInput.focus()
            nextInput.select()
          }
        }
      })
    }
  });
  export default {
    name: 'planTable',
    data() {
      return {
        customerInfo: {},
        applianceList: [],
        isSubmit: false,//控制按钮显示
        demo: false,//器具组件刷新
        planId: 0,
        arrangeEdit: null,
        quoInfo: {},
        planData: {},
        quotationNo: 0,
        header: header,
        defaultList: defaultList,
        /*批量设置的信息*/
        batchInfo: batchInfo,
        /*更多表格的字段展示信息*/
        columnsInfo: columnsInfo,
        isAddNew: true,
        tableData: [],
        //控制器具添加、复制按钮是否显示
        instrumentAddCopyShow: '0',
        instrumentDelShow: '0',
        //控制保存后客户信息组件按钮显示
        submitHidden: true,
        cancelData: [],//撤回按钮点击后显示的器具信息
        cancelForm: {},//撤回按钮点击后显示的单位信息
        //历史数据要号
        showHistoryPlanInspection: false,
        //已经添加过的器具id
        alreadyAddId: "",
        //现场任务导入弹窗显示
        fileData: null,
      }
    },
    components: {PlanForm, InstrumentInfo, ArrangeDialog, historyPlanInspection, fileUpload},
    computed: {
      wtdInfo: function () {
        let obj = new Object();
        if (this.$refs.planForm) {
          obj.companyId = this.$refs.planForm.form.companyId;
        }
        obj.submitHidden = this.submitHidden ? 0 : 1;
        return obj;
      }
    },
    methods: {
      //历史数据要号按钮点击事件
      historyPlanInspection() {
        if (!this.$refs.planForm.$refs.companyName.value) {
          this.$message.error("请先输入委托单位！");
        } else {
          //过滤当前页面已选择的器具id
          this.alreadyAddId = "";
          let data = this.$refs.instrumentinfo.data;
          this.tableData = data;
          data.forEach((v, i) => {
            if (!!data[i].linkId && data[i].source == 6) {
              this.alreadyAddId += data[i].correlationId + ",";
            }
          });
          if (this.alreadyAddId) {
            this.alreadyAddId = this.alreadyAddId.substr(0, this.alreadyAddId.length - 1);
          }
          this.showHistoryPlanInspection = true;
        }
      },
      //历史数据要号回调方法
      handleHistoryPlanInspectionCallback(rowInfo) {
        this.showHistoryPlanInspection = false;
        if (rowInfo) {
          //加载器具列表
          if (this.tableData) {
            this.tableData = this.tableData.concat(rowInfo);
          } else {
            this.tableData = rowInfo;
          }
          //移出、移入刷新器具组件
          this.demo = true;
          // this.$nextTick(() => {
          this.demo = false;
          // });
        }
      },
      //委托单位输入框聚焦
      focusCompanyName() {
        // this.$refs.planForm.$refs.companyName.focus();
        this.$refs.planForm.focusCompanyName();
      },
      //保存
      handleSubmit() {
        this.$refs.planForm.$refs.form.validate((valid) => {
          if (valid) {
            let xc = 0, dh = 0;
            let data = this.$refs.instrumentinfo.data, errFlag = true;
            data.forEach((v, i) => {
              //v.addPerson = localStorage.getItem("userId");
              //是否认领
              v.isClaim = 0;
              //是否配号
              v.isHaveNumber = 0;
              v.isReturn = 0;
              //是否强检true-->1
              v.isCompulsoryVerify = v.isCompulsoryVerify ? '1' : '0';
              //加急等级
              v.isUrgent = v.urgentDayPercent.split("@@")[0];
              //加急比例
              v.urgentProportions = v.urgentDayPercent.split("@@")[1];
              //检测方式
              if (v.detectionMethod == '0') {
                xc++;
              } else if (v.detectionMethod == '2') {
                dh++;
              }
              let flag = this.$refs.instrumentinfo.$refs['form' + i][0].test();
              if (!flag) {
                errFlag = false;
              }
            });
            let _this = this;
            //客户信息
            this.customerInfo = this.$refs.planForm.form;
            this.cancelData = data;
            this.cancelForm = this.customerInfo;
            //套数合计
            this.customerInfo.totalSetNumber = this.$refs.instrumentinfo.setNumber;
            //检测方式
            if (xc > 0 && dh > 0) {
              this.customerInfo.detectionMethod = '现场/带回';
            } else if (xc > 0) {
              this.customerInfo.detectionMethod = '现场';
            } else if (dh > 0) {
              this.customerInfo.detectionMethod = '带回';
            }
            if (errFlag) {
              ajaxRequest('post', 'back/plan/', {
                customer: JSON.stringify(this.customerInfo),
                appliances: JSON.stringify(data)
              }, function (res) {
                if (res.code === 200) {
                  this.isSubmit = true;
                  this.planId = res.daoResult.id;
                  this.planData = res.daoResult;
                  this.quotationNo = res.daoResult.quotationNo;
                  this.submitHidden = false;
                  this.$refs.upFiles.loadAttacheIds(res.daoResult.attachment);
                  _this.$message.success('编辑成功');
                }
                else {
                  _this.$message.error('编辑失败');
                }
              }.bind(this))
            }
          } else {
            return false;
          }
        })
      },
      //重置表单
      handleEntryAgain() {
        this.$refs.planForm.$refs['form'].resetFields();
        this.isSubmit = false;
        this.submitHidden = true;
        this.demo = true;
        this.$nextTick(() => {
          this.demo = false;
        })
      },
      //撤销本次录入
      handleRevoke() {
        ajaxRequest('delete', 'back/plan/' + this.planId, {}, function (res) {
          if (res.code === 200) {
            this.$refs.planForm.form = this.cancelForm;
            this.tableData = this.cancelData;
            this.isSubmit = false;
            this.submitHidden = true;
            this.$message.success('操作成功');
          }
          else {
            this.$message.error('操作失败');
          }
        }.bind(this))
      },
      //任务安排
      handleArrange() {
        this.arrangeEdit = {};
      },
      //任务安排回调
      handelArrangeCallback() {
        this.handleEntryAgain();
        this.arrangeEdit = null;
      },
      //设置表单数据
      setFormData() {
        if (this.$route.params.obj && this.$route.params.obj.mergeXh) {
          this.instrumentDelShow = '1';//外网器具不可删除
          //外送报检转报价单
          ajaxRequest('get', 'back/olBooking/findMergeInfo', {xh: this.$route.params.obj.mergeXh, source: 1}, (res) => {
            let map = res.map;
            let wtdInfo = map.olBookingTotal;
            let companyInfo = map.company;
            Vue.set(this.$refs.planForm.form, 'onlineInspectionId', map.wsMergeZd.bjid);//报检单id
            Vue.set(this.$refs.planForm.form, 'onlineInspectionType', map.wsMergeZd.source);//报价来源
            Vue.set(this.$refs.planForm.form, 'source', "4");
            Vue.set(this.$refs.planForm.form, 'companyId', companyInfo.companyId ? companyInfo.companyId : wtdInfo.erpDwId);//单位id
            Vue.set(this.$refs.planForm.form, 'companyName', companyInfo.companyName ? companyInfo.companyName : wtdInfo.dwMc);//单位名称
            Vue.set(this.$refs.planForm.form, 'address', wtdInfo.dz ? wtdInfo.dz : companyInfo.address);//单位地址
            Vue.set(this.$refs.planForm.form, 'detectionSite', wtdInfo.dz ? wtdInfo.dz : companyInfo.address);//上门检测地址
            Vue.set(this.$refs.planForm.form, 'certificateCompanyName', wtdInfo.zsdw);//证书单位名称
            Vue.set(this.$refs.planForm.form, 'certificateCompanyAddress', wtdInfo.zsdz);//证书地址
            Vue.set(this.$refs.planForm.form, 'contacter', wtdInfo.lxr ? wtdInfo.lxr : companyInfo.contacter);//联系人
            Vue.set(this.$refs.planForm.form, 'telephone', wtdInfo.lxdh ? wtdInfo.lxdh : companyInfo.telephone);//联系电话

            if (companyInfo.administrativeArea) {
              Vue.set(this.$refs.planForm.form, 'administrativeArea', companyInfo.administrativeArea);//省市区
            }
            if (companyInfo.postCode) {
              Vue.set(this.$refs.planForm.form, 'postCode', companyInfo.postCode);//邮编
            }
            if (companyInfo.institutionalNature) {
              Vue.set(this.$refs.planForm.form, 'institutionalNature', companyInfo.institutionalNature);//机构性质
            }
            Vue.set(this.$refs.planForm.form, 'specialRequirement', wtdInfo.bz);//备注
            Vue.set(this.$refs.planForm.form, 'isConclusion', wtdInfo.fjrq);
            Vue.set(this.$refs.planForm.form, 'isRecheck', wtdInfo.jdjl);

            let rowInfo = [];
            let wsMergeDetailList = map.wsMergeZd.wsMergeDetailList;
            wsMergeDetailList.forEach((v, i) => {
              let object = new Object();
              object.linkId = wsMergeDetailList[i].qjidNew;
              object.source = 9;
              if (wsMergeDetailList[i].applianceId) {
                object.id = wsMergeDetailList[i].applianceId;
              }
              if (wsMergeDetailList[i].applianceName) {
                object.applianceName = wsMergeDetailList[i].applianceName;
              }
              object.applianceActualName = wsMergeDetailList[i].qjmcNew;
              if (wsMergeDetailList[i].departId) {
                object.departId = wsMergeDetailList[i].departId;
              }
              if (wsMergeDetailList[i].postId) {
                object.postId = wsMergeDetailList[i].postId;
              }
              object.isCompulsoryVerify = wtdInfo.source === "1" ? true : false;
              object.applianceUse = wsMergeDetailList[i].applianceUse;
              if (object.applianceUse && object.applianceUse.indexOf(',') != -1) {
                object.applianceUse = object.applianceUse.split(',')[0];
              }
              object.certificateType = wsMergeDetailList[i].applianceCertificateType;
              object.model = wsMergeDetailList[i].xhggNew;
              object.equipmentNo = wsMergeDetailList[i].sbbhNew;
              object.manufacturer = wsMergeDetailList[i].zzcsNew;
              object.factoryNo = wsMergeDetailList[i].ccbhNew;
              object.urgentDayPercent = "0@@0";
              object.isUrgent = "0";
              object.urgentProportions = "0";
              object.subcontractArea = "0";
              object.setNumber = wsMergeDetailList[i].tsNew;
              object.pieceNumber = wsMergeDetailList[i].jsNew;
              object.certificateNumber = wsMergeDetailList[i].tsNew;
              object.remark = wsMergeDetailList[i].bzNew;//备注
              object.detectionMethod = "0";
              rowInfo.push(object)
            });
            this.tableData = rowInfo;
            //移出、移入刷新器具组件
            this.demo = true;
            this.$nextTick(() => {
              this.demo = false;
            });
          });
        } else {
          Vue.set(this.$refs.planForm.form, 'isConclusion', '0');
          Vue.set(this.$refs.planForm.form, 'isRecheck', '0');
        }
      },
      //上传
      handleFileUpload() {
        this.fileData = {}
      },
      //上传回调
      handlefileUploadCallback(rowInfo) {
        this.fileData = null;
        if (rowInfo) {
          //加载器具列表
          if (this.tableData) {
            this.tableData = this.tableData.concat(rowInfo);
          } else {
            this.tableData = rowInfo;
          }
          //移出、移入刷新器具组件
          this.demo = true;
          // this.$nextTick(() => {
          this.demo = false;
          // });
        }
      },
    },
    mounted() {
      //设置表单数据
      this.setFormData();
      //委托单位input聚焦
      this.focusCompanyName();
    }
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
