<template>
    <div style="position:relative;">
        <div>
            <div class="el-tab_head" style="float:left;">
                <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增项别</el-button>
            </div>

            <div class="el-tab_head" style="float:right;">
              <span class="span" style="font-size:14px;">项别号: </span>
              <el-input placeholder="请输入项别号" class="custom-input" style="width:200px; font-size:14px;"
                        v-model="searchKeyNum" v-focusSelect ></el-input>
                <span class="span" style="font-size:14px;">项别名称: </span>
                <el-input placeholder="请输入项别名称" class="custom-input" style="width:200px; font-size:14px;"
                          v-model="searchKey" v-focusSelect ></el-input>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
              <el-button size="small" type="warning" @click="handleClear()" class="el-icon-warning">&nbsp;清空</el-button>
                &nbsp;&nbsp;
                <div style="display:inline-block;position:relative;">
                    <global-tootips>
                        <p>“强检范围”依据该项别绑定的强检目录自动生成；</p>
                    </global-tootips>
                 </div>
            </div>

            <div class="el-tab_head">
                <el-table :data="tableData" border style="width: 100%;position:relative; top:10px;" :max-height="QJTableMaxHeight"
                          @sort-change="handleSort" @selection-change="handleSelectionChange">

                    <el-table-column
                        prop="itemNum"
                        label="项别号"
                    ></el-table-column>

                    <el-table-column
                        prop="itemName"
                        label="项别名称"
                    ></el-table-column>

                    <!--<el-table-column-->
                    <!--prop="itemEnglishName"-->
                    <!--label="项别英文名称"-->
                    <!--&gt;</el-table-column>-->

                    <el-table-column
                        prop="itemRealm"
                        label="强检范围"  min-width="200"
                    ></el-table-column>

                    <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-edit-outline" title="编辑项别"></i>
                            </el-button>
                            <el-button v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,[scope.row])}"
                                       type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-delete" title="删除"></i>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div style="text-align:center; margin-top:20px;float:right;">
                <mind-pagination
                    :current-page="page"
                    :page-size="rows"
                    :total="total"
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>

            <forceCatalogItemForm v-if="!!edit" :data="edit" :callback="handleEditCallback"
                                  @getTableList="getTableList"></forceCatalogItemForm>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Vuex from 'vuex';
    import {ajaxRequest, formatArrayToTree, ajaxProxyRequest} from '../../util/base';
    import Retrieve from '../../Retrieve';
    import WorkMould from '../../mould/WorkMould';
    import TableColumnHeader from '../../Table/TableColumnHeader';
    import forceCatalogItemForm from './forceCatalogItemForm';

/*     import {Table, TableColumn, Pagination} from 'element--ui';
    Vue.use(Table);
    Vue.use(TableColumn); */

    export default {
        name: "forceCatalogItem-table",
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve,
            forceCatalogItemForm
        },
        props: {//用于接收从父组件中传来的数据
            data: {
                type: Object
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
                searchKey: '',
                searchKeyNum:'',
                orderProperty: 'f.item_num',
                orderType: 'asc',
                tableData: [],
                multipleSelection: [],

                isSetting: 0,  //控制个性化设置弹窗是否展示
                edit: null,   //控制编辑弹窗是否展示

                kindRealms: []
            }
        },
        methods: {
//            formatterItemRealm: function (row, column) {
//                var ir = "";
//                if (row.itemRealm != "" && row.itemRealm != null && row.itemRealm != undefined) {
//                    var itemRealms = row.itemRealm.split("`");
//                    for (var i = 0; i < itemRealms.length - 1; i++) {
//                        ir += this.kindRealms[itemRealms[i]] + "、";
//                    }
//                    ir = ir.substring(0, ir.length - 1);
//                }
//                return ir;
//            },

            handleSort: function (column, prop, order) {
                this.orderProperty = column['prop'];
                if (column['order'] == 'descending') {
                    this.orderType = 'desc';
                } else {
                    this.orderType = 'asc';
                }
                this.getTableList();
            },

            handleSearch(column, value) {
                if (this.clearInput) {
                    this.searchKey = "";
                }
                // this.searchKey=value;
                this.page = 1;
                this.total = 0;
                this.getTableList();
                this.clearInput = false;
            },

            cancel() {
                this.callback();
            },

            getTableList() {
                ajaxRequest('get', 'back/forceCatalogItem/retrieve', {
                    itemName: this.searchKey,
                    itemNum: this.searchKeyNum,
                    fuzzySearch: 1,
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
                })

            },

            handleToggleTheme(color) {
                this.$store.commit('toggleTheme', color)
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
                this.edit = rowInfo || {}
            },

            handleDelete(data) {
                if (data.length > 0) {
                    let ids = data.map(function (v) {
                        return v.id
                    }).join(",");
                    // this.$confirm('是否确认删除?', '提示', {
                    //     confirmButtonText: '确定',
                    //     cancelButtonText: '取消',
                    //     type: 'warning'
                    // }).then(() => {
                    ajaxRequest('post', 'back/forceCatalogItem/list/' + ids, {_method: 'delete'}, function (res) {
                        if (res.code === 200) {
                            this.$message.success('删除成功');
                            this.getTableList();
                        }
                        else {
                            this.$message.error('删除失败');
                        }
                    }.bind(this))
                    // }).catch(() => {
                    //     this.$message({
                    //         type: 'info',
                    //         message: '已取消删除'
                    //     });
                    // });
                } else {
                    this.$message({
                        message: '请先选择要删除的数据',
                        type: 'warning'
                    })
                }
            },

            handleEditCallback(rowInfo) {
                let _this = this;
                if (rowInfo) {
                    if (rowInfo.id) {
                        ajaxRequest('put', 'back/forceCatalogItem/', {
                            id: rowInfo.id,
                            category: rowInfo.category,
                            name: rowInfo.name,
                            value: rowInfo.value,
                            memo: rowInfo.memo
                        }, function (res) {
                            if (res.code === 200) {
                                _this.$message.success('编辑成功');
                                _this.edit = null;
                                let roleList = _this.tableData;
                                for (let i = 0, len = roleList.length; i < len; i++) {
                                    if (roleList[i].id === rowInfo.id) {
                                        _this.tableData.splice(i, 1, rowInfo);
                                        break;
                                    }
                                }
                            }
                            else {
                                _this.$message.error('编辑失败');
                            }
                        });
                    } else {
                        ajaxRequest('post', 'back/forceCatalogItem/', {
                            category: rowInfo.category,
                            name: rowInfo.name,
                            value: rowInfo.value,
                            memo: rowInfo.memo
                        }, function (res) {
                            if (res.code === 200) {
                                _this.$message.success('新增成功');
                                _this.edit = null;
                                _this.getTableList();
                            }
                            else {
                                _this.$message.error('新增失败');
                            }
                        })
                    }
                } else {
                    this.edit = null
                }
            },
          //清空按钮
          handleClear() {
            this.searchKey = '';
            this.searchKeyNum = '';
          },

//            getKindRealms: function () {
//                let _this = this;
//                ajaxProxyRequest('get', "/njmind/findParam/applianceUse", null, (res) => {
//                    for (var i = 0; i < res.list.length; i++) {
//                        _this.kindRealms[res.list[i].code] = res.list[i].remark;
//                    }
//                });
//            }
        },
        mounted() {
            //获取强检范围
//            this.getKindRealms();
            this.getTableList();
        }
    }
</script>

<style scoped>
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

    .shuoming {
        border: none !important;
        color: #56BC4E !important;
        font-size: 16px !important;
    }

    .shuoming::after {
        content: "";
        width: 18px;
        height: 35px;
        /* background: white; */
        position: absolute;
        /* z-index: 999; */
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
        margin-left: -318px;
        word-break: break-all;
        margin-top: 19px;
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

    .shuoming .el-sm {
        display: none;
    }

    .shuoming:hover .el-sm {
        display: block;
    }

</style>
