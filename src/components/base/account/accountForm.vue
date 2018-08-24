<template>
    <mind-dialog :title="!!data.id?'编辑银行账号':'新增银行账号'" :visible="true"
               dialogSize="mini" center v-dialogDrag  @close="handleCancel">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-Row>
                <el-col :span="24">
                    <el-form-item label="开户名" prop="accountName">
                        <el-input v-model="form.accountName"
                                  v-rightclick="handleRightClick.bind(this,form,'accountName')"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="开户行" prop="accountBank">
                        <el-input v-model="form.accountBank"
                                  v-rightclick="handleRightClick.bind(this,form,'accountBank')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="账号" prop="accountNo">
                        <el-input v-model="form.accountNo"
                                  v-rightclick="handleRightClick.bind(this,form,'accountNo')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark"
                                  v-rightclick="handleRightClick.bind(this,form,'remark')"></el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保 存</el-button>
            <el-button @click="handleCancel">取 消</el-button>
        </span>
    </mind-dialog>
</template>

<script>
    import Vue from 'vue';
    import {ajaxRequest} from '../../util/base';
    import $ from 'jquery';
    import rightclick from '../../../directives/rightcilck';
    import rightClick from '../../../mixins/FormRightClick';

    const defaults = {
        hoho: ''
    };
    export default {
        name: "layout",
        props: {
            data: {
                type: Object
            },
            callback: {
                type: Function
            }
        },
        data() {
            let lengthCheck = (rule,value,cb)=>{
                let name = "" ? '' : '';
                if(rule.fullField == "accountName"){
                  name = "开户名";
                }
                if(rule.fullField == "accountBank"){
                  name = "开户行";
                }
                if(rule.fullField == "accountNo"){
                  name = "账号";
                }
                if(!!value){
                    if(value.length > 100){
                        cb(new Error('最多输入100个字符'))
                    }else{
                        cb()
                    }
                }else{
                    cb(new Error(`${name}不能为空!`))
                }
            }
            return {
                form: $.extend({}, defaults, this.data || {}),
                rules: {
                    accountName: [{type: 'string', required: true, validator:lengthCheck,trigger:'blur'}],
                    accountBank: [{type: 'string', required: true, validator:lengthCheck,trigger:'blur'}],
                    accountNo: [{type: 'string', required: true, validator:lengthCheck,trigger:'blur'}],
                    remark:[{type:'string',max:100,message:'最多输入100个字符',trigger:'blur'}]
                },
                loading: false,
                remoteOptions: [],
            }
        },
        mounted() {
            this.remoteMethod();
        },
        directives: {rightclick},
        mixins: [rightClick],
        methods: {
            handleSubmit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.callback(this.form);
                    } else {
                        return false;
                    }
                })
            },
            handleCancel() {
                //关闭窗口
                this.callback()
            },
            remoteMethod(keyWords) {
                console.log(keyWords);
                this.loading = true;
                $.ajax();
            },

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
