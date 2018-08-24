<template>
    <mind-dialog
            :title="'委托单预报价'"
            :visible="true"
            width="80%"
            center
            v-dialogDrag
            @close="handleCancel">
        <div style="position:relative;">
            <div class="el-icon-info  shuoming">
                <el-row class="el-sm">
                    <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">
                        事项说明</p>
                    <dl style="padding:6px 10px; ">
                        <p>按计量器具库收费标准进行预报价；该费用仅供参考</p>
                    </dl>
                </el-row>
            </div>
            <!-- <div> -->
            <div style="display: flex;justify-content: space-between;">
                <div style="display: inline-block;text-align: center;margin:auto">
                    <el-button type="success" @click="printPrePrice">打印</el-button>
                    <el-button type="warning" @click="handleCancel">&nbsp;关闭</el-button>

                </div>

            </div>
            <div style="margin-top:10px;">
                <el-table :max-height="QJTableMaxHeight"
                          :data="tableData"
                          border
                          style="width: 100%"
                >
                    <el-table-column prop="orderNo" min-width="100" label="委托单编号"></el-table-column>
                    <el-table-column prop="orderSingleNo" min-width="100" label="流转单号"></el-table-column>
                    <el-table-column prop="registrationNo" min-width="100" label="登记号"></el-table-column>
                    <el-table-column prop="applianceName" label="器具名称" show-overflow-tooltip=true
                                     width="180"></el-table-column>
                    <el-table-column prop="setNumber" label="套数"></el-table-column>
                    <el-table-column prop="pieceNumber" label="件/套"></el-table-column>
                    <el-table-column prop="certificateNumber" label="证书数量"></el-table-column>
                    <el-table-column prop="certificateType" label="服务类型 "></el-table-column>
                    <el-table-column prop="detectionFee" label="收费标准"></el-table-column>
                    <el-table-column prop="jdfActual" label="检测费"></el-table-column>
                </el-table>
            </div>
            <!-- </div> -->

            <!-- <div style="display: flex;justify-content: space-between;">
            <div style="display: inline-block;text-align: center;margin:auto">
                <el-button type="success" >打印</el-button>
                <el-button type="warning"  @click="handleCancel" >&nbsp;关闭</el-button>

              </div>
              </div> -->

        </div>

    </mind-dialog>
</template>

<script>
    import Vue from "vue";
    import Vuex from "vuex";
    import $ from "jquery";
    import {ajaxRequest, formatArrayToTree} from "../../util/base";

    /* import { Table, TableColumn,} from "element--ui";
    Vue.use(Table);
    Vue.use(TableColumn); */

    export default {
        name: "preQuotedPrice",
        props: {//用于接收从父组件中传来的数据
            wtdId: {
                type: Number
            },
            callback: {
                type: Function
            }
        },
        data() {
            return {
                tableData: [],
            };
        },
        methods: {
            //预报价打印
            printPrePrice() {
                this.printHtml("prePricePrint", {key1: 'prePricePrint', wtdId: this.wtdId,orderNo:this.tableData[0].orderNo}, 1);
            },
            handleCancel() {
                this.callback()
            },
            getTableData() {
                let _this = this;
                if (_this.wtdId) {
                    ajaxRequest('post', 'back/entrustSjd/preQuotedPrice', {wtdId: _this.wtdId}, (res) => {
                        this.tableData = res.rows;
                    })

                }
            },
        },
        mounted() {
            this.getTableData();
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

    .shuoming {
        border: none !important;
        color: #56BC4E !important;
        font-size: 16px !important;
        float: right;
        cursor: pointer;
    }

    .shuoming::after {
        content: "";
        position: absolute;
        z-index: 999;
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
        margin-left: -345px;
        margin-right: 15px;
        word-break: break-all;
        margin-top: 5px;
        padding: 4px 5px;
        font-size: 14px;
        opacity: 50;
        float: right;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

</style>
