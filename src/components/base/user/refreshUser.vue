<template>
    <mind-dialog
            :visible="true"
            title="恢复用户"
            class="refreshUser"
            dialogSize="large"
            @close="handleCancel"
            center
            v-dialogDrag>
        <div>
            <div class="el-icon-info  shuoming">
                <el-row class="el-sm">
                    <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">
                        事项说明</p>
                    <dl style="padding:6px 10px; ">
                        <p>该节点用于恢复误删除的用户</p>
                    </dl>
                </el-row>
            </div>
            <el-table :data="tableList"
                      :max-height="QJTableMaxHeight"
                      border
                      ref="table"
                      style="width: 100%;">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column
                        prop="userNo"
                        label="登录账号">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="用户姓名">
                </el-table-column>
                <el-table-column
                        prop="departId"
                        :formatter="formatDepart"
                        label="所属部门" >
                </el-table-column>
                <el-table-column
                        prop="position"
                        show-overflow-tooltip
                        label="职务">
                </el-table-column>
                <el-table-column
                        prop="deleteUserName"
                        show-overflow-tooltip
                        label="删除人"
                >
                </el-table-column>
                <el-table-column
                        prop="addTime"
                        show-overflow-tooltip
                        :formatter="dealDate"
                        label="删除时间"
                >
                </el-table-column>
                <el-table-column
                        prop="recoverUserName"
                        show-overflow-tooltip
                        label="恢复人"
                >
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        show-overflow-tooltip
                        :formatter="dealDate"
                        label="恢复时间"
                >
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="200px">
                    <template slot-scope="scope">
                        <el-button v-mindPopover="{message:'确定恢复该用户?',success:handleRefrence.bind(this,scope.row)}"
                                   :disabled="scope.row.isDelete == 0 ? true : false" type="primary">
                            {{scope.row.isDelete == 0 ? '已恢复' : '恢&#X3000;复'}}
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
        <span slot="footer" class="dialog-footer" style="text-align:center;">
				<el-button @click="handleCancel">关 闭</el-button>
	    </span>
    </mind-dialog>
</template>
<script>
    import {ajaxRequest} from '../../util/base';
    import TableColumnHeader from '@/components/Table/TableColumnHeader.vue'
    import userJson from './refreshUserJson'

    export default {
        name: 'session-manage',
        props: {
            callback: {
                type: Function
            },
        },
        data() {
            return {
                tableList: [],
                tempDepartList: [],
                page: 1,
                rows: 10,
                total: 0,
                rowsCondition: userJson, //默认同目录下json数据 会依据模板改变
                paramJson: userJson, //同目录下json数据 常量
            }
        },
        methods: {
            getRefreshUser() {
                ajaxRequest('get', 'back/user/deleteRetrieve', {
                    page: this.page,
                    rows: this.rows,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    total: 0,
                    sc: this.sc
                }, res => {
                    if (res.code === 200) {
                        this.tableList = res.rows;
                        this.total = res.total
                    }
                });
            },
            /**
             * [getDepartList 获取部门列表]
             * @return {[type]} [description]
             */
            getDepartList() {
                ajaxRequest('get', 'back/depart/list', {
                    isDelete: 0
                }, (val) => {
                    if (val.code === 200) {
                        this.departList = val.rows;
                        this.departList.forEach(val => {
                            this.tempDepartList[val.id] = val.departName
                        })
                    } else {
                        this.$message.error(val.message)
                    }
                })
            },
            formatDepart(row) {
                return this.tempDepartList[row.departId]
            },
            handleCancel() {
                this.callback(null)
            },
            dealDate(row, column, cellValue) {
                if (cellValue) {
                    return new Date(cellValue).format('YYYY-MM-DD hh:mm:ss')
                }
            },
            handleRefrence(row) {
                ajaxRequest('put', 'back/user/recoveryUser', {
                    id: row.id,
                    isDelete: 0
                }, (val) => {
                    if (val.code === 200) {
                        this.$message.success({
                            message: '恢复成功！',
                            duration: 1000,
                            onClose: () => {
                                this.getRefreshUser();
                            }
                        })
                    } else {
                        this.$message.error(val.message)
                    }
                })
            },
            handlePageSizeChange(size) {
                this.page = 1;
                this.rows = size;
                this.getRefreshUser();
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage;
                this.getRefreshUser();
            },
            QJhandleSearch(column, value) {
                var comparison = this.getComparison(column.property);
                var sqlSeg = this.getSqlSeg(column.property);
                this.sc = JSON.stringify([{
                    "nameCode": column.property,
                    "sqlSeg": sqlSeg,
                    "comparison": comparison,
                    "value": value
                }])
                this.getRefreshUser()
            },
        },
        created() {
            this.getDepartList();
        },
        mounted() {
            this.getRefreshUser();
        }
    }
</script>
<style type="text/css" scoped>
    .shuoming {
        border: none !important;
        color: #56BC4E !important;
        font-size: 16px !important;
        margin-bottom: 5px;
        float: right;
        cursor: pointer;
    }

    .shuoming::after {
        content: "";
        /*background: #fff;*/
        position: absolute;
        z-index: 999;
        /* top: 0; */
        /* left: -65px; */
        right: 10;

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
        margin-left: -200px;
        margin-right: 35px;
        word-break: break-all;
        margin-top: 5px;
        padding: 4px 5px;
        font-size: 14px;
        opacity: 50;
        float: right;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }
</style>