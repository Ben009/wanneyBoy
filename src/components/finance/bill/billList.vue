<template>
    <div style="position:relative;">
        <div style="margin-bottom:10px;">
            <Retrieve ref="retrieve-wapper"
                      :rowsCondition='rowsCondition'
                      :sortBy="sortBy"
                      :order="order"
                      v-if="defaultOpen"
                      :paramJson="paramJson"
                      :retrieveCondition="retrieveCondition"
                      :collectionInfo="collectionInfo"
            />
        </div>
        <div>
            <div style="display: flex;justify-content: space-between; margin:10px 0px;">
              <span></span>
              <div style="display: inline-block;text-align: center" v-if="defaultOpen">
                  <!--<el-button type="primary" @click="handelHistoryData" class="el-icon-search" >处理数据</el-button>-->
                  <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                  <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info">&nbsp;清空
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
                <global-tootips :width="600">
                  <p>1、有权限人员查询所有，无权限人员查询添加人或业务员为本人的记录；</p>
                  <p>2、在缴费单未进行申请开票、结账、关联到款等操作前，可由有权限人员删除，具体状态可进明细界面查看。</p>
                </global-tootips>
              </span>
            </div>
            <div style="padding-top: 5px;text-align: center">{{getLabel.JDF_ACTUAL}}合计：<span
              style="color: red;font-weight: bold;font-size: 16px;">{{jcfTotalMoney}}</span> &nbsp;&nbsp;&nbsp;&nbsp;缴费单金额合计：<span
              style="font-size: 16px;color: red;font-weight: bold">{{billTotalMoney}}</span>
            </div>
            <el-table :max-height="QJTableMaxHeight"
                      :data="tableData"
                      border
                      style="width: 100%"
                      @sort-change="handleSort" v-loading="loading"
                      @selection-change="handleSelectionChange">
                <el-table-column v-if="headObj.BILL_NO" prop="billNo" label="缴费单编号"></el-table-column>
                <el-table-column v-if="headObj.BILL_NAME" prop="billName" label="缴费单名称"></el-table-column>
                <el-table-column v-if="headObj.BUSINESS_STAFF" prop="businessStaff_name" label="业务员"></el-table-column>
                <el-table-column v-if="headObj.USER_NAME" prop="userName" label="添加人"></el-table-column>
                <el-table-column v-if="headObj.ADD_TIME" prop="addTime" label="添加时间"
                                 :formatter="handleDate"></el-table-column>
                <el-table-column v-if="headObj.TICKET_DATE" prop="ticketDate" label="结算日期"
                                 :formatter="handleDate"></el-table-column>
                <el-table-column v-if="headObj.CHECK_DATE" prop="checkDate" label="到账日期"
                                 :formatter="handleDate"></el-table-column>
                <el-table-column v-if="headObj.JDF_ACTUAL" prop="jdfActual" :label="getLabel.JDF_ACTUAL"></el-table-column>
                <el-table-column v-if="headObj.BILL_MONEY" prop="billMoney" label="总金额"></el-table-column>
                <el-table-column v-if="headObj.IS_DISCOUNT" prop="isDiscount" label="折扣">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isDiscount==0">未打折</span>
                        <span v-else-if="scope.row.isDiscount==1">折扣审核</span>
                        <span v-else>已审核</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.STATUS" prop="STATUS" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isTicket==0">未结账</span>
                        <span v-else-if="scope.row.isCheck==0">已结算</span>
                        <span v-else>已结账</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="60">
                    <template slot-scope="scope">
                        <el-button @click="handleModify(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                                class="el-icon-edit-outline" title="编辑"></i></el-button>
                        <el-button v-has="'M32102'"
                                   v-mindPopover="{message:'确定删除该缴费单?',success:handleDelete.bind(this,[scope.row]),isOpen:handleOpen.bind(this,scope.row)}"
                                   type="text" style="padding:0;font-size:18px;"><i
                                class="el-icon-delete" title="删除"></i></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="padding-top: 5px;text-align: center">{{getLabel.JDF_ACTUAL}}合计：<span
              style="color: red;font-weight: bold;font-size: 16px;">{{jcfTotalMoney}}</span> &nbsp;&nbsp;&nbsp;&nbsp;缴费单金额合计：<span
              style="font-size: 16px;color: red;font-weight: bold">{{billTotalMoney}}</span>
            </div>
        </div>
        <div style="margin-top:10px;text-align:center; float:right;">
            <mind-pagination
                    :current-page="page"
                    :page-size="rows"
                    :total="total"
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange">
            </mind-pagination>
        </div>
        <billDetailForm v-if="!!modify" :data="modify" :callback="handleEditCallback"></billDetailForm>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Vuex from 'vuex';
    import $ from 'jquery';
    import {ajaxRequest} from '../../util/base';
    import Retrieve from '../../Retrieve';
    import WorkMould from '../../mould/WorkMould';
    import TableColumnHeader from '../../Table/TableColumnHeader';
    import billDetailForm from './billDetailForm';
    import paramJson from './bill'    //同目录下json数据

    export default {
        name: "billList",
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: '',
                orderProperty: 'b.id',
                orderType: 'desc',
                tableData: [],
                multipleSelection: [],
                fuzzySearch: 0,

                isSetting: 0,  //控制个性化设置弹窗是否展示
                edit: null,   //控制新增弹窗是否展示
                modify: null,   //控制修改弹窗是否展示
                isInner: 0,
                loading: false,

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
                jcfTotalMoney: 0,//检测费金额合计
                billTotalMoney: 0,//缴费单金额合计
            }
        },
        methods: {
            handleDate: function (row, column, cellValue) {
                if (cellValue != null && cellValue != "") {
                    return new Date(cellValue).format('YYYY-MM-DD');
                }
            },
            handleSort: function (column, prop, order) {
                this.orderProperty = column['prop'];
                if (column['order'] == 'descending') {
                    this.orderType = 'desc';
                } else {
                    this.orderType = 'asc';
                }
                this.getTableList();
            },
            getTableList() {
                this.loading = true;
                ajaxRequest('get', 'back/bill/retrieve', {
                    fuzzySearch: 1,
                    page: this.page,
                    rows: this.rows,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    total: 0,
                    sc: this.sc,
                }, (res) => {
                    if (res.code === 200) {
                        this.tableData = res.rows;
                        this.total = res.total;
                        this.multipleSelection = [];
                        this.jcfTotalMoney= res.map.JDF_ACTUAL;
                        this.billTotalMoney=res.map.BILL_MONEY;
                    }
                    this.loading = false;
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //每页显示条数切换加载数据
            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size;
                this.getTableList();
            },
            //页码切换加载数据
            handleCurrentPageChange(currentPage) {
                this.page = currentPage;
                this.getTableList();
            },
            //详情页面
            handleModify(rowInfo) {
                this.modify = rowInfo || {}
            },
            //新增页面
            handleEdit(rowInfo) {
                this.edit = rowInfo || {}
            },
            handleEditCallback(res) {
                let _this = this;
                if (res) {
                    if (res.code === 200) {
                        _this.$message.success('编辑成功');
                        _this.edit = null;
                        _this.modify = null;
                        _this.getTableList();
                    }
                    else {
                        _this.$message.error('编辑失败');
                    }
                }
                else {
                    this.edit = null;
                    this.modify = null;
                    _this.getTableList();
                }
            },
            //删除缴费单
            handleOpen(data) {
                if (data.isCheck == '1') {
                    this.$message.error('缴费单已经结账，不可删除！');
                    return false;
                }
                if (data.isTicket == '1') {
                    this.$message.error('缴费单已经开票，不可删除！');
                    return false;
                }
                if (data.isLinkPayment == '1') {
                    this.$message.error('缴费单已经关联到款，不可删除！');
                    return false;
                }
                if (data.isTicketApply == '1') {
                    this.$message.error('缴费单已经申请预开票，不可删除！');
                    return false;
                }
                if (data.isLinkTicket == '1') {
                    this.$message.error('缴费单已经关联发票，不可删除！');
                    return false;
                }
                if (data.isDiscount == '1') {
                    this.$message.error('缴费单处于折扣审核状态，不可删除！');
                    return false;
                }
                return true;
            },
            handleDelete(data) {
                if (data.length > 0) {
                    let ids = data.map(function (v) {
                        return v.id
                    }).join(",");
                    ajaxRequest('post', 'back/bill/list/' + ids, {_method: 'delete'}, function (res) {
                        if (res.code === 200) {
                            this.$message.success('删除成功');
                            this.getTableList();
                        }
                        else {
                            this.$message.error('删除失败');
                        }
                    }.bind(this))
                } else {
                    this.$message({
                        message: '请先选择要删除的缴费单',
                        type: 'warning'
                    })
                }
            },
            handelHistoryData() {
                ajaxRequest('post', 'back/bill/handleSjdJzInfo', {}, function (res) {
                    if (res.code === 200) {
                        this.$message.success('数据处理成功');
                    }
                    else {
                        this.$message.error('数据处理失败');
                    }
                });
            },
        },
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve,
            billDetailForm
        },
        mounted() {
            let userId = localStorage.getItem("userId");
            this.userId = userId;
            this.getTableList();
            this.QJGetMounted();
        },
      computed: {
        getLabel() {
          var obj = {};
          this.paramJson.forEach(v => {
            obj[v.nameCode] = v.name;
          });
          return obj;
        }
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

    .el-icon-setting {
        background: none !important;
        border: none !important;
        color: #3094e0 !important;
    }

    .el-icon-setting:hover {
        color: #3094e0 !important;
    }
</style>
