<!-- 报价器具列表器具修改-->
<template>
  <mind-dialog
    title="报价器具修改"
    :visible="true"
    center
    v-dialogDrag
    dialogSize="large"
    @close="handleCancel">

    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="器具名称" prop="applianceName">
            <applianceAutoCompelete @select-value="setApplianceValue" v-model="form.applianceName"
                                    ref="ref"></applianceAutoCompelete>
            <el-input v-model="form.id" v-show="show"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="器具实际名称" prop="applianceActualName">
            <el-input v-model="form.applianceActualName"
                      v-rightclick="handleRightClick.bind(this,form,'applianceActualName')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="6">
          <el-form-item label="服务类型" prop="certificateType">
            <el-select placeholder="请选择" v-model="form.certificateType" style="width:100%">
              <el-option
                v-for="item in certificateTypes"
                :key="item.remark"
                :label="item.remark"
                :value="item.remark">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="检测方式" prop="detectionMethod">
            <el-select placeholder="请选择" v-model="form.detectionMethod" style="width:100%">
              <el-option
                v-for="item in detectionMethods"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="型号规格" prop="model">
            <el-input v-model="form.model" v-rightclick="handleRightClick.bind(this,form,'model')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="测量范围" prop="measureRange">
            <el-input v-model="form.measureRange"
                      v-rightclick="handleRightClick.bind(this,form,'measureRange')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="6">
          <el-form-item label="设备编号" prop="equipmentNo">
            <el-input v-model="form.equipmentNo"
                      v-rightclick="handleRightClick.bind(this,form,'equipmentNo')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出厂编号" prop="factoryNo">
            <el-input v-model="form.factoryNo" v-rightclick="handleRightClick.bind(this,form,'factoryNo')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="制造厂商" prop="manufacturer">
            <el-input v-model="form.manufacturer"
                      v-rightclick="handleRightClick.bind(this,form,'manufacturer')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="分包区域" prop="subcontractArea">
            <el-select
              @change="changeSub"
              placeholder="请选择"
              value-key="name"
              v-model="form.subcontractArea">
              <el-option
                v-for="item in subcontractAreas"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="检测部门" prop="departId">
            <el-select placeholder="请选择" v-model="form.departId" style="width:100%" @change="departChangeEvt">
              <el-option
                v-for="item in departments"
                :key="item.id"
                :label="item.departName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="检测岗位" prop="postId">
            <el-select placeholder="请选择" v-model="form.postId" style="width:100%">
              <el-option
                v-for="item in postIds"
                :key="item.id"
                :label="item.postName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="套数" prop="setNumber">
            <el-input type="number" v-model.number="form.setNumber" :min="0" style="width: 50%" @change="changePrice"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="件/套" prop="pieceNumber">
            <el-input type="number" v-model="form.pieceNumber" style="width: 50%" :min="0"  @change="changePrice"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="证书数量" prop="certificateNumber">
            <el-input type="number" v-model="form.certificateNumber" style="width: 50%"  disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="单位" prop="applianceUnit">
            <el-input v-model="form.applianceUnit"
                      v-rightclick="handleRightClick.bind(this,form,'applianceUnit')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="单价" prop="unitPrice">
            <el-input v-model="form.unitPrice" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="折后单价" prop="afterDiscountPrice">
            <el-input v-model="form.afterDiscountPrice"
                      @change="changePrice"
                      :disabled="form.isDiscount!=1 || !priceEdit"
                      :controls="false"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="应收费用" prop="receivablesCost">
            <el-input v-model="form.receivablesCost" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="检测费" prop="afterDiscountTotal">
            <el-input v-model="form.afterDiscountTotal" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="检测参数" prop="detectionParameter">
            <el-input v-model="form.detectionParameter"
                      v-rightclick="handleRightClick.bind(this,form,'detectionParameter')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark"  v-rightclick="handleRightClick.bind(this,form,'remark')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
            <el-button @click="handleCancel">取 消</el-button>
      </span>

  </mind-dialog>

</template>

<script>
  import Vue from 'vue'
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest} from '../../util/base'

  var Big = require('big.js')
  // 引入jquery
  import $ from 'jquery'
  import applianceAutoCompelete from '../plan/applianceAutoCompelete.vue'
  import rightclick from '../../../directives/rightcilck'
  import rightClick from '../../../mixins/FormRightClick'

  const defaults = {
    setNumber: 1,
    pieceNumber: 1,
    certificateNumber: 1,
    applianceUnit: '件'
  }

  export default {
    name: 'QuotationApplianceEdit',
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          applianceName: [{required: true, message: '器具名称不能为空'}, {max: 100, message: '最多输入100个字符', trigger: 'blur'}],
          applianceActualName: [{required: true, message: '器具实际名称不能为空'}, {max: 100, message: '最多输入100个字符', trigger: 'blur'}],
          certificateType: [{required: true, message: '服务类型不能为空'}],
          detectionMethod: [{required: true, message: '检测方式不能为空'}],
          setNumber: [{required: true, message: '套数不能为空'}],
          pieceNumber: [{required: true, message: '件/套不能为空'}],
          model: [{max: 200, message: '型号规格最多输入200个字符', trigger: 'blur'}],
          applianceUnit: [{required: true, message: '单位不能为空'},{max: 20, message: '单位最多输入20个字符', trigger: 'blur'}],
          measureRange: [{max: 200, message: '测量范围最多输入200个字符', trigger: 'blur'}],
          equipmentNo: [{max: 200, message: '设备编号最多输入200个字符', trigger: 'blur'}],
          factoryNo: [{max: 200, message: '出厂编号最多输入200个字符', trigger: 'blur'}],
          manufacturer: [{max: 200, message: '制造厂商最多输入200个字符', trigger: 'blur'}],
          afterDiscountPrice: [{required: true, message: '折后单价不能为空'}],
          receivablesCost: [{required: true, message: '应收费用不能为空'}],
          certificateNumber: [{required: true, message: '证书数量不能为空'}],
          unitPrice: [{required: true, message: '单价不能为空'}],
          departId: [{required: true, message: '检测部门不能为空'}],
          postId: [{required: true, message: '检测岗位不能为空'}]
        },
        certificateTypes: [], // 服务类型
        detectionMethods: [], // 检测方式
        departments: [], // 部门
        postIds: [], // 岗位
        show: false,
        subcontractAreas: [] //分包区域
      }
    },
    props: {
      data: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    components: {
      applianceAutoCompelete
    },
    directives: {rightclick},
    mixins: [rightClick],
    mounted() {
      console.log(this.data);
      this.getDetectionMethod()
      this.getDepart()
      this.getPost()
    },
    computed: {
      //价格修改权限btnPower
      priceEdit: function () {
        let btnPower = localStorage.getItem('btnPower');
        if (btnPower.indexOf('M7135') != -1) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      /* 分包区域改变事件**/
      changeSub() {
        if (this.form.subcontractArea > 0) {
          this.form.certificateNumber = 0;
        } else if (this.form.subcontractArea == 0) {
          this.form.certificateNumber = this.form.setNumber;
        }
      },
      /* 提交**/
      handleSubmit() {
        let userId = localStorage.getItem('userId');
        let btnPower = localStorage.getItem('btnPower');
        let businessStaff = null;
        let auditFlag = 0;
        ajaxSyncRequest('get', 'back/quotation/' + this.data.quotationId, {}, (res) => {
          businessStaff = res.daoResult.businessStaff
          auditFlag = res.daoResult.auditFlag;
        })
        if(userId!=businessStaff  && btnPower.indexOf('M7125')==-1){
          this.$message.warning('无权限操作！');
          return ;
        }
        if(auditFlag==1){
          this.$message.error('报价已审核，不可修改')
          return;
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.form.certificateNumber > this.form.setNumber) {
              this.$message.warning('证书数量不能大于套数');
              return;
            }
            this.callback(this.form)
          } else {
            return false
          }
        })
      },
      // 截取小数
      setDecimalsPoint(num, point) {
        if (point) {
          point = parseInt(point)
        } else {
          point = 2;
        }
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
          return num
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
        return s
      },
      handleCancel() {
        this.callback()
      },
      // 获取检测方式、分包区域,服务类型
      getDetectionMethod() {
        ajaxProxyRequest('get', '/njmind/findParams/detectionMethod$subcontractAreas$certificateType', {}, (res) => {
          this.detectionMethods = res.detectionMethod.list
          this.subcontractAreas = res.subcontractAreas.list
          this.certificateTypes = res.certificateType.list
        })
      },
      // 获取部门
      getDepart() {
        ajaxRequest('get', 'back/depart/list/', {isDelete: 0}, (res) => {
          this.departments = res.rows
          console.log(this.departments )
        })
      },
      getPost() {
        let _this = this
        if (_this.form.departId) {
          ajaxRequest('get', 'back/post/listByDeptId/' + _this.form.departId, {}, (res) => {
            this.postIds = res.rows
          })
        }
      },
      departChangeEvt(v) {
        ajaxRequest('get', 'back/post/listByDeptId/' + v, {}, (res) => {
          this.postIds = res.rows
        })
        Vue.set(this.form, 'postId', '')
      },
      // 价格改变事件
      changePrice() {
        let setNum = new Big(this.form.setNumber)// 套数
        let pieceNumber = new Big(this.form.pieceNumber)// 件数
        let afterDiscountPrice = new Big(this.setDecimalsPoint(this.form.afterDiscountPrice, this.form.decimals))// 折后单价
        let unitPrice = new Big(this.form.unitPrice)// 单价
        let total = setNum.mul(pieceNumber).mul(afterDiscountPrice)// 实收检测费
        let receivablesCost = setNum.mul(pieceNumber).mul(unitPrice)// 应收检测费
        Vue.set(this.form, 'afterDiscountTotal', total.toString());
        Vue.set(this.form, 'receivablesCost', receivablesCost.toString());
        this.form.certificateNumber = this.form.setNumber;

      },
      //选择器具
      setApplianceValue(val) {
        if (val) {
          this.form = $.extend({}, this.form,
            {
              applianceName: val.applianceName,
              certificateType: val.certificateType,
              departId: val.departId,
              postId: parseInt(val.postId),
              detectionMethod: val.detectionMethod,
              model: val.model,
              detectionParameter: val.detectionParameter,
              equipmentNo: val.equipmentNo,
              factoryNo: val.factoryNo,
              measureRange: val.measureRange,
              subcontractArea: val.subcontractArea,
              remark: val.remark,
              unitPrice: val.detectionFee,
              isDiscount: val.isDiscount
            })

          if (!this.form.subcontractArea) {
            this.form.subcontractArea = '0';
          }
          if (!this.form.applianceActualName) {
            this.form.applianceActualName = this.form.applianceName;
          }
          if (!this.form.setNumber) {
            this.form.setNumber = 1;
          }
          if (!this.form.pieceNumber) {
            this.form.pieceNumber = 1;
          }
          if (!this.form.certificateNumber) {
            this.form.pieceNumber = 1;
          }
          // if(!this.form.afterDiscountPrice){
          this.form.afterDiscountPrice = this.setDecimalsPoint(this.form.unitPrice, this.form.decimals);
          // }
          this.changePrice()
        }
      },
    }
  }
</script>

<style scoped>

</style>
