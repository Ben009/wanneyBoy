<template>
  <mind-dialog
    title="报告形式修改"
    :visible="true"
    dialogSize="mini"
    center
    v-dialogDrag
    @close="handleCancel">
    <div>
      <el-form ref="form" :model="form"  label-width="100px">
        <el-col :span="22">
          <el-form-item label="单位名称" >
            {{form.companyName}}
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="器具名称" >
            {{form.applianceActualName==null ? form.attachedFee : form.applianceActualName}}
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="报告形式" prop="mlName">
            <el-select
              :popperAppendToBody="false"
              value-key="name"
              v-model="form.certificateType">
              <el-option
                v-for="item in certificateTypes"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item>
            <el-button type="primary" size="mini" @click="modifySjdBgxs">确认修改</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item>
            <el-button type="primary" size="mini" @click="callback">返回</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
  </mind-dialog>
</template>


<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import {ajaxRequest,ajaxProxyRequest } from '../../../util/base';
  import vueBus from 'vue-bus';
  import '../../../util/Base.css'
  import ElCol from "@/common-el/packages/col/src/col";


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


  export default {
    name: "ModifySjdBgxsDialog",
    components:{
      ElCol
      /** 模块对象 import 进来 后的别名  */
    },
    props: {
      callback: {
        type:Function,
        required:true
      },
      registrationNo:{required: true},
      sjdSampleNo:{sjdSampleNo: true},
    },
    data(){
      //rentun中的变量仅针对当前组件有效
      return{
        /** sidtran:"兄弟组件间交互缓存变量",*/
        form :{},
        certificateTypes:[],
      }
    },
    created(){
      this.getCertificateType();
      this.getSjdInfo4CertificateModifySjdBgxs();
    },
    watch:{
    },
    methods:{
      handleCancel(){
        this.callback();
      },
      getSjdInfo4CertificateModifySjdBgxs(){
        ajaxRequest('get',"back/certificateCommon/getSjdInfo4CertificateModifySjdBgxs/"+this.registrationNo+"/"+this.sjdSampleNo ,{},(res) => {
          if(res.code == 200){
            this.form = res.daoResult ;
          }else {

          }
        });
      },
      getCertificateType(){
        ajaxProxyRequest('get',"njmind/findParam/certificateType",null,(res)=>{
          this.certificateTypes=res.list
          console.log(this.certificateTypes)
        });
      },
      modifySjdBgxs(){
        //去除登记号、样品编号 字段，只更新报告形式
        delete this.form.registrationNo;
        delete this.form.sampleBh;
        ajaxRequest('put',"back/entrustSjdSample/" ,this.form,(res) => {
          if(res.code == 200){
            this.$message.success('修改成功');
          }else {
            this.$message.success('修改失败');
          }
          this.callback();
        });
      },
    },
  }
</script>

<style>

</style>
