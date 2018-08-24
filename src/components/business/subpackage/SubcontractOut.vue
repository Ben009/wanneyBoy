<!-- 样品分包出库提交页面-->
<template>
    <mind-dialog
            :title="'分包出库'"
            :visible="true"
            dialogSize="mini"
            center
            v-dialogDrag
            @close="handleCancel">

        <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
            <el-row>
                <el-form-item label="出库时间">
                    <el-col :span="14">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.deliveryDate"
                                        style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-col :span="16">
                    <el-form-item label="出库人">
                        <el-input v-model="form.deliveryWarehousePerson" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="30">
                    <el-form-item label="出库方式">
                        <el-radio-group v-model="form.deliveryWarehouseWay" @change="changeOutWays()">
                            <el-radio :label="1">送去检测机构</el-radio>
                            <el-radio :label="2">快递</el-radio>
                            <el-radio :label="3">检测机构来取</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="isExpress">
                <el-col :span="16">
                    <el-form-item label="快递">
                        <el-select placeholder="请选择" v-model="form.deliveryExpressType" style="width:100%">
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
            <el-row v-if="isExpress">
                <el-col :span="16">
                    <el-form-item label="快递单号">
                        <el-input v-model="form.deliveryExpressNo"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="备注">
                        <el-input v-model="form.deliveryRemark"></el-input>
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
    import {ajaxProxyRequest, formatDate} from '../../util/base'
    // 引入jquery
    import $ from 'jquery'


    export default {
        name: 'subcontractOut',
        data() {
            return {
                expressTypes: [],
                form: {
                    deliveryDate: '',
                    deliveryWarehousePerson: window.localStorage.getItem("userName"),
                    deliveryWarehouseWay: '',
                    deliveryRemark: '',
                    deliveryExpressType: '',
                    deliveryExpressNo: ''
                },
                isExpress: false,
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
            this.form.deliveryDate = new Date();
            this.form.deliveryWarehouseWay = 1;
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
                let _self = this;
                if (_self.form.deliveryWarehouseWay === 2) {
                    _self.isExpress = true;
                } else {
                    _self.isExpress = false;
                }
            },
            handleSubmit: function () {
                let _self = this;
                let extendObj = {
                    strFkRegistrationNos: JSON.stringify(_self.data.split(","))
                };
                _self.form.deliveryDate = formatDate(_self.form.deliveryDate, "YYYY-MM-DD hh:mm:ss");
                const obj = $.extend(_self.form, extendObj);
                _self.callback(obj);
            },
            handleCancel: function () {
                this.callback();
            }
        }
    }
</script>

<style scoped>

</style>
