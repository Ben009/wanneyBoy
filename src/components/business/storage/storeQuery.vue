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
                <div style="float: right">
                <global-tootips style="text-align: left;margin: 5px;">
                    <p>操作人:样品操作人/证书操作人</p>
                    <p>操作时间:样品操作时间/证书操作时间</p>
                </global-tootips>
            </div>
          </span>
        </div>
        <div>
            <el-table :max-height="QJTableMaxHeight" ref="table" :data="tableData" border style="width: 100%"
                      :fit="true" @sort-change="handleSort" show-summary :summary-method="getSummaries"
                      @selection-change="handleSelectionChange" v-loading="loading">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="registrationNo" label="登记号"></el-table-column>
                <el-table-column prop="orderSingleNo" label="流转单号" v-if="headObj.orderSingleNo"></el-table-column>
                <el-table-column prop="orderNo" label="委托单号" v-if="headObj.orderNo"></el-table-column>
                <el-table-column prop="dwmc" label="委托单位"></el-table-column>
                <el-table-column prop="applianceName" label="器具名称"></el-table-column>
                <el-table-column prop="feeStatus" label="费用状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sfjz ==1">已结账</span>
                        <span v-if="scope.row.sfjz ==0&&scope.row.isSettlment ==1" style="color:red">已结算</span>
                        <span v-if="scope.row.isSettlment ==0&&scope.row.feeStatus ==1" style="color:red">已录费</span>
                        <span v-if="scope.row.feeStatus ==0" style="color:red">未录费</span>
                    </template>
                </el-table-column>
                <el-table-column prop="setNumber" label="套数/退">
                    <template slot-scope="scope">
                        {{scope.row.setNumber}}/<span style="color:red;">{{scope.row.returnNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pieceNumber" label="套/件"></el-table-column>
                <el-table-column label="样品入库状态/货架号">
                    <template slot-scope="scope">
                        <span v-if="scope.row.registrationNo.toString().substring(0,1)=='9'&&scope.row.applianceWarehouseFlag==0"
                              style="color:red">无样品</span>
                        <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea=='0'">未入库</span>
                        <span v-if="scope.row.registrationNo.toString().substring(0,1)=='8'&&scope.row.applianceWarehouseFlag==0&&scope.row.subcontactArea!='0'">外送</span>
                        <span v-if="scope.row.applianceWarehouseFlag==3">已入库</span>
                        <span v-if="scope.row.applianceWarehouseFlag==4">已出库</span>
                        <span v-if="scope.row.registrationNo.toString().substring(0, 1)=='8'&&(scope.row.applianceWarehouseFlag==3||scope.row.applianceWarehouseFlag==4)">/{{scope.row.sampleWarehouseNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="证书入库状态/货架号">
                    <template slot-scope="scope">
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
                        <span v-if="scope.row.certificateWarehouseFlag==3||scope.row.certificateWarehouseFlag==4">/{{scope.row.certificateWarehouseNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="样品入库操作人/时间">
                    <template slot-scope="scope">
                        {{scope.row.sampleWarehouseInPersonName}}/
                        {{scope.row.sampleWarehouseInDate?new
                        Date(scope.row.sampleWarehouseInDate).format('YYYY-MM-DD'):""}}
                    </template>
                </el-table-column>
                <el-table-column label="证书入库操作人/时间">
                    <template slot-scope="scope">
                        {{scope.row.certificateWarehouseInPerName}}/
                        {{scope.row.certificateWarehouseInDate?new
                        Date(scope.row.certificateWarehouseInDate).format('YYYY-MM-DD'):""}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button @click="handleDetail(scope.row)" type="text" style="padding:0;font-size:18px;">
                            <i class="el-icon-edit-outline" title="详情"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top:10px;text-align:center;float:right;">
            <mind-pagination :current-page="page" :page-size="rows" :total="total" @size-change="handlePageSizeChange"
                             @current-change="handleCurrentPageChange">
            </mind-pagination>
        </div>
        <storeQueryForm v-if="openDetail" :callback="handleClose" :storeData="storeData"
                        :refresh="refresh"></storeQueryForm>
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
    //引入库房信息弹层
    import storeQueryForm from './storeQueryForm';
    //引入对应的json文件 当前目录下storeQueryParam.js文件
    import paramJson from './storeQueryParam';
    //引入jquery
    import ElCol from "@/common-el/packages/col/src/col";
    import ElRow from "@/common-el/packages/row/src/row";


    export default {
        components: {
            storeQueryForm,
            ElRow,
            ElCol,
            WorkMould,
            TableColumnHeader,
            Retrieve,
        },
        name: "storeQuery",
        data() {
            return {
                page: 1,//页码
                rows: 10,//每页记录数
                fuzzySearch: 0,//是否模糊查询，默认关闭模糊查询
                total: 0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
                orderProperty: 'id',//排序字段
                orderType: 'desc',//排序方式
                tableData: [],//表格中的数据
                openDetail: false,//库房信息弹层
                storeData: "",//当前行数据

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
            refresh() {
                let _self = this;
                _self.openDetail = false;
                _self.getTableList();
            },
            getTableList() {
                this.loading = true;
                /*获取table数据，维护data数据*/
                ajaxRequest('get', 'back/ruku/retrieveKf', {
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
                    }
                    this.loading = false;
                })
            },
            handleDetail(rowInfo) {//打开库房信息弹层
                this.openDetail = true;
                this.storeData = rowInfo;
            },
            handleClose() {//关闭库房信息弹层
                this.openDetail = false;
            },
            dealDate: function (row, column, cellValue) {
                if (cellValue === "" || cellValue === null || cellValue === undefined) {
                    return "";
                } else {
                    return new Date(cellValue).format('YYYY-MM-DD');
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
            //合计行
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 1) {
                        sums[index] = '合计';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value)) && index != 0 && index != 2 && index != 3 && index != 4 && index != 5 && index != 6 && index != 9 && index != 10 && index != 11) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                    } else {
                        sums[index] = '';
                    }
                });
                return sums;
            },
        },
        mounted() {
            //判断是否从首页跳转进来,并设置默认查询条件
            let objFromIndex = this.$route.query;
            if (objFromIndex) {
                if (objFromIndex.title === '样品入库提醒') {
                    this.collectionInfo = [{
                        name: '',
                        value: [{
                            comparison: "1",
                            nameCode: "applianceWarehouseFlag",
                            sqlSeg: "a.APPLIANCE_WAREHOUSE_FLAG",
                            value: 0
                        }]
                    }];
                } else if (objFromIndex.title === '证书入库提醒') {
                    this.collectionInfo = [{
                        name: '',
                        value: [{
                            comparison: "1",
                            nameCode: "certificateWarehouseFlag",
                            sqlSeg: "a.CERTIFICATE_WAREHOUSE_FLAG",
                            value: 0
                        }]
                    }];
                }

                setTimeout(res => {
                    this.QJAdvanceSearch();
                }, 0)
            } else {
                this.getTableList();
                this.QJGetMounted;
            }
        },
        created() {

        }
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
