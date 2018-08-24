<template>
    <div>
        <div class="search">
            <div style="margin-bottom:10px;" v-if="defaultOpen">
                <Retrieve ref="retrieve-wapper"
                          :rowsCondition='rowsCondition'
                          :sortBy="sortBy"
                          :order="order"
                          :paramJson="paramJson"
                          :retrieveCondition="retrieveCondition">
                </Retrieve>
            </div>
            <div style="display: flex;justify-content: space-between;">
                <div>
                    <span style="color: #606266">分包区域:</span>
                    <el-tooltip content="查询指定分包区域的记录">
                        <i class="el-icon-info fS12"></i>
                    </el-tooltip>
                    <el-select size="mini" v-model="subcontractAreaforQuery" @change="QJAdvanceSearch"
                               placeholder="请选择">
                        <el-option
                                v-for="item in subcontractAreas"
                                :key="item.code"
                                :label="item.remark"
                                :value="item.code">
                        </el-option>
                    </el-select>
                    <el-button @click="subcontractingOut()" type="primary">分包出库</el-button>
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
                                <p>1、<span style="color:red;">登记号</span>：未收费；<span style="color:red;">委托单位</span>：未到帐；
                                    <span style="color:black;">器具名称</span>：样品证书已入库； <span style="color:red;">器具名称</span>：样品证书未入库；</p>
                                <p> 2、委托单位名称前含（**）符号，表示该单位有特殊要求！鼠标移至单位名称上查看详情。 </p>
                            </dl>
                       </el-row>
                    </div>
                </span>
            </div>
        </div>
        <div style="margin-top:10px;">
            <el-table :max-height="QJTableMaxHeight" ref="multipleTable" :data="tableData" v-loading="loading"
                      @selection-change="handleSelectionChange" border style="width: 100%" size="small">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column v-if="headObj.entrustNumber" prop="entrustNumber" label="委托单号"></el-table-column>
                <el-table-column v-if="headObj.companyName" prop="companyName" label="委托单位" width="200">
                    <template slot-scope="scope">
                        <companyPopover :rowInfo="scope.row" showContent="companyName"></companyPopover>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.registrationNo" prop="registrationNo" label="登记号" width="100">
                    <template slot-scope="scope">
                        <span :class="{red:scope.row.feeStatus == 0}">{{scope.row.registrationNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.applianceName" prop="applianceName" label="器具名称">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.row)" type="text">
                             <span :class="{red:scope.row.certificateWarehouseFlag == 0}">
                                 {{scope.row.applianceName ? scope.row.applianceName : scope.row.applianceActualName}}
                             </span>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.subcontractArea" prop="subcontractArea" label="分包区域"></el-table-column>
                <el-table-column v-if="headObj.setNumber" prop="setNumber" label="套数"></el-table-column>
                <el-table-column v-if="headObj.unit" prop="unit" label="件/套"></el-table-column>
                <el-table-column v-if="headObj.entrustDate" prop="entrustDate" label="委托日期"
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
                <el-table-column v-if="headObj.companyAddress" prop="companyAddress" label="单位地址"></el-table-column>
                <el-table-column v-if="headObj.contacter" prop="contacter" label="联系人"></el-table-column>
                <el-table-column v-if="headObj.telephone" prop="telephone" label="电话"></el-table-column>
                <el-table-column v-if="headObj.remark" prop="remark" label="备注"></el-table-column>
                <el-table-column v-if="headObj.contractNo" prop="contractNo" label="协议号"></el-table-column>
                <el-table-column v-if="headObj.customerRequireCompany" prop="customerRequireCompany" label="客户要求证书委托单位"
                                 width="200"></el-table-column>
            </el-table>
        </div>

        <div style="margin-top:20px;text-align:center;float: right;">
            <mind-pagination
                    :current-page="page"
                    :page-size="rows"
                    :total="total"
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange">
            </mind-pagination>
        </div>
        <div style="margin-top: 20px">
            <span style="color: #606266">分包区域:</span>
            <el-tooltip content="针对选中的记录可修改分包区域">
                <i class="el-icon-info fS12"></i>
            </el-tooltip>
            <el-select size="mini" v-model="subcontractArea" placeholder="请选择">
                <el-option
                        v-for="item in subcontractAreas"
                        :key="item.code"
                        :label="item.remark"
                        :value="item.code">
                </el-option>
            </el-select>
            <el-button type="primary" @click="handleModifySubcontractArea()">修改</el-button>
        </div>
        <SubcontractOut v-if="!!isOut" :data="isOut" :callback="handleSubmitCallback"></SubcontractOut>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Retrieve from '../../Retrieve'
    import WorkMould from '../../mould/WorkMould'
    import {ajaxProxyRequest, ajaxRequest, formatDate} from '../../util/base';
    import paramJson from './subcontract' //同目录下json数据
    import popover from './popover' //同目录下json数据
    import SubcontractOut from './SubcontractOut';
    import companyPopover from '../plan/companyPopover'

    Vue.use(SubcontractOut);

    export default {
        name: "unSubpackage",
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: '',
                orderProperty: '',
                orderType: '',
                tableData: [],
                multipleSelection: [],
                subcontractAreas: [],
                subcontractArea: "",
                subcontractAreaforQuery: "",
                fuzzySearch: 0,
                isSetting: 0,//控制个性化设置弹窗是否展示
                isOut: null,

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
                loading: false
            }
        },
        props: {
            callback: {
                type: Function
            }
        },
        methods: {
            handleModifySubcontractArea: function () {//修改分包区域
                let _this = this;
                if (_this.multipleSelection.length === 0) {
                    _this.showAlert("请至少选择一个样品修改");
                } else if (_this.subcontractArea === '') {
                    _this.showAlert("请先选择分包区域");
                } else {
                    let registrationNos = _this.multipleSelection
                        .map(function (v) {
                            return v.registrationNo;
                        })
                        .join(",");
                    _this.loading = true;
                    ajaxRequest("put", "back/subcontract/updateSubcontractArea",
                        {
                            registrationNos: registrationNos
                            , area: _this.subcontractArea
                        },
                        function (res) {
                            if (res.code === 200) {
                                _this.$message.success("修改成功");
                                _this.getTableList();
                            } else {
                                _this.$message.error("修改失败");
                            }
                            _this.loading = false;
                        }.bind(_this)
                    );
                }
            },
            toggleSelection: function (rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row, true);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            subcontractingOut: function () {
                let _this = this;
                if (_this.multipleSelection.length === 0) {
                    _this.showAlert("请至少选择一条记录出库");
                } else {
                    _this.isOut = _this.multipleSelection
                        .map(function (v) {
                            return v.registrationNo;
                        })
                        .join(",");
                }

            },
            showAlert: function (msg) {
                this.$alert(msg, "提示", {
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true
                });
            },
            getTableList() {
                let _this = this;
                _this.loading = true;
                ajaxRequest('get', 'back/subcontract/retrieve', {
                    subcontractArea: _this.subcontractAreaforQuery,
                    page: _this.page,
                    rows: _this.rows,
                    orderProperty: _this.orderProperty,
                    orderType: _this.orderType,
                    total: 0,
                    sc: _this.sc
                }, (res) => {
                    if (res.code === 200) {
                        _this.tableData = res.rows;
                        _this.total = res.total;
                        _this.multipleSelection = []

                    }
                    _this.loading = false;
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size;
                this.getTableList();
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage;
                this.getTableList();
            },
            formatterTime: function (row, column) {
                return formatDate(row.entrustDate, 'YYYY-MM-DD');
            },
            handleEdit(rowInfo) {
                //todo 点击器具名称跳转到流程查询页面
                // this.$router.push({
                //     path: '/admin/213',
                //     query: {
                //         id: rowInfo.id,
                //     }
                // })
            },
            handleSubmitCallback(rowInfo) {
                let _this = this;
                if (rowInfo) {
                    ajaxRequest('post', 'back/subcontract/addSubcontract',
                        rowInfo, res => {
                            if (res.code === 200) {
                                _this.$message.success('样品分包出库成功');
                                _this.tableData = res.rows;
                                _this.total = res.total;
                                _this.multipleSelection = [];
                                _this.isOut = null;
                                _this.getTableList();// 重新加载数据
                            } else {
                                _this.$message.error('样品分包出库失败');
                            }
                        }
                    );
                } else {
                    _this.isOut = null;
                }
            },
            getSubcontractArea: function () {
                //初始化分包区域
                let _this = this;
                ajaxProxyRequest('get', '/njmind/findParam/subcontractAreas', {},
                    (res) => {
                        _this.subcontractAreas = res.list.filter(function (value, index) {
                            if (value.remark !== '否') {
                                return value;
                            }
                        });
                    });
            }
        },
        components: {
            SubcontractOut,
            Retrieve,
            WorkMould,
            popover,
            companyPopover

        },
        mounted() {
            this.getTableList();
            this.getSubcontractArea();
            this.QJGetMounted();
        }
    }
</script>

<style scoped>

    .red {
        color: #880000 !important;
    }

    .blue {
        color: #00b6ff;
    }

    .black {
        color: #000;
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
