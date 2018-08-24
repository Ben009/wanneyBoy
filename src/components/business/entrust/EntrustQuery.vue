<template>
    <div>
        <!-- 查询页面 start -->
        <div style="position:relative;" v-show="!registrationNo">
            <div style="margin-bottom:10px;" v-if="defaultOpen">
                <Retrieve ref="retrieve-wapper"
                          :rowsCondition='rowsCondition'
                          :sortBy="sortBy"
                          :order="order"
                          :paramJson="paramJson"
                          :retrieveCondition="retrieveCondition"
                          :collectionInfo="collectionInfo"/>
            </div>
            <div>
                <div style="display: flex;justify-content: space-between;">
                    <div style="display: inline-block;text-align: center;margin:auto">
                        <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                        <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning">&nbsp;清空</el-button>
                    </div>
                    <span style="float: right">
                    <el-select size="mini" v-if="resultCondition.length" v-model="templateValue" placeholder="请选择"
                               @change="QJHandleSelectTemplate">
                    <el-option v-for="item in moduleList" :key="item.name" :label="item.name"
                               :value="item.name"> </el-option>
                    </el-select>
                     <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)"
                                class="el-icon-setting">个性化设置</el-button>
                        <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                                   :handleMouldBack="QJHandleMouldBack"/>
                      <div class="el-icon-info shuoming">
                        <el-row class="el-sm">
                          <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">事项说明</p>
                            <dl style="padding:6px 10px; ">
                          <p>1、<span style="color:red;">登记号：</span>未录费；</p>
                          <p>2、<span style="color:red;">单位名称：</span>未到账；</p>
                          <p>3、器具名称：<span style="color:black;">样品证书已入库</span>；<span
                                  style="color:red;">样品证书未入库</span>；<span
                                  style="color:blue;">样品已入库</span>；<span style="color:purple;">证书已入库</span></p>
                          <p>4、<span style="color:red;">检测部门：</span>异常申请退检且批准；</p>
                          <p>5、<span style="color:red;">检测岗位：</span>异常申请延期且批准；</p>
                          <p>6、有查询所有权限可查询所有报检器具，否则只能查询本部门检测器具；</p>
                          <p>7、有删除权限可删除报检器具。</p>
                            </dl>
                        </el-row>
                      </div>
                    </span>
                </div>
                <div>
                    <div style="margin-top:10px;">
                        <el-table :data="tableData" :max-height="QJTableMaxHeight" :max-row="true" border
                                  style="width: 100%;" @sort-change="handleSort" v-loading="loading"
                                  @selection-change="handleSelectionChange">
                            <el-table-column type="index" label="序号" width="50"></el-table-column>
                            <el-table-column prop="registrationNo" label="登记号">
                                <template slot-scope="scope">
                                    <!-- 未录费，红色 -->
                                    <span v-if="scope.row.feeStatus == 0"
                                          style="color:red">{{scope.row.registrationNo}}</span>
                                    <span v-else>{{scope.row.registrationNo}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column  prop="companyName" label="委托单位">
                                <template slot-scope="scope">
                                    <!-- 未到账，红色 -->
                                    <companyPopover :rowInfo="scope.row" showContent="companyName"></companyPopover>
                                </template>
                            </el-table-column>
                            <el-table-column  prop="applianceName" label="器具名称">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.applianceWarehouseFlag >= 3 &&  scope.row.certificateWarehouseFlag >= 3"
                                          style="color:black">{{scope.row.applianceName}}</span>
                                    <span v-else-if="scope.row.applianceWarehouseFlag < 3 &&  scope.row.certificateWarehouseFlag < 3"
                                          style="color:red">{{scope.row.applianceName}}</span>
                                    <span v-else-if="scope.row.applianceWarehouseFlag >= 3" style="color:blue">{{scope.row.applianceName}}</span>
                                    <span v-else-if="scope.row.certificateWarehouseFlag >= 3" style="color:purple">{{scope.row.applianceName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column  prop="departName" label="检测部门">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.returnFlag == 1"
                                          style="color:red">{{scope.row.departName}}</span>
                                    <span v-else>{{scope.row.departName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column  prop="postName" label="检测岗位">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.delayFlag == 1"
                                          style="color:red">{{scope.row.postName}}</span>
                                    <span v-else>{{scope.row.postName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="setNumber" label="套数">
                                <template slot-scope="scope">
                                    {{scope.row.setNumber}}<span v-if="scope.row.returnNumber > 0" style="color:red">/{{scope.row.returnNumber}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="headObj.pieceNumber" prop="pieceNumber"
                                             label="件/套"></el-table-column>
                            <el-table-column v-if="headObj.certificateNumber" prop="certificateNumber" label="证书数量"
                            ></el-table-column>
                            <el-table-column v-if="headObj.serviceDate" prop="serviceDate" label="受理日期"
                                             :formatter="dealDate"></el-table-column>
                            <el-table-column v-if="headObj.entrustDate" prop="entrustDate" label="委托日期"
                                             :formatter="dealDate"></el-table-column>
                            <el-table-column v-if="headObj.detectionDeadline" prop="detectionDeadline" label="检测期限"
                                             :formatter="dealDate"></el-table-column>
                            <el-table-column v-if="headObj.settlementDate" prop="settlementDate" label="结算日期"
                                             :formatter="dealDate"></el-table-column>
                            <el-table-column v-if="headObj.settleAccountsDate" prop="settleAccountsDate" label="结账日期"
                                             :formatter="dealDate"></el-table-column>
                            <el-table-column v-if="headObj.totalActual" prop="totalActual" label="费用合计"
                            ></el-table-column>
                            <el-table-column v-if="headObj.jdfActual" prop="jdfActual" label="检测费"
                            ></el-table-column>
                            <el-table-column v-if="headObj.isUrgents" prop="isUrgents" label="是否加急"
                            ></el-table-column>
                            <el-table-column v-if="headObj.certificateType" prop="certificateType" label="服务类型"
                            ></el-table-column>
                            <el-table-column v-if="headObj.fjfActual" prop="fjfActual" label="附加费"
                            ></el-table-column>
                            <el-table-column v-if="headObj.xlfActual" prop="xlfActual" label="修理费"
                            ></el-table-column>
                            <el-table-column v-if="headObj.jjfActual" prop="jjfActual" label="加急费"
                            ></el-table-column>
                            <el-table-column v-if="headObj.fwfActual" prop="fwfActual" label="服务费"
                            ></el-table-column>
                            <el-table-column v-if="headObj.qtfActual" prop="qtfActual" label="其他费"
                            ></el-table-column>
                            <el-table-column v-if="headObj.workloadActual" prop="workloadActual" label="工作量"
                            ></el-table-column>
                            <el-table-column v-if="headObj.intensiveWorkloadActual" prop="intensiveWorkloadActual"
                                             label="强检工作量"></el-table-column>
                            <!--<el-table-column v-if="headObj.jdfDiscount" prop="jdfDiscount" label="检测费折扣" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.otherDiscount" prop="otherDiscount" label="其他费折扣" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.discountType" prop="discountType" label="折扣类型"  :formatter="discountType"></el-table-column>-->
                            <el-table-column v-if="headObj.orderNo" prop="orderNo" label="委托单编号"
                            ></el-table-column>
                            <el-table-column v-if="headObj.orderSingleNo" prop="orderSingleNo" label="流转单号"
                            ></el-table-column>
                            <el-table-column v-if="headObj.finishDate" prop="finishDate" label="完成日期"
                                             :formatter="dealDate"></el-table-column>
                            <el-table-column v-if="headObj.discount" prop="discount" label="折扣"
                            ></el-table-column>
                            <el-table-column v-if="headObj.detectionMethod" prop="detectionMethod" label="检测方式"

                                             :formatter="detectionMethod"></el-table-column>
                            <el-table-column v-if="headObj.taskSource" prop="taskSource" label="任务来源"
                            ></el-table-column>
                            <el-table-column v-if="headObj.institutionalNature" prop="institutionalNature" label="机构性质"
                            ></el-table-column>
                            <el-table-column v-if="headObj.creditCode" prop="creditCode" label="统一社会信用代码"
                            ></el-table-column>
                            <el-table-column v-if="headObj.address" prop="contractNo" label="合同号"
                            ></el-table-column>
                            <el-table-column v-if="headObj.address" prop="contractSignatory" label="合同签署人"
                            ></el-table-column>
                            <el-table-column v-if="headObj.certificateFirstPrintTime" prop="certificateFirstPrintTime"
                                             label="证书打印日期"
                                             :formatter="dealDate"></el-table-column>
                            <el-table-column v-if="headObj.address" prop="address" label="委托单位地址"
                            ></el-table-column>
                            <el-table-column v-if="headObj.contacter" prop="administrativeArea" label="行政区划"
                            ></el-table-column>
                            <el-table-column v-if="headObj.contacter" prop="contacter" label="联系人"
                            ></el-table-column>
                            <el-table-column v-if="headObj.telephone" prop="telephone" label="联系电话"
                            ></el-table-column>
                            <el-table-column v-if="headObj.mobilePhone" prop="mobilePhone" label="手机号码"
                            ></el-table-column>
                            <el-table-column v-if="headObj.specialRequirement" prop="specialRequirement" label="整单备注"
                            ></el-table-column>
                            <el-table-column v-if="headObj.model" prop="model" label="型号规格"
                            ></el-table-column>
                            <el-table-column v-if="headObj.detectionParameter" prop="detectionParameter" label="检测参数"
                            ></el-table-column>
                            <el-table-column v-if="headObj.factoryNo" prop="factoryNo" label="出厂编号"
                            ></el-table-column>
                            <el-table-column v-if="headObj.equipmentNo" prop="equipmentNo" label="设备编号"
                            ></el-table-column>
                            <el-table-column v-if="headObj.manufacturer" prop="manufacturer" label="制造厂商"
                            ></el-table-column>
                            <el-table-column v-if="headObj.accessory" prop="accessory" label="器具附件"
                            ></el-table-column>
                            <el-table-column v-if="headObj.powerTypess" prop="powerTypess" label="电源类型"
                            ></el-table-column>
                            <el-table-column v-if="headObj.isRepairs" prop="isRepairs" label="是否调修"
                            ></el-table-column>
                            <el-table-column v-if="headObj.isDoubleNumbers" prop="isDoubleNumbers" label="是否双编号"
                            ></el-table-column>
                            <el-table-column v-if="headObj.subcontractAreaName" prop="subcontractAreaName" label="分包区域"
                            ></el-table-column>
                            <el-table-column v-if="headObj.remark" prop="remark" label="备注"
                            ></el-table-column>
                            <el-table-column v-if="headObj.isCompulsoryVerifys" prop="isCompulsoryVerifys" label="是否强检"
                                             :formatter="yesOrNo"></el-table-column>
                            <el-table-column v-if="headObj.applianceUse" prop="applianceUse" label="器具用途"
                            ></el-table-column>
                            <!-- <el-table-column v-if="headObj.isMessage" prop="isMessage" label="是否发送短信"  :formatter="yesOrNo"></el-table-column> -->
                            <!-- <el-table-column v-if="headObj.freeCheck" prop="freeCheck" label="是否免费"  :formatter="yesOrNo"></el-table-column> -->
                            <!--<el-table-column v-if="headObj.isConclusion" prop="isConclusion" label="是否出具结论"  :formatter="yesOrNo"></el-table-column>-->
                            <!--<el-table-column v-if="headObj.isRecheck" prop="isRecheck" label="是否复检"  :formatter="yesOrNo"></el-table-column>-->
                            <!--<el-table-column v-if="headObj.certificatePrintTime" prop="certificatePrintTime" label="要求证书日期"  :formatter="dealDate"></el-table-column>-->
                            <!-- <el-table-column v-if="headObj.certificateCompanyName" prop="certificateCompanyName" label="证书单位名称" ></el-table-column> -->
                            <!-- <el-table-column v-if="headObj.certificateCompanyAddress" prop="certificateCompanyAddress" label="证书单位地址" ></el-table-column> -->
                            <!-- <el-table-column v-if="headObj.addPersonName" prop="addPersonName" label="添加人" ></el-table-column> -->
                            <!-- <el-table-column v-if="headObj.addTime" prop="addTime" label="添加时间" ></el-table-column> -->
                            <!-- <el-table-column v-if="headObj.quotationNo" prop="quotationNo" label="报价单编号" ></el-table-column> -->
                            <!--<el-table-column v-if="headObj.isAuthorise" prop="isAuthorise" label="是否授权"  :formatter="yesOrNo"></el-table-column>-->
                            <!--<el-table-column v-if="headObj.detectionParameter" prop="detectionParameter" label="检测参数" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.appearance" prop="appearance" label="器具外观" ></el-table-column>-->

                            <!-- <el-table-column v-if="headObj.executor" prop="executor" label="执行人" ></el-table-column> -->
                            <!--<el-table-column v-if="headObj.executiveConfirmType" prop="executiveConfirmType" label="执行人确认状态" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.certificateCount" prop="certificateCount" label="已出证数量" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.originalCount" prop="originalCount" label="已出原始记录数量" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.approveCertificateCount" prop="approveCertificateCount" label="已完成批准证书数量" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.returnFlag" prop="returnFlag" label="是否有退回" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.delayFlag" prop="delayFlag" label="是否延期" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.feeStatus" prop="feeStatus" label="是否已录费" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.isSettlement" prop="isSettlement" label="是否结算" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.finishByHand" prop="finishByHand" label="是否手工完成" ></el-table-column>-->
                            <!-- <el-table-column v-if="headObj.finishFlag" prop="finishFlag" label="是否完成" ></el-table-column> -->
                            <!--<el-table-column v-if="headObj.expireFlag" prop="expireFlag" label="是否超期" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.expireDate" prop="expireDate" label="超期日期" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.applianceWarehouseFlag" prop="applianceWarehouseFlag" label="器具库房状态" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.certificateWarehouseFlag" prop="certificateWarehouseFlag" label="证书库房状态" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.isGuarantor" prop="isGuarantor" label="是否担保" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.chargeType" prop="chargeType" label="收费类型" ></el-table-column>-->
                            <!--<el-table-column v-if="headObj.subcontractFee" prop="subcontractFee" label="分包费" ></el-table-column>-->
                            <el-table-column label="操作" fixed="right" width="80px">
                                <template slot-scope="scope" v-if="scope.row.registrationNo != '合计'">
                                    <el-button @click="handleEdit(scope.row)" type="text"
                                               style="padding:0;font-size:18px;">
                                        <i class="el-icon-edit-outline" title="编辑"></i>
                                    </el-button>
                                    <!-- <el-button @click="handleHistory(scope.row)" type="text" style="padding:0;font-size:18px;">
                                      <i class="el-icon-tickets" title="操作痕迹"></i>
                                    </el-button> -->
                                    <el-button v-has="'M16715'"
                                               v-mindPopover="{message:'确认删除?',success:handleDelete.bind(this,[scope.row])}"
                                               type="text" style="padding:0;font-size:18px;">
                                        <i class="el-icon-delete" title="删除"></i>
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
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
            </div>
        </div>
        <!-- 查询页面 end -->
        <!-- 操作痕迹页面 start -->
        <operating-layer v-if="registrationNo" :registrationNo="registrationNo"
                         @visable="registrationNo = ''"></operating-layer>
        <!-- 操作痕迹页面 end -->
    </div>
</template>

<script>
    import Vue from 'vue'
    import Vuex from 'vuex'
    import {ajaxRequest} from '../../util/base'
    import Retrieve from '../../Retrieve'
    import $ from 'jquery'
    import WorkMould from '../../mould/WorkMould'
    import TableColumnHeader from '../../Table/TableColumnHeader'
    import entrustQueryParam from './js/entrustQueryParam'
    import operatingLayer from './operatingLayer' // 操作痕迹组件
    import companyPopover from '../plan/companyPopover'

    export default {
        name: 'entrustQuery',
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: '',
                orderProperty: 'trunc(wtd.service_date)',
                orderType: 'desc',
                tableData: [],
                multipleSelection: [],
                fuzzySearch: 0,
                isSetting: 0,//控制个性化设置弹窗是否展示
                edit: null,//控制编辑弹窗是否展示
                rowsCondition: entrustQueryParam, // 默认同目录下json数据 会依据模板改变
                paramJson: entrustQueryParam, // 同目录下json数据 常量
                moduleList: [], // 模板列表
                templateValue: '', // 当前选择的模板id
                sortBy: '', // 排序字段
                order: '', // desc降序 asc升序
                headObj: {}, // 表头显示对象 {category:true}
                defaultOpen: true,//默认开启高级查询

                allModules: {}, //所有模板
                resultCondition: [],
                retrieveCondition: [],
                collectionInfo: [],
                loading: false,
                registrationNo: '', // 登记号
            }
        },
        methods: {
            companyTypeName: function (row, column) {
                return '(' + row.companyType + ')' + row.companyName;
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
                this.loading = true;
                // if (this.searchKey || this.fuzzySearch === 1) {
                ajaxRequest('get', 'back/entrustSjd/entrustQuery', {
                    page: this.page,
                    rows: this.rows,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    total: 0,
                    sc: this.sc
                }, (res) => {
                    if (res.code === 200) {
                        this.tableData = res.rows;
                        this.total = res.total;
                        this.multipleSelection = []
                    }
                    this.loading = false;
                })
                // }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size;
                this.getTableList()
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage
                this.getTableList()
            },
            handleEdit(rowInfo) {
                this.$router.push({
                    name: '267',
                    params: {
                        wtdId: rowInfo.wtdId,
                        registrationNoSource: rowInfo.source,
                        registrationNoQuotationNo: rowInfo.quotationNo
                    }
                })
                // this.edit = rowInfo || {}
            },
            /**
             * [handleHistory 操作痕迹---获取登记号]
             * @param  {[type]} rowInfo [description]
             * @return {[type]}         [description]
             */
            handleHistory(rowInfo) {
                console.log(rowInfo, '11111')
                this.registrationNo = rowInfo.registrationNo
            },
            handleDelete(data) {
                if (data.length > 0) {
                    let wtdIds = data.map(function (v) {
                        return v.wtdId
                    }).join(',')
                    ajaxRequest('post', 'back/entrustWtd/list/' + wtdIds, {_method: 'delete'}, function (res) {
                        if (res.code === 200) {
                            this.$message.success('删除成功')
                            this.getTableList()
                        } else {
                            this.$message.error('删除失败')
                        }
                    }.bind(this))
                } else {
                    this.$message({
                        message: '请先选择要删除的数据',
                        type: 'warning'
                    })
                }
            },
            dealDate: function (row, column, cellValue) {
                if (cellValue) {
                    return new Date(cellValue).format('YYYY-MM-DD')
                } else {
                    return '';
                }
            },
        },
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve,
            operatingLayer,
            companyPopover
        },
        mounted() {
            this.getTableList();
            this.QJGetMounted();
        }
    }
</script>

<style scoped>
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
        margin-left: -302px;
        word-break: break-all;
        margin-top: 18px;
        padding: 4px 5px;
        width: 320px;
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
</style>
