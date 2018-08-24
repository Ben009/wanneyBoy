<template>
  <div>
    <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-Row>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称(英)" prop="name_e">
            <el-input v-model="form.nameE"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目类别" prop="type">
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.type">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in types"
                :key="item.code*1"
                :label="item.remark"
                :value="item.code*1">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="维护部门" prop="department">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.department">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in departments"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="认可表中序号" prop="approvalNum">
            <el-input v-model="form.approvalNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开展日期" prop="launchDate">
            <!-- type指定日期类型为date  placeholder显示提示文字 format格式化日期显示效果 value-format格式化日期提交的值,必须与model实体中该字段的时间格式注解一致   -->
            <el-date-picker
              v-model="form.launchDate"
              type="date"
              placeholder="选择日期"
              :picker-options="{disabledDate:disabledLaunchDate}"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="有效日期" prop="effectiveDate">
            <!-- type指定日期类型为date  placeholder显示提示文字 format格式化日期显示效果 value-format格式化日期提交的值,必须与model实体中该字段的时间格式注解一致   -->
            <el-date-picker
              v-model="form.effectiveDate"
              type="date"
              placeholder="选择日期"
              :picker-options="{disabledDate:disabledEffectiveDate}"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="已校准次数" prop="calibrationTimes">
            <el-input-number v-model="form.calibrationTimes" :controls="false" style="width: 100%;" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
    </el-form>
    <span slot="footer" class="dialog-footer" style="display:block;text-align: center;">
      <!-- 绑定form提交事件-->
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button v-show="!this.form.id" @click="setCancel">取 消</el-button>
    </span>

  </div>
</template>

<script>
import Vue from 'vue'

  // 引入封装的ajax控件
import {ajaxRequest, ajaxProxyRequest} from '../../util/base'
// 引入jquery
import $ from 'jquery'

/* import {
  Button,
  Checkbox,
  CheckboxGroup,
  Col,

  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Row,
  Select
} from 'element--ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)


 */
const defaults = {}
export default {
  name: 'cnasForm',
  props: {// 用于接收从父组件中传来的数据
    data: {
      type: Object
    },
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
        name: [
          {type: 'string', required: true, message: '项目名称'},
          {max: 200, message: '最多输入200个字符', trigger: 'blur'}
        ],
        nameE: [
          {max: 200, message: '最多输入200个字符', trigger: 'blur'}
        ],
        approvalNum: [
          {max: 200, message: '最多输入200个字符', trigger: 'blur'}
        ],
        remark: [
          {max: 400, message: '最多输入400个字符', trigger: 'blur'}
        ],
        department: [{required: true, message: '维护部门不能为空', trigger: 'blur'}]
      },
      loading: false,
      remoteOptions: [],
      types: [],
      departments: []
    }
  },
  mounted () {
    // 页面渲染完成后，ajax请求加载数据
    this.remoteMethod()
  },
  methods: {// 方法定义'
    disabledEffectiveDate: function (time) {
      if (this.form.launchDate) {
        return new Date(this.form.launchDate).getTime() > time.getTime()
      }
      return false
    },
    disabledLaunchDate: function (time) {
      if (this.form.effectiveDate) {
        return new Date(this.form.effectiveDate).getTime() < time.getTime()
      }
      return false
    },
    setCancel () {
      this.form = {}
    },
    handleSubmit () {
      // -- 表单提交处理 --
      this.$refs.form.validate((valid) => { // 校验成功则回调提交数据
        if (valid) {
          var httpMethod// http请求方式
          if (!this.getParentId() || this.getParentId() == '') { // 新增 注意:通过id是否存在来判断是新增还是编辑
            httpMethod = 'post'
          } else { // 更新
            httpMethod = 'put'
          }
          this.$confirm('确认保存?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            ajaxRequest(httpMethod, 'back/cnas/', this.form, (res) => {
              if (res.code == 200) {
                this.$message.success('保存成功')
                if (!this.getParentId()) {
                  this.form.id = res.daoResult.id
                  this.callback(res.daoResult.id)
                }
              } else {
                this.$message.error('保存失敗')
              }
            })
          })
        } else {
          return false
        }
      })
    },
    remoteMethod () {
      // -- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
      this.loading = true
      ajaxProxyRequest('get', '/njmind/findParam/cnasType', {}, (res) => {
        this.types = res.list
      })
      ajaxProxyRequest('get', '/njmind/findParam/departmentList', {}, (res) => {
        this.departments = res.list
      })
      if (this.getParentId() && this.getParentId() !='') {
        ajaxRequest('get', 'back/cnas/', {id: this.getParentId()}, (data) => {
          this.form=data.daoResult
        })
      }
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
