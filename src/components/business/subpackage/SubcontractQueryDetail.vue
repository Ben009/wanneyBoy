<template>
    <div>
        <div v-show="specialDwRemark" style="margin-left:10px;margin-bottom: 10px;color:red;font-size:14px">
            <p>
                <!--上门特殊要求：-->
                {{visitSpecialRequirement}}
            </p>
            <p>
                <!--其他特殊要求：-->
                {{otherSpecialRequirement}}
            </p>
            <p>
                {{contractRequireNo}}
            </p>

        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
            <el-Row>
                <el-col :span="0">
                    <el-form-item label="自增主键" prop="wtdId">
                    </el-form-item>
                </el-col>
                <el-col :span="8" style="text-align: center">
                    <el-form-item label="受理人员">
                        <div style="font-size: 18px">&nbsp;&nbsp;{{userName}}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="" prop="detectionMethod">
                        <!--单选 -->
                        <el-radio-group v-model="form.detectionMethod">
                            <el-radio :label="'1'">送检</el-radio>
                            <!--<el-radio :label="'0'">现场</el-radio>-->
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item v-show="form.detectionMethod === '0'" label="执行人" prop="executor">
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
            <el-row>
                <el-col :span="8" style="text-align:center">
                    <el-form-item label="委托单编号" prop="orderNo">
                        <!--单行文本 v-model 绑定数据  -->
                        <a href="" style="font-size: 18px">{{form.orderNo}}</a>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button type="success" size="mini">委托单条码打印</el-button>
                    <el-button type="success" size="mini">打印委托单</el-button>
                    <el-button type="success" size="mini">打印所有流转单</el-button>
                </el-col>
            </el-row>

            <div class="title-item"><span>客户信息</span></div>
            <el-row>
                <el-col :span="hasAddCompanyPower?14:16">
                    <el-form-item label="委托单位" prop="companyName">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-autocomplete style="width: 100%"
                                         v-model="form.companyName"
                                         :fetch-suggestions="querySearchEntrust"
                                         placeholder="请输入委托单位"
                                         @select="handleSelect"
                                         :trigger-on-focus="flag"
                        ></el-autocomplete>
                    </el-form-item>
                </el-col>
                <el-col :span="hasAddCompanyPower?2:0" style="text-align: center">
                    <el-button type="primary" @click="addCompany" size="mini">添加单位</el-button>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="合同编号" prop="contractNo">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.contractNo" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2" style="text-align: center">
                    <el-button type="primary" @click="clearHtbh" size="mini">清空</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="省/市/区" prop="administrativeArea">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.administrativeArea" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="邮编" prop="postCode">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.postCode"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="统一社会信用代码" prop="creditCode">
                        <!--单行文本 v-model 绑定数据   -->
                        <el-input v-model="form.creditCode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="单位地址" prop="address">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="机构性质" prop="institutionalNature">
                        <el-select
                                placeholder="请选择"
                                value-key="name"
                                v-model="form.institutionalNature">
                            <el-option
                                    v-for="item in institutionalNatures"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="联系人" prop="contacter">
                        <el-input v-model="form.contacter"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系电话" prop="telephone">
                        <el-input v-model="form.telephone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="任务来源" prop="taskSource">
                        <el-input v-model="form.taskSource"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>

                <el-col :span="8" style="text-align: center">
                    <el-checkbox v-model="form.isMessage">若需系统发送短消息，请勾选</el-checkbox>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号码" prop="mobilePhone">
                        <el-input v-model="form.mobilePhone" placeholder="输入手机号码用于发送短消息"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" style="text-align: center">
                    <el-checkbox v-has="'M16704'" v-model="form.isSaveCompanyInfo">单位信息同步至单位库</el-checkbox>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="是否免费检测" prop="freeCheck">
                        <el-radio-group style="display:inline-block; line-height:1;" v-model="form.freeCheck">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否出具结论" prop="isConclusion">
                        <el-radio-group style="display:inline-block; line-height:1;" v-model="form.isConclusion">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否复检" prop="isRecheck">
                        <el-radio-group style="display:inline-block; line-height:1;" v-model="form.isRecheck">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="整单备注" prop="specialRequirement">
                        <!--单行文本 v-model 绑定数据  -->
                        <el-input v-model="form.specialRequirement"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="客户委托日期" prop="entrustDate">
                        <el-date-picker
                                v-model="form.entrustDate"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="证书单位名称" prop="certificateCompanyName">
                        <el-input v-model="form.certificateCompanyName" placeholder="不录入默认委托单位名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="要求证书日期" prop="certificatePrintTime">
                        <el-date-picker
                                v-model="form.certificatePrintTime"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="证书单位地址" prop="certificateCompanyAddress">
                        <el-input v-model="form.certificateCompanyAddress" placeholder="不录入默认委托单位地址"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item v-show="form.detectionMethod === '0'" label="业务受理日期" prop="serviceDate">
                        <el-date-picker
                                v-model="form.serviceDate"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="附件" prop="attachment">
                        <mind-upload ref="upFiles" :limitNumb="limitNumb" :callBack="fileUploadCallBack"></mind-upload>
                    </el-form-item>
                </el-col>
            </el-Row>
        </el-form>
        <show-more-list v-if="visable" :callback="handleCallBack"></show-more-list>
        <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">修 改</el-button>
      <el-button type="warning" @click="backToSubcontract">返 回</el-button>
    </span>

        <div class="title-item"><span>器具信息</span></div>
        <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">

      <el-button type="success" @click="printDetailCode">打印明细条码</el-button>
      <el-button type="success" v-if="form.detectionMethod === '0'" @click="printXcDetailCode">打印现场检测条码</el-button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-checkbox v-model="form.detailCodeZsdw">明细条码使用证书单位名称</el-checkbox>

    </span>
        <br/>

        <!-- 明细列表 明细时显示 -->
        <SubcontractEntrustList ref="entrustSjdList" :wtdId="wtdId" @getFormData="getFormData"></SubcontractEntrustList>

    </div>
</template>

<script>
    import Vue from 'vue';

    // 引入封装的ajax控件
    import {ajaxRequest, ajaxProxyRequest, formatDate} from '../../util/base';
    //引入jquery
    import $ from 'jquery';
    //引入右击事件 可自行绑定到输入框
    import rightclick from '../../../directives/rightcilck';
    import rightClick from '../../../mixins/FormRightClick';
    import showMoreList from '../plan/showMoreList'
    import SubcontractEntrustList from './SubcontractEntrustList'

/*     import {
        Button,
        Checkbox,
        CheckboxGroup,
        Col,
        Form,
        FormItem,
        Input,
        Radio,
        RadioGroup,
        Row,
    } from 'element--ui';
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(RadioGroup);
    Vue.use(Radio);
    Vue.use(CheckboxGroup);
    Vue.use(Checkbox);  */

    const defaults = {
        isMessage: true,
        detectionMethod: '1',
        //-- 是否免费检测，0否，1是的数据配置，注意要修改上面的配置项
        freeCheck: 0,
        //-- 是否出具结论，0否，1是的数据配置，注意要修改上面的配置项
        isConclusion: 0,
        //-- 是否复检，0否，1是的数据配置，注意要修改上面的配置项
        isRecheck: 0,
        institutionalNature: "系统外",
        entrustDate: new Date(),
        isAutoWtdh: false,
    };
    export default {
        name: "subcontractQueryDetail",
        props: {//用于接收从父组件中传来的数据
            data: {
                type: Object
            },
            callback: {
                type: Function
            }
        },
        data() {
            //input框中不输入字符，value为undefined
            var validateExecutor = (rule, value, callback) => {
                if (this.form.detectionMethod === '0' && (!value)) {
                    callback(new Error("请输入执行人"))
                } else {
                    callback();
                }
            };
            var validateMobilePhone = (rule, value, callback) => {
                if (this.form.isMessage && (!value)) {
                    callback(new Error("请输入手机号码"))
                } else {
                    callback();
                }
            };
            var validateServiceDate = (rule, value, callback) => {
                if (this.form.detectionMethod === '0' && (!value)) {
                    callback(new Error("请选择业务受理日期"))
                } else {
                    callback();
                }
            };
            let hasAddCompanyPower = false;
            //按钮权限判断
            let buttonpermsStr = window.localStorage.getItem("btnPower");
            if (buttonpermsStr == null || buttonpermsStr === undefined) {//没有权限，所有涉及权限的按钮都不展示
                hasAddCompanyPower = false;
            } else if (buttonpermsStr.indexOf("@M16701@") !== -1) {//有该按钮权限
                hasAddCompanyPower = true;
            }

            return {
                form: $.extend({}, defaults, this.data || {}),
                rules: {
                    //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
                    companyName: [{type: 'string', required: true, message: '单位名称不能为空'}],
                    address: [{type: 'string', required: true, message: '单位地址不能为空'}],
                    entrustDate: [{type: 'date', required: true, message: '请选择客户委托日期'}],
                    mobilePhone: [{validator: validateMobilePhone, trigger: 'blur'}],
                    executor: [{validator: validateExecutor, trigger: 'blur'}],
                    serviceDate: [{validator: validateServiceDate, trigger: 'blur'}],
                },
                loading: false,
                remoteOptions: [],
                institutionalNatures: [{"value": "系统外"}, {"value": "系统内"}, {"value": "内传"}],
                userName: window.localStorage.userName,
                hasAddCompanyPower: hasAddCompanyPower,

                //文件上传参数
                fileList: [],
                limitNumb: 1,//附件上传个数限制
                up_url: '',//自定义上传路径 [非必填]  默认不用修改
                fdata:{//附件额外参数
                    serverId:'',//服务id     [非必填]  分布式附件服务可以用默认不用配制
                    flowId:'', //流程id      [非必填]  流程相关
                    execType:'',//操作类型   [非必填]  业务相关
                    caseId:'',//登记号       [非必填]  业务相关的登记号
                },

                //autoComplete 是否不输入值就可匹配
                flag: false,
                //单位更多信息弹出框是否显示
                visable: false,

                specialDwRemark: false,
                visitSpecialRequirement: '',
                otherSpecialRequirement: '',
                contractRequireNo: '',

                wtdId: this.data.entrustId

            }
        },
        mounted() {
            let _self = this;
            _self.remoteMethod();
            _self.getFormData();

        },
        directives: {rightclick},
        mixins: [rightClick],
        components: {
            showMoreList,
            SubcontractEntrustList
        },
        methods: {//方法定义
            getFormData() {
                let _this = this;

                Vue.set(_this.form, 'wtdId', _this.form.entrustId);

                ajaxRequest('get', 'back/entrustWtd/' + _this.wtdId, {}, (res) => {
                    if (res.daoResult.isMessage === 1) {
                        res.daoResult.isMessage = true
                    }
                    _this.form = res.daoResult;

                    _this.form.serviceDate = formatDate(_this.form.serviceDate, 'YYYY-MM-DD');
                    _this.form.entrustDate = formatDate(_this.form.entrustDate, 'YYYY-MM-DD');
                    _this.form.certificatePrintTime = formatDate(_this.form.certificatePrintTime, 'YYYY-MM-DD');

                    //判断是否加载特殊需求备注
                    if (!!res.daoResult.visitSpecialRequirement) {
                        _this.visitSpecialRequirement = "上门特殊要求：" + res.daoResult.visitSpecialRequirement;
                        _this.specialDwRemark = true;
                    }
                    if (!!res.daoResult.otherSpecialRequirement) {
                        _this.otherSpecialRequirement = "其他特殊要求：" + res.daoResult.otherSpecialRequirement;
                        _this.specialDwRemark = true;
                    }
                    // 加载附件
                    _this.$refs.upFiles.loadAttacheIds(res.daoResult.attachment)
                })
            },
            addCompany() {

            },
            //执行人autoComplete
            querySearchPerson(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                let params = queryString ? {
                    userName: queryString,
                    isDelete: '0',
                    fuzzySearch: 1
                } : '';
                ajaxRequest('get', 'back/user/retrieve', params, (res) => {
                    if (res.code === 200) {
                        this.handleExecutorResult(res.rows);
                        cb(res.rows)
                    }
                })

            },
            handleExecutorResult(res) {
                for (let key in res) {
                    Vue.set(res[key], 'value', res[key].userName)
                }
            },
            handleExecutorSelect(item) {
                this.$set(this.form, "executor", item.userName);
                this.$set(this.form, "executorId", item.userId);
            },
            //委托单位autoComplete
            querySearchEntrust(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                let params = queryString ? {
                    companyName: queryString,
                    fuzzySearch: 1
                } : '';
                ajaxRequest('get', 'back/company/matchCompanysByName', params, (res) => {
                    if (res.code === 200) {
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
            handleSelect(item) {
                this.visable = true;
                console.log(item, 'companyInfo');
                this.$set(this.form, "companyId", item.id);
                this.$set(this.form, "companyName", item.companyName);
                this.$set(this.form, "contractNo", item.contractNo);
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
                this.$set(this.form, "administrativeArea", administrativeArea);
                this.$set(this.form, "postCode", item.postCode);
                this.$set(this.form, "creditCode", item.creditCode);
                this.$set(this.form, "address", item.address);
                this.$set(this.form, "contacter", item.contacter);
                this.$set(this.form, "telephone", item.telephone);
                this.$set(this.form, "mobilePhone", item.mobilePhone);

                //任务来源
                let taskSource = "";
                if (!!item.businessGroupName) {
                    taskSource += item.businessGroupName;
                }
                if (!!item.businessStaffName) {
                    taskSource += item.businessStaffName;
                }
                this.$set(this.form, "taskSource", taskSource)

                this.specialDwRemark = false;
                if (item.visitSpecialRequirement) {
                    this.visitSpecialRequirement = "上门特殊要求：" + item.visitSpecialRequirement;
                    this.specialDwRemark = true;
                }
                if (item.otherSpecialRequirement) {
                    this.otherSpecialRequirement = "其他特殊要求：" + item.otherSpecialRequirement;
                    this.specialDwRemark = true;
                }
                if (false) {
                    this.contractRequireNo = "该客户为协议单位，请优先从合同送检要号中进行配号从而跟踪合同！";
                    this.specialDwRemark = true;
                }


            },
            handleCallBack(val) {
                if (val) {
                    this.visable = true;
                }
                this.visable = false;
            },
            //清空合同编号
            clearHtbh() {
                Vue.set(this.form, "contractNo", "");
            },
            //callBack上传组件数据发生变化回调
            fileUploadCallBack(file, list) {
                this.fileList = list;
                this.form.attachment = this.fileList[0].id;
                // console.log(this.fileList[0].id);
                // console.log("调用上传页面收到的 附件列表", this.fileList);
            },
            handleSubmit() {
                //-- 表单提交处理 --
                console.log(this.form, 'wtdInfo')
                delete this.form['addTime'];
                this.form.serviceDate = new Date(this.form.serviceDate);
                this.form.entrustDate = new Date(this.form.entrustDate);
                this.form.certificatePrintTime = new Date(this.form.certificatePrintTime);
                this.$refs.form.validate((valid) => {//校验成功则回调提交数据
                    if (valid) {
                        this.form.entrustDate = formatDate(this.form.entrustDate, 'YYYY-MM-DD');
                        this.form.serviceDate = formatDate(this.form.serviceDate, 'YYYY-MM-DD');
                        this.form.certificatePrintTime = formatDate(this.form.certificatePrintTime, 'YYYY-MM-DD');
                        this.form.isMessage = this.form.isMessage ? 1 : 0;
                        this.form.source = this.form.source ? this.form.source : 0;
                        delete this.form['entrustSjdList'];
                        for (var key in this.form) {
                            if (this.form[key] == null) {
                                delete this.form[key]
                            }
                        }
                        ajaxRequest('put', "back/entrustWtd/", this.form, (res) => {
                            if (res.code === 200) {
                                this.$message.success('修改成功');
                                this.form.isMessage = (this.form.isMessage === 1 || this.form.isMessage);
                                this.$refs.entrustSjdList.getTableData();

                            }
                        });
                    } else {
                        return false;
                    }
                })
            },
            printOrderList() {
            },
            printDetailCode() {
            },
            printXcDetailCode() {
            },
            backToSubcontract() {
                this.callback();
            },
            remoteMethod() {
                //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
                this.loading = true;
                ajaxRequest('get', "back/", null, (res) => {
                    if (res.code === 200) {
                        this.institutionalNatures = res.rows
                    }
                });
            }

        }
    }
</script>

<style>
    /*
     右键菜单样式设置
   */
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

    .title-item {
        font-size: 16px;
        line-height: 16px;
        padding: 5px 0;
        border-bottom: 1px #c9c9c9 solid;
        margin-bottom: 15px;
    }

    .title-item > span:nth-of-type(1) {
        display: inline-block;
        line-height: 16px;
        padding-left: 8px;
        border-left: 3px #409EFF solid;
    }
</style>
