<template>
    <mind-dialog
        :title="'强检目录项别维护'"
        :visible="true"
        dialogSize="mini"
        center
        v-dialogDrag
        @close="handleCancel">

        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
            <el-Row>
                <el-col :span="24">
                    <el-form-item label="项别号" prop="itemNum">
                        <el-input v-model="form.itemNum"
                                  v-rightclick="handleRightClick.bind(this,form,'itemNum')"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>

            <el-Row>
                <el-col :span="24">
                    <el-form-item label="项别名称" prop="itemName">
                        <el-input v-model="form.itemName"
                                  v-rightclick="handleRightClick.bind(this,form,'itemName')"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>

            <!--<el-Row>-->
                <!--<el-col :span="24">-->
                    <!--<el-form-item label="项别英文称" prop="itemEnglishName">-->
                        <!--<el-input v-model="form.itemEnglishName"-->
                                  <!--v-rightclick="handleRightClick.bind(this,form,'itemEnglishName')"></el-input>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->
            <!--</el-Row>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
            <el-button @click="handleCancel">取 消</el-button>
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
    Vue.use(Checkbox);
     */
    
    const defaults = {
        hoho: ''
    };
    export default {
        name: "forceCatalogItemForm",
        props: {//用于接收从父组件中传来的数据
            data: {
                type: Object
            },
            callback: {
                type:Function
            }
        },
        data() {
            let _this = this;
            var validateNum = function (rule, value, callback) {
                if (!new RegExp(/^[0-9]*$/).test(value)) {
                    callback(new Error("请输入数字"));
                } else {
                    ajaxRequest('get', "back/forceCatalogItem/checkForceCatalogItem", {
                        itemNum: value, id: _this.form.id
                    }, (res) => {
                        if (res.code == 1) {
                            callback(new Error("项别号已存在，请重新输入"));
                        } else {
                            callback()
                        }
                    })
                }
            }

            var validateName = function (rule, value, callback) {
                ajaxRequest('get', "back/forceCatalogItem/checkForceCatalogItem", {
                    itemName: value, id: _this.form.id
                }, (res) => {
                    if (res.code == 1) {
                        callback(new Error("项别名称已存在，请重新输入"));
                    } else {
                        callback()
                    }
                })
            }

//            var validateEnName = function (rule, value, callback) {
//                if (!new RegExp(/^[a-zA-Z]*$/).test(value)) {
//                    callback(new Error("请输入英文名称"));
//                } else {
//                    ajaxRequest('get', "back/forceCatalogItem/checkForceCatalogItem", {
//                        itemEnglishName: value, id: _this.form.id
//                    }, (res) => {
//                        if (res.code == 1) {
//                            callback(new Error("项别英文名称已存在，请重新输入"));
//                        } else {
//                            callback()
//                        }
//                    })
//                }
//            }

            return {
                form: $.extend({}, defaults, this.data || {}),
                rules: {
                    itemNum: [
                        {type: 'string', required: true, message: '请填写项别号', trigger: 'blur'},
                        {type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur'},
                        {type: 'string', validator: validateNum, trigger: 'blur'}
                    ],
                    itemName:[
                        {type: 'string', required: true, message: '请填写项别号名称', trigger: 'blur'},
                        {type: 'string', max: 200, message: '最多输入200个字符', trigger: 'blur'},
                        {type: 'string', validator: validateName, trigger: 'blur'}
                    ]
//                    itemEnglishName:[
//                        {type: 'string', required: true, message: '请填写项别号英文名称', trigger: 'blur'},
//                        {type: 'string', max: 200, message: '最多输入200个字符', trigger: 'blur'},
//                        {type: 'string', validator: validateEnName, trigger: 'blur'}
//                    ]
                },
                loading: false,
                remoteOptions: [],
            }
        },
        mounted() {
            //页面渲染完成后，ajax请求加载数据
            this.remoteMethod();
        },
        directives: {rightclick},
        mixins: [rightClick],
        methods: {//方法定义
            handleSubmit() {
                //-- 表单提交处理 --
                var _this = this;
                this.$refs.form.validate((valid) => {//校验成功则回调提交数据
                    if (valid) {
                        var httpMethod;//http请求方式
                        if (!_this.form.id || _this.form.id == '') {//新增 注意:通过id是否存在来判断是新增还是编辑
                            httpMethod = 'post';
                        } else {//更新
                            httpMethod = 'put';
                        }
                        ajaxRequest(httpMethod, "back/forceCatalogItem/", _this.form, (res) => {
                            if (res.code == 200) {
                                _this.$message.success('保存成功');
                                _this.$emit('getTableList');
                                _this.callback();
                            }else if(res.code == 1){
                                _this.$message.error(res.msg);
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
            },
            handleCancel(){
                this.callback();
            }
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
