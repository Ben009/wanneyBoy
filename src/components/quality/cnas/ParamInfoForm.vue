<template>
  <div>
    <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-Row>
        <el-col :span="4">
          <el-form-item label="参数分序号" prop="seqNum">
            <el-input v-model="form.seqNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参数名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="条款号" prop="clauseNum">
            <el-input v-model="form.clauseNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
    </el-form>
    <div class="title-item mb20"><span>标准器/标准物质</span></div>
    <InstrumentationTable class="m20" ref="InstrumentationTable" :instrumentationIds="this.instrumentationIds"></InstrumentationTable>
    <span slot="footer" class="dialog-footer" style="display:block;text-align: center;">
      <el-button @click="setCancel">取 消</el-button>
      <!-- 绑定form提交事件-->
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
    <div>
      <div style="margin-top:10px;">
        <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="seqNum" label="参数分序号"></el-table-column>
          <el-table-column prop="name" label="参数名称"></el-table-column>
          <el-table-column prop="clauseNum" label="条款号"></el-table-column>
          <el-table-column label="操作" min-width="50">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                <i class="el-icon-edit-outline" title="编辑"></i>
              </el-button>
              <el-button @click="handleDelete(scope.row)" type="text" style="padding:0;font-size:18px;">
                <i class="el-icon-delete" title="删除"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue' 
  // 引入封装的ajax控件
import {ajaxRequest} from '../../util/base'
// 引入jquery
import $ from 'jquery'
// 引入右击事件 可自行绑定到输入框
import InstrumentationTable from './inputSelectTab/InstrumentationTable'


/* import {
  Table, TableColumn, 
  Button,
  Checkbox,
  CheckboxGroup,
  Col, 
  Form,
  FormItem,
  Input, 
  Radio,
  RadioGroup,
  Row, 
} from 'element--ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(CheckboxGroup)
Vue.use(Checkbox) 
Vue.use(Table)
Vue.use(TableColumn)  */

const defaults = {
  hoho: ''
}
export default {
  name: 'paramInfoForm',
  components: {InstrumentationTable},
  props: {// 用于接收从父组件中传来的数据
    callback: {
      type: Function
    },
    getParentId: {
      type: Function
    }
  },
  data () {
    return {
      form: $.extend({}, defaults, this.data || {}),
      rules: {
        // 校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
        //          name: [{type: 'string', required: true, message: '角色名称不能为空'}],
        //          description: [{type: 'string', required: true, message: '角色描述不能为空'}]
      },
      loading: false,
      remoteOptions: [],
      instrumentationIds: null,
      tableData: []
    }
  },
  mounted () {
    // 页面渲染完成后，ajax请求加载数据
    this.remoteMethod()
  },
  methods: {// 方法定义
    handleSubmit () {
      // -- 表单提交处理 --
      this.$refs.form.validate((valid) => { // 校验成功则回调提交数据
        if (valid) {
          var httpMethod// http请求方式
          if (!this.form.id || this.form.id == '') { // 新增 注意:通过id是否存在来判断是新增还是编辑
            httpMethod = 'post'
          } else { // 更新
            httpMethod = 'put'
          }
          this.form.cnasId = this.getParentId()
          this.instrumentationIds=this.$refs.InstrumentationTable.getInstrumentationIds()
          if (this.instrumentationIds && this.instrumentationIds != '') {
            this.form.instrumentationIds=this.instrumentationIds
          }
          this.$confirm('确认保存?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ajaxRequest(httpMethod, 'back/paramInfo/', this.form, (res) => {
              if (res.code == 200) {
                this.$message.success('保存成功')
                this.setCancel()
              } else {
                this.$message.error('保存失败')
              }
            })
          })
        } else {
          return false
        }
      })
    },
    setCancel () {
      this.form = {}
      this.instrumentationIds = null
      this.$nextTick(() => {
        this.$refs.InstrumentationTable.remoteMethod()
      })
      this.getTableList()
    },
    remoteMethod () {
      // -- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
      this.loading = true
    },
    getTableList () {
      ajaxRequest('get', 'back/paramInfo/list', {cnasId: this.getParentId()}, (res) => {
        if (res.code === 200) {
          this.tableData = res.rows
        }
      })
    },
    handleEdit (row) {
      ajaxRequest('get', 'back/paramInfo/', {id: row.id}, (res) => {
        this.setCancel()
        if (res.code === 200) {
          this.form = res.daoResult
          if (this.form.instrumentationIds && this.form.instrumentationIds != '') {
            this.instrumentationIds = this.form.instrumentationIds
          } else {
            this.instrumentationIds = null
          }
          this.$nextTick(() => {
            this.$refs.InstrumentationTable.remoteMethod()
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajaxRequest('PUT', 'back/paramInfo/list/' + row.id, { isDelete: 1 }, (res) => {
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.setCancel()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    }
  }
}
</script>

<style>
  <!--
  右键菜单样式设置

  -->
  .right-click-menu {
    position: fixed;
    border: 1px solid #ccc;
    padding: 2px 0;
    background: #fff;
    width: 100px;
    z-index: 9999;
  }

  .right-click-menu li {
    padding: 3px 10px;
    cursor: default;
    font-size: 14px;
    color: #606266;
  }

  .right-click-menu li:hover {
    color: #409eff;
  }

  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
