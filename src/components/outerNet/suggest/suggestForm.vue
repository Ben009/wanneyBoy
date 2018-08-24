<template>
    <div style="position:relative;">
        <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
            <div class="title-item" style="margin-top:10px;"><span>基本信息</span></div>
            <br>
            <el-Row>
                <el-col :span="8" >
                    <el-form-item label="单位名称:" prop="sbmc">
                        {{form.dwMc}}
                    </el-form-item>
                </el-col>

                <el-col :span="8" >
                    <el-form-item label="范围:" prop="sugtype">
                        {{form.sugtype == '0'?'业务相关':'系统使用'}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="类别:" prop="sugclass">
                        {{form.sugclass}}
                    </el-form-item>
                </el-col>

                  <el-col :span="8" >
                    <el-form-item label="联系电话:" prop="dh">
                        {{form.dh}}
                    </el-form-item>
                </el-col>
            </el-Row>

            <el-Row>
                   <el-col :span="8" >
                    <el-form-item label="标题:" prop="title">
                        {{form.title}}
                    </el-form-item>
                </el-col>

                <el-col :span="8" >
                    <el-form-item label="内容:" prop="content">
                        {{form.content}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="创建时间:" prop="djsj">
                        {{form.djsj}}
                    </el-form-item>
                </el-col>

                 <el-col :span="8" >
                    <el-form-item label="附件:" prop="ccbh">
                        <p v-show="!!form.fjaddress">
                            <i class="el-icon-document"></i>
                            <a :href="cmiimsUrl + '/'+form.fjaddress" target="_blank">{{form.fjname | urldecode}}</a>
                        </p>
                        <p v-show="!form.fjaddress">
                        </p>
                    </el-form-item>
                </el-col>
            </el-Row>

            <div class="title-item" style="margin-top:30px;"><span>处理状态</span></div>
            <br>
            <el-Row>
                <el-col :span="24">
                    <el-form-item label="回复内容:" prop="replay" >
                        <el-input v-if="form.replayflag == '0'" type="textarea" v-model="form.replay"></el-input>
                        <div v-if="form.replayflag == '1'">
                            {{form.replay}}
                        </div>
                    </el-form-item>
                </el-col>
            </el-Row>

            <el-Row>
                <el-col :span="9">
                    <el-form-item label="回复时间:" prop="replaydate">
                        {{form.replaydate}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="回复人:" prop="replayperson">
                        {{form.replayperson}}
                    </el-form-item>
                </el-col>

                <el-col :span="9">
                    <el-form-item label="回复附件:" prop="replayfjaddress">
                        <mind-upload ref="upFiles" :limitNumb="limitNumb" :callBack="fileUploadCallBack" :disabled="form.replayflag == '1'"></mind-upload>
                    </el-form-item>
                </el-col>
            </el-Row>

            <div v-show="form.esFlag == '1'">
                <div class="title-item" style="margin-top:30px;"><span>评分</span></div>
                <br>
                <el-Row>
                    <el-col :span="8" >
                        <el-form-item label="答复效率:" prop="esSj">
                            <el-rate v-model="esSj" disabled style="line-height: 48px;"></el-rate>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" >
                        <el-form-item label="专业水平:" prop="esPro">
                            <el-rate v-model="esPro" disabled style="line-height: 48px;"></el-rate>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="总体评价:" prop="esResult">
                            <el-rate v-model="esResult" disabled style="line-height: 48px;"></el-rate>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="备注:" prop="esBz">
                            {{form.esBz}}
                        </el-form-item>
                    </el-col>
                </el-Row>
            </div>

        </el-form>
        <span slot="footer" class="dialog-footer"
              style="display: block; text-align: center; margin-top: 20px;margin-bottom: 20px">
            <el-button type="primary" @click="handleSubmit" v-if="form.replayflag == '0'">提 交</el-button>
            <el-button @click="handleCancel">返 回</el-button>
        </span>
    </div>
</template>

<script>
    import Vue from 'vue';

    // 引入封装的ajax控件
    import {ajaxRequest, ajaxProxyRequest} from '../../util/base';
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
        name: "suggest-Form",
        props: {//用于接收从父组件中传来的数据
            data: {
                type: Object
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
                esSj: null,
                esPro: null,
                esResult: null,

                limitNumb: 1,//上传文件数量限制   默认为4
            }
        },
        mounted() {
            //页面渲染完成后，ajax请求加载数据
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
                        ajaxRequest("post", "back/suggest/updateSuggest/", _this.form, (res) => {
                            if (res.code == 200) {
                                _this.$message.success(res.msg);
                                _this.remoteMethod();
                            } else if (res.code == 1) {
                                _this.$message.error(res.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                })
            },
            remoteMethod() {
                let _this = this
                //获取外网服务器地址
                ajaxProxyRequest('get', "/njmind/findParam/cmiimsUrl", null, (res) => {
                    _this.cmiimsUrl = res.value;
                });

                //获取外网服务器地址
                ajaxProxyRequest('get', "/njmind/findParam/cmiimsUrl", null, (res) => {
                    _this.fil = res.value;
                });

                ajaxRequest('get', "back/suggest/findById", {id: _this.$route.query.id}, (res) => {
                    _this.form = $.extend({}, defaults, res.t);
                    _this.esSj = parseInt(_this.form.esSj);
                    _this.esPro = parseInt(_this.form.esPro);
                    _this.esResult = parseInt(_this.form.esResult);
                    //初始化加载附件(2)  动态变更 初始化附件
                    if(_this.form.replayfjaddress != "" && _this.form.replayfjaddress != null && _this.form.replayfjaddress != undefined){
                        _this.$refs.upFiles.loadAttacheIds(_this.form.replayfjaddress);
                    }
                });
            },

            handleCancel() {
                window.history.go(-1);
            },

            //callBack上传组件数据发生变化回调
            //callBack上传组件数据发生变化回调
            fileUploadCallBack:function(file, list) {
                this.fileList = list;
                console.log("调用上传页面收到的 附件列表", this.fileList);
                if(this.fileList != null && this.fileList != undefined && this.fileList.length > 0){
                    this.form.replayfjname = this.fileList[0].name;
                    this.form.replayfjaddress = this.fileList[0].id;
                }


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
            },
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
