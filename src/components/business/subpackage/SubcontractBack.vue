<!-- 样品分包退检-->
<template>
    <mind-dialog
            :title="'分包退检'"
            :visible="true"
            dialogSize="mini"
            center
            v-dialogDrag
            @close="handleCancel">

        <el-form ref="form" :model="form" label-width="100px">
            <el-row>
                <el-col :span="100">
                    <el-form-item label="退检方式">
                        <template slot="label">
                            <span>退检方式</span>
                            <el-tooltip content="退回未分包状态:撤销分包出库;发起退检流程">
                                <i class="el-icon-info fS12"></i>
                            </el-tooltip>
                        </template>
                        <el-radio-group v-model="form.resource">
                            <el-radio :label="1">退回未分包状态</el-radio>
                            <el-radio :label="2">发起退检流程</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button @click="handleCancel">返回</el-button>
        </span>
    </mind-dialog>

</template>

<script>
    import Vue from 'vue'
    // 引入jquery
    import $ from 'jquery'

    /* import {
        Button,
        Col,
        Form,
        FormItem, 
        Radio,
        RadioGroup,
        Row,
    } from 'element--ui'
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(RadioGroup);
    Vue.use(Radio); 
 */
    export default {
        name: 'subcontractBack',
        data() {
            return {
                form: {
                    resource: ''
                }
            }
        },
        props: {
            data: {
                type: String
            },
            dataForBack: {
                type: String
            },
            callback: {
                type: Function
            }
        },
        mounted() {
            this.form.resource = 1;
        },
        methods: {
            handleSubmit: function () {
                let ids = {
                    ids: this.data,
                    registrationNo: this.dataForBack
                };
                const obj = $.extend(this.form, ids);
                this.callback(obj);
            },
            handleCancel: function () {
                this.callback();
            }
        }
    }
</script>

<style scoped>

</style>
