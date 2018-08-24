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
            <div>
                <el-table  :data="tableData"
                    border
                    style="width: 100%"
                    :max-height="QJTableMaxHeight"
                    @sort-change="handleSort"
                v-loading="loading">

                    <el-table-column fixed type="index" label="序号" width="50px"></el-table-column>

                    <el-table-column
                        prop="dwMc"
                        label="单位名称"
                        v-if="headObj.dwMc"

                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        prop="sugtype"
                        label="范围"
                        v-if="headObj.sugtype"

                        :render-header="QJrenderHeader"
                        :formatter="formatterSugtype"
                    ></el-table-column>

                    <el-table-column
                        prop="sugclass"
                        label="类别"
                        v-if="headObj.sugclass"

                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        prop="title"
                        label="标题"
                        v-if="headObj.title"

                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        prop="djsj"
                        label="提交时间"
                        v-if="headObj.djsj"

                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        prop="traPersonName"
                        label="转交"
                        v-if="headObj.traPersonName"

                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        prop="replayflag"
                        label="是否回复"
                        v-if="headObj.replayflag"

                        :render-header="QJrenderHeader"
                        :formatter="formatterReplayflag"
                    ></el-table-column>

                    <el-table-column label="转交" width="60px">
                        <template slot-scope="scope">
                            <el-button @click="designatedReply(scope.row)" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-setting" title="转交"></i></el-button>
                        </template>
                    </el-table-column>



                    <el-table-column label="操作" width="60px">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-edit-outline" title="编辑"></i></el-button>
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
    import Vue from "vue";
    import Vuex from "vuex";
    import $ from "jquery";
    import {ajaxRequest, formatArrayToTree} from "../../util/base";
    import Retrieve from "../../Retrieve";
    import WorkMould from "../../mould/WorkMould";
    import TableColumnHeader from "../../Table/TableColumnHeader";
    import paramJson from "./suggest"; //同目录下json数据

/*     import {Table, TableColumn, Pagination} from "element--ui";
    Vue.use(Table);
    Vue.use(TableColumn); */

    export default {
        name: "suggest-list",
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
                searchKey: "",
                orderProperty: "a.replayflag, a.djsj",
                orderType: "desc",
                tableData: [],
                multipleSelection: [],
                fuzzySearch: 0,
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
              loading:false,
            };
        },
        methods: {

            formatterSugtype:function (row, column) {
                if(row.sugtype == '0'){
                    return "业务相关";
                }else{
                    return "系统使用";
                }
            },

            formatterReplayflag:function (row, column) {
                if(row.replayflag == '1'){
                    return "已回复";
                }else{
                    return "未回复";
                }
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

            getTableList() {
              this.loading=true
                var _this = this;
                ajaxRequest("get", "back/suggest/findSuggestList", {
                        fuzzySearch: 1,
                        page: _this.page,
                        rows: _this.rows,
                        orderProperty: _this.orderProperty,
                        // 进行升序降序排列的标志
                        orderType: _this.orderType,
                        total: 0,
                        sc: _this.sc
                    }, res => {
                        if (res.code === 200) {
                            _this.tableData = res.rows;
                            _this.total = res.total;
                        }
                  this.loading=false
                    }
                );
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
                this.$route.query.id = rowInfo.id
                this.$router.push({
                    path:'/admin/486',
                    query:this.$route.query
                })
            },

            designatedReply:function (rowInfo) {
                this.$route.query.id = rowInfo.id
                this.$router.push({
                    path:'/admin/488',
                    query:this.$route.query
                })
            }
        },
        mounted() {
            let userId = localStorage.getItem("userId");
            this.userId = userId;
            this.getTableList();
            this.QJGetMounted();
        }
    };
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
