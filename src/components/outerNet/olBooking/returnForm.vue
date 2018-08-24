<template>
    <mind-dialog
        :title="'请输入退回原因'"
        :visible="true"
        dialogSize="mini"
        center
        v-dialogDrag
        @close="handleCancel">

        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
            <el-Row>
                <el-col :span="24">
                    <el-form-item label="退回原因" prop="returnReason">
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入退回原因"
                            v-rightclick="handleRightClick.bind(this,form,'itemNum')"
                            v-model="form.returnReason">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-Row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" v-mindPopover="{message:'是否确认退回?',success:handleSubmit.bind(this)}">确 定</el-button>
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

    const defaults = {
        hoho: ''
    };
    export default {
        name: "returnForm",
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
                    returnReason: [
                        {type: 'string', required: true, message: '请输入退回原因', trigger: 'blur'},
                        {type: 'string', max: 800, message: '最多输入800个字符', trigger: 'blur'}
                    ]
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
                        ajaxRequest("post", "back/olBooking/returnQj", {
                            ids: _this.form.ids,
                            returnReason: _this.form.returnReason
                        }, (res) => {
                            if (res.code == 200) {
                                _this.$message.success('退回成功');
                                _this.$emit('remoteMethod');
                                _this.callback();
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
                //-- 完成下拉菜单的数据自动绑定，数据绑定的key默认是id，如有需要自行修改
                this.loading = true;
                this.form.returnReason="";
                console.log("*****************************")
            },
            handleCancel() {
                this.callback();
            }
        }
    }
</script>

<style>
    <!--
    右键菜单样式设置

    -->
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
