<template>
    <mind-dialog
            :visible="true"
            title="角色列表"
            dialogSize="mid"
            ref="mindDia"
            class="roleListDialog"
            center
            v-dialogDrag
            @close="handleCancel"
            append-to-body>
        <div>

            <!-- TODO 案例 树公共组件 标签部分-->
            <!-- <mind-tree :data="treeData" :rightMenuConfig="rightMenuConfig" :leftClickCallBack="handleLeftClick"></mind-tree> -->
            <div>
                <el-table ref="table" :data="roleList"
                          border
                          style="width: 100%;"
                          :height="diaTableHeight"
                          :max-height="QJTableMaxHeight"
                          @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="40">
                    </el-table-column>
                    <el-table-column
                            prop="roleName"
                            label="角色名称">
                    </el-table-column>
                    <el-table-column
                            prop="roleDesc"
                            label="角色描述">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 		<div style="margin-top:20px;text-align:center;">
              <el-pagination
                :current-page="page"
                :page-size="rows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handlePageSizeChange"
                @current-change="handleCurrentPageChange">
              </el-pagination>
            </div> -->
        <span slot="footer" class="dialog-footer">
	      <el-button type="primary" @click="handleSubmit">保 存</el-button>
			<el-button size="small" type="warning" icon="el-icon-warning" @click="refresh">清 空</el-button>
				<el-button @click="handleCancel">取 消</el-button>
	    </span>
    </mind-dialog>
</template>
<script type="text/javascript">
    import Vue from 'vue';
    import {ajaxRequest, formatArrayToTree, ajaxProxyRequest} from '../../util/base';

    export default {

        name: 'role-list',
        props: {
            selectRole: {
                type: String
            },
            roleList: {
                type: Array
            },
            callback: {
                type: Function
            }
        },
        data() {
            return {
                page: 1,
                rows: 10,
                total: 0,
                multipleSelection: [],
                tableData: [],
                multipleSelection: [],
                /**
                 * TODO 案例 树公共组件 <mind-tree> 标签关联参数  代码部分
                 */
                rightMenuConfig: [{
                    name: 'test1', // 右击菜单名称
                    // 右击事件回调
                    // 回调支持的参数：
                    // 1.obj   [点击节点的参数]
                    // 2.node  [节点对应的 Node]
                    // 3.ele   [节点组件本身]
                    callback: this.handleRightClick
                }],
                treeData: [] // 树加载的临时变量
            }
        },
        computed: {
            diaTableHeight() {
                return this.$store.state.dialogView.mid.height - 40 + "px";
            }
        },
        methods: {
            refresh() {
                this.$refs.table.clearSelection();
            },
            handleCancel() {
                this.callback();
            },
            handleSubmit() {
                if (this.multipleSelection && this.multipleSelection.length) {
                    this.callback(this.multipleSelection);
                } else {
                    this.$message.error('请先选择角色！')
                }
            },
            /**
             * [handleSelectionChange 复选框勾选]
             * @param  {[type]} val [description]
             * @return {[type]}     [description]
             */
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSelect() {
                let tempSelect = []
                console.log(this.selectRole)
                if (this.selectRole) {
                    this.selectRole.split(",").forEach(val => {
                        this.roleList.forEach((temp, key) => {
                            if (val == temp.id) {
                                console.log(this.roleList[key])
                                tempSelect.push(this.roleList[key])
                            }
                        })
                    })
                }
                this.toggleSelection(tempSelect)
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        console.log(this.$refs.table)
                        this.$refs.table.toggleRowSelection(row, true);
                    });
                } else {
                    this.$refs.table.clearSelection();
                }
            },
            /**
             * TODO 案例 树公共组件 代码部分获取树数据
             * [getTreeDate 接口返回的树的数据集]
             * @return {[type]} [description]
             *    字典资源  '/njmind/findParam/{ code:'字典编码' }',
             */
            //  getTreeDate(){
            // ajaxProxyRequest('get','/njmind/findParam/roleMenu',{	},
            // 	(res) => {
            //  		this.treeData=res.list;
            //  	})
            //  },
            /**
             * TODO 案例 树公共组件 代码部分左击事件
             * [handleRightClick 左击事件的回调示例]
             * @return {[type]} [description]
             */
            // handleRightClick(obj,node,ele){
            // 	console.log(obj,node,ele)
            // },
            /**
             * TODO 案例 树公共组件 代码部分右击事件
             * [handleRightClick 右击事件的回调示例]
             * @return {[type]} [description]
             */
            // handleLeftClick(obj,node,ele){
            // 	console.log(obj,node,ele)
            // }
        },
        mounted() {
            this.$nextTick(() => {
                this.handleSelect();
            })
            // this.getTreeDate()
        }
    }
</script>
<style type="text/css" scoped>
    .el-dialog__body {
        overflow-y: hidden !important;
    }

    .el-table {
        height: 60vh !important;
    }
</style>
