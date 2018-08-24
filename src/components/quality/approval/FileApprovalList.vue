<template>
    <div>
        <div class="search">
            <Retrieve ref="retrieve-wapper"
                      :rowsCondition='rowsCondition'
                      :sortBy="sortBy"
                      :order="order"
                      :paramJson="paramJson"
                      :retrieveCondition="retrieveCondition"/>

            <div style="display: flex;justify-content: space-between;">
                <div class="operate">
                    <el-button @click="handleAddFile()" type="primary">新增文件</el-button>
                </div>
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
                </span>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" :max-height="QJTableMaxHeight" border size="small">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="fileCode" label="文件编号"></el-table-column>
                <el-table-column prop="fileName" label="文件名称" min-width="200"></el-table-column>
                <el-table-column prop="addTime" label="添加日期"
                                 :formatter="formatterTime"></el-table-column>
                <el-table-column prop="status" label="当前状态" :formatter="formatterColumn"></el-table-column>
                <el-table-column prop="approvalUser" label="当前处理人"></el-table-column>
                <el-table-column label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleDetail(scope.row)" type="text" style="padding:0;font-size:18px;">
                            <i class="el-icon-edit-outline" title="详细"></i>
                        </el-button>
                        <el-button :disabled="scope.row.status ===0? false: true"
                                   v-mindPopover="{message:'确定要删除该委托单位?',success:handleDelete.bind(this,[scope.row])}"
                                   type="text" style="padding:0;font-size:18px;">
                            <i class="el-icon-delete" title="删除"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <mind-pagination :current-page="page" :page-size="rows" :total="total"
                             @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange">
            </mind-pagination>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Retrieve from '../../Retrieve'
    import WorkMould from '../../mould/WorkMould'
    import paramJson from './fileApprovalParam' //同目录下json数据
    
    // 引入封装的ajax控件
    import {ajaxRequest, formatDate} from '../../util/base'
    // 引入jquery

    /* import {
        Button,
        Card,
        Checkbox,
        CheckboxGroup,
        Col,
        Input,
        Row,
    } from 'element--ui'
    Vue.use(Input);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(CheckboxGroup);
    Vue.use(Checkbox);
    Vue.use(Card); */

    export default {
        name: "fileApprovalList",
        components: {
            Retrieve,
            WorkMould
        },
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                orderProperty: '',
                orderType: '',
                tableData: [],
                multipleSelection: [],

                /*高级检索相关项*/
                rowsCondition: paramJson, //默认同目录下json数据 会依据模板改变
                paramJson: paramJson, //同目录下json数据 常量
                moduleList: [], //模板列表
                templateValue: "", //当前选择的模板id
                sortBy: "", //排序字段
                order: "", //desc降序 asc升序
                headObj: {}, //表头显示对象 {category:true}
                defaultOpen: true, //默认开启高级查询

                allModules: {}, //所有模板
                resultCondition: [],
                retrieveCondition: []
            }
        },
        methods: {
            handleAddFile: function () {//新增文件审批
                this.$router.push({
                    path: '/admin/456',
                    query: {
                        isAdd: true,
                        parent: "add"
                    }
                })
            },
            handleDetail(rowInfo) {//查看文件审批详情
                this.$router.push({
                    path: '/admin/456',
                    query: {
                        isAdd: false,
                        id: rowInfo.id,
                        parent: "add"
                    }
                })
            },
            handleDelete: function (data) {
                if (data.length > 0) {
                    ajaxRequest('post', 'back/fileApproval/deleteFileApproval/' + data[0].id, {_method: 'delete'}, (res) => {
                        if (res.code === 200) {
                            this.$message.success('删除成功');
                            this.getTableList()
                        } else {
                            this.$message.error('删除失败')
                        }
                    });
                } else {
                    this.$message.warning('请先选择要删除的文件')
                }
            },
            formatterTime: function (row, column) {
                return formatDate(row.addTime, 'YYYY-MM-DD');
            },
            formatterColumn: function (row, column, value) {
                let res = "";
                switch (value) {
                    case 0:
                        res = "未审核";
                        break;
                    case 1:
                        res = "已退回";
                        break;
                    case 2:
                        res = "审核中";
                        break;
                    case 3:
                        res = "审核已通过";
                        break;
                    case 4:
                        res = "完成";
                        break;
                }
                return res;
            },
            handlePageSizeChange: function (size) {
                let _this = this;
                _this.page = 1;//Math.floor(_this.page * _this.rows / size);
                _this.rows = size;
                _this.getTableList();
            },
            handleCurrentPageChange: function (currentPage) {
                let _this = this;
                _this.page = currentPage;
                _this.getTableList();
            },
            handleSelectionChange: function (rows) {
                this.multipleSelection = rows;
            },
            getTableList: function () {
                let _this = this;
                ajaxRequest("get", "back/fileApproval/retrieve", {
                    page: _this.page,
                    rows: _this.rows,
                    orderProperty: _this.orderProperty,
                    orderType: _this.orderType,
                    total: 0,
                    sc: _this.sc
                }, res => {
                    if (res.code === 200) {
                        _this.tableData = res.rows;
                        _this.total = res.total;
                    } else {
                        _this.$message.error("加载数据失败");
                    }
                });
            }
        },
        mounted() {
            this.getTableList();
        }
    }
</script>

<style scoped>
    .table {
        margin-top: 15px;
    }

    .custom-input .el-input__inner {
        height: 32px;
        line-height: 32px;
    }

    .custom-input .el-input-group__append {
        padding: 0 10px;
    }

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