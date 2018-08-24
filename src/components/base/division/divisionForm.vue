<template>
    <mind-dialog
        :title="'新增行政区划'"
        :visible="true"
        dialogSize="mini"
        center
        v-dialogDrag
        @close="handleCancel">
        <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
        <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="140px">
            <el-Row>
                <el-col :span="24">
                    <el-form-item label="行政区划编号" prop="divisionNum">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.divisionNum"
                                  v-rightclick="handleRightClick.bind(this,form,'divisionNum')"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="24">
                    <el-form-item label="行政区划名称" prop="divisionName">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.divisionName"
                                  v-rightclick="handleRightClick.bind(this,form,'divisionName')"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row>
                <el-col :span="24">
                    <el-form-item label="上级行政区划" prop="divisionFather1">

                        <el-cascader placeholder="请选择" :props="props" :options="options"
                                     v-model="form.divisionFather1"  filterable change-on-select
                                     style="width:60%"  :popper-append-to-body="true">
                        </el-cascader>

                    </el-form-item>
                </el-col>
            </el-Row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <!-- 绑定form提交事件-->
          <el-button type="primary" size="mini" @click="handleSubmit">保 存</el-button>
          <el-button size="mini" @click="handleCancel">取 消</el-button>
      </span>
    </mind-dialog>
</template>

<script>
    import Vue from 'vue';
    // 引入封装的ajax控件
    import {ajaxRequest} from '../../util/base';

    //引入jquery
    import $ from 'jquery';
    //引入右击事件 可自行绑定到输入框
    import rightclick from '../../../directives/rightcilck';
    import rightClick from '../../../mixins/FormRightClick';


/*     
    import {
        Button,
        Cascader,
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
    Vue.use(Cascader);
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
        name: "divisionForm",
        props: {//用于接收从父组件中传来的数据
            data: {
                type: Object
            },
            callback: {
                type: Function
            }
        },
        data() {
            let _this = this;
            var validateNum = function (rule, value, callback) {
                if (!new RegExp(/^[0-9]*$/).test(value)) {
                    callback(new Error("请输入数字"));
                } else {
                    ajaxRequest('get', "back/division/checkDivisionNumOrName", {
                        divisionNum: value, id: _this.form.id
                    }, (res) => {
                        if (res.code == 1) {
                            callback(new Error("行政区划编号已存在，请重新输入"));
                        } else {
                            callback()
                        }
                    })
                }
            }

            var validateName = function (rule, value, callback) {
                var df = "86";
                if (!!_this.form.divisionFather1 && _this.form.divisionFather1.length > 0) {
                    df = _this.form.divisionFather1[_this.form.divisionFather1.length - 1];
                }
                ajaxRequest('get', "back/division/checkDivisionNumOrName", {
                    divisionName: value,
                    divisionFather: df,
                    id: _this.form.id
                }, (res) => {
                    if (res.code == 1) {
                        callback(new Error("行政区划名称已存在，请重新输入"));
                    } else {
                        callback();
                    }
                })

            }

            var validateFather = function (rule, value, callback) {
                callback()
                if(_this.form.divisionName !=null && _this.form.divisionName != '' && _this.form.divisionName !=undefined){
                    _this.$refs.form.validateField('divisionName');
                }
            }

            return {
                form: $.extend({}, defaults, this.data || {}),
                rules: {
                    divisionNum: [
                        {type: 'string', required: true, message: '请填写行政区划编号', trigger: 'blur'},
                        {type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur'},
                        {type: 'string', validator: validateNum, trigger: 'blur'}
                    ],
                    divisionName: [
                        {type: 'string', required: true, message: '请填写行政区划名称', trigger: 'blur'},
                        {type: 'string', max: 100, message: '最多输入100个字符', trigger: 'blur'},
                        {type: 'string', validator: validateName, trigger: 'blur'}
                    ],
                    divisionFather1: [{type: 'string', validator: validateFather, trigger: ''}]
                },
                loading: false,

                options: [],
                props: {
                    value: "divisionNum",
                    label: "divisionName",
                }
            }
        },
        mounted() {
            //页面渲染完成后，ajax请求加载数据
            this.initData();
        },
        directives: {rightclick},
        mixins: [rightClick],
        methods: {//方法定义
            handleSubmit() {
                //-- 表单提交处理 --
                var divisionFather = this.form.divisionFather1;
                if (!!divisionFather && divisionFather != '' && divisionFather.length == 2) {
                    Vue.set(this.form, "divisionFather", divisionFather[1]);
                    Vue.set(this.form, "divisionFatherFather", divisionFather[0]);
                    Vue.set(this.form, "divisionLevel", 3);
                } else if (!!divisionFather && divisionFather != '' && divisionFather.length == 1 && divisionFather[0] != "86") {
                    Vue.set(this.form, "divisionFather", divisionFather[0]);
                    Vue.set(this.form, "divisionFatherFather", "86");
                    Vue.set(this.form, "divisionLevel", 2);
                } else {
                    Vue.set(this.form, "divisionFather", "86");
                    Vue.set(this.form, "divisionFatherFather", null);
                    Vue.set(this.form, "divisionLevel", 1);
                }
                var _this = this;
                this.$refs.form.validate((valid) => {//校验成功则回调提交数据
                    if (valid) {
                        var httpMethod;//http请求方式
                        if (!_this.form.id || _this.form.id == '') {//新增 注意:通过id是否存在来判断是新增还是编辑
                            httpMethod = 'post';
                        } else {//更新
                            httpMethod = 'put';
                        }

                        delete _this.form.children;

                        ajaxRequest(httpMethod, "back/division/", _this.form, (res) => {
                            if (res.code == 200) {
                                _this.$message.success('保存成功');
                                _this.$emit('getTableList');
                                _this.handleCancel();
                            }else if(res.code == 1){
                                _this.$message.error(res.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                })
            },
            handleCancel() {
                this.callback();
            },

            initData() {
                ajaxRequest('get', "back/division/findDivisionList", {floor: "2"}, (res) => {
                    if (res.code == 200) {
                        this.options = res.rows || [];
                        var divisionFather1 = [];
                        //默认值(回显)
                        if (this.form.divisionFatherFather != undefined && this.form.divisionFatherFather != null && this.form.divisionFatherFather != "") {
                            divisionFather1.push(this.form.divisionFatherFather);
                        }

                        if (this.form.divisionFather != undefined && this.form.divisionFather != null && this.form.divisionFather != "") {
                            divisionFather1.push(this.form.divisionFather);
                        }
                        if (divisionFather1.length > 0) {
                            Vue.set(this.form, "divisionFather1", divisionFather1);
                        }
                    }
                });
            }
        }
    }
</script>

<style>
/**右键菜单样式*/
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
    .el-form-item--mini .el-form-item__error{padding-top:6px!important;}

</style>
