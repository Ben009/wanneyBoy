<template>
    <div>
        <div>
            <el-form ref="form" :model="form" :rules="rules" label-width="150px">
                <div class="title-item" style="margin-top:10px;"><span>器具信息</span></div>
                <el-Row>
                    <div style="margin-top:5px;">
                        <el-table ref="multipleTable" :data="tableData" :max-height="QJTableMaxHeight" border style="width: 100%" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="40" :selectable="selectable"></el-table-column>
                            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                            <el-table-column prop="qjmc" label="器具名称"></el-table-column>
                            <el-table-column prop="xhgg" label="型号规格"></el-table-column>
                            <el-table-column prop="ccbh" label="出厂编号"></el-table-column>
                            <el-table-column prop="sbbh" label="设备编号"></el-table-column>
                            <el-table-column prop="ts" label="套数"></el-table-column>
                            <el-table-column prop="js" label="件/套"></el-table-column>
                            <el-table-column prop="zzcs" label="制造厂商"></el-table-column>
                            <el-table-column prop="jcdd" label="检校地点" :formatter="formatterJcdd"></el-table-column>
                            <el-table-column prop="bgxs" label="报告形式" :formatter="formatterBgxs"></el-table-column>
                            <el-table-column prop="fj" label="随机附件"></el-table-column>
                            <el-table-column prop="bz" label="备注"></el-table-column>
                        </el-table>
                    </div>
                    <div style="margin-top:10px;text-align:center;float:right;">
                        <!-- TODO 案例 分页控件 mind-pagination  -->
                        <mind-pagination
                            :current-page="page"
                            :page-size="rows"
                            :total="total"
                            :marginBottom=false
                            @size-change="handlePageSizeChange"
                            @current-change="handleCurrentPageChange">
                        </mind-pagination>
                    </div>
                </el-Row>
                <div class="title-item" style="margin-top:20px;"><span>报检单信息</span></div>
                <el-Row>
                       <el-col :span="1">
                        <el-form-item label="证书单位名称:" prop="zsdw">
                            {{olBookingTotal.zsdw}}
                        </el-form-item>
                    </el-col>

                     <el-col :span="1" >
                        <el-form-item label="证书单位地址:" prop="zsdz">
                            {{olBookingTotal.zsdz}}
                        </el-form-item>
                    </el-col>
                </el-Row>
                <el-Row>

                    <el-col :span="8">
                        <el-form-item label="是否出具结论:" prop="jdjl">
                            {{olBookingTotal.jdjl=='1'?'是':(olBookingTotal.jdjl=='0'?'否':'')}}
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" >
                        <el-form-item label="是否出具复校日期:" prop="fjrq">
                            {{olBookingTotal.fjrq=='1'?'是':(olBookingTotal.fjrq=='0'?'否':'')}}
                        </el-form-item>
                    </el-col>
           
                    <el-col :span="8">
                        <el-form-item label="异常是否修理:" prop="ycxl">
                            {{olBookingTotal.ycxl=='1'?'是':(olBookingTotal.ycxl=='0'?'否':'')}}
                        </el-form-item>
                    </el-col>

                     <el-col :span="8" >
                        <el-form-item label="预估送检日期:" prop="estimatedate">
                            {{olBookingTotal.estimatedate}}
                        </el-form-item>
                    </el-col>
                </el-Row>

                 <el-Row>
                    <el-col :span="8" >
                        <el-form-item label="联系人:" prop="lxr">
                            {{olBookingTotal.lxr}}
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" >
                        <el-form-item label="联系电话:" prop="lxdh">
                            {{olBookingTotal.lxdh}}
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="传真:" prop="cz">
                            {{olBookingTotal.cz}}
                        </el-form-item>
                    </el-col>
                    
                     <el-col :span="8" >
                        <el-form-item label="备注:" prop="bz">
                            {{olBookingTotal.bz}}
                        </el-form-item>
                    </el-col>
   
                </el-Row>

                <el-row>
                    <el-col :span="8" v-if="olBookingTotal.returnflag == '1' || olBookingTotal.returnflag == '2'">
                        <el-form-item label="退回状态:" prop="returnflag">
                            {{olBookingTotal.returnflag=='2'?'全部退回':(olBookingTotal.returnflag=='1'?'部分退回':'正常')}}
                        </el-form-item>
                    </el-col>

                    <el-col :span="10"  v-if="olBookingTotal.returnflag == '1' || olBookingTotal.returnflag == '2'">
                        <el-form-item label="退回原因:" prop="returnReason">
                            {{olBookingTotal.returnReason}}
                        </el-form-item>
                    </el-col>
                </el-Row>

                <el-Row>
                    <el-col :span="1">
                        <el-form-item label="校检地址:" prop="dz">
                            {{olBookingTotal.dz}}
                        </el-form-item>
                    </el-col>
                </el-Row>
                
            </el-form>
            <span slot="footer" class="dialog-footer" style="display: block; text-align: center; margin-top: 50px;margin-bottom: 20px">
                <el-button type="primary" v-if="olBookingTotal.source == '2'" @click="mergeQj('2')">转报价</el-button>
                <el-button type="primary" v-if="isToDelivery" @click="mergeQj('0')">转配号</el-button>
                <el-button type="primary" v-if="isToSite" @click="mergeQj('1')">转计划任务</el-button>
                <el-button type="danger" @click="returnQj(multipleSelection)">退回</el-button>
                <el-button @click="toPrintPage()">打印</el-button>
                <el-button @click="cancel">返回</el-button>
            </span>
        </div>
        <div v-if="!!edit">
            <returnForm :data="edit" :callback="handleEditCallback"  @remoteMethod="remoteMethod"></returnForm>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
    import $ from 'jquery';
    import rightclick from '../../../directives/rightcilck';
    import rightClick from '../../../mixins/FormRightClick';
    import returnForm from './returnForm';


    const defaults = {
        hoho: ''
    };
    export default {
        name: "layout",
        props: {
            data: {
                type: Object
            }
        },
        data() {
            return {
                form: $.extend({}, defaults, this.data || {}),
                rules: {

                },
                loading: false,
                tableData:[],
                olBookingTotal:{},
                edit:null,
                printEdit:null,
                multipleSelection: [],

                isToSite: false,        //是否可以转计划
                isToDelivery: false,     //是否可以转配号

                page: 1,
                rows: 10,
                total: 0,
                searchKey: '',
                orderProperty: "b.jcdd, b.qjmc, b.id",
                orderType: '',
                tableData: [],
                multipleSelection: [],
                fuzzySearch: 0,
                isPut: true,
            }
        },

        components: {
            returnForm
        },

        mounted() {
            this.remoteMethod();
            this.getTableList();
        },
        directives: {rightclick},
        mixins: [rightClick],
        methods: {
            formatterJcdd:function (row, column) {
                return row.jcdd=='4'?'物流送样':(row.jcdd=='3'?'带回':(row.jcdd=='2'?'询价':(row.jcdd=='1'?'现场':'送检')));
            },

            formatterBgxs:function (row, column) {
                return row.bgxs=='4'?'测试':(row.bgxs=='3'?'检测':(row.bgxs=='2'?'校准':'检定'));
            },

            selectable:function (row, index) {
                //不等于1时可操作
                if(row.isOper != '1' && row.flag == '0'){
                    return true;
                }else {
                    return false;
                }
            },

            checked:function(){
                var _this = this;
                if(_this.tableData.length>0){
                    this.$nextTick(val => {
                        var $_this = _this;
                        _this.tableData.forEach(row => {
                            if(row.isOper != '1' && row.flag == '0') {
                                $_this.$refs.multipleTable.toggleRowSelection(row, true);
                            }
                        });
                    })
                }
            },

            getIsToSite:function () {
                //判断是否可以转计划任务
                let _this=this;
                ajaxProxyRequest('get', "/njmind/findParam/isDeliveryToSite", null, (res) => {
                    _this.isToSite =  res.value == 'true';
                });
            },

            getIsToDelivery:function () {
                //判断是否可转配号
                let _this=this;
                ajaxProxyRequest('get', "/njmind/findParam/isSiteToDelivery", null, (res) => {
                    _this.isToDelivery =  res.value == 'true';
                });
            },

            remoteMethod:function() {
                //加载
                var _this = this;
                ajaxRequest('get', 'back/olBooking/findolBookingTotalById', {
                    id:  _this.$route.query.id,
                }, (res) => {
                    if (res.code == 200) {
                        _this.olBookingTotal = res.t || {};
                        console.log(_this.olBookingTotal,"_this.olBookingTotal")

                        if(_this.olBookingTotal.bjType == "1"){
                            _this.isToSite = true;
                            //报检的是现场，判断是否可转配号
                            _this.getIsToDelivery();
                        }else if(_this.olBookingTotal.bjType == "0"){
                            _this.isToDelivery = true;
                            //报检的是送检，判断是否可以转计划任务
                            _this.getIsToSite();
                        }
                    }else{
                        _this.$message.error(res.msg);
                    }
                });


            },

            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            getTableList:function () {
                var _this = this;
                ajaxRequest('get', 'back/olBooking/findQjListById', {
                    page: this.page,
                    rows: this.rows,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    total: 0,
                    zdid:  _this.$route.query.id
                }, (res) => {
                    if (res.code == 200) {
                        _this.tableData = res.rows || [];
                        _this.total = res.total;
                        _this.multipleSelection = [];
                        _this.checked();
                    }else{
                        _this.$message.error(res.msg);
                    }
                });
            },

            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size
                this.getTableList()
            },

            cancel: function () {
                window.history.go(-1);
            },

            handleCurrentPageChange(currentPage) {
                this.page = currentPage
                this.getTableList()
            },

            //退回
            returnQj:function (data) {
                if (data.length > 0) {
                    let ids = data.map(function (v) {
                        return v.id
                    }).join(",");
                    this.edit = this.olBookingTotal;
                    this.edit.ids = ids;
                } else {
                    this.$message({
                        message: '请选择要退回的器具！',
                        type: 'warning'
                    })
                }
            },

            toPrintPage:function () {
                this.$route.query.id = this.olBookingTotal.id
                this.$router.push({
                    path:'/admin/576',
                    query:this.$route.query
                })
            },

            handleEditCallback:function () {
                this.edit = null;
            },

            mergeQj:function (type) {
                this.$route.query.id = this.olBookingTotal.id
                this.$route.query.type = type
                this.$router.push({
                    path:'/admin/420',
                    query:this.$route.query
                })
            }

        },
    }
</script>

<style>
    .right-click-menu {
        position: fixed;
        border: 1px solid #ccc;
        padding: 2px 0;
        background: #fff;
        width: 100px;
        z-index: 9999;
    }

    .right-click-menu li {
        padding: 3px 10px;
        cursor: default;
        font-size: 14px;
        color: #606266;
    }

    .right-click-menu li:hover {
        color: #409eff;
    }

    ul, li {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .custom-1d74b7 .el-col-1 {
  width: 50%;
}
.custom-1d74b7 .el-col-8 {
  width: 25%;
}
@media screen and (max-width:1500px){
  /*.custom-1d74b7 .el-col-1{width: 100%!important;}*/
  .custom-1d74b7 .el-col-8{width: 50%!important;}
}
</style>
