<template>
  <mind-dialog
    :title="!!data.id?'编辑参数':'新增参数'"
    :visible="true"
    width="500px"
    @close="handleCancel">
  <div>
      <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
    <div style="height:500px;overflow: auto">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-Row>
          <el-form-item label="创建时间" prop="addTime">
            <!-- type指定日期类型为date  placeholder显示提示文字 format格式化日期显示效果 value-format格式化日期提交的值,必须与model实体中该字段的时间格式注解一致   -->
            <el-date-picker
              v-model="form.addTime"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <!--单选 -->
            <el-radio-group v-model="form.status">
              <el-radio :label="0">A</el-radio>
              <el-radio :label="1">B</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="消息标题" prop="title">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.title" v-rightclick="handleRightClick.bind(this,form,'title')"></el-input>
          </el-form-item>
          <el-form-item label="消息内容" prop="content">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.content" v-rightclick="handleRightClick.bind(this,form,'content')"></el-input>
          </el-form-item>
          <el-form-item label="消息类型" prop="category">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.category" v-rightclick="handleRightClick.bind(this,form,'category')"></el-input>
          </el-form-item>
          <el-form-item label="所属业务" prop="bussiness">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.bussiness" v-rightclick="handleRightClick.bind(this,form,'bussiness')"></el-input>
          </el-form-item>
          <el-form-item label="消息发起者用户Id" prop="sourceUserId">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.sourceUserId" v-rightclick="handleRightClick.bind(this,form,'sourceUserId')"></el-input>
          </el-form-item>
          <el-form-item label="目标用户Id" prop="TargetUserId">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.TargetUserId" v-rightclick="handleRightClick.bind(this,form,'TargetUserId')"></el-input>
          </el-form-item>
          <el-form-item label="消息渠道" prop="channel">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.channel" v-rightclick="handleRightClick.bind(this,form,'channel')"></el-input>
          </el-form-item>
          <el-form-item label="目标地址（邮箱地址，手机号等）" prop="targetAddress">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.targetAddress" v-rightclick="handleRightClick.bind(this,form,'targetAddress')"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.memo" v-rightclick="handleRightClick.bind(this,form,'memo')"></el-input>
          </el-form-item>
          <el-form-item label="第三方渠道Id" prop="thirdId">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.thirdId" v-rightclick="handleRightClick.bind(this,form,'thirdId')"></el-input>
          </el-form-item>
          <el-form-item label="保管期限" prop="bgqx">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.bgqx">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in bgqxs"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-Row>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" style="text-align: center">
      <el-button @click="handleCancel">取 消</el-button>
      <!-- 绑定form提交事件-->
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </div>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';

  // 引入封装的ajax控件
  import {ajaxRequest} from '../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入右击事件 可自行绑定到输入框
  import rightclick from '../../directives/rightcilck';
  import rightClick from '../../mixins/FormRightClick';

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
  //声明消息提示控件


  const defaults = {
    hoho:''
  };
  export default {
    name: "messageForm",
    props: {//用于接收从父组件中传来的数据
      data: {
        type: Object
      },
      callback: {
        type: Function
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
         bgqxs:[],
      }
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
      // Vue.set(this.form,'addTime',new Date(this.form.addTime).format('YYYY-MM-DD hh:mm:ss'))
      //Vue.set(this.form,'updateTime',new Date(this.form.updateTime).format('YYYY-MM-DD HH:mm:ss'))
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
            console.log(this.form)
            //delete this.form.addTime
            delete this.form.updateTime
              ajaxRequest(httpMethod, "back/message/", this.form, (res)=> {
                  if(res.code == 200){
                      this.$message.success('提交成功');
                      this.callback(true);
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
        ajaxRequest('get',"back/dictEntry/list?dictTypeId=3",null,(res)=>{
            if(res.code == 200){
                this.bgqxs=res.rows
            }
        });
      },
      handleCancel(){
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
