<template>
  <div>
  <tec-bas-list-for-select v-if="selectTecBasFlag" :tecBasIds='tecBasIdArr' :index="index" :callback="selectTecBas"
                                                                    :checkRow="checkRow"></tec-bas-list-for-select>
  <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%">
    <el-table-column
      prop="name"
      show-overflow-tooltip
      label="规程名称">
      <template slot-scope="scope">
        <div @click="selectTecBas(scope.$index,1)">{{scope.row.name|| '无'}}</div>
      </template>
    </el-table-column>
    <el-table-column
      prop="basisNo"
      show-overflow-tooltip
      label="编号">
    </el-table-column>
    <el-table-column
      prop="nameE"
      show-overflow-tooltip
      label="英文名称">
    </el-table-column>
    <el-table-column prop="" style="width: 50px" show-overflow-tooltip label="操作">
      <template slot-scope="scope">
        <el-button @click="handleAdd()" type="text" style="padding:0;font-size:18px;">
          <i class="el-icon-circle-plus" title="增加"></i>
        </el-button>
        <el-button @click.native.prevent="handleDelete(scope.$index)" type="text"
                   style="padding:0;font-size:18px;">
          <i class="el-icon-delete" title="删除"></i>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
import tecBasListForSelect from '../../tecBas/TecBasListForSelect'
import {ajaxRequest} from '../../../util/base'
export default {
  name: 'TecBasTable',
  props: {
    tecBasIds: {
      type: String
    }
  },
  data () {
    return {
      tableData: [],
      index: 0,
      selectTecBasFlag: false,
      tecBasIdArr: []
    }
  },
  components: {
    tecBasListForSelect
  },
  mounted () {
    // 页面渲染完成后，ajax请求加载数据
    this.remoteMethod()
  },
  methods: {
    remoteMethod: function () {
      if (this.tecBasIds && this.tecBasIds != "") {
        // console.log(this.tecBasIds)
        this.tecBasIdArr = this.tecBasIds.split(',')
        ajaxRequest('get', 'back/tecBas/list/' + this.tecBasIds, {}, (data) => {
          // let tecTemp = {id: row.id, basisNo: row.basisNo, name: row.name, nameE: row.nameE}
          this.tableData = data.rows
        })
      } else {
        this.tecBasIdArr = []
        this.tableData = [{}]
      }
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
    },
    selectTecBas (index, flag) {
      this.selectTecBasFlag = flag
      this.index = index == null ? 0 : index
    },
    checkRow (row, index) {
      let tecTemp = {id: row.id, basisNo: row.basisNo, name: row.name, nameE: row.nameE}
      this.tableData.splice(index, 1, tecTemp)
    },
    getTecBasIds () {
      let tempTecBasIds = ''
      this.tableData.forEach(v => v.id ? (tempTecBasIds = tempTecBasIds + ',' + v.id) : false)
      if (tempTecBasIds != '') {
        tempTecBasIds = tempTecBasIds.substring(1, tempTecBasIds.length)
      }
      return tempTecBasIds
    }
  }

}
</script>

<style scoped>

</style>
