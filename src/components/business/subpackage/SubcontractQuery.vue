<template>
    <div>
        <div v-if="!isShowDetail">
            <div class="search">
                <div style="margin-bottom:10px;" v-if="defaultOpen">
                    <Retrieve ref="retrieve-wapper"
                              :rowsCondition='rowsCondition'
                              :sortBy="sortBy"
                              :order="order"
                              :paramJson="paramJson"
                              :retrieveCondition="retrieveCondition"/>
                </div>

                <div style="display: flex;justify-content: space-between;">
                    <el-button @click="subcontractingOutRevoke()" type="primary">分包出库撤销</el-button>
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
                               :handleMouldBack="QJHandleMouldBack"/>

                    <div class="el-icon-info shuoming">
                       <el-row class="el-sm">
                           <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">事项说明</p>
                            <dl style="padding:6px 10px; ">
                           <p>1、<span style="color:red;">委托单位</span>：未到帐；
                               <span style="color:black;">器具名称</span>：样品证书已入库；
                               <span style="color:red;">器具名称</span>：样品证书未入库；
                            <span style="color:blue;">器具名称</span>：已出样或已出证或货证齐出 </p>
                            <p> 2、委托单位名称前含（**）符号，表示该单位有特殊要求！鼠标移至单位名称上查看详情。 </p>
                            <p>3、点击器具名称可查看该登记号的检测流程。</p>
                            </dl>
                            <dl style="padding:6px 10px; ">
                            <p>注:1、本页面查询所有的分包任务。</p>
                            <p>&nbsp;2、针对已出库未返库的任务，可进行撤消后重新生库。</p>
                            </dl>
                       </el-row>
                    </div>
                </span>
                </div>

            </div>
            <div class="MStandardList-table" v-loading="MStandardListLoading" element-loading-spinner="el-icon-loading">
                <div class="table">
                    <el-table ref="multipleTable" :data="tableData" :max-height="QJTableMaxHeight"
                              @selection-change="handleSelectionChange" border v-loading="loading"
                              size="small">
                        <el-table-column type="selection" width="55" :selectable="isReback"></el-table-column>
                        <el-table-column prop="entrustCompany" label="委托单位" width="120">
                            <template slot-scope="scope">
                                <div v-if="scope.row.specialRequirement">
                                    <el-tooltip placement="bottom" effect="light">
                                        <div slot="content">
                                            <span v-model="scope.row.specialRequirement"></span>
                                        </div>
                                        <span :class="{red:scope.row.settleAccountDate == null}">(**){{scope.row.companyName}}</span>
                                    </el-tooltip>
                                </div>
                                <div v-else>
                                    <span :class="{red:scope.row.settleAccountDate == null}">{{scope.row.companyName}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="entrustNumber" label="委托单号"></el-table-column>
                        <el-table-column prop="applianceName" label="器具名称">
                            <template slot-scope="scope">
                                <el-button @click="handleForward(scope.row)" type="text">
                            <span :class="[scope.row.certificateWarehouseFlag === 0?redClass:blackClass]">
                                {{scope.row.applianceName?scope.row.applianceName:scope.row.applianceActualName}}
                            </span>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="headObj.subcontractArea" prop="subcontractArea"
                                         label="分包区域"></el-table-column>
                        <el-table-column v-if="headObj.deliveryWarehousePerson" prop="deliveryWarehousePerson"
                                         label="分包操作人"></el-table-column>
                        <el-table-column v-if="headObj.deliveryDate" prop="deliveryDate" label="分包出库时间"
                                         :formatter="formatterTime"
                                         width="120"></el-table-column>
                        <el-table-column v-if="headObj.deliveryWarehouseWay" prop="deliveryWarehouseWay" label="分包出库方式"
                                         :formatter="formatterColumn"></el-table-column>
                        <el-table-column v-if="headObj.deliveryExpressNo" prop="deliveryExpressNo"
                                         label="分包快递单号"></el-table-column>
                        <el-table-column v-if="headObj.entryWarehousePerson" prop="entryWarehousePerson"
                                         label="返库接收人"></el-table-column>
                        <el-table-column v-if="headObj.entryDate" prop="entryDate" label="返库签收时间"
                                         :formatter="formatterTime"
                                         width="120"></el-table-column>
                        <el-table-column v-if="headObj.entryWarehouseWay" prop="entryWarehouseWay" label="返库接收方式"
                                         :formatter="entryFormatterColumn"></el-table-column>
                        <el-table-column v-if="headObj.entryExpressNo" prop="entryExpressNo"
                                         label="返库接收快递单号"></el-table-column>
                        <el-table-column v-if="headObj.setNumber" prop="setNumber" label="套数"></el-table-column>
                        <el-table-column v-if="headObj.unit" prop="unit" label="件/套"></el-table-column>
                        <el-table-column v-if="headObj.entrustDate" prop="entrustDate" label="委托日期"
                                         :formatter="formatterTime" width="120"></el-table-column>
                        <el-table-column v-if="headObj.companyAddress" prop="companyAddress"
                                         label="单位地址"></el-table-column>
                        <el-table-column v-if="headObj.contractNo" prop="contractNo" label="协议号"></el-table-column>
                        <el-table-column v-if="headObj.customerRequireCompany" prop="customerRequireCompany"
                                         label="客户要求证书委托单位" width="200"></el-table-column>
                        <el-table-column v-show="headObj.detectionDeadline" prop="deliveryDate" label="检测期限"
                                         :formatter="formatterTime"></el-table-column>
                        <el-table-column v-if="headObj.totalFee" prop="totalFee" label="费用合计"></el-table-column>
                        <el-table-column v-if="headObj.engineer" prop="engineer" label="工程师"></el-table-column>
                        <el-table-column v-if="headObj.settleAccountDate" prop="settleAccountDate" label="到账日期"
                                         :formatter="formatterTime"></el-table-column>
                        <el-table-column v-if="headObj.settlementDate" prop="settlementDate" label="结算日期"
                                         :formatter="formatterTime"></el-table-column>
                        <el-table-column v-if="headObj.jdf" prop="jdf" label="检测费"></el-table-column>
                        <el-table-column v-if="headObj.xlf" prop="xlf" label="修理费"></el-table-column>
                        <el-table-column v-if="headObj.pjf" prop="xlf" label="配件费"></el-table-column>
                        <el-table-column v-if="headObj.jtf" prop="jtf" label="交通费"></el-table-column>
                        <el-table-column v-if="headObj.otherFee" prop="otherFee" label="其他费"></el-table-column>
                        <el-table-column v-if="headObj.workload" prop="workload" label="工作量"></el-table-column>
                        <el-table-column v-if="headObj.valueAddTax" prop="valueAddTax" label="增值税"></el-table-column>
                        <el-table-column v-if="headObj.companyAddress" prop="companyAddress"
                                         label="单位地址"></el-table-column>
                        <el-table-column v-if="headObj.contacter" prop="contacter" label="联系人"></el-table-column>
                        <el-table-column v-if="headObj.telephone" prop="telephone" label="电话"></el-table-column>
                        <el-table-column v-if="headObj.remark" prop="remark" label="备注"></el-table-column>
                        <!--<el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="handleDetail(scope.row)" type="text"
                                           style="padding: 0; font-size: 18px;">
                                    <i class="el-icon-edit-outline" title="详细"></i>
                                </el-button>
                                <el-button
                                        v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,[scope.row]),placement:'left'}"
                                        type="text" style="padding: 0; font-size: 18px;">
                                    <i class="el-icon-delete" title="删除"></i>
                                </el-button>
                            </template>
                        </el-table-column>-->
                    </el-table>
                </div>
            </div>
            <div class="pagination">
                <mind-pagination :current-page="page" :page-size="rows" :total="total"
                                 @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>
        </div>
        <div v-else>
            <SubcontractDetail :data="transToDetailData" :callback="handleSubmitCallback"></SubcontractDetail>
        </div>
    </div>
</template>

<script>
    import popover from './popover.vue'
    import Retrieve from '../../Retrieve'
    import WorkMould from '../../mould/WorkMould'
    import SubcontractDetail from './SubcontractQueryDetail'
    import paramJson from './subcontractQuery' //同目录下json数据
    // 引入封装的ajax控件
    import {ajaxRequest, formatDate} from '../../util/base'
    // 引入jquery

    export default {
        name: "subcontractQuery",
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                blackClass: "black",
                redClass: "red",
                isSetting: 0,
                tableData: [],
                transToDetailData: null,
                isShowDetail: false,
                multipleSelection: [],
                orderProperty: '',
                orderType: '',

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
                MStandardListLoading: false,
                loading: false
            }
        },
        props: {
            callback: {
                type: Function
            }
        },
        methods: {
            // 判断是否能够进行出库撤销
            isReback: function (row, column) {
                if (row.entryDate) {
                    return false;
                } else {
                    return true;
                }
            },
            handleSubmitCallback(rowInfo) {
                if (rowInfo) {
                    //todo
                    // ajaxRequest('put', 'back/quotationAppliance/', {quotationAppliance: JSON.stringify(rowInfo)}, (res) => {
                    //     if (res.code === 200) {
                    this.$message.success('修改成功');
                    this.isShowDetail = true;
                    //         this.$emit('getPriceDetail')// 重新加载数据
                    //     }
                    // })
                } else {
                    this.isShowDetail = false;
                }
            },
            handleSelectionChange: function (rows) {
                this.multipleSelection = rows;
            },
            handleDetail: function (param) {
                this.transToDetailData = param;
                this.isShowDetail = true;
            },
            handleDelete: function (param) {
                let _this = this;
                if (param.length === 0) {
                    _this.$message.error("删除失败");
                } else {
                    _this.loading = true;
                    ajaxRequest('delete', 'back/subcontract/delSubcontractSample/' + param[0].id, {}, res => {
                        if (res.code === 200) {
                            _this.$message.success("删除成功");
                            _this.getTableList()
                        } else {
                            _this.$message.error("删除失败");
                        }
                        _this.loading = false;
                    });
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
            formatterTime: function (row, column, value) {
                return formatDate(value, 'YYYY-MM-DD');
            },
            formatterColumn: function (row, column, value) {
                let res = "";
                switch (value) {
                    case "1":
                        res = "送去检测机构";
                        break;
                    case "2":
                        res = "快递";
                        break;
                    case "3":
                        res = "检测机构来取";
                        break;
                }
                return res;
            },
            entryFormatterColumn: function (row, column, value) {
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
            toggleSelection: function (rows) {
                let _this = this;
                if (rows) {
                    rows.forEach(row => {
                        _this.$refs.multipleTable.toggleRowSelection(row, true);
                    });
                    _this.multipleSelection = rows;
                } else {
                    _this.$refs.multipleTable.clearSelection();
                }
            },
            subcontractingOutRevoke: function () {
                let _this = this;
                if (_this.multipleSelection.length === 0) {
                    _this.$alert("请至少选择一个要撤销的样品", "提示", {
                        showCancelButton: "取消",
                        showConfirmButton: "确定",
                        type: "warning",
                        center: true
                    });
                } else {
                    const ids = _this.multipleSelection
                        .map(function (v) {
                            return v.id;
                        }).join(",");
                    ajaxRequest("Post", "back/subcontract/delSubcontractSampleBatch", {
                        ids: ids,
                        _method: "DELETE"
                    }, res => {
                        if (res.code === 200) {
                            _this.$message.success("撤销出库成功");
                            _this.getTableList();
                        } else {
                            _this.$message.error("撤销出库失败");
                        }
                    });
                }
            },
            handleForward: function (row) {
                let _this = this;
                //todo 跳转到流程查询页面
                _this.$router.push("");
            },
            getTableList: function () {
                let _this = this;
                this.MStandardListLoading = true;
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
                this.MStandardListLoading = false;
            }
        },
        components: {
            popover,
            WorkMould,
            Retrieve,
            SubcontractDetail
        },
        mounted() {
            this.getTableList();
            this.QJGetMounted();
        }
    }
</script>

<style scoped>
    .table {
        margin-top: 10px;
    }

    .el-table {
        width: 100%;
    }

    .pagination {
        margin-top: 20px;
        text-align: center;
    }

    .red {
        color: #880000 !important;
    }

    .blue {
        color: #00b6ff;
    }

    .black {
        color: #000;
    }

    .item {
        padding: 18px 0;
    }

    .box-card {
        width: 100%;
        margin-top: 10px;
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
</style>