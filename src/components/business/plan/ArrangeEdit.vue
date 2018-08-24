<template>
  <mind-dialog
    :title="'安排信息'"
    :visible="true"
    width="1000px"
    center
    v-dialogDrag
    @close="handleCancel">
      <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
          <el-Row>
              <el-col :span="24">
              <el-form-item label="总单编号" prop="totalListNumber">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.totalListNumber" v-rightclick="handleRightClick.bind(this,form,'totalListNumber')"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="10">
              <el-form-item label="是否自排" prop="isSelfarrange">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                <el-radio-group v-model="form.isSelfarrange">
                  <el-radio :label="1" >是</el-radio>
                  <el-radio :label="0" :value="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              </el-col>
              <el-col :span="14">
              <el-form-item label="计划时间" prop="planTime">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.planTime" v-rightclick="handleRightClick.bind(this,form,'planTime')"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="24">
                <e-form inline></e-form>
                    <el-form-item label="带队人" prop="leader">
                      <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                      <el-input v-model="form.leader" v-rightclick="handleRightClick.bind(this,form,'leader')"></el-input>
                      <el-input v-model="form.vehicle" v-rightclick="handleRightClick.bind(this,form,'vehicle')"></el-input>
                    </el-form-item>
                  </el-col>

              <el-col :span="6">
              <el-form-item label="车辆情况" prop="vehicle">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.vehicle" v-rightclick="handleRightClick.bind(this,form,'vehicle')"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="18">
              <el-form-item label="司机" prop="driver">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.driver" v-rightclick="handleRightClick.bind(this,form,'driver')"></el-input>
                <el-input v-model="form.vehicle" v-rightclick="handleRightClick.bind(this,form,'vehicle')"></el-input>
              </el-form-item>
              </el-col>
              <el-col :span="24">
              <el-form-item label="备注" prop="explain">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.explain" v-rightclick="handleRightClick.bind(this,form,'explain')"></el-input>
              </el-form-item>
              </el-col>

          </el-Row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <!-- 绑定form提交事件-->
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
      <el-button @clikc="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';

  // 引入封装的ajax控件
  import {ajaxRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import ElRow from "@/common-el/packages/row/src/row";



/*   import {
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
    Select
  } from 'element--ui';
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(RadioGroup);
  Vue.use(Radio);
  Vue.use(CheckboxGroup);
  Vue.use(Checkbox); */
  
  
  const defaults = {
    hoho:''
  };
  export default {
    components: {ElRow},
    name: "arrangeForm",
    props: {//用于接收从父组件中传来的数据
      data: {
        type: Object
      },
      callback: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
//校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
//          name: [{type: 'string', required: true, message: '角色名称不能为空'}],
//          description: [{type: 'string', required: true, message: '角色描述不能为空'}]
        },
        loading: false,
        remoteOptions: [],
      }
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
    },
    directives:{ rightclick },
    mixins:[rightClick],
    methods: {//方法定义
      handleSubmit() {
      //-- 表单提交处理 --
        this.$refs.form.validate((valid) => {//校验成功则回调提交数据
          if (valid) {
                  var httpMethod;//http请求方式
            if(!this.form.id||this.form.id==''){//新增 注意:通过id是否存在来判断是新增还是编辑
                httpMethod = 'post';
            }else {//更新
                httpMethod = 'put';
            }
              ajaxRequest(httpMethod, "back/arrange/", this.form, (res)=> {
                  if(res.code == 200){
                      this.$message.success('提交成功');
                  }
              });
          }else{
            return false;
          }
        })
      },
      remoteMethod() {
      //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        this.loading = true;
      },
      handleCancel() {
        this.callback();
      }

    },
  }
</script>

<style>
   <!-- 右键菜单样式设置 -->
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
