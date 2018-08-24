<template>
    <mind-dialog :title='!!data.companyId?"编辑":"新增单位信息" ' :visible='true' dialogSize="mini" center v-dialogDrag @close="handleEdited(null)" >
      <el-form :model="form" label-width="100px" ref="form" :rules="rules">
        <el-form-item label="联系人" prop="contacter"  >
            <el-input v-model="form.contacter"></el-input>
        </el-form-item>
        <el-form-item label="证书单位名称" prop="certificateCompanyName">
          <el-input v-model="form.certificateCompanyName"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="form.telephone"></el-input>
        </el-form-item>
        <el-form-item label="传真" prop="fax"  >
            <el-input v-model="form.fax"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
            <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="上门检测地址" prop="visitTestAddress">
            <el-input v-model="form.visitTestAddress"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div style="display: block; text-align: center;margin:20px 0">
        <el-button type="primary" @click="handleEdited(1)">保 存</el-button>
        <el-button @click="handleEdited(null)">{{!!data.companyId?"返 回":"取 消"}}</el-button>
    </div>
    </mind-dialog>
</template>
<script>
import $ from 'jquery'
export default {
  name: "moreInfoForm",
  props: {
    data: {
      type: Object,
      required: true
    },
    callBack: {
      type: Function,
      required: true
    }
  },
  data() {
    let lenthCheck = function(rule, value, cb) {
      if (!!!value) {
        cb();
      } else if (value.length > 100) {
        cb(new Error("最多输入100个字符"));
      } else {
        cb();
      }
    };
    let lenthRequiredCheck = function(rule, value, cb) {
      let infoName =
        rule.fullField == "contacter"
          ? "联系人"
          : rule.fullField == "telephone" ? "电话" : "地址";
      if (!!!value) {
        cb(new Error(`${infoName}不能为空!`));
      } else if (value.length > 100) {
        cb(new Error("最多输入100个字符"));
      } else {
        cb();
      }
    };
    let telephoneCheck= (rule,value,cb)=>{
      if(value){
        let reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/g
        let ruleRex = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/g;
        if(value.length>20){
          cb(new Error('最多输入20位字符'))
        }else{
          if(reg.test(value)){
            cb()
          }else{
            if(ruleRex.test(value)){
              cb()
            }else{
              cb(new Error('请输入正确格式'))
            }
          }
        }
      }else{
        cb(new Error('电话不能为空'))
      }
    }
    return {
      rules: {
        contacter: [
          { required: true, validator: lenthRequiredCheck, trigger: "blur" }
        ],
        address: [
          { required: true, validator: lenthRequiredCheck, trigger: "blur" }
        ],
        telephone: [
          { required: true, validator:telephoneCheck, trigger: "blur" }
        ],
        remark: [{ type:'string',max:200,message:'最多输入200个字符', trigger: "blur" }],
        certificateCompanyName: [{ validator: lenthCheck, trigger: "blur" }],
        fax: [
          {
            type: "string",
            max: 100,
            trigger: "blur",
            message: "最多输入100个字符!"
          }
        ],
        visitTestAddress:[
          {type:'string',max:200,message:'最多输入200个字符',trigger:'blur'}
        ]
      },
        form:$.extend({},this.data),
    };
  },
  methods: {
    handleEdited(flag) {
        let that = this
      if (flag) {
          this.$refs.form.validate((valid)=>{
              if(valid){
                  that.callBack(this.form)
              }
          })
      }else{
          that.callBack(null)
      }
    }
  },
  mounted(){
  }
};
</script>
<style scoped>
</style>


