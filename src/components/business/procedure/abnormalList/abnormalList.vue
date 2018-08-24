<!-- author 黄溧 -->
<template>
    <div class="abnormalList">
        <div v-if="!abnormalType || abnormalType !== 'review'">
            <div style="margin-bottom:10px;" v-if="defaultOpen">
                <Retrieve ref="retrieve-wapper"
                          :rowsCondition='rowsCondition'
                          :sortBy="sortBy"
                          :order="order"
                          :paramJson="paramJson"
                          :retrieveCondition="retrieveCondition"/>
            </div>
            <div style="display: flex;justify-content: space-between;margin-bottom:10px;">
                <div>
                    <!-- <input id="excel-upload-input" ref="excel-upload-input" @change="read" v-show="false" type="file" accept=".xlsx, .xls">
                          <el-button size="small" type="primary" @click="exportExcel">打印表格</el-button> -->
                </div>
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
					<div style="display:inline-block">
						<global-tootips>
							<div>
								<p>１、无权限人员仅可查看本人申请记录，部门权限查询本部门记录，高级查询查询所有记录；</p> 
								<p>２、点击详情进入页面，未审核的申请记录，可由申请人本人撤回；</p>
								<p>３、所有审核通过的申请记录，可由有权限人员撤消；</p> 
								<p> 针对审核通过的撤消功能，将执行以下操作：</p>
								<p> 退如产生费用，还原相关样品费用,延期还原检测期限</p> 
							</div>
						</global-tootips>
					</div>
          <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                     :handleMouldBack="QJHandleMouldBack"/>
        </span>
            </div>
            <el-table :max-height="QJTableMaxHeight" v-loading="loading"
                      :data="abnormalList"
                      border
                      style="width: 100%">
                <el-table-column
                        v-if="headObj.registrationNo"
                        prop="registrationNo"
                        :render-header="QJrenderHeader"
                        show-overflow-tooltip
                        label="登记号">
                </el-table-column>
                <el-table-column
                        v-if="headObj.orderNo"
                        prop="orderNo"
                        :render-header="QJrenderHeader"
                        show-overflow-tooltip
                        label="委托单号">
                </el-table-column>
                <el-table-column
                        v-if="headObj.companyName"
                        prop="companyName"
                        :render-header="QJrenderHeader"
                        show-overflow-tooltip
                        label="委托单位">
                </el-table-column>
                <el-table-column
                        v-if="headObj.applianceName"
                        prop="applianceName"
                        :render-header="QJrenderHeader"
                        show-overflow-tooltip
                        label="器具名称">
                </el-table-column>
                <el-table-column
                        v-if="headObj.applyType"
                        prop="applyType"
                        :render-header="QJrenderHeader"
                        :formatter="formatApplyType"
                        show-overflow-tooltip
                        label="异常类型">
                </el-table-column>
                <el-table-column
                        v-if="headObj.departName"
                        prop="departName"
                        :render-header="QJrenderHeader"
                        show-overflow-tooltip
                        label="检测部门">
                </el-table-column>
                <el-table-column
                        v-if="headObj.postName"
                        prop="postName"
                        :render-header="QJrenderHeader"
                        show-overflow-tooltip
                        label="检测岗位">
                </el-table-column>
                <el-table-column
                        v-if="headObj.addUserName"
                        prop="addUserName"
                        :render-header="QJrenderHeader"
                        show-overflow-tooltip
                        label="申请人">
                </el-table-column>
                <el-table-column
                        v-if="headObj.applyDate"
                        prop="applyDate"
                        :render-header="QJrenderHeader"
                        :formatter="formatApplyTime"
                        show-overflow-tooltip
                        label="申请日期">
                </el-table-column>
                <!-- <el-table-column
                        v-if="headObj.applianceActualName"
                  prop="applianceActualName"
                  :render-header="QJrenderHeader"
                  show-overflow-tooltip
                  label="器具实际名称">
                </el-table-column> -->
                <el-table-column
                        v-if="headObj.applyReason"
                        prop="applyReason"
                        :render-header="QJrenderHeader"
                        :formatter="reasonFormat"
                        show-overflow-tooltip
                        label="申请原因">
                </el-table-column>
                <el-table-column
                        v-if="headObj.applyBz"
                        prop="applyBz"
                        :render-header="QJrenderHeader"
                        show-overflow-tooltip
                        label="备注">
                </el-table-column>
                <el-table-column
                        v-if="headObj.bmShFlag"
                        prop="bmShFlag"
                        :render-header="QJrenderHeader"
                        :formatter="formatDepartAduit"
                        show-overflow-tooltip
                        label="一级审核">
                </el-table-column>
                <el-table-column
                        v-if="headObj.shFlag"
                        prop="shFlag"
                        :render-header="QJrenderHeader"
                        :formatter="formatAduit"
                        show-overflow-tooltip
                        label="二级审核">
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleReview(scope.row)" type="text" style="padding:0;font-size:18px;">
                            <i class="el-icon-view" title="详情"></i>
                        </el-button>
                        <el-button v-has="'M704'"
                                   v-mindPopover="{message:'确定撤回?',success:handleRecall.bind(this,scope.row),isOpen:handleOpen.bind(this,scope.row)}"
                                   type="text" style="padding:0;font-size:18px;"
                                   :disabled="scope.row.isSettlement!=0 || scope.row.isSettleAccount != 0 || scope.row.flag != 1">
                            <i class="el-icon-refresh"
                               v-mindTooltip="{message:!!scope.row.isSettlement?'已结算':!!scope.row.isSettleAccount?'已结账':'',show:!!scope.row.isSettlement||!!scope.row.isSettleAccount}"
                               title="撤回"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top:10px;text-align:center; float:right;">
                <mind-pagination
                        :current-page="page"
                        :page-size="rows"
                        :total="total"
                        @size-change="handlePageSizeChange"
                        @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>
        </div>
        <abnormal-detail v-if="abnormalType == 'review'" type="review"></abnormal-detail>
    </div>
</template>
<script type="text/javascript">
    import Vue from 'vue';
    import VueBarcode from 'vue-barcode';
    import abnormalCommon from './mixins/abnormalCommon'
    import abnormalDetail from './abnormalDetail'
    import Retrieve from "@/components/Retrieve";
    import WorkMould from "@/components/mould/WorkMould";
    import TableColumnHeader from "@/components/Table/TableColumnHeader";
    import paramJson from "./retrieveConfig/retrieveConfig";
    // import DocSizeUtil from '@/mixins/DocSizeUtil.js';
    // import XLSX from 'xlsx';
    // require('script-loader!file-saver');
    // require('script-loader!./Blob');
    export default {
        name: 'abnormalList',
        data() {
            return {
                abnormalList: [],// 异常流程列表

                /*高级检索相关项*/
                isSetting: 0, //控制个性化设置弹窗是否展示
                rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
                paramJson: paramJson, //同目录下json数据 常量
                moduleList: [], //模板列表
                templateValue: "", //当前选择的模板id
                sortBy: "", //排序字段
                order: "", //desc降序 asc升序
                headObj: {}, //表头显示对象 {category:true}
                defaultOpen: true, //默认开启高级查询
                userId: "",
                allModules: {}, //所有模板
                resultCondition: [],
                retrieveCondition: [],
                page: 1,
                rows: 10,
                total: 0,
                //分页样式
                layout: "prev,next,countpage,total",
                // 申请原因格式化
                refundReasonList: [],
                delayReasonList: [],
                loading: false
                // wb:{
                // 	SheetNames: [],
                // 	Sheets: {},
                // }
            }
        },
        computed: {
            abnormalType() {
                return this.$store.state.Procedure.abnormalInfo.type
            },
            abnormalId() {
                return this.$store.state.Procedure.abnormalInfo.id
            },
        },
        watch: {
            abnormalId(n, o) {
                if (n) {
                    return;
                }
                this.getTableList()
            }
        },
        mixins: [abnormalCommon],
        methods: {
            /******************************************** 表单操作 start **************************************/
            /**
             * [handleReview 查看异常申请的详情]
             * @return {[type]} [description]
             */
            handleReview(row) {
                this.$store.commit('SET_ABNORMAL_INFO', {
                    type: 'review',
                    id: row.id,
                })
            },
            /**
             * [handleRecall 处理异常申请的撤回操作仅针对2级审核]
             * @return {[type]} [description]
             */
            handleRecall(row) {
                this.$store.dispatch('handleRecall', {
                    id: row.id,
                    type: 3,
                    flag: 3,
                }).then(res => {
                    this.$message.success({
                        message: '撤回成功！',
                        duration: 1000,
                        onClose: () => {
                            this.getTableList()
                        }
                    })
                })
            },
            /**
             * [handleOpen 如果未通过则不出现提示框]
             * @param  {[type]} row [description]
             * @return {[type]}     [description]
             */
            handleOpen(row) {
                if (row.shFlag == '0') {
                    this.$message.error('二审未通过，无法撤回！')
                    return false
                }
                if (row.isSettlement == 1) {
                    this.$message.error('该任务已结算，无法撤回！')
                    return false
                }
                if (row.isSettleAccount == 1) {
                    this.$message.error('该任务已结账，无法撤回！')
                    return false
                }
                return true
            },
            /******************************************** 表单操作 end **************************************/

            /******************************************** 初始化操作 start **************************************/
            /**
             * [getTableList 查询出所有的异常流程]
             * @return {[type]} [description]
             */
            getTableList() {
                this.loading = true;
                this.$store.dispatch('getAbnormalList', {
                    orderProperty: this.orderProperty,
                    orderType: this.orderType, // 进行升序降序排列的标志
                    sc: this.sc,
                    page: this.page,
                    rows: this.rows,
                    total: 0,
                    showFlag: '1',
                }).then(res => {
                    this.abnormalList = res.rows;
                    this.total = res.total;
                    this.loading = false;
                }).catch(rej => {
                    this.$message.error(rej);
                    this.loading = false;
                })
            },
            // 异步编程管理
            async asyncInitFunction() {
                await Promise.all([this.getTableList(), this.QJGetMounted()])
            },
            tableReasonInit() {
                this.$store.dispatch('getInfoReason', {type: 'refund'}).then(res => {
                    this.refundReasonList = res.list;
                })
                this.$store.dispatch('getInfoReason', {type: 'delay'}).then(res => {
                    this.delayReasonList = res.list;
                })
            }
            /******************************************** 初始化操作 end **************************************/
        },
        components: {
            abnormalDetail,
            Retrieve,
            WorkMould,
            TableColumnHeader,
        },
        mounted() {
            this.asyncInitFunction()
            this.tableReasonInit();
        },
    }
</script>
<style scoped>
    .el-icon-setting {
        background: none !important;
        border: none !important;
        color: #3094e0 !important;
    }

    .el-icon-setting:hover {
        color: #3094e0 !important;
    }
</style>
