<template>
    <div style="position:relative;">
        <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
            <div class="title-item" style="margin-top:10px;"><span>基本信息</span></div>
            <br>
            <el-Row>
                <el-col :span="8">
                    <el-form-item label="单位名称" prop="sbmc">
                        {{form.dwMc}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="范围" prop="sugtype">
                        {{form.sugtype == '0'?'业务相关':(form.sugtype == '1'?'系统使用':'')}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="类别" prop="sugclass">
                        {{form.sugclass}}
                    </el-form-item>
                </el-col>
                  <el-col :span="8" >
                    <el-form-item label="联系电话" prop="dh">
                        {{form.dh}}
                    </el-form-item>
                </el-col>
            </el-Row>

            <el-Row>
                <el-col :span="8">
                    <el-form-item label="标题" prop="title">
                        {{form.title}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="内容" prop="content">
                        {{form.content}}
                    </el-form-item>
                </el-col>
                  <el-col :span="8">
                    <el-form-item label="创建时间" prop="djsj">
                        {{form.djsj}}
                    </el-form-item>
                </el-col>

                  <el-col :span="8" >
                    <el-form-item label="附件" prop="ccbh">
                        <p v-show="!!form.fjaddress">
                            <i class="el-icon-document"></i>
                            <a :href="cmiimsUrl + '/'+form.fjaddress" target="_blank">{{form.fjname | urldecode}}</a>
                        </p>
                        <p v-show="!form.fjaddress">

                        </p>
                    </el-form-item>
                </el-col>
            </el-Row>


            <div class="title-item" style="margin-top:30px;"><span>指定回复人</span></div>
            <br>

            <el-Row>
                <el-col :span="1" >
                    <el-form-item label="部门" prop="traPersonDepart">
                        <el-select v-model="form.traPersonDepart" @change="changeDepartEvt" style="width: 100%">
                            <el-option
                                v-for="item in departs"
                                :key="item.id"
                                :label="item.departName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="1" >
                    <el-form-item label="回复人" prop="traPerson">
                        <el-select placeholder="请选择"  v-model="form.traPerson" style="width: 100%">
                            <el-option
                                v-for="item in users"
                                :key="item.id"
                                :label="item.userName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-Row>

        </el-form>
        <span slot="footer" class="dialog-footer" style="display: block; text-align: center; margin-top: 50px;margin-bottom: 20px">
            <el-button type="primary" @click="handleSubmit" v-if="form.replayflag == '0'">提 交</el-button>
            <el-button @click="handleCancel">返 回</el-button>
        </span>
    </div>
</template>

<script>
    import Vue from 'vue';

    // 引入封装的ajax控件
    import {ajaxRequest, ajaxProxyRequest,ajaxSyncRequest} from '../../util/base';
    //引入jquery
    import $ from 'jquery';
    //引入右击事件 可自行绑定到输入框
    import rightclick from '../../../directives/rightcilck';
    import rightClick from '../../../mixins/FormRightClick';

    /* import {
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
        Select
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
    Vue.use(Checkbox); */




    const defaults = {
        hoho: ''
    };
    export default {
        name: "designated-Reply-Form",
        props: {//用于接收从父组件中传来的数据
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
                    replay: [
                        {type: 'string', required: true, message: '请输入回复内容', trigger: 'blur'},
                        {type: 'string', max: 500, message: '最多输入500个字符', trigger: 'blur'}
                    ]
                },
                loading: false,
                cmiimsUrl: "",
                departs: [],
                dept:null,
                users:[]
            }
        },
        mounted() {
            //页面渲染完成后，ajax请求加载数据
            this.getDepartList();
            this.remoteMethod();

        },
        directives: {rightclick},
        mixins: [rightClick],
        filters: {
            urldecode: function (value) {
                return decodeURI(value);
            }
        },
        methods: {//方法定义
            handleSubmit() {
                //-- 表单提交处理 --
                var _this = this;
                this.$refs.form.validate((valid) => {//校验成功则回调提交数据
                    if (valid) {
                        ajaxRequest("post", "back/suggest/designatedReply/", _this.form, (res) => {
                            if (res.code == 200) {
                                _this.$message.success(res.msg);
                            } else if (res.code == 1) {
                                _this.$message.error(res.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                })
            },

            //获取部门数据
            getDepartList() {
                let _this = this;
                ajaxRequest("get", "back/secondAllot/getDeptByPower/", {}, res => {
                    _this.departs = res.rows;
                });
            },

            //根据部门ID获取人员
            changeDepartEvt(deptId) {
                let _this = this;
                if (deptId) {
                    ajaxRequest("get", "back/user/listUserByDeptId/" + deptId, {}, res => {
                            _this.users = res.rows;
                            Vue.set(_this.form, "traPerson", "");
                        }
                    );
                }
            },

            //根据部门ID获取人员
            initUser(deptId) {
                let _this = this;
                if (deptId) {
                    ajaxSyncRequest("get", "back/user/listUserByDeptId/" + deptId, {}, res => {
                            _this.users = res.rows;
                        }
                    );
                }
            },

            remoteMethod() {
                let _this = this
                //获取外网服务器地址
                ajaxProxyRequest('get', "/njmind/findParam/cmiimsUrl", null, (res) => {
                    _this.cmiimsUrl = res.value;
                });

                ajaxRequest('get', "back/suggest/findById", {id: _this.$route.query.id}, (res) => {
                    if(res.t.traPerson != "" && res.t.traPerson != null && res.t.traPerson != undefined){
                        res.t.traPerson = parseInt(res.t.traPerson);
                        _this.initUser(res.t.traPersonDepart);
                    }
                    _this.form = $.extend({}, defaults, res.t);
                });
            },

            handleCancel() {
                window.history.go(-1);
            }
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

    .list-width {
        width: 100%;
    }
</style>
