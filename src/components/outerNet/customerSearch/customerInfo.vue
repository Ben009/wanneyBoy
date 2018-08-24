<template>
    <div>

        <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="基本信息" name="first">
                <el-form ref="form" :model="form" :rules="rules" label-width="160px">

            <el-Row>
                <el-col :span="1">
                    <el-form-item label="单位名称:" prop="companyName">
                        {{edit.companyName}}
                    </el-form-item>
                </el-col>
                <el-col :span="1">
                    <el-form-item label="通讯地址:" prop="address">
                        {{edit.address}}
                    </el-form-item>
                </el-col>
            </el-Row>

            <el-row>
                  <el-col :span="8">
                    <el-form-item label="行政区划:" prop="area">
                        {{edit.area}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="统一社会信用代码:" prop="companyCode">
                        {{edit.companyCode}}
                    </el-form-item>
                </el-col>

                 <el-col :span="8">
                    <el-form-item label="所属行业:" prop="sshy">
                        {{edit.sshy}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="单位规模:" prop="qygm">
                        {{edit.qygm}}
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                 <el-col :span="8">
                    <el-form-item label="法人代表:" prop="frfb">
                        {{edit.frfb}}
                    </el-form-item>
                </el-col>

                 <el-col :span="8">
                    <el-form-item label="计量管理部门:" prop="jlglbm">
                        {{edit.jlglbm}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="部门负责人:" prop="bmfzr">
                        {{edit.bmfzr}}
                    </el-form-item>
                </el-col>

                <el-col :span="8" >
                    <el-form-item label="联系电话:" prop="phone">
                        {{edit.phone}}
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                 <el-col :span="8" >
                    <el-form-item label="固定资产（万元）:" prop="gdzc">
                        {{edit.gdzc}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="上年销售额（万元）:" prop="snxse">
                        {{edit.snxse}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="上年利税（万元）:" prop="snls">
                        {{edit.snls}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="计量器具资产（万元）:" prop="jlqjzc">
                        {{edit.jlqjzc}}
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                 <el-col :span="8">
                    <el-form-item label="职工人数:" prop="zgrs">
                        {{edit.zgrs}}
                    </el-form-item>
                </el-col>

                    <el-col :span="8">
                    <el-form-item label="邮编:" prop="postcode">
                        {{edit.postcode}}
                    </el-form-item>
                </el-col>

                   <el-col :span="8">
                    <el-form-item label="电子邮箱:" prop="email">
                        {{edit.email}}
                    </el-form-item>
                </el-col>

                  <el-col :span="8">
                    <el-form-item label="主要产品:" prop="zycp">
                        {{edit.zycp}}
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                 <el-col :span="8">
                    <el-form-item label="计量标准（项）:" prop="jljlbz">
                        {{edit.jljlbz}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="最高标准（项）:" prop="zgjlbz">
                        {{edit.zgjlbz}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="计量器具总数（台/件）:" prop="jlqjzs">
                        {{edit.jlqjzs}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="强检器具（台/件）:" prop="qjqjts">
                        {{edit.qjqjts}}
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>

                <el-col :span="8" >
                    <el-form-item label="质量体系:" prop="zltx">
                        {{edit.zltx}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="计量体系:" prop="jltx">
                        {{edit.jltx}}
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="上传证件:" prop="fileList">
                        <p v-for="item in edit.fileList" style="margin-top:10px;">
                            <i class="el-icon-document"></i>
                            <a :href="cmiimsUrl + 'a/sys/sysFiles/downloadFileNoBase?id='+item.id" target="_blank">{{item.fileName}}</a>
                        </p>
                    </el-form-item>
                </el-col>
            </el-Row>
        </el-form>
            </el-tab-pane>
            <el-tab-pane label="登录日志" name="second">
                <div>
                    <el-table :max-height="QJTableMaxHeight" :key="tableKey"
                              ref="customerLog-list"
                              :data="logList"
                              border
                              style="width: 100%"
                              :height="setHeightForRet"
                              @sort-change="handleSort"
                              >

                        <el-table-column fixed type="index" label="序号" width="50px"></el-table-column>

                        <el-table-column
                            prop="loginUsername"
                            label="使用登录名"

                        >
                        </el-table-column>

                        <el-table-column
                            prop="remoteAddr"
                            label="访问IP"

                        >
                        </el-table-column>

                        <el-table-column
                            prop="createDate"
                            label="访问时间"

                        >
                        </el-table-column>

                        <el-table-column
                            prop="userAgent"
                            label="访问浏览器"

                        >
                        </el-table-column>

                    </el-table>
                </div>
                <div style="margin-top:10px;text-align:center; float:right;">
                    <mind-pagination
                        :current-page="page"
                        :page-size="rows"
                        :total="total"
                        :marginBottom="false"
                        @size-change="handlePageSizeChange"
                        @current-change="handleCurrentPageChange">
                    </mind-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer" style="display: block; text-align: center;margin-top: 20px;margin-bottom: 50px">
            <el-button @click="cancel">返 回</el-button>
        </span>
    </div>
</template>

<script>
    import Vue from 'vue';

    import {ajaxRequest,ajaxProxyRequest} from '../../util/base';
    import $ from 'jquery';
    import rightclick from '../../../directives/rightcilck';
    import rightClick from '../../../mixins/FormRightClick';
    import ElRow from "@/common-el/packages/row/src/row";

    const defaults = {
        hoho: ''
    };
    export default {
        components: {ElRow},
        name: "coustomer-info",
        props: {
            data: {
                type: Object
            }
        },
        data() {
            return {
                form: $.extend({}, defaults, this.data || {}),
                loading: false,
                rules:{

                },
                remoteOptions: [],
                options: [],
                edit:{},
                cmiimsUrl:'',
                activeName:'first',
                page: 1,
                rows: 10,
                total: 0,
                logList:[],
                tableKey: 0,
                setHeightForRet: null
            }
        },
        mounted() {
            this.remoteMethod();
        },
        directives: {rightclick},
        mixins: [rightClick],
        methods: {
            cancel: function () {
                window.history.go(-1)
            },
            remoteMethod:function () {
                var _this = this;
                //获取外网服务器地址
                ajaxProxyRequest('get', "/njmind/findParam/cmiimsUrl", null, (res) => {
                    _this.cmiimsUrl = res.value;
                });

                this.getCustomerInfoById();
                this.getCustomerLoginLog();
            },

            getCustomerInfoById:function () {
                var _this = this;
                //根据id查询托管器具详情
                ajaxRequest('get', 'back/customer/findCustomerInfoById', {
                    id: _this.$route.query.id
                }, (res) => {
                    if (res.code == 200) {
                        _this.edit = res.map || {};
                    }else{
                        _this.$message.error(res.msg);
                    }
                })
            },

            getCustomerLoginLog:function () {
                var _this = this;
                ajaxRequest('get', 'back/customer/findUserLoginLogList', {
                    page: this.page,
                    rows: this.rows,
                    total: 0,
                    createby: _this.$route.query.userId,
                }, (res) => {
                    if (res.code === 200) {
                        this.logList = res.rows;
                        this.total = res.total;
                    }
                })
            },

            handlePageSizeChange(size) {
                this.page = 1;//Math.floor(this.page * this.rows / size);
                this.rows = size
                this.getCustomerLoginLog()
            },

            handleCurrentPageChange(currentPage) {
                this.page = currentPage
                this.getCustomerLoginLog()
            },

            handleSort: function (column, prop, order) {
                this.orderProperty = column['prop']
                if (column['order'] == 'descending') {
                    this.orderType = 'desc'
                } else {
                    this.orderType = 'asc'
                }
                this.getTableList()
            },
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
