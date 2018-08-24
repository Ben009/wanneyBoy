<template>
    <mind-dialog
        :title="'强检目录种别维护'"
        :visible="true"
        dialogSize="large"
        center
        v-dialogDrag
        @close="handleCancel">
        <!-- ref 申明引用名  :model 绑定数据form  rules 验证规则 label-width label宽度-->
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
            <el-Row>
                <el-col :span="12">
                    <el-form-item label="项别" prop="itemNum">
                        <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
                        <el-select class="list-width"
                            :popperAppendToBody="false"
                            placeholder="请选择"
                            value-key="itemNum"
                            v-model="form.itemNum">
                            <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
                            <el-option
                                v-for="item in itemNums"
                                :key="item.id"
                                :label="item.itemName"
                                :value="item.itemNum">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="检测周期" prop="itemCycle">
                        <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
                        <el-select class="list-width"
                            :popperAppendToBody="false"
                            placeholder="请选择"
                            value-key="itemCycle"
                            v-model="form.itemCycle">
                            <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
                            <el-option
                                v-for="item in itemCycles"
                                :key="item.code"
                                :label="item.remark"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="种别号" prop="kindNum">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.kindNum"
                                  v-rightclick="handleRightClick.bind(this,form,'kindNum')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="种别名称" prop="kindName">
                        <!--单行文本 v-model 绑定数据  handleRightClick 鼠标右键上下标处理 -->
                        <el-input v-model="form.kindName"
                                  v-rightclick="handleRightClick.bind(this,form,'kindName')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="强检形式" prop="checkMethod">
                        <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
                        <el-select class="list-width"
                            :popperAppendToBody="false"
                            placeholder="请选择"
                            value-key="name"
                            v-model="form.checkMethod">
                            <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
                            <el-option
                                v-for="item in checkMethods"
                                :key="item.remark"
                                :label="item.remark"
                                :value="item.remark">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="强检形式说明" prop="checkMethodRemark">
                        <!-- 多行文本 -->
                        <el-input type="textarea"
                        :rows="1"
                         v-model="form.checkMethodRemark" ></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
            <el-Row v-for="(kindRealmDetail, index) in form.kindRealmDetails">
                <el-col :span="12">
                    <el-form-item label="强检范围"
                          :prop="'kindRealmDetails.'+index+'.kindRealm'"
                          :rules="{type:'string', required:true, message:'请选择强检范围',trigger:'change'}">
                        <!-- 下拉框组件 placeholder提示文字  value-key key值 v-model绑定数据 -->
                        <el-select class="list-width"
                            :popperAppendToBody="false"
                            placeholder="请选择"
                            value-key="name"
                            v-model="kindRealmDetail.kindRealm">
                            <!-- 循环遍历 list 将下拉选项的key 提示文字label 和值value渲染出来 这里默认绑定的key字段是id，可按需调整-->
                            <el-option
                                v-for="item in kindRealms"
                                :key="item.remark"
                                :label="item.remark"
                                :value="item.remark">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-col :span="18">
                        <el-form-item label="强检范围说明"
                                      :prop="'kindRealmDetails.'+index+'.kindDetail'"
                                      :rules="{type:'string',validator: validatekindDetail,trigger:'blur'}">
                            <!-- 多行文本 -->
                            <el-input  v-model="kindRealmDetail.kindDetail" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button size="mini" type="primary" plain @click="addRow" style="margin-left:10px; margin-top:2px;">增加</el-button>
                        <el-button size="mini" type="danger" plain  @click="removeRow(index)" style="margin-left:10px; margin-top:2px;">删除</el-button>
                    </el-col>
                </el-col>
            </el-Row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
            <el-button  @click="handleCancel">取 消</el-button>
        </span>
    </mind-dialog>
</template>

<script>
    import Vue from 'vue';

    // 引入封装的ajax控件
    import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
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
        name: "forceCatalogKindForm",
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
                    ajaxRequest('get', "back/forceCatalogKind/checkForceCatalogKind", {
                        kindNum: value, id: _this.form.id
                    }, (res) => {
                        if (res.code == 1) {
                            callback(new Error("种别号已存在，请重新输入"));
                        } else {
                            callback()
                        }
                    })
                }
            }

            var validateName = function (rule, value, callback) {
                ajaxRequest('get', "back/forceCatalogKind/checkForceCatalogKind", {
                    kindName: value, id: _this.form.id
                }, (res) => {
                    if (res.code == 1) {
                        callback(new Error("种别名称已存在，请重新输入"));
                    } else {
                        callback()
                    }
                })
            }

            var validateItemCycleFunc = function (rule, value, callback) {
                callback();
                _this.$refs.form.validateField('itemCycle');
            }

            var validateItemCycle = function (rule, value, callback) {
               if(_this.form.checkMethod == '1' && (_this.form.itemCycle == '' || _this.form.itemCycle == null || _this.form.itemCycle == undefined)){
                   callback("请选择检测周期");
               }else{
                   callback();
               }
            }

            return {
                form: $.extend({}, defaults, this.data || {}),
                rules: {
                    itemNum:[
                        {type: 'string', required: true, message: '请选择项别', trigger:'change'}
                    ],
                    kindNum:[
                        {type: 'string', required: true, message: '请输入种别号', trigger: 'blur'},
                        {type: 'string', max: 20, message: '最多输入20个字符', trigger: 'blur'},
                        {type: 'string', validator: validateNum,trigger:'blur'}
                    ],
                    kindName:[
                        {type: 'string', required: true, message: '请输入种别名称', trigger: 'blur'},
                        {type: 'string', max: 200, message: '最多输入200个字符', trigger: 'blur'},
                        {type: 'string', validator: validateName,trigger:'blur'}
                    ],
                    checkMethod:[
                        {type: 'string', required: true, message: '请选择强检形式', trigger: 'change'},
                        {validator: validateItemCycleFunc,trigger: 'change'}
                    ],
                    checkMethodRemark:[
                        {type: 'string', max: 400, message: '最多输入400个字符', trigger: 'blur'}
                    ],
                    itemCycle:[
                        {required: true,validator: validateItemCycle,trigger: 'change'}
                    ]
                },
                loading: false,
                remoteOptions: [],
                checkMethods: [],
                itemNums: [],
                kindRealms: [],
                itemCycles: []
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
                        //处理数据
                        var kindRealmDetail = "";
                        for(var i=0;i<_this.form.kindRealmDetails.length;i++){
                            var obj = _this.form.kindRealmDetails[i];
                            kindRealmDetail += (obj.kindRealm +"`"+obj.kindDetail+"~");
                        }
                        _this.form.kindRealmDetail = kindRealmDetail;
                        var httpMethod;//http请求方式
                        if (!_this.form.id || _this.form.id == '') {//新增 注意:通过id是否存在来判断是新增还是编辑
                            httpMethod = 'post';
                        } else {//更新
                            httpMethod = 'put';
                        }
                        ajaxRequest(httpMethod, "back/forceCatalogKind/", _this.form, (res) => {
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

                //强检形式
                ajaxProxyRequest('get', "/njmind/findParam/checkMethod", null, (res) => {
                    this.checkMethods = res.list;
                });

                //强检范围
                ajaxProxyRequest('get', "/njmind/findParam/applianceUse", null, (res) => {
                    this.kindRealms = res.list;
                });

                //强检项别
                ajaxRequest('get', "back/forceCatalogItem/listAllForceCatalogItem", null, (res) => {
                    if (res.code == 200) {
                        this.itemNums = res.rows
                    }
                });

                //检测周期
                this.itemCycles = [
                    {code:1,remark:"1个月"},
                    {code:2,remark:"2个月"},
                    {code:3,remark:"3个月"},
                    {code:4,remark:"4个月"},
                    {code:5,remark:"5个月"},
                    {code:6,remark:"6个月"},
                    {code:7,remark:"7个月"},
                    {code:8,remark:"8个月"},
                    {code:9,remark:"9个月"},
                    {code:10,remark:"10个月"},
                    {code:11,remark:"11个月"},
                    {code:12,remark:"12个月"}
                ]
            },

            handleCancel(){
                this.callback();
            },

            addRow:function () {
                if(this.form.kindRealmDetails.length<this.kindRealms.length){
                    this.form.kindRealmDetails.push({kindRealm:"", kindDetail:""})
                }else{
                    this.$message.error('已没有更多强检形式');
                }

            },

            removeRow:function (index) {
                this.form.kindRealmDetails.splice(index,1);
                if(this.form.kindRealmDetails.length==0){
                    this.form.kindRealmDetails=[{
                        kindRealm:null,
                        kindDetail:null
                    }];
                }
            },

            validatekindDetail :function (rule, value, callback) {
                if(!!value){
                    if (value.indexOf("`") != -1 || value.indexOf("~") != -1) {
                        callback(new Error("不可输入`或~符号"));
                    } else if(value.length>400) {
                        callback(new Error('最多输入400字符!'));
                    }else{
                        callback();
                    }
                }else{
                    callback()
                }
            },

            validateItemCycles:function (rule, value, callback) {
                callback();
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
