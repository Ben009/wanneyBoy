<template>
    <mind-dialog
            :visible="true"
            dialogSize="mid"
            title="出库记录明细"
            center
            v-dialogDrag
            append-to-body
            @close="closeDialog">
        <div>
            <el-form ref="form" label-width="150px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="出库记录编号">
                            <el-input v-model="billNo" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="出库时间">
                            <el-input v-model="outTime" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="出库人">
                            <el-input v-model="outPerson" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="单位名称">
                        <el-input v-model="companyName" disabled></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="出库类型">
                        <el-input v-model="cklx" disabled></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="出库方式">
                        <el-input v-model="outWay" disabled></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div style="margin-bottom:20px;">
            <el-table :max-height="QJTableMaxHeight"
                      ref="table"
                      :data="tableData"
                      border
                      style="width: 100%"
                      :fit="true">
                <el-table-column
                        prop="registrationNo"
                        label="登记号">
                </el-table-column>
                <el-table-column
                        prop="applianceName"
                        label="器具名称">
                </el-table-column>
                <el-table-column prop="setNumber" label="套数">
                    <template slot-scope="scope">
                        <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pieceNumber" label="件数"></el-table-column>
                <el-table-column prop="subcontractArea" label="是否外送"
                                 :formatter="function(row, column, cellValue, index){return cellValue==='0'?'否':'是'}">
                </el-table-column>
                <el-table-column prop="sampleNum" label="样品出库数量"></el-table-column>
                <el-table-column prop="certificateNum" label="证书出库数量"></el-table-column>
                <!--<el-table-column-->
                <!--prop="warOutType"-->
                <!--label="出库类型"-->
                <!--:formatter="function(row, column, cellValue, index){return cellValue==1?'样品出库':cellValue==2?'证书出库':cellValue==3?'综合出库':''}"-->
                <!--&gt;-->
                <!--</el-table-column>-->
            </el-table>
        </div>
        <div style="text-align: center;margin-top:10px;border-bottom:1px solid #bdbdbd;padding-bottom:10px;">
            <el-button @click="goPrint">打印出库记录</el-button>
            <el-button @click="closeDialog">关闭</el-button>
        </div>
        <div>同一批次出库所有登记号</div>
        <div style="margin-bottom:20px;">
            <el-table :max-height="QJTableMaxHeight"
                      ref="table2"
                      :data="tableData2"
                      border
                      style="width: 100%"
                      :fit="true">
                <el-table-column
                        prop="registrationNo"
                        label="登记号">
                </el-table-column>
                <el-table-column
                        prop="applianceName"
                        label="器具名称">
                </el-table-column>
                <el-table-column prop="setNumber" label="套数">
                    <template slot-scope="scope">
                        <span>{{scope.row.setNumber}}</span>/<span style="color:red">{{scope.row.returnNumber}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pieceNumber" label="件数"></el-table-column>
                <el-table-column prop="sfws" label="是否外送"
                                 :formatter="function(row, column, cellValue, index){return cellValue=='0'?'否':'是'}">
                </el-table-column>
                <el-table-column prop="sampleNum" label="样品出库数量"></el-table-column>
                <el-table-column prop="certificateNum" label="证书出库数量"></el-table-column>
            </el-table>
        </div>
    </mind-dialog>
</template>

<style>

</style>

<script>
    import Vue from 'vue';
    //vuex 是vue的状态管理工具，是一个存放多个组件公用数据的容器，公共数据一变，各个组件都会更新，数据是响应式的
    import Vuex from 'vuex';
    //引入表格和分页插件
    //引入ajax工具
    import {ajaxRequest, ajaxProxyRequest} from '../../util/base';
    //引入jquery
    import $ from 'jquery';
    import ElCol from "@/common-el/packages/col/src/col";
    import ElRow from "@/common-el/packages/row/src/row";

    export default {
        name: "outQueryForm",
        props: {
            outData: {
                type: Object,
                require: true
            },
            callback: {
                type: Function,
                required: true
            },
        },
        data() {
            return {
                tableData: [],//表格数据
                tableData2: [],//表格数据
                billNo: "",//出库记录编号
                outTime: "",//出库时间
                outPerson: "",//出库人
                companyName: "",//单位名称
                outWay: "",//出库方式
                cklx:"",
            }
        },
        methods: {
            goPrint() {
              let printList=this.tableData;
              this.printHtml("outQueryPrint",{printList:printList});
            },
            getInfo() {
                /*获取table数据，维护data数据*/
                ajaxRequest('get', 'back/ruku/chukuDetail', {
                    ckdId: this.outData.ckdId
                }, (res) => {
                    if (res.code === 200) {
                        this.tableData = res.rows;
                        this.billNo = this.outData.billNo;
                        this.outTime = new Date(res.map.warOutDate).format('YYYY-MM-DD');
                        this.outPerson = res.map.warOutPerson;
                        this.companyName = res.map.dwmc;
                        if (res.map.warOutStyle === 1) {
                            this.outWay = "快递";
                        } else if (res.map.warOutStyle === 2) {
                            this.outWay = "客户自取";
                        } else if (res.map.warOutStyle === 3) {
                            this.outWay = "样管员送样";
                        }
                        if (this.outData.warOutType == 1) {
                            this.cklx = "样品出库";
                        } else if (this.outData.warOutType == 2) {
                            this.cklx = "证书出库";
                        } else if (this.outData.warOutType == 3) {
                            this.cklx = "货证齐出";
                        }
                    }
                });
                //查询同一批次出库所有登记号
                ajaxRequest('get', 'back/ruku/getSameBtachOutStore', {
                    billNo: this.outData.billNo
                }, (res) => {
                    if (res.code === 200) {
                        this.tableData2 = res.rows;
                    }
                })
            },
            closeDialog() {
                this.callback();
            },
        },
        mounted() {
            this.getInfo();
        }
    }
</script>
