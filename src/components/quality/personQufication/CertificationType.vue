<template>
  <mind-dialog :title="!!postInfo.id?'编辑证件类别':'新增证件类别'" :visible="true"  width="650px" center v-dialogDrag  @close="handleCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">

      <!--<el-form-item label="日期">-->

      <!--<el-date-picker-->
      <!--v-model="form.date"-->
      <!--type="date"-->
      <!--size="small"-->
      <!--placeholder="选择日期">-->
      <!--</el-date-picker>-->
      <!--</el-form-item>-->


      <el-form-item label="证件类别" prop="certificationType">
        <el-input type="text" v-model="form.certificationType" ></el-input>
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
      postInfo:{
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
        form:$.extend({},defaults,this.postInfo),
        rules:{
          certificationType:[{type: 'string', required: true, message: '证件类别不能为空', trigger: 'blur'},
            {max: 100, message: '最多输入100个字符', trigger: 'blur'}],
          remark:[{max: 200, message: '最多输入200个字符', trigger: 'blur'}]
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
