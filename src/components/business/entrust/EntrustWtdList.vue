<template>
  <div style="position:relative;">

    <div style="margin-bottom:5px;" v-show="!isSetting">
      <Retrieve v-if="defaultOpen" ref="retrieve-wapper" :rowsCondition='rowsCondition' :sortBy="sortBy" :order="order" @toparentevent="advanceSearch"/>
    </div>
    <div style="margin-bottom:5px;text-align: right" v-show="isSetting">
      <el-button type="primary" round @click="personalSetting(0)">返回</el-button>
    </div>
    <WorkMould v-if="isSetting" :rowsCondition='rowsCondition' :callback="personalSetting"/>
    <div style="margin-bottom: 5px; text-align: right;width: 100%; height: 40px;line-height: 40px;">
        <el-select v-model="templateValue"  placeholder="请选择" @change="handleSelectTemplate">
          <el-option
            v-for="item in moduleList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" round @click="personalSetting(1)" class="el-icon-setting">个性化设置</el-button>
      </div>
    <div v-show="!isSetting">
      <div style="margin-top:10px;">
        <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%;" @sort-change="handleSort" @selection-change="handleSelectionChange">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column v-if="headObj.orderNo" prop="orderNo" label="委托单编号" :render-header="renderHeader"></el-table-column>
          <el-table-column v-if="headObj.companyName" prop="companyName" label="委托单位" width="300" :render-header="renderHeader"></el-table-column>
          <el-table-column v-if="headObj.detectionMethodName" prop="detectionMethodName" label="检测方式" :render-header="renderHeader"></el-table-column>
          <el-table-column v-if="headObj.institutionalNature" prop="institutionalNature" label="机构性质" :render-header="renderHeader"></el-table-column>
          <el-table-column v-if="headObj.contacter" prop="contacter" label="联系人" :render-header="renderHeader"></el-table-column>
          <el-table-column v-if="headObj.telephone" prop="telephone" label="联系电话" :render-header="renderHeader"></el-table-column>
          <el-table-column v-if="headObj.entrustDate" prop="entrustDate" label="客户委托日期"  :render-header="renderHeader" :formatter="dealDate"></el-table-column>
          <el-table-column v-if="headObj.taskSource" prop="taskSource" label="任务来源" :render-header="renderHeader"></el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                <i class="el-icon-edit-outline" title="编辑"></i>
              </el-button>
              <el-button @click="handleDelete([scope.row])" type="text" style="padding:0;font-size:18px;">
                <i class="el-icon-delete" title="删除"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top:10px;text-align:center; float:right;">
        <mind-pagination
          :current-page="page"
          :page-size="rows"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange">
        </mind-pagination>
      </div>
    </div>


  </div>

</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import {ajaxRequest} from '../../util/base'
  import Retrieve from '../../Retrieve'
  import $ from 'jquery'
  import WorkMould from '../../mould/WorkMould'
  import TableColumnHeader from '../../Table/TableColumnHeader'
  import entrustWtdListParam from './js/entrustWtdListParam'

/*   import { Table, TableColumn,} from 'element--ui'
  Vue.use(Table)
  Vue.use(TableColumn) */
  
  export default {
    name: 'entrustWtd-list',
    data () {
      return {
        page: 1,
        rows: 10,
        total: 0,
        searchKey: '',
        orderProperty: 'orderNo',
        orderType: 'desc',
        tableData: [],
        multipleSelection: [],
        fuzzySearch: 1,
        isSetting: 0,
        edit: null,
        rowsCondition: entrustWtdListParam, // 默认同目录下json数据 会依据模板改变
        paramJson: entrustWtdListParam, // 同目录下json数据 常量
        moduleList: [], // 模板列表
        templateValue: '', // 当前选择的模板id
        sortBy: '', // 排序字段
        order: '', // desc降序 asc升序
        headObj: {}, // 表头显示对象 {category:true}
        defaultOpen: true
      }
    },
    methods: {
      handleSort: function (column, prop, order) {
        this.orderProperty = column['prop']
        if (column['order'] === 'descending') {
          this.orderType = 'desc'
        } else {
          this.orderType = 'asc'
        }
        this.getTableList()
      },
      handleSearch (column, value) {
        /* 表格头部检索回调 获取当前列检索信息回显高级搜索组件
          * comparison 默认显示第一条比较项
          * column.property 列英文名称
          * value 检索值
          * sqlSeg 列sqlSeg信息 */
        var comparison = this.getComparison(column.property)
        var sqlSeg = this.getSqlSeg(column.property)
        this.$refs['retrieve-wapper'].insertRetrieveItem(0, column.property, comparison, value, sqlSeg)
      },
      advanceSearch: function (data) {
        this.sc = JSON.stringify(data.conditions)
        this.orderProperty = data.sortBy
        this.orderType = data.order
        this.fuzzySearch = 1
        this.getTableList()
      },
      getSqlSeg (property) {
        /* 通过列属性，找到当前列json配置中sqlSeg信息 */
        let temp = entrustWtdListParam.filter((v) => { return v.nameCode == property })
        let sqlSeg = temp.length > 0 ? temp[0].sqlSeg : ''
        return sqlSeg
      },
      getComparison (property) {
        /* 通过列属性，找到当前列json配置中第一个比较项 */
        let temp = entrustWtdListParam.filter((v) => { return v.nameCode == property })
        let comparison = temp.length > 0 ? temp[0].comparison : ''
        if (Object.prototype.toString.call(comparison) === '[object String]') {
          comparison = comparison.split(',')[0]
        } else {
          comparison = comparison[0]
        }
        return comparison
      },
      renderHeader: function (h, { column, $index }) {
        let property = column.property
        let currentInfo = entrustWtdListParam.filter((v) => { return v.nameCode == property })
        // console.log('aaaa',currentInfo,'序号',$index)
        return (
          <TableColumnHeader key={$index + property} column={column} handleSearch={this.handleSearch.bind(this)}
        currentInfo={currentInfo}/>
      )
      },
      recoverRetrieve (temp) {
        /* 模板信息回显高级搜索组件 模板具体内容放在json格式的content字段里 */
        if (!$.isEmptyObject(temp)) {
          let headObj = {}
          let info = temp.content ? JSON.parse(temp.content) : []
          this.rowsCondition = info.conditions
          this.sortBy = info.sortBy
          this.order = info.order
          if (info.headList) {
            for (let i = 0, len = info.headList.length; i < len; i++) {
              headObj[info.headList[i]] = true
            }
          }
          this.headObj = headObj
          this.defaultOpen = info.defaultOpen
        }
      },
      personalSetting (flag) {
        this.isSetting = flag
        !flag ? this.getTemplate() : null
      },
      getTemplate () {
        /* 获取到当前菜单下模板列表 */
        ajaxRequest('get', 'back/settingTemplate/list', {userId: window.localStorage.id, moduleType: 'EntrustWtdList', isDelete: 0}, (res) => {
          if (res.code == 200) {
            this.moduleList = res.rows
            /* 个性化设置完成后需通过templateValue刷新当前模板 */
            var temp = res.rows.filter((v) => { return v.id == this.templateValue })
            if (temp.length > 0) {
              this.recoverRetrieve(temp[0])
            } else {
              this.templateValue = ''
              this.recoverRetrieve({})
            }
          }
        })
      },
      getTableList () {
        if (this.searchKey || this.fuzzySearch === 1) {
          ajaxRequest('get', 'back/entrustWtd/retrieve', {
            fuzzySearch: 1,
            page: this.page,
            rows: this.rows,
            orderProperty: this.orderProperty,
            orderType: this.orderType,
            total: 0,
            sc: this.sc
          }, (res) => {
            if (res.code === 200) {
              this.tableData = res.rows
              this.total = res.total
              this.multipleSelection = []
            }
          })
        }
      },
      handleToggleTheme (color) {
        this.$store.commit('toggleTheme', color)
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handlePageSizeChange (size) {
        this.page = 1;//Math.floor(this.page * this.rows / size);
        this.rows = size
        this.getTableList()
      },
      handleCurrentPageChange (currentPage) {
        this.page = currentPage
        this.getTableList()
      },
      defaultShowAllCol () {
        let param = [].concat(entrustWtdListParam), headObj = {}
        param.forEach(v => v.isDefault == 1 ? headObj[v.nameCode] = true : null)
        this.headObj = headObj
      },
      handleEdit (rowInfo) {
        this.$router.push({
          path: '/admin/267',
          query: {wtdId:rowInfo.wtdId}
        })
        // this.edit = rowInfo || {}
      },
      handleDelete (data) {
        if (data.length > 0) {
          let wtdIds = data.map(function (v) {
            return v.wtdId
          }).join(',')
          ajaxRequest('post', 'back/entrustWtd/list/' + wtdIds, {_method: 'delete'}, function (res) {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getTableList()
            } else {
              this.$message.error('删除失败')
            }
          }.bind(this))
        } else {
          this.$message({
            message: '请先选择要删除的数据',
            type: 'warning'
          })
        }
      },
      getRetrieveHeader () {
        ajaxRequest('get', 'back/dictEntry/list/', {dictTypeId: 13}, function (res) {
          if (res.code === 200) {
            var rows = res.rows
            if (rows != null && rows.length > 0) {
              for (var i = 0; i < rows.length; i++) {
                rows[i].title = rows[i].name
                rows[i].name = rows[i].dictCode
                if (rows[i].memo != null && rows[i].memo.length > 0) {
                  var comparisonstrs = rows[i].memo.split(',')
                  var comparisons = []
                  for (var j = 0; j < comparisonstrs.length; j++) {
                    comparisons[j] = new Object()
                    switch (comparisonstrs[j]) {
                      case '0':
                        comparisons[j].title = '包含'
                        comparisons[j].value = 0
                        break
                      case '1':
                        comparisons[j].title = '等于'
                        comparisons[j].value = 1
                        break
                      case '2':
                        comparisons[j].title = '大于'
                        comparisons[j].value = 2
                        break
                      case '3':
                        comparisons[j].title = '大于等于'
                        comparisons[j].value = 3
                        break
                      case '4':
                        comparisons[j].title = '小于'
                        comparisons[j].value = 4
                        break
                      case '5':
                        comparisons[j].title = '小于等于'
                        comparisons[j].value = 5
                        break
                      default :
                        ;
                    }
                  }
                  rows[i].comparisons = comparisons
                }
                rows[i].type = 0
              }
            }
            this.$refs['retrieve-wapper'].refreshSearchCondition(rows)
          }
        })
      },
      dealControlled (row, column) {
        let controlled = {0: '否', 1: '是'}
        return controlled[row.controlled]
      },
      dealDate: function (row, column, cellValue) {
        return new Date(cellValue).format('YYYY-MM-DD')
      },
      handleSelectTemplate (value) {
        ajaxRequest('get', 'back/settingTemplate/list', {id: value}, (res) => {
          if (res.code == 200) {
            var temp = res.rows[0]
            this.recoverRetrieve(temp)
          }
        })
      }
    },
    components: {
      WorkMould,
      TableColumnHeader,
      Retrieve
    },
    mounted () {
      this.getTableList()
      this.defaultShowAllCol()
    }
  }
</script>

<style scoped>
  .custom-input{
    width:200px;
    height:32px;
  }
  .custom-input .el-input__inner{
    height:32px;
    line-height:32px;
  }
  .custom-input .el-input-group__append{
    padding:0 10px;
  }
</style>
