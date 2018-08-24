<template>
    <div>
        <!-- 高级检索搜索框 start -->
        <div>
            <Retrieve ref="retrieve-wapper"
                      :rowsCondition='rowsCondition'
                      :sortBy="sortBy"
                      v-if="defaultOpen"
                      :order="order"
                      :paramJson="paramJson"
                      :retrieveCondition="retrieveCondition"
                      :collectionInfo="collectionInfo"/>
        </div>
        <!-- 高级检索搜索框 end -->

        <!-- 个性化设置 start -->
        <div style="display: flex;justify-content: space-between; margin:10px 0px;">
            <div style="width:240px">
                <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增用户</el-button>
                <el-button size="small" type="primary" icon="el-icon-refresh" @click="handleRefresh()">恢复用户</el-button>
            </div>
            <div style="display: inline-block;text-align: center">
                <el-button type="primary" @click="QJAdvanceSearch" class="el-icon-search" v-if="defaultOpen">查询
                </el-button>
                <el-button type="warning" @click="QJEmptyCondition" class="el-icon-warning" v-if="defaultOpen">
                    &nbsp;清空
                </el-button>
            </div>
            <span style="float: right">
        <el-select size="mini" v-if="resultCondition.length" v-model="templateValue" placeholder="请选择"
                   @change="QJHandleSelectTemplate">
          <el-option
                  v-for="item in moduleList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" round @click="QJPersonalSetting(1)"
                   class="el-icon-setting">个性化设置</el-button>
        <div class="el-icon-info  shuoming">
          <el-row class="el-sm">
             <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">
                            事项说明</p>
                        <dl style="padding:6px 10px; ">
            <p>1.分管领导：设置部门分管负责人</p>
            <p>2.重置密码：默认重置密码为<span style="color:red">666666</span></p>
                        </dl>
          </el-row>
        </div>
        <WorkMould v-if="isSetting" :rowsCondition='paramJson' :callback="QJPersonalSetting"
                   :handleMouldBack="QJHandleMouldBack"/>
      </span>
        </div>
        <!-- 个性化设置 end -->
        <div>
            <el-table :data="tableData"
                      border
                      stripe
                      style="width: 100%"
                      @selection-change="handleSelectionChange"
                      :max-height="QJTableMaxHeight"
                      v-loading="loading">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column fixed type="index" label="序号" width="50"></el-table-column>
                <el-table-column
                        v-if="headObj.userNo"
                        prop="userNo"
                        label="登录账号">
                </el-table-column>
                <el-table-column
                        v-if="headObj.userName"
                        prop="userName"
                        label="用户姓名">
                </el-table-column>
                <el-table-column
                        v-if="headObj.departId"
                        prop="departId"
                        :formatter="formatDepart"
                        label="所属部门">
                </el-table-column>
                <el-table-column
                        v-if="headObj.postName"
                        prop="postName"
                        show-overflow-tooltip
                        label="所属检测岗位">
                </el-table-column>
                <el-table-column
                        v-if="headObj.certificateFlag"
                        prop="certificateFlag"
                        label="是否授权签字"
                        :formatter="function(row){ return options[row.certificateFlag]}">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ options[scope.row.certificateFlag] && options[scope.row.certificateFlag]['label'] }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="headObj.allowPostName"
                        prop="allowPostName"
                        show-overflow-tooltip
                        label="所属授权岗位">
                </el-table-column>
                <el-table-column
                        v-if="headObj.roleName"
                        prop="roleName"
                        show-overflow-tooltip
                        label="角色">
                </el-table-column>
                <el-table-column
                        v-if="headObj.position"
                        prop="position"
                        show-overflow-tooltip
                        label="职务">
                </el-table-column>
                <el-table-column
                        v-if="headObj.email"
                        prop="email"
                        show-overflow-tooltip
                        label="邮箱地址">
                </el-table-column>
                <el-table-column
                        v-if="headObj.mobilePhone"
                        prop="mobilePhone"
                        show-overflow-tooltip
                        label="手机">
                </el-table-column>
                <el-table-column
                        v-if="headObj.officePhone"
                        prop="officePhone"
                        show-overflow-tooltip
                        label="办公电话">
                </el-table-column>
                <el-table-column
                        label="操作"
                        fixed="right"
                        width="160px">
                    <template slot-scope="scope">
                        <div :id="'id'+scope.row.id"></div>
                        <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                                class="el-icon-edit-outline" title="编辑"></i></el-button>
                        <el-button v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,[scope.row])}"
                                   type="text" style="padding:0;font-size:18px;"><i class="el-icon-delete"
                                                                                    title="删除"></i></el-button>
                        <el-button @click="handleManage([scope.row])" type="text" style="padding:0;font-size:18px;"><i
                                class="el-icon-news" title="分管部门"></i></el-button>
                        <el-button
                                v-mindPopover="{message:`<div>选择要重置的密码类型(默认重置为666666)</div><div style='margin-top:10px'><el-checkbox v-model='flag1'>用户名密码</el-checkbox><el-checkbox style='margin-left:10px' v-model='flag2'>电子签名密码</el-checkbox></div>`,success:handleReset.bind(this,[scope.row])}"
                                type="text" style="padding:0;font-size:18px;"><i class="el-icon-refresh"
                                                                                 title="重置密码"></i></el-button>
                        <!-- <el-button v-mindPopover="{message:`此功能暂未开发`,placement:'left'}" type="text" style="padding:0;font-size:18px;"><i class="el-icon-printer" title="登录日志"></i></el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-button type="primary" :disabled="!multipleSelection.length"
                   v-mindPopover="{message:`<div>选择打印的标签类型</div><div style='margin-top:10px'><el-radio v-model='flag1' :label='false'>一维码</el-radio><el-radio v-model='flag1' style='margin-left:10px' :label='true'>二维码</el-radio></div>`,success:handlePrient.bind(this,null)}">
            批量打印
        </el-button>
        <div style="margin-top:10px;text-align:center;float:right;" v-show="!isSetting">
            <mind-pagination
                    :current-page="page"
                    :page-size="rows"
                    :total="total"
                    @size-change="handlePageSizeChange"
                    @current-change="handleCurrentPageChange">
            </mind-pagination>
        </div>
        <EditUser v-if="!!edit" :rowInfo="edit" :callback="handleEditCallback"></EditUser>
        <session-manage v-if="!!manageVisiable" :rowInfo='manageVisiable'
                        :callback="handleManageCallback"></session-manage>
        <refresh-user v-if="!!refrenceDialog" :callback="handleRefrenceDialog"></refresh-user>
    </div>


</template>

<script>
    import Vue from 'vue';
    import Vuex from 'vuex';
    import $ from 'jquery';
    import VueBarcode from 'vue-barcode';
    import {ajaxRequest, formatArrayToTree} from '../../util/base';
    import EditUser from './EditUser'
    import Retrieve from '../../Retrieve'
    import sessionManage from './SessionManage'
    import refreshUser from './refreshUser'
    import TableColumnHeader from '../../Table/TableColumnHeader'
    import WorkMould from '../../mould/WorkMould';
    import userJson from './userJson'


    export default {
        name: "user-table",
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                searchKey: '',
                tableData: [],
                multipleSelection: [],
                edit: null,
                manageVisiable: null,
                refrenceDialog: null,
                departList: [],
                tempDepartList: [],
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
                password: '666666',
                signNaturePassword: '666666',

                /*高级检索相关项*/
                fuzzySearch: 0,
                isSetting: 0, //控制个性化设置弹窗是否展示
                rowsCondition: userJson, //默认同目录下json数据 会依据模板改变
                paramJson: userJson, //同目录下json数据 常量
                moduleList: [], //模板列表
                templateValue: "", //当前选择的模板id
                sortBy: "", //排序字段
                order: "", //desc降序 asc升序
                headObj: {}, //表头显示对象 {category:true}
                defaultOpen: true, //默认开启高级查询
                userId: "",
                allModules: {}, //所有模板
                resultCondition: [],
                retrieveCondition: [],
                collectionInfo: [],
                loading:false,
            }
        },
        methods: {
            formatDepart(row) {
                return this.tempDepartList[row.departId]
            },
            getTableList() {
              this.loading=true
                ajaxRequest('get', 'back/user/retrieve', {
                    page: this.page,
                    rows: this.rows,
                    orderProperty: this.orderProperty,
                    orderType: this.orderType,
                    total: 0,
                    isDelete: 0,
                    sc: this.sc
                }, (res) => {
                    if (res.code === 200) {
                        this.tableData = res.rows;
                        this.total = res.total;
                        this.multipleSelection = [];
                    }
                  this.loading=false
                })
            },
            handleToggleTheme(color) {
                this.$store.commit('toggleTheme', color)
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handlePageSizeChange(size) {
                this.page = 1;
                this.rows = size;
                this.getTableList();
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage;
                this.getTableList();
            },
            handleEdit(rowInfo) {
                // this.$router.push({
                //   path:'/test1/edit',
                //   params:{
                //     name:'abc'
                //   },
                //   query:{
                //     name2:'ccc'
                //   }
                // })
                this.edit = rowInfo || {}
            },
            handleDelete(data) {
                let _this = this;
                if (data.length > 0) {
                    // this.$confirm('确定要删除该用户?', '提示', {
                    //   confirmButtonText: '确定',
                    //   cancelButtonText: '取消',
                    //   type: 'warning',
                    //   center:true,
                    // }).then(() => {
                    ajaxRequest('put', 'back/user/deleteUser', {
                        id: data[0].id,
                        isDelete: 1
                    }, function (res) {
                        if (res.code === 200) {
                            _this.$message.success('删除成功');
                            _this.getTableList();
                        }
                        else {
                            _this.$message.error('删除失败');
                        }
                    });
                    // },()=>{

                    // })
                } else {
                    this.$message({
                        message: '请先选择要删除的数据',
                        type: 'warning'
                    })
                }
            },
            handleEditCallback(rowInfo) {
                let _this = this;
                if (rowInfo) {
                    if (rowInfo.id) {
                        // 编辑操作
                        ajaxRequest('get', 'back/user/', {
                            userNo: rowInfo.userNo,
                        }, (res) => {
                            if (res.daoResult == null || res.daoResult.id == rowInfo.id) {
                                ajaxRequest('put', 'back/user/', {
                                    id: rowInfo.id,
                                    userNo: rowInfo.userNo,
                                    userName: rowInfo.userName,
                                    departId: rowInfo.departId,
                                    position: rowInfo.position,
                                    certificateFlag: rowInfo.certificateFlag,
                                    signnature: rowInfo.signnature,
                                    signNaturePassword: rowInfo.signNaturePassword,
                                    email: rowInfo.email,
                                    mobilePhone: rowInfo.mobilePhone,
                                    officePhone: rowInfo.officePhone,
                                    role: rowInfo.roleId ? JSON.stringify(rowInfo.roleId.split(',')) : JSON.stringify(''),
                                    post: rowInfo.postId ? JSON.stringify(rowInfo.postId.split(',')) : JSON.stringify(''),
                                    allowPost: rowInfo.allowPostId && rowInfo.certificateFlag == 0 ? JSON.stringify(rowInfo.allowPostId.split(',')) : JSON.stringify(''),
                                }, function (res) {
                                    if (res.code === 200) {
                                        _this.$message.success('编辑成功');
                                        _this.edit = null;
                                        _this.getTableList();
                                    }
                                    else {
                                        _this.$message.error('编辑失败');
                                    }
                                });
                            } else {
                                _this.$message.error('用户名已存在，请重试！')
                            }
                        })
                    }
                    else {
                        // 新增操作
                        // 新增之前增加一个查询的请求，根据查询到的结果进行判断是否进行增加数据，否则不增加
                        ajaxRequest('get', 'back/user/', {
                            userNo: rowInfo.userNo,
                        }, (res) => {
                            if (res.daoResult == null) {
                                ajaxRequest('post', 'back/user/', {
                                        userNo: rowInfo.userNo,
                                        userName: rowInfo.userName,
                                        password: rowInfo.password,
                                        departId: rowInfo.departId,
                                        position: rowInfo.position,
                                        certificateFlag: rowInfo.certificateFlag,
                                        signnature: rowInfo.signnature,
                                        signNaturePassword: rowInfo.signNaturePassword,
                                        email: rowInfo.email,
                                        mobilePhone: rowInfo.mobilePhone,
                                        officePhone: rowInfo.officePhone,
                                        role: rowInfo.roleId ? JSON.stringify(rowInfo.roleId.split(',')) : JSON.stringify(''),
                                        post: rowInfo.postId ? JSON.stringify(rowInfo.postId.split(',')) : JSON.stringify(''),
                                        allowPost: rowInfo.allowPostId && rowInfo.certificateFlag !== 0 ? JSON.stringify(rowInfo.allowPostId.split(',')) : JSON.stringify(''),
                                    },
                                    function (res) {
                                        if (res.code === 200) {
                                            _this.$message.success('新增成功');
                                            _this.edit = null;
                                            _this.getTableList();
                                        }
                                        else {
                                            _this.$message.error('新增失败');
                                        }
                                    })

                            } else {
                                _this.$message.error('用户名已存在,请重试！')
                            }
                        })
                        // userNo是有验证条件的，这里还没有加入


                    }
                }
                else {
                    this.edit = null
                }
            },
            /**
             * [handleManageCallback 分管部门弹窗回调]
             * @param  {[type]} info [description]
             * @return {[type]}      [description]
             */
            handleManageCallback(info, rowInfo) {
                let _this = this;
                if (info) {
                    let tempIds = info.map(val => {
                        return val.id
                    })
                    ajaxRequest('post', 'back/userChargeDepart/insertBatch', {
                        userId: rowInfo[0].id,
                        sc: JSON.stringify(tempIds)
                    }, (res) => {
                        if (res.code === 200) {
                            this.manageVisiable = null
                            _this.$message.success('分管部门成功！')
                        } else {
                            this.manageVisiable = null
                            _this.$message.success('请求失败！')
                        }
                    })
                } else {
                    this.manageVisiable = null
                }
            },
            /**
             * [handleManage 打开处理分管部门的弹窗]
             * @return {[type]} [description]
             */
            handleManage(rowInfo) {
                this.manageVisiable = rowInfo || {}
            },
            /**
             * [getDepartList 获取部门列表]
             * @return {[type]} [description]
             */
            getDepartList() {
                ajaxRequest('get', 'back/depart/list', {
                    isDelete: 0
                }, (val) => {
                    if (val.code === 200) {
                        this.departList = val.rows;
                        this.departList.forEach(val => {
                            this.tempDepartList[val.id] = val.departName
                        })
                    } else {
                        this.$message.error(val.message)
                    }
                })
            },
            /**
             * [handlePassWordReset 处理密码重置]
             * @return {[type]} [description]
             */
            handlePassWordReset(data) {
                if (data.length > 0) {
                    let ids = data.map(function (v) {
                        return v.id
                    }).join(",");
                    ajaxRequest('put', 'back/user/list/' + ids, {
                        password: '123456'
                    }, function (res) {
                        if (res.code === 200) {
                            this.$message.success('批量更改成功');
                            this.getTableList();
                        }
                        else {
                            this.$message.error('批量更改失败');
                        }
                    }.bind(this))
                } else {
                    this.$message({
                        message: '请先选择要重置的数据',
                        type: 'warning'
                    })
                }
            },
            /**
             * [handlePrent 标签打印]
             * @param  {[type]} row [description]
             * @return {[type]}     [description]
             */
            handlePrient(row, _this) {
                if (!this.multipleSelection.length) {
                    return;
                }
                let arr = this.multipleSelection
                var newstr = '';
                for (let i = 0; i < arr.length; i++) {
                    let MyComponent = Vue.extend({
                        template: `<vue-barcode style="display:none" id="id${arr[i].id}" value="${arr[i].id}" :displayValue="false" tag="canvas"></vue-barcode>`,
                        components: {
                            VueBarcode
                        }
                    })
                    new MyComponent().$mount('#id' + arr[i].id)
                    newstr += document.getElementById('id' + arr[i].id).innerHTML
                }
                sessionStorage.setItem('printHtml', newstr)
                // document.body.innerHTML = newstr
                // window.print()
                // 重新加载页面，以刷新数据
                // window.location.reload()
            },

            handleReset(data, _this) {
                let tempParams = {id: data[0].id}
                if (_this['_data'].flag1 || _this['_data'].flag2) {
                    if (_this['_data'].flag1) tempParams['password'] = this.password;
                    if (_this['_data'].flag2) tempParams['signNaturePassword'] = this.signNaturePassword;
                    ajaxRequest('put', 'back/user/updateUserSec', tempParams, res => {
                        if (res.code === 200) {
                            if (_this['_data'].flag1 && _this['_data'].flag2) {
                                this.$message.success('用户名密码和电子签名密码重置成功');
                                this.getTableList();
                                return
                            } else if (_this['_data'].flag1) {
                                this.$message.success('用户名密码重置成功');
                                this.getTableList();
                                return
                            } else {
                                this.$message.success('电子签名密码重置成功');
                                this.getTableList();
                                return
                            }
                        }
                        else {
                            _this.$message.error('密码重置失败');
                        }
                    });
                } else {
                    this.$message.error('请选择重置密码类型');
                    return true
                }
            },

            handleRefresh() {
                this.refrenceDialog = true
            },

            handleRefrenceDialog() {
                this.refrenceDialog = false
                this.getTableList();
            },
        },
        created() {
            this.getDepartList();
        },
        mounted() {
            this.getTableList();
            this.QJGetMounted()
        },
        components: {
            EditUser,
            Retrieve,
            sessionManage,
            TableColumnHeader,
            WorkMould,
            refreshUser
        },
    }
</script>

<style scoped>
    .shuoming {
        border: none !important;
        color: #56BC4E !important;
        font-size: 16px !important;
        cursor: pointer;
    }

    .shuoming::after {
        content: "";
        /*background: #fff;*/
        position: absolute;
        z-index: 999;
        /* top: 0; */
        /* left: -65px; */
        right: 10;

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
        margin-left: -230px;
        margin-right: 0px;
        word-break: break-all;
        margin-top: 5px;
        padding: 4px 5px;
        font-size: 14px;
        opacity: 50;
        float: right;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    .flex-one {
        flex: 1;
    }

    .flex {
        display: flex;
    }

    .custom-input-outer {
        margin-bottom: 20px;
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

    .user-action {
        padding: 6px 15px;
        font-size: 12px;
    }

    .el-table {
        margin-top: 0px !important;
    }

    .el-icon-setting {
        background: none !important;
        border: none !important;
        color: #3094e0 !important;
    }

    .el-icon-setting:hover {
        color: #3094e0 !important;
    }
</style>
