<template>
    <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <div class="title-item" style="margin-top:10px;"><span>基本信息</span></div>
            <el-Row>
                <el-col :span="8">
                    <el-form-item label="器具名称:" prop="sbmc">
                        {{edit.sbmc}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="出厂编号:" prop="ccbh">
                        {{edit.ccbh}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="设备编号:" prop="dwMc">
                        {{edit.sbbh}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="型号规格:" prop="xhgg">
                        {{edit.xhgg}}
                    </el-form-item>
                </el-col>
            </el-Row>

            <el-row>
                <el-col :span="8">
                    <el-form-item label="测量范围:" prop="clfw">
                        {{edit.clfw}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="准确度等级:" prop="zqddj">
                        {{edit.zqddj}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="器具状态:" prop="sbzt">
                        {{edit.sbzt}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="制造厂商:" prop="zzcs">
                        {{edit.zzcs}}
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-form-item label="使用部门:" prop="sybm">
                        {{edit.sybm}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="存放地点:" prop="cfdd">
                        {{edit.cfdd}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保管人:" prop="bgr">
                        {{edit.bgr}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="管理类别:" prop="fzlb">
                        <span>{{edit.fzlb=='0'?'强检':(edit.fzlb=='1'?'非强检':edit.fzlb)}}</span>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-form-item label="使用领域:" prop="qjyt">
                        {{edit.qjyt}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="强检目录:" prop="qjml">
                        {{edit.qjml}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="备注:" prop="bz">
                        {{edit.bz}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="上传照片:" prop="fileList">
                        <p v-for="item in edit.fileList">
                            <i class="el-icon-document"></i>
                            <a :href="cmiimsUrl + 'a/sys/sysFiles/downloadFileNoBase?id='+item.id" target="_blank">{{item.fileName}}</a>
                        </p>
                    </el-form-item>
                </el-col>
            </el-Row>

            <div class="title-item" style="margin-top:30px;"><span>购买信息</span></div>
            <br>
            <el-Row>
                <el-col :span="8">
                    <el-form-item label="购入金额:" prop="grje">
                        {{edit.grje}}
                    </el-form-item>
                </el-col>
                 <el-col :span="8">
                    <el-form-item label="购入日期:" prop="grrq">
                        {{edit.grrq}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="购入单位:" prop="grdw">
                        {{edit.grdw}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发票号:" prop="fph">
                        {{edit.fph}}
                    </el-form-item>
                </el-col>
            </el-Row>

            <el-Row>
                  <el-col :span="8">
                    <el-form-item label="经办人:" prop="jbr">
                        {{edit.jbr}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="验收人:" prop="ysr">
                        {{edit.ysr}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产权单位v" prop="cqdw">
                        {{edit.cqdw}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="固定资产编号:" prop="zcbh">
                        {{edit.zcbh}}
                    </el-form-item>
                </el-col>
            </el-Row>

            <div class="title-item" style="margin-top:30px;"><span>周检信息</span></div>
            <br>
            <el-Row>
                <el-col :span="8">
                    <el-form-item label="检校机构:" prop="jddw">
                        {{edit.jddw}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="检校周期:" prop="jdzq">
                        {{edit.jdzq}}
                    </el-form-item>
                </el-col>
                 <el-col :span="8">
                    <el-form-item label="检测费用:" prop="jdf">
                        {{edit.jdf}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="其它费:" prop="qtf">
                        {{edit.qtf}}
                    </el-form-item>
                </el-col>
            </el-Row>

            <el-Row>
                <el-col :span="8">
                    <el-form-item label="检测日期:" prop="jdrq">
                        {{edit.jdrq}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="有效期:" prop="yxq">
                        {{edit.yxq}}
                    </el-form-item>
                </el-col>
                 <el-col :span="8">
                    <el-form-item label="证书编号:" prop="zsbh">
                        {{edit.zsbh}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="检定结论:" prop="jdjl">
                        {{edit.jdjl}}
                    </el-form-item>
                </el-col>
            </el-Row>

            <el-Row>
                <el-col :span="8">
                    <el-form-item label="检定具体结论:" prop="jdjldetail">
                        {{edit.jdjldetail}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="备注:" prop="sjbz">
                        {{edit.sjbz}}
                    </el-form-item>
                </el-col>
                 <el-col :span="8">
                    <el-form-item label="上传证书:" prop="zjFileList">
                        <p v-for="item in edit.zjFileList">
                            <i class="el-icon-document"></i>
                            <a :href="cmiimsUrl + 'a/sys/sysFiles/downloadFileNoBase?id='+item.id" target="_blank">{{item.fileName}}</a>
                        </p>
                    </el-form-item>
                </el-col>
            </el-Row>

            <div class="title-item" style="margin-top:30px;"><span>修理信息</span></div>
            <el-Row>
                <el-col :span="8">
                    <el-form-item label="修理时间:" prop="xlsj">
                        {{edit.xlsj}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="经手人:" prop="jsr">
                        {{edit.jsr}}
                    </el-form-item>
                </el-col>
                 <el-col :span="8">
                    <el-form-item label="修理费:" prop="xlf">
                        {{edit.xlf}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="更换配件费用:" prop="pjf">
                        {{edit.pjf}}
                    </el-form-item>
                </el-col>
            </el-Row>

            <el-Row>
                <el-col :span="8">
                    <el-form-item label="修理原因:" prop="reason">
                        {{edit.reason}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="备注:" prop="xlbz">
                        {{edit.xlbz}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="上传照片:" prop="xlFileList">
                        <p v-for="item in edit.xlFileList">
                            <i class="el-icon-document"></i>
                            <a :href="cmiimsUrl + 'a/sys/sysFiles/downloadFileNoBase?id='+item.id" target="_blank">{{item.fileName}}</a>
                        </p>
                    </el-form-item>
                </el-col>
            </el-Row>

        </el-form>

        <div v-if="!!cycleTestEdit">
            <cycleTestList :data="cycleTestEdit" :callback="cycleTestCancel"></cycleTestList>
        </div>

        <div v-if="!!repairEdit">
            <repairList :data="repairEdit" :callback="repairCancel"></repairList>
        </div>

        <span slot="footer" class="dialog-footer" style="display: block; text-align: center;margin-top: 50px">
            <el-button type="primary" @click="findCycleTestList">周检信息</el-button>
            <el-button type="primary" @click="findRepairList">修理信息</el-button>
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
    import cycleTestList from './cycleTestList';
    import repairList from './repairList';

    const defaults = {
        hoho: ''
    };
    export default {
        name: "layout",
        props: {
            data: {
                type: Object
            },
            callback: {
                type: Function
            },
            openCompanyDialog: {
                type: Function
            }
        },
        data() {
            return {
                form: $.extend({}, defaults, this.data || {}),
                rules: {},
                loading: false,
                remoteOptions: [],
                options: [],
                edit:{},
                cmiimsUrl:'',
                cycleTestEdit:null,
                repairEdit:null
            }
        },
        mounted() {
            this.remoteMethod();
        },
        directives: {rightclick},
        mixins: [rightClick],
        methods: {
            remoteMethod() {
                var _this = this;
                //获取外网服务器地址
                ajaxProxyRequest('get', "/njmind/findParam/cmiimsUrl", null, (res) => {
                    _this.cmiimsUrl = res.value;
                });


                //根据id查询托管器具详情
                ajaxRequest('get', 'back/instruments/findById', {
                    id: _this.$route.query.id,
                    dwId: _this.$route.query.dwId
                }, (res) => {
                    if (res.code == 200) {
                        _this.edit = res.t;
                    }else{
                        _this.$message.error(res.msg);
                    }
                })
            },

            findCycleTestList:function () {
                //展示周检信息列表
                this.cycleTestEdit = {id:this.edit.id};
            },

            cycleTestCancel:function () {
                this.cycleTestEdit = null;
            },

            findRepairList:function () {
                //展示维修信息列表
                this.repairEdit = {id:this.edit.id};
            },

            repairCancel:function () {
                this.repairEdit = null;
            },

            cancel: function () {
                this.$router.push({
                    path:'/admin/357',
                    query:{
                        dwId:this.$route.query.dwId,
                    }
                })
            }
        },
        components: {
            cycleTestList,
            repairList
        }
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
