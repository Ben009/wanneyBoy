<!-- 申请折扣  -->
<template>
  <div>
    <mind-dialog :title="'折扣申请'" :visible="true" dialog-size="mini" center v-dialogDrag @close="handleCancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="70px">

        <el-row>
          <el-col :span="24">
            <el-form-item label="应收价格" prop="applyDiscount">
              <el-input v-model="receivablePrice" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="折后价格" prop="applyDiscount">
              <el-input v-model="actualPrice" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="折扣" prop="applyDiscount">
              <el-input v-model="form.applyDiscount" disabled  ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="原因" prop="applyRerson">
              <el-input type="text" v-model="form.applyRerson"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display: block;  text-align: center;">
            <el-button type="primary" @click="handleSubmit">提 交</el-button>
            <el-button @click="handleCancel">取 消</el-button>
      </span>

    </mind-dialog>
  </div>

</template>

<script>
  import Vue from 'vue'
  export default {
    name: "applyDiscounts",
    data() {
      return {
        rules:{
          applyRerson:[{required: true, message: '原因不能为空'}]
        },
        form: {}
      }
    },
    props: {
      discount: {
        type: Number
      },
      receivablePrice:{
        type:Number
      },
      actualPrice:{
        type:Number
      },
      callback: {
        type: Function
      }
    },
    mounted() {
      Vue.set(this.form, 'applyDiscount', this.discount);
    },
    methods: {
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if(valid){
            this.callback(this.form);
          }
        })
      },
      handleCancel() {
        this.callback()
      },
    }
  }
</script>

<style scoped>

</style>
