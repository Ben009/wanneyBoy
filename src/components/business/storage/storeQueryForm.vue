<template>
    <mind-dialog :visible="true" dialogSize="mid" title="库房明细" center v-dialogDrag append-to-body @close="closeDialog">
        <div>样品库房信息</div>
        <div style="margin-bottom:20px;">
            <el-table :max-height="QJTableMaxHeight" ref="table" :data="tableData" border style="width: 100%"
                      :fit="true">
                <el-table-column prop="OPERATION_TYPE" label="操作"></el-table-column>
                <el-table-column prop="sampleWarehouseNo" label="货柜号"></el-table-column>
                <el-table-column prop="OPERATING_TIME" label="操作时间" :formatter="dealDate"></el-table-column>
                <el-table-column prop="creator" label="操作人"></el-table-column>
            </el-table>
        </div>
        <div style="text-align: center;margin-top: 10px;">
            <el-button type="warning" @click="revertYp" v-if="storeData.applianceWarehouseFlag ===3" v-has="'M33304'">
                样品入库撤销
            </el-button>
            <el-button type="warning" v-else disabled v-has="'M33304'">样品入库撤销</el-button>
          <el-button type="warning" @click="outYp" v-if="storeData.applianceWarehouseFlag ===4" v-has="'M33304'">
            样品出库撤销
          </el-button>
          <el-button type="warning" v-else disabled v-has="'M33304'">样品出库撤销</el-button>
        </div>
        <div>证书库房信息</div>
        <div>
            <el-table :max-height="QJTableMaxHeight" ref="table2" :data="tableData2" border style="width: 100%"
                      :fit="true">
                <el-table-column prop="OPERATION_TYPE" label="操作"></el-table-column>
                <el-table-column prop="certificateWarehouseNo" label="货柜号"></el-table-column>
                <el-table-column prop="OPERATING_TIME" label="操作时间" :formatter="dealDate"></el-table-column>
                <el-table-column prop="creator" label="操作人"></el-table-column>
            </el-table>
        </div>
        <div style="text-align: center;margin-top: 10px;">
            <el-button type="warning" @click="revertZs" v-if="storeData.certificateWarehouseFlag ===3" v-has="'M33303'">
                证书入库撤销
            </el-button>
            <el-button type="warning" v-else disabled v-has="'M33303'">证书入库撤销</el-button>

          <el-button type="warning" @click="outZs" v-if="storeData.certificateWarehouseFlag ===4" v-has="'M33303'">
            证书出库撤销
          </el-button>
          <el-button type="warning" v-else disabled v-has="'M33303'">证书出库撤销</el-button>
        </div>
        <div style="text-align: center;margin-top: 10px;">
            <el-button @click="closeDialog">关闭</el-button>
        </div>
    </mind-dialog>
</template>

<style>

</style>

<script>
    //引入ajax工具
    import {ajaxRequest} from '../../util/base';

    export default {
        name: "storeQueryForm",
        props: {
            storeData: {
                type: Object,
                require: true
            },
            callback: {
                type: Function,
                required: true
            },
            refresh: {
                type: Function,
                required: true
            },
        },
        data() {
            return {
                tableData: [],//样品库房信息
                tableData2: [],//证书库房信息
            }
        },
        methods: {
            revertYp() {
                ajaxRequest('put', 'back/ruku/backRuku', {
                    state: 1,
                    dhlist: JSON.stringify(this.storeData),
                }, (res) => {
                    if (res.code === 200) {
                        this.$message.success('撤销成功');
                        this.refresh();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },
            revertZs() {
                ajaxRequest('put', 'back/ruku/backRuku', {
                    state: 2,
                    dhlist: JSON.stringify(this.storeData),
                }, (res) => {
                    if (res.code === 200) {
                        this.$message.success('撤销成功');
                        this.refresh();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },
          outYp(){
            ajaxRequest('put', 'back/ruku/backChuku', {
              state: 1,
              dhlist: JSON.stringify(this.storeData),
            }, (res) => {
              if (res.code === 200) {
                this.$message.success('撤销成功');
                this.refresh();
              } else {
                this.$message.error(res.msg);
              }
            })
          },
          outZs(){
            ajaxRequest('put', 'back/ruku/backChuku', {
              state: 2,
              dhlist: JSON.stringify(this.storeData),
            }, (res) => {
              if (res.code === 200) {
                this.$message.success('撤销成功');
                this.refresh();
              } else {
                this.$message.error(res.msg);
              }
            })
          },
            getTableList() {
                /*获取table数据，维护data数据*/
                ajaxRequest('get', 'back/ruku/kfDetail', {
                    registrationNo: this.storeData.registrationNo,
                }, (res) => {
                    if (res.code === 200) {
                        this.tableData = res.daoResult.yplist;
                        this.tableData2 = res.daoResult.zsList;
                    }
                })
            },
            dealDate: function (row, column, cellValue) {
                if (cellValue === "" || cellValue === null || cellValue === undefined) {
                    return "";
                } else {
                    return new Date(cellValue).format('YYYY-MM-DD hh:mm:ss');
                }
            },
            closeDialog() {
                this.callback();
            },
        },
        mounted() {
            this.getTableList();
        }
    }
</script>
