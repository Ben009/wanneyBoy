<template>
    <div style="position:relative;">
        <div>
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
                <div style="display: flex;justify-content: space-between;text-align: center">
                  <span></span>
                    <div style="display: inline-block;text-align: center">
                        <el-button type="primary" round @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                        <el-button type="warning" round @click="QJEmptyCondition" class="el-icon-info">&nbsp;清空
                        </el-button>
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
                <div style="margin-top:10px;">
                    <el-table :data="tableData" :max-height="QJTableMaxHeight"
                              :key="tableKey"
                              border
                              ref="cnasTable"
                              style="width: 100%"
                              :height="setHeightForRet"
                              @sort-change="handleSort"
                              @selection-change="handleSelectionChange"
                              v-loading="loading">

                        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                        <el-table-column v-if="headObj.name" prop="name" label="项目名称"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.nameE" prop="nameE" label="项目名称(英)"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.type" prop="type" label="项目类别" :render-header="QJrenderHeader"
                                         :formatter="dealTypeName"></el-table-column>
                        <el-table-column v-if="headObj.department" prop="department" label="所属部门"
                                         :render-header="QJrenderHeader" :formatter="dealDepart"></el-table-column>
                        <el-table-column v-if="headObj.launchDate" prop="launchDate" label="开展日期"
                                         :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
                        <el-table-column v-if="headObj.effectiveDate" prop="effectiveDate" label="有效日期"
                                         :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
                        <el-table-column v-if="headObj.calibrationTimes" prop="calibrationTimes" label="已校准次数"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.addTime" prop="addTime" label="添加时间"
                                         :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
                        <el-table-column v-if="headObj.updateTime" prop="updateTime" label="更新时间"
                                         :render-header="QJrenderHeader" :formatter="dealDate"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                                    <i class="el-icon-edit-outline" title="编辑"></i></el-button>
                                <el-button  v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,scope.row)}" type="text"  style="padding:0;font-size:18px;"><i class="el-icon-delete" title="删除"></i>
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
    </div>

</template>

<script>
    import Vue from 'vue'
    import Vuex from 'vuex'
    import $ from 'jquery'
    import {ajaxRequest, formatDate} from '../../util/base'
    import Retrieve from '../../Retrieve'
    import WorkMould from '../../mould/WorkMould'
    import TableColumnHeader from '../../Table/TableColumnHeader'
    import paramJson from './cnasParam' // 同目录下json数据


    /* import { Table, TableColumn,} from 'element--ui'
    Vue.use(Table)
    Vue.use(TableColumn) */

    export default {
        name: 'cnas-list',
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve
        },
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: '',
                orderProperty: 't.id',
                orderType: 'desc',
                tableData: [],
                multipleSelection: [],
                fuzzySearch: 0,
                isSetting: 0, // 控制个性化设置弹窗是否展示

                /* 高级检索相关项 */
                rowsCondition: paramJson, // 默认同目录下json数据 会依据模板改变
                paramJson: paramJson, // 同目录下json数据 常量
                moduleList: [], // 模板列表
                templateValue: '', // 当前选择的模板id
                sortBy: '', // 排序字段
                order: '', // desc降序 asc升序
                headObj: {}, // 表头显示对象 {category:true}
                defaultOpen: true, // 默认开启高级查询

                userId: '',
                allModules: {}, // 所有模板
                resultCondition: [],
                retrieveCondition: [],
                collectionInfo: [],
                setHeightForRet: null,
                tableKey: 0,
                loading:false
            }
        },
        methods: {
            handleSort: function (column, prop, order) {
                this.orderProperty = '"' + column['prop'] + '"'
                if (column['order'] == 'descending') {
                    this.orderType = 'desc'
                } else {
                    this.orderType = 'asc'
                }
                this.getTableList()
            },
            getTableList() {
              this.loading=true;
                ajaxRequest(
                    'get',
                    'back/cnas/retrieve',
                    {
                        fuzzySearch: 1,
                        page: this.page,
                        rows: this.rows,
                        orderProperty: this.orderProperty,
                        // 进行升序降序排列的标志
                        orderType: this.orderType,
                        total: 0,
                        sc: this.sc
                    },
                    res => {
                        if (res.code === 200) {
                            this.tableData = res.rows
                            this.total = res.total
                            this.multipleSelection = []
                            setTimeout(() => {
                                let height = $(this.$refs['cnasTable'].$el).find('.el-table__body-wrapper tbody').height()
                                if (height < window.innerHeight - 200) {
                                    this.setHeightForRet = null
                                } else {
                                    this.setHeightForRet = window.innerHeight - 200
                                }
                                this.tableKey = !this.tableKey
                                console.log(this.setHeightForRet)
                            }, 0)
                        }
                      this.loading=false;
                    }
                )
            },
            dealDate: function (row, column, cellValue) {
                // console.log(cellValue+"==="+formatDate(cellValue,'YYYY-MM-DD'))
                return formatDate(cellValue, 'YYYY-MM-DD')
            },
            dealTypeName: function (row, column, cellValue) {
                // console.log(cellValue+"==="+formatDate(cellValue,'YYYY-MM-DD'))
                return row.typeName
            },
            dealDepart: function (row, column, cellValue) {
                // console.log(cellValue+"==="+formatDate(cellValue,'YYYY-MM-DD'))
                return row.departName
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
                this.$router.push({
                    path: '/admin/479',
                    query: rowInfo
                })
            },
            handleDelete(data) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ajaxRequest('PUT', 'back/cnas/list/' + data.id, {isDelete: 1}, (res) => {
                        if (res.code == 200) {
                            this.$message.success('删除成功')
                            this.getTableList()
                        } else {
                            this.$message.error('删除失败')
                        }
                    })
                })
            }
        },
        mounted() {
            //判断是否从首页跳转进来,并设置默认查询条件
            let objFromIndex = this.$route.query;
            if (objFromIndex && objFromIndex.title) {
                let now = new Date();
                now.setMonth(now.getMonth() + 6);
                this.collectionInfo = [{
                    name: '',
                    value: [{
                        comparison: "3",
                        nameCode: "effectiveDate",
                        sqlSeg: "TRUNC(T.EFFECTIVE_DATE)",
                        value: now.format("YYYY-MM-DD")
                    }]
                }];
                setTimeout(res => {
                    this.QJAdvanceSearch();
                }, 0)
            } else {
                let userId = localStorage.getItem('userId');
                this.userId = userId;
                this.getTableList();
                this.QJGetMounted();
            }
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
