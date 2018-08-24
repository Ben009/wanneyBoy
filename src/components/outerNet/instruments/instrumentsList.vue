<template>
    <div style="position:relative;">
        <div v-if="defaultOpen">
            <Retrieve ref="retrieve-wapper"
                      :rowsCondition='rowsCondition'
                      :sortBy="sortBy"
                      :order="order"
                      :paramJson="paramJson"
                      :retrieveCondition="retrieveCondition"
                      :collectionInfo="collectionInfo"/>
        </div>

        <div>
            <div style="display: flex;justify-content: space-between; margin:10px 0px;">
                <div style="display: inline-block;text-align: center;margin:0 auto">
                    <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                    <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning">&nbsp;清空</el-button>
                    <el-button @click="handleBack" class="el-icon-back">返回</el-button>
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

                    <!--<div class="el-icon-info shuoming">-->
                    <!--<el-row class="el-sm">-->
                    <!--<p>1、<span style="color:red;">单位名称：</span>未审核；</p>-->
                    <!--<p>2、可在市场管理->送检统计->单位查询:根据有无业务员统计一段时间内单位产值。 </p>-->
                    <!--</el-row>-->
                    <!--</div>-->
            </span>
            </div>
            <div>
                <el-table :data="tableData"
                    border
                    style="width: 100%"
                    :max-height="QJTableMaxHeight"
                    @sort-change="handleSort"
                    @selection-change="handleSelectionChange">

                    <el-table-column fixed type="index" label="序号" width="50px" align="center"></el-table-column>

                    <el-table-column
                        prop="sbmc"
                        label="器具名称"
                        v-if="headObj.sbmc"

                    >
                    </el-table-column>

                    <el-table-column
                        prop="xhgg"
                        label="型号规格"
                        v-if="headObj.xhgg"

                    >
                    </el-table-column>

                    <el-table-column
                        prop="ccbh"
                        label="出厂编号"
                        v-if="headObj.ccbh"

                    >
                    </el-table-column>

                    <el-table-column
                        prop="grrq"
                        label="购入日期"
                        v-if="headObj.grrq"

                    >
                    </el-table-column>

                    <el-table-column
                        prop="cqdw"
                        label="产权单位"
                        v-if="headObj.cqdw"

                    >
                    </el-table-column>

                    <el-table-column
                        prop="fzlb"
                        label="管理类别"
                        v-if="headObj.fzlb"

                        :formatter="formatterFzlb"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="jdrq"
                        label="校检日期"
                        v-if="headObj.jdrq"

                    >
                    </el-table-column>

                    <el-table-column
                        prop="jdjl"
                        label="检定结论"
                        v-if="headObj.jdjl"

                    >
                    </el-table-column>

                    <el-table-column label="操作" width="60px">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-document" title="详情" style="color: #3094e0;"></i>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="margin-top:10px;text-align:center;float:right;">
                <!-- TODO 案例 分页控件 mind-pagination  -->
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
</template>

<script>
    import Vue from 'vue'
    import Vuex from 'vuex'
    import $ from 'jquery'

    import {ajaxRequest, formatArrayToTree} from '../../util/base'
    import Retrieve from '../../Retrieve'
    import WorkMould from '../../mould/WorkMould'
    import TableColumnHeader from '../../Table/TableColumnHeader'
    import paramJson from './instruments'    //同目录下json数据

/*     import {Table, TableColumn, Pagination} from "element--ui";
    Vue.use(Table);
    Vue.use(TableColumn); */


    export default {
        name: 'instruments-List',
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: '',
                orderProperty: 'a.yxq',
                orderType: 'asc',
                tableData: [],
                multipleSelection: [],
                fuzzySearch: 0,
                isPut: true,

                isSetting: 0,  //控制个性化设置弹窗是否展示
                edit: null,   //控制编辑弹窗是否展示
                isInner: 0,

                /*高级检索相关项*/
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
                collectionInfo: []

            }
        },
        methods: {

            formatterFzlb:function (row, column) {
                if(row.fzlb == '0'){
                    return "强检";
                }else if(row.fzlb == '1'){
                    return "非强检"
                }else{
                    return row.fzlb
                }
            },

            handleSort: function (column, prop, order) {
                this.orderProperty = column['prop']
                if (column['order'] == 'descending') {
                    this.orderType = 'desc'
                } else {
                    this.orderType = 'asc'
                }
                this.getTableList()
            },

            getTableList() {
                var _this = this;
                ajaxRequest('get', 'back/instruments/findInstrumentsList', {
                    fuzzySearch: 1,
                    page: _this.page,
                    rows: _this.rows,
                    orderProperty: _this.orderProperty,
                    orderType: _this.orderType,
                    total: 0,
                    sc: _this.sc,
                    dwId:_this.$route.query.dwId
                }, (res) => {
                    if (res.code === 200) {
                        _this.tableData = res.rows
                        _this.total = res.total
                        _this.multipleSelection = []
                    }
                })
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
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

            handleEdit(rowInfo) {
                this.$route.query.id = rowInfo.id
                this.$router.push({
                    path:'/admin/358',
                    query:this.$route.query
                })
            },

            handleBack:function () {
                this.$router.push({
                    path:'/admin/356',
                    query:{}
                })
            }
        },
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve
        },
        mounted() {
            let userId = localStorage.getItem("userId");
            this.userId = userId;
            this.getTableList();
            this.QJGetMounted();
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
</style>
