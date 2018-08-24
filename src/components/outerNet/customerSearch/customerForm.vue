<template>
    <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
            <div class="title-item" style="margin-top:10px;"><span>单位信息</span></div>
            <br>
            <el-Row>
                <el-col :span="12" :push="6">
                    <el-form-item label="单位名称" prop="dwMc">
                        <el-input v-model="form.dwMc" v-rightclick="handleRightClick.bind(this,form,'dwMc')"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="12" :push="6">
                    <el-form-item label="统一社会信用代码" prop="zzjgdm">
                        <el-input v-model="form.zzjgdm"
                                  v-rightclick="handleRightClick.bind(this,form,'zzjgdm')"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="12" :push="6">
                    <el-form-item label="登录名" prop="loginName">
                        <el-input v-model="form.loginName"
                                  v-rightclick="handleRightClick.bind(this,form,'loginName')"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="12" :push="6">
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="form.mobile"
                                  v-rightclick="handleRightClick.bind(this,form,'mobile')"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="12" :push="6">
                    <el-form-item label="联系人" prop="lxr">
                        <el-input v-model="form.lxr" v-rightclick="handleRightClick.bind(this,form,'lxr')"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="12" :push="6">
                    <el-form-item label="联系电话" prop="dh">
                        <el-input v-model="form.dh" v-rightclick="handleRightClick.bind(this,form,'dh')"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="12" :push="6">
                    <el-form-item label="行政区划" prop="division">
                        <!--<el-input v-model="form.xzqh" v-rightclick="handleRightClick.bind(this,form,'xzqh')"></el-input>-->
                        <el-cascader placeholder="请输入或选择" :props="props" :options="options"
                                     v-model="form.division"  filterable
                                     style="width:100%">
                        </el-cascader>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="12" :push="6">
                    <el-form-item label="单位地址" prop="dz">
                        <el-input v-model="form.dz" v-rightclick="handleRightClick.bind(this,form,'dz')"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
        </el-form>
        <span slot="footer" class="dialog-footer" style="display: block; text-align: center;margin-top: 20px;margin-bottom: 20px">
            <el-button type="warning" v-mindPopover="{message:'确认复位密码？若确认系统将给该用客户注册手机发送密码短信！',success:passwordReset.bind(this)}">密码复位</el-button>
            <el-button type="primary" @click="reassociate" v-if="form.shflag == '1'">重新关联</el-button>
            <el-button type="primary" v-mindPopover="{message:'确认修改该单位相关信息?',success:saveNewInfo.bind(this)}">保存新信息</el-button>
            <el-button @click="cancel">返 回</el-button>
        </span>

        <div v-if="!!companyItem">
            <companyList :data="companyItem" :dialogCancel="dialogCancel"></companyList>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    import {ajaxRequest} from '../../util/base';
    import $ from 'jquery';
    import rightclick from '../../../directives/rightcilck';
    import rightClick from '../../../mixins/FormRightClick';
    import companyList from './companyList'

    const defaults = {
        hoho: ''
    };
    export default {
        name: "layout",
        props: {
            data: {
                type: Object
            }
        },
        data() {

            let _this = this;
            var validateLoginName = function (rule, value, callback) {
                ajaxRequest('get', "back/customer/checkCustomer", {
                    loginName: value, id: _this.form.id
                }, (res) => {
                    if (res.code == 1) {
                        callback(new Error("登录名已存在，请重新输入"));
                    } else {
                        callback()
                    }
                })
            }

            var validateMobile = function (rule, value, callback) {
                if (!new RegExp(/^1(3|4|5|7|8)\d{9}$/).test(value)) {
                    callback(new Error("手机号格式不正确，请重新输入"));
                } else {
                    ajaxRequest('get', "back/customer/checkCustomer", {
                        mobile: value, id: _this.form.id
                    }, (res) => {
                        if (res.code == 1) {
                            callback(new Error("手机号已存在，请重新输入"));
                        } else {
                            callback()
                        }
                    })
                }
            }

            return {
                form: $.extend({}, defaults, this.data || {}),
                rules: {
                    dwMc: [
                        {type: 'string', required: true, message: '请输入单位名称', trigger: 'blur'},
                        {type: 'string', max: 200, message: '最多输入200个字符', trigger: 'blur'}
                    ],
                    zzjgdm: [
                        {type: 'string', required: true, message: '请输入统一社会信用代码', trigger: 'blur'},
                        {type: 'string', max: 18, message: '最多输入18个字符', trigger: 'blur'},
                    ],
                    loginName: [
                        {type: 'string', required: true, message: '请输入登录名', trigger: 'blur'},
                        {type: 'string', max: 100, message: '最多输入100个字符', trigger: 'blur'},
                        {type: 'string', validator: validateLoginName, trigger: 'blur'}
                    ],
                    mobile: [
                        {type: 'string', required: true, message: '请输入手机号', trigger: 'blur'},
                        {type: 'string', max: 11, message: '最多输入11个字符', trigger: 'blur'},
                        {type: 'string', validator: validateMobile, trigger: 'blur'}
                    ],
                    lxr: [
                        {type: 'string', required: true, message: '请输入联系人', trigger: 'blur'},
                        {type: 'string', max: 100, message: '最多输入100个字符', trigger: 'blur'},
                    ],
                    division: [
                        {type: 'array', required: true, message: '请输入行政区划', trigger: 'change'},
                    ],
                    dz: [
                        {type: 'string', required: true, message: '请输入单位地址', trigger: 'blur'},
                        {type: 'string', max: 400, message: '最多输入400个字符', trigger: 'blur'}
                    ]
                },
                loading: false,
                remoteOptions: [],
                options: [],
                props: {
                    value: "divisionNum",
                    label: "divisionName",
                },
                companyItem:null
            }
        },
        mounted() {
            this.remoteMethod();
        },
        directives: {rightclick},
        mixins: [rightClick],
        methods: {
            remoteMethod() {
                //加载行政区划
                let _this = this
                ajaxRequest('get', "back/division/findDivisionList", {floor: "3"}, (res) => {
                    _this.options = res.rows || [];
                });


                //根据id查询托管器具详情
                ajaxRequest('get', 'back/customer/findCustomerById', {
                    id: _this.$route.query.id
                }, (res) => {
                    if (res.code == 200) {
                        _this.form = res.t || {};
                    }else{
                        _this.$message.error(res.msg);
                    }
                })
            },

            passwordReset: function () {
                //密码复位
                var _this = this;
                delete _this.form.division;
                ajaxRequest("post", "back/customer/passwordReset", _this.form, (res) => {
                    if (res.code == 200) {
                        _this.$message.success(res.msg);
                    } else {
                        _this.$message.error(res.msg);
                    }
                });
            },

            reassociate: function () {
                //重新关联
                this.companyItem = this.form;
            },

            dialogCancel:function () {
                this.companyItem = null;
            },

            saveNewInfo: function () {
                //保存新信息
                var _this = this;
                this.$refs.form.validate((valid) => {//校验成功则回调提交数据
                    if (valid) {
                        //处理行政区划
                        if (_this.form.division.length < 3) {
                            _this.$message.error("请选择行政区划");
                            return false;
                        }
                        _this.form.xzqh = _this.form.division[2];
                        delete _this.form.division;
                        ajaxRequest('put', "back/customer/", _this.form, (res) => {
                            if (res.code == 200) {
                                _this.$message.success('保存成功');
                            } else {
                                _this.$message.error(res.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                })
            },

            cancel: function () {
                window.history.go(-1);
            }

        },
        components: {
            companyList
        }
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
