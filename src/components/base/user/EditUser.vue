<template>
    <mind-dialog
            :title="!!rowInfo.id?'编辑用户':'新增用户'"
            :visible="true"
            dialogSize="mid"
            center
            v-dialogDrag
            :lock-scroll="true"
            @close="handleCancel">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px" class="userForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="登录账号" prop="userNo" class="mr40">
                        <el-input v-model="form.userNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="密码" prop="password">
                        <template slot="label">
                            <span>密码</span>
                            <el-tooltip>
                                <i class="el-icon-info" style="font-size:12px"></i>
                                <div slot="content">不可修改,如遗忘请使用密码复位功能</div>
                            </el-tooltip>
                        </template>
                        <el-input :disabled="true" :type="viewPassword ? 'text' : 'password'" v-model="form.password"
                                  auto-complete="off"></el-input>
                        <span class="passwordIcon el-icon-view" title="查看密码"
                              @click="viewPassword = !viewPassword" v-if="!rowInfo.id"></span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="用户姓名" prop="userName">
                        <el-input v-model="form.userName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属部门" prop="departId">
                        <el-select v-model="form.departId" placeholder="请选择" style="width: 100%">
                            <el-option
                                    v-for="item in departList"
                                    :key="item.id"
                                    :label="item.departName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item prop="postName">
                        <template slot="label">
                            <span>所属检测岗位</span>
                            <el-tooltip class="item" effect="dark" content="将人员与岗位关联，相应功能模块无权限仅可列出和其相关的岗位记录">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-input :readonly="true" v-model="form.postName" style="width:70%;"></el-input>
                        <el-button class="ml10" type="primary" @click="openSession('post')">选择</el-button>
                        <el-button type="warning" :disabled="!form.postId"
                                   v-mindPopover="{message:'是否清空?',success:handleEmpty.bind(this,'session')}">清空
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item prop="roleName">
                        <template slot="label">
                            <span>角色</span>
                            <el-tooltip>
                                <i class="el-icon-info"></i>
                                <div slot="content">用户的权限管理由角色来进行控制</div>
                            </el-tooltip>
                        </template>
                        <el-input :readonly="true" v-model="form.roleName" style="width: 70%"></el-input>
                        <el-button class="ml10" type="primary" @click="roleVisible=true">选择</el-button>
                        <el-button type="warning" :disabled="!form.roleId"
                                   v-mindPopover="{message:'是否清空?',success:handleEmpty.bind(this,'role')}">清空
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="电子签名" prop="signnature">
                        <mind-upimage :limitNumb="1"
                                      :fileLists="fileList"
                                      :attachIds="attachIds"
                                      :callBack="handleUpLoad"
                                      :data="fdata"
                                      fileType="image/jpg,image/jpeg,image/png"
                                      width="160"
                                      height="100"></mind-upimage>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="signNaturePassword">
                        <template slot="label">
                            <span>电子签名密码</span>
                            <el-tooltip class="item" effect="dark" content="电子签名密码用于证书/记录审核、担保等环节使用,不可修改,如遗忘请使用密码复位功能">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-input :disabled="true" :type="viewSignPassword?'text':'password'"
                                  v-model="form.signNaturePassword"></el-input>
                        <span class="passwordIcon el-icon-view" title="查看密码"
                              @click="viewSignPassword = !viewSignPassword" v-if="!rowInfo.id"></span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item prop="certificateFlag">
                        <template slot="label">
                            <span>是否授权签字人</span>
                            <el-tooltip class="item" effect="dark"
                                        content="选择为“全部证书”时，该人员可批准所有证书；选择为“是”时，该人员可批准对应的岗位证书">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-select v-model="form.certificateFlag" placeholder="请选择" style="width: 100%">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="position">
                        <template slot="label">
                            <span>职务</span>
                            <el-tooltip class="item" effect="dark" content="职务用于证书中授权签字人职务">
                                <i class="el-icon-info ft12"></i>
                            </el-tooltip>
                        </template>
                        <el-input v-model="form.position"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="所属授权岗位" prop="allowPostName" v-if="form.certificateFlag === '0'">
                        <el-input :readonly="true" v-model="form.allowPostName" style="width: 70%;"></el-input>
                        <el-button class="ml10" type="primary" @click="openSession('persionPost')">选择</el-button>
                        <el-button type="warning" :disabled="!form.allowPostId"
                                   v-mindPopover="{message:'是否清空?',success:handleEmpty.bind(this,'persion')}">清空
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="邮箱地址" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机" prop="mobilePhone">
                        <el-input v-model="form.mobilePhone"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="办公电话" prop="officePhone">
                        <el-input v-model="form.officePhone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
        <session-select v-if="!!sessionVisible"
                        :departList="departList"
                        :slug="sessionVisible"
                        :callback="handleSessionCallback"
                        :selectSession="sessionVisible === 'post' ? tempPostObject : tempAllowObject"
        ></session-select>
        <role-list v-if="roleVisible" :roleList="roleList" :selectRole="form.roleId"
                   :callback="handleRoleCallback"></role-list>
    </mind-dialog>
</template>

<script>
    import $ from 'jquery';
    import {ajaxRequest, formatArrayToTree, ajaxProxyRequest} from '../../util/base';
    import sessionSelect from './sessionSelect'
    import roleList from './RoleList'
    import ElRow from "@/common-el/packages/row/src/row";
    import ElCol from "@/common-el/packages/col/src/col";


    const defaults = {
        userNo: '',
        userName: '',
        password: '666666',
        departId: '',
        departId2: '',
        signnature: '',
        role: '',
        post: '',
        certificateFlag: '1',
        allowPost: '',
        signNaturePassword: '666666'
    };
    export default {
        name: "edit-user",
        components: {
            ElCol,
            ElRow,
            sessionSelect,
            roleList
        },
        props: {
            rowInfo: {
                type: Object,
                required: true
            },
            callback: {
                type: Function,
                required: true
            }
        },
        data() {
            var validatorUserNo = (rule, value, callback) => {
                let reg = /^(\d|[a-zA-Z])*$/
                if (value === '') {
                    callback(new Error('请输入登录账号'));
                } else if (reg.test(value)) {
                    if (value.length > 20) {
                        callback(new Error("账号长度不能超过20个字符"))
                    } else {
                        ajaxRequest('get', 'back/user/judgeUserNo', {
                            userId: this.form.id,
                            userNo: this.form.userNo
                        }, (res) => {
                            console.log(res)
                            if (res.code == 200) {
                                if (res.msg == '1' && !this.form.id) {
                                    callback('该登录账号已存在！')
                                } else {
                                    callback()
                                }
                            }
                        })
                    }
                } else {
                    callback(new Error('登录账号必须是字母或数字!'))
                }
            };
            var validatorEmail = (rule, value, callback) => {
                let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
                if (value && !reg.test(value)) {
                    callback(new Error('请输入正确的邮箱格式'));
                } else {
                    if (value && value.length > 40) {
                        callback(new Error('最多输入40个字符'))
                    } else {
                        callback();
                    }
                }
            };
            var validatorMobilePhone = (rule, value, callback) => {
                if (value) {
                    if (value.length > 20) {
                        callback(new Error('最多输入20个字符'))
                    } else {
                        if (value.length != 11) {
                            callback(new Error('请输入11位手机号'))
                        }
                        let reg = /^[1][3,4,5,7,8][0-9]{9}$/g
                        if (!reg.test(value)) {
                            callback(new Error('请输入纯数字'));
                        } else {
                            callback();
                        }
                    }
                } else {
                    callback()
                }
            };
            var validatorOfficePhone = (rule, value, callback) => {
                if (value && value.length > 20) {
                    callback(new Error('最多输入20个字符'));
                } else {
                    let reg = /([0-9]{3,4}-)?[0-9]{7,8}/
                    if (value && !reg.test(value)) {
                        callback(new Error('请输入正确的电话格式'));
                    } else {
                        callback();
                    }
                }
            };
            let passwordCheck = function (rule, value, cb) {
                if (!!value) {
                    if (value.length > 32) {
                        cb(new Error('密码长度不能超过32个字符'))
                    } else {
                        cb()
                    }
                } else {
                    cb(new Error('密码不能为空！'))
                }
            };
            return {
                form: $.extend({}, defaults, this.rowInfo),
                options: [{
                    value: '0',
                    label: '是'
                }, {
                    value: '1',
                    label: '否'
                }, {
                    value: '2',
                    label: '全部证书'
                }],
                value: '',
                fileList: false,
                sessionVisible: '',
                roleVisible: false,
                departList: [],
                roleList: [],
                roleName: [],
                temp: [],
                session: [],
                persionSession: [],
                sessionObjectList: [],
                tempAllowObject: [],
                tempPostObject: [],
                viewPassword: false,
                viewSignPassword: false,
                fdata: {//附件额外参数
                    serverId: 'http5',//服务id     [非必填]  分布式附件服务可以用默认不用配制
                    execType: '签名',//操作类型   [非必填]  业务相关
                },
                fileList: [],
                rules: {
                    userNo: [
                        {validator: validatorUserNo, required: true, trigger: 'blur'}
                    ],
                    userName: [
                        {required: true, message: '登录名称不能为空'},
                        {max: 20, message: '最多输入20个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, validator: passwordCheck, trigger: 'blur'}
                    ],
                    departId: [
                        {required: true, message: '请选择部门'}
                    ],
                    email: [
                        {validator: validatorEmail, required: false, trigger: 'blur'}
                    ],
                    mobilePhone: [
                        {validator: validatorMobilePhone, required: false, trigger: 'blur'}
                    ],
                    officePhone: [
                        {validator: validatorOfficePhone, required: false, trigger: 'blur'}
                    ],
                    allowPostName: [
                        {required: true, message: '所属授权岗位不能为空'}
                    ],
                    position: [
                        {max: 20, message: '最多输入20个字符', trigger: 'blur'}
                    ],
                    signNaturePassword: [
                        {max: 100, message: '最多输入100个字符', trigger: 'blur'}
                    ]
                },
                length: '*'
            }
        },
        computed: {
            attachIds() {
                if (this.form.signnature) {
                    return this.form.signnature
                } else {
                    return ''
                }
            }
        },
        watch: {
            // form:{//深度监听，可监听到对象、数组的变化
            //     handler(val, oldVal){
            //       this.$set(this.rules,'allowPostName',[
            //         { required: val.certificateFlag === '0' , message: '所属授权岗位不能为空'}
            //       ])
            //     },
            //     deep:true
            // }
        },
        methods: {
            openSession(slug) {
                this.sessionVisible = slug
            },
            handleEmpty(slug) {
                let _this = this;
                switch (slug) {
                    case 'session' :
                        _this.form = Object.assign({}, _this.form, {
                            postName: '',
                            postId: '',
                            postDepartId: ''
                        })
                        _this.tempPostObject = []
                        break;
                    case 'role' :
                        _this.form = Object.assign({}, _this.form, {
                            roleName: '',
                            roleId: ''
                        })
                        break;
                    case 'persion' :
                        _this.form = Object.assign({}, _this.form, {
                            allowPostName: '',
                            allowPostId: '',
                            allowPostDepartId: ''
                        })
                        _this.tempAllowObject = []
                        break;
                }
            },
            handleSubmit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.callback(this.form);
                    } else {
                        return false;
                    }
                })
            },
            handleCancel() {
                this.callback();
            },
            handleRemove(file) {
                this.fileList = false
                console.log(this.fileList)
            },
            handleSuccess(res, file, fileList) {
                this.fileList = true
                this.form.signnature = file.row
                console.log(res, file, fileList)
            },
            /**
             * [handleSessionCallback 岗位选择器回调]
             * @return {[type]} [description]
             */
            handleSessionCallback(info, slug) {
                if (info && info.length) {
                    this.sessionObjectList = info;
                    let tempSession = [],
                        idSession = [];
                    this.sessionObjectList.forEach(val => {
                        idSession.push(val.id)
                        tempSession.push(val.postName)
                    })
                    if (slug == 'post') {
                        this.tempPostObject = info
                        this.form.postId = idSession.join()
                        this.form.postName = tempSession.join()
                    } else {
                        this.tempAllowObject = info
                        this.form.allowPostId = idSession.join()
                        this.form.allowPostName = tempSession.join()
                    }
                    this.sessionVisible = false;
                } else {
                    this.sessionVisible = false;
                }
            },
            /**
             * [handleRoleCallback 角色列表选择器]
             * @param  {[type]} info [description]
             * @return {[type]}      [description]
             */
            handleRoleCallback(info) {
                if (info) {
                    let infoArray = [];
                    // 置空roleName
                    this.roleName = [];
                    info.forEach(val => {
                        this.roleName.push(val.roleName)
                        infoArray.push(val.id)
                    })
                    this.form.roleName = this.roleName.join()
                    this.form.roleId = infoArray.join(',')
                    this.roleVisible = false;
                } else {
                    this.roleVisible = false;
                }
            },
            /**
             * [getDepartList 获取部门列表]
             * @return {[type]} [description]
             */
            getDepartList() {
                ajaxRequest('get', 'back/depart/list', {
                    isDelete: 0,
                }, (val => {
                    if (val.code === 200) {
                        this.departList = val.rows;
                    } else {
                        this.$message.error(val.message)
                    }
                }))
            },
            /**
             * [getRoleList 获取角色列表]
             * @return {[type]} [description]
             */
            getRoleList() {
                ajaxRequest('get', 'back/role/retrieve', {
                    page: this.page,
                    rows: this.rows,
                    isDelete: 0,
                    total: 0,
                }, (val => {
                    if (val.code === 200) {
                        this.roleList = val.rows;
                    } else {
                        this.$message.error(val.message)
                    }
                }))
            },
            handleSessionData() {
                let allowPostDepartId = this.form.allowPostDepartId && this.form.allowPostDepartId.split(','),
                    allowPostName = this.form.allowPostName && this.form.allowPostName.split(','),
                    allowPostId = this.form.allowPostId && this.form.allowPostId.split(',');
                if (allowPostDepartId && allowPostDepartId.length) {
                    allowPostDepartId.forEach((val, index) => {
                        this.tempAllowObject.push({
                            departId: allowPostDepartId[index] * 1,
                            postName: allowPostName[index],
                            id: allowPostId[index] * 1
                        })
                    })
                }
                let postDepartId = this.form.postDepartId && this.form.postDepartId.split(','),
                    postName = this.form.postName && this.form.postName.split(','),
                    postId = this.form.postId && this.form.postId.split(',');
                if (postDepartId && postDepartId.length) {
                    postDepartId.forEach((val, index) => {
                        this.tempPostObject.push({
                            departId: postDepartId[index] * 1,
                            postName: postName[index],
                            id: postId[index] * 1
                        })
                    })
                }
            },
            handleUpLoad(file, list) {
                let signnature = ''
                if (list.length > 0) {
                    for (let i = 0; i < list.length; i++) {
                        signnature = list[i].id + ',' + signnature
                    }
                }
                if (signnature != '') {
                    signnature = signnature.substring(0, signnature.length - 1)
                    this.form.signnature = signnature
                }
                console.log(this.form.signnature)
            },
            resetPassword() {

            },
        },
        mounted() {
            this.getDepartList()
            this.getRoleList()
            this.handleSessionData()
            if (!!this.rowInfo.id) {
                this.length = '******'
            }

        }
    }
</script>

<style scoped lang="scss">
    .userForm {

    .ft12 {
        font-size: 12px;
    }

    .passwordIcon {
        height: 20px;
        line-height: 20px;
        width: 35px;
        display: inline-block;
        position: absolute;
        right: 5px;
        top: 10px;
        text-align: center;
        font-size: 16px;
        cursor: pointer;

    &
    :hover {

    &
    {
        color: #14a7fb
    }
    }
    }
    }
</style>
