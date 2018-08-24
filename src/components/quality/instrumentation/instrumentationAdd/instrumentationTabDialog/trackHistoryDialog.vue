<template>
    <div>
        <mind-dialog title="查看详情" :visible="true" v-dialogDrag center dialogSize="large" @close="cancel"> 
            <div class="formContent">
                <el-form ref="form" :model="form"  label-width="130px">
                    <el-Row>
                    <el-col :span="12" >
                        <el-form-item label="设备名称" prop="instrumentationName">
                        <el-input v-model="form.instrumentationName" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" >
                        <el-form-item label="设备名称(英)" prop="instrumentationNameE">
                        <template slot="label">
                            <span>设备名称(英)</span>
                            <el-tooltip class="item special" effect="dark" content="本字段用于中英文对照证，若无此需求可不维护">
                            <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="form.instrumentationNameE" ></el-input>
                        </el-form-item>
                    </el-col>
                    </el-Row>
                    <el-Row>
                    <el-col :span="12" >
                        <el-form-item label="型号规格" prop="model">
                        <el-input v-model="form.model" v-if="!form.model" clearable ></el-input>
                        <el-popover
                        v-if="form.model"
                        popper-class="baseDetaildark"
                        placement="bottom-start"
                        :visible-arrow="false"
                        trigger="hover">
                        <div v-html="form.model"></div>
                        <el-input ref="model" slot="reference" v-model="form.model" clearable ></el-input>
                        </el-popover>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item prop="mearsuringRange">
                        <template slot = "label">
                            <span>测量范围</span>
                        </template>
                        <el-input v-model="form.mearsuringRange" v-if="!form.mearsuringRange" clearable ></el-input>
                        <el-popover
                        v-if="form.mearsuringRange"
                        popper-class="baseDetaildark"
                        placement="bottom-start"
                        :visible-arrow="false"
                        trigger="hover">
                        <div v-html="form.mearsuringRange"></div>
                        <el-input ref="mearsuringRange" slot="reference" v-model="form.mearsuringRange" clearable ></el-input>
                        </el-popover>
                        </el-form-item>
                    </el-col>
                    </el-Row>

                    <el-Row>
                    <el-col :span="6" >
                        <el-form-item label="出厂编号" prop="manufacturingCode">
                        <el-input v-model="form.manufacturingCode" clearable ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="制造厂家" prop="manufacturer">
                        <el-input v-model="form.manufacturer" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" >
                        <el-form-item label="设备编号" prop="deviceNumber">
                        <el-input v-model="form.deviceNumber" >
                            <!-- <template slot="append">
                            <span  @click="bulid" class="cursor" >自动生成</span>
                            </template> -->
                        </el-input>
                        </el-form-item>
                    </el-col>

                    <!-- <el-col :span="1" style="margin-top: 8px; margin-left: 1%; margin-right: 3.1%;">
                        <el-button type="primary" >自动生成</el-button>
                    </el-col> -->
                    <el-col :span="6">
                        <el-form-item label="使用条件" prop="servicesCondition">
                        <el-input v-model="form.servicesCondition" ></el-input>
                        </el-form-item>
                    </el-col>
                    </el-Row>
                    <el-Row>
                    <el-col :span="12">
                        <el-form-item prop="accuracyClass">
                        <template slot = "label">
                            <span>准确度等级</span>
                        </template>
                        <el-input v-model="form.accuracyClass" v-if="!form.accuracyClass" clearable ></el-input>
                        <el-popover
                        v-if="form.accuracyClass"
                        popper-class="baseDetaildark"
                        placement="bottom-start"
                        :visible-arrow="false"
                        trigger="hover">
                        <div v-html="form.accuracyClass"></div>
                        <el-input ref="accuracyClass" slot="reference" v-model="form.accuracyClass" clearable ></el-input>
                        </el-popover>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6" >
                        <el-form-item label="所属部门" prop="department">
                        <mind-select :options="depart" 
                                        :optionsConfig="{label:'departName',value:'id'}"
                                        v-model="form.department"
                                        :changeCallback="changeDepartEvt"
                                        class="selectFull"></mind-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="保管人" prop="keeper">
                        <mind-select :options="departs"
                                        :optionsConfig="{label:'userName',value:'id'}"
                                        v-model="form.keeper"
                                        class="selectFull" style="display:inline-block"></mind-select>
                        <!-- <template>
                        <el-tooltip  content="仅可保存保管人；通常情况是部门自己维护保管人" placement="bottom" effect="light">
                            <el-button v-if="standardId" type="primary" @click="singleSave" style="position: relative;top: -1px;" v-has="'M25715'">保存</el-button>
                        </el-tooltip>
                        </template> -->
                        </el-form-item>
                    </el-col>
                    </el-Row>
                    <el-row>
                    <el-col :span="24" >
                        <el-form-item prop="accuracyClassE">
                        <template slot = "label">
                            <span>准确度等级(英)</span>
                            <el-tooltip class="item special" effect="dark" content="本字段用于中英文对照证，若无此需求可不维护">
                            <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="form.accuracyClassE" v-if="!form.accuracyClassE" ></el-input>
                        <el-popover
                        v-if="form.accuracyClassE"
                        popper-class="baseDetaildark"
                        placement="bottom-start"
                        :visible-arrow="false"
                        trigger="hover">
                        <div v-html="form.accuracyClassE"></div>
                        <el-input ref="accuracyClassE" slot="reference" v-model="form.accuracyClassE" clearable ></el-input>
                        </el-popover>
                        </el-form-item>
                    </el-col>
                    </el-row>

                    <el-Row>
                    <el-col :span="8" style="width:50%;">
                        <el-form-item label="购入单位" prop="supplier">
                        <el-input v-model="form.supplier" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="width:50%;">
                        <el-form-item label="单位" prop="unit">
                        <el-input v-model="form.unit" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="25">
                        <el-form-item label="购入日期" prop="purchaseDate">
                        <el-date-picker
                            
                            v-model="form.purchaseDate"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd" style="width:100%;">
                        </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="25">
                        <el-form-item label="数量" prop="quantity">
                        <el-input v-model="form.quantity" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="25">
                        <el-form-item label="金额" prop="money">
                        <el-input v-model="form.money" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="25">
                        <el-form-item label="发票号" prop="invoice">
                        <el-input v-model="form.invoice" ></el-input>
                        </el-form-item>
                    </el-col>
                    </el-Row>

                    <el-Row>
                    <el-col :span="25">
                        <el-form-item label="存放地点" prop="location">
                        <el-input v-model="form.location" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="25">
                        <el-form-item label="产权单位" prop="propertyUnit">
                        <el-input v-model="form.propertyUnit" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="25">
                        <el-form-item label="经办人" prop="operator">
                        <el-input v-model="form.operator" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="25">
                        <el-form-item label="验收人" prop="accepter">
                        <el-input v-model="form.accepter" ></el-input>
                        </el-form-item>
                    </el-col>
                    </el-Row>

                    <el-Row>
                        <el-col :span="25">
                        <el-form-item label="设备类别" prop="type">
                        <template slot = "label">
                            <span>设备类别</span>
                        </template>
                        <el-select v-model="form.type" placeholder="请选择" >
                            <el-option
                            v-for="item in type"
                            :key="item.code"
                            :label="item.remark"
                            :value="item.code*1">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="25">
                        <el-form-item label="设备类型" prop="modelType">
                        <template slot = "label">
                            <span>设备类型</span>
                        </template>
                        <el-select v-model="form.modelType" placeholder="请选择" >
                            <el-option
                            v-for="item in modeltype"
                            :key="item.code"
                            :label="item.remark"
                            :value="item.code*1">
                            </el-option>
                        </el-select>

                        </el-form-item>
                    </el-col>
                    <el-col :span="25">
                        <el-form-item  prop="status">
                        <template slot = "label">
                            <span>设备状态</span>
                            <el-tooltip class="item special" effect="dark" content="可在数据字典中进行维护">
                            <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-select v-model="form.status" placeholder="请选择" >
                            <el-option
                            v-for="item in deviceStatus"
                            :key="item.code"
                            :label="item.remark"
                            :value="item.code*1">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>


                        <el-col :span="25">
                        <el-form-item label="是否固定资产" prop="isAssets">
                        <el-radio-group v-model="form.isAssets" >
                        <el-radio label="0">否</el-radio>
                        <el-radio label="1">是</el-radio>
                        </el-radio-group>
                        </el-form-item>
                    </el-col>
                    </el-Row>

                    <el-Row>
                    <el-col :span="25">
                        <el-form-item label="资产编号" prop="assetsNo">
                        <el-input v-model="form.assetsNo" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="25">
                        <el-form-item label="确认方式" prop="confirmedWay">
                        <template slot="label">
                            <span>确认方式</span>
                        </template>
                        <el-select v-model="form.confirmedWay" placeholder="请选择" >
                            <el-option
                            v-for="item in confirmedWays"
                            :key="item.code"
                            :label="item.remark"
                            :value="item.code*1">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="25">
                        <el-form-item label="设备能力确认" prop="isCapacityConfirme">
                            <el-radio-group v-model="form.isCapacityConfirme" >
                            <el-radio label="0">否</el-radio>
                            <el-radio label="1">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                        <el-col :span="25">
                        <el-form-item label="是否标物/标样" prop="isSubjectMatter">
                        <el-radio-group v-model="form.isSubjectMatter" >
                        <el-radio label="0">否</el-radio>
                        <el-radio label="1">是</el-radio>
                        </el-radio-group>
                        </el-form-item>
                    </el-col>
                    </el-Row>

                    <el-Row>

                    <el-col :span="25">
                        <el-form-item label="所属认可项目号" prop="itemNo">
                        <el-input v-model="form.itemNo" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="25">
                        <el-form-item label="所属认可项目名称" prop="itemName">
                        <el-input v-model="form.itemName" ></el-input>
                        </el-form-item>
                    </el-col>
                        <el-col :span="25">
                        <el-form-item label="溯源方式" prop="traceWay">
                        <template slot="label">
                            <span>溯源方式</span>
                            <el-tooltip class="item special" effect="dark" content="可在数据字典进行维护">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                            <el-select v-model="form.traceWay" placeholder="请选择" >
                            <el-option
                                v-for="item in traceWays"
                                :key="item.code"
                                :label="item.remark"
                                :value="item.code*1">
                            </el-option>
                            </el-select>

                        </el-form-item>
                    </el-col>

                    <el-col :span="25">
                        <el-form-item label="是否授权使用" prop="isAuthorization">
                        <el-radio-group v-model="form.isAuthorization" >
                        <el-radio label="0">否</el-radio>
                        <el-radio label="1">是</el-radio>
                        </el-radio-group>
                        </el-form-item>
                    </el-col>
                    </el-Row>

                    <el-Row>
                    <el-col :span="25">
                        <el-form-item label="仪器说明书编号" prop="instructionsNo">
                        <el-input v-model="form.instructionsNo" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="25">
                        <el-form-item label="维护项目" prop="maintenanceItem">
                        <el-input v-model="form.maintenanceItem" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="25">
                        <el-form-item label="维护周期(月)" prop="maintenanceCycle">
                        <el-input v-model.number="form.maintenanceCycle" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="25">
                        <el-form-item label="是否监控使用记录" prop="isMonitorUse">
                        <el-radio-group v-model="form.isMonitorUse" >
                        <el-radio label="0">否</el-radio>
                        <el-radio label="1">是</el-radio>
                        </el-radio-group>
                        </el-form-item>
                    </el-col>

                    <el-col :span="25" style="width:50%;">
                        <el-form-item label="控制措施" prop="controlMeasures">
                        <el-input v-model="form.controlMeasures" ></el-input>
                        </el-form-item>
                    </el-col>
                    </el-Row>

                    <el-row>
                    <el-col :span="24">
                        <el-form-item prop="bz">
                        <template slot = "label">
                            <span>备注</span>
                        </template>
                        <el-input v-model="form.bz" ></el-input>
                        </el-form-item>
                    </el-col>

                        <el-col :span="16" >
                        <el-form-item label="说明书" prop="instrumentationDescs">
                        <mind-upload ref="upload" :multiple="false" :callBack="callBack" :attachIds="form.attachment" ></mind-upload>
                    </el-form-item>
                </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer">
                <el-button  @click="cancel">取消</el-button>
            </div>
        </mind-dialog>
    </div>
</template>
<script>
import $ from "jquery";
import { ajaxRequest,ajaxProxyRequest } from '../../../../util/base';
export default {
  name: "trackHistoryDialog",
  props: {
    info: {
      // required:true,
    },
    cb: {
      type: Function
      // required:true,
    }
  },
  data() {
    return {
      form: {},
      confirmedWays: [], //确认方式
      departs: [], //保管人
      depart: [], //所属部门
      traceWays: [], //溯源方式
      deviceStatus: [], //设备状态
      type: [], //设备类别
      modeltype: [], //设备类型
    };
  },
  mounted() {
    console.log(this.info, "传入info");
    this.initData();
    this.getInfo(this.info.instrumentationId);

  },
  methods: {
    cancel() {
      this.cb();
    },
        // 初始化加载数据
    initData() {
      //确认方式
      ajaxProxyRequest("get", "/njmind/findParam/confirmedWay", {}, res => {
        this.confirmedWays = res.list;
      });
      //获取设备状态
      ajaxProxyRequest(
        "get",
        "/njmind/findParam/instrumentationStatus",
        {},
        res => {
          this.deviceStatus = res.list;
        }
      );
      //获取溯源方式
      ajaxProxyRequest(
        "get",
        "/njmind/findParam/instrumentationtraceWay",
        {},
        res => {
          this.traceWays = res.list;
        }
      );
      // //获取设备类别
      ajaxProxyRequest(
        "get",
        "/njmind/findParam/instrumentationtype",
        {},
        res => {
          this.type = res.list;
        }
      );
      // //获取设备类型
      ajaxProxyRequest(
        "get",
        "/njmind/findParam/instrumentationmodelType",
        {},
        res => {
          this.modeltype = res.list;
        }
      );
    },
    callBack(file,fileList){
        console.log(file,fileList,'file信息')
    },
    //获取所属部门
    changeDepartEvt() {
      ajaxRequest("get","back/user/listUserByDeptId/" + this.form.department, {},res => {
          this.departs = res.rows;
        }
      );
      this.$set(this.form, "keeper", "");
    },
    getInfo(id) {
      ajaxRequest("get", "back/instrumentation/" + id, {}, res => {
        if (res.code === 200) {
          this.form = res.daoResult;
          if (this.form.department) {
            ajaxRequest(
              "get",
              "back/user/listUserByDeptId/" + this.form.department,
              {},
              res => {
                this.departs = res.rows;
              }
            );
          }
        //   if (res.daoResult.instrumentationDescs) {
        //     this.$refs.upload.loadAttacheIds(
        //       res.daoResult.instrumentationDescs
        //     );
        //   }
          // if (res.daoResult.picPath) {
          //   this.$refs.upImage.loadAttacheIds(res.daoResult.picPath);
          // }
        }
      });
    },
  }
};
</script>
<style scoped>
.formContent{
    pointer-events: none;
}
</style>

