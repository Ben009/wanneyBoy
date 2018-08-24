<template>
  <mind-dialog
    :title="!!data.id?'编辑业务组':'新增业务组'"
    :visible="true"
    dialogSize="mini"
    center
    v-dialogDrag
    @close="handleCancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
          <el-Row>
              <el-col :span="24">
              <el-form-item label="业务组" prop="businessArea">
                        <el-input v-model="form.businessArea" v-rightclick="handleRightClick.bind(this,form,'businessArea')"></el-input>
              </el-form-item>
              </el-col>

            <el-col :span="24">
              <el-form-item label="部门" prop="departId">
                <el-select v-model="form.departId"  v-rightclick="handleRightClick.bind(this,form,'departName')"
                           placeholder="请选择" @change="departEvt">
                  <el-option 
                    v-for="item in depart"
                    :key="item.departId"
                    :label="item.departName"
                    :value="item.departId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

              <el-col :span="24">
              <el-form-item label="负责人" prop="charge">
                <el-select v-model="form.charge"  v-rightclick="handleRightClick.bind(this,form,'charge')"
                           placeholder="请选择" @change="chargeEvt">
                  <el-option  
                    v-for="item in charges"
                    :label="item.staffName"
                    :value="item.staff">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>



            <el-col :span="24">
              <el-form-item  prop="bankId">
                <template slot="label">
                  <span>银行账号</span>
                  <el-tooltip content="用于报价系统业务组的默认银行账号">
                    <i class="el-icon-info fS12"></i>
                  </el-tooltip>
                </template>
                <el-select
                  placeholder="请选择"
                  value-key="name"
                  v-model="form.bankId"
                  style="width:100%;"
                >
                  <el-option 
                    v-for="item in bankIds"
                    :key="item.accountId"
                    :label="item.accountName"
                    :value="item.accountId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="合同抬头" prop="contractHead">
                <template slot="label">
                  <span>合同抬头</span>
                  <el-tooltip content="用于该业务组的报价单编号或合同编号的首字母">
                    <i class="el-icon-info fS12"></i>
                  </el-tooltip>
                </template>
                <el-input  v-model="form.contractHead" v-rightclick="handleRightClick.bind(this,form,'contractHead')"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input  v-model="form.remark" v-rightclick="handleRightClick.bind(this,form,'remark')"></el-input>
              </el-form-item>
            </el-col>
          </el-Row>
      </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </mind-dialog>
</template>

<script>
  import Vue from 'vue';

  import {ajaxRequest} from '../../util/base';
  import $ from 'jquery';
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';





  const defaults = {
    // hoho:'',
    // charge:1,
    // bankId:2
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
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          businessArea: [{type: 'string', required: true, message: '业务区域不能为空'},
          {max:40,message:'最多输入40个字符'}],
          departId: [{type: 'integer', required: true, message: '部门不能为空'}],
          charge: [{type: 'integer', required: true, message: '负责人不能为空'}],
          bankId: [{type: 'string', required: true, message: '银行账号不能为空'}],
          contractHead: [{type: 'string', required: true, message: '合同抬头不能为空'},
          {max: 5,message:'最多输入5个字符',trigger:'blur'}],
          remark:[{type:'string',max:100,message:'最多输入100个字符',trigger:'blur'}]
          },
        loading: false,
        remoteOptions: [],
        depart: [],
        charges:"",
        bankIds: []
      }
    },
    mounted() {
      this.remoteMethod();
      this.listAccount();
      if(this.data.bankId){
        Vue.set(this.form, 'bankId', this.data.bankId + '');
      }
      ajaxRequest('get', 'back/businessStaff/getDepart', {}, function (res) {
        this.depart = res
        if(this.form.departId){
          this.departEvtInit(this.form.departId);
        }
      }.bind(this))
    },

    directives:{ rightclick },
    mixins:[rightClick],
    methods: {
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // ajaxRequest('post',"/back/businessGroup/",this.form,function(res){
            //     if(res.code === 200){
            //         this.$message.success('编辑成功');
            //     }
            // });
            this.callback(this.form);
          } else {
            return false;
          }
        })
      },
      // 查询银行账号
      listAccount() {
        ajaxRequest('get', 'back/quotation/listAccount', {}, (res) => {
          this.bankIds = res.rows
        })
      },
      departEvt(id) {
        this.depart.forEach((data) => {
          if (id == data.departId) {
            Vue.set(this.form,'departName',data.departName);
          }
        });

          if (id) {
            ajaxRequest('get', 'back/businessStaff/getStaff'+'?departId='+id, {},(res)=> {
              this.charges = res;
              Vue.set(this.form,'charge','');
            })
          }
      },
      departEvtInit(id) {
        if (id) {
          ajaxRequest('get', 'back/businessStaff/getStaff'+'?departId='+id, {},(res)=> {
            this.charges = res;
            Vue.set(this.form,'charge',this.form.charge);
          })
        }
      },

      // changeDepartEvt(orgId){
      //   //部门下拉事件,根据部门ID获取岗位
      //   if(orgId){
      //     ajaxRequest('get', 'back/post/listByDeptId/'+orgId , {},(res)=>{
      //       this.postIds = res.rows;
      //       //每次选择一级，自动清空二级
      //       Vue.set(this.form, 'postId', '');
      //     })
      //   }
      // },

      chargeEvt(id) {
        this.charges.forEach((data) => {
          if (id == data.staff) {
            Vue.set(this.form,'charge',data.staff);
            Vue.set(this.form,'chargeName',data.staffName);
          }
        });
      },


      handleCancel() {
        this.callback();
      },
      remoteMethod(keyWords) {
        this.loading = true;
        $.ajax();
      },

    },
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
  .fS12{
    font-size: 12px !important;
  }
</style>
