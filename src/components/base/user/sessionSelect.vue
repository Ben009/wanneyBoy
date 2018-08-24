<template>
    <mind-dialog
            :visible="true"
            title="岗位权限选择"
            dialogSize="mid"
            class="sessionSelectDialog"
            @close="handleCancel"
            center
            v-dialogDrag
            append-to-body>
        <div class="flex" style="display: flex">
            <div style="width:50%;margin-left:2px;">
                <div class="flex session-select mb10">
                    <label class="mb5 session-label justify-center">岗位-部门 :</label>
                    <el-select v-model="value" placeholder="请选择" size="small" @change="getPostList(value)"
                               style="width: 70%">
                        <el-option
                                v-for="item in departList"
                                :key="item.value"
                                :label="item.departName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="dialogBox session" :style="{height:dblDivHeight}">
                    <el-table :data="postList" ref="table" border stripe style="width: 100%; "
                              @selection-change="handleSelectionChange">
                        <el-table-column
                                type="selection"
                                width="40">
                        </el-table-column>
                        <el-table-column prop="postName" label="岗位名称" align="center" show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div style="width:50%;margin-left:2px;">
                <div class="mb10  session-label  justify-center">
                    <span>已选岗位</span>
                    <el-button @click="clear" type="warning">清空</el-button>
                </div>
                <div class="dialogBox detail" style="width: 100%;" :style="{height:dblDivHeight}">
                    <div>
                        <div v-for="(temp,index) in postSessionList" :key="index" class="flex justify-center mb10">
                            <div class="readyPost">{{temp.postName}}</div>
                            <el-button @click="deletePost(temp)" size="small" type="primary">移除</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
	      <el-button type="primary" @click="handleSubmit">保 存</el-button>
				<el-button @click="handleCancel">取 消</el-button>
	    </span>
    </mind-dialog>
</template>
<script type="text/javascript">
    import {ajaxRequest, formatArrayToTree} from '../../util/base';

    export default {
        name: 'session-select',
        props: {
            departList: {
                type: Array
            },
            callback: {
                type: Function
            },
            slug: {
                type: String
            },
            selectSession: {
                type: Array
            }
        },
        data() {
            return {
                value: '',
                postList: [],
                postSessionList: [],
                currentDepartId: '',
                dblDivHeight: "450px",
            }
        },
        methods: {
            handleCancel() {
                this.callback();
            },
            handleSubmit() {
                if (this.postSessionList.length) {
                    this.callback(this.postSessionList, this.slug);
                } else {
                    this.$message.error('请先选择岗位')
                    return
                }
            },
            handleSelectionChange(val) {
                if (this.postSessionList && this.postSessionList.length) {
                    let tempPostList = Object.assign([], this.postSessionList)
                    this.postSessionList.forEach((temp, index) => {
                        if (temp.departId == this.currentDepartId) {
                            let tempPostArray = val.find((value, inx, arr) => {
                                return value.id == temp.id
                            })
                            if (!tempPostArray) {
                                tempPostList = tempPostList.filter(val => {
                                    return val.id !== temp.id
                                })
                            }
                        }
                    })
                    this.postSessionList = Object.assign([], tempPostList)
                }
                let hash = {};
                val.forEach(val => {
                    this.postSessionList.push(val)
                })
                this.postSessionList = this.postSessionList.reduce(function (item, next) {
                    hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                    return item
                }, [])
            },
            /**
             * [getPostList 获取岗位列表]
             * @return {[type]} [description]
             */
            getPostList(id) {
                return new Promise(resolve => {
                    this.currentDepartId = id;
                    let tempArray = [];
                    ajaxRequest('get', "back/post/retrieve", {departId: id, isDelete: 0}, (val => {
                        if (val.code === 200) {
                            this.postList = val.rows
                            if (this.postSessionList && this.postSessionList.length) {
                                this.postList.forEach(temp => {
                                    this.postSessionList.forEach(val => {
                                        if (val.id == temp.id) {
                                            tempArray.push(temp)
                                        }
                                    })
                                })
                                this.$nextTick(() => {
                                    this.toggleSelection(tempArray)
                                })
                            }
                            resolve(this.postList)
                        } else {
                            this.$message.error(val.message)
                        }
                    }))
                })
            },
            deletePost(temp) {
                let tempDeleteArray = [];
                if (temp.departId == this.currentDepartId) {
                    this.postSessionList.forEach((val, index) => {
                        if (val.departId == this.currentDepartId) {
                            tempDeleteArray.push(val)
                        }
                    })
                    tempDeleteArray = tempDeleteArray.filter(val => {
                        return temp.id !== val.id
                    })
                    this.$nextTick(() => {
                        this.toggleSelection(tempDeleteArray)
                    })
                } else {
                    this.postSessionList = this.postSessionList.filter(val => {
                        return val.id !== temp.id
                    })
                }
            },
            toggleSelection(rows) {
                if (rows) {
                    this.$refs.table.clearSelection();
                    rows.forEach(row => {
                        this.$refs.table.toggleRowSelection(row, true);
                    });
                } else {
                    this.$refs.table.clearSelection();
                }
            },
            initSession() {
                this.postSessionList = [];
                this.postSessionList = Object.assign([], this.selectSession)
                if (this.postSessionList && this.postSessionList.length) {
                    this.value = this.postSessionList[0].departId * 1
                    this.getPostList(this.postSessionList[0].departId)
                }
            },
            clear() {
                this.postSessionList = [];
                this.$refs.table.clearSelection();
            }
        },
        mounted() {
            this.initSession()
        },
    }
</script>
<style type="text/css" lang="scss" scoped>
    .sessionSelectDialog {

    @each $b in 10 {
        .mb #{$b} {
            margin-bottom: #{$b} px
        }
    }
    .flex {
        display: flex;
    }

    .justify-center {
        justify-content: center;
    }

    .dialogBox {
        border: 1px solid #ccc;
        min-height: 250px;
        max-height: 470px;
        overflow: auto;
        text-align: center;
        padding: 10px;
        margin-right: 10px;
        font-size: 12px;

    .title {
        font-size: 14px;
    }

    }
    .el-select {
        width: 90px;
    }

    .session-select {

    .el-select {
        width: 120px;
    }

    }
    .session-label {
        line-height: 30px;
    }

    .permissions-check {
        margin-left: 30px;
        margin-bottom: 5px;
        text-align: left;
    }

    .session-check {
        margin-left: 20px;
        margin-bottom: 5px;
        text-align: left;
    }

    .el-button {
        padding: 5px 15px;
        margin-left: 10px;
    }

    .readyPost {
        width: 100px;
    }

    }
</style>
