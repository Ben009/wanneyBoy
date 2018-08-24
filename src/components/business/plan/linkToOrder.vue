<template>
  <mind-dialog title="关联委托单" :visible="true" dialog-size="mini" center v-dialogDrag @close="handleCancel" appendToBody="true">
    <el-form ref="form" :model="form"  label-width="100px">
      <el-row>
        <el-col :sm="16">
          <el-form-item label="委托单号" prop="orderNo">
            <el-radio-group v-model="form.orderNo">
              <el-radio v-for="order in orderArr" :label="order">{{order}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="handleSubmit">确定</el-button>
      <el-button type="warning" size="mini" @click="handleCancel">关闭</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from "vue";

  import $ from "jquery";
  import {ajaxRequest, formatDate, ajaxProxyRequest} from "../../util/base";

/*   import {
    Button,
    Table,
    TableColumn,
    Form,
    Row,
    Col,
    FormItem
  } from "element--ui";
  Vue.use(Button); 
  Vue.use(Table);
  Vue.use(TableColumn); 
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Row);
  Vue.use(Col); */

  const defaults = {
  }
  export default {
    name: "link-to-order",
    props: {
      data: {
        type: Object,
      },
      callback: {
        type: Function,
        required: true
      },
      orderArr:{
        type:Array,
        required:true,
      }
    },
    data() {
      return {
        form:$.extend({}, defaults, this.data||{}),
      };
    },
    created() {
    },
    mounted() {
    },
    methods: {
      //修改
      handleSubmit() {
        this.callback(this.form);
      },
      handleCancel() {
        this.callback(null);
      },
    }
  };
</script>

<style scoped>
</style>
