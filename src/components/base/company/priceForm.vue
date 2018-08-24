<template>
    <mind-dialog :title="!!data.id?'编辑器具特殊价格':'新增器具特殊价格' " :visible='true' dialogSize="mini" center v-dialogDrag @close="handleEdited(false)">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="计量器具库名称" prop="applianceName"  >
             <el-autocomplete
                v-model="form.applianceName"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                value="applianceName"
                value-key="applianceName"
                @select="handleSelect"
                style="width:100%;"
                :debounce="500"
              >
              <template slot-scope="{ item }">
                <!-- <div > -->
                  <el-tooltip>
                    <div>
                      <span class="item">{{ item.applianceName }} </span>|
                      <span class="item">{{ item.applianceRealName }} </span>|
                      <span class="item">{{ item.detecyionFee }} </span>|
                      <span class="item">{{ item.measureRange }} </span>
                    </div>
                    <div slot="content">
                      <span class="itemHover">{{ item.applianceName }} </span>|
                      <span class="itemHover">{{ item.applianceRealName }} </span>|
                      <span class="itemHover">{{ item.detecyionFee }} </span>|
                      <span class="itemHover">{{ item.measureRange }} </span>
                    </div>
                  </el-tooltip>
                <!-- </div> -->
              </template>
            </el-autocomplete>
              <!-- <el-select v-model="form.applianceId" filterable   placeholder="请选择" @change="applianceEvt" style="width: 100%"> -->
              <!-- <el-option
                v-for="item in appliances"
                :key="item.applianceId"
                :label="item.applianceName"
                :value="item.applianceId"
              >
              </el-option> -->
              </el-select>
            </el-form-item>

            <el-form-item label="器具实际名称" prop="applianceRealname">
              <el-input v-model="form.applianceRealname"></el-input>
            </el-form-item>

            <el-form-item label="收费标准" prop="standardPrice">
              <template slot="label">
                  <span>收费标准</span>
                  <el-tooltip content="收费标准禁止修改">
                    <i class="el-icon-info fs12"></i>
                  </el-tooltip>
              </template>
              <el-input :readonly="true" v-model="form.standardPrice"></el-input>
            </el-form-item>

            <el-form-item label="型号规格" prop="model">
              <el-input v-model="form.model"></el-input>
            </el-form-item>

            <el-form-item label="测量范围" prop="measureRange">
              <el-input v-model="form.measureRange"></el-input>
            </el-form-item>

            <el-form-item label="特殊价格" prop="specialPrice">
              <template slot="label">
                  <span>特殊价格</span>
                  <el-tooltip content="该器具针对该单位的收费标准">
                    <i class="el-icon-info fs12"></i>
                  </el-tooltip>
              </template>
              <el-input v-model="form.specialPrice"></el-input>
            </el-form-item>

            <el-form-item label="特殊价格说明" prop="specialPriceExplain">
              <el-input v-model="form.specialPriceExplain"></el-input>
            </el-form-item>

      </el-form>
      <div style="display: block; text-align: center;margin:20px 0">
        <el-button type="primary" @click="handleEdited(true)">保 存</el-button>
        <el-button @click="handleEdited(false)">{{!!data.id?'返 回':'取 消'}}</el-button>
      </div>
    </mind-dialog>
</template>
<script>
import $ from 'jquery'
import Vue from 'vue'
import { ajaxRequest, ajaxSyncRequest } from "../../util/base";
export default {
    name:'price-form',
    props:{
        data:{
          type:Object,
          required:true
        },
        callBack:{
          type:Function,
          required:true
        },
        // appliances:{
        //   type:Array,
        //   required:true
        // }
    },
    data(){
      let standardCheck = function(rule,value,cb){
        let reg = /^[0-9.]*$/g
        if(!!value){
          if(typeof value != String){
            value = value + '';
          }
          if(value.length>10){
            cb(new Error('最多输入15个字符'))
          }else{
            let arr = value.split('.')
            if(arr.length>2){
              cb(new Error('请输入正确格式数字'))
            }
            if(reg.test(value)){
              cb()
            }else{
              cb(new Error('请输入数字'))
            }
          }
        }else{
          cb(new Error(`特殊价格不能为空！`))
        }
      }
      let nameCheck = (rule,value,cb)=>{
        if(!value){
          cb(new Error('器具名称不能为空！'))
        }
        if(!!this.form.applianceId){
          if(this.applianceName != this.form.applianceName){
            cb(new Error('必须选用给定的数据！'))
          }else{
            cb()
          }
        }else{
          cb(new Error('必须选用给定的数据！'))
        }
      }
      let priceCheck = (rule,value,cb)=>{
        if(!!value){
          if(value.length>100){
            cb(new Error('字符长度不能超过100!'))
          }else{
            cb()
          }
        }else{
            cb(new Error('特殊价格不能为空！'))
        }
      }
      let standardPriceCheck = (rule,value,cb)=>{
        if(value){
          if(value.length>20){
            cb(new Error('最多输入20个字符'))
          }else{
            let regx = /^[0-9.]*$/g
            if(regx.test(value)){
              cb()
            }else{
              cb(new Error('请输入纯数字'))
            }
          }
        }else{
          cb(new Error('收费标准不能为空'))
        }
      }
        return {
        form:$.extend({},this.data),
        applianceName: "",
        rules: {
          applianceName: [
            { type: "string", required: true, validator:nameCheck, trigger:'change'},
          ],
          applianceRealname: [
            { type: "string", required: true, message: "实际名称不能为空!" ,trigger:'blur'}
          ],
          specialPrice: [
            { type: "string", required: true, validator:standardCheck,trigger:'blur'}
          ],
          specialPriceExplain:[{
            type:'string',required:true,message:'说明不能为空',trigger:'blur'
          },{
            max:100,message:'字符长度不能超过100！',trigger:'blur'
          }]
        },
        }
    },
    methods:{
      querySearchAsync(queryString, cb){
        if(!queryString || queryString == undefined || queryString == ''){
          cb([])
        }else{
          ajaxRequest('get','back/companyAppliance/queryAppliance',{applianceName:queryString},res=>{
            console.log(res)
              cb(res)
          })
        }
        // let results = queryString ? this.appliances.filter(this.createStateFilter(queryString)) : this.appliances;
      },

      handleSelect(item){
        this.applianceName = item.applianceName;
        Vue.set(this.form, "applianceId", item.applianceId);
        Vue.set(this.form, "model", item.model);
        Vue.set(this.form, "measureRange", item.measureRange);
        Vue.set(this.form, "standardPrice", item.detecyionFee);
        Vue.set(this.form, "applianceRealname", item.applianceRealName);
      },
      handleEdited(flag){
        if(flag){
          this.$refs.form.validate((valid)=>{
            if(valid){
              this.callBack(this.form);
            }
          })
        }else{
          this.callBack()
        }
      },
      // applianceEvt(id) {
      //   this.appliances.forEach(data => {
      //     if (id == data.applianceId) {

      //     }
      //   });
      // },
    },
    mounted(){
      console.log(this.data,'data')
      console.log(this.form,'form')
      if(!!Object.keys(this.data).length){
        this.applianceName = this.data.applianceName;
        Vue.set(this.form, "applianceId", this.data.applianceId);
        Vue.set(this.form, "model", this.data.model);
        Vue.set(this.form, "measureRange", this.data.measureRange);
        Vue.set(this.form, "standardPrice", this.data.standardPrice);
        Vue.set(this.form, "applianceRealname", this.data.applianceRealname);
        alert(this.form,applianceId)
      }
    }
}
</script>
<style scoped>
.fs12{
  font-size: 12px;
}
.item{
  color:#606266;
}
.itemHover{
  color: white;
}
</style>


