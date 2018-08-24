<template>
    <div>
        <div class="form">
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                <el-Row>
                    <el-col :span="10">
                        <el-form-item label="文件编号" prop="fileCode">
                            <el-input v-model="form.fileCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="文件名称" prop="fileName">
                            <el-input v-model="form.fileName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-Row>
                <el-Row>
                    <el-col :span="20">
                        <el-form-item label="原因">
                            <el-input v-model="form.reason"></el-input>
                        </el-form-item>
                    </el-col>
                </el-Row>
                <el-Row>
                    <el-col :span="20">
                        <el-form-item label="备注">
                            <el-input v-model="form.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-Row>
                <el-Row>
                    <el-col :span="10">
                        <el-form-item label="部门" prop="departCode">
                            <el-select v-model="form.departCode" @change="changeDepartEvt" placeholder="请选择"
                                       value-key="name">
                                <el-option
                                        v-for="item in departs"
                                        :label="item.name"
                                        :value="String(item.code)">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="审核人" prop="approvalUserCode">
                            <el-select v-model="form.approvalUserCode" @change="handleChange" placeholder="请选择"
                                       value-key="name">
                                <el-option
                                        v-for="item in persons"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="String(item.code)">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-Row>
                <el-row v-if="!isAdd && this.parent === 'check'">
                    <el-col :span="20">
                        <el-form-item label="审核意见">
                            <el-input v-model="form.approvalOpinion"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="附件" prop="attachment">
                            <mind-upload v-if="show" ref="upFiles" :limitNumb="limitNumb"
                                         :attachIds="form.strFileAttachments"
                                         :callBack="fileUploadCallBack"></mind-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="button">
            <el-button v-if="!isAdd && this.parent !== 'query'" type="primary" @click="handleUpdate">修改文件</el-button>
            <el-button v-if="isAdd" type="primary" @click="handleSubmit">保 存</el-button>
            <el-button v-if="!isAdd && isCurrentUser && this.parent === 'check' && this.status !== 3" type="primary"
                       @click="handleToNextCheck">下一级审核
            </el-button>
            <el-button v-if="!isAdd && isCurrentUser && this.parent === 'check' && this.status !== 3" type="primary"
                       @click="handleToAdmin">转管理员
            </el-button>
            <el-button
                    v-if="!isAdd && isCurrentUser && this.parent === 'check' && this.status !== 3 &&this.status !== 1"
                    type="warning"
                    @click="handleReturnBack">退 回
            </el-button>
            <el-button v-if="!isAdd && this.parent === 'query' && this.status === 3" type="primary"
                       @click="handlePlaceOnFile">归 档
            </el-button>
            <el-button v-if="!isAdd" @click="handlePrint" type="primary">打 印</el-button>
            <el-button @click="handleCancel">返 回</el-button>
        </div>
        <div v-if="!isAdd" class="history-table">
            <p>审核历史记录</p>
            <el-table :data="tableData" :max-height="QJTableMaxHeight" size="small" border>
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="approvalPerson" label="审核人"></el-table-column>
                <el-table-column prop="status" label="审核状态" :formatter="formatterColumn"></el-table-column>
                <el-table-column prop="approvalTime" label="审核时间" :formatter="formatterTime"></el-table-column>
                <el-table-column prop="approvalOpinion" label="审核意见"></el-table-column>
            </el-table>
        </div>

        <!-- 归档弹窗 -->
        <PlaceOnFile v-if="placeOnFile" :data="form.fileCode" :callback="handleCallback"></PlaceOnFile>
    </div>
</template>

<script>
    import Vue from 'vue'
/*     import {
        Button,
        Checkbox,
        CheckboxGroup,
        Col, 
        Form,
        FormItem,
        Input,
        InputNumber, 
        Radio,
        RadioGroup,
        Row, 
    } from 'element--ui'
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Button);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(RadioGroup);
    Vue.use(Radio);
    Vue.use(CheckboxGroup);
    Vue.use(Checkbox);  */
    // 引入封装的ajax控件
    import {formatDate, ajaxRequest} from '../../util/base'
    import PlaceOnFile from './PlaceOnFile'
    // 引入jquery
    import $ from 'jquery'

    export default {
        name: 'fileApprovalForm', 
        components: {
            PlaceOnFile
        },
        data() {
            var validatorFileName = (rule, value, callback) => {
                if (value) {
                    ajaxRequest("get", "back/fileApproval/checkFileCodeUnique", {fileCode: value}, res => {
                        if (res.code === 200) {
                            callback(new Error('文件编码已存在！'));
                        } else {
                            callback();
                        }
                    });
                } else {
                    callback(new Error('文件编码不能为空'))
                }
            };
            return {
                form: {},
                departs: [],
                persons: [],
                tableData: [],
                show: true,
                isAdd: false,
                status: 0,//文件审核状态
                isCurrentUser: false,//是否当前登录用户
                placeOnFile: false,//显示归档弹窗
                parent: '',
                params: '',
                limitNumb: 15,
                fileList: [],
                rules: {
                    //校验规则设置例子  type 字段类型  require是否必填 message 错误提示信息
                    approvalUserCode: [{required: true, message: '审核人不能为空'}],
                    departCode: [{required: true, message: '审核部门不能为空'}],
                    fileName: [{type: 'string', required: true, message: '文件名称不能为空'}],
                    fileCode: [{type: 'string', validator: validatorFileName, required: true, trigger: 'blur'}],
                }
            }
        },
        mounted() {
            let _self = this;
            _self.params = _self.$route.query;
            _self.parent = _self.params.parent;
            _self.isAdd = _self.params.isAdd;
            _self.getDepartList();
            if (!_self.isAdd) {
                _self.getTableList(_self.params.id);
            }
        },
        watch: {
            'form.departCode': function (newValue, oldValue) {
                console.log(newValue, oldValue);
                if (newValue !== oldValue) {
                    this.getUserByDepart(newValue, true);
                }
            }
        },
        methods: {
            handleToNextCheck: function () {//转下一级审核
                let _self = this;
                _self.form.fileApprovalLogs = [];
                _self.form.fileAttachments = [];
                ajaxRequest("put", "back/fileApproval/toNextApproval", _self.form, res => {
                    if (res.code === 200) {
                        _self.$message.success("转下一级审核成功");
                        _self.getTableList(_self.params.id);
                    } else {
                        _self.$message.error("转下一级审核失败");
                    }
                });
            },
            handleToAdmin: function () {//转管理员
                let _self = this;
                _self.form.fileApprovalLogs = [];
                _self.form.fileAttachments = [];
                ajaxRequest("put", "back/fileApproval/toAdmin", _self.form, res => {
                    if (res.code === 200) {
                        _self.$message.success("转管理员成功");
                        _self.getTableList(_self.params.id);
                    } else {
                        _self.$message.error("转管理员失败");
                    }
                });
            },
            handleReturnBack: function () {//退回toFinished
                let _self = this;
                _self.form.fileApprovalLogs = [];
                _self.form.fileAttachments = [];
                ajaxRequest("put", "back/fileApproval/toReturnBack", _self.form, res => {
                    if (res.code === 200) {
                        _self.$message.success("退回成功");
                        _self.getTableList(_self.params.id);
                    } else {
                        _self.$message.error("退回失败");
                    }
                });
            },
            handlePlaceOnFile: function () {//打开归档弹窗
                this.placeOnFile = true;
            },
            handlePrint: function () {
                //todo 打印
                console.log("打印")
            },
            changeDepartEvt: function (departId) {//部门,审核人 二级联动
                if (departId) {
                    this.getUserByDepart(departId, false);
                }
            },
            handleChange: function (v) {
                Vue.set(this.form, 'approvalUserCode', v)
            },
            fileUploadCallBack(file, list) {
                let _self = this;
                let ids = list.map(function (v) {
                    return v.id;
                }).join(",");
                _self.form.strFileAttachments = JSON.stringify(ids.split(","));
            },
            handleSubmit: function () {//新增文件审批对象
                let _self = this;
                this.$refs.form.validate((valid) => {
                    //校验成功则回调提交数据
                    if (valid) {
                        _self.form.fileApprovalLogs = [];
                        _self.form.fileAttachments = [];
                        ajaxRequest('post', 'back/fileApproval/addFileApproval', _self.form, res => {
                            if (res.code === 200) {
                                _self.$message.success("文件保存成功");
                            } else {
                                _self.$message.error("文件保存失败");
                            }
                        });
                    }
                });
            },
            handleUpdate: function () {//修改webOffice文件
                //todo 操作webOffice 保存文件
                let _self = this;
                _self.getTableList(_self.params.id)
            },
            handleCancel: function () {//返回
                let path = '';
                switch (this.parent) {
                    case "add":
                        path = '/admin/450';
                        break;
                    case "check":
                        path = '/admin/451';
                        break;
                    case "query":
                        path = '/admin/452';
                        break;
                }
                this.$router.push({path: path});
            },
            formatterColumn: function (row, column, value) {
                let res = "";
                switch (value) {
                    case 0:
                        res = "未审核";
                        break;
                    case 1:
                        res = "已退回";
                        break;
                    case 2:
                        res = "审核中";
                        break;
                    case 3:
                        res = "审核已通过";
                        break;
                    case 4:
                        res = "完成";
                        break;
                }
                return res;
            },
            formatterTime: function (row, column) {
                return formatDate(row.approvalTime, 'YYYY-MM-DD');
            },
            getDepartList: function () {//获取部门列表
                let _self = this;
                ajaxRequest("get", "back/depart/list", {}, res => {
                    if (res.code === 200) {
                        _self.departs = res.rows.map(function (v) {
                            let obj = {};
                            obj.code = v.id;
                            obj.name = v.departName;
                            return obj;
                        });
                    } else {
                        _self.$message.error("加载部门数据出错");
                    }
                });
            },
            getUserByDepart: function (departId, isWatch) {
                let _self = this;
                ajaxRequest("get", "back/user/listUserByDeptId/" + departId, {}, res => {
                    if (res.code === 200) {
                        this.persons = res.rows.map(function (v) {
                            let obj = {};
                            obj.name = v.userName;
                            obj.code = v.id;
                            return obj;
                        });
                        if (!isWatch) {
                            Vue.set(this.form, 'approvalUserCode', '');
                        }
                    } else {
                        _self.$message.error("加载审核人出错");
                    }
                });
            },
            getTableList: function (id) {//获取历史记录
                let _self = this;
                ajaxRequest("get", "back/fileApproval/getFileApproval/" + id, {}, res => {
                    if (res.code === 200) {
                        const fileApprovalObj = res.daoResult;
                        const currentUserId = localStorage.getItem("userId");

                        //加载文件审批审核历史记录
                        _self.tableData = fileApprovalObj.fileApprovalLogs;
                        //加载文件审批
                        _self.form = fileApprovalObj;
                        _self.status = fileApprovalObj.status;
                        //加载文件审批附件
                        _self.form.strFileAttachments = fileApprovalObj.fileAttachments.map(function (v) {
                            return v.attachmentId;
                        }).join(",");
                        this.show = false;
                        this.$nextTick(val => {
                            this.show = true;
                        });
                        //当前登录人员与文件审批的审核部门,审核人是同一个人是才能操作文件
                        if (currentUserId === fileApprovalObj.approvalUserCode) {
                            _self.isCurrentUser = true;
                        } else {
                            _self.isCurrentUser = false;
                        }

                    } else {
                        _self.$message.error("加载数据失败");
                    }
                });
            },
            handleCallback: function (rowInfo) {
                if (rowInfo) {
                    console.log(rowInfo);
                    //todo 归档操作
                } else {
                    this.placeOnFile = false;
                }
            }
        },
        props: {
            callback: {
                type: Function
            }
        }
    }
</script>

<style scoped>
    .history-table > p {
        text-align: center;
        background-color: #1fbba6;
        color: #ffffff;
    }

    .button {
        text-align: center;
        margin-bottom: 10px;
    }
</style>
