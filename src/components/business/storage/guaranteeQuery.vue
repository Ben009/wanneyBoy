<template>
    <div>
        <div v-if="defaultOpen">
            <Retrieve ref="retrieve-wapper"
                      :rowsCondition='rowsCondition'
                      :sortBy="sortBy"
                      :order="order"
                      :paramJson="paramJson"
                      :retrieveCondition="retrieveCondition"
                      :collectionInfo="collectionInfo"/>
        </div>
        <div style="display: flex;justify-content: space-between; margin:10px 0px;">
            <span></span>
            <div style="display: inline-block;text-align: center">
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
          </span>
        </div>
        <div>
            <el-table :max-height="QJTableMaxHeight" ref="table" :data="tableData" border style="width: 100%"
                      @sort-change="handleSort" :fit="true" v-loading="loading">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="registrationNo" label="登记号"></el-table-column>
                <el-table-column prop="lzdh" label="流转单号" v-if="headObj.lzdh"></el-table-column>
                <el-table-column prop="wtdh" label="委托单号" v-if="headObj.wtdh"></el-table-column>
                <el-table-column prop="companyName" label="委托单位" width="200"></el-table-column>
                <el-table-column prop="applianceName" label="器具名称" width="200"></el-table-column>
                <el-table-column prop="fyhj" label="费用合计"></el-table-column>
                <el-table-column prop="sfjz" label="费用状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sfjz ==1">已结账</span>
                        <span v-if="scope.row.sfjz ==0&&scope.row.isSettlement ==1" style="color:red">已结算</span>
                        <span v-if="scope.row.isSettlement ==0&&scope.row.feeStatus ==1" style="color:red">已录费</span>
                        <span v-if="scope.row.feeStatus ==0" style="color:red">未录费</span>
                    </template>
                </el-table-column>
                <el-table-column label="样品/证书库房状态" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.registrationNo.toString().substring(0,1)=='9'&&scope.row.applianceWarehouseFlag==0"
                              style="color:red">无样品</span>
                        <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea=='0'">未入库</span>
                        <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea!='0'">外送</span>
                        <span v-if="scope.row.applianceWarehouseFlag==3">已入库</span>
                        <span v-if="scope.row.applianceWarehouseFlag==4">已出库</span>
                        /
                        <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateCount<scope.row.certificateNumber"
                              style="color:red">证书未出</span>
                        <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.approveCertificateCount<scope.row.certificateNumber&&scope.row.certificateCount==scope.row.certificateNumber"
                              style="color:red">证书未批准</span>
                        <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateNumber==0&&scope.row.subcontactArea=='0'"
                              style="color:red">无需出证</span>
                        <span v-if="scope.row.certificateWarehouseFlag==0&&scope.row.certificateNumber==0&&scope.row.subcontactArea!='0'"
                              style="color:red">外送</span>
                        <span v-if="scope.row.certificateWarehouseFlag==3">已入库</span>
                        <span v-if="scope.row.certificateWarehouseFlag==4">已出库</span>
                    </template>
                </el-table-column>
                <el-table-column prop="flag" label="担保状态"
                                 :formatter="function(row, column, cellValue, index){return cellValue==0?'撤销':cellValue==1?'正常':''}">
                </el-table-column>
                <el-table-column prop="guaranteeType" label="担保类型"
                                 :formatter="function(row, column, cellValue, index){return cellValue==1?'货证齐担':cellValue==2?'仅担保货':cellValue==3?'仅担保证':''}">
                </el-table-column>
                <el-table-column prop="guaranteePersonName" label="担保人"></el-table-column>
                <el-table-column prop="guaranteeTime" label="担保期限" :formatter="dealDate"></el-table-column>
                <el-table-column prop="creatorName" label="操作人"></el-table-column>
                <el-table-column prop="addTime" label="操作时间"></el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                        <!-- 可撤销的情况：1.状态是正常（1） 2.没有撤销权限，只能撤销自己的担保信息，有撤销权限的可以撤销所有人的 3.满足样品已担保（=1或2）且样品未出库（!=4）  或者  证书已担保（=1或3）且证书未出库（!=4） -->
                        <el-button
                                v-if="scope.row.flag=='1'&&(scope.row.guaranteePerson==loginPerson||power=='1')&&(((scope.row.guaranteeType=='1'||scope.row.guaranteeType=='2')&&scope.row.applianceWarehouseFlag!=4)||((scope.row.guaranteeType=='1'||scope.row.guaranteeType=='3')&&scope.row.certificateWarehouseFlag!=4))"
                                v-mindPopover="{message:'确定要撤销?',success:handleRevert.bind(this,[scope.row])}"
                                type="button" class="el-button el-button--primary">
                            撤销
                        </el-button>
                        <!-- 不可撤销的情况：1.状态是撤销（0） 2.没有撤销权限，只能撤销自己的担保信息 3.样品和证书都已出库(4)的 4.没有担保信息 -->
                        <el-button v-else class="el-button el-button--primary" type="button" disabled>
                            撤销
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top:10px;text-align:center;float:right;">
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
    //引入ajax工具
    import {ajaxRequest} from '../../util/base';
    //引入高级检索
    import Retrieve from '../../Retrieve';
    //引入个性化设置模版
    import WorkMould from '../../mould/WorkMould';
    //引入自定义表头
    import TableColumnHeader from '../../Table/TableColumnHeader';
    //引入对应的json文件 当前目录下guaranteeQueryParam.js文件
    import paramJson from './guaranteeQueryParam';
    //引入jquery
    import ElCol from "@/common-el/packages/col/src/col";
    import ElRow from "@/common-el/packages/row/src/row";

    export default {
        components: {
            ElRow,
            ElCol,
            WorkMould,
            TableColumnHeader,
            Retrieve,
        },
        name: "guaranteeQuery",
        data() {
            return {
                page: 1,//页码
                rows: 10,//每页记录数
                fuzzySearch: 0,//是否模糊查询，默认关闭模糊查询
                total: 0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
                orderProperty: 'id',//排序字段
                orderType: 'desc',//排序方式
                tableData: [],//表格中的数据
                power: "",//撤销权限，0无权限 1有权限
                loginPerson: localStorage.getItem('userId'),//登录id

                isSetting: 0,  //控制个性化设置弹窗是否展示
                edit: null,   //控制新增弹窗是否展示
                modify: null,   //控制修改弹窗是否展示
                isInner: 0,

                /*高级检索相关项*/
                rowsCondition: paramJson,   //默认同目录下json数据 会依据模板改变
                paramJson: paramJson,      //同目录下json数据 常量
                moduleList: [],           //模板列表
                templateValue: '',       //当前选择的模板id
                sortBy: '',              //排序字段
                order: '',              //desc降序 asc升序
                headObj: {},           //表头显示对象 {category:true}
                defaultOpen: true,
                userId: "",
                allModules: {}, //所有模板
                resultCondition: [],
                retrieveCondition: [],
                collectionInfo: [],
                loading: false
            }
        },
        methods: {
            getTableList() {
                this.loading = true;
                /*获取table数据，维护data数据*/
                ajaxRequest('get', 'back/guarantee/retrieve', {
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
                        this.power = res.daoResult;
                    }
                    this.loading = false;
                })
            },
            handleRevert: function (data) {
                let _this = this
                /*删除表格数据*/
                if (data.length > 0) {
                    let ids = data.map(function (v) {
                        return v.id
                    }).join(",");
                    let djh = data.map(function (v) {
                        return v.registrationNo
                    }).join(",");
                    ajaxRequest('POST', 'back/guarantee/backGuarantee', {
                        id: ids,
                        djh: djh,
                    }, function (res) {
                        if (res.code === 200) {
                            _this.$message.success('撤销成功');
                            _this.getTableList()
                        }
                        else {
                            _this.$message.error('撤销失败');
                        }
                    })
                } else {
                    _this.$message({
                        message: '请先选择要撤销的数据',
                        type: 'warning'
                    })
                }
            },
            dealDate: function (row, column, cellValue) {
                if (cellValue === "" || cellValue === null || cellValue === undefined) {
                    return "";
                } else {
                    return new Date(cellValue).format('YYYY-MM-DD ');
                }
            },
            handleSort: function (column, prop, order) {
                /*用ui组件提供的排序接口,维护实例data数据*/
                this.orderProperty = column['prop'];
                if (column['order'] == 'descending') {
                    this.orderType = 'desc';
                } else {
                    this.orderType = 'asc';
                }
                this.getTableList();
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
        },
        mounted() {

            //判断是否从首页跳转进来,并设置默认查询条件
            let objFromIndex = this.$route.query;
            if (objFromIndex) {
                this.collectionInfo = [{
                    name: '',
                    value: [{
                        comparison: "1",
                        nameCode: "isSettleAccount",
                        sqlSeg: "a.IS_SETTLE_ACCOUNT",
                        value: 0
                    }]
                }];
                setTimeout(res => {
                    this.QJAdvanceSearch();
                }, 0)
            } else {
                this.getTableList();
                this.QJGetMounted();
            }
        },
        created() {

        }
    }
</script>

<style scoped>
    .centerForm {
        border: 1px solid #ddd;
        margin: 10px 0;
        padding: 10px 10px;
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
