<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-Row>
        <el-col :span="24">
          <el-form-item label="单位名称" prop="companyName">
            <el-input v-model="form.companyName"
                      v-rightclick="handleRightClick.bind(this,form,'companyName')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="24">
          <el-form-item label-width="125px" label="单位名称（英文）" prop="companyNameEn">
            <el-input v-model="form.companyNameEn"
                      v-rightclick="handleRightClick.bind(this,form,'companyNameEn')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="8">
          <el-form-item label="客户对接部门" prop="companyDepart">
            <el-input v-model="form.companyDepart"
                      v-rightclick="handleRightClick.bind(this,form,'companyDepart')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户负责人" prop="companyCharge">
            <el-input v-model="form.companyCharge"
                      v-rightclick="handleRightClick.bind(this,form,'companyCharge')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮编" prop="postCode">
            <el-input v-model="form.postCode" v-rightclick="handleRightClick.bind(this,form,'postCode')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="8">
          <el-form-item label="客户联系人" prop="contacter">
            <el-input v-model="form.contacter" v-rightclick="handleRightClick.bind(this,form,'contacter')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="form.telephone" v-rightclick="handleRightClick.bind(this,form,'telephone')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号码" prop="mobilePhone">
            <el-input v-model="form.mobilePhone"
                      v-rightclick="handleRightClick.bind(this,form,'mobilePhone')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="1">
          <el-form-item label="行政区划">
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="省" prop="province">
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.province"

              @change="provinceEvt"
            >
              <el-option
                v-for="item in provinces"
                :key="item.provinceIds"
                :label="item.provinceName"
                :value="item.provinceIds">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="市" prop="city">
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.city"

              @change="cityEvt">
              <el-option
                v-for="item in citys"
                :key="item.cityIds"
                :label="item.cityName"
                :value="item.cityIds">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="区" prop="area">
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.area"

            >
              <el-option
                v-for="item in areas"
                :key="item.areaIds"
                :label="item.areaName"
                :value="item.areaIds">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="行业名称" prop="industryValue">
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.industryValue"

            >
              <el-option
                v-for="item in industryValues"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="16">
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" v-rightclick="handleRightClick.bind(this,form,'address')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="传真" prop="fax">
            <el-input v-model="form.fax" v-rightclick="handleRightClick.bind(this,form,'fax')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="16">
          <el-form-item label="地址（英文）" prop="addressEn">
            <el-input v-model="form.addressEn" v-rightclick="handleRightClick.bind(this,form,'addressEn')"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" v-rightclick="handleRightClick.bind(this,form,'email')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="24">
          <el-form-item label="上门特殊要求" prop="visitSpecialRequirement">
            <el-input v-model="form.visitSpecialRequirement"
                      v-rightclick="handleRightClick.bind(this,form,'visitSpecialRequirement')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="16">
          <el-form-item label="证书要求" prop="certificateRequirement">
            <el-input v-model="form.certificateRequirement"
                      v-rightclick="handleRightClick.bind(this,form,'certificateRequirement')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="加盖CNAS章" prop="sealedByCnas">
            <el-radio-group v-model="form.sealedByCnas">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="24">
          <el-form-item label="其他特殊要求" prop="otherSpecialRequirement">
            <el-input type="textarea" v-model="form.otherSpecialRequirement"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="8">
          <el-form-item label="单位类别" prop="companyType">
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.companyType"

            >
              <el-option
                v-for="item in companyTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label-width="125px" label="统一社会信用代码" prop="creditCode">
            <el-input v-model="form.creditCode" v-rightclick="handleRightClick.bind(this,form,'creditCode')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>

        <el-col :span="8">
          <el-form-item label="业务组" prop="businessGroup">
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

        <el-col :span="8">
          <el-form-item label="业务员" prop="businessStaff">
            <el-select v-model="form.businessStaff"  v-rightclick="handleRightClick.bind(this,form,'staffName')"
                       placeholder="请选择" @change="staffEvt">
              <el-option
                v-for="item in staffs"
                :key="item.staff"
                :label="item.staffName"
                :value="item.staff">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="业务提成(%)" prop="businessPromotion">
            <el-input v-model="form.businessPromotion"
                      v-rightclick="handleRightClick.bind(this,form,'businessPromotion')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>

      <el-row>
        <el-col :span="16">
          <el-form-item label="单位资料" prop="attachment">
            <mind-upload  :limitNumb="limitNumb" :callBack="callBack"  ></mind-upload>
            <!-- <el-input v-model="form.attachment" v-show="show"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title-item"><span>开票信息</span></div>
      <el-Row>
        <el-col :span="8">
          <el-form-item label="名称" prop="invoiceCompany">
            <el-input v-model="form.invoiceCompany"
                      v-rightclick="handleRightClick.bind(this,form,'invoiceCompany')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="纳税人识别号" prop="taxNo">
            <el-input v-model="form.taxNo" v-rightclick="handleRightClick.bind(this,form,'taxNo')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="地址、电话" prop="invoiceAddressTel">
            <el-input v-model="form.invoiceAddressTel"
                      v-rightclick="handleRightClick.bind(this,form,'invoiceAddressTel')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-Row>
        <el-col :span="8">
          <el-form-item label="开户行及账号" prop="accountBankNo">
            <el-input v-model="form.accountBankNo"
                      v-rightclick="handleRightClick.bind(this,form,'accountBankNo')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
    </el-form>
      <span slot="footer" class="dialog-footer" style="display: block; text-align: center;" >
        <el-button type="primary" @click="handleSubmit" >保 存</el-button>
        <el-button>取 消</el-button>
      </span>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ajaxRequest} from '../../util/base';
  import $ from 'jquery';
  import rightclick from '../../../directives/rightcilck';
  import rightClick from '../../../mixins/FormRightClick';



  const defaults = {
    companyType: 4,
    sealedByCnas: 0
  };
  export default {
    name: "company-form",
    props: {
      data: {
        type: Object
      },
    },
    data() {
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          companyName: [{type: 'string', required: true, message: '单位名称不能为空'}],
          companyType: [{type: 'integer', required: true, message: '单位类别不能为空'}],
          contacter: [{type: 'string', required: true, message: '客户联系人不能为空'}],
          mobilePhone: [{type: 'string', required: true, message: '手机号码不能为空'}],
          address: [{type: 'string', required: true, message: '单位地址不能为空'}],
        },

        attachment:'',
        fileList:[], //
        limitNumb:4,//附件上传个数限制
        up_url:'',//自定义上传路径 [非必填]  默认不用修改
        fdata:{//附件额外参数
              serverId:'',//服务id     [非必填]  分布式附件服务可以用默认不用配制
              flowId:'', //流程id      [非必填]  流程相关
              execType:'',//操作类型   [非必填]  业务相关
              caseId:'',//登记号       [非必填]  业务相关的登记号
        },
        loading: false,
        businessGroupNames: [],
        staffs: [],
        remoteOptions: [],
        provinces: [],
        citys: [],
        areas: [],
        industryValues: [{id: 1, name: "信息产业"}, {id: 2, name: "制造业"}, {id: 3, name: "国际组织"}],
        companyTypes: [{id: 1, name: "第一类别"}, {id: 2, name: "第二类别"}, {id: 3, name: "第三类别"}, {
          id: 4,
          name: "第四类别"
        }, {id: 5, name: "第五类别"}, {id: 6, name: "第六类别"}]
      }
    },
    mounted() {
      this.remoteMethod();
      //获取业务组
      ajaxRequest('get', 'back/businessStaff/getBusinessGroupName', {showFlag:'1'}, function (res) {
        this.businessGroupNames = res
        if (this.form.businessGroup) {
          this.departEvtInit(this.form.businessGroup);
        }
      }.bind(this))

      ajaxRequest('get', 'back/businessStaff/getStaff', {showFlag:'1'}, (res) => {
        this.staffs = res;
      })
      //获取省初始化
      ajaxRequest('get', 'back/company/getRegion?type=0', {}, function (res) {
        this.provinces = res
        if (this.form.province) {
          Vue.set(this.form,'province',parseInt(this.form.province))
          this.regionEvtInit(this.form.province)
        }
      }.bind(this))

    },
    directives: {rightclick},
    mixins: [rightClick],
    methods: {

      //callBack上传组件数据发生变化回调
      callBack(file,list){
        this.fileList=list;
      },

      businessEvt(id) {
        ajaxRequest('get', 'back/businessStaff/StaffByBusinessGroupId' + '?businessGroup=' + id, {}, (res) => {
          this.staffs = res;
          Vue.set(this.form, 'businessStaff', '');
        })
      },

      departEvtInit(id) {
        if (id) {
          ajaxRequest('get', 'back/businessStaff/getStaff' + '?departId=' + id, {}, (res) => {
            this.charges = res;
            Vue.set(this.form, 'businessStaff', this.form.businessStaff);
          })
        }
      },

      regionEvtInit(id) {
        if (id) {
          ajaxRequest('get', 'back/company/getRegion?type=1&id=' + id, {}, (res) => {
            this.citys = res;
            Vue.set(this.form, 'city', parseInt(this.form.city));
            this.regionEvtInit1(this.form.city)
          })
        }
      },

      regionEvtInit1(id) {
        if (id) {
          ajaxRequest('get', 'back/company/getRegion?type=2&id=' + id, {}, (res) => {
            this.areas = res;
            Vue.set(this.form, 'area', parseInt(this.form.area));
          })
        }
      },
      //省点击事件,获取区
      provinceEvt(id) {
        ajaxRequest('get', 'back/company/getRegion?type=1&id=' + id, {}, (res) => {
          this.citys = res;
          Vue.set(this.form, 'city', '');
          Vue.set(this.form, 'area', '');
        })
      },
      //市点击事件,获取县
      cityEvt(id) {
        ajaxRequest('get', 'back/company/getRegion?type=2&id=' + id, {}, (res) => {
          this.areas = res;
          Vue.set(this.form, 'area', '');
        })

      },

      staffEvt(id) {
        this.charges.forEach((data) => {
          if (id == data.staff) {
            Vue.set(this.form, 'businessStaff', data.staff);
            Vue.set(this.form, 'businessStaffName', data.staffName);
          }
        });
      },

      handleSubmit() {
        let _this = this;
        let  attachment = '';
        for(let i=0;i<this.fileList.length;i++){
          attachment = this.fileList[i].response.v_attach_id+'#'+attachment
        }
        _this.form.attachment = attachment;
        this.$refs.form.validate((valid) => {
          if (valid) {
            ajaxRequest('post', "back/company/", this.form,  (res) =>{
              if (res.code === 200) {
                this.$message.success('新增成功');
              }
            });
          } else {
            return false;
          }
        })
      },
      remoteMethod(keyWords) {
        this.loading = true;
        $.ajax();
      },
    },
  }
</script>

<style>
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
