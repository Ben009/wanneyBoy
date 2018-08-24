<!--suppress ALL -->
<template>
  <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%">
    <el-table-column
      prop="uncertainty"
      show-overflow-tooltip
      label="不确定度相应范围">
      <template slot-scope="scope">
        <el-popover placement="top-start" width="200" :visible-arrow="false" :disabled="!scope.row.uncertainty" trigger="hover">
          <div v-html="scope.row.uncertainty"></div>
          <el-input v-model="scope.row.uncertainty" slot="reference" v-rightclick="handleRightClick.bind(this,scope.row,'uncertainty')" :maxlength="200"></el-input>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="uncertaintyE"
      show-overflow-tooltip
      label="不确定度相应范围(英)">
      <template slot-scope="scope">
        <el-popover placement="top-start" width="200" :visible-arrow="false" :disabled="!scope.row.uncertaintyE" trigger="hover">
          <div v-html="scope.row.uncertaintyE"></div>
          <el-input v-model="scope.row.uncertaintyE" slot="reference" v-rightclick="handleRightClick.bind(this,scope.row,'uncertaintyE')"
                    :maxlength="200"></el-input>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="datumQuantity"
      show-overflow-tooltip
      label="相应参考量">
      <template slot-scope="scope">
        <el-popover placement="top-start" width="200" :visible-arrow="false"  :disabled="!scope.row.datumQuantity"  trigger="hover">
          <div v-html="scope.row.datumQuantity"></div>
          <el-input v-model="scope.row.datumQuantity" slot="reference" v-rightclick="handleRightClick.bind(this,scope.row,'datumQuantity')" :maxlength="200"></el-input>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="datumQuantityE"
      show-overflow-tooltip
      label="相应参考量(英)">
      <template slot-scope="scope">
        <el-popover placement="top-start" width="200" :visible-arrow="false"   :disabled="!scope.row.datumQuantityE" trigger="hover">
          <div v-html="scope.row.datumQuantityE"></div>
          <el-input v-model="scope.row.datumQuantityE" slot="reference" v-rightclick="handleRightClick.bind(this,scope.row,'datumQuantityE')" :maxlength="200"></el-input>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="cmc"
      show-overflow-tooltip
      label="cmc(k=2)">
      <template slot-scope="scope">
        <el-popover placement="top-start" width="200" :visible-arrow="false" :disabled="!scope.row.cmc" trigger="hover">
          <div v-html="scope.row.cmc"></div>
          <el-input v-model="scope.row.cmc" slot="reference" v-rightclick="handleRightClick.bind(this,scope.row,'cmc')" :maxlength="200"></el-input>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="cmcE"
      show-overflow-tooltip
      label="cmc(k=2)(英)">
      <template slot-scope="scope">
        <el-popover placement="top-start" width="200" :visible-arrow="false" :disabled="!scope.row.cmcE" trigger="hover">
          <div v-html="scope.row.cmcE"></div>
          <el-input v-model="scope.row.cmcE" slot="reference" v-rightclick="handleRightClick.bind(this,scope.row,'cmcE')" :maxlength="200"></el-input>
        </el-popover>
      </template>
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
</template>

<script>
  import Vue from 'vue'
  import vuex from 'vuex'
  import rightclick from '../../../../directives/rightcilck'
  import rightClick from '../../../../mixins/FormRightClick'
  const defaultTabRow = {}
  export default {
    name: 'UncertainTable',
    props: {
      uncertainList: {
        type: Array,
        default() {
          return [defaultTabRow]
        }
      }
    },
    data() {
      return {
        tableData: this.uncertainList
      }
    },
    directives: {rightclick},
    mixins: [rightClick],
    methods: {
      handleAdd() {
        this.tableData.push({})
      },
      handleDelete(index) {
        if (this.tableData.length == 1) {
          this.tableData.splice(index, 1, {})
        } else {
          this.tableData.splice(index, 1)
        }
      },
      getTableData() {
        let tempArr = [];
        this.tableData.forEach(v => {
            let tempObj = {}
            if (v.uncertainty) {
              tempObj.uncertainty = v.uncertainty
            }
            if (v.uncertaintyE) {
              tempObj.uncertaintyE = v.uncertaintyE
            }
            if (v.datumQuantity) {
              tempObj.datumQuantity = v.datumQuantity
            }
            if (v.datumQuantityE) {
              tempObj.datumQuantityE = v.datumQuantityE
            }
            if (v.cmc) {
              tempObj.cmc = v.cmc
            }
            if (v.cmcE) {
              tempObj.cmcE = v.cmcE
            }
            if (tempObj != {}) {
              tempArr[tempArr.length] = tempObj
            }
          }
        )
        return tempArr;
      },
      remoteMethod() {
        this.tableData = this.uncertainList
      }
    }
  }

</script>

<style scoped>

</style>
