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
                    <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search">查询 </el-button>
                    <el-button type="warning" @click="QJEmptyCondition" class="el-icon-info"> &nbsp;清空 </el-button>
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
            <global-tootips style="float: right;margin: 5px;">
                <p> 1、无权限人员仅可查询与本人相关的记录，有部门权限查询全部门，有所有权限查询所有；</p>
                <p> 2、当登记号未结算、未处于审核过程中时，有权限人员可以修改费用或申请打折；</p>
                <p> 3、相关费用字段如（A/B）：A为应收，B为实收；</p>
            </global-tootips>
          </span>
            </div>
            <el-table :max-height="QJTableMaxHeight" :data="tableData" border style="width: 100%;table-layout: fixed;"
                      @sort-change="handleSort" v-loading="loading">
                <el-table-column v-if="headObj.REGISTRATION_NO" prop="REGISTRATION_NO" label="登记号"></el-table-column>
                <el-table-column v-if="headObj.ORDER_NO" prop="ORDER_NO" label="委托单号"></el-table-column>
                <el-table-column v-if="headObj.COMPANY_NAME" prop="COMPANY_NAME" label="委托单位"></el-table-column>
                <el-table-column v-if="headObj.APPLIANCE_NAME" prop="APPLIANCE_NAME" label="器具名称"></el-table-column>
                <el-table-column v-if="headObj.DEPART_NAME" prop="DEPART_NAME" label="检测部门"></el-table-column>
                <el-table-column v-if="headObj.POST_NAME" prop="POST_NAME" label="检测岗位"></el-table-column>
                <!--<el-table-column v-if="headObj.REGISTRATION_NO"  prop="applianceName" label="流转单" ></el-table-column>-->
                <el-table-column v-if="headObj.ORDER_SINGLE_NO" prop="ORDER_SINGLE_NO" label="流转单号"></el-table-column>
                <el-table-column v-if="headObj.ORDER_SINGLE_NO" prop="ORDER_SINGLE_NO" label="套数"></el-table-column>
                <el-table-column v-if="headObj.PIECE_NUMBER" prop="PIECE_NUMBER" label="件/套"></el-table-column>
                <el-table-column v-if="headObj.CERTIFICATE_NUMBER" prop="CERTIFICATE_NUMBER"
                                 label="证书数量"></el-table-column>
                <el-table-column v-if="headObj.SERVICE_DATE" prop="SERVICE_DATE" label="受理日期">
                    <template slot-scope="scope">
                        {{scope.row.SERVICE_DATE | dateyymmdd}}
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.ENTRUST_DATE" prop="ENTRUST_DATE" label="委托日期">
                    <template slot-scope="scope">
                        {{scope.row.ENTRUST_DATE | dateyymmdd}}
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.DETECTION_DEADLINE" prop="DETECTION_DEADLINE" label="检测期限">
                    <template slot-scope="scope">
                        {{scope.row.DETECTION_DEADLINE | dateyymmdd}}
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.FINISH_DATE" prop="FINISH_DATE" label="完成日期">
                    <template slot-scope="scope">
                        {{scope.row.FINISH_DATE | dateyymmdd}}
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.SETTLEMENT_DATE" prop="SETTLEMENT_DATE" label="结算日期">
                    <template slot-scope="scope">
                        {{scope.row.SETTLEMENT_DATE | dateyymmdd}}
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.SETTLE_ACCOUNTS_DATE" prop="SETTLE_ACCOUNTS_DATE" label="结账日期">
                    <template slot-scope="scope">
                        {{scope.row.SETTLE_ACCOUNTS_DATE | dateyymmdd}}
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.IS_URGENT" prop="IS_URGENT" label="是否加急">
                    <template slot-scope="scope">
                        <span v-if="scope.row.IS_URGENT=='0'">否</span>
                        <span v-else>{{scope.row.IS_URGENT}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.CERTIFICATE_TYPE" prop="CERTIFICATE_TYPE" label="服务类型"></el-table-column>
                <el-table-column prop="COMMISSIONER_NAME" label="检定员">
                    <template slot-scope="scope">
                <span v-if="scope.$index+1 ===tableData.length" style="font-size: 16px;font-weight: bolder">
                  {{scope.row.COMMISSIONER_NAME}}
                </span>
                        <span v-else>{{scope.row.COMMISSIONER_NAME}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="JDF_ACTUAL" :label="getLabel.JDF_ACTUAL">
                    <template slot-scope="scope">
                <span v-if="scope.$index+1 ===tableData.length" style="font-size: 16px;font-weight: bolder">
                  {{scope.row.JDF}}/{{scope.row.JDF_ACTUAL}}
                </span>
                        <span v-else>{{scope.row.JDF}}/{{scope.row.JDF_ACTUAL}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="FJF_ACTUAL" :label="getLabel.FJF_ACTUAL">
                    <template slot-scope="scope">
                <span v-if="scope.$index+1 ===tableData.length" style="font-size: 16px;font-weight: bolder">
                  {{scope.row.FJF}}/{{scope.row.FJF_ACTUAL}}
                </span>
                        <span v-else>{{scope.row.FJF}}/{{scope.row.FJF_ACTUAL}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="JJF_ACTUAL" :label="getLabel.JJF_ACTUAL">
                    <template slot-scope="scope">
                    <span v-if="scope.$index+1 ===tableData.length" style="font-size: 16px;font-weight: bolder">
                      {{scope.row.JJF}}/{{scope.row.JJF_ACTUAL}}
                    </span>
                        <span v-else>{{scope.row.JJF}}/{{scope.row.JJF_ACTUAL}}</span>

                    </template>
                </el-table-column>
                <el-table-column prop="XLF_ACTUAL" :label="getLabel.XLF_ACTUAL">
                    <template slot-scope="scope">
                <span v-if="scope.$index+1 ===tableData.length" style="font-size: 16px;font-weight: bolder">
                  {{scope.row.XLF}}/{{scope.row.XLF_ACTUAL}}
                </span>
                        <span v-else>{{scope.row.XLF}}/{{scope.row.XLF_ACTUAL}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="FWF_ACTUAL" :label="getLabel.FWF_ACTUAL">
                    <template slot-scope="scope">
                <span v-if="scope.$index+1 ===tableData.length" style="font-size: 16px;font-weight: bolder">
                  {{scope.row.FWF}}/{{scope.row.FWF_ACTUAL}}
                </span>
                        <span v-else>{{scope.row.FWF}}/{{scope.row.FWF_ACTUAL}}</span>

                    </template>
                </el-table-column>
                <el-table-column prop="QTF_ACTUAL" :label="getLabel.QTF_ACTUAL">
                    <template slot-scope="scope">
                <span v-if="scope.$index+1 ===tableData.length" style="font-size: 16px;font-weight: bolder">
                  {{scope.row.QTF}}/{{scope.row.QTF_ACTUAL}}
                </span>
                        <span v-else>{{scope.row.QTF}}/{{scope.row.QTF_ACTUAL}}</span>

                    </template>
                </el-table-column>
                <el-table-column prop="WORKLOAD_ACTUAL" :label="getLabel.WORKLOAD_ACTUAL">
                    <template slot-scope="scope">
                <span v-if="scope.$index+1 ===tableData.length" style="font-size: 16px;font-weight: bolder">
                  {{scope.row.WORKLOAD}}/{{scope.row.WORKLOAD_ACTUAL}}
                </span>
                        <span v-else>{{scope.row.WORKLOAD}}/{{scope.row.WORKLOAD_ACTUAL}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="INTENSIVE_WORKLOAD_ACTUAL" :label="getLabel.INTENSIVE_WORKLOAD_ACTUAL">
                    <template slot-scope="scope">
                <span v-if="scope.$index+1 ===tableData.length" style="font-size: 16px;font-weight: bolder">
                  {{scope.row.INTENSIVE_WORKLOAD}}/{{scope.row.INTENSIVE_WORKLOAD_ACTUAL}}
                </span>
                        <span v-else>{{scope.row.INTENSIVE_WORKLOAD}}/{{scope.row.INTENSIVE_WORKLOAD_ACTUAL}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="TOTAL_ACTUAL" :label="getLabel.TOTAL_ACTUAL">
                    <template slot-scope="scope">
                <span v-if="scope.$index+1 ===tableData.length" style="font-size: 16px;font-weight: bolder">
                  {{scope.row.TOTAL_FEE}}/{{scope.row.TOTAL_ACTUAL}}
                </span>
                        <span v-else>{{scope.row.TOTAL_FEE}}/{{scope.row.TOTAL_ACTUAL}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.DISCOUNT" prop="DISCOUNT" label="折扣"></el-table-column>
                <el-table-column v-if="headObj.TICKET_NO" prop="TICKET_NO" label="发票号"></el-table-column>
                <el-table-column v-if="headObj.DETECTION_METHOD" prop="DETECTION_METHOD" label="检测方式">
                    <template slot-scope="scope">
                        <span v-if="scope.row.DETECTION_METHOD=='0'">上门</span>
                        <span v-if="scope.row.DETECTION_METHOD=='1'">送检</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.TASK_SOURCE" prop="TASK_SOURCE" label="任务来源"></el-table-column>
                <el-table-column v-if="headObj.INSTITUTIONAL_NATURE" prop="INSTITUTIONAL_NATURE"
                                 label="机构性质"></el-table-column>
                <el-table-column v-if="headObj.CREDIT_CODE" prop="CREDIT_CODE" label="统一社会信用代码"></el-table-column>
                <el-table-column v-if="headObj.CONTRACT_NO" prop="CONTRACT_NO" label="合同号"></el-table-column>
                <!--<el-table-column v-if="headObj.REGISTRATION_NO"  prop="applianceName" label="合同签署人" ></el-table-column>-->
                <el-table-column v-if="headObj.CERTIFICATE_FIRST_PRINT_TIME" prop="CERTIFICATE_FIRST_PRINT_TIME"
                                 label="证书打印日期">
                    <template slot-scope="scope">
                        {{scope.row.CERTIFICATE_FIRST_PRINT_TIME | dateyymmdd}}
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.ADDRESS" prop="ADDRESS" label="委托单位地址"></el-table-column>
                <el-table-column v-if="headObj.ADMINISTRATIVE_AREA" prop="ADMINISTRATIVE_AREA"
                                 label="行政区划"></el-table-column>
                <el-table-column v-if="headObj.CONTACTER" prop="CONTACTER" label="联系人"></el-table-column>
                <el-table-column v-if="headObj.TELEPHONE" prop="TELEPHONE" label="联系电话"></el-table-column>
                <el-table-column v-if="headObj.MOBILE_PHONE" prop="MOBILE_PHONE" label="手机号码"></el-table-column>
                <el-table-column v-if="headObj.SPECIAL_REQUIREMENT" prop="SPECIAL_REQUIREMENT"
                                 label="整单备注"></el-table-column>
                <el-table-column v-if="headObj.MODEL" prop="MODEL" label="型号规格"></el-table-column>
                <el-table-column v-if="headObj.DETECTION_PARAMETER" prop="DETECTION_PARAMETER"
                                 label="检测参数"></el-table-column>
                <el-table-column v-if="headObj.FACTORY_NO" prop="FACTORY_NO" label="出厂编号"></el-table-column>
                <el-table-column v-if="headObj.EQUIPMENT_NO" prop="EQUIPMENT_NO" label="设备编号"></el-table-column>
                <el-table-column v-if="headObj.MANUFACTURER" prop="MANUFACTURER" label="制造厂商"></el-table-column>
                <!--<el-table-column v-if="headObj.REGISTRATION_NO"  prop="" label="附件" ></el-table-column>-->
                <el-table-column v-if="headObj.POWER_TYPES" prop="POWER_TYPES" label="电源类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.POWER_TYPES=='0'">无</span>
                        <span v-if="scope.row.POWER_TYPES=='1'">110v</span>
                        <span v-if="scope.row.POWER_TYPES=='2'">220v</span>
                        <span v-if="scope.row.POWER_TYPES=='3'">380v</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.IS_REPAIR" prop="IS_REPAIR" label="是否调修">
                    <template slot-scope="scope">
                        <span v-if="scope.row.IS_REPAIR=='0'">否</span>
                        <span v-if="scope.row.IS_REPAIR=='1'">是</span>
                        <span v-if="scope.row.IS_REPAIR=='2'">咨询</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.IS_DOUBLE_NUMBER" prop="IS_DOUBLE_NUMBER" label="是否双编号">
                    <template slot-scope="scope">
                        <span v-if="scope.row.IS_DOUBLE_NUMBER=='0'">否</span>
                        <span v-if="scope.row.IS_DOUBLE_NUMBER=='1'">是</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.SUBCONTRACT_AREA" prop="SUBCONTRACT_AREA" label="是否分包">
                    <template slot-scope="scope">
                        <span v-if="scope.row.IS_REPAIR=='0'">非分包</span>
                        <span v-else>{{scope.row.IS_REPAIR}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.REMARK" prop="REMARK" label="备注"></el-table-column>
                <el-table-column v-if="headObj.IS_COMPULSORY_VERIFY" prop="IS_COMPULSORY_VERIFY" label="是否强检">
                    <template slot-scope="scope">
                        <span v-if="scope.row.IS_COMPULSORY_VERIFY=='0'">否</span>
                        <span v-if="scope.row.IS_COMPULSORY_VERIFY=='1'">是</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="headObj.APPLIANCE_USE" prop="APPLIANCE_USE_NAME" label="器具用途"></el-table-column>
                <el-table-column label="操作" min-width="50">
                    <template slot-scope="scope">
                        <template v-if="scope.row.REGISTRATION_NO!=null">
                            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                                    class="el-icon-edit-outline" title="详情"></i></el-button>
                        </template>
                    </template>
                </el-table-column>
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
        <!--费用修改弹窗页面-->
        <chargeModify v-if="!!edit" :djhData="edit" :callback="handleEditCallback"></chargeModify>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Vuex from 'vuex';
    import $ from 'jquery';
    import {ajaxRequest, ajaxProxyRequest, formatDate, ajaxSyncProxyRequest} from '../../util/base';
    import Retrieve from '../../Retrieve';
    import WorkMould from '../../mould/WorkMould';
    import TableColumnHeader from '../../Table/TableColumnHeader';
    import paramJson from './chargeListJs';    //同目录下json数据
    import chargeModify from './chargeModify';

    export default {
        name: "charge-list",
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: '',
                orderProperty: 'c.id',
                orderType: 'desc',
                tableData: [],
                fuzzySearch: 0,
                defaultInfo: {},//初始化页面字段名称

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
          //获取列表事件
          getTableList() {
              this.loading = true;
              ajaxRequest('get', 'back/charge/retrieveForQuery', {
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
                  }
                  this.loading = false
              })
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
          handleEdit(rowInfo) {
              //获取基本数据
              ajaxRequest("get", "back/entrustSjd/getEntrustSjdDetails", {registrationNo: rowInfo.REGISTRATION_NO}, res => {
                  if (res.code === 200) {
                      if (res.rows.length > 0) {
                          this.edit = res.rows[0];
                      } else {
                          this.$message.error("异常数据，请先刷新列表信息！");
                      }
                  } else {
                      this.$message.error("异常数据，请先刷新列表信息！");
                  }
              });
          },
          //关闭回调方法
          handleEditCallback() {
              this.edit = null;
              this.getTableList();
          },

        },
        components: {
            WorkMould,
            TableColumnHeader,
            Retrieve,
            chargeModify
        },
        filters: {
            datehhmmss(myInput) {
                return formatDate(myInput, "YYYY-MM-DD hh:mm:ss");
            },
            dateyymmdd(myInput) {
                return formatDate(myInput, "YYYY-MM-DD");
            }
        },
        mounted() {
            let userId = localStorage.getItem("userId");
            this.userId = userId;
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
