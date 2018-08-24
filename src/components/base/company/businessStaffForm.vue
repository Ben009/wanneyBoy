<template>
  <mind-dialog
    :title="!!data.id?'编辑业务员':'新增业务员'"
    :visible="true"
    dialogSize="mini"
    center
    v-dialogDrag
    @close="handleCancel">
    <el-row>
            <div class="el-icon-info shuoming"  style="float:right">
               <el-row class="el-sm">
                 <dl style="padding:6px 10px; ">
                <p>单位名称、地址等信息默认为本单位信息。<br>若不一致时，可修改，主要用于报价单</p>
                 </dl>
            </el-row>
            </div>
    </el-row>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="right" style="overflow-x:hidden;">
      <el-Row>
        <!--<el-col :span="24">-->
        <!--<el-form-item  v-show="false" label="业务组ID" prop="businessGroupId">-->
        <!--<el-input v-model="form.businessGroupId" v-rightclick="handleRightClick.bind(this,form,'businessGroupId')"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->

        <el-col :span="24">
          <el-form-item  label="业务组:" prop="businessGroup" width="0" class="form-item">
            <el-select v-model="form.businessGroup"
                       v-rightclick="handleRightClick.bind(this,form,'businessGroup')" @change="businessEvt">
              <el-option
                v-for="item in businessGroupNames"
                :key="item.businessGroup"
                :label="item.businessGroupName"
                :value="item.businessGroup">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>


        <el-col :span="24">
          <el-form-item label="负责人" prop="chargeName">
            <el-input v-model="form.chargeName" :disabled="true" v-rightclick="handleRightClick.bind(this,form,'chargeName')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="业务员所属部门" prop="departName">
            <el-select v-model="form.departId"  v-rightclick="handleRightClick.bind(this,form,'departName')"
                       placeholder="请选择" @change="departEvt">
              <el-option  style="width:363px;"
                v-for="item in depart"
                :key="item.departId"
                :label="item.departName"
                :value="item.departId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>


        <el-col :span="24">
          <el-form-item v-show="false" label="charge" prop="charge">
            <el-input v-model="form.charge"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="业务员" prop="staff">
            <el-select v-model="form.staff"
                       placeholder="请选择">
              <el-option  style="width:363px;"
                v-for="item in staffs"
                :key="item.staff*1"
                :label="item.staffName"
                :value="item.staff*1">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="手机" prop="mobilePhone">
            <el-input v-model="form.mobilePhone"
                      v-rightclick="handleRightClick.bind(this,form,'mobilePhone')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="电话" prop="telephone">
            <el-input v-model="form.telephone" v-rightclick="handleRightClick.bind(this,form,'telephone')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="传真" prop="fax">
            <el-input v-model="form.fax" v-rightclick="handleRightClick.bind(this,form,'fax')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="单位名称" prop="companyName">
            <el-input v-model="form.companyName"
                      v-rightclick="handleRightClick.bind(this,form,'companyName')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" v-rightclick="handleRightClick.bind(this,form,'address')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="form.email" v-rightclick="handleRightClick.bind(this,form,'email')"></el-input>
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




  const defaults = {};

  export default {
    name: "layout",
    props: {
      data: {
        type: Object
      },
      callback: {
        type: Function
      },
    },

    data() {
      let phoneCheck = (rule,value,cb)=>{
        if(value){
          value = value+''
          if(value.length>20){
            cb(new Error('最多输入20个字符'))
          }else{
            let regx=/^[0-9-]*$/g
            if(regx.test(value)){
              cb()
            }else{
              cb(new Error('请输入正确格式'))
            }
          }
        }else{
          cb()
        }
      }
      let emailCheck = (rule, value, callback) => {
        if(!value){
          callback();
        }
        if(typeof value != 'string'){
          value = value + ''
        }
        if(value.length>50){
          cb(new Error('最多输入50个字符'))
        }else{
          let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
          if (value && !reg.test(value)) {
            callback(new Error('请输入正确的邮箱格式'));
          } else {
            callback();
          }
        }
      };
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          staff: [{required: true, message: '业务员不能为空'}],
          businessGroupName: [{required: true, message: '业务组不能为空'}],
          chargeName: [{required: true, message: '负责人不能为空'}],
          telephone:[{type:'string',validator:phoneCheck ,trigger:'blur'}],
          fax:[{type:'string',max:20,message:'最多输入20个字符',trigger:'blur'}],
          mobilePhone:[{type:'string',validator:phoneCheck,trigger:'blur'}],
          email:[{validator:emailCheck,trigger:'blur'}]

        },
        charge: "",
        list: [],
        loading: false,
        states: [],
        staffs: [],
        depart: [],
        remoteOptions: [],
        businessGroupNames: []
      }
    },
    mounted() {
      ajaxRequest('get', 'back/businessStaff/getBusinessGroupName', {}, function (res) {
        this.businessGroupNames = res
      }.bind(this))
      ajaxRequest('get', 'back/businessStaff/getDepart', {}, function (res) {
        this.depart = res
        if(this.form.departId){
          this.departEvt(this.form.departId)
        }
      }.bind(this))
    },

    directives: {rightclick},
    mixins: [rightClick],
    methods: {
      businessEvt(id) {
        this.businessGroupNames.forEach((data) => {
          if (id == data.businessGroup) {
            this.form.businessGroup = data.businessGroup;
            this.form.businessGroupName = data.businessGroupName;
            this.form.chargeName = data.chargeName;
            this.form.charge = data.charge;

          }
        })

      },


      departEvt(id) {
        this.staffs = [];
        this.depart.forEach((data) => {
          if (id == data.departId) {
            this.form.departName = data.departName;
            ajaxRequest('get', 'back/businessStaff/getStaff' + '?departId=' + data.departId, {}, function (res) {
              this.staffs = res;
            }.bind(this))
            return;
          }
        })
      },


      // staffNameEvt(value) {
      //   this.staff.forEach((data) => {
      //     if (value == data.staff) {
      //       this.form.staffName = data.staffName
      //     }
      //   })
      // },
      // remoteMethod1(query) {
      //   if (query !== '') {
      //     this.loading = true;
      //     setTimeout(() => {
      //       this.loading = false;
      //       this.options4 = this.list.filter(item => {
      //         return item.label.toLowerCase()
      //           .indexOf(query.toLowerCase()) > -1;
      //       });
      //     }, 200);
      //   } else {
      //     this.options4 = [];
      //   }
      // },

      renderHeader(h, {column, $index}) {
        /*表格头部自定义渲染  key值必加 隐藏列时需重新渲染头部*/
        /*let property = column.property;
        let currentInfo = paramJson.filter((v)=>{return v.nameCode==property});
        //console.log('aaaa',currentInfo,'序号',$index)
        return (
          <TableColumnHeader key={$index+property} column={column}  handleSearch={this.handleSearch.bind(this)} currentInfo={currentInfo}/>
      )*/

      },
      handleSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.callback(this.form);
          } else {
            return false;
          }
        })
      },
      handleCancel() {
        this.callback();
      },
      // remoteMethod(keyWords) {
      //   this.loading = true;
      //   $.ajax();
      // },

    },

  }
</script>

<style scoped>
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
    .shuoming{border: none!important;color:#56BC4E!important;font-size:16px!important;}
  .shuoming::after{
   content: "";
    width: 35px;
    height: 40px;
    /*background: #fff;*/
    position: absolute;
    z-index: 999;
    /* top: 0; */
    /* left: -65px; */
    margin-left: -16px;

  }

  .el-sm{background: #ffffff;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 7px 33px -9px #969696;
    box-shadow: 1px 7px 33px -9px #969696;
    border: 2px solid #56bc4e8c;
    border-radius: 5px;
    color: dimgrey;
    margin-left: -301px;
    word-break: break-all;
    margin-top: 18px;
    padding: 0px 0px;
    font-size: 14px;
    opacity: 50;
    width: 320px;
    float: right;
    -webkit-transition: all 0.8s;
    transition: all 0.8s;}

 .shuoming .el-sm{
    display: none;-webkit-transition: all 0.8s;transition: all 0.8s;
   }
   .form-item .el-form-item__content{
     margin:100px !important;
   }
   .el-dialog__body{
     overflow-y: hidden !important;
   }
</style>
