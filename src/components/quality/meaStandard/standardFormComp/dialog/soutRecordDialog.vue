<template>
  <mind-dialog title='编辑使用记录 ' :visible='true' dialogSize="mini" center v-dialogDrag @close="back" >
    <el-form :model="form" label-width="100px" ref="form" :rules="rules" labelWidth="150px">
    <el-form-item label="证书使用日期" prop="contacter"  >
      <el-date-picker
        v-model="form.zsJdrq"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
      <el-form-item label="证书使用人" prop="zsUser"  >
        <el-input v-model="form.zsUser"></el-input>
      </el-form-item>
      <el-form-item label="检定地点" prop="jddd"  >
        <el-input v-model="form.jddd"></el-input>
      </el-form-item>
      <el-form-item label="证书编号" prop="zsbh"  >
        <el-input v-model="form.zsbh"></el-input>
      </el-form-item>
      <el-form-item label="使用前状态" prop="beforeStatus"  >
        <el-select v-model="form.beforeStatus">
          <el-option v-for="item in statusOption" :value="item.value" :label="item.remark">
          </el-option>
        </el-select>
        <!--<el-input v-model="form.beforeStatus"></el-input>-->
      </el-form-item>
      <el-form-item label="使用后状态" prop="afterStatus"  >
        <!--<el-input v-model="form.afterStatus"></el-input>-->
        <el-select v-model="form.afterStatus">
          <el-option v-for="item in statusOption" :value="item.value" :label="item.remark">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检定员电子签名地址" prop="address"  >
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark"  >
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <div style="display: block; text-align: center;margin:20px 0">
      <el-button type="primary" @click="handleEdited()">保 存</el-button>
      <el-button @click="back">返 回</el-button>
    </div>
  </mind-dialog>
</template>
<script>
  import $ from 'jquery'
  import {ajaxRequest} from '../../../../util/base'
  export default{
    name: 'soutRecordDialog',
    props: {
      data:{
        type:Object,
        required:true,
      }
    },
    data() {
      return {
        form: $.extend({}, this.data),
        statusOption:[{value:"0",remark:'正常'},{value:"1",remark:'不正常'}],
        rules:{},
      }
    },
    methods: {
      back(){
        this.$emit('back')
      },
      handleEdited() {
        ajaxRequest('put','back/mStandard/updateMStandardRecord',this.form,res=>{
          if(res.code === 200){
            this.$message.success('保存成功！')
            this.back()
          }
        })
      }
    }
  }
</script>
