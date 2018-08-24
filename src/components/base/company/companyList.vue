<template>
    <div style="position:relative;">
        <div v-show="!edit">
            <Retrieve ref="retrieve-wapper"
                      :rowsCondition='rowsCondition'
                      :sortBy="sortBy"
                      :order="order"
                      v-if="defaultOpen"
                      :paramJson="paramJson"
                      :retrieveCondition="retrieveCondition"
                      :collectionInfo="collectionInfo"/>

            <div>
                <div style="display: flex;justify-content: space-between; margin:10px 0px;">
                    <el-button style="opacity:0;">新增委托单位</el-button>
                    <div style="display: inline-block;text-align: center">
                        <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">
                            查询
                        </el-button>
                        <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning" v-if="defaultOpen">
                            &nbsp;清空
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

            <div class="el-icon-info shuoming">
               <el-row class="el-sm">
                 <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">事项说明</p>
                 <dl style="padding:6px 10px; ">
                <p>1、单位名称红表示该单位信息未审核；</p>
                <p>2、若无权限，仅可查询业务员或业务组负责人为本人的客户记录，有权限查询所有；</p>
                <p>3、有导出权限才可以导出器具信息；</p>
                 </dl>
            </el-row>
            </div>
          </span>
                </div>
                <div>
                    <el-table :data="tableData"
                              border
                              style="width: 100%;min-height:39vh;"
                              :max-height="QJTableMaxHeight"
                              @selection-change="handleSelectionChange"
                              v-loading="loading">

                        <el-table-column fixed type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="companyName" label="单位名称"
                                         :render-header="QJrenderHeader">
                            <template slot-scope="scope">
                                <div :class="{color:scope.row.status==0,companyName:true}">{{scope.row.companyName}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="headObj.companyNameEn" prop="companyNameEn" label="单位名称(英文)"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.addTime" prop="addTime" label="添加时间"
                                         :formatter="function(row, column, cellValue, index){return cellValue? new Date(cellValue).format('YYYY-MM-DD'):''}"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.address" prop="address" label="地址"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.addressEn" prop="addressEn" label="地址(英文)"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.certificateCompanyName" prop="certificateCompanyName"
                                         label="证书单位名称"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.sceneTestingAddress" prop="sceneTestingAddress" label="现场检测地址"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.mobilePhone" prop="mobilePhone" label="手机号码"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.industryValue" prop="industryValue" label="所属行业"
                                         :formatter="industryValueFormat"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.companyDepart" prop="companyDepart" label="客户对接部"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.companyCharge" prop="companyCharge" label="客户负责人"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column prop="companyType" label="单位类别"
                                         :render-header="QJrenderHeader"
                                         :formatter="formatterCompanyType"></el-table-column>
                        <el-table-column prop="contacter" label="客户联系人"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column prop="businessGroupName" label="业务组"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column prop="businessStaffName" label="业务员"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column prop="contractNo" label="合同号"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column prop="creditCode" label="统一社会信用代码"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.telephone" prop="telephone" label="联系电话"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.fax" prop="fax" label="传真"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.email" prop="email" label="邮箱"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.postCode" prop="postCode" label="邮编"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.certificateRequirement" prop="certificateRequirement"
                                         label="证书要求"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.visitSpecialRequirement" prop="visitSpecialRequirement"
                                         label="上门特殊要求"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.specialCertificateRequire" prop="specialCertificateRequire"
                                         label="证书特殊要求"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.otherSpecialRequirement" prop="otherSpecialRequirement"
                                         label="其他特殊要求"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.businessPromotion" prop="businessPromotion" label="业务提成(%)"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.contractRemark" prop="contractRemark" label="备注"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.invoiceCompany" prop="invoiceCompany" label="名称"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.taxNo" prop="taxNo" label="纳税人识别号"
                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.invoiceAddressTel" prop="invoiceAddressTel" label="地址、电话"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.accountBankNo" prop="accountBankNo" label="开户行及账号"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.contractDiscount" prop="contractDiscount" label="合同折扣"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.contractValidateBegin" prop="contractValidateBegin"
                                         label="合同有效期开始时间"
                                         :formatter="function(row, column, cellValue, index){return  cellValue ? new Date(cellValue).format('YYYY-MM-DD') :'' }"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.contractValidateEnd" prop="contractValidateEnd" label="合同有效期结束时间"
                                         :formatter="function(row, column, cellValue, index){return  cellValue ? new Date(cellValue).format('YYYY-MM-DD') :'' }"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.contractSignatory" prop="contractSignatory" label="合同签署人"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.contractSignDate" prop="contractSignDate" label="合同签署日期"
                                         :formatter="function(row, column, cellValue, index){return  cellValue ? new Date(cellValue).format('YYYY-MM-DD') :'' }"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.contractRemark" prop="contractRemark" label="合同备注"

                                         :render-header="QJrenderHeader"></el-table-column>
                        <el-table-column v-if="headObj.region" label="行政区划" width="150px">
                            <template slot-scope="region">
                                <span>{{region.row.province}}/{{region.row.city}}/{{region.row.area}}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column   prop="status" label="是否审核"  :formatter="formatterCompanyStatus"  :render-header="QJrenderHeader"></el-table-column> -->
                        <el-table-column label="操作" fixed="right" width="80px">
                            <template slot-scope="scope">
                                <el-button v-has="'M4804'" @click="handleEdit(scope.row)" type="text"
                                           style="padding:0;font-size:18px;"><i class="el-icon-edit-outline"
                                                                                title="编辑"></i></el-button>
                                <el-button v-has="'M4803'"
                                           v-mindPopover="{message:'确定要删除该委托单位?',success:handleDelete.bind(this,[scope.row])}"
                                           type="text" style="padding:0;font-size:18px;"><i class="el-icon-delete"
                                                                                            title="删除"></i></el-button>
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
        <div v-if="edit">
            <companyContent :data="edit" :isPut='isPut' :callback="handleEditCallback"></companyContent>
        </div>
    </div>


</template>

<script>
    import Vue from "vue";
    import Vuex from "vuex";
    import $ from "jquery";
    import {ajaxRequest, formatArrayToTree, ajaxProxyRequest} from "../../util/base";
    import Retrieve from "../../Retrieve";
    import WorkMould from "../../mould/WorkMould";
    import TableColumnHeader from "../../Table/TableColumnHeader";
    import companyContent from "./companyContent";
    import paramJson from "./company"; //同目录下json数据

    /* import { Table, TableColumn,} from "element--ui";
    Vue.use(Table);
    Vue.use(TableColumn); */

    export default {
        name: "company-list",
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve,
            companyContent
        },
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: "",
                orderProperty: "c.ADD_TIME",
                orderType: "desc",
                tableData: [],
                multipleSelection: [],
                fuzzySearch: 0,
                isPut: true,
                // 所属行业信息表
                industryCategorys: [],
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
                sc: '',
                userId: "",
                allModules: {}, //所有模板
                resultCondition: [],
                retrieveCondition: [],
                collectionInfo: [],
                loading:false
            };
        },
        methods: {
            formatterCompanyType: function (row, column) {
                var companyTypes = {
                    1: "第一类别",
                    2: "第二类别",
                    3: "第三类别",
                    4: "第四类别",
                    5: "第五类别",
                    6: "第六类别"
                };
                return companyTypes[row.companyType];
            },
            formatterCompanyStatus(row, column) {
                var status = {1: "已审核", 0: "未审核"};
                return status[row.status];
            },

            getTableList() {
              this.loading=true;
                // if (this.searchKey || this.fuzzySearch === 1) {
                ajaxRequest(
                    "get",
                    "back/company/retrieve",
                    {
                        fuzzySearch: 1,
                        page: this.page,
                        rows: this.rows,
                        isDelete: 0,
                        orderProperty: this.orderProperty,
                        // 进行升序降序排列的标志
                        orderType: this.orderType,
                        total: 0,
                        sc: this.sc
                    },
                    res => {
                        if (res.code === 200) {
                            this.tableData = res.rows;
                            this.total = res.total;
                            this.multipleSelection = [];
                        }
                      this.loading=false;
                    }
                );
            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
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
            handleEdit(rowInfo) {
                !!rowInfo ? (this.isPut = true) : (this.isPut = false);
                this.edit = rowInfo || {};
            },
            handleDelete(data) {
                if (data.length > 0) {
                    let ids = data
                        .map(function (v) {
                            return v.id;
                        })
                        .join(",");
                    ajaxRequest(
                        "put",
                        "back/company/",
                        {
                            isDelete: 1,
                            id: ids
                        },
                        function (res) {
                            if (res.code === 200) {
                                this.$message.success("删除成功");
                                this.getTableList();
                            } else {
                                this.$message.error("删除失败");
                            }
                        }.bind(this)
                    );
                } else {
                    this.$message({
                        message: "请先选择要删除的数据",
                        type: "warning"
                    });
                }
            },
            handleEditCallback(rowInfo) {
                let _this = this;
                if (rowInfo) {
                    if (rowInfo.id) {
                        ajaxRequest(
                            "put",
                            "back/company/",
                            {
                                id: rowInfo.id,
                                category: rowInfo.category,
                                name: rowInfo.name,
                                value: rowInfo.value,
                                memo: rowInfo.memo
                            },
                            function (res) {
                                if (res.code === 200) {
                                    _this.$message.success("编辑成功");
                                    _this.edit = null;
                                    let roleList = _this.tableData;
                                    for (let i = 0, len = roleList.length; i < len; i++) {
                                        if (roleList[i].id === rowInfo.id) {
                                            _this.tableData.splice(i, 1, rowInfo);
                                            break;
                                        }
                                    }
                                } else {
                                    _this.$message.error("编辑失败");
                                }
                            }
                        );
                    } else {
                        ajaxRequest(
                            "post",
                            "back/company/",
                            {
                                category: rowInfo.category,
                                name: rowInfo.name,
                                value: rowInfo.value,
                                memo: rowInfo.memo
                            },
                            function (res) {
                                if (res.code === 200) {
                                    _this.$message.success("新增成功");
                                    _this.edit = null;
                                    _this.getTableList();
                                } else {
                                    _this.$message.error("新增失败");
                                }
                            }
                        );
                    }
                } else {
                    this.edit = null;
                    this.getTableList();
                    // this.getMounted();
                }
            },
            getIndustryCategory() {
                ajaxProxyRequest("get", "/njmind/findParam/industryCategory", {}, res => {
                    this.industryCategorys = res.list;
                });
            },
            industryValueFormat(row, column, cellValue, index) {
                let name = ''
                this.industryCategorys.forEach((item) => {
                    if (cellValue == item.code) {
                        name = item.remark;
                        return item.remark;
                    }
                })
                return name;
            }
        },
        mounted() {
            //判断是否从首页跳转进来,并设置默认查询条件
            let objFromIndex = this.$route.query;
            if (objFromIndex && objFromIndex.title) {
                let now = new Date();
                now.setDate(now.getDate() + 30);
                if (objFromIndex.title === "合同预警") {
                    this.collectionInfo = [{
                        name: '',
                        value: [{
                            comparison: "3",
                            nameCode: "contractValidateEnd",
                            sqlSeg: "c.CONTRACT_VALIDATE_END",
                            value: now.format("YYYY-MM-DD")
                        }]
                    }];
                }else if (objFromIndex.title === "客户拜访提醒") {
                    this.collectionInfo = [{
                        name: '',
                        value: [{
                            comparison: "3",
                            nameCode: "nextVisitDate",
                            sqlSeg: "visit.NEXT_VISIT_DATE",
                            value: now.format("YYYY-MM-DD")
                        }]
                    }];
                }

                setTimeout(res => {
                    this.QJAdvanceSearch();
                }, 0)
            }else {
                let userId = localStorage.getItem("userId");
                this.userId = userId;
                this.getTableList();
                this.QJGetMounted();
                this.getIndustryCategory();
            }
        },
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
        border: 2px solid #56bc4e8c;
        border-radius: 5px;
        color: dimgrey;
        margin-left: -301px;
        word-break: break-all;
        margin-top: 18px;
        padding: 0px 0px;
        font-size: 14px;
        opacity: 50;
        width: 320px;
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

    .color {
        color: red;
    }

    .companyName {
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
