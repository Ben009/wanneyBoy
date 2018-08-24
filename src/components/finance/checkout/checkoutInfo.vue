<template>
  <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
  <el-form ref="form" :model="form" :rules="rules" label-width="140px">
    <div style="margin-top: 10px;border: dashed 1px red">
      <el-Row>
        <el-col :span="24" v-if="this.isDetail =='0'">
          <el-form-item label="保存单位开票信息">
            <el-checkbox @change="doStore()" v-model="checked"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="票种" prop="ticketType">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.ticketType"
              :disabled="this.isDetail =='1'" style="width: 100%">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="(item,index) in ticketType"
                :key="index"
                :label="item.remark"
                :value="item.code*1">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预付款方式" prop="checkWay">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.checkWay"
              :disabled="this.isDetail =='1'" style="width: 100%">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="(item,index) in checkWay"
                :key="index"
                :label="item.remark"
                :value="item.code*1"
                >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票抬头" prop="ticketHead">
            <el-input v-model="form.ticketHead" :disabled="this.isDetail =='1'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纳税人识别号" prop="taxCode">
            <el-input v-model="form.taxCode" :disabled="this.isDetail =='1'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址/电话" prop="ticketAddressPhone">
            <el-input v-model="form.ticketAddressPhone" :disabled="this.isDetail =='1'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户行/账号" prop="ticketBankAccount">
            <el-input v-model="form.ticketBankAccount" :disabled="this.isDetail =='1'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票号" prop="ticketCode">
            <el-input v-model="form.ticketCode"  style="width:65%"></el-input>
            <el-button type="primary" @click="readTicketCode">读 取</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票金额" prop="ticketMoney">
            <el-input v-model="form.ticketMoney" ></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <br>
      <el-row v-if="this.isDetail =='0'">
        <el-col>
          <el-button type="primary"  @click="add">新 增</el-button>
          <el-button type="warning"  @click="del">删 除</el-button>
        </el-col>
        <el-col>
          &nbsp;
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
  import Cookies from 'js-cookie';
  import Vue from 'vue';
  // 引入封装的ajax控件
  import {ajaxRequest,ajaxSyncRequest, ajaxProxyRequest} from '../../util/base';
  //引入jquery
  import $ from 'jquery';
  //引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import ElRow from "@/common-el/packages/row/src/row";
  import ElRadio from "@/common-el/packages/radio/src/radio.vue";
  import ElCheckbox from "@/common-el/packages/checkbox/src/checkbox.vue";

  const defaults = {
    addTime: new Date(),
  };
  export default {
    name: "checkoutInfo",
    props: {//用于接收从父组件中传来的数据
      dataindex: {required: true, type: Number},
      data: {type: Object},
      callback: {type: Function},
      isDetail:{type:String},
    },
    data() {
      let ticketMoneyCheck = (rule,value,cb)=>{
        if(!!value){
          if(value.length>10){
            cb(new Error('最多输入10个字符'))
          }else{
            let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
            if (!regu.test(value)) {
              cb(new Error('发票金额只能输入正数'))
            }else{
              cb();
            }
          }
        }else{
          cb(new Error('发票金额不能为空！'))
        }
      };
      let ticketCodeCheck = (rule,value,cb)=>{
        if(!!value){
          if(value.length>50){
            cb(new Error('最多输入50个字符'))
          }else{
            if(this.form.ticketCode=="/"){
              cb();
            }
            ajaxSyncRequest('get','back/ticket/checkRepeatTicketCode',{ticketCode:this.form.ticketCode},(res)=>{
              if(res.code===200){
                if(res.total===1){
                  Cookies.set('cookies-ticketCode', this.form.ticketCode);
                  cb(new Error('发票号已存在，确认使用无需修改'));
                }else{
                  Cookies.set('cookies-ticketCode', this.form.ticketCode);
                  cb();
                }
              }
            });
          }
        }else{
          cb(new Error('发票号不能为空！'))
        }
      };
      return {
        //autoComplete 是否不输入值就可匹配
        rules: {
          //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
          ticketCode: [{required: true, validator:ticketCodeCheck,trigger:'blur'}],
          ticketMoney: [{required: true,validator:ticketMoneyCheck,trigger:'blur'}],
        },
        checked:false
      }
    },
    computed: {
      form() {//父子组件开票信息绑radioIndex定
        return this.data
      },
      ticketType() {
        return this.$store.state.finance.ticketType
      },
      checkWay() {
        return this.$store.state.finance.checkWay
      },
      radioIndex(){
        return this.$store.state.finance.radioIndex
      }
    },
    watch:{
      radioIndex(){
        this.checked = this.dataindex==this.radioIndex? true : false;
      }
    },
    methods: {
      //新增发票区域
      add() {
        this.$emit('selection-change', this.form, this.dataindex, 'add');
      },
      //删除发票区域
      del() {
        this.$emit('selection-change', this.form, this.dataindex, 'delete');
      },
      //票种
      getTicketType() {
        this.$store.dispatch('getTicketType');
      },
      //付款方式
      getCheckWay() {
        this.$store.dispatch('getCheckWay');
      },
      //读取发票号
      readTicketCode() {
        var ticketCode = Cookies.get("cookies-ticketCode");
        if(null==ticketCode || "" == ticketCode){
          this.$message.error("没有检索到历史发票号，无法读入，请手动输入发票号内容");
        }else{
          try{
            var r=ticketCode.match(/^[a-z|A-Z]+/gi);
            var a=ticketCode.match(/\d+$/gi);
            var num=parseInt(a,10);
            var re=num.toString();
            var a=a.toString();
            var zero=(a.toString().substr(0,a.indexOf(re)));
            num=num+1;
            if(zero!=null&&r!=null)
            {
              ticketCode=r+zero+num.toString();
            }
            else if(zero==null)
            {
              ticketCode=r+num.toString();
            }
            else if(r==null)
            {
              ticketCode=zero+num.toString();
            }
            else
            {
              ticketCode=num.toString();
            }
            this.form.ticketCode = ticketCode;
            Cookies.set('cookies-ticketCode', ticketCode);
            this.$refs.form.validate(valid => {});
          }catch (e) {
            this.$message.error("没有检索到历史发票号，无法读入，请手动输入发票号内容");
          }
        }
      },
      doStore(){
        if(this.checked){
          this.$store.commit('RADIO_INDEX',this.dataindex);
        }else{
          this.$store.commit('RADIO_INDEX',-1);
        }
      },
      //验证发票号是否已经存在
      handleblur(){
        /*if(this.form.ticketCode=="/"){
          return;
        }
        ajaxRequest('get','back/ticket/checkRepeatTicketCode',{ticketCode:this.form.ticketCode},(res)=>{
          if(res.code===200){
            if(res.total===1){
              this.$confirm('发票号已存在，确认重复使用该发票号?', '提示', {
                confirmButtonText: '使用',
                cancelButtonText: '不使用',
                type: 'warning'
              }).then(() => {
              }).catch(() => {
                this.form.ticketCode = "";
              })
            }
          }
        });*/
      }
    },
    directives: {rightclick},
    mixins: [rightClick],
    components: {
      ElCheckbox,
      ElRadio,
      ElRow
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.getTicketType();
      this.getCheckWay();
    },

  }
</script>

<style>
  <!--
  右键菜单样式设置

  -->
  .right-click-menu {
    position: fixed;
    border: 1px solid #ccc;
    padding: 2px 0;
    background: #fff;
    width: 100px;
    z-index: 9999;
  }

  .right-click-menu li {
    padding: 3px 10px;
    cursor: default;
    font-size: 14px;
    color: #606266;
  }

  .right-click-menu li:hover {
    color: #409eff;
  }

  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
