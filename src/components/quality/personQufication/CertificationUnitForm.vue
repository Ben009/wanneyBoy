<template>
  <mind-dialog :title="!!departInfo.id?'编辑发证单位':'新增发证单位'" :visible="true"  width="650px" center v-dialogDrag  @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">

      <!--<el-form-item label="日期">-->

      <!--<el-date-picker-->
      <!--v-model="form.date"-->
      <!--type="date"-->
      <!--size="small"-->
      <!--placeholder="选择日期">-->
      <!--</el-date-picker>-->
      <!--</el-form-item>-->


      <el-form-item label="发证单位" prop="unit">
        <el-input type="text" v-model="form.unit" ></el-input>
      </el-form-item>


      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" ></el-input>
      </el-form-item>

      <el-form-item label="排序" prop="orderNum" >
        <el-select  v-model="form.orderNum">
          <el-option v-for="(n,index) in 30" :value="n" :key="index">{{n}}</el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">保 存</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </span>

  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import $ from 'jquery';


  const defaults={

  };
  export default {
    name: "depart-edit",
    props:{
      departInfo:{
        type:Object,
        required:true
      },
      callback:{
        type:Function,
        required:true
      }
    },
    data() {
      return {
        form:$.extend({},defaults,this.departInfo),
        rules:{
          unit:[{type: 'string', required: true, message: '发证单位不能为空', trigger: 'blur'},
            {max: 100, message: '最多输入100个字符', trigger: 'blur'}],

          remark:[{max: 200, message: '最多输入200个字符', trigger: 'blur'}],
        }
      }
    },
    methods:{
      handleSubmit(){
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.callback(this.form);
          } else {
            return false;
          }
        })
      },
      handleCancel(){
        this.callback();
      }
    },
  }
</script>

<style scoped>

</style>


<!--<template>-->
  <!--<div>-->
    <!--&lt;!&ndash; ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度&ndash;&gt;-->
    <!--<el-form ref="form" :model="form" :rules="rules" label-width="140px">-->
      <!--<el-row>-->
        <!--<el-col :span="8">-->
          <!--<el-form-item label="发证单位" prop="unit">-->
            <!--&lt;!&ndash;单行文本 v-model 绑定数据   &ndash;&gt;-->
            <!--<el-input v-model="form.unit"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row>-->
        <!--<el-col :span="8">-->
          <!--<el-form-item label="备注" prop="remark">-->
            <!--&lt;!&ndash;单行文本 v-model 绑定数据   &ndash;&gt;-->
            <!--<el-input v-model="form.remark"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row>-->
        <!--<el-col :span="8">-->
          <!--<el-form-item label="排序" prop="orderNum">-->
            <!--&lt;!&ndash;单行文本 v-model 绑定数据   &ndash;&gt;-->
            <!--<el-input v-model="form.orderNum"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
    <!--</el-form>-->
    <!--<span slot="footer" class="dialog-footer" style="display: block; text-align: center;">-->
      <!--&lt;!&ndash; 绑定form提交事件&ndash;&gt;-->
      <!--<el-button type="primary" @click="handleSubmit">提 交</el-button>-->
      <!--<el-button>取 消</el-button>-->
    <!--</span>-->
  <!--</div>-->




<!--</template>-->

<!--<script>-->
  <!--import Vue from 'vue';-->
  <!--import Vuex from 'vuex';-->
  <!--//&#45;&#45;从element--ui  中引入表单控件-->
  <!--import {-->
    <!--Button,-->
    <!--Checkbox,-->
    <!--CheckboxGroup,-->
    <!--Col,-->
    <!--Dialog,-->
    <!--Form,-->
    <!--FormItem,-->
    <!--Input,-->
    <!--Radio,-->
    <!--RadioGroup,-->
    <!--Row,-->
    <!--Select-->
  <!--} from 'element--ui';-->
  <!--// 引入封装的ajax控件-->
  <!--import {ajaxRequest} from '../../util/base';-->
  <!--//引入jquery-->
  <!--import $ from 'jquery';-->
  <!--//引入右击事件 可自行绑定到输入框-->
  <!--import rightclick from '../../../directives/rightcilck';-->
  <!--import rightClick from '../../../mixins/FormRightClick';-->

  <!--//element--ui引入的组件还需要调用Vue.use-->
  <!---->
  <!--Vue.use(Form);-->
  <!--Vue.use(FormItem);-->
  <!--Vue.use(Input);-->
  <!--Vue.use(Button);-->
  <!--Vue.use(Row);-->
  <!--Vue.use(Col);-->
  <!--Vue.use(RadioGroup);-->
  <!--Vue.use(Radio);-->
  <!--Vue.use(CheckboxGroup);-->
  <!--Vue.use(Checkbox);-->
  <!---->
  <!---->
  <!--//声明消息提示控件-->


  <!--const defaults = {-->
    <!--hoho:''-->
  <!--};-->
  <!--export default {-->
    <!--name: "certificationUnitForm",-->
    <!--props: {//用于接收从父组件中传来的数据-->
      <!--data: {-->
        <!--type: Object-->
      <!--},-->
      <!--callback: {-->
        <!--type: Function-->
      <!--}-->
    <!--},-->
    <!--data() {-->
      <!--return {-->
        <!--form: $.extend({}, defaults, this.data || {}),-->
        <!--rules: {-->
<!--//校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息-->
          <!--unit: [{type: 'string', required: true, message: '发证单位不能为空'}],-->

        <!--},-->
        <!--loading: false,-->
        <!--remoteOptions: [],-->
      <!--}-->
    <!--},-->
    <!--mounted() {-->
      <!--//页面渲染完成后，ajax请求加载数据-->
      <!--this.remoteMethod();-->
    <!--},-->
    <!--directives:{ rightclick },-->
    <!--mixins:[rightClick],-->
    <!--methods: {//方法定义-->
      <!--handleSubmit() {-->
        <!--//&#45;&#45; 表单提交处理 &#45;&#45;-->
        <!--this.$refs.form.validate((valid) => {//校验成功则回调提交数据-->
          <!--if (valid) {-->
            <!--var httpMethod;//http请求方式-->
            <!--if(!this.form.id||this.form.id==''){//新增 注意:通过id是否存在来判断是新增还是编辑-->
              <!--httpMethod = 'post';-->
            <!--}else {//更新-->
              <!--httpMethod = 'put';-->
            <!--}-->
            <!--ajaxRequest(httpMethod, "back/certificationUnit/", this.form, (res)=> {-->
              <!--if(res.code == 200){-->
                <!--this.$message.success('提交成功');-->
              <!--}-->
            <!--});-->
          <!--}else{-->
            <!--return false;-->
          <!--}-->
        <!--})-->
      <!--},-->
      <!--remoteMethod() {-->
        <!--//&#45;&#45; 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改-->
        <!--this.loading = true;-->
      <!--},-->

    <!--},-->
  <!--}-->
<!--</script>-->

<!--<style>-->
  <!--&lt;!&ndash; 右键菜单样式设置 &ndash;&gt;-->
  <!--.right-click-menu{-->
    <!--position:fixed;-->
    <!--border:1px solid #ccc;-->
    <!--padding: 2px 0;-->
    <!--background:#fff;-->
    <!--width:100px;-->
    <!--z-index:9999;-->
  <!--}-->
  <!--.right-click-menu li{-->
    <!--padding:3px 10px;-->
    <!--cursor:default;-->
    <!--font-size:14px;-->
    <!--color:#606266;-->
  <!--}-->
  <!--.right-click-menu li:hover{-->
    <!--color:#409eff;-->
  <!--}-->
  <!--ul, li{-->
    <!--margin:0;-->
    <!--padding:0;-->
    <!--list-style:none;-->
  <!--}-->
<!--</style>-->


