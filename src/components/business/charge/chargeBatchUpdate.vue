<template>
    <div style="position:relative;">
        <div style="margin-bottom:10px;" v-if="defaultOpen">
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
                <span></span>
                <div style="display: inline-block;text-align: center" v-if="defaultOpen">
                    <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询</el-button>
                    <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info">&nbsp;清空</el-button>
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
            <global-tootips>
                <p> 1、批量修改不设置折扣审核权限，所有折扣、总收直接生效；</p>
                <p> 2、强检器具应维护为不可打折，此节点仅根据是否可打折进行判断是否可进行折扣、总收设置；</p>
            </global-tootips>
          </span>
            </div>
            <el-table :data="tableData" :max-height="QJTableMaxHeight" v-if="finish" v-loading="loading"
                      border
                      style="width: 100%"
                      @sort-change="handleSort"
                      show-summary
                      @selection-change="handleSelectionChange"
                      :summary-method="getSummaries"
                      ref="multipleTable">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column v-if="headObj.orderNo" prop="orderNo" label="委托单号"></el-table-column>
                <el-table-column v-if="headObj.companyName" prop="companyName" label="委托单位"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column v-if="headObj.registrationNo" prop="registrationNo" label="登记号"></el-table-column>
                <el-table-column v-if="headObj.applianceName" prop="applianceName" label="器具名称"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column v-if="headObj.setNumber" prop="setNumber" label="套数"></el-table-column>
                <el-table-column v-if="headObj.isDiscount" prop="isDiscount" label="是否允许打折"
                                 :formatter="handIsDiscount"></el-table-column>
                <el-table-column v-if="headObj.isCompulsoryVerify" prop="isCompulsoryVerify" label="是否强检"
                                 :formatter="handIsCompulsoryVerify"></el-table-column>
                <el-table-column v-if="headObj.detectionFee" prop="detectionFee" label="收费标准"></el-table-column>
                <el-table-column v-if="headObj.totalFee" prop="totalFee" label="应收费合计"></el-table-column>
                <el-table-column v-if="headObj.commissionerName" prop="commissionerName" label="检定员"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column v-if="headObj.discount" prop="discount" label="折扣"></el-table-column>
                <el-table-column v-if="headObj.JDF_ACTUAL" prop="jdfActual"
                                 :label="getLabel.JDF_ACTUAL"></el-table-column>
                <el-table-column v-if="headObj.FJF_ACTUAL" prop="jjfActual"
                                 :label="getLabel.FJF_ACTUAL"></el-table-column>
                <el-table-column v-if="headObj.JJF_ACTUAL" prop="fjfActual"
                                 :label="getLabel.JJF_ACTUAL"></el-table-column>
                <el-table-column v-if="headObj.XLF_ACTUAL" prop="xlfActual"
                                 :label="getLabel.XLF_ACTUAL"></el-table-column>
                <el-table-column v-if="headObj.FWF_ACTUAL" prop="fwfActual"
                                 :label="getLabel.FWF_ACTUAL"></el-table-column>
                <el-table-column v-if="headObj.QTF_ACTUAL" prop="qtfActual"
                                 :label="getLabel.QTF_ACTUAL"></el-table-column>
                <el-table-column v-if="headObj.WORKLOAD_ACTUAL" prop="workloadActual"
                                 :label="getLabel.WORKLOAD_ACTUAL"></el-table-column>
                <el-table-column v-if="headObj.INTENSIVE_WORKLOAD_ACTUAL" prop="intensiveWorkloadActual"
                                 :label="getLabel.INTENSIVE_WORKLOAD_ACTUAL"></el-table-column>
                <el-table-column v-if="headObj.TOTAL_ACTUAL" prop="totalActual"
                                 :label="getLabel.TOTAL_ACTUAL"></el-table-column>

            </el-table>
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
        <div style="font-size: 15px;padding-top: 5px">可打折费用合计：<span
                style="color: red;font-weight: bold">{{discountSum}}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;不可打折费用合计：<span style="color: red;font-weight: bold">{{undiscountSum}}</span></div>
        <div style="padding-top: 20px;padding-bottom:10px;">
            <div class="title-item"><span>打折区域</span></div>
            <el-row style="margin-top: 10px;margin-bottom: 100px">
                <el-col :span="8">
                    检测费折扣：
                    <el-input v-model="jcf_zk" style=" width: 130px;" @change="verificateZkValue"></el-input>
                    <el-button size="mini" type='primary'
                               v-mindPopover="{message:'确定检测费打折?',success:doDiscount.bind(this,2),isOpen:handleOpen.bind(this)}">
                        检测费折扣
                    </el-button>
                </el-col>
                <el-col :span="8">
                    所有费折扣：
                    <el-input v-model="total_zk" style=" width: 130px;" @change="verificateZkValue"></el-input>
                    <el-button size="mini" type='primary'
                               v-mindPopover="{message:'确定所有费用打折?',success:doDiscount.bind(this,1),isOpen:handleOpen.bind(this)}">
                        所有费折扣
                    </el-button>
                </el-col>
                <el-col :span="8">
                    总收
                    <el-tooltip class="item" effect="dark" :content="'此处指的是可打折费用总收'">
                        <i class="el-icon-info ft12"></i>
                    </el-tooltip>
                    ：
                    <el-input v-model="totalMoney" style=" width: 130px;" @change="verificateZkValue"></el-input>
                    <el-button size="mini" type='primary'
                               v-mindPopover="{message:'确定设置总收?',success:doDiscount.bind(this,3),isOpen:handleOpen.bind(this)}">
                        总收
                    </el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Vuex from 'vuex';
    import $ from 'jquery';
    import {ajaxRequest, ajaxProxyRequest} from '../../util/base';
    import Retrieve from '../../Retrieve';
    import WorkMould from '../../mould/WorkMould';
    import TableColumnHeader from '../../Table/TableColumnHeader';
    import paramJson from './chargeBatchUpdateJs';    //同目录下json数据
    export default {
        name: "charge-batch-update",
        data() {
            return {
                finish: true,
                page: 1,
                rows: 100,
                total: 0,
                searchKey: '',
                orderProperty: 'c.id',
                orderType: 'desc',
                tableData: [],
                multipleSelection: [],
                jcf_zk: 1,
                total_zk: 1,
                totalMoney: 0,
                defaultInfo: {},//初始化页面字段名称

                isSetting: 0, //控制个性化设置弹窗是否展示
                edit: null, //控制编辑弹窗是否展示
                isInner: 0,

                discountSum: 0,//可打折费用合计
                undiscountSum: 0,//不可打折费用合计

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
                loading: false
            }
        },
        methods: {
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
                ajaxRequest('get', 'back/charge/getChargeListForUpdate', {
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
                        this.$nextTick(_ => {
                            this.chooseAll();
                            this.getDiscountAndUnDiscountSum();
                        })
                    }
                    this.loading = false;
                })
            },
            //每页显示条数切换加载数据
            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size;
                this.getTableList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.getDiscountAndUnDiscountSum();
            },
            //页码切换加载数据
            handleCurrentPageChange(currentPage) {
                this.page = currentPage;
                this.getTableList();
            },
            //处理列表显示
            handIsDiscount: function (row, column) {//检测费
                if (row.isDiscount == 1) {
                    return '可打折';
                } else if (row.isDiscount == 0) {
                    return '不可打折';
                }
            },
            //是否强检
            handIsCompulsoryVerify: function (row, column) {
                if (row.isCompulsoryVerify == 1) {
                    return '强检';
                } else {
                    return '非强检';
                }
            },
            /*//是否可打折
            judgeCanZk: function(row, column){
              if(row.isDiscount == 0){
                return false;
              }else{
                return true;
              }
            },*/
            //折扣输入值验证
            verificateZkValue() {
                let regu = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;//正数
                if (this.jcf_zk != "") {
                    if (!regu.test(this.jcf_zk)) {
                        this.jcf_zk = parseFloat(1.00).toFixed(2);
                    } else {
                        if (this.jcf_zk === 0) {
                            this.jcf_zk = parseFloat(1.00).toFixed(2);
                        } else {
                            this.jcf_zk = parseFloat(this.jcf_zk).toFixed(2);
                        }
                    }
                }
                if (this.total_zk != "") {
                    if (!regu.test(this.total_zk)) {
                        this.total_zk = parseFloat(1.00).toFixed(2);
                    } else {
                        if (this.total_zk === 0) {
                            this.total_zk = parseFloat(1.00).toFixed(2);
                        } else {
                            this.total_zk = parseFloat(this.total_zk).toFixed(2);
                        }
                    }
                }
                if (this.totalMoney != "") {
                    if (!regu.test(this.totalMoney)) {
                        this.totalMoney = parseFloat(1.00).toFixed(2);
                    } else {
                        if (this.totalMoney === 0) {
                            this.totalMoney = parseFloat(1.00).toFixed(2);
                        } else {
                            this.totalMoney = parseFloat(this.totalMoney).toFixed(2);
                        }
                    }
                }
            },

            //打折操作
            doDiscount(type) {
                let _this = this;
                let zkValue = 0;
                let totalMoney = 0;
                let balance = 0;
                if (type === 1) {//所有费用折扣
                    zkValue = this.total_zk;
                } else if (type === 2) {//检测费折扣
                    zkValue = this.jcf_zk;
                } else if (type === 3) {//总收
                    totalMoney = this.totalMoney;
                    zkValue = (this.totalMoney / this.discountSum).toFixed(2);
                    balance = totalMoney - zkValue * this.discountSum;
                } else {
                    return;
                }
                if (this.multipleSelection.length > 0) {
                    let ids = this.multipleSelection.map(function (v) {
                        if (v.isDiscount == 1) {
                            return v.registrationNo
                        }
                    }).join(",");
                    ajaxRequest('post', 'back/charge/doDiscount/', {
                        registrationNos: ids,
                        zkType: type,
                        zkValue: zkValue,
                        totalMoney: totalMoney,
                        balance: balance
                    }, function (res) {
                        if (res.code === 200) {
                            if (res.msg != "" && res.msg != null) {
                                _this.$message.error(res.msg);
                            } else {
                                _this.$message.success('打折成功！');
                            }
                            _this.getTableList();
                        }
                    }.bind(this));
                } else {
                    this.$message.error('请先选择要打折的送检单！');
                }
            },
            handleOpen() {
                if (this.multipleSelection.length > 0) {
                    return true;
                } else {
                    this.$message.error('请先选择要打折的送检单！');
                    return false;
                }
            },
            chooseAll() {//全选
                for (let i = 0; i < this.tableData.length; i++) {
                    this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true);
                }
            },


            checkAll: function (selection) {
                this.multipleSelection = [];
                selection.forEach((e) => {
                    if (e.isDiscount == 0) {//不可打折
                    } else {
                        this.multipleSelection.push(e)
                    }
                });
                console.log(this.multipleSelection)
            },

            //合计行
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];

                columns.forEach((column, index) => {

                    if (index === 1) {
                        sums[index] = '合计';
                        return;
                    }

                    if (column.property === 'orderNo' || column.property === 'companyName' || column.property === 'registrationNo'
                        || column.property === 'applianceName' || column.property === 'isDiscount' || column.property === 'commissionerName'
                        || column.property === 'discount' || column.property === 'isCompulsoryVerify' || column.property === 'detectionFee') {
                        sums[index] = '';
                        return;
                    }

                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return (prev * 1 + curr * 1).toFixed(2);
                            } else {
                                return (prev * 1).toFixed(2);
                            }
                        }, 0);
                    } else {
                        sums[index] = '';
                    }
                });
                return sums;
            },

            getDiscountAndUnDiscountSum() {
                this.undiscountSum = 0;
                this.discountSum = 0;
                this.multipleSelection.forEach((e) => {
                    if (e.isDiscount == 1) {
                        this.discountSum += e.totalFee;
                    } else {
                        this.undiscountSum += e.totalFee;
                    }
                })
                this.totalMoney = this.discountSum;
            },
        },
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve
        },
        mounted() {
            let userId = localStorage.getItem("userId");
            this.userId = userId;
            this.QJGetMounted()
            let _this = this;
            /*ajaxProxyRequest('get','/njmind/findParams/fee1$fee2$fee3$fee4$fee5$fee6$fee7$fee8$fee9',{},(res)=>{
              _this.defaultInfo = {
                fee1:res.fee1.value,
                fee2:res.fee2.value,
                fee3:res.fee3.value,
                fee4:res.fee4.value,
                fee5:res.fee5.value,
                fee6:res.fee6.value,
                fee7:res.fee7.value,
                fee8:res.fee8.value,
                fee9:res.fee9.value,
              }
              this.finish = false;
              this.$nextTick(val => {
                this.finish = true;
              })
            })*/
        },
        computed: {
            getLabel() {
                var obj = {};
                this.paramJson.forEach(v => {
                    obj[v.nameCode] = v.name;
                });
                console.log(obj);
                return obj;
            }
        }
    }
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
