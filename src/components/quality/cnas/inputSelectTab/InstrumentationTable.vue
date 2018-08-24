<template>
  <div>
    <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%">
      <el-table-column
        prop="instrumentationName"
        show-overflow-tooltip
        label="名称">
        <template slot-scope="scope">
          <div @click="selectInstrumentation(scope.$index,1)">{{scope.row.instrumentationName|| '无'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="model"
        show-overflow-tooltip
        label="型号规格">
      </el-table-column>
      <el-table-column
        prop="mearsuringRange"
        show-overflow-tooltip
        label="测量范围">
      </el-table-column>
      <el-table-column
        prop="accuracyClass"
        show-overflow-tooltip
        label="准确度等级">
      </el-table-column>
      <el-table-column
        prop="manufacturingCode"
        show-overflow-tooltip
        label="出厂编号">
      </el-table-column>
      <el-table-column
        prop="traceWay" :formatter="dealTraceWay"
        show-overflow-tooltip
        label="溯源方式">
      </el-table-column>
      <el-table-column prop="" style="width: 50px" show-overflow-tooltip label="操作">
        <template slot-scope="scope">
          <el-button @click="handleAdd()" type="text" style="padding:0;font-size:18px;">
            <i class="el-icon-circle-plus" title="增加"></i>
          </el-button>
          <el-button @click.native.prevent="handleDelete(scope.$index)" type="text" style="padding:0;font-size:18px;">
            <i class="el-icon-delete" title="删除"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <instrument-dialog :callback="checkRow" :instrumentIds="instrumentIds"></instrument-dialog>
  </div>
</template>

<script>
import {ajaxRequest, ajaxProxyRequest} from '../../../util/base'
import instrumentDialog from '../../meaStandard/standardFormComp/dialog/instrumentDialog'
export default {
  name: 'InstrumentationTable',
  props: {
    instrumentationIds: {
      type: String
    }
  },
  data () {
    return {
      tableData: [{}],
      index: 0,
      selectFlag: false,
      instrumentIds: [],
      traceWay: {}
    }
  },
  components: {instrumentDialog},
  mounted () {
    ajaxProxyRequest('get', '/njmind/findParam/instrumentationtraceWay', {}, (res) => {
      res.list.forEach(v => {
        this.traceWay[v.code] = v.remark
      })
    })
    this.remoteMethod()
  },
  methods: {
    dealTraceWay (row, column, cellValue) {
      return this.traceWay[cellValue]
    },
    handleAdd () {
      this.tableData.push({})
    },
    handleDelete (index) {
      if (this.tableData.length == 1) {
        this.tableData.splice(index, 1, {})
      } else {
        this.tableData.splice(index, 1)
      }
      this.instrumentIds.splice(index, 1)
    },
    selectInstrumentation (index, flag) {
      this.selectFlag = flag
      this.$store.commit('INSTRUMENT_DIALOG', this.selectFlag)
      this.index = index == null ? 0 : index
    },
    checkRow (row) {
      this.tableData.splice(this.index, 1, row)
      this.selectFlag = false
      this.instrumentIds.splice(this.index, 1, row.id)
      this.$store.commit('INSTRUMENT_DIALOG', this.selectFlag)
    },
    remoteMethod () {
      if (this.instrumentationIds && this.instrumentationIds != '') {
        this.instrumentIds = this.instrumentationIds.split(',')
        ajaxRequest('get', 'back/instrumentation/list/' + this.instrumentationIds, {}, (res) => {
          this.tableData = res.rows
        })
      } else {
        this.instrumentIds = []
        this.tableData = [{}]
      }
    },
    getInstrumentationIds () {
      var tempIds = ''
      this.tableData.forEach(v => {
        if (v.id) {
          tempIds += ',' + v.id
        }
      })
      if (tempIds != '') {
        tempIds = tempIds.substring(1, tempIds.length)
      }
      return tempIds
    }
  }
}
</script>

<style scoped>

</style>
