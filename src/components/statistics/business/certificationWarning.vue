<template>
    <div style="position:relative;">
        <Retrieve ref="retrieve-wapper"
                  :rowsCondition='rowsCondition'
                  :sortBy="sortBy"
                  :order="order"
                  v-if="defaultOpen"
                  :paramJson="paramJson"
                  :retrieveCondition="retrieveCondition"
                  :collectionInfo="collectionInfo"/>

        <div style="display: flex;justify-content: space-between; margin:10px 0px;">
            <div style="display: inline-block;text-align: center">
                <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">查询
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
          </span>
        </div>
        <el-form ref="form" class="sampleForm">
            <div>
                <el-Row :gutter="20">
                    <el-col :span="3">
                        <el-form-item label="业务组" class="lbCenter"></el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="业务员" class="lbCenter"></el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="单位类型" class="lbCenter"></el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="合同客户" class="lbCenter"></el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="是否强检" class="lbCenter"></el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="有效期提醒" class="lbCenter"></el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="汇总方式" class="lbCenter"></el-form-item>
                    </el-col>
                </el-Row>
                <el-Row :gutter="20">
                    <el-col :span="3">
                        <el-form-item>
                            <el-select v-model="businessGroup" placeholder="请选择" @change="businessEvt">
                                <el-option
                                        v-for="item in businessGroupNames"
                                        :key="item.businessGroup"
                                        :label="item.businessGroupName"
                                        :value="item.businessGroup">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-select v-model="businessPerson" placeholder="请选择" @change="businessEvt">
                                <el-option
                                        v-for="item in staffs"
                                        :key="item.staff"
                                        :label="item.staffName"
                                        :value="item.staff">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-select v-model="companyType" placeholder="请选择">
                                <el-option
                                        v-for="item in companyTypeOptions"
                                        :key="item.code"
                                        :label="item.remark"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-select v-model="isContact" placeholder="请选择">
                                <el-option
                                        v-for="item in contactOptions"
                                        :key="item.code"
                                        :label="item.remark"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-select v-model="isStrongInspection" placeholder="请选择">
                                <el-option
                                        v-for="item in strongInspectionOptions"
                                        :key="item.code"
                                        :label="item.remark"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-select v-model="term" placeholder="请选择">
                                <el-option
                                        v-for="item in termOptions"
                                        :key="item.code"
                                        :label="item.remark"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-select v-model="summary" placeholder="请选择">
                                <el-option
                                        v-for="item in summaryOptions"
                                        :key="item.code"
                                        :label="item.remark"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-Row>
                <el-Row :gutter="20" style="text-align: center;margin:20px 0;">
                    <el-button class="el-button el-button--primary" @click="search">查询</el-button>
                    <el-button class="el-button el-button--primary" @click="exportList">导出</el-button>
                </el-Row>
            </div>
            <div>
                <el-table :max-height="QJTableMaxHeight"
                          ref="table"
                          :data="tableData"
                          border
                          style="width: 100%"
                          :fit="true">
                    <el-table-column prop="companyName" label="单位名称"></el-table-column>
                    <el-table-column prop="address" label="地址"></el-table-column>
                    <el-table-column prop="contactor" label="联系人"></el-table-column>
                    <el-table-column prop="mobileNum" label="联系方式"></el-table-column>
                    <el-table-column prop="jjcqsl" label="即将超期数量"></el-table-column>
                    <el-table-column prop="bussinesGroup" label="业务组"></el-table-column>
                    <el-table-column prop="userName" label="业务员"></el-table-column>
                    <el-table-column prop="jnzssl" label="当年证书数量" v-if="headObj.jnzssl"></el-table-column>
                    <el-table-column prop="qnzssl" label="去年证书数量" v-if="headObj.qnzssl"></el-table-column>
                    <el-table-column prop="ljsl" label="累计证书数量" v-if="headObj.ljsl"></el-table-column>
                </el-table>
            </div>
            <charts :list="tableData"></charts>
        </el-form>
    </div>
</template>

<script>
    import Vue from 'vue';
    //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
    import Vuex from 'vuex';
    //引入表格和分页插件
    //引入ajax工具
    import {ajaxRequest, ajaxProxyRequest} from '../../util/base';
    //引入jquery
    import $ from 'jquery';
    import Retrieve from "../../Retrieve";
    import WorkMould from "../../mould/WorkMould";
    import TableColumnHeader from "../../Table/TableColumnHeader";
    import paramJson from "./offerParam"; //同目录下json数据
    //引入报价弹层
    import offerForm from "./offerForm";
    import charts from "../department/charts"; //图表
    export default {
        name: "certificationWarning",//证书预警
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve,
            charts
        },
        data() {
            return {
                tableData: [],
                businessGroupNames: [],//业务组option
                staffs: [],//业务员option
                companyTypeOptions: [],//单位类别option
                contactOptions: [],//合同客户options
                strongInspectionOptions: [],//强检option
                termOptions: [],//有效期提醒option
                summaryOptions: [],//汇总字段option
                businessGroup: "",//业务组
                businessPerson: "",//业务员
                isContact: "",//是否合同客户
                companyType: "",//单位类别
                isStrongInspection: "",//是否强检
                term: "3",//有效期提醒
                summary: "1",//汇总字段

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
                defaultOpen: false, //默认开启高级查询
                sc: '',
                userId: "",
                allModules: {}, //所有模板
                resultCondition: [],
                retrieveCondition: [],
                collectionInfo: [],
            }
        },
        methods: {
            getTableList() {
                if (this.summary == "") {
                    this.$message.warning('汇总字段没有选择');
                    return;
                }
                ajaxRequest('get', 'back/statistics/zsWarning', {
                    isStrongInspection: this.isStrongInspection,//是否强检
                    ywz: this.businessGroup,//业务组
                    ywy: this.businessPerson,//业务员
                    contact: this.isContact,//是否合同客户
                    companyType: this.companyType,//单位类别
                    days: this.term,//有效期提醒
                    summary: this.summary,//汇总字段
                }, (res) => {
                    if (res.code === 200) {
                        this.tableData = res.rows;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },
            search() {
                this.getTableList();
            },
            setOptions() {
                this.strongInspectionOptions = [{"code": "1", "remark": "是"}, {"code": "0", "remark": "否"}, {
                    "code": "",
                    "remark": "全部"
                }];//强检option
                this.contactOptions = [{"code": "1", "remark": "是"}, {"code": "0", "remark": "否"}, {
                    "code": "",
                    "remark": "全部"
                }];//合同客户option
                this.companyTypeOptions = [{"code": "1", "remark": "第一类别"}, {
                    "code": "2",
                    "remark": "第二类别"
                }, {"code": "3", "remark": "第三类别"}, {"code": "4", "remark": "第四类别"}, {
                    "code": "5",
                    "remark": "第五类别"
                }, {"code": "6", "remark": "第六类别"},];//单位类别option
                this.termOptions = [{"code": "1", "remark": "30天"}, {"code": "2", "remark": "60天"}, {
                    "code": "3",
                    "remark": "90天"
                }];//有效期提醒option
                this.summaryOptions = [{"code": "1", "remark": "客户ID"}];//汇总方式option
                //获取业务组
                ajaxRequest(
                    "get",
                    "back/businessStaff/getBusinessGroupName",
                    {},
                    function (res) {
                        this.businessGroupNames = res;
                    }.bind(this)
                );
            },
            businessEvt(id) {//获取业务员
                ajaxRequest(
                    "get",
                    "back/businessStaff/StaffByBusinessGroupId?businessGroup=" + id,
                    {},
                    res => {
                        this.staffs = res;
                        Vue.set(this.form, "businessStaff", "");
                    }
                );
            },
            initDate() {//默认日期从上个月第一天到上个月最后一天
                var nowdays = new Date();
                var year = nowdays.getFullYear();
                var month = nowdays.getMonth();
                if (month == 0) {
                    month = 12;
                    year = year - 1;
                }
                if (month < 10) {
                    month = "0" + month;
                }
                this.startDate = year + "-" + month + "-" + "1";//上个月的第一天
                var myDate = new Date(year, month, 0);
                this.endDate = year + "-" + month + "-" + myDate.getDate();//上个月的最后一天
            },
            exportList() {//导出

            },
            dealDate: function (row, column, cellValue) {
                if (cellValue === "" || cellValue === null || cellValue === undefined) {
                    return "";
                } else {
                    return new Date(cellValue).format('YYYY-MM-DD');
                }
            },
        },
        mounted() {
            this.setOptions();
            this.initDate();
            //判断是否从首页跳转进来,并设置默认查询条件
            let objFromIndex = this.$route.query;
            if (objFromIndex && objFromIndex.title) {
                setTimeout(res => {
                    this.term = '2';
                    this.search();
                }, 0);
            } else {
                this.getTableList();
            }
        }
    }
</script>

<style scoped>
    .lbCenter > label {
        width: 100% !important;
        text-align: center !important;
        padding-right: 0 !important;
    }
</style>
