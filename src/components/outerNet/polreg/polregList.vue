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
                <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增政策法规
                </el-button>
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

                    <div class="el-icon-info shuoming">
                        <el-row class="el-sm">
                            <p>1、发布人将在服务平台展示，可自行修改</p>
                            <p>2、实际发布人，指添加或修改政策法规的用户</p>
                            <p>3、生效操作人，指将未生效的政策法规设置成生效的用户</p>
                            <p>4、生效，政策法规生效后，将在服务平台展示，未生效的政策法规不展示。</p>
                        </el-row>
                    </div>
                </span>
            </div>
            <div>
                <el-table   :data="tableData"
                    border
                    style="width: 100%"
                    :max-height="QJTableMaxHeight"
                    @sort-change="handleSort"
                    @selection-change="handleSelectionChange"
                    v-loading="loading">

                    <el-table-column fixed type="index" label="序号" width="50"></el-table-column>

                    <el-table-column
                        prop="title"
                        label="标题"

                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        prop="lb"
                        label="类别"

                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        v-if="headObj.versionflag"
                        prop="versionflag"
                        label="发布平台"
                        :render-header="QJrenderHeader"
                        :formatter="formatterVersionflag"
                    ></el-table-column>

                    <el-table-column
                        v-if="headObj.author"
                        prop="author"
                        label="发布人"
                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        v-if="headObj.djsj"
                        prop="djsj"
                        label="发布时间"
                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        v-if="headObj.czr"
                        prop="czr"
                        label="实际发布人"
                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        v-if="headObj.sysdjsj"
                        prop="sysdjsj"
                        label="实际发布时间"
                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        v-if="headObj.disflag"
                        prop="disflag"
                        label="是否生效"
                        :formatter="formatterDisflag"
                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        v-if="headObj.disczr"
                        prop="disczr"
                        label="生效操作人"
                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column
                        v-if="headObj.disdjsj"
                        prop="disdjsj"
                        label="生效时间"
                        :render-header="QJrenderHeader"
                    ></el-table-column>

                    <el-table-column label="操作" width="80px">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-edit-outline" title="编辑"></i></el-button>
                            <el-button
                                v-mindPopover="{message:'确定要删除该记录?',success:handleDelete.bind(this,(scope.row))}"
                                type="text" style="padding:0;font-size:18px;"><i class="el-icon-delete" title="删除"></i></el-button>
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
    import paramJson from "./polreg"; //同目录下json数据

/*     import {Table, TableColumn, Pagination} from "element--ui";
    Vue.use(Table);
    Vue.use(TableColumn); */

    export default {
        name: "polreg-list",
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
                orderProperty: "a.djsj",
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
              loading:false
            };
        },
        methods: {

            formatterDisflag:function (row, column) {
                if(row.disflag == '1'){
                    return "已生效";
                }else{
                    return "未生效";
                }
            },

            formatterVersionflag:function (row, column) {
                return row.versionflag.replace("2","公共服务平台").replace("1","强检平台");
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
                ajaxRequest("get", "back/polreg/findPolregList", {
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
                            _this.multipleSelection = [];
                        }
                        this.loading = false
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
                if(!!rowInfo){
                    this.$route.query.id = rowInfo.id
                    this.$router.push({
                        path:'/admin/475',
                        query:this.$route.query
                    })
                }else{
                    this.$router.push({
                        path:'/admin/475',
                        query:{}
                    })
                }
            },

            handleDelete(data) {
                ajaxRequest('post', "back/polreg/deletePolreg", {id: data.id},
                    function (res) {
                        if (res.code === 200) {
                            this.$message.success("删除成功！");
                            this.getTableList();
                        } else {
                            this.$message.error("删除失败！");
                        }
                    }.bind(this)
                );
            },
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
