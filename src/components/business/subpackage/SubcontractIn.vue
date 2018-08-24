<!-- 样品分包返库提交页面-->
<template>
    <mind-dialog
            :title="'分包返库'"
            :visible="true"
            dialogSize="mini"
            center
            v-dialogDrag
            @close="handleCancel">

        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-row>
                <el-col :span="16">
                    <el-form-item label="返库时间">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.entryDate"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="25">
                    <el-form-item label="返库方式">
                        <el-radio-group v-model="form.entryWarehouseWay" @change="changeOutWays()">
                            <el-radio :label="1">自取</el-radio>
                            <el-radio :label="2">快递</el-radio>
                            <el-radio :label="3">检测机构送</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="同时入库">
                        <el-checkbox v-model="sycEntry" @change="changeSycEntry()"></el-checkbox>
                        <template slot="label">
                            <span>同时入库</span>
                            <el-tooltip content="勾中表示对器具进行入库">
                                <i class="el-icon-info fS12"></i>
                            </el-tooltip>
                        </template>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16" v-if="sycEntry">
                    <el-form-item label="货柜号">
                        <el-input v-model="form.room"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="16" v-if="isExpress">
                <el-col :span="16">
                    <el-form-item label="快递">
                        <el-select placeholder="请选择" v-model="form.entryExpressType" style="width:100%">
                            <el-option
                                    v-for="item in expressTypes"
                                    :key="item.code"
                                    :label="item.remark"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="16" v-if="isExpress">
                <el-col :span="16">
                    <el-form-item label="快递单号">
                        <el-input v-model="form.entryExpressNo"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="备注">
                        <el-input v-model="form.entryRemark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
            <el-button @click="handleCancel">返回</el-button>
        </span>
    </mind-dialog>

</template>

<script>
    // 引入封装的ajax控件
    import {formatDate, ajaxProxyRequest} from '../../util/base'
    // 引入jquery
    import $ from 'jquery'

    export default {
        name: 'subcontractIn',
        data() {
            return {
                expressTypes: [],
                form: {
                    entryDate: '',
                    entryWarehousePerson: '',
                    entryWarehouseWay: '',
                    entryRemark: '',
                    room: '',
                    sycEntryLibrary: '',
                    entryExpressType: '',
                    entryExpressNo: ''
                },
                isExpress: false,
                sycEntry: false,
                rules: {}
            }
        },
        props: {
            data: {
                type: String
            },
            callback: {
                type: Function
            }
        },
        mounted() {
            this.form.entryDate = new Date();
            this.form.entryWarehouseWay = 1;
            this.getExpressCompany();
        },
        methods: {
            getExpressCompany: function () {
                let _this = this;
                ajaxProxyRequest('get', '/njmind/findParams/express', {codeType: 'NUMBER'}, (res) => {
                    _this.expressTypes = res.express.list;
                })
            },
            changeOutWays: function () {
                let _this = this;
                if (_this.form.entryWarehouseWay === 2) {
                    _this.isExpress = true;
                } else {
                    _this.isExpress = false;
                }
            },
            changeSycEntry: function () {
                let _this = this;
                if (_this.sycEntry) {
                    _this.form.sycEntryLibrary = 1;
                } else {
                    _this.form.sycEntryLibrary = 0;
                }
            },
            handleSubmit: function () {
                let _self = this;
                let extendObj = {
                    strFkRegistrationNos: JSON.stringify(_self.data.split(","))
                };
                _self.form.entryDate = formatDate(_self.form.entryDate, "YYYY-MM-DD hh:mm:ss");
                const obj = $.extend(_self.form, extendObj);
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
