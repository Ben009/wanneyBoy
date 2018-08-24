<!-- 器具信息tab页-->
<template>
  <div>
    <div style="margin-bottom: 10px" v-if="!editFlag">
      <el-button type="primary small" @click="historyImport">历史数据导入</el-button>
      <!--  TODO 未开发，暂时注释  -->
      <!--<el-button type="primary small" @click="">单位台帐</el-button>-->
      <!--<el-button type="primary small" @click="">EXCEL导入</el-button>-->
    </div>

    <div class="baseDetail title-item flex mb20">
      <span class="flex-one">费用信息</span>
      <global-tootips style="float: right">
        <p>1、系统依据不可计量器具库维护的信息设置是否允许打折；</p>
        <p>2、单价从计量器具库中默认带入，禁止修改；</p>
        <p>3、系统依据：单价*套数*件套生成检测费；</p>
        <p>4、有权限人员可修改折后单价，系统将自动计算折扣，无权限人员仅可通过打折进行折扣单价的申请；</p>
        <p>5、小数位用于报价器具的价格至分、角、元，系统通过控制折后单价的小数位进行计算；</p>
        <p>6、通过EXCEL导入的报价器具，系统将通过器具名称与计量器具库中器具名称、器具别名进行匹配，若匹配成功系统将自动带入器具名称，匹配不成功需人工匹配；</p>
        <p>7、选择器具名称后，系统将默认带入器具实际名称、型号规格、检测参数、检测部门等字段的值，在相应字段已有内容的情况下，通过计量器具重新选择计量器具库时不再带入计量器具库中的默认值；</p>
        <p>8、历史数据导入指您可历史该单位过往在本机构检测的器具进行报价；</p>
        <p>9、单位台账指您可使用该委托单位库中维护的单位台账器具进行报价；</p>
        <p>10、加急费、现场服务费可通过数据字典进行维护不同的加急类型与现场检测费收取比例；</p>
        <p>11、系统支持报价单三级折扣方式，如：0.9，0.8－0.9，0.8以下，即：针对0.9折以上，可直接生效，针对0.8－0.9、0.8以下按不同的权限范围进行审核。</p>
      </global-tootips>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="230px">
      <el-Row>
        <el-col :span="6">
          <el-form-item prop="beforeDiscountsTotal">
            <template slot="label">
              <span>检测费合计（折前/扣后/折扣）</span>
              <el-tooltip class="item" effect="dark" content="依据器具的单价、折后单价自动计算">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <span>{{form.beforeDiscountsTotals}}</span>
            <el-input v-model="form.id" v-show="show"></el-input>
            <span v-show="show">{{form.beforeDiscountsTotal}}</span>
            <span v-show="show">{{form.afterDiscountsTotal}}</span>
            <span v-show="show">{{form.totalDiscount}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="beforeDiscountedTotal">
            <template slot="label">
              <span>可打折总额（折前/折后/折率）</span>
              <el-tooltip class="item" effect="dark" content="依据计量器具库中设置为可打折的器具的单价、折后单价自动计算">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <span>{{form.beforeDiscountedTotals}}</span>
            <span v-show="show">{{form.beforeDiscountedTotal}}</span>
            <span v-show="show">{{form.afterDiscountedTotal}}</span>
            <span v-show="show">{{form.discountedDiscount}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="noDiscountTotal">
            <template slot="label">
              <span>不可打折总额</span>
              <el-tooltip class="item" effect="dark" content="依据计量器具库中不可打折的器具进行计算">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <span>{{form.noDiscountTotal}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="decimals">
            <template slot="label">
              <span>小数位</span>
              <el-tooltip class="item" effect="dark" content="费用的最小单位为：元、角、分，通过折后单价控制">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-select placeholder="请选择" v-model="form.decimals" @change="setDecimals">
              <el-option
                v-for="item in decimalss"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-Row>

      <el-Row>
        <el-col :span="6">
          <el-form-item prop="urgentProportionsTemp">
            <template slot="label">
              <span>是否加急</span>
              <el-tooltip class="item" effect="dark" content="系统按照加急类型，以检测费*加急费比例进行计算">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-select
              ref="urgentDaysSelect"
              placeholder="请选择"
              v-model="form.urgentProportionsTemp"
              @change="setDecimals"
            >
              <el-option
                v-for="item in urgentDays"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="serviceCharge">
            <template slot="label">
              <span>现场服务费</span>
              <el-tooltip class="item" effect="dark" content="系统依据现场服务费类型，以检测费*比例进行计算">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-select
              placeholder="请选择"
              v-model="form.serviceCharge"
              @change="setDecimals"
            >
              <el-option
                v-for="item in serviceCharges"
                :key="item.pcode"
                :label="item.remark"
                :value="item.pcode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="邮寄费" prop="postage">
            <el-input v-model.number="form.postage" @change="setDecimals"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="交通费" prop="carFare">
            <el-input v-model.number="form.carFare" @change="setDecimals"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="报价合计" prop="totalCost">
            <span style="color: red">{{form.totalCost}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="报价记录数" prop="totalSize">
            <span style="color: red">{{totalSize}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item  prop="setNumberTotal">
            <template slot="label">
              <span>套数/（件/套）/证书数量/分包</span>
              <el-tooltip class="item" effect="dark" content="件/套合计为套数*件数的合计值">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <span>{{form.setNumberTotal}}/{{pieceNumber}}/{{certificateNumber}}/{{subcontractArea}}</span>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <!-- 打折 明细页时展示 -->
    <template v-if="editFlag">
      <el-form :inline="true" ref="zkInfo" :model="zkInfo" :rules="zkRules" label-width="230px">
        <el-form-item prop="zk">
          <template slot="label">
            <span>器具折扣</span>
            <el-tooltip class="item" effect="dark"
                        content="系统支持报价单三级折扣方式，如：9折，0.8－0.9，0.8以下，即：针对0.9折以上，可直接生效，针对0.8－0.9、0.8以下按不同的权限范围进行审核">
              <i class="el-icon-info ft12"></i>
            </el-tooltip>
          </template>
          <el-input v-model.number="zkInfo.zk"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="toDiscount">打折</el-button>
        </el-form-item>
      </el-form>
    </template>


    <!-- 操作按钮，明细显示 -->
    <div style="margin-bottom: 10px;display: block;text-align: center" v-if="editFlag">
      <el-button type="warning" @click="updateNewFlag" v-if="newFlag" v-show="newFlag">完成修改</el-button>
      <el-button type="primary" @click="toNew" v-has="'M7165'">生成新报价单</el-button>
      <el-button type="success" plain @click="printQuotation" >报价单打印</el-button>
      <el-button type="primary" @click="savePoints">保存</el-button>
      <el-button type="warning" @click="exportQuotation" v-has="'M7145'">导出</el-button>
    </div>

    <!-- 器具组件 -->
    <div class="title-item"><span>器具信息</span></div>
    <div style="min-height:450px" v-if="!editFlag">
      <InstrumentInfo ref="instrumentinfo"
                      v-if="!isRefresh"
                      :callback="handleApplianceEditCallback"
                      :columnsInfo="columnsInfo"
                      :batchInfo="batchInfo"
                      :header="header"
                      :defaultList="defaultList"
                      :tableData="tableData"
                      :wtdInfo="wtdInfo"
                      :quotationDecimals="quotationDecimals"
                      @sumTotalCharge="setDecimals"
                      @setDecimalsByAfter="setDecimalsByAfter"
      ></InstrumentInfo>
    </div>

    <!-- 器具明细列表 明细时显示 -->
    <QuotationApplianceList
      ref="applianceList"
      :quotationId="parseInt(quotationId)"
      @getPriceDetail="getPriceDetail"
      :auditFlag="parseInt(auditFlag)"
      v-if="editFlag">
    </QuotationApplianceList>
    <br>

    <!-- 现场要号、带回配号追加器具，存在时显示 -->
    <template v-if="editFlag">
      <additionalAppliance :quotationId="quotationId*1"></additionalAppliance>
    </template>

    <template v-if="editFlag">
      <el-button type="primary" size="mini" style="margin-top: 5px" @click="addAppliance">追加器具</el-button>
    </template>

    <span slot="footer" class="dialog-footer" style="display: block;  text-align: center;" v-if="!editFlag">
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
            <el-button @click="resetForm">清 空</el-button>
         </span>

    <!-- 添加更多 -->
    <addMoreAppliance v-if="!!addMoreFlag"
                      ref="addMoreAppliance"
                      :quotationId="quotationId*1"
                      :originalDecimals="originalDecimals"
                      :companyId="companyIdtemp"
                      :callback="handleEditCallback"
    >
    </addMoreAppliance>

    <!--  折扣申请（无权限） -->
    <applyDiscounts v-if="!!discountFlag"
                    :discount="discount"
                    :callback="applyDiscount"
                    :receivablePrice="receivablePrice"
                    :actualPrice="actualPrice"
    >
    </applyDiscounts>

    <!-- 历史数据导入页面 -->
    <QuotationHistoryImport v-if="this.companyName"
                            :companyName="companyName"
                            :callback="importHistory"
    >
    </QuotationHistoryImport>
  </div>

</template>

<script>

  import Vue from 'vue'
  import InstrumentInfo from './InstrumentInfo'
  import QuotationApplianceList from './QuotationApplianceList'
  import {header, defaultList, batchInfo, columnsInfo} from './tableJson'
  import applyDiscounts from './applyDiscounts';
  import QuotationApplianceEdit from './QuotationApplianceEdit'
  import addMoreAppliance from './addMoreAppliance';
  import additionalAppliance from './additionalAppliance'

  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest} from '../../util/base'

  var Big = require('big.js')
  // 引入jquery
  import $ from 'jquery'
  import QuotationHistoryImport from './QuotationHistoryImport'

  const defaults = {
    beforeDiscountsTotal: '0', // 报价总额折前
    afterDiscountsTotal: '0', // 报价总额折后
    totalDiscount: '0', // 报价单总额折扣率
    beforeDiscountedTotal: '0', // 可打折总额折前
    afterDiscountedTotal: '0', // 可打折总额折后
    discountedDiscount: '0', // 可打折总额折扣率
    noDiscountTotal: '0', // 不可打折总额

    setNumberTotal: 0, // 总数
    isUrgent: 0, // 加急
    totalCost: 0, // 总合计
    postage: 0, // 邮寄费
    carFare: 0,// 交通费,
    totalNums: 0,//总套数
  }

  export default {
    name: 'QuotationApplianceDetail',
    components: {
      InstrumentInfo,
      QuotationApplianceList,
      applyDiscounts,
      QuotationApplianceEdit,
      addMoreAppliance,
      additionalAppliance,
      QuotationHistoryImport
    },
    data() {
      let priceCheck= (rule, value, callback) => {
        let reg=/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        if(value){
          if (!reg.test(value)) {
            callback(new Error('价格格式不正确'));
          }else{
            callback()
          }
        }else{
          callback()
        }
      }

      return {
        form: $.extend({}, defaults, this.data || {}),
        bankAccounts: [],
        rules: {
          postage: [{required: true, message: '邮寄费不能为空'}, {validator:priceCheck}],
          carFare: [{required: true, message: '交通费不能为空'},  {validator:priceCheck}]
        },
        zkRules: {
          zk: [{type: 'number', message: '折扣必须为数字'}, {
            pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
            message: '折扣为正数且不能超过两位小数！'
          }]
        },
        certificateNumber:0,//证书数量
        subcontractArea:0,//分包数量
        totalSize:0,//报检条数
        pieceNumber:0,//报检总套/件 数

        tableData: [],
        urgentDays: [],
        serviceCharges: [],
        decimalss: [{name: '分', value: 2}, {name: '角', value: 1}, {name: '元', value: 0}],
        applianceList: [],
        show: false,
        quotationId: '',
        id: '',
        quotationDecimals: 2,
        originalDecimals: 2, // 数据库中存储的小数位，追加时判断此参数
        header: header,
        defaultList: defaultList,
        /*更多表格的字段展示信息*/
        columnsInfo: columnsInfo,
        /*批量设置的信息*/
        batchInfo: batchInfo,
        editFlag: false,
        zkInfo: {},
        addMoreFlag: false,
        dcCountLevel1: null, // 打折点1
        dcCountLevel2: null,// 打折点2,
        receivablePrice:0,  //应收价格
        actualPrice :0,   //实收价格
        discount: null,//实际折扣
        discountFlag: false,
        qjArr: [],//折扣申请的器具
        discountInfo: {},//打折的信息
        auditFlag: 0,
        companyIdtemp: null, //器具组件需要的单位ID
        companyName: null,//单位名称  历史数据导入需要的参数
        isRefresh: false,
        newFlag:false
      }
    },
    computed: {
      wtdInfo: function () {
        let obj = new Object();
        obj.companyId = this.companyIdtemp;
        return obj;
      }
    },
    props: {// 用于接收从父组件中传来的数据
      data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    mounted() {
      this.getIsUrgent()
      Vue.set(this.form, 'decimals', 2)
      this.getFormData()
    },
    methods: {
      /* 清空表单**/
      resetForm() {
        this.$refs.instrumentinfo.clearData();
        //默认值
        this.form.decimals = 2;
        this.form.urgentProportionsTemp = "0@@0";
        this.form.serviceCharge = "0";
        this.form.postage = "0.0";
        this.form.carFare = "0.0";
      },
      // 获取加急点/现场服务费/折扣点(数据字典维护)
      getIsUrgent() {
        ajaxProxyRequest('get', '/njmind/findParams/urgentDays$serviceCharge$dcCountLevel1$dcCountLevel2', {}, (res) => {
          this.urgentDays = res.urgentDays.list
          this.serviceCharges = res.serviceCharge.list
          this.dcCountLevel1 = res.dcCountLevel1.value
          this.dcCountLevel2 = res.dcCountLevel2.value
          Vue.set(this.form, 'urgentProportionsTemp', res.urgentDays.list[0].code)
          Vue.set(this.form, 'serviceCharge', res.serviceCharge.list[0].code)
        })
      },
      handleApplianceEditCallback(applianceList) { // 获取器具信息
        this.applianceUsedList = applianceList
      },
      handleSubmit() {
        let auditFlag = 0;
        let userId = localStorage.getItem('userId');
        let btnPower = localStorage.getItem('btnPower');
        let businessStaff = null;
        //判断是否是直接在器具页保存
        this.form.id = this.quotationId
        if (this.form.id == '') {
          this.$message.error('请先保存基本信息！')
          return
        }
        //判断是否有权限修改，无权限只能修改当前业务员的报价单
        ajaxSyncRequest('get', 'back/quotation/' + this.quotationId, {}, (res) => {
          auditFlag = res.daoResult.auditFlag;
          businessStaff = res.daoResult.businessStaff
        })

        //审核后，且没有高级权限，不可修改
        if (auditFlag == 1 && btnPower.indexOf('M7170')==-1) {
          this.$message.error('报价已审核,不可进行修改！')
          return;
        }
        if (userId != businessStaff && btnPower.indexOf('M7125') == -1) {
          this.$message.warning('无权限操作！');
          return;
        }

        let data = this.$refs.instrumentinfo.data, errFlag = true
        // 验证
        data.forEach((v, i) => {
          var flag = this.$refs.instrumentinfo.$refs['form' + i][0].test()
          if (!flag) {
            errFlag = false
          }
          v.isPlanned = 0;
          v.isDelete = 0;
          v.quotationId = this.quotationId// 报价单ID
          v.receivablesCost = new Big(v.unitPrice).mul(v.setNumber).mul(v.pieceNumber)// 应收费用
          try {
            v.discount = new Big(v.afterDiscountTotal).div(v.receivablesCost).toFixed(2)// 每个器具的折扣
          } catch (e) {
            v.discount = 0// 每个器具的折扣
          }
        })

        if (!errFlag) {
          return
        }
        this.form.urgentProportions = this.form.urgentProportionsTemp.split("@@")[1]// 加急比例
        this.form.isUrgent = this.form.urgentProportionsTemp.split("@@")[0]// 加急天数
        //判断是否为外网转报价
        if (this.$route.params.obj && this.$route.params.obj.mergeXh) {
          this.form.isOlbooking = 1;
        }
        ajaxSyncRequest('post', 'back/quotation/addQuotationAppliance', {
          quotation: JSON.stringify(this.form),
          appliances: JSON.stringify(data)
        }, res => {
          if (res.code === 200) {
            this.$message.success('新增成功')
            this.editFlag = true// 设置为明细模式
            this.getPriceDetail()
          } else {
            this.$message.error('新增失败')
          }
        })
      },
      // 截取小数
      setDecimalsPoint(num, point) {
        var num = parseFloat(num)
        if (isNaN(num)) {
          return 0
        }
        if (point == 1) {
          num = Math.floor(num * 10) / 10
        } else if (point == 2) {
          num = Math.floor(num * 100) / 100
        } else if (point == 0) {
          num = Math.floor(num)// 保留整数
          return parseFloat(num);
        }
        var s = num.toString()
        var rs = s.indexOf('.')
        if (rs < 0) {
          rs = s.length
          s += '.'
        }
        while (s.length <= rs + point) {
          s += '0'
        }
        return s;
      },
      // 设置小数位，计算合计
      setDecimals() {
        if (!this.editFlag) {
          let decimals = this.form.decimals
          let beforeDiscountsTotal = new Big(0)// 报价总额折前
          let afterDiscounts_total = new Big(0)// 报价总额折后
          let totalDiscount = new Big(0)// 报价单总额折扣率
          let beforeDiscountedTotal = new Big(0)// 可打折总额折前
          let afterDiscountedTotal = new Big(0)// 可打折总额折后
          let discountedDiscount = new Big(0)// 可打折总额折扣率
          let noDiscountTotal = new Big(0)// 不可打折总额
          let carFare = this.setDecimalsPoint(this.form.carFare, decimals)// 交通费
          let postage = this.setDecimalsPoint(this.form.postage, decimals)// 邮寄费
          this.form.carFare = carFare;
          this.form.postage = postage;
          if (isNaN(carFare)) {
            carFare = 0
          }
          if (isNaN(postage)) {
            postage = 0
          }
          let totalFee = new Big(0)// 总额

          if (this.$refs.instrumentinfo.data && this.$refs.instrumentinfo.data.length > 0) {
            this.$refs.instrumentinfo.data.forEach(val => {
              // 总价 = 截取小数位后的单价 * 套数 *件数
              let total = new Big(this.setDecimalsPoint(val.unitPrice, decimals)).mul(val.setNumber).mul(val.pieceNumber)
              let total1 = new Big(this.setDecimalsPoint(val.afterDiscountPrice, decimals)).mul(val.setNumber).mul(val.pieceNumber)
              Vue.set(val, 'afterDiscountTotal', total1 + '')

              // 总额折前（除去其他费用）
              beforeDiscountsTotal = beforeDiscountsTotal.add(total)
              afterDiscounts_total = afterDiscounts_total.add(total1)
              if (val.isDiscount == 1) { // 可打折的
                beforeDiscountedTotal = beforeDiscountedTotal.add(total)
                afterDiscountedTotal = afterDiscountedTotal.add(total1)
              }
              totalFee = totalFee.add(total1)
            })

            let urgentProportions = this.form.urgentProportionsTemp.split("@@")[1]// 加急点


            let jjf = totalFee.mul(urgentProportions).div(100)
            let serviceCharge = this.form.serviceCharge// 现场服务费
            let fwf = totalFee.mul(serviceCharge).div(100)
            totalFee = totalFee.add(carFare).add(postage).add(jjf).add(fwf)
            totalFee = this.setDecimalsPoint(totalFee, this.form.decimals)
          }

          try {
            totalDiscount = afterDiscounts_total.div(beforeDiscountsTotal).toFixed(2) // 报价单总额折扣率
          } catch (err) {
            totalDiscount = new Big(0) // 报价单总额折扣率
          }

          try {
            discountedDiscount = afterDiscountedTotal.div(beforeDiscountedTotal).toFixed(2)// 可打折的折扣率
          } catch (err) {
            discountedDiscount = new Big(0)// 可打折的折扣率
          }

          // 不可打折总额
          noDiscountTotal = beforeDiscountsTotal.minus(beforeDiscountedTotal)
          this.form.beforeDiscountsTotal = beforeDiscountsTotal + '';//折前
          this.form.afterDiscountsTotal = afterDiscounts_total + '';//折后
          this.form.totalDiscount = totalDiscount + '';//折扣

          this.form.beforeDiscountedTotal = beforeDiscountedTotal + '';//可打折折前
          this.form.afterDiscountedTotal = afterDiscountedTotal + '';//可打折折后
          this.form.discountedDiscount = discountedDiscount + '';//折扣

          this.form.beforeDiscountsTotals = beforeDiscountsTotal + '/' + afterDiscounts_total + '/' + totalDiscount;
          this.form.beforeDiscountedTotals = beforeDiscountedTotal + '/' + afterDiscountedTotal + '/' + discountedDiscount;
          this.form.noDiscountTotal = noDiscountTotal + '';//不可打折合计

          this.quotationDecimals = decimals;//小数位
          this.form.totalCost = this.setDecimalsPoint(totalFee, decimals) // 合计费用

          this.form.setNumberTotal = this.$refs.instrumentinfo.setNumber// 总套数
          this.certificateNumber = this.$refs.instrumentinfo.certificateNumber;//证书数量
          this.subcontractArea = this.$refs.instrumentinfo.subcontractArea;//分包数量
          this.totalSize = this.$refs.instrumentinfo.totalSize;//条数
          this.pieceNumber = this.$refs.instrumentinfo.pieceNumber;

        } else {
          var afterTotalSum = new Big(0)       // 总额 - 折后
          var receivablesCost = new Big(0)     // 总额 - 折前
          var totalPoint = new Big(0)          // 总额 - 折扣率
          var afterDiscountedTotal = new Big(0)// 可打折 - 折后
          var beforeDiscountedTotal = new Big(0)// 可打折 - 折前
          var discountedDiscount = new Big(0)  // 可打折 - 折扣率
          var setNumber = new Big(0)
          var decimals = this.form.decimals;
          var carFare = this.setDecimalsPoint(this.form.carFare, decimals)// 交通费
          var postage = this.setDecimalsPoint(this.form.postage, decimals)// 邮寄费
          this.form.carFare = carFare;
          this.form.postage = postage;

          this.$refs.applianceList.tableData.forEach(val => {
            afterTotalSum = afterTotalSum.add(new Big(this.setDecimalsPoint(val.afterDiscountPrice, decimals)).mul(val.setNumber).mul(val.pieceNumber))// 折后总收
            receivablesCost = receivablesCost.add(val.receivablesCost)// 应收
            setNumber = setNumber.add(val.setNumber)
            if (val.isDiscount == '1') {
              afterDiscountedTotal = afterDiscountedTotal.add(val.afterDiscountTotal)
              beforeDiscountedTotal = beforeDiscountedTotal.add(val.receivablesCost)
            } else {
              afterDiscountedTotal = new Big(0);
              beforeDiscountedTotal = new Big(0);
            }
          })
          //this.form.setNumberTotal = setNumber.toString();//套数

          try {
            totalPoint = afterTotalSum.div(receivablesCost).toFixed(2)// 总额折扣率
          } catch (e) {
            totalPoint = new Big(0)// 总额折扣率
          }

          try {
            discountedDiscount = afterDiscountedTotal.div(beforeDiscountedTotal).toFixed(2)// 可打折折扣率
          } catch (e) {
            discountedDiscount = new Big(0)// 可打折折扣率
          }

          this.form.beforeDiscountsTotal = receivablesCost + ''// 报价总额折前
          this.form.afterDiscountsTotal = afterTotalSum + ''// 报价总额折后
          this.form.totalDiscount = totalPoint + ''// 报价总单折扣率

          this.form.beforeDiscountedTotal = beforeDiscountedTotal + ''// 可打折金额 折前
          this.form.afterDiscountedTotal = afterDiscountedTotal + ''// 可打折金额 折前
          this.form.discountedDiscount = discountedDiscount + ''// 可打折 - 折扣率

          this.form.beforeDiscountsTotals = receivablesCost + '/' + afterTotalSum + '/' + totalPoint
          this.form.beforeDiscountedTotals = beforeDiscountedTotal + '/' + afterDiscountedTotal + '/' + discountedDiscount
          this.form.noDiscountTotal = receivablesCost.minus(beforeDiscountedTotal) + ''// 不可打折金额

          let a = afterTotalSum.mul(this.form.serviceCharge).div(100).toFixed(2)
          let b = afterTotalSum.mul(this.form.urgentProportionsTemp.split("@@")[1]).div(100).toFixed(2)
          this.form.totalCost =
            this.setDecimalsPoint(afterTotalSum.add(this.form.carFare).add(this.form.postage).add(a).add(b), this.form.decimals)
        }
      },
      // 手动修改折后单价
      setDecimalsByAfter() {
        let decimals = this.form.decimals
        let beforeDiscountsTotal = new Big(0)// 报价总额折前
        let afterDiscounts_total = new Big(0)// 报价总额折后
        let totalDiscount = new Big(0)// 报价单总额折扣率
        let beforeDiscountedTotal = new Big(0)// 可打折总额折前
        let afterDiscountedTotal = new Big(0)// 可打折总额折后
        let discountedDiscount = new Big(0)// 可打折总额折扣率
        let noDiscountTotal = new Big(0)// 不可打折总额
        let carFare = this.setDecimalsPoint(this.form.carFare, decimals)// 交通费
        let postage = this.setDecimalsPoint(this.form.postage, decimals)// 邮寄费
        this.form.carFare = carFare;
        this.form.postage = postage;

        if (isNaN(carFare)) {
          carFare = 0
        }
        if (isNaN(postage)) {
          postage = 0
        }
        let totalFee = new Big(0)// 总额

        if (this.$refs.instrumentinfo.data && this.$refs.instrumentinfo.data.length > 0) {
          this.$refs.instrumentinfo.data.forEach(val => {
            // 总价 = 截取小数位后的单价 * 套数 *件数
            let total = new Big(this.setDecimalsPoint(val.unitPrice, decimals)).mul(val.setNumber).mul(val.pieceNumber)
            let total1 = new Big(this.setDecimalsPoint(val.afterDiscountPrice, decimals)).mul(val.setNumber).mul(val.pieceNumber)
            Vue.set(val, 'afterDiscountTotal', total1 + '')

            // 总额折前（除去其他费用）
            beforeDiscountsTotal = beforeDiscountsTotal.add(total)
            afterDiscounts_total = afterDiscounts_total.add(total1)
            if (val.isDiscount == 1) { // 可打折的
              beforeDiscountedTotal = beforeDiscountedTotal.add(total)
              afterDiscountedTotal = afterDiscountedTotal.add(total1)
            }
            totalFee = totalFee.add(total1)
          })
          let urgentProportions = this.form.urgentProportionsTemp.split("@@")[1];// 加急点
          let jjf = totalFee.mul(urgentProportions).div(100);
          let serviceCharge = this.form.serviceCharge;// 现场服务费
          let fwf = totalFee.mul(serviceCharge).div(100);
          totalFee = totalFee.add(carFare).add(postage).add(jjf).add(fwf);
          totalFee = this.setDecimalsPoint(totalFee, this.form.decimals);
        }
        try {
          totalDiscount = afterDiscounts_total.div(beforeDiscountsTotal).toFixed(2); // 报价单总额折扣率
        } catch (err) {
          totalDiscount = new Big(0) // 报价单总额折扣率
        }

        try {
          discountedDiscount = afterDiscountedTotal.div(beforeDiscountedTotal).toFixed(2)// 可打折的折扣率
        } catch (err) {
          discountedDiscount = new Big(0)// 可打折的折扣率
        }

        // 不可打折总额
        noDiscountTotal = beforeDiscountsTotal.minus(beforeDiscountedTotal)
        this.form.beforeDiscountsTotal = beforeDiscountsTotal + ''
        this.form.afterDiscountsTotal = afterDiscounts_total + ''
        this.form.totalDiscount = totalDiscount + ''

        this.form.beforeDiscountedTotal = beforeDiscountedTotal + ''
        this.form.afterDiscountedTotal = afterDiscountedTotal + ''
        this.form.discountedDiscount = discountedDiscount + ''

        this.form.beforeDiscountsTotals = beforeDiscountsTotal + '/' + afterDiscounts_total + '/' + totalDiscount
        this.form.beforeDiscountedTotals = beforeDiscountedTotal + '/' + afterDiscountedTotal + '/' + discountedDiscount
        this.form.noDiscountTotal = noDiscountTotal + ''

        this.quotationDecimals = decimals
        this.form.totalCost = this.setDecimalsPoint(totalFee, decimals) // 合计费用
        this.form.setNumberTotal = this.$refs.instrumentinfo.setNumber// 总数
      },
      // 获取价格明细
      getPriceDetail() {
        if (this.quotationId) {
          ajaxRequest('get', 'back/quotation/' + this.quotationId, {}, (res) => {
            this.auditFlag = res.daoResult.auditFlag;
            this.form.postage = res.daoResult.postage
            this.form.carFare = res.daoResult.carFare
            Vue.set(this.form, 'urgentProportionsTemp', res.daoResult.isUrgent + "@@" + res.daoResult.urgentProportions);
            Vue.set(this.form, 'serviceCharge', res.daoResult.serviceCharge + '')
            Vue.set(this.form, 'decimals', parseInt(res.daoResult.decimals))

            let beforeDiscountsTotal = res.daoResult.beforeDiscountsTotal// 报价总额折前
            let afterDiscountsTotal = res.daoResult.afterDiscountsTotal// 报价总额折后
            let totalDiscount = res.daoResult.totalDiscount// 报价单总额折扣率

            let beforeDiscountedTotal = res.daoResult.beforeDiscountedTotal// 可打折总额折前
            let afterDiscountedTotal = res.daoResult.afterDiscountedTotal// 可打折总额折后
            let discountedDiscount = res.daoResult.discountedDiscount// 可打折总额折扣率
            let noDiscountTotal = res.daoResult.noDiscountTotal// 不可打折总额


            let totalCost = this.setDecimalsPoint(res.daoResult.totalCost, parseInt(res.daoResult.decimals))// 总额
            this.form.totalCost = totalCost
            this.form.beforeDiscountsTotal = beforeDiscountsTotal
            this.form.afterDiscountsTotal = afterDiscountsTotal
            this.form.totalDiscount = totalDiscount
            this.form.beforeDiscountedTotal = beforeDiscountedTotal
            this.form.afterDiscountedTotal = afterDiscountedTotal
            this.form.discountedDiscount = discountedDiscount
            this.form.noDiscountTotal = noDiscountTotal
            this.form.beforeDiscountsTotals = beforeDiscountsTotal + '/' + afterDiscountsTotal + '/' + totalDiscount
            this.form.beforeDiscountedTotals = beforeDiscountedTotal + '/' + afterDiscountedTotal + '/' + discountedDiscount

            this.form.setNumberTotal = res.daoResult.totalNum;
            this.certificateNumber = res.daoResult.certificateNumber;//证书数量
            this.subcontractArea = res.daoResult.subcontractNumber;//分包数量
            this.totalSize = res.daoResult.total;//报检条数
            this.pieceNumber = parseInt(res.daoResult.pieceNumber);//报检总套/件 数

            this.newFlag = res.daoResult.newFlag == 1;

          })
        }
      },
      getFormData() {
        // 获取表单状态，判断为编辑页面还是录入页面
        if (this.quotationId && this.$route.query.id) {
          this.editFlag = true
          // 计算合计
          this.getPriceDetail()
        } else {
          //获取外网器具数据
          this.getOlbooking();
        }
      },
      // 保存小数位
      savePoints() {
        let userId = localStorage.getItem('userId');
        let btnPower = localStorage.getItem('btnPower');
        let businessStaff = null;
        let auditFlag = 0;

        //判断是否有权限修改，无权限只能修改当前业务员的报价单
        ajaxSyncRequest('get', 'back/quotation/' + this.quotationId, {}, (res) => {
          businessStaff = res.daoResult.businessStaff
          auditFlag = res.daoResult.auditFlag;
        })

        //审核后，且没有高级权限，不可修改
        if (auditFlag == 1 && btnPower.indexOf('M7170')==-1) {
          this.$message.error('报价已审核,不可进行修改！')
          return;
        }

        if (userId != businessStaff && btnPower.indexOf('M7125') == -1) {
          this.$message.warning('无权限操作！');
          return;
        }

        let quotationObj = new Object()
        quotationObj.postage = this.form.postage// 邮寄费
        quotationObj.carFare = this.form.carFare// 交通费
        quotationObj.urgentProportions = this.form.urgentProportionsTemp.split("@@")[1]// 加急比例
        quotationObj.isUrgent = this.form.urgentProportionsTemp.split("@@")[0]// 加急天数
        quotationObj.serviceCharge = this.form.serviceCharge// 现场服务费
        quotationObj.decimals = this.form.decimals + ''// 小数位
        quotationObj.id = this.quotationId + ''// 报价单ID

        quotationObj.totalCost = this.form.totalCost// 总计
        quotationObj.afterDiscountsTotal = this.form.afterDiscountsTotal// 报价总额折后

        ajaxRequest('put', 'back/quotation/updateQuotationPoints', {quotationJson: JSON.stringify(quotationObj)}, res => {
          if (res.code === 200) {
            this.$message.success('修改成功')
            this.getPriceDetail()
          } else {
            this.$message.error('修改失败')
          }
        })
      },
      // 追加器具
      addAppliance() {
        //判断是否有权限修改，无权限只能修改当前业务员的报价单
        let userId = localStorage.getItem('userId');
        let btnPower = localStorage.getItem('btnPower');
        let businessStaff = null;
        let auditFlag = 0;
        ajaxSyncRequest('get', 'back/quotation/' + this.quotationId, {}, (res) => {
          businessStaff = res.daoResult.businessStaff
          this.originalDecimals = parseInt(res.daoResult.decimals)// 查询数据库中小数位，传递给追加的组件用
          this.companyIdtemp = parseInt(res.daoResult.companyId);
          auditFlag = res.daoResult.auditFlag;
        })
        if (userId != businessStaff && btnPower.indexOf('M7125') == -1) {
          this.$message.warning('无权限操作！');
          return;
        }
        if (auditFlag == 1) {
          this.$message.error('报价已审核,不可进行修改！')
          return;
        }
        this.addMoreFlag = true
      },

      // 查询数据库中小数位，传递给追加的组件用
      getOriginalDecimals() {
        ajaxRequest('get', 'back/quotation/' + this.quotationId, {}, (res) => {
          this.originalDecimals = parseInt(res.daoResult.decimals)
        })
      },
      // 追加器具回调事件
      handleEditCallback(data) {
        if (data) {
          ajaxRequest('post', 'back/quotationAppliance/addBatchQuotationAppliance', {quotationAppliance: JSON.stringify(data)}, res => {
            if (res.code === 200) {
              this.$message.success('新增成功')
              this.addMoreFlag = null
              this.$refs.applianceList.getTableData()
              this.getPriceDetail()
            } else {
              this.$message.error('新增失败')
            }
          })
        } else {
          this.addMoreFlag = null
        }
      },
      // 打折
      toDiscount() {
        let auditFlag = 0;
        ajaxSyncRequest('get', 'back/quotation/' + this.quotationId, {}, (res) => {
          auditFlag = res.daoResult.auditFlag;
        })

        if (auditFlag == 1) {
          this.$message.error('报价已审核,不可进行修改！')
          return;
        }
        this.getOriginalDecimals()// 获取保存的小数位
        let zk = this.zkInfo.zk// 折扣
        let multipleSelection = this.$refs.applianceList.multipleSelection// 选中的器具
        if (multipleSelection.length == 0) {
          this.$message.error('请选择需要打折的器具')
          return
        }

        // 验证
        let all = this.$refs.applianceList.tableData//所有器具
        let disabledDd = [].concat(all).filter((v) => {
          return v.isDiscount != '1'
        })//不可打折的器具
        let temp = [];

        //已选择的
        let undd = multipleSelection.map(v => {
          return v.id
        })

        // 已选择的 + 不可选择的
        disabledDd.forEach(v => {
          undd.push(v.id)
        })

        //得到未选择的
        all.forEach((v, i) => {
          if (undd.indexOf(v.id) == -1) {
            temp.push(v);
          }
        })


        let afterTotal = new Big(0);//折后费用
        let beforeTotal = new Big(0);//折前费用
        let qjArr = new Array()// 器具列表

        //查看是否有未审核的
        if (this.isInDiscount(this.quotationId) > 0) {
          this.$message.error('当前报价单存在未审核的折扣申请');
          return;
        }

        //验证
        this.$refs.zkInfo.validate((valid) => {
          if (valid) {
            //已选择打折的器具
            multipleSelection.forEach((v, i) => {
              let unitPrice = v.unitPrice;//单价
              let setNumber = v.setNumber;//套数
              let pieceNumber = v.pieceNumber;//件数
              let afterDiscountPrice = new Big(this.setDecimalsPoint(unitPrice, this.originalDecimals)).mul(zk).toFixed(2);//打完折后的单价
              let afterDiscountTotal = new Big(afterDiscountPrice).mul(setNumber).mul(pieceNumber);//检测费
              let receivablesCost = v.receivablesCost;//应收价格
              let discount = 0;//折扣
              try {
                discount = afterDiscountTotal.div(receivablesCost);
              } catch (e) {
                discount = 0;
              }
              afterTotal = afterTotal.add(afterDiscountTotal);//折后费用
              beforeTotal = beforeTotal.add(receivablesCost);
              let appliance = new Object();
              appliance.quotationApplianceId = v.id + '';
              appliance.afterDiscountPrice = afterDiscountPrice;
              appliance.afterDiscountTotal = afterDiscountTotal;
              appliance.receivablesCost = receivablesCost;
              appliance.discount = discount;
              qjArr.push(appliance);
            })

            this.qjArr = qjArr;

            //未打折的
            temp.forEach((v) => {
              afterTotal = afterTotal.add(v.afterDiscountTotal);//折后费用
              beforeTotal = beforeTotal.add(v.receivablesCost);//折前费用
            })

            //不可打折的
            disabledDd.forEach((v) => {
              afterTotal = afterTotal.add(v.receivablesCost);//折后费用
              beforeTotal = beforeTotal.add(v.receivablesCost);//折前费用
            })

            let discountInfo = new Object();
            discountInfo.beforeDiscountsTotal = beforeTotal;
            discountInfo.afterDiscountsTotal = afterTotal;
            this.discountInfo = discountInfo;

            let newPoint = afterTotal.div(beforeTotal).toFixed(2);//总单的折扣点
            this.receivablePrice = beforeTotal;
            this.actualPrice = afterTotal;
            //查看是否有打折的权限
            let zkFlag = this.judgeDiscount(newPoint);
            if (zkFlag) {
              //有权限，直接修改价格
              ajaxSyncRequest('put', 'back/quotation/updateAppPriceByPoint', {
                quotationJson: JSON.stringify(qjArr),
                quotationId: this.quotationId
              }, res => {
                if (res.code === 200) {
                  this.$message.success('折扣申请成功')
                  this.$refs.applianceList.getTableData();
                  this.getPriceDetail();
                } else {
                  this.$message.error('折扣申请失败')
                }
              })
            } else {
              //申请折扣
              this.discount = new Number(newPoint);
              this.discountFlag = true;
            }
          }
        })
      },
      //查看是否已经申请折扣
      isInDiscount(id) {
        let total = 0;
        ajaxSyncRequest('get', 'back/quotation/isInDiscount', {quotationId: id}, res => {
          total = res.total;
        })
        return total;
      },
      // 打折权限验证
      judgeDiscount(zk) {
        let flag = false;
        let btnPower = localStorage.getItem("btnPower");//拥有的权限
        if (btnPower.indexOf('M7115') != -1) {
          //报价高级权限,可以任何折扣
          flag = true;
        } else if (btnPower.indexOf('M7110') != -1 && this.dcCountLevel2 >= zk) {
          //报价中级权限，可以打 >=dcCountLevel2 折
          flag = true;
        } else if (btnPower.indexOf('M7105') != -1 && this.dcCountLevel1 >= zk) {
          //报价低级权限，可以打 >=dcCountLevel1 折
          flag = true;
        }
        return flag;
      },
      //无权限，申请折扣
      applyDiscount(data) {
        let _this = this;
        if (data) {
          data.quotationId = parseInt(this.quotationId);
          data.beforeDiscountsTotal = this.discountInfo.beforeDiscountsTotal;
          data.afterDiscountsTotal = this.discountInfo.afterDiscountsTotal;
          ajaxRequest('post', 'back/quotation/applyDiscount', {
            applyInfo: JSON.stringify(data),
            appliance: JSON.stringify(_this.qjArr)
          }, res => {
            if (res.code === 200) {
              this.$message.success('折扣申请发起成功')
              this.discountFlag = false;
            } else {
              this.$message.error('折扣申请发起失败')
              this.discountFlag = false;
            }
          })
        } else {
          this.discountFlag = false;
        }
      },
      //生成新的报价单
      toNew() {
        this.$confirm('确认生成新报价单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajaxRequest('post', 'back/quotation/forNew', {quotationId: this.quotationId}, (res) => {
            if (res.code === 200) {
              this.$message({type: 'success', message: '生成新报价单成功,报价单号：' + res.msg});
            }
          })
        }).catch(() => {
          // 取消操作
        })
      },
      //获取网上报检数据
      getOlbooking() {
        if (this.$route.params.obj && this.$route.params.obj.mergeXh) {
          let olAppliances = [];//外网报检的器具
          let wsMergeZd = null;
          let olBookingTotal = null;
          ajaxSyncRequest('get', 'back/olBooking/findMergeInfo', {
            xh: this.$route.params.obj.mergeXh,
            source: 2
          }, (res) => {
            olAppliances = res.map.wsMergeZd.wsMergeDetailList;
            wsMergeZd = res.map.wsMergeZd;
            olBookingTotal = res.map.olBookingTotal;
          })
          //将外网数据组装成erp需要的格式
          let appliances = new Array();
          olAppliances.forEach(data => {
            let obj = new Object();
            //检测方式
            if (olBookingTotal.bjType == 0) {
              obj.detectionMethod = '送检'
            } else if (olBookingTotal.bjType == 1) {
              obj.detectionMethod = '现场'
            }
            obj.bjid = wsMergeZd.bjid;
            obj.qjidNew = data.qjidNew;
            obj.applianceId = data.applianceId;
            obj.applianceName = data.applianceName;
            obj.applianceActualName = data.qjmcNew;
            //优先取值bgxs
            if (data.bgxs != '检定' && data.bgxs != '送检' && data.bgxs != '现场') {
              obj.certificateType = data.applianceCertificateType;
            } else {
              obj.certificateType = data.bgxs;
            }
            obj.setNumber = data.tsNew;
            obj.pieceNumber = data.jsNew;
            obj.certificateNumber = data.tsNew;
            if (data.detectionFee) {
              obj.unitPrice = data.detectionFee;
            } else {
              obj.unitPrice = 0;
            }
            obj.applianceUnit = '件';
            obj.afterDiscountPrice = obj.unitPrice;
            try {
              obj.afterDiscountTotal = obj.afterDiscountPrice * obj.setNumber * obj.pieceNumber;
            } catch (e) {
              obj.afterDiscountTotal = 0;
            }
            if (data.departId != 0) {
              obj.departId = data.departId;
              obj.postId = data.postId;
            }
            obj.model = data.xhggNew;
            obj.manufacturer = data.zzcsNew;
            obj.isDiscount = data.isDiscount;
            appliances.push(obj);
          })
          //赋值给器具组件
          this.tableData = appliances;
          //移出、移入刷新器具组件
          this.isRefresh = true;
          this.$nextTick(() => {
            this.isRefresh = false;
          });
          //计算价格.
          setTimeout(() => {
            this.setDecimals();
          }, 0)

        }
      },
      //历史数据导入查询显示
      historyImport() {
        if(!this.companyIdtemp){
          this.$message.error('请先保存单位信息！')
          return;
        }
        let data = this.$refs.instrumentinfo.data;
        this.tableData = data;
        ajaxRequest('get', 'back/company/' + this.companyIdtemp, {}, (res) => {
          this.companyName = res.daoResult.companyName;
        })
      },

      //导入历史数据
      importHistory(rowInfo) {
        if (rowInfo) {
          //加载器具列表
          this.companyName = null;
          if (this.tableData) {
            this.tableData = this.tableData.concat(rowInfo);
          } else {
            this.tableData = rowInfo;
          }
          //移出、移入刷新器具组件
          this.isRefresh = true;
          this.$nextTick(() => {
            this.isRefresh = false;
          });

          setTimeout(() => {
            this.setDecimals();
          }, 0)

        } else {
          this.companyName = null;
        }
      },
      //修改新报价单标记位
      updateNewFlag() {
        let id = this.quotationId || this.$route.query.id;
        ajaxSyncRequest('post', 'back/quotation/updateNewFlag', {quotationId:id}, (res) => {
          if(res.code===200){
            this.$message.success('完成修改');
            this.$nextTick(() => {
              this.newFlag = false;
            });
          }
        })
      },
      //导出报价单明细
      exportQuotation(){
        let id = this.quotationId && this.$route.query.id;
        let auditFlag = 0;
        ajaxSyncRequest('get', 'back/quotation/' + id, {}, (res) => {
          auditFlag = res.daoResult.auditFlag;
        })
        if (auditFlag == 0) {
          this.$message.error('报价未审核，不可导出！')
          return;
        } else {
          let form = $("<form></form>").attr("action", "/back/quotation/quotationExport").attr("method", "post");
          form.append($("<input></input>").attr("type", "hidden").attr("name", "isDown").attr("value", "true"));
          form.append($("<input></input>").attr("type", "hidden").attr("name", 'quotationId').attr("value",id));
          form.appendTo('body').submit().remove();
        }
      },
      //打印报价单
      printQuotation(){
        let id = this.quotationId && this.$route.query.id;
        let auditFlag = 0;
        ajaxSyncRequest('get', 'back/quotation/' + id, {}, (res) => {
          auditFlag = res.daoResult.auditFlag;
        })
        if (auditFlag == 0) {
          this.$message.error('报价未审核，不可打印！')
          return;
        } else {
          this.printHtml("quotationPrint",{quotationId:id});
        }
      }
    }
  }

</script>

<style type="text/css" lang="scss">

  .baseDetail {
    .flex-one {
      flex: 1;
    }
    .mb20 {
      margin-bottom: 20px;
    }
  }
</style>
