<template>
    <mind-dialog
            :title="!!data.registrationNo?'修改器具信息':'追加器具'"
            :visible="true"
            width="70%"
            center
            v-dialogDrag
            @close="handleCancel">
        <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-Row>
                <el-col :span="12" style="text-align: center">
                    <el-form-item prop="registrationNo">
                        <template slot="label">
                            <span>登记号</span>
                            <el-tooltip class="item" effect="dark" content="提交后系统自动生成登记号">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <div style="font-size: 18px">{{this.form.registrationNo}}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="12" style="text-align: center">
                    <el-form-item v-if="!!data.registrationNo" label="流转单号" prop="orderSingleNo">
                        <div style="font-size: 18px">{{this.form.orderSingleNo}}</div>
                    </el-form-item>
                    <el-form-item v-else prop="orderSingleNo">
                        <template slot="label">
                            <span>流转单号</span>
                            <el-tooltip class="item" effect="dark" content="根据是否加急、是否分包、检测岗位查出可加入流转单号，也可新生成流转单号">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-select
                                placeholder="请选择"
                                value-key="name"
                                v-model="form.orderSingleNo">
                            <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
                            <el-option
                                    v-for="item in orderSingleNos"
                                    :key="item.ID"
                                    :label="item.VALUE"
                                    :value="item.ID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="data.detectionMethod === '0' ? 8 : 12" style="text-align: center">
                    <el-form-item label="受理人员">
                        <div style="font-size: 18px">{{!!data.addPersonName ? data.addPersonName : userName}}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="data.detectionMethod === '0' ? 8 : 12" style="text-align: center">
                    <el-form-item label="检测方式" prop="detectionMethod">
                        {{data.detectionMethod === '1' ? '送检' : '现场'}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item v-show="data.detectionMethod === '0'" label="执行人" prop="executor">
                        <span v-if="!!form.executor && form.executor.indexOf(',') != -1">{{form.executor}}</span>
                        <el-autocomplete v-else style="width: 100%"
                                         v-model="form.executor"
                                         :fetch-suggestions="querySearchPerson"
                                         @select="handleExecutorSelect"
                                         placeholder="请输入执行人"
                                         :trigger-on-focus="flag"
                        ></el-autocomplete>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="12">
                    <el-form-item label="器具名称" prop="applianceName">
                        <!--<el-input v-model="form.applianceName"></el-input>-->

                        <el-input size="small" v-model="form.applianceName" clearable @input="handleChange"
                                  ref="applianceName"></el-input>

                        <RelativeList v-if="relativeData.length && isRelative" :relativeData="relativeData" :show="show"
                                      :divWidth="divWidth" :setValue="setValue" :columnsInfo="columnsInfo"/>

                    </el-form-item>

                </el-col>
                <el-col :span="12">
                    <el-form-item label="器具实际名称" prop="applianceActualName">
                        <el-input v-model="form.applianceActualName"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>

                <el-col :span="6" style="text-align:center">
                    <el-form-item prop="setNumber">
                        <template slot="label">
                            <span>套数</span>
                            <el-tooltip v-has="'M16713'" class="item" effect="dark" content="仅可增加套数，减少套数请申请退检">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <span v-if="!!data.registrationNo" v-notHas="'M16713'">{{form.setNumber}}</span>
                        <el-input-number style="width:100%" v-if="!!data.registrationNo" :controls="false"
                                         v-has="'M16713'" v-model.number="form.setNumber"
                                         @change="handleSetNumberChange" type="number" max="999"
                                         :min="minSetNumber"></el-input-number>
                        <el-input-number style="width:100%" v-else v-model.number="form.setNumber" :controls="false"
                                         @change="handleSetNumberChange" type="number" :min="1"
                                         :max="999"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="件/套" prop="pieceNumber">
                        <el-input-number style="width:100%" v-model.number="form.pieceNumber" :controls="false"
                                         type="number" :min="1"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="6" style="text-align:center">
                    <el-form-item label="证书数量" prop="certificateNumber">
                        <span>{{form.certificateNumber}}</span>
                        <el-button type="text" v-show="form.subcontractArea === '0'"
                                   style="padding:2px;font-size:14px;margin-left:2px;" @click="changeCertificateNumber">
                            <i v-if="form.certificateNumber === 0" class="el-icon-circle-check-outline" title="需出证"></i>
                            <i v-else class="el-icon-circle-close-outline" style="color:red" title="无需出证"></i>
                        </el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="服务类型" prop="certificateType">
                        <el-select
                                placeholder="请选择"
                                value-key="name"
                                v-model="form.certificateType">
                            <el-option
                                    v-for="item in certificateTypes"
                                    :key="item.code"
                                    :label="item.remark"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="6">
                    <el-form-item label="检测部门" prop="departId">
                        <el-select
                                placeholder="请选择"
                                value-key="name"
                                @change="getPostList(form.departId)"
                                v-model="form.departId">
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
                        <el-select
                                placeholder="请选择"
                                value-key="name"
                                @change="handlePostChange"
                                v-model="form.postId">
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
                    <el-form-item label="是否加急" prop="urgentDayPercent">
                        <el-select
                                placeholder="请选择"
                                value-key="name"
                                @change="handleIsUrgentChange"
                                v-model="form.urgentDayPercent">
                            <el-option
                                    v-for="item in urgentDayPercents"
                                    :key="item.code"
                                    :label="item.remark"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="检测期限" prop="detectionDeadline">
                        <el-date-picker
                                v-model="form.detectionDeadline"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="6">
                    <el-form-item label="是否强检" prop="isCompulsoryVerify">
                        <el-radio-group @change="handleCompulsoryVerifyChange" v-model="form.isCompulsoryVerify">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="器具用途" prop="applianceUse">
                        <el-select :disabled="applianceDisabled"
                                   placeholder="请选择"
                                   v-model="form.applianceUse">
                            <el-option
                                    v-for="item in applianceUses"
                                    :key="item.code"
                                    :label="item.remark"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="分包区域" prop="subcontractArea">
                        <el-select
                                placeholder="请选择"
                                value-key="name"
                                @change="handleAreaChange"
                                v-model="form.subcontractArea">
                            <el-option
                                    v-for="item in subcontractAreas"
                                    :key="item.code"
                                    :label="item.remark"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="form.source == 1">
                    <el-form-item label="证书日期" prop="certificatePrintTime">
                        <el-date-picker
                                v-model="form.certificatePrintTime"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" style="width:100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="是否双编号" prop="isDoubleNumber">
                        <el-radio-group v-model="form.isDoubleNumber">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <!-- </el-Row> -->

                <!-- <el-Row> -->
                <el-col :span="6">
                    <el-form-item label="是否调修" prop="isRepair">
                        <!-- <el-radio-group v-model="form.isRepair">
                          <el-radio v-for="item in isRepairs" :label="item.code"  >{{item.remark}}</el-radio>
                        </el-radio-group> -->
                        <el-select
                                placeholder="请选择"
                                value-key="name"
                                v-model="form.isRepair">
                            <el-option
                                    v-for="item in isRepairs"
                                    :key="item.code"
                                    :label="item.remark"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="电源类型" prop="powerTypes">
                        <!-- <el-radio-group v-model="form.powerTypes">
                          <el-radio v-for="item in powerTypess" :label="item.code">{{item.remark}}</el-radio>
                        </el-radio-group> -->
                        <el-select
                                placeholder="请选择"
                                value-key="name"
                                v-model="form.powerTypes">
                            <el-option
                                    v-for="item in powerTypess"
                                    :key="item.code"
                                    :label="item.remark"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="器具附件" prop="accessory">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.accessory"
                                  v-rightclick="handleRightClick.bind(this,form,'accessory')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="器具外观" prop="appearance">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.appearance"
                                  v-rightclick="handleRightClick.bind(this,form,'appearance')"></el-input>
                    </el-form-item>
                </el-col>
                <!-- </el-Row> -->

                <!-- <el-Row> -->
                <el-col :span="6">
                    <el-form-item label="型号规格" prop="model">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.model"
                                  v-rightclick="handleRightClick.bind(this,form,'model')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="出厂编号" prop="factoryNo">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.factoryNo"
                                  v-rightclick="handleRightClick.bind(this,form,'factoryNo')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="设备编号" prop="equipmentNo">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.equipmentNo"
                                  v-rightclick="handleRightClick.bind(this,form,'equipmentNo')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="制造厂商" prop="manufacturer">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.manufacturer"
                                  v-rightclick="handleRightClick.bind(this,form,'manufacturer')"></el-input>
                    </el-form-item>
                </el-col>
                <!-- </el-Row> -->

                <!-- <el-Row> -->
                <el-col :span="form.source == 1 ? 6 : 12">
                    <el-form-item label="检测参数" prop="detectionParameter">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.detectionParameter"
                                  v-rightclick="handleRightClick.bind(this,form,'detectionParameter')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
            <more-list v-if="isShow" :callback="handleCallBack" :relativeData="relativeData" :columnsInfo="columnsInfo"
                       :ajaxChangeUrl="back/appliance/getApplianceInfoForAutoComplete"></more-list>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
            <el-button @click="handleCancel">取 消</el-button>
            <!-- 绑定form提交事件-->
    </span>
    </mind-dialog>
</template>

<script>
    import Vue from 'vue';
    // 引入封装的ajax控件
    import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest, formatDate} from '../../util/base';
    //引入jquery
    import $ from 'jquery';
    //引入右击事件 可自行绑定到输入框
    import rightclick from '../../../directives/rightcilck';
    import rightClick from '../../../mixins/FormRightClick';
    import RelativeList from '../plan/RelativeList.vue'
    import MoreList from '../plan/MoreList.vue'


    /*   import {
        Button,
        Checkbox,
        CheckboxGroup,
        Col,

        InputNumber,
        Form,
        FormItem,
        Input,
        Radio,
        RadioGroup,
        Row,
        Select
      } from 'element--ui';
      Vue.use(Form);
      Vue.use(FormItem);
      Vue.use(Input);
      Vue.use(InputNumber);
      Vue.use(Button);
      Vue.use(Row);
      Vue.use(Col);
      Vue.use(RadioGroup);
      Vue.use(Radio);
      Vue.use(CheckboxGroup);
      Vue.use(Checkbox); */


    const defaults = {
        orderSingleNo: '0',
        isCompulsoryVerify: 0,
        isRepair: '0',
        powerTypes: '0',
        subcontractArea: '0',
        urgentDayPercent: "0@@0",
        isDoubleNumber: 0,
        setNumber: 1,
        pieceNumber: 1,
        certificateNumber: 1,
        detectionDeadline: "",
    };
    export default {
        name: "entrustSjdForm",
        props: {//用于接收从父组件中传来的数据
            data: {
                type: Object
            },
            callback: {
                type: Function
            }
        },
        data() {
            var validateApplianceUse = (rule, value, callback) => {
                if (this.form.isCompulsoryVerify === 1 && (!value)) {
                    callback(new Error("请选择器具用途"))
                } else {
                    callback();
                }
            };
            var validateExecutor = (rule, value, callback) => {
                if (this.form.detectionMethod === '0' && (!value)) {
                    callback(new Error("请输入执行人"))
                } else {
                    callback();
                }
            };

            return {
                form: $.extend({}, defaults, this.data || {}),
                rules: {
//校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
                    applianceName: [{type: 'string', required: true, message: '器具名称不能为空'}],
                    setNumber: [{type: 'number', required: true, message: '套数请输入数字'}],
                    pieceNumber: [{type: 'number', required: true, message: '件/套请输入数字'}],
                    applianceUse: [{validator: validateApplianceUse, trigger: 'blur'}],
                    departId: [{type: 'number', required: true, message: '请选择检测部门'}],
                    postId: [{type: 'number', required: true, message: '请选择检测岗位'}],
                    certificateType: [{type: 'string', required: true, message: '请选择服务类型'}],
                    executor: [{validator: validateExecutor, trigger: 'blur'}],
                    // detectionDeadline: [{type: 'date', required: true, message: '请选择检测期限'}],
//          description: [{type: 'string', required: true, message: '角色描述不能为空'}]
                },

                columnsInfo: {
                    moreInfo: [
                        {nameCode: 'applianceName', title: '器具名称', head: 'A:', width: 200},
                        {nameCode: 'detectionFee', title: '收费标准', head: 'J:', width: 50},
                        {nameCode: 'departName', title: '检测部门', head: 'B:', width: 150},
                        {nameCode: 'certificateType', title: '服务类型', head: 'F:', width: 100},
                        {nameCode: 'model', title: '型号规格', head: 'X:', width: 150},
                        {nameCode: 'measureRange', title: '测量范围', head: 'C:', width: 150},
                    ]
                },
                isShow: false,
                relativeData: [],
                isRelative: 0,

                loading: false,
                remoteOptions: [],
                certificateTypes: [],
                departIds: [],
                postIds: [],
                applianceUses: [],
                applianceUsesLength: 0,
                urgentDayPercents: [],
                powerTypess: [],
                isDoubleNumbers: [],
                subcontractAreas: [],
                isRepairs: [],
                orderSingleNos: [{ID: '0', VALUE: '新生成'}],
                userName: window.localStorage.userName,
                //autoComplete 是否不输入值就可匹配
                flag: false,
                applianceDisabled: this.data.isCompulsoryVerify === 0,  //器具用途是否禁用取决于强检
                divWidth: 0,
                minSetNumber: 0,
                wtdSource: this.data.wtdSource,
                registrationNoSource: this.data.registrationNoSource,
                registrationNoQuotationNo: this.data.registrationNoQuotationNo,
            }
        },
        computed: {},
        mounted() {
            //页面渲染完成后，ajax请求加载数据
            this.remoteMethod();
            //处理字符类型不一样的问题
            Vue.set(this.form, 'isRepair', this.form.isRepair + '');
            Vue.set(this.form, 'powerTypes', this.form.powerTypes + '');

            this.minSetNumber = this.form.setNumber;
            //=========================================
            //回显加急专用
            let isUrgents = this.form.isUrgents;
            if (isUrgents.length === 7) {
                this.form.urgentDayPercent = this.form.isUrgent + "@@" + isUrgents.substring(3, 5);
                console.log( this.form.urgentDayPercent)
            } else if (isUrgents.length === 6) {
                this.form.urgentDayPercent = this.form.isUrgent + "@@" + isUrgents.substring(3, 4);
                console.log( this.form.urgentDayPercent)
            }
            //=========================================
            this.$nextTick(val => {
                this.getApplianceNameWidth();
            })
            this.form.detectionDeadline = formatDate(this.form.detectionDeadline, 'YYYY-MM-DD');
        },
        directives: {rightclick},
        mixins: [rightClick],
        methods: {//方法定义
            getOrderSingleNosByApplianceInfo() {
                if (!!!this.form.registrationNo) {
                    ajaxRequest('post', 'back/entrustSjd/getCanJoinOrderSingleNos', {
                        wtdId: this.form.wtdId,
                        isUrgent: this.form.urgentDayPercent.split("@@")[0],
                        postId: this.form.postId,
                        subcontractArea: this.form.subcontractArea,
                        isAuthorise: this.form.isAuthorise
                    }, (res) => {
                        console.log(res, 'res')
                        if (res.code == 200) {
                            if (res.rows.length > 0) {
                                this.orderSingleNos = [{ID: '0', VALUE: '新生成'}].concat(res.rows);
                                this.form.orderSingleNo = this.orderSingleNos[1].ID;
                            } else {
                                this.orderSingleNos = [{ID: '0', VALUE: '新生成'}];
                                this.form.orderSingleNo = this.orderSingleNos[0].ID;
                            }
                        }
                    });
                }
            },
            getApplianceNameWidth() {
                this.divWidth = this.$refs.applianceName.$el.clientWidth * 2;
            },
            handleCancel() {
                this.callback()
            },
            show() {
                this.isShow = true;
                this.isRelative = 0;
            },
            handleChange() {
                console.log(this.form['applianceName'])
                if (this.form['applianceName']) {
                    let param = $.extend({}, {
                        'applianceName': this.form['applianceName'],
                        'companyId': this.form.companyId,
                        'isBjd': 1
                    }, {});
                    ajaxRequest('get', 'back/appliance/getApplianceInfoForAutoComplete', param, (res) => {
                        if (res.code == 200) {
                            this.relativeData = res.rows;
                            this.relativeData.length > 0 ? this.isRelative = 1 : null;
                        }
                    })
                } else {
                    this.isRelative = 0;
                }
            },
            /*相关列表选择数据*/
            setValue(row) {
                if (row) {

                    /*重新拉取岗位*/
                    // if (!this.options[row.departId]) {
                    this.getPostList(row.departId)
                    // }
                    this.isRelative = 0;

                    //计量器具id
                    Vue.set(this.form, 'applianceId', row.id);
                    Vue.set(this.form, 'source', row.source ? row.source : 0);
                    Vue.set(this.form, 'planApplianceId', row.planApplianceId);
                    Vue.set(this.form, 'correlationId', row.correlationId);
                    Vue.set(this.form, 'quotationNo', row.quotationNo);
                    if (!!row["planApplianceId"]) {
                        Vue.set(this.form, 'setNumber', row["setNumber"])
                        Vue.set(this.form, 'pieceNumber', row["pieceNumber"])
                        Vue.set(this.form, 'certificateNumber', row["certificateNumber"])
                        Vue.set(this.form, 'isUrgent', row["isUrgent"])
                        Vue.set(this.form, 'urgentProportions', row["urgentProportions"])
                        if (!!row["subcontractArea"]) Vue.set(this.form, 'subcontractArea', row["subcontractArea"])
                        Vue.set(this.form, 'remark', row["remark"])
                        Vue.set(this.form, 'factoryNo', row["factoryNo"])
                        Vue.set(this.form, 'equipmentNo', row["equipmentNo"])
                        Vue.set(this.form, 'manufacturer', row["manufacturer"])
                    }

                    //是否授权
                    if (row.isCalibrationAuth === '1' ||
                        row.isCnasAuth === '1' ||
                        row.isVerifyAuth === '1') {
                        Vue.set(this.form, 'isAuthorise', '1');
                    } else {
                        Vue.set(this.form, 'isAuthorise', '0');
                    }

                    Vue.set(this.form, 'applianceName', row["applianceName"])
                    //器具实际名称，如果有值，不覆盖
                    if (!!row["applianceActualName"]) {
                        Vue.set(this.form, 'applianceActualName', row["applianceName"])
                    } else {
                        if (this.form.applianceActualName === "" || this.form.applianceActualName == null) {
                            Vue.set(this.form, 'applianceActualName', row["applianceName"])
                        }
                    }
                    console.log(this.form, 'this.form')
                    //检测期限，计算
                    ajaxRequest('get', "back/entrustSjd/getDetectionDeadline", {
                        postId: row["postId"],
                        urgentDay: this.form.urgentDayPercent.split("@@")[0],
                        serviceDate: this.form.serviceDate
                    }, (res) => {
                        if (res.code == 200) {
                            Vue.set(this.form, 'detectionDeadline', res.daoResult)
                        }
                    });
                    Vue.set(this.form, 'departId', row['departId'])
                    Vue.set(this.form, 'postId', row['postId'])
                    this.handlePostChange();
                    Vue.set(this.form, 'certificateType', row['certificateType'])
                    Vue.set(this.form, 'detectionParameter', row['detectionParameter'])
                    Vue.set(this.form, 'model', row['model'])

                    //是否强检
                    Vue.set(this.form, 'isCompulsoryVerify', row['isCompulsoryVerify']);
                    this.applianceDisabled = this.form.isCompulsoryVerify === 0;
                    /*重新计算器具用途列表*/
                    if (!this.applianceDisabled) {
                        let code = row['applianceUse'];
                        if (!!code) {
                            code = "'" + row['applianceUse'].replace(/,/g, "','") + "'";
                        }
                        console.log(code, 'code')
                        ajaxProxyRequest('post', "njmind/findParam/applianceUse", {
                            code: code,
                            cache: 'false'
                        }, (res) => {
                            this.applianceUses = res.list
                            console.log(res.list, 'applianceUse')
                            if (res.list.length == 1) {
                                this.form.applianceUse = res.list[0].code;
                            }
                        });
                    } else {
                        if (this.applianceUses.length != applianceUsesLength) {
                            ajaxProxyRequest('post', "njmind/findParam/applianceUse", null, (res) => {
                                this.applianceUses = res.list
                            });
                        }
                    }
                    // this.applianceUseChange = row.applianceUse;
                    // Vue.set(this.form, 'com_applianceUseChange', row.applianceUse);

                }
            },
            handleCallBack(row) {
                this.isShow = false;
                this.setValue(row);
            },
            //执行人autoComplete
            querySearchPerson(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                let params = queryString ? {
                    userName: queryString,
                    isDelete: '0',
                    fuzzySearch: 1
                } : ''
                ajaxRequest('get', 'back/user/retrieve', params, (res) => {
                    if (res.code == 200) {
                        this.handleExecutorResult(res.rows);
                        cb(res.rows)
                    }
                })

            },
            handleExecutorResult(res) {
                console.log(res, 'userInfo')
                for (let key in res) {
                    Vue.set(res[key], 'value', res[key].userName)
                }
            },
            handleExecutorSelect(item) {
                this.$set(this.form, "executor", item.userName)
                this.$set(this.form, "executorId", item.userId)
            },
            changeCertificateNumber(index) {
                if (this.form.certificateNumber !== 0) {
                    Vue.set(this.form, 'certificateNumber', 0);
                } else {
                    Vue.set(this.form, 'certificateNumber', this.form.setNumber);
                }
            },
            /*套数与证书数量相同*/
            handleSetNumberChange(value) {


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
            getPostList(departId, postId) {
                this.postIds = [];
                if (departId) {
                    ajaxSyncRequest('get', 'back/post/listByDeptId/' + departId, {isDelete: 0}, (res) => {
                        console.log(res)
                        this.postIds = res.rows;
                        if (this.postIds.length == 1) {
                            this.form.postId = this.postIds[0].id;
                            this.handlePostChange();
                        } else {
                            Vue.set(this.form, 'postId', postId);
                        }
                    })
                }
            },
            handlePostChange() {
                this.handleIsUrgentChange(this.form.urgentDayPercent);
            },
            /*是否强检控制是否可选器具用途*/
            handleCompulsoryVerifyChange() {
                this.applianceDisabled = this.form.isCompulsoryVerify === 0;
                Vue.set(this.form, 'applianceUse', '');
            },
            /*是否加急change重新计算检测期限*/
            handleIsUrgentChange(value) {
                let urgentDays = value.split("@@")[0];

                ajaxRequest('get', "back/entrustSjd/getDetectionDeadline", {
                    postId: this.form.postId,
                    urgentDay: urgentDays,
                    serviceDate: this.form.serviceDate
                }, (res) => {
                    if (res.code == 200) {
                        Vue.set(this.form, "detectionDeadline", res.daoResult)
                    }
                });
                this.getOrderSingleNosByApplianceInfo();
            },
            /*分包区域change将证书数量置0*/
            handleAreaChange(value) {
                if (value !== '0') {
                    Vue.set(this.form, 'certificateNumber', 0);

                } else {
                    Vue.set(this.form, 'certificateNumber', this.form.setNumber);

                }
                this.getOrderSingleNosByApplianceInfo();
            },
            handleSubmit() {
                //-- 表单提交处理 --
                this.$refs.form.validate((valid) => {//校验成功则回调提交数据
                    if (valid) {
                        var httpMethod, messageInfo;//http请求方式
                        if (!this.form.registrationNo || this.form.registrationNo == '') {//新增 注意:通过id是否存在来判断是新增还是编辑
                            httpMethod = 'post';
                            messageInfo = '追加成功';

                            //录入的非报价器具，且查询进来的登记号source为4，
                            //则本次为报价器具追号，source为5，报价单编号使用查询进来的登记号的报价单编号
                            if (this.form.source != 4 && this.registrationNoSource == 4) {
                                this.form.source = 5;
                                this.form.quotationNo = this.registrationNoQuotationNo;
                            }
                            //如果source为0,普通录入，则使用wtdSource：0委托录入、2现场要号、3带回要号
                            if (this.form.source == 0) {
                                this.form.source = this.wtdSource;
                            }


                        } else {//更新
                            httpMethod = 'put';
                            messageInfo = '修改成功';
                        }
                        //加急天数、比例处理
                        this.form.isUrgent = this.form.urgentDayPercent.split("@@")[0];
                        this.form.urgentProportions = this.form.urgentDayPercent.split("@@")[1];

                        delete this.form.addTime;
                        delete this.form.updateTime;
                        delete this.form.serviceDate;
                        ajaxRequest(httpMethod, "back/entrustSjd/", this.form, (res) => {
                            if (res.code == 200) {
                                this.$message.success(messageInfo);
                                this.callback(this.form)
                            }
                        });
                    } else {
                        return false;
                    }
                })
            },
            remoteMethod() {
                //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
                this.loading = true;
                ajaxProxyRequest('get', "njmind/findParam/certificateType", null, (res) => {
                    this.certificateTypes = res.list
                });
                ajaxRequest('get', "back/depart/list/", {isDelete: 0}, (res) => {
                    this.departIds = res.rows
                });
                // ajaxRequest('get',"back/",null,(res)=>{
                //     if(res.code == 200){
                //         this.postIds=res.rows
                //     }
                // });
                ajaxProxyRequest('get', "njmind/findParam/applianceUse", null, (res) => {
                    this.applianceUses = res.list
                    this.applianceUsesLength = res.list.length
                });
                ajaxProxyRequest('get', "njmind/findParam/urgentDays", null, (res) => {
                    this.urgentDayPercents = res.list
                });
                ajaxProxyRequest('get', "njmind/findParam/powerTypes", null, (res) => {
                    this.powerTypess = res.list
                });
                ajaxProxyRequest('get', "njmind/findParam/subcontractAreas", null, (res) => {
                    this.subcontractAreas = res.list
                });
                ajaxProxyRequest('get', "njmind/findParam/isRepair", null, (res) => {
                    this.isRepairs = res.list
                });

                if (this.form.departId) {
                    this.getPostList(this.form.departId, this.form.postId);
                }

            },

        },
        components: {RelativeList, MoreList}
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
