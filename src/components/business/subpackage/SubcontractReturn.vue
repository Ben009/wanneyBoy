<template>
    <div>
        <div v-if="!registrationValidation || registrationValidation !== 'refundSub'">
            <div class="search">
                <div style="margin-bottom:10px;" v-if="defaultOpen">
                    <Retrieve ref="retrieve-wapper"
                              :rowsCondition='rowsCondition'
                              :sortBy="sortBy"
                              :order="order"
                              :paramJson="paramJson"
                              :retrieveCondition="retrieveCondition"
                              :collectionInfo="collectionInfo"></Retrieve>
                </div>
                <div style="display: flex;justify-content: space-between;">
                    <div class="operate">
                        <el-button @click="subcontractReturn()" type="primary">分包返库</el-button>
                        <el-button @click="subcontractBackInspection()" type="primary">分包退检</el-button>
                    </div>
                    <div style="display: inline-block;text-align: center" v-if="defaultOpen">
                        <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                        <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning">&nbsp;清空</el-button>
                    </div>
                    <span style="float: right">
                    <el-select size="mini" v-if="resultCondition.length" v-model="templateValue" placeholder="请选择"
                               @change="QJHandleSelectTemplate">
                      <el-option
                              v-for="item in moduleList"
                              :key="item.name"
                              :label="item.name"
                              :value="item.name">
                      </el-option>
                    </el-select>
                    <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)"
                               class="el-icon-setting">个性化设置</el-button>
                    <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                               :handleMouldBack="QJHandleMouldBack"></WorkMould>
                    <div class="el-icon-info shuoming">
                       <el-row class="el-sm">
                             <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">事项说明</p>
                            <dl style="padding:6px 10px; ">
                           <p>1、<span style="color:red;">费用</span>：未录入；</p>
                            <p> 2、<span style="color:red;">证书</span>：未上传。 </p>
                            </dl>
                                <dl style="padding:6px 10px; ">
                                <p>3、本页面查询所有已出库未返库的记录；</p>
                                <p>4、分包任务发生退检时，可通过分包退检按钮进行退检操作；</p>
                                <p>5、针对分包任务，可在本节点通过费用录入节点录入费用；</p>
                                <p>6、针对分包任务，可通过本节点上传电子扫描件存档使用；</p>
                            </dl>

                       </el-row>
                    </div>
                </span>
                </div>
            </div>
            <div class="table">
                <el-table ref="multipleTable" :data="tableData" :max-height="QJTableMaxHeight"
                          @selection-change="handleSelectionChange" border v-loading="loading"
                          size="small">
                    <el-table-column type="selection" :selectable="checkedAble" width="55"></el-table-column>
                    <el-table-column v-show="headObj.registrationNo" prop="registrationNo"
                                     label="登记号"></el-table-column>
                    <el-table-column v-show="headObj.companyName" prop="companyName" label="委托单位"></el-table-column>
                    <el-table-column v-show="headObj.applianceActualName" prop="applianceActualName"
                                     label="器具名称"></el-table-column>
                    <el-table-column v-show="headObj.setNumber" prop="setNumber" label="套数"></el-table-column>
                    <el-table-column v-show="headObj.subcontractArea" prop="subcontractArea"
                                     label="分包区域"></el-table-column>
                    <el-table-column v-show="headObj.deliveryDate" prop="deliveryDate" label="分包时间"
                                     :formatter="formatterTime"></el-table-column>
                    <el-table-column v-show="headObj.detectionDeadline" prop="deliveryDate" label="检测期限"
                                     :formatter="formatterTime"></el-table-column>
                    <el-table-column v-show="headObj.entryDate" prop="entryDate" label="返库时间"
                                     :formatter="formatterTime"></el-table-column>
                    <el-table-column v-show="headObj.entryWarehouseWay" prop="entryWarehouseWay" label="签收方式"
                                     :formatter="formatterColumn"></el-table-column>
                    <el-table-column v-if="headObj.deliveryWarehousePerson" prop="deliveryWarehousePerson"
                                     label="操作人"></el-table-column>
                    <el-table-column label="费用" width="100">
                        <template slot-scope="scope">
                            <div v-if="scope.row.feeStatus === 0">
                                <el-button @click="feeEntry(scope.row)" type="text" style="padding:0;font-size:18px;">
                                    <i class="el-icon-njm-fylr" title="费用录入"></i>
                                </el-button>
                            </div>
                            <div v-else>
                                <el-button disabled type="text" style="padding:0;font-size:18px;">
                                    <i class="el-icon-njm-ylr" title="已录入"></i></el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="certificateAttachment" label=" 证书 " width="90">
                        <template slot-scope="scope">
                            <div v-if="scope.row.subcontractAttachments">
                                <el-button @click="uploadCertificate(scope.row)" type="text"
                                           style="padding:0;font-size:18px;">
                                    <i class="el-icon-njm-ysc" title="已上传"></i></el-button>
                            </div>
                            <div v-else>
                                <el-button @click="uploadCertificate(scope.row)" type="text"
                                           style="padding:0;font-size:18px;">
                                    <i class="el-icon-njm-dsc" title="待上传"></i>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <mind-pagination :current-page="page" :page-size="rows" :total="total"
                                 @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>

            <SubcontractIn v-if="returnLibrary" :data="returnLibrary" :callback="handleSubmitCallback"></SubcontractIn>

            <SubcontractBack v-if="backInspection" :data="backInspection" :dataForBack="dataForBack"
                             :callback="handleBackInspectionCallback"></SubcontractBack>

            <CertificateUpload v-if="openUpload" :data="transferData"
                               :callback="handleUploadCallback"></CertificateUpload>
            <!--费用录入-->
            <chargeAdd v-if="!!edit" :data="edit" :callback="handleEditCallback"></chargeAdd>
        </div>
        <!-- 退检 -->
        <apply-form v-if="registrationValidation == 'refundSub'" type="refund"></apply-form>
    </div>
</template>

<script>
    import Retrieve from '../../Retrieve'
    import WorkMould from '../../mould/WorkMould'
    import SubcontractIn from './SubcontractIn'
    import SubcontractBack from './SubcontractBack'
    import CertificateUpload from './CertificateUpload'
    import paramJson from './subcontractReturn' //同目录下json数据
    import applyForm from '../procedure/apply/applyForm'
    // 引入封装的ajax控件
    import {ajaxRequest, formatDate} from '../../util/base'
    import chargeAdd from '../charge/chargeAdd.vue';
    import $ from 'jquery'


    export default {
        name: "subcontractReturn",
        computed: {
            registrationValidation() {
                return this.$store.state.Procedure.registrationInfo.type
            }
        },
        props: {
            callback: {
                type: Function
            }
        },
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                orderProperty: '',
                orderType: '',
                returnLibrary: null,
                backInspection: null,
                dataForBack: null,//用于退检
                transferData: null,
                openUpload: false,
                tableData: [],
                isSetting: 0,
                multipleSelection: [],

                /*高级检索相关项*/
                rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
                paramJson: paramJson, //同目录下json数据 常量
                moduleList: [], //模板列表
                templateValue: "", //当前选择的模板id
                sortBy: "", //排序字段
                order: "", //desc降序 asc升序
                headObj: {}, //表头显示对象 {category:true}
                defaultOpen: true, //默认开启高级查询

                allModules: {}, //所有模板
                resultCondition: [],
                retrieveCondition: [],
                collectionInfo: [],
                edit: null,
                loading: false
            }
        },
        methods: {
            checkedAble: function (row, index) {//根据状态判断是否可以勾选
                if (row.status === 1) {
                    return 0;
                } else {
                    return 1;
                }
            },
            formatterTime: function (row, column) {
                return formatDate(row.entrustDate, 'YYYY-MM-DD');
            },
            formatterColumn: function (row, column, value) {
                let res = "";
                switch (value) {
                    case "1":
                        res = "自取";
                        break;
                    case "2":
                        res = "快递";
                        break;
                    case "3":
                        res = "检测机构送";
                        break;
                }
                return res;
            },
            subcontractReturn: function () {
                let _this = this;
                if (_this.multipleSelection.length === 0) {
                    _this.$alert('请选择要入库的登记号', '提示', {
                        showConfirmButton: '确定',
                        showCancelButton: '取消',
                        type: 'warning',
                        center: true
                    });
                } else {
                    let registrationNos = _this.multipleSelection
                        .map(function (v) {
                            return v.registrationNo;
                        }).join(",");
                    _this.returnLibrary = registrationNos;
                }
            },
            subcontractBackInspection: function () {
                let _this = this;
                if (_this.multipleSelection.length === 0) {
                    _this.$alert('请选择要退检的登记号', '提示', {
                        showConfirmButton: '确定',
                        showCancelButton: '取消',
                        type: 'warning',
                        center: true
                    });
                } else {
                    let isCanReturn = true;
                    $.each(_this.multipleSelection, function (k, v) {
                        if (v.feeStatus !== 0 || v.subcontractAttachments) {
                            return isCanReturn = false;
                        }
                    });
                    //判断是否能够进行退检
                    if (isCanReturn) {
                        //用于退回未分包状态
                        let ids = _this.multipleSelection
                            .map(function (v) {
                                return v.id;
                            }).join(",");
                        _this.backInspection = ids;
                        //用于退检
                        let registrationNo = _this.multipleSelection
                            .map(function (v) {
                                return v.registrationNo;
                            }).join(",");
                        _this.dataForBack = registrationNo;
                    } else {
                        _this.$alert('已录费或已上传证书不能申请退检', '提示', {
                            showConfirmButton: '确定',
                            showCancelButton: '取消',
                            type: 'warning',
                            center: true
                        });
                    }
                }
            },
            handleSubmitCallback: function (rowInfo) {//样品分包返库
                let _this = this;
                if (rowInfo) {
                    ajaxRequest("put", "back/subcontract/subcontractEntry", rowInfo,
                        res => {
                            if (res.code === 200) {
                                _this.$message.success("分包样品返库成功");
                            } else {
                                _this.$message.error("分包样品返库失败");
                            }
                            _this.getTableList();
                        });
                }
                _this.returnLibrary = null;
                _this.backInspection = null;
                _this.openUpload = false;

            },
            handleBackInspectionCallback: function (rowInfo) {
                let _this = this;
                if (rowInfo) {
                    let ids = rowInfo.ids;
                    if (rowInfo.resource === 1) {//退回未分包状态
                        ajaxRequest("POST", "back/subcontract/delSubcontractSampleBatch", {
                                ids: ids,
                                _method: "DELETE"
                            },
                            res => {
                                if (res.code === 200) {
                                    _this.$message.success("分包样品退回未分包成功");
                                    _this.getTableList();
                                } else {
                                    _this.$message.error("分包样品退回未分包失败");
                                }
                            });
                    } else {//发起退检流程
                        let idArr = ids.split(",");
                        let registrationNo = rowInfo.registrationNo;
                        if (idArr.length > 1) {
                            _this.$alert('退检只能选择一个单据号', '提示', {
                                showConfirmButton: '确定',
                                showCancelButton: '取消',
                                type: 'warning',
                                center: true
                            });
                        } else {
                            _this.$store.dispatch('validateRegistration', {
                                registrationNo: registrationNo,
                                applyType: '1'
                            }).then(res => {
                                if (res !== '1') {
                                    _this.$message.error(res);
                                } else {
                                    this.$store.commit('SET_REGISTRATION_INFO', {
                                        type: 'refundSub', // 分包流程中的退件为 refundSub
                                        registrationNo: registrationNo // 登记号
                                    })
                                }
                            });
                        }
                    }
                }
                _this.returnLibrary = null;
                _this.backInspection = null;
                _this.openUpload = false;
            },
            handleUploadCallback: function (rowInfo) {//上传证书文件
                let _this = this;
                console.log(rowInfo);
                if (rowInfo) {
                    ajaxRequest("POST", "back/subcontract/addSubcontractAttachment", rowInfo,
                        res => {
                            if (res.code === 200) {
                                _this.returnLibrary = null;
                                _this.backInspection = null;
                                _this.openUpload = false;
                                _this.$message.success("证书附件上传成功");
                                _this.getTableList();
                            } else {
                                _this.$message.error("证书附件上传失败");
                            }
                        });
                } else {
                    _this.returnLibrary = null;
                    _this.backInspection = null;
                    _this.openUpload = false;
                }
            },
            handlePageSizeChange: function (size) {
                let _this = this;
                _this.page = 1;//Math.floor(_this.page * _this.rows / size);
                _this.rows = size;
                _this.getTableList();
            },
            handleCurrentPageChange: function (currentPage) {
                let _this = this;
                _this.page = currentPage;
                _this.getTableList();
            },
            handleSelectionChange: function (rows) {
                this.multipleSelection = rows;
            },
            uploadCertificate: function (row) {
                let _this = this;
                _this.openUpload = true;
                _this.transferData = row;
            },
            feeEntry: function (row) {
                ajaxRequest("get", "back/entrustSjd/getEntrustSjdDetails", {
                    registrationNo: row.registrationNo,
                    feeStatus: 0
                }, res => {
                    if (res.code === 200) {
                        if (res.rows.length > 0) {
                            this.edit = res.rows[0];
                        } else {
                            this.$message.error("无效登记号，请重新输入！");
                            this.registrationNo = "";
                        }
                    } else {
                        this.$message.error("无效登记号，请重新输入！");
                        this.registrationNo = "";
                    }
                });
            },
            handleEditCallback: function () {
                //费用录入回调
                this.edit = null;
                this.getTableList();
            },
            getTableList: function () {
                let _this = this;
                _this.loading = true;
                ajaxRequest("get", "back/subcontract/retrieveDeliveryList", {
                    page: _this.page,
                    rows: _this.rows,
                    orderProperty: _this.orderProperty,
                    orderType: _this.orderType,
                    total: 0,
                    sc: _this.sc
                }, res => {
                    if (res.code === 200) {
                        _this.tableData = res.rows;
                        _this.total = res.total;
                        _this.multipleSelection = [];
                    } else {
                        _this.$message.error("加载数据失败");
                    }
                    _this.loading = false;
                });
            }
        },
        components: {
            Retrieve,
            WorkMould,
            SubcontractIn,
            SubcontractBack,
            CertificateUpload,
            chargeAdd,
            applyForm
        },
        mounted() {
            this.getTableList();
            this.QJGetMounted();
        }
    }
</script>

<style scoped>
    .operate {
        margin: 10px 10px;
    }

    .custom-input .el-input__inner {
        height: 32px;
        line-height: 32px;
    }

    .custom-input .el-input-group__append {
        padding: 0 10px;
    }

    .flex-one {
        flex: 1;
    }

    .flex {
        display: flex;
    }

    .custom-input {
        width: 200px;
        height: 32px;
    }

    .custom-input .el-input__inner {
        height: 32px;
        line-height: 32px;
    }

    .custom-input .el-input-group__append {
        padding: 0 10px;
    }

    .el-icon-setting {
        background: none !important;
        border: none !important;
        color: #3094e0 !important;
    }

    .el-icon-setting:hover {
        color: #3094e0 !important;
    }

    .shuoming {
        border: none !important;
        color: #56BC4E !important;
        font-size: 16px !important;
    }

    .shuoming::after {
        content: "";
        width: 35px;
        height: 40px;
        /*background: #fff;*/
        position: absolute;
        z-index: 999;
        /* top: 0; */
        /* left: -65px; */
        margin-left: -16px;

    }

    .el-sm {
        background: #ffffff;
        position: absolute;
        z-index: 999;
        -webkit-box-shadow: 1px 7px 33px -9px #969696;
        box-shadow: 1px 7px 33px -9px #969696;
        border: 1px solid #56bc4e8c;
        border-radius: 5px;
        color: dimgrey;
        margin-left: -361px;
        word-break: break-all;
        margin-top: 18px;
        padding: 4px 5px;
        font-size: 14px;
        opacity: 50;
        float: right;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    .shuoming .el-sm {
        display: none;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    .el-button--warning:hover {
        background: #ff9c9c !important;
        border: 1px solid #ff9c9c !important;

    }

    .pagination {
        float: right;
    }

    .el-icon-njm-ysc:before {
        content: "\E948"
    }

    .el-icon-njm-dsc:before {
        content: "\E949"
    }

    .el-icon-njm-ylr:before {
        content: "\E951"
    }

    .el-icon-njm-fylr:before {
        content: "\E950"
    }
</style>
