<template>

    <div style="position:relative;">
        <div>
            <div class="el-tab_head" style="position:relative">
                <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit(null)">新增角色
                </el-button>
                <el-button size="small" type="primary" icon="el-icon-export" @click="exportRoleUser(true)">导出角色-人员
                </el-button>
                <el-button size="small" type="primary" icon="el-icon-export" @click="isShow = true">导出角色-权限
                </el-button>
                <!-- <el-tooltip style="float:right;" effect="light">
                  <i class="el-icon-info" style="fontSize:16px;color:#67C23A;"></i>
                  <div slot="content" class="customStyle" style="fontSize:14px;lineHeight:1.2em;">
                    <p>1：添加具有某种权限的角色</p>
                    <p>2：对用户进行角色权限的分配或者权限的管理</p>
                  </div>
                </el-tooltip> -->
                <div class="el-icon-info shuoming">
                    <el-row class="el-sm">
                        <p style="height: 35px;line-height: 35px;border-bottom: 1px solid #ccc;text-align: center;color:#000;font-weight:700;">
                            事项说明</p>
                        <dl style="padding:6px 10px; ">
                            <p>1、本页面提供新建角色、复制角色、对角色关联用户、对角色分配权限等功能；</p>
                            <p>2、复制角色时，仅复制角色对应的权限，不复制关联人员；</p>
                        </dl>
                        </p>
                    </el-row>
                </div>
            </div>

            <div>
                <el-table :data="tableData" border stripe style="width: 100%" :max-height="QJTableMaxHeight"
                          @selection-change="handleSelectionChange">
                    <el-table-column type="index" label="序号" align="center" width="50">
                    </el-table-column>
                    <!-- <el-table-column label="ID" prop="id" align="center" width="100">
                    </el-table-column> -->
                    <el-table-column prop="roleName" label="角色名称" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="roleDesc" label="角色描述" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后修改时间" align="center"
                                     :formatter="function(row, column, cellValue, index){return  new Date(cellValue).format('YYYY-MM-DD hh:mm:ss')}"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="addUserName" label="添加人" align="center">
                    </el-table-column>
                    <el-table-column label="操作" :max-width="'200px'" align="center">
                        <template slot-scope="scope">
                            <el-button @click="handleEdit(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                                    class="el-icon-edit-outline" title="编辑"></i></el-button>
                            <el-button @click="handleCopy(scope.row)" type="text" style="padding:0;font-size:18px;"><i
                                    class="el-icon-document" title="复制"></i></el-button>
                            <el-button v-mindPopover="{message:'是否删除?',success:handleDelete.bind(this,[scope.row])}"
                                       type="text" style="padding:0;font-size:18px;"><i
                                    class="el-icon-delete" title="删除"></i></el-button>
                            <el-button @click="handleSetUser(scope.row)" type="text" style="padding:0;font-size:18px;">
                                <i class="el-icon-circle-plus" title="用户设置"></i></el-button>
                            <el-button @click="handleSetAuthority(scope.row)" type="text"
                                       style="padding:0;font-size:18px;"><i class="el-icon-setting" title="权限设置"></i>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="margin-top:10px;text-align:center; float:right;">
                <mind-pagination
                        :current-page="page"
                        :page-size="rows"
                        :total="total"
                        @size-change="handlePageSizeChange"
                        @current-change="handleCurrentPageChange">
                </mind-pagination>
            </div>
            <mind-dialog title="导出角色-权限" :visible="isShow" v-dialogDrag center dialogSize="mini">
                <el-form label-width="80px" center>
                    <el-form-item label="角色名称">
                        <el-input v-model="choose.roleName" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="角色ID">
                        <el-input v-model="choose.roleId" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button type="primary" @click="exportRoleResource(true)">导出所有角色权限</el-button>
                    <el-button type="primary" @click="exportRoleResource(false)">导出本角色</el-button>
                    <el-button @click="isShow=false">取消</el-button>
                </div>
            </mind-dialog>
            <role-edit v-if="!!edit" :roleInfo="edit" :callback="handleEditCallback" :title="title"
                       :buttonName="buttonName"></role-edit>
            <user-role v-if="!!setUser" :roleId="setUser.id" :roleName="setUser.roleName" :departNameObj="departNameObj"
                       :callback="handleSetUserCallback"></user-role>
            <resouce-role v-if="!!setAuthority" :resourceList="resourceList" :roleId="setAuthority.id"
                          :callback="handleSetAuthorityCallback"></resouce-role>
        </div>

    </div>

</template>

<script>
    import {ajaxRequest} from '../../util/base'
    import RoleEdit from './RoleEdit'
    import UserRole from './UserRole';
    import ResouceRole from './ResouceRole';
    import $ from 'jquery'

    /*   import { Button,  Table, TableColumn } from 'element--ui'
      Vue.use(Button)
      Vue.use(Table)
      Vue.use(TableColumn) */

    let btnPower = window.localStorage.getItem("btnPower");//获取用户所有权限
    export default {
        name: 'role-table',
        components: {RoleEdit, UserRole, ResouceRole},
        data() {
            return {
                page: 1,
                repeatData: '',
                rows: 10,
                total: 0,
                searchKey: '',
                tableData: [],
                multipleSelection: [],
                edit: null,
                setUser: null,
                departNameObj: null,
                setAuthority: null,
                resourceList: [],
                title: '',
                buttonName: '',
                opCode: 'roleManager',
                ckbox: false,
                choose: {
                    roleName: '',
                    roleId: '',
                },
                isShow: false
            }
        },
        methods: {
            getRoleList: function () {
                ajaxRequest('get', 'back/role/retrieve', {
                    page: this.page,
                    rows: this.rows,
                    isDelete: 0,
                    total: 0
                }, function (res) {
                    if (res.code === 200) {
                        this.tableData = res.rows;
                        this.total = res.total;
                        this.multipleSelection = [];
                    }
                }.bind(this))
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handlePageSizeChange(size) {
                this.page = 1;
                this.rows = size;
                this.getRoleList();
            },
            handleCurrentPageChange(currentPage) {
                this.page = currentPage;
                this.getRoleList();
            },
            handleEdit(roleInfo) {
                this.edit = roleInfo || {};
                this.title = '编辑';
                this.buttonName = '保存';

            },
            handleCopy(roleInfo) {
                this.edit = roleInfo || {};
                this.title = '复制';
                this.buttonName = '另存为';
            },
            searchRepeat(roleInfo) {
                let that = this;
                this.repeatData = new Promise((resolve, reject) => {
                    ajaxRequest('get', 'back/role/retrieve', {
                        roleName: roleInfo.roleName,
                        isDelete: 0,
                        fuzzySearch: 0
                    }, (res) => {
                        if (res.code === 200) {
                            resolve(res)
                        } else {
                            reject(res)
                        }
                    })
                })
            },
            handleEditCallback(roleInfo, title) {
                let _this = this
                if (roleInfo) {
                    if (roleInfo.id) {
                        if ('复制' == title) {
                            this.searchRepeat({roleName: roleInfo.roleName, roleId: null})
                            this.repeatData.then((res) => {
                                if (!res.rows.length) {
                                    ajaxRequest('post', 'back/role/copyRole', {
                                        roleId: roleInfo.id,
                                        roleName: roleInfo.roleName,
                                        roleDesc: roleInfo.roleDesc,
                                        isDelete: 0
                                    }, (data) => {
                                        if (data.code === 200) {
                                            this.$message.success('复制成功')
                                            this.edit = null
                                            this.getRoleList();
                                        }
                                    })
                                } else {
                                    this.$message.error('角色名称冲突！')
                                }
                            })

                        } else {
                            this.searchRepeat(roleInfo);
                            this.repeatData.then((res) => {
                                console.log(roleInfo, '提交数据')
                                if (!res.rows.length || res.rows.length == 1) {
                                    if (!!res.rows.length) {
                                        if (res.rows[0].id == roleInfo.id) {
                                            ajaxRequest('put', 'back/role/', {
                                                id: roleInfo.id,
                                                roleName: roleInfo.roleName,
                                                roleDesc: roleInfo.roleDesc,
                                                isDelete: 0,
                                                updateUser: roleInfo.updateUser
                                            }, function (res) {
                                                if (res.code === 200) {
                                                    _this.$message.success('编辑成功')
                                                    _this.edit = null
                                                    _this.getRoleList();
                                                }
                                                else {
                                                    _this.$message.error('编辑失败')
                                                }
                                            })
                                        } else {
                                            this.$message.error('角色名称冲突，请重试！')
                                        }
                                    } else {
                                        ajaxRequest('put', 'back/role/', {
                                            id: roleInfo.id,
                                            roleName: roleInfo.roleName,
                                            roleDesc: roleInfo.roleDesc,
                                            isDelete: 0,
                                            updateUser: roleInfo.updateUser,
                                        }, function (res) {
                                            if (res.code === 200) {
                                                _this.$message.success('编辑成功')
                                                _this.edit = null
                                                _this.getRoleList();
                                            }
                                            else {
                                                _this.$message.error('编辑失败')
                                            }
                                        })
                                    }
                                } else {
                                    this.$message.error('角色名称冲突，请重试！')
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                        }
                    }
                    else {
                        this.searchRepeat({roleId: '', roleName: roleInfo.roleName})
                        this.repeatData.then((res) => {
                            if (res.rows == 0) {
                                ajaxRequest('post', 'back/role/', {
                                    roleName: roleInfo.roleName,
                                    roleDesc: roleInfo.roleDesc,
                                    addUser: roleInfo.addUser
                                }, function (res) {
                                    if (res.code === 200) {
                                        _this.$message.success('新增成功')
                                        _this.edit = null
                                        _this.getRoleList();
                                    }
                                    else {
                                        _this.$message.error('新增失败')
                                    }
                                })
                            } else {
                                this.$message.error('角色名称冲突,请重试！')
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                    }
                }
                else {
                    this.edit = null
                }
            },
            handleDelete(data) {
                new Promise((resolve, reject) => {
                    ajaxRequest('get', 'back/role/judgeRoleUser', {roleId: data[0].id}, res => {
                        if (res.code === 200) {
                            resolve(res)
                        }
                    })
                }).then(res => {
                    if (res.msg == 0) {
                        ajaxRequest(
                            "put",
                            "back/role/",
                            {
                                isDelete: 1,
                                id: data[0].id,
                                roleName: data[0].roleName
                            },
                            res => {
                                if (res.code === 200) {
                                    this.$message.success("删除成功");
                                    this.getRoleList();
                                } else {
                                    this.$message.error("删除失败");
                                }
                            });
                    } else {
                        this.$message.error('请先清除该角色下的人员！')
                    }
                })
            },
            getDepartList() {
                this.departNameObj = {};
                let _this = this;
                ajaxRequest('get', 'back/depart/list', {
                    isDelete: 0,
                }, function (data) {
                    if (data.code === 200) {
                        for (var i = 0; i < data.rows.length; i++) {
                            _this.departNameObj[data.rows[i].id] = data.rows[i].departName;
                        }
                    }
                }.bind(this))
            },
            handleSetUser(roleInfo) {
                this.setUser = roleInfo;
            },
            handleSetUserCallback(userLimitData, roleId) {
                if (userLimitData == "[]") {
                    userLimitData = "";
                }
                if (null != userLimitData) {
                    ajaxRequest('post', 'back/userRole/insertBatch', {
                        sc: userLimitData,
                        roleId: roleId
                    }, function (res) {
                        if (res.code === 200) {
                            this.$message.success('操作成功');
                            this.getRoleList();
                        }
                        this.setUser = null;
                    }.bind(this))
                } else {
                    this.setUser = null;
                }
            },
            handleSetAuthority(roleInfo) {
                this.setAuthority = roleInfo;
            },
            handleSetAuthorityCallback(checked, roleId) {
                if (!!checked) {
                    ajaxRequest('post', 'back/roleModule/insertBatch', {
                        moduleRole: JSON.stringify(checked),
                        roleId: roleId
                    }, (data) => {
                        if (data.code == '200') {
                            this.$message.success('操作成功');
                        } else {
                            this.$message.error(data)
                        }
                        this.setAuthority = null;
                        this.getRoleList();
                    })
                }
                else {
                    this.setAuthority = null;
                }
            },
            exportRoleUser(con) {
                let url = "/njmind/expExl/roleManager";
                let form = $("<form></form>").attr("action", url).attr("method", "post");
                form.appendTo('body').submit().remove();
            },
            exportRoleResource(con) {
                let url = '';
                if (con) {
                    url = "/njmind/expExl/roleAuthority?orderProperty=roleId&orderType=desc";
                } else {
                    url = "/njmind/expExl/roleAuthority?roleId=" + this.choose.roleId
                }
                let form = $("<form></form>").attr("action", url).attr("method", "post");
                console.log(form)
                form.appendTo('body').submit().remove();
                this.isShow = false;
            },

        },
        mounted() {
            this.getRoleList();
            this.getDepartList();
            ajaxRequest('get', 'back/role/roleUser/' + window.localStorage.userId, null, (res) => {
                let ids = "";
                let names = "";
                for (let i = 0; i < res.rows.length; i++) {
                    if ((i + 1) == res) {
                        ids = ids + res.rows[i].roleId;
                        names = names + res.rows[i].roleName;
                    } else {
                        ids = ids + res.rows[i].roleId + ",";
                        names = names + res.rows[i].roleName + ",";
                    }
                }
                this.choose.roleId = ids;
                this.choose.roleName = names;
            })
        }
    }
</script>
<style scoped>
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

    /****** 说明样式start ******/
    .el-sm {
        background: #ffffff;
        position: absolute !important;
        z-index: 999;
        -webkit-box-shadow: 1px 7px 33px -9px #969696;
        box-shadow: 1px 7px 33px -9px #969696;
        border: 1px solid #56bc4e8c !important;
        border-radius: 5px;
        color: dimgrey !important;
        margin-left: -285px;
        word-break: break-all;
        margin-top: 18px;
        padding: 4px 5px;
        font-size: 14px;
        opacity: 50;
        float: right;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    .shuoming {
        border: none !important;
        color: #56BC4E !important;
        font-size: 16px !important;
        position: absolute;
        right: 25px;
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

    .shuoming .el-sm {
        display: none;
        -webkit-transition: all 0.8s;
        transition: all 0.8s;
    }

    /******说明样式end*******/
</style>
