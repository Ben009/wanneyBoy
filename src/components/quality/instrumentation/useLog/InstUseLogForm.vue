<template>
<div>            <!-- :title="!!form.id?'编辑':'新增参数'" -->
    <mind-dialog
            title="编辑"
            center
            v-dialogDrag
            :visible="true"
            dialogSize="mid"
    @close="handleCancel">
      <div>
          <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
          <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                  <el-row>
                    <!-- <el-col :span="8">
                      <el-form-item label="创建日期" prop="addTime">
                                <el-date-picker
                                        v-model="form.addTime"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd">
                                </el-date-picker>
                      </el-form-item>
                    </el-col> -->
                    <el-col :span="8">
                      <el-form-item label="设备状态" prop="status">
                                <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
                                <el-select
                                        placeholder="请选择"
                                        value-key="name"
                                        v-model="form.status">
                                    <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
                                    <el-option
                                            v-for="item in statuss"
                                            :key="item.code"
                                            :label="item.remark"
                                            :value="+item.code">
                                    </el-option>
                                </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="证书有效期" prop="effectiveDate">
                                <!-- type指定日期类型为date  placeholder显示提示文字 format格式化日期显示效果 value-format格式化日期提交的值,必须与model实体中该字段的时间格式注解一致   -->
                                <el-date-picker
                                        v-model="form.effectiveDate"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd">
                                </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="证书编号" prop="zsbh">
                                <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                                <el-input v-model="form.zsbh"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="使用日期" prop="useDate">
                                <!-- type指定日期类型为date  placeholder显示提示文字 format格式化日期显示效果 value-format格式化日期提交的值,必须与model实体中该字段的时间格式注解一致   -->
                                <el-date-picker
                                        v-model="form.useDate"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd">
                                </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="使用地点" prop="useLocation">
                                <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                                <el-input v-model="form.useLocation"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="使用人" prop="usePerson">
                                <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                                <el-input v-model="form.usePerson"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="温度" prop="temperature">
                                <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                                <el-input v-model="form.temperature"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="湿度" prop="humidity">
                                <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                                <el-input v-model="form.humidity"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="其它" prop="other">
                                <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                                <el-input v-model="form.other"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="使用前状态" prop="statusBefore">
                                <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                                <el-input v-model="form.statusBefore"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="使用后状态" prop="statusAfter">
                                <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                                <el-input v-model="form.statusAfter"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="备注" prop="remark">
                                <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                                <el-input v-model="form.remark"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
          </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
        <!-- 绑定form提交事件-->
      </div>
    </mind-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
// --从element-ui  中引入表单控件
// 引入封装的ajax控件
import {ajaxRequest , ajaxProxyRequest} from '../../../util/base'
// 引入jquery
import $ from 'jquery'

// element-ui引入的组件还需要调用Vue.use
// 声明消息提示控件

const defaults = {
  hoho: ''
}
export default {
  name: 'instUseLogForm',
  props: {// 用于接收从父组件中传来的数据
    data: {
      type: Object
    },
    callback: {
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
      statuss: []
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
          let form = this.form;
          if (form.effectiveDate) {
            form.effectiveDate = new Date(form.effectiveDate).format("YYYY-MM-DD");
          }
          if (form.useDate) {
            form.useDate = new Date(form.useDate).format("YYYY-MM-DD");
          }
          ajaxRequest(httpMethod, 'back/instUseLog/', form, (res) => {
            if (res.code == 200) {
              this.$message.success('提交成功')
            }
          })
        } else {
          return false
        }
      })
    },
    remoteMethod () {
      // -- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
      this.loading = true
      ajaxProxyRequest('get', '/njmind/findParams/instrumentationStatus', {}, (res) => {
          this.statuss = res.instrumentationStatus.list
      })
    },
    handleCancel(){
      this.callback();
    }

  }
}
</script>

<style scoped>
  .right-click-menu{
    position:fixed;
    border:1px solid #ccc;
    padding: 2px 0;
    background:#fff;
    width:100px;
    z-index:9999;
  }
  .right-click-menu li{
    padding:3px 10px;
    cursor:default;
    font-size:14px;
    color:#606266;
  }
  .right-click-menu li:hover{
    color:#409eff;
  }
  ul, li{
    margin:0;
    padding:0;
    list-style:none;
  }
</style>
