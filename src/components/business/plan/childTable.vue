<template>
  <el-table :data="applianceList[row.orderNo]" :max-height="QJTableMaxHeight" style="width: 100%" border >
    <el-table-column label="器具名称" prop="applianceName" :formatter="handleApplianceName"  :render-header="QJrenderHeader">
    </el-table-column>
    <el-table-column label="型号规格" prop="model" :render-header="QJrenderHeader">
    </el-table-column>
    <el-table-column label="套数" prop="setNumber">
    </el-table-column>
    <el-table-column label="检测方式" prop="detectionMethod" :formatter="handleDetectionMethod"><!--0现场 1送检 2带回-->
    </el-table-column>
    <el-table-column label="出厂编号" prop="factoryNo" :render-header="QJrenderHeader">
    </el-table-column>
    <el-table-column label="设备编号" prop="equipmentNo" :render-header="QJrenderHeader">
    </el-table-column>
    <el-table-column label="执行人" prop="inspector">
    </el-table-column>
    <el-table-column label="预计工作量" prop="estimatedWorkload">
    </el-table-column>
    <el-table-column label="状态" prop="status" :formatter="handleStatus"><!--未分配、未配号、djh、退回（原因）-->
    </el-table-column>
    <el-table-column
      label="操作"
      min-width="100">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" plain @click="handleEdit(scope.row,true)">器具详情</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import {ajaxRequest} from '../../util/base'
  import TableColumnHeader from '../../Table/TableColumnHeader'
  export default {
    name: 'child-table',
    props: {
      row: {required: true, type: Object},  //当前行数据
      applianceList: {required: true, type: Array},
      rowsCondition: {required: true, type: Array},
      paramJson: {required: true, type: Array},
      getOrderApplianceList: {required: true, type: Function},
      handleEdit:{required:true,type:Function},
    },
    data() {
      return {}
    },
    methods: {
    handleDetectionMethod: function (row, column, cellValue) {
      if (cellValue == '0') {
        return "现场";
      } else if (cellValue == '1') {
        return "送检";
      } else if (cellValue == '2') {
        return "带回";
      }
    },
      handleStatus:function(row,column,cellValue){
        if(row.orderNo==null){
          return "未排单";
        }else if (row.isClaim==null){
          return "已排单";
        }else {
          if(row.isReturn=="1"){
            return "退回("+row.returnReason+")";
          }else if(row.registrationNo==null){
            return "已分配";
          }else {
            return row.registrationNo;
          }
        }
      },
      handleApplianceName: function (row, column, cellValue) {
        console.log(row,column)
        return row.applianceActualName || row.applianceName;
      },
       //条件查询
      QJhandleSearch(column,value){
        console.log(column,value,"表头检索");
        var comparison = this.getComparison(column.property);
        var sqlSeg = this.getSqlSeg(column.property);
        let sc = JSON.stringify([{"nameCode":column.property,"sqlSeg":sqlSeg,"comparison":comparison,"value":value}]);
        this.getOrderApplianceList(this.row.orderNo,sc);
      },
    },
    mounted() {
    }
  }
</script>

