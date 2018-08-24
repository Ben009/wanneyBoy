<template>
    <el-form ref="form" label-width="150px">
        <el-Row :gutter="20">
            <el-form-item label="入库类型">
                <el-checkbox-group v-model="checkList">
                    <el-checkbox label="证书入库"></el-checkbox>
                    <el-checkbox label="样品入库"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-Row>
        <el-Row :gutter="20">
            <el-col :span="12">
                <el-form-item>
                    <template slot="label">
                        <span>请输入单号：</span>
                        <el-tooltip content="登记号、流转单号、委托单号">
                            <i class="el-icon-info" style="font-size: 12px !important;"></i>
                        </el-tooltip>
                    </template>
                    <el-input v-model="searchKey" @keyup.enter.native="search" ref="focusInput"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" style="padding-top: 6px;">
                <el-button class="el-button el-button--primary" @click="search">查询</el-button>
            </el-col>
        </el-Row>
    </el-form>
</template>

<script>
    //引入ajax工具
    import {ajaxRequest} from '../../util/base';
    //引入jquery
    import $ from 'jquery';
    import ElCol from "@/common-el/packages/col/src/col";
    import ElRow from "@/common-el/packages/row/src/row";

    export default {
        components: {
            ElRow,
            ElCol
        },
        name: "comprehensiveStore",
        data() {
            return {
                searchKey: "",//查询单号
                checkList: ["证书入库", "样品入库"],//入库类型list
                entryStorageType: "",//入库类型
            }
        },
        methods: {
            search() {
                let _self = this;
                if (_self.searchKey === null || _self.searchKey === "" || _self.searchKey === undefined) {
                    _self.$message.error('请输入单号');
                    return;
                }
                if (_self.checkList.length === 0) {
                    _self.$message.error('请至少选择一种入库类型');
                    return;
                }
                if (_self.checkList.length > 1) {
                    _self.entryStorageType = 3;
                } else {
                    if (_self.checkList[0] === "样品入库") {
                        _self.entryStorageType = 1;
                    } else if (_self.checkList[0] === "证书入库") {
                        _self.entryStorageType = 2;
                    }
                }
                /*获取table数据，维护data数据*/
                ajaxRequest('post', 'back/ruku/validBeforeInStroage', {
                    listNos: $.trim(_self.searchKey),
                    flag: 2,
                }, (res) => {
                    if (res.code === 200) {
                        _self.$router.push({
                            path: '/admin/521',
                            query: {
                                searchKey: $.trim(_self.searchKey),
                                companyName: res.map.companyName,
                                companyType: res.map.companyType,
                                companyId: res.map.companyId,
                                entryStorageType: _self.entryStorageType,
                                checkList: _self.checkList,
                                flag: true
                            }
                        })
                    } else {
                        _self.$message.error(res.message);
                    }
                });
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.focusInput.focus()
            })
        }
    }
</script>

