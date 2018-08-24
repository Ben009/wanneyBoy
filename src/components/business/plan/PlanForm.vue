<template>
  <div class="nm-tab-content" ref="nm-page" style="margin-top:5px;">
    <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-Row>
        <el-col :span="hasAddCompanyPower&&isAddNew?18:24">
          <el-form-item label="委托单位" prop="companyName">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-autocomplete style="width: 100%"
                             v-model="form.companyName"
                             :fetch-suggestions="querySearchEntrust"
                             placeholder="请输入委托单位"
                             @select="handleSelect"
                             :trigger-on-focus="flag"
                             ref="companyName"
                             v-focus-next-on-enter="{value:'address',index:1}">
              <template slot-scope='scope'>
                <div>
                  <span style="margin-left:0"
                        :style="{color:scope.item.status == 0 ? 'red' : 'green'}">({{scope.item.companyType}}) {{scope.item.companyName}}
                    <!--  ({{scope.item.status == 0 ? '未审核' : '已审核'}}) -->
                     {{!!scope.item.companyDepart ? '[' + scope.item.companyDepart + ']' : ''}}
                     {{!!scope.item.contacter ? '[' + scope.item.contacter + ']' : ''}}
                     {{!!scope.item.mobilePhone ? '[' + scope.item.mobilePhone + ']' : ''}}
                  </span>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="submitHidden&&hasAddCompanyPower&&isAddNew?6:0" style="text-align: center;padding:6px;">
          <el-button type="primary" @click="addCompany" size="mini" class="but-tjdw">添加单位</el-button>
        </el-col>
      </el-Row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="单位地址" prop="address">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.address" clearable
                      v-rightclick="handleRightClick.bind(this,form,'address')"
                      v-focus-next-on-enter="{value:'contacter',index:1}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="上门检测地址" prop="detectionSite">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input placeholder="不录入默认委托单位地址" v-model="form.detectionSite" clearable
                      v-rightclick="handleRightClick.bind(this,form,'detectionSite')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="证书单位名称" prop="certificateCompanyName">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input placeholder="不录入默认委托单位名称" v-model="form.certificateCompanyName"
                      clearable v-rightclick="handleRightClick.bind(this,form,'certificateCompanyName')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="证书单位地址" prop="certificateCompanyAddress">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input placeholder="不录入默认委托单位地址" v-model="form.certificateCompanyAddress" clearable
                      v-rightclick="handleRightClick.bind(this,form,'certificateCompanyAddress')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="联系人" prop="contacter">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.contacter" clearable
                      v-rightclick="handleRightClick.bind(this,form,'contacter')"
                      v-focus-next-on-enter="{value:'telephone',index:1}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话" prop="telephone">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.telephone" clearable
                      v-rightclick="handleRightClick.bind(this,form,'telephone')"
                      v-focus-next-on-enter="{value:'specialRequirement',index:1}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="省/市/区" prop="administrativeArea">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.administrativeArea" :disabled="true"
                      v-rightclick="handleRightClick.bind(this,form,'administrativeArea')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邮编" prop="postCode">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.postCode" clearable
                      v-rightclick="handleRightClick.bind(this,form,'postCode')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="机构性质" prop="institutionalNature">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.institutionalNature" style="width:100%;">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in institutionalNatures"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="certificatePrintTime">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <template slot="label">
              <span>证书日期</span>
              <el-tooltip class="item" effect="dark" content="指客户要求证书日期">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-date-picker
              v-model="form.certificatePrintTime"
              align="right"
              type="date"
              placeholder="选择日期" style="width:100%;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="isConclusion">
            <!--单选 -->
            <template slot="label">
              <span>出具结论</span>
              <el-tooltip class="item" effect="dark" content="若服务类型为校准/检测时，是否需出具结论">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-radio-group v-model="form.isConclusion">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="isRecheck">
            <!--单选 -->
            <template slot="label">
              <span>出具复校</span>
              <el-tooltip class="item" effect="dark" content="若服务类型为校准/检测时，是否需出具复校日期">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-radio-group v-model="form.isRecheck">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="备注" prop="specialRequirement">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.specialRequirement" clearable
                      v-rightclick="handleRightClick.bind(this,form,'specialRequirement')"
                      v-focus-next-on-enter="{value:'applianceName',index:2}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align: center">
          <el-form-item label="录入人">
            <div style="font-size: 16px;color:#1d74b7;">{{form.addPersonName || userName}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="attachment">
            <template slot="label">
              <span>附件</span>
              <el-tooltip class="item" effect="dark" content="仅可上传一个附件">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <mind-upload ref="uploadFile" :attachIds="form.attachment" :limitNumb="limitNumb" :disabled="!submitHidden"
                         :callBack="fileUploadCallBack" class="but-djsc"></mind-upload>
          </el-form-item>
        </el-col>
      </el-Row>
    </el-form>
    <!-- 添加委托单位 -->
    <addCompanyCommon v-if="showCompanyForm" :callback="setCompanyInfo"></addCompanyCommon>
    <!-- 多地址选择 -->
    <show-more-list v-if="visable" :data="companyMany" :callback="handleCallBack"></show-more-list>
  </div>
</template>

<script>
  import Vue from 'vue'

  // 引入封装的ajax控件
  import {ajaxRequest, ajaxProxyRequest} from '../../util/base'
  //引入jquery
  import $ from 'jquery'
  //引入右击事件 可自行绑定到输入框
  import rightclick from '../../../directives/rightcilck'
  import rightClick from '../../../mixins/FormRightClick'
  import showMoreList from './showMoreList'
  import arrangeEdit from './ArrangeEdit.vue'
  import vueBus from 'vue-bus';
  import addCompanyCommon from "../quotation/addCompanyCommon";

  Vue.use(vueBus);

  const defaults = {
    institutionalNature: '系统外'
  };
  export default {
    name: 'planForm',
    props: {//用于接收从父组件中传来的数据
      data: {
        type: Object
      },
      isAddNew: {
        type: Boolean
      },
      callback: {
        type: Function
      },
      submitHidden: {
        type: Boolean
      }
    },
    data() {
      let telephoneCheck = (rule, value, callback) => {
        let reg = /([0-9]{3,4}-)?[0-9]{7,8}/
        if (value && !reg.test(value)) {
          callback(new Error('请输入正确的办公电话'));
        } else {
          callback();
        }
      };
      let postCodeCheck = (rule, value, cb) => {
        if (value) {
          let regx = /^[0-9]*$/g
          value = value + ''
          if (value.length > 10) {
            cb(new Error('最多输入10个字符'))
          } else {
            if (regx.test(value)) {
              cb()
            } else {
              cb(new Error('请输入正确格式'))
            }
          }
        } else {
          cb()
        }
      };
      //添加委托单位权限
      let hasAddCompanyPower = false;
      //获取登录人权限
      let buttonpermsStr = window.localStorage.getItem("btnPower");
      if (buttonpermsStr == null || buttonpermsStr == undefined) {
        //没有权限，所有涉及权限的按钮都不展示
        hasAddCompanyPower = false;
      } else if (buttonpermsStr.indexOf("@M13901@") != -1) {
        //有按钮权限
        hasAddCompanyPower = true;
      }
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
          companyName: [
            {
              type: "string",
              required: true,
              message: '委托单位不能为空',
              trigger: "blur"
            },
            {
              max: 200,
              message: '最多输入200个字符',
              trigger: 'blur'
            }
          ],
          detectionSite: [{
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          }],
          certificateCompanyName: [{
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          }],
          certificateCompanyAddress: [{
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          }],
          contacter: [
            {
              max: 100,
              message: '最多输入100个字符',
              trigger: 'blur'
            }
          ],
          specialRequirement: [{
            max: 200,
            message: '最多输入200个字符',
            trigger: 'blur'
          }],
          address: [{type: 'string', required: true, message: '单位地址不能为空'}, {
            max: 100,
            message: '最多输入100个字符',
            trigger: 'blur'
          }],
          telephone: [
            {validator: telephoneCheck, trigger: 'blur'}
          ],
          postCode: [
            {validator: postCodeCheck, trigger: 'blur'}
          ],
        },
        institutionalNatures: [{"value": "系统外"}, {"value": "系统内"}, {"value": "内传"}],
        //多地址弹窗显示
        visable: false,
        //委托单位id
        companyMany: null,
        //文件上传参数
        fileList: [],
        limitNumb: 1,//附件上传个数限制
        up_url: '',//自定义上传路径 [非必填]  默认不用修改
        fdata: {//附件额外参数
          serverId: '',//服务id     [非必填]  分布式附件服务可以用默认不用配制
          flowId: '', //流程id      [非必填]  流程相关
          execType: '',//操作类型   [非必填]  业务相关
          caseId: '',//登记号       [非必填]  业务相关的登记号
        },
        //是否在委托单位输入框 focus 时显示建议列表
        flag: false,
        userName: window.localStorage.userName,
        //是否有添加委托单权限
        hasAddCompanyPower: hasAddCompanyPower,
        //添加委托单位弹窗
        showCompanyForm: false,
      }
    },
    mounted() {
    },
    watch: {
      form() {
        if (this.form.attachment && this.form.attachment.length > 0) {
          this.$refs.uploadFile.loadAttacheIds(this.form.attachment);
        }
      }
    },
    directives: {rightclick},
    mixins: [rightClick],
    components: {
      showMoreList,
      addCompanyCommon
    },
    methods: {
      //委托单位input聚焦
      focusCompanyName() {
        this.$refs.companyName.focus();
      },
      //callBack上传组件数据发生变化回调
      fileUploadCallBack(file, list) {
        this.fileList = list;
        this.form.attachment = this.fileList[0].response.v_attach_id;
      },
      // 委托单位远程搜索
      querySearchEntrust(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        let params = queryString ? {
          companyName: queryString,
          fuzzySearch: 1
        } : ''
        ajaxRequest('get', 'back/company/matchCompanysByName', params, (res) => {
          if (res.code == 200) {
            this.handleResult(res.rows);
            cb(res.rows)
          }
        })
      },
      handleResult(res) {
        for (let key in res) {
          Vue.set(res[key], 'value', res[key].companyName)
        }
      },
      //选择委托单位列表回调
      handleSelect(item) {
        this.form.companyId = item.id;
        this.form.companyName = item.companyName;//委托单位
        //省市区
        let administrativeArea = "";
        if (!!item.province) {
          administrativeArea += item.province;
        }
        if (!!item.city) {
          administrativeArea += "/" + item.city;
        }
        if (!!item.area) {
          administrativeArea += "/" + item.area;
        }
        this.form.administrativeArea = administrativeArea;//省市区
        this.form.postCode = item.postCode;//邮编
        this.form.detectionSite = item.sceneTestingAddress;
        if (item.many == '1') {//多地址选择
          this.companyMany = item.id;
          this.visable = true;
        } else {
          this.form.contacter = item.contacter;//联系人
          this.form.telephone = item.telephone;//联系电话
          this.form.address = item.address;//地址
        }
      },
      //多地址选择回调
      handleCallBack(val) {
        if (val) {
          this.form.contacter = val.contacter;//联系人
          this.form.telephone = val.telephone;//联系电话
          this.form.address = val.address;//地址
          this.form.certificateCompanyName = val.certificateCompanyName;
          this.form.certificateCompanyAddress = val.address;
        }
        this.visable = false;
      },
      //添加委托单位弹窗
      addCompany() {
        this.showCompanyForm = true;
      },
      //添加委托单位回写单位信息
      setCompanyInfo(data) {
        //带入单位信息到表单中
        this.showCompanyForm = false;
        this.$set(this.form, "companyId", data.id);
        this.$set(this.form, "companyName", data.companyName);
        //省市区
        let administrativeArea = "";
        if (!!data.province) {
          administrativeArea += data.province + "/";
        }
        if (!!data.city) {
          administrativeArea += data.city + "/";
        }
        if (!!data.area) {
          administrativeArea += data.area;
        }
        this.$set(this.form, "administrativeArea", administrativeArea);
        this.$set(this.form, "postCode", data.postCode);
        this.$set(this.form, "mobilePhone", data.mobilePhone);
        this.$set(this.form, "address", data.address);
        this.$set(this.form, "contacter", data.contacter);
        this.$set(this.form, "telephone", data.telephone);
        this.$set(this.form, "detectionSite", data.sceneTestingAddress);//上门检测地址
        this.$set(this.form, "certificateCompanyname", data.certificateCompanyname);
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

  .custom-1d74b7 .el-col-14 {
    width: 25%;
  }

  .custom-1d74b7 .el-col-8 {
    width: 25%;
  }

  .but-tjdw {
    border: 1px solid #3094e0 !important;
    background: none !important;
    color: #3094e0 !important;
  }

  .but-tjdw:hover {
    background: #3094e0 !important;
    color: #fff !important;
  }
</style>
