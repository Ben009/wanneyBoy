<template>
    <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-Row>
                <el-col :span="1">
                    <el-form-item label="类别:" prop="lb">
                        <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
                        <el-select class="list-width"
                                   :popperAppendToBody="false"
                                   placeholder="请选择"
                                   value-key="lb"
                                   v-model="form.lb">
                            <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
                            <el-option
                                v-for="item in lbs"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="1">
                    <el-form-item label="标题:" prop="title">
                        <el-input v-model="form.title"
                                  v-rightclick="handleRightClick.bind(this,form,'title')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="发布人:" prop="author">
                        <el-input v-model="form.author"
                                  v-rightclick="handleRightClick.bind(this,form,'author')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="发布时间:" prop="djsj">
                        <el-date-picker class="list-width"
                                        v-model="form.djsj"
                                        type="date"
                                        placeholder="选择日期"
                                        :format="temp_format"
                                        :value-format="temp_format">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="发布到:" prop="versionflag">
                        <el-checkbox-group v-model="form.versionflag">
                            <el-checkbox label="2">公共服务平台</el-checkbox>
                            <el-checkbox label="1">强检平台</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="附件:" prop="fj">
                        <mind-upload ref="upFiles" :limitNumb="limitNumb" :callBack="fileUploadCallBack"  :disabled="form.replayflag == '1'"></mind-upload>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <polregKindeEitor ref="polregKindeEitor"/>
                </el-col>

            </el-Row>
        </el-form>
        <span slot="footer" class="dialog-footer"
              style="display: block; text-align: center; margin-top: 20px;margin-bottom: 20px">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="danger" v-mindPopover="{message:'确定生效?',success:update.bind(this)}" :disabled="isBlank(form.id) || form.disflag == '1'">生效</el-button>
            <el-button type="danger" @click="add">新增政策法规</el-button>
            <el-button  @click="cancel">返 回</el-button>
        </span>
    </div>
</template>

<script>
    import Vue from 'vue';

    import {ajaxRequest,formatDate} from '../../util/base';
    import $ from 'jquery';
    import rightclick from '../../../directives/rightcilck';
    import rightClick from '../../../mixins/FormRightClick';
    import polregKindeEitor from './polregKindeEitor';



    const defaults = {
        lb:null,
        title:null,
        author:null,
        djsj:null,
        versionflag:[],
        fj:null,
    };
    export default {
        name: "polregForm",
        components: {
            /** 模块对象 import 进来 后的别名  */
            polregKindeEitor,
        },
        props: {
            data: {
                type: Object
            },
            callback: {
                type: Function
            },
        },
        data() {
            return {
                form: $.extend({},defaults),
                rules: {
                    lb: [
                        {type: 'string', required: true, message: '请选择类别', trigger: 'change'}
                    ],
                    title: [
                        {type: 'string', required: true, message: '请输入标题', trigger: 'blur'},
                        {type: 'string', max: 400, message: '最多输入400个字符', trigger: 'blur'}
                    ],
                    author: [
                        {type: 'string', required: true, message: '请输入发布人', trigger: 'blur'},
                        {type: 'string', max: 100, message: '最多输入100个字符', trigger: 'blur'},
                    ],
                    djsj: [
                        {type: 'string', required: true, message: '请选择发布时间', trigger: 'change'},
                    ],
                    versionflag: [
                        {type: 'array', required: true, message: '请选择发布平台', trigger: 'change'},
                    ]
                },
                loading: false,
                lbs: [
                    {key: "政策法规", label: "政策法规", value: "政策法规"},
                    {key: "通知", label: "通知", value: "通知"}
                ],

                limitNumb:10,//上传文件数量限制   默认为4

                temp_format:'yyyy-MM-dd'
            }
        },
        mounted() {
//            this.$refs.upFiles.loadAttacheIds(this.attachIds);
            this.remoteMethod();
        },

        directives: {rightclick},
        mixins: [rightClick],
        methods: {
            remoteMethod() {
                let _this = this
                if (_this.$route.query.id) {
                    ajaxRequest('get', "back/polreg/findById", {id: _this.$route.query.id}, (res) => {
                        res.t.versionflag = res.t.versionflag.split("、")
                        _this.form = $.extend({},defaults,res.t);
                        if(_this.form.fjaddress != "" && _this.form.fjaddress != null && _this.form.fjaddress != undefined){
                            _this.$refs.upFiles.loadAttacheIds(_this.form.fjaddress.replace("`",","));
                        }
                        _this.$refs.polregKindeEitor.setKindEditorData(_this.form.content);
                    });
                }else{
                    Vue.set(this.form,"author",localStorage.getItem("userName"));
                    Vue.set(this.form,"djsj",new Date().toISOString().slice(0, 10));
                }
            },


            initData:function () {
                let _this = this
                ajaxRequest('get', "back/polreg/findById", {id: _this.form.id}, (res) => {
                    res.t.versionflag = res.t.versionflag.split("、");
                    _this.form =  $.extend({},defaults,res.t);
                    if(_this.form.fjaddress != "" && _this.form.fjaddress != null && _this.form.fjaddress != undefined){
                        _this.$refs.upFiles.loadAttacheIds(_this.form.fjaddress.replace("`",","));
                    }

                    _this.$refs.polregKindeEitor.setKindEditorData(_this.form.content);
                });
            },


            //保存
            save: function () {
                //保存新信息
                var _this = this;
                this.$refs.form.validate((valid) => {//校验成功则回调提交数据
                    if (valid) {
                        _this.form.content = _this.$refs.polregKindeEitor.getKindEditorData();
                        var param = JSON.parse(JSON.stringify(_this.form));

                        param.versionflag = param.versionflag.map(function (v) {
                            return v
                        }).join("、");

                        ajaxRequest('post', "back/polreg/savePolreg", param, (res) => {
                            if (res.code == 200) {
                                _this.form.id = res.t.id;
                                _this.initData();
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


            isBlank:function (str) {
                if (str == '' || str == null || str == undefined) {
                    return true;
                }else{
                    return false;
                }
            },

            //生效
            update: function () {
                var _this = this;

                if (_this.isBlank(_this.form.id)) {
                    _this.$message.error('请先保存信息！');
                    return false;
                }

                ajaxRequest('post', "back/polreg/updateDisPolreg", {id:_this.form.id}, (res) => {
                    if (res.code == 200) {
                        _this.$message.success('生效成功！');
                        _this.initData();
                    } else {
                        _this.$message.error(res.msg);
                    }
                });
            },

            add:function () {
                this.$refs["form"].resetFields();
                delete this.$route.query.id;
                this.$refs.polregKindeEitor.setKindEditorData("");
                this.form = $.extend({},defaults);
                this.$refs.upFiles.$refs.upFiles.clearFiles();
                this.remoteMethod();
            },

            //返回
            cancel: function () {
                window.history.go(-1);
            },

            //callBack上传组件数据发生变化回调
            //callBack上传组件数据发生变化回调
            fileUploadCallBack:function(file, list) {
                this.fileList = list;
                console.log("调用上传页面收到的 附件列表", this.fileList);

                this.form.fjname = this.fileList.map(function (v) {
                    return v.name
                }).join("`");

                this.form.fjaddress = this.fileList.map(function (v) {
                    return v.id
                }).join("`");
                /*
                返回参数说明
                list:[{
                  id:"附件id",
                  name:"附件名",
                  url:"附件下载链接",
                  //注意：response*只有新上传才有该属性，初始化加载的附件没有该属性
                  response:{v_attach_id:"附件id",
                            v_server_url:"下载前缀",
                            v_stream_url:"流读取前缀加上（v_attach_id）后可以在后台读取，用于上传导入具体后台方法见文档"}
                },{……}]
                */
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

    .list-width {
        width: 100%;
    }
</style>
