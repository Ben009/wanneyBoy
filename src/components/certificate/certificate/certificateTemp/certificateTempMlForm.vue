<template>
  <mind-dialog
    :title="!!data.mlId?'重命名':'新增'"
    :visible="true"
    width="30%"
    center
    v-dialogDrag
    @close="handleCancel">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <!--<el-col :span="12">-->
            <!--<el-form-item label="主键" prop="mlId">-->
              <!--<el-input  v-model="form.mlId"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="22">
            <el-form-item :label="form.isParent == 1 ?'目录名称':'模板名称'" prop="mlName">
              <el-input  v-model="form.mlName"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
            <el-button @click="handleCancel">取 消</el-button>
      </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../../util/base';
  import $ from 'jquery';

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
    name: "layout",
    props: {
      data: {
        type: Object
      },
      callback: {
        type:Function,
        required:true
      }
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          mlName: [{type: 'string', required: true, message: '目录名称不能为空'}],
        },
        loading: false,
        remoteOptions: [],
      }
    },
    mounted() {
      this.remoteMethod();
    },
    methods: {
      handleSubmit() {
        let _this=this;
        console.log(this.$refs.form,'form');
        this.$refs.form.validate((valid) => {
          if (valid) {
            //如果是文件夹就传 W、模板就传 M
            if(!_this.form.mlId){
              //文件夹
              if(_this.form.isParent=='1'){
                _this.form.actionType = "目录添加" ;
                ajaxRequest('post',"back/certificateTemp/addCertificateTempMl",_this.form,function(res){
                  if(res.code == 200){
                    _this.$message.success('添加成功');
                    _this.callback(res.daoResult,"W","add");
                  }else {
                    _this.$message.error('添加失败');
                  }
                },'unicode');
              }
              //模板
              else if(_this.form.isParent=='0'){
                //把form 转一下，转成模板的对象
                var subForm = {};
                subForm.mlId = _this.form.mlIdParent;
                subForm.mbName = _this.form.mlName;
                subForm.actionType = "模板添加" ;
                ajaxRequest('post',"back/certificateTemp/addCertificateTemp",subForm,function(res){
                  if(res.code == 200){
                    console.log(res.daoResult,'res.daoResult')
                    var retForm = {};
                    retForm.mlId = res.daoResult.mbId;
                    retForm.keyMlId = "M"+res.daoResult.mbId;
                    retForm.mlName = subForm.mbName;
                    retForm.isParent = 0 ;
                    retForm.auditFlag = 0 ;
                    retForm.isLeaf = true ;
                    retForm.mlIdParent = res.daoResult.mlId;
                    _this.$message.success('添加成功');
                    _this.callback(retForm,"M","add");
                  }else {
                    _this.$message.error('添加失败');
                  }
                },'unicode');

              }

            }else{
              //把时间字段删掉
              this.dealData(_this.form);
              console.log(this.data.mlName,'mlName')
              if(_this.form.isParent=='1'){
                _this.form.actionType = "目录重命名" ;
                _this.form.actionContent = (this.data.mlName + "->" + _this.form.mlName);
                ajaxRequest('put',"back/certificateTemp/updateCertificateTempMl",_this.form,function(res){
                  if(res.code == 200){
                    _this.$message.success('修改成功','update');
                    _this.callback(_this.form,'W',"update");
                  }else {
                    _this.$message.error('修改失败');
                  }
                },'unicode');
              }
              //模板
              else if(_this.form.isParent=='0'){

                var subForm = {};
                subForm.mbId = _this.form.mlId;
                subForm.mbName = _this.form.mlName;

                subForm.actionType = "模板重命名" ;
                subForm.actionContent = (this.data.mlName + "->" + _this.form.mlName);

                ajaxRequest('put',"back/certificateTemp/updateCertificateTemp4Info",subForm,function(res){
                  if(res.code == 200){
//                    retForm.mlId = _this.form.mbId;
//                    retForm.keyMlId = "M"+_this.form.mbId;
//                    retForm.mlName = _this.form.mbName;
//                    retForm.isParent = false ;
//                    retForm.isLeaf = true ;
//                    retForm.mlIdParent = _this.form.mlId;
                    _this.$message.success('修改成功','update');
                    _this.callback(_this.form,"M","update");
                  }else {
                    _this.$message.error('添加失败');
                  }
                },'unicode');
              }
            }
          } else {
            return false;
          }
        })
      },
      remoteMethod(keyWords) {
        this.loading = true;
        $.ajax();
      },
      handleCancel(){
        this.callback();
      },
      dealData(form){
        //把时间字段删掉
        delete form.addTime;
        delete form.updateTime;
        delete form.deleteTime;
        delete form.enableDate;
        delete form.disableDate;
        delete form.backupTime;
        delete form.auditSubmitTime;
        delete form.auditOneTime;
        delete form.auditTwoTime;
        delete form.unAuditSubmitTime;
        delete form.unAuditOneTime;
        delete form.unAuditTwoTime;
        delete form.jdTime;
        delete form.hyTime;
        delete form.pzTime;
        delete form.folderClearTime;
        delete form.printTime;
        delete form.pdfTime;
        delete form.enableDate;
        delete form.disableDate;
        delete form.zsjdrq;
        delete form.zsyxrq;
        delete form.dataDate1;
      },
    },
  }
</script>

<style>
</style>
