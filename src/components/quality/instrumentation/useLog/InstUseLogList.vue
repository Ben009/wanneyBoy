<template>
  <div style="position:relative;">
    <div>
      <div style="margin-bottom:10px;">
        <Retrieve ref="retrieve-wapper" v-if="defaultOpen" :span="12"
                  :rowsCondition='rowsCondition'
                  :sortBy="sortBy"
                  :order="order"
                  :paramJson="paramJson"
                  :retrieveCondition="retrieveCondition"
                  :collectionInfo="collectionInfo"/>
        <div>
          <div style="text-align: center">
            <el-button type="primary" v-if="defaultOpen" @click="QJAdvanceSearch"
                       class="el-icon-search">查询
            </el-button>
            <el-button type="warning" v-if="defaultOpen" @click="QJEmptyCondition"
                       class="el-icon-info">&nbsp;清空
            </el-button>
            <span style="float: right">
            <el-select size="mini" v-if="resultCondition.length" v-model="templateValue" placeholder="请选择"
                       @change="QJHandleSelectTemplate">
              <el-option
                v-for="item in moduleList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)"
                       class="el-icon-setting">个性化设置</el-button>
            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                       :handleMouldBack="QJHandleMouldBack"/>
          </span>
          </div>
        </div>
        <div style="margin-top:10px;">
          <el-table :data="tableData" v-loading="loading"
                    :max-height="QJTableMaxHeight"
                    border
                    ref="instUseLogLsit"
                  >
            <el-table-column key="index" fixed type="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column key="instrumentationName" prop="instrumentationName" label="设备名称"
                             :render-header="QJrenderHeader" v-if="headObj.instrumentationName" ></el-table-column>
            <el-table-column key="model"  v-if="headObj.model" prop="model" label="型号规格"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="mearsuringRange"  v-if="headObj.mearsuringRange" prop="mearsuringRange" label="测量范围"
                             :render-header="QJrenderHeader" :formatter="htmlFormat"></el-table-column>
            <el-table-column key="instructionsNo"  v-if="headObj.instructionsNo" prop="instructionsNo" label="出厂编号"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="deviceNumber"  v-if="headObj.deviceNumber" prop="deviceNumber" label="设备编号"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="departName"  v-if="headObj.departName" prop="departName" label="所属部门" :render-header="QJrenderHeader"
                             ></el-table-column>
            <el-table-column key="effectiveDate"  v-if="headObj.effectiveDate" prop="effectiveDate" label="有效日期"
                             :formatter="function(row, column, cellValue, index){return new Date(row.effectiveDate).format('YYYY-MM-DD')}"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="status"  v-if="headObj.status" prop="status" label="设备状态" :render-header="QJrenderHeader"
                             :formatter="dealStatus"></el-table-column>
            <el-table-column key="traceWay"  v-if="headObj.traceWay" prop="traceWay" label="溯源方式" :render-header="QJrenderHeader"
                             :formatter="dealTraceWay"></el-table-column>
            <el-table-column key="userName"  v-if="headObj.userName" prop="userName" label="保管人"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="zsbh"  prop="zsbh" label="证书编号" :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="useDate"  v-if="headObj.useDate" prop="useDate" label="使用日期"
                             :formatter="function(row, column, cellValue, index){return new Date(row.useDate).format('YYYY-MM-DD')}"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="useLocation"  v-if="headObj.useLocation" prop="useLocation" label="使用地点"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="usePerson"  v-if="headObj.usePerson" prop="usePerson" label="使用人"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="temperature"  v-if="headObj.temperature" prop="temperature" label="温度"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="humidity"  v-if="headObj.humidity" prop="humidity" label="湿度"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="other"  v-if="headObj.other" prop="other" label="其它"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="statusBefore"  v-if="headObj.statusBefore" prop="statusBefore" label="使用前状态"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="statusAfter"  v-if="headObj.statusAfter" prop="statusAfter" label="使用后状态"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="remark"  v-if="headObj.remark" prop="remark" label="备注"
                             :render-header="QJrenderHeader"></el-table-column>
            <el-table-column key="operate" label="操作" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                  class="el-icon-edit-outline" title="编辑"></i></el-button>
                <el-button @click="handleDelete([scope.row])" type="text" style="padding:0;font-size:18px;"><i
                  class="el-icon-delete" title="删除"></i></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top:10px;text-align:center;float:right;">
          <mind-pagination
            :current-page="page"
            :page-size="rows"
            :total="total"
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentPageChange">
          </mind-pagination>
        </div>
        <instUseLogForm v-if="!!edit" :data="edit" :callback="handleEditCallback"></instUseLogForm>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
// 引入表格和分页插件
// 引入ajax工具
import {ajaxRequest, ajaxProxyRequest} from '../../../util/base'
// 引入高级检索
import Retrieve from '../../../Retrieve'
// 引入个性化设置模版
import WorkMould from '../../../mould/WorkMould'
// 引入自定义表头
import TableColumnHeader from '../../../Table/TableColumnHeader'
// 引入对应的表单编辑页
import instUseLogForm from './instUseLogForm'
// 引入对应的json文件 当前目录下instUseLogParam.js文件
import param from './instUseLogParam.js'
// 引入jquery
import $ from 'jquery'

import queryInsFormat from '../recordTab/htmlFormat.vue'

export default {
  name: 'instUseLogList',
  data () {
    return {
      page: 1,
      rows: 10,
      total: 0,
      searchKey: '',
      orderProperty: 't.id',
      orderType: 'desc',
      tableData: [],
      loading: false,
      multipleSelection: [],
      fuzzySearch: 0,
      isSetting: 0, // 控制个性化设置弹窗是否展示

      /* 高级检索相关项 */
      rowsCondition: param, // 默认同目录下json数据 会依据模板改变
      paramJson: param, // 同目录下json数据 常量
      moduleList: [], // 模板列表
      templateValue: '', // 当前选择的模板id
      sortBy: '', // 排序字段
      order: '', // desc降序 asc升序
      headObj: {}, // 表头显示对象 {category:true}
      defaultOpen: true, // 默认开启高级查询

      userId: '',
      allModules: {}, // 所有模板
      resultCondition: [],
      retrieveCondition: [],
      collectionInfo: [],
      setHeightForRet: null,
      traceWays: [],
      deviceStatus: [],
      edit: null,
      tableKey: Math.random()
    }
  },
  methods: {
    dealStatus (row) {
      this.deviceStatus.forEach(v => {
        if (v.code == row.status) {
          return row.remark
        }
      })
    },
    dealTraceWay (row) {
      this.traceWays.forEach(v => {
        if (v.code == row.traceWay) {
          return row.remark
        }
      })
    },
    htmlFormat(row,column,cellValue){
      return (<query-ins-format html-content={cellValue?cellValue:undefined}></query-ins-format>)
    },
    handleSort: function (column, prop, order) {
      this.orderProperty = '"' + column['prop'] + '"'
      if (column['order'] == 'descending') {
        this.orderType = 'desc'
      } else {
        this.orderType = 'asc'
      }
      this.getTableList()
    },
    getTableList () {
      /* 获取table数据，维护data数据 */
      ajaxRequest('get', 'back/instUseLog/retrieve', {
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
    },
    handlePageSizeChange (size) {
      this.page = 1
      this.rows = size
      this.getTableList()
    },
    handleCurrentPageChange (currentPage) {
      /* 分页组件每页显示条数change 重新计算页码，控制信息在当前表格中 */
      this.page = currentPage
      this.getTableList()
    },
    handleEdit (rowInfo) {
      this.edit = rowInfo || {}
    },
    handleDelete (data) {
      /* 删除表格数据 */
      if (data.length > 0) {
        let ids = data.map(function (v) {
          return v.id
        }).join(',')
        ajaxRequest('post', 'back/instUseLog/list/' + ids, {_method: 'delete'}, function (res) {
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
    handleEditCallback (rowInfo) {
      // 回调刷新列表页数据
      if (rowInfo) {
        this.getTableList()
      }
      this.edit = null
    },
    
  },
  components: {
    WorkMould,
    TableColumnHeader,
    Retrieve,
    instUseLogForm,
    queryInsFormat
  },
  mounted () {
    ajaxProxyRequest('get', '/njmind/findParam/instrumentationtraceWay', {}, res => {
      this.traceWays = res.list
    })
    ajaxProxyRequest('get', '/njmind/findParam/instrumentationStatus', {}, res => {
      this.deviceStatus = res.list
    })
    this.getTableList()
    this.QJGetMounted();
    /* 处理默认展示的表格列 */
  }
}
</script>

<style scoped>
  .flex-one {
    flex: 1;
  }

  .flex {
    display: flex;
  }

  .custom-input {
    width: 200px;
    height: 32px;
  }

  .custom-input .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  .custom-input .el-input-group__append {
    padding: 0 10px;
  }

  .el-icon-setting {
    background: none !important;
    border: none !important;
    color: #3094e0 !important;
  }

  .el-icon-setting:hover {
    color: #3094e0 !important;
  }

  .shuoming {
    border: none !important;
    color: #56BC4E !important;
    font-size: 16px !important;
  }

  .shuoming::after {
    content: "";
    width: 35px;
    height: 40px;
    /*background: #fff;*/
    position: absolute;
    z-index: 999;
    /* top: 0; */
    /* left: -65px; */
    margin-left: -16px;

  }

  .el-sm {
    background: #ffffff;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 7px 33px -9px #969696;
    box-shadow: 1px 7px 33px -9px #969696;
    border: 1px solid #56bc4e8c;
    border-radius: 5px;
    color: dimgrey;
    margin-left: -361px;
    word-break: break-all;
    margin-top: 18px;
    padding: 4px 5px;
    font-size: 14px;
    opacity: 50;
    float: right;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
  }

  .shuoming .el-sm {
    display: none;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;
  }

  .el-button--warning:hover {
    background: #ff9c9c !important;
    border: 1px solid #ff9c9c !important;

  }
</style>
