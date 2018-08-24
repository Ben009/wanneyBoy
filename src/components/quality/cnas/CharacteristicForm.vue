<template>
  <div>
    <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-Row>
        <el-col :span="8">
          <el-form-item label="参量代码" prop="code">
            <el-input v-model="form.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专业领域" prop="professionalFiled">
            <el-input v-model="form.professionalFiled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="领域代码" prop="filedCode">
            <el-input v-model="form.filedCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参量名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参量名称(英)" prop="nameE">
            <el-input v-model="form.nameE"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="测量范围" prop="measureRange">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-popover placement="top-start" width="200" :visible-arrow="false" :disabled="!form.measureRange" trigger="hover">
              <div v-html="form.measureRange"></div>
               <el-input v-model="form.measureRange" slot="reference" v-rightclick="handleRightClick.bind(this,form,'measureRange')"></el-input>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="测量范围(英)" prop="measureRangeE">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-popover placement="top-start" width="200" :visible-arrow="false" :disabled="!form.measureRangeE" trigger="hover">
              <div v-html="form.measureRangeE"></div>
              <el-input v-model="form.measureRangeE" slot="reference" v-rightclick="handleRightClick.bind(this,form,'measureRangeE')"></el-input>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="限制范围" prop="limit">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-popover placement="top-start" width="200" :visible-arrow="false" trigger="hover" :disabled="!form.limit">
              <div v-html="form.limit"></div>
              <el-input v-model="form.limit" slot="reference" v-rightclick="handleRightClick.bind(this,form,'limit')"></el-input>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="限制范围(英)" prop="limitE">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-popover placement="top-start" width="200" :visible-arrow="false" :disabled="!form.limitE" trigger="hover">
              <div v-html="form.limitE"></div>
              <el-input v-model="form.limitE" slot="reference" v-rightclick="handleRightClick.bind(this,form,'limitE')"></el-input>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
    </el-form>
    <div class="title-item mb20"><span>扩展不确定度</span></div>
    <UncertainTable class="m20" ref="uncertainTab" :uncertainList="this.uncertainties"></UncertainTable>
    <div class="title-item mb20"><span>标准规程</span></div>
    <TecBasTable  class="m20" ref="tecBasTable" :tecBasIds="this.tecBasIds"></TecBasTable>
    <span slot="footer" class="dialog-footer" style="display:block;text-align: center;">
      <el-button @click="setCancel">取 消</el-button>
      <!-- 绑定form提交事件-->
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
    <div>
      <div style="margin-top:10px;">
        <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="code" label="参量代码"></el-table-column>
          <el-table-column prop="name" label="参量名称"></el-table-column>
          <el-table-column prop="professionalFiled" label="专业领域"></el-table-column>
          <el-table-column prop="filedCode" label="领域代码"></el-table-column>
          <el-table-column prop="measureRange" label="测量范围"></el-table-column>
          <el-table-column prop="limit" label="限制范围"></el-table-column>
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
import Vuex from 'vuex'
  // 引入封装的ajax控件
import {ajaxRequest} from '../../util/base'
// 引入jquery
import $ from 'jquery'
// 引入右击事件 可自行绑定到输入框
import rightclick from '../../../directives/rightcilck'
import rightClick from '../../../mixins/FormRightClick'
import UncertainTable from './inputSelectTab/UncertainTable'
import TecBasTable from './inputSelectTab/TecBasTable'
 
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
  Row
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
Vue.use(TableColumn) */

const defaults = {
  hoho: ''
}
export default {
  name: 'characteristicForm',
  components: {TecBasTable, UncertainTable},
  props: {// 用于接收从父组件中传来的数据
    getParentId: {
      type: Function
    }
  },
  data () {
    return {
      form: $.extend({}, defaults, this.data || {}),
      rules: {
        code: [
          {max: 200, message: '最多输入100个字符', trigger: 'blur'}
        ],
        professionalFiled: [
          {max: 200, message: '最多输入200个字符', trigger: 'blur'}
        ],
        filedCode: [
          {max: 200, message: '最多输入200个字符', trigger: 'blur'}
        ],
        name: [
          {type: 'string', required: true, message: '参量名称'},
          {max: 100, message: '最多输入200个字符', trigger: 'blur'}
        ],
        nameE: [
          {max: 100, message: '最多输入200个字符', trigger: 'blur'}
        ],
        measureRange: [
          {max: 400, message: '最多输入200个字符', trigger: 'blur'}
        ],
        measureRangeE: [
          {max: 400, message: '最多输入200个字符', trigger: 'blur'}
        ],
        limit: [
          {max: 400, message: '最多输入200个字符', trigger: 'blur'}
        ],
        limitE: [
          {max: 400, message: '最多输入200个字符', trigger: 'blur'}
        ],
        remark: [
          {max: 400, message: '最多输入200个字符', trigger: 'blur'}
        ]
        // 校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
        //          name: [{type: 'string', required: true, message: '角色名称不能为空'}],
        //          description: [{type: 'string', required: true, message: '角色描述不能为空'}]
      },
      loading: false,
      tableData: [],
      tecBasIds: null,
      uncertainties: [{}]
    }
  },
  mounted () {
    // 页面渲染完成后，ajax请求加载数据
    this.remoteMethod()
  },
  directives: {rightclick},
  mixins: [rightClick],
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

          let tempArr = this.$refs.uncertainTab.getTableData()
          if (tempArr && tempArr.length > 0) {
            this.form.uncertaintyArr = JSON.stringify(tempArr)
          }
          let tecBasIds = this.$refs.tecBasTable.getTecBasIds()
          if (tecBasIds && tecBasIds != '') {
            this.form.tecBasIds = tecBasIds
          }
          this.form.cnasId = this.getParentId()
          this.$confirm('确认保存?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ajaxRequest(httpMethod, 'back/characteristic/', this.form, (res) => {
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
      this.uncertainties = [{}]
      this.tecBasIds = null
      this.$nextTick(() => {
        this.$refs.uncertainTab.remoteMethod()
        this.$refs.tecBasTable.remoteMethod()
      })
      this.getTableList()
    },
    remoteMethod () {
      // -- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
      this.loading = true
      if (this.getParentId() && this.getParentId() != '') {
        this.getTableList()
      }
    },
    getTableList () {
      ajaxRequest('get', 'back/characteristic/list', {cnasId: this.getParentId()}, (res) => {
        if (res.code === 200) {
          this.tableData = res.rows
        }
      })
    },
    handleEdit (row) {
      ajaxRequest('get', 'back/characteristic/', {id: row.id}, (res) => {
        this.setCancel()
        if (res.code === 200) {
          this.form = res.daoResult
          if (this.form.uncertainties && this.form.uncertainties.length > 0) {
            this.uncertainties = this.form.uncertainties
            delete this.form.uncertainties
          } else {
            this.uncertainties = [{}]
          }
          if (this.form.tecBasIds && this.form.tecBasIds != '') {
            this.tecBasIds = this.form.tecBasIds
          } else {
            this.tecBasIds = null
          }
          this.$nextTick(() => {
            this.$refs.uncertainTab.remoteMethod()
            this.$refs.tecBasTable.remoteMethod()
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
        ajaxRequest('PUT', 'back/characteristic/list/' + row.id, { isDelete: 1 }, (res) => {
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
