<!-- 报价器具列表器具修改-->
<template>
  <mind-dialog
    :title="'报价器具修改历史'"
    :visible="true"
    width="50%"
    center
    v-dialogDrag
    dialogSize="large"
    @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini" disabled>
      <el-row>
        <el-col :span="24">
          <el-form-item label="器具名称" prop="applianceName">
            <el-input v-model="form.applianceName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="器具实际名称" prop="applianceActualName">
            <el-input v-model="form.applianceActualName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
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

        <el-col :span="12">
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
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="型号规格" prop="model">
            <el-input v-model="form.model"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="测量范围" prop="measureRange">
            <el-input v-model="form.measureRange"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="设备编号" prop="equipmentNo">
            <el-input v-model="form.equipmentNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂编号" prop="factoryNo">
            <el-input v-model="form.factoryNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="制造厂商" prop="manufacturer">
            <el-input v-model="form.manufacturer"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分包区域" prop="subcontractArea">
            <el-select
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
        <el-col :span="12">
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

        <el-col :span="12">
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
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="套数" prop="setNumber">
            <el-input type="number" v-model.number="form.setNumber" style="width: 50%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="件/套" prop="pieceNumber">
            <el-input type="number" v-model="form.pieceNumber" style="width: 50%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="证书数量" prop="certificateNumber">
            <el-input type="number" v-model="form.certificateNumber" style="width: 50%"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="单位" prop="applianceUnit">
            <el-input v-model="form.applianceUnit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="单价" prop="unitPrice">
            <el-input v-model="form.unitPrice"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="折后单价" prop="afterDiscountPrice">
            <el-input v-model="form.afterDiscountPrice"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="应收费用" prop="receivablesCost">
            <el-input v-model="form.receivablesCost"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测费" prop="afterDiscountTotal">
            <el-input v-model="form.afterDiscountTotal"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="检测参数" prop="detectionParameter">
            <el-input v-model="form.detectionParameter"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
            <el-button type="warning" @click="handleCancel">关 闭</el-button>
      </span>

  </mind-dialog>

</template>

<script>
  import Vue from 'vue'
  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest} from '../../util/base'
  export default {
    name: 'QuotationApplianceEdit',
    data() {
      return {
        form: {},
        rules: {
          applianceName: [{required: true, message: '器具名称不能为空'}, {max: 100, message: '最多输入100个字符', trigger: 'blur'}],
          applianceActualName: [{max: 100, message: '最多输入100个字符', trigger: 'blur'}],
          certificateType: [{required: true, message: '服务类型不能为空'}],
          detectionMethod: [{required: true, message: '检测方式不能为空'}],
          setNumber: [{required: true, message: '套数不能为空'}],
          pieceNumber: [{required: true, message: '件/套不能为空'}],
          afterDiscountPrice: [{required: true, message: '折后单价不能为空'}],
          receivablesCost: [{required: true, message: '应收费用不能为空'}],
          certificateNumber: [{required: true, message: '证书数量不能为空'}],
          unitPrice: [{required: true, message: '单价不能为空'}],
          applianceUnit: [{required: true, message: '单位不能为空'}],
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
      callback: {
        type: Function
      },
      backId: {
        type: String
      }
    },
    components: { },
    mounted() {
      this.getDetectionMethod()
      this.getDepart()
      this.getPost()
      this.getFormData()
    },
    methods: {
      //关闭
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
      //获取备份明细信息
      getFormData(){
        if(this.backId){
          ajaxRequest('get', 'back/quotationAppliance/retrieveBack/', {backId:this.backId}, (res) => {
            // console.log(this.backId);
            // console.log(res.daoResult);
            this.form = res.daoResult
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
