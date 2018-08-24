<template>
    <div style="position:relative;">
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
                <div style="display: inline-block;text-align: center;margin:0 auto">
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

                    <!--<div class="el-icon-info shuoming">-->
                    <!--<el-row class="el-sm">-->
                    <!--<p>1、<span style="color:red;">单位名称：</span>未审核；</p>-->
                    <!--<p> 2、可在市场管理->送检统计->单位查询:根据有无业务员统计一段时间内单位产值。 </p>-->
                    <!--</el-row>-->
                    <!--</div>-->

                </span>
            </div>
            <div>
                <el-table :max-height="QJTableMaxHeight" :key="tableKey"
                    ref="customer-list"
                    :data="tableData"
                    border
                    style="width: 100%"
                    :height="setHeightForRet"
                    @sort-change="handleSort"
                    @selection-change="handleSelectionChange"
                    v-loading="loading">

                    <el-table-column fixed type="index" label="序号" width="50px"></el-table-column>

                    <el-table-column
                        prop="dwMc"
                        label="单位名称"
                        v-if="headObj.dwMc"

                    >
                    </el-table-column>

                    <el-table-column
                        prop="zzjgdm"
                        label="统一社会信用代码"
                        v-if="headObj.zzjgdm"

                    >
                    </el-table-column>

                    <el-table-column
                        prop="mobile"
                        label="手机号"
                        v-if="headObj.mobile"

                    >
                    </el-table-column>

                    <el-table-column
                        prop="source"
                        label="注册来源"
                        v-if="headObj.source"

                        :formatter="formatterSource"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="lxr"
                        label="联系人"
                        v-if="headObj.lxr"

                    >
                    </el-table-column>

                    <el-table-column
                        prop="dh"
                        label="联系电话"
                        v-if="headObj.dh"

                    >
                    </el-table-column>

                    <el-table-column
                        prop="shflag"
                        label="审核状态"
                        v-if="headObj.shflag"

                        :formatter="formatterShflag"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="lastlogindate"
                        label="最后登录时间"
                        v-if="headObj.lastlogindate"

                    >
                    </el-table-column>
                    <el-table-column
                        prop="logintimes"
                        label="登录次数"
                        v-if="headObj.logintimes"

                    >
                    </el-table-column>

                    <el-table-column label="操作" width="120px">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-edit-outline" title="编辑"></i>
                            </el-button>

                            <el-button @click="sjdwEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-document" title="基本信息" style="color: #3094e0;"></i>
                            </el-button>

                            <el-button v-mindPopover="{message:'确定要删除该记录?',success:handleDelete.bind(this,(scope.row))}"
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
</template>

<script>
    import Vue from 'vue'
    import Vuex from 'vuex'
    import $ from 'jquery'
    import {ajaxRequest, formatArrayToTree} from '../../util/base'
    import Retrieve from '../../Retrieve'
    import WorkMould from '../../mould/WorkMould'
    import TableColumnHeader from '../../Table/TableColumnHeader'
    import paramJson from './customer'  //同目录下json数据

    export default {
        name: 'customer-list',
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: '',
                orderProperty: 'a.logintimes',
                orderType: 'desc',
                tableData: [],
                multipleSelection: [],
                fuzzySearch: 0,

                isSetting: 0,  //控制个性化设置弹窗是否展示
                edit: null,   //控制编辑弹窗是否展示
                companyItem: null,   //控制编辑弹窗是否展示
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
                setHeightForRet: null,
                tableKey: 0,
              loading:false
            }
        },
        methods: {

            formatterShflag: function (row, column) {
                if (row.shflag == '2') {
                    return "未通过";
                } else if (row.shflag == '1') {
                    return "已通过"
                } else {
                    return "未审核"
                }
            },

            formatterSource: function (row, column) {
                if (row.origin == '1') {
                    return "微信公众号";
                } else {
                    if (row.source == '1') {
                        return "强检平台";
                    } else {
                        return "公共服务平台";
                    }
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
              this.loading=true
                ajaxRequest('get', 'back/customer/retrieve', {
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
                        this.multipleSelection = [];
                    }
                  this.loading=false
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
                    path:'/admin/545',
                    query:this.$route.query
                })
            },

            handleDelete(data) {
                if (data.length > 0) {
                    let ids = data.map(function (v) {
                        return v.id
                    }).join(',')
                    ajaxRequest('post', 'back/customer/list/' + ids, {_method: 'delete'}, function (res) {
                        if (res.code === 200) {
                            this.$message.success('删除成功')
                            this.getTableList()
                        }
                        else {
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

            sjdwEdit: function (rowInfo) {
                this.$route.query.id = rowInfo.dwId;
                this.$route.query.userId = rowInfo.id;
                this.$router.push({
                    path:'/admin/546',
                    query:this.$route.query
                })
            },


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

    .el-button>i{
        color: #3094e0
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
