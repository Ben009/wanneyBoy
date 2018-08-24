<template>
    <div class="container">
        <el-table :data="tableData" border style="width: 100%;min-height:39vh;" @row-click="toViewDetail">
            <el-table-column fixed type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="noticeTitle" label="标题" ></el-table-column>
            <el-table-column prop="createPersonName" label="录入人"
                             width="200"></el-table-column>
            <el-table-column prop="createTime" label="通知日期"
                             :formatter="dateFormat"></el-table-column>
        </el-table>
        <div style="margin-top:10px;text-align:center;float:right;">
            <mind-pagination
                    :current-page="page"
                    :page-size="rows"
                    :total="total"
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange">
            </mind-pagination>
        </div>
        <notice v-if="id" :infoId="id" :callback="handleCancel"></notice>
    </div>
</template>

<script>
    import {ajaxRequest} from "../../util/base";
    import notice from './notice';

    export default {
        name: "noticeMore",
        data() {
            return {
                tableData: [],
                page: 1,
                rows: 50,
                total: 0,
                orderProperty: 'n.is_top,n.show_time ',
                orderType: 'desc',
                sc: '',
                id: null
            }
        },
        props: {
            callback: {
                type: Function
            }
        },
        methods: {
            handleCancel: function () {
                this.id = null;
            },
            toViewDetail: function (obj) {
                this.id = obj.id;
            },
            dateFormat(row, column, cellValue, index) {
                if (cellValue == null) {
                    return;
                }
                return new Date(cellValue).format('YYYY-MM-DD')
            },
            handlePageSizeChange(size) {
                this.page = 1;
                this.rows = size;
                this.getTableList();
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage;
                this.getTableList();
            },
            getTableList: function () {
                ajaxRequest('get', 'back/notice/retrieve', {
                    isDelete: 0,
                    page: this.page,
                    rows: this.rows,
                    total: 0,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    sc: this.sc
                }, res => {
                    if (res.code === 200) {
                        this.tableData = res.rows;
                        this.total = res.total;
                    } else {
                        console.log(res)
                    }
                })
            }
        },
        components: {
            notice
        },
        mounted() {
            this.getTableList();
        }
    }
</script>

<style scoped>
    .editpo {
        margin: auto;
        border: 1px solid #ccc;
        min-height: 200px;
    }

    .container {
        width: 95%;
        margin: auto;
    }
</style>
