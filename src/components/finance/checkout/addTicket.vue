<template>
  <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
  <el-form ref="form" :model="form" :rules="rules" label-width="140px">
    <div style="margin-top: 10px;border: dashed red 1px">
      <el-Row>
        <el-col :span="12">
          <el-form-item prop="ticketHead">
            <template slot = "label">
              <span>发票抬头</span>
              <el-tooltip class="item" effect="dark" content="如需开具多张发票点击+，如需删除点击-">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <span>
                <el-input v-model="form.ticketHead">
                <el-button style="padding:7px 7px" slot="append" @click="add" class="el-icon-plus"></el-button>
                <el-button style="padding:7px 7px" slot="append" @click.prevent="del" class="el-icon-minus"></el-button>
              </el-input>
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纳税人识别号" prop="taxCode">
            <el-input v-model="form.taxCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="地址/电话" prop="ticketAddressPhone">
            <el-input v-model="form.ticketAddressPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户行/账号" prop="ticketBankAccount">
            <el-input v-model="form.ticketBankAccount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票号" prop="ticketCode">
            <el-input v-model="form.ticketCode"  style="width:70%"></el-input>
            <el-button type="primary" @click="readTicketCode">读 取</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票金额" prop="ticketMoney">

            <template slot = "label">
              <span>发票金额</span>
              <el-tooltip class="item" effect="dark" content="若单张发票，需与结账金额一致">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input v-model="form.ticketMoney" ></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <br>
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

  const defaults = {
    addTime: new Date(),
  };
  export default {
    name: "add-ticket",
    props: {//用于接收从父组件中传来的数据
      dataindex: {required: true, type: Number},
      data: {type: Object},
      callback: {type: Function},
    },
    data() {
      let ticketMoneyCheck = (rule,value,cb)=>{
        if(value!==""){
          if(value.length>10){
            cb(new Error('最多输入10个字符'))
          }else{
            let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
            if (!regu.test(value)) {
              cb(new Error('发票金额只能输入数字'))
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
        rules: {
          //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
          ticketCode: [{required: true, validator:ticketCodeCheck,trigger:'blur'}],
          ticketMoney: [{required: true,validator:ticketMoneyCheck,trigger:'blur'}],
          ticketHead: [{type:'string',max:100,message:'最多输入100个字符'}],
          ticketAddressPhone: [{type:'string',max:200,message:'最多输入200个字符'}],
          ticketBankAccount: [{type:'string',max:200,message:'最多输入200个字符'}],
          taxCode: [{type:'string',max:20,message:'最多输入20个字符'}]
        },
        checked:false
      }
    },
    computed: {
      form() {//父子组件开票信息绑radioIndex定
        return this.data
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
        ajaxSyncRequest('get','back/ticket/checkRepeatTicketCode',{ticketCode:this.form.ticketCode},(res)=>{
          if(res.code===200){
            if(res.total===1){
              this.$confirm('发票号已存在，确认重复使用该发票号?', '提示', {
                confirmButtonText: '使用',
                cancelButtonText: '不使用',
                type: 'warning'
              }).then(() => {
                Cookies.set('cookies-ticketCode', this.form.ticketCode);
              }).catch(() => {
                this.form.ticketCode = "";
              })
            }else{
              Cookies.set('cookies-ticketCode', this.form.ticketCode);
            }
          }
        });*/
      }
    },
    components: {
    },
    mounted() {

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
  .ft12{
    font-size: 12px;
  }
  .custom-1d74b7 .el-input-group__append, .custom-1d74b7 .el-input-group__prepend{
    width: 10px !important;
  }
</style>
