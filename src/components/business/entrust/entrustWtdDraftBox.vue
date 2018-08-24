<template>
    <mind-dialog
            :title="'草稿箱'"
            :visible="true"
            width="80%"
            center
            v-dialogDrag
            @close="handleCancel">
        <div style="position:relative;">
            <div style="margin-bottom:10px;">
                <Retrieve ref="retrieve-wapper"
                          :rowsCondition='rowsCondition'
                          :sortBy="sortBy"
                          :order="order"
                          :needSort=false
                          :paramJson="paramJson"
                          :retrieveCondition="retrieveCondition"
                          :collectionInfo="collectionInfo"/>
            </div>

            <div>
                <div style="display: flex;justify-content: space-between;">
                    <div style="display: inline-block;text-align: center;margin:auto">
                        <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                        <el-button type="warning" @click="handleCancel" class="el-icon-warning">&nbsp;关闭</el-button>

                    </div>

                </div>
                <div style="margin-top:10px;">
                    <el-table :max-height="QJTableMaxHeight"
                              :data="tableData"
                              border
                              style="width: 100%"
                              @sort-change="handleSort"
                              @selection-change="handleSelectionChange">
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="companyName" label="委托单位"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column prop="detectionMethodName" label="检测方式"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column prop="addPersonName" label="添加人"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column prop="addTimeChar" label="添加时间"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column label="操作" fixed="right" width="80px">
                            <template slot-scope="scope">
                                <el-button @click="chooseDraftBox(scope.row)" type="text"
                                           style="padding:0;font-size:18px;">
                                    <i class="el-icon-success" title="选择"></i>
                                </el-button>
                                <el-button v-mindPopover="{message:'确认删除?',success:handleDelete.bind(this,scope.row)}"
                                           type="text" style="padding:0;font-size:18px;">
                                    <i class="el-icon-delete" title="删除"></i>
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

    </mind-dialog>
</template>

<script>
    import Vue from "vue";
    import Vuex from "vuex";
    import $ from "jquery";
    import {ajaxRequest, formatArrayToTree} from "../../util/base";
    import Retrieve from "../../Retrieve";
    import TableColumnHeader from "../../Table/TableColumnHeader";

    /* import { Table, TableColumn,} from "element--ui";
    Vue.use(Table);
    Vue.use(TableColumn); */
    let detectionMethodOption = [{remark: '送检', code: 1}, {remark: '现场', code: 0}]
    var paramJson = [
        {
            sqlSeg: 'wtd.company_name',
            name: '委托单位',
            nameCode: 'companyName',
            component: 'input',
            comparison: '0,1,2,3,4,5,6,7,8,9',
            isQueryCondition: 1,
            isQueryResult: 1,
            isQueryConditionDefault: 1,
            isTableDefault: 1
        },
        {
            sqlSeg: 'wtd.detection_method',
            name: '检测方式',
            nameCode: 'detectionMethod',
            component: 'select',
            comparison: '1,4',
            options: detectionMethodOption,
            isQueryCondition: 1,
            isQueryResult: 1,
            isQueryConditionDefault: 1,
            isTableDefault: 1
        },
        {
            sqlSeg: 'usr.user_name',
            name: '添加人',
            nameCode: 'addPersonName',
            component: 'input',
            comparison: '0,1,2,3,4,5,6,7,8,9',
            isQueryCondition: 1,
            isQueryResult: 1,
            isQueryConditionDefault: 1,
            isTableDefault: 1
        },
        {
            sqlSeg: 'trunc(wtd.add_time)',
            name: '受理日期',
            nameCode: 'addTimeChar',
            component: 'date',
            dateFormat: 'yyyy-MM-dd',
            comparison: '1,2,3,5,6',
            isQueryCondition: 1,
            isQueryResult: 1,
            isQueryConditionDefault: 1,
            isTableDefault: 1
        },


    ];
    export default {
        name: "entrustWtdDraftBox",
        props: {//用于接收从父组件中传来的数据
            companyName: {
                type: String
            },
            alreadyAddId: {
                type: String
            },
            callback: {
                type: Function
            }
        },
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: "",
                orderProperty: "wtd.add_time",
                orderType: "desc",
                tableData: [],
                multipleSelection: [],
                isPut: true,

                isSetting: 0, //控制个性化设置弹窗是否展示
                edit: null, //控制编辑弹窗是否展示
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
                collectionInfo: [],
            };
        },
        methods: {
            handleCancel() {
                this.callback()
            },
            handleSort: function (column, prop, order) {
                this.orderProperty = column["prop"];
                if (column["order"] == "descending") {
                    this.orderType = "desc";
                } else {
                    this.orderType = "asc";
                }
                this.getTableList();
            },

            getTableList(obj) {
                ajaxRequest(
                    "get",
                    "back/entrustWtd/queryWtdDraftBox",
                    {
                        page: this.page,
                        rows: this.rows,
                        orderProperty: this.orderProperty,
                        // 进行升序降序排列的标志
                        orderType: this.orderType,
                        total: 0,
                        sc: obj ? obj : this.sc
                    },
                    res => {
                        if (res.code === 200) {
                            this.tableData = res.rows;
                            this.total = res.total;
                            this.multipleSelection = [];
                        }
                    }
                );
            },
            chooseDraftBox(obj) {
                let wtdId = obj.wtdId;
                ajaxRequest(
                    "post",
                    "back/entrustWtd/queryDraftBoxDetail",
                    {
                        wtdId: wtdId
                    },
                    res => {
                        if (res.code === 200) {
                            // console.log(res, '222222222222222')
                            this.callback(res.daoResult);
                        } else {
                            this.$message.error("数据错误，请重试！")
                            this.getTableList();
                        }
                    }
                );
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size;
                this.getTableList();
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage;
                this.getTableList();
            },
            handleEdit(rowInfo) {
                !!rowInfo ? (this.isPut = true) : (this.isPut = false);
                this.edit = rowInfo || {};
            },
            handleDelete(data) {
                let wtdId = data.wtdId;
                ajaxRequest('post', 'back/entrustWtd/deleteDraftBox', {wtdId: wtdId}, function (res) {
                    if (res.code === 200) {
                        this.$message.success('删除成功');
                        this.getTableData();
                    }
                    else {
                        this.$message.error('删除失败');
                    }
                }.bind(this))
            },
        },
        components: {
            TableColumnHeader,
            Retrieve,
        },
        mounted() {
            this.getTableList();
        }
    };
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
