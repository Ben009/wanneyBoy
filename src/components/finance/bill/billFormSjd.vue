<template>
    <div style="position:relative;">
        <div style="margin-bottom:10px;">
            <Retrieve ref="retrieve-wapper"
                      :rowsCondition='rowsCondition'
                      :sortBy="sortBy"
                      :order="order"
                      v-if="defaultOpen"
                      :paramJson="paramJson"
                      :retrieveCondition="retrieveCondition"
                      :collectionInfo="collectionInfo"
            />
        </div>
        <div>
            <div style="display: flex;justify-content: space-between; margin:10px 0px;">
                <span></span>
                <div style="display: inline-block;text-align: center" v-if="defaultOpen">
                    <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                    <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
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
           <global-tootips :width="600">
              <p> 1、当登记号处于：未完成、折扣申请、异常申请流程状态中时，系统禁止添加进缴费单，鼠标移上复选框可查看原因；若未完成时需添加进缴费单，可通过委托查询进行手工完工，或有权限人员添加；此外，一个登记号仅允许添加进一个缴费单；</p>
              <p> 2、业务员仅可查询委托单员业务员为本人的记录，专业部门仅可查询本部门的记录，有权限人员查询所有；</p>
              <p> 3、费用字段均按应收/实收显示，如：100/80表示应收100，实收80；</p>
              <p>4、套数出现A/B时，B表示退件数量。</p>
          </global-tootips>
          </span>
            </div>
            <div v-if="!isToAdd" style="padding-top: 5px;text-align: center">合计：<span
                    style="color: red;font-weight: bold;font-size: 16px;">{{totalMoney}}</span> &nbsp;&nbsp;&nbsp;&nbsp;可打折金额：<span
                    style="font-size: 16px;color: red;font-weight: bold">{{discountSum}}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;不可打折金额：<span
                        style="font-size: 16px;color: red;font-weight: bold">{{undiscountSum}}</span> &nbsp;&nbsp;&nbsp;&nbsp;<el-button
                        type="primary" @click="toSubmit()" class="primary">提交
                </el-button>
            </div>
            <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%"
                      @sort-change="handleSort"
                      ref="multipleTable" @select-all='checkAll' @selection-change="handleSelectionChange"
                      v-loading="loading">
                <el-table-column type="selection" width="40">
                    <template slot-scope="scope">
                        <el-tooltip :disabled="!((scope.row.FINISH_FLAG== 0&&btnPower.indexOf('@M32115@') == -1)
                ||scope.row.PROCESSNUM>0||scope.row.CHARGEAPPLYNUM>0)"
                                    :content="(scope.row.FINISH_FLAG== 0&&btnPower.indexOf('@M32115@') == -1)?'未完成':scope.row.CHARGEAPPLYNUM>0?'折扣申请流程中':'异常申请流程中'"
                                    placement="bottom" effect="light">
                            <el-checkbox-group v-model="multipleSelection">
                                <el-checkbox :label="scope.row" :disabled="(scope.row.FINISH_FLAG== 0&&btnPower.indexOf('@M32115@') == -1)
                ||scope.row.PROCESSNUM>0||scope.row.CHARGEAPPLYNUM>0"></el-checkbox>
                            </el-checkbox-group>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.REGISTRATION_NO" key="REGISTRATION_NO" prop="REGISTRATION_NO"
                                 label="登记号"></el-table-column>
                <el-table-column v-if="headObj.ORDER_NO" key="ORDER_NO" prop="ORDER_NO" label="委托单号"></el-table-column>
                <el-table-column v-if="headObj.COMPANY_NAME" key="COMPANY_NAME" prop="COMPANY_NAME"
                                 label="委托单位"></el-table-column>
                <el-table-column v-if="headObj.APPLIANCE_NAME" key="APPLIANCE_NAME" prop="APPLIANCE_NAME"
                                 label="器具名称"></el-table-column>
                <el-table-column v-if="headObj.IS_COMPULSORY_VERIFY" key="IS_COMPULSORY_VERIFY"
                                 prop="IS_COMPULSORY_VERIFY" label="是否强检">
                    <template slot-scope="scope">
                        <span v-if="scope.row.IS_COMPULSORY_VERIFY=='0'">否</span>
                        <span v-if="scope.row.IS_COMPULSORY_VERIFY=='1'">是</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.SET_NUMBER" key="SET_NUMBER" prop="SET_NUMBER" label="套数">
                    <template slot-scope="scope">
                        {{scope.row.SET_NUMBER}}<span v-if="scope.row.RETURN_NUMBER!=0" style="color:red">/{{scope.row.RETURN_NUMBER}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.ENTRUST_DATE" key="ENTRUST_DATE" prop="ENTRUST_DATE" label="委托日期">
                    <template slot-scope="scope">
                        {{scope.row.ENTRUST_DATE | dateyymmdd}}
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.FINISH_DATE" key="FINISH_DATE" prop="FINISH_DATE" label="完成日期">
                    <template slot-scope="scope">
                        {{scope.row.FINISH_DATE | dateyymmdd}}
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.DEPART_NAME" key="DEPART_NAME" prop="DEPART_NAME"
                                 label="检测部门"></el-table-column>
                <el-table-column v-if="headObj.CONTRACT_NO" key="CONTRACT_NO" prop="CONTRACT_NO"
                                 label="合同号"></el-table-column>
                <el-table-column v-if="headObj.EXECUTOR" key="EXECUTOR" prop="EXECUTOR" label="检测人员"></el-table-column>
                <el-table-column v-if="headObj.TOTAL_ACTUAL" key="TOTAL_ACTUAL" prop="TOTAL_ACTUAL"
                                 :label="defaultInfo.fee7">
                    <template slot-scope="scope">
                        <span>{{scope.row.TOTAL_FEE}}/{{scope.row.TOTAL_ACTUAL}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.JDF_ACTUAL" key="JDF_ACTUAL" prop="JDF_ACTUAL" :label="defaultInfo.fee1">
                    <template slot-scope="scope">
                        <span>{{scope.row.JDF}}/{{scope.row.JDF_ACTUAL}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.FJF_ACTUAL" key="FJF_ACTUAL" prop="FJF_ACTUAL" :label="defaultInfo.fee2">
                    <template slot-scope="scope">
                        <span>{{scope.row.FJF}}/{{scope.row.FJF_ACTUAL}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.JJF_ACTUAL" key="JJF_ACTUAL" prop="JJF_ACTUAL" :label="defaultInfo.fee3">
                    <template slot-scope="scope">
                        <span>{{scope.row.JJF}}/{{scope.row.JJF_ACTUAL}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.XLF_ACTUAL" key="XLF_ACTUAL" prop="XLF_ACTUAL" :label="defaultInfo.fee4">
                    <template slot-scope="scope">
                        <span>{{scope.row.XLF}}/{{scope.row.XLF_ACTUAL}}</span>
                    </template>
                </el-table-column>

                <el-table-column v-if="headObj.FWF_ACTUAL" key="FWF_ACTUAL" prop="FWF_ACTUAL" :label="defaultInfo.fee5">
                    <template slot-scope="scope">
                        <span>{{scope.row.FWF}}/{{scope.row.FWF_ACTUAL}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.QTF_ACTUAL" key="QTF_ACTUAL" prop="QTF_ACTUAL" :label="defaultInfo.fee6">
                    <template slot-scope="scope">
                        <span>{{scope.row.QTF}}/{{scope.row.QTF_ACTUAL}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.WORKLOAD_ACTUAL" key="WORKLOAD_ACTUAL" prop="WORKLOAD_ACTUAL"
                                 :label="defaultInfo.fee8">
                    <template slot-scope="scope">
                        <span>{{scope.row.WORKLOAD}}/{{scope.row.WORKLOAD_ACTUAL}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.INTENSIVE_WORKLOAD_ACTUAL" key="INTENSIVE_WORKLOAD_ACTUAL"
                                 prop="INTENSIVE_WORKLOAD_ACTUAL" :label="defaultInfo.fee9">
                    <template slot-scope="scope">
                        <span>{{scope.row.INTENSIVE_WORKLOAD}}/{{scope.row.INTENSIVE_WORKLOAD_ACTUAL}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.DISCOUNT" key="DISCOUNT" prop="DISCOUNT" label="折扣"></el-table-column>
                <el-table-column v-if="headObj.IS_DISCOUNT" key="IS_DISCOUNT" prop="IS_DISCOUNT" label="是否允许打折">
                    <template slot-scope="scope">
                        <span v-if="scope.row.IS_DISCOUNT=='0'">否</span>
                        <span v-if="scope.row.IS_DISCOUNT=='1'">是</span>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="!isToAdd" style="padding-top: 5px;text-align: center">合计：<span
                    style="font-size: 16px;color: red;font-weight: bold">{{totalMoney}}</span> &nbsp;&nbsp;&nbsp;&nbsp;可打折金额：<span
                    style="font-size: 16px;color: red;font-weight: bold">{{discountSum}}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;不可打折金额：<span
                        style="font-size: 16px;color: red;font-weight: bold">{{undiscountSum}}</span> &nbsp;&nbsp;&nbsp;&nbsp;<el-button
                        type="primary" @click="toSubmit()" class="primary">提交
                </el-button>
            </div>
        </div>
        <div style="margin-top:10px;text-align:center; float:right;">
            <mind-pagination
                    :current-page="page"
                    :page-size="rows"
                    :total="total"
                    :pageSizes="[50,100,500]"
                    :pageSize=100
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange">
            </mind-pagination>
        </div>
        <bill-info v-if="!!handleEdit" :data="billForm" :djhTable="djhData"
                   :callback="handelSubmitCallback"></bill-info>
        <billDetailForm v-if="!!modify" :data="modify" :callback="handleEditCallback"></billDetailForm>
    </div>

</template>

<script>
    import Vue from 'vue'
    import Vuex from 'vuex'
    import {ajaxRequest, ajaxProxyRequest, ajaxSyncProxyRequest, formatDate} from '../../util/base'
    import Retrieve from '../../Retrieve'
    import $ from 'jquery'
    import WorkMould from '../../mould/WorkMould'
    import TableColumnHeader from '../../Table/TableColumnHeader'
    import paramJson from './billWtdListParam'
    import BillInfo from "./billInfo.vue";
    import billDetailForm from './billDetailForm.vue';
    import ElCheckboxGroup from "../../../common-el/packages/checkbox/src/checkbox-group.vue";

    export default {
        name: 'billFormSjd',
        props: {//用于接收从父组件中传来的数据
            callback: {
                type: Function
            },
            isToAdd: {
                type: Boolean
            }
        },
        data() {
            return {
                page: 1,
                rows: 100,
                total: 0,
                searchKey: '',
                orderProperty: 'orderNo',
                orderType: 'desc',
                tableData: [],
                multipleSelection: [],
                fuzzySearch: 1,
                isSetting: 0,
                edit: null,
                defaultInfo: {},//初始化页面字段名称
                handleEdit: null,
                billForm: {},
                registration_no: "",//勾选中的登记号
                totalMoney: 0,//缴费单金额
                discountSum: 0,//可打折费用合计
                undiscountSum: 0,//不可打折费用合计
                loading: false,
                /*高级检索相关项*/
                rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
                paramJson: paramJson, //同目录下json数据 常量
                moduleList: [], //模板列表
                templateValue: "", //当前选择的模板id
                sortBy: "", //排序字段
                order: "", //desc降序 asc升序
                headObj: {}, //表头显示对象 {category:true}
                defaultOpen: true, //默认开启高级查询
                sc: '',
                userId: "",
                allModules: {}, //所有模板
                resultCondition: [],
                retrieveCondition: [],
                collectionInfo: [],
                modify: null,   //控制缴费单明细弹窗是否展示
                btnPower: localStorage.getItem('btnPower'),

            }
        },
        watch: {
            multipleSelection() {
                this.getDiscountAndUnDiscountSum();
            },
        },
        methods: {
            checkAll: function (selection) {
                this.multipleSelection = [];
                selection.forEach((e) => {
                    if ((e.FINISH_FLAG == 0 && this.btnPower.indexOf("@M32115@") == -1) || e.PROCESSNUM > 0 || e.CHARGEAPPLYNUM > 0) {//未完成、没有添加未完成登记号权限
                    } else {
                        this.multipleSelection.push(e)
                    }
                });
            },
            toSubmit() {
                let _this = this;
                if (this.multipleSelection.length == 0) {
                    _this.$message.error("请勾选登记号！");
                } else {
                    this.handleEdit = this.multipleSelection;
                    this.djhData = this.multipleSelection;
                    this.billForm = this.multipleSelection[0];
                }
            },
            handleEditCallback() {
                this.modify = null;
            },
            handelSubmitCallback(res) {
                let _this = this;
                if (res) {
                    if (res.code === 200) {
                        _this.handleEdit = null;
                        this.$nextTick(() => {
                            _this.modify = res.daoResult;
                        })
                        _this.getTableList();
                    }
                    else {
                        _this.$message.error('新增失败');
                    }
                }
                else {
                    this.handleEdit = null;
                    this.$nextTick(() => {
                        this.modify = null;
                    })
                    _this.getTableList();
                }
            },
            handleSort: function (column, prop, order) {
                this.orderProperty = column['prop']
                if (column['order'] === 'descending') {
                    this.orderType = 'desc'
                } else {
                    this.orderType = 'asc'
                }
                this.getTableList()
            },
            getTableList() {
                if (this.searchKey || this.fuzzySearch === 1) {
                    this.loading = true;
                    ajaxRequest('get', 'back/bill/getEntrustSjdListOfBill', {
                        fuzzySearch: 1,
                        page: this.page,
                        rows: this.rows,
                        orderType: this.orderType,
                        total: 0,
                        sc: this.sc
                    }, (res) => {
                        if (res.code === 200) {
                            this.tableData = res.rows
                            this.total = res.total
                            this.multipleSelection = [];
                            this.$nextTick(_ => {
                                this.tableData.forEach(row => {
                                    this.$refs.multipleTable.toggleRowSelection(row, true)
                                })
                                this.checkAll(this.tableData);
                            });
                        }
                        this.loading = false;
                    })
                }
            },
            getDiscountAndUnDiscountSum() {
                this.undiscountSum = 0;
                this.discountSum = 0;
                this.multipleSelection.forEach((e) => {
                    if (e.IS_DISCOUNT == 1) {
                        this.discountSum += e.TOTAL_ACTUAL;
                    } else {
                        this.undiscountSum += e.TOTAL_ACTUAL;
                    }
                })
                this.totalMoney = this.discountSum + this.undiscountSum;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.getDiscountAndUnDiscountSum();
                //追加页面
                if (this.isToAdd) {
                    let _this = this;
                    if (val.length > 0) {
                        var djh = "";
                        for (var i = 0; i < val.length; i++) {
                            djh += val[i].REGISTRATION_NO + ";";
                        }
                        _this.callback(djh, this.totalMoney);
                    }
                }

            },
            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size
                this.getTableList()
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage
                this.getTableList()
            },
            dealControlled(row, column) {
                let controlled = {0: '否', 1: '是'}
                return controlled[row.controlled]
            },
            dealDate: function (row, column, cellValue) {
                return new Date(cellValue).format('YYYY-MM-DD')
            },
        },
        components: {
            ElCheckboxGroup,
            BillInfo,
            WorkMould,
            TableColumnHeader,
            Retrieve,
            billDetailForm
        },
        filters: {
            datehhmmss(myInput) {
                return formatDate(myInput, "YYYY-MM-DD hh:mm:ss");
            },
            dateyymmdd(myInput) {
                return formatDate(myInput, "YYYY-MM-DD");
            }
        },
        mounted() {
            ajaxSyncProxyRequest('get', '/njmind/findParams/fee1$fee2$fee3$fee4$fee5$fee6$fee7$fee8$fee9', {}, (res) => {
                this.defaultInfo = {
                    fee1: res.fee1.value,
                    fee2: res.fee2.value,
                    fee3: res.fee3.value,
                    fee4: res.fee4.value,
                    fee5: res.fee5.value,
                    fee6: res.fee6.value,
                    fee7: res.fee7.value,
                    fee8: res.fee8.value,
                    fee9: res.fee9.value,
                }
            });
            let userId = localStorage.getItem("userId");
            this.userId = userId;
//      this.getTableList();
            this.QJGetMounted();
        },

    }
</script>

<style scoped>
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

</style>
