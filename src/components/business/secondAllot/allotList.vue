<template>
    <div style="position:relative;" class="allotList">
        <div style="margin-bottom:10px;" v-if="defaultOpen">
            <Retrieve ref="retrieve-wapper"
                      :rowsCondition='rowsCondition'
                      :sortBy="sortBy"
                      :order="order"
                      :paramJson="paramJson"
                      :retrieveCondition="retrieveCondition"
                      :collectionInfo="collectionInfo"
            />
        </div>


        <div style="display: flex;justify-content: space-between;">
            <div style="width: 150px"></div>
            <div style="display: inline-block;text-align: center">
                <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning">清空</el-button>
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

            <div style="float: right;margin-top: 5px">
               <global-tootips>
                <p>1、有分配、查看所有部门权限，则可查看和分配所有检测部门的送检单；</p>
                <p>2、本节点用于将送检任务分配至具体的检测人员；</p>
                <p>3、该功能的使用可针对登记号具体至每个检测人员，同时原始记录或证书添加页面可开启“仅可操作分配至本人登记号”的功能；</p>
                <p>4、已完成登记号或证书数量为０的登记号不在此展现。</p>
              </global-tootips>
            </div>
          </span>
        </div>

        <div style="margin-top: 30px;">
            <span class="font-14">是否分配</span>
            <el-select v-model="form.status" class="width-80" @change="getTableListbyStatus">
                <el-option value="0" label="未分配"></el-option>
                <el-option value="1" label="已分配"></el-option>
            </el-select>

            <template v-if="form.status==0">
                <span class="font-14">部门</span>
                <el-select v-model="form.allotListDept" @change="changeDepartEvt" style="width: 200px">
                    <el-option
                            v-for="item in departs"
                            :key="item.id"
                            :label="item.departName"
                            :value="item.id">
                    </el-option>
                </el-select>
                <span class="font-14" style="margin-left: 10px">人员</span>
                <el-select placeholder="请选择" @change="changeUser" v-model="form.assignor">
                    <el-option
                            v-for="item in users"
                            :key="item.id"
                            :label="item.userName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </template>
            <el-button type="primary" v-if="form.status==0" @click="toAllot">任务分配</el-button>
            <el-button type="warning" v-if="form.status==1" @click="cancelAllot">撤销分配</el-button>
        </div>


        <el-table :data="tableData" :max-height="QJTableMaxHeight" v-loading="loading"
                  border
                  @selection-change="handleSelectionChange"
                  :cell-class-name="cellcb"
                  style="margin-top: 10px">
            <el-table-column type="selection" width="40"></el-table-column>

            <el-table-column
                    prop="registrationNo"
                    label="登记号"
                    key="registrationNo"
            >
            </el-table-column>

            <el-table-column
                    prop="orderNo"
                    label="委托单编号"
                    v-if="headObj.orderNo"
                    key="orderNo"
            >
            </el-table-column>


            <el-table-column
                    prop="companyName"
                    label="委托单位"
                    show-overflow-tooltip
                    v-if="headObj.companyName"
                    key="companyName"
            >
            </el-table-column>

            <el-table-column
                    prop="applianceName"
                    label="器具名称"
                    v-if="headObj.applianceName"
                    show-overflow-tooltip
                    key="applianceName"
            >
            </el-table-column>

            <el-table-column
                    prop="departName"
                    label="检测部门"
                    v-if="headObj.departName"
                    show-overflow-tooltip
                    key="departName"
            >
            </el-table-column>


            <el-table-column
                    prop="postName"
                    label="检测岗位"
                    v-if="headObj.postName"
                    show-overflow-tooltip
                    key="postName"
            >
            </el-table-column>

            <el-table-column
                    prop="orderSingleNo"
                    label="流转单号"
                    v-if="headObj.orderSingleNo"
                    key="orderSingleNo"
            >
            </el-table-column>

            <el-table-column
                    prop="certificateCompanyName"
                    label="证书单位"
                    v-if="headObj.certificateCompanyName"
                    show-overflow-tooltip
                    key="certificateCompanyName"
            >
            </el-table-column>

            <el-table-column
                    prop="setNumber"
                    label="套数"
                    v-if="headObj.setNumber"
                    key="setNumber"
            >
            </el-table-column>

            <el-table-column
                    prop="pieceNumber"
                    label="套/件"
                    v-if="headObj.pieceNumber"
                    key="pieceNumber"
            >
            </el-table-column>

            <el-table-column
                    prop="certificateNumber"
                    label="证书数量"
                    v-if="headObj.certificateNumber"
                    key="certificateNumber"
            >
            </el-table-column>

            <el-table-column
                    prop="isUrgent"
                    label="是否加急"
                    v-if="headObj.isUrgent"
                    key="isUrgent"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.isUrgent==0">否</span>
                    <span v-else-if="scope.row.isUrgent>0" style="color: red;">是</span>
                </template>
            </el-table-column>

            <el-table-column
                    prop="certificateType"
                    label="服务类型"
                    v-if="headObj.certificateType"
                    key="certificateType"
            >
            </el-table-column>

            <el-table-column
                    prop="serviceDate"
                    label="受理日期"
                    v-if="headObj.serviceDate"
                    :formatter="dealDate"
                    key="serviceDate"
            >
            </el-table-column>

            <el-table-column
                    prop="entrustDate"
                    label="委托日期"
                    v-if="headObj.entrustDate"
                    :formatter="dealDate"
                    key="entrustDate"
            >
            </el-table-column>

            <el-table-column
                    prop="detectionDeadline"
                    label="检测期限"
                    v-if="headObj.detectionDeadline"
                    :formatter="dealDate"
                    key="detectionDeadline"
            >
            </el-table-column>

            <el-table-column
                    prop="totalActual"
                    label="合计费用"
                    v-if="headObj.totalActual"
                    key="totalActual"
            >
            </el-table-column>

            <el-table-column
                    prop="detectionMethod"
                    label="检测方式"
                    v-if="headObj.detectionMethod"
                    :formatter="detectionMethodFormatter"
                    key="detectionMethod"
            >
            </el-table-column>


            <el-table-column
                    prop="taskSource"
                    label="任务来源"
                    v-if="headObj.taskSource"
                    key="taskSource"
            >
            </el-table-column>


            <el-table-column
                    prop="institutionalNature"
                    label="机构性质"
                    v-if="headObj.institutionalNature"
                    key="institutionalNature"
            >
            </el-table-column>

            <el-table-column
                    prop="creditCode"
                    label="统一社会信用代码"
                    v-if="headObj.creditCode"
                    key="creditCode"
            >
            </el-table-column>

            <el-table-column
                    prop="contractNo"
                    label="合同号"
                    v-if="headObj.contractNo"
                    key="contractNo"
            >
            </el-table-column>

            <el-table-column
                    prop="contractSignatory"
                    label="合同签署人"
                    v-if="headObj.contractSignatory"
                    key="contractSignatory"
            >
            </el-table-column>

            <el-table-column
                    prop="certificateFirstPrintTime"
                    label="证书打印日期"
                    :formatter="dealDate"
                    v-if="headObj.certificateFirstPrintTime"
                    key="certificateFirstPrintTime"
            >
            </el-table-column>

            <el-table-column
                    prop="address"
                    label="委托单位地址"
                    v-if="headObj.address"
                    key="address"
            >
            </el-table-column>

            <el-table-column
                    prop="administrativeArea"
                    label="行政区划"
                    v-if="headObj.administrativeArea"
                    key="administrativeArea"
            >
            </el-table-column>

            <el-table-column
                    prop="contacter"
                    label="联系人"
                    v-if="headObj.contacter"
                    key="contacter"
            >
            </el-table-column>

            <el-table-column
                    prop="telephone"
                    label="联系电话"
                    v-if="headObj.telephone"
                    key="telephone"
            >
            </el-table-column>

            <el-table-column
                    prop="mobilePhone"
                    label="手机号码"
                    v-if="headObj.mobilePhone"
                    key="mobilePhone"
            >
            </el-table-column>

            <el-table-column
                    prop="specialRequirement"
                    label="整单备注"
                    v-if="headObj.specialRequirement"
                    key="specialRequirement"
            >
            </el-table-column>

            <el-table-column
                    prop="model"
                    label="型号规格"
                    v-if="headObj.model"
                    key="model"
            >
            </el-table-column>

            <el-table-column
                    prop="detectionParameter"
                    label="检测参数"
                    v-if="headObj.detectionParameter"
                    key="detectionParameter"
            >
            </el-table-column>

            <el-table-column
                    prop="factoryNo"
                    label="出厂编号"
                    v-if="headObj.factoryNo"
                    key="factoryNo"
            >
            </el-table-column>

            <el-table-column
                    prop="equipmentNo"
                    label="设备编号"
                    v-if="headObj.equipmentNo"
                    key="equipmentNo"
            >
            </el-table-column>

            <el-table-column
                    prop="manufacturer"
                    label="制造厂商"
                    v-if="headObj.manufacturer"
                    key="manufacturer"
            >
            </el-table-column>

            <el-table-column
                    prop="accessory"
                    label="器具附件"
                    v-if="headObj.accessory"
                    key="accessory"
            >
            </el-table-column>

            <el-table-column
                    prop="powerTypes"
                    label="电源类型"
                    v-if="headObj.powerTypes"
                    key="powerTypes"
            >
            </el-table-column>

            <el-table-column
                    prop="isRepair"
                    label="是否调修"
                    v-if="headObj.isRepair"
                    :formatter="formatterYesOrNo"
                    key="isRepair"
            >
            </el-table-column>

            <el-table-column
                    prop="isDoubleNumber"
                    label="是否双编号"
                    v-if="headObj.isDoubleNumber"
                    :formatter="formatterYesOrNo"
                    key="isDoubleNumber"
            >
            </el-table-column>

            <el-table-column
                    prop="remark"
                    label="备注"
                    v-if="headObj.remark"
                    key="remark"
            >
            </el-table-column>

            <el-table-column
                    prop="isCompulsoryVerify"
                    label="是否强检"
                    v-if="headObj.isCompulsoryVerify"
                    :formatter="formatterYesOrNo"
                    key="isCompulsoryVerify"
            >
            </el-table-column>

            <el-table-column
                    prop="applianceUse"
                    label="器具用途"
                    v-if="headObj.applianceUse"
                    key="applianceUse"
            >
            </el-table-column>

            <!--<el-table-column-->
            <!--prop="executor"-->
            <!--label="人员"-->
            <!--v-if="(headObj.executor && form.status!=0)"-->
            <!--show-overflow-tooltip-->
            <!--&gt;-->
            <!--</el-table-column>-->
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

</template>

<script>
    import paramJson from './paramAllot'
    import Retrieve from '../../Retrieve'
    import WorkMould from '../../mould/WorkMould'
    import TableColumnHeader from '../../Table/TableColumnHeader'
    import Vue from 'vue'
    // 引入jquery
    import $ from 'jquery'
    import {ajaxRequest, ajaxSyncProxyRequest, ajaxSyncRequest} from "../../util/base";

    const defaults = {
        searchType: '0',
        status: '0',
    }

    export default {
        name: "allotList",
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve,
        },
        data() {
            return {
                form: $.extend({}, defaults, this.data || {}),
                rules: {},
                tableData: [],
                departs: [],
                users: [],
                page: 1,
                rows: 10,
                total: 0,
                multipleSelection: [],

                /*高级检索相关项*/
                isSetting: 0,
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
                collectionInfo: [],
                loading: false
            }
        },

        mounted() {
            let userId = localStorage.getItem("userId");
            this.userId = userId;
            this.getDepartList();
            this.getTableList();
            this.QJGetMounted();
        },
        methods: {
            getTableListbyStatus() {
                this.page = 1;
                this.getTableList();
            },
            //获取表格中的数据
            getTableList() {
                this.loading = true;
                ajaxSyncRequest("get", "back/secondAllot/retrieve", {
                    searchType: this.form.searchType,
                    searchVal: this.form.searchVal,
                    status: this.form.status,
                    departId: this.form.departId,
                    entrustDate: this.form.entrustDate != null ? new Date(this.form.entrustDate[0]).format('YYYY-MM-DD') : null,
                    entrustDateEnd: this.form.entrustDate != null ? new Date(this.form.entrustDate[1]).format('YYYY-MM-DD') : null,
                    page: this.page,
                    rows: this.rows,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    total: 0,
                    sc: this.sc
                }, res => {
                    if (res.code === 200) {
                        console.log(res.rows);
                        this.tableData = res.rows
                        this.total = res.total
                    }
                    this.loading = false;
                });
            },
            //获取部门数据
            getDepartList() {
                ajaxRequest("get", "back/secondAllot/getDeptByPower/", {}, res => {
                    this.departs = res.rows;
                    Vue.set(this.form, "allotListDept", parseInt(localStorage.getItem("departId")));
                    this.changeDepartEvt(parseInt(localStorage.getItem("departId")));
                });
            },
            //根据部门ID获取人员
            changeDepartEvt(deptId) {
                if (deptId) {
                    ajaxSyncRequest("get", "back/user/listUserByDeptId/" + deptId, {}, res => {
                            this.users = res.rows;
                            Vue.set(this.form, "assignor", "");
                        }
                    );
                }
            },
            //人员设置选中
            changeUser() {
                Vue.set(this.form, "assignor", v);
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
            // checkbox选中时候赋值
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            //检测方式格式化
            detectionMethodFormatter: function (row, column) {
                if (row.detectionMethod == 1) {
                    return '送检'
                } else if (row.detectionMethod == 0) {
                    return '上门'
                }
            },
            //0 否  1 是  格式化
            formatterYesOrNo: function (row, column, cellValue) {
                if (cellValue == 1) {
                    return '是'
                } else if (cellValue == 0) {
                    return '否'
                } else {
                    return '';
                }
            },

            //时间格式化
            dealDate: function (row, column, cellValue) {
                if (cellValue) {
                    return new Date(cellValue).format('YYYY-MM-DD')
                } else {
                    return '';
                }
            },

            //任务分配
            toAllot() {
                let multipleSelection = this.multipleSelection// 选中的登记号
                if (multipleSelection.length == 0) {
                    this.$message.error('请选择需要分配的送检单');
                    return
                }
                if (!this.form.assignor) {
                    this.$message.error('请选择需要分配的人员');
                    return
                }
                let registrationNo = "";
                this.multipleSelection.forEach((res) => {
                    registrationNo = res.registrationNo + "," + registrationNo;
                })
                if (registrationNo != "") {
                    registrationNo = registrationNo.substr(0, registrationNo.length - 1);
                }

                ajaxSyncRequest("post", "back/secondAllot/toAllot/", {
                    registrationNos: registrationNo,
                    userId: this.form.assignor
                }, res => {
                    if (res.code === 200) {
                        this.$message.success('分配成功');
                        this.getTableList();
                    } else if (res.code === 300) {
                        this.$message.success('分配失败');
                    } else {
                        this.$message.success('系统错误');
                    }
                });
            },
            //取消分配
            cancelAllot() {
                let multipleSelection = this.multipleSelection// 选中的登记号
                if (multipleSelection.length == 0) {
                    this.$message.error('请选择需要撤销的送检单');
                    return
                }
                let registrationNo = "";
                this.multipleSelection.forEach((res) => {
                    registrationNo = res.registrationNo + "," + registrationNo;
                })
                if (registrationNo != "") {
                    registrationNo = registrationNo.substr(0, registrationNo.length - 1);
                }

                ajaxSyncRequest("post", "back/secondAllot/cancelAllot/", {registrationNos: registrationNo}, res => {
                    if (res.code === 200) {
                        this.$message.success('撤销成功');
                        this.getTableList();
                    } else if (res.code === 300) {
                        this.$message.success('撤销失败');
                    } else {
                        this.$message.success('系统错误');
                    }
                });

            },
            cellcb(row) {
                if (row.row.registrationNo == '合计') {
                    console.log('checkboxRow', row.row.registrationNo);
                    return "myCell"
                }
            }

        }
    }
</script>

<style type="text/css" lang="scss">

    .allotList {

    .myCell .el-checkbox__input {
        display: none
    }

    .el-table .myCell {
        background-color: #eaeaea !important;
    }

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
