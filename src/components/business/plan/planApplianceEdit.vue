<template>
  <mind-dialog
    :title="!!data.id?'编辑器具':'追加器具'"
    :visible="true"
    dialog-size="large"
    center
    v-dialogDrag
    @close="handleCancel"
    v-loading="loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-Row>
        <el-col :span="12">

          <el-form-item prop="applianceName">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <template slot="label">
              <span>器具名称</span>
              <el-tooltip class="item" effect="dark" content="器具名称需从计量器具库中调用，不支持直接输入">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <applianceAutoCompelete @select-value="setApplianceValue" v-model="form.applianceName"
                                    ref="ref"></applianceAutoCompelete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="器具实际名称" prop="applianceActualName">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.applianceActualName"
                      v-rightclick="handleRightClick.bind(this,form,'attachment')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="检测部门" prop="departId">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              @change="changeDepartEvt"
              v-model="form.departId">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in departIds"
                :key="item.id"
                :label="item.departName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="检测岗位" prop="postId">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              @change="handleChange"
              v-model="form.postId">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in postIds"
                :key="item.id"
                :label="item.postName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="服务类型" prop="certificateType">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.certificateType">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in certificateTypes"
                :key="item.remark"
                :label="item.remark"
                :value="item.remark">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="检测方式" prop="detectionMethod">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.detectionMethod">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in detectionMethods"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="套数" prop="setNumber">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <!--  <el-input v-model="form.setNumber"></el-input>-->
            <el-input-number v-model="form.setNumber" :min="1" :max="999" :controls="false"
                             @change="handleSetNumberChange"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="pieceNumber">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <template slot="label">
              <span>件/套数</span>
              <el-tooltip class="item" effect="dark" content="通常为1，但比如为砝码时，表示几个小砝码的数量">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-input-number v-model="form.pieceNumber" :min="1" :max="999" :controls="false"
                             @change="handlePieceNumberChange"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span=6>
          <el-form-item label="证书数量" prop="certificateNumber">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <!--<el-input v-model="form.certificateNumber"></el-input>-->
            <template>
              <span>{{form.certificateNumber}}</span>
              <el-button type="primary" v-show="form.subcontractArea === '0'"
                         style="padding:2px;font-size:14px;margin-left:2px;background:#ff7777;border:#ff7777;"
                         @click="changeCertificateNumber">
                {{form.certificateNumber === 0 ? '需出证' : '无需出证'}}
              </el-button>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否加急" prop="urgentDayPercent">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.urgentDayPercent">
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in urgentDayPercents"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规格型号" prop="model">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.model" v-rightclick="handleRightClick.bind(this,form,'attachment')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="测量范围" prop="measureRange">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.measureRange"
                      v-rightclick="handleRightClick.bind(this,form,'attachment')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="出厂编号" prop="factoryNo">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.factoryNo"
                      v-rightclick="handleRightClick.bind(this,form,'attachment')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="设备编号" prop="equipmentNo">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.equipmentNo"
                      v-rightclick="handleRightClick.bind(this,form,'attachment')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="制造厂商" prop="manufacturer">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.manufacturer"
                      v-rightclick="handleRightClick.bind(this,form,'attachment')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="检测参数" prop="detectionParameter">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.detectionParameter"
                      v-rightclick="handleRightClick.bind(this,form,'attachment')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="是否强检" prop="isCompulsoryVerify">
            <!--单选 -->
            <el-radio-group v-model="form.isCompulsoryVerify" @change="handleCompulsoryVerifyChange">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="器具用途" prop="applianceUse">
            <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
            <mind-select
              v-model="form.applianceUse"
              :options="applianceUses"
              :extraConfig="{'disabled':applianceDisabled,'size':'mini'}"
            ></mind-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="subcontractArea">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <template slot="label">
              <span>分包区域</span>
              <el-tooltip class="item" effect="dark" content="选择分包区域后，系统自动将证书数量设为0">
                <i class="el-icon-info ft12"></i>
              </el-tooltip>
            </template>
            <el-select
              placeholder="请选择"
              value-key="name"
              v-model="form.subcontractArea"
              @change="handleAreaChange"
            >
              <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
              <el-option
                v-for="item in subcontractAreas"
                :key="item.code"
                :label="item.remark"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
            <el-input v-model="form.remark" v-rightclick="handleRightClick.bind(this,form,'attachment')"></el-input>
          </el-form-item>
        </el-col>
      </el-Row>
    </el-form>
    <span slot="footer" class="dialog-footer">
       <template>
         <el-tooltip content="重新安排器具。若对应委托单只有当前这一个器具，删除委托单" placement="bottom" effect="light">
           <el-button v-if="!!orderFlag" type="danger" @click="handleArrangeAgain">重新安排</el-button>
         </el-tooltip>
       </template>
       <template>
         <el-tooltip content="从委托单和现场任务中删除。若对应委托单只有当前这一个器具，删除委托单" placement="bottom" effect="light">
           <el-button v-if="!(!orderFlag||form.source=='9')" type="warning" @click="handleDelete">删 除</el-button>
         </el-tooltip>
       </template>
       <template>
         <el-tooltip content="把器具关联到一个现有的委托单里" placement="bottom" effect="light">
           <el-button v-if="!orderFlag&&!!data.id" type="primary" @click="linkToOrder">关联委托单</el-button>
         </el-tooltip>
       </template>
      <!-- 绑定form提交事件-->
      <el-button type="primary" @click="handleSubmit" >保 存</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
    <linkToOrder v-if="!!edit" :data="edit" :orderArr="orderArr" :callback="handelCallback"></linkToOrder>
  </mind-dialog>
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

  import applianceAutoCompelete from './applianceAutoCompelete.vue'
  import linkToOrder from './linkToOrder.vue'

/*   import {
    Button,
    Checkbox,
    CheckboxGroup,
    Col,
    Form,
    FormItem,
    Input,
    InputNumber,
    Radio,
    RadioGroup,
    Row,
    Select
  } from 'element--ui'
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
  Vue.use(InputNumber)
  Vue.use(Button)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(RadioGroup)
  Vue.use(Radio)
  Vue.use(CheckboxGroup)
  Vue.use(Checkbox) */



  const defaults = {
    setNumber: 1,
    pieceNumber: 1,
    certificateNumber: 1,
    isCompulsoryVerify: '0',
    applianceName: '',
    certificateType: '检定',
    urgentDayPercent: "0@@0",
    subcontractArea: "0",
    detectionMethod: '0',
  }
  export default {
    name: 'applianceForm',
    props: {
      data: {
        type: Object,
        require: true
      },
      orderFlag: {
        type: Boolean,
        require: true
      },
      callback: {
        type: Function,
        require: true
      },
      resetApplianceArrange: {
        type: Function,
      },
      delOrderAppliance: {
        type: Function,
      }
    },
    data() {
      console.log(this.orderFlag, "orderFlag");
      var validateSet = (rule, value, callback) => {
        var reg = new RegExp(/^[0-9]*$/)
        if (!reg.test(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }

      var validateApplianceUse = (rule, value, callback) => {
        if (this.form.isCompulsoryVerify === "1" && (!value)) {
          callback(new Error("请选择器具用途"))
        } else {
          callback();
        }
      };
      return {
        form: $.extend({}, defaults, this.data || {}),
        rules: {
          //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
          applianceName: [{required: true, message: '器具名称不能为空'}],
          certificateType: [{type: 'string', required: true, message: '服务类型不能为空'}],
          /*  setNumber: [{validator: validateSet, trigger: 'blur'}],*/
          setNumber: [{type: 'number', required: true, message: '套数不能为空'}],
          pieceNumber: [{type: 'number', required: true, message: '件数不能为空'}],
          certificateNumber: [{type: 'number', required: true, message: '证书数量不能为空'}],
          departId: [{type: 'number', required: true, message: '检测部门不能为空'}],
          postId: [{type: 'number', required: true, message: '岗位不能为空'}],
          applianceUse:[{validator: validateApplianceUse, trigger: 'blur'}],
        },
        loading: false,
        remoteOptions: [],
        certificateTypes: [],
        departIds: [],
        postIds: [],
        detectionMethods: [{code: '0', remark: '现场'}, {code: '2', remark: '带回'}],
        urgentDayPercents: [],
        applianceUses: [],
        subcontractAreas: [],
        applianceDisabled: this.data.isCompulsoryVerify == "1" ? false : true,  //器具用途是否禁用取决于强检
        edit: null,
        orderArr:[],//可关联的委托单号
        applianceUsesLength:0,
      }
    },
    mounted() {
      //页面渲染完成后，ajax请求加载数据
      this.remoteMethod();
    },
    directives: {rightclick},
    mixins: [rightClick],
    components: {
      applianceAutoCompelete,
      linkToOrder
    },
    methods: {//方法定义
      /*套数与证书数量相同*/
      handleSetNumberChange(value) {
        console.log("修改套数", value)
        if (value < 0) {
          this.$message.error('数量不能小于0');
          Vue.set(this.form, 'setNumber', 0);
          return
        }
        if (this.form.subcontractArea == 0) {
          Vue.set(this.form, 'certificateNumber', value);
        } else {
          Vue.set(this.form, 'certificateNumber', 0);
        }
      },
      //验证件/套数
      handlePieceNumberChange(value) {
        if (value < 0) {
          this.$message.error('数量不能小于0');
          Vue.set(this.form, 'pieceNumber', 0);
          return
        }
      },
      //无需出证
      changeCertificateNumber() {
        if (this.form.certificateNumber !== 0) {
          Vue.set(this.form, 'certificateNumber', 0);
        } else {
          Vue.set(this.form, 'certificateNumber', this.form.setNumber);
        }
      },
      /*分包区域change将证书数量置0*/
      handleAreaChange(val) {
        if (val !== '0') {
          Vue.set(this.form, 'certificateNumber', 0);
        } else {
          Vue.set(this.form, 'certificateNumber', this.form.setNumber);
        }
      },
      /*是否强检控制是否可选器具用途*/
      handleCompulsoryVerifyChange(value) {
        this.applianceDisabled = value == 0 ? true : false;
        Vue.set(this.form, 'applianceUse', '');
      },
      setApplianceValue(row) {
        console.log(row, "器具信息")
        if (row) {

          //计量器具id
          Vue.set(this.form,'applianceId',row.id);
          Vue.set(this.form, 'applianceName', row["applianceName"]);
          //器具实际名称，如果有值，不覆盖
          if(!!row["applianceActualName"]){
            Vue.set(this.form, 'applianceActualName', row["applianceName"])
          }else{
            if (this.form.applianceActualName === "" || this.form.applianceActualName == null) {
              Vue.set(this.form, 'applianceActualName', row["applianceName"])
            }
          }
          Vue.set(this.form, 'departId', row['departId']);
          //重新计算岗位
          this.changeDepartEvt(row['departId']);
          Vue.set(this.form, 'postId', row['postId']);
          Vue.set(this.form, 'certificateType', row['certificateType']);
          Vue.set(this.form, 'detectionParameter', row['detectionParameter']);
          Vue.set(this.form, 'model', row['model']);
          Vue.set(this.form, 'measureRange', row['measureRange']);
          //是否强检
          Vue.set(this.form, 'isCompulsoryVerify', row['isCompulsoryVerify']==null?"0":String(row['isCompulsoryVerify']));
          this.applianceDisabled = !(this.form.isCompulsoryVerify === "1");
          /*重新计算器具用途列表*/
          if(!this.applianceDisabled){
            let code = row['applianceUse'];
            if(!!code) {
              code = "'" + row['applianceUse'].replace(/,/g, "','") + "'";
            }
            ajaxProxyRequest('post',"njmind/findParam/applianceUse",{code:code,cache:'false'},(res)=>{
              this.applianceUses=res.list
              console.log(res.list,'applianceUse')
              if(res.list.length == 1){
                this.form.applianceUse = res.list[0].code;
              }
            });
          }else{
            if(this.applianceUses.length != this.applianceUsesLength){
              ajaxProxyRequest('post',"njmind/findParam/applianceUse",null,(res)=>{
                this.applianceUses=res.list
              });
            }
          }
        }
      },
      /*检验证书数量是否大于套数*/
      handleCertificateNumberChange(value) {
        if (value < 0) {
          this.$message.error('数量不能小于0');
          Vue.set(this.form, 'certificateNumber', 0);
          return
        }
        if (value > this.form.setNumber) {
          this.$message({
            type: 'error',
            message: '证书数量不能大于套数 '
          })
        }
      },
      handlePieceNumberChange(name, type, value) {
        if (value < 0) {
          this.$message.error('数量不能小于0');
          Vue.set(this.form, 'pieceNumber', 0);
          return
        }
      },
      handleChange(v) {
        //岗位手动赋值
        Vue.set(this.form, 'postId', v)
      },
      changeDepartEvt(orgId) {
        //部门下拉事件,根据部门ID获取岗位
        if (orgId) {
          ajaxRequest('get', 'back/post/listByDeptId/' + orgId, {}, (res) => {
            this.postIds = res.rows
            console.log(res.rows);
            //每次选择一级，自动清空二级
            if(this.postIds.length == 1){
              this.form.postId = this.postIds[0].id;
            }else{
              Vue.set(this.form,'postId','');
            }
          })
        }
      },
      changeDepartEvtInit(orgId) {
        //初始化时,根据部门ID获取岗位(与changeDepartEvt 区别就是不清空，用于编辑页面)
        if (orgId) {
          ajaxRequest('get', 'back/post/listByDeptId/' + orgId, {}, (res) => {
            this.postIds = res.rows
          })
        }
      },
      handleSubmit() {
        //-- 表单提交处理 --
        this.$refs.form.validate((valid) => {//校验成功则回调提交数据
          if (valid) {
            console.log(this.form,'器具信息')
            if(this.form.isCompulsoryVerify=='1'&&this.form.applianceUse==''){
              this.$message.error('请选择强检用途！');
              return false;
            }
            this.loading=true;
            this.callback(this.form);
          } else {
            return false;
          }
        })
      },
      remoteMethod() {
        //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
        //服务类型
        ajaxProxyRequest('get', '/njmind/findParam/certificateType', {},
          (res) => {
            this.certificateTypes = res.list;
          });
        //器具用途
        ajaxProxyRequest('get', '/njmind/findParam/applianceUse', {},
          (res) => {
            this.applianceUses = res.list;
            this.applianceUsesLength=res.list.length
          });
        //加急
        ajaxProxyRequest('get', '/njmind/findParam/urgentDays', {},
          (res) => {
            this.urgentDayPercents = res.list;
          });
        //分包区域
        ajaxProxyRequest('get', '/njmind/findParam/subcontractAreas', {},
          (res) => {
            this.subcontractAreas = res.list;
          });
        //部门
        ajaxRequest('get', 'back/depart/list/', {}, (res) => {
          this.departIds = res.rows
          if (this.form.departId) {
            //初始化有部门值时，根据部门获取岗位(编辑页)
            this.changeDepartEvtInit(this.form.departId)
          }
        })
      },
      handleCancel() {
        this.callback()
      },
      //重新安排器具
      handleArrangeAgain() {
        this.resetApplianceArrange(this.form)
      },
      //删除委托单下器具
      handleDelete() {
        this.delOrderAppliance(this.form)
      },
      //关联器具到现有的委托单里
      linkToOrder() {
        let _this = this;
        ajaxRequest(
          "get",
          "back/arrange/getCanLinkOrder",
          {
            planId: _this.data.planId,
            detectionMethod: _this.data.detectionMethod,
          },
          res => {
            if (res.code === 200) {
              if(res.t!=""){
                _this.orderArr = res.t.split(',');
                if(_this.orderArr.length>0){
                  _this.edit = _this.data;
                }else{
                  _this.$message.error('该计划任务下没有符合条件的委托单');
                }
             }else{
                _this.$message.error('该计划任务下没有符合条件的委托单');
              }
            }
          }
        );
        console.log(this.data, '关联委托单')
      },
      //关联委托单
      handelCallback(rowInfo) {
        let _this = this;
        if (rowInfo) {
          delete rowInfo.startTime;
          delete rowInfo.finishDate;
          delete rowInfo.certificatePrintTime;
          console.log(rowInfo, '关闭关联委托单弹窗');
          if (rowInfo.id) {//修改
            ajaxRequest('put', 'back/planAppliance/', rowInfo, function (res) {
              if (res.code === 200) {
                _this.$message.success('编辑成功');
                _this.edit = null;
                //关闭器具弹窗
                _this.handleCancel();
              }
              else {
                _this.$message.error('编辑失败');
              }
            });
          }
        } else {
          _this.edit = null;
        }
      },
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
