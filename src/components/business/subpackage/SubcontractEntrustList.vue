<!-- 委托器具列表 传入报价单ID查询-->
<template>

    <div>
        <div style="font-size:14px;">
            合计：
            {{totalCount}}条报检记录
            {{totalSetNumber}}套
        </div>
        <el-table :data="tableData" :max-height="QJTableMaxHeight" style="width: 100%">
            <el-table-column prop="registrationNo" min-width="100" label="登记号"></el-table-column>
            <el-table-column prop="orderSingleNo" min-width="100" label="流转单号"></el-table-column>
            <el-table-column prop="applianceName" label="器具名称" show-overflow-tooltip=true width="180"></el-table-column>
            <el-table-column prop="model" label="型号规格"></el-table-column>
            <el-table-column prop="factoryNo" label="出厂编号"></el-table-column>
            <el-table-column prop="departName" label="检测部门 "></el-table-column>
            <el-table-column prop="setNumber" label="套数"></el-table-column>
            <el-table-column prop="unit" label="件/套"></el-table-column>
            <el-table-column prop="detectionDeadline" min-width="100" label="检测期限"
                             :formatter="detectionDeadlineFormat"></el-table-column>
            <!--<el-table-column prop="isUrgent" label="是否加急" :formatter="isUrgentFormat"></el-table-column>-->
            <el-table-column prop="status" label="分包状态" :formatter="subcontractFlagFormat"></el-table-column>
            <el-table-column prop="certificateAttachment" label="证书附件" width="90">
                <template slot-scope="scope">
                    <div v-if="scope.row.subcontractAttachments">
                        <el-button @click="uploadCertificate(scope.row)" type="warning">已上传</el-button>
                    </div>
                    <div v-else>
                        <el-button @click="uploadCertificate(scope.row)" type="primary">待上传</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="费用" width="100">
                <template slot-scope="scope">
                    <div v-if="scope.row.feeStatus === 0">
                        <el-button @click="feeEntry(scope.row)" type="primary">费用录入</el-button>
                    </div>
                    <div v-else>
                        <el-button disabled type="danger">已录入</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <CertificateUpload v-if="openUpload" :data="transferData" :callback="handleSubmitCallback"></CertificateUpload>

        <!--费用录入-->
        <chargeAdd v-if="!!edit" :data="edit" :callback="handleEditCallback"></chargeAdd>
    </div>
</template>

<script>
    import Vue from 'vue';
    import CertificateUpload from './CertificateUpload';

    // 引入封装的ajax控件
    import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest, formatDate} from '../../util/base';
    import chargeAdd from '../charge/chargeAdd.vue';
    var Big = require('big.js');
    //引入jquery
    import $ from 'jquery';
 
/*     import {
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
    Vue.use(Checkbox);  */

    export default {
        name: "subcontractEntrustList",
        data() {
            return {
                tableData: [],
                openUpload: false,
                transferData: null,
                edit:null
            }
        },
        components: {CertificateUpload,chargeAdd},
        props: {//用于接收从父组件中传来的数据
            wtdId: {
                type: Number
            },
            data: {
                type: Object
            },
            callback: {
                type: Function
            }
        },
        computed: {
            totalCount: function () {
                return this.tableData.length;
            },
            totalSetNumber: function () {
                let num = 0;
                this.tableData.forEach((v) => {
                    v.setNumber ? num += parseInt(v.setNumber) : null;
                });
                return num;
            }
        },
        methods: {
            handleSubmitCallback: function (rowInfo) {
                let _this = this;
                if (rowInfo) {
                    ajaxRequest("POST", "back/subcontract/addSubcontractAttachment", rowInfo,
                        res => {
                            if (res.code === 200) {
                                _this.openUpload = false;
                                _this.$message.success("证书附件上传成功");
                                _this.getTableList();
                            } else {
                                _this.$message.error("证书附件上传失败");
                            }
                        });
                } else {
                    _this.openUpload = false;
                }
            },
            getTableList() {
                let _this = this;
                ajaxRequest('get', 'back/subcontract/getSampleStatusByEntrustId/' + _this.wtdId, {}, res => {
                    this.tableData = res.rows;
                });
            },
            subcontractFlagFormat(row, column, value) {
                let res = "";
                switch (value) {
                    case 0:
                        res = "已出库";
                        break;
                    case 1:
                        res = "已返库";
                        break;
                    default:
                        res = "未出库";
                        break;
                }
                return res;
            },
            uploadCertificate: function (row) {
                let _this = this;
                _this.openUpload = true;
                _this.transferData = row;
            },
            detectionDeadlineFormat(row, column) {
                return formatDate(row.detectionDeadline, 'YYYY-MM-DD');
            },
            feeEntry: function (row) {
                //todo 费用录入
                ajaxRequest("get", "back/entrustSjd/getEntrustSjdDetails",{registrationNo:row.registrationNo,feeStatus:0}, res => {
                    if (res.code === 200) {
                        if(res.rows.length > 0){
                            this.edit=res.rows[0];
                        }else{
                            this.$message.error("无效登记号，请重新输入！");
                            this.registrationNo="";
                        }
                    }else{
                        this.$message.error("无效登记号，请重新输入！");
                        this.registrationNo="";
                    }
                });
            },
            handleEditCallback:function(){
                //费用录入回调
                this.edit=null;
                this.getTableList();
            },

        },
        mounted() {
            this.getTableList();
        }
    }
</script>

<style scoped>

</style>
