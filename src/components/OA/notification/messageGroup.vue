<template>
    <div>
        <el-row style="text-align:left;margin-bottom:20px;">
            <!-- <span style="color:#606266;">添加用户分组:</span>
            <el-input style="width:30vw;" v-model.trim="groupName"></el-input>
            <el-button type="primary" @click="add">保存</el-button> -->
            <el-button type="primary" @click="addNew"> <i class="el-icon-plus"></i> 新增用户分组</el-button>
            <div  class="el-tab_head"  style="position:absolute;top:0;right:0px;">
                <span class="span" style="color:#606266;">用户分组: </span>
                <el-input placeholder="请输入用户分组" class="custom-input"  style="width:200px;" v-model="searchKey"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" style="position:relative;top:-1px">查询</el-button>
                <global-tootips>
                    <p>1、用户分组提供将人员分组的功能，如：中层管理人员、党支一部等；</p>
                    <p>2、用户分组适用于通知公告、短信平台、公文收发等模块；</p>
                </global-tootips>
                <!-- <el-button type="warning" icon="el-icon-info" @click="clearInput = true;handleSearch()">清空</el-button> -->
            </div>
        </el-row>
        <div>
                <el-table :data="tableData"
                border
                style="width: 100%;min-height:39vh;"
                :max-height="QJTableMaxHeight"
                >
                    <el-table-column label="序号"　type="index" width="50"></el-table-column>
                    <!-- <el-table-column label="组ID" prop="id"  ></el-table-column> -->
                    <el-table-column label="组名"  prop="groupName"></el-table-column>
                    <el-table-column label="添加人"  prop="addUserName"></el-table-column>
                    <el-table-column label="添加时间"  :formatter="timeFormat" prop="addTime"></el-table-column>
                    <el-table-column label="备注"   prop="remark"></el-table-column>
                    <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                             <el-button type="text"  title="编辑" class="button" @click="editing(scope.row)">
                                <i class="el-icon-edit"></i>
                            </el-button>
                             <el-button type="text"  title="管理" class="button" @click="managing(scope.row)">
                                <i class="el-icon-setting"></i>
                            </el-button>
                            <el-button type="text"  class="button"title="删除"
                                v-mindPopover="{message:'确定删除?',success:deleteGroup.bind(this,scope.row)}"
                                >
                                <i class="el-icon-delete"></i>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
        </div>
        <div style="margin-top:10px;text-align:center;float:right;">
            <mind-pagination
                :current-page="page"
                :page-size="rows"
                :total="total"
                @size-change="handlePageSizeChange"
                @current-change="handleCurrentPageChange">
            </mind-pagination>
        </div>
        <message-group-edit v-if="groupId || isAdd" @back="cancelAdd"></message-group-edit>
        <message-group-member v-if="memberManage"></message-group-member>
    </div>
</template>
<script>
import Vuex from 'vuex'
import {ajaxRequest} from '../../util/base';
import messageGroupEdit from './messageGroupEdit'
import messageGroupMember from './messageGroupMember'
export default {
    // 待优化：gettablelist中的参数设置一个默认值，不传参的时候使用默认值，传参则使用传入的参数
    // vuex中对state中的值进行默认赋值，即传入的值原封不动传入，不做匹配
    // 在编辑/新增页面中传入的值最好是一个对象形式，以便后面的扩展，同时也有利于赋值，并做规则校验
    name:'message-group',
    data(){
        return {
            groupName:'',
            page:1,
            rows:10,
            total:0,
            tableData:[],
            // 查询字段
            searchKey:'',
            //是否新增
            isAdd:false,
        }
    },
    mounted(){
        this.getGroupTableList({
                isDelete:0,
                page:this.page,
                rows:this.rows,
                total:0})
    },
    components:{
        messageGroupEdit,
        messageGroupMember
    },
    watch:{
        groupId(n,old){
            console.log('改变了')
            if(n == null){
                this.getGroupTableList({
                isDelete:0,
                page:this.page,
                rows:this.rows,
                total:0});
            }
        }
    },
    computed:{
        groupId(){
            return this.$store.state.Notification.messageGroup.groupId;
        },
        memberManage(){
            return this.$store.state.Notification.messageMember.groupId;
        }
    },
    methods:{
        getGroupTableList(param){
            console.log(param)
            ajaxRequest('get','back/group/retrieve',param,res=>{
                    this.tableData = res.rows;
                    this.total = res.total;
            })
        },
        handlePageSizeChange(size){
            this.page = 1;
            this.rows = size;
            this.getGroupTableList({
                isDelete:0,
                page:this.page,
                rows:this.rows,
                total:0});
        },
        handleCurrentPageChange(currentPage){
            this.page = currentPage;
            this.getGroupTableList({
                isDelete:0,
                page:this.page,
                rows:this.rows,
                total:0});
        },
        editing(data){
            console.log(data)
            this.$store.commit('SET_MESSAGE',{groupId:data.id,groupName:data.groupName,remark:data.remark});
        },
        managing(data){
            this.$store.commit('SET_MEMBER',data.id);
        },
        add(){
            if(!this.groupName){
                this.$message.error('用户分组名称不能为空！')
                return ;
            }
            if(this.groupName && this.groupName.length < 20){
                this.$store.dispatch('judge_groupName_distinct',{groupName:this.groupName}).then(res=>{
                    if(res.msg == '0'){
                        ajaxRequest('post','back/group/',{groupName:this.groupName},res=>{
                            if(res.code===200){
                                this.$message.success('添加成功！')
                                this.getGroupTableList();
                                this.groupName = ''
                            }
                        })
                    }else{
                        this.$message.error('用户分组名称重复!')
                    }
                })
            }else{
                this.$message.error('用户分组名称最多输入20个字符')
            }
        },
        deleteGroup(data){
            console.log(data)
            ajaxRequest('put','back/group/',{id:data.id,isDelete:1},res=>{
                if(res.code === 200){
                    this.$message.success('删除成功！')
                    this.getGroupTableList({
                isDelete:0,
                page:this.page,
                rows:this.rows,
                total:0});
                }
            })
        },
        timeFormat(row, column, cellValue, index){
            if(cellValue){
                return new Date(cellValue).format('YYYY-MM-DD hh:mm:ss')
            }else{
                return null;
            }
        },
        addNew(){
            this.isAdd = true;
        },
        cancelAdd(){
            this.isAdd = false;
            this.getGroupTableList({
                isDelete:0,
                page:this.page,
                rows:this.rows,
                total:0})
        },
        handleSearch(){
            this.getGroupTableList({
                isDelete:0,
                page:this.page,
                rows:this.rows,
                total:0,
                groupName:this.searchKey,
                })
        }
    }
}
</script>
<style scoped>
.button{
  padding:0;
  font-size:18px;
}
</style>

