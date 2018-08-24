<template>
  <mind-dialog
    :title="'角色日志'"
    :visible="true"
    :lock-scroll="true"
    center
    v-dialogDrag
    dialogSize="mini"
    @close="handleCancel">
    <div>
        <el-form label-width="80px">
          <el-form-item label="操作时间">
            <el-input :disabled="true" v-model="form.operatingTime">
            </el-input>
          </el-form-item>
          <el-form-item label="操作人">
            <el-input :disabled="true" v-model="form.userName">
            </el-input>
          </el-form-item>
          <el-form-item label="操作类型">
            <el-input :disabled="true" v-model="form.operationType">
            </el-input>
          </el-form-item>
          <el-form-item label="角色名称">
            <el-input :disabled="true" v-model="form.roleName">
            </el-input>
          </el-form-item>
          <el-form-item label="操作内容">
            <el-input :disabled="true"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="form.operationDetail">
            </el-input>
          </el-form-item>
        </el-form>
    </div>
     <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  // 引入封装的ajax控件
  import {ajaxRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  import ElCol from "@/common-el/packages/col/src/col";
  import ElTable from "@/common-el/packages/table/src/table.vue";
  import ElTableBody from "@/common-el/packages/table/src/table-body";
  import ElForm from "@/common-el/packages/form/src/form.vue";
  import ElFormItem from "@/common-el/packages/form/src/form-item.vue";


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
    operatingTime:'',
    userName:'',
    operationType:'',
    roleName:'',
    operationDetail:''
  };
  export default { 
    name: "roleLogForm",
    components: {
      ElFormItem,
      ElForm,
      ElTableBody,
      ElTable,
      ElCol},
    props: {//用于接收从父组件中传来的数据
      logInfo: {
        type: Object
      },
      callback: {
        type: Function
      }
    },
    data() {
      return {
        form: $.extend({}, defaults, this.logInfo || {}),
        loading: false,
        remoteOptions: [],
      }
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
    },
    methods: {//方法定义
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

<style scoped>
  .el-col{
    border: 1px solid gray;border-collapse:collapse;padding-left: 1px;
  }
  .title{
    text-align: right;
    padding-right: 20px;
  }
</style>
