<template>
    <div>
        <!--很多条件那个-->
        <div style="margin-bottom:10px;">
            <!-- <Retrieve v-if="defaultOpen" ref="retrieve-wapper" :rowsCondition='rowsCondition' :sortBy="sortBy"
                      :order="order" @toparentevent="advanceSearch"/> -->
            <Retrieve ref="retrieve-wapper"
                      v-if="defaultOpen"
                      :rowsCondition='rowsCondition'
                      :sortBy="sortBy"
                      :order="order"
                      :paramJson="paramJson"
                      :retrieveCondition="retrieveCondition"
                      :collectionInfo="collectionInfo"/>
        </div>

        <div style="margin: 10px 0px">

            <!--************************************************************************************-->
            <div style="display: flex;justify-content: space-between; margin:10px 0px;">
                <el-button style="opacity:0;" size="small" type="primary" icon="el-icon-plus"></el-button>
                <div style="display: inline-block;text-align: center">
                    <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">查询
                    </el-button>
                    <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning" v-if="defaultOpen">
                        &nbsp;清空
                    </el-button>
                </div>
                <div style="float: right">
                    <el-select size="mini" v-model="templateValue" placeholder="请选择" @change="QJHandleSelectTemplate">
                        <el-option
                                v-for="item in moduleList"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                    <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)" class="el-icon-setting">
                        个性化设置
                    </el-button>
                    <div class="el-icon-info shuoming">
                        <el-row class="el-sm">
                            <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">
                                事项说明</p>
                            <dl style="padding:6px 10px; ">
                                <p>1、器具实际名称红，表示未审核；</p>
                                <p>2、若无权限，仅可查询业务员或业务组负责人为本人的客户记录，有权限查询所有；</p>
                            </dl>
                        </el-row>
                    </div>
                </div>
            </div>


            <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                       :handleMouldBack="QJHandleMouldBack"/>
            <!--************************************************************************************-->
        </div>


        <div>
            <el-table :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%;min-height:39vh;"
                      @selection-change="handleSelectionChange" v-loading="loading">
                <el-table-column type="selection" width="50px"></el-table-column>
                <el-table-column type="index" label="序号" width="50px"></el-table-column>
                <el-table-column prop="companyName" show-overflow-tooltip label="单位名称"></el-table-column>
                <el-table-column v-if="headObj.applianceName" prop="applianceName" show-overflow-tooltip
                                 label="器具标准名称"></el-table-column>
                <el-table-column prop="applianceRealname" show-overflow-tooltip label="器具实际名称">
                    <template slot-scope="scope">
                        <div :class="{color:scope.row.status==1,companyRealName:true}">
                            {{scope.row.applianceRealname}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="model" show-overflow-tooltip label="型号规格"></el-table-column>
                <el-table-column v-if="headObj.measureRange" prop="measureRange" show-overflow-tooltip
                                 label="测量范围"></el-table-column>
                <el-table-column prop="standardPrice" show-overflow-tooltip label="收费标准"></el-table-column>
                <el-table-column prop="specialPrice" show-overflow-tooltip label="特殊价格"></el-table-column>
                <el-table-column prop="specialPriceExplain" show-overflow-tooltip label="特殊价格说明"></el-table-column>
                <el-table-column v-if="headObj.businessGroupName" prop="businessGroupName" show-overflow-tooltip
                                 label="业务组"></el-table-column>
                <el-table-column prop="businessStaffName" show-overflow-tooltip label="业务员"></el-table-column>
                <el-table-column v-if="headObj.addUserName" prop="addUserName" show-overflow-tooltip label="添加人">
                </el-table-column>
                <el-table-column v-if="headObj.contacter" prop="contacter" show-overflow-tooltip label="联系人">
                </el-table-column>
                <!-- *******目前没有业务员字段****** -->
                <!-- <el-table-column
                  prop="specialPriceExplain"
                  show-overflow-tooltip
                  label="业务员"
                  :render-header="QJrenderHeader">
                </el-table-column> -->
                <!-- ************************* -->
                <el-table-column prop="addTime" show-overflow-tooltip
                        :formatter="function(row, column, cellValue, index){return cellValue? new Date(cellValue).format('YYYY-MM-DD'):''}"
                        label="添加时间" > </el-table-column>
                <el-table-column v-if="headObj.status" prop="status" label="当前状态">
                    <template slot-scope="scope">
                        <span style="color:#DB4D6D;" v-if='scope.row.status == 1'>未审核</span>
                        <span style="color:#0089A7;" v-if='scope.row.status == 2'>已启用</span>
                        <span style="color:#080808;" v-if='scope.row.status == 3'>已暂停</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                  label="操作"
                  min-width="200">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.status==2||scope.row" v-mindPopover="{message:'是否启用?',success:handleApprove.bind(this,scope.row)}" type="text" style="padding:0;font-size:14px;">审核</el-button>
                    <el-button v-if="scope.row.status==3" v-mindPopover="{message:'是否启用?',success:handleStart.bind(this,scope.row)}" type="text" style="padding:0;font-size:14px;">启用</el-button>
                    <el-button v-if="scope.row.status==1" v-mindPopover="{message:'是否暂停?',success:handlePause.bind(this,scope.row)}" type="text" style="padding:0;font-size:14px;"><i>暂停</i></el-button>

                  </template>
                </el-table-column> -->
            </el-table>

        </div>

        <div style="margin-top:10px; width:100%;">
            <el-button @click="handleMultipleSelection(1)" v-has='"M4802"' style="float:left;">审核</el-button>
            <el-button @click="handleMultipleSelection(2)" v-has='"M4802"'>启用</el-button>
            <el-button @click="handleMultipleSelection(3)" v-has='"M4802"'>暂停</el-button>
            <mind-pagination
                    :current-page="page"
                    :page-size="rows"
                    :total="total"
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange" style="float:right;">
            </mind-pagination>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {ajaxRequest, ajaxSyncRequest} from '../../util/base'
    import $ from 'jquery'
    /**************************高级检索相关*********************/
    import Retrieve from '../../Retrieve'
    import WorkMould from '../../mould/WorkMould'
    import TableColumnHeader from '../../Table/TableColumnHeader'
    import paramJson from './priceAudit'    //同目录下json数据
    /**************************高级检索相关*********************/


    export default {
        name: "price-list",
        components: {
            WorkMould,    //个性化设置的弹窗组件
            TableColumnHeader,  //表头检索模板
            Retrieve,    //高级搜索组件
        },
        props: {
            data: {
                type: Object,
            }
        },
        data() {
            return {
                applianceName: '',
                appliances: [],
                tableData: [],
                rules: {
                    applianceId: [{required: true, message: '请选择计量器具名称!'}],
                    applianceRealName: [{required: true, message: '实际名称不能为空!'}],
                    standardPrice: [{required: true, message: '收费标准不能为空!'}],
                    specialPrice: [{required: true, message: '特殊价格不能为空!'}]
                },
                form: {
                    applianceName: '',
                    applianceRealName: '',
                    standardPrice: '',
                    model: '',
                    measureRange: '',
                    specialPrice: '',
                    specialPriceExplain: '',
                    companyId: 11,
                },
                /**************************分页相关*********************/
                page: 1,
                rows: 10,
                total: null,
                userId: null,
                /**************************分页相关*********************/

                /**************************高级检索相关*********************/
                orderProperty: '',
                orderType: '',
                multipleSelection: [],
                /*高级检索相关项*/
                rowsCondition: paramJson,   //默认同目录下json数据 会依据模板改变
                paramJson: paramJson,      //同目录下json数据 常量
                moduleList: [],           //模板列表
                templateValue: '',       //当前选择的模板id
                sortBy: '',              //排序字段
                order: '',              //desc降序 asc升序
                headObj: {},           //表头显示对象 {category:true}
                defaultOpen: true,
                isSetting: 0,
                sc: '',    //高级搜索的拼接条件
                /**************************高级检索相关*********************/
                retrieveCondition: [],
                collectionInfo: [],
                loading:false
            }
        },
        methods: {
            /**************************分页相关*********************/

            handlePageSizeChange(size) {
                this.page = 1
                this.rows = size
                this.getTableList()
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage
                this.getTableList()
            },
            /**************************分页相关*********************/



            applianceEvt(id) {
                this.appliances.forEach((data) => {
                    if (id == data.applianceId) {
                        Vue.set(this.form, 'applianceName', data.applianceName);
                        Vue.set(this.form, 'model', data.model);
                        Vue.set(this.form, 'measureRange', data.measureRange);
                    }
                })
            },
            getTableList() {
              this.loading=true
                ajaxRequest('get', 'back/companyAppliance/retrieve', {
                    // status:2,
                    /**************************分页相关*********************/
                    fuzzySearch: 1,
                    page: this.page,
                    rows: this.rows,
                    isDelete: 0,
                    /**************************分页相关*********************/
                    /**************************高级检索相关*********************/
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    total: 0,
                    sc: this.sc,
                    /**************************高级检索相关*********************/
                }, (res) => {
                    if (res.code == 200) {
                        this.tableData = res.rows;
                        this.total = res.total;
                        this.multipleSelection = [];
                    }
                  this.loading=false
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleMultipleSelection(num) {
                if (!this.multipleSelection.length) {
                    this.$message.warning("请至少选择一条记录");
                    return;
                }
                // 只有审核功能
                //   let arrInfo = [],
                //     arr = [],
                //     status = 2;
                // // 审核
                //   arr = this.multipleSelection.filter((item)=>{
                //     return item.status == 1 ;
                //   })
                //   for(let i = 0; i < arr.length ; i ++){
                //     arrInfo.push(arr[i].id)
                //   }
                //   this.handleStatus(arrInfo.join(),status)

                let unaudit = 0, start = 0, pause = 0;
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].status == 1) {
                        unaudit++;
                    }
                    if (this.multipleSelection[i].status == 3) {
                        pause++;
                    }
                    if (this.multipleSelection[i].status == 2) {
                        start++;
                    }
                }
                let message = '';
                let arrInfo = [],
                    arr = [],
                    status = num;
                // 审核
                if (num === 1) {
                    status = 2;
                    arr = this.multipleSelection.filter((item) => {
                        // 找到未审核状态返回
                        return item.status == 1;
                    })
                    // 启用
                    if (unaudit == 0) {
                        message = `选中未审核${unaudit}条，无数据可审核，请确认数据！`
                    } else {
                        message = `选中未审核${unaudit}条，确认进行审核并启用？`
                    }
                } else if (num === 2) {
                    status = 2;
                    arr = this.multipleSelection.filter((item) => {
                        // 找到已暂停状态返回
                        return item.status == 3;
                    })
                    // 暂停
                    if (pause == 0) {
                        message = `选中已暂停${pause}条，无数据可启用，请确认数据！`
                    } else {
                        message = `选中已暂停${pause}条，确认进行启用？`
                    }
                } else if (num === 3) {
                    status = 3;
                    arr = this.multipleSelection.filter((item) => {
                        // 找到已启用状态返回
                        return item.status == 2;
                    })
                    if (start == 0) {
                        message = `选中已启用${start}条，无数据可暂停，请确认数据！`
                    } else {
                        message = `选中已启用${start}条，确认进行暂停？`
                    }
                }
                for (let i = 0; i < arr.length; i++) {
                    arrInfo.push(arr[i].id)
                }
                this.$confirm(message).then(() => {
                    if (arrInfo.length > 0) {
                        this.handleStatus(arrInfo.join(), status)
                    } else {
                        return false;
                    }

                })
            },
            handleStatus(ids, status) {
                ajaxRequest('put', 'back/companyAppliance/list/' + ids, {status}, (res) => {
                    if (res.code === 200) {
                        let message
                        switch (status) {
                            case 1:
                                message = '审核成功！'
                                break;
                            case 2:
                                message = '启用成功！'
                                break;
                            case 3:
                                message = '暂停成功！'
                                break;
                        }
                        this.$message.success(message)
                        this.getTableList();
                    }
                })
            },
            handleApprove(row) {
                row.status = 1;
                ajaxRequest('put', 'back/companyAppliance/', {id: row.id, status: 1}, (res) => {
                    if (res.code == 200) {
                        this.$message({

                            type: 'success',
                            message: '启用成功'
                        })
                    }
                })
            },
            handleStart(row) {
                row.status = 1;
                ajaxRequest('put', 'back/companyAppliance/', {id: row.id, status: 1}, (res) => {
                    if (res.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '启用成功'
                        })
                    }
                })
            },
            handlePause(row) {
                row.status = 3;
                ajaxRequest('put', 'back/companyAppliance/', {id: row.id, status: 3}, (res) => {
                    if (res.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '暂停成功'
                        })
                    }
                })
            },

        },
        mounted() {
            let userId = localStorage.getItem('userId');
            this.userId = userId;
            this.getTableList();
            /*处理默认展示的表格列*/
            // this.defaultShowAllCol()
            this.QJGetMounted();
        }
    }
</script>

<style scoped>
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
        text-align: left;
        float: right;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    .shuoming .el-sm {
        text-align: left;
        display: none;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    .color {
        color: red;
    }

    .companyRealName {
        overflow: hidden;
        text-overflow: ellipsis;
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
