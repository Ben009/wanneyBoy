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
                <!--   <global-tootips>
                     <p>1、点击“出库单编号”可打印出库单。</p>
                   </global-tootips>-->
          </span>
        </div>
        <div>
            <el-table :max-height="QJTableMaxHeight" ref="table" :data="tableData" border style="width: 100%"
                      @sort-change="handleSort" :fit="true" @selection-change="handleSelectionChange"
                      v-loading="loading">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <!--<el-table-column-->
                <!--label="出库单编号"-->
                <!--prop="billNo">-->
                <!--<template slot-scope="scope">-->
                <!--<span @click="goPrint(scope.row)" style="color:deepskyblue;cursor:pointer;">{{scope.row.billNo}}</span>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="registrationNo" label="登记号"></el-table-column>
                <el-table-column prop="orderSingleNo" label="流转单号" v-if="headObj.orderSingleNo"></el-table-column>
                <el-table-column prop="orderNo" label="委托单号" v-if="headObj.orderNo"></el-table-column>
                <el-table-column prop="dwmc" label="委托单位"></el-table-column>
                <el-table-column prop="applianceName" label="器具名称"></el-table-column>
                <el-table-column prop="setNumber" label="套数">
                    <template slot-scope="scope">
                        <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pieceNumber" label="件数"></el-table-column>
                <el-table-column prop="warOutType" label="出库类型"
                                 :formatter="function(row, column, cellValue, index){return cellValue==1?'样品出库':cellValue==2?'证书出库':cellValue==3?'综合出库':''}">
                </el-table-column>
                <el-table-column prop="warOutStyle" label="出库方式"
                                 :formatter="function(row, column, cellValue, index){return cellValue==1?'快递':cellValue==2?'客户自取':cellValue==3?'样管员送样':''}">
                </el-table-column>
                <el-table-column prop="warOutPersonName" label="操作人"></el-table-column>
                <el-table-column label="操作" width="160">
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
        <outQueryForm v-if="openDetail" :callback="handleClose" :outData="outData"></outQueryForm>
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
    import outQueryForm from './outQueryForm';
    //引入对应的json文件 当前目录下outQueryParam.js文件
    import paramJson from './outQueryParam';
    //引入jquery
    import ElCol from "@/common-el/packages/col/src/col";
    import ElRow from "@/common-el/packages/row/src/row";

    export default {
        components: {
            outQueryForm,
            ElRow,
            ElCol,
            WorkMould,
            TableColumnHeader,
            Retrieve,
        },
        name: "outQuery",
        data() {
            return {
                page: 1,//页码
                rows: 10,//每页记录数
                fuzzySearch: 0,//是否模糊查询，默认关闭模糊查询
                total: 0,//总纪录数，如传到后台，则后台不再执行查询统计，如传-1则非严格统计（只计算是否有下一页）
                orderProperty: 'id',//排序字段
                orderType: 'desc',//排序方式
                tableData: [],//表格中的数据
                openDetail: false,//综合出库详情弹层
                outData: "",//当前行数据

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
                ajaxRequest('get', 'back/ruku/retrieveCkd', {
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
            handleDetail(rowInfo) {//打开出库详情弹层
                this.outData = rowInfo;
                this.openDetail = true;
            },
            handleClose() {//关闭出库详情弹层
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
        },
        mounted() {
            this.getTableList();
            this.QJGetMounted;
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
