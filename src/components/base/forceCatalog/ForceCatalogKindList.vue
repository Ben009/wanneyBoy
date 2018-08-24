<template>
    <div style="position:relative;">
        <div>
            <div  class="el-tab_head" style="float:left;">
                <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增种别</el-button>
            </div>

            <div class="el-tab_head"  style="position:absolute;top:0;right:25px;">
                <div style="text-align:center;">
                    <span class="span" style="font-size:14px;">项别名称：</span>
                    <el-input
                        placeholder="请输入项别名称"
                        v-model="searchKey1"
                        size="small"
                        style="width:200px"
                        v-focusSelect
                        clearable>
                    </el-input>
                    <span class="span" style="font-size:14px;">种别名称：</span>
                    <el-input
                        placeholder="请输入种别名称"
                        v-model="searchKey2"
                        size="small"
                        style="width:200px"
                        v-focusSelect
                        clearable>
                    </el-input>
                    <el-button size="small" type="primary" @click="handleSearch()" class="el-icon-search">查询</el-button>
                    <el-button size="small" type="warning" @click="handleClear()" class="el-icon-warning">&nbsp;清空</el-button>
                </div>
            </div>

            <div  class="el-tab_head">
                <el-table :data="tableData" border style="width: 100%;position:relative; top:10px;" :max-height="QJTableMaxHeight"
                          @sort-change="handleSort" @selection-change="handleSelectionChange">
                    <el-table-column prop="itemNum" label="项别号"></el-table-column>
                    <el-table-column prop="itemName" label="项别名称"></el-table-column>
                    <el-table-column prop="kindNum" label="种别号"></el-table-column>
                    <el-table-column prop="kindName" label="种别名称"></el-table-column>
                    <el-table-column prop="checkMethod" label="强检形式"></el-table-column>
                    <el-table-column prop="kindRealmDetail" label="强检范围及说明" min-width="200"
                                     :formatter="formatterKindRealmDetail"></el-table-column>
                    <el-table-column prop="itemCycle" label="检测周期/月"></el-table-column>

                    <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-edit-outline" title="编辑"></i></el-button>
                            <el-button v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,[scope.row])}" type="text" style="padding:0;font-size:18px;">
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

            <forceCatalogKindForm v-if="!!edit" :data="edit" :callback="handleEditCallback" @getTableList="getTableList"></forceCatalogKindForm>
        </div>
    </div>


</template>

<script>
    import Vue from 'vue';
    import Vuex from 'vuex';
    import {ajaxRequest, formatArrayToTree,ajaxProxyRequest} from '../../util/base';
    import Retrieve from '../../Retrieve';
    import WorkMould from '../../mould/WorkMould';
    import TableColumnHeader from '../../Table/TableColumnHeader';
    import forceCatalogKindForm from './forceCatalogKindForm';
    import ForceCatalogItemList from './ForceCatalogItemList';

/*     import {Table, TableColumn,Pagination} from 'element--ui';
    Vue.use(Table);
    Vue.use(TableColumn);
     */
    export default {
        name: "ForceCatalogKind-table",
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve,
            forceCatalogKindForm,
            ForceCatalogItemList
        },
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey1: '',
                searchKey2: '',
                orderProperty: 'f.kind_num',
                orderType: 'asc',
                tableData: [],
                multipleSelection: [],

                isSetting: 0,  //控制个性化设置弹窗是否展示
                edit: null,   //控制编辑弹窗是否展示

                checkMethods:[],
                kindRealms:[]
            }
        },
        methods: {
//            formatterCheckMethod: function (row, column) {
//                return this.checkMethods[row.checkMethod];
//            },

            formatterKindRealmDetail: function (row, column) {
                var kindRealmDetailList = row.kindRealmDetail.split("~");
                var retStr = "";
                var kindRealmDetails = [];
                for(var i=0; i<kindRealmDetailList.length-1;i++){
                    var kindRealmDetail = kindRealmDetailList[i].split("`");

                    if(kindRealmDetail[1]=="" || kindRealmDetail[1]==null){
                      retStr+= kindRealmDetail[0]+"：空。";
                    }else{
                      retStr+= kindRealmDetail[0]+"："+kindRealmDetail[1]+"。";
                    }
                    var obj  = {
                        kindRealm:kindRealmDetail[0],
                        kindDetail:kindRealmDetail[1]
                    }
                    kindRealmDetails.push(obj);
                }
                row.kindRealmDetails = kindRealmDetails;
                return retStr;
            },
//
//            formatterItemCycle: function (row, column) {
//                if(row.itemCycle != '' && row.itemCycle != null && row.itemCycle != undefined){
//                    return row.itemCycle + "个月";
//                }else {
//                    return "";
//                }
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
                    this.searchKey1 = "";
                    this.searchKey2 = "";
                }
                // this.searchKey=value;
                this.page = 1;
                this.total = 0;
                this.getTableList();
                this.clearInput = false;
            },

            handleClear() {
                this.searchKey1 = '';
                this.searchKey2 = '';
            },

            getTableList() {
                ajaxRequest('get', 'back/forceCatalogKind/retrieve', {
                    itemName: this.searchKey1,
                    kindName: this.searchKey2,
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
                this.edit = rowInfo || {kindRealmDetails:[{kindRealm:"", kindDetail:""}]}
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
                        ajaxRequest('post', 'back/forceCatalogKind/list/' + ids, {_method: 'delete'}, function (res) {
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
                        ajaxRequest('put', 'back/forceCatalogKind/', {
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
                    }
                    else {
                        ajaxRequest('post', 'back/forceCatalogKind/', {
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
                }
                else {
                    this.edit = null
                }
            },

            handleSelectTemplate (value) {
                ajaxRequest('get', 'back/settingTemplate/list', {id: value}, (res) => {
                    if (res.code == 200) {
                        var temp = res.rows[0]
                        this.recoverRetrieve(temp)
                    }
                })
            },


//            toItemList() {
//                this.item = {}
//            },
//
//            handleCancel(){
//                this.getTableList();
//                this.item = null;
//            },

//            getCheckMethods:function () {
//                let _this=this;
//                ajaxProxyRequest('get', "/njmind/findParam/checkMethod", null, (res) => {
//                    for(var  i=0;i<res.list.length;i++){
//                        _this.checkMethods[res.list[i].code]=res.list[i].remark;
//                    }
//                });
//            },
//
//
//            getKindRealms:function () {
//                let _this=this;
//                ajaxProxyRequest('get', "/njmind/findParam/applianceUse", null, (res) => {
//                    for(var  i=0;i<res.list.length;i++){
//                        _this.kindRealms[res.list[i].code]=res.list[i].remark;
//                    }
//                });
//            }
        },
        mounted() {
            //获取强检形式
//            this.getCheckMethods();

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
</style>
