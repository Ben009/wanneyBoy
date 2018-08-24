<template>
    <mind-dialog
            :title="'公告详细'"
            :visible="true"
            dialogSize="mid"
            center
            v-dialogDrag
            @close="handleCancel">
        <el-form class="notiform" ref="form" label-width="100px" :model="info">
            <el-form-item label="标题:" prop="noticeTitle">
                <el-input class="inputform" v-model="info.noticeTitle"></el-input>
            </el-form-item>
            <el-form-item label="录入日期:" prop="createTime">
                <el-input class="inputform" v-model="info.createTime"></el-input>
            </el-form-item>
            <el-form-item label="录入人:" prop="createPersonName">
                <el-input class="inputform" v-model="info.createPersonName"></el-input>
            </el-form-item>
            <el-form-item label="附件列表" style="line-height: 25px;">
                <mind-upload :disabled="true" @getFileList="handleGetFileList" ref="upFiles"></mind-upload>
            </el-form-item>
        </el-form>
        <div class="editpo">
            <div class="editor" v-html="info.noticeContent"></div>
        </div>
        <el-row style="text-align:center;margin:20px 0;">
            <el-button @click="handleCancel">返 回</el-button>
        </el-row>
    </mind-dialog>
</template>

<script>
    import Vue from "vue";
    import Vuex from "vuex";
    import {ajaxRequest} from "../../util/base";
    import $ from 'jquery'

    export default {
        name: "notice",
        props: {
            infoId: {
                type: Number,
            },
            callback: {
                type: Function
            }
        },
        data() {
            return {
                info: {
                    createTime: null,
                    createPersonName: null,
                    noticeTitle: null,
                    noticeContent: null
                },
                fileList: []

            }
        },
        methods: {
            handleCancel: function () {
                this.callback();
            },
            handleGetFileList(data) {
                this.fileList = data;
            },
            initNoticData: function (id) {
                ajaxRequest("get", "back/notice/" + id, {}, res => {
                    if (res.code === 200) {
                        this.info = res.daoResult;
                        this.info.createTime = this.info.createTime.split(' ')[0];
                        if (this.info.attachment) {
                            let fileId = this.info.attachment.slice(
                                0,
                                this.info.attachment.length - 1
                            );
                            this.$refs.upFiles.loadAttacheIds(fileId);
                        }
                    }
                });
            }
        },
        mounted() {
            this.initNoticData(this.infoId);
        }
    }
</script>

<style scoped>
    .editpo {
        margin: auto;
        border: 1px solid #ccc;
        min-height: 200px;
    }

    .container {
        width: 95%;
        margin: auto;
    }
</style>