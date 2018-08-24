<template>
  <div>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <div class="title-item" style="margin-top: 30px;"><span>注册信息</span></div>
          <el-Row>
            <el-col :span="0">
            <el-form-item label="主键" prop="id">
            </el-form-item>
            </el-col>
            <el-col :span="1">
            <el-form-item label="单位名称:" prop="dwmc">
              {{form.dwmc}}
            </el-form-item>
            </el-col>

            <el-col :span="1">
              <el-form-item label="地址:" prop="dz">
                {{form.dz}}
              </el-form-item>
            </el-col>
          </el-Row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="登录名:" prop="loginName">
                {{form.loginName}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="注册手机:" prop="mobile">
                {{form.mobile}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
            <el-form-item label="组织机构代码:" prop="zzjgdm">
              {{form.zzjgdm}}
            </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="行政区划:" prop="xzqh">
                {{form.xzqhMc}}
              </el-form-item>
            </el-col>


          </el-row>

          <el-row>
            <el-col :span="8">
            <el-form-item label="联系人:" prop="lxr">
              {{form.lxr}}
            </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="联系电话:" prop="dh">
                {{form.dh}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="注册时间:" prop="djsj">
              {{form.djsj | myCurrency}}
            </el-form-item>
            </el-col>

            <el-col :span="8">
            <el-form-item label="来源:" prop="source">
              {{form.source==1?"强检平台":(form.source==2?"公共服务平台":"其他")}}
            </el-form-item>
            </el-col>
          </el-row>

          <el-row>
             <el-col :span="8">
              <el-form-item label="审核状态:" prop="shflag">
                {{form.shflag==-1?"未通过":(form.shflag==0?"未审核":"通过")}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="审核人:" prop="shr">
                {{form.shr}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="审核时间:" prop="shtime">
                {{form.shtime | myCurrency}}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="附件:">
                <div v-for="file in fileList">
                  <a href="javascript:void(0);" @click="showFj(file)" target="_blank">{{file.fileName}}</a>
                </div>
              </el-form-item>
            </el-col>
          </el-Row>

        <div class="title-item" style="margin-top: 30px;"><span>绑定单位</span></div>
        <el-Row>
          <el-col :span="12">
            <el-form-item label="绑定单位:" prop="companyName">
              <el-input v-model="erpCompany.companyName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" style="text-align: center; width:25%;margin-top: 10px;">
            <el-button type="primary" @click="chooseCompany" class="but-yywtd">选择单位</el-button>
          </el-col>

        </el-Row>

        <el-Row style="margin-bottom: 10px">

          <el-col :span="12" style="margin-left:30px;">
            <!-- 复选框 -->
            <el-checkbox v-model="form.isNeedCreate">若该客户为新客户，请选中此按钮。系统自动将该客户添加至单位库中。 </el-checkbox>
          </el-col>

        </el-Row>

        <div class="title-item" style="margin-top: 30px;"><span>审核意见</span></div>
        <el-Row>
            <el-col :span="16">
              <el-form-item label="审核意见:" prop="reason">
                <el-input v-model="form.reason" v-rightclick="handleRightClick.bind(this,form,'reason')"></el-input>
              </el-form-item>
            </el-col>
        </el-Row>
      </el-form>
      <div style="width: 100%;text-align: center">
        <el-button type="primary" :disabled="form.shflag!=0" @click="handleSubmit(1)">同意注册</el-button>
        <el-button type="warning" :disabled="form.shflag!=0" @click="handleSubmit(-1)">退回注册</el-button>
        <el-button @click="handleCancel">返 回</el-button>
      </div>

    <chooseCompanyList v-if="!!choose" :data="choose" :callback="chooseCallback"></chooseCompanyList>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Vuex from 'vuex';
  import vueBus from 'vue-bus';

  import {ajaxRequest, ajaxSyncRequest, formatDate} from "../../util/base";
  import $ from 'jquery';
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';
  import chooseCompanyList from '../register/chooseCompanyList';
  import ElRow from "@/common-el/packages/row/src/row";



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
        type: Function
      }
    },
    data() {
      var validateReason = (rule, value, callback) => {
        if (!this.form.reason && '-1' ==this.form.realShflag ) {
          callback(new Error("请输入审核意见"))
        } else {
          callback();
        }
      };
      var companyNameReason = (rule, value, callback) => {
        if ((!this.form.erpDwId && !this.form.isNeedCreate)&& '1' == this.form.realShflag) {
          callback(new Error("请选择绑定单位"))
        } else {
          callback();
        }
      };

      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
          reason: [{validator: validateReason, trigger: 'blur'}],
          companyName:[{validator: companyNameReason, trigger: 'blur'}]
        },

        fileList :[],
        cmiimsUrl : "",
        loading: false,
        remoteOptions: [],
        choose:null,
        erpCompany:{}
      }
    },
    mounted() {
      this.remoteMethod();
    },
    created () {
      this.getCompanyInfo();
    },
    directives:{ rightclick },
    mixins:[rightClick],
    methods: {
      handleSubmit(shflag) {
        this.form.realShflag = shflag;
        this.$refs.form.validate((valid) => {
          if (valid) {
            let _this=this;

            ajaxRequest('put','back/register/',{id:this.form.id,shflag:this.form.realShflag,reason:this.form.reason,
              erpDwId:this.form.erpDwId,isNeedCreate:this.form.isNeedCreate,dwmc:this.form.dwmc,mobile:this.form.mobile,
            lxr:this.form.lxr,dh:this.form.dh,dz:this.form.dz},function(res){
              if(res.code===200){
                _this.$message.success('审核成功');
                _this.handleCancel();
              }
              else{
                _this.$message.error('审核失败');
              }
            });

          } else {
            return false;
          }
        })
      },
      getCompanyInfo () {
        ajaxRequest('get', 'back/register/getCompanyDetailById', {
          companyId: this.$route.query.id
        }, res => {
          if (res.code === 200) {
            this.form = res.map.register;
            this.fileList = res.map.fileList;
            this.cmiimsUrl = res.map.cmiimsUrl;
            if(this.form.erpDwId){
              this.getErpCompanyInfo();
            }

          }
        })
      },
      getErpCompanyInfo(){
        ajaxRequest('get', 'back/company/'+this.form.erpDwId, {
        }, res => {
          if (res.code === 200) {
            if(res.daoResult){
              this.erpCompany = res.daoResult;
              this.form.companyName = this.erpCompany.companyName;

            }
          }
        })
      },
      remoteMethod(keyWords) {
        this.loading = true;
        $.ajax();
      },
      handleCancel(){
        this.$router.push({
          path:'/admin/58',
        })
      },
      showFj(obj){
        window.open(this.cmiimsUrl+obj.filePath);
      },
      dealDate: function (row, column, cellValue) {
        return formatDate(cellValue, "YYYY-MM-DD");
      },
      chooseCompany(){
        this.choose = true;
      },
      chooseCallback(company){
        if(company){
          this.form.erpDwId = company.id;
          this.form.companyName = company.companyName;
          this.getErpCompanyInfo();
        }

        this.choose = false;
      },

    },
    components:{
      ElRow,
      chooseCompanyList
    },
    filters: {
      myCurrency(myInput) {
        return formatDate(myInput, "YYYY-MM-DD hh:mm:ss");
      },
    }
  }
</script>

<style>
  .right-click-menu{
    position:fixed;
    border:1px solid #ccc;
    padding: 2px 0;
    background:#fff;
    width:100px;
    z-index:9999;
  }
  .right-click-menu li{
    padding:3px 10px;
    cursor:default;
    font-size:14px;
    color:#606266;
  }
  .right-click-menu li:hover{
    color:#409eff;
  }
  ul, li{
    margin:0;
    padding:0;
    list-style:none;
  }
  .custom-1d74b7 .el-col-1 {
  width: 50%;
}
.custom-1d74b7 .el-col-8 {
  width: 25%;
}
@media screen and (max-width:1500px){
  /*.custom-1d74b7 .el-col-1{width: 100%!important;}*/
  .custom-1d74b7 .el-col-8{width: 50%!important;}
}
  .but-yywtd{border:1px solid #3094e0!important; background:none!important;color:#3094e0!important;}
  .but-yywtd:hover{background:#3094e0!important;color:#fff!important;}
</style>
