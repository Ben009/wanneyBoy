<template>
    <mind-dialog
            :title="'证书附件'"
            :visible="true"
            width="400"
            center
            v-dialogDrag
            @close="handleCancel">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="委托单位">
                        <el-input v-model="form.companyName" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="登记号">
                        <el-input v-model="form.registrationNo" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="器具名称">
                        <el-input v-model="form.applianceName" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="器具实际名称">
                        <el-input v-model="form.applianceActualName" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="套数">
                        <el-input v-model="form.setNumber" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="证书数量">
                        <el-input v-model="form.certificateNumber" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="委托日期">
                        <el-input v-model="form.entrustDate" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="检测期限">
                        <el-input v-model="form.detectionDeadline" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="证书附件" prop="attachment">
                        <mind-upload v-if="demo" ref="upFiles" :limitNumb="limitNumb" :attachIds="attachment"
                                     :callBack="fileUploadCallBack"></mind-upload>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="证书图片" prop="imageAttachment">
                        <mind-upimage v-if="demo" ref="upFiles2" :limitNumb="limitNumb" :attachIds="imgId"
                                      :callBack="fileImageUploadCallBack"></mind-upimage>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
            <el-button @click="handleCancel">返回</el-button>
        </span>
    </mind-dialog>
</template>

<script>
    import Vue from 'vue'
    // 引入封装的ajax控件
    import {ajaxRequest, ajaxProxyRequest, ajaxSyncRequest} from '../../util/base'
    // 引入jquery
    import $ from 'jquery'
    import fa from "../../../common-el/src/locale/lang/fa";

    export default {
        name: "certificateUpload",
        data() {
            return {
                form: {
                    companyName: '',
                    registrationNo: '',
                    applianceName: '',
                    applianceActualName: '',
                    setNumber: '',
                    certificateNumber: '',
                    entrustDate: '',
                    detectionDeadline: ''
                },
                demo: true,
                attachment: '',
                imgId: '',
                fileList: [],
                fileImageList: [],
                limitNumb: 1,//附件上传个数限制
                up_url: '',//自定义上传路径 [非必填]  默认不用修改
                fdata: {//附件额外参数
                    serverId: '',//服务id     [非必填]  分布式附件服务可以用默认不用配制
                    flowId: '', //流程id      [非必填]  流程相关
                    execType: '',//操作类型   [非必填]  业务相关
                    caseId: '',//登记号       [非必填]  业务相关的登记号
                },
                isConvert: true,
                rules: {}
            }
        },
        props: {
            data: {
                type: Object
            },
            callback: {
                type: Function
            }
        },
        watch: {
            fileImageList: function (nv, ov) {
                console.log(nv, ov)
                if (nv.length === ov.length) {
                    this.isConvert = false
                }
            }
        },
        methods: {
            handleSubmit: function () {
                this.callback(this.form);
            },
            handleCancel: function () {
                this.callback();
            },
            //callBack上传组件数据发生变化回调
            fileUploadCallBack(file, list) {
                this.fileList = list;
                let ids = list.map(function (v) {
                    return v.id;
                }).join(",");
                this.form.attachmentId = JSON.stringify(ids.split(","));
            },
            fileImageUploadCallBack: function (file, list) {
                if (this.form.imageAttachmentId) {
                    this.$confirm("是否确认覆盖?").then(() => {
                        this.fileImageList = list;
                        this.form.imageAttachmentId = this.fileImageList[0].id;
                    }).catch(() => {
                        this.handleGetUploadFileList(this.data.registrationNo);
                        this.form.imageAttachmentId = null
                    });
                } else {
                    this.fileImageList = list;
                    this.form.imageAttachmentId = this.fileImageList[0].id;
                }
            },
            handleGetUploadFileList: function (registrationNo) {
                let _this = this;
                ajaxRequest("GET", "back/subcontract/getUploadFileList", {
                    registrationNo: registrationNo
                }, res => {
                    if (res.code === 200 && res.rows.length > 0) {
                        _this.attachment = res.rows.map(function (v) {
                            return v.attachmentId;
                        }).join(",");
                        _this.imgId = res.rows[0].imageAttachmentId;
                        this.demo = false;
                        this.$nextTick(val => {
                            this.demo = true;
                        });
                    }
                });
            }
        },
        mounted() {
            let _this = this;
            _this.form.subcontractId = _this.data.id;
            _this.form.companyName = _this.data.companyName;
            _this.form.registrationNo = _this.data.registrationNo;
            _this.form.applianceName = _this.data.applianceName;
            _this.form.applianceActualName = _this.data.applianceActualName;
            _this.form.setNumber = _this.data.setNumber;
            _this.form.certificateNumber = _this.data.certificateNumber;
            _this.form.entrustDate = _this.data.entrustDate.substr(0, 10);
            _this.form.detectionDeadline = _this.data.detectionDeadline.substr(0, 10);
            _this.limitNumb = _this.data.setNumber;

            _this.handleGetUploadFileList(_this.data.registrationNo);
        }
    }
</script>

<style scoped>

</style>