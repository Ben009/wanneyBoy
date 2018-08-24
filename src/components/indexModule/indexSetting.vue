<!-- 首页设定 -->
<template>
    <div>
        <div class="table">
            <el-table :data="tableData" :max-height="QJTableMaxHeight" @selection-change="handleSelectionChange" border
                      size="small" ref="table" @row-click="clickToggleSelection">
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column type="selection" prop="id" label="是否启用" width="50"></el-table-column>
                <el-table-column prop="parentTitle" label="分类" ></el-table-column>
                <el-table-column prop="title" label="提示"></el-table-column>
                <el-table-column prop="tips" label="说明"></el-table-column>
                <el-table-column prop="indexSetting" label="启用状态" :formatter="formatterColumn"></el-table-column>
            </el-table>
        </div>
        <div class="operate">
            <el-button @click="handleUpdate" type="primary">确认修改</el-button>
        </div>
    </div>
</template>

<script>
    import {ajaxRequest} from '../util/base'

    export default {
        name: "indexSetting",
        data() {
            return {
                tableData: [],
                multipleSelection: []
            }
        },
        methods: {
            clickToggleSelection(row) {
                if (row) {
                    this.$refs.table.toggleRowSelection(row);
                } else {
                    this.$refs.table.clearSelection();
                }
            },
            handleSelectionChange: function (rows) {
                this.multipleSelection = rows;
            },
            handleUpdate: function (data) {
                let ids = this.multipleSelection.map(function (v) {
                    return v.id;
                }).join(",");
                console.log(ids);
                ajaxRequest('put', 'back/index/setting', {ids: ids}, (res) => {
                    if (res.code === 200) {
                        this.$message.success('修改成功');
                        //修改成功之后清除首页缓存
                        localStorage.removeItem("INDEX_DATA");
                        this.getTableList()
                    } else {
                        this.$message.error('修改失败')
                    }
                });
            },
            getSelectList(res) {
                let tempArray = [];
                if (res && res.length) {
                    res.forEach(obj => {
                        if (obj.indexSetting === 1) {
                            tempArray.push(obj)
                        }
                    })
                }
                this.toggleSelection(tempArray)
            },
            toggleSelection(rows) {

                if (rows) {
                    this.$refs.table.clearSelection();
                    rows.forEach(row => {
                        this.$refs.table.toggleRowSelection(row, true);
                    });
                } else {
                    this.$refs.table.clearSelection();
                }
            },
            formatterColumn: function (row, column, value) {
                let res = "";
                if (value === 0) {
                    res = "未启用";
                } else {
                    res = "已启用";
                }
                return res;
            },
            getTableList: function () {
                new Promise(resolve => {
                    let _self = this;
                    ajaxRequest('get', 'back/index/indexSettingList', {}, res => {
                        if (res.code === 200) {
                            _self.tableData = res.rows;
                        } else {
                            _self.$message.error("加载数据失败");
                        }
                        resolve(res)
                    });
                }).then(res => {
                    this.getSelectList(res.rows)
                })

            }
        }
        ,
        mounted() {
            this.getTableList();
        }

    }
</script>

<style scoped>
    .operate {
        margin-top: 15px;
    }
</style>