<!-- 报价器具列表 传入报价单ID查询-->
<template>
    <div>
        <el-table :data="tableData" :max-height="QJTableMaxHeight"
                  style="width: 100%"
                  :summary-method="getSummaries"
                  show-summary
                  @selection-change="handleSelectionChange"
                  ref="applianceListTable"
                  :row-class-name="tableRowClassName"
        >
            <el-table-column type="selection" width="40" :selectable='checkboxInit' v-if="!contractFlag"></el-table-column>
            <el-table-column  label="序号" type="index"  width="60"></el-table-column>
            <el-table-column prop="applianceName" label="器具名称" width="180"></el-table-column>
            <el-table-column prop="model" label="型号规格" width="180"></el-table-column>
            <el-table-column prop="factoryNo" label="出厂编号"></el-table-column>
            <el-table-column prop="setNumber" label="套数"></el-table-column>
            <el-table-column prop="unitPrice" label="检测单价"></el-table-column>
            <el-table-column prop="afterDiscountPrice" label="折后单价"></el-table-column>
            <el-table-column prop="afterDiscountTotal" label="检测费"></el-table-column>
            <el-table-column prop="detectionMethod" label="检测方式" :formatter="detectionMethod"></el-table-column>
            <el-table-column prop="departName" label=" 检测部门 "></el-table-column>
            <el-table-column  v-if="!!this.$route.query.isBack"  prop="isBack" label="是否退回" :formatter="isBackFormatter"></el-table-column>
            <el-table-column  v-if="!!this.$route.query.isBack" prop="returnReason" label="退回原因"></el-table-column>
            <el-table-column label="操作"  min-width="200" v-if="!contractFlag">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                        <i class="el-icon-edit-outline" title="编辑"></i>
                    </el-button>
                    <el-button v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,scope.row)}" type="text" style="padding:0;font-size:18px;">
                        <i class="el-icon-delete" title="删除"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <applinanceEdit v-if="!!edit" :data="edit" :callback="handleEditCallback"></applinanceEdit>
    </div>
</template>

<script>
import applinanceEdit from './QuotationApplianceEdit'
import Vue from 'vue'
// 引入封装的ajax控件
import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest} from '../../util/base'
var Big = require('big.js')
// 引入jquery
import $ from 'jquery'
export default {
  name: 'QuotationApplianceList',
  data () {
    return {
      edit: null,
      tableData: [],
      multipleSelection: [],
    }
  },
  watch:{
    quotationId(val){
      if(val){
        this.getTableData();
      }else{
        this.tableData = [];
      }
    }
  },
  components: {applinanceEdit},
  props: {// 用于接收从父组件中传来的数据
    quotationId: {
      type: Number
    },
    callback: {
      type: Function
    },
    contractFlag:{//合同页面调用
      type:Number
    },
    auditFlag:{
      type:Number
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      if (this.quotationId) {
        ajaxRequest('get', 'back/quotationAppliance/retrieve', {quotationId: this.quotationId}, (res) => {
          this.tableData = res.rows
        })
      }
    },
    //显示编辑页
    handleEdit (rowInfo) {
      this.edit = rowInfo || {}
    },
    //器具修改
    handleEditCallback (rowInfo) {
      if (rowInfo) {
        ajaxRequest('put', 'back/quotationAppliance/', {quotationAppliance: JSON.stringify(rowInfo)}, (res) => {
          if (res.code === 200) {
            this.$message.success('修改成功')
            this.edit = null
            this.getTableData()
            this.$emit('getPriceDetail')// 重新加载数据
          }
        })
      } else {
        this.edit = null
      }
    },
    handleDelete (data) {
      //判断是否有权限修改，无权限只能修改当前业务员的报价单
      let userId = localStorage.getItem('userId');
      let btnPower = localStorage.getItem('btnPower');
      let businessStaff = null;
      let auditFlag = 0;
      ajaxSyncRequest('get', 'back/quotation/' + this.quotationId, {}, (res) => {
        businessStaff = res.daoResult.businessStaff
        auditFlag = res.daoResult.auditFlag
      })
      if(userId!=businessStaff  && btnPower.indexOf('M7125')==-1){
        this.$message.warning('无权限操作！');
        return ;
      }
      if(auditFlag==1){
        this.$message.error('报价已审核，不可修改')
        return;
      }
      if (data) {
        ajaxRequest('post', 'back/quotationAppliance/deleteQuotationApplianceByBatch',
          {id:data.id,quotationId:this.quotationId,_method:"delete"}, (res) => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getTableData()
            this.$emit('getPriceDetail')// 重新加载数据
          } else {
            this.$message.error('删除失败')
          }
        })
      }
    },
    // 是否分包格式化
    subcontractAreaFormat (row, column) {
      if (row.subcontractArea == '0') {
        return '否'
      } else {
        return '是'
      }
    },
    // 检测方式格式化
    detectionMethod (row, column) {
      if (row.detectionMethod == '0') {
        return '现场'
      } else if (row.detectionMethod == '1') {
        return '送检'
      } else if (row.detectionMethod == '2') {
        return '带回'
      }
    },
    isBackFormatter(row, column){
      if(row.isBack==1){
        return '是'
      }else {
        return '否';
      }

    },
    // 不可打折的不允许勾选
    checkboxInit (row, index) {
      if (row.isDiscount == 1) {
        return 1
      } else {
        return 0
      }
    },
    // 合计行
    getSummaries (param) {
      let { columns, data } = param
      let sums = []
      columns.forEach((column, index) => {
        if (index === 2) {
          sums[index] = '合计'
          return
        }
        let values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            let value = Number(curr)
            if (!isNaN(value)) {
              return new Big(prev).add(curr)
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' '
        } else {
          sums[index] = ' '
        }
      })
      let index = 0;
      if(this.contractFlag){
        index = -1;
      }
      sums[0] = ''
      if(this.contractFlag){
        sums[0] = '合计'
        sums[2+index] = ''
      }
       sums[3+index] = ''
       sums[4+index] = ''
       sums[9+index] = ''
       sums[10+index] = ''
       sums[11+index] = ''
       sums[12+index] = ''
      return sums
    },
    // checkbox选中时候赋值
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    //合计行样式
    //如果退回，黄色底色显示
    tableRowClassName({row, rowIndex}) {
      if (row.isBack == '1' && !this.contractFlag) {
        return 'isBackColor';
      } else {
        return '';
      }
    },
  }
}
</script>

<style>
  .el-table .isBackColor{
    background-color: rgba(222, 222, 0, 0.53) !important;
  }
</style>
